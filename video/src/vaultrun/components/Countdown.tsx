import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts } from "../fonts";
import { vr } from "../theme";

// Vote countdown: ring drains, number punches on every second.
export const Countdown: React.FC<{
  at: number;
  from?: number; // seconds to count down from
  x?: number;
  y?: number;
  scale?: number;
}> = ({ at, from = 10, x = 960, y = 200, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0 || local > from * fps + 30) return null;

  const secondsLeft = Math.max(0, from - Math.floor(local / fps));
  const tick = local % fps;
  const punch = spring({
    frame: tick,
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.5 },
    durationInFrames: 20,
  });
  const ringPct = Math.max(0, 1 - local / (from * fps));
  const urgent = secondsLeft <= 3;
  const color = urgent ? vr.accent : vr.gold;

  const R = 74;
  const C = 2 * Math.PI * R;
  const enter = interpolate(local, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x - 90 * scale,
        top: y - 90 * scale,
        width: 180 * scale,
        height: 180 * scale,
        opacity: enter,
        transform: `scale(${enter * scale})`,
        filter: urgent
          ? `drop-shadow(0 0 30px ${vr.accent}AA)`
          : `drop-shadow(0 0 18px rgba(0,0,0,0.8))`,
      }}
    >
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle
          cx={90}
          cy={90}
          r={R}
          fill="rgba(8,9,11,0.65)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={6}
        />
        <circle
          cx={90}
          cy={90}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ringPct)}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontSize: 74,
          color,
          transform: `scale(${1 + (1 - punch) * 0.35})`,
        }}
      >
        {secondsLeft}
      </div>
    </div>
  );
};

// "LIVE" badge + viewer count climbing.
export const LiveBadge: React.FC<{ at: number; baseViewers?: number }> = ({
  at,
  baseViewers = 18400,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;
  const enter = interpolate(local, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });
  const viewers = Math.floor(
    baseViewers + interpolate(local, [0, 2200], [0, 96000])
  );
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(local / 18));
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 90,
        display: "flex",
        gap: 16,
        alignItems: "center",
        opacity: enter,
        transform: `translateY(${(1 - enter) * -20}px)`,
        fontFamily: fonts.ui,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 22px",
          borderRadius: 12,
          background: "rgba(255,70,39,0.92)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: "0.14em",
          boxShadow: `0 0 ${30 * pulse}px rgba(255,70,39,0.7)`,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#fff",
            opacity: pulse,
          }}
        />
        LIVE
      </div>
      <div
        style={{
          padding: "10px 22px",
          borderRadius: 12,
          background: "rgba(10,11,14,0.6)",
          border: `1px solid ${vr.glassBorder}`,
          backdropFilter: "blur(12px)",
          color: vr.paper,
          fontWeight: 700,
          fontSize: 24,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        👁 {viewers.toLocaleString("en-US")}
      </div>
    </div>
  );
};
