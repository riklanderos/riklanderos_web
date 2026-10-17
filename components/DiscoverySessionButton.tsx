"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { discoverySessionHref } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useMagnetic } from "./motion";
import { Arrow, btn } from "./ui";

/** CTA de la Discovery Session de Ingeniak. Misma pestaña + UTMs por sección y efecto magnético, como la Power Session. */
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
      onClick={() => track("cta_discovery_click", { section })}
    >
      {label}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </motion.a>
  );
}
