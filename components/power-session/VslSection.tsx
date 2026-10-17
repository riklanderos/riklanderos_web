import { SITE } from "@/lib/site";
import { VSL, videoLdHtml } from "@/lib/videos";
import { Reveal } from "../motion";
import { PowerSessionButton } from "../PowerSessionButton";
import { VslPlayer } from "../VslPlayer";

/** VSL de la Power Session justo después del hero: la sesión explicada en video, antes de la prueba social. */
export function VslSection() {
  const v = VSL.powerSession;
  return (
    <section aria-labelledby="ps-video" className="relative border-t border-line">
      <div className="container-x py-14 lg:py-20">
        <Reveal className="mx-auto flex max-w-[1120px] flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 id="ps-video" className="t-eyebrow !font-medium leading-relaxed">
            La Power Session, en video · «{v.title}»
          </h2>
          <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">Video · {v.duration} · Activa el sonido</p>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-8 max-w-[1120px]">
          <VslPlayer video={v} sizes="(min-width: 1200px) 1120px, 92vw" />
        </Reveal>
        <Reveal delay={0.15} className="mx-auto mt-8 flex max-w-[1120px] flex-col items-start gap-4 sm:flex-row sm:items-center">
          <PowerSessionButton section="ps_video" />
          <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:ml-3">
            {SITE.powerSessionPrice} · Pago único · Solo 4 sesiones por semana
          </p>
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: videoLdHtml(v) }} />
    </section>
  );
}
