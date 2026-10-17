import { BACKDROP_WIDE_H, BACKDROP_WIDE_PAD, STICKY_BACKDROP_INNER, STICKY_BACKDROP_OUTER } from "@/lib/backdrop";
import { Backdrop } from "../Backdrop";
import { MethodTimeline } from "../MethodTimeline";
import { Reveal, SplitWords } from "../motion";
import { ButtonLink, Eyebrow } from "../ui";

/**
 * 05 · Método. Rik en su escritorio frente al diagrama es el fondo del lado derecho y se queda fijo (sticky)
 * mientras los cinco pasos avanzan a la izquierda. En móvil la foto va arriba, a todo el ancho.
 */
export function MethodSection() {
  return (
    <section className="relative isolate overflow-x-clip" aria-labelledby="metodo">
      <div aria-hidden className={STICKY_BACKDROP_OUTER}>
        <div className={STICKY_BACKDROP_INNER}>
          <Backdrop
            src="/img/rik-desk.webp"
            side="right"
            width="60%"
            focus="48% 40%"
            focusLg="40% 45%"
            mobileHeight={BACKDROP_WIDE_H}
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        </div>
      </div>

      <div className="container-x relative pb-16 lg:py-[120px]">
        <div className={`lg:max-w-[50%] lg:pr-6 ${BACKDROP_WIDE_PAD}`}>
          <Reveal>
            <Eyebrow index="05">Método Sistema Radikal</Eyebrow>
          </Reveal>
          <SplitWords id="metodo" as="h2" className="t-h2 mt-6" text="Cinco pasos para que tu negocio funcione sin ti." accentWords={["sin", "ti"]} />
          <Reveal delay={0.1}>
            <p className="t-lead mt-6 max-w-[520px]">
              Dirección, tráfico, conversión, escala. El mismo orden siempre, adaptado al nivel de cada negocio.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <ButtonLink href="/metodo" className="bg-bg/50 backdrop-blur-sm">
              Ver el método completo
            </ButtonLink>
          </Reveal>

          <div className="mt-16 lg:mt-20">
            <MethodTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
