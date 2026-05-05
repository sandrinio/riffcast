import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { z } from "zod";
import { parseBrief, renderAnimation } from "@riffcast/core";
import { errorResult, msg } from "./_shared.ts";

export const renderToolName = "riffcast_render";
export const renderToolDescription =
  "Render a RiffCast animation brief to MP4. Provide either briefPath OR briefMarkdown. Returns the absolute output path; never inlines rendered bytes.";

export const renderInputShape = {
  briefPath: z.string().optional().describe("Absolute or cwd-relative path to brief.md"),
  briefMarkdown: z.string().optional().describe("Inline brief markdown (alternative to briefPath)"),
  sourceDir: z.string().describe("Path to the Remotion source directory (contains src/index.ts)"),
  cwd: z.string().optional().describe("Working directory; defaults to the server's cwd"),
};

type RenderArgs = {
  briefPath?: string;
  briefMarkdown?: string;
  sourceDir: string;
  cwd?: string;
};

export async function renderHandler(args: RenderArgs) {
  if (!args.briefPath === !args.briefMarkdown) {
    return errorResult("Provide exactly one of briefPath or briefMarkdown");
  }
  const cwd = args.cwd ?? process.cwd();
  let markdown: string;
  if (args.briefPath) {
    const path = isAbsolute(args.briefPath) ? args.briefPath : resolve(cwd, args.briefPath);
    try {
      markdown = await readFile(path, "utf-8");
    } catch (err) {
      return errorResult(`failed to read briefPath: ${msg(err)}`);
    }
  } else {
    markdown = args.briefMarkdown as string;
  }
  const parsed = parseBrief(markdown);
  if (!parsed.ok) {
    return errorResult(
      `brief invalid: ${parsed.errors.map((e) => `${e.field}: ${e.reason}`).join("; ")}`,
    );
  }
  const result = await renderAnimation(parsed.brief, args.sourceDir, { cwd });
  if (!result.ok) {
    return errorResult(
      `render failed [${result.error.phase}/${result.error.code}]: ${result.error.message}`,
    );
  }
  return {
    content: [
      { type: "text" as const, text: `Rendered to ${result.outputPath} in ${result.durationMs}ms` },
    ],
  };
}
