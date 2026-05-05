import matter from "gray-matter";
import { z } from "zod";
import {
  ANIMATION_KINDS,
  FORMAT_TYPES,
  VOCABULARY_NAMES,
  type Brief,
  type BriefFrontmatter,
  type ValidationError,
  type ValidationResult,
} from "./types.ts";

const SpecsSchema = z.object({
  duration_seconds: z.number().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  fps: z.number().int().positive(),
  output_formats: z.array(z.enum(["mp4", "gif", "webm"])).min(1),
  codec: z.enum(["h264", "h265", "vp9"]).optional(),
});

const FrontmatterSchema = z.object({
  brief_id: z.string().min(1),
  format: z.enum(FORMAT_TYPES),
  kind: z.string().min(1),
  vocabulary: z.enum(VOCABULARY_NAMES),
  specs: SpecsSchema,
  status: z.enum(["Draft", "Ready", "Rendered", "Iterating"]),
  ambiguity: z.enum(["🔴 High", "🟡 Medium", "🟢 Green"]),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
  rendered_at: z.string().nullable().default(null),
  output_dir: z.string().optional(),
  output_path: z.string().nullable().default(null),
});

const REQUIRED_BODY_SECTIONS = ["Goal", "Message", "Audience"] as const;

function extractSection(body: string, heading: string): string | null {
  const re = new RegExp(`^##\\s+\\d+\\.\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "m");
  const m = body.match(re);
  if (!m) return null;
  return m[1].trim();
}

function extractListSection(body: string, heading: string): string[] {
  const text = extractSection(body, heading);
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter((line) => line.length > 0 && !/^none\.?$/i.test(line));
}

export function parseBrief(markdown: string): ValidationResult {
  const errors: ValidationError[] = [];

  let parsed: { data: unknown; content: string };
  try {
    parsed = matter(markdown);
  } catch (err) {
    return {
      ok: false,
      errors: [
        {
          field: "frontmatter",
          reason: `failed to parse YAML frontmatter: ${
            err instanceof Error ? err.message : String(err)
          }`,
        },
      ],
    };
  }

  const fmResult = FrontmatterSchema.safeParse(parsed.data);
  if (!fmResult.success) {
    for (const issue of fmResult.error.issues) {
      errors.push({
        field: issue.path.join(".") || "frontmatter",
        reason: issue.message,
      });
    }
  }

  for (const heading of REQUIRED_BODY_SECTIONS) {
    const text = extractSection(parsed.content, heading);
    if (!text) {
      errors.push({ field: heading.toLowerCase(), reason: "required section missing" });
    }
  }

  if (fmResult.success) {
    if (
      fmResult.data.format === "animation" &&
      !ANIMATION_KINDS.includes(fmResult.data.kind as (typeof ANIMATION_KINDS)[number])
    ) {
      errors.push({
        field: "kind",
        reason: `kind "${fmResult.data.kind}" is not valid for format=animation; expected one of ${ANIMATION_KINDS.join(", ")}`,
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const fm = fmResult.success ? (fmResult.data as BriefFrontmatter) : null;
  if (!fm) {
    return { ok: false, errors };
  }

  const brief: Brief = {
    frontmatter: fm,
    goal: extractSection(parsed.content, "Goal") ?? "",
    message: extractSection(parsed.content, "Message") ?? "",
    audience: extractSection(parsed.content, "Audience") ?? "",
    mandatories: extractListSection(parsed.content, "Mandatories"),
    references: extractListSection(parsed.content, "References"),
    out_of_scope: extractListSection(parsed.content, "Out of Scope"),
    raw_markdown: markdown,
  };

  return { ok: true, brief };
}

export function validateBrief(brief: Brief): ValidationResult {
  const errors: ValidationError[] = [];

  if (brief.frontmatter.ambiguity !== "🟢 Green") {
    errors.push({
      field: "ambiguity",
      reason: `brief is not 🟢 Green (currently ${brief.frontmatter.ambiguity}); render is gated until brief is locked`,
    });
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, brief };
}
