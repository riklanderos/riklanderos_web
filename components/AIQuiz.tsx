"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { PowerSessionButton } from "./PowerSessionButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const QUESTIONS = [
  { level: 0, q: "¿Tienes claro a quién le vendes y por qué te eligen a ti y no a otro?" },
  { level: 1, q: "¿Te llegan prospectos de forma constante, sin depender solo de recomendaciones?" },
  { level: 2, q: "¿Tienes un proceso de ventas que tu equipo sigue sin que tú estés presente?" },
  { level: 3, q: "¿Tus prospectos reciben respuesta en minutos, a cualquier hora?" },
  { level: 3, q: "¿Tus ventas viven en un CRM que alguien usa todos los días?" },
] as const;

const RESULTS = [
  {
    tag: "01 · Branding",
    title: "Tu prioridad es la dirección.",
    body: "Antes de invertir en tráfico o en IA, define a quién le hablas y por qué te eligen. Sin eso, cada peso en anuncios se diluye y la IA solo automatiza la confusión.",
  },
  {
    tag: "02 · Marketing",
    title: "Tu prioridad es el tráfico.",
    body: "Tu marca tiene dirección, pero no tienes un flujo predecible de prospectos. El siguiente movimiento es un sistema de atracción, no un agente de IA.",
  },
  {
    tag: "03 · Ventas",
    title: "Tu prioridad es la conversión.",
    body: "Te llegan prospectos, pero cerrar depende de ti. Primero un proceso comercial que tu equipo pueda seguir; después lo automatizamos.",
  },
  {
    tag: "04 · Automatización / IA",
    title: "Estás listo para automatizar con IA.",
    body: "Tienes con qué. Ahora toca que el sistema responda, dé seguimiento y agende sin ti: agentes de IA, CRM y automatización conectados a tu proceso.",
  },
  {
    tag: "Orden completo · Escala",
    title: "Tu base está sólida. Toca escalar.",
    body: "La conversación ya no es qué herramienta comprar, sino cómo multiplicar lo que funciona: IA para escalar y datos para decidir rápido.",
  },
] as const;

/** Diagnóstico rápido: ubica al visitante en el orden correcto (spec §1.4). */
export function AIQuiz() {
  const [answers, setAnswers] = useState<boolean[]>([]);
  // Al cambiar de pregunta o mostrar el resultado, el botón enfocado se desmonta:
  // el foco pasa al nuevo título en cuanto se monta, para no caer en <body> (WCAG 2.4.3).
  const interacted = useRef(false);
  const focusTitle = useCallback((el: HTMLParagraphElement | null) => {
    if (el && interacted.current) el.focus({ preventScroll: true });
  }, []);
  const step = answers.length;
  const done = step === QUESTIONS.length || answers.includes(false);

  let resultIdx = RESULTS.length - 1;
  const firstNo = answers.indexOf(false);
  if (firstNo !== -1) resultIdx = QUESTIONS[firstNo].level;
  const result = RESULTS[resultIdx];

  function answer(v: boolean) {
    interacted.current = true;
    const next = [...answers, v];
    setAnswers(next);
    if (!v || next.length === QUESTIONS.length) {
      const idx = next.indexOf(false) === -1 ? RESULTS.length - 1 : QUESTIONS[next.indexOf(false)].level;
      track("quiz_complete", { result: RESULTS[idx].tag });
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line bg-elev">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="relative grid lg:grid-cols-12">
        {/* Progreso por niveles */}
        <div className="border-b border-line p-8 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r">
          <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">Diagnóstico rápido</p>
          <p className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight">¿En qué nivel del orden está tu negocio?</p>
          <ol className="mt-8 space-y-3" aria-label="Progreso">
            {QUESTIONS.map((_, i) => {
              const state = i < step ? (answers[i] ? "yes" : "no") : i === step && !done ? "current" : "idle";
              return (
                <li key={i} className="flex items-center gap-3" aria-current={state === "current" ? "step" : undefined}>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-mono transition-colors duration-300 ${
                      state === "yes"
                        ? "border-fg bg-fg text-bg"
                        : state === "no"
                          ? "border-accent bg-accent text-white"
                          : state === "current"
                            ? "border-accent text-accent-text"
                            : "border-line-strong text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="sr-only">
                    {state === "yes"
                      ? "respondida: sí"
                      : state === "no"
                        ? "respondida: no"
                        : state === "current"
                          ? "pregunta actual"
                          : "pendiente"}
                  </span>
                  <span className={`h-px flex-1 ${i < step ? "bg-line-strong" : "bg-line"}`} />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="min-h-[340px] p-8 md:p-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Pregunta {step + 1} de {QUESTIONS.length}
                </p>
                <p
                  ref={focusTitle}
                  tabIndex={-1}
                  className="mt-5 max-w-xl font-display text-3xl font-bold leading-tight tracking-tight outline-none md:text-4xl"
                >
                  {QUESTIONS[step].q}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => answer(true)}
                    className="rounded-full border border-line-strong px-8 py-3.5 font-medium transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => answer(false)}
                    className="rounded-full border border-line-strong px-8 py-3.5 font-medium transition-colors hover:border-accent hover:bg-accent hover:text-white"
                  >
                    No, todavía no
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <p className="t-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">Tu nivel: {result.tag}</p>
                <p
                  ref={focusTitle}
                  tabIndex={-1}
                  className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight outline-none md:text-4xl"
                >
                  {result.title}
                </p>
                <p className="mt-5 max-w-xl text-muted">{result.body}</p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PowerSessionButton section="diagnostico" label="Agenda tu Power Session" />
                  <button
                    type="button"
                    onClick={() => {
                      interacted.current = true;
                      setAnswers([]);
                    }}
                    className="t-mono rounded-full px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg"
                  >
                    Repetir diagnóstico
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
