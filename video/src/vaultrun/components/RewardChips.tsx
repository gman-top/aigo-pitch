import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../fonts";
import { vr } from "../theme";

const REWARDS = ["REWARD UNLOCKED", "COMMUNITY DROP", "FREE SPINS +25", "LOOT SHARED"];

// Gold reward chips popping in a row — the community wins with the creator.
export const RewardChips: React.FC<{ at: number; y?: number }> = ({
  at,
  y = 840,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 22,
        fontFamily: fonts.ui,
      }}
    >
      {REWARDS.map((r, i) => {
        const s = spring({
          frame: local - i * 9,
          fps,
          config: { damping: 13, stiffness: 200, mass: 0.6 },
        });
        return (
          <div
            key={r}
            style={{
              padding: "16px 30px",
              borderRadius: 14,
              background:
                "linear-gradient(180deg, rgba(232,180,90,0.22), rgba(185,138,54,0.12))",
              border: `1.5px solid ${vr.gold}`,
              color: vr.gold,
              fontWeight: 800,
              fontSize: 25,
              letterSpacing: "0.12em",
              boxShadow: `0 0 36px rgba(232,180,90,0.35), inset 0 0 22px rgba(232,180,90,0.12)`,
              backdropFilter: "blur(10px)",
              transform: `translateY(${(1 - s) * 60}px) scale(${
                0.8 + s * 0.2
              })`,
              opacity: Math.min(1, s * 1.3),
            }}
          >
            {r}
          </div>
        );
      })}
    </div>
  );
};

// Door label chips pinned over the three doors in the format scene.
export const DoorLabels: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0) return null;
  const doors = [
    { label: "SAFE", color: vr.safe, x: 420 },
    { label: "GREED", color: vr.accent, x: 960 },
    { label: "MYSTERY", color: vr.violet, x: 1500 },
  ];
  return (
    <>
      {doors.map((d, i) => {
        const s = spring({
          frame: local - i * 7,
          fps,
          config: { damping: 14, stiffness: 190, mass: 0.6 },
        });
        return (
          <div
            key={d.label}
            style={{
              position: "absolute",
              left: d.x,
              top: 170,
              transform: `translateX(-50%) translateY(${
                (1 - s) * -40
              }px) scale(${0.85 + s * 0.15})`,
              opacity: Math.min(1, s * 1.3),
              padding: "13px 30px",
              borderRadius: 12,
              background: "rgba(8,9,11,0.62)",
              border: `1.5px solid ${d.color}`,
              color: d.color,
              fontFamily: fonts.ui,
              fontWeight: 800,
              fontSize: 27,
              letterSpacing: "0.3em",
              boxShadow: `0 0 28px ${d.color}44`,
              backdropFilter: "blur(10px)",
            }}
          >
            {d.label}
          </div>
        );
      })}
    </>
  );
};
