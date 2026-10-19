"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { discoverySessionHref } from "@/lib/site";
import { scrollIfSamePage } from "@/lib/booking-link";
import { track } from "@/lib/analytics";
import { useMagnetic } from "./motion";
import { Arrow, btn } from "./ui";

/** CTA de la Discovery Session. Lleva a /discovery con la sección de origen; dentro de esa página baja al formulario. Efecto magnético. */
export function DiscoverySessionButton({
  section,
  label = "Agenda tu Discovery Session",
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
      href={discoverySessionHref(section)}
      className={clsx(btn[variant], className)}
      onClick={(e) => {
        track("cta_discovery_click", { section });
        scrollIfSamePage(e, discoverySessionHref(section));
      }}
    >
      {label}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </motion.a>
  );
}
