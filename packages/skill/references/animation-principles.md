# Animation Principles

Clean-room reference for the host AI agent authoring Remotion scenes (v0.1 animations) and — in v0.2+ — React-SVG / Slidev / HTML animation hooks. This document encodes motion-design principles the agent should apply by default; the brief's §5 Tone vocabulary and §4 Kind together pick which subset is dominant.

This is a **reference**, not a specification. The agent reads it before authoring and consults specific sections when scoring the artifact via the rubric (`review-rubric.md`). It is exhaustive on purpose — durable across v0.1, v0.2, v0.3+ — so the agent never has to invent motion grammar from scratch.

> **Reference-contamination rule.** This document was authored from first principles. It does not study, reference, or copy from any existing motion-design book, blog, talk, or other tool in RiffCast's category. If you find yourself wanting to add "the 12 principles of animation" verbatim or quote a specific designer's framing, stop — write the principle from the artifact-out perspective instead.

## How to use this document

1. Read §1–§4 (foundations) before authoring any scene.
2. Pick the dominant pacing profile from §5 based on the brief's Kind.
3. Apply the vocabulary-specific motion grammar from §6 based on the brief's Tone.
4. Author scenes following the patterns in §7.
5. Self-review against the anti-patterns in §11 before declaring 🟢.
6. Consult §12 (accessibility) and §13 (rendering pragmatics) before locking specs.

The other references in the bundle complement this one:
- `design-vocabularies/` — the three v0.1 visual vocabularies (palette + type + motion defaults).
- `review-rubric.md` — the 5-dimension self-review the agent runs after rendering.

---

## 1. Foundations

### 1.1 Motion serves, never decorates

Every motion in the artifact must answer "why is this moving?" with one of:
- **Direction** — the motion guides the eye to the next thing the audience should attend to.
- **Hierarchy** — the motion conveys importance (the most important thing moves first, last, or with the most weight).
- **State** — the motion conveys a change of state (off→on, before→after, hidden→revealed).
- **Continuity** — the motion ties the current frame to the previous or next frame, preventing a jarring cut.

If a motion answers none of these, delete it. "It looks cool" is not an answer; it is the failure mode this entire reference exists to prevent.

### 1.2 Timing is the primary tool

Motion designers who do nothing else well except calibrate timing produce work that reads as professional. Motion designers who have beautiful shapes and sloppy timing produce work that reads as AI slop.

Three timing levers:
- **Duration** — how long does the motion take?
- **Delay** — when does it start relative to other events?
- **Hold** — how long does the result persist before the next event?

Spend more authoring effort on timing than on shape choice. Timing is more visible than designers expect.

### 1.3 Reading time gates motion time

Text that the audience must read sets a floor on how long that text remains on screen. The math:

- ~250 words per minute = ~4.2 words per second.
- 5 words = 1.2s minimum to read once.
- 10 words = 2.4s minimum.
- 20 words = 4.8s minimum.

Motion that reveals text faster than the audience can read it is broken — they miss the message. The Substance dimension of the rubric (`review-rubric.md`) will score 1 if message text is unreadable due to pacing.

Add a 0.3–0.5s "settle" hold *after* the motion completes before the next motion starts on the same content. The eye needs that beat to lock in.

### 1.4 The eye reads one thing at a time

Two simultaneous motions of equal weight create a competition the audience cannot resolve. They look at one and miss the other. This is the single most common AI-slop tell: everything moves at once because the agent generated each element independently.

**Rule:** at any frame, one element is the protagonist of the motion, all others are static or in clear secondary roles (anticipation/follow-through). The eye should never have to choose.

Exceptions:
- Background motion (drifting gradient, parallax dust, ambient particle) is allowed *if* it is significantly slower or quieter than the foreground motion. Slower-by-2× minimum.
- Symmetrical paired motion (two halves of the same gesture, mirror-animating) reads as one gesture, not two.

### 1.5 Out-points matter as much as in-points

How something leaves the frame is part of its identity. Mismatched in/out (slide-in from left, fade-out in place) reads as careless. Two patterns:

- **Symmetric** — leaves the same way it arrived (slide-in left, slide-out right is symmetric — same axis, same speed; slide-in left, fade-out is asymmetric).
- **Resolved** — arrives one way, leaves a way that conveys the next state. Title slides in from below to claim space; when the next scene needs that space, the title scales down to a corner-bug position rather than flying off.

Default to symmetric. Use resolved when the artifact has narrative continuity across scenes.

---

## 2. Duration

### 2.1 Per-gesture duration table

