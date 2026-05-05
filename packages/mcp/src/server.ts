import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VERSION } from "@riffcast/core";
import {
  renderHandler,
  renderInputShape,
  renderToolDescription,
  renderToolName,
} from "./tools/render.ts";
import {
  reviewHandler,
  reviewInputShape,
  reviewToolDescription,
  reviewToolName,
} from "./tools/review.ts";
import {
  proposeDirectionsHandler,
  proposeDirectionsInputShape,
  proposeDirectionsToolDescription,
  proposeDirectionsToolName,
} from "./tools/propose-directions.ts";
import {
  skillHandler,
  skillInputShape,
  skillToolDescription,
  skillToolName,
} from "./tools/skill.ts";

export function buildServer(): McpServer {
  const server = new McpServer({ name: "riffcast", version: VERSION });
  server.tool(renderToolName, renderToolDescription, renderInputShape, renderHandler);
  server.tool(reviewToolName, reviewToolDescription, reviewInputShape, reviewHandler);
  server.tool(
    proposeDirectionsToolName,
    proposeDirectionsToolDescription,
    proposeDirectionsInputShape,
    proposeDirectionsHandler,
  );
  server.tool(skillToolName, skillToolDescription, skillInputShape, skillHandler);
  return server;
}

export const TOOL_NAMES = [
  renderToolName,
  reviewToolName,
  proposeDirectionsToolName,
  skillToolName,
] as const;
