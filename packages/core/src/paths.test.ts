import { describe, expect, test } from "bun:test";
import { dateStamp, resolveOutputDir, slugify } from "./paths.ts";
import type { Brief } from "./types.ts";

const baseBrief: Brief = {
  frontmatter: {
    brief_id: "2026-05-05-test-render",
    format: "animation",
    kind: "explainer",
    vocabulary: "modern-clean",
    specs: {
      duration_seconds: 1,
      width: 1920,
      height: 1080,
      fps: 30,
      output_formats: ["mp4"],
    },
    status: "Ready",
    ambiguity: "🟢 Green",
    created_at: "2026-05-05T00:00:00Z",
    updated_at: "2026-05-05T00:00:00Z",
    rendered_at: null,
    output_path: null,
  },
  goal: "g",
  message: "m",
  audience: "a",
  mandatories: [],
  references: [],
  out_of_scope: [],
  raw_markdown: "",
};

describe("slugify", () => {
  test("lowercases and replaces non-alphanumerics with hyphens", () => {
    expect(slugify("Make A Launch Animation!")).toBe("make-a-launch-animation");
  });
  test("trims leading and trailing hyphens", () => {
    expect(slugify("  --hello-- ")).toBe("hello");
  });
  test("clamps to 80 chars", () => {
    const long = "x".repeat(120);
    expect(slugify(long).length).toBeLessThanOrEqual(80);
  });
});

describe("dateStamp", () => {
  test("formats UTC date as YYYY-MM-DD", () => {
    expect(dateStamp(new Date("2026-05-05T15:30:00Z"))).toBe("2026-05-05");
    expect(dateStamp(new Date("2026-12-31T23:59:59Z"))).toBe("2026-12-31");
  });
});

describe("resolveOutputDir", () => {
  test("default convention: riffcast-out/<date>_<slug>/", () => {
    const dir = resolveOutputDir(baseBrief, {
      cwd: "/work",
      now: new Date("2026-05-05T00:00:00Z"),
      exists: () => false,
    });
    expect(dir).toBe("/work/riffcast-out/2026-05-05_2026-05-05-test-render");
  });

  test("output_dir override takes precedence", () => {
    const briefWithOverride: Brief = {
      ...baseBrief,
      frontmatter: { ...baseBrief.frontmatter, output_dir: "./marketing/launch" },
    };
    const dir = resolveOutputDir(briefWithOverride, { cwd: "/work" });
    expect(dir).toBe("/work/marketing/launch");
  });

  test("collision: appends -2, -3, ... when target exists", () => {
    const taken = new Set<string>([
      "/work/riffcast-out/2026-05-05_2026-05-05-test-render",
      "/work/riffcast-out/2026-05-05_2026-05-05-test-render-2",
    ]);
    const dir = resolveOutputDir(baseBrief, {
      cwd: "/work",
      now: new Date("2026-05-05T00:00:00Z"),
      exists: (p) => taken.has(p),
    });
    expect(dir).toBe("/work/riffcast-out/2026-05-05_2026-05-05-test-render-3");
  });
});
