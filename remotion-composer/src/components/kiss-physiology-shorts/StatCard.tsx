import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface StatCardProps {
  layout?: "single" | "comparison" | "myth-bust";
  primary?: {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    accentColor: string;
    countUpStartFrame?: number;
    countUpEndFrame?: number;
  };
  comparison?: {
    value: number;
    label: string;
    prefix?: string;
    accentColor: string;
  };
  highlightPrimary?: boolean;
  mythBust?: {
    mythText: string;
    mythColor: string;
    mythFrameStart: number;
    mythFrameEnd: number;
    crossOutFrameStart: number;
    crossOutFrameEnd: number;
    truthText: string;
    truthColor: string;
    truthFrameStart: number;
    truthFrameEnd: number;
    checkmarkFrameStart: number;
    checkmarkFrameEnd: number;
  };
  stat?: {
    value: string;
    label: string;
    accentColors: string[];
    frameStart: number;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  layout = "single",
  primary,
  comparison,
  highlightPrimary = false,
  mythBust,
  stat,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const primaryValue = primary
    ? interpolate(
        frame,
        [primary.countUpStartFrame || 0, primary.countUpEndFrame || 30],
        [0, primary.value],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const primaryScale = spring({
    frame: frame - (primary?.countUpStartFrame || 0),
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0.8,
    to: 1,
  });

  const comparisonScale = spring({
    frame: frame - (primary?.countUpEndFrame || 30),
    fps,
    config: { damping: 15, stiffness: 150 },
    from: 0.5,
    to: 1,
  });

  const mythOpacity = mythBust
    ? interpolate(frame, [mythBust.mythFrameStart, mythBust.mythFrameEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const crossOutProgress = mythBust
    ? interpolate(frame, [mythBust.crossOutFrameStart, mythBust.crossOutFrameEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const truthOpacity = mythBust
    ? interpolate(frame, [mythBust.truthFrameStart, mythBust.truthFrameEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const checkmarkProgress = mythBust
    ? interpolate(frame, [mythBust.checkmarkFrameStart, mythBust.checkmarkFrameEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const statOpacity = stat
    ? interpolate(frame, [stat.frameStart, stat.frameStart + 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const statPulse = spring({
    frame: frame - (stat?.frameStart || 0) - 30,
    fps,
    config: { damping: 10, stiffness: 80 },
    from: 1,
    to: 1.05,
  });

  if (layout === "comparison" && primary && comparison) {
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 60, padding: 40 }}>
        <div
          style={{
            transform: `scale(${comparisonScale})`,
            opacity: comparisonScale,
            textAlign: "center",
            background: "rgba(15, 15, 15, 0.9)",
            border: `2px solid ${comparison.accentColor}`,
            borderRadius: 16,
            padding: "32 48",
            minWidth: 300,
          }}
        >
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "#AAAAAA", marginBottom: 8 }}>
            {comparison.prefix || ""}
          </div>
          <div
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: 80,
              fontWeight: 700,
              color: comparison.accentColor,
              lineHeight: 1.1,
            }}
          >
            {Math.floor(primaryValue).toLocaleString()}
            <span style={{ fontSize: 32, marginLeft: 8, opacity: 0.7 }}>{comparison.label}</span>
          </div>
        </div>
        <div
          style={{
            transform: `scale(${primaryScale})`,
            opacity: primaryScale,
            textAlign: "center",
            background: "rgba(15, 15, 15, 0.95)",
            border: `3px solid ${primary.accentColor}`,
            borderRadius: 16,
            padding: "32 48",
            minWidth: 300,
            boxShadow: highlightPrimary ? `0 0 60px ${primary.accentColor}60` : "none",
          }}
        >
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "#AAAAAA", marginBottom: 8 }}>
            {primary.prefix || ""}
          </div>
          <div
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: 80,
              fontWeight: 700,
              color: primary.accentColor,
              lineHeight: 1.1,
            }}
          >
            {Math.floor(primaryValue).toLocaleString()}
            <span style={{ fontSize: 32, marginLeft: 8, opacity: 0.7 }}>{primary.label}</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (layout === "myth-bust" && mythBust && stat) {
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40, padding: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div
            style={{
              opacity: mythOpacity,
              transform: `scale(${spring({ frame: frame - mythBust.mythFrameStart, fps, config: { damping: 15, stiffness: 200 }, from: 0.5, to: 1 })})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: mythBust.mythColor,
                position: "relative",
              }}
            >
              {mythBust.mythText}
              <svg
                width="100%"
                height="60"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  opacity: crossOutProgress,
                }}
              >
                <line
                  x1="0%"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke={mythBust.mythColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="0 100"
                  style={{
                    strokeDashoffset: interpolate(crossOutProgress, [0, 1], [100, 0]),
                  }}
                />
              </svg>
            </div>
          </div>
          <div
            style={{
              opacity: truthOpacity,
              transform: `scale(${spring({ frame: frame - mythBust.truthFrameStart, fps, config: { damping: 15, stiffness: 200 }, from: 0.5, to: 1 })})`,
              textAlign: "center",
              marginTop: -12,
            }}
          >
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 600, color: mythBust.truthColor }}>
              {mythBust.truthText}
            </div>
            <svg
              width="48"
              height="48"
              style={{ marginTop: 8, opacity: checkmarkProgress }}
            >
              <polyline
                points="12,24 20,32 36,16"
                fill="none"
                stroke={mythBust.truthColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="48"
                strokeDashoffset={interpolate(checkmarkProgress, [0, 1], [48, 0])}
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            opacity: statOpacity,
            transform: `scale(${statPulse})`,
            background: "rgba(15, 15, 15, 0.95)",
            border: `2px solid ${stat.accentColors[0]}`,
            borderRadius: 16,
            padding: "24 48",
            textAlign: "center",
            boxShadow: `0 0 40px ${stat.accentColors[0]}40`,
          }}
        >
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 48, fontWeight: 700, color: stat.accentColors[0], lineHeight: 1.1 }}>
            {stat.value}
          </div>
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "#CCCCCC", marginTop: 8 }}>
            {stat.label}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(15, 15, 15, 0.9)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            transform: `scale(${primaryScale})`,
            fontSize: 128,
            color: primary?.accentColor || "#F59E0B",
            fontFamily: "Space Mono, monospace",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {Math.floor(primaryValue).toLocaleString()}
        </div>
      </div>
    </AbsoluteFill>
  );
};