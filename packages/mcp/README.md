# @riffcast/mcp

Stdio MCP server exposing RiffCast as four tools for any MCP-capable host (Claude Desktop, Cursor MCP, Continue, anything that speaks MCP v1).

## Tools

| Tool | Purpose |
|---|---|
| `riffcast_skill` | Returns the `@riffcast/skill` bundle (SKILL.md + references + templates). Call this first; the host loads the returned content as a skill so subsequent calls follow the documented flow. |
| `riffcast_render` | Render a brief to MP4 via `@riffcast/core`. Returns the absolute output path — never inlines bytes (multi-MB MP4s blow context budgets). |
| `riffcast_review` | Parse a 5-dimension `review.md` sidecar (next to the artifact) and return the structured Review with verdict (ship/iterate). Core never calls an LLM; the host writes the review first using the rubric. |
| `riffcast_propose_directions` | Given a brief, return N (1–3) candidate directions (vocabulary + mood + motion summary) for the host agent to pitch. v0.1 is deterministic — no LLM. |

## Install (workspace dev)

```bash
bun install
```

The `riffcast-mcp` bin is wired in `package.json` to `./src/index.ts` and runs under Bun.

## Wire into Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) and add:

```json
{
  "mcpServers": {
    "riffcast": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/riffcast/packages/mcp/src/index.ts"]
    }
  }
}
```

Restart Claude Desktop. The four `riffcast_*` tools should appear in its tool palette.

## Wire into Cursor MCP / Continue

Both honor the same JSON shape under their respective config paths. Use the same `command` + `args` block above.

## Local smoke test

```bash
# From the repo root:
bun run packages/mcp/src/index.ts
# (Server stays alive on stdio; press Ctrl-C to exit. Talk to it with any MCP client.)
```

## Architecture notes

- v1 SDK pinned: `@modelcontextprotocol/sdk@^1.29.0`. v2 alpha (`@modelcontextprotocol/server`) is OUT for v0.1.
- Transport is `StdioServerTransport`. HTTP / SSE are out for v0.1.
- Tools are thin wrappers around `@riffcast/core` — no LLM calls, no business logic.
- LOC budget: ≤ 350 non-blank-non-comment lines across `src/`. Current: 299.
