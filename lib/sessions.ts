import { discoverySessionHref, powerSessionHref, SITE } from "./site";
import { VSL, type Vsl } from "./videos";

export type SessionKey = "power" | "discovery";

export type Session = {
  key: SessionKey;
  name: string;
  /** Rótulo corto encima del nombre. */
  kicker: string;
  /** Una línea: para quién es. */
  tagline: string;
  duration: string;
  price: string;
  priceNote: string;
  who: string;
  forYou: readonly string[];
  outcome: readonly string[];
  footnote: string;
  cta: string;
  /** Evento de analítica del clic. */
  event: "cta_powersession_click" | "cta_discovery_click";
  href: (section: string) => string;
  /** Página o sección donde se explica a fondo. */
  more: { href: string; label: string };
  video: Vsl;
};

/**
 * Las dos formas de empezar. Datos confirmados por Rik: Power Session 90 min 1:1, 297 USD, 4 por semana,
 * se abona completo si implementan, garantía 100 %. Discovery Session 30 min, sin costo, con Rik y su equipo.
 */
export const SESSIONS: Record<SessionKey, Session> = {
  power: {
    key: "power",
    name: "Power Session",
    kicker: "Diagnóstico 1:1",
    tagline: "Quieres claridad y un plan antes de invertir más.",
    duration: "90 min",
    price: SITE.powerSessionPrice,
    priceNote: "Pago único",
    who: "1:1 conmigo",
    forYou: [
      "Sientes que pierdes clientes y no sabes en qué parte de tu operación.",
      "Quieres un plan priorizado para ejecutarlo con tu equipo o con nosotros.",
      "Prefieres una auditoría a fondo antes de contratar cualquier implementación.",
    ],
    outcome: [
      "Mapa de fugas de tu operación, piso por piso",
      "Las 3 fugas que más dinero te cuestan",
      "Plan de 90 días con prioridades y responsables",
    ],
    footnote: "Se abona completo si implementas con Ingeniak · Garantía del 100 % · Solo 4 por semana",
    cta: "Agenda tu Power Session",
    event: "cta_powersession_click",
    href: powerSessionHref,
    more: { href: "/power-session", label: "Ver la Power Session" },
    video: VSL.powerSession,
  },
  discovery: {
    key: "discovery",
    name: "Discovery Session",
    kicker: "Implementación con Ingeniak",
    tagline: "Ya sabes que quieres un sistema que venda aunque no estés.",
    duration: "30 min",
    price: "Sin costo",
    priceNote: "Sin compromiso",
    who: "Conmigo y mi equipo",
    forYou: [
      "Tu empresa se detiene cuando tú no estás: respuestas, seguimiento y ventas.",
      "Quieres que alguien diseñe, implemente y opere el sistema por ti.",
      "Buscas agentes de IA, CRM y automatizaciones conectados entre sí.",
    ],
    outcome: [
      "Diagnóstico de tu operación actual",
      "Qué sistema necesitas: agentes, CRM y automatizaciones",
      "El siguiente paso para implementarlo con Ingeniak",
    ],
    footnote: "Agentes de IA para WhatsApp, CRM con Kommo o GoHighLevel y automatización con n8n",
    cta: "Agenda tu Discovery Session",
    event: "cta_discovery_click",
    href: discoverySessionHref,
    more: { href: "/trabajar-conmigo#trabajar-ingeniak", label: "Ver cómo trabaja Ingeniak" },
    video: VSL.discoverySession,
  },
};

export const SESSION_LIST = [SESSIONS.power, SESSIONS.discovery] as const;
