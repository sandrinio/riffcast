export const VERSION = "0.0.0";

export type {
  Brief,
  BriefFrontmatter,
  BriefStatus,
  AmbiguityLevel,
  AnimationKind,
  AnimationSpecs,
  FormatType,
  RenderError,
  RenderPhase,
  RenderResult,
  ValidationError,
  ValidationResult,
  Vocabulary,
  VocabularyName,
} from "./types.ts";

export {
  ANIMATION_KINDS,
  FORMAT_TYPES,
  VOCABULARY_NAMES,
} from "./types.ts";

export { parseBrief, validateBrief } from "./brief.ts";
export { loadVocabulary, findVocabularyFile, RiffcastError } from "./vocabulary.ts";
export { renderAnimation } from "./render.ts";
export { resolveOutputDir, saveBrief, slugify, dateStamp } from "./paths.ts";
