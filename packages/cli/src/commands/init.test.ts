import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { initCommand } from "./init.ts";
import { parseBrief } from "@riffcast/core";

let stdoutBuf: string;
let stderrBuf: string;
let origOut: typeof process.stdout.write;
let origErr: typeof process.stderr.write;

beforeEach(() => {
  stdoutBuf = "";
  stderrBuf = "";
  origOut = process.stdout.write.bind(process.stdout);
  origErr = process.stderr.write.bind(process.stderr);
  process.stdout.write = ((c: string | Uint8Array) => {
    stdoutBuf += c.toString();
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((c: string | Uint8Array) => {
    stderrBuf += c.toString();
    return true;
  }) as typeof process.stderr.write;
});

afterEach(() => {
  process.stdout.write = origOut;
  process.stderr.write = origErr;
});

describe("initCommand", () => {
  test("scaffolds full project in empty cwd → exit 0", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-init-"));
    const code = await initCommand({
      command: "init",
      positional: [],
      flags: { cwd: dir, name: "test-project" },
    });
    expect(code).toBe(0);
    const entries = await readdir(dir);
    expect(entries).toContain("package.json");
    expect(entries).toContain("README.md");
    expect(entries).toContain("brief.md");
    expect(entries).toContain("source");
    const sourceEntries = await readdir(join(dir, "source"));
    expect(sourceEntries).toContain("Root.tsx");
    expect(sourceEntries).toContain("Hello.tsx");
    expect(sourceEntries).toContain("index.ts");
  });

  test("scaffolded brief.md parses cleanly via @riffcast/core", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-init-brief-"));
    await initCommand({
      command: "init",
      positional: [],
      flags: { cwd: dir, name: "parse-test" },
    });
    const briefRaw = await readFile(join(dir, "brief.md"), "utf-8");
    const parsed = parseBrief(briefRaw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.brief.frontmatter.format).toBe("animation");
    expect(parsed.brief.frontmatter.vocabulary).toBe("modern-clean");
    expect(parsed.brief.frontmatter.ambiguity).toBe("🟢 Green");
  });

  test("refuses to overwrite without --force → exit 1", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-init-collide-"));
    await writeFile(join(dir, "package.json"), "{}");
    const code = await initCommand({
      command: "init",
      positional: [],
      flags: { cwd: dir, name: "collide-test" },
    });
    expect(code).toBe(1);
    expect(stderrBuf).toContain("refusing to overwrite");
    expect(stderrBuf).toContain("package.json");
  });

  test("--force overwrites existing files → exit 0", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-init-force-"));
    await writeFile(join(dir, "package.json"), "{}");
    const code = await initCommand({
      command: "init",
      positional: [],
      flags: { cwd: dir, name: "force-test", force: true },
    });
    expect(code).toBe(0);
    const pkgRaw = await readFile(join(dir, "package.json"), "utf-8");
    const pkg = JSON.parse(pkgRaw);
    expect(pkg.name).toBe("force-test");
  });

  test("scaffolded package.json has Remotion deps and a render script", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-init-pkg-"));
    await initCommand({
      command: "init",
      positional: [],
      flags: { cwd: dir, name: "pkg-test" },
    });
    const pkgRaw = await readFile(join(dir, "package.json"), "utf-8");
    const pkg = JSON.parse(pkgRaw);
    expect(pkg.dependencies.remotion).toBeDefined();
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.scripts.render).toContain("remotion render");
  });
});