| Gesture | Min (ms) | Typical (ms) | Max (ms) | Notes |
|---|---|---|---|---|
| Micro state-change (hover-equivalent, color flash) | 80 | 150 | 250 | Anything <80ms reads as a glitch; >250ms reads as ponderous. |
| Element entrance (small object, ≤200px) | 200 | 350 | 500 | Smaller elements read faster; budget less time. |
| Element entrance (large object, hero) | 400 | 600 | 900 | Hero elements warrant a slower, more deliberate entrance. |
| Type reveal (single line) | 250 | 450 | 700 | Drives the floor for line-by-line reveals — count lines × 450ms minimum. |
| Type reveal (character-by-character, full sentence) | 600 | 1000 | 1800 | Use sparingly; reads as typewriter cliché beyond 1.5s. |
| Scene transition | 300 | 500 | 800 | Cuts (0ms) are also valid; >800ms reads as a Hollywood-trailer dissolve and rarely fits product context. |
| Hold after motion settles | 200 | 400 | 800 | The "settle" beat. <200ms feels rushed; >800ms feels like the artifact froze. |
| Idle loop cycle | 2500 | 4000 | 6000 | Background ambient motion. Faster than 2.5s reads as anxious. |

Treat the **typical** column as the default. Move toward **min** for hype-reels and social-clips (front-loaded pacing). Move toward **max** for editorial and tutorials.

### 2.2 The 3-second rule for hero animations

Hero / launch / explainer animations should land their core message within the first 3 seconds for content that may auto-play in a feed and lose the audience after that window. The structure:

- 0.0–0.6s: hook frame (the visual that earns the next 2.4 seconds of attention)
- 0.6–2.4s: message statement (text + supporting motion)
- 2.4–3.0s: settle on the message before any continuation

Tutorials and longer-form explainers can violate this — they assume committed viewers — but for any animation a stranger may encounter, treat 3 seconds as the budget for the message.

### 2.3 Total artifact duration sanity check

For animations:
- 5–10s — single message, single visual, social-clip / hype-reel (loop or one-shot).
- 10–20s — explainer with 2–3 beats.
- 20–30s — explainer with 3–4 beats, or launch with anticipation→reveal→detail→cta.
- 30–60s — tutorial or rich explainer; needs scene structure not just element animation.
- 60s+ — out of scope for v0.1 unless the brief explicitly defends it.

Beats per second budget: roughly **one beat per 4–6 seconds**. A "beat" is a visible state-change — a new element, a transition, a payoff. Animations with more beats than this read as frantic; fewer read as padded.

---

## 3. Easing

Easing is the curve that shape the rate-of-change of a motion. Linear easing is mechanical; the eye perceives it as fake. Real motion in the physical world has acceleration and deceleration phases — easing simulates that.

### 3.1 Cubic-bezier vocabulary

Cubic-bezier curves take four control values: `(x1, y1, x2, y2)` representing the handles of the curve from (0,0) to (1,1). The most useful presets:

| Name | Curve | Feel | Use for |
|---|---|---|---|
| `ease-in` | `(0.42, 0, 1, 1)` | Slow start, fast end | Element leaving the frame; conveying acceleration. |
| `ease-out` | `(0, 0, 0.58, 1)` | Fast start, slow end | Element entering the frame (default); the eye locks onto it as it settles. |
| `ease-in-out` | `(0.42, 0, 0.58, 1)` | Slow at both ends | Long traverses (>500ms); type lines settling. |
| `ease-out-quart` | `(0.165, 0.84, 0.44, 1)` | Sharp out, long settle | Punchy entrances; modern-clean's default for hero elements. |
| `ease-in-quart` | `(0.755, 0.05, 0.855, 0.06)` | Long anticipation, snap end | Departures that should feel intentional. |
| `linear` | `(0, 0, 1, 1)` | Constant rate | Almost never. Camera dollies and continuous loops only. |

