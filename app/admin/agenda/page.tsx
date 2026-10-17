import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { calendarFor } from "@/lib/agenda/booking.server";
import { isAdminHost, type ConnectorKey } from "@/lib/agenda/connect.server";
import {
  listCalendars,
  type CalendarSummary,
} from "@/lib/agenda/google.server";
import { stripeClient, stripeLive } from "@/lib/agenda/stripe.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Agenda · Administración",
  robots: { index: false, follow: false },
};

type Check<T> = { ok: true; data: T } | { ok: false; error: string };
async function check<T>(fn: () => Promise<T>): Promise<Check<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Página privada (solo en la URL interna del despliegue, protegida por Vercel): conecta Google Calendar y Stripe
 * a nombre de Rik y muestra los calendarios disponibles con su ID.
 */
export default async function AgendaAdmin({
  searchParams,
}: {
  searchParams: Promise<{ conectado?: string }>;
}) {
  const host = (await headers()).get("host");
  if (!isAdminHost(host)) notFound();
  const { conectado } = await searchParams;

  const [google, stripe] = await Promise.all([
    check(listCalendars),
    check(async () => {
      const s = await stripeClient();
      await s.checkout.sessions.list({ limit: 1 }); // Prueba real de la llave: falla si no sirve para cobrar.
      const acct = await s.accounts.retrieve().catch(() => null);
      return {
        live: stripeLive(),
        name:
          acct?.settings?.dashboard?.display_name ||
          acct?.business_profile?.name ||
          acct?.email ||
          acct?.id ||
          "Cuenta conectada",
      };
    }),
  ]);
  const current = {
    power: safe(() => calendarFor("power")),
    discovery: safe(() => calendarFor("discovery")),
  };

  return (
    <main className="container-x pb-24 pt-32">
      <p className="t-eyebrow">Administración · privada</p>
      <h1 className="t-h2 mt-4">Conexiones de la agenda</h1>
      <p className="t-lead mt-4 max-w-[680px]">
        Esta página solo existe en la dirección interna de Vercel. Conecta tus
        cuentas una vez; la agenda usa ese permiso para leer tu disponibilidad,
        crear las citas y cobrar la Power Session.
      </p>
      {conectado ? (
        <p className="mt-6 rounded-[10px] border border-line-strong bg-elev px-4 py-3 text-[15px]">
          Regresaste de autorizar{" "}
          {conectado === "google" ? "Google Calendar" : "Stripe"}. Revisa el
          estado abajo.
        </p>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Google Calendar"
          service="google"
          ok={google.ok}
          detail={
            google.ok
              ? `${google.data.length} calendarios visibles`
              : google.error
          }
        />
        <Panel
          title="Stripe"
          service={null}
          ok={stripe.ok}
          detail={
            stripe.ok
              ? `${stripe.data.name} · ${stripe.data.live ? "Modo real (cobros reales)" : "Modo de prueba"}`
              : stripe.error
          }
        />
      </div>

      <section className="mt-14">
        <h2 className="t-h3">Calendarios asignados</h2>
        <dl className="mt-4 grid gap-2 text-[15px]">
          <div>
            <dt className="inline text-muted">Power Session: </dt>
            <dd className="inline font-mono">
              {current.power ?? "sin asignar"}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted">Discovery Session: </dt>
            <dd className="inline font-mono">
              {current.discovery ?? "sin asignar"}
            </dd>
          </div>
        </dl>
        {google.ok ? <CalendarTable items={google.data} /> : null}
      </section>
    </main>
  );
}

function safe(fn: () => string): string | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

function Panel({
  title,
  service,
  ok,
  detail,
}: {
  title: string;
  service: ConnectorKey | null;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="t-h3">{title}</h2>
        <span
          className={`t-mono text-[11px] uppercase tracking-[0.14em] ${ok ? "text-fg" : "text-accent-text"}`}
        >
          {ok ? "● Conectado" : "○ Sin conectar"}
        </span>
      </div>
      <p className="mt-3 break-words text-[14px] text-muted">{detail}</p>
      {service ? (
        <a
          href={`/api/agenda/conectar?servicio=${service}`}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-medium text-white hover:bg-accent-hover"
        >
          {ok ? `Volver a conectar ${title}` : `Conectar ${title}`}
        </a>
      ) : (
        <p className="mt-6 text-[13px] text-muted">
          Se configura con la variable STRIPE_SECRET_KEY en Vercel.
        </p>
      )}
    </div>
  );
}

function CalendarTable({ items }: { items: CalendarSummary[] }) {
  const writable = items.filter(
    (c) => c.accessRole === "owner" || c.accessRole === "writer",
  );
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
        <thead className="text-muted">
          <tr className="border-b border-line">
            <th className="py-2 pr-4 font-medium">Calendario</th>
            <th className="py-2 pr-4 font-medium">ID (lo que necesito)</th>
            <th className="py-2 font-medium">Permiso</th>
          </tr>
        </thead>
        <tbody>
          {writable.map((c) => (
            <tr key={c.id} className="border-b border-line">
              <td className="py-3 pr-4">
                {c.summary}
                {c.primary ? (
                  <span className="ml-2 text-muted">(principal)</span>
                ) : null}
              </td>
              <td className="select-all py-3 pr-4 font-mono text-[13px]">
                {c.id}
              </td>
              <td className="py-3 text-muted">{c.accessRole}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
