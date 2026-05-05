import { describe, expect, test } from "bun:test";
import { parseArgs } from "./parser.ts";

describe("parseArgs", () => {
  test("no args → null command, empty positional and flags", () => {
    const r = parseArgs([]);
    expect(r.command).toBe(null);
    expect(r.positional).toEqual([]);
    expect(r.flags).toEqual({});
  });

  test("--version with no command stays null command", () => {
    const r = parseArgs(["--version"]);
    expect(r.command).toBe(null);
    expect(r.flags.version).toBe(true);
  });

  test("first non-flag becomes the command", () => {
    const r = parseArgs(["render", "brief.md", "source/"]);
    expect(r.command).toBe("render");
    expect(r.positional).toEqual(["brief.md", "source/"]);
  });

  test("--flag=value form parses to string", () => {
    const r = parseArgs(["render", "brief.md", "source/", "--cwd=/tmp"]);
    expect(r.command).toBe("render");
    expect(r.flags.cwd).toBe("/tmp");
    expect(r.positional).toEqual(["brief.md", "source/"]);
  });

  test("bare --flag is boolean true", () => {
    const r = parseArgs(["review", "out.mp4", "brief.md", "--strict"]);
    expect(r.flags.strict).toBe(true);
  });

  test("--help on a command surfaces flags.help=true with command set", () => {
    const r = parseArgs(["render", "--help"]);
    expect(r.command).toBe("render");
    expect(r.flags.help).toBe(true);
  });

  test("short -v is boolean true", () => {
    const r = parseArgs(["-v"]);
    expect(r.flags.v).toBe(true);
  });

  test("flags before command: command still resolves to first non-flag", () => {
    const r = parseArgs(["--cwd=/tmp", "render", "brief.md", "source/"]);
    expect(r.command).toBe("render");
    expect(r.flags.cwd).toBe("/tmp");
    expect(r.positional).toEqual(["brief.md", "source/"]);
  });

  test("multiple --flag=value entries each captured", () => {
    const r = parseArgs(["doctor", "--mcp", "--verbose=true"]);
    expect(r.command).toBe("doctor");
    expect(r.flags.mcp).toBe(true);
    expect(r.flags.verbose).toBe("true");
  });
});
