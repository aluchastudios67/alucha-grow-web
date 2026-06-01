import { useState } from "react";
import { Sun, Moon, Grid3x3, List, Sparkles } from "lucide-react";

type Theme = "dark" | "light";
type Layout = "grid" | "list";
type Accent = "alucha" | "plum";

export function Builder() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [layout, setLayout] = useState<Layout>("grid");
  const [accent, setAccent] = useState<Accent>("alucha");

  const accentColor = accent === "alucha" ? "var(--alucha)" : "var(--plum)";
  const isDark = theme === "dark";

  return (
    <section id="builder" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-alucha">Live demo</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight">
            The Alucha <span className="text-gradient-alucha">Micro-Editor</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A taste of how we build. Toggle the controls and watch the mock-site re-style itself
            in real time — every option below maps to a real lever in our studio workflow.
          </p>

          <div className="mt-8 space-y-5">
            <ToggleRow label="Theme">
              <PillButton active={theme === "dark"} onClick={() => setTheme("dark")} icon={<Moon size={14} />}>Dark</PillButton>
              <PillButton active={theme === "light"} onClick={() => setTheme("light")} icon={<Sun size={14} />}>Light</PillButton>
            </ToggleRow>
            <ToggleRow label="Layout">
              <PillButton active={layout === "grid"} onClick={() => setLayout("grid")} icon={<Grid3x3 size={14} />}>Grid</PillButton>
              <PillButton active={layout === "list"} onClick={() => setLayout("list")} icon={<List size={14} />}>List</PillButton>
            </ToggleRow>
            <ToggleRow label="Accent">
              <PillButton active={accent === "alucha"} onClick={() => setAccent("alucha")}>
                <span className="w-3 h-3 rounded-full" style={{ background: "var(--alucha)" }} /> Alucha green
              </PillButton>
              <PillButton active={accent === "plum"} onClick={() => setAccent("plum")}>
                <span className="w-3 h-3 rounded-full" style={{ background: "var(--plum)" }} /> Plum pink
              </PillButton>
            </ToggleRow>
          </div>
        </div>

        {/* Mock tablet */}
        <div className="relative">
          <div className="absolute -inset-10 rounded-[3rem] blur-3xl opacity-40" style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }} />
          <div className="relative rounded-[2rem] p-3 glass-strong shadow-glow">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-3 text-[11px] text-muted-foreground">preview.alucha.studio</span>
            </div>
            <div
              className="rounded-[1.4rem] p-6 transition-all duration-500"
              style={{
                background: isDark ? "oklch(0.11 0.01 270)" : "oklch(0.98 0.005 120)",
                color: isDark ? "oklch(0.98 0.005 120)" : "oklch(0.18 0.01 270)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md" style={{ background: accentColor, boxShadow: `0 0 20px -4px ${accentColor}` }} />
                  <span className="font-display font-semibold text-sm">Yourbrand</span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: `${accentColor}22`, color: accentColor }}>
                  Live
                </span>
              </div>
              <h4 className="font-display font-bold text-2xl leading-tight">
                Built in real-time
                <span style={{ color: accentColor }}>.</span>
              </h4>
              <p className="text-xs mt-2 opacity-70">Toggle the controls — the layout, palette and mood respond.</p>

              <div className={`mt-5 gap-2.5 ${layout === "grid" ? "grid grid-cols-3" : "flex flex-col"}`}>
                {[1, 2, 3, 4, 5, 6].slice(0, layout === "grid" ? 6 : 3).map((i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3 transition-all"
                    style={{
                      background: isDark ? "oklch(1 0 0 / 0.04)" : "oklch(0 0 0 / 0.04)",
                      border: `1px solid ${isDark ? "oklch(1 0 0 / 0.08)" : "oklch(0 0 0 / 0.06)"}`,
                    }}
                  >
                    <div className="w-6 h-6 rounded-md mb-2" style={{ background: `${accentColor}33` }}>
                      <Sparkles size={12} style={{ color: accentColor }} className="m-1.5" />
                    </div>
                    <div className="h-1.5 rounded-full opacity-50 mb-1" style={{ background: "currentColor", width: "80%" }} />
                    <div className="h-1.5 rounded-full opacity-30" style={{ background: "currentColor", width: "55%" }} />
                  </div>
                ))}
              </div>

              <button
                className="mt-5 w-full py-2.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: accentColor, color: "oklch(0.1 0.01 270)", boxShadow: `0 0 24px -4px ${accentColor}` }}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 pl-4 glass rounded-xl">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
}

function PillButton({
  active, onClick, children, icon,
}: { active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-alucha text-primary-foreground shadow-[0_0_20px_-4px_var(--alucha)]"
          : "text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20"
      }`}
    >
      {icon} {children}
    </button>
  );
}
