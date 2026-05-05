import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { z } from "zod";
import { parseReview, verdict } from "@riffcast/core";
import { errorResult, msg } from "./_shared.ts";

export const reviewToolName = "riffcast_review";
export const reviewToolDescription =
  "Parse a 5-dimension review.md sidecar (next to the artifact) and return the structured Review with verdict (ship/iterate). The host agent must have written review.md first using @riffcast/skill/references/review-rubric.md — core never calls an LLM.";

export const reviewInputShape = {
  artifactPath: z.string().describe("Absolute or cwd-relative path to the rendered artifact"),
  briefPath: z.string().describe("Absolute or cwd-relative path to the brief.md"),
  reviewPath: z.string().optional().describe("Optional path to review.md; defaults to <dir(artifact)>/review.md"),
  cwd: z.string().optional().describe("Working directory for path resolution"),
  strict: z.boolean().optional().describe("If true, verdict threshold is min=4; default min=3"),
};

type ReviewArgs = {
  artifactPath: string;
  briefPath: string;
  reviewPath?: string;
  cwd?: string;
  strict?: boolean;
};

export async function reviewHandler(args: ReviewArgs) {
  const cwd = args.cwd ?? process.cwd();
  const artifactAbs = isAbsolute(args.artifactPath) ? args.artifactPath : resolve(cwd, args.artifactPath);
  const reviewAbs = args.reviewPath
    ? isAbsolute(args.reviewPath) ? args.reviewPath : resolve(cwd, args.reviewPath)
    : join(dirname(artifactAbs), "review.md");

  let raw: string;
  try {
    raw = await readFile(reviewAbs, "utf-8");
  } catch (err) {
    return errorResult(
      `review.md not found at ${reviewAbs}. Author the review using the rubric (@riffcast/skill/references/review-rubric.md) before calling this tool. Underlying: ${msg(err)}`,
    );
  }

  const parsed = parseReview(raw);
  if (!parsed.ok) {
    return errorResult(
      `review parse failed: ${parsed.errors.map((e) => `${e.field}: ${e.reason}`).join("; ")}`,
    );
  }

  const v = verdict(parsed.review, args.strict ? { min: 4 } : { min: 3 });
  const summary = parsed.review.scores
    .map((s) => `  - ${s.dimension}: ${s.score} — ${s.suggestion}`)
    .join("\n");
  const text = [
    `Review for ${parsed.review.artifact_path}`,
    `Reviewed at: ${parsed.review.reviewed_at}`,
    `Verdict: ${v}${args.strict ? " (strict, min=4)" : " (lenient, min=3)"}`,
    "Scores:",
    summary,
  ].join("\n");

  return { content: [{ type: "text" as const, text }] };
}
