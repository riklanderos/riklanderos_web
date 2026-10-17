import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { isAdminHost } from "@/lib/agenda/connect.server";
import { formatSlotEs } from "@/lib/agenda/config";
import { ensureBrief, listBriefs } from "@/lib/brief/server";
import { STEPS, progress } from "@/lib/brief/questions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Briefs · Administración", robots: { index: false, follow: false } };

/** Brief de prueba para ver la experiencia del cliente sin pagar una sesión. */
async function createTestBrief() {
  "use server";
  if (!isAdminHost((await headers()).get("host"))) return;
  const token = await ensureBrief({ eventId: `prueba-${Date.now()}`, name: "Prueba Rik", business: "Negocio de prueba", sessionStart: null });
  if (token) redirect(`/brief/${token}`);
}

/** Lista privada de briefs de Power Session (solo en las URLs internas de Vercel). */
export default async function BriefsAdmin() {
  if (!isAdminHost((await headers()).get("host"))) notFound();
  let briefs: Awaited<ReturnType<typeof listBriefs>> = [];
  let error: string | null = null;
  try {
    briefs = await listBriefs();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error";
  }
  const now = Date.now();
  return (
    <main className="container-x pb-24 pt-32">
      <p className="t-eyebrow">Administración · privada</p>
      <h1 className="t-h2 mt-4">Briefs de Power Session</h1>
      <p className="t-lead mt-4 max-w-[680px]">Se crean solos cuando un cliente paga. Aquí ves lo que contestó, escuchas sus audios y descargas sus archivos.</p>
      <form action={createTestBrief} className="mt-6">
        <button className="rounded-full border border-line-strong px-5 py-2.5 text-[14px] hover:border-fg">+ Crear brief de prueba</button>
      </form>
      {error ? <p className="mt-8 text-accent-text">No pude leer los briefs: {error}. ¿Ya corriste supabase/power_briefs.sql?</p> : null}
      {!error && !briefs.length ? <p className="mt-10 text-muted">Todavía no hay briefs. Aparecerán aquí con la primera Power Session pagada.</p> : null}
      <ul className="mt-10 grid gap-3">
        {briefs.map((b) => {
          const pct = Math.round(progress(b.answers ?? { values: {}, files: {} }) * 100);
          const files = Object.values(b.answers?.files ?? {}).reduce((n, l) => n + l.length, 0);
          const audios = STEPS.flatMap((f) => f.questions).filter((q) => {
            const v = b.answers?.values?.[q.id] as { audio?: unknown } | undefined;
            return q.kind === "voice" && !!v?.audio;
          }).length;
          const past = b.session_start ? Date.parse(b.session_start) < now : false;
          return (
            <li key={b.id}>
              <Link href={`/admin/briefs/${b.id}`} className="card flex flex-col gap-3 p-5 transition-colors hover:border-fg sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold">
                    {b.business || "Sin negocio"} <span className="font-normal text-muted">· {b.name}</span>
                  </p>
                  <p className={`mt-1 text-[14px] ${past ? "text-muted" : "text-fg"}`}>
                    {b.session_start ? formatSlotEs(b.session_start) : "Sin fecha"}
                    {past ? " · ya pasó" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-5 text-[13px] text-muted">
                  <span>🎙 {audios}</span>
                  <span>📎 {files}</span>
                  <span className="w-12 text-right font-mono text-fg">{pct}%</span>
                  <span
                    className={`t-mono rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] ${
                      b.status === "enviado" ? "bg-accent text-white" : "border border-line-strong"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
