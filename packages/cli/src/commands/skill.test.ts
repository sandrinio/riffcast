import { describe, expect, test } from "bun:test";
import { stat } from "node:fs/promises";
import { resolveSkillDir } from "./skill.ts";

describe("resolveSkillDir", () => {
  test("returns a directory containing SKILL.md", async () => {
    const dir = resolveSkillDir();
    const skillMd = `${dir}/SKILL.md`;
    const s = await stat(skillMd);
    expect(s.isFile()).toBe(true);
  });
});
