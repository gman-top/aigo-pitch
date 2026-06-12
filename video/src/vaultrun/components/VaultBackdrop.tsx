import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { vr } from "../theme";

type Variant = "hook" | "format" | "reward" | "scale" | "closing";

const DOOR_COLORS: Record<Variant, [string, string, string]> = {
  hook: [vr.accent, vr.accent, vr.accent],
  format: [vr.safe, vr.accent, vr.violet],
  reward: [vr.gold, vr.gold, vr.gold],
  scale: [vr.accent, vr.gold, vr.violet],
  closing: [vr.accent, vr.accent, vr.accent],
};

// Floating ember particles drifting upward through fog.
const Embers: React.FC<{ count?: number; tint?: string }> = ({
  count = 46,
  tint = vr.accentSoft,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const seedX = random(`ex-${i}`);
        const seedY = random(`ey-${i}`);
        const speed = 0.3 + random(`es-${i}`) * 0.9;
        const size = 1.5 + random(`ez-${i}`) * 4;
        const drift = Math.sin((frame / 40) + i) * 30;
        const y =
          (1 - ((frame * speed) / durationInFrames + seedY)) % 1;
        const opacity =
          0.15 + 0.55 * random(`eo-${i}`) * Math.abs(Math.sin(frame / 30 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${seedX * 100}%`,
              top: `${(((y % 1) + 1) % 1) * 100}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: tint,
              boxShadow: `0 0 ${size * 4}px ${tint}`,
              transform: `translateX(${drift}px)`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// A single stylized vault door: panel, gold trim, glowing seams + wheel.
const VaultDoor: React.FC<{
  x: number | string;
  glow: string;
  scale?: number;
  open?: number; // 0 closed → 1 split open
}> = ({ x, glow, scale = 1, open = 0 }) => {
  const w = 300 * scale;
  const h = 620 * scale;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: "50%",
        transform: "translate(-50%, -46%)",
        width: w,
        height: h,
      }}
    >
      {/* hot light behind the door, revealed as it opens */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          borderRadius: 28,
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
          opacity: 0.18 + open * 0.72,
          filter: `blur(${20 + open * 30}px)`,
        }}
      />
      {/* frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          background:
            "linear-gradient(160deg, #2a2c33 0%, #121317 60%, #0b0c0f 100%)",
          border: `2px solid ${vr.goldDeep}`,
          boxShadow: `inset 0 0 60px rgba(0,0,0,0.8), 0 30px 80px rgba(0,0,0,0.6)`,
          overflow: "hidden",
        }}
      >
        {/* two leaves */}
        {[0, 1].map((side) => (
          <div
            key={side}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "50%",
              left: side === 0 ? 0 : "50%",
              transform: `translateX(${
                (side === 0 ? -1 : 1) * open * w * 0.5
              }px)`,
              background:
                "linear-gradient(150deg, #23252b, #15161a 70%, #0e0f12)",
              borderRight: side === 0 ? `1px solid ${glow}` : undefined,
              borderLeft: side === 1 ? `1px solid ${glow}` : undefined,
              boxShadow: `inset 0 0 40px rgba(0,0,0,0.7)`,
            }}
          >
            {/* horizontal seams */}
            {[0.28, 0.72].map((t) => (
              <div
                key={t}
                style={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  top: `${t * 100}%`,
                  height: 3,
                  background: vr.goldDeep,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ))}
        {/* central seam glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 4 + open * 60,
            transform: "translateX(-50%)",
            background: `linear-gradient(to bottom, transparent, ${glow}, transparent)`,
            boxShadow: `0 0 ${24 + open * 50}px ${glow}`,
            opacity: 0.9,
          }}
        />
        {/* wheel mechanism */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: w * 0.4,
            height: w * 0.4,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: `${6 * scale}px solid ${vr.goldDeep}`,
            boxShadow: `0 0 30px ${glow}66, inset 0 0 20px rgba(0,0,0,0.8)`,
            opacity: 1 - open,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "26%",
              borderRadius: "50%",
              border: `${3 * scale}px solid ${glow}`,
              boxShadow: `0 0 18px ${glow}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Procedural cinematic vault backdrop used when no AI footage is present.
export const VaultBackdrop: React.FC<{ variant: Variant }> = ({
  variant,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const colors = DOOR_COLORS[variant];
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.08]);

  // Reward scene: doors split open and gold floods in.
  const open =
    variant === "reward"
      ? interpolate(frame, [0, durationInFrames * 0.45], [0, 1], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Scale scene: render a receding grid of small glowing screens.
  const isScale = variant === "scale";

  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg, overflow: "hidden" }}>
      {/* base atmosphere */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 65% at 50% 56%, ${vr.charcoal} 0%, ${vr.bg} 68%),
            radial-gradient(circle at 50% 82%, ${colors[1]}14 0%, transparent 42%)`,
        }}
      />
      {/* floor reflection band */}
      <AbsoluteFill
        style={{
          top: "62%",
          background: `linear-gradient(to bottom, transparent, ${colors[1]}14 40%, rgba(0,0,0,0.6))`,
          transform: "scaleY(-1)",
          filter: "blur(2px)",
          opacity: 0.5,
        }}
      />

      {isScale ? (
        <ScaleGrid colors={colors} />
      ) : (
        <AbsoluteFill style={{ transform: `scale(${push})` }}>
          <VaultDoor x="26%" glow={colors[0]} scale={0.82} />
          <VaultDoor
            x="50%"
            glow={colors[1]}
            scale={1}
            open={variant === "reward" ? open : 0}
          />
          <VaultDoor x="74%" glow={colors[2]} scale={0.82} />
          {/* streamer silhouette */}
          {variant !== "reward" && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "8%",
                width: 150,
                height: 300,
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse at 50% 18%, #000 0%, #000 55%, transparent 75%)",
                clipPath:
                  "polygon(38% 0, 62% 0, 66% 22%, 78% 100%, 22% 100%, 34% 22%)",
                filter: `drop-shadow(0 0 24px ${colors[1]}55)`,
                opacity: 0.92,
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* fog layers */}
      {[0, 1, 2].map((l) => {
        const fx = interpolate(
          (frame * (0.4 + l * 0.3)) % 600,
          [0, 600],
          [-20, 20]
        );
        return (
          <AbsoluteFill
            key={l}
            style={{
              background: `radial-gradient(ellipse 70% 40% at ${
                30 + l * 22 + fx
              }% ${70 + l * 6}%, rgba(255,255,255,0.05), transparent 60%)`,
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          />
        );
      })}

      <Embers
        tint={variant === "reward" ? vr.gold : vr.accentSoft}
        count={variant === "reward" ? 70 : 46}
      />

      {/* god rays from center for reward */}
      {variant === "reward" && (
        <AbsoluteFill
          style={{
            background: `conic-gradient(from 90deg at 50% 35%, transparent, ${vr.gold}22, transparent, ${vr.gold}18, transparent)`,
            opacity: open * 0.6,
            mixBlendMode: "screen",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Receding constellation of glowing creator screens for the scale scene.
const ScaleGrid: React.FC<{ colors: [string, string, string] }> = ({
  colors,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [1.25, 0.7]);
  const tiles: React.ReactNode[] = [];
  const rows = 5;
  const cols = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const col = colors[i % 3];
      const seed = random(`tile-${i}`);
      const blink =
        0.3 + 0.7 * Math.abs(Math.sin(frame / (18 + seed * 30) + i));
      tiles.push(
        <div
          key={i}
          style={{
            width: 150,
            height: 86,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${col}33, ${vr.charcoal})`,
            border: `1px solid ${col}88`,
            boxShadow: `0 0 18px ${col}55`,
            opacity: blink,
          }}
        />
      );
    }
  }
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        perspective: 1200,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 150px)`,
          gap: 26,
          transform: `scale(${z}) rotateX(52deg) rotateZ(0deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {tiles}
      </div>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors[1]}33 0%, transparent 40%)`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
