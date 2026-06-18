import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FontFaces } from "../fonts";

const FPS = 30;
const vrc = {
  bg: "#05060a",
  gold: "#ffcf4a",
  green: "#3dffb0",
  paper: "#F2F2F2",
};

// Edit decision list — cinematic shots + real game clips, synced to the VO.
type Shot = {
  src: string;
  dur: number; // seconds on screen
  title?: string;
  accent?: string;
  kind?: "kicker" | "line" | "close";
};
const SHOTS: Shot[] = [
  { src: "shots/s1-coldopen.mp4", dur: 4.0, title: "OPEN IT", kind: "kicker" },
  { src: "shots/s2-hero.mp4", dur: 4.6, title: "Pick a door.", kind: "line" },
  { src: "game-clips/game-doors.mp4", dur: 2.1 },
  { src: "game-clips/game-dial.mp4", dur: 2.6 },
  { src: "shots/s4-stakes.mp4", dur: 4.6, title: "Run deeper. Or take the money.", accent: vrc.green, kind: "line" },
  { src: "shots/s5-reward.mp4", dur: 4.8, title: "Saved by the crowd.", accent: vrc.gold, kind: "line" },
  { src: "shots/s6-everygame.mp4", dur: 4.4, title: "Not another casino.", kind: "line" },
  { src: "game-clips/game-seasons.mp4", dur: 3.8 },
  { src: "shots/s7-scale.mp4", dur: 4.4, title: "Launch with creators.", kind: "line" },
  { src: "shots/s8-close.mp4", dur: 5.0, title: "OPEN IT", kind: "close" },
];

const f = (s: number) => Math.round(s * FPS);
const TOTAL = SHOTS.reduce((a, s) => a + f(s.dur), 0);

const TitleOverlay: React.FC<{ shot: Shot; dur: number }> = ({ shot, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!shot.title) return null;

  const inAt = 8;
  const op = interpolate(
    frame,
    [inAt, inAt + 10, dur - 12, dur - 2],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const s = spring({ frame: frame - inAt, fps, config: { damping: 18, stiffness: 140 } });

  if (shot.kind === "kicker") {
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
        <div style={{ transform: `translateY(${120 + (1 - s) * 20}px)`, fontFamily: "JetBrains Mono, monospace", color: vrc.gold, fontSize: 30, fontWeight: 800, letterSpacing: "0.6em" }}>
          {shot.title}
        </div>
      </AbsoluteFill>
    );
  }

  if (shot.kind === "close") {
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, opacity: op }}>
        <img src={staticFile("brand/vault-run-logo.png")} style={{ width: 280, transform: `scale(${0.9 + s * 0.1})`, filter: "drop-shadow(0 0 40px rgba(255,207,74,0.5))" }} />
        <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: 30, color: vrc.paper, letterSpacing: "0.04em" }}>
          Where creators play. <span style={{ color: vrc.gold }}>And communities decide.</span>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, opacity: op }}>
      <div
        style={{
          fontFamily: "Sora, sans-serif",
          fontWeight: 800,
          fontSize: 64,
          color: shot.accent ?? vrc.paper,
          textAlign: "center",
          textShadow: "0 6px 50px rgba(0,0,0,0.9)",
          transform: `translateY(${(1 - s) * 26}px)`,
          maxWidth: 1500,
        }}
      >
        {shot.title}
      </div>
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 4, 9], [0.5, 0.18, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#fff", opacity: op, mixBlendMode: "screen" }} />;
};

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);

export const VaultRunTrailer: React.FC = () => {
  const frame = useCurrentFrame();
  let cursor = 0;
  const starts = SHOTS.map((s) => {
    const start = cursor;
    cursor += f(s.dur);
    return start;
  });

  const musicVol = interpolate(frame, [0, 30, TOTAL - 45, TOTAL - 1], [0, 0.32, 0.32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const voVol = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [TOTAL - 20, TOTAL - 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: vrc.bg }}>
      <FontFaces />
      <Audio src={staticFile("audio/score.mp3")} volume={musicVol} />
      <Audio src={staticFile("audio/vo.wav")} volume={voVol} />

      {SHOTS.map((shot, i) => {
        const dur = f(shot.dur);
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={dur}>
            <AbsoluteFill style={{ backgroundColor: vrc.bg }}>
              <OffthreadVideo
                src={staticFile(shot.src)}
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Grain />
              <TitleOverlay shot={shot} dur={dur} />
              {i > 0 && <Flash dur={dur} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* cinematic letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 78, background: "#000", zIndex: 60 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 78, background: "#000", zIndex: 60 }} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut, zIndex: 70, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const TRAILER_TOTAL = TOTAL;
export const TRAILER_FPS = FPS;
