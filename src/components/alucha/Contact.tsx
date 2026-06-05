import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { submitOrder } from "@/lib/api/orders.functions";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const type = formData.get("type") as string;
    const message = formData.get("message") as string;

    try {
      const result = await submitOrder({ data: { name, email, type, message } });
      if (result.success) {
        setSent(true);
      } else {
        setError(result.emailError || "Failed to submit request.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-alucha">{t("contact.badge")}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
            {t("contact.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("contact.desc")}
          </p>
        </div>

        <div className="relative glass-strong rounded-3xl p-8 sm:p-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl bg-alucha/20 pointer-events-none" />

          {sent ? (
            <div className="relative text-center py-10 animate-fade-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-alucha/15 border border-alucha/40 mb-6 shadow-[0_0_40px_-4px_var(--alucha)]">
                <CheckCircle2 className="text-alucha" size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold">{t("contact.successTitle")}</h3>
              <p className="mt-3 text-muted-foreground">{t("contact.successDesc")}</p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm text-alucha hover:underline">{t("contact.sendAnother")}</button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative grid sm:grid-cols-2 gap-5"
            >
              <Field label={t("contact.name")} id="name">
                <input id="name" name="name" required className={inputCls} placeholder="Nino Kapanadze" disabled={loading} />
              </Field>
              <Field label={t("contact.email")} id="email">
                <input id="email" name="email" type="email" required className={inputCls} placeholder="you@brand.com" disabled={loading} />
              </Field>
              <Field label={t("contact.projectType")} id="type" className="sm:col-span-2">
                <select id="type" name="type" className={inputCls} disabled={loading}>
                  <option>{t("contact.optMarketing")}</option>
                  <option>{t("contact.optEcom")}</option>
                  <option>{t("contact.optSaas")}</option>
                  <option>{t("contact.optBrand")}</option>
                  <option>{t("contact.optOther")}</option>
                </select>
              </Field>
              <Field label={t("contact.message")} id="msg" className="sm:col-span-2">
                <textarea id="msg" name="message" rows={5} required className={inputCls} placeholder={t("contact.messagePlaceholder")} disabled={loading} />
              </Field>
              {error && (
                <div className="sm:col-span-2 text-red-500 text-sm font-medium bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 animate-fade-up">
                  {error}
                </div>
              )}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-alucha text-primary-foreground font-medium hover:shadow-[0_0_60px_-10px_var(--alucha)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  {loading ? (
                    <>
                      Sending...
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      {t("contact.cta")}
                      <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-alucha/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--alucha)_20%,transparent)] transition-all";

function Field({ label, id, children, className = "" }: { label: string; id: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
