#!/usr/bin/env bun
import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ENTRY = resolve(ROOT, "src/index.ts");
const DIST = resolve(ROOT, "dist");

const TARGETS = [
  "bun-darwin-arm64",
  "bun-darwin-x64",
  "bun-linux-x64",
  "bun-linux-arm64",
] as const;

async function main(): Promise<number> {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const onlyArg = Bun.argv.find((a) => a.startsWith("--target="));
  const targets = onlyArg ? [onlyArg.slice("--target=".length)] : TARGETS;

  let failures = 0;
  for (const target of targets) {
    const outfile = resolve(DIST, `riffcast-${target.replace(/^bun-/, "")}`);
    process.stderr.write(`build ${target} → ${outfile}\n`);
    const proc = Bun.spawn({
      cmd: [
        "bun",
        "build",
        ENTRY,
        "--compile",
        "--minify",
        `--target=${target}`,
        "--outfile",
        outfile,
      ],
      stdout: "inherit",
      stderr: "inherit",
    });
    const code = await proc.exited;
    if (code !== 0) {
      process.stderr.write(`  FAILED (exit ${code})\n`);
      failures++;
      continue;
    }
    if (target === "bun-darwin-arm64" && process.platform === "darwin") {
      // macOS Gatekeeper SIGKILLs unsigned arm64 binaries. Bun's compile embeds
      // a non-standard signature; strip it then ad-hoc sign so the binary runs.
      // Users on other Macs may need to re-sign or accept the Gatekeeper prompt.
      const strip = Bun.spawn({
        cmd: ["codesign", "--remove-signature", outfile],
        stdout: "ignore",
        stderr: "ignore",
      });
      await strip.exited;
      const sign = Bun.spawn({
        cmd: ["codesign", "-s", "-", "--force", outfile],
        stdout: "inherit",
        stderr: "inherit",
      });
      if ((await sign.exited) !== 0) {
        process.stderr.write("  WARN: codesign failed; binary may not run on macOS\n");
      }
    }
  }

  if (failures === 0) {
    process.stderr.write(`built ${targets.length} target(s) under ${DIST}\n`);
    return 0;
  }
  process.stderr.write(`${failures} of ${targets.length} target(s) failed\n`);
  return 2;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    process.stderr.write(`build: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(2);
  });
