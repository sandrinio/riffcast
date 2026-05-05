# Skill References

This directory holds the agent-readable reference documents the RiffCast skill ships. The host AI agent (Claude Code, Cursor, OpenCode, Trae, Claude Desktop, etc.) reads these on demand while authoring artifacts — the entry-point is `../SKILL.md`, which links here for detail.

## Index

| Reference | Purpose | Read when |
|---|---|---|
| [`design-vocabularies/`](./design-vocabularies/) | The three v0.1 visual vocabularies — `modern-clean`, `editorial`, `playful` — with palette, typography, and motion tokens. | After triage and brief, before authoring source files. The brief's §5 Tone selects which vocabulary to load. |
| [`design-vocabularies/README.md`](./design-vocabularies/README.md) | Vocabulary schema, cross-vocabulary rules, font stacks. | Once per session, to understand how vocabularies compose with formats. |
| [`animation-principles.md`](./animation-principles.md) | Exhaustive motion-design reference — timing, easing, choreography, pacing per kind, vocabulary motion grammars, anti-patterns, accessibility, rendering pragmatics. | Before authoring any animation. Re-consult specific sections when self-reviewing. |
| [`review-rubric.md`](./review-rubric.md) | The 5-dimension self-review rubric (Composition / Color / Typography / Motion / Substance) and output format. | After rendering, before delivering the artifact to the user. |

## How references compose

The skill's authoring flow consumes these in a fixed order:

```
SKILL.md (entry)
   │
   ▼ triage  → classify intent / format / kind
   │
   ▼ brief   → fill ../templates/brief.md, halt at 🟢
   │
   ▼ author  → consult:
   │            - design-vocabularies/<chosen>.md      (palette, type, motion tokens)
   │            - animation-principles.md              (timing, easing, choreography)
   │
   ▼ render  → @riffcast/core renders the source
   │
   ▼ review  → consult:
                review-rubric.md                       (rubric + output format)
```

Each reference is self-contained — the agent does not need to read all four to author one artifact. Read what the current step needs.

## Versioning

- **v0.1** — animation only. `animation-principles.md` is exhaustive for animation; static-format and deck-format references are out of scope.
- **v0.2** — adds infographic principles (vector-native + layout-heavy variants).
- **v0.3** — adds deck principles (slide structure, density, pacing).
- **v0.4+** — adds prototype principles (interactivity scope, micro-interactions).

When a reference doesn't yet exist for a format the user requested, the agent should refuse the request and surface the v0.X scope to the user, not improvise from adjacent references.

## Authoring rule

All references are clean-room (RIFFCAST-VISION §3.4). Do not lift content from external motion-design / typography / design-systems books, blogs, talks, or other tools in RiffCast's category. When a gap exists in a reference, file a CR with an example artifact that exposed the gap — that's the signal the principle is load-bearing. Do not "fill in" principles from training data without a rendered artifact demonstrating the need.
