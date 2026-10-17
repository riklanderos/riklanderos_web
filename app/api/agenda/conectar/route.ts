import { NextResponse, type NextRequest } from "next/server";
import { connectorAuthUrl, isAdminHost, type ConnectorKey } from "@/lib/agenda/connect.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Solo administración: inicia la autorización de Google o Stripe y regresa a /admin/agenda. */
export async function GET(req: NextRequest) {
  const host = req.headers.get("host");
  if (!isAdminHost(host)) return new NextResponse("No encontrado", { status: 404 });
  const s = req.nextUrl.searchParams.get("servicio") as ConnectorKey | null;
  if (s !== "google" && s !== "stripe") return new NextResponse("Servicio inválido", { status: 400 });
  try {
    const url = await connectorAuthUrl(s, `https://${host}/admin/agenda?conectado=${s}`);
    return NextResponse.redirect(url);
  } catch (e) {
    return new NextResponse(`No se pudo iniciar la autorización: ${e instanceof Error ? e.message : String(e)}`, { status: 500 });
  }
}
