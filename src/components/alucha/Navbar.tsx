import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/alucha-logo.png.asset.json";

const links = [
  { href: "#features", label: "Features" },
  { href: "#builder", label: "Builder" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500 ${
          scrolled ? "" : ""
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-glow-sm" : "glass"
          }`}
        >
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-alucha/60 transition">
              <img src={logoAsset.url} alt="Alucha Studios" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-alucha/0 via-alucha/10 to-transparent" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold tracking-tight text-foreground">Alucha</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Studios</span>
            </div>
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-alucha scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-alucha/50 text-alucha text-sm font-medium hover:bg-alucha/10 hover:border-alucha hover:shadow-[0_0_24px_-4px_var(--alucha)] transition-all"
            >
              Start Building
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-foreground"
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-up">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    onClick={() => setOpen(false)}
                    href={l.href}
                    className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
