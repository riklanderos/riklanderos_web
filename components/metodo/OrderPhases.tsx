import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { OrderDiagram } from "@/components/OrderDiagram";
import { ParallaxLayer, Reveal, SplitWords, TiltCard } from "@/components/motion";
import { Arrow, Eyebrow, PullQuote } from "@/components/ui";
import { PHASES } from "./data";

/** 01 · El orden correcto: diagrama grande + una explicación por fase. */
export function OrderPhases() {
  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="orden-titulo" id="orden">
      <ParallaxLayer distance={60} className="pointer-events-none absolute inset-x-0 -inset-y-20 -z-10">
        <div aria-hidden className="bg-grid mask-fade-y h-full w-full opacity-40" />
      </ParallaxLayer>
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="01">El orden correcto</Eyebrow>
            </Reveal>
            <div id="orden-titulo">
              <SplitWords as="h2" className="t-h2 mt-6" text="El orden que nadie respeta." accentWords={["orden"]} />
            </div>
          </div>
          <Reveal className="space-y-4 lg:col-span-5 lg:pt-14" delay={0.1}>
            <p className="t-lead">
              Branding, marketing, ventas y, al final, automatización e IA. Cada herramienta se usa según el nivel de tu
              negocio.
            </p>
            <p className="text-fg">Si saltas el orden, pagas dos veces: una por la herramienta y otra por rehacerlo.</p>
          </Reveal>
        </div>

        {/* Diagrama grande sobre plano */}
        <Reveal className="relative mt-14 overflow-hidden rounded-[16px] border border-line bg-elev lg:mt-20" amount={0.15}>
          <ParallaxLayer distance={45} className="pointer-events-none absolute inset-x-0 -inset-y-14">
            <Image
              src="/img/blueprint.webp"
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1280px) 1160px, 100vw"
              className="object-cover opacity-[0.18] [mask-image:radial-gradient(ellipse_at_60%_40%,#000_10%,transparent_75%)]"
            />
          </ParallaxLayer>
          <div className="relative flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-10">
            <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Blueprint · Sistema Radikal</p>
            <p className="t-mono hidden text-[11px] uppercase tracking-[0.16em] text-muted sm:block">
              Dirección → Tráfico → Conversión → Escala
            </p>
          </div>
          <OrderDiagram className="relative px-5 py-12 md:px-10 md:py-20" />
        </Reveal>

        {/* Una fase por tarjeta, a peras y manzanas */}
        <div className="mt-5 grid overflow-hidden rounded-[16px] border border-line bg-bg md:grid-cols-2">
          {PHASES.map((p, i) => {
            const last = i === PHASES.length - 1;
            return (
              <TiltCard
                key={p.n}
                as="article"
                reveal="view"
                max={0}
                delay={(i % 2) * 0.12}
                className={clsx(
                  "spot group flex flex-col border-line p-7 transition-colors duration-500 md:p-10",
                  i > 0 && "border-t",
                  i === 1 && "md:border-l md:border-t-0",
                  i === 3 && "md:border-l",
                  last ? "bg-[linear-gradient(180deg,rgba(229,28,30,0.10),rgba(229,28,30,0)_60%)]" : "hover:bg-elev",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    <span className="text-accent-text">{p.n}</span> · {p.name} <span aria-hidden>→</span>
                    <span className="sr-only">:</span> {p.word}
                  </p>
                  {last ? (
                    <span className="t-mono rounded-full border border-accent/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-fg">
                      Aquí entra la IA
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-8 font-serif text-[1.7rem] italic leading-[1.12] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 md:text-[2.1rem]">
                  {p.analogy}
                </h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted md:text-base">{p.body}</p>

                <dl className="mt-8 grid gap-5 border-t border-line pt-6 text-[15px] sm:grid-cols-2">
                  <div>
                    <dt className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">{p.skipLabel}</dt>
                    <dd className="mt-1.5 leading-snug text-fg/90">{p.skip}</dd>
                  </div>
                  <div>
                    <dt className="t-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-accent-text">
                      <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                      {p.proof.label}
                    </dt>
                    <dd className="mt-1.5 leading-snug text-fg/90">
                      {p.proof.text}
                      {p.proof.href ? (
                        <Link
                          href={p.proof.href}
                          className="sweep-host group/link mt-2 flex w-fit items-center gap-1.5 text-sm font-medium text-fg hover:text-accent-text"
                        >
                          <span className="link-sweep">Lee el caso</span>
                          <span className="sr-only"> {p.proof.label.replace("Caso ", "")}</span>
                          <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      ) : null}
                    </dd>
                  </div>
                </dl>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
                />
              </TiltCard>
            );
          })}
        </div>

        <Reveal className="mt-16 max-w-3xl lg:mt-24" delay={0.1}>
          <PullQuote>No todo es para todos: aplica las bases, pero ponle tu esencia.</PullQuote>
        </Reveal>
      </div>
    </section>
  );
}
