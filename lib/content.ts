/**
 * Contenido compartido del sitio. Reglas de voz: spec §3 (sin lenguaje de gurú,
 * sin hype, sin la palabra prohibida, sin emojis, máx. un signo de exclamación).
 * Cifras: solo las de spec §1.7 o las que Rik confirmó (14 años en marketing).
 */

import { SITE } from "./site";

export const AUTHORITY = [
  { k: "14", label: "Años en marketing" },
  { k: "#1", label: "Nacional en ventas (origen)" },
  { k: "7", label: "Países donde opera Ingeniak" },
  { k: "+73", label: "Sistemas implementados · Ingeniak" },
] as const;

export const PROOF_LINE = [
  "Casos con hasta 300% en ventas",
  "Clientes que dejaron de licitar",
  "15–20 h/semana recuperadas",
] as const;

/**
 * Empresas con las que Rik ha colaborado (confirmado por Rik).
 * `logo`: archivo y tamaño intrínseco (fuente única); cada componente define solo su clase de alto.
 */
export const CLIENTS = [
  { name: "Coca-Cola", slug: "cocacola", logo: { src: "/clients/cocacola.svg", w: 80, h: 80 } },
  { name: "Nike", slug: "nike", logo: { src: "/clients/nike.svg", w: 56, h: 56 } },
  { name: "BMW", slug: "bmw", logo: { src: "/clients/bmw.svg", w: 48, h: 48 } },
  { name: "Cemex", slug: "cemex", logo: { src: "/clients/cemex.svg", w: 150, h: 41 } },
  { name: "ARGI", slug: "argi", logo: { src: "/clients/argi.png", w: 130, h: 39 } },
  { name: "Tierra y Armonía", slug: "tierrayarmonia", logo: { src: "/clients/tierrayarmonia.svg", w: 110, h: 52 } },
] as const;

export type ClientSlug = (typeof CLIENTS)[number]["slug"];

export const ORDER = [
  { n: "01", name: "Branding", verb: "te da dirección", word: "Dirección" },
  { n: "02", name: "Marketing", verb: "te trae tráfico", word: "Tráfico" },
  { n: "03", name: "Ventas", verb: "te hace convertir", word: "Conversión" },
  { n: "04", name: "Automatización / IA", verb: "te hace escalar", word: "Escala" },
] as const;

export const PAINS = [
  {
    title: "Eres el cuello de botella.",
    body: "Nada avanza si no pasa por ti. Cada decisión, cada cotización, cada incendio.",
  },
  {
    title: "Compraste herramientas, no sistema.",
    body: "CRM que nadie usa, pautas sin proceso, IA sin estrategia. Piezas sueltas que no se hablan.",
  },
  {
    title: "Solo ves un camino.",
    body: "Tráfico, logo o promocionar. El marketing tiene 50 caminos y te enseñaron uno.",
  },
] as const;

export const AI_CAPABILITIES = [
  {
    code: "IA-01",
    title: "Agentes de IA que venden y atienden",
    body: "Responden en segundos por WhatsApp, web o Instagram, califican al prospecto y agendan. Tu equipo entra cuando ya hay interés real.",
  },
  {
    code: "IA-02",
    title: "Automatización de procesos",
    body: "Las tareas repetitivas que hoy hace tu equipo a mano —seguimientos, reportes, captura— corren solas.",
  },
  {
    code: "IA-03",
    title: "CRM con inteligencia",
    body: "Pipeline limpio, seguimiento automático y alertas. Ningún prospecto se queda en el aire por falta de tiempo.",
  },
  {
    code: "IA-04",
    title: "Contenido con IA y tu esencia",
    body: "Producción visual y de copy a escala sin perder tu voz. La IA acelera; tu marca decide.",
  },
  {
    code: "IA-05",
    title: "Datos para decidir",
    body: "Dashboards que te dicen dónde se fuga el dinero y qué mover primero. Decisiones con números, no con corazonadas.",
  },
  {
    code: "IA-06",
    title: "Tu equipo operando IA",
    body: "Capacito a tu gente para usar las herramientas con criterio. Que dependan del sistema, no de mí.",
  },
] as const;

export const METHOD = [
  {
    n: "01",
    name: "Diagnóstico de Verdad Cruda",
    line: "Inmersión en operación, finanzas, marketing y ventas.",
    body: "Mapa completo de fracturas y cuellos de botella. Lo que nadie te ha dicho porque nadie lo ha mirado completo.",
    deliverable: "Mapa de fracturas y prioridades",
  },
  {
    n: "02",
    name: "Arquitectura del Motor",
    line: "El plano de cómo se conecta todo.",
    body: "Branding, mensaje, marketing, proceso comercial y tecnología diseñados como un solo motor, en el orden correcto.",
    deliverable: "Blueprint del sistema",
  },
  {
    n: "03",
    name: "Construcción de Activos",
    line: "Marca que atrae, embudos que califican, ventas que cierran.",
    body: "Cada pieza se diseña para operar en conjunto. Nada suelto, nada por moda.",
    deliverable: "Activos de marca, marketing y ventas",
  },
  {
    n: "04",
    name: "Automatización Radikal",
    line: "CRM, automatización e IA conectando todo.",
    body: "El sistema nutre, agenda, da seguimiento y gestiona sin que tú estés encima. Aquí entra la IA: cuando ya hay algo que escalar.",
    deliverable: "Agentes, automatizaciones y CRM operando",
  },
  {
    n: "05",
    name: "Escalamiento Visionario",
    line: "Medir, optimizar, escalar.",
    body: "El negocio funciona sin ti y crece más rápido. Tú vuelves a dirigir, no a apagar incendios.",
    deliverable: "Dashboard y plan de escala",
  },
] as const;

