import Image from "next/image";
import { COUNTRIES, INGENIAK_STATS } from "@/lib/content";
import { SITE } from "@/lib/site";
import { VSL, videoLdHtml } from "@/lib/videos";
import { INGENIAK_SPECIALTIES } from "@/content/trabajar-conmigo";
import { CountUp, Reveal, SplitWords, Stagger, StaggerItem } from "../motion";
import { Arrow, Eyebrow } from "../ui";
import { VslPlayer } from "../VslPlayer";
import { DiscoverySessionButton } from "../DiscoverySessionButton";

const LINES = [
  "Ingeniak es el estudio que fundé en 2022 para construir lo que diseño.",
  "Implementa agentes de IA, CRM con Kommo y GoHighLevel, automatización con n8n y modelos de lenguaje aplicados a ventas.",
  "Tú tienes contacto directo conmigo en la estrategia. Mi equipo se encarga de que funcione todos los días.",
] as const;

/** Cifra de Ingeniak: cuenta hacia arriba solo si es un entero simple ("+73", "7"); el resto se muestra tal cual. */
function Stat({ k }: { k: string }) {
  const m = k.match(/^(\+?)(\d{1,3})$/);
  if (!m) return <>{k}</>;
  return (
    <>
      {m[1] ? <span className="text-accent">{m[1]}</span> : null}
      <CountUp to={Number(m[2])} />
    </>
  );
}

/** 05 · "Yo diseño. Ingeniak construye." (spec §1.8 y §7.3). */
export function IngeniakBlock() {
  return (
    <section className="section relative isolate overflow-hidden border-t border-line" aria-labelledby="trabajar-ingeniak">
      <Image
        src="/img/blueprint.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="mask-fade-y -z-10 object-cover opacity-[0.08]"
      />
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow index="05">El estudio que ejecuta</Eyebrow>
            <div id="trabajar-ingeniak">
              <SplitWords as="h2" className="t-h2 mt-6" text="Yo diseño. Ingeniak construye." accentWords={["Ingeniak"]} />
            </div>
            <Stagger as="ol" className="mt-10 space-y-5" stagger={0.12}>
              {LINES.map((l, i) => (
                <StaggerItem as="li" key={l} className="grid grid-cols-[36px_1fr] gap-3">
                  <span className="t-mono pt-1 text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                  <span className={i === 2 ? "text-fg" : "text-muted"}>{l}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.15} className="mt-10">
              <a
                href={SITE.ingeniakUrl}
                target="_blank"
                rel="noopener"
                className="group inline-flex max-w-full items-center gap-4 rounded-full border border-line-strong py-3 pl-5 pr-4 transition-colors hover:border-fg"
              >
                <Image
                  src="/brand/ingeniak.svg"
                  alt="Ingeniak"
                  width={160}
                  height={22}
                  className="h-4 w-auto md:h-[18px]"
                  unoptimized
                />
                <span className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">ingeniak.mx</span>
                <span className="sr-only">(se abre en una pestaña nueva)</span>
                <Arrow className="shrink-0 transition-transform group-hover:translate-x-1" />
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
                <DiscoverySessionButton section="trabajar_ingeniak" />
                <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:ml-3">
                  30 min · Diagnóstico de tu operación
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-[12px] border border-line">
          <Stagger className="-mb-px -mr-px grid grid-cols-1 sm:grid-cols-3" stagger={0.08}>
            {INGENIAK_STATS.map((s) => (
              <StaggerItem key={s.label} className="border-b border-r border-line bg-bg p-6 md:p-7">
                <p className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                  <Stat k={s.k} />
                </p>
                <p className="t-mono mt-2 text-[10px] uppercase tracking-[0.14em] text-muted">{s.label} · Ingeniak</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Especialidades</p>
            </Reveal>
            <Stagger as="ul" className="mt-4 flex flex-wrap gap-2" stagger={0.06}>
              {INGENIAK_SPECIALTIES.map((s) => (
                <StaggerItem as="li" key={s}>
                  <span className="inline-block rounded-full border border-line-strong bg-elev px-4 py-2 text-[14px] text-fg">
                    {s}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Opera en</p>
            </Reveal>
            <Stagger as="ul" className="mt-4 flex flex-wrap gap-2" stagger={0.05}>
              {COUNTRIES.map((c) => (
                <StaggerItem as="li" key={c}>
                  <span className="t-mono inline-block rounded-full border border-line-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
                    {c}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: videoLdHtml(VSL.discoverySession) }} />
    </section>
  );
}
