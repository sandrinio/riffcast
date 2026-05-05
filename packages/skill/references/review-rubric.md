# 5-Dimension Review Rubric

The host AI agent uses this rubric to perform a structured second look at every rendered artifact before delivering it. Output is parsable markdown that `@riffcast/core`'s `parseReview()` converts to a typed `Review` object; `verdict()` then computes ship-or-iterate from the scores.

Review surfaces issues; it never auto-fixes. The decision to iterate belongs to the host agent (or to the user via `--strict`).

## When to run

After `renderAnimation()` returns `ok: true`. Before the host agent presents the artifact to the user as "done."

Skip review only when the user has explicitly asked for a draft pass (intent = `iterate` with no review requested) or when the artifact is a triage probe, not a deliverable.

## The 5 dimensions

For v0.1, the rubric has exactly 5 dimensions. Adding, removing, or splitting dimensions is a v0.2 epic — do not invent local dimensions on the fly.

### 1. Composition

**Question:** Does the frame use space deliberately?

**Signals to look for**
- Hierarchy: the eye lands on the right element first. There is a clear primary, secondary, tertiary.
- Negative space is intentional, not accidental. Empty regions feel composed, not "I ran out of content."
- Alignment is grid-disciplined. Elements snap to a baseline / column system. No "almost-aligned" near-misses.
- Crop & framing: the artifact does not feel cut-off, off-center, or visually heavy on one side without compositional reason.
- For animation: the eye is led across frames, not whipped between them. Camera moves and scene changes have purpose.

**Score 5** — Composition reads like a designer made it. Clear hierarchy, generous whitespace, grid-true alignment.
**Score 3** — Acceptable. Hierarchy exists; alignment is mostly clean; a few near-misses or balance issues.
**Score 1** — Reads as AI-generated. Cluttered, no whitespace discipline, elements floating without grid relationship.

### 2. Color

**Question:** Are colors used with discipline and contrast?

