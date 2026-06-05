import { Instagram, Linkedin, Github } from "lucide-react";
import logoImage from "@/assets/alucha studios png.png";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10">
                <img src={logoImage} alt="Alucha Studios" className="w-full h-full object-cover" />
              </div>
              <div className="leading-none">
                <div className="font-display font-semibold">Alucha Studios</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("footer.location")} · Worldwide</div>
              </div>
            </a>
            <p className="mt-5 text-sm text-muted-foreground max-w-sm">
              {t("footer.desc")}
            </p>
          </div>

          <FooterCol title={t("footer.colStudio")} links={[t("footer.linkAbout"), t("footer.linkProcess"), t("footer.linkCareers")]} />
          <FooterCol 
            title={t("footer.colWork")} 
            links={[
              t("footer.linkPortfolio"), 
              // t("footer.linkPricing"), 
              t("footer.linkCaseStudies")
            ]} 
          />
          <FooterCol title={t("footer.colContact")} links={["hello@alucha.studio", "+995 555 00 00", t("footer.location")]} />
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Alucha Studios. {t("footer.copyright")}</p>
          <div className="flex items-center gap-2">
            {[Instagram, Linkedin, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-alucha hover:border-alucha/60 hover:shadow-[0_0_20px_-4px_var(--alucha)] transition-all"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.2em] text-foreground mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-muted-foreground hover:text-alucha transition-colors">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
