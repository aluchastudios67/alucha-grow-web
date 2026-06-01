type Props = { className?: string; size?: number };

export function PlumOrb({ className = "", size = 80 }: Props) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.95 0.18 130) 0%, oklch(0.78 0.22 145) 35%, oklch(0.45 0.16 150) 75%, oklch(0.25 0.1 155) 100%)",
            boxShadow:
              "inset -8px -10px 24px oklch(0.2 0.08 155), inset 8px 10px 18px oklch(0.95 0.2 130 / 0.6), 0 0 40px oklch(0.78 0.22 145 / 0.45)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "12%",
            left: "22%",
            width: "28%",
            height: "20%",
            background: "radial-gradient(ellipse, white 0%, transparent 70%)",
            opacity: 0.7,
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
}
