import { describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildServer, TOOL_NAMES } from "./server.ts";
import { renderHandler } from "./tools/render.ts";
import { reviewHandler } from "./tools/review.ts";
import { skillHandler } from "./tools/skill.ts";
import { proposeDirectionsHandler } from "./tools/propose-directions.ts";

const VALID_BRIEF = `---
brief_id: "2026-05-05-test-mcp"
format: "animation"
kind: "explainer"
vocabulary: "modern-clean"
specs:
  duration_seconds: 5
  width: 1280
  height: 720
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
Exercise MCP propose-directions.

## 2. Message
RiffCast turns briefs into animations.

## 3. Audience
Skeptical engineers.

## 4. Format
Animation

## 5. Tone
let-me-see-options

## 6. Mandatories
- None.

## 7. References
- None.

## 8. Out of Scope
- Audio.
`;

const VALID_REVIEW = `---
artifact_path: "/tmp/output.mp4"
reviewed_at: "2026-05-05T17:00:00Z"
overall_verdict: ship
---

# Review

## Composition
**Score:** 4
**Suggestion:** Strong hierarchy; tighten the negative space in scene 2.

## Color
**Score:** 5
**Suggestion:** Restrained accent palette holds across scenes.

## Typography
**Score:** 4
**Suggestion:** Display weights consistent; tighten tracking on the logo card.

## Motion
**Score:** 3
**Suggestion:** Easings are predictable; vary the spring on the transition into scene 3.

## Substance
**Score:** 4
**Suggestion:** Conveys the message clearly; could land the value-prop earlier.
`;

describe("buildServer", () => {
  test("constructs without throwing and exposes tool names", () => {
    const server = buildServer();
    expect(server).toBeDefined();
    expect(TOOL_NAMES).toEqual([
      "riffcast_render",
      "riffcast_review",
      "riffcast_propose_directions",
      "riffcast_skill",
    ]);
  });
});

describe("renderHandler", () => {
  test("rejects when neither briefPath nor briefMarkdown provided", async () => {
    const r = await renderHandler({ sourceDir: "demos/meta-demo" });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("exactly one of briefPath or briefMarkdown");
  });

  test("rejects when both provided", async () => {
    const r = await renderHandler({
      briefPath: "/tmp/x",
      briefMarkdown: VALID_BRIEF,
      sourceDir: "demos/meta-demo",
    });
    expect(r.isError).toBe(true);
  });

  test("surfaces parse errors as isError", async () => {
    const r = await renderHandler({
      briefMarkdown: "not a valid brief",
      sourceDir: "demos/meta-demo",
    });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("brief invalid");
  });

  test("surfaces missing-file as isError", async () => {
    const r = await renderHandler({
      briefPath: "/nonexistent/brief.md",
      sourceDir: "demos/meta-demo",
    });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("failed to read briefPath");
  });
});

describe("reviewHandler", () => {
  test("returns isError when review.md missing", async () => {
    const r = await reviewHandler({
      artifactPath: "/nonexistent/dir/output.mp4",
      briefPath: "/nonexistent/dir/brief.md",
    });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("review.md not found");
  });

  test("happy path — parses sidecar and returns verdict", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-review-"));
    const artifactPath = join(dir, "output.mp4");
    const reviewPath = join(dir, "review.md");
    await writeFile(reviewPath, VALID_REVIEW);
    await writeFile(artifactPath, "fake-mp4-bytes");

    const r = await reviewHandler({
      artifactPath,
      briefPath: join(dir, "brief.md"),
    });
    expect(r.isError).toBeFalsy();
    expect(r.content[0].text).toContain("Verdict: ship");
    expect(r.content[0].text).toContain("composition: 4");
    expect(r.content[0].text).toContain("motion: 3");
  });

  test("strict mode flips verdict when any score < 4", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-review-strict-"));
    const reviewPath = join(dir, "review.md");
    await writeFile(reviewPath, VALID_REVIEW);
    await writeFile(join(dir, "output.mp4"), "fake");
    const r = await reviewHandler({
      artifactPath: join(dir, "output.mp4"),
      briefPath: join(dir, "brief.md"),
      strict: true,
    });
    expect(r.content[0].text).toContain("Verdict: iterate (strict, min=4)");
  });
});

describe("skillHandler", () => {
  test("path mode — returns absolute path ending in SKILL.md", async () => {
    const r = await skillHandler({ mode: "path" });
    expect(r.isError).toBeFalsy();
    expect(r.content[0].text).toMatch(/SKILL\.md$/);
  });

  test("content mode (default) — inlines SKILL.md contents", async () => {
    const r = await skillHandler({});
    expect(r.isError).toBeFalsy();
    expect(r.content[0].text).toContain("# RiffCast Skill");
  });

  test("bundle mode — returns JSON manifest with skill_md, references, templates", async () => {
    const r = await skillHandler({ mode: "bundle" });
    expect(r.isError).toBeFalsy();
    const manifest = JSON.parse(r.content[0].text);
    expect(manifest.skill_md).toMatch(/SKILL\.md$/);
    expect(Array.isArray(manifest.references)).toBe(true);
    expect(Array.isArray(manifest.templates)).toBe(true);
    expect(manifest.references.length).toBeGreaterThan(0);
    expect(manifest.templates.some((p: string) => p.endsWith("brief.md"))).toBe(true);
  });
});

describe("proposeDirectionsHandler", () => {
  test("returns N directions deterministically from real vocabularies", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-pd-"));
    const briefPath = join(dir, "brief.md");
    await writeFile(briefPath, VALID_BRIEF);

    const r = await proposeDirectionsHandler({ briefPath, count: 3 });
    expect(r.isError).toBeFalsy();
    const text = r.content[0].text;
    expect(text).toContain("modern-clean");
    expect(text).toContain("editorial");
    expect(text).toContain("playful");
    expect(text).toContain("RiffCast turns briefs into animations");
  });

  test("count=1 returns just one direction", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-pd1-"));
    const briefPath = join(dir, "brief.md");
    await writeFile(briefPath, VALID_BRIEF);

    const r = await proposeDirectionsHandler({ briefPath, count: 1 });
    expect(r.isError).toBeFalsy();
    expect(r.content[0].text).toContain("Directions (1)");
  });

  test("invalid brief surfaces parse error", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-pd-bad-"));
    const briefPath = join(dir, "brief.md");
    await writeFile(briefPath, "not a brief");

    const r = await proposeDirectionsHandler({ briefPath });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("brief invalid");
  });
});
