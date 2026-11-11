import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface SimpleProps {
  text: string;
  color: string;
}

const SimpleComponent: React.FC<SimpleProps> = ({ text, color }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#0F0F0F", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ color, fontSize: 60, fontFamily: "Inter, system-ui, sans-serif" }}>
        {text} - Frame: {frame}
      </div>
    </AbsoluteFill>
  );
};

export { SimpleComponent };