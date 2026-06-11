import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { slides, theme, type Slide } from "./theme";

const SLIDE_DURATION = 90; // frames per slide (3s @ 30fps)

const SlideCard: React.FC<{ slide: Slide; index: number }> = ({
  slide,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const accent = index % 2 === 0 ? theme.accent : theme.lime;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.ink,
        backgroundImage: `radial-gradient(circle at 70% 30%, ${theme.ink2}, ${theme.ink})`,
        justifyContent: "center",
        padding: "0 140px",
        fontFamily: theme.font,
      }}
    >
      <div style={{ transform: `translateY(${y}px)`, opacity }}>
        <div
          style={{
            color: accent,
            letterSpacing: 8,
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          {slide.kicker}
        </div>
        <div
          style={{
            color: theme.paper,
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.04,
            maxWidth: 1280,
          }}
        >
          {slide.title}
        </div>
        {slide.body ? (
          <div
            style={{
              color: theme.paper,
              opacity: 0.7,
              fontSize: 34,
              marginTop: 36,
              maxWidth: 1040,
              lineHeight: 1.4,
            }}
          >
            {slide.body}
          </div>
        ) : null}
        <div
          style={{
            width: interpolate(enter, [0, 1], [0, 180]),
            height: 6,
            backgroundColor: accent,
            marginTop: 56,
            borderRadius: 3,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const DeckVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.ink }}>
      {slides.map((slide, i) => (
        <Sequence
          key={i}
          from={i * SLIDE_DURATION}
          durationInFrames={SLIDE_DURATION}
        >
          <SlideCard slide={slide} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = slides.length * SLIDE_DURATION;
