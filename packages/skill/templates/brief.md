<instructions>
USE THIS TEMPLATE TO CAPTURE A CREATIVE BRIEF FOR ONE DESIGN ARTIFACT — animation, deck, infographic, or prototype. The Creative Brief is the contract between the user and RiffCast: it determines what gets generated, in what style, for what outcome.

WHO AUTHORS THIS:
  - The host AI agent (Claude Code, Cursor, OpenCode, Claude Desktop, pydantic AI, etc.)
    fills this from the user's prompt + a short clarification dialog.
  - The agent never silently fills missing fields with assumptions; it surfaces gaps
    via the Brief-in-chat (see POST-WRITE BRIEF below) and halts for the user.

WHO USES THIS:
  - Once 🟢, the host agent uses the filled Brief to author the source files
    (Remotion JSX / HTML / Slidev markdown) and shells out to `riffcast render`.
  - The Brief is saved alongside the rendered artifact:
        riffcast-out/2026-05-05_launch-animation/
        ├── brief.md         ← the filled brief (this template, populated)
        ├── source/          ← agent-authored JSX / HTML / md
        └── output.mp4       ← rendered artifact
    Re-rendering is reproducible from brief.md alone.

OUTPUT LOCATION: relative to user's working directory, default `riffcast-out/<date>_<slug>/brief.md`

PRECONDITION: TRIAGE FIRST
  Before filling any field, the host agent must complete triage (see SKILL.md → Triage):
    1. Intent — `new` / `iterate` / `ask`. This template applies ONLY to `new`.
       For `iterate`, load the prior render's brief.md and apply a diff — do NOT
       fill a fresh template. For `ask`, answer from docs — do NOT fill.
    2. Format — `animation` / `deck` / `infographic` / `prototype`. Determines
       which Kind table applies in §4 + which render pipeline activates.
    3. Kind — sub-classifier within format (see §4).
  Hard cap on triage questions: 2. Beyond that, the user is in design discovery,
  not brief elicitation.

ELICITATION LOGIC (host agent runs this AFTER triage confirms intent=`new`):
  1. Read user prompt. Pattern-match it onto the schema below.
  2. Auto-fill any field the prompt clearly states.
  3. For each unfilled REQUIRED field (Goal, Message, Audience, Format+Kind+Specs, Tone),
     surface ONE targeted question. Hard cap: 3 brief-elicitation questions
     (separate from the 2 triage questions; total possible questions: 5).
     If the user answers fewer, fill remaining required fields with documented
     defaults from the chosen vocabulary and explicitly note the assumption in §9.
  4. Mandatories, References, Open Questions are OPTIONAL — never block on them.
  5. After Writing, render the Brief-in-chat (see POST-WRITE BRIEF). Halt.
  6. On 🟢, proceed to authoring + render. Do NOT proceed on 🟡 or 🔴.

POST-WRITE BRIEF
After Writing the populated brief.md, render this in chat:

  - Summary       ← §1 Goal + §2 Message + §4 Format
  - Assumptions   ← any field auto-filled with a default; cite the source
  - Open Questions ← §9 entries
  - Risks         ← §10 entries
  - Ambiguity     ← gate block at bottom

Halt for human review. When ambiguity reaches 🟢, proceed automatically — no
separate render-confirmation. Brief approval covers the render call.

THIS IS NOT A CLEARGATE WORK ITEM. No push, no sync, no remote ID. Local artifact
governed by the same elicitation pattern, nothing more.

DO NOT output these instructions in the rendered file.
</instructions>

---
brief_id: "{YYYY-MM-DD}-{slug}"
format: "animation | deck | infographic | prototype"
kind: "{kind from the format's Kind table — see §4}"
vocabulary: "modern-clean | editorial | playful | let-me-see-options"
specs:
  duration_seconds: 0
  width: 1920
  height: 1080
  fps: 30
  output_formats: ["mp4"]
status: "Draft | Ready | Rendered | Iterating"
ambiguity: "🔴 High"
created_at: "{ISO-8601}"
updated_at: "{ISO-8601}"
rendered_at: null
output_path: null
---

# Creative Brief: {Short Name}

## 1. Goal

{One sentence describing the outcome the artifact must produce. Concrete, not aesthetic.

✅ "Drive signups for the v2 launch from the homepage hero spot."
✅ "Explain the three-phase plan→execute→deliver loop to a developer audience in 30 seconds."
❌ "Make something cool."
❌ "Make it look nice."}

## 2. Message

{The single sentence the audience must take away. If you can't write this in one sentence, the artifact has too many goals — split it.

Format: subject-verb-object, present tense, no qualifiers.

✅ "RiffCast turns a sentence into a finished design in seconds."
❌ "RiffCast is a tool that, with the help of AI agents, can sometimes produce design output if the user gives it a detailed enough brief."}

## 3. Audience

{Who is watching this artifact? Be specific.

✅ "Backend developers evaluating dev tools — likely to skim, value technical credibility."
✅ "Non-technical product managers in a Tuesday demo."
❌ "Everyone."
❌ "General audience."}

## 4. Format

