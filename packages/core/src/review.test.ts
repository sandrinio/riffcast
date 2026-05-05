import { describe, expect, test } from "bun:test";
import {
  DEFAULT_VERDICT_THRESHOLD,
  STRICT_VERDICT_THRESHOLD,
  SUGGESTION_MAX_CHARS,
  formatReview,
  parseReview,
  verdict,
} from "./review.ts";
import type { DimensionScore, Review } from "./types.ts";

const ARTIFACT_PATH = "riffcast-out/2026-05-05-meta-demo/output.mp4";
const REVIEWED_AT = "2026-05-05T12:00:00Z";

function buildScores(values: [number, number, number, number, number]): DimensionScore[] {
  const dims = ["composition", "color", "typography", "motion", "substance"] as const;
  return dims.map((dimension, i) => ({
    dimension,
    score: values[i] as 1 | 2 | 3 | 4 | 5,
    suggestion: `Suggestion for ${dimension}.`,
  }));
}

function buildReview(values: [number, number, number, number, number], v: "ship" | "iterate"): Review {
  return {
    artifact_path: ARTIFACT_PATH,
    reviewed_at: REVIEWED_AT,
    scores: buildScores(values),
    overall_verdict: v,
  };
}

const VALID_MD = `---
artifact_path: "${ARTIFACT_PATH}"
reviewed_at: "${REVIEWED_AT}"
overall_verdict: ship
---

# Review

## Composition
**Score:** 4
**Suggestion:** Camera holds too long on the title card; cut 0.5s.

## Color
**Score:** 3
**Suggestion:** Accent contrast against bg is borderline; bump saturation.

## Typography
**Score:** 5
**Suggestion:** Display tracking reads clean at 1080p; keep as-is.

## Motion
**Score:** 4
**Suggestion:** Easing on the title entrance feels mechanical; switch to spring.

## Substance
**Score:** 3
**Suggestion:** Message lands but the audience cue is implicit; spell it out.
`;

describe("parseReview", () => {
  test("parses to structured form with scores.length === 5 and each in [1..5]", () => {
    const result = parseReview(VALID_MD);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.review.scores.length).toBe(5);
    for (const s of result.review.scores) {
      expect(s.score).toBeGreaterThanOrEqual(1);
      expect(s.score).toBeLessThanOrEqual(5);
    }
    expect(result.review.artifact_path).toBe(ARTIFACT_PATH);
    expect(result.review.reviewed_at).toBe(REVIEWED_AT);
    expect(result.review.overall_verdict).toBe("ship");
  });

  test("rejects suggestion longer than 140 chars with field=suggestion reason=too_long", () => {
    const longSuggestion = "x".repeat(SUGGESTION_MAX_CHARS + 1);
    const md = VALID_MD.replace(
      "Camera holds too long on the title card; cut 0.5s.",
      longSuggestion,
    );
    const result = parseReview(md);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const tooLong = result.errors.find(
      (e) => e.field === "suggestion" && e.reason === "too_long",
    );
    expect(tooLong).toBeDefined();
  });

  test("rejects when a dimension section is missing", () => {
    const md = VALID_MD.replace(/## Substance[\s\S]*$/m, "");
    const result = parseReview(md);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === "substance")).toBe(true);
  });

  test("rejects out-of-range score", () => {
    const md = VALID_MD.replace("**Score:** 4\n**Suggestion:** Camera holds", "**Score:** 7\n**Suggestion:** Camera holds");
    const result = parseReview(md);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === "composition.score")).toBe(true);
  });

  test("rejects missing required frontmatter fields", () => {
    const md = VALID_MD.replace(`artifact_path: "${ARTIFACT_PATH}"\n`, "");
    const result = parseReview(md);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === "artifact_path")).toBe(true);
  });
});

describe("verdict", () => {
  test("all green ships (default lenient threshold ≥3)", () => {
    const review = buildReview([3, 3, 3, 4, 5], "ship");
    expect(verdict(review)).toBe("ship");
  });

  test("any 1 or 2 forces iterate", () => {
    const reviewWithOne = buildReview([5, 5, 5, 5, 1], "iterate");
    expect(verdict(reviewWithOne)).toBe("iterate");
    const reviewWithTwo = buildReview([5, 5, 5, 5, 2], "iterate");
    expect(verdict(reviewWithTwo)).toBe("iterate");
  });

  test("strict threshold (≥4) fails a 3", () => {
    const review = buildReview([4, 4, 4, 4, 3], "ship");
    expect(verdict(review, STRICT_VERDICT_THRESHOLD)).toBe("iterate");
    expect(verdict(review, DEFAULT_VERDICT_THRESHOLD)).toBe("ship");
  });
});

describe("formatReview / round-trip", () => {
  test("format -> parse equals original", () => {
    const review = buildReview([4, 3, 5, 4, 3], "ship");
    const md = formatReview(review);
    const result = parseReview(md);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.review).toEqual(review);
  });

  test("round-trip preserves iterate verdict", () => {
    const review = buildReview([2, 4, 5, 4, 3], "iterate");
    const md = formatReview(review);
    const result = parseReview(md);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.review).toEqual(review);
  });
});
