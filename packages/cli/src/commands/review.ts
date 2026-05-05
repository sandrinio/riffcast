import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { parseReview, verdict } from "@riffcast/core";
import type { ParsedArgs } from "../parser.ts";

export async function reviewCommand(args: ParsedArgs): Promise<number> {
  if (args.positional.length < 2) {
    process.stderr.write("riffcast review: usage: riffcast review <artifactPath> <briefPath>\n");
    return 1;
  }
  const [artifactArg, _briefArg] = args.positional;
  const cwdFlag = args.flags.cwd;
  const cwd = typeof cwdFlag === "string" ? cwdFlag : process.cwd();
  const artifactAbs = isAbsolute(artifactArg) ? artifactArg : resolve(cwd, artifactArg);

  const reviewFlag = args.flags.review;
  const reviewAbs =
    typeof reviewFlag === "string"
      ? isAbsolute(reviewFlag)
        ? reviewFlag
        : resolve(cwd, reviewFlag)
      : join(dirname(artifactAbs), "review.md");

  let raw: string;
  try {
    raw = await readFile(reviewAbs, "utf-8");
  } catch (err) {
    process.stderr.write(
      `riffcast review: review.md not found at ${reviewAbs}.\nThe host agent must author the review using @riffcast/skill/references/review-rubric.md before running this command.\nUnderlying: ${msg(err)}\n`,
    );
    return 2;
  }

  const parsed = parseReview(raw);
  if (!parsed.ok) {
    process.stderr.write(
      `riffcast review: parse failed:\n  ${parsed.errors.map((e) => `${e.field}: ${e.reason}`).join("\n  ")}\n`,
    );
    return 1;
  }

  const strict = args.flags.strict === true;
  const v = verdict(parsed.review, strict ? { min: 4 } : { min: 3 });
  process.stdout.write(
    `Review: ${parsed.review.artifact_path}\nReviewed at: ${parsed.review.reviewed_at}\nVerdict: ${v}${strict ? " (strict, min=4)" : " (lenient, min=3)"}\nScores:\n`,
  );
  for (const s of parsed.review.scores) {
    process.stdout.write(`  ${s.dimension}: ${s.score} — ${s.suggestion}\n`);
  }
  return 0;
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
