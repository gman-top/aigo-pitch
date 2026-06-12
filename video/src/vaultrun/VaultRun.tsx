import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  S1Hook,
  S2Format,
  S3Reward,
  S4Scale,
  S5Closing,
} from "./scenes/Scenes";
import { FontFaces } from "./fonts";
import { SCENES, sec, TOTAL_FRAMES, vr } from "./theme";

const Score: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, sec(1), TOTAL_FRAMES - sec(2), TOTAL_FRAMES - 1],
    [0, 0.95, 0.95, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("audio/score.mp3")} volume={volume} />;
};

export const VaultRun: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg }}>
      <FontFaces />
      <Score />
      <Sequence from={sec(SCENES.hook.from)} durationInFrames={sec(SCENES.hook.dur)}>
        <S1Hook />
      </Sequence>
      <Sequence from={sec(SCENES.format.from)} durationInFrames={sec(SCENES.format.dur)}>
        <S2Format />
      </Sequence>
      <Sequence from={sec(SCENES.reward.from)} durationInFrames={sec(SCENES.reward.dur)}>
        <S3Reward />
      </Sequence>
      <Sequence from={sec(SCENES.scale.from)} durationInFrames={sec(SCENES.scale.dur)}>
        <S4Scale />
      </Sequence>
      <Sequence from={sec(SCENES.closing.from)} durationInFrames={sec(SCENES.closing.dur)}>
        <S5Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
