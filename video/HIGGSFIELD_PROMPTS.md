# Vault Run — Higgsfield Cinema Studio Prompts (8 shots)

Copy-paste ready for **Higgsfield** (mcp.higgsfield.ai). Per shot: model,
Cinema Studio camera (body / lens / focal + up to 3 stacked motions), the prompt,
the reference image to upload, duration, aspect. Target **1080p · 16:9 · ~5s each**,
then concatenate + score + VO + 4K upscale in Magnific.

**Global style (paste into every shot / negative):**
> Premium cinematic trailer, dark charcoal & black world, warm AIGO red-orange
> glow (#FF4627), subtle gold vault materials, violet accents, volumetric fog,
> dark chrome, premium reflections, anamorphic lens flares, shallow depth of
> field, film grain, high-stakes live-broadcast energy. NOT childish, NOT plastic
> game look, NOT generic AI transitions.
> **Negative:** text, captions, watermark, logos, morphing letters, gibberish UI text, cartoon, plastic, low-res.

**Reference images (upload to Higgsfield):**
- `R1` = AIGO red 4-point star — `assets/brand/star.png`
- `R2` = real Vault Run game UI — `assets/captures/vault-run.jpg`
- `R3` = Vault Run gold logo — `assets/brand/vault-run-logo.png`
- `R4` = game tiles — `assets/games/*.png`
- `R5` = aigo wordmark lockup — `assets/brand/logo-light.svg` (rasterize)

---

## SHOT 1 · COLD OPEN — THE STAR (text→video, 5s)
- **Model:** Veo 3.1 or Sora 2 · **Lens:** 35mm anamorphic · **Camera:** slow push-in + subtle handheld
- **Prompt:**
  > Pitch-black void filled with slow volumetric fog. A single warm red-orange
  > four-point star ignites in the center, throwing embers and god-rays outward;
  > its light barely reveals the silhouette of a colossal sealed vault door far in
  > the dark. Slow cinematic dolly push-in toward the star. Ominous, premium,
  > minimal, high-end movie-trailer cold open.
- **Ref:** R1 (optional, as style/first frame) · **Audio:** sub-bass rumble + single ember tick.

## SHOT 2 · ENTER THE VAULT — THE GAME (image→video, 5s) ★ HERO
- **Model:** Kling 3.0 or Seedance 2.0 · **Lens:** 50mm · **Camera:** dolly-in + slight parallax
- **Ref (start frame):** **R2** (real game UI)
- **Prompt:**
  > Bring this live Vault Run game screen to life cinematically. Slow dramatic
  > dolly push-in toward the glowing circular vault dial at the center; the
  > green-and-gold vault mechanism subtly rotates and pulses with light; volumetric
  > god-rays and haze drift across the HUD; embers and dust float; soft parallax
  > depth between the foreground panels and the vault; premium broadcast lighting;
  > subtle camera breathing. The interface stays intact and legible — only camera
  > motion, light, glow and particles animate.

## SHOT 3 · THE CROWD CONTROLS — VOTE (image→video, 6s)
- **Model:** Seedance 2.0 · **Lens:** 28mm · **Camera:** orbit-left + push-in (stack 2)
- **Ref:** **R2** (vote-bar crop as first frame, or full UI)
- **Prompt:**
  > Inside the dark vault arena, the live room-vote erupts: holographic smoked-glass
  > panels for the actions HACK LASERS, DISABLE DRONE, OPEN BONUS VAULT, RUSH EXIT
  > float in the air, their vote bars surging upward with energy. A storm of
  > chat-light streaks upward; crowd silhouettes roar in the fog. Camera orbits the
  > lone streamer silhouette as the votes pour in. Warm red-orange + violet glow.

## SHOT 4 · RAISE THE STAKES — TENSION (text→video, 5s)
- **Model:** Sora 2 or Kling 3.0 · **Lens:** 85mm · **Camera:** crash-zoom + dutch tilt (stack 2)
- **Prompt:**
  > Extreme tension in the vault: a security-threat meter climbs to red, laser
  > grids and patrol drones sweep across the chamber, embers swirling. A glowing
  > multiplier number accelerates upward. A streamer's hand hovers over a glowing
  > CASH OUT control, trembling, sweat catching the red light. Hard crash-zoom onto
  > the multiplier, then snap to the hand. High-stakes, cinematic, dark.

## SHOT 5 · REWARD — WIN TOGETHER (image→video, 6s)
- **Model:** Kling 3.0 · **Lens:** 24mm · **Camera:** super-dolly pull-out + crane-up (stack 2)
- **Ref:** **R2** (leaderboard crop) or text→video
- **Prompt:**
  > The bonus vault BURSTS open in blinding gold light; a huge multiplier spikes;
  > golden coins and reward shards flood out in slow motion; the crowd erupts; a
  > leaderboard of monster wins ignites along the wall. Explosive camera pull-back
  > from the vault to the roaring arena, gold particle rain everywhere. Triumphant,
  > euphoric, premium.

## SHOT 6 · EVERY GAME — PLATFORM (image→video, 5s)
- **Model:** Seedance 2.0 · **Lens:** 18mm · **Camera:** fly-through (FPV drone)
- **Ref:** **R4** (game tiles as style/refs)
- **Prompt:**
  > Pull back to reveal the vault is one of many: glowing game portals — Plinko,
  > Mines, Banana Hustlers, Aztec, Temple of Xibalba, Uncrossable Rush, Vault Run —
  > materialize as floating cabinets in an infinite dark hall, linked by ribbons of
  > warm light. Smooth FPV fly-through the constellation of games. Premium sci-fi
  > broadcast network aesthetic.

## SHOT 7 · SCALE — HEXARK (text→video, 5s)
- **Model:** Veo 3.1 · **Lens:** 35mm · **Camera:** crane-up + pull-out (stack 2)
- **Prompt:**
  > The network of vault arenas multiplies across a dark globe — a living grid of
  > live creator rooms firing clips across a pulsing hexagonal lattice of light.
  > Camera cranes up to reveal the whole network as a glowing hex constellation,
  > warm red-orange core pulsing like a heartbeat. Monumental scale, awe, premium.

## SHOT 8 · CLOSE — AIGO (image→video, 5s)
- **Model:** Kling 3.0 · **Lens:** 50mm · **Camera:** slow push-in → lock-off
- **Ref:** **R1** + **R5** (star → wordmark)
- **Prompt:**
  > Everything collapses inward into the single red-orange AIGO star, which settles
  > on pure black; embers drift and fade. Clean, minimal, premium brand resolve,
  > volumetric haze, soft reflections. Camera slowly pushes in then locks off.
- **(Brand text "aigo / Vault Run / Where creators play. And communities decide."
  is added in post — keep the plate clean.)**

---

## Post (Magnific)
1. `video_concatenate` the 8 clips in order → 40s film.
2. **Voiceover:** Magnific `audio_tts`, deep EN narrator (script in `STORYBOARD.md`).
3. **Score:** reuse generated cinematic track (or regen tighter).
4. **Title cards:** minimal premium type + AIGO star on the 5 text beats.
5. **4K upscale:** `video_upscale` (Topaz/Magnific).
