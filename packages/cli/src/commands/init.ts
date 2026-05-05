import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { ParsedArgs } from "../parser.ts";

const NOW = () => new Date().toISOString();
const FILES = [
  "package.json",
  "README.md",
  "brief.md",
  "tsconfig.json",
  "remotion.config.ts",
  "source/Root.tsx",
  "source/Hello.tsx",
  "source/index.ts",
];

export async function initCommand(args: ParsedArgs): Promise<number> {
  const cwd = typeof args.flags.cwd === "string" ? args.flags.cwd : process.cwd();
  const name =
    typeof args.flags.name === "string"
      ? args.flags.name
      : args.positional[0] ?? "riffcast-project";
  const force = args.flags.force === true;

  const target = resolve(cwd);
  let entries: string[] = [];
  try {
    entries = await readdir(target);
  } catch {
    // target doesn't exist; create it
    await mkdir(target, { recursive: true });
  }
  if (!force) {
    const collisions = FILES.filter((f) => entries.includes(f.split("/")[0]));
    if (collisions.length > 0) {
      process.stderr.write(
        `riffcast init: refusing to overwrite existing files in ${target}: ${collisions.join(", ")}\nPass --force to overwrite.\n`,
      );
      return 1;
    }
  }

  await mkdir(join(target, "source"), { recursive: true });
  await writeFile(join(target, "package.json"), packageJson(name));
  await writeFile(join(target, "README.md"), readme(name));
  await writeFile(join(target, "brief.md"), brief(name));
  await writeFile(join(target, "tsconfig.json"), tsconfig());
  await writeFile(join(target, "remotion.config.ts"), remotionConfig());
  await writeFile(join(target, "source/Root.tsx"), rootTsx());
  await writeFile(join(target, "source/Hello.tsx"), helloTsx());
  await writeFile(join(target, "source/index.ts"), indexTs());

  process.stdout.write(
    `Scaffolded ${name} in ${target}\n\nNext steps:\n  cd ${target}\n  bun install\n  riffcast render brief.md source/\n`,
  );
  return 0;
}

function packageJson(name: string): string {
  return `${JSON.stringify(
    {
      name,
      version: "0.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "remotion studio",
        render: "remotion render Hello out/hello.mp4",
        typecheck: "tsc --noEmit",
      },
      dependencies: {
        "@remotion/cli": "^4.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        remotion: "^4.0.0",
      },
      devDependencies: {
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        typescript: "^5.4.0",
      },
    },
    null,
    2,
  )}\n`;
}

function readme(name: string): string {
  return `# ${name}

Scaffolded by \`riffcast init\`.

## Render

\`\`\`bash
bun install
riffcast render brief.md source/
\`\`\`

The MP4 lands under \`riffcast-out/\` next to a copy of \`brief.md\`.

## Iterate

Edit \`source/Hello.tsx\` and re-run \`riffcast render\`. Iterate the brief in \`brief.md\` (keep ambiguity 🟢 before re-rendering).
`;
}

function brief(name: string): string {
  return `---
brief_id: "${NOW().slice(0, 10)}-${name}-hello"
format: "animation"
kind: "explainer"
vocabulary: "modern-clean"
specs:
  duration_seconds: 5
  width: 1280
  height: 720
  fps: 30
  output_formats: ["mp4"]
status: "Ready"
ambiguity: "🟢 Green"
created_at: "${NOW()}"
updated_at: "${NOW()}"
rendered_at: null
output_path: null
---

# Brief

## 1. Goal
Render a hello-world animation that proves the toolchain works.

## 2. Message
RiffCast turns a one-sentence brief into a finished animation.

## 3. Audience
The person who just ran \`riffcast init\` for the first time.

## 4. Format
Animation

## 5. Tone
modern-clean

## 6. Mandatories
- Display the project name on screen.

## 7. References
- None.

## 8. Out of Scope
- Audio.
`;
}

function tsconfig(): string {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: true,
        types: ["react"],
      },
      include: ["source"],
    },
    null,
    2,
  )}\n`;
}

function remotionConfig(): string {
  return `import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setEntryPoint("source/index.ts");
`;
}

function rootTsx(): string {
  return `import { Composition } from "remotion";
import { Hello } from "./Hello";

export const Root = () => (
  <Composition
    id="Hello"
    component={Hello}
    durationInFrames={150}
    fps={30}
    width={1280}
    height={720}
  />
);
`;
}

function helloTsx(): string {
  return `import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Hello: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 60], [16, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        color: "#ededed",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "-apple-system, system-ui, sans-serif",
        fontSize: 96,
        fontWeight: 600,
        letterSpacing: -2,
      }}
    >
      <div style={{ opacity, transform: \`translateY(\${y}px)\` }}>RiffCast</div>
    </AbsoluteFill>
  );
};
`;
}

function indexTs(): string {
  return `import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);
`;
}
