import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-alucha">Contact</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
            Let&rsquo;s grow something <span className="text-gradient-alucha">together</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Tell us about your project — we reply within one business day.
          </p>
        </div>

        <div className="relative glass-strong rounded-3xl p-8 sm:p-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl bg-alucha/20 pointer-events-none" />

          {sent ? (
            <div className="relative text-center py-10 animate-fade-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-alucha/15 border border-alucha/40 mb-6 shadow-[0_0_40px_-4px_var(--alucha)]">
                <CheckCircle2 className="text-alucha" size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold">Your inquiry has been successfully grown!</h3>
              <p className="mt-3 text-muted-foreground">We&rsquo;ll reach out soon — keep an eye on your inbox.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm text-alucha hover:underline">Send another</button>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="relative grid sm:grid-cols-2 gap-5"
            >
              <Field label="Name" id="name"><input id="name" required className={inputCls} placeholder="Nino Kapanadze" /></Field>
              <Field label="Email" id="email"><input id="email" type="email" required className={inputCls} placeholder="you@brand.com" /></Field>
              <Field label="Project type" id="type" className="sm:col-span-2">
                <select id="type" className={inputCls}>
                  <option>Marketing website</option>
                  <option>E-commerce</option>
                  <option>SaaS product</option>
                  <option>Brand & identity</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Message" id="msg" className="sm:col-span-2">
                <textarea id="msg" rows={5} required className={inputCls} placeholder="A few sentences about your goals…" />
              </Field>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-alucha text-primary-foreground font-medium hover:shadow-[0_0_60px_-10px_var(--alucha)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Send inquiry
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
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
