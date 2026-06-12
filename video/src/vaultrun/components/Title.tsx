import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { displayStyle } from "../fonts";
import { vr } from "../theme";

type TitleProps = {
  text: string;
  at: number; // frame the title starts
  hold?: number; // frames fully visible before exit
  size?: number;
  color?: string;
  accentWord?: number; // index of the word to tint
  align?: "center" | "left";
  y?: number; // vertical center offset in px
};

// Big premium typography: words punch in staggered, exit with blur+drift.
export const Title: React.FC<TitleProps> = ({
  text,
  at,
  hold = 120,
  size = 120,
  color = vr.paper,
  accentWord,
  align = "center",
  y = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  const words = text.split(" ");
  const inDur = 10 + words.length * 4;
  const exitStart = inDur + hold;

  if (local < -5 || local > exitStart + 30) return null;

  const exit = interpolate(local, [exitStart, exitStart + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        padding: align === "left" ? "0 140px" : "0 90px",
        transform: `translateY(${y - exit * 30}px)`,
        opacity: 1 - exit,
        filter: exit > 0 ? `blur(${exit * 14}px)` : undefined,
      }}
    >
      <div
        style={{
          ...displayStyle,
          fontSize: size,
          color,
          textAlign: align,
          textShadow: "0 8px 60px rgba(0,0,0,0.85)",
          maxWidth: 1640,
        }}
      >
        {words.map((w, i) => {
          const s = spring({
            frame: local - i * 4,
            fps,
            config: { damping: 16, stiffness: 160, mass: 0.6 },
          });
          const wordColor =
            accentWord === i ? vr.accent : color;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.28em",
                color: wordColor,
                transform: `translateY(${(1 - s) * 70}px) scale(${
                  0.92 + s * 0.08
                })`,
                opacity: Math.min(1, s * 1.4),
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Small kicker label above titles / in corners.
export const Kicker: React.FC<{
  text: string;
  at: number;
  hold?: number;
  y?: number;
}> = ({ text, at, hold = 150, y = -160 }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0 || local > hold + 20) return null;
  const opacity = interpolate(
    local,
    [0, 12, hold, hold + 18],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          opacity,
          color: vr.gold,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "0.55em",
          textTransform: "uppercase",
          textShadow: "0 4px 30px rgba(0,0,0,0.9)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
