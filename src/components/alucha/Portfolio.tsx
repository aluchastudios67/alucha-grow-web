import { useTranslation } from "@/hooks/useTranslation";

// How to add screenshots:
// 1. Take a screenshot of the websites and save them as PNGs (e.g., 'sisters-flowers.png' and 'lily-rose.png').
// 2. Put them in the 'src/assets/' directory.
// 3. Uncomment the two imports below and set the 'image' property in the projects array to the imported variable names.

import sistersFlowers from "@/assets/sisters-flowers.png";
import lilyRose from "@/assets/lily-rose.png";

const projects = [
  {
    name: "Sisters' Flowers",
    tagKey: "portfolio.tagFlowersSisters",
    hue: 350,
    link: "https://tornikktana.github.io/TestWebsite/",
    image: sistersFlowers
  },
  {
    name: "Lily Rose",
    tagKey: "portfolio.tagFlowersLily",
    hue: 20,
    link: "https://lily-rose-rocket.vercel.app/",
    image: lilyRose
  },
  { nameKey: "portfolio.comingSoon", tagKey: "portfolio.tagWine", hue: 145 },
  { nameKey: "portfolio.comingSoon", tagKey: "portfolio.tagFashion", hue: 330 },
  { nameKey: "portfolio.comingSoon", tagKey: "portfolio.tagRealEstate", hue: 200 },
  { nameKey: "portfolio.comingSoon", tagKey: "portfolio.tagHospitality", hue: 30 },
];

export function Portfolio() {
  const { t } = useTranslation();

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-alucha">{t("portfolio.badge")}</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
              {t("portfolio.title")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            {t("portfolio.desc")}
          </p>
        </div>

        <div className="relative -mx-4 sm:-mx-6">
          <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 pb-8 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {projects.map((p) => {
              const displayName = p.nameKey ? t(p.nameKey) : p.name;
              const isPlaceholder = !!p.nameKey;
              const CardContent = (
                <article
                  className="group relative shrink-0 w-[320px] sm:w-[400px] snap-start glass rounded-2xl overflow-hidden ring-glow transition-all h-full flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 30% 20%, oklch(0.7 0.18 ${p.hue}) 0%, oklch(0.2 0.05 ${p.hue}) 70%)`,
                      }}
                    />
                    {/* Device mockup */}
                    <div className="absolute inset-6 rounded-xl glass-strong border border-white/10 overflow-hidden flex flex-col shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]">
                      <div className="flex gap-1 px-3 py-2 border-b border-white/5 bg-white/5 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                      </div>
                      <div className="relative flex-grow overflow-hidden bg-zinc-950/40">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={displayName}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="p-3 space-y-1.5">
                            <div className="h-2 rounded bg-white/30 w-1/2" />
                            <div className="h-1.5 rounded bg-white/15 w-3/4" />
                            <div className="h-1.5 rounded bg-white/15 w-2/3" />
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <div className="h-8 rounded bg-white/10" />
                              <div className="h-8 rounded bg-white/10" />
                              <div className="h-8 rounded bg-white/10" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{displayName}</h3>
                      {isPlaceholder ? (
                        <p className="text-xs text-muted-foreground mt-0.5">{t("portfolio.comingSoonDesc")}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">{t(p.tagKey)}</p>
                      )}
                    </div>
                    {!isPlaceholder && (
                      <span className="text-xs text-alucha opacity-0 group-hover:opacity-100 transition-opacity">{t("portfolio.view")} →</span>
                    )}
                  </div>
                </article>
              );

              if (p.link) {
                return (
                  <a
                    key={p.tagKey}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block outline-none"
                  >
                    {CardContent}
                  </a>
                );
              }

              return <div key={p.tagKey}>{CardContent}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
