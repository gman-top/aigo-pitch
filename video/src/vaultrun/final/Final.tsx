import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FontFaces } from "../fonts";

export const FFPS = 30;
export const FINAL_FRAMES = Math.round(30.06 * FFPS); // lock to original audio

const C = {
  bg: "#05060a",
  red: "#FF4627",
  gold: "#ffcf4a",
  green: "#3dffb0",
  paper: "#F2F2F2",
};
const f = (s: number) => Math.round(s * FFPS);

/* ————— shared chrome ————— */

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 84, background: "#000", zIndex: 80 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 84, background: "#000", zIndex: 80 }} />
  </>
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const o = 0.05 + 0.025 * random(`gr-${frame}`);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 70 }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 115% 85% at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "#fff", opacity: o, mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

// pounding-heart vignette for the suspense block
const Heartbeat: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  const ramp = interpolate(frame, [from, to], [0.25, 1]);
  const bpm = interpolate(frame, [from, to], [80, 150]);
  const beat = Math.pow(Math.abs(Math.sin((frame / FFPS) * (bpm / 60) * Math.PI)), 6);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 60,
        opacity: 0.5 * ramp * beat,
        background: `radial-gradient(ellipse 90% 70% at 50% 50%, transparent 45%, ${C.red}55 85%, #000 100%)`,
      }}
    />
  );
};

const Flash: React.FC<{ color?: string }> = ({ color = "#fff" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 9], [0.7, 0.25, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen", zIndex: 65 }} />;
};

/* ————— blocks ————— */

// 0–3.2s · cold open: real AIGO star ignites + tracked text (original vibe, crisper)
const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 13, stiffness: 90, mass: 1.1 } });
  const flicker = 0.75 + 0.25 * Math.abs(Math.sin(frame / 3.1) * Math.sin(frame / 7.7));
  const textIn = interpolate(frame, [38, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 47%, ${C.red}26 0%, transparent ${20 + s * 22}%)`,
          opacity: flicker,
        }}
      />
      <Img
        src={staticFile("brand/star.png")}
        style={{
          width: 150,
          transform: `scale(${0.4 + s * 0.6})`,
          opacity: Math.min(1, s * 1.6) * flicker,
          filter: `drop-shadow(0 0 ${30 * s * flicker}px ${C.red}) drop-shadow(0 0 ${90 * s * flicker}px ${C.red}66)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "62%",
          width: "100%",
          textAlign: "center",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 23,
          fontWeight: 700,
          letterSpacing: "0.74em",
          color: C.red,
          opacity: textIn,
          textShadow: `0 0 26px ${C.red}88`,
        }}
      >
        CREATOR-LED · INTERACTIVE · GAMING
      </div>
    </AbsoluteFill>
  );
};

// video block with optional trim/zoom/shake
const Clip: React.FC<{
  src: string;
  startFrom?: number;
  zoom?: [number, number];
  shake?: boolean;
  dur: number;
}> = ({ src, startFrom = 0, zoom = [1, 1.05], shake = false, dur }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], zoom);
  const sx = shake
    ? interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" }) *
      14 *
      (random(`shx-${frame}`) - 0.5)
    : 0;
  const sy = shake
    ? interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" }) *
      10 *
      (random(`shy-${frame}`) - 0.5)
    : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        startFrom={startFrom}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${z}) translate(${sx}px, ${sy}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// photoreal still with aggressive Ken Burns for fast suspense cuts
const Still: React.FC<{ src: string; dur: number; from?: number; to?: number; x?: number }> = ({
  src,
  dur,
  from = 1.06,
  to = 1.16,
  x = 0,
}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [from, to]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${z}) translateX(${x}px)`,
          filter: "brightness(0.96) contrast(1.06) saturate(1.05)",
        }}
      />
    </AbsoluteFill>
  );
};

// "Open it." — the beat he loves, kept sacred
const OpenIt: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 220, mass: 0.5 } });
  const out = interpolate(frame, [dur - 8, dur - 1], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 50%, ${C.red}18, transparent 55%)` }}
      />
      <div
        style={{
          fontFamily: "Sora, sans-serif",
          fontWeight: 800,
          fontSize: 110,
          color: C.paper,
          transform: `scale(${0.92 + s * 0.08})`,
          opacity: Math.min(1, s * 1.4) * (1 - out),
          textShadow: "0 10px 80px rgba(0,0,0,0.9)",
        }}
      >
        Open it<span style={{ color: C.red }}>.</span>
      </div>
    </AbsoluteFill>
  );
};

// caption bar in the original's tracked-mono style
const Caption: React.FC<{ text: string; accent?: string; at?: number }> = ({
  text,
  accent = C.gold,
  at = 8,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 118,
        width: "100%",
        textAlign: "center",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: "0.5em",
        color: accent,
        opacity: o,
        zIndex: 50,
        textShadow: `0 0 24px ${accent}66, 0 4px 30px rgba(0,0,0,0.9)`,
      }}
    >
      {text}
    </div>
  );
};

// real game tiles flying into a constellation — ONE PLATFORM · EVERY GAME
const TILES = [
  "tiles/banana-hustlers.png",
  "tiles/plinko.png",
  "tiles/mine-game.png",
  "tiles/temple-of-xibalba.png",
  "tiles/uncrossable-rush.png",
  "game/vault-run.jpg",
];
const Constellation: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = interpolate(frame, [0, dur], [0, -40]);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        justifyContent: "center",
        alignItems: "center",
        perspective: 1100,
      }}
    >
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 45%, #16181d, ${C.bg} 75%)` }}
      />
      <div
        style={{
          position: "relative",
          width: 1250,
          height: 560,
          transform: `rotateX(8deg) translateY(${drift}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {TILES.map((src, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const s = spring({ frame: frame - i * 5, fps, config: { damping: 15, stiffness: 130, mass: 0.7 } });
          const fx = (random(`cx-${i}`) - 0.5) * 1500;
          const fy = (random(`cy-${i}`) - 0.5) * 900;
          const hero = src.includes("vault-run");
          return (
            <div
              key={src}
              style={{
                position: "absolute",
                left: col * 430,
                top: row * 300,
                width: 390,
                height: 220,
                borderRadius: 14,
                overflow: "hidden",
                border: hero ? `2px solid ${C.green}` : "1px solid rgba(255,255,255,0.14)",
                boxShadow: hero
                  ? `0 24px 60px rgba(0,0,0,0.7), 0 0 44px ${C.green}66`
                  : `0 24px 60px rgba(0,0,0,0.7), 0 0 22px ${C.gold}22`,
                transform: `translate(${fx * (1 - s)}px, ${fy * (1 - s)}px) scale(${0.72 + s * 0.28})`,
                opacity: Math.min(1, s * 1.4),
              }}
            >
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// aigo end card — the "AI GO" resolve, pixel-perfect brand
const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 130, mass: 0.8 } });
  const live = interpolate(frame, [Math.min(20, dur - 10), Math.min(32, dur - 2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}
    >
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 48%, ${C.red}14, transparent 60%)` }}
      />
      <Img
        src={staticFile("brand/logo-light.svg")}
        style={{
          width: 470,
          transform: `scale(${0.9 + s * 0.1})`,
          opacity: s,
          filter: `drop-shadow(0 0 44px ${C.red}44)`,
        }}
      />
      <div
        style={{
          fontFamily: "Sora, sans-serif",
          fontWeight: 600,
          fontSize: 31,
          color: C.paper,
          opacity: s,
        }}
      >
        Building the future of <span style={{ color: C.red, fontWeight: 800 }}>creator-led gaming.</span>
      </div>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: "0.5em",
          color: C.gold,
          opacity: live,
          marginTop: 8,
        }}
      >
        VAULT RUN · LIVE NOW
      </div>
    </AbsoluteFill>
  );
};

/* ————— the cut ————— */
// Beats locked to the ORIGINAL trailer audio (music + VO + "AI GO" ending).
type Beat = { from: number; dur: number; el: (dur: number) => React.ReactNode; flash?: string };
const BEATS: Beat[] = [
  { from: f(0.0), dur: f(3.2), el: () => <ColdOpen /> },
  { from: f(3.2), dur: f(2.1), el: (d) => <Clip src="game-clips/game-doors.mp4" dur={d} zoom={[1.02, 1.09]} /> },
  { from: f(5.3), dur: f(3.1), el: (d) => <Clip src="game-rec/gameplay-3d-stage.mp4" startFrom={f(2.2)} dur={d} zoom={[1, 1.07]} /> },
  { from: f(8.4), dur: f(2.0), el: (d) => <Clip src="shots/hero-v3-cinema3.mp4" dur={d} shake zoom={[1, 1.08]} />, flash: "#fff" },
  { from: f(10.4), dur: f(1.2), el: (d) => <Still src="stills/g2-face.png" dur={d} from={1.04} to={1.18} /> },
  { from: f(11.6), dur: f(1.2), el: (d) => <Still src="stills/g4-hands.png" dur={d} from={1.18} to={1.05} /> },
  { from: f(12.8), dur: f(1.2), el: (d) => <Clip src="game-rec/gameplay-3d-stage.mp4" startFrom={f(15.2)} dur={d} zoom={[1.05, 1.16]} /> },
  { from: f(14.0), dur: f(1.3), el: (d) => <OpenIt dur={d} />, flash: "#fff" },
  {
    from: f(15.3),
    dur: f(4.2),
    el: (d) => (
      <>
        <Constellation dur={d} />
        <Caption text="ONE PLATFORM · EVERY GAME" />
      </>
    ),
  },
  {
    from: f(19.5),
    dur: f(3.0),
    el: (d) => (
      <>
        <Clip src="shots/s7-scale.mp4" dur={d} zoom={[1, 1.06]} />
        <Caption text="ONE RUN BECOMES A FORMAT" accent={C.paper} />
      </>
    ),
  },
  { from: f(22.5), dur: f(4.0), el: (d) => <Clip src="game-clips/game-seasons.mp4" dur={d} zoom={[1.01, 1.06]} /> },
  {
    from: f(26.5),
    dur: f(1.8),
    el: (d) => (
      <>
        <Clip src="game-clips/hexark.mp4" dur={d} zoom={[1.02, 1.08]} />
        <Caption text="HEXARK.IO · WHERE THE AUDIENCE GROWS" at={2} />
      </>
    ),
  },
  { from: f(28.3), dur: FINAL_FRAMES - f(28.3), el: (d) => <EndCard dur={d} /> },
];

export const VaultRunFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <FontFaces />
      {/* the original audio he loves — untouched */}
      <Audio src={staticFile("audio/original-trailer.wav")} />
      {BEATS.map((b, i) => (
        <Sequence key={i} from={b.from} durationInFrames={b.dur}>
          {b.el(b.dur)}
          {b.flash ? <Flash color={b.flash} /> : null}
        </Sequence>
      ))}
      {/* suspense engine: pounding vignette through the escalation block */}
      <Heartbeat from={f(8.4)} to={f(14.0)} />
      <Letterbox />
      <Grain />
    </AbsoluteFill>
  );
};
