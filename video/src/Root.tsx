import React from "react";
import { Composition } from "remotion";
import { DeckVideo, TOTAL_FRAMES } from "./DeckVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DeckVideo"
      component={DeckVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