**Default:** `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for traverses. Substituting linear is the second most common AI-slop tell after "everything moves at once."

### 3.2 Springs

Springs simulate physical mass-on-spring motion. They are characterized by `damping` (how quickly oscillation decays) and `stiffness` (how rigidly the spring snaps to target). Springs are time-of-arrival emergent — they don't take a fixed duration; they finish when oscillation falls below a threshold.

Vocabulary defaults (from `design-vocabularies/`):

| Vocabulary | Damping | Stiffness | Feel |
|---|---|---|---|
| modern-clean | 18 | 100 | Crisp, minimal overshoot, lands clean. |
| editorial | 22 | 80 | Slow settle, no overshoot, dignified. |
| playful | 12 | 120 | Pronounced overshoot, bouncy, energetic. |

When to override the vocabulary default:
- The artifact has a single hero spring — make it more pronounced.
- The artifact has many overlapping springs — calm them all (raise damping) so they don't feel jittery.

When to use cubic-bezier instead of spring:
- Type animation. Springs on text overshoot and cause re-reads. Use ease-out cubic.
- Long traverses (>800ms). Springs decay before reaching target on long traverses; use cubic-bezier ease-in-out.
- Camera moves. Springs on virtual camera produce "jelly cam." Use linear or ease-in-out cubic.

### 3.3 The overshoot question

Overshoot (a spring or a back-easing curve that goes past the target then settles back) reads as energetic and playful. It also reads as imprecise on technical content.

| Vocabulary | Default overshoot | Notes |
|---|---|---|
| modern-clean | None / minimal (≤2%) | Crisp lands. |
| editorial | None | Magazine-grade restraint. |
| playful | Pronounced (5–10%) | Energy is the brand. |

Hero elements (large text, large icons) tolerate more overshoot than secondary elements. A bouncy hero with restrained secondaries is a coherent rhythm; bouncy everything is chaos.

---

## 4. Choreography

Choreography is how multiple motions relate across time. It is the most underappreciated dimension of motion design — competent shape choices with broken choreography reads worse than careful choreography with mediocre shapes.

### 4.1 The lead-follow pattern

When two elements both move into the frame, they should not move at the same instant. Stagger:
- **Lead** — the more important element starts first, by 80–200ms.
- **Follow** — the secondary element starts during or after the lead's settle.

The eye reads the lead, then the eye is freed to register the follow. If both arrive simultaneously, the eye picks one arbitrarily and the design loses control of the read order.

Stagger amounts:
- 80–120ms — feels like one composite gesture.
- 150–250ms — feels like two related events.
- 300–500ms — feels like two scenes.

### 4.2 Cascading reveals

When 3+ elements share a structural relationship (a list, a row of cards, a paragraph of lines), reveal them as a cascade:

- Stagger: 80–120ms between each.
- Each element uses the same easing.
- Same direction or paired-mirror direction.

A cascade of 5 list items at 100ms stagger occupies ~500ms total — a single composite gesture, not five competing ones. Cascades are how to animate quantity without animating chaos.

Failure mode: cascading 8+ items at 100ms stagger = 800ms — too long, breaks the 3-second rule. Either drop the stagger to 50ms, drop the count, or break into two cascades with a beat between.

### 4.3 Primary, secondary, background

In any frame with >2 moving elements, classify each as one of three roles:

- **Primary (1 only)** — the element the audience should be attending to. Strongest motion: largest delta, sharpest easing, full-saturation color.
- **Secondary (0–3)** — supporting elements. Subtler motion: smaller delta, softer easing, reduced opacity or saturation.
- **Background (0–N)** — ambient motion. Slowest, most diffuse — drifting gradients, particle fields, subtle parallax.

Secondaries and background must not steal attention from the primary. If you cannot demote everything else to clear secondary status, the frame is overcomplicated — cut elements.

### 4.4 The empty frame

Every animation needs at least one frame where the primary element is alone (or paired with maximally calm secondaries). This is the "settle" — the audience locks in the message.

Common failure mode: animations cycle from one cluttered frame to another with no settle. The audience never gets to read; the pacing feels frantic.

Rule: budget at least 0.5–1.0s of "settle" frame for every 4 seconds of animation. For a 12-second animation, that's 1.5–3.0s of total settle, distributed across beats.

### 4.5 Transitions between scenes

When the artifact has discrete scenes (explainer beats, deck slide changes, multi-part launches), the choice of transition signals what kind of relationship the scenes have:

| Transition | Duration | Signal |
|---|---|---|
| Hard cut (0ms) | 0 | Abrupt break — same context, new beat. Default for fast pacing. |
| Crossfade | 200–400ms | Soft break — related content, gentle handoff. Default for editorial pacing. |
| Wipe / slide | 400–700ms | Spatial relationship — "next slide", reading-direction continuity. |
| Morph / continuous element | 500–800ms | Same element transforms across scenes — strong narrative continuity. |
| Black / brand color flash | 200–500ms | Section break — chapter division, strong beat reset. |

Mixing transition types within one artifact is allowed if each has clear semantic — a flash for chapter breaks, a crossfade between beats within a chapter. Mixing without semantic reads as random.

---

## 5. Pacing per Kind

The brief's `format=animation, kind=<x>` picks the structural template that drives pacing. Below are the v0.1 animation kinds.

### 5.1 `explainer`

Three-act structure. The audience came for the substance.

```
[Act 1: Setup     20%]  → context / problem statement
[Act 2: Body      60%]  → the explanation itself, broken into 2–3 beats
[Act 3: Payoff    20%]  → the takeaway / cta
```

For a 30-second explainer:
- 0–6s: setup.
- 6–24s: body, in 2 or 3 beats of 6–9s each.
- 24–30s: payoff.

Pacing within the body: each beat needs an entry, content, and a settle. Don't crash one beat into the next.

### 5.2 `launch`

Climax-near-end structure. Anticipation builds, the new product is the payoff.

```
[Hook      10%]  → grab attention without revealing the subject
[Tension   50%]  → tease feature, benefit, problem-it-solves; do NOT reveal
[Reveal    20%]  → the launched thing, named, prominent
[Detail    20%]  → spec / benefit details and CTA
```

Reveal-too-early kills the structure — if the audience knows what's launching by 30%, the remaining 70% has nothing to deliver. Hold the reveal.

### 5.3 `hype-reel`

Relentless pacing. No 3-second budget — the audience is committed (this is on a conference stage or the homepage hero, not a feed scroll).

- Beats per second: 1 every 1.5–2.5s. Twice the density of an explainer.
- No long settles; the energy is the message.
- Music-cue alignment is implicit even though v0.1 is silent — author as if a beat-driven track is underneath.
- Length: 12–30s. Beyond 30s the relentless pacing becomes exhausting.

### 5.4 `tutorial`

Chunked pacing. The audience is learning; comprehension trumps energy.

- Each step gets 4–8s of dedicated screen time.
- Each step has a settle frame where only the relevant element is highlighted.
- Transitions between steps are slow (400–600ms) — the audience needs to register that they have moved on.
- The artifact may legitimately exceed 60s if the content warrants. Past 60s, consider segmenting into a deck instead.

### 5.5 `loop`

Seamless start/end. The last frame must transition to the first frame without a visible cut.

Two strategies:
- **Cyclic motion** — the underlying element moves in a closed orbit (rotation, oscillation, breathing scale). The motion has no start or end; the loop point is arbitrary.
- **Fade-loop** — the entire artifact fades to background at the end, fades up from background at the start, with the boundary at the same color. Lower craft; use only if cyclic motion doesn't fit the content.

Loops have no Acts. They have a base state and 1–3 micro-events (a pulse, a sweep, a reveal-and-reset). 4+ micro-events crowd a loop; the audience can't track.

Length: 4–8s typical. 10s+ feels less like a loop and more like a short animation that happens to repeat.

### 5.6 `social-clip`

Front-loaded for feed-scroll context.

- 0–1s: hook frame must be visually arresting on its own (still-frame thumbnail test — does the first frame stop the scroll?).
- 1–3s: message stated explicitly.
- 3–end: detail / branding.

Length: 6–15s. Shorter than that under-delivers; longer drops viewers.

Aspect ratio: usually portrait (1080×1920) or square (1080×1080). Author with crop-safe regions assumed.

---

## 6. Vocabulary motion grammars

Each of the three v0.1 vocabularies has a distinct motion grammar. The brief's `vocabulary` field selects which is dominant. Mixing grammars within one artifact reads as confused.

### 6.1 modern-clean

**Defaults:**
- Spring damping 18, stiffness 100.
- Cubic-bezier ease-out-quart for most cubic motion.
- Stagger 100ms.
- Settle hold 400ms.
- Overshoot ≤2%.

**Signature gestures:**
- Element entrances slide in from below by 24–48px with fade-up. Crisp lands, no bounce.
- Type reveals line-by-line with 80–120ms stagger; cubic ease-out, no spring (avoids re-read).
- Background is static or near-static; ambient motion at most a 0.4-Hz drift on a gradient.
- Camera is fixed; transitions are cuts or 200ms crossfades.

**Forbidden in modern-clean:**
- Pronounced overshoot or bouncy springs.
- Decorative wiggle or idle micro-jitter.
- Mid-motion direction changes (no Z-shaped paths).

### 6.2 editorial

**Defaults:**
- Spring damping 22, stiffness 80 (or cubic-bezier ease-in-out for >500ms motions).
- Stagger 150–200ms (slower than modern-clean — gives weight).
- Settle hold 600ms.
- Overshoot 0.

**Signature gestures:**
- Type reveal is mask-based: a wipe (left-to-right or top-to-bottom) reveals the line beneath. No translation, no fade. The text was always there; the mask is being lifted.
- Long crossfades (300–500ms) between beats, never hard cuts.
- Photographic elements use Ken-Burns-style slow zoom (4–6s linear scale 1.0→1.05).
- Color motion is rare and slow — a saturation pulse, not a hue shift.
- Camera, when used, is slow (8–10s for a slow pan).

**Forbidden in editorial:**
- Springs with visible bounce.
- Sub-200ms stagger (reads as rushed; editorial rewards patience).
- Hard cuts unless intentionally signaling a chapter break.

### 6.3 playful

**Defaults:**
- Spring damping 12, stiffness 120 (overshoot pronounced).
- Stagger 80ms (faster than modern-clean — keeps energy up).
- Settle hold 250ms.
- Overshoot 5–10%.

**Signature gestures:**
- Element entrances with scale 0.6 → 1.0 + slight rotation (±3°) settling to 0°. The whole element bounces in.
- Color is part of the motion vocabulary — accent colors flash, pulse, or rapid-shift on hits.
- Background may have visible idle motion (drifting shapes, slow rotation) at >0.2-Hz.
- Type reveal can be character-by-character with bouncy springs *if* the line is short (≤6 words).
- Transitions are wipes or shape-morphs more often than cuts.

**Forbidden in playful:**
- Linear easing.
- Long, dignified holds (>500ms with no motion). Playful needs constant low-level energy.
- Editorial slow zooms.

---

## 7. Authoring patterns (Remotion)

These are concrete patterns the agent applies when authoring Remotion JSX. They map the principles above onto Remotion's API.

### 7.1 Spring pattern

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const progress = spring({
  frame: frame - delayFrames,
  fps,
  config: { damping: 18, stiffness: 100 },
  durationInFrames: undefined, // let it settle naturally
});
```

