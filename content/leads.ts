/**
 * Opciones compartidas entre el formulario (components/LeadForm.tsx) y la API
 * (app/api/lead/route.ts). Módulo plano, sin "use client", para que el servidor
 * valide contra exactamente las mismas listas que ve el visitante.
 */

export const LEAD_SOURCES = ["radikales", "recurso", "contacto"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

/** Facturación mensual aproximada en MXN (lista de interés Radikales). */
export const REVENUE_RANGES = [
  { value: "lt-100k", label: "Menos de 100 mil MXN al mes" },
  { value: "100k-300k", label: "100 mil a 300 mil MXN al mes" },
  { value: "300k-1m", label: "300 mil a 1 millón MXN al mes" },
  { value: "1m-5m", label: "1 a 5 millones MXN al mes" },
  { value: "gt-5m", label: "Más de 5 millones MXN al mes" },
] as const;
export type RevenueRange = (typeof REVENUE_RANGES)[number]["value"];

/** Motivos del formulario de contacto (spec §7.8). */
export const CONTACT_REASONS = [
  { value: "prensa", label: "Prensa o entrevista" },
  { value: "conferencia", label: "Conferencia o evento" },
  { value: "podcast", label: "Podcast" },
  { value: "partnership", label: "Partnership o alianza" },
  { value: "otro", label: "Otro" },
] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number]["value"];

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

/** Nombre del campo trampa. Un humano nunca lo ve ni lo llena. */
export const HONEYPOT_FIELD = "website";

/** Límites de longitud: los mismos en cliente y servidor. */
export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 254 },
  phone: { max: 40 },
  business: { min: 2, max: 160 },
  stuck: { min: 10, max: 600 },
  message: { min: 20, max: 4000 },
} as const;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Teléfono opcional: dígitos, espacios, +, guiones, puntos y paréntesis; al menos 7 dígitos. */
export function isValidPhone(v: string) {
  return /^[0-9+().\-\s]+$/.test(v) && v.replace(/\D/g, "").length >= 7;
}