export const SERVICES = [
  {
    id: "power-session",
    featured: true,
    eyebrow: "Diagnóstico 1:1",
    name: "Power Session",
    body: "90 minutos 1:1 conmigo. Audito tu prospección, ventas y automatización, y sales con un diagnóstico claro y los tres movimientos que tienes que hacer.",
    meta: `${SITE.powerSessionPrice} · Solo 4 sesiones por semana`,
    cta: "Agendar Power Session",
    href: null,
  },
  {
    id: "consultoria",
    featured: false,
    eyebrow: "Estrategia",
    name: "Consultoría estratégica integral en IA",
    body: "Diagnóstico del negocio completo y plan de acción en el orden correcto: qué automatizar, qué agente construir y qué no tocar todavía. Para el dueño que quiere el mapa antes de invertir un peso más.",
    meta: "Inversión según diagnóstico",
    cta: "Ve cómo funciona la consultoría",
    href: "/trabajar-conmigo",
  },
  {
    id: "growth-partner",
    featured: false,
    eyebrow: "Implementación",
    name: "Growth Partner",
    body: "Yo diseño la arquitectura; mi equipo en Ingeniak construye branding, marketing, ventas, CRM, automatización e IA. Para negocios listos para ejecutar.",
    meta: "Ejecución de principio a fin vía Ingeniak",
    cta: "Ve cómo funciona el Growth Partner",
    href: "/trabajar-conmigo",
  },
] as const;

export const METRICS = [
  { value: 300, prefix: "", suffix: "%", label: "Crecimiento en ventas en menos de 6 meses", note: "Caso con mayor crecimiento" },
  { value: 20, prefix: "15–", suffix: " h", label: "Recuperadas por semana por el dueño", note: "Promedio de clientes" },
  { value: 0, prefix: "", suffix: "", label: "Licitaciones: ahora los buscan a ellos", note: "Caso Argi" },
] as const;

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  problem: string;
  result: string;
  resultLabel: string;
  before: string;
  diagnosis: string;
  after: string;
  built: string[];
  lesson: string;
  /** Fecha ISO de publicación del caso en el sitio (Article JSON-LD). */
  publishedAt: string;
  pending?: boolean;
};

/** Casos (spec §6.8 y §7.4). Rik completará métricas exactas: no se inventan cifras. */
export const CASES: CaseStudy[] = [
  {
    slug: "argi",
    client: "Argi",
    industry: "Ingeniería industrial",
    problem: "Licitaba cada proyecto y competía por precio.",
    result: "0",
    resultLabel: "licitaciones · ahora los buscan",
    before: "Licitaba cada proyecto y competía por precio contra quien cobrara menos.",
    diagnosis: "Marca sin dirección y cero sistema de prospección. Vendían capacidad técnica, no autoridad.",
    after: "Posicionamiento de autoridad y sistema B2B de outreach. Dejó de licitar: ahora los buscan.",
    built: [
      "Branding: posicionamiento de autoridad técnica",
      "Marketing: mensaje B2B para tomadores de decisión",
      "Ventas: sistema de outreach y seguimiento",
      "Automatización: pipeline y nutrición en CRM",
    ],
    lesson: "Cuando tu marca comunica autoridad, el precio deja de ser la conversación.",
    publishedAt: "2026-10-15",
  },
  {
    slug: "clinica-dental",
    client: "Clínica dental",
    industry: "Salud",
    problem: "Los pacientes escribían y nadie contestaba a tiempo.",
    result: "12 seg",
    resultLabel: "tiempo de respuesta (antes 8 min)",
    before: "Respuesta promedio de 8 minutos. En ese tiempo el paciente ya había escrito a otra clínica.",
    diagnosis: "El problema no era el tráfico: era la conversión. Leads pagados que se enfriaban en el inbox.",
    after: "Agente de IA en WhatsApp conectado al CRM que responde, califica y agenda. De 8 minutos a 12 segundos.",
    built: [
      "Ventas: guion de calificación y agenda",
      "Automatización / IA: agente de WhatsApp conectado al CRM",
      "Datos: tablero de respuesta y citas",
    ],
    lesson: "La IA no te trae más pacientes: evita que pierdas los que ya pagaste.",
    publishedAt: "2026-10-15",
  },
  {
    slug: "clinica-estetica",
    client: "Clínica estética",
    industry: "Salud y belleza",
    problem: "Mucho esfuerzo por clientes de ticket bajo.",
    result: "Premium",
    resultLabel: "arquitectura de marca y pricing",
    before: "Competía por descuentos y atraía cazadores de ofertas. Mismo esfuerzo, ticket bajo.",
    diagnosis: "Marca y precios diseñados para el cliente equivocado.",
    after: "Arquitectura de marca y pricing para atraer al cliente premium: el mismo esfuerzo por el pez gordo.",
    built: [
      "Branding: arquitectura de marca premium",
      "Marketing: mensaje para el cliente de alto valor",
      "Ventas: estructura de precios y paquetes",
    ],
    lesson: "Cobrar más empieza por decidir a quién le hablas.",
    publishedAt: "2026-10-15",
  },
];

