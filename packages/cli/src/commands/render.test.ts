import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderCommand } from "./render.ts";

let stdoutBuf: string;
let stderrBuf: string;
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;

beforeEach(() => {
  stdoutBuf = "";
  stderrBuf = "";
  origStdoutWrite = process.stdout.write.bind(process.stdout);
  origStderrWrite = process.stderr.write.bind(process.stderr);
  process.stdout.write = ((chunk: string | Uint8Array) => {
    stdoutBuf += chunk.toString();
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array) => {
    stderrBuf += chunk.toString();
    return true;
  }) as typeof process.stderr.write;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
});

describe("renderCommand", () => {
  test("missing positionals → exit 1, usage on stderr", async () => {
    const code = await renderCommand({ command: "render", positional: [], flags: {} });
    expect(code).toBe(1);
    expect(stderrBuf).toContain("usage: riffcast render");
  });

  test("unreadable brief → exit 1", async () => {
    const code = await renderCommand({
      command: "render",
      positional: ["/nonexistent/brief.md", "/nonexistent/source"],
      flags: {},
    });
    expect(code).toBe(1);
    expect(stderrBuf).toContain("failed to read");
  });

  test("invalid brief → exit 1", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-render-test-"));
    const briefPath = join(dir, "brief.md");
    await writeFile(briefPath, "not a brief");
    const code = await renderCommand({
      command: "render",
      positional: [briefPath, dir],
      flags: {},
    });
    expect(code).toBe(1);
    expect(stderrBuf).toContain("brief invalid");
  });
});
