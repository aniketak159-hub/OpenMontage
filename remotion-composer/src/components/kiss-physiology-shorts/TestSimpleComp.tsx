import { Composition, registerRoot } from "remotion";
import { SimpleComponent } from "./TestSimpleComponent";

registerRoot(
  <Composition
    id="TestSimpleComp"
    component={SimpleComponent}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      text: "Hello World",
      color: "#00D4AA",
    }}
  />
);