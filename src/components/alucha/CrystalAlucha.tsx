import { useMemo } from "react";

type Props = { hovered: boolean };

// Procedural icosphere-ish shard layout via spherical coordinates
function useShards(count: number) {
  return useMemo(() => {
    const shards = [] as Array<{
      x: number; y: number; z: number; rx: number; ry: number; rz: number;
      size: number; hue: number; depth: number;
    }>;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = golden * i;
      const r = 130;
      const x = Math.sin(phi) * Math.cos(theta) * r;
      const y = Math.sin(phi) * Math.sin(theta) * r;
      const z = Math.cos(phi) * r;
      const ry = (theta * 180) / Math.PI;
      const rx = (phi * 180) / Math.PI - 90;
      shards.push({
        x, y, z,
        rx, ry, rz: (i * 37) % 360,
        size: 22 + ((i * 13) % 18),
        hue: 130 + ((i * 7) % 30),
        depth: (z + r) / (2 * r),
      });
    }
    return shards;
  }, [count]);
}

export function CrystalAlucha({ hovered }: Props) {
  const shards = useShards(80);
  const explode = hovered ? 1.55 : 1;
  const fade = hovered ? 0.35 : 0.95;

  return (
    <div className="relative w-full h-full" style={{ perspective: 1200, transformStyle: "preserve-3d" }}>
      {/* Outer halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--alucha) 55%, transparent) 0%, transparent 65%)",
          opacity: hovered ? 0.9 : 0.55,
        }}
      />

      {/* Inner core scene (Tbilisi wireframes + data) — revealed on hover */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{ opacity: hovered ? 1 : 0.35, transform: `scale(${hovered ? 1 : 0.85})` }}
      >
        <InnerCore />
      </div>

      {/* Shards */}
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(0)" }}
      >
        {shards.map((s, i) => {
          const tx = s.x * explode;
          const ty = s.y * explode;
          const tz = s.z * explode;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: s.size,
                height: s.size,
                marginLeft: -s.size / 2,
                marginTop: -s.size / 2,
                transformStyle: "preserve-3d",
                transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${s.rx}deg) rotateY(${s.ry}deg) rotateZ(${s.rz}deg)`,
                transition: "transform 900ms cubic-bezier(.2,.7,.2,1), opacity 700ms ease",
                opacity: fade,
              }}
            >
              <Shard depth={s.depth} hue={s.hue} />
            </div>
          );
        })}
      </div>

      {/* Stem & leaf */}
      <div
        className="absolute left-1/2 -top-2 -translate-x-1/2 transition-all duration-700"
        style={{ transform: `translateX(-50%) translateY(${hovered ? -16 : 0}px)` }}
      >
        <div className="w-1 h-8 bg-gradient-to-b from-alucha-deep to-alucha rounded-full shadow-[0_0_12px_var(--alucha)]" />
      </div>
    </div>
  );
}

function Shard({ depth, hue }: { depth: number; hue: number }) {
  // depth 0..1: front shards brighter
  const brightness = 0.55 + depth * 0.45;
  return (
    <div
      className="w-full h-full"
      style={{
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        background: `linear-gradient(135deg,
          oklch(${0.95 * brightness} 0.18 ${hue}) 0%,
          oklch(${0.7 * brightness} 0.22 ${hue + 10}) 45%,
          oklch(${0.35 * brightness} 0.14 ${hue + 20}) 100%)`,
        border: "1px solid color-mix(in oklab, white 30%, transparent)",
        boxShadow:
          `inset 0 0 8px color-mix(in oklab, white ${20 * brightness}%, transparent),` +
          `0 0 ${10 + depth * 14}px color-mix(in oklab, var(--alucha) ${20 + depth * 40}%, transparent)`,
        backdropFilter: "blur(2px)",
      }}
    />
  );
}

function InnerCore() {
  return (
    <div className="relative w-[220px] h-[220px]" style={{ transformStyle: "preserve-3d" }}>
      {/* Peace Bridge silhouette (wireframe arch) */}
      <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 0 6px var(--alucha))" }}>
        <defs>
          <linearGradient id="wire" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.95 0.2 135)" stopOpacity="0.9" />
            <stop offset="1" stopColor="oklch(0.7 0.22 145)" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Bridge arch */}
        <path d="M20 150 Q110 60 200 150" stroke="url(#wire)" strokeWidth="1" fill="none" />
        <path d="M20 156 Q110 66 200 156" stroke="url(#wire)" strokeWidth="0.6" fill="none" opacity="0.6" />
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 20 + (180 * i) / 13;
          const y = 150 - Math.sin((i / 13) * Math.PI) * 90 + 6;
          return <line key={i} x1={x} y1={y} x2={x} y2={150} stroke="oklch(0.85 0.2 135)" strokeWidth="0.5" opacity="0.7" />;
        })}
        {/* Ground rail */}
        <line x1="20" y1="150" x2="200" y2="150" stroke="oklch(0.85 0.2 135)" strokeWidth="0.7" opacity="0.8" />

        {/* Mini bar chart */}
        {[8, 18, 12, 26, 20, 32, 22].map((h, i) => (
          <rect
            key={i}
            x={60 + i * 14}
            y={180 - h}
            width="7"
            height={h}
            fill="oklch(0.85 0.22 135)"
            opacity="0.85"
          >
            <animate attributeName="height" values={`${h};${h - 4};${h}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${180 - h};${180 - h + 4};${180 - h}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
          </rect>
        ))}

        {/* Floating data points */}
        {Array.from({ length: 12 }).map((_, i) => {
          const cx = 30 + ((i * 53) % 160);
          const cy = 30 + ((i * 37) % 80);
          return (
            <circle key={i} cx={cx} cy={cy} r="1.5" fill="oklch(0.95 0.2 135)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Code/structure lines */}
        <g opacity="0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={30} y1={30 + i * 6} x2={30 + (i % 2 ? 40 : 60)} y2={30 + i * 6} stroke="oklch(0.85 0.2 135)" strokeWidth="0.6" />
          ))}
        </g>
      </svg>
    </div>
  );
}
