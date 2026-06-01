import { useMemo, useState } from "react";
import { Check } from "lucide-react";

export function Pricing() {
  const [pages, setPages] = useState(6);
  const [ecom, setEcom] = useState(false);
  const [threeD, setThreeD] = useState(true);
  const [cms, setCms] = useState(false);

  const { price, weeks } = useMemo(() => {
    let base = 1800;
    base += pages * 280;
    if (ecom) base += 2400;
    if (threeD) base += 1600;
    if (cms) base += 900;
    const w = Math.max(2, Math.round(pages * 0.4 + (ecom ? 2 : 0) + (threeD ? 1.5 : 0) + (cms ? 1 : 0)));
    return { price: base, weeks: w };
  }, [pages, ecom, threeD, cms]);

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-alucha">Estimator</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
            Shape your <span className="text-gradient-alucha">harvest</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Move the sliders, toggle the options, and see a transparent starting price and timeline.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="glass-strong rounded-2xl p-8">
            <div className="space-y-8">
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-sm font-medium">Number of pages</label>
                  <span className="font-display text-2xl text-alucha">{pages}</span>
                </div>
                <input
                  type="range" min={1} max={30} value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="alucha-slider w-full"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                  <span>Landing</span><span>Mid-site</span><span>Platform</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <Toggle label="E-commerce" sub="Cart, checkout, payments" on={ecom} onClick={() => setEcom(!ecom)} />
                <Toggle label="3D visuals" sub="Custom WebGL & motion" on={threeD} onClick={() => setThreeD(!threeD)} />
                <Toggle label="CMS" sub="Editable content backend" on={cms} onClick={() => setCms(!cms)} />
              </div>
            </div>
          </div>

          <aside className="relative glass-strong rounded-2xl p-8 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl bg-alucha/30 pointer-events-none" />
            <div className="relative">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Starting from</span>
              <div className="mt-2 font-display text-6xl font-bold text-gradient-alucha tabular-nums">
                ${price.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                ~ <span className="text-foreground font-medium">{weeks} weeks</span> to launch
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {["Discovery & design sprints", "Custom development", "Performance & SEO baseline", "30 days of post-launch care"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-muted-foreground">
                    <Check size={14} className="text-alucha shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-7 inline-flex w-full justify-center items-center px-5 py-3 rounded-xl bg-alucha text-primary-foreground font-medium hover:shadow-[0_0_40px_-8px_var(--alucha)] transition-all">
                Request detailed quote
              </a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .alucha-slider {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(to right, var(--alucha) 0%, var(--alucha) ${((pages - 1) / 29) * 100}%, oklch(1 0 0 / 0.1) ${((pages - 1) / 29) * 100}%, oklch(1 0 0 / 0.1) 100%);
          outline: none;
        }
        .alucha-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--alucha);
          border: 3px solid oklch(0.13 0.01 270);
          box-shadow: 0 0 24px var(--alucha);
          cursor: pointer;
          transition: transform .2s;
        }
        .alucha-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .alucha-slider::-moz-range-thumb {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--alucha);
          border: 3px solid oklch(0.13 0.01 270);
          box-shadow: 0 0 24px var(--alucha);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}

function Toggle({ label, sub, on, onClick }: { label: string; sub: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all ${
        on
          ? "border-alucha/60 bg-alucha/10 shadow-[0_0_24px_-8px_var(--alucha)]"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm">{label}</span>
        <span className={`w-9 h-5 rounded-full p-0.5 transition ${on ? "bg-alucha" : "bg-white/10"}`}>
          <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </button>
  );
}
