"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { powerSessionHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { scrollIfSamePage } from "@/lib/booking-link";
import { useMagnetic } from "./motion";
import { Arrow, btn } from "./ui";

/** CTA principal del sitio. Lleva a /power-session con la sección de origen (spec §9.2); dentro de esa página baja al formulario. Efecto magnético. */
export function PowerSessionButton({
  section,
  label = "Agenda tu Power Session",
  variant = "primary",
  className,
}: {
  section: string;
  label?: string;
  variant?: "primary" | "ghost" | "dark";
  className?: string;
}) {
  const magnetic = useMagnetic<HTMLAnchorElement>();
  return (
    <motion.a
      {...magnetic}
      href={powerSessionHref(section)}
      className={clsx(btn[variant], className)}
      onClick={(e) => {
        track("cta_powersession_click", { section });
        scrollIfSamePage(e, powerSessionHref(section));
      }}
    >
      {label}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </motion.a>
  );
}
