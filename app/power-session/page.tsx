import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { DiscoverySessionButton } from "@/components/DiscoverySessionButton";
import { SessionGlyph } from "@/components/SessionGlyph";
import { Reveal } from "@/components/motion";
import { ProofBar } from "@/components/power-session/ProofBar";
import { BookingPage } from "@/components/agenda/BookingPage";
import { releaseHold } from "@/lib/agenda/booking.server";
import { WhatItIs } from "@/components/power-session/WhatItIs";
import { Deliverables } from "@/components/power-session/Deliverables";
import { Fit } from "@/components/power-session/Fit";
import { HowItWorks } from "@/components/power-session/HowItWorks";
import { Pricing } from "@/components/power-session/Pricing";
import { PSFaq } from "@/components/power-session/PSFaq";
import { SESSIONS } from "@/lib/sessions";
import { SITE } from "@/lib/site";

const TITLE = "Power Session: diagnóstico 1:1 de 90 minutos";
const DESCRIPTION =
  `90 minutos 1:1 conmigo. Audito tu prospección, tus ventas y tu automatización con IA, y sales con un diagnóstico escrito y tres movimientos en el orden correcto. ${SITE.powerSessionPrice}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/power-session" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/power-session",
    siteName: SITE.name,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    images: [{ url: "/og/og-riklanderos-v2.jpg", width: 1200, height: 630, alt: "Power Session con Rik Landeros" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    images: ["/og/og-riklanderos-v2.jpg"],
  },
};

/** Service (spec §9.3): Power Session con offers 297 USD; provider = Person Rik Landeros. */
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE.url}/power-session#service`,
  name: "Power Session",
  serviceType: "Consultoría estratégica 1:1 en prospección, ventas y automatización con IA",
  description:
    "Sesión 1:1 de 90 minutos con Rik Landeros por Google Meet. Auditoría de prospección, ventas y automatización con IA. Incluye cuestionario previo, diagnóstico escrito, tres movimientos prioritarios en el orden correcto y una recomendación honesta sobre si tiene sentido seguir trabajando juntos.",
  url: `${SITE.url}/power-session`,
  image: `${SITE.url}/img/rik-frame.webp`,
  provider: {
    "@type": "Person",
    "@id": `${SITE.url}/#rik`,
    name: "Rik Landeros",
    url: SITE.url,
    jobTitle: "Consultor de IA para empresas · Fundador de Ingeniak",
  },
  offers: {
    "@type": "Offer",
    price: String(SITE.powerSessionAmount),
    priceCurrency: SITE.powerSessionCurrency,
    url: SITE.powerSessionUrl,
    availability: "https://schema.org/LimitedAvailability",
    description: "Pago único. Solo 4 sesiones por semana, asignadas por orden de pago.",
  },
};

/** Franja discreta: quien ya sabe que quiere el sistema implementado tiene la Discovery Session. */
function DiscoveryAside() {
  const d = SESSIONS.discovery;
  return (
    <section aria-labelledby="ps-discovery" className="relative overflow-hidden border-t border-line">
      <div className="container-x grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-center md:gap-10 lg:py-14">
        <Reveal className="flex items-start gap-5">
          <SessionGlyph kind="discovery" className="mt-1 h-12 w-12 shrink-0 text-paper md:h-14 md:w-14" />
          <div>
            <h2 id="ps-discovery" className="t-mono text-[11px] font-medium uppercase tracking-[0.16em] text-paper">
              ¿Ya sabes que quieres implementar el sistema?
            </h2>
            <p className="mt-2 max-w-2xl text-[1.05rem] leading-relaxed text-muted md:text-lg">
              Entonces empieza por la <span className="font-medium text-fg">{d.name}</span>: {d.duration}, {d.price.toLowerCase()},
              conmigo y mi equipo de Ingeniak. Revisamos tu operación y te decimos qué sistema necesitas.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <DiscoverySessionButton section="ps_discovery" variant="ghost" className="w-full md:w-auto" />
        </Reveal>
      </div>
    </section>
  );
}

export const dynamic = "force-dynamic";

/**
 * Página única de la Power Session: hero épico → video → reserva con pago → toda la información de la sesión.
 * Stripe regresa aquí con ?pago=cancelado&apartado=<evento> cuando el cliente no paga.
 */
export default async function PowerSessionPage({ searchParams }: { searchParams: Promise<{ pago?: string; apartado?: string }> }) {
  const { pago, apartado } = await searchParams;
  const canceled = pago === "cancelado";
  // Regresó de Stripe sin pagar: se libera el apartado antes de mostrar la disponibilidad.
  if (canceled && apartado && /^[a-z0-9_-]{5,1024}$/i.test(apartado)) {
    await releaseHold(apartado).catch((e) => console.error("[agenda] liberar:", e instanceof Error ? e.message : e));
  }
  return (
    <BookingPage type="power" canceled={canceled}>
      <ProofBar />
      <WhatItIs />
      <Deliverables />
      <Fit />
      <HowItWorks />
      <Pricing />
      <DiscoveryAside />
      <PSFaq />
      <CTASection
        mode="power"
        section="ps_final"
        eyebrow="Power Session"
        title="Primero la verdad cruda. Después decides tú."
        body="Noventa minutos conmigo. Sales con un diagnóstico escrito y tres movimientos en orden, no con una propuesta."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }}
      />
    </BookingPage>
  );
}
