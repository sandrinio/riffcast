# RiffCast Skill

> 🚧 Skeleton placeholder. Real skill prose lands in v0.1 (see workspace `RIFFCAST-VISION.md` §12 Day 2).

## When to load

When the user asks the host agent to produce a design artifact: an animation, a deck, an infographic, or a prototype.

Trigger phrasing examples:
- "Make a 20-second launch animation for…"
- "Create a pitch deck about…"
- "Design an infographic comparing…"
- "Build a clickable prototype of…"

## What this skill does

1. **Triage** — classifies intent (`new` / `iterate` / `ask`) and format. See the workspace's brief template for full triage rules.
2. **Brief** — fills the Creative Brief template with the user's input. Halts for confirmation when ambiguity is non-zero.
3. **Generate** — authors source files (Remotion JSX / React-SVG / Slidev markdown / HTML) per the locked brief.
4. **Render** — calls the RiffCast render pipeline.
5. **Review** — runs the 5-dimension rubric, surfaces issues.
6. **Deliver** — saves the brief alongside the rendered artifact.

## References

(Vocabularies, rubric, animation principles, deck principles — to be populated in v0.1.)
