export function errorResult(text: string) {
  return { content: [{ type: "text" as const, text }], isError: true };
}

export function msg(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}
