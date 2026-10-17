import "server-only";
import { getToken, startAuthorization } from "@vercel/connect";

/**
 * Conectores de Vercel Connect ligados al proyecto. Google y Stripe usan OAuth propio: el permiso se
 * guarda a nombre de un "usuario" fijo de la app (Rik), que se autoriza una vez desde /admin/agenda.
 */
export const CONNECTORS = {
  google: "google/riklanderos-web",
  stripe: "stripe/riklanderos-web",
} as const;
export type ConnectorKey = keyof typeof CONNECTORS;

const OWNER = { type: "user" as const, id: "rik" };

export const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/calendar"];

export class AgendaConfigError extends Error {}

export async function connectorToken(key: ConnectorKey): Promise<string> {
  try {
    return await getToken(CONNECTORS[key], {
      subject: OWNER,
      ...(key === "google" ? { scopes: GOOGLE_SCOPES } : {}),
    });
  } catch (e) {
    throw new AgendaConfigError(`Conector ${key} sin autorizar: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function connectorAuthUrl(key: ConnectorKey, callbackUrl: string): Promise<string> {
  const res = await startAuthorization(
    CONNECTORS[key],
    { subject: OWNER, ...(key === "google" ? { scopes: GOOGLE_SCOPES } : {}) },
    { callbackUrl, prompt: key === "google" ? "consent" : undefined },
  );
  return res.url;
}

/**
 * La administración solo responde en las URLs internas de Vercel (riklanderos-<hash>-ingeniak.vercel.app y el alias fijo),
 * que Vercel protege con inicio de sesión del equipo. En los dominios públicos no existe.
 */
export function isAdminHost(host: string | null): boolean {
  if (!host) return false;
  if (process.env.NODE_ENV !== "production") return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  // URL de cada despliegue y alias fijo del proyecto (riklanderos-web-ingeniak.vercel.app): ambos piden login de Vercel.
  return /^riklanderos-[a-z0-9]{9}-ingeniak\.vercel\.app$/.test(host) || /^riklanderos-web-(git-main-)?ingeniak\.vercel\.app$/.test(host);
}
