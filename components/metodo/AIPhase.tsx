import Image from "next/image";
import { QUOTES } from "@/lib/content";
import { SITE } from "@/lib/site";
import { MaskReveal, ParallaxLayer, Reveal, SplitWords, Stagger, StaggerItem, TiltCard } from "@/components/motion";
import { Arrow, Eyebrow, PullQuote } from "@/components/ui";
import { AI_BUILDS, AI_READINESS } from "./data";

/** 02 · Dónde entra la IA: la fase 04, conectada al posicionamiento de consultor de IA. */
export function AIPhase() {
  return (
    <section className="section relative overflow-hidden border-y border-line bg-elev" aria-labelledby="ia-titulo" id="ia">
      <ParallaxLayer distance={50} className="pointer-events-none absolute inset-x-0 -inset-y-16">
        <div aria-hidden className="bg-dots mask-fade-y h-full w-full opacity-50" />
      </ParallaxLayer>
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="02">Dónde entra la IA</Eyebrow>
            </Reveal>
            <div id="ia-titulo">
              <SplitWords
                as="h2"
                className="t-h2 mt-6"
                text="La IA es la fase 04. Escala lo que ya funciona."
                accentWords={["fase", "04"]}
              />
            </div>
            <Reveal className="mt-8 max-w-[620px] space-y-4" delay={0.1}>
              <p className="text-muted">
                Soy consultor de inteligencia artificial para empresas y fundé Ingeniak para implementarla. Vivo de esto, y
                aun así te lo digo: la IA no va primero.
              </p>
              <p className="text-fg">
                Cuando ya hay dirección, tráfico y un proceso que cierra, la IA hace lo que ningún equipo puede: contestar
                en segundos, a cualquier hora, sin olvidar un seguimiento.
              </p>
            </Reveal>

            <Reveal className="mt-12" delay={0.15}>
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Lo que construye Ingeniak en la fase 04</p>
            </Reveal>
            <Stagger as="ul" className="mt-4 divide-y divide-line border-y border-line" stagger={0.08}>
              {AI_BUILDS.map((b) => (
                <StaggerItem as="li" key={b.code} className="group relative flex items-baseline gap-5 py-4">
                  <span className="t-mono shrink-0 text-[11px] tracking-[0.14em] text-accent-text">{b.code}</span>
                  <span className="text-[15px] text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1.5 md:text-base">
                    {b.text}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
                  />
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-6" delay={0.1}>
              <a
                href={SITE.ingeniakUrl}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent-text"
              >
                <span className="link-sweep">Conoce Ingeniak</span>
                <span className="sr-only"> (se abre en otra pestaña)</span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[460px] lg:sticky lg:top-28">
              <MaskReveal className="relative aspect-square overflow-hidden rounded-[14px] border border-line bg-bg">
                <Image
                  src="/img/ia-brain.webp"
                  alt="Cerebro en estilo halftone con circuitos rojos: la inteligencia artificial como motor del negocio"
                  fill
                  sizes="(min-width: 1024px) 34vw, 92vw"
                  className="object-cover"
                />
              </MaskReveal>
              <Reveal
                delay={0.35}
                className="relative -mt-14 ml-4 mr-4 rounded-[12px] border border-line-strong bg-bg/90 p-5 backdrop-blur-md sm:ml-8 sm:mr-0 sm:p-6"
              >
                <p className="t-mono text-[10px] uppercase tracking-[0.16em] text-accent-text">Caso · Clínica dental</p>
                <p className="mt-2 text-[15px] text-fg">Agente de IA en WhatsApp. Tiempo de respuesta:</p>
                <p className="t-mono mt-3 flex flex-wrap items-baseline gap-x-3 text-2xl md:text-3xl">
                  <span className="text-muted line-through decoration-1">8 min</span>
                  <span aria-hidden className="text-muted">→</span>
                  <span className="sr-only">a</span>
                  <span className="font-semibold text-fg">12 seg</span>
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ¿Ya toca la IA? */}
        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:mt-24">
          <TiltCard
            as="article"
            reveal="view"
            max={2}
            className="spot rounded-[14px] border border-line bg-bg p-7 transition-colors duration-500 hover:border-line-strong md:p-9"
          >
            <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Señales · Fase 01–03</p>
            <h3 className="t-h3 mt-4">Todavía no es momento de IA si…</h3>
            <ul className="mt-6 space-y-4">
              {AI_READINESS.notYet.map((t) => (
                <li key={t} className="flex gap-4 text-[15px] leading-relaxed text-muted md:text-base">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-line-strong" />
                  {t}
                </li>
              ))}
            </ul>
          </TiltCard>
          <TiltCard
            as="article"
            reveal="view"
            delay={0.12}
            max={2}
            className="spot rounded-[14px] border border-accent/50 bg-bg p-7 transition-colors duration-500 hover:border-accent md:p-9"
          >
            <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">Señales · Fase 04</p>
            <h3 className="t-h3 mt-4">Ya es momento de IA si…</h3>
            <ul className="mt-6 space-y-4">
              {AI_READINESS.ready.map((t) => (
                <li key={t} className="flex gap-4 text-[15px] leading-relaxed text-fg md:text-base">
                  <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </TiltCard>
        </div>

        <Reveal className="mt-16 max-w-3xl lg:mt-20" delay={0.1}>
          <PullQuote>{QUOTES.ia}</PullQuote>
        </Reveal>
      </div>
    </section>
  );
}
