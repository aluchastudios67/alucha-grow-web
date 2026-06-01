import { Zap, Sprout, Palette, Headphones } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Sour-sharp performance",
    desc: "Ultra-fast loading speeds powered by clean, modern React architecture and edge delivery.",
  },
  {
    icon: Sprout,
    title: "Organic growth",
    desc: "Localised SEO tuned for the Georgian market and engineered to rank internationally.",
  },
  {
    icon: Palette,
    title: "Tailored UI",
    desc: "Bespoke 3D visuals, custom animations and design systems built to your brand.",
  },
  {
    icon: Headphones,
    title: "Georgian support",
    desc: "Local assistance, reliable hosting and effortless ongoing maintenance — in your timezone.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-alucha">Why Alucha</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
            Four roots, one <span className="text-gradient-alucha">unstoppable orchard</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Every site we grow stands on the same principles — sharp, organic, tailored, supported.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative glass rounded-2xl p-6 ring-glow transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-alucha/10 border border-alucha/20 text-alucha group-hover:bg-alucha/20 group-hover:shadow-[0_0_30px_-6px_var(--alucha)] transition-all">
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-alucha/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
