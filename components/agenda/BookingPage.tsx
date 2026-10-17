import type { SessionType } from "@/lib/agenda/config";
import { SESSIONS } from "@/lib/sessions";
import { Reveal } from "../motion";
import { Eyebrow } from "../ui";
import { BookingFlow } from "./BookingFlow";

/** Página de agenda: resumen de la sesión a la izquierda (fijo en desktop) y el flujo de reserva a la derecha. */
export function BookingPage({ type, canceled = false }: { type: SessionType; canceled?: boolean }) {
  const s = SESSIONS[type];
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-28 lg:pb-32 lg:pt-36">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-50" />
      <div
        aria-hidden
        className="absolute -z-10 left-[-20%] top-[-10%] h-[60vh] w-[60vw] rounded-full opacity-[0.14] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
      />
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <Eyebrow>Agenda · {s.kicker}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="t-h2 mt-6">
                Agenda tu <span className="text-accent-text">{s.name}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-lead mt-5">{s.tagline}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-line bg-line">
                {[
                  ["Duración", s.duration],
                  ["Costo", s.price],
                  ["Con", s.who],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg px-3 py-4 sm:px-4">
                    <dt className="t-mono text-[10px] uppercase tracking-[0.14em] text-muted">{k}</dt>
                    <dd className="mt-1.5 text-[15px] font-medium leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="t-eyebrow mt-8">Sales con</p>
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
  );
}
