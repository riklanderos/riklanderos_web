import { SITE } from "@/lib/site";
import { VSL, videoLdHtml } from "@/lib/videos";
import { Reveal, SplitWords } from "../motion";
import { PowerSessionButton } from "../PowerSessionButton";
import { VslPlayer } from "../VslPlayer";
import { Eyebrow } from "../ui";

/**
 * Hero de la Power Session con el VSL «La factura invisible» como protagonista: texto a la izquierda y el
 * video a la derecha en desktop; en móvil el video va justo después del título, antes del texto y el CTA.
 */
export function PsHero() {
  const v = VSL.powerSession;
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-36">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-60" />
      <div
        aria-hidden
        className="absolute -z-10 right-[-10%] top-[5%] h-[70vh] w-[60vw] rounded-full opacity-[0.18] blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
      />
      <div className="container-x grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="contents lg:col-span-5 lg:block">
          <div className="order-1">
            <Reveal>
              <Eyebrow>Power Session · 90 min 1:1</Eyebrow>
            </Reveal>
            <SplitWords
              as="h1"
              className="t-h1 mt-6 lg:text-[clamp(2.8rem,4.6vw,4.6rem)]"
              text="90 minutos que te ahorran meses de prueba y error."
              accentWords={["prueba", "y", "error."]}
              immediate
            />
          </div>
          <div className="order-3">
            <Reveal delay={0.35}>
              <p className="t-lead mt-2 lg:mt-8">
                Noventa minutos conmigo, no con un vendedor. Audito tu prospección, tus ventas y tu automatización con IA, y sales con un
                diagnóstico escrito y tres movimientos en el orden correcto.
              </p>
            </Reveal>
            <Reveal delay={0.5} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center">
              <PowerSessionButton section="ps_hero" className="px-8 py-4 text-lg" />
              <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:ml-3 lg:ml-0 xl:ml-3">
                <span className="block">{SITE.powerSessionPrice} · Pago único</span>
                <span className="block">Solo 4 sesiones por semana</span>
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2} className="order-2 lg:col-span-7">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-[18px] opacity-60 blur-2xl"
              style={{ background: "radial-gradient(ellipse at center, rgba(229,28,30,0.35), transparent 70%)" }}
            />
            <VslPlayer video={v} sizes="(min-width: 1024px) 56vw, 92vw" />
          </div>
          <p className="t-mono mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
            <span>«{v.title}» · {v.duration}</span>
            <span>Activa el sonido</span>
          </p>
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: videoLdHtml(v) }} />
    </section>
  );
}
