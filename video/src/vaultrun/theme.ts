// Vault Run hype video — brand system.
// Dark charcoal world, warm AIGO red-orange glow, subtle gold vault materials.
export const vr = {
  bg: "#050608",
  ink: "#08090B",
  charcoal: "#16181D",
  accent: "#FF4627",
  accentSoft: "#FF7A5F",
  gold: "#E8B45A",
  goldDeep: "#B98A36",
  violet: "#9A6BFF",
  safe: "#D8E6DC",
  paper: "#F2F2F2",
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.14)",
} as const;

export const FPS = 60;
export const W = 1920;
export const H = 1080;

// Scene boundaries in seconds → frames.
export const SCENES = {
  hook: { from: 0, dur: 8 },
  format: { from: 8, dur: 12 },
  reward: { from: 20, dur: 10 },
  scale: { from: 30, dur: 8 },
  closing: { from: 38, dur: 7 },
} as const;

export const TOTAL_SEC = 45;
export const TOTAL_FRAMES = TOTAL_SEC * FPS;

export const sec = (s: number) => Math.round(s * FPS);
