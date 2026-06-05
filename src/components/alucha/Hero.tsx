import { ArrowRight, Sparkles, Satellite } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CrystalAlucha } from "./CrystalAlucha";
import { useTranslation } from "@/hooks/useTranslation";

export function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [plumHover, setPlumHover] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setMx(x);
      setMy(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // parallax helpers
  const layer = (depth: number) => ({
    transform: `translate3d(${mx * depth * -1}px, ${my * depth * -1}px, 0)`,
    transition: "transform 200ms cubic-bezier(.2,.7,.2,1)",
  });

  return (
    <section
      id="top"
      ref={sceneRef}
      className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden"
      style={{ perspective: 1400 }}
    >
      {/* Deep void backdrop */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.08 0.01 270) 0%, oklch(0.04 0 0) 100%)" }} />

      {/* Data-pipe matrix grid */}
      <div className="absolute inset-0 grid-bg pointer-events-none" style={layer(20)} />
      <div className="data-pipe-grid pointer-events-none" style={layer(40)} />

      {/* Orbiting satellite cluster (replaces simple sphere) */}
      <div className="absolute top-24 left-6 sm:left-16" style={layer(60)}>
        <SatelliteCluster />
      </div>

      {/* Distant floating shards */}
      <div className="absolute bottom-20 right-12 opacity-70" style={layer(35)}>
        <MiniCrystal size={70} />
      </div>
      <div className="absolute top-1/3 left-1/3 opacity-40" style={layer(25)}>
        <MiniCrystal size={30} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
        <div className="animate-fade-up" style={layer(12)}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles size={14} className="text-alucha" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] text-chromatic">
            <span className="text-metallic">{t("hero.title")}</span>
            <br />
            <span className="text-gradient-alucha">{t("hero.sub")}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {t("hero.desc")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="glass-refract group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-alucha text-primary-foreground font-medium hover:shadow-[0_0_60px_-10px_var(--alucha)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t("hero.ctaLaunch")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="glass-refract inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-foreground font-medium hover:border-alucha/60 hover:bg-white/5 transition-all"
            >
              {t("hero.ctaExplore")}
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <div className="font-display text-2xl text-metallic">120+</div>
              <div className="text-xs uppercase tracking-wider">{t("hero.statSites")}</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="font-display text-2xl text-metallic">99<span className="text-alucha">/100</span></div>
              <div className="text-xs uppercase tracking-wider">{t("hero.statLighthouse")}</div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-display text-2xl text-metallic">.ge → .com</div>
              <div className="text-xs uppercase tracking-wider">{t("hero.statMarket")}</div>
            </div>
          </div>
        </div>

        {/* Crystal alucha */}
        <div
          className="relative aspect-square max-w-[560px] mx-auto w-full"
          style={{
            ...layer(45),
            transformStyle: "preserve-3d",
          }}
        >
          <div
            onMouseEnter={() => setPlumHover(true)}
            onMouseLeave={() => setPlumHover(false)}
            className="relative w-full h-full cursor-pointer"
            style={{
              transform: `rotateY(${mx * 14}deg) rotateX(${-my * 14}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 220ms cubic-bezier(.2,.7,.2,1)",
            }}
          >
            <CrystalAlucha hovered={plumHover} />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/5 h-8 rounded-full blur-2xl bg-alucha/40" />
        </div>
      </div>
    </section>
  );
}

function MiniCrystal({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          background: "linear-gradient(135deg, oklch(0.92 0.2 135) 0%, oklch(0.5 0.18 150) 100%)",
          boxShadow: "0 0 24px color-mix(in oklab, var(--alucha) 60%, transparent)",
          border: "1px solid color-mix(in oklab, white 30%, transparent)",
        }}
      />
    </div>
  );
}

function SatelliteCluster() {
  return (
    <div className="relative w-[180px] h-[180px]" style={{ perspective: 600 }}>
      {/* Core planet */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, oklch(0.85 0.2 145), oklch(0.3 0.12 150) 70%, oklch(0.12 0.05 155))",
          boxShadow: "inset -6px -8px 16px oklch(0.1 0.05 155), 0 0 36px color-mix(in oklab, var(--alucha) 60%, transparent)",
        }}
      />
      {/* Orbit ring */}
      <div className="absolute inset-0 rounded-full border border-alucha/30"
           style={{ transform: "rotateX(70deg)" }} />
      <div className="absolute inset-4 rounded-full border border-alucha/20"
           style={{ transform: "rotateX(70deg) rotateZ(30deg)" }} />

      {/* Orbiting satellites */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 animate-orbit"
          style={{
            ["--r" as string]: `${70 + i * 6}px`,
            ["--dur" as string]: `${10 + i * 4}s`,
            animationDelay: `${i * -3}s`,
          }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <Satellite size={14} className="text-alucha drop-shadow-[0_0_8px_var(--alucha)]" />
            {/* data beam */}
            <div
              className="absolute left-1/2 top-full w-px h-16 -translate-x-1/2 animate-data-beam"
              style={{
                background: "linear-gradient(180deg, var(--alucha), transparent)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
