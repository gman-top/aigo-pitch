import React from "react";
import { Composition } from "remotion";
import { DeckVideo, TOTAL_FRAMES as DECK_FRAMES } from "./DeckVideo";
import { VaultRun } from "./vaultrun/VaultRun";
import { VaultRunReal, REAL_TOTAL } from "./vaultrun/real/VaultRunReal";
import { VaultRunTrailer, TRAILER_TOTAL, TRAILER_FPS } from "./vaultrun/trailer/Trailer";
import { VaultRunFinal, FINAL_FRAMES, FFPS } from "./vaultrun/final/Final";
import { FPS, H, TOTAL_FRAMES, W } from "./vaultrun/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* FINAL: original audio/structure he loves + premium visuals (real 3D
          gameplay, Cinema 3.0 shots, photoreal humans, suspense pass). */}
      <Composition
        id="VaultRunFinal"
        component={VaultRunFinal}
        durationInFrames={FINAL_FRAMES}
        fps={FFPS}
        width={1920}
        height={1080}
      />
      {/* Earlier cinematic cut (kept for reference). */}
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
