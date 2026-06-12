# Vault Run — Hype Video (Remotion + Magnific)

Premium, dark, cinematic hype video for **Vault Run** — a creator-led,
crowd-controlled live entertainment format for **Hexark** and the **AIGO**
ecosystem. 45s · 1920×1080 · 60fps · 16:9.

## The idea

A streamer enters a virtual vault. The audience votes which door to open.
Every choice raises risk and reward. If the creator wins, the community
unlocks rewards too. Vault Run is a scalable live format, not a casino ad.

## Structure (modular scenes)

| Time | Scene | File | Background |
|------|-------|------|------------|
| 0–8s | Hook — silhouette, doors, vote UI, chat | `S1Hook` | **AI footage** (Seedance) |
| 8–20s | Format — 3 doors (Safe/Greed/Mystery), live votes, countdown, chat explodes | `S2Format` | Procedural vault |
| 20–30s | Reward — door opens, gold chamber, community wins | `S3Reward` | Procedural vault |
| 30–38s | Scale — Hexark layer, creator grid multiplies | `S4Scale` | Procedural grid |
| 38–45s | Closing — Vault Run logo → AIGO | `S5Closing` | **AI footage** (Seedance) |

Scenes live in `src/vaultrun/scenes/Scenes.tsx`; reusable parts (vote bars,
chat feed, countdown, titles, reward chips) in `src/vaultrun/components/`.
Brand tokens + scene timing in `src/vaultrun/theme.ts`.

## Hybrid pipeline: AI footage + procedural fallback

Cinematic plates are generated with **Magnific** video models (Seedance 2.0)
and dropped into `public/ai/`. Any scene **without** an AI clip falls back to a
fully procedural `VaultBackdrop` (CSS doors, volumetric fog, embers, glowing
seams) so the video always renders end-to-end. The score is generated with
Magnific (Lyria 3 Pro) → `public/audio/score.mp3`.

Current AI plates: `clip1-hook.mp4`, `clip5-closing.mp4`. To swap a procedural
scene for AI footage, generate a clip and save it as the matching name
(`clip2-format.mp4`, `clip3-reward.mp4`, `clip4-scale.mp4`), then change that
scene's `<Plate variant=… />` to include `src="ai/clipN-….mp4"`.

Fonts (Archivo Black, Inter) are bundled in `public/fonts/` and registered via
the FontFace API — no network needed at render time.

## Commands

```bash
cd video
npm install
npm run dev          # Remotion Studio (live preview of VaultRun + DeckVideo)
npm run render       # -> out/vault-run.mp4
npm run still        # -> out/vault-poster.png
```

## Magnific MCP

Repo-root `.mcp.json` wires the Magnific MCP server (OAuth). It generated the
AI plates, the music score, and can upscale stills/footage (`video_upscale`,
`images_upscale`). Authenticate once via Claude Code `/mcp`.
