import { Composition, registerRoot } from "remotion";
import { StatCard } from "../../remotion-composer/src/components/StatCard";

registerRoot(
  <Composition
    id="TestStatCard2"
    component={StatCard}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      stat: "TEST",
      subtitle: "Test",
      accentColor: "#00D4AA",
      backgroundColor: "#0F0F0F",
    }}
  />
);