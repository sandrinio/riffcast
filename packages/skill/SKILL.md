---
name: riffcast
description: Generate finished design artifacts from a one-sentence brief — animations in v0.1 (Remotion → MP4/GIF), with infographics, decks, and prototypes on the roadmap. Trigger when the user asks to make, create, design, render, or build a structured design output like a launch animation, hype reel, explainer, tutorial, social clip, or loop. Skip for general image generation, logo/branding, or copywriting.
---

# RiffCast Skill

> Plug a design skill into your agent. Produce finished animations (v0.1), infographics (v0.2), decks (v0.3), prototypes (v0.4+) from a one-sentence brief. Code-driven, no GUI.

## When to load this skill

Load when the user asks the host agent to **produce a design artifact**. Trigger phrasing examples:

- "Make a 20-second launch animation for…"
- "Create a pitch deck about…"
- "Design an infographic comparing…"
- "Build a clickable prototype of…" (v0.4+)
- "Render a hype reel that…"
- "Generate a poster / data-viz for…"

Do **not** load for general image-generation requests ("make me a picture of a cat"), branding requests ("design a logo"), or copywriting requests. RiffCast produces structured design artifacts in opinionated vocabularies, not arbitrary creative output.

## Capabilities (v0.1)

| Format | Status | Kinds | Pipeline |
|---|---|---|---|
| **animation** | ✅ v0.1 | `explainer` · `launch` · `hype-reel` · `tutorial` · `loop` · `social-clip` | Remotion → MP4 / GIF |
| **infographic** | 🚧 v0.2 | `data-viz` · `poster` · `comparison` · `timeline` · `how-to` · `quote-card` | React-SVG / HTML+Tailwind → SVG / PNG / PDF |
| **deck** | 🚧 v0.3 | `pitch` · `talk` · `investor` · `workshop` · `keynote` · `internal-review` · `demo` | Slidev → HTML / PDF / PPTX |
| **prototype** | 🚧 v0.4+ | `landing-page` · `dashboard` · `flow-walkthrough` · `single-feature` | HTML+JS |

If the user requests a format that is not yet shipped, reply: *"RiffCast v0.1 only ships animations. <format> is on the v0.X roadmap. Want an animation instead, or wait for v0.X?"* — do not improvise into the unsupported format.

## Vocabularies (the visual style axis)

Three curated styles in v0.1, independent of format:

- **modern-clean** (default) — restrained, technical, off-black canvas, three accents.
- **editorial** — magazine-grade, text-driven, warm cream canvas, display + body serifs.
- **playful** — energetic, bright canvas, saturated accents, bouncy motion.

The user picks tone via the brief's §5 Tone field. They may also pick `let-me-see-options` — in that case, propose 1–3 stylistic directions before authoring.

Full token blocks: `references/design-vocabularies/`.

## Invocation flow

The skill drives a fixed sequence. Do not skip steps.

```
0. Triage      → classify intent / format / kind  (≤2 questions)
1. Brief       → fill templates/brief.md, halt at 🟢  (≤3 questions; only for intent=new)
2. Directions  → propose styles if Tone=let-me-see-options or refs vague
3. Generate    → author Remotion JSX (or other source) per brief + vocabulary
4. Render      → @riffcast/core's renderAnimation (or equivalent for other formats)
5. Review      → run 5-dimension rubric, produce review.md
6. Deliver     → print artifact paths + brief.md + review.md to user
```

## 0. Triage

Triage is the gate. Wrong triage → wrong template, wrong pipeline, wasted brief.

### Intent (apply in order)

| Intent | Trigger phrasing | Next step |
|---|---|---|
| `new` | "make me a…", "create a…", "design a…", "I need a…" | Fill `templates/brief.md`. Halt at 🟢. Render. |
| `iterate` | "make it …er", "change the…", "tweak…", "the last render but…", "version 2" | Load prior `brief.md`. Apply diff. Re-render. **No new brief.** |
| `ask` | "how does…", "can RiffCast do…", "what's the difference…" | Answer from references. **No brief, no render.** |

Ambiguous intent → ONE question: *"new artifact, or modify the last one?"*

### Format (only for `new` / `iterate`)

