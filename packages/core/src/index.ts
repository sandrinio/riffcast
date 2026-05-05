export const VERSION = "0.0.0";

export type {
  Brief,
  BriefFrontmatter,
  BriefStatus,
  AmbiguityLevel,
  AnimationKind,
  AnimationSpecs,
  DimensionName,
  DimensionScore,
  DimensionScoreValue,
  FormatType,
  RenderError,
  RenderPhase,
  RenderResult,
  Review,
  ReviewParseError,
  ReviewParseResult,
  ValidationError,
  ValidationResult,
  Verdict,
  VerdictThreshold,
  Vocabulary,
  VocabularyName,
} from "./types.ts";

export {
  ANIMATION_KINDS,
  DIMENSION_NAMES,
  FORMAT_TYPES,
  VOCABULARY_NAMES,
} from "./types.ts";

export { parseBrief, validateBrief } from "./brief.ts";
export { loadVocabulary, findVocabularyFile, RiffcastError } from "./vocabulary.ts";
export { renderAnimation } from "./render.ts";
export { resolveOutputDir, saveBrief, slugify, dateStamp } from "./paths.ts";
export {
  DEFAULT_VERDICT_THRESHOLD,
  STRICT_VERDICT_THRESHOLD,
  SUGGESTION_MAX_CHARS,
  formatReview,
  parseReview,
  verdict,
} from "./review.ts";