export const STACK = [
  {
    group: "Modelos de IA",
    items: [
      { name: "ChatGPT", icon: null },
      { name: "Claude", icon: "claude" },
      { name: "Gemini", icon: "googlegemini" },
      { name: "Perplexity", icon: "perplexity" },
    ],
  },
  {
    group: "Agentes y automatización",
    items: [
      { name: "n8n", icon: "n8n" },
      { name: "Make", icon: "make" },
      { name: "Zapier", icon: "zapier" },
      { name: "WhatsApp Business API", icon: "whatsapp" },
    ],
  },
  {
    group: "CRM y ventas",
    items: [
      { name: "Kommo", icon: null },
      { name: "GoHighLevel", icon: null },
      { name: "HubSpot", icon: "hubspot" },
      { name: "Meta Ads", icon: "meta" },
    ],
  },
  {
    group: "Creatividad y voz con IA",
    items: [
      { name: "Higgsfield", icon: null },
      { name: "Magnific", icon: "freepik" },
      { name: "ElevenLabs", icon: "elevenlabs" },
      { name: "Vapi", icon: null },
    ],
  },
  {
    group: "Datos y producto",
    items: [
      { name: "Supabase", icon: "supabase" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Metabase", icon: "metabase" },
      { name: "Google Analytics", icon: "googleanalytics" },
    ],
  },
] as const;

/** Cifras publicadas por Ingeniak en ingeniak.mx (oct 2026). */
export const INGENIAK_STATS = [
  { k: "+73", label: "Sistemas implementados" },
  { k: "2022", label: "Año de fundación" },
  { k: "7", label: "Países donde opera" },
] as const;

export const MANIFESTO = [
  "Creemos que el dueño de negocio no debería ser su empleado más caro.",
  "Creemos en la verdad cruda antes que en la comodidad.",
  "Creemos en dar de más antes de vender.",
  "Creemos en el orden: dirección, tráfico, conversión, escala.",
  "Creemos que renuevas o mueres.",
] as const;

export const FAQ_HOME = [
  {
    q: "Ya probé agencias y no funcionó.",
    a: "Por eso empiezo con diagnóstico, no con propuesta. Si lo que tienes sirve, te lo digo y no te vendo nada.",
  },
  {
    q: "¿Qué hace exactamente un consultor de IA para empresas?",
    a: "Decido dónde la inteligencia artificial sí te hace ganar dinero o tiempo y dónde todavía no. Diagnostico tu proceso comercial, diseño la arquitectura (agentes, automatizaciones, CRM) y mi equipo en Ingeniak la implementa. La IA entra cuando hay algo que escalar, no antes.",
  },
  {
    q: "No tengo tiempo para contenido ni quiero salir en cámara.",
    a: "Un sistema no depende de que seas creador de contenido. Depende de que tu negocio atraiga, convierta y retenga sin ti.",
  },
  {
    q: "Quiero resultados el primer mes.",
    a: "Métricas operativas en 30 días: tiempo de respuesta, pipeline limpio, leads capturados. Crecimiento real en meses, no años. Quien te prometa otra cosa no tiene método.",
  },
  {
    q: "Alguien cobra más barato.",
    a: "Seguro. Caro es seguir comprando piezas sueltas que no conectan.",
  },
  {
    q: "La IA ya me falló.",
    a: "Porque la metieron antes de tiempo. La IA escala lo que ya funciona; no tapa lo que aún no construyes.",
  },
  {
    q: "¿Trabajas solo o tienes equipo?",
    a: "Yo entro en estrategia, diagnóstico y arquitectura. Ingeniak, mi estudio, ejecuta. Tienes contacto directo conmigo, no con un ejecutivo de cuenta.",
  },
] as const;

export const QUOTES = {
  software: "El software es la última pieza, no la primera.",
  ia: "La IA es para escalar lo que ya funciona, no para tapar lo que aún no construyes.",
  horas: "Trabajar 12 horas al día no es una medalla de honor, es un error de diseño.",
  renueva: "Renuevas o mueres.",
  marca: "Tu marca no es tu logo, es tu personalidad.",
  tiempo: "O pagas con tiempo, o pagas con dinero.",
  leo: "No vendo marketing, leo tu negocio completo.",
} as const;

export const COUNTRIES = ["México", "USA", "Colombia", "Perú", "Argentina", "Chile", "España"] as const;
