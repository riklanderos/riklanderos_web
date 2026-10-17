import { Reveal, SplitWords, TiltCard, WipeReveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { FOR_WHOM } from "./data";

/** 05 · Para quién es / para quién no es (avatar spec §2.1 y anti-cliente §2.5). */
export function ForWhom() {
  return (
    <section className="relative overflow-hidden bg-paper text-paper-fg" aria-labelledby="para-quien-titulo" id="para-quien">
      <div className="container-x relative py-20 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="05" tone="paper">
                Para quién es
              </Eyebrow>
            </Reveal>
            <div id="para-quien-titulo">
              <SplitWords
                as="h2"
                className="t-h2 mt-6"
                text="Este método no es para todos. Y está bien."
                accentWords={["está", "bien"]}
              />
            </div>
          </div>
          <Reveal className="lg:col-span-5 lg:pt-14" delay={0.1}>
            <p className="text-lg leading-relaxed text-paper-muted">
              Prefiero decírtelo aquí que cobrarte una sesión que no te sirve. Revisa las dos listas con honestidad.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* Sin foto: sobre el papel crema una foto de fondo negro solo puede ir como tarjeta suelta. */}
          <div className="grid gap-5 md:grid-cols-2 lg:col-span-12">
            <TiltCard
              as="article"
              reveal="view"
              max={2}
              className="spot spot-paper rounded-[14px] border border-paper-fg/15 bg-paper-soft p-7 transition-colors duration-500 hover:border-paper-fg/30 md:p-9"
            >
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-paper-muted">Avatar</p>
              <h3 className="t-h3 mt-3">Es para ti si…</h3>
              <ul className="mt-6 space-y-4">
                {FOR_WHOM.yes.map((t) => (
                  <li key={t} className="flex gap-4 text-[15px] leading-relaxed md:text-base">
                    <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </TiltCard>
            <TiltCard
              as="article"
              reveal="view"
              delay={0.14}
              max={2}
              className="spot spot-paper rounded-[14px] border border-paper-fg/15 p-7 transition-colors duration-500 hover:border-paper-fg/30 md:p-9"
            >
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-paper-muted">Sin rodeos</p>
              <h3 className="t-h3 mt-3">No es para ti si…</h3>
              <ul className="mt-6 space-y-4">
                {FOR_WHOM.no.map((t) => (
                  <li key={t} className="flex gap-4 text-[15px] leading-relaxed text-paper-muted md:text-base">
                    <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-paper-fg/40" />
                    {t}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </div>
        </div>

        <Reveal className="mt-20 border-t border-paper-fg/15 pt-12 lg:mt-28">
          <figure className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <blockquote className="t-brush text-[clamp(3.5rem,11vw,9rem)] text-accent">
              {/* La brocha pinta la frase al aparecer */}
              <WipeReveal className="block" delay={0.15} duration={1.3}>
                Renuevas o mueres.
              </WipeReveal>
            </blockquote>
            <figcaption className="t-eyebrow whitespace-nowrap !text-paper-muted md:pb-4">— Rik</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
