import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts } from "../fonts";
import { vr } from "../theme";

// Cinematic 2.4:1 letterbox bars that ease in.
export const Letterbox: React.FC<{ at?: number; size?: number }> = ({
  at = 0,
  size = 140,
}) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [at, at + 18], [0, size], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: h,
          background: "#000",
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: h,
          background: "#000",
          zIndex: 50,
        }}
      />
    </>
  );
};

// AIGO red star with glow + optional pulse.
export const StarLogo: React.FC<{
  at: number;
  size?: number;
  pulse?: boolean;
}> = ({ at, size = 120, pulse = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const beat = pulse ? 1 + 0.05 * Math.sin((frame - at) / 14) : 1;
  return (
    <Img
      src={staticFile("game/star.png")}
      style={{
        width: size,
        height: size,
        transform: `scale(${s * beat})`,
        opacity: s,
        filter: `drop-shadow(0 0 ${size * 0.5}px ${vr.accent}) drop-shadow(0 0 ${
          size * 0.18
        }px ${vr.accentSoft})`,
      }}
    />
  );
};

type Focus = { scale: number; x: number; y: number }; // x,y in 0..1 of frame

// Ken Burns on a real screenshot: covers the frame, eases between two focus
// rectangles. Adds screen vignette + sheen for a premium broadcast feel.
export const ScreenPlate: React.FC<{
  src: string;
  from: Focus;
  to: Focus;
  bright?: number;
}> = ({ src, from, to, bright = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1]);
  const ease = t * t * (3 - 2 * t); // smoothstep
  const scale = from.scale + (to.scale - from.scale) * ease;
  const fx = from.x + (to.x - from.x) * ease;
  const fy = from.y + (to.y - from.y) * ease;
  const tx = (0.5 - fx) * width * scale;
  const ty = (0.5 - fy) * height * scale;
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${tx / scale}px, ${
            ty / scale
          }px)`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `brightness(${bright}) saturate(1.08) contrast(1.05)`,
          }}
        />
      </AbsoluteFill>
      {/* screen vignette + top/bottom seat gradients */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%),
            linear-gradient(to top, rgba(0,0,0,0.5), transparent 30%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// A focus ring + LIVE pill drawing the eye to a screen-space point.
export const LiveRing: React.FC<{
  at: number;
  x?: string;
  y?: string;
  size?: number;
}> = ({ at, x = "50%", y = "50%", size = 230 }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;
  const enter = interpolate(local, [0, 16], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pulse = (local % 50) / 50;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        opacity: enter,
        zIndex: 40,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${vr.accent}`,
          boxShadow: `0 0 30px ${vr.accent}88, inset 0 0 30px ${vr.accent}33`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${vr.accentSoft}`,
          transform: `scale(${1 + pulse * 0.4})`,
          opacity: 1 - pulse,
        }}
      />
    </div>
  );
};
