import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PowerSessionButton } from "@/components/PowerSessionButton";
import { CTASection } from "@/components/CTASection";
import { ButtonLink } from "@/components/ui";
import { ProofStrip } from "@/components/metodo/ProofStrip";
import { OrderPhases } from "@/components/metodo/OrderPhases";
import { AIPhase } from "@/components/metodo/AIPhase";
import { StepsSection } from "@/components/metodo/StepsSection";
import { MethodResults } from "@/components/metodo/MethodResults";
import { ForWhom } from "@/components/metodo/ForWhom";
import { SITE } from "@/lib/site";

const TITLE = "Método Sistema Radikal";
const DESCRIPTION =
  "Branding, marketing, ventas y, al final, IA. El orden correcto y los 5 pasos con los que construyo negocios que funcionan sin su dueño. Primero diagnóstico, después tecnología.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/metodo" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/metodo",
    siteName: SITE.name,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    images: [{ url: "/og/og-riklanderos-v2.jpg", width: 1200, height: 630, alt: "Rik Landeros — Método Sistema Radikal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    images: ["/og/og-riklanderos-v2.jpg"],
  },
};

export default function MetodoPage() {
  return (
    <>
      <PageHero
        eyebrow="Método · Sistema Radikal"
        title="El Sistema Radikal: un negocio que funciona sin ti."
        accentWords={["Radikal"]}
        lead={
          <>
            <p>No es marketing. No es ventas. Es la ingeniería completa de tu negocio.</p>
            <p className="mt-4 text-fg">
              Lo aplico como consultor de IA para empresas y fundador de Ingeniak: primero el orden, después la tecnología.
            </p>
          </>
        }
        actions={
          <>
            <PowerSessionButton section="metodo_hero" />
            <ButtonLink href="#pasos" variant="ghost">
              Ver los 5 pasos
            </ButtonLink>
          </>
        }
        image="/img/rik-seated.webp"
        imageAlt="Rik Landeros sentado en un banco, relajado, en retrato de cuerpo completo sobre fondo negro"
        imageFocus="50% 0%"
        imageFocusLg="50% 30%"
      />
      <ProofStrip />
      <OrderPhases />
      <AIPhase />
      <StepsSection />
      <MethodResults />
      <ForWhom />
      <CTASection
        section="metodo_final"
        eyebrow="Power Session"
        body="90 minutos conmigo. Te digo en qué fase está tu negocio y cuál es el siguiente movimiento, en el orden correcto."
      />
    </>
  );
}
