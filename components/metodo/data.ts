/**
 * Contenido exclusivo de /metodo (spec §7.1, §1.4, §1.5).
 * Reglas: voz de spec §3 y solo cifras verificadas (spec §1.7, ingeniak.mx,
 * "14 años en marketing" confirmado por Rik). No se inventan datos.
 */
import { QUOTES, type ClientSlug } from "@/lib/content";

/** Datos de autoridad bajo el hero. */
export const PROOF_FACTS = [
  { kind: "count", value: 14, prefix: "", label: "Años en marketing" },
  { kind: "count", value: 1, prefix: "#", label: "Nacional en ventas (origen)" },
  { kind: "static", text: "2022", label: "Fundé Ingeniak" },
  { kind: "count", value: 7, prefix: "", label: "Países donde opera Ingeniak" },
] as const;

/** Alto de cada logo en la franja de /metodo (archivo y tamaño intrínseco viven en CLIENTS). */
export const CLIENT_LOGO_CLS: Record<ClientSlug, string> = {
  // cocacola y nike son íconos 24×24: el trazo ocupa ~1/3 del alto, por eso van más altos.
  cocacola: "h-[72px] md:h-20",
  nike: "h-12 md:h-14",
  bmw: "h-8 md:h-9",
  cemex: "h-5 md:h-6",
  argi: "h-6 md:h-7",
  tierrayarmonia: "h-8 md:h-9",
};

export type Phase = {
  n: string;
  name: string;
  word: string;
  analogy: string;
  body: string;
  skipLabel: string;
  skip: string;
  proof: { label: string; text: string; href?: string };
};

/** Las 4 fases del orden correcto, explicadas a peras y manzanas. */
export const PHASES: Phase[] = [
  {
    n: "01",
    name: "Branding",
    word: "Dirección",
    analogy: "Tu marca es una persona que entra por la puerta.",
    body: "Cómo habla, cómo se ve, a quién saluda primero. Eso es branding. No es tu logo: es tu personalidad, a quién le hablas y por qué te eligen a ti y no al de enfrente.",
    skipLabel: "Si te lo saltas",
    skip: "Pagas anuncios que atraen al cliente equivocado.",
    proof: {
      label: "Caso Argi",
      text: "Posicionamiento de autoridad. Dejó de licitar: ahora los buscan.",
      href: "/casos/argi",
    },
  },
  {
    n: "02",
    name: "Marketing",
    word: "Tráfico",
    analogy: "El mejor restaurante en una calle vacía no vende.",
    body: "Marketing es poner a la persona correcta frente a tu negocio todos los días, no solo cuando te acuerdas. Tiene 50 caminos; casi siempre te enseñaron uno: pautar.",
    skipLabel: "Si te lo saltas",
    skip: "Tienes una gran marca que nadie conoce.",
    proof: {
      label: "Caso clínica estética",
      text: "Mensaje para el cliente premium: el mismo esfuerzo por el pez gordo.",
      href: "/casos/clinica-estetica",
    },
  },
  {
    n: "03",
    name: "Ventas",
    word: "Conversión",
    analogy: "Es el mostrador: ahí el curioso se vuelve cliente.",
    body: "Quién contesta, en cuánto tiempo, qué pregunta, cómo da seguimiento y cómo cierra. Si eso vive en la cabeza de una sola persona, no tienes proceso: tienes suerte.",
    skipLabel: "Si te lo saltas",
    skip: "Pagas por prospectos que se enfrían esperando respuesta.",
    proof: {
      label: "Caso clínica dental",
      text: "El cuello de botella no era el tráfico: era el tiempo de respuesta.",
      href: "/casos/clinica-dental",
    },
  },
  {
    n: "04",
    name: "Automatización / IA",
    word: "Escala",
    analogy: "Es el motor: multiplica lo que ya camina.",
    body: "CRM, automatización y agentes de IA para que el sistema atienda, califique, agende y dé seguimiento sin ti. Si lo que hay está roto, la IA solo lo rompe más rápido.",
    skipLabel: "Si la metes antes de tiempo",
    skip: "Automatizas el desorden y lo pagas dos veces.",
    proof: {
      label: "Ingeniak",
      text: "+73 sistemas implementados desde 2022.",
    },
  },
];

/** Lo que implementa Ingeniak en la fase 04 (publicado en ingeniak.mx). */
export const AI_BUILDS = [
  { code: "IA-01", text: "Agentes de IA en WhatsApp Business, Instagram DM, Messenger y email" },
  { code: "IA-02", text: "CRM con Kommo y GoHighLevel" },
  { code: "IA-03", text: "Automatización de procesos con n8n" },
  { code: "IA-04", text: "Modelos de lenguaje aplicados a tu operación: GPT, Claude y Gemini" },
] as const;

/** Señales para saber si ya toca la fase 04. */
export const AI_READINESS = {
  notYet: [
    "No tienes claro quién es tu cliente ideal ni por qué te compra.",
    "Tu proceso de venta vive en la cabeza de una persona.",
    "Los prospectos no llegan de forma constante.",
  ],
  ready: [
    "Te llegan prospectos y no alcanzas a contestar a tiempo.",
    "Tu equipo repite las mismas tareas todos los días.",
    "Tienes un proceso que funciona y quieres que corra sin ti.",
  ],
} as const;

/** Una cita de Rik por paso del Sistema Radikal (mensajes-ancla, spec §3.3). */
export const STEP_QUOTES = [QUOTES.leo, QUOTES.software, QUOTES.marca, QUOTES.tiempo, QUOTES.horas] as const;

/** Para quién es / para quién no es (spec §2.1 y §2.5, sin tono ofensivo). */
export const FOR_WHOM = {
  yes: [
    "Ya vendes y tienes equipo, pero todo sigue pasando por ti.",
    "Ya inviertes en marketing y no sabes qué parte está funcionando.",
    "Te vendieron piezas sueltas —un logo, una pauta, un CRM— y no se hablan entre sí.",
    "Quieres meter IA en tu empresa con estrategia, no por moda.",
    "Sabes que no tienes que ser experto en todo y estás listo para delegar al correcto.",
  ],
  no: [
    "Si buscas lo más barato, este no es tu lugar y está bien.",
    "Si quieres a alguien que solo ejecute pautas sin preguntar, hay quien lo hace. Yo primero diagnostico.",
    "Si prefieres que todo se siga haciendo como siempre, ninguna herramienta te va a ayudar. Yo tampoco.",
    "Si tu negocio ya está donde quieres y no te interesa cambiar cómo opera, lo respeto.",
    "Si esperas resultados garantizados en semanas, nadie honesto te los va a prometer.",
  ],
} as const;
