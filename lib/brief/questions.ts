/**
 * Brief previo a la Power Session: los 7 pisos del VSL "La factura invisible" + la meta.
 * Compartido entre cliente y servidor. Cada piso abre con opciones de un toque y cierra con
 * una pregunta abierta que se contesta escribiendo o con audio. Todo es opcional salvo lo marcado.
 */

export type ChipsQ = { id: string; kind: "chips"; label: string; options: readonly string[]; multi?: boolean; max?: number };
export type ScaleQ = { id: string; kind: "scale"; label: string; low: string; high: string };
export type ShortQ = { id: string; kind: "short"; label: string; placeholder?: string; multiline?: boolean };
export type VoiceQ = { id: string; kind: "voice"; label: string; hint?: string; required?: boolean };
export type Question = ChipsQ | ScaleQ | ShortQ | VoiceQ;

export type Floor = {
  id: string;
  n: string;
  title: string;
  /** Lo que analizamos de este piso en la sesión. */
  kicker: string;
  questions: readonly Question[];
  /** Subida de archivos sugerida para este piso. */
  uploads?: { label: string; hint: string };
};

export const FLOORS: readonly Floor[] = [
  {
    id: "presencia",
    n: "01",
    title: "Presencia digital",
    kicker: "Lo que tu cliente ve de ti antes de escribirte.",
    questions: [
      {
        id: "presencia_canales",
        kind: "chips",
        label: "¿Dónde te encuentran hoy?",
        multi: true,
        options: ["Sitio web", "Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "Google Maps", "Marketplace", "Ninguno aún"],
      },
      { id: "presencia_nota", kind: "scale", label: "¿Qué tan bien te representa hoy tu presencia digital?", low: "Me da pena", high: "Me encanta" },
      { id: "presencia_links", kind: "short", label: "Pega tus links (sitio, redes)", placeholder: "riklanderos.tech, instagram.com/…", multiline: true },
      { id: "presencia_abierta", kind: "voice", label: "¿Qué crees que piensa un cliente nuevo cuando te busca por primera vez?" },
    ],
    uploads: { label: "Capturas de tu perfil o sitio", hint: "Opcional. Lo que quieras que vea antes de la sesión." },
  },
  {
    id: "contenido",
    n: "02",
    title: "Contenido",
    kicker: "¿Educa y vende… o solo llena el feed?",
    questions: [
      { id: "contenido_frecuencia", kind: "chips", label: "¿Cada cuánto publican?", options: ["No publicamos", "De vez en cuando", "1–2 por semana", "3 o más por semana", "Diario"] },
      { id: "contenido_quien", kind: "chips", label: "¿Quién lo hace?", options: ["Yo", "Alguien del equipo", "Agencia", "Freelance", "Nadie"] },
      {
        id: "contenido_formatos",
        kind: "chips",
        label: "Formatos que usan",
        multi: true,
        options: ["Reels / videos cortos", "Carruseles", "Historias", "En vivo", "YouTube", "Blog", "Email", "Podcast"],
      },
      { id: "contenido_abierta", kind: "voice", label: "¿Qué contenido te ha traído clientes de verdad? ¿Y cuál sientes que no sirve?" },
    ],
  },
  {
    id: "anuncios",
    n: "03",
    title: "Anuncios",
    kicker: "Qué creativos detienen el scroll y cuáles queman tu dinero.",
    questions: [
      { id: "anuncios_activo", kind: "chips", label: "¿Haces anuncios pagados?", options: ["Sí, siempre activos", "A veces", "Lo intenté y lo dejé", "Nunca"] },
      {
        id: "anuncios_plataformas",
        kind: "chips",
        label: "¿En qué plataformas?",
        multi: true,
        options: ["Meta (Facebook / Instagram)", "Google", "TikTok", "LinkedIn", "YouTube", "Otra"],
      },
      { id: "anuncios_quien", kind: "chips", label: "¿Quién los maneja?", options: ["Yo", "Alguien del equipo", "Agencia", "Freelance", "No aplica"] },
      { id: "anuncios_abierta", kind: "voice", label: "¿Cuál ha sido tu mejor anuncio y por qué crees que funcionó?" },
    ],
    uploads: { label: "Tus anuncios", hint: "Capturas o videos de tus mejores y peores anuncios. Es lo que más me sirve." },
  },
  {
    id: "pauta",
    n: "04",
    title: "Pauta",
    kicker: "Formatos, segmentación, costo por prospecto, atribución y remarketing.",
    questions: [
      {
        id: "pauta_inversion",
        kind: "chips",
        label: "Inversión mensual en anuncios",
        options: ["No invertimos", "Menos de $5K MXN", "$5K–$20K MXN", "$20K–$50K MXN", "$50K–$150K MXN", "Más de $150K MXN"],
      },
      { id: "pauta_cpl", kind: "chips", label: "¿Sabes cuánto te cuesta cada prospecto?", options: ["Sí, exacto", "Más o menos", "No"] },
      { id: "pauta_pixel", kind: "chips", label: "¿Tienes Pixel o API de conversiones instalado?", options: ["Sí", "No", "No sé qué es"] },
      { id: "pauta_remarketing", kind: "chips", label: "¿Haces remarketing (anuncios a quien ya te visitó)?", options: ["Sí", "No", "No sé"] },
      { id: "pauta_abierta", kind: "voice", label: "¿Qué te frustra de tu pauta hoy?" },
    ],
    uploads: { label: "Reportes de tus campañas", hint: "Capturas del Administrador de anuncios o Google Ads de los últimos 30–90 días." },
  },
  {
    id: "comercial",
    n: "05",
    title: "Proceso comercial",
    kicker: "Tiempo de respuesta, mensaje, seguimiento, conversión, CAC y LTV.",
    questions: [
      {
        id: "comercial_canales",
        kind: "chips",
        label: "¿Por dónde te llegan los prospectos?",
        multi: true,
        options: ["WhatsApp", "Llamadas", "Formularios", "Mensajes en redes", "Referidos", "Tienda o local", "Email"],
      },
      { id: "comercial_respuesta", kind: "chips", label: "¿En cuánto tiempo responden un mensaje nuevo?", options: ["Menos de 5 min", "Menos de 1 hora", "El mismo día", "Más de un día", "No lo sé"] },
      { id: "comercial_crm", kind: "chips", label: "¿Dónde registran a los prospectos?", options: ["Kommo", "GoHighLevel", "HubSpot", "Otro CRM", "Excel o Sheets", "En el WhatsApp", "En ningún lado"] },
      { id: "comercial_volumen", kind: "chips", label: "Prospectos al mes (aprox.)", options: ["Menos de 20", "20–100", "100–300", "300–1,000", "Más de 1,000", "No sé"] },
      { id: "comercial_metricas", kind: "chips", label: "¿Conoces tu CAC (costo por cliente) y tu LTV (valor de un cliente)?", options: ["Los dos", "Solo uno", "Ninguno"] },
      { id: "comercial_abierta", kind: "voice", label: "Cuéntame el camino desde que alguien te escribe hasta que te paga.", required: true },
    ],
    uploads: { label: "Tu proceso", hint: "Guiones de venta, cotizaciones o capturas de conversaciones (sin datos sensibles)." },
  },
  {
    id: "internos",
    n: "06",
    title: "Procesos internos",
    kicker: "Administración, facturación, reportes y tableros operativos.",
    questions: [
      {
        id: "internos_manual",
        kind: "chips",
        label: "¿Qué se hace todavía a mano?",
        multi: true,
        options: ["Cotizaciones", "Facturación", "Cobranza", "Reportes", "Inventario", "Agenda y citas", "Nómina", "Postventa"],
      },
      { id: "internos_tableros", kind: "chips", label: "¿Cómo ves los números de tu negocio?", options: ["Tablero en tiempo real", "Reporte mensual en Excel", "Le pregunto al contador", "No los veo"] },
      { id: "internos_horas", kind: "scale", label: "¿Cuánto de tu semana se va en operar en lugar de dirigir?", low: "Casi nada", high: "Casi todo" },
      { id: "internos_abierta", kind: "voice", label: "Si pudieras quitarte una tarea para siempre, ¿cuál sería?" },
    ],
  },
  {
    id: "competencia",
    n: "07",
    title: "Competencia",
    kicker: "Qué anuncian, cómo venden… y por dónde los puedes rebasar.",
    questions: [
      { id: "competencia_nombres", kind: "short", label: "Tus 1 a 3 competidores principales (nombre o link)", placeholder: "Uno por línea", multiline: true },
      {
        id: "competencia_ventaja",
        kind: "chips",
        label: "¿En qué te ganan hoy?",
        multi: true,
        options: ["Precio", "Marca", "Anuncios", "Rapidez", "Contenido", "Reseñas", "Ubicación", "No me ganan"],
      },
      { id: "competencia_abierta", kind: "voice", label: "¿Por qué te eligen a ti en lugar de ellos?" },
    ],
  },
];

export const GOAL = {
  id: "meta",
  n: "08",
  title: "Tu meta",
  kicker: "Para que los 90 minutos vayan directo a lo que más te importa.",
  questions: [
    {
      id: "meta_prioridad",
      kind: "chips",
      label: "Si solo pudieras resolver una cosa…",
      options: ["Más clientes", "Más margen", "Más tiempo libre", "Ordenar a mi equipo", "Escalar a otra ciudad o país"],
    },
    { id: "meta_90", kind: "voice", label: "Si en 90 días todo sale bien, ¿qué cambió en tu negocio?", required: true },
    { id: "meta_extra", kind: "short", label: "¿Algo más que deba saber antes de la sesión?", multiline: true },
  ],
} as const satisfies Floor;

export const STEPS: readonly Floor[] = [...FLOORS, GOAL];

/* ── Respuestas ─────────────────────────────────────────────── */

export type AudioRef = { path: string; seconds: number; mime: string };
export type VoiceAnswer = { text?: string; audio?: AudioRef };
export type FileRef = { path: string; name: string; size: number; mime: string };
export type AnswerValue = string | string[] | number | VoiceAnswer;
export type BriefAnswers = {
  values: Record<string, AnswerValue>;
  files: Record<string, FileRef[]>;
};

export const EMPTY_ANSWERS: BriefAnswers = { values: {}, files: {} };

export const MAX_AUDIO_SECONDS = 180;
export const MAX_FILE_MB = 50;
export const MAX_FILES_PER_FLOOR = 8;
export const ACCEPT_FILES = "image/*,video/mp4,video/quicktime,application/pdf,.xlsx,.xls,.csv,.docx,.doc,.pptx,.ppt,.txt";

/** Preguntas obligatorias que faltan (para el envío final). */
export function missingRequired(a: BriefAnswers): Question[] {
  const out: Question[] = [];
  for (const f of STEPS) {
    for (const q of f.questions) {
      if (q.kind !== "voice" || !q.required) continue;
      const v = a.values[q.id] as VoiceAnswer | undefined;
      if (!v || (!v.text?.trim() && !v.audio)) out.push(q);
    }
  }
  return out;
}

/** Avance 0–1: proporción de preguntas con alguna respuesta. */
export function progress(a: BriefAnswers): number {
  let total = 0;
  let done = 0;
  for (const f of STEPS) {
    for (const q of f.questions) {
      total++;
      const v = a.values[q.id];
      if (v === undefined || v === "") continue;
      if (Array.isArray(v) && !v.length) continue;
      if (typeof v === "object" && !Array.isArray(v) && !v.text?.trim() && !v.audio) continue;
      done++;
    }
  }
  return total ? done / total : 0;
}
