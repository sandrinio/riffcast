export type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError: boolean;
};

export function okResult(text: string): ToolResult {
  return { content: [{ type: "text", text }], isError: false };
}

export function errorResult(text: string): ToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

export function msg(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}
