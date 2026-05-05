#!/usr/bin/env bun
import { parseArgs } from "./parser.ts";
import { printCommandHelp, printHelp, printVersion } from "./help.ts";
import { skillCommand } from "./commands/skill.ts";
import { mcpCommand } from "./commands/mcp.ts";
import { renderCommand } from "./commands/render.ts";
import { reviewCommand } from "./commands/review.ts";
import { doctorCommand } from "./commands/doctor.ts";

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === null) {
    if (args.flags.version) {
      printVersion();
      return 0;
    }
    printHelp();
    return 0;
  }

  if (args.flags.help) {
    printCommandHelp(args.command);
    return 0;
  }

  switch (args.command) {
    case "skill":
      return skillCommand(args);
    case "mcp":
      return mcpCommand(args);
    case "render":
      return renderCommand(args);
    case "review":
      return reviewCommand(args);
    case "doctor":
      return doctorCommand(args);
    case "init":
      process.stderr.write("riffcast: \"init\" not yet implemented in this build.\n");
      return 2;
    default:
      process.stderr.write(`riffcast: unknown command "${args.command}". Run \`riffcast --help\`.\n`);
      return 1;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    process.stderr.write(`riffcast: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(2);
  });
