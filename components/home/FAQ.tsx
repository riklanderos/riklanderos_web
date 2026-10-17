import { FAQ_HOME } from "@/lib/content";
import { Accordion } from "../Accordion";
import { Reveal, SplitWords } from "../motion";
import { Eyebrow } from "../ui";
import { jsonLd } from "@/lib/jsonld";

export function FAQ() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_HOME.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="section" aria-labelledby="preguntas">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="12">Objeciones</Eyebrow>
            <SplitWords id="preguntas" as="h2" className="t-h2 mt-6" text="Lo que me preguntan antes de agendar." />
          </div>
        </div>
        <Reveal className="lg:col-span-8" delay={0.1}>
          <Accordion items={FAQ_HOME} id="home" />
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
    </section>
  );
}
