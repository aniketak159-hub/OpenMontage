import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MuscleRegion {
  id: string;
  label: string;
  path: string;
  x: number;
  y: number;
}

const MUSCLE_REGIONS: MuscleRegion[] = [
  { id: "orbicularis_oris", label: "Orbicularis oris", path: "M540,900 Q540,850 580,850 Q620,850 620,900 Q620,950 580,950 Q540,950 540,900", x: 580, y: 900 },
  { id: "buccinator_l", label: "Buccinator (L)", path: "M400,880 Q450,880 450,930 Q400,930 400,880", x: 425, y: 905 },
  { id: "buccinator_r", label: "Buccinator (R)", path: "M720,880 Q670,880 670,930 Q720,930 720,880", x: 695, y: 905 },
  { id: "zygomaticus_major_l", label: "Zygomaticus major (L)", path: "M420,780 Q460,760 500,780", x: 460, y: 770 },
  { id: "zygomaticus_major_r", label: "Zygomaticus major (R)", path: "M700,780 Q660,760 620,780", x: 660, y: 770 },
  { id: "zygomaticus_minor_l", label: "Zygomaticus minor (L)", path: "M440,740 Q470,720 500,750", x: 470, y: 730 },
  { id: "zygomaticus_minor_r", label: "Zygomaticus minor (R)", path: "M680,740 Q650,720 620,750", x: 650, y: 730 },
  { id: "risorius_l", label: "Risorius (L)", path: "M380,880 Q420,860 450,880", x: 415, y: 870 },
  { id: "risorius_r", label: "Risorius (R)", path: "M740,880 Q700,860 670,880", x: 705, y: 870 },
  { id: "levator_labii_superioris_l", label: "Levator labii superioris (L)", path: "M480,720 Q500,680 540,720", x: 510, y: 700 },
  { id: "levator_labii_superioris_r", label: "Levator labii superioris (R)", path: "M640,720 Q620,680 580,720", x: 610, y: 700 },
  { id: "levator_anguli_oris_l", label: "Levator anguli oris (L)", path: "M430,760 Q480,720 520,760", x: 480, y: 740 },
  { id: "levator_anguli_oris_r", label: "Levator anguli oris (R)", path: "M690,760 Q640,720 600,760", x: 640, y: 740 },
  { id: "depressor_anguli_oris_l", label: "Depressor anguli oris (L)", path: "M420,940 Q460,980 500,940", x: 460, y: 960 },
  { id: "depressor_anguli_oris_r", label: "Depressor anguli oris (R)", path: "M700,940 Q660,980 620,940", x: 660, y: 960 },
  { id: "depressor_labii_inferioris_l", label: "Depressor labii inferioris (L)", path: "M490,960 Q540,1000 590,960", x: 540, y: 980 },
  { id: "depressor_labii_inferioris_r", label: "Depressor labii inferioris (R)", path: "M590,960 Q540,1000 490,960", x: 540, y: 980 },
  { id: "mental_l", label: "Mentalis (L)", path: "M500,1000 Q530,1040 560,1000", x: 530, y: 1020 },
  { id: "mental_r", label: "Mentalis (R)", path: "M620,1000 Q590,1040 560,1000", x: 590, y: 1020 },
  { id: "orbicularis_oculi_l", label: "Orbicularis oculi (L)", path: "M420,680 Q480,660 540,680 Q600,680 600,720 Q540,740 480,720 Q420,720 420,680", x: 480, y: 700 },
  { id: "orbicularis_oculi_r", label: "Orbicularis oculi (R)", path: "M660,680 Q600,660 540,680 Q480,680 480,720 Q540,740 600,720 Q660,720 660,680", x: 600, y: 700 },
  { id: "frontalis_l", label: "Frontalis (L)", path: "M400,600 Q480,560 560,600", x: 480, y: 580 },
  { id: "frontalis_r", label: "Frontalis (R)", path: "M720,600 Q640,560 560,600", x: 640, y: 580 },
  { id: "corrugator_l", label: "Corrugator (L)", path: "M450,660 Q480,630 510,660", x: 480, y: 645 },
  { id: "corrugator_r", label: "Corrugator (R)", path: "M670,660 Q640,630 610,660", x: 640, y: 645 },
  { id: "procerus", label: "Procerus", path: "M520,670 Q540,640 560,670", x: 540, y: 655 },
  { id: "nasalis", label: "Nasalis", path: "M510,760 Q540,730 570,760", x: 540, y: 745 },
  { id: "levator_labii_superioris_alae_nasi_l", label: "Levator labii sup. alae nasi (L)", path: "M470,740 Q490,700 520,740", x: 495, y: 720 },
  { id: "levator_labii_superioris_alae_nasi_r", label: "Levator labii sup. alae nasi (R)", path: "M650,740 Q630,700 600,740", x: 625, y: 720 },
  { id: "depressor_septi_nasi", label: "Depressor septi nasi", path: "M530,770 Q540,740 550,770", x: 540, y: 755 },
  { id: "masseter_l", label: "Masseter (L)", path: "M380,880 Q360,940 400,1000 Q440,940 460,880", x: 410, y: 940 },
  { id: "masseter_r", label: "Masseter (R)", path: "M740,880 Q760,940 720,1000 Q680,940 660,880", x: 710, y: 940 },
  { id: "temporalis_l", label: "Temporalis (L)", path: "M360,580 Q400,540 460,580 Q420,620 360,580", x: 410, y: 560 },
  { id: "temporalis_r", label: "Temporalis (R)", path: "M760,580 Q720,540 660,580 Q700,620 760,580", x: 710, y: 560 },
];

