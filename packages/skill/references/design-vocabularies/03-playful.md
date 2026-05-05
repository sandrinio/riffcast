---
name: playful
default_mood: Energetic but considered. Saturated palette on a bright canvas, geometric display sans with personality, motion that uses bounce as punctuation rather than as filler. Tech-product polish, not children's app.
colors:
  bg: "#fafafa"
  fg: "#0f0f23"
  dim: "#5e5e7e"
  accent_primary: "#ff5c4a"
  accent_secondary: "#2dd4bf"
  accent_tertiary: "#fbbf24"
typography:
  display: { family: "Space Grotesk", weight: 700, tracking: -0.03 }
  body: { family: "Inter", weight: 400, tracking: 0 }
  mono: { family: "JetBrains Mono", weight: 500, tracking: 0 }
  scale: 1.333
motion:
  spring_default: { damping: 10, stiffness: 120 }
  duration_default_ms: 500
  easing_curve: "cubic-bezier(0.34, 1.56, 0.64, 1)"
---

# Playful

The energetic vocabulary. Pick this when the artifact wants to feel like a product launch, a consumer brand moment, or a marketing surface — without slipping into childish territory.

## Mood

Playful is **not** "fun." Fun is the trap — saturated rainbows, comic typography, exclamation marks, motion for motion's sake. That register exists, but it isn't this vocabulary.

Playful is the register of a confident consumer-tech brand at launch: bright but considered canvas, type with personality but discipline, motion that bounces but only at the moments that matter. Think: a sneaker drop landing page; a fintech app's onboarding hero; a SaaS marketing site at peak. Vibrant, but the kind of vibrant that has been edited.

The bright `bg` is intentional. Modern-clean and editorial both anchor on darker / warmer canvases. Playful flips: the canvas is fresh and bright, and the saturated accents pop against it. That contrast — bright bg + saturated accents — is the move.

## Colors

| Token | Value | Contrast vs bg | Use |
|---|---|---|---|
| `bg` | `#fafafa` | — | Canvas. Very light gray, nearly white but not pure. Pure `#ffffff` is too clinical for the playful register; `#fafafa` carries the brightness without the medical-grade quality. |
| `fg` | `#0f0f23` | 17.1:1 (AAA) | Primary type. Deep navy-black, slightly cool. Reads as ink against paper but with an electric undertone — pairs with the saturated accents better than pure black would. |
| `dim` | `#5e5e7e` | 5.2:1 (AA body) | Captions, secondary text. Cool gray that holds the navy spine. |
| `accent_primary` | `#ff5c4a` (coral) | 3.6:1 (AA large) | The hero accent — the moment of energy. Saturated red-orange that reads as warmth + urgency. Reserve for big-text emphasis, fill backgrounds for callout shapes, and the climax frame. **Not for body text** (contrast too low). |
| `accent_secondary` | `#2dd4bf` (mint) | 1.9:1 (decorative only) | Decorative fills, illustrative shapes, friendly UI moments. **Never for text** — contrast against `bg` is too low; reserve for color fills behind dark `fg` text or as standalone shape fills. |
| `accent_tertiary` | `#fbbf24` (warm yellow) | 1.7:1 (decorative only) | Punctuation, sun moments, "tap here" highlights. **Never for text on bg.** Same constraint as mint. |

**Color rules:**
1. Playful uses three accents because the register thrives on energy. Modern-clean's two-accent rule does not apply here.
2. **Text contrast discipline.** Coral, mint, and yellow all fail body-text contrast. Use them as color FILLS (behind dark text) or as decorative SHAPES (no text inside) — never as text colors over `bg`. This is the rule that prevents playful from sliding into illegibility.
3. **Saturation is the vocabulary.** Don't desaturate the accents to "tone them down." If the artifact needs less energy, switch to modern-clean.
4. **Keep `bg` light.** Don't introduce a "dark mode playful." That register collapses into either modern-clean (if dark + restrained) or party-poster (if dark + saturated) — neither is this vocabulary.

## Typography

**Stack:** Space Grotesk (display), Inter (body), JetBrains Mono (mono, weight 500). All load via `@remotion/google-fonts`.

**Pairing rationale.** Space Grotesk is geometric-but-quirky — it has the personality (angular `a`, characteristic `g`, expressive `R` leg) that modern-clean's Inter intentionally lacks. Pairs with Inter for body to keep long copy neutral and readable; the personality lives in the headlines, not in the paragraphs. JetBrains Mono at weight 500 (slightly heavier than the modern-clean / editorial use) carries small bursts of code or label text that need to feel friendly rather than systemic.

**Scale:** 1.333 (perfect fourth). Generous like editorial — playful needs breathing room around its expressive display type.

Sizes from a 16px body baseline:
- caption: 12px
- body: 16px
- subhead: 21.3px
- head: 28.4px
- display-1: 37.9px
- display-2: 50.5px
- display-3: 67.3px
- display-4: 89.7px
- display-5: 119.6px

