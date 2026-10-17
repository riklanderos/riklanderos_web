import type { Metadata } from "next";
import { BookingPage } from "@/components/agenda/BookingPage";
import { releaseHold } from "@/lib/agenda/booking.server";
import { OG_BASE } from "@/lib/site";

export const dynamic = "force-dynamic";

const TITLE = "Agenda tu Power Session";
const DESCRIPTION = "Diagnóstico 1:1 de 90 minutos con Rik Landeros. Elige tu horario en los próximos 5 días hábiles y paga en línea.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/agendar/power-session" },
  openGraph: { ...OG_BASE, title: `${TITLE} · Rik Landeros`, description: DESCRIPTION, url: "/agendar/power-session" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ pago?: string; apartado?: string }> }) {
  const { pago, apartado } = await searchParams;
  const canceled = pago === "cancelado";
  // Regresó de Stripe sin pagar: se libera el apartado antes de mostrar la disponibilidad.
  if (canceled && apartado && /^[a-z0-9_-]{5,1024}$/i.test(apartado)) {
    await releaseHold(apartado).catch((e) => console.error("[agenda] liberar:", e instanceof Error ? e.message : e));
  }
  return <BookingPage type="power" canceled={canceled} />;
}
