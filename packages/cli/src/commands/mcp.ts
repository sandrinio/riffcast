import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer } from "@riffcast/mcp/server";
import type { ParsedArgs } from "../parser.ts";

export async function mcpCommand(_args: ParsedArgs): Promise<number> {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  await new Promise<void>((resolve) => {
    const prior = transport.onclose;
    transport.onclose = () => {
      prior?.();
      resolve();
    };
  });
  return 0;
}