**Tracking:** display tracks tight (-0.03 em) for confidence. Body 0. Display sizes ≥ 89.7px may track even tighter (-0.04 em) — Space Grotesk holds together at high tracking-negatives.

**Weight rules:**
- Display: 700. Variable-weight transitions (e.g., 400 → 700 mid-animation) are an allowed move in this vocabulary; reserve for one transition per artifact.
- Body: 400. Use 500 for emphasis instead of italic — Inter italic carries less personality than weight-shift in playful.
- Avoid: oblique cuts, condensed widths, decorative fonts (Lobster, Pacifico, etc.). Personality lives in motion + color, not in script type.

## Motion

The vocabulary's motion target: **bouncy as punctuation, not as default**. The bounce is what differentiates playful from modern-clean; abuse it and the vocabulary collapses into "kids' app."

1. **Lower damping (10), higher stiffness (120).** Visible overshoot on entrances — the element settles past its target and returns. ~5% overshoot is right; >15% reads as cartoon.
2. **Faster default duration (500ms).** Playful is snappier than modern-clean (600ms) and much snappier than editorial (800ms). The energy comes from pace.
3. **Stagger by 40–60ms.** Tighter than modern-clean (60–80ms). Sibling elements feel like a quick burst rather than a sequential reveal.
4. **The bounce belongs on the climax.** The headline lands with overshoot; the wordmark settles in cleanly. Reserve overshoot for the moment that matters — the product reveal, the call-to-action — not for every entrance.
5. **Color transitions are allowed.** Modern-clean and editorial avoid mid-motion color shifts (they read as flicker). Playful welcomes them: `accent_primary` shifting to `accent_secondary` over a 600ms transition reads as energy.
6. **Cursor and pointer moves are vocabulary-native.** A mouse cursor that animates in to "click" something on screen is allowed in playful (and only in playful) — it carries product-marketing semantics that fit the register.
7. **No looping background motion.** Particle systems, drifting shapes, and continuous loops are off-limits even in playful. The bounce is reserved punctuation; if motion never resolves, the punctuation loses meaning.

## Layout Heuristics

1. **Asymmetric, with energy lines.** Playful compositions thrive on diagonal rhythm — a headline that ranges left while a callout shape angles up-and-to-the-right. Pure horizontal/vertical grids feel inert in this vocabulary.
2. **Color-fill shapes carry information.** A coral pill behind dark text, a mint blob behind a number, a yellow burst behind a "new" label — these are vocabulary-native. They are NOT decoration; they are composition primitives.
3. **Negative space stays generous.** Even at peak energy, ≥10% of the shorter dimension as outside margin. Playful's energy comes from motion + color contrast, not from packing the frame.
4. **One color-fill shape per element.** A headline gets a coral pill; the sub-deck does not also get one. Stacking color fills creates visual noise.
5. **Type can rotate.** A small caption can sit at -7° rotation against a color-fill shape. Reserve for one moment per artifact. Modern-clean and editorial forbid this entirely; playful permits it as punctuation.

## Do / Don't

**Do** — open with a coral color-fill rectangle filling the bottom 40% of the frame, dark `fg` headline ranged left across both halves, mint sun-burst as decoration in upper-right corner. Three colors, three roles.

**Don't** — fill the entire `bg` with coral and put white text on it. That's a banner ad, not a playful artifact. The bright canvas is the vocabulary; never erase it.

**Do** — let the headline land with 5% overshoot, then settle. The wordmark in the next scene enters cleanly without overshoot. The climax bounces; the resolution doesn't.

**Don't** — bounce every element. The fifth bouncing element is the one that destroys the register.

**Do** — animate a checkmark in `accent_secondary` (mint) appearing on a "completed" moment. Mint is the success color in this vocabulary's lexicon (without being labelled as such — playful doesn't need a `success` token).

**Don't** — pair coral with mint as text-on-fill (mint text on coral fill). The contrast is wrong AND the color story is too loud. Coral fills carry dark `fg` text; mint fills carry dark `fg` text.

**Do** — let a number scale up by 20% on its reveal frame, accompanied by a subtle yellow burst behind it.

**Don't** — confetti effects. Confetti is the failure mode of every playful vocabulary; it reads as "we ran out of ideas."

## When to Use This Vocabulary

- **Product launches** — sneaker drops, app launches, fintech announcements, food-brand reveals.
- **Hype reels and social clips** — short-form (≤15s) marketing content.
- **Onboarding and tutorial flows** for consumer products.
- **Marketing landing-page heroes** in motion form.
- **B2C demo decks** when the audience is end-customers, not engineers.

## When NOT to Use This Vocabulary

- Anything aimed at developers — pick `modern-clean`. Playful's color and motion register read as marketing-fluff to a technical audience.
- Long-form content, decks ≥ 20 slides, anything text-heavy — pick `editorial`. Playful's pace + decoration overwhelm dense text.
- Children's content specifically — playful is "consumer adult"; children's content needs a different vocabulary not yet defined in v0.1. Surface as a Brief Open Question.
- Internal compliance, finance, legal — playful's energy is wrong-register; pick `editorial` for gravitas or `modern-clean` for neutrality.
