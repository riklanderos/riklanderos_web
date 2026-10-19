import type { ReactNode } from "react";
import type { SessionType } from "@/lib/agenda/config";
import { SESSIONS } from "@/lib/sessions";
import { videoLdHtml } from "@/lib/videos";
import { VslPlayer } from "../VslPlayer";
import { Reveal } from "../motion";
import { Eyebrow } from "../ui";
import { BookingFlow } from "./BookingFlow";
import { BookingHero } from "./BookingHero";

const STEPS: Record<SessionType, readonly string[]> = {
  power: ["Me cuentas de tu negocio", "Eliges día y hora", "Pagas y te llega la invitación con Meet"],
  discovery: ["Me cuentas de tu negocio", "Eliges día y hora", "Te llega la invitación con Meet"],
};

/**
 * Página única de cada sesión (/power-session, /discovery): hero épico con Rik → VSL → reserva (lo que te llevas
 * al lado) → contenido extra opcional (children) debajo del formulario.
 */
export function BookingPage({ type, canceled = false, children }: { type: SessionType; canceled?: boolean; children?: ReactNode }) {
  const s = SESSIONS[type];
  const v = s.video;
  return (
    <>
      <BookingHero type={type} />
      <section id="video" aria-labelledby={`${type}-video`} className="relative border-t border-line">
        <div className="container-x py-14 lg:py-20">
          <Reveal className="mx-auto flex max-w-[1120px] flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 id={`${type}-video`} className="t-eyebrow !font-medium leading-relaxed">
              La {s.name}, en video · «{v.title}»
            </h2>
            <p className="t-mono text-[11px] uppercase tracking-[0.14em] text-muted">Video · {v.duration} · Activa el sonido</p>
          </Reveal>
          <Reveal delay={0.1} className="relative mx-auto mt-8 max-w-[1120px]">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[20px] opacity-50 blur-3xl"
              style={{ background: "radial-gradient(ellipse at center, rgba(229,28,30,0.35), transparent 70%)" }}
            />
            <VslPlayer video={v} sizes="(min-width: 1200px) 1120px, 92vw" />
          </Reveal>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: videoLdHtml(v) }} />
      </section>
      <section id="agenda" className="relative scroll-mt-16 border-t border-line pb-20 pt-14 lg:pb-32 lg:pt-24">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow>Reserva en 3 pasos</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="t-h2 mt-6">
                  Aparta tu lugar <span className="text-accent-text">en minutos.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <ol className="mt-8 space-y-4">
                  {STEPS[type].map((t, i) => (
                    <li key={t} className="flex items-center gap-4 text-[16px]">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[12px] text-accent-text">
                        0{i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="t-eyebrow mt-10">Sales con</p>
                <ul className="mt-4 space-y-3">
                  {s.outcome.map((o) => (
                    <li key={o} className="flex gap-3 text-[15px] leading-relaxed">
                      <span aria-hidden className="mt-[9px] inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-[13px] leading-relaxed text-muted">{s.footnote}</p>
              </Reveal>
            </div>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <BookingFlow type={type} canceled={canceled} />
          </Reveal>
        </div>
      </section>
      {children}
    </>
  );
}
