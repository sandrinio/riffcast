import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BRIEF_TEXT = "Make a 20-second product launch animation.";

const COLORS = {
  bg: "#0a0a0a",
  fg: "#ededed",
  dim: "#6b6b6b",
  accent: "#7c5cff",
  accent2: "#5cf0ff",
  accent3: "#ff5c8a",
};

const MONO =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace";
const SANS =
  "-apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif";

export const MetaDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Sequence from={0} durationInFrames={90}>
        <Scene1Brief />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <Scene2Thinking />
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        <Scene3Reveal />
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <Scene4Wordmark />
      </Sequence>
    </AbsoluteFill>
  );
};

const Scene1Brief: React.FC = () => {
  const frame = useCurrentFrame();
  const visibleChars = Math.min(
    BRIEF_TEXT.length,
    Math.floor(interpolate(frame, [0, 75], [0, BRIEF_TEXT.length], {
      extrapolateRight: "clamp",
    }))
  );
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          background: "#111",
          borderRadius: 16,
          padding: "48px 56px",
          border: `1px solid ${COLORS.dim}33`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            color: COLORS.dim,
            marginBottom: 24,
            letterSpacing: 0.5,
          }}
        >
          $ riffcast
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 44,
            color: COLORS.fg,
            lineHeight: 1.3,
            letterSpacing: -0.5,
          }}
        >
          {BRIEF_TEXT.slice(0, visibleChars)}
          <span
            style={{
              opacity: cursorOn ? 1 : 0,
              color: COLORS.accent,
            }}
          >
            ▋
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene2Thinking: React.FC = () => {
  const frame = useCurrentFrame();
  const dotCount = (Math.floor(frame / 10) % 4);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 28,
          color: COLORS.dim,
          letterSpacing: 1,
        }}
      >
        rendering{".".repeat(dotCount)}
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 60 }}>
        {[COLORS.accent, COLORS.accent2, COLORS.accent3].map((c, i) => (
          <Pulse key={c} color={c} delay={i * 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Pulse: React.FC<{ color: string; delay: number }> = ({
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const cycle = ((local % 30) + 30) % 30;
  const scale = interpolate(cycle, [0, 15, 30], [0.6, 1.2, 0.6]);
  const opacity = interpolate(cycle, [0, 15, 30], [0.3, 1, 0.3]);

  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 999,
        background: color,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};

const Scene3Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbitProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeIn = spring({ frame, fps, config: { damping: 200 } });

  const orbits = [
    { color: COLORS.accent, radius: 180, speed: 1, delay: 0 },
    { color: COLORS.accent2, radius: 240, speed: -0.7, delay: 5 },
    { color: COLORS.accent3, radius: 300, speed: 0.5, delay: 10 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 700,
          height: 700,
        }}
      >
        {orbits.map((o) => {
          const angle = orbitProgress * Math.PI * 2 * o.speed;
          const x = Math.cos(angle) * o.radius;
          const y = Math.sin(angle) * o.radius;
          const localFrame = Math.max(0, frame - o.delay);
          const dotScale = spring({
            frame: localFrame,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          return (
            <div
              key={o.color}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 60,
                height: 60,
                marginLeft: -30,
                marginTop: -30,
                borderRadius: 999,
                background: o.color,
                transform: `translate(${x}px, ${y}px) scale(${dotScale})`,
                boxShadow: `0 0 60px ${o.color}aa`,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 120,
            height: 120,
            marginLeft: -60,
            marginTop: -60,
            borderRadius: 999,
            background: COLORS.fg,
            opacity: 0.95,
            transform: `scale(${spring({
              frame: Math.max(0, frame - 15),
              fps,
              config: { damping: 10, stiffness: 80 },
            })})`,
            boxShadow: `0 0 80px ${COLORS.fg}55`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Scene4Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordmarkRise = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 90 },
  });
  const taglineFade = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 180,
          fontWeight: 700,
          color: COLORS.fg,
          letterSpacing: -6,
          transform: `translateY(${(1 - wordmarkRise) * 40}px)`,
          opacity: wordmarkRise,
        }}
      >
        riffcast
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 28,
          color: COLORS.dim,
          letterSpacing: 2,
          marginTop: 32,
          opacity: taglineFade,
        }}
      >
        type. hit enter. done.
      </div>
    </AbsoluteFill>
  );
};
