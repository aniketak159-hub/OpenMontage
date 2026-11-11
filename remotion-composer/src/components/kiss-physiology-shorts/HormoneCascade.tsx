import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HormoneCascadeProps {
  activeHormone?: "dopamine" | "oxytocin" | "cortisol" | "composite";
  timelinePosition?: number;
  showScrubber?: boolean;
  showBrainDiagram?: boolean;
  brainPulse?: boolean;
  barAnimation?: "overshoot" | "smooth" | "colorMorph";
  showComposite?: boolean;
  compositeFrameStart?: number;
  timelineSequence?: Array<{
    hormone: "dopamine" | "oxytocin" | "cortisol";
    time: number;
    frameStart: number;
    frameEnd: number;
    animation: "smooth" | "colorMorph";
    colorMorphTo?: string;
  }>;
  colors?: {
    dopamine: string;
    oxytocin: string;
    cortisol: string;
  };
}

const HORMONE_COLORS = {
  dopamine: "#FFD600",
  oxytocin: "#FF6B9D",
  cortisol: "#FF3B30",
  cortisolLow: "#34C759",
};

const BRAIN_PATH = "M300,600 Q300,400 540,200 Q780,400 780,600 Q780,800 540,1000 Q300,800 300,600";
const VTA_PATH = "M540,500 Q540,540 520,580 Q500,620 540,620 Q580,620 560,580 Q540,540 540,500";
const NAc_PATH = "M540,700 Q540,740 520,780 Q500,820 540,820 Q580,820 560,780 Q540,740 540,700";
const PATHWAY_PATH = "M540,560 Q540,600 540,640 Q540,680 540,700";

