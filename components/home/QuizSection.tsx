import { AIQuiz } from "../AIQuiz";
import { Reveal, SplitWords } from "../motion";
import { Eyebrow } from "../ui";

export function QuizSection() {
  return (
    <section className="section" aria-labelledby="diagnostico-titulo" id="diagnostico">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow index="09">Antes de meter IA</Eyebrow>
            <SplitWords id="diagnostico-titulo" as="h2" className="t-h2 mt-6" text="¿Qué te toca primero? Cinco preguntas, cero rodeos." accentWords={["primero"]} />
          </div>
          <Reveal className="lg:col-span-5 lg:pt-14" delay={0.1}>
            <p className="t-lead">
              Responde con honestidad. El resultado te dice en qué punto del orden estás y cuál es tu siguiente movimiento.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-14" delay={0.1}>
          <AIQuiz />
        </Reveal>
      </div>
    </section>
  );
}
