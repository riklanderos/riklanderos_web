/**
 * Contenido de /trabajar-conmigo (spec §7.3).
 * Sin precios de Consultoría ni de Growth Partner (spec §1.8). La única tarifa
 * pública del sitio es la Power Session. Sin cifras fuera de spec §1.7 / ingeniak.mx.
 */

import { SITE } from "@/lib/site";

export const OFFERS = [
  {
    id: "consultoria",
    code: "A",
    eyebrow: "Estrategia",
    name: "Consultoría estratégica integral en IA",
    pitch: "Para el dueño que quiere el mapa completo antes de invertir un peso más.",
    body: "Leo tu negocio completo, te digo qué lo está frenando de verdad y diseño el plan en el orden correcto: qué automatizar, qué agente construir y qué no tocar todavía.",
    includes: [
      {
        k: "Diagnóstico completo",
        v: "Operación, finanzas, marketing y ventas. Mapa de fracturas y cuellos de botella.",
      },
      {
        k: "Plan de acción",
        v: "Prioridades en el orden correcto: lo que conviene hacer ahora y lo que puede esperar.",
      },
      {
        k: "Acompañamiento",
        v: "Sesiones conmigo mientras tu equipo ejecuta, para que el plan no se quede en un PDF.",
      },
    ],
    executes: "Tu equipo, con mi criterio encima.",
  },
  {
    id: "growth-partner",
    code: "B",
    eyebrow: "Implementación vía Ingeniak",
    name: "Growth Partner",
    pitch: "Para el negocio que ya decidió crecer y necesita que alguien lo construya completo.",
    body: "Yo diseño la arquitectura y dirijo la obra. Mi equipo en Ingeniak la construye de punta a punta, pieza por pieza y en el orden correcto.",
    includes: [
      {
        k: "Branding",
        v: "Posicionamiento y mensaje que comunican lo que vales.",
      },
      {
        k: "Marketing",
        v: "Contenido, campañas y embudos que atraen al cliente correcto.",
      },
      { k: "Ventas", v: "Proceso comercial y seguimiento que cierran." },
      { k: "CRM", v: "Kommo o GoHighLevel armado a tu proceso, no al revés." },
      {
        k: "Automatización",
        v: "Flujos en n8n que hacen el trabajo repetitivo.",
      },
      {
        k: "Agentes de IA",
        v: "WhatsApp, Instagram, Messenger y email atendiendo y calificando.",
      },
      { k: "Dashboards", v: "Números claros para decidir qué mover primero." },
    ],
    executes: "Ingeniak, con mi arquitectura y mi dirección.",
  },
] as const;

/** Celda de la tabla comparativa. `full` = incluido; `plan` = lo diseño yo, lo ejecuta tu equipo; `text` = dato sin marca. */
export type CompareCell = { kind: "full" | "plan" | "text"; text: string };
export type CompareRow = { feature: string; cells: [CompareCell, CompareCell] };

export const COMPARE_COLUMNS = [
  {
    id: "consultoria",
    label: "Consultoría estratégica integral en IA",
    short: "Consultoría",
  },
  { id: "growth-partner", label: "Growth Partner", short: "Growth Partner" },
] as const;

export const COMPARE_ROWS: CompareRow[] = [
  {
    feature: "Diagnóstico como punto de partida",
    cells: [
      { kind: "full", text: "Power o Discovery Session" },
      { kind: "full", text: "Power o Discovery Session" },
    ],
  },
  {
    feature: "Diagnóstico de verdad cruda del negocio completo",
    cells: [
      { kind: "full", text: "Operación, finanzas, marketing y ventas" },
      { kind: "full", text: "Operación, finanzas, marketing y ventas" },
    ],
  },
  {
    feature: "Arquitectura del sistema (blueprint)",
    cells: [
      { kind: "full", text: "Cómo se conecta todo, en el orden correcto" },
      { kind: "full", text: "Cómo se conecta todo, en el orden correcto" },
    ],
  },
  {
    feature: "Plan de acción priorizado",
    cells: [
      { kind: "full", text: "Qué hacer ahora y qué puede esperar" },
      { kind: "full", text: "Qué hacer ahora y qué puede esperar" },
    ],
  },
  {
    feature: "Acompañamiento estratégico conmigo",
    cells: [
      { kind: "full", text: "Sesiones de seguimiento" },
      { kind: "full", text: "Dirección de toda la implementación" },
    ],
  },
  {
    feature: "Branding y mensaje",
    cells: [
      { kind: "plan", text: "Dirección y criterios" },
      { kind: "full", text: "Construcción completa" },
    ],
  },
  {
    feature: "Marketing y embudos",
    cells: [
      { kind: "plan", text: "Plan y prioridades" },
      { kind: "full", text: "Implementación" },
    ],
  },
  {
    feature: "Proceso de ventas y CRM (Kommo o GoHighLevel)",
    cells: [
      { kind: "plan", text: "Diseño del proceso" },
      { kind: "full", text: "Implementación y configuración" },
    ],
  },
  {
    feature: "Automatización con n8n",
    cells: [
      { kind: "plan", text: "Qué automatizar y en qué orden" },
      { kind: "full", text: "Construcción de los flujos" },
    ],
  },
  {
    feature: "Agentes de IA (WhatsApp, Instagram, Messenger, email)",
    cells: [
      { kind: "plan", text: "Qué agente construir y para qué" },
      { kind: "full", text: "Construcción e integración" },
    ],
  },
  {
    feature: "Dashboards y medición",
    cells: [
      { kind: "plan", text: "Qué medir y cada cuánto" },
      { kind: "full", text: "Dashboard operando" },
    ],
  },
  {
    feature: "Quién ejecuta",
    cells: [
      { kind: "text", text: "Tu equipo, con mi criterio encima" },
      { kind: "text", text: "Ingeniak, bajo mi arquitectura" },
    ],
  },
  {
    feature: "Inversión",
    cells: [
      { kind: "text", text: "Se define después del diagnóstico" },
      { kind: "text", text: "Se define después del diagnóstico" },
    ],
  },
];

