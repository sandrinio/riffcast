---
name: modern-clean
default_mood: Restrained, technical, considered. Off-black canvas, off-white type, three accents that punctuate without shouting. Motion is fast and damped — confidence without flair.
colors:
  bg: "#0a0a0a"
  fg: "#ededed"
  dim: "#6b6b6b"
  accent_primary: "#7c5cff"
  accent_secondary: "#5cf0ff"
  accent_tertiary: "#ff5c8a"
typography:
  display: { family: "Inter", weight: 700, tracking: -0.04 }
  body: { family: "Inter", weight: 400, tracking: 0 }
  mono: { family: "JetBrains Mono", weight: 400, tracking: 0 }
  scale: 1.25
motion:
  spring_default: { damping: 15, stiffness: 90 }
  duration_default_ms: 600
  easing_curve: "cubic-bezier(0.16, 1, 0.3, 1)"
---

# Modern Clean

The default vocabulary. Pick this when in doubt — it produces output that looks deliberate and contemporary without committing to a specific aesthetic register.

## Mood

A modern technical product makes you trust it. The reasons are mechanical, not emotional: tight typography, generous whitespace, restrained color, motion that resolves cleanly. Modern-clean is that mechanical trust applied as a vocabulary.

It is **not** minimalism for its own sake. Decoration is allowed when it carries information — a colored ring to mark progress, a sparkline, a kbd badge. Decoration is **not** allowed when it is mood-setting only.

## Colors

| Token | Value | Contrast vs bg | Use |
|---|---|---|---|
| `bg` | `#0a0a0a` | — | Canvas. Warm-leaning off-black, never `#000`. Pure black is too cold and clipped. |
| `fg` | `#ededed` | 14.2:1 (AAA) | Primary type and high-contrast strokes. Off-white because pure white over off-black flickers and reads cheaply. |
| `dim` | `#6b6b6b` | 5.18:1 (AA body) | Secondary type — captions, timestamps, supporting copy. Never use for headlines. |
| `accent_primary` | `#7c5cff` (violet) | 5.5:1 | The "default action" color. Use sparingly — once or twice per scene. |
| `accent_secondary` | `#5cf0ff` (cyan) | 12.4:1 | Counter-accent. Pairs with `accent_primary` for two-state highlights (active/inactive, before/after). |
| `accent_tertiary` | `#ff5c8a` (rose) | 6.5:1 | Punctuation only. Reserve for the moment of emphasis — the climax frame, the result reveal. |

**Color rules:**
1. Never put accent text on accent backgrounds. Accents are foreground-on-`bg` only.
2. Never use more than two accents in a single composition. Three accents in one frame is a reveal moment, not a default.
3. Never tint `bg` toward an accent (e.g., `#0e0a14`). Backgrounds stay neutral.

## Typography

**Stack:** Inter (display + body), JetBrains Mono (mono). Both load via `@remotion/google-fonts`.

**Pairing rationale.** Inter is the canonical modern-product typeface — geometric without being cold, with a heavy-weight presence (700) that holds up at display sizes. JetBrains Mono carries code blocks and terminal moments without competing with Inter for personality.

**Scale:** 1.25 (major third). Sizes derive from a 16px body baseline:
- caption: 12.8px
- body: 16px
- subhead: 20px
- head: 25px
- display-1: 31.25px
- display-2: 39.06px
- display-3: 48.83px
- display-4: 61.04px
- display-5: 76.29px

**Tracking:** display tracks tight (-0.04 em) for confidence. Body tracks at 0. Long-form copy may add `letter-spacing: 0.005em` at sizes ≤ 14px for readability.

**Weight rules:**
- Display: 700 only. Avoid 600 (looks unsure) and 800 (looks aggressive).
- Body: 400. Use 500 for emphasis sparingly.
- Italic is allowed but rare. Modern-clean leans roman.

## Motion

The vocabulary's motion target: **decisive, not flashy**. Things move because they need to be in a new place, not to demonstrate they can move.

1. **Spring physics by default, not eased timing.** Use `spring({ damping: 15, stiffness: 90 })` (Remotion `spring` helper) for entrances and emphasis. Reserve CSS easing curves for layout transitions where physics-overshoot would feel wrong.
2. **Damping 12–18 range.** Lower (≤10) reads as bouncy; that belongs in the playful vocabulary. Higher (≥20) reads as draggy.
3. **Stagger by 60–80ms between sibling elements.** Faster (≤40ms) and the eye reads it as simultaneous. Slower (≥120ms) and it reads as a list, not a group.
4. **Hold the final frame for ≥30 frames (1 second at 30fps).** Motion that resolves and immediately leaves cuts the message. Always end on a moment of stillness.
5. **No easing on text appearance.** Use opacity 0→1 with no transform. Text that scales/slides while readers are trying to read it is hostile.
6. **Camera moves are blocked.** Modern-clean has no camera. The frame is fixed. Elements move within the frame.

## Layout Heuristics

1. **One focal point per frame.** If your composition has two focal points, you have two compositions; cut between them with a hard transition or rebuild as a sequence.
2. **Generous outside margins.** Reserve at least 12% of the shorter dimension as outside margin (≥130px on a 1080p frame). Type that touches the edge looks cheap.
3. **Asymmetry beats centered.** Centered compositions feel like default templates. Push the focal point off-center (rule of thirds works). Reserve true center for the wordmark/logo reveal frame only.
4. **Whitespace is the workhorse.** Empty pixels between elements are not "wasted"; they are the rhythm of the composition. If you cannot decide what to add, add space.
5. **Grid: 8px base.** All spacing values are multiples of 8 (8, 16, 24, 32, 48, 64, 96). Off-grid spacing reads as accidental.

## Do / Don't

**Do** — open on a dark canvas with a single line of dim caption (`dim` color, mono font), then introduce the headline (`fg`, display weight 700) with a 600ms spring, then hold for 1 second. Three steps, three colors, one motion.

**Don't** — gradient backgrounds, glow effects, chromatic aberration, lens flares, particle systems. None of those carry information; all of them look like AI defaults.

**Do** — use `accent_primary` to color a single word in a sentence. The colored word is the verb or the noun that matters.

**Don't** — color every accent word in every sentence. The accent stops being an accent and becomes a tic.

**Do** — let the wordmark/logo enter on its own frame, alone, after the message has landed. The brand is the period at the end of the sentence, not the first thing said.

**Don't** — open with the brand. Brand-first opens read as advertising, not communication.

## When to Use This Vocabulary

- **Default for any animation/deck/infographic** when the brief's tone is unspecified.
- **Developer-facing or technical content** — modern-clean is the dialect this audience reads as competent.
- **Product launch animations** that need to feel like a real product, not an illustration of one.
- **Internal review decks** that need to project rigor.

## When NOT to Use This Vocabulary

- Editorial / longform / magazine content — pick `editorial`. The serif voice carries text-density better.
- Consumer-product / lifestyle / brand hype — pick `playful`. Modern-clean's restraint reads as cold for that register.
- Children's content, education-for-kids, gamification — neither modern-clean nor playful is right; defer to a later vocabulary or surface as a Brief Open Question.
