import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Brief } from "./types.ts";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function dateStamp(date: Date = new Date()): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export type ResolveOutputDirOptions = {
  cwd?: string;
  now?: Date;
  exists?: (path: string) => boolean;
};

export function resolveOutputDir(brief: Brief, opts: ResolveOutputDirOptions = {}): string {
  const cwd = opts.cwd ?? process.cwd();
  const now = opts.now ?? new Date();
  const exists = opts.exists ?? existsSync;

  if (brief.frontmatter.output_dir) {
    return resolve(cwd, brief.frontmatter.output_dir);
  }

  const slug = slugify(brief.frontmatter.brief_id);
  const base = `${dateStamp(now)}_${slug}`;
  let candidate = resolve(cwd, "riffcast-out", base);

  let n = 2;
  while (exists(candidate)) {
    candidate = resolve(cwd, "riffcast-out", `${base}-${n}`);
    n += 1;
  }
  return candidate;
}

export async function saveBrief(brief: Brief, outDir: string): Promise<string> {
  await mkdir(outDir, { recursive: true });
  const path = join(outDir, "brief.md");
  await writeFile(path, brief.raw_markdown, "utf-8");
  return path;
}
