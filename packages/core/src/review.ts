import matter from "gray-matter";
import {
  DIMENSION_NAMES,
  type DimensionName,
  type DimensionScore,
  type DimensionScoreValue,
  type Review,
  type ReviewParseError,
  type ReviewParseResult,
  type Verdict,
  type VerdictThreshold,
} from "./types.ts";

export const SUGGESTION_MAX_CHARS = 140;
export const DEFAULT_VERDICT_THRESHOLD: VerdictThreshold = { min: 3 };
export const STRICT_VERDICT_THRESHOLD: VerdictThreshold = { min: 4 };

function isDimensionName(value: string): value is DimensionName {
  return (DIMENSION_NAMES as readonly string[]).includes(value);
}

function isScoreValue(n: number): n is DimensionScoreValue {
  return Number.isInteger(n) && n >= 1 && n <= 5;
}

function extractDimensionBlock(
  body: string,
  dimension: DimensionName,
): { score: number | null; suggestion: string | null; raw: string } | null {
  const heading = dimension.charAt(0).toUpperCase() + dimension.slice(1);
  const re = new RegExp(`(?:^|\\n)##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
  const m = body.match(re);
  if (!m) return null;
  const block = m[1];
  const scoreMatch = block.match(/^\*\*Score:\*\*\s*(-?\d+)\s*$/m);
  const suggestionMatch = block.match(/^\*\*Suggestion:\*\*\s*(.+?)\s*$/m);
  return {
    score: scoreMatch ? Number(scoreMatch[1]) : null,
    suggestion: suggestionMatch ? suggestionMatch[1] : null,
    raw: block,
  };
}

export function parseReview(markdown: string): ReviewParseResult {
  const errors: ReviewParseError[] = [];

  let parsed: { data: Record<string, unknown>; content: string };
  try {
    parsed = matter(markdown) as { data: Record<string, unknown>; content: string };
  } catch (err) {
    return {
      ok: false,
      errors: [
        {
          field: "frontmatter",
          reason: `failed to parse YAML frontmatter: ${
            err instanceof Error ? err.message : String(err)
          }`,
        },
      ],
    };
  }

  const fm = parsed.data;
  const artifactPath = typeof fm.artifact_path === "string" ? fm.artifact_path : null;
  const reviewedAtRaw = fm.reviewed_at;
  const reviewedAt =
    typeof reviewedAtRaw === "string"
      ? reviewedAtRaw
      : reviewedAtRaw instanceof Date && !Number.isNaN(reviewedAtRaw.getTime())
        ? reviewedAtRaw.toISOString()
        : null;
  const overallVerdict = typeof fm.overall_verdict === "string" ? fm.overall_verdict : null;

  if (!artifactPath) {
    errors.push({ field: "artifact_path", reason: "required string field missing" });
  }
  if (!reviewedAt) {
    errors.push({ field: "reviewed_at", reason: "required string field missing" });
  }
  if (overallVerdict !== "ship" && overallVerdict !== "iterate") {
    errors.push({
      field: "overall_verdict",
      reason: `must be "ship" or "iterate"; got ${JSON.stringify(overallVerdict)}`,
    });
  }

  const scores: DimensionScore[] = [];
  const seen = new Set<DimensionName>();

  for (const dimension of DIMENSION_NAMES) {
    const block = extractDimensionBlock(parsed.content, dimension);
    if (!block) {
      errors.push({ field: dimension, reason: "dimension section missing" });
      continue;
    }
    if (block.score === null) {
      errors.push({ field: `${dimension}.score`, reason: "score line missing or unparseable" });
      continue;
    }
    if (!isScoreValue(block.score)) {
      errors.push({
        field: `${dimension}.score`,
        reason: `score must be integer in [1..5]; got ${block.score}`,
      });
      continue;
    }
    if (block.suggestion === null || block.suggestion.length === 0) {
      errors.push({ field: `${dimension}.suggestion`, reason: "suggestion line missing or empty" });
      continue;
    }
    if (block.suggestion.length > SUGGESTION_MAX_CHARS) {
      errors.push({ field: "suggestion", reason: "too_long" });
      continue;
    }
    if (seen.has(dimension)) {
      errors.push({ field: dimension, reason: "duplicate dimension section" });
      continue;
    }
    seen.add(dimension);
    scores.push({ dimension, score: block.score, suggestion: block.suggestion });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (scores.length !== DIMENSION_NAMES.length) {
    return {
      ok: false,
      errors: [
        {
          field: "scores",
          reason: `expected ${DIMENSION_NAMES.length} dimensions; got ${scores.length}`,
        },
      ],
    };
  }

  const review: Review = {
    artifact_path: artifactPath as string,
    reviewed_at: reviewedAt as string,
    scores,
    overall_verdict: overallVerdict as Verdict,
  };
  return { ok: true, review };
}

export function formatReview(review: Review): string {
  const fmLines = [
    "---",
    `artifact_path: ${JSON.stringify(review.artifact_path)}`,
    `reviewed_at: ${JSON.stringify(review.reviewed_at)}`,
    `overall_verdict: ${review.overall_verdict}`,
    "---",
    "",
    "# Review",
    "",
  ];
  const byDim = new Map<DimensionName, DimensionScore>();
  for (const s of review.scores) byDim.set(s.dimension, s);

  const blocks: string[] = [];
  for (const dimension of DIMENSION_NAMES) {
    const s = byDim.get(dimension);
    if (!s) continue;
    const heading = dimension.charAt(0).toUpperCase() + dimension.slice(1);
    blocks.push(
      `## ${heading}`,
      `**Score:** ${s.score}`,
      `**Suggestion:** ${s.suggestion}`,
      "",
    );
  }
  return [...fmLines, ...blocks].join("\n").replace(/\n+$/, "\n");
}

export function verdict(
  review: Review,
  threshold: VerdictThreshold = DEFAULT_VERDICT_THRESHOLD,
): Verdict {
  for (const s of review.scores) {
    if (s.score < threshold.min) return "iterate";
  }
  return "ship";
}

export { isDimensionName };