- **Type:** {animation | deck | infographic | prototype}
- **Kind:** {format-specific sub-classifier — see table below; required when Type is set}
- **Specs:** {duration / dimensions / output formats / framerate / track}
  - Animation: e.g. `20s, 1920×1080, MP4 (H.264) + GIF, 30fps`
  - Deck: e.g. `12 slides, 16:9, HTML (primary) + PDF (always) + PPTX (best-effort, fidelity caveats apply)`
  - Infographic — vector-native (data-viz / poster / comparison / timeline): `1200×1600 portrait, SVG (primary) + PNG @ 2x + PDF`
  - Infographic — layout-heavy (how-to / quote-card): `1200×1600 portrait, PNG @ 2x + PDF` (no SVG export — HTML+Tailwind source is not vector-native)
  - Prototype: e.g. `desktop 1280×800, single HTML file with JS interactivity` (v0.4+)

**Kind reference table** (agent must pick one per format; if user prompt is silent, agent infers from §1 Goal + §3 Audience and surfaces the inference in §9 Open Questions):

| Format | Kind options | Notes | Pipeline track |
|---|---|---|---|
| **animation** | `explainer` · `launch` · `hype-reel` · `tutorial` · `loop` · `social-clip` | Drives pacing + structure (explainer = 3-act, launch = climax-near-end, loop = seamless start/end) | Remotion → MP4/GIF (v0.1) |
| **deck** | `pitch` · `talk` · `investor` · `workshop` · `keynote` · `internal-review` · `demo` | Drives slide count + density + layout templates | Slidev → HTML/PDF/PPTX (v0.3) |
| **infographic** — vector-native | `data-viz` · `poster` · `comparison` · `timeline` | Drives composition + reading order. Vector-first because these scale and benefit from print-grade output. | React-SVG → SVG/PNG/PDF (v0.2) |
| **infographic** — layout-heavy | `how-to` · `quote-card` | Paragraph-flow content; HTML+Tailwind is more ergonomic than SVG for these. | HTML+Tailwind+Playwright → PNG/PDF (v0.2) |
| **prototype** | `landing-page` · `dashboard` · `flow-walkthrough` · `single-feature` | Drives interactivity scope. | HTML+JS (v0.4+) |

The Kind picks structural templates, pacing rules, AND pipeline track (vector vs raster). The Tone (§5 vocabulary) picks visual style. Independent axes — modern-clean pitch deck, playful keynote, editorial timeline infographic, etc., are all valid combinations.

## 5. Tone

{Vocabulary that drives palette, typography, motion principles. One of:

- **modern-clean** (default) — Vercel/Linear-adjacent, restrained, technical
- **editorial** — magazine-style, considered typography, asymmetric layouts
- **playful** — saturated, bouncy motion, consumer-friendly
- **let-me-see-options** — agent presents 1-3 directions before committing

Add notes if you want a specific lean ("modern-clean but warmer", "editorial with restrained color").}

## 6. Mandatories

{Brand elements that MUST appear — logo, primary brand color, required disclaimers, specific copy. Optional. Skip if there's no brand context.

- **Logo:** {path or "none"}
- **Primary brand color:** {hex or "use vocabulary default"}
- **Required text:** {e.g. "© 2026 RiffCast" / "none"}
- **Other:** {legal, accessibility, regional rules}}

## 7. References

{Optional vibe targets — URLs, screenshots, or descriptions of artifacts you want this to feel like.

⚠️ Do NOT reference other tools in the same product category as RiffCast. Reference designers, films, books, products in unrelated domains — Apple keynote slides, Stripe homepage, A24 trailer, etc.

- {Reference 1: URL or path + 1-line note on what's relevant}
- {Reference 2: ...}}

## 8. Out of Scope

{What this artifact explicitly does NOT do. Prevents scope creep.

- {e.g. "Does NOT include audio narration — silent video only."}
- {e.g. "Does NOT need to render at 4K — 1080p is fine."}}

## 9. Open Questions

{Surfaced by the agent during elicitation. Each entry pairs the question with the agent's recommended answer. The user resolves during Brief review.

- **Question:** {what's unclear or contradictory}
- **Recommended:** {agent's proposed answer}
- **Human decision:** {populated during Brief review}}

## 10. Risks

{Risks the agent sees with the brief as currently written.

- **Risk:** {e.g. "20s for 5 message points = 4s per point — likely too dense"}
- **Mitigation:** {e.g. "Reduce to 3 points or extend to 30s"}}

---

## Ambiguity Gate (🟢 / 🟡 / 🔴)

**Current Status: 🔴 High Ambiguity**

*Evaluate each criterion against its literal text. If you substituted an interpretation, leave the box unchecked and surface the substitution in the Brief.*

Requirements to pass to 🟢 (Ready for Render):

- [ ] §1 Goal is one concrete sentence describing an outcome (not an aesthetic).
- [ ] §2 Message is one sentence, subject-verb-object, no compound clauses.
- [ ] §3 Audience names a specific persona or role (not "everyone" / "general").
- [ ] §4 Format Type is set AND §4 Kind is one of the listed options for that Type AND §4 Specs are filled with concrete numbers (no "TBD"). Frontmatter `kind` and `specs.*` mirror these.
- [ ] §5 Tone is one of {modern-clean, editorial, playful} OR explicitly "let-me-see-options".
- [ ] §6 Mandatories are listed OR explicitly "none".
- [ ] §9 Open Questions are all marked with a Human decision (no blank entries).
- [ ] No "TBD" / "{}" / placeholder text remains anywhere in the body.
