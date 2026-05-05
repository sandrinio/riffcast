import { spawn } from "node:child_process";
import { copyFile, cp, mkdir, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { resolveOutputDir, saveBrief } from "./paths.ts";
import { validateBrief } from "./brief.ts";
import type { Brief, RenderResult } from "./types.ts";

export type RenderAnimationOptions = {
  cwd?: string;
  now?: Date;
  remotionEntry?: string;
  composition?: string;
  outFileName?: string;
};

const DEFAULT_ENTRY = "src/index.ts";
const DEFAULT_COMPOSITION = "MetaDemo";

function trySpawn(cmd: string, args: string[], cwd: string): Promise<{ code: number; stderr: string }> {
  return new Promise((resolveSpawn) => {
    const child = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      resolveSpawn({ code: 1, stderr: stderr + `\n[spawn-error] ${err.message}` });
    });
    child.on("close", (code) => {
      resolveSpawn({ code: code ?? 1, stderr });
    });
  });
}

export async function renderAnimation(
  brief: Brief,
  sourceDir: string,
  opts: RenderAnimationOptions = {},
): Promise<RenderResult> {
  const validation = validateBrief(brief);
  if (!validation.ok) {
    return {
      ok: false,
      error: {
        phase: "validate",
        code: "BRIEF_NOT_GREEN",
        message: validation.errors.map((e) => `${e.field}: ${e.reason}`).join("; "),
      },
    };
  }

  if (brief.frontmatter.format !== "animation") {
    return {
      ok: false,
      error: {
        phase: "validate",
        code: "WRONG_FORMAT",
        message: `renderAnimation called with format=${brief.frontmatter.format}; expected animation`,
      },
    };
  }

  const cwd = opts.cwd ?? process.cwd();
  const outDir = resolveOutputDir(brief, { cwd, now: opts.now });
  const entry = opts.remotionEntry ?? DEFAULT_ENTRY;
  const composition = opts.composition ?? DEFAULT_COMPOSITION;
  const outFile = opts.outFileName ?? "output.mp4";
  const outPath = join(outDir, outFile);

  const resolvedSourceDir = resolve(cwd, sourceDir);

  await mkdir(outDir, { recursive: true });
  await saveBrief(brief, outDir);

  try {
    await cp(resolvedSourceDir, join(outDir, "source"), { recursive: true });
  } catch (err) {
    return {
      ok: false,
      error: {
        phase: "save",
        code: "SOURCE_COPY_FAILED",
        message: `failed to copy sourceDir into outDir: ${err instanceof Error ? err.message : String(err)}`,
      },
    };
  }

  const startedAt = Date.now();
  const result = await trySpawn(
    "npx",
    ["remotion", "render", entry, composition, outPath],
    resolvedSourceDir,
  );

  if (result.code !== 0) {
    return {
      ok: false,
      error: {
        phase: "render",
        code: `EXIT_${result.code}`,
        message: `remotion render exited with code ${result.code}`,
        stderr: result.stderr.slice(-2000),
      },
    };
  }

  return {
    ok: true,
    outputPath: outPath,
    outputDir: outDir,
    durationMs: Date.now() - startedAt,
  };
}

export async function listOutputs(outDir: string): Promise<string[]> {
  try {
    return await readdir(outDir);
  } catch {
    return [];
  }
}

export { copyFile };
