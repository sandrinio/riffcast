import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { reviewCommand } from "./review.ts";

const VALID_REVIEW = `---
artifact_path: "/tmp/output.mp4"
reviewed_at: "2026-05-05T17:00:00Z"
overall_verdict: ship
---

# Review

## Composition
**Score:** 4
**Suggestion:** Strong hierarchy.

## Color
**Score:** 5
**Suggestion:** Restrained palette.

## Typography
**Score:** 4
**Suggestion:** Display weights consistent.

## Motion
**Score:** 3
**Suggestion:** Vary easings on transitions.

## Substance
**Score:** 4
**Suggestion:** Conveys message clearly.
`;

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

describe("reviewCommand", () => {
  test("missing positionals → exit 1", async () => {
    const code = await reviewCommand({ command: "review", positional: [], flags: {} });
    expect(code).toBe(1);
    expect(stderrBuf).toContain("usage: riffcast review");
  });

  test("review.md missing → exit 2", async () => {
    const code = await reviewCommand({
      command: "review",
      positional: ["/nonexistent/output.mp4", "/nonexistent/brief.md"],
      flags: {},
    });
    expect(code).toBe(2);
    expect(stderrBuf).toContain("review.md not found");
  });

  test("happy path — exits 0 with verdict ship", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-review-cli-"));
    await writeFile(join(dir, "review.md"), VALID_REVIEW);
    await writeFile(join(dir, "output.mp4"), "fake");
    const code = await reviewCommand({
      command: "review",
      positional: [join(dir, "output.mp4"), join(dir, "brief.md")],
      flags: {},
    });
    expect(code).toBe(0);
    expect(stdoutBuf).toContain("Verdict: ship");
    expect(stdoutBuf).toContain("composition: 4");
  });

  test("strict mode flips verdict on a 3 score", async () => {
    const dir = await mkdtemp(join(tmpdir(), "riffcast-review-cli-strict-"));
    await writeFile(join(dir, "review.md"), VALID_REVIEW);
    await writeFile(join(dir, "output.mp4"), "fake");
    const code = await reviewCommand({
      command: "review",
      positional: [join(dir, "output.mp4"), join(dir, "brief.md")],
      flags: { strict: true },
    });
    expect(code).toBe(0);
    expect(stdoutBuf).toContain("Verdict: iterate (strict, min=4)");
  });
});