**Signals to look for**
- Vocabulary palette is honored. No off-palette colors snuck in.
- Foreground / background contrast meets WCAG AA (4.5:1 body, 3:1 large text). Test the worst-case pairing.
- Accent colors are deployed sparingly. If three accents exist, one dominates per scene.
- No more than 5 distinct color values in any single frame (vocabulary's bg/fg/dim + ≤2 accents).
- Color reinforces hierarchy — accents call out the primary element, not random secondary bits.

**Score 5** — Strict palette discipline; all contrast ratios pass AA; accents purposeful.
**Score 3** — Palette mostly honored; one borderline contrast or one accent overused.
**Score 1** — Off-palette colors present, low-contrast text unreadable, or rainbow soup.

### 3. Typography

**Question:** Is the type set with care?

**Signals to look for**
- Display / body / mono roles are correctly assigned per the vocabulary's stack.
- Type scale is honored — sizes step on the vocabulary's scale ratio, not arbitrary px values.
- Tracking, leading, and line-height are tuned to the family (display tighter, body looser).
- No more than 2 weights in play at once. No more than 2 font families.
- Body text is set at a readable size for the target medium (≥18px for 1080p video, ≥24pt for slide decks).
- No widows, orphans, or single-word last lines in multi-line copy.

**Score 5** — Type reads like a magazine art director set it. Hierarchy crystal-clear, tracking tuned per role.
**Score 3** — Functional. Hierarchy works; one or two tracking / size tweaks would lift it.
**Score 1** — Default-system-font feel; clashing families; sizes feel arbitrary.

### 4. Motion

**Question:** Does motion serve the message, or is it ornament?

**Signals to look for**
- Each motion has a reason: it directs attention, conveys hierarchy, or transitions state. Decorative wiggle scores low.
- Easing matches vocabulary defaults (`spring` for playful / modern-clean, measured cubic-bezier for editorial).
- Timing is calibrated — no element sits motionless for >2s without purpose; no element flies through faster than the eye can register (~250ms minimum for text reveals).
- No simultaneous competing animations. One thing moves at a time, or moving elements have clear lead/follow roles.
- Animation in / out symmetry: how something enters informs how it exits.

**Score 5** — Every motion earns its frame; timing reads as intentional; easing feels right for the vocabulary.
**Score 3** — Mostly purposeful; one ornamental flourish or one timing miss.
**Score 1** — Motion-for-motion's-sake; competing animations; mechanical linear easing throughout.

For static formats (decks, infographics in v0.2+) the motion dimension is replaced by a different dimension (TBD in EPIC-012). Until then, the agent should score motion as N/A → 5 for static outputs and document the override in the suggestion field.

### 5. Substance

**Question:** Did this artifact convey THIS brief's Message to THIS brief's Audience?

This is the only per-brief dimension. The host agent must read the brief's `Message` and `Audience` fields before scoring substance.

**Signals to look for**
- The Message field's claim is identifiable from the artifact alone, without the brief.
- The artifact does not bury the message in throat-clearing intro frames.
- The audience cue is correct: jargon level, register, density of information match who the brief said this is for.
- The artifact is not generic enough that it could be the output of a different brief with the same vocabulary.

**Score 5** — The message lands cleanly within the first third of the artifact, in the audience's register.
**Score 3** — Message is present but takes the full duration to land, or the audience cue is muddled.
**Score 1** — Could have been any brief with this vocabulary; message either absent, wrong, or unrecognizable.

## Scoring scale

Integer 1–5. No half-points. No N/A. If a dimension genuinely doesn't apply (e.g., motion on a static infographic in v0.2+), the agent scores it 5 and notes the override in the suggestion field — `parseReview` does not have a special-case path.

| Score | Meaning |
|---|---|
| 5 | Real designer made this. |
| 4 | Solid. One concrete tightening would lift it to 5. |
| 3 | Functional. Several tightenings needed; not embarrassing. |
| 2 | Reads as AI-generated; obvious failure mode visible. |
| 1 | Broken; do not ship. |

The default verdict threshold is **lenient — ship if all dimensions ≥ 3**. The `--strict` flag (CLI) or `STRICT_VERDICT_THRESHOLD` (library) raises it to all ≥ 4 for high-stakes runs.

## Suggestion field — one sentence, ≤140 chars

Each dimension carries exactly one suggestion. The suggestion answers: "what specific change would lift this score by one?" Not a recap of the score; not an essay; not three suggestions chained with semicolons.

The 140-char cap is enforced by `parseReview` — over-cap suggestions return `{field: "suggestion", reason: "too_long"}`. Forcing brevity forces specificity.

**Good:** `Camera holds 1.4s on the title; cut to 0.8s — the eye settles, then the next beat lands.`
**Bad:** `The composition feels a bit busy and could probably benefit from more whitespace and maybe also rethinking the alignment of the secondary elements.`

## Output format (markdown)

The host agent emits the review in this shape. Both frontmatter and body are required for `parseReview` to succeed.

```markdown
---
artifact_path: riffcast-out/2026-05-05-foo/output.mp4
reviewed_at: 2026-05-05T12:00:00Z
overall_verdict: ship
---

# Review

## Composition
**Score:** 4
**Suggestion:** Camera holds 1.4s on the title; cut to 0.8s.

## Color
**Score:** 3
**Suggestion:** Accent contrast vs. bg is borderline; bump saturation 8%.

## Typography
**Score:** 5
**Suggestion:** Display tracking reads clean; keep as-is.

## Motion
**Score:** 4
**Suggestion:** Easing on title entrance reads mechanical; switch to spring.

## Substance
**Score:** 3
**Suggestion:** Message lands but the audience cue is implicit; spell it out.
```

Frontmatter fields:
- `artifact_path` — path to the rendered artifact reviewed (relative to repo root or absolute; the rubric does not validate accessibility).
- `reviewed_at` — ISO-8601 timestamp.
- `overall_verdict` — `ship` or `iterate`. Must agree with what `verdict()` would return for these scores under the active threshold; the agent should run `verdict()` before writing.

Body sections — exactly five `## <Dimension>` blocks (Composition / Color / Typography / Motion / Substance), each with `**Score:**` and `**Suggestion:**` lines. Order is fixed.

## Host-agent prompt template

The host agent runs this prompt against the rendered artifact (using its own multimodal capability — `@riffcast/core` does not load images / video).

```
You are reviewing a design artifact against a 5-dimension rubric.

Brief Message: <paste brief.message>
Brief Audience: <paste brief.audience>
Vocabulary: <paste vocabulary.name>
Artifact: <paste artifact path; attach the file in your client>

For each of the 5 dimensions (composition, color, typography, motion, substance):
1. Score 1–5 (integer).
2. Write one suggestion ≤140 characters describing the single concrete change that would lift the score by one point.

Read the rubric definitions in review-rubric.md — do not invent dimensions or signals.
Output the review as the markdown shape documented in review-rubric.md "Output format" section.
```

## Determinism note

Given identical artifact + identical agent + identical rubric, scores should land within ±1 point per dimension across runs. LLM judgment has inherent variance; we do not fight it. If scores swing more than ±1 across two consecutive runs, the rubric prompt is under-specified — file a CR rather than chasing the variance.

## What this rubric is NOT

- **Not auto-iteration.** The rubric returns a structured opinion. The host agent decides whether to re-render based on `verdict()`.
- **Not a quality gate inside `renderAnimation`.** Render is a pure pipeline; review is a separate, downstream pass.
- **Not the only review the user might run.** Per-vocabulary rubrics, per-format rubrics, and brand-specific rubrics are all v0.2+ work. v0.1 is one universal rubric.
