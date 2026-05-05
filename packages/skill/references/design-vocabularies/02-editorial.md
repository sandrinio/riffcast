---
name: editorial
default_mood: Considered, text-driven, magazine-grade. Warm cream canvas instead of off-black or stark white. Display serif for headlines, body serif for breath. Motion is measured — long lines, soft entrances, deliberate holds.
colors:
  bg: "#f5f1e8"
  fg: "#1a1a1a"
  dim: "#6b6353"
  accent_primary: "#c5392a"
  accent_secondary: "#1d4ed8"
  accent_tertiary: "#8b5a2b"
typography:
  display: { family: "Playfair Display", weight: 700, tracking: -0.02 }
  body: { family: "Lora", weight: 400, tracking: 0 }
  mono: { family: "JetBrains Mono", weight: 400, tracking: 0 }
  scale: 1.333
motion:
  spring_default: { damping: 25, stiffness: 70 }
  duration_default_ms: 800
  easing_curve: "cubic-bezier(0.4, 0, 0.2, 1)"
---

# Editorial

The text-driven vocabulary. Pick this when the artifact carries a written argument or a body of content that wants to be read, not consumed.

## Mood

Editorial design carries authority through restraint and craft. A magazine spread does not announce itself with a logo flare; it announces itself with a confident headline, a generous figure, and a single column of body type that knows where to break. This vocabulary translates that posture into motion graphics, decks, and infographics.

The cream canvas is the move. Off-black on warm cream reads as ink on paper, which carries 500 years of "this is something to read" semantic weight. Modern-clean's off-black canvas reads as a screen; editorial's cream canvas reads as a page. That is the entire register shift.

## Colors

| Token | Value | Contrast vs bg | Use |
|---|---|---|---|
| `bg` | `#f5f1e8` | — | Canvas. Warm cream, leaning unbleached newsprint. Never pure white (`#ffffff`) — that destroys the editorial register. |
| `fg` | `#1a1a1a` | 16.0:1 (AAA) | Primary type. Rich ink-black, slightly warm. Never pure `#000` — too cold against the cream. |
| `dim` | `#6b6353` | 5.4:1 (AA body) | Captions, photo credits, datelines, footnotes. Warm gray-brown that lives on the same color spine as the cream. |
| `accent_primary` | `#c5392a` (vermilion) | 4.6:1 | The accent of editorial design — the magazine pull-quote red, the section divider. Use for one word, one figure, one rule line. |
| `accent_secondary` | `#1d4ed8` (royal blue) | 6.4:1 | Links, references, citation marks. Anything the reader could "follow" if this were a hyperlinked artifact. |
| `accent_tertiary` | `#8b5a2b` (sepia) | 4.7:1 | Photo tinting, secondary punctuation, dropped capitals. The "hand-typeset" color. |

**Color rules:**
1. The vermilion is the **only** color reserved for emotional emphasis. Use it once per artifact, not once per scene.
2. Royal blue is hyperlink-coded. Don't use it for general headlines or it'll read as a clickable that isn't.
3. Sepia is for photographic tinting and dropped caps. Don't use it for body type — it's too close to `dim` and creates muddy hierarchy.
4. The cream `bg` is **warmer** than off-white. Resist the impulse to "clean it up" toward `#fafafa`. The warmth is the vocabulary.

## Typography

**Stack:** Playfair Display (display), Lora (body), JetBrains Mono (mono). All load via `@remotion/google-fonts`.

**Pairing rationale.** Playfair Display is the canonical contemporary editorial display serif — high contrast between thick and thin strokes, classical proportions, generous descenders. Pairs with Lora (body): a slab-serif-leaning text face with low contrast that reads cleanly in long passages. Both are open-license, broadly available, and recognized by readers as "magazine voice."

**Scale:** 1.333 (perfect fourth). Editorial wants more breathing room between sizes than modern-clean's 1.25 — generous scale steps make hierarchy feel intentional rather than algorithmic.

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

**Tracking:** display tracks slightly tight (-0.02 em). Body is 0. Headlines at display-3 and larger may benefit from optical kerning passes — the Q-A pair, the f-l ligature, the W-A pair are common offenders.

