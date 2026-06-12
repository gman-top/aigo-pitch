import React from "react";
import { Composition } from "remotion";
import { DeckVideo, TOTAL_FRAMES as DECK_FRAMES } from "./DeckVideo";
import { VaultRun } from "./vaultrun/VaultRun";
import { FPS, H, TOTAL_FRAMES, W } from "./vaultrun/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VaultRun"
        component={VaultRun}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="DeckVideo"
        component={DeckVideo}
        durationInFrames={DECK_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
