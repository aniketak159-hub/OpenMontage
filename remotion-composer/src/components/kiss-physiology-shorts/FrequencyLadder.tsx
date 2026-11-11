import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FrequencyLadderProps {
  rungs: Array<{
    frequency: string;
    outcome: string;
    color: string;
    frameStart: number;
    frameEnd: number;
    isHero?: boolean;
  }>;
  tagline: string;
  taglineFrameStart: number;
  taglineFrameEnd: number;
  finalHoldFrameStart: number;
  finalHoldFrameEnd: number;
  pulseLoop?: boolean;
}

export const FrequencyLadder: React.FC<FrequencyLadderProps> = ({
  rungs,
  tagline,
  taglineFrameStart,
  taglineFrameEnd,
  finalHoldFrameStart,
  finalHoldFrameEnd,
  pulseLoop = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const rungElements = rungs.map((rung, index) => {
    const slideProgress = interpolate(frame, [rung.frameStart, rung.frameEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const slideY = interpolate(slideProgress, [0, 1], [200, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const scale = spring({
      frame: frame - rung.frameEnd,
      fps,
      config: { damping: 15, stiffness: 150 },
      from: 0.9,
      to: 1,
    });

    const pulseScale = pulseLoop && frame >= finalHoldFrameStart
      ? 1 + spring({ frame: frame - finalHoldFrameStart, fps, config: { damping: 8, stiffness: 50 }, from: 0, to: 0.03 }) * Math.sin((frame - finalHoldFrameStart) / fps * 2)
      : 1;

    return (
      <div
        key={rung.frequency}
        style={{
          position: "absolute",
          left: "50%",
          bottom: height * 0.15 + index * 280 - slideY,
          transform: `translateX(-50%) scale(${scale * pulseScale})`,
          opacity: slideProgress,
          transition: "none",
        }}
      >
        <div
          style={{
            background: "rgba(15, 15, 15, 0.95)",
            border: `3px solid ${rung.color}`,
            borderRadius: 16,
            padding: "24 48",
            minWidth: 400,
            textAlign: "center",
            boxShadow: rung.isHero ? `0 0 60px ${rung.color}60` : `0 0 20px ${rung.color}30`,
          }}
        >
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "#AAAAAA", marginBottom: 8 }}>
            {rung.frequency}
          </div>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 36, fontWeight: 700, color: rung.color, lineHeight: 1.2 }}>
            {rung.outcome}
          </div>
        </div>
      </div>
    );
  });

  const taglineOpacity = interpolate(frame, [taglineFrameStart, taglineFrameEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineScale = spring({
    frame: frame - taglineFrameStart,
    fps,
    config: { damping: 15, stiffness: 200 },
    from: 0.8,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: width, height: height }}>
        {rungElements}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 100,
            transform: `translateX(-50%) scale(${taglineScale})`,
            opacity: taglineOpacity,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.3,
              maxWidth: 600,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};