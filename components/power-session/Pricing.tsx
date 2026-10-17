import Image from "next/image";
import { QUOTES } from "@/lib/content";
import { SITE } from "@/lib/site";
import { ParallaxLayer, Reveal, SplitWords, Stagger, StaggerItem, TiltCard } from "../motion";
import { Eyebrow, PullQuote } from "../ui";
import { PS_INCLUDES } from "./data";

/** 05 · Precio: 297 USD pago único, 4 sesiones por semana, por orden de pago (spec §7.2). Fondo --paper. */
export function Pricing() {
  return (
    <section className="relative overflow-hidden bg-paper text-paper-fg" aria-labelledby="ps-precio">
      {/* El parallax crea un contexto de apilamiento: la mezcla multiply va en la capa, no en la imagen. */}
      <ParallaxLayer distance={80} className="pointer-events-none absolute -right-24 -top-44 hidden w-[30vw] max-w-[440px] mix-blend-multiply lg:block">
        <Image
          src="/textures/brush-4.webp"
          alt=""
          aria-hidden
          width={900}
          height={1195}
          className="w-full rotate-12 opacity-90"
        />
      </ParallaxLayer>
      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow index="05" tone="paper">
              Inversión
            </Eyebrow>
          </Reveal>
          <SplitWords
            id="ps-precio"
            as="h2"
            className="t-h2 mt-6"
            text="Un solo precio. Sin paquetes ni letras chiquitas."
          />

          <div className="mt-10">
            <p className="flex items-end gap-3 font-mono leading-none">
              {/* SplitWords observa el contenedor sin recortar y aplica su propia máscara por palabra. */}
              <SplitWords
                as="span"
                text={String(SITE.powerSessionAmount)}
                className="block text-[clamp(5rem,17vw,10rem)] font-semibold tracking-[-0.06em] text-accent"
              />
              <Reveal as="span" delay={0.25} className="pb-[0.6em] text-2xl font-semibold tracking-tight md:text-3xl">
                {SITE.powerSessionCurrency}
              </Reveal>
            </p>
            <Reveal delay={0.35}>
              <p className="t-mono mt-4 text-xs uppercase tracking-[0.14em] text-paper-muted">Pago único · 90 minutos 1:1</p>
            </Reveal>
          </div>

          <div className="mt-12">
            <Reveal>
              <h3 className="t-mono text-[11px] uppercase tracking-[0.16em] text-paper-fg">Solo 4 sesiones por semana</h3>
            </Reveal>
            <div aria-hidden>
              <Stagger className="mt-4 grid max-w-[420px] grid-cols-4 gap-2" stagger={0.1}>
                {["01", "02", "03", "04"].map((n) => (
                  <StaggerItem
                    key={n}
                    className="group flex aspect-square flex-col justify-between rounded-[8px] border border-paper-fg/25 p-2.5 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-accent"
                  >
                    <span className="t-mono text-[10px] text-paper-muted">S{n}</span>
                    <span className="h-1.5 w-1.5 rotate-45 bg-accent transition-[rotate,scale] duration-500 ease-[var(--ease-out)] group-hover:rotate-[225deg] group-hover:scale-150" />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <Reveal delay={0.2}>
              <p className="mt-4 text-[15px] text-paper-muted">Se asignan por orden de pago.</p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pt-4">
          <TiltCard
            as="article"
            reveal="view"
            delay={0.1}
            max={2}
            className="spot spot-paper rounded-[14px] border border-paper-fg/15 bg-paper-soft p-6 transition-colors duration-500 hover:border-paper-fg/30 sm:p-8 md:p-10"
          >
            <h3 className="t-mono text-[11px] uppercase tracking-[0.16em] text-paper-fg">Qué incluye</h3>
            <Stagger as="ul" className="mt-6 divide-y divide-paper-fg/15 border-y border-paper-fg/15" stagger={0.08}>
              {PS_INCLUDES.map((item, i) => (
                <StaggerItem as="li" key={item} className="group/inc flex items-baseline gap-4 py-4">
                  <span className="t-mono text-[11px] text-paper-muted transition-colors duration-300 group-hover/inc:text-accent-paper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium transition-transform duration-500 ease-[var(--ease-out)] group-hover/inc:translate-x-1">{item}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-6 text-[15px] text-paper-muted">
              Si después quieres ejecutar conmigo, la inversión se define con el diagnóstico en la mano. No antes.
            </p>
          </TiltCard>

          <Reveal className="mt-12" delay={0.15}>
            <PullQuote tone="paper">{QUOTES.tiempo}</PullQuote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