The `damping` / `stiffness` come from the vocabulary. The `delayFrames` implements stagger — multiply per-element index by the chosen stagger duration in frames.

### 7.2 Cubic-bezier pattern

```tsx
import { interpolate, Easing, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const progress = interpolate(
  frame,
  [delayFrames, delayFrames + durationFrames],
  [0, 1],
  {
    easing: Easing.bezier(0.165, 0.84, 0.44, 1), // ease-out-quart
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  },
);
```

Always `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"` — without them values pass through 0 and 1 and produce visible artifacts at the ends.

### 7.3 Cascading reveal

```tsx
const items = ["one", "two", "three", "four"];
const STAGGER_FRAMES = 7; // 0.23s @ 30fps — falls in the 80-120ms range with rounding

return items.map((text, i) => {
  const progress = spring({
    frame: frame - i * STAGGER_FRAMES,
    fps,
    config: vocabulary.motion.spring_default,
  });
  const opacity = progress;
  const translateY = interpolate(progress, [0, 1], [16, 0]);
  return (
    <div
      key={text}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </div>
  );
});
```

### 7.4 Sequence-based scene structure

Use Remotion's `<Sequence>` for discrete beats:

```tsx
<>
  <Sequence from={0} durationInFrames={fps * 6}>
    <SetupBeat />
  </Sequence>
  <Sequence from={fps * 6} durationInFrames={fps * 18}>
    <BodyBeat />
  </Sequence>
  <Sequence from={fps * 24} durationInFrames={fps * 6}>
    <PayoffBeat />
  </Sequence>
</>
```