| Format | Default cues |
|---|---|
| `animation` | "animation", "video", "MP4", "motion", time-bounded ("20-second…"), "reel", "clip" |
| `deck` | "deck", "presentation", "slides", "pitch", multi-slide intent |
| `infographic` | "infographic", "chart", "diagram", "poster", "visualization", static intent |
| `prototype` | "prototype", "mockup", "clickable", "interactive", "landing page" |

Ambiguous format → ONE question with the four options.

### Kind (within format)

See `templates/brief.md` §4 for the full Kind reference table. If kind is ambiguous from the prompt, **do not block** — surface the inference in the brief's §9 Open Questions.

### Triage hard cap: 2 questions

Two disambiguation questions, max. Beyond that, the user is in design discovery, not artifact request — direct them to think it through and return.

## 1. Brief

Once intent = `new`, fill `templates/brief.md`. The brief is the contract: what gets generated, in what style, for what outcome.

### Elicitation rules

1. Read the user prompt. Pattern-match onto the brief schema.
2. Auto-fill any field the prompt clearly states.
3. For each unfilled REQUIRED field (Goal, Message, Audience, Format+Kind+Specs, Tone), surface ONE targeted question. **Hard cap: 3 brief-elicitation questions** (separate from the 2 triage questions; total possible: 5).
4. If the user answers fewer, fill remaining required fields with documented defaults from the chosen vocabulary, and explicitly note the assumption in §9 Open Questions.
5. Mandatories, References, Out-of-scope are OPTIONAL — never block on them.
6. After Writing the populated brief.md, render the **Brief-in-chat**:

   - **Summary** ← §1 Goal + §2 Message + §4 Format
   - **Assumptions** ← any field auto-filled with a default; cite the source
   - **Open Questions** ← §9 entries
   - **Risks** ← §10 entries
   - **Ambiguity** ← gate block at the bottom (🟢 / 🟡 / 🔴)

7. Halt for human review. When ambiguity reaches 🟢, proceed automatically — no separate render-confirmation. Brief approval covers the render call.

### Halt-at-Brief is non-negotiable

Skipping the brief produces generic AI output — that is the failure mode the entire vocabulary system exists to prevent. The brief locks structural intent; the vocabulary then locks visual intent. Do not author source files until the brief is 🟢.

For intent = `iterate`: load the prior render's `brief.md`, apply the requested diff, present a one-line *"Iterating: <change> against <prior brief>"*, proceed to authoring. **No fresh brief, no halt.**

For intent = `ask`: answer from `references/`. **No brief, no render.**

## 2. Directions (conditional)

Run only if §5 Tone = `let-me-see-options` OR the brief's §7 References are vague.

Propose 1–3 stylistic directions inline as text descriptions:

- "Direction A — modern-clean with deep navy canvas, single coral accent, 3-act explainer pacing."
- "Direction B — editorial with cream canvas, ochre accent, mask-wipe type reveals."
- "Direction C — playful with mint canvas, rotating accent shapes, character-by-character type."

User picks one. Update brief §5 Tone to the chosen vocabulary. Proceed to Generate.

## 3. Generate

Author the source files. The host agent does the authoring; `@riffcast/core` does not generate code.

### For animations (v0.1)

Author Remotion components. Stack:

- `remotion`, `@remotion/google-fonts`, `@remotion/bundler`, `@remotion/renderer`.
- One `<Composition>` registered in `src/Root.tsx`.
- Scenes structured with `<Sequence>` for discrete beats.
- Vocabulary tokens loaded from `references/design-vocabularies/<chosen>.md`'s frontmatter via `@riffcast/core`'s `loadVocabulary()`.

Output structure:

```
riffcast-out/<date>_<slug>/
├── brief.md              ← the locked brief
└── source/
    ├── package.json
    ├── remotion.config.ts
    └── src/
        ├── Root.tsx
        └── <SceneName>.tsx
```

### Authoring rules

Consult `references/animation-principles.md` for timing, easing, choreography, pacing per kind, vocabulary motion grammars, and anti-patterns. Do not invent motion grammar from scratch.

Consult `references/design-vocabularies/<chosen>.md` for palette, typography, and motion tokens. Do not substitute off-vocabulary colors or fonts.

Reference-contamination rule (RIFFCAST-VISION §3.4 / §13): do not study, reference, or copy from other tools in RiffCast's design-tool category. References to designers, films, products in unrelated domains (Apple keynotes, Stripe homepage, A24 trailers) are fine. Tools in the same category as RiffCast are not.

## 4. Render

