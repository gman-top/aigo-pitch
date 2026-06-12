import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { fonts } from "../fonts";
import { vr } from "../theme";

const MESSAGES: Array<[string, string]> = [
  ["nova_rush", "GREED GREED GREED 🔥"],
  ["kz_vlt", "no way he opens it"],
  ["mira.lx", "SAFE bro trust me"],
  ["dropzone", "RISK IT ALL 🚨"],
  ["hexfan01", "chat we eating tonight"],
  ["py_ro", "MYSTERY DOOR 👀"],
  ["lootlord", "60% GREED LFG"],
  ["sana_w", "my heart is racing"],
  ["vlt_king", "DO IT DO IT DO IT"],
  ["ghost404", "this is cinema"],
  ["rektless", "free rewards if he wins??"],
  ["okok_no", "EVERYBODY VOTE 🗳️"],
  ["zzz_top", "I can't watch 😱"],
  ["fyre", "GREED IS GOOD"],
  ["lumen", "WE decide. WE win."],
  ["ace_hi", "10s LEFT VOTE NOW"],
];

const COLORS = [vr.accentSoft, vr.gold, vr.violet, "#BDFF5F", "#7FD0FF"];

// Live chat column: messages spawn faster and faster, scroll upward.
export const ChatFeed: React.FC<{
  at: number;
  rate?: number; // frames between messages at start
  accel?: number; // how much the spawn interval shrinks over time
  x?: number;
}> = ({ at, rate = 34, accel = 0.55, x = 1450 }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;

  // Compute spawn times with shrinking interval (chat "explodes").
  const spawns: number[] = [];
  let t = 0;
  let interval = rate;
  while (t < local + 400 && spawns.length < 60) {
    spawns.push(t);
    interval = Math.max(7, interval * (1 - accel * 0.08));
    t += interval;
  }
  const visible = spawns.filter((s) => s <= local).slice(-9);

  const ROW = 74;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 110,
        width: 390,
        height: 640,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        fontFamily: fonts.ui,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
      }}
    >
      {visible.map((s, idx) => {
        const i = spawns.indexOf(s);
        const age = local - s;
        const pop = interpolate(age, [0, 7], [0, 1], {
          extrapolateRight: "clamp",
        });
        const msg = MESSAGES[i % MESSAGES.length];
        const col =
          COLORS[Math.floor(random(`chatcol-${i}`) * COLORS.length)];
        return (
          <div
            key={i}
            style={{
              marginTop: 10,
              padding: "12px 16px",
              borderRadius: 14,
              background: "rgba(10,11,14,0.6)",
              border: `1px solid ${vr.glassBorder}`,
              backdropFilter: "blur(12px)",
              transform: `translateX(${(1 - pop) * 60}px)`,
              opacity: pop,
              fontSize: 21,
              lineHeight: 1.3,
              minHeight: ROW - 22,
            }}
          >
            <span style={{ color: col, fontWeight: 700 }}>{msg[0]}</span>
            <span style={{ color: "rgba(242,242,242,0.92)" }}>
              {" "}
              {msg[1]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
