import Image from "next/image";
import { MANIFESTO } from "@/lib/content";
import { ParallaxLayer, Reveal, SplitWords, Stagger, StaggerItem } from "../motion";
import { Eyebrow } from "../ui";

/** Cada creencia del manifiesto (spec §6.9) expandida a un párrafo (spec §7.6). */
const EXPANDED: readonly string[] = [
  "Si cada cotización y cada incendio pasan por ti, no tienes una empresa: tienes un autoempleo con nómina. Tu hora vale más dirigiendo que operando.",
  "Mejor saber hoy que tu marca no comunica nada, antes de invertir otro año en anuncios. La verdad incomoda una tarde; la comodidad cuesta años.",
  "Aquí primero se aporta y después se cobra. Un diagnóstico honesto o una idea que funciona abren más puertas que cualquier pitch.",
  "Branding, marketing, ventas e IA, en ese orden. Meter tráfico a un negocio que no convierte es pagar por perder clientes más rápido.",
  "Lo que funcionó hace unos años hoy te frena. El mercado cambia, la IA cambia las reglas y el negocio que no se revisa se queda atrás.",
];

export function ManifestoFull() {
  return (
    <section
      id="manifiesto"
      className="relative overflow-hidden bg-paper text-paper-fg"
      aria-labelledby="manifiesto-title"
    >
      {/* El parallax crea un contexto de apilamiento: la mezcla multiply va en la capa, no en la imagen. */}
      <ParallaxLayer distance={36} className="pointer-events-none absolute -bottom-24 -left-32 w-[52vw] max-w-[520px] opacity-70 mix-blend-multiply">
        <Image
          src="/textures/brush-5.webp"
          alt=""
          aria-hidden
          width={900}
          height={1195}
          className="w-full -rotate-12 opacity-80 [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_72%)]"
        />
      </ParallaxLayer>
      <div className="container-x relative py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow index="02" tone="paper">
                  Manifiesto
                </Eyebrow>
              </Reveal>
              <div id="manifiesto-title">
                <SplitWords
                  as="h2"
                  className="t-h2 mt-6"
                  text="Cinco creencias. Ninguna se negocia."
                  accentWords={["Ninguna"]}
                />
              </div>
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-sm text-paper-muted">
                  No es una lista de valores para la pared. Es el criterio con el que se toman decisiones en Radikales.
                </p>
              </Reveal>
            </div>
          </div>

          <Stagger as="ol" className="divide-y divide-paper-fg/15 border-y border-paper-fg/15 lg:col-span-8" stagger={0.14}>
            {MANIFESTO.map((belief, i) => {
              const [first, ...rest] = belief.split(" ");
              return (
                <StaggerItem as="li" key={belief} className="group relative grid gap-4 py-8 md:grid-cols-[3.5rem_1fr] md:py-10">
                  <span className="t-mono pt-1.5 text-xs text-paper-muted transition-colors duration-300 group-hover:text-accent-paper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1.5">
                    <h3 className="font-display text-[1.6rem] font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[2.1rem]">
                      <span className="text-accent">{first}</span> {rest.join(" ")}
                    </h3>
                    <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-paper-muted">{EXPANDED[i]}</p>
                  </div>
                  {/* Filete rojo que recorre la creencia en hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
                  />
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
