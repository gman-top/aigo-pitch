import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FontFaces } from "../fonts";
import { sec, vr } from "../theme";
import {
  R1Open,
  R2Game,
  R3Mechanic,
  R4Reward,
  R5Platform,
  R6Close,
} from "./RealScenes";

export const REAL_TOTAL = sec(40);

const SCENES = [
  { c: R1Open, from: 0, dur: 4.5 },
  { c: R2Game, from: 4.5, dur: 8.5 },
  { c: R3Mechanic, from: 13, dur: 8 },
  { c: R4Reward, from: 21, dur: 6 },
  { c: R5Platform, from: 27, dur: 7 },
  { c: R6Close, from: 34, dur: 6 },
];

const Score: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, sec(1), REAL_TOTAL - sec(2), REAL_TOTAL - 1],
    [0, 0.9, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("audio/score.mp3")} volume={volume} />;
};

export const VaultRunReal: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: vr.bg }}>
    <FontFaces />
    <Score />
    {SCENES.map((s, i) => {
      const Comp = s.c;
      return (
        <Sequence key={i} from={sec(s.from)} durationInFrames={sec(s.dur)}>
          <Comp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