Each beat component owns its own internal animation timing (spring/interpolate from `useCurrentFrame()` which resets to 0 inside a Sequence).

### 7.5 Mask-reveal type (editorial)

```tsx
const wipe = interpolate(frame, [0, 18], [0, 100], {
  easing: Easing.bezier(0.42, 0, 0.58, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
return (
  <div
    style={{
      WebkitClipPath: `inset(0 ${100 - wipe}% 0 0)`,
      clipPath: `inset(0 ${100 - wipe}% 0 0)`,
    }}
  >
    {text}
  </div>
);
```

A clip-path inset wipe from right to left as `wipe` rises 0→100. No translation; the text was always there.

### 7.6 Loop pattern

```tsx
const cycle = 4 * fps; // 4-second loop
const phase = (frame % cycle) / cycle; // 0..1
const breathe = Math.sin(phase * 2 * Math.PI) * 0.04 + 1; // scale 0.96..1.04
return <div style={{ transform: `scale(${breathe})` }}>{content}</div>;
```

A pure sine cycle has no visible loop point — it reads as continuous breathing.

---

## 8. Type animation

Type carries the message. Bad type animation makes the message unreadable.

### 8.1 Reveal granularity

| Granularity | Use when | Watch out for |
|---|---|---|
| Whole block at once | Short labels, single-word titles | Reads as static; no motion contributes nothing — only use if motion belongs to a paired element. |
| Line by line | Multi-line copy, lists | Stagger 80–150ms per line. |
| Word by word | Punchy headlines (≤6 words) | Stagger 100–200ms per word. Cliché beyond 6 words. |
| Character by character | Code, technical-feel reveals | Stagger 30–50ms per char. Use sparingly — typewriter cliché is real. |

