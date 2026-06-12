import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Flash, Sheen, Vignette } from "../components/Chrome";
import { VaultBackdrop } from "../components/VaultBackdrop";
import { ChatFeed } from "../components/ChatFeed";
import { Countdown, LiveBadge } from "../components/Countdown";
import { DoorLabels, RewardChips } from "../components/RewardChips";
import { VoteUI } from "../components/VoteUI";
import { Kicker, Title } from "../components/Title";
import { displayStyle, fonts } from "../fonts";
import { sec, vr } from "../theme";

type Variant = "hook" | "format" | "reward" | "scale" | "closing";

// Scene background. AI footage when `src` is given, else a procedural
// cinematic vault backdrop matched to the scene variant.
const Plate: React.FC<{
  variant: Variant;
  src?: string;
  volume?: number;
  drift?: number;
}> = ({ variant, src, volume = 0.4, drift = 1.04 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, drift]);
  if (!src) return <VaultBackdrop variant={variant} />;
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg }}>
      <OffthreadVideo
        src={staticFile(src)}
        volume={volume}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ——— 0-8s · HOOK ———
export const S1Hook: React.FC = () => (
  <AbsoluteFill>
    <Plate variant="hook" src="ai/clip1-hook.mp4" volume={0.5} />
    <Vignette />
    <Sheen />
    <LiveBadge at={sec(0.4)} />
    <ChatFeed at={sec(1.2)} rate={46} accel={0.35} />
    <Kicker text="A Hexark Live Format" at={sec(0.8)} hold={sec(2.2)} />
    <Title
      text="One creator enters the vault."
      at={sec(1.1)}
      hold={sec(1.9)}
      size={108}
      accentWord={1}
    />
    <Title
      text="The audience controls the run."
      at={sec(4.6)}
      hold={sec(2.2)}
      size={108}
      accentWord={1}
    />
    <Flash at={sec(4.45)} />
  </AbsoluteFill>
);

// ——— 8-20s · FORMAT ———
export const S2Format: React.FC = () => (
  <AbsoluteFill>
    <Plate variant="format" />
    <Vignette />
    <DoorLabels at={sec(0.4)} />
    <VoteAndChat />
    <Title text="Vote the door." at={sec(1.6)} hold={sec(1.5)} size={132} accentWord={0} y={-120} />
    <Title text="Raise the stakes." at={sec(5.0)} hold={sec(1.5)} size={132} accentWord={0} y={-120} />
    <Title text="Risk the run." at={sec(8.6)} hold={sec(2.1)} size={148} accentWord={0} y={-120} />
    <Flash at={sec(4.9)} />
    <Flash at={sec(8.5)} />
  </AbsoluteFill>
);

const VoteAndChat: React.FC = () => (
  <>
    <VoteUI at={sec(0.9)} />
    <ChatFeed at={sec(0.6)} rate={26} accel={0.8} />
    <Countdown at={sec(2.0)} from={10} x={960} y={210} scale={0.95} />
  </>
);

// ——— 20-30s · REWARD ———
export const S3Reward: React.FC = () => (
  <AbsoluteFill>
    <Plate variant="reward" />
    <Vignette strength={0.85} />
    <Flash at={sec(0.15)} color={vr.gold} />
    <Title
      text="Open the right door."
      at={sec(1.2)}
      hold={sec(1.8)}
      size={116}
      color={vr.paper}
      accentWord={2}
    />
    <Title
      text="Unlock rewards for everyone."
      at={sec(5.2)}
      hold={sec(2.6)}
      size={116}
      color={vr.gold}
    />
    <RewardChips at={sec(6.2)} />
    <ChatFeed at={sec(2.0)} rate={14} accel={0.9} />
    <Flash at={sec(5.1)} color={vr.gold} />
  </AbsoluteFill>
);

// ——— 30-38s · SCALE / ECOSYSTEM ———
export const S4Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = [
    { text: "Live on Hexark.", at: 0.8 },
    { text: "Built for creators.", at: 3.0 },
    { text: "Designed to scale.", at: 5.2 },
  ];
  return (
    <AbsoluteFill>
      <Plate variant="scale" />
      <Vignette />
      <Sheen />
      <Kicker text="The Free-to-Play Participation Layer" at={sec(0.4)} hold={sec(7)} y={-250} />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 26 }}
      >
        {lines.map((l, i) => {
          const s = spring({
            frame: frame - sec(l.at),
            fps,
            config: { damping: 15, stiffness: 150, mass: 0.7 },
          });
          return (
            <div
              key={l.text}
              style={{
                ...displayStyle,
                fontSize: 96,
                color: i === 0 ? vr.accent : vr.paper,
                textShadow: "0 8px 60px rgba(0,0,0,0.9)",
                transform: `translateY(${(1 - s) * 60}px)`,
                opacity: Math.min(1, s * 1.35),
              }}
            >
              {l.text}
            </div>
          );
        })}
      </AbsoluteFill>
      <Flash at={sec(0.6)} />
    </AbsoluteFill>
  );
};

// ——— 38-45s · CLOSING ———
export const S5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoIn = spring({
    frame: frame - sec(0.6),
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
  });
  const tagIn = interpolate(frame, [sec(2.2), sec(3.0)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aigoIn = interpolate(frame, [sec(4.2), sec(5.0)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [sec(6.1), sec(7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Plate variant="closing" src="ai/clip5-closing.mp4" volume={0.3} drift={1.03} />
      <Vignette strength={1.15} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <Img
          src={staticFile("brand/vault-run-logo.png")}
          style={{
            width: 460,
            transform: `scale(${0.85 + logoIn * 0.15})`,
            opacity: logoIn,
            filter: `drop-shadow(0 0 ${40 * logoIn}px rgba(232,180,90,0.55))`,
          }}
        />
        <div
          style={{
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 38,
            color: vr.paper,
            letterSpacing: "0.06em",
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 22}px)`,
            textShadow: "0 6px 40px rgba(0,0,0,0.9)",
          }}
        >
          Where creators play.{" "}
          <span style={{ color: vr.accent, fontWeight: 800 }}>
            And communities decide.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: aigoIn,
            marginTop: 26,
          }}
        >
          <Img
            src={staticFile("brand/logo-light.svg")}
            style={{ height: 44 }}
          />
          <span
            style={{
              fontFamily: fonts.ui,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.34em",
              color: "rgba(242,242,242,0.75)",
              textTransform: "uppercase",
            }}
          >
            An AIGO Studios Format
          </span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: fadeOut, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
