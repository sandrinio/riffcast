# Design Vocabularies

The three v0.1 vocabularies and the schema they share. The host AI agent reads these to author Remotion scenes (animations) and — in v0.2 + — React-SVG infographics and Slidev decks.

## The three v0.1 vocabularies

| File | Name | Mood | Pick when |
|---|---|---|---|
| [`01-modern-clean.md`](./01-modern-clean.md) | `modern-clean` | Restrained, technical, considered. Off-black canvas, off-white type, three accents. | Default. Developer-facing content, product animations, anything where rigor matters more than personality. |
| [`02-editorial.md`](./02-editorial.md) | `editorial` | Magazine-grade, text-driven, measured. Warm cream canvas, display + body serifs. | Long-form content, talks, investor decks with gravitas, annual reports, photo-led infographics. |
| [`03-playful.md`](./03-playful.md) | `playful` | Energetic, bright canvas, saturated accents, bounce-as-punctuation. | Product launches, hype reels, consumer-marketing surfaces, social clips, onboarding. Tech-product polish — not children's app. |

The fourth Tone option in the brief — `let-me-see-options` — instructs the host agent to propose 1–3 stylistic directions before committing. It is a flow-control flag, not a vocabulary.

## Token block schema

Every vocabulary file leads with a YAML frontmatter block parsable by `@riffcast/core`'s `loadVocabulary()` (Zod-validated). The schema:

```yaml
name: <one of: modern-clean | editorial | playful>
default_mood: <string — one or two sentences capturing the feel>
colors:
  bg: "#RRGGBB"           # canvas — must meet AA contrast against fg
  fg: "#RRGGBB"           # primary text + high-contrast strokes
  dim: "#RRGGBB"          # secondary text (captions, supporting copy)
  accent_primary: "#RRGGBB"
  accent_secondary: "#RRGGBB"
  accent_tertiary: "#RRGGBB"
typography:
  display: { family: <string>, weight: <number>, tracking: <number?> }
  body:    { family: <string>, weight: <number>, tracking: <number?> }
  mono:    { family: <string>, weight: <number>, tracking: <number?> }
  scale: <number — typographic ratio (e.g., 1.25, 1.333)>
motion:
  spring_default:
    damping: <number>     # Remotion spring config — typical 10–25
    stiffness: <number>   # typical 70–120
  duration_default_ms: <number>
  easing_curve: <string — CSS easing or "spring">
```

Hex colors must match `^#[0-9a-fA-F]{6}$`. Anything else fails Zod validation and `loadVocabulary` throws `RiffcastError(phase="vocabulary", code="INVALID_TOKEN_BLOCK")`.

## Type stacks

All three vocabularies load fonts via `@remotion/google-fonts`:

| Vocabulary | Display | Body | Mono |
|---|---|---|---|
| modern-clean | Inter 700 | Inter 400 | JetBrains Mono 400 |
| editorial | Playfair Display 700 | Lora 400 | JetBrains Mono 400 |
| playful | Space Grotesk 700 | Inter 400 | JetBrains Mono 500 |

System fonts are not used. Per resolved Q5 (EPIC-002), `@remotion/google-fonts` is the load path — system stack hurt brand distinction in early prototyping.

## Cross-vocabulary rules

These hold across all three vocabularies:

1. **No vocabulary defines `success`, `warning`, or `error` tokens** in v0.1. Those are UI-state colors, irrelevant for animation/deck/infographic outputs. Will be added in v0.4 when prototypes (UI surfaces) ship.
2. **Each vocabulary's `bg + fg` pair must meet WCAG AA contrast (4.5:1 body)**, which is enforced by review (EPIC-003), not by Zod.
3. **Vocabularies are independent of `Format`.** A `modern-clean editorial-deck` and a `modern-clean infographic` are valid combinations. The brief's `Format` × `Kind` axes drive structure; the vocabulary drives style. Compose freely.
4. **No vocabulary specifies imagery or photography** beyond rules of treatment (e.g., editorial's sepia tinting). Brand assets and brand imagery are user-provided via the brief's Mandatories section, never hard-coded into the vocabulary.

## Authoring a new vocabulary (v0.2 +)

Out of scope for v0.1. The Plugin System for third-party vocabularies is on the v0.4 + roadmap. Until then, vocabulary additions require an Epic in this repo's planning surface.