### 8.2 Motion choice for type

- **Translate + fade** — slide from below 16–24px while fading 0→1. Default for modern-clean. Easing: cubic ease-out.
- **Mask wipe** — clip-path inset wipe. Default for editorial. Easing: cubic ease-in-out.
- **Scale + bounce** — scale from 0.85 with overshoot. Default for playful. Easing: spring.
- **Pure fade** — opacity 0→1, no translate. Boring but safe; use as a fallback when none of the above fit.

Avoid:
- Rotate-in for type — reads as 2008 Flash banner.
- Shadow / blur reveals — expensive to render and rarely add semantic.
- Color shifts on entrance — let the type land in its final color; color motion is for state changes.

### 8.3 Reading-time floor (reprise)

After a line of type lands, hold for at least:
- 1.5s for short lines (≤8 words).
- 2.5s for medium lines (8–15 words).
- 4.0s for long lines (15+ words).

If you cannot afford the hold, the line is too long for the artifact's pace — cut words, not hold time.

### 8.4 Type fonts and weight

- Display weight (700+) reads at smaller sizes than body weight (400). Use display for headlines.
- A single artifact uses at most 2 weights of one family, OR display + body family pair from the vocabulary. Never 3+ weights in one frame.
- Tracking adjustments per role: display tighter (-1 to -2%), body neutral (0%), small caps slightly looser (+1 to +3%).

---

## 9. Object & shape animation

### 9.1 Shape entrances

| Entrance | Feel | When |
|---|---|---|
| Scale-in (0.85 → 1.0) | Restrained pop | Default for icons and small UI. |
| Slide-in (translate from below/above/side) | Directional | When the element is "arriving" from a place. |
| Rotate-in (-15° → 0°) | Mechanical | Sparingly — only when rotation has semantic ("the gear is engaging"). |
| Draw-on (stroke-dasharray) | Constructed | For SVG line art, paths, signatures. |
| Mask-reveal | Discovered | The shape was always there; revealed by un-masking. |

Pair entrances with fade-in (opacity 0→1). A pure scale or slide without fade reads as harsh.

### 9.2 Path animation

Animating along a path (an arc, a curve) is more interesting than along a straight line. For an icon traveling between two positions, a slight curve in the path adds character without demanding attention.

Implementation: animate `cx, cy` (or `translateX, translateY`) along a quadratic-bezier curve as a function of progress, not just linearly between endpoints.

```tsx
const t = progress;
const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1;
const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y1;
```

Where `(x0,y0)` is start, `(x1,y1)` is end, `(cx,cy)` is the control point (offset perpendicular to the line by ~15% of the line length).

### 9.3 Morph

Shape morph (one shape continuously deforms into another) is high-craft and high-risk. Done well: read as magic. Done poorly: reads as glitching SVG.

Constraints:
- Morph only between shapes with the same point count, or use a tween library that handles point matching.
- Duration 500–1000ms; faster is unreadable, slower is ponderous.
- Never morph between visually unrelated shapes (a star into a triangle is fine; a star into a logotype is not).

For v0.1, default to "no morphs" unless the brief explicitly asks for one. Cuts and crossfades are safer.

---

## 10. Camera, framing, parallax

### 10.1 Virtual camera moves

The "camera" in a 2D animation is the implied viewport. Camera moves apply a transform to the entire scene.

| Move | Implementation | Use for |
|---|---|---|
| Static | No transform | Default. >60% of frames. |
| Slow zoom (1.0 → 1.05 over 4–6s) | scale | Editorial Ken-Burns; subtle progression. |
| Pan (translateX a few percent) | translate | Reveal continued content; parallax-feel. |
| Snap-zoom (1.0 → 1.2 in 200ms) | scale + ease-in-quart | Punchy emphasis, hype-reels. Use ≤1 per artifact. |
| Dolly (depth implied via parallax layers) | per-layer translate | Compound parallax; rare in v0.1. |

Camera moves for camera moves' sake is the third most common AI-slop tell. If the camera move doesn't reveal information or signal emphasis, drop it.

### 10.2 Parallax

Multi-layer parallax (foreground moves more than background) adds depth. Rules:

- 2–3 layers max in v0.1. More layers compound rendering cost without proportional payoff.
- Background layer translates 30–50% of foreground motion.
- Mid-layer (if any) translates 60–80% of foreground motion.
- All layers move in the same direction; opposite-direction parallax is disorienting.

### 10.3 Crop and framing

