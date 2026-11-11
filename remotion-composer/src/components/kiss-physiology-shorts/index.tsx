import { Composition, registerRoot } from "remotion";
import { KissPhysiologyShorts } from "./KissPhysiologyShorts";

registerRoot(
  <Composition
    id="KissPhysiologyShorts"
    component={KissPhysiologyShorts}
    durationInFrames={1650}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      // Props will be passed via --props from composition_props.json
    }}
  />
);