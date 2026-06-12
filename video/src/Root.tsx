import React from "react";
import { Composition } from "remotion";
import { DeckVideo, TOTAL_FRAMES as DECK_FRAMES } from "./DeckVideo";
import { VaultRun } from "./vaultrun/VaultRun";
import { VaultRunReal, REAL_TOTAL } from "./vaultrun/real/VaultRunReal";
import { VaultRunTrailer, TRAILER_TOTAL, TRAILER_FPS } from "./vaultrun/trailer/Trailer";
import { FPS, H, TOTAL_FRAMES, W } from "./vaultrun/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary: cinematic AI trailer (Higgsfield Kling 3.0 + real game clips). */}
      <Composition
        id="VaultRun"
        component={VaultRunTrailer}
        durationInFrames={TRAILER_TOTAL}
        fps={TRAILER_FPS}
        width={1920}
        height={1080}
      />
      {/* Product-UI cut (Remotion, real screenshots). */}
      <Composition
        id="VaultRunProductCut"
        component={VaultRunReal}
        durationInFrames={REAL_TOTAL}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* Alternate: AI-generated cinematic cut (Magnific footage + procedural). */}
      <Composition
        id="VaultRunCinematic"
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
