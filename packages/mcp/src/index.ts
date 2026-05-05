#!/usr/bin/env bun
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer } from "./server.ts";

const server = buildServer();
const transport = new StdioServerTransport();
await server.connect(transport);
