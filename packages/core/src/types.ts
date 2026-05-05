export const VOCABULARY_NAMES = [
  "modern-clean",
  "editorial",
  "playful",
  "let-me-see-options",
] as const;
export type VocabularyName = (typeof VOCABULARY_NAMES)[number];

export const FORMAT_TYPES = ["animation", "deck", "infographic", "prototype"] as const;
export type FormatType = (typeof FORMAT_TYPES)[number];

export const ANIMATION_KINDS = [
  "explainer",
  "launch",
  "hype-reel",
  "tutorial",
  "loop",
  "social-clip",
] as const;
export type AnimationKind = (typeof ANIMATION_KINDS)[number];

export type BriefStatus = "Draft" | "Ready" | "Rendered" | "Iterating";
export type AmbiguityLevel = "🔴 High" | "🟡 Medium" | "🟢 Green";

export type AnimationSpecs = {
  duration_seconds: number;
  width: number;
  height: number;
  fps: number;
  output_formats: ReadonlyArray<"mp4" | "gif" | "webm">;
  codec?: "h264" | "h265" | "vp9";
};

export type BriefFrontmatter = {
  brief_id: string;
  format: FormatType;
  kind: string;
  vocabulary: VocabularyName;
  specs: AnimationSpecs;
  status: BriefStatus;
  ambiguity: AmbiguityLevel;
  created_at: string;
  updated_at: string;
  rendered_at: string | null;
  output_dir?: string;
  output_path: string | null;
};

export type Brief = {
  frontmatter: BriefFrontmatter;
  goal: string;
  message: string;
  audience: string;
  mandatories: string[];
  references: string[];
  out_of_scope: string[];
  raw_markdown: string;
};

export type ValidationError = {
  field: string;
  reason: string;
};

export type ValidationResult =
  | { ok: true; brief: Brief }
  | { ok: false; errors: ValidationError[] };

export type Vocabulary = {
  name: VocabularyName;
  default_mood: string;
  colors: {
    bg: string;
    fg: string;
    dim: string;
    accent_primary: string;
    accent_secondary: string;
    accent_tertiary: string;
  };
  typography: {
    display: { family: string; weight: number; tracking?: number };
    body: { family: string; weight: number; tracking?: number };
    mono: { family: string; weight: number; tracking?: number };
    scale: number;
  };
  motion: {
    spring_default: { damping: number; stiffness: number };
    duration_default_ms: number;
    easing_curve: string;
  };
  raw_markdown: string;
};

export type RenderPhase = "parse" | "validate" | "vocabulary" | "render" | "save";

export type RenderError = {
  phase: RenderPhase;
  code: string;
  message: string;
  stderr?: string;
};

export type RenderResult =
  | { ok: true; outputPath: string; outputDir: string; durationMs: number }
  | { ok: false; error: RenderError };

export const DIMENSION_NAMES = [
  "composition",
  "color",
  "typography",
  "motion",
  "substance",
] as const;
export type DimensionName = (typeof DIMENSION_NAMES)[number];

export type DimensionScoreValue = 1 | 2 | 3 | 4 | 5;

export type DimensionScore = {
  dimension: DimensionName;
  score: DimensionScoreValue;
  suggestion: string;
};

export type Verdict = "ship" | "iterate";

export type Review = {
  artifact_path: string;
  reviewed_at: string;
  scores: DimensionScore[];
  overall_verdict: Verdict;
};

export type ReviewParseError = {
  field: string;
  reason: string;
};

export type ReviewParseResult =
  | { ok: true; review: Review }
  | { ok: false; errors: ReviewParseError[] };

export type VerdictThreshold = {
  min: DimensionScoreValue;
};
