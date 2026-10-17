import Image from "next/image";
import { AI_CAPABILITIES, QUOTES } from "@/lib/content";
import { MaskReveal, Reveal, SplitWords, Stagger, TiltCard } from "../motion";
import { Eyebrow, PullQuote } from "../ui";

/** 04 · Dónde entra la IA en la operación (reutiliza AI_CAPABILITIES). */
export function AICapabilities() {
  return (
    <section className="section border-t border-line" aria-labelledby="trabajar-ia-operacion">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="04">Implementación de IA</Eyebrow>
            <div id="trabajar-ia-operacion">
              <SplitWords as="h2" className="t-h2 mt-6" text="Dónde entra la IA en tu operación." accentWords={["IA"]} />
            </div>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6">
                En los lugares donde ya hay un proceso que escalar. Si el proceso no existe, primero se construye; la IA va al
                final del orden, no al principio.
              </p>
            </Reveal>
            <MaskReveal
              className="relative mt-10 hidden aspect-square w-full max-w-[400px] overflow-hidden rounded-[12px] border border-line bg-bg lg:block"
              delay={0.1}
            >
              <Image
                src="/img/ia-brain.webp"
                alt="Cerebro en estilo halftone con circuitos rojos: inteligencia artificial aplicada al negocio"
                fill
                sizes="(min-width: 1024px) 32vw, 1px"
                className="object-cover"
              />
            </MaskReveal>
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
        </div>
      </div>
    </section>
  );
}
