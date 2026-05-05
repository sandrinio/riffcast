import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { parseBrief, renderAnimation } from "@riffcast/core";
import type { ParsedArgs } from "../parser.ts";

export async function renderCommand(args: ParsedArgs): Promise<number> {
  if (args.positional.length < 2) {
    process.stderr.write("riffcast render: usage: riffcast render <brief.md> <sourceDir>\n");
    return 1;
  }
  const [briefArg, sourceArg] = args.positional;
  const cwdFlag = args.flags.cwd;
  const cwd = typeof cwdFlag === "string" ? cwdFlag : process.cwd();
  const briefPath = isAbsolute(briefArg) ? briefArg : resolve(cwd, briefArg);

  let raw: string;
  try {
    raw = await readFile(briefPath, "utf-8");
  } catch (err) {
    process.stderr.write(`riffcast render: failed to read ${briefPath}: ${msg(err)}\n`);
    return 1;
  }

  const parsed = parseBrief(raw);
  if (!parsed.ok) {
    process.stderr.write(
      `riffcast render: brief invalid:\n  ${parsed.errors.map((e) => `${e.field}: ${e.reason}`).join("\n  ")}\n`,
    );
    return 1;
  }

  process.stderr.write(`riffcast render: starting [${parsed.brief.frontmatter.brief_id}]\n`);
  const result = await renderAnimation(parsed.brief, sourceArg, { cwd });
  if (!result.ok) {
    const code = result.error.phase === "validate" ? 1 : 2;
    process.stderr.write(
      `riffcast render: failed [${result.error.phase}/${result.error.code}]: ${result.error.message}\n`,
    );
    return code;
  }

  process.stderr.write(`riffcast render: completed in ${result.durationMs}ms\n`);
  process.stdout.write(`${result.outputPath}\n`);
  return 0;
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
