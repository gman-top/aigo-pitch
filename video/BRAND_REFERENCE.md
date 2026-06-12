# Vault Run — Real Game Brand Reference

Extracted from the live game build at https://gman-top.github.io/vault-run/
(Vite SPA, `assets/index-*.css` / `index-*.js`). Use these for all cinematic
asset generation so footage matches the actual game, not generic art.

## Palette (authentic — from the game CSS)
| Role | Hex |
|------|-----|
| Background (near-black) | `#0a0c12`, `#05060a` |
| Gold (primary accent) | `#ffcf4a`, `#ffe79a`, `#ffb300` |
| Mint green (vault energy / multiplier) | `#3dffb0` |
| Red (danger / stake) | `#ff3b54` |
| Purple (secondary accent) | `#a779ff` |
| Muted text | `#8a96b3`, `#7886aa` |

> Note: the core game vault glows **mint-green + gold on black** — NOT the
> AIGO red-orange used elsewhere in the deck. Themed marketing vaults
> (`assets/branded/*.jpg`) are purple/gold variants.

## Fonts
Sora (display), Inter (UI), JetBrains Mono (numbers/multipliers).

## Logo
Gold-and-black "V" emblem + "VAULT RUN — OPEN IT"
(`assets/vault-run-game/logo.png`, also `assets/brand/vault-run-logo.png`).

## Real assets pulled
- `assets/vault-run-game/logo.png` — official Vault Run emblem (300×300).
- `assets/captures/vault-run.jpg` — real in-game UI screenshot (green vault dial,
  runners, room-vote: Hack Lasers / Disable Drone / Open Bonus Vault / Rush Exit,
  Top Heists leaderboard).
- `assets/branded/*.jpg` — themed cinematic vault chambers (purple/gold).

## Generation rule of thumb
Black chamber + brushed gold vault + **mint-green energy seams/ring** + the gold
V emblem on the door + glowing gold frame. Embers, volumetric fog, dark chrome
reflections. Premium high-stakes esports trailer. No baked text (composite the
real logo in post).
