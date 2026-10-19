import type { Metadata } from "next";
import { BookingPage } from "@/components/agenda/BookingPage";
import { OG_BASE } from "@/lib/site";

const TITLE = "Discovery Session: 30 minutos sin costo";
const DESCRIPTION =
  "30 minutos sin costo con Rik Landeros y el equipo de Ingeniak para diagnosticar tu operación. Elige tu horario en los próximos 5 días hábiles.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/discovery" },
  openGraph: { ...OG_BASE, title: `${TITLE} · Rik Landeros`, description: DESCRIPTION, url: "/discovery" },
};

/** Página única de la Discovery Session: hero épico → video → reserva (se confirma al instante con Meet). */
export default function Page() {
  return <BookingPage type="discovery" />;
}
