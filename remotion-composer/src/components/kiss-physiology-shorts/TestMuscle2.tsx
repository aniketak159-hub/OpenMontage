import { Composition, registerRoot } from "remotion";
import { MuscleSilhouette } from "./MuscleSilhouette";

registerRoot(
  <Composition
    id="TestMuscle2"
    component={MuscleSilhouette}
    durationInFrames={210}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      highlightSequence: [
        { muscleId: "orbicularis_oris", frame: 15, label: "Orbicularis oris" },
        { muscleId: "buccinator_l", frame: 60, label: "Buccinator (L)" },
        { muscleId: "buccinator_r", frame: 60, label: "Buccinator (R)" },
        { muscleId: "zygomaticus_major_l", frame: 105, label: "Zygomaticus major (L)" },
        { muscleId: "zygomaticus_major_r", frame: 105, label: "Zygomaticus major (R)" },
      ],
      counterStart: 1,
      counterEnd: 34,
      counterStartFrame: 105,
      counterEndFrame: 210,
      showLabels: false,
      accentColor: "#00D4AA",
      silhouetteOpacity: 1
    }}
  />
);