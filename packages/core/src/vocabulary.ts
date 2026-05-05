import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  VOCABULARY_NAMES,
  type Vocabulary,
  type VocabularyName,
  type RenderError,
} from "./types.ts";

const VocabularySchema = z.object({
  name: z.enum(VOCABULARY_NAMES),
  default_mood: z.string().min(1),
  colors: z.object({
    bg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    fg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    dim: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent_primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent_secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent_tertiary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  typography: z.object({
    display: z.object({ family: z.string(), weight: z.number(), tracking: z.number().optional() }),
    body: z.object({ family: z.string(), weight: z.number(), tracking: z.number().optional() }),
    mono: z.object({ family: z.string(), weight: z.number(), tracking: z.number().optional() }),
    scale: z.number().positive(),
  }),
  motion: z.object({
    spring_default: z.object({
      damping: z.number().positive(),
      stiffness: z.number().positive(),
    }),
    duration_default_ms: z.number().positive(),
    easing_curve: z.string(),
  }),
});

export class RiffcastError extends Error {
  readonly phase: RenderError["phase"];
  readonly code: string;
  constructor(phase: RenderError["phase"], code: string, message: string) {
    super(message);
    this.phase = phase;
    this.code = code;
    this.name = "RiffcastError";
  }
}

export type LoadVocabularyOptions = {
  vocabulariesDir?: string;
};

export async function findVocabularyFile(
  name: VocabularyName,
  vocabulariesDir: string,
): Promise<string | null> {
  let entries: string[];
  try {
    entries = await readdir(vocabulariesDir);
  } catch {
    return null;
  }
  const match = entries.find((entry) => /^\d{2}-/.test(entry) && entry.endsWith(`-${name}.md`));
  return match ? join(vocabulariesDir, match) : null;
}

export async function loadVocabulary(
  name: VocabularyName,
  opts: LoadVocabularyOptions = {},
): Promise<Vocabulary> {
  const vocabulariesDir =
    opts.vocabulariesDir ??
    resolve(process.cwd(), "packages/skill/references/design-vocabularies");

  const path = await findVocabularyFile(name, vocabulariesDir);
  if (!path) {
    throw new RiffcastError(
      "vocabulary",
      "NOT_FOUND",
      `vocabulary "${name}" not found under ${vocabulariesDir} (looked for files matching /^\\d{2}-${name}\\.md$/)`,
    );
  }

  let raw: string;
  try {
    raw = await readFile(path, "utf-8");
  } catch (err) {
    throw new RiffcastError(
      "vocabulary",
      "READ_FAILED",
      `failed to read vocabulary at ${path}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const parsed = matter(raw);
  const result = VocabularySchema.safeParse(parsed.data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new RiffcastError(
      "vocabulary",
      "INVALID_TOKEN_BLOCK",
      `vocabulary "${name}" at ${path} has invalid tokens: ${issues}`,
    );
  }

  return { ...result.data, raw_markdown: raw };
}
