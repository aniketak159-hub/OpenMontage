import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MuscleSilhouette } from "./MuscleSilhouette";
import { StatCard } from "./StatCard";
import { HormoneCascade } from "./HormoneCascade";
import { ParticleFlow } from "./ParticleFlow";
import { FrequencyLadder } from "./FrequencyLadder";

interface KissPhysiologyShortsProps {
  // Props injected from composition_props.json
  scenes?: any[];
  kineticType?: any;
  music?: any;
  subtitles?: any;
}

export const KissPhysiologyShorts: React.FC<KissPhysiologyShortsProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Scene timing based on composition_props.json
  const SCENES = {
    sc1_muscle_intro: { start: 0, end: 210 },
    sc2_muscle_complete: { start: 210, end: 360 },
    sc3_calorie_stat: { start: 360, end: 510 },
    sc4_hormone_dopamine: { start: 510, end: 690 },
    sc5_hormone_oxytocin_cortisol: { start: 690, end: 900 },
    sc6_microbe_transfer: { start: 900, end: 1140 },
    sc7_myth_bust: { start: 1140, end: 1320 },
    sc8_frequency_ladder: { start: 1320, end: 1650 },
  };

  const isInScene = (sceneKey: keyof typeof SCENES) => {
    const scene = SCENES[sceneKey];
    return frame >= scene.start && frame < scene.end;
  };

  // Kinetic type data from props
  const kineticType = props.kineticType || { scenes: [] };
  const music = props.music || { assetId: "music_ambient_underscore", volume: 0.25, fadeInFrames: 15, fadeOutFrames: 30, loop: true };
  const subtitles = props.subtitles || { enabled: true, style: "word-by-word" };

  // Get current kinetic type lines for this frame
  const getCurrentTypeLines = () => {
    for (const scene of kineticType.scenes) {
      const sceneTiming = SCENES[scene.sceneId as keyof typeof SCENES];
      if (sceneTiming && frame >= sceneTiming.start && frame < sceneTiming.end) {
        return scene.lines.filter((line: any) => frame >= line.frameStart && frame < line.frameEnd);
      }
    }
    return [];
  };

  // Music volume with fade in/out
  const musicVolume = interpolate(frame, [0, music.fadeInFrames], [0, music.volume], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // We can't actually play audio in Remotion component, but we track it for the render
  // Audio is handled by Remotion's <Audio> component in the actual render

  return (
    <AbsoluteFill style={{ background: "#0F0F0F", overflow: "hidden" }}>
      {/* Scene 1: Muscle Intro */}
      {isInScene("sc1_muscle_intro") && (
        <MuscleSilhouette
          highlightSequence={[
            { muscleId: "orbicularis_oris", frame: 15, label: "Orbicularis oris" },
            { muscleId: "buccinator_l", frame: 60, label: "Buccinator (L)" },
            { muscleId: "buccinator_r", frame: 60, label: "Buccinator (R)" },
            { muscleId: "zygomaticus_major_l", frame: 105, label: "Zygomaticus major (L)" },
            { muscleId: "zygomaticus_major_r", frame: 105, label: "Zygomaticus major (R)" },
          ]}
          counterStart={1}
          counterEnd={34}
          counterStartFrame={105}
          counterEndFrame={210}
          showLabels={false}
          accentColor="#00D4AA"
          silhouetteOpacity={1}
        />
      )}

      {/* Scene 2: Muscle Complete */}
      {isInScene("sc2_muscle_complete") && (
        <MuscleSilhouette
          highlightSequence={[]}
          counterStart={34}
          counterEnd={34}
          showLabels={true}
          labelSequence={[
            { muscleId: "orbicularis_oris", frame: 225 },
            { muscleId: "buccinator_l", frame: 240 },
            { muscleId: "buccinator_r", frame: 240 },
            { muscleId: "zygomaticus_major_l", frame: 255 },
            { muscleId: "zygomaticus_major_r", frame: 255 },
            { muscleId: "all", frame: 270 },
          ]}
          accentColor="#00D4AA"
          showStatCard={true}
          statCardText="34 MUSCLES ACTIVATED"
          statCardColor="#00D4AA"
        />
      )}

      {/* Scene 3: Calorie Stat Comparison */}
      {isInScene("sc3_calorie_stat") && (
        <StatCard
          layout="comparison"
          primary={{
            value: 6,
            label: "CAL/MIN",
            prefix: "KISSING — ",
            accentColor: "#00D4AA",
            countUpStartFrame: 360,
            countUpEndFrame: 396,
          }}
          comparison={{
            value: 4,
            label: "CAL/MIN",
            prefix: "WALKING — ",
            accentColor: "#888888",
          }}
          highlightPrimary={true}
        />
      )}

      {/* Scene 4: Hormone Dopamine */}
      {isInScene("sc4_hormone_dopamine") && (
        <HormoneCascade
          activeHormone="dopamine"
          timelinePosition={0}
          showScrubber={true}
          showBrainDiagram={true}
          brainPulse={true}
          barAnimation="overshoot"
          colors={{
            dopamine: "#FFD600",
            oxytocin: "#FF6B9D",
            cortisol: "#FF3B30",
          }}
        />
      )}

      {/* Scene 5: Hormone Oxytocin + Cortisol */}
      {isInScene("sc5_hormone_oxytocin_cortisol") && (
        <HormoneCascade
          activeHormone="composite"
          timelinePosition={0}
          showScrubber={true}
          showBrainDiagram={false}
          showComposite={true}
          compositeFrameStart={870}
          timelineSequence={[
            { hormone: "oxytocin", time: 2, frameStart: 720, frameEnd: 756, animation: "smooth" },
            { hormone: "cortisol", time: 15, frameStart: 795, frameEnd: 840, animation: "colorMorph", colorMorphTo: "#34C759" },
          ]}
          colors={{
            dopamine: "#FFD600",
            oxytocin: "#FF6B9D",
            cortisol: "#FF3B30",
          }}
        />
      )}

      {/* Scene 6: Microbe Transfer */}
      {isInScene("sc6_microbe_transfer") && (
        <ParticleFlow
          silhouetteLeft={{ opacity: 1, enterFrame: 900, enterDuration: 18 }}
          silhouetteRight={{ opacity: 1, enterFrame: 900, enterDuration: 18 }}
          particleStream={{
            enabled: true,
            startFrame: 918,
            endFrame: 1068,
            particleCount: 5000,
            colors: ["#00FFFF", "#FF00FF", "#00FF88"],
            bloomIntensity: 0.8,
            speed: 2.0,
          }}
          counter={{
            enabled: true,
            startFrame: 918,
            endFrame: 978,
            startValue: 0,
            endValue: 80000000,
            suffix: " BACTERIA",
            compressed: true,
          }}
          colonization={{
            enabled: true,
            startFrame: 1038,
            endFrame: 1083,
            bloomColors: ["#00FFFF", "#FF00FF", "#00FF88", "#FFD600", "#FF6B9D"],
          }}
          statCard={{
            enabled: true,
            startFrame: 1098,
            text: "80,000,000",
            label: "BACTERIA TRANSFERRED",
            accentColors: ["#00FFFF", "#FF00FF", "#00FF88"],
          }}
        />
      )}

      {/* Scene 7: Myth Bust */}
      {isInScene("sc7_myth_bust") && (
        <StatCard
          layout="myth-bust"
          mythBust={{
            mythText: "GERMS?",
            mythColor: "#FF3B30",
            mythFrameStart: 1140,
            mythFrameEnd: 1152,
            crossOutFrameStart: 1152,
            crossOutFrameEnd: 1164,
            truthText: "SHARED MICROBIOME = IMMUNITY",
            truthColor: "#34C759",
            truthFrameStart: 1164,
            truthFrameEnd: 1176,
            checkmarkFrameStart: 1176,
            checkmarkFrameEnd: 1188,
          }}
          stat={{
            value: "9+",
            label: "KISSES/DAY → 80% SHARED ORAL BACTERIA",
            accentColors: ["#00FFFF", "#FF00FF", "#00FF88"],
            frameStart: 1188,
          }}
        />
      )}

      {/* Scene 8: Frequency Ladder */}
      {isInScene("sc8_frequency_ladder") && (
        <FrequencyLadder
          rungs={[
            { frequency: "1×/DAY", outcome: "BASELINE", color: "#888888", frameStart: 1320, frameEnd: 1335 },
            { frequency: "3×/DAY", outcome: "STRESS ↓", color: "#007AFF", frameStart: 1365, frameEnd: 1380 },
            { frequency: "9×/DAY", outcome: "CHOLESTEROL ↓  STRESS ↓↓", color: "#34C759", frameStart: 1410, frameEnd: 1425, isHero: true },
          ]}
          tagline="Kiss like your health depends on it."
          taglineFrameStart={1560}
          taglineFrameEnd={1590}
          finalHoldFrameStart={1590}
          finalHoldFrameEnd={1650}
          pulseLoop={true}
        />
      )}

      {/* Kinetic Type Overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 100 }}>
        {getCurrentTypeLines().map((line: any, index: number) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: height * 0.15,
              transform: "translateX(-50%)",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 48,
              fontWeight: 600,
              color: "#FFFFFF",
              textAlign: "center",
              whiteSpace: "nowrap",
              opacity: interpolate(frame, [line.frameStart, line.frameStart + 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) * interpolate(frame, [line.frameEnd - 15, line.frameEnd], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {line.wordByWord
              ? line.text.split(" ").map((word: string, wi: number) => {
                  const wordStart = line.frameStart + wi * 8;
                  const wordOpacity = interpolate(frame, [wordStart, wordStart + 12], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) * interpolate(frame, [line.frameEnd - 15, line.frameEnd], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const isEmphasis = line.emphasisWords?.some((ew: string) => line.text.toLowerCase().includes(ew.toLowerCase())) || false;
                  return (
                    <span
                      key={wi}
                      style={{
                        display: "inline-block",
                        opacity: wordOpacity,
                        color: isEmphasis ? "#00D4AA" : "#FFFFFF",
                        fontWeight: isEmphasis ? 700 : 600,
                        margin: "0 4px",
                      }}
                    >
                      {word}&#8203;
                    </span>
                  );
                })
              : line.text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};