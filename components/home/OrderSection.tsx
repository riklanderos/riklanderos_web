import Image from "next/image";
import { QUOTES } from "@/lib/content";
import { OrderDiagram } from "../OrderDiagram";
import { ParallaxLayer, Reveal, ScrollLine, SplitWords } from "../motion";
import { Eyebrow, PullQuote } from "../ui";

/** Cota de plano que se traza con el scroll: une el planteamiento con el diagrama (decorativa). */
function DimensionRail() {
  return (
    <div aria-hidden className="relative mt-14 h-5 lg:mt-20">
      <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
      <ScrollLine className="absolute inset-x-0 top-1/2 block h-px origin-left bg-accent" offset={["start 92%", "start 45%"]} />
      <span className="absolute left-0 top-0 h-full w-px bg-line-strong" />
      <span className="absolute right-0 top-0 h-full w-px bg-line-strong" />
      {[25, 50, 75].map((x) => (
        <span key={x} className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-line-strong bg-elev" style={{ left: `${x}%` }} />
      ))}
    </div>
  );
}

export function OrderSection() {
  return (
    <section className="section relative isolate overflow-hidden border-y border-line bg-elev" aria-labelledby="orden">
      <ParallaxLayer distance={70} className="pointer-events-none absolute inset-x-0 -inset-y-24 -z-10">
        <Image
          src="/img/blueprint.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-[0.22] [mask-image:radial-gradient(ellipse_at_70%_40%,#000_10%,transparent_70%)]"
        />
      </ParallaxLayer>
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow index="03">El orden que el 90% ignora</Eyebrow>
            <SplitWords id="orden" as="h2" className="t-h2 mt-6" text="¿Quieres meter IA? Primero revisa cómo prospectas." accentWords={["IA"]} />
          </div>
          <Reveal className="lg:col-span-5 lg:pt-14" delay={0.1}>
            <p className="t-lead">
              Cada herramienta se usa según el nivel de tu negocio. Si saltas el orden, pagas dos veces: una por la
              herramienta y otra por rehacerlo.
            </p>
          </Reveal>
        </div>

        <DimensionRail />

        <OrderDiagram className="mt-12 lg:mt-16" />

        <Reveal className="mt-16 max-w-2xl lg:mt-24" delay={0.1}>
          <PullQuote>{QUOTES.software}</PullQuote>
        </Reveal>
      </div>
    </section>
  );
}
