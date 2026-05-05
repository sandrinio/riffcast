import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { doctorCommand } from "./doctor.ts";

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

describe("doctorCommand", () => {
  test("emits one status line per check and includes Bun + tmpdir-writable", async () => {
    await doctorCommand({ command: "doctor", positional: [], flags: {} });
    expect(stdoutBuf).toContain("Bun");
    expect(stdoutBuf).toContain("tmpdir-writable");
    expect(stdoutBuf).toContain("FFmpeg");
    expect(stdoutBuf).toContain("Remotion CLI");
    expect(stdoutBuf).toContain("Chromium");
    // Each line begins with one of the status tags.
    const tags = stdoutBuf.match(/\[(OK|WARN|FAIL)\]/g) ?? [];
    expect(tags.length).toBeGreaterThanOrEqual(5);
  });

  test("--mcp adds MCP host config check", async () => {
    await doctorCommand({ command: "doctor", positional: [], flags: { mcp: true } });
    expect(stdoutBuf).toContain("MCP host config");
  });

  test("Bun check passes — we are running under Bun >= 1.3.0", async () => {
    const code = await doctorCommand({ command: "doctor", positional: [], flags: {} });
    // FFmpeg may or may not be installed on this dev box. The Bun check must pass.
    expect(stdoutBuf).toMatch(/\[OK\]\s+Bun/);
    // exit code: 0 if all pass; 2 if any FAIL. Either is acceptable for this env-dependent test.
    expect([0, 2]).toContain(code);
  });
});
