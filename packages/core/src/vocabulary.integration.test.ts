import { describe, expect, test } from "bun:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadVocabulary } from "./vocabulary.ts";
import { VOCABULARY_NAMES } from "./types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VOCABS_DIR = resolve(__dirname, "../../skill/references/design-vocabularies");

describe("loadVocabulary — real files", () => {
  test("loads modern-clean from packages/skill", async () => {
    const vocab = await loadVocabulary("modern-clean", { vocabulariesDir: VOCABS_DIR });
    expect(vocab.name).toBe("modern-clean");
    expect(vocab.colors.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(vocab.typography.display.weight).toBe(700);
    expect(vocab.motion.spring_default.damping).toBeGreaterThan(0);
  });

  test("loads editorial from packages/skill", async () => {
    const vocab = await loadVocabulary("editorial", { vocabulariesDir: VOCABS_DIR });
    expect(vocab.name).toBe("editorial");
    expect(vocab.typography.display.family).toBe("Playfair Display");
  });

  test("loads playful from packages/skill", async () => {
    const vocab = await loadVocabulary("playful", { vocabulariesDir: VOCABS_DIR });
    expect(vocab.name).toBe("playful");
    expect(vocab.typography.display.family).toBe("Space Grotesk");
  });

  test("the three vocabularies are visually distinct", async () => {
    const names = VOCABULARY_NAMES.filter((n) => n !== "let-me-see-options");
    const loaded = await Promise.all(
      names.map((n) => loadVocabulary(n, { vocabulariesDir: VOCABS_DIR })),
    );
    const accents = loaded.map((v) => v.colors.accent_primary);
    const families = loaded.map((v) => v.typography.display.family);
    const damping = loaded.map((v) => v.motion.spring_default.damping);
    expect(new Set(accents).size).toBe(loaded.length);
    expect(new Set(families).size).toBe(loaded.length);
    expect(new Set(damping).size).toBe(loaded.length);
  });

  test("WCAG AA: each vocabulary's fg-on-bg meets ≥4.5:1", async () => {
    const names = VOCABULARY_NAMES.filter((n) => n !== "let-me-see-options");
    for (const name of names) {
      const vocab = await loadVocabulary(name, { vocabulariesDir: VOCABS_DIR });
      const ratio = contrastRatio(vocab.colors.fg, vocab.colors.bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });
});

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  return [
    parseInt(m.slice(0, 2), 16),
    parseInt(m.slice(2, 4), 16),
    parseInt(m.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const norm = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * norm[0]! + 0.7152 * norm[1]! + 0.0722 * norm[2]!;
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(hexToRgb(a));
  const lb = relativeLuminance(hexToRgb(b));
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}
