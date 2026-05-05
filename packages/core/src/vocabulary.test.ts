import { describe, expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findVocabularyFile, loadVocabulary, RiffcastError } from "./vocabulary.ts";

describe("findVocabularyFile", () => {
  test("matches NN-name.md convention", async () => {
    const dir = await mkdtemp(join(tmpdir(), "vocab-"));
    await writeFile(join(dir, "01-modern-clean.md"), "x");
    await writeFile(join(dir, "02-editorial.md"), "y");

    expect(await findVocabularyFile("modern-clean", dir)).toBe(join(dir, "01-modern-clean.md"));
    expect(await findVocabularyFile("editorial", dir)).toBe(join(dir, "02-editorial.md"));
    expect(await findVocabularyFile("playful", dir)).toBe(null);
  });

  test("returns null when directory does not exist", async () => {
    const result = await findVocabularyFile("modern-clean", "/nonexistent/path/that/should/never/exist");
    expect(result).toBe(null);
  });
});

describe("loadVocabulary", () => {
  test("throws NOT_FOUND when vocabulary missing", async () => {
    const dir = await mkdtemp(join(tmpdir(), "vocab-"));
    let caught: unknown;
    try {
      await loadVocabulary("modern-clean", { vocabulariesDir: dir });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(RiffcastError);
    expect((caught as RiffcastError).phase).toBe("vocabulary");
    expect((caught as RiffcastError).code).toBe("NOT_FOUND");
  });

  test("loads valid vocabulary file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "vocab-"));
    const content = `---
name: modern-clean
default_mood: Restrained, technical, considered.
colors:
  bg: "#0a0a0a"
  fg: "#ededed"
  dim: "#6b6b6b"
  accent_primary: "#7c5cff"
  accent_secondary: "#5cf0ff"
  accent_tertiary: "#ff5c8a"
typography:
  display: { family: Inter, weight: 700, tracking: -0.04 }
  body: { family: Inter, weight: 400 }
  mono: { family: JetBrains Mono, weight: 400 }
  scale: 1.25
motion:
  spring_default: { damping: 15, stiffness: 90 }
  duration_default_ms: 600
  easing_curve: ease-out
---

# Modern Clean

Body content here.
`;
    await writeFile(join(dir, "01-modern-clean.md"), content);

    const vocab = await loadVocabulary("modern-clean", { vocabulariesDir: dir });
    expect(vocab.name).toBe("modern-clean");
    expect(vocab.colors.bg).toBe("#0a0a0a");
    expect(vocab.typography.display.family).toBe("Inter");
    expect(vocab.motion.spring_default.damping).toBe(15);
  });

  test("throws INVALID_TOKEN_BLOCK when tokens are malformed", async () => {
    const dir = await mkdtemp(join(tmpdir(), "vocab-"));
    const content = `---
name: modern-clean
default_mood: x
colors:
  bg: "not-a-hex"
  fg: "#ededed"
  dim: "#6b6b6b"
  accent_primary: "#7c5cff"
  accent_secondary: "#5cf0ff"
  accent_tertiary: "#ff5c8a"
typography:
  display: { family: Inter, weight: 700 }
  body: { family: Inter, weight: 400 }
  mono: { family: Mono, weight: 400 }
  scale: 1.25
motion:
  spring_default: { damping: 15, stiffness: 90 }
  duration_default_ms: 600
  easing_curve: ease-out
---
`;
    await writeFile(join(dir, "01-modern-clean.md"), content);

    let caught: unknown;
    try {
      await loadVocabulary("modern-clean", { vocabulariesDir: dir });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(RiffcastError);
    expect((caught as RiffcastError).code).toBe("INVALID_TOKEN_BLOCK");
  });
});
