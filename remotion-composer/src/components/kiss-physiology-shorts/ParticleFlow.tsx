import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ParticleFlowProps {
  silhouetteLeft?: { opacity: number; enterFrame: number; enterDuration: number };
  silhouetteRight?: { opacity: number; enterFrame: number; enterDuration: number };
  particleStream?: {
    enabled: boolean;
    startFrame: number;
    endFrame: number;
    particleCount: number;
    colors: string[];
    bloomIntensity: number;
    speed: number;
  };
  counter?: {
    enabled: boolean;
    startFrame: number;
    endFrame: number;
    startValue: number;
    endValue: number;
    suffix: string;
    compressed: boolean;
  };
  colonization?: {
    enabled: boolean;
    startFrame: number;
    endFrame: number;
    bloomColors: string[];
  };
  statCard?: {
    enabled: boolean;
    startFrame: number;
    text: string;
    label: string;
    accentColors: string[];
  };
}

const SILHOUETTE_LEFT_PATH = "M200,1200 Q200,400 400,200 Q600,400 600,1200 Q600,1400 400,1500 Q200,1400 200,1200";
const SILHOUETTE_RIGHT_PATH = "M880,1200 Q880,400 680,200 Q480,400 480,1200 Q480,1400 680,1500 Q880,1400 880,1200";

function SeededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 255, b: 255 };
}

