# Meta-demo — RiffCast README hero candidate

A 10-second Remotion animation that visually narrates what RiffCast does:

| Scene | Frames | Seconds | What |
|---|---|---|---|
| 1 — Brief | 0–90 | 0–3s | Terminal-style card; the brief types itself with a blinking cursor |
| 2 — Thinking | 90–150 | 3–5s | "rendering…" + three pulsing dots (the three v0.1 vocabularies) |
| 3 — Reveal | 150–240 | 5–8s | Three orbiting dots converge on a white core (the "design") |
| 4 — Wordmark | 240–300 | 8–10s | `riffcast` wordmark + tagline `type. hit enter. done.` |

## Run

```bash
bun install            # from the repo root, installs all workspaces
cd demos/meta-demo
bun run render         # → out/meta-demo.mp4
bun run dev            # → Remotion Studio at localhost:3000
```

## Vocabulary

Modern-clean (the v0.1 default vocabulary):
- Off-black background `#0a0a0a`, off-white foreground `#ededed`, dim `#6b6b6b`
- Three accent colors `#7c5cff` `#5cf0ff` `#ff5c8a` map to the three v0.1 vocabularies (modern-clean / editorial / playful)
- `ui-monospace` for terminal text, system sans for the wordmark

## Origin

Originally validated as `spikes/001-remotion-meta-demo/` in the workspace prior to the bootstrap. Ported here on Day 1 of v0.1 (see `RIFFCAST-VISION.md` §12).
