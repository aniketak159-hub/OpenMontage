import { Composition, registerRoot } from "remotion";
import { StatCard } from "./StatCard";

registerRoot(
  <Composition
    id="TestStatCard"
    component={StatCard}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      layout: "comparison",
      primary: {
        value: 6,
        label: "CAL/MIN",
        prefix: "KISSING — ",
        accentColor: "#00D4AA",
        countUpStartFrame: 0,
        countUpEndFrame: 36,
      },
      comparison: {
        value: 4,
        label: "CAL/MIN",
        prefix: "WALKING — ",
        accentColor: "#888888",
      },
      highlightPrimary: true,
    }}
  />
);