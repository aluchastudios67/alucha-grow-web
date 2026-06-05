import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import plumImage from "@/assets/alucha studios png.png";
import { PlumOrb } from "./Plum";
import { useTranslation } from "@/hooks/useTranslation";

export function Hero() {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let handle: number;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 1024;
      const startScroll = isMobile ? 350 : 0;
      const maxScroll = isMobile ? 1200 : 800;
      const adjustedScroll = Math.max(0, scrollY - startScroll);
      const progress = Math.min(adjustedScroll / (maxScroll - startScroll), 1);

      if (logoContainerRef.current) {
        const translateY = progress * 120; // Parallax sink downward
        const rotate = progress * 40;       // Smooth rotation
        const scale = 1 - progress * 0.15;   // Scale down to 0.85
        logoContainerRef.current.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = `${0.25 * (1 - progress)}`;
        glowRef.current.style.transform = `translateY(${progress * 60}px) scale(${1 - progress * 0.25})`;
      }

      if (shadowRef.current) {
        shadowRef.current.style.opacity = `${1 - progress * 1.2}`;
        shadowRef.current.style.transform = `translateX(-50%) scale(${Math.max(0, 1 - progress * 0.6)})`;
      }
    };

    const throttledScroll = () => {
      cancelAnimationFrame(handle);
      handle = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      cancelAnimationFrame(handle);
    };
  }, []);

  return (
    <section id="top" className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-20 left-10 opacity-60"><PlumOrb size={36} className="animate-float-slow" /></div>
      <div className="absolute top-1/3 left-1/4 opacity-40"><PlumOrb size={22} className="animate-float-tilt" /></div>
      <div className="absolute bottom-24 right-10 opacity-50"><PlumOrb size={48} className="animate-float-slow" /></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles size={14} className="text-alucha" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]">
            {t("hero.title")}
            <br />
            <span className="text-gradient-alucha">{t("hero.sub")}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {t("hero.desc")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-alucha text-primary-foreground font-medium hover:shadow-[0_0_60px_-10px_var(--alucha)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t("hero.ctaLaunch")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-foreground font-medium hover:border-alucha/60 hover:bg-white/5 transition-all"
            >
              {t("hero.ctaExplore")}
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <div className="font-display text-2xl text-foreground">120+</div>
              <div className="text-xs uppercase tracking-wider">{t("hero.statSites")}</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="font-display text-2xl text-foreground">99<span className="text-alucha">/100</span></div>
              <div className="text-xs uppercase tracking-wider">{t("hero.statLighthouse")}</div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-display text-2xl text-foreground">.ge → .com</div>
              <div className="text-xs uppercase tracking-wider">{t("hero.statMarket")}</div>
            </div>
          </div>
        </div>

        <div className="relative aspect-square max-w-[640px] mx-auto w-full">
          <div
            ref={glowRef}
            className="absolute inset-0 rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, var(--alucha) 0%, transparent 60%)", willChange: "transform, opacity" }}
          />
          <div
            ref={logoContainerRef}
            className="w-full h-full"
            style={{ willChange: "transform" }}
          >
            <img
              src={plumImage}
              alt="Glossy 3D green alucha plum"
              width={1024}
              height={1024}
              className="relative w-full h-full object-contain animate-float-tilt drop-shadow-[0_20px_45px_rgba(34,197,94,0.18)] hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div
            ref={shadowRef}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/5 h-8 rounded-full blur-2xl bg-alucha/25"
            style={{ willChange: "transform, opacity" }}
          />
        </div>
      </div>
    </section>
  );
}
