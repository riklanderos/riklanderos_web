import Link from "next/link";
import { AI_DO, AI_DONT } from "@/content/trabajar-conmigo";
import { ParallaxLayer, Reveal, SplitWords, Stagger, StaggerItem, TiltCard } from "../motion";
import { Arrow, Eyebrow } from "../ui";
import { AIPipeline } from "./AIPipeline";

/** 03 · Qué hace de verdad un consultor de IA para empresas. */
export function AIConsultant() {
  return (
    <section
      className="section relative isolate overflow-hidden border-t border-line"
      aria-labelledby="trabajar-consultor-ia"
      id="ia"
    >
      <ParallaxLayer distance={50} className="pointer-events-none absolute inset-x-0 -inset-y-16 -z-10">
        <div aria-hidden className="bg-dots mask-fade-y h-full w-full opacity-60" />
      </ParallaxLayer>
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="03">Consultor de IA para empresas</Eyebrow>
            </Reveal>
            <div id="trabajar-consultor-ia">
              <SplitWords as="h2" className="t-h2 mt-6" text="Qué hace de verdad un consultor de IA." accentWords={["verdad"]} />
            </div>
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="t-lead">
              No te vende una herramienta. Decide dónde la inteligencia artificial te hace ganar dinero o tiempo, y dónde todavía
              no.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2" stagger={0.14}>
          <TiltCard as="article" max={2} className="spot card p-7 transition-[border-color,translate] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong md:p-9">
            <h3 className="t-mono flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-fg">
              <span aria-hidden className="h-2 w-2 rotate-45 bg-accent" />
              Lo que sí hago
            </h3>
            <Stagger as="ul" className="mt-6 space-y-4" stagger={0.07}>
              {AI_DO.map((t, i) => (
                <StaggerItem as="li" key={t} className="grid grid-cols-[28px_1fr] gap-3 text-[16px] leading-relaxed text-fg/90">
                  <span className="t-mono pt-1 text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </StaggerItem>
              ))}
            </Stagger>
          </TiltCard>
          <TiltCard as="article" max={2} className="spot rounded-[10px] border border-dashed border-line-strong p-7 md:p-9">
            <h3 className="t-mono flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              <span aria-hidden className="h-2 w-2 rotate-45 border border-fg/60" />
              Lo que no hago
            </h3>
            <Stagger as="ul" className="mt-6 space-y-4" stagger={0.07}>
              {AI_DONT.map((t) => (
                <StaggerItem as="li" key={t} className="grid grid-cols-[28px_1fr] gap-3 text-[16px] leading-relaxed text-muted">
                  <svg
                    aria-hidden
                    viewBox="0 0 12 12"
                    className="mt-[0.45em] h-3 w-3 text-dim"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
                  </svg>
                  {t}
                </StaggerItem>
              ))}
            </Stagger>
          </TiltCard>
        </Stagger>

        <div className="mt-20">
          <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Así se ve un sistema de atención con IA bien armado
            </p>
            <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">Del mensaje al cierre</p>
          </Reveal>
          <div className="mt-8 rounded-[14px] border border-line bg-bg/70 p-6 md:p-10">
            <AIPipeline />
          </div>
        </div>

        <TiltCard reveal="view" delay={0.1} max={0} className="mt-5 rounded-[12px]">
          <Link
            href="/casos/clinica-dental"
            className="spot sweep-host group flex flex-col gap-4 rounded-[12px] border border-line bg-elev px-6 py-5 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              <span className="t-mono block text-[10px] uppercase tracking-[0.16em] text-muted">Caso · Clínica dental</span>
              <span className="mt-1 block">Agente de IA en WhatsApp conectado al CRM. Tiempo de respuesta:</span>
            </span>
            <span className="flex items-center gap-4">
              <span className="t-mono whitespace-nowrap text-lg">
                <span className="text-muted line-through">
                  <span className="sr-only">Antes: </span>8 min
                </span>{" "}
                <span className="text-accent-text">
                  <span aria-hidden>→</span>
                  <span className="sr-only">ahora:</span> 12 seg
                </span>
              </span>
              <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-fg transition-colors group-hover:text-accent-text">
                <span className="link-sweep">Lee el caso</span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </TiltCard>
      </div>
    </section>
  );
}
