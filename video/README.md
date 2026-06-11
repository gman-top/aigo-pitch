# AIGO Pitch — Video (Remotion)

Programmatic video pipeline for the AIGO Studios pitch deck, built with
[Remotion](https://www.remotion.dev/). Branding (colours, copy spine) is pulled
from the live deck in `src/theme.ts`.

## Setup

```bash
cd video
npm install
```

## Develop

```bash
npm run dev        # opens Remotion Studio (live preview + scrubbing)
```

## Render

```bash
npm run render     # -> out/aigo-deck.mp4 (1920x1080, 30fps)
npm run still      # -> out/poster.png (single frame, e.g. for a thumbnail)
```

## Structure

- `src/theme.ts` — brand palette + the `slides[]` narrative spine. Edit here to
  change copy/colours.
- `src/DeckVideo.tsx` — the composition (one animated card per slide).
- `src/Root.tsx` — registers the `DeckVideo` composition.

## Magnific MCP (image upscaling)

The repo root has a `.mcp.json` wiring the
[Magnific](https://mcp.magnific.com/mcp) MCP server. Use it to upscale/enhance
the JPGs in `../assets/` before dropping them into a slide. Set the API key
first (the endpoint returns 401 without auth):

```bash
export MAGNIFIC_API_KEY=sk_...   # then restart Claude Code / re-run `claude mcp`
```
