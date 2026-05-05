import { spawn } from "node:child_process";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import type { ParsedArgs } from "../parser.ts";

type CheckStatus = "OK" | "WARN" | "FAIL";
type Check = { name: string; status: CheckStatus; detail: string };

const MIN_BUN = "1.3.0";

export async function doctorCommand(args: ParsedArgs): Promise<number> {
  const checks: Check[] = [];
  checks.push(await checkBun());
  checks.push(await checkFFmpeg());
  checks.push(await checkCwdWritable());
  checks.push(await checkRemotion());
  checks.push(await checkChromium());
  if (args.flags.mcp) checks.push(await checkMcpConfig());

  const pad = Math.max(...checks.map((c) => c.name.length));
  for (const c of checks) {
    const tag = c.status === "OK" ? "[OK]  " : c.status === "WARN" ? "[WARN]" : "[FAIL]";
    process.stdout.write(`${tag} ${c.name.padEnd(pad)}  ${c.detail}\n`);
  }
  const failed = checks.some((c) => c.status === "FAIL");
  return failed ? 2 : 0;
}

async function checkBun(): Promise<Check> {
  const v = (typeof Bun !== "undefined" && Bun.version) || process.versions?.bun;
  if (!v) return { name: "Bun", status: "FAIL", detail: "Bun runtime not detected" };
  const [maj, min] = v.split(".").map(Number);
  const [rmaj, rmin] = MIN_BUN.split(".").map(Number);
  const ok = maj > rmaj || (maj === rmaj && min >= rmin);
  return {
    name: "Bun",
    status: ok ? "OK" : "FAIL",
    detail: ok ? `${v} (>= ${MIN_BUN})` : `${v} — need >= ${MIN_BUN}; install via https://bun.com`,
  };
}

async function checkFFmpeg(): Promise<Check> {
  const r = await trySpawn("ffmpeg", ["-version"]);
  if (r.code !== 0) {
    return {
      name: "FFmpeg",
      status: "FAIL",
      detail: "NOT FOUND — install via `brew install ffmpeg` (macOS) or apt/dnf (linux)",
    };
  }
  const firstLine = r.stdout.split("\n")[0]?.trim() ?? "ffmpeg";
  return { name: "FFmpeg", status: "OK", detail: firstLine };
}

async function checkCwdWritable(): Promise<Check> {
  try {
    const probe = await mkdtemp(join(tmpdir(), "riffcast-doctor-"));
    const f = join(probe, "probe.tmp");
    await writeFile(f, "ok");
    await rm(probe, { recursive: true, force: true });
    return { name: "tmpdir-writable", status: "OK", detail: tmpdir() };
  } catch (err) {
    return {
      name: "tmpdir-writable",
      status: "FAIL",
      detail: `cannot write under ${tmpdir()}: ${msg(err)}`,
    };
  }
}

async function checkRemotion(): Promise<Check> {
  const r = await trySpawn("bun", ["x", "remotion", "versions"]);
  if (r.code !== 0) {
    return {
      name: "Remotion CLI",
      status: "WARN",
      detail:
        "not reachable via `bun x remotion`; install via `bun add remotion` in your render project",
    };
  }
  const line = r.stdout.split("\n").find((l) => l.includes("Remotion")) ?? r.stdout.split("\n")[0];
  return { name: "Remotion CLI", status: "OK", detail: (line || "").trim() };
}

async function checkChromium(): Promise<Check> {
  const candidates = [
    join(homedir(), ".cache", "puppeteer"),
    join(homedir(), "Library", "Caches", "puppeteer"),
    join(homedir(), "Library", "Application Support", "Chromium"),
  ];
  for (const p of candidates) {
    try {
      await access(p);
      return { name: "Chromium", status: "OK", detail: `found at ${p}` };
    } catch {
      // try next
    }
  }
  return {
    name: "Chromium",
    status: "WARN",
    detail: "no Puppeteer/Chromium cache detected; Remotion will install on first render",
  };
}

async function checkMcpConfig(): Promise<Check> {
  const path = join(
    homedir(),
    "Library",
    "Application Support",
    "Claude",
    "claude_desktop_config.json",
  );
  try {
    const raw = await readFile(path, "utf-8");
    const ok = raw.includes("riffcast");
    return {
      name: "MCP host config",
      status: ok ? "OK" : "WARN",
      detail: ok ? `riffcast wired in ${path}` : `${path} exists but does not name riffcast`,
    };
  } catch {
    return {
      name: "MCP host config",
      status: "WARN",
      detail: `not found at ${path} (only checked the macOS Claude Desktop path)`,
    };
  }
}

function trySpawn(cmd: string, argv: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((res) => {
    const child = spawn(cmd, argv, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (c) => (stdout += c.toString()));
    child.stderr?.on("data", (c) => (stderr += c.toString()));
    child.on("error", () => res({ code: 1, stdout, stderr }));
    child.on("close", (code) => res({ code: code ?? 1, stdout, stderr }));
  });
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
