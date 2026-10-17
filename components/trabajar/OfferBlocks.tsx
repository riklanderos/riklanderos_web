import clsx from "clsx";
import { OFFERS } from "@/content/trabajar-conmigo";
import { ParallaxLayer, Reveal, SplitWords, Stagger, TiltCard } from "../motion";
import { ButtonLink, Eyebrow } from "../ui";

/** 01 · Las dos formas de trabajar: Consultoría estratégica integral en IA y Growth Partner. */
export function OfferBlocks() {
  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="trabajar-formas" id="formas">
      <ParallaxLayer distance={60} className="pointer-events-none absolute inset-x-0 -inset-y-20 -z-10">
        <div aria-hidden className="bg-grid mask-radial h-full w-full opacity-40" />
      </ParallaxLayer>
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="01">Dos formas de trabajar conmigo</Eyebrow>
            <div id="trabajar-formas">
              <SplitWords
                as="h2"
                className="t-h2 mt-6"
                text="Unos quieren el mapa. Otros, el mapa y la obra."
                accentWords={["obra"]}
              />
            </div>
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="t-lead">
              Las dos empiezan igual: con un diagnóstico. La diferencia es quién construye lo que sale de ahí.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-2" stagger={0.14}>
          {OFFERS.map((o) => {
            const isGP = o.id === "growth-partner";
            return (
              <TiltCard
                key={o.id}
                as="article"
                max={2}
                className={clsx(
                  "spot group flex flex-col overflow-hidden rounded-[14px] border p-7 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 md:p-10",
                  isGP
                    ? "border-line-strong bg-[linear-gradient(180deg,rgba(229,28,30,0.08),rgba(229,28,30,0)_45%)] bg-elev hover:border-accent/60"
                    : "border-line bg-elev hover:border-line-strong",
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">{o.eyebrow}</p>
                  <span
                    aria-hidden
                    className={clsx(
                      "t-mono grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-[rotate,scale] duration-700 ease-[var(--ease-out)] group-hover:rotate-[360deg] group-hover:scale-110",
                      isGP ? "border-accent text-accent-text" : "border-line-strong text-fg",
                    )}
                  >
                    {o.code}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[clamp(1.85rem,3vw,2.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
                  {o.name}
                </h3>
                <p className="mt-4 text-lg text-fg/90">{o.pitch}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{o.body}</p>

                <p className="t-mono mt-10 text-[11px] uppercase tracking-[0.16em] text-muted">Qué incluye</p>
                <ul
                  className={clsx(
                    "mt-4 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line",
                    isGP && "sm:grid-cols-2",
                  )}
                >
                  {o.includes.map((it, i) => (
                    <li
                      key={it.k}
                      className={clsx(
                        "group/inc bg-bg p-4 transition-colors duration-300 hover:bg-elev-2 md:p-5",
                        isGP && i === o.includes.length - 1 && o.includes.length % 2 === 1 && "sm:col-span-2",
                      )}
                    >
                      <p className="flex items-center gap-2.5 font-display text-[17px] font-bold tracking-tight">
                        <span
                          aria-hidden
                          className={clsx(
                            "h-1.5 w-1.5 shrink-0 rotate-45 transition-[rotate,scale] duration-500 ease-[var(--ease-out)] group-hover/inc:rotate-[225deg] group-hover/inc:scale-150",
                            isGP ? "bg-accent" : "border border-accent",
                          )}
                        />
                        {it.k}
                      </p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{it.v}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-6">
                    <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Quién ejecuta</span>
                    <span className="text-fg">{o.executes}</span>
                  </p>
                </div>
              </TiltCard>
            );
          })}
        </Stagger>

        <Reveal className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between" delay={0.1}>
          <p className="flex items-start gap-3 text-muted">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
            Las dos empiezan con un diagnóstico: la Power Session o la Discovery Session. No trabajo con nadie sin diagnosticar primero.
          </p>
          <ButtonLink href="#comparativa" variant="ghost" className="btn-shine shrink-0">
            Compara consultoría y Growth Partner
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