Compose for the target aspect ratio specifically:

| Aspect | Use |
|---|---|
| 16:9 (1920×1080) | Hero animations, web embeds, YouTube. |
| 1:1 (1080×1080) | Social feeds where aspect-agnostic placement matters. |
| 9:16 (1080×1920) | Vertical social, Stories, Reels. |
| 21:9 (2560×1080) | Cinematic hero; rare. |

Author with the crop-safe region in mind: keep critical elements within 90% of each axis. The remaining 10% margin tolerates social-platform crops, captions, and player chrome.

---

## 11. Anti-patterns

The single largest source of AI-slop motion is unawareness of these. Internalize them.

### 11.1 Everything moves at once

The hero text fades in, the background zooms, the icon spins, the accent line draws — all starting at frame 0. The eye has nothing to lock onto.

**Fix:** stagger. Lead-follow. One element is the protagonist; all others are secondary at any given frame.

### 11.2 Linear easing

Default-linear motion reads as fake. Real-world motion has acceleration phases.

**Fix:** ease-out for entrances, ease-in for exits, ease-in-out for traverses. Never linear except for camera dollies and pure cyclical loops.

### 11.3 Decorative wiggle

Idle micro-jitter on every element to make it "feel alive." Reads as nervous, untrustworthy, AI-generated.

**Fix:** stillness is fine. Background ambient motion can carry the "alive" feeling at 0.2–0.4 Hz; foreground elements should be still between events.

### 11.4 Type unreadable due to pacing

Lines reveal faster than the audience can read. The artifact "looks" fine in the timeline editor but the message never lands.

**Fix:** apply the reading-time floor (§1.3, §8.3). Always test by reading the lines aloud at conversation pace and confirming you finish before the next motion fires.

### 11.5 Mismatched in/out

Elements arrive one way, depart another, with no semantic reason.

**Fix:** symmetric (same axis, same speed) or resolved (departure shape signals the next state). Document the choice as a one-line note in code comments only when non-obvious.

### 11.6 Bounce on technical content

Modern-clean animations with playful springs. Editorial animations with overshoot. Reads as the agent didn't know what vocabulary it was authoring.

**Fix:** look up the vocabulary's spring config and use it. Do not invent local spring values without naming why.

### 11.7 No settle

The animation cycles through cluttered frames with no pause. The audience can't catch the message because there's no moment where only the message is on screen.

**Fix:** budget settle frames per §4.4. 0.5–1.0s of settle per 4s of animation, distributed across beats.

### 11.8 Camera dolly for no reason

A slow zoom on a frame that doesn't need it. Reads as derivative trailer-aesthetic.

**Fix:** still camera by default. Camera moves only when revealing new information or signaling explicit emphasis.

### 11.9 Cliché character-by-character on long lines

Typewriter reveal on a 20-word headline. Takes 7+ seconds to land; audience drops.

**Fix:** character-by-character only on ≤6-word lines, only sparingly (≤1 per artifact). Default to line-by-line or word-by-word for length.

### 11.10 Color flash spam

Every state change accompanied by a color flash. Loses meaning by the third flash.

**Fix:** color motion (saturation pulse, hue shift, brightness flash) is rare and earns attention. ≤2 per 30-second artifact.

### 11.11 Random transition mixing

Crossfade, then hard cut, then wipe, then crossfade — with no semantic. Reads as "tried everything."

**Fix:** pick one transition style for within-section beats; pick a different style for section breaks. Document the system in the brief if non-obvious.

### 11.12 Holding a frame too long

Audience reads, settles, waits, waits, ... and the next motion still hasn't fired. Reads as a rendering glitch.

**Fix:** settle holds are 200–800ms (§2.1). Beyond 1s without motion, either start the next beat or end the artifact.

---

## 12. Accessibility

### 12.1 prefers-reduced-motion

Web audiences may have reduced-motion preferences. RiffCast's v0.1 outputs are MP4 (single rendered video, no preference detection). When the artifact ships embedded in a webpage, the embedding context should provide a reduced-motion alternative — typically a still hero frame.

When authoring, design with the still-hero frame in mind: choose a "settle frame" from the artifact that, on its own, conveys the message. If no single frame does, the artifact relies entirely on motion to deliver — a fragile choice for any audience that can't see the motion.

### 12.2 Flashing and seizure thresholds

Avoid:
- Flash rates of 3–55 Hz (seizure-trigger range). RiffCast's defaults (max idle cycles ~2 Hz) stay clear of this.
- Full-screen flashes >25% of screen area, repeated >3 times per second.

Color pulses on small elements are fine; full-screen brightness flashes are not.

### 12.3 Motion that conveys required information

