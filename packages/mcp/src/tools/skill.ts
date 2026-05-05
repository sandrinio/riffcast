import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { errorResult, msg } from "./_shared.ts";

export const skillToolName = "riffcast_skill";
export const skillToolDescription =
  "Call this first; load the returned content as a skill bundle in your runtime. Returns the @riffcast/skill bundle. Mode 'content' (default) inlines SKILL.md; 'path' returns its absolute path; 'bundle' returns a JSON manifest of every shipped file.";

export const skillInputShape = {
  mode: z.enum(["path", "content", "bundle"]).optional().describe("path | content (default) | bundle"),
};

type Args = { mode?: "path" | "content" | "bundle" };

export async function skillHandler(args: Args) {
  const mode = args.mode ?? "content";
  let skillDir: string;
  try {
    skillDir = resolveSkillDir();
  } catch (err) {
    return errorResult(`failed to resolve @riffcast/skill: ${msg(err)}`);
  }
  const skillMdPath = join(skillDir, "SKILL.md");

  if (mode === "path") {
    return { content: [{ type: "text" as const, text: skillMdPath }] };
  }
  if (mode === "content") {
    try {
      const text = await readFile(skillMdPath, "utf-8");
      return { content: [{ type: "text" as const, text }] };
    } catch (err) {
      return errorResult(`failed to read ${skillMdPath}: ${msg(err)}`);
    }
  }
  try {
    const refs = await listFilesRecursive(join(skillDir, "references"));
    const tmpls = await listFilesRecursive(join(skillDir, "templates"));
    const manifest = { skill_md: skillMdPath, references: refs, templates: tmpls };
    return { content: [{ type: "text" as const, text: JSON.stringify(manifest, null, 2) }] };
  } catch (err) {
    return errorResult(`failed to enumerate skill bundle at ${skillDir}: ${msg(err)}`);
  }
}

function resolveSkillDir(): string {
  const pkgUrl = (import.meta as { resolve?: (s: string) => string }).resolve?.(
    "@riffcast/skill/package.json",
  );
  if (pkgUrl) return dirname(fileURLToPath(pkgUrl));
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "../../../skill");
}

async function listFilesRecursive(root: string): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(root);
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const entry of entries) {
    const full = join(root, entry);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await listFilesRecursive(full)));
    else out.push(full);
  }
  return out.sort();
}
