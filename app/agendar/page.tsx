import type { Metadata } from "next";
import { OG_BASE } from "@/lib/site";
import { SESSIONS } from "@/lib/sessions";
import { PageHero } from "@/components/PageHero";
import { SessionChooser } from "@/components/SessionChooser";
import { Accordion } from "@/components/Accordion";
import { Reveal, SplitWords } from "@/components/motion";
import { ButtonLink, Eyebrow } from "@/components/ui";

const TITLE = "Agenda: Power Session o Discovery Session";
const DESCRIPTION =
  "Dos formas de empezar conmigo: la Power Session, un diagnóstico 1:1 de 90 minutos (297 USD), o la Discovery Session, 30 minutos sin costo con mi equipo para implementar el sistema con Ingeniak.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/agendar" },
  openGraph: {
    ...OG_BASE,
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
    url: "/agendar",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Rik Landeros`,
    description: DESCRIPTION,
  },
};

const P = SESSIONS.power;
const D = SESSIONS.discovery;

/** Preguntas para decidir entre las dos. Solo datos confirmados (lib/sessions.ts y lo ya publicado). */
const FAQ_AGENDAR = [
  {
    q: "¿Cuál me conviene si todavía no sé qué está fallando?",
    a: `La ${P.name}. Son ${P.duration} 1:1 conmigo para revisar tu operación piso por piso. Sales con tu mapa de fugas, las 3 que más dinero te cuestan y un plan de 90 días con prioridades y responsables.`,
  },
  {
    q: "¿Y si ya sé que quiero el sistema funcionando?",
    a: `La ${D.name}. En ${D.duration}, sin costo, revisamos tu operación conmigo y mi equipo, y te decimos qué sistema necesitas: agentes de IA para WhatsApp, CRM con Kommo o GoHighLevel y automatización con n8n. Si tiene sentido, el siguiente paso es implementarlo con Ingeniak.`,
  },
  {
    q: "¿Puedo empezar con la Power Session y después implementar con Ingeniak?",
    a: `Sí. Si después implementas con Ingeniak, los ${P.price} de la Power Session se abonan completos a la implementación. No pagas dos veces por el diagnóstico.`,
  },
  {
    q: "¿Con quién hablo en cada una?",
    a: `En la Power Session, conmigo, 1:1, por Google Meet. En la Discovery Session, conmigo y mi equipo de Ingeniak, que es quien construye y opera el sistema.`,
  },
  {
    q: "¿La Power Session tiene garantía?",
    a: `Sí, garantía del 100 %. Abro solo 4 sesiones por semana y se asignan por orden de pago.`,
  },
] as const;

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_AGENDAR.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AgendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Agenda · Power Session o Discovery Session"
        title="Elige cómo empezamos."
        accentWords={["empezamos."]}
        lead={
          <>
            Antes de construir cualquier cosa, entiendo tu negocio. Puedes empezar con un diagnóstico 1:1 conmigo o, si ya sabes
            que quieres el sistema funcionando, con una sesión con mi equipo de Ingeniak.
          </>
        }
        actions={
          <>
            <ButtonLink href="#sesiones" variant="primary" className="px-8 py-4 text-lg">
              Ver las dos opciones
            </ButtonLink>
            <p className="t-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:ml-3">
              <span className="block">
                {P.name} · {P.duration} · {P.price}
              </span>
              <span className="block">
                {D.name} · {D.duration} · {D.price}
              </span>
            </p>
          </>
        }
        image="/img/rik-point.webp"
        imageAlt="Rik Landeros señalando hacia las dos formas de empezar"
        imageSide="right"
        imageFocus="70% 30%"
        imageFocusLg="90% 30%"
      />

      <SessionChooser
        section="agendar"
        id="sesiones"
        title="Cada una resuelve algo distinto."
        accentWords={["distinto."]}
        lead="Misma forma de pensar, distinto punto de partida. Si necesitas claridad antes de invertir, la Power Session. Si ya quieres que alguien construya y opere el sistema, la Discovery Session."
      />

      <section className="section border-t border-line" aria-labelledby="agendar-faq">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow>Antes de elegir</Eyebrow>
              </Reveal>
              <SplitWords id="agendar-faq" as="h2" className="t-h2 mt-6" text="Lo que me preguntan para decidir." accentWords={["decidir."]} />
            </div>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <Accordion items={FAQ_AGENDAR} id="agendar" />
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