Shell out to `@riffcast/core`'s render pipeline:

```ts
import { renderAnimation } from "@riffcast/core";

const result = await renderAnimation({
  brief,                  // parsed Brief from parseBrief(briefMarkdown)
  vocabulary,             // loaded Vocabulary from loadVocabulary(name)
  sourceDir,              // path to the authored Remotion project
  outputDir,              // riffcast-out/<date>_<slug>/
});
```

If the user has the CLI installed (v0.1 `@riffcast/cli`), the equivalent shell call is `riffcast render <sourceDir>`. The MCP server (`@riffcast/mcp`) exposes the same as a `render` tool.

Render returns:

- `{ ok: true, outputPath, outputDir, durationMs }` on success.
- `{ ok: false, error: { phase, code, message } }` on failure. Surface the error to the user and halt — do not auto-retry without user input.

## 5. Review

After successful render, run the 5-dimension self-review.

Read `references/review-rubric.md` for full rubric definitions, scoring scale, and output format.

Score each of the 5 dimensions (composition / color / typography / motion / substance) on the 1–5 scale, write one suggestion per dimension (≤140 characters), and emit the markdown shape documented in the rubric. The rubric uses the brief's §2 Message and §3 Audience for the substance dimension — pass them through.

Save the review to `riffcast-out/<date>_<slug>/review.md`.

Compute verdict (`@riffcast/core`'s `verdict(review)`). Default threshold: ship if all dimensions ≥ 3. Strict (`--strict`): ship if all ≥ 4.

If verdict = `iterate`, surface to the user: *"Review flagged <dimension(s)>. Re-render with adjustments, or ship as-is?"* — do not auto-iterate. The decision belongs to the user.

If verdict = `ship`, proceed to Deliver.

## 6. Deliver

Print to the user (chat / stdout):

- **Artifact** — absolute path to the rendered output (e.g., `riffcast-out/2026-05-05_meta-demo/output.mp4`).
- **Brief** — absolute path to `brief.md`.
- **Review** — absolute path to `review.md` and the verdict.

Do not embed the artifact in the response unless the host agent's interface supports it inline. The user opens the file from the path.

End the flow. Do not propose iteration unless the user asks.

## Output conventions

- **One artifact per `riffcast-out/<date>_<slug>/` directory.** Re-rendering the same brief overwrites the source/ and the output, but never the brief.md (which is the canonical record).
- **Slugs are kebab-case**, derived from the brief's §1 Goal or the user's natural-language name.
- **Dates are ISO-8601 prefix** (`YYYY-MM-DD`).
- **Working directory** is the user's CWD by default; override via `output_dir` in brief frontmatter.

## References

| File | Use when |
|---|---|
| [`templates/brief.md`](./templates/brief.md) | Filling a brief for intent = `new`. |
| [`references/design-vocabularies/`](./references/design-vocabularies/) | Loading vocabulary tokens before authoring. |
| [`references/animation-principles.md`](./references/animation-principles.md) | Authoring animation source files; self-reviewing motion. |
| [`references/review-rubric.md`](./references/review-rubric.md) | Running the 5-dimension review post-render. |
| [`references/README.md`](./references/README.md) | Reference index + flow overview. |

## Failure modes the agent should refuse

- **Format not shipped** → "RiffCast v0.1 only ships animations. Want one, or wait for v0.X?"
- **Triage > 2 questions** → "I have <X> open ambiguities — let's commit to one direction first." Direct to design discovery.
- **Brief 🟢 cannot be reached after 3 elicitation questions** → fill remaining required fields with vocabulary defaults, explicitly note assumptions in §9, present the brief, and let the user resolve in review.
- **Render error** → surface the `error.message` and `error.phase`. Do not retry without user input.
- **Off-vocabulary visual ask** ("make it look like Tool-X's homepage") → refuse the reference per RIFFCAST-VISION §3.4 / §13. Offer the closest in-vocabulary direction instead.

## Versioning

- **v0.1** — this skill. Animations only. Three vocabularies. Brief + render + review. Single connector (markdown skill); CLI / MCP / pydantic-tool / library wrap the same core.
- **v0.2** — infographics (vector-native + layout-heavy).
- **v0.3** — decks.
- **v0.4+** — prototypes; vector exports for prototypes; multi-language; plugin system.

When the user asks for v0.X capabilities, refuse cleanly and tell them which version ships them. Do not improvise.