export const AI_DO = [
  "Diagnostico tu proceso comercial antes de tocar cualquier herramienta.",
  "Diseño la arquitectura: qué agente, qué automatización, qué CRM y en qué orden.",
  "Elijo el modelo y la herramienta según tu nivel, tu equipo y tu presupuesto.",
  "Mido lo que importa: tiempo de respuesta, pipeline y horas recuperadas.",
] as const;

export const AI_DONT = [
  "Venderte la herramienta de moda porque está de moda.",
  "Poner un chatbot encima de un proceso roto.",
  "Prometerte que la IA arregla lo que todavía no construyes.",
] as const;

/** Flujo de un sistema de atención con IA (especialidades publicadas por Ingeniak). */
export const AI_PIPELINE = [
  {
    n: "01",
    title: "Entra el mensaje",
    tools: ["WhatsApp", "Instagram DM", "Messenger", "Email"],
  },
  { n: "02", title: "El agente responde", tools: ["GPT", "Claude", "Gemini"] },
  { n: "03", title: "Califica y registra", tools: ["Kommo", "GoHighLevel"] },
  { n: "04", title: "Automatiza el seguimiento", tools: ["n8n"] },
  { n: "05", title: "Tu equipo cierra", tools: ["Con contexto", "Con datos"] },
] as const;

/** Especialidades publicadas en ingeniak.mx. */
export const INGENIAK_SPECIALTIES = [
  "Agentes de IA para WhatsApp Business",
  "CRM con Kommo y GoHighLevel",
  "Automatización con n8n",
  "Implementación de LLMs: GPT, Claude, Gemini",
] as const;

export const FAQ_TRABAJAR = [
  {
    q: "¿Cuánto cuesta la consultoría o el Growth Partner?",
    a: `Depende de lo que encuentre en el diagnóstico: el nivel de tu negocio, los recursos con los que cuentas y tu objetivo real. Por eso no publico precio de lista. Lo único con precio público es la Power Session: ${SITE.powerSessionPrice}.`,
  },
  {
    q: "¿Puedo contratar el Growth Partner sin un diagnóstico previo?",
    a: "No. No trabajo con nadie sin diagnosticar primero: implementar sin entender tu negocio es venderte otra pieza suelta, y las piezas sueltas no hacen un motor. El diagnóstico puede ser la Power Session (90 min 1:1 conmigo) o la Discovery Session (30 min, sin costo, conmigo y mi equipo).",
  },
  {
    q: "¿Qué diferencia hay entre la consultoría y el Growth Partner?",
    a: "En la consultoría te entrego el diagnóstico y el plan, y te acompaño mientras tu equipo ejecuta. En el Growth Partner, además, mi equipo en Ingeniak construye todo: branding, marketing, ventas, CRM, automatización, agentes de IA y dashboards.",
  },
  {
    q: "Ya tengo CRM, agencia o equipo interno. ¿Sirve de algo?",
    a: "Sí. En el diagnóstico reviso qué funciona y qué no. Lo que sirve se queda. El trabajo es conectar las piezas, no reemplazarlas por moda.",
  },
  {
    q: "La IA ya me falló.",
    a: "Porque la metieron antes de tiempo. La IA escala lo que ya funciona; no tapa lo que aún no construyes. Por eso entra al final del orden, no al principio.",
  },
  {
    q: "¿Trabajas con empresas fuera de México?",
    a: "Sí. Ingeniak opera en México, USA, Colombia, Perú, Argentina, Chile y España. La Power Session es por Google Meet.",
  },
] as const;
