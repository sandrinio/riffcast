import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { loadVocabulary, parseBrief, VOCABULARY_NAMES } from "@riffcast/core";
import { errorResult, msg, okResult } from "./_shared.ts";

export const proposeDirectionsToolName = "riffcast_propose_directions";
export const proposeDirectionsToolDescription =
  "Given a brief, return N candidate directions (vocabulary + mood + motion summary) for the host agent to pitch the user. v0.1 is deterministic — no LLM. Call when tone='let-me-see-options' or the brief is vague.";

export const proposeDirectionsInputShape = {
  briefPath: z.string().describe("Absolute or cwd-relative path to brief.md"),
  count: z.number().int().min(1).max(3).optional().describe("Number of directions (1–3, default 3)"),
  cwd: z.string().optional().describe("Working directory for path resolution"),
  vocabulariesDir: z.string().optional().describe("Override path to design-vocabularies/ directory"),
};

type Args = { briefPath: string; count?: number; cwd?: string; vocabulariesDir?: string };

const REAL_VOCABULARIES = VOCABULARY_NAMES.filter((n) => n !== "let-me-see-options");

export async function proposeDirectionsHandler(args: Args) {
  const cwd = args.cwd ?? process.cwd();
  const briefAbs = isAbsolute(args.briefPath) ? args.briefPath : resolve(cwd, args.briefPath);

  let raw: string;
  try {
    raw = await readFile(briefAbs, "utf-8");
  } catch (err) {
    return errorResult(`failed to read briefPath: ${msg(err)}`);
  }

  const parsed = parseBrief(raw);
  if (!parsed.ok) {
    return errorResult(
      `brief invalid: ${parsed.errors.map((e) => `${e.field}: ${e.reason}`).join("; ")}`,
    );
  }

  const count = args.count ?? 3;
  const vocabulariesDir = args.vocabulariesDir ?? resolveDefaultVocabRoot();

  const directions: Array<{
    vocabulary: string;
    default_mood: string;
    motion_summary: string;
    rationale: string;
  }> = [];
  for (const name of REAL_VOCABULARIES.slice(0, count)) {
    try {
      const v = await loadVocabulary(name, { vocabulariesDir });
      directions.push({
        vocabulary: v.name,
        default_mood: v.default_mood,
        motion_summary: `spring(damping=${v.motion.spring_default.damping}, stiffness=${v.motion.spring_default.stiffness}); duration=${v.motion.duration_default_ms}ms; easing=${v.motion.easing_curve}`,
        rationale: `${v.name} — ${v.default_mood}. Pairs with: "${parsed.brief.message.slice(0, 80)}".`,
      });
    } catch (err) {
      return errorResult(`failed to load vocabulary "${name}": ${msg(err)}`);
    }
  }

  const text = [
    `Brief: ${parsed.brief.frontmatter.brief_id}`,
    `Message: ${parsed.brief.message}`,
    `Directions (${directions.length}):`,
    ...directions.map(
      (d, i) =>
        `\n  ${i + 1}. ${d.vocabulary}\n     mood: ${d.default_mood}\n     motion: ${d.motion_summary}\n     why: ${d.rationale}`,
    ),
  ].join("\n");

  return okResult(text);
}

function resolveDefaultVocabRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "../../../skill/references/design-vocabularies");
}