function ParticleCanvas({
  particleCount,
  colors,
  startFrame,
  endFrame,
  speed,
  width,
  height,
}: {
  particleCount: number;
  colors: string[];
  startFrame: number;
  endFrame: number;
  speed: number;
  width: number;
  height: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (progress <= 0) return null;

  const canvasRef = (el: HTMLCanvasElement | null) => {
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    const t = (frame / fps) * speed;

    for (let i = 0; i < particleCount; i++) {
      const seed = i * 7 + 1;
      const phase = SeededRandom(i * 11 + 3) * Math.PI * 2;
      const spd = 0.5 + SeededRandom(i * 3 + 5) * 1.5;

      const colorHex = colors[i % colors.length];
      const color = hexToRgb(colorHex);
      const size = 2 + SeededRandom(i * 17 + 4) * 4;
      const alpha = 0.3 + SeededRandom(i * 19 + 7) * 0.5;

      const baseX = SeededRandom(seed) * 200 - 100 + 300;
      const baseY = SeededRandom(seed * 2) * 100 + 850;

      const pathProgress = Math.min(1, (t + phase) * spd * 0.01);
      const x = baseX + Math.sin(t * spd + phase) * 30 * (1 - pathProgress) + 480 * pathProgress;
      const y = baseY - Math.cos(t * spd * 0.7 + phase) * 20 * (1 - pathProgress);

      const particleAlpha = alpha * Math.sin(progress * Math.PI) * progress;
      ctx.globalAlpha = Math.min(0.8, particleAlpha * 2);
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      ctx.arc(x * (width / 1080), y * (height / 1920), size * (width / 1080), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />;
}

function ColonizationCanvas({
  startFrame,
  endFrame,
  colors,
  width,
  height,
}: {
  startFrame: number;
  endFrame: number;
  colors: string[];
  width: number;
  height: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (progress <= 0) return null;

  const canvasRef = (el: HTMLCanvasElement | null) => {
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    const bloomCount = 200;

    for (let i = 0; i < bloomCount; i++) {
      const angle = (i / bloomCount) * Math.PI * 2;
      const radius = 50 + SeededRandom(i * 23 + 5) * 100;
      const x = 780 + Math.cos(angle) * radius;
      const y = 900 + Math.sin(angle) * radius;

      const colorHex = colors[i % colors.length];
      const color = hexToRgb(colorHex);
      const size = 1 + SeededRandom(i * 17 + 4) * 3;
      const opacity = 0.6 * progress * (0.5 + progress * 0.5);

      ctx.globalAlpha = opacity;
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.beginPath();
      ctx.arc(x * (width / 1080), y * (height / 1920), size * (width / 1080) * (0.5 + progress * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />;
}

export const ParticleFlow: React.FC<ParticleFlowProps> = ({
  silhouetteLeft = { opacity: 1, enterFrame: 0, enterDuration: 18 },
  silhouetteRight = { opacity: 1, enterFrame: 0, enterDuration: 18 },
  particleStream = { enabled: true, startFrame: 0, endFrame: 100, particleCount: 1000, colors: ["#00FFFF", "#FF00FF", "#00FF88"], bloomIntensity: 0.8, speed: 2 },
  counter = { enabled: true, startFrame: 0, endFrame: 50, startValue: 0, endValue: 80000000, suffix: "", compressed: true },
  colonization = { enabled: true, startFrame: 100, endFrame: 150, bloomColors: ["#00FFFF", "#FF00FF", "#00FF88"] },
  statCard = { enabled: true, startFrame: 150, text: "80,000,000", label: "BACTERIA TRANSFERRED", accentColors: ["#00FFFF", "#FF00FF", "#00FF88"] },
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const leftOpacity = interpolate(frame, [silhouetteLeft.enterFrame, silhouetteLeft.enterFrame + silhouetteLeft.enterDuration], [0, silhouetteLeft.opacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightOpacity = interpolate(frame, [silhouetteRight.enterFrame, silhouetteRight.enterFrame + silhouetteRight.enterDuration], [0, silhouetteRight.opacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const counterValue = counter.enabled
    ? interpolate(frame, [counter.startFrame, counter.endFrame], [counter.startValue, counter.endValue], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const counterOpacity = counter.enabled
    ? interpolate(frame, [counter.startFrame, counter.startFrame + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const statCardOpacity = statCard.enabled
    ? interpolate(frame, [statCard.startFrame, statCard.startFrame + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const statCardScale = interpolate(frame, [statCard.startFrame, statCard.startFrame + 30], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: width, height: height }}>
        {particleStream.enabled && (
          <ParticleCanvas
            particleCount={particleStream.particleCount}
            colors={particleStream.colors}
            startFrame={particleStream.startFrame}
            endFrame={particleStream.endFrame}
            speed={particleStream.speed}
            width={width}
            height={height}
          />
        )}

        {colonization.enabled && (
          <ColonizationCanvas
            startFrame={colonization.startFrame}
            endFrame={colonization.endFrame}
            colors={colonization.bloomColors}
            width={width}
            height={height}
          />
        )}

        <svg
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <path
            d={SILHOUETTE_LEFT_PATH}
            fill="none"
            stroke="#444444"
            strokeWidth="2"
            opacity={leftOpacity}
          />
          <path
            d={SILHOUETTE_RIGHT_PATH}
            fill="none"
            stroke="#444444"
            strokeWidth="2"
            opacity={rightOpacity}
          />
        </svg>

        {counter.enabled && (
          <div
            style={{
              position: "absolute",
              right: 60,
              top: height * 0.2,
              fontFamily: "Space Mono, monospace",
              fontSize: 80,
              fontWeight: 700,
              color: "#00FFFF",
              textShadow: "0 0 30px #00FFFF",
              opacity: counterOpacity,
            }}
          >
            {Math.floor(counterValue).toLocaleString()}{counter.suffix}
          </div>
        )}

        {statCard.enabled && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 180,
              transform: `translateX(-50%) scale(${statCardScale})`,
              opacity: statCardOpacity,
              background: "rgba(15, 15, 15, 0.95)",
              border: `2px solid ${statCard.accentColors[0]}`,
              borderRadius: 16,
              padding: "24 48",
              textAlign: "center",
              boxShadow: `0 0 40px ${statCard.accentColors[0]}40`,
            }}
          >
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 48, fontWeight: 700, color: statCard.accentColors[0], lineHeight: 1.1 }}>
              {statCard.text}
            </div>
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 500, color: "#CCCCCC", marginTop: 8 }}>
              {statCard.label}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};