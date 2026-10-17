/**
 * Copy de /power-session (spec §7.2). Voz: spec §3 — directo, sin gurú, sin hype,
 * sin urgencia artificial. Cifras: solo spec §1.7, ingeniak.mx y las confirmadas por Rik.
 */

import { SITE } from "@/lib/site";

export const PS_MICROCOPY = `${SITE.powerSessionPrice} · Pago único · Solo 4 sesiones por semana`;

/** Qué audito en la sesión. */
export const PS_AUDIT = [
  {
    code: "A-01",
    name: "Prospección",
    body: "De dónde llegan tus clientes, de dónde deberían llegar y por qué no llegan más.",
  },
  {
    code: "A-02",
    name: "Ventas",
    body: "Qué pasa entre el primer mensaje y el cierre. Dónde se enfría el prospecto.",
  },
  {
    code: "A-03",
    name: "Automatización e IA",
    body: "Qué ya puedes automatizar, qué agente de IA tiene sentido y qué no tocar todavía.",
  },
] as const;

/** Qué sales teniendo. */
export const PS_DELIVERABLES = [
  {
    n: "01",
    tag: "Por escrito",
    title: "Diagnóstico escrito",
    body: "Lo que vi en tu prospección, tus ventas y tu automatización, para revisarlo con tu equipo sin depender de la memoria.",
  },
  {
    n: "02",
    tag: "En el orden correcto",
    title: "Tres movimientos prioritarios",
    body: "Qué haces primero, qué después y qué no tocas todavía. Dirección, tráfico, conversión, escala: en ese orden.",
  },
  {
    n: "03",
    tag: "Recomendación honesta",
    title: "Si tiene sentido seguir juntos,",
    brush: "o no.",
    body: "Te lo digo de frente, aunque la respuesta sea que no me necesitas. A veces lo que ya tienes sirve y solo hay que ordenarlo.",
  },
] as const;

export const PS_FIT = {
  yes: [
    "Tu negocio ya vende y tiene equipo, pero todo sigue pasando por ti.",
    "Quieres meter IA o automatizar, y no sabes qué va primero ni qué no tocar.",
    "Ya te vendieron piezas sueltas —agencia, CRM, pautas— y quieres que alguien lea el negocio completo antes de invertir otro peso.",
  ],
  no: [
    "Buscas el precio más bajo o una plantilla que sirva igual para todos.",
    "Quieres que alguien haga las pautas y no se meta en el resto del negocio.",
  ],
} as const;

export const PS_STEPS = [
  {
    n: "01",
    title: "Pagas y eliges horario",
    body: "Tu lugar se aparta con el pago. Las 4 sesiones de cada semana se asignan por orden de pago.",
  },
  {
    n: "02",
    title: "Llenas un cuestionario de 10 minutos",
    body: "Tu negocio, tus números y lo que ya probaste. Así no gastamos la sesión en contexto.",
  },
  {
    n: "03",
    title: "Sesión por Google Meet",
    body: "90 minutos conmigo sobre tu caso real. Prospección, ventas y automatización, sin ejemplos de libro.",
  },
  {
    n: "04",
    title: "Recibes el diagnóstico",
    body: "Por escrito: lo que vi, los tres movimientos en orden y mi recomendación honesta.",
  },
] as const;

export const PS_INCLUDES = [
  "Cuestionario previo breve",
  "90 minutos 1:1 conmigo por Google Meet",
  "Diagnóstico escrito de prospección, ventas y automatización",
  "Tres movimientos prioritarios en el orden correcto",
  "Recomendación honesta: seguir juntos, o no",
] as const;

/** FAQ corta (spec §7.2). Respuestas autocontenidas para AEO (spec §9.3). */
export const PS_FAQ = [
  {
    q: "¿Qué pasa si después de la sesión no quiero seguir trabajando contigo?",
    a: "Nada. Te quedas con el diagnóstico escrito y los tres movimientos, y los ejecutas con tu equipo o con quien tú decidas. La Power Session no es la antesala de una venta: si no tiene sentido seguir, te lo digo yo primero.",
  },
  {
    q: "¿Necesito tener IA o automatización implementada para agendar?",
    a: "No. Muchas veces la conclusión es que la IA todavía no va. La IA escala lo que ya funciona; si tu prospección o tu proceso de ventas aún no están, te digo qué construir antes de automatizar.",
  },
  {
    q: "¿La sesión es contigo o con alguien de tu equipo?",
    a: "Conmigo, 1:1, por Google Meet. No hay vendedor ni ejecutivo de cuenta en la llamada. Si después necesitas ejecución, mi equipo en Ingeniak construye lo que diseñamos.",
  },
] as const;
