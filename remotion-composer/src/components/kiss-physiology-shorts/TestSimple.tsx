import { Composition, registerRoot } from "remotion";
import { KissPhysiologyShorts } from "./KissPhysiologyShorts";

registerRoot(
  <Composition
    id="TestSimple"
    component={KissPhysiologyShorts}
    durationInFrames={1650}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      scenes: [
        {
          id: "sc1_muscle_intro",
          component: "MuscleSilhouette",
          startFrame: 0,
          endFrame: 210,
          props: {
            highlightSequence: [
              { muscleId: "orbicularis_oris", frame: 15, label: "Orbicularis oris" },
              { muscleId: "buccinators", frame: 60, label: "Buccinators" },
              { muscleId: "zygomaticus_major", frame: 105, label: "Zygomaticus" }
            ],
            counterStart: 1,
            counterEnd: 34,
            counterStartFrame: 105,
            counterEndFrame: 210,
            showLabels: false,
            accentColor: "#00D4AA",
            silhouetteOpacity: 1
          }
        }
      ],
      kineticType: {
        font: "Inter",
        fontMono: "Space Mono",
        globalStagger: 0.3,
        scenes: [
          {
            sceneId: "sc1_muscle_intro",
            lines: [
              { text: "One kiss.", frameStart: 15, frameEnd: 45, wordByWord: true },
              { text: "34 muscles fire.", frameStart: 45, frameEnd: 105, wordByWord: true, emphasisWords: ["34", "muscles", "fire"] }
            ]
          }
        ]
      },
      music: {
        assetId: "music_ambient_underscore",
        volume: 0.25,
        fadeInFrames: 15,
        fadeOutFrames: 30,
        loop: true
      },
      subtitles: {
        enabled: true,
        style: "word-by-word",
        font: "Inter",
        fontSize: 48,
        color: "#FFFFFF",
        outlineColor: "#000000",
        background: "#00000088",
        position: "bottom-center",
        maxWordsPerLine: 8
      }
    }}
  />
);