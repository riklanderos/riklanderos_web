"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Rutas a pantalla completa, sin menú ni pie de página (el brief de la Power Session). */
const BARE = [/^\/brief\//];

/** Muestra el menú o el pie de página salvo en las rutas a pantalla completa. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname() ?? "";
  return BARE.some((r) => r.test(path)) ? null : <>{children}</>;
}
