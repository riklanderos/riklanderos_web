import { Accordion } from "../Accordion";
import { Reveal } from "../motion";
import { PS_FAQ } from "./data";
import { SectionTitle } from "./SectionTitle";

/** 06 · FAQ corta (3 preguntas) + FAQPage JSON-LD (spec §9.3). */
export function PSFaq() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PS_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="section" aria-labelledby="ps-preguntas">
      <div className="container-x">
        <div className="mx-auto max-w-[920px]">
          <SectionTitle id="ps-preguntas" index="06" eyebrow="Preguntas" title="Lo que me preguntan antes de pagar." />
          <Reveal className="mt-12" delay={0.1}>
            <Accordion items={PS_FAQ} id="power-session" />
          </Reveal>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
