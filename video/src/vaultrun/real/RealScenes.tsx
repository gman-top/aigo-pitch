import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Flash, Vignette } from "../components/Chrome";
import { Kicker, Title } from "../components/Title";
import { displayStyle, fonts } from "../fonts";
import { sec, vr } from "../theme";
import { Letterbox, LiveRing, ScreenPlate, StarLogo } from "./Parts";
import { TileGrid } from "./TileGrid";

const VR = "game/vault-run.jpg";

// Reusable minimal title card on black with the AIGO star accent.
const TitleCard: React.FC<{
  at: number;
  text: string;
  accentWord?: number;
  hold?: number;
  size?: number;
  star?: boolean;
}> = ({ at, text, accentWord, hold = 70, size = 104, star = true }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  const fade = interpolate(
    local,
    [0, 14, hold, hold + 16],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (local < -2 || local > hold + 20) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg, opacity: fade, zIndex: 30 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${vr.accent}14, transparent 70%)`,
        }}
      />
      {star && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ transform: "translateY(-120px)" }}>
            <StarLogo at={at} size={70} />
          </div>
        </AbsoluteFill>
      )}
      <Title text={text} at={at} hold={hold} size={size} accentWord={accentWord} />
    </AbsoluteFill>
  );
};

// ——— 0–4.5s · COLD OPEN ———
export const R1Open: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${vr.charcoal}, ${vr.bg} 75%)`,
        }}
      />
      <Letterbox at={0} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <StarLogo at={sec(0.3)} size={130} />
      </AbsoluteFill>
      <Kicker text="Creator-led · Interactive · Gaming" at={sec(0.9)} hold={sec(2.0)} y={120} />
      <TitleCardInline />
      <Flash at={sec(3.5)} />
    </AbsoluteFill>
  );
};

const TitleCardInline: React.FC = () => {
  const frame = useCurrentFrame();
  const show = frame >= sec(2.6);
  if (!show) return null;
  return <Title text="Vault Run" at={sec(2.7)} hold={sec(1.0)} size={180} accentWord={1} />;
};

// ——— 4.5–13s · THE GAME (real UI) ———
export const R2Game: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: vr.bg }}>
    <ScreenPlate
      src={VR}
      from={{ scale: 1.16, x: 0.5, y: 0.46 }}
      to={{ scale: 1.32, x: 0.49, y: 0.42 }}
    />
    <Vignette strength={0.5} />
    <Letterbox />
    <LiveRing at={sec(0.6)} x="49%" y="44%" size={300} />
    <TitleCard at={sec(2.1)} text="One creator enters the vault." accentWord={1} hold={sec(2.0)} size={92} />
    <TitleCard at={sec(5.6)} text="The audience controls the run." accentWord={1} hold={sec(2.2)} size={92} />
  </AbsoluteFill>
);

// ——— 13–21s · THE MECHANIC (vote + multiplier, real UI) ———
export const R3Mechanic: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: vr.bg }}>
    <ScreenPlate
      src={VR}
      from={{ scale: 1.7, x: 0.24, y: 0.9 }}
      to={{ scale: 1.95, x: 0.2, y: 0.9 }}
      bright={1.05}
    />
    <Vignette strength={0.55} />
    <Letterbox />
    <Kicker text="Room Vote · Live" at={sec(0.3)} hold={sec(3)} y={-360} />
    <TitleCard at={sec(0.4)} text="Vote the play." accentWord={1} hold={sec(1.4)} size={120} />
    <MechanicMid />
    <TitleCard at={sec(5.6)} text="Risk the run." accentWord={1} hold={sec(2.0)} size={140} />
    <Flash at={sec(3.4)} />
  </AbsoluteFill>
);

// Middle beat of the mechanic scene: zoom to the multiplier history.
const MechanicMid: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < sec(2.6) || frame > sec(5.2)) return null;
  return (
    <>
      <AbsoluteFill style={{ zIndex: 20 }}>
        <ScreenPlate
          src={VR}
          from={{ scale: 2.0, x: 0.78, y: 0.9 }}
          to={{ scale: 2.2, x: 0.82, y: 0.9 }}
          bright={1.05}
        />
        <Vignette strength={0.55} />
      </AbsoluteFill>
      <Title text="Raise the stakes." at={sec(2.8)} hold={sec(1.4)} size={120} accentWord={1} />
    </>
  );
};

// ——— 21–27s · REWARD ———
export const R4Reward: React.FC = () => {
  const frame = useCurrentFrame();
  const goldFlash = interpolate(frame, [sec(0.2), sec(0.7), sec(1.6)], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg }}>
      <ScreenPlate
        src={VR}
        from={{ scale: 1.5, x: 0.8, y: 0.42 }}
        to={{ scale: 1.62, x: 0.82, y: 0.42 }}
        bright={1.1}
      />
      <Vignette strength={0.5} />
      <Letterbox />
      <Kicker text="Today's Top Heists" at={sec(0.3)} hold={sec(3)} y={-360} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${vr.gold}, transparent 60%)`,
          opacity: goldFlash,
          mixBlendMode: "screen",
        }}
      />
      <TitleCard at={sec(2.0)} text="The community cashes out." accentWord={3} hold={sec(2.6)} size={92} star={false} />
    </AbsoluteFill>
  );
};

// ——— 27–34s · EVERY GAME / PLATFORM ———
export const R5Platform: React.FC = () => {
  const frame = useCurrentFrame();
  const gridFade = interpolate(frame, [sec(3.4), sec(4.0)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${vr.charcoal}, ${vr.bg} 75%)`,
        }}
      />
      <Letterbox />
      <AbsoluteFill style={{ opacity: gridFade }}>
        <TileGrid at={sec(0.3)} />
        <Kicker text="One Platform · Every Game" at={sec(0.5)} hold={sec(3)} y={360} />
      </AbsoluteFill>
      <TitleCard at={sec(4.2)} text="One run becomes a format." accentWord={3} hold={sec(2.2)} size={104} />
    </AbsoluteFill>
  );
};

// ——— 34–40s · CLOSE ———
export const R6Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoIn = spring({
    frame: frame - sec(0.5),
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
  });
  const tagIn = interpolate(frame, [sec(1.8), sec(2.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const liveIn = interpolate(frame, [sec(3.2), sec(3.9)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [sec(5.0), sec(6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: vr.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 48%, ${vr.accent}1f, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <Img
          src={staticFile("brand/logo-light.svg")}
          style={{
            width: 560,
            transform: `scale(${0.86 + logoIn * 0.14})`,
            opacity: logoIn,
            filter: `drop-shadow(0 0 ${50 * logoIn}px ${vr.accent}55)`,
          }}
        />
        <div
          style={{
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 36,
            color: vr.paper,
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 22}px)`,
          }}
        >
          Building the future of{" "}
          <span style={{ color: vr.accent, fontWeight: 800 }}>
            creator-led gaming.
          </span>
        </div>
        <div
          style={{
            fontFamily: fonts.ui,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.4em",
            color: vr.gold,
            textTransform: "uppercase",
            opacity: liveIn,
            marginTop: 14,
          }}
        >
          Vault Run · Live Now
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: fadeOut, pointerEvents: "none", zIndex: 60 }}
      />
    </AbsoluteFill>
  );
};

// keep import used
void displayStyle;