**Weight rules:**
- Display: 700 for primary headlines. 400 for sub-decks and pull quotes (the lighter weight is intentional: it slows the reader down).
- Body: 400 only. Italic is welcome — editorial loves emphasis-by-italic, not emphasis-by-bold. Bold body weight (700) is reserved for run-in lead-ins and lookups.
- Drop caps: display 700, 4-line drop, paired with body 400 for the first sentence in small caps via OpenType.

## Motion

The vocabulary's motion target: **measured and unhurried**. Editorial readers are willing to wait; the design respects their time by not stealing it with motion that says "look at me."

1. **Longer durations than modern-clean.** Default 800ms (vs modern-clean's 600ms). Headlines that fade in over 1.2 seconds read as deliberate, not slow.
2. **Higher damping (25), lower stiffness (70).** The result is a gentle settle — no overshoot, no bounce. If the motion feels "swung," it has overshot the editorial register.
3. **Type ladders, not type drops.** Long headlines compose line-by-line, top-to-bottom, with 200ms stagger between lines. Each line fades in fully resolved before the next begins.
4. **Cross-fades, not hard cuts.** Scene transitions cross-fade over 600ms. Hard cuts read as commercial; editorial reads as "turning a page."
5. **Photographic restraint.** If a figure animates, it does so once: a 5% scale-up over 4 seconds (Ken Burns motion). Never zoom out. Never pan-and-scan.
6. **Pull-quote moments hold for ≥3 seconds.** A pull quote that flashes by is a pull quote that wasn't a pull quote.

## Layout Heuristics

1. **Asymmetric grids.** Editorial design lives in 6-column, 12-column, or asymmetric custom grids. Never centered-everything. The display headline can hang left while the byline hangs right; the figure can break the column rule.
2. **Generous gutters.** ≥48px between columns. Tight gutters read as "newspaper" (which is a different vocabulary entirely); editorial wants "monthly magazine."
3. **Rule lines, not boxes.** Section breaks use hairline horizontal rules in `dim`, not box borders or shaded panels. Boxes read as web; rules read as print.
4. **Figures get top billing.** When a frame contains a figure (photo, illustration, chart), the figure occupies ≥50% of the visible area. Captions are small (`dim` at caption size) and below.
5. **One pull quote per ten frames.** Pull quotes are reset moments — large display 700 in `accent_primary`, hung in negative space. Overuse and they stop being pulls.

## Do / Don't

**Do** — set the headline at display-3, ranged left, hung from the top-third gridline, with a single sub-deck at display-1 weight 400 italic, holding the same left edge.

**Don't** — center the headline in the frame and add an underline. That is poster design, not editorial.

**Do** — use a drop cap on the opening paragraph. Treat the first paragraph as the first beat: drop cap, short sentence, period, breath.

**Don't** — start with a logo or wordmark. The byline (or dateline, in motion) replaces the brand mark in editorial.

**Do** — let a single pull quote dominate a frame at display-2, in `accent_primary`, with attribution below in `dim` mono.

**Don't** — animate the pull quote with a typewriter effect. Letter-by-letter typing is mono/code vocabulary; editorial fades quotes in whole, like turning to a page where they exist.

**Do** — use sepia tinting on photographic content to anchor it in the editorial palette.

**Don't** — apply heavy filters, vignettes, or color grading. Editorial photography is treated reverently; if the photo isn't already strong, find a better photo.

## When to Use This Vocabulary

- **Long-form content** — multi-slide decks for talks, magazine-style explainers, content with substantive body copy.
- **Investor decks** that want to project gravitas (the kind that names a fund, not a startup).
- **Annual reports**, retrospectives, year-in-review formats.
- **Author-driven content** — when there's a single voice or POV.
- **Static infographics** with photographic content (data viz pieces, comparison features, timelines).

## When NOT to Use This Vocabulary

- Product launches, hype reels, social clips — pick `playful`. Editorial's measured pace will read as sleepy in those formats.
- Developer tools, technical docs — pick `modern-clean`. Editorial's serif voice reads as out-of-register for code-adjacent content.
- Anything timeboxed under 6 seconds — editorial needs room to breathe; in a 6-second clip, the motion budget is too tight to honor the vocabulary's pace.
