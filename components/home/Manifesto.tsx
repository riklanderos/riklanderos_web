import Image from "next/image";
import { MANIFESTO, QUOTES } from "@/lib/content";
import { ParallaxLayer, Reveal, ScrollMarquee, SplitWords, Stagger, StaggerItem, WipeReveal } from "../motion";
import { ButtonLink, Eyebrow } from "../ui";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-paper text-paper-fg" aria-labelledby="radikales">
      {/* La brocha vive solo detrás del contenido (no invade la franja cinética) */}
      <div className="relative overflow-hidden">
      {/* El parallax crea un contexto de apilamiento: la mezcla multiply va en la capa, no en la imagen. */}
      <ParallaxLayer distance={70} className="pointer-events-none absolute -inset-y-20 right-0 hidden w-[34vw] max-w-[520px] mix-blend-multiply lg:block">
        <div aria-hidden className="relative h-full w-full">
          <Image
            src="/textures/brush-3.webp"
            alt=""
            fill
            sizes="34vw"
            className="object-cover [mask-image:linear-gradient(to_left,#000_35%,transparent_95%)]"
          />
        </div>
      </ParallaxLayer>
      <div className="container-x relative py-20 lg:py-32">
        <Reveal>
          <Eyebrow index="11" tone="paper">
            Radikales
          </Eyebrow>
        </Reveal>
        <h2 id="radikales" className="mt-6 font-display text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
          <SplitWords as="span" className="block" text="La libertad no se sueña." />
          {/* La brocha "pinta" la frase de izquierda a derecha */}
          <WipeReveal className="t-brush mt-2 block text-[1.1em] text-accent" delay={0.35}>
            Se construye.
          </WipeReveal>
        </h2>

        <Stagger as="ol" className="mt-16 max-w-[780px] divide-y divide-paper-fg/15 border-y border-paper-fg/15" stagger={0.12}>
          {MANIFESTO.map((m, i) => {
            const [first, ...rest] = m.split(" ");
            return (
              <StaggerItem as="li" key={m} className="group relative flex items-baseline gap-6 py-6 md:py-7">
                <span className="t-mono text-xs text-paper-muted transition-colors duration-300 group-hover:text-accent-paper">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-2xl font-bold leading-snug tracking-tight transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 md:text-[2rem]">
                  <span className="text-accent">{first}</span> {rest.join(" ")}
                </p>
                {/* Filete rojo que recorre la fila en hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
                />
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-12" delay={0.1}>
          <ButtonLink href="/radikales" variant="dark" className="btn-shine">
            Conocer Radikales
          </ButtonLink>
        </Reveal>
      </div>
      </div>

      {/* Franja cinética de cierre: el mantra en contorno sobre papel, se desliza con el scroll */}
      <ScrollMarquee className="border-t border-paper-fg/15 py-6 md:py-8" direction="right" distance={25}>
        <span className="text-outline px-[0.25em] font-display text-[clamp(3.75rem,11vw,9.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] [--stroke:color-mix(in_srgb,var(--paper-fg)_38%,transparent)]">
          {QUOTES.renueva.replace(/\.$/, "")}
        </span>
        <span className="mx-[0.35em] inline-block h-[0.16em] w-[0.16em] rotate-45 bg-accent text-[clamp(3.75rem,11vw,9.5rem)]" />
      </ScrollMarquee>
    </section>
  );
}
