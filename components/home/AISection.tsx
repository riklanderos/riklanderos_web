import Image from "next/image";
import { AI_CAPABILITIES, QUOTES } from "@/lib/content";
import { MaskReveal, ParallaxLayer, Reveal, SplitWords, Stagger, TiltCard } from "../motion";
import { ButtonLink, Eyebrow, PullQuote } from "../ui";

export function AISection() {
  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="ia-titulo" id="ia">
      <ParallaxLayer distance={50} className="pointer-events-none absolute inset-x-0 -inset-y-16 -z-10">
        <div aria-hidden className="bg-dots mask-fade-y h-full w-full opacity-60" />
      </ParallaxLayer>
      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="02">Consultoría de IA para empresas</Eyebrow>
            <SplitWords
              id="ia-titulo"
              as="h2"
              className="t-h2 mt-6"
              text="Inteligencia artificial con estrategia, no por moda."
              accentWords={["estrategia"]}
            />
            <Reveal delay={0.1}>
              <p className="t-lead mt-6">
                Agentes, automatizaciones y CRM conectados a tu proceso comercial real. Primero diagnóstico, después
                implementación. Así la IA deja de ser un gasto más y se vuelve el motor que atiende, califica, agenda y da
                seguimiento mientras tú diriges.
              </p>
            </Reveal>

            <MaskReveal className="relative mt-10 aspect-square w-full max-w-[440px] overflow-hidden rounded-[12px] border border-line bg-bg" delay={0.1}>
              <Image
                src="/img/ia-brain.webp"
                alt="Cerebro en estilo halftone con circuitos rojos: inteligencia artificial aplicada al negocio"
                fill
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="object-cover"
              />
            </MaskReveal>
            <TiltCard
              reveal="view"
              delay={0.2}
              max={0}
              className="spot mt-5 flex max-w-[440px] items-center justify-between gap-4 rounded-[10px] border border-line bg-elev px-5 py-4"
            >
              <div>
                <p className="t-mono text-[10px] uppercase tracking-[0.16em] text-muted">Caso · Clínica dental</p>
                <p className="mt-1 text-[15px]">Tiempo de respuesta con agente de IA</p>
              </div>
              <p className="t-mono whitespace-nowrap text-right text-lg">
                <span className="text-muted line-through">
                  <span className="sr-only">Antes: </span>8 min
                </span>{" "}
                <span className="text-accent-text">
                  <span aria-hidden>→</span>
                  <span className="sr-only">ahora:</span> 12 seg
                </span>
              </p>
            </TiltCard>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.09}>
            {AI_CAPABILITIES.map((c) => (
              <TiltCard
                key={c.code}
                as="article"
                className="spot group card p-7 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="t-mono text-[11px] tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-accent-text">
                    {c.code}
                  </span>
                  <span
                    aria-hidden
                    className="h-2 w-2 rotate-45 border border-accent transition-[background-color,rotate,scale] duration-500 ease-[var(--ease-out)] group-hover:rotate-[225deg] group-hover:scale-125 group-hover:bg-accent"
                  />
                </div>
                <h3 className="mt-10 font-display text-xl font-bold leading-tight tracking-tight">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.body}</p>
              </TiltCard>
            ))}
          </Stagger>

          <Reveal className="mt-14" delay={0.1}>
            <PullQuote>{QUOTES.ia}</PullQuote>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center gap-4" delay={0.15}>
            <ButtonLink href="/trabajar-conmigo" variant="ghost" className="btn-shine">
              Ve cómo implemento IA en tu empresa
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
