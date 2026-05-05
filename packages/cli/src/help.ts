import { VERSION } from "@riffcast/core";

const AGENT_LINE =
  "For AI agents: load the SKILL.md from `riffcast skill --print` as a skill bundle in your runtime.";

export function printVersion(): void {
  process.stdout.write(`riffcast ${VERSION}\n`);
}

export function printHelp(): void {
  process.stdout.write(`riffcast — code-driven design artifact generator (v${VERSION})

${AGENT_LINE}

USAGE:
  riffcast <command> [options]

COMMANDS:
  render <brief> <sourceDir>   Render a brief to MP4 via Remotion
  review <artifact> <brief>    Score an artifact against the 5-dimension rubric
  init                          Scaffold a starter project in cwd
  doctor                        Check system prerequisites
  mcp                           Boot the stdio MCP server (subcommand entry)
  skill [--print | --bundle]    Discover the @riffcast/skill bundle

GLOBAL OPTIONS:
  --version                     Print version and exit
  --help                        Print this help and exit

Run \`riffcast <command> --help\` for command-specific help.
`);
}

export function printCommandHelp(command: string): void {
  const text = COMMAND_HELP[command];
  if (text) {
    process.stdout.write(text);
  } else {
    process.stderr.write(`riffcast: unknown command "${command}"\n`);
    process.exit(1);
  }
}

const COMMAND_HELP: Record<string, string> = {
  render: `riffcast render <brief.md> <sourceDir> [--cwd=<dir>]

Renders the brief to MP4 via Remotion. Writes the output path to stdout on success.
Exits 1 on user error (invalid brief), 2 on system error.
`,
  review: `riffcast review <artifactPath> <briefPath> [--strict] [--review=<path>]

Parses a review.md sidecar (default: next to the artifact) and prints structured
scores + verdict. The host agent must have authored review.md first.

  --strict     Use threshold min=4 (default min=3).
  --review     Override path to review.md.
`,
  init: `riffcast init [--name=<projectName>]

Scaffolds an opinionated starter project in cwd: package.json, README.md,
brief.md, source/Root.tsx, source/index.ts. Renderable immediately via
\`riffcast render brief.md source/\`.
`,
  doctor: `riffcast doctor [--mcp]

Checks system prerequisites and prints a status line per check.
Exits 0 if all pass, 2 if any fail.

  --mcp        Also check that an MCP host config (Claude Desktop, Cursor) names riffcast.
`,
  mcp: `riffcast mcp

Boots the stdio MCP server. The server speaks JSON-RPC over stdin/stdout.
Intended to be spawned by an MCP host (Claude Desktop, Cursor, Continue);
not a long-running daemon.
`,
  skill: `riffcast skill [--print | --bundle]

Default     Print the absolute path to the installed SKILL.md (one line, stdout).
--print     Cat the SKILL.md content to stdout.
--bundle    Print the absolute path to the bundle directory (parent of SKILL.md).

Exits 2 if the bundle is unreachable.
`,
};