export const HormoneCascade: React.FC<HormoneCascadeProps> = ({
  activeHormone = "dopamine",
  timelinePosition = 0,
  showScrubber = true,
  showBrainDiagram = true,
  brainPulse = false,
  barAnimation = "overshoot",
  showComposite = false,
  compositeFrameStart = 0,
  timelineSequence = [],
  colors = HORMONE_COLORS,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const timelineWidth = width * 0.8;
  const timelineLeft = width * 0.1;
  const timelineY = height * 0.75;

  const getBarHeight = (hormone: keyof typeof HORMONE_COLORS, animFrame: number, duration: number) => {
    const progress = interpolate(animFrame, [0, duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    if (barAnimation === "overshoot") {
      return spring({ frame: animFrame, fps, config: { damping: 8, stiffness: 100 }, from: 0, to: 1 }) * 120;
    }
    if (barAnimation === "smooth") {
      return progress * 120;
    }
    if (barAnimation === "colorMorph") {
      return progress * 120;
    }
    return progress * 120;
  };

  const dopamineBarHeight = getBarHeight("dopamine", frame - 510, 40);
  const oxytocinBarHeight = timelineSequence.find(t => t.hormone === "oxytocin")
    ? getBarHeight("oxytocin", frame - (timelineSequence.find(t => t.hormone === "oxytocin")!.frameStart), timelineSequence.find(t => t.hormone === "oxytocin")!.frameEnd - timelineSequence.find(t => t.hormone === "oxytocin")!.frameStart)
    : 0;
  const cortisolBarHeight = timelineSequence.find(t => t.hormone === "cortisol")
    ? getBarHeight("cortisol", frame - (timelineSequence.find(t => t.hormone === "cortisol")!.frameStart), timelineSequence.find(t => t.hormone === "cortisol")!.frameEnd - timelineSequence.find(t => t.hormone === "cortisol")!.frameStart)
    : 0;

  const cortisolColor = timelineSequence.find(t => t.hormone === "cortisol" && t.colorMorphTo)
    ? interpolate(
        frame,
        [timelineSequence.find(t => t.hormone === "cortisol")!.frameStart, timelineSequence.find(t => t.hormone === "cortisol")!.frameEnd],
        [colors.cortisol, t => t.colorMorphTo!],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : colors.cortisol;

  const scrubberX = interpolate(frame, [510, 900], [timelineLeft, timelineLeft + timelineWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const compositeOpacity = showComposite
    ? interpolate(frame, [compositeFrameStart, compositeFrameStart + 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const pulseScale = brainPulse
    ? 1 + spring({ frame, fps, config: { damping: 10, stiffness: 80 }, from: 0, to: 0.15 }) * Math.sin(frame / fps * 4)
    : 1;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40 }}>
      {showBrainDiagram && (
        <div style={{ marginBottom: 40, transform: `scale(${pulseScale})`, transformOrigin: "center" }}>
          <svg viewBox="0 0 1080 800" style={{ width: width * 0.7, height: "auto" }}>
            <path d={BRAIN_PATH} fill="none" stroke="#333333" strokeWidth="2" />
            <path d={VTA_PATH} fill={colors.dopamine} opacity={activeHormone === "dopamine" || activeHormone === "composite" ? 0.6 : 0.2} />
            <path d={NAc_PATH} fill={colors.dopamine} opacity={activeHormone === "dopamine" || activeHormone === "composite" ? 0.6 : 0.2} />
            <path
              d={PATHWAY_PATH}
              fill="none"
              stroke={colors.dopamine}
              strokeWidth={4}
              strokeDasharray="10 5"
              opacity={brainPulse ? 1 : 0.3}
              style={{
                strokeDashoffset: brainPulse ? -frame / 2 : 0,
                filter: brainPulse ? "drop-shadow(0 0 8px " + colors.dopamine + ")" : "none",
              }}
            />
            {activeHormone === "oxytocin" && (
              <>
                <path d={VTA_PATH} fill={colors.oxytocin} opacity={0.4} />
                <path d={NAc_PATH} fill={colors.oxytocin} opacity={0.4} />
              </>
            )}
            {activeHormone === "cortisol" && (
              <>
                <path d={VTA_PATH} fill={colors.cortisol} opacity={0.4} />
                <path d={NAc_PATH} fill={colors.cortisol} opacity={0.4} />
              </>
            )}
          </svg>
        </div>
      )}

      <div style={{ width: timelineWidth, position: "relative", marginTop: 20 }}>
        {showScrubber && (
          <div
            style={{
              position: "absolute",
              left: scrubberX - timelineLeft,
              top: -20,
              bottom: -20,
              width: 2,
              background: "rgba(255,255,255,0.5)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                left: -8,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "2px solid #00D4AA",
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 200, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
            <div
              style={{
                width: 60,
                height: dopamineBarHeight,
                background: colors.dopamine,
                borderRadius: "8px 8px 0 0",
                marginBottom: 8,
                boxShadow: `0 0 20px ${colors.dopamine}`,
                transformOrigin: "bottom",
              }}
            />
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: colors.dopamine, textAlign: "center" }}>
              DOPAMINE
            </div>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 14, color: "#AAAAAA", textAlign: "center", marginTop: 4 }}>
              ↑ REWARD
            </div>
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#888888", textAlign: "center", marginTop: 4 }}>
              t = 0s
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
            <div
              style={{
                width: 60,
                height: oxytocinBarHeight,
                background: colors.oxytocin,
                borderRadius: "8px 8px 0 0",
                marginBottom: 8,
                boxShadow: `0 0 20px ${colors.oxytocin}`,
                transformOrigin: "bottom",
              }}
            />
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: colors.oxytocin, textAlign: "center" }}>
              OXYTOCIN
            </div>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 14, color: "#AAAAAA", textAlign: "center", marginTop: 4 }}>
              ↑ BONDING
            </div>
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#888888", textAlign: "center", marginTop: 4 }}>
              t = 2min
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
            <div
              style={{
                width: 60,
                height: cortisolBarHeight,
                background: cortisolColor,
                borderRadius: "8px 8px 0 0",
                marginBottom: 8,
                boxShadow: `0 0 20px ${cortisolColor}`,
                transformOrigin: "bottom",
              }}
            />
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: cortisolColor, textAlign: "center" }}>
              CORTISOL
            </div>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 14, color: "#AAAAAA", textAlign: "center", marginTop: 4 }}>
              ↓ STRESS
            </div>
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#888888", textAlign: "center", marginTop: 4 }}>
              t = 15min
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {showScrubber && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#888888" }}>
            <span>0s</span>
            <span>2 min</span>
            <span>15 min</span>
          </div>
        )}
      </div>

      {showComposite && (
        <div
          style={{
            opacity: compositeOpacity,
            marginTop: 40,
            background: "rgba(15, 15, 15, 0.95)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 600, color: "#FFFFFF", textAlign: "center", marginBottom: 16 }}>
            15-MINUTE NEUROCHEMICAL RESET
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Space Mono, monospace", fontSize: 32, fontWeight: 700, color: colors.dopamine }}>↑</div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: colors.dopamine }}>Dopamine</div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#AAAAAA" }}>Reward pathway</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Space Mono, monospace", fontSize: 32, fontWeight: 700, color: colors.oxytocin }}>↑</div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: colors.oxytocin }}>Oxytocin</div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#AAAAAA" }}>Bonding hormone</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Space Mono, monospace", fontSize: 32, fontWeight: 700, color: colors.cortisolLow }}>↓</div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: colors.cortisolLow }}>Cortisol</div>
              <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: "#AAAAAA" }}>Stress hormone</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};