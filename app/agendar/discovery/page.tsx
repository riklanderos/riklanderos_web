import type { Metadata } from "next";
import { BookingPage } from "@/components/agenda/BookingPage";
import { OG_BASE } from "@/lib/site";

const TITLE = "Agenda tu Discovery Session";
const DESCRIPTION =
  "30 minutos sin costo con Rik Landeros y el equipo de Ingeniak para diagnosticar tu operación. Elige tu horario en los próximos 5 días hábiles.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/agendar/discovery" },
  openGraph: { ...OG_BASE, title: `${TITLE} · Rik Landeros`, description: DESCRIPTION, url: "/agendar/discovery" },
};

export default function Page() {
  return <BookingPage type="discovery" />;
}
