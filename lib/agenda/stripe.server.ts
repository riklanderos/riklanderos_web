import "server-only";
import Stripe from "stripe";
import { AgendaConfigError } from "./connect.server";

/**
 * Cliente de Stripe con la llave secreta de la cuenta de Rik (variable STRIPE_SECRET_KEY en Vercel).
 * El conector de Vercel para Stripe solo da acceso al servidor MCP, no a la API de cobros.
 */
export function stripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new AgendaConfigError("Falta STRIPE_SECRET_KEY");
  return key;
}

export async function stripeClient(): Promise<Stripe> {
  return new Stripe(stripeKey());
}

export function stripeLive(): boolean {
  return /^(sk|rk)_live_/.test(stripeKey());
}
