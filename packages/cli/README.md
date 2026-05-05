# @riffcast/cli

Command-line entry point for RiffCast. Six subcommands; thin wrapper over `@riffcast/core` and `@riffcast/mcp`.

## Install

**Single-binary (primary, no Node/Bun required by user):**

Download from GitHub Releases (EPIC-008 wires this up):

```bash
curl -L https://github.com/sandrinio/riffcast/releases/latest/download/riffcast-darwin-arm64 -o /usr/local/bin/riffcast
chmod +x /usr/local/bin/riffcast
```

**npm (secondary, requires Bun):**

```bash
bun add -g @riffcast/cli
```

## Commands

| Command | What it does | Exit codes |
|---|---|---|
| `riffcast --version` | Print version | 0 |
| `riffcast --help` | Print top-level help (includes "For AI agents" section) | 0 |
| `riffcast init [--name=<n>] [--cwd=<dir>] [--force]` | Scaffold a starter project: `package.json`, `README.md`, `brief.md`, `tsconfig.json`, `remotion.config.ts`, `source/{Root,Hello,index}` | 0 / 1 (collision without `--force`) |
| `riffcast render <brief.md> <sourceDir> [--cwd=<dir>]` | Render brief to MP4. Output path → stdout, progress → stderr | 0 / 1 (bad brief) / 2 (render failure) |
| `riffcast review <artifact> <brief> [--strict] [--review=<path>]` | Parse the `review.md` sidecar and print scores + verdict | 0 / 1 (parse failure) / 2 (review.md missing) |
| `riffcast doctor [--mcp]` | Check Bun, FFmpeg, tmpdir-writable, Remotion CLI, Chromium; with `--mcp` also check Claude Desktop config | 0 / 2 (any check FAILed) |
| `riffcast mcp` | Boot the stdio MCP server (host-spawned subprocess; not a daemon) | 0 |
| `riffcast skill [--print \| --bundle]` | Discover the `@riffcast/skill` bundle: path / content / bundle dir | 0 / 2 (unreachable) |

## For AI agents

`riffcast --help` includes a "For AI agents" section that points at `riffcast skill --print`. Host runtimes that find the binary on `PATH` can self-bootstrap the skill bundle by piping that command's stdout into their skill loader.

## Build (developers)

```bash
bun run scripts/build.ts                            # all four targets
bun run scripts/build.ts --target=bun-darwin-arm64  # one target
```

Outputs land in `dist/riffcast-{darwin-arm64,darwin-x64,linux-x64,linux-arm64}`. On macOS the build script ad-hoc codesigns the arm64 binary so it runs locally — distribution via Releases will need to re-sign or rely on Gatekeeper acceptance.

## Architecture notes

- Argv parser (`src/parser.ts`) is hand-rolled, ~28 LOC, zero deps. Supports `--flag=value` and bare boolean `--flag`.
- The `mcp` subcommand imports `buildServer` from `@riffcast/mcp/server` and waits on `transport.onclose` so process exit doesn't kill the server before the host disconnects.
- `init` writes templates as inline string literals — keeps single-binary distribution from needing asset embedding for the scaffold case.
- Doctor's Remotion CLI check uses `bun x remotion versions`; `WARN` (not `FAIL`) when missing because Remotion is project-local, not system-global.
