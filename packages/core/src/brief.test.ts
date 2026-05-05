import { describe, expect, test } from "bun:test";
import { parseBrief, validateBrief } from "./brief.ts";

const VALID = `---
brief_id: "2026-05-05-test-render"
format: "animation"
kind: "explainer"
vocabulary: "modern-clean"
specs:
  duration_seconds: 10
  width: 1920
  height: 1080
  fps: 30
  output_formats: ["mp4"]
status: "Ready"
ambiguity: "🟢 Green"
created_at: "2026-05-05T00:00:00Z"
updated_at: "2026-05-05T00:00:00Z"
rendered_at: null
output_path: null
---

# Brief

## 1. Goal
Test the parse path end-to-end.

## 2. Message
Briefs parse into structured form.

## 3. Audience
The test runner.

## 4. Format
Animation

## 5. Tone
modern-clean

## 6. Mandatories
- None.

## 7. References
- None.

## 8. Out of Scope
- Audio.
`;

describe("parseBrief", () => {
  test("happy path returns ok=true with structured brief", () => {
    const result = parseBrief(VALID);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.brief.frontmatter.brief_id).toBe("2026-05-05-test-render");
    expect(result.brief.frontmatter.format).toBe("animation");
    expect(result.brief.frontmatter.kind).toBe("explainer");
    expect(result.brief.frontmatter.specs.width).toBe(1920);
    expect(result.brief.goal).toContain("Test the parse path");
    expect(result.brief.message).toContain("Briefs parse");
    expect(result.brief.audience).toContain("test runner");
    expect(result.brief.out_of_scope).toEqual(["Audio."]);
    expect(result.brief.mandatories).toEqual([]);
  });

  test("missing Goal section fails with field=goal", () => {
    const broken = VALID.replace("## 1. Goal\nTest the parse path end-to-end.\n\n", "");
    const result = parseBrief(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === "goal")).toBe(true);
  });

  test("invalid kind for animation is rejected", () => {
    const bad = VALID.replace(`kind: "explainer"`, `kind: "not-a-real-kind"`);
    const result = parseBrief(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === "kind")).toBe(true);
  });

  test("invalid vocabulary is rejected by frontmatter schema", () => {
    const bad = VALID.replace(`vocabulary: "modern-clean"`, `vocabulary: "nonexistent"`);
    const result = parseBrief(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === "vocabulary")).toBe(true);
  });

  test("malformed frontmatter returns parse error", () => {
    const result = parseBrief("---\nthis is: not: valid: yaml: ::\n---\n# body\n## 1. Goal\nx\n## 2. Message\nx\n## 3. Audience\nx\n");
    expect(result.ok).toBe(false);
  });
});

describe("validateBrief", () => {
  test("🟢 Green brief passes", () => {
    const parsed = parseBrief(VALID);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const v = validateBrief(parsed.brief);
    expect(v.ok).toBe(true);
  });

  test("🟡 Medium brief is rejected with ambiguity error", () => {
    const yellow = VALID.replace(`ambiguity: "🟢 Green"`, `ambiguity: "🟡 Medium"`);
    const parsed = parseBrief(yellow);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const v = validateBrief(parsed.brief);
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.errors[0].field).toBe("ambiguity");
  });
});
