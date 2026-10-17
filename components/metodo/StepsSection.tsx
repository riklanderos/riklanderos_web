import { BACKDROP_WIDE_H, BACKDROP_WIDE_PAD } from "@/lib/backdrop";
import { Backdrop } from "@/components/Backdrop";
import { Reveal, SplitWords } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { StepsWithQuotes } from "./StepsWithQuotes";

/**
 * 03 · Los 5 pasos del Sistema Radikal, con entregable y una cita por paso. Abre con una banda a sangre:
 * Rik en su escritorio frente al diagrama ocupa el lado izquierdo y el titular va a la derecha.
 */
export function StepsSection() {
  return (
    <section className="relative" aria-labelledby="pasos-titulo" id="pasos">
      <div className="relative isolate overflow-hidden lg:flex lg:min-h-[min(80svh,720px)] lg:items-center">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-40" />
        <Backdrop
          src="/img/rik-desk.webp"
          alt="Rik Landeros en su escritorio frente al diagrama de un sistema de negocio"
          side="left"
          width="66%"
          focus="50% 35%"
          focusLg="44% 40%"
          mobileHeight={BACKDROP_WIDE_H}
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
        <div className="container-x relative w-full pb-4 lg:py-28">
          <div className={`lg:ml-auto lg:w-[42%] ${BACKDROP_WIDE_PAD}`}>
            <Reveal>
              <Eyebrow index="03">Sistema Radikal en 5 pasos</Eyebrow>
            </Reveal>
            <div id="pasos-titulo">
              <SplitWords
                as="h2"
                className="t-h2 mt-6"
                text="Cinco pasos. El mismo orden en cada negocio."
                accentWords={["mismo", "orden"]}
              />
            </div>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6">
                Cada paso tiene un entregable concreto. Así sabes qué tienes en la mano antes de invertir en el siguiente.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="container-x pb-16 lg:pb-[120px]">
        <StepsWithQuotes className="mt-14 lg:mt-20" />
      </div>
    </section>
  );
}
