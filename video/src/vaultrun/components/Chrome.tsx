import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { vr } from "../theme";

// Cinematic vignette + top/bottom letterbox-ish gradients to seat UI on footage.
export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 1,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,${
        0.62 * strength
      }) 100%),
        linear-gradient(to bottom, rgba(0,0,0,${0.5 * strength}) 0%, transparent 18%),
        linear-gradient(to top, rgba(0,0,0,${0.66 * strength}) 0%, transparent 26%)`,
    }}
  />
);

// Hot flash used on hard cuts — spikes then decays fast.
export const Flash: React.FC<{ at: number; color?: string }> = ({
  at,
  color = vr.accentSoft,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at - 3, at, at + 14], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        background: `radial-gradient(circle at 50% 50%, #fff 0%, ${color} 45%, transparent 80%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// Slow drifting warm sheen, keeps dark frames alive.
export const Sheen: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame % 600, [0, 600], [-30, 130]);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: 0.07,
        background: `linear-gradient(115deg, transparent ${x - 25}%, ${
          vr.accentSoft
        } ${x}%, transparent ${x + 25}%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};
