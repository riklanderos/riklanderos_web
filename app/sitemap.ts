import type { MetadataRoute } from "next";
import { CASES } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/metodo",
    "/power-session",
    "/agendar",
    "/discovery",
    "/trabajar-conmigo",
    "/casos",
    "/historia",
    "/radikales",
    "/recursos",
    "/contacto",
    "/privacidad",
    "/terminos",
  ];
  return [
    ...routes.map((r) => ({
      url: `${SITE.url}${r}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : r === "/power-session" || r === "/discovery" || r === "/agendar" ? 0.9 : 0.7,
    })),
    ...CASES.map((c) => ({ url: `${SITE.url}/casos/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
