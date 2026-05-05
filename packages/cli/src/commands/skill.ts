import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ParsedArgs } from "../parser.ts";

export async function skillCommand(args: ParsedArgs): Promise<number> {
  let skillDir: string;
  try {
    skillDir = resolveSkillDir();
  } catch (err) {
    process.stderr.write(`riffcast skill: ${msg(err)}\n`);
    return 2;
  }
  const skillMdPath = join(skillDir, "SKILL.md");

  if (args.flags.print) {
    try {
      const content = await readFile(skillMdPath, "utf-8");
      process.stdout.write(content);
      if (!content.endsWith("\n")) process.stdout.write("\n");
      return 0;
    } catch (err) {
      process.stderr.write(`riffcast skill: failed to read ${skillMdPath}: ${msg(err)}\n`);
      return 2;
    }
  }

  if (args.flags.bundle) {
    process.stdout.write(`${skillDir}\n`);
    return 0;
  }

  process.stdout.write(`${skillMdPath}\n`);
  return 0;
}

export function resolveSkillDir(): string {
  const pkgUrl = (import.meta as { resolve?: (s: string) => string }).resolve?.(
    "@riffcast/skill/package.json",
  );
  if (pkgUrl) return dirname(fileURLToPath(pkgUrl));
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "../../../skill");
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
