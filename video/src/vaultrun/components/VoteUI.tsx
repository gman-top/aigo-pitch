import React from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts } from "../fonts";
import { vr } from "../theme";

type Door = { label: string; color: string; target: number };

const DOORS: Door[] = [
  { label: "SAFE", color: vr.safe, target: 22 },
  { label: "GREED", color: vr.accent, target: 61 },
  { label: "MYSTERY", color: vr.violet, target: 17 },
];

// Live vote panel: three smoked-glass bars racing, GREED surges ahead.
export const VoteUI: React.FC<{ at: number; width?: number }> = ({
  at,
  width = 560,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0) return null;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        bottom: 120,
        width,
        padding: "30px 34px",
        borderRadius: 22,
        background: "rgba(10,11,14,0.55)",
        border: `1px solid ${vr.glassBorder}`,
        backdropFilter: "blur(18px)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        transform: `translateY(${(1 - enter) * 80}px)`,
        opacity: enter,
        fontFamily: fonts.ui,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <span
          style={{
            color: vr.paper,
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: "0.18em",
          }}
        >
          VOTE THE DOOR
        </span>
        <span
          style={{
            color: vr.accent,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "0.1em",
          }}
        >
          ● LIVE
        </span>
      </div>
      {DOORS.map((d, i) => {
        // Votes climb with jitter; GREED accelerates after a beat.
        const progress = interpolate(
          local,
          [20 + i * 8, 160 + i * 10],
          [3, d.target],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const jitter =
          (random(`vote-${i}-${Math.floor(frame / 6)}`) - 0.5) *
          (local > 30 ? 2.4 : 0);
        const pct = Math.max(0, Math.min(99, progress + jitter));
        const hot = d.label === "GREED" && pct > 40;
        return (
          <div key={d.label} style={{ marginBottom: i < 2 ? 18 : 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 7,
              }}
            >
              <span
                style={{
                  color: d.color,
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: "0.22em",
                }}
              >
                {d.label}
              </span>
              <span
                style={{
                  color: vr.paper,
                  fontWeight: 800,
                  fontSize: 22,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pct.toFixed(0)}%
              </span>
            </div>
            <div
              style={{
                height: 14,
                borderRadius: 7,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 7,
                  background: `linear-gradient(90deg, ${d.color}AA, ${d.color})`,
                  boxShadow: hot
                    ? `0 0 24px ${d.color}, 0 0 6px ${d.color}`
                    : `0 0 10px ${d.color}55`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
