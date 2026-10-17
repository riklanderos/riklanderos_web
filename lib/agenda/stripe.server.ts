import "server-only";
import Stripe from "stripe";
import { connectorToken } from "./connect.server";

/** Cliente de Stripe con el permiso del conector (cuenta de Rik). Se crea por solicitud: el token rota. */
export async function stripeClient(): Promise<Stripe> {
  return new Stripe(await connectorToken("stripe"));
}
