import type { Metadata } from "next";
import Link from "next/link";
import { confirmFromCheckout } from "@/lib/agenda/booking.server";
import { SITE } from "@/lib/site";
import { Arrow, btn } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Power Session confirmada", robots: { index: false, follow: false } };

type State =
  | { kind: "ok"; when: string; meetLink: string | null; email: string | null; brief: string | null }
  | { kind: "pending" }
  | { kind: "error" };

/** Regreso de Stripe: se verifica el pago directamente con Stripe y se confirma la cita (invitación + Meet). */
export default async function Confirmado({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let state: State = { kind: "error" };
  if (session_id && /^cs_(live|test)_[A-Za-z0-9]+$/.test(session_id)) {
    try {
      const r = await confirmFromCheckout(session_id);
      state = r.paid ? { kind: "ok", when: r.when, meetLink: r.meetLink, email: r.email, brief: r.brief } : { kind: "pending" };
    } catch (e) {
      console.error("[agenda] confirmado:", e instanceof Error ? e.message : e);
    }
  }

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-32 lg:pt-44">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-20 opacity-50" />
      <div className="container-x max-w-[760px]">
        {state.kind === "ok" ? (
          <>
            <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="t-eyebrow mt-8">Pago recibido</p>
            <h1 className="t-h2 mt-4">Tu Power Session quedó confirmada.</h1>
            <p className="mt-6 text-[19px] text-fg">{state.when} (hora del centro de México)</p>
            <p className="t-lead mt-4">
              Te envié la invitación de Google Calendar{state.email ? <> a <strong className="text-fg">{state.email}</strong></> : null} con el
              enlace de Google Meet, y Stripe te manda el recibo por separado. Llega con tus números a la mano: ventas del último mes y
              cuántos prospectos atiendes.
            </p>
            {state.brief ? (
              <div className="mt-10 rounded-[14px] border border-accent/50 bg-accent/10 p-6">
                <p className="t-eyebrow !text-fg">Siguiente paso · 8–10 min</p>
                <p className="mt-3 text-[17px] leading-relaxed text-fg">
                  Llena tu brief para que llegue con tu operación ya leída. Puedes contestar con audio y subir capturas de tus anuncios o
                  reportes. Se guarda solo y el link también va en tu invitación.
                </p>
                <a href={state.brief} className={`${btn.primary} btn-shine mt-6 px-8 py-4 text-lg`}>
                  Llenar mi brief
                  <Arrow />
                </a>
              </div>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {state.meetLink ? (
                <a href={state.meetLink} target="_blank" rel="noopener noreferrer" className={state.brief ? btn.ghost : btn.primary}>
                  Abrir enlace de Meet
                  <Arrow />
                </a>
              ) : null}
              <Link href="/" className={btn.ghost}>
                Volver al inicio
              </Link>
            </div>
          </>
        ) : state.kind === "pending" ? (
          <>
            <p className="t-eyebrow">Pago en proceso</p>
            <h1 className="t-h2 mt-4">Tu pago todavía se está procesando.</h1>
            <p className="t-lead mt-6">
              En cuanto Stripe lo confirme, te llega la invitación con el enlace de Meet. Si en una hora no la tienes, escríbeme a{" "}
              <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <p className="t-eyebrow">Agenda</p>
            <h1 className="t-h2 mt-4">No pude confirmar tu sesión desde aquí.</h1>
            <p className="t-lead mt-6">
              Si ya pagaste, tu cita se confirma sola en unos minutos y te llega la invitación por correo. Si tienes dudas, escríbeme a{" "}
              <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
            <Link href="/agendar/power-session" className={`${btn.ghost} mt-10`}>
              Volver a la agenda
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
