import Image from "next/image";
import { COUNTRIES } from "@/lib/content";
import { SITE } from "@/lib/site";
import { VSL, videoLdHtml } from "@/lib/videos";
import { Reveal, SplitWords, Stagger, StaggerItem } from "../motion";
import { Arrow, Eyebrow } from "../ui";
import { VslPlayer } from "../VslPlayer";
import { DiscoverySessionButton } from "../DiscoverySessionButton";

export function IngeniakSection() {
  return (
    <section className="section relative overflow-hidden border-t border-line" aria-labelledby="ingeniak">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow index="10">El estudio que ejecuta</Eyebrow>
          <SplitWords id="ingeniak" as="h2" className="t-h2 mt-6" text="Yo diseño. Ingeniak construye." accentWords={["Ingeniak"]} />
          <Reveal delay={0.1} className="mt-8 space-y-4 text-muted">
            <p>
              Ingeniak es el estudio que fundé en 2022 para implementar lo que diseño: agentes de IA para WhatsApp, CRM
              inteligente con Kommo y GoHighLevel, automatización con n8n y modelos de lenguaje aplicados a ventas.
            </p>
            <p className="text-fg">
              Tú tienes contacto directo conmigo en la estrategia. Mi equipo se encarga de que funcione, todos los días.
            </p>
          </Reveal>
          <Stagger className="mt-10 flex flex-wrap gap-2" stagger={0.05}>
            {COUNTRIES.map((c) => (
              <StaggerItem key={c}>
                <span className="t-mono inline-block rounded-full border border-line-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
                  {c}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.15} className="mt-10">
            <a
              href={SITE.ingeniakUrl}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-4 rounded-full border border-line-strong py-2.5 pl-5 pr-4 transition-colors hover:border-fg"
            >
              <Image src="/brand/ingeniak.svg" alt="Ingeniak" width={140} height={19} className="h-4 w-auto" unoptimized />
              <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">ingeniak.mx</span>
              <Arrow className="transition-transform group-hover:translate-x-1" />
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </Reveal>
        </div>
        <div className="lg:col-span-6">
          <Reveal delay={0.1}>
            <VslPlayer video={VSL.discoverySession} />
            <p className="t-mono mt-4 text-[11px] uppercase tracking-[0.14em] text-muted">
              «{VSL.discoverySession.title}» · Cómo trabajamos en Ingeniak · {VSL.discoverySession.duration}
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <DiscoverySessionButton section="home_ingeniak" />
              <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:ml-3">
                30 min · Diagnóstico de tu operación
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: videoLdHtml(VSL.discoverySession) }} />
    </section>
  );
}
