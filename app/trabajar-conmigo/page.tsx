import type { Metadata } from "next";
import { OG_BASE, SITE } from "@/lib/site";
import { FAQ_TRABAJAR } from "@/content/trabajar-conmigo";
import { PageHero } from "@/components/PageHero";
import { PowerSessionButton } from "@/components/PowerSessionButton";
import { DiscoverySessionButton } from "@/components/DiscoverySessionButton";
import { CTASection } from "@/components/CTASection";
import { Accordion } from "@/components/Accordion";
import { Reveal, SplitWords } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { Credentials } from "@/components/trabajar/Credentials";
import { OfferBlocks } from "@/components/trabajar/OfferBlocks";
import { ComparisonTable } from "@/components/trabajar/ComparisonTable";
import { AIConsultant } from "@/components/trabajar/AIConsultant";
import { AICapabilities } from "@/components/trabajar/AICapabilities";
import { IngeniakBlock } from "@/components/trabajar/IngeniakBlock";
import { SessionChooser } from "@/components/SessionChooser";

const TITLE = "Trabajar conmigo: consultoría de IA y Growth Partner";
const DESCRIPTION =
  "Consultoría estratégica integral en IA o implementación completa con Ingeniak. Yo diseño la estrategia; mi equipo construye el sistema. Todo empieza con un diagnóstico, no con una propuesta.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/trabajar-conmigo" },
  openGraph: {
    ...OG_BASE,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    url: "/trabajar-conmigo",
    type: "website",
    images: [
      {
        url: "/og/og-riklanderos-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Rik Landeros — Consultor de IA para empresas",
      },
    ],
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_TRABAJAR.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function TrabajarConmigoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero
        eyebrow="Consultor de IA para empresas · Fundador de Ingeniak"
        title="Yo diseño la estrategia. Mi equipo construye el sistema."
        accentWords={["estrategia", "sistema"]}
        lead={
          <>
            Soy consultor de inteligencia artificial para empresas y fundador de Ingeniak, con 14 años en marketing. Primero leo
            tu negocio completo. Después decides si quieres solo el mapa o también la construcción.
          </>
        }
        actions={
          <>
            <PowerSessionButton section="trabajar_hero" />
            <DiscoverySessionButton section="trabajar_hero" variant="ghost" />
          </>
        }
        image="/img/rik-explain.webp"
        imageAlt="Rik Landeros explicando con las manos en su escritorio"
        imageFocus="62% 35%"
        imageFocusLg="82% 40%"
        imageWidth="60%"
        imageMobileHeight="min(84vw, 520px)"
      />

      <Credentials />

      <OfferBlocks />

      {/* 02 · Qué incluye cada uno (sin precios) */}
      <section id="comparativa" className="section border-t border-line" aria-labelledby="trabajar-comparativa">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow index="02">Comparativa</Eyebrow>
              </Reveal>
              <div id="trabajar-comparativa">
                <SplitWords as="h2" className="t-h2 mt-6" text="Qué incluye cada uno." accentWords={["cada", "uno"]} />
              </div>
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="t-lead">Misma estrategia, mismo diagnóstico, mismo orden. Cambia quién ejecuta.</p>
            </Reveal>
          </div>

          <Reveal className="mt-14">
            <ComparisonTable />
          </Reveal>

          <Reveal className="mt-14 grid gap-6 border-l-2 border-accent pl-6 md:pl-8 lg:grid-cols-12" delay={0.1}>
            <p className="font-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.025em] lg:col-span-9">
              <span className="text-muted">
                La inversión se define después del diagnóstico, según nivel, recursos y objetivo real.
              </span>{" "}
              <span className="text-fg">No hay precio de lista porque no hay negocio de lista.</span>
            </p>
            <div className="flex items-end lg:col-span-3 lg:justify-end">
              <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                Única tarifa pública:
                <br />
                Power Session · {SITE.powerSessionPrice}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <AIConsultant />

      <AICapabilities />

      <IngeniakBlock />

      <SessionChooser section="trabajar" variant="compact" index="06" id="sesiones" />

      {/* 07 · Preguntas */}
      <section className="section" aria-labelledby="trabajar-faq">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow index="07">Antes de agendar</Eyebrow>
              </Reveal>
              <div id="trabajar-faq">
                <SplitWords as="h2" className="t-h2 mt-6" text="Lo que me preguntan antes de trabajar juntos." />
              </div>
            </div>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <Accordion items={FAQ_TRABAJAR} id="trabajar" />
          </Reveal>
        </div>
      </section>

      <CTASection section="trabajar_final" />
    </>
  );
}