const HEAD_SILHOUETTE = "M300,1200 Q300,400 540,200 Q780,400 780,1200 Q780,1400 540,1500 Q300,1400 300,1200";

interface MuscleSilhouetteProps {
  highlightSequence?: Array<{ muscleId: string; frame: number; label?: string }>;
  counterStart?: number;
  counterEnd?: number;
  counterStartFrame?: number;
  counterEndFrame?: number;
  showLabels?: boolean;
  labelSequence?: Array<{ muscleId: string; frame: number }>;
  accentColor?: string;
  showStatCard?: boolean;
  statCardText?: string;
  statCardColor?: string;
  silhouetteOpacity?: number;
}

export const MuscleSilhouette: React.FC<MuscleSilhouetteProps> = ({
  highlightSequence = [],
  counterStart = 1,
  counterEnd = 34,
  counterStartFrame = 0,
  counterEndFrame = 100,
  showLabels = false,
  labelSequence = [],
  accentColor = "#00D4AA",
  showStatCard = false,
  statCardText = "34 MUSCLES ACTIVATED",
  statCardColor = "#00D4AA",
  silhouetteOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const counter = interpolate(frame, [counterStartFrame, counterEndFrame], [counterStart, counterEnd], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const getHighlightProgress = (muscleId: string) => {
    const seq = highlightSequence.find(s => s.muscleId === muscleId);
    if (!seq) return 0;
    return interpolate(frame, [seq.frame, seq.frame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const getLabelOpacity = (muscleId: string) => {
    if (!showLabels) return 0;
    const seq = labelSequence.find(s => s.muscleId === muscleId);
    if (!seq) return showLabels ? 1 : 0;
    return interpolate(frame, [seq.frame, seq.frame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const statCardScale = spring({
    frame: frame - (showStatCard ? 300 : 0),
    fps,
    config: { damping: 15, stiffness: 150 },
    from: 0.5,
    to: showStatCard ? 1 : 0.5,
  });

  const statCardOpacity = spring({
    frame: frame - (showStatCard ? 300 : 0),
    fps,
    config: { damping: 20 },
    from: 0,
    to: showStatCard ? 1 : 0,
  });

  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: width, height: height }}>
        <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%", opacity: silhouetteOpacity }}>
          <path d={HEAD_SILHOUETTE} fill="none" stroke="#333333" strokeWidth="2" />
          {MUSCLE_REGIONS.map((muscle) => {
            const highlight = getHighlightProgress(muscle.id);
            const labelOpacity = getLabelOpacity(muscle.id);
            return (
              <g key={muscle.id}>
                <path
                  d={muscle.path}
                  fill={highlight > 0 ? accentColor : "transparent"}
                  stroke={highlight > 0 ? accentColor : "#444444"}
                  strokeWidth={highlight > 0 ? 0 : 1}
                  opacity={0.3 + highlight * 0.7}
                  filter={highlight > 0 ? "drop-shadow(0 0 8px " + accentColor + ")" : "none"}
                />
                {labelOpacity > 0 && (
                  <text
                    x={muscle.x}
                    y={muscle.y}
                    fill="#FFFFFF"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontSize="18"
                    fontWeight={500}
                    textAnchor="middle"
                    opacity={labelOpacity}
                    style={{ pointerEvents: "none" }}
                  >
                    {muscle.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            right: 60,
            top: height * 0.35,
            fontFamily: "Space Mono, monospace",
            fontSize: 120,
            fontWeight: 700,
            color: accentColor,
            textShadow: "0 0 20px " + accentColor,
          }}
        >
          {Math.floor(counter).toLocaleString()}
          <span style={{ fontSize: 48, marginLeft: 12, opacity: 0.7 }}> / 34</span>
        </div>

        {showStatCard && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 200,
              transform: `translateX(-50%) scale(${statCardScale})`,
              opacity: statCardOpacity,
              background: "rgba(15, 15, 15, 0.95)",
              border: `2px solid ${statCardColor}`,
              borderRadius: 16,
              padding: "24 48",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: statCardColor,
              letterSpacing: "0.1em",
              boxShadow: `0 0 40px ${statCardColor}40`,
            }}
          >
            {statCardText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};