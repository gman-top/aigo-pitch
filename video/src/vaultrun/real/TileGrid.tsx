import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { vr } from "../theme";

const TILES = [
  "tiles/banana-hustlers.png",
  "tiles/plinko.png",
  "tiles/mine-game.png",
  "tiles/temple-of-xibalba.png",
  "tiles/uncrossable-rush.png",
];

// "Every game" — real game tiles fly into a tidy constellation grid.
export const TileGrid: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;

  const cols = 3;
  const tileW = 360;
  const tileH = 200;
  const gap = 36;
  const rows = 2;
  const gridW = cols * tileW + (cols - 1) * gap;
  const gridH = rows * tileH + (rows - 1) * gap;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: gridW,
          height: gridH,
        }}
      >
        {TILES.map((src, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const left = col * (tileW + gap);
          const top = row * (tileH + gap);
          const s = spring({
            frame: local - i * 6,
            fps,
            config: { damping: 15, stiffness: 140, mass: 0.7 },
          });
          const fromX = (random(`tx-${i}`) - 0.5) * 1400;
          const fromY = (random(`ty-${i}`) - 0.5) * 900;
          const x = fromX * (1 - s);
          const y = fromY * (1 - s);
          return (
            <div
              key={src}
              style={{
                position: "absolute",
                left,
                top,
                width: tileW,
                height: tileH,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid rgba(255,255,255,0.12)`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 24px ${vr.accent}22`,
                transform: `translate(${x}px, ${y}px) scale(${
                  0.7 + s * 0.3
                }) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`,
                opacity: Math.min(1, s * 1.4),
              }}
            >
              <Img
                src={staticFile(src)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
        {/* the 6th cell: Vault Run real capture as the hero tile */}
        <HeroTile
          left={2 * (tileW + gap)}
          top={1 * (tileH + gap)}
          w={tileW}
          h={tileH}
          local={local}
          fps={fps}
        />
      </div>
    </AbsoluteFill>
  );
};

const HeroTile: React.FC<{
  left: number;
  top: number;
  w: number;
  h: number;
  local: number;
  fps: number;
}> = ({ left, top, w, h, local, fps }) => {
  const s = spring({
    frame: local - 30,
    fps,
    config: { damping: 15, stiffness: 140, mass: 0.7 },
  });
  const glow = interpolate(local, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        borderRadius: 16,
        overflow: "hidden",
        border: `2px solid ${vr.accent}`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 ${
          40 * glow
        }px ${vr.accent}`,
        transform: `scale(${0.7 + s * 0.3})`,
        opacity: Math.min(1, s * 1.4),
      }}
    >
      <Img
        src={staticFile("game/vault-run.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${vr.accent}33, transparent 60%)`,
        }}
      />
    </div>
  );
};