If the artifact's message can only be understood from the motion (not any single frame), users with motion-tolerance issues lose the message. Pair every motion-based message with a static text statement of the same message, even if it's only present for one settle frame.

### 12.4 Subtitles and captions

Out of scope for v0.1 (silent video). When v0.2+ adds audio, all narration requires synchronized captions.

---

## 13. Rendering pragmatics

### 13.1 Frame rate

| fps | Use |
|---|---|
| 24 | Cinematic feel; smaller files. Editorial vocabulary defaults work well at 24fps. |
| 30 | Web standard; default for v0.1. Modern-clean and playful default to 30fps. |
| 60 | Fast-paced action / hype-reels where individual frames matter. Doubles render time and file size. |

Don't render at 60fps unless the brief justifies it. 30fps reads identically for the vast majority of content.

### 13.2 Codec and container

- **MP4 / H.264** — universal compatibility, default for v0.1.
- **MP4 / H.265** — smaller files, but encoding is slower and playback compatibility is uneven.
- **WebM / VP9** — efficient for web embeds; some platforms still don't support it.
- **GIF** — small, universally embedded, but limited to 256 colors and large file sizes for long animations. Use for ≤8s animations only.

Default v0.1: MP4 H.264 + GIF (for the same artifact rendered twice). Specs in brief drive the format list.

### 13.3 Bit rate and quality

Remotion's defaults are reasonable. Override only if:
- File size matters (social platforms have caps; aim for <8 MB for short-form).
- Quality artifacts visible in the rendered output (stair-stepping on gradients, banding on flat colors).

### 13.4 Scene composition rendering cost

- Simple scenes (≤10 elements, no filters) render in real-time on most hardware.
- Filter-heavy scenes (drop shadows, blur, glow) are 5–10× slower. Use sparingly.
- Composite blending modes (multiply, screen, overlay) compound cost per layer.

If a scene is too expensive to render in development iteration, simplify before optimizing — most "expensive" effects don't survive review.

### 13.5 Text rendering

Use `@remotion/google-fonts` for vocabulary-specified fonts. Loading from system fonts produces inconsistent renders across machines.

Avoid:
- More than 2 font families per artifact.
- Custom font weights not on Google Fonts (paid fonts are out of scope for v0.1).

---

## 14. Quick reference

A cheat sheet for the agent to consult mid-authoring without re-reading the full document.

```
DEFAULT TIMINGS (modern-clean)
  Element entrance:   spring(damping=18, stiffness=100), translate-up 24px + fade
  Type reveal:        line-by-line, 100ms stagger, ease-out cubic
  Stagger:            100ms
  Settle hold:        400ms
  Transition:         200ms crossfade or hard cut

DEFAULT TIMINGS (editorial)
  Element entrance:   ease-in-out 600ms, translate or mask-wipe
  Type reveal:        mask-wipe 400ms, 150ms stagger
  Stagger:            150–200ms
  Settle hold:        600ms
  Transition:         300–500ms crossfade

DEFAULT TIMINGS (playful)
  Element entrance:   spring(damping=12, stiffness=120), scale+rotate
  Type reveal:        word-by-word for short lines, line-by-line for long
  Stagger:            80ms
  Settle hold:        250ms
  Transition:         shape-morph or wipe

PACING BUDGETS
  3-second rule:      Hook frame + message in first 3s.
  Beats-per-second:   1 beat per 4–6s (explainer); 1 beat per 1.5–2.5s (hype-reel).
  Settle:             0.5–1.0s per 4s of animation.
  Reading floor:      ~250 wpm; budget 1.5–4.0s holds for type lines.

ANTI-PATTERNS TO AVOID
  Everything-at-once     → stagger.
  Linear easing          → ease-out / ease-in-out / spring.
  Decorative wiggle      → stillness is fine.
  No settle              → budget hold frames.
  Camera-for-camera-sake → static by default.
  Type unreadable        → reading-time floor.
  Mismatched in/out      → symmetric or resolved.
```

---

## 15. Versioning and scope

This document is v0.1 — animation-only. v0.2 adds infographic-specific motion grammar (data-viz reveals, comparison transitions, timeline scrubs). v0.3 adds deck-specific transitions (slide-to-slide). v0.4+ adds prototype-specific micro-interactions.

Per RiffCast independence (vision §3.4), changes to this document are authored from first principles and the rendered artifact's visible quality. Do not lift principles from external sources to "fill gaps" — the gap is itself a signal that the principle isn't load-bearing for the artifacts we're producing.

When the agent finds itself wanting a principle this document doesn't cover, that is a CR — surface the gap with an example artifact that exposed it.
