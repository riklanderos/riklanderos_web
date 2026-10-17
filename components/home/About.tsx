import Link from "next/link";
import type { ReactNode } from "react";
import { BACKDROP_TOP_PAD } from "@/lib/backdrop";
import { Backdrop } from "../Backdrop";
import { CountUp, Parallax, Reveal, SplitWords, Stagger, StaggerItem } from "../motion";
import { Arrow, Eyebrow, btn } from "../ui";

const FACTS: { key: string; value: ReactNode; label: string }[] = [
  { key: "17", value: <CountUp to={17} />, label: "Años tenía cuando empecé a vender" },
  {
    key: "1",
    value: (
      <>
        <span className="text-accent">#</span>1
      </>
    ),
    label: "Nacional en ventas en una financiera",
  },
  { key: "14", value: <CountUp to={14} />, label: "Años en marketing" },
  { key: "2022", value: "2022", label: "Año en que fundé Ingeniak" },
];

/**
 * 04 · Quién soy. El retrato en blanco y negro es el fondo del lado izquierdo y se funde con el negro;
 * el texto va a la derecha (en móvil, la foto arriba y el texto sobre su fundido).
 */
export function About() {
  return (
    <section className="section relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center" aria-labelledby="quien">
      <div aria-hidden className="bg-dots mask-fade-y absolute inset-0 -z-20 opacity-40" />
      <Backdrop
        src="/img/rik-bw.webp"
        alt="Retrato en blanco y negro de Rik Landeros"
        side="left"
        width="52%"
        focus="50% 18%"
        focusLg="50% 30%"
        sizes="(min-width: 1024px) 52vw, 100vw"
      />

      {/* Sello flotante sobre el retrato (solo desktop: en móvil caía sobre el cuello) */}
      <Parallax
        distance={36}
        className="absolute right-4 hidden lg:block top-[calc(min(112vw,620px)-13rem)] z-10 sm:right-8 lg:bottom-[14%] lg:left-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] lg:right-auto lg:top-auto"
      >
        <Reveal delay={0.4} className="rounded-[10px] border border-line-strong bg-bg/75 px-5 py-4 backdrop-blur-md">
          <p className="t-brush text-3xl text-accent">Arquitecto</p>
          <p className="t-mono -mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">de sistemas</p>
        </Reveal>
      </Parallax>

      <div className={`container-x relative w-full ${BACKDROP_TOP_PAD}`}>
        <div className="lg:ml-auto lg:w-[54%] lg:pl-6">
          <Reveal>
            <Eyebrow index="04">Rik Landeros</Eyebrow>
          </Reveal>
          <SplitWords
            id="quien"
            as="h2"
            className="t-h2 mt-6"
            text="No soy experto en una pieza. Veo el tablero completo."
            accentWords={["tablero", "completo"]}
          />
          <Reveal className="mt-8 space-y-5 text-muted" delay={0.1}>
            <p>
              Empecé vendiendo a los 17. Fui #1 en ventas a nivel nacional. Monté una agencia creyendo que sabía de
              marketing y quebré por no entender la estrategia detrás. Vendí mi camioneta, empecé de cero en Guadalajara y
              reconstruí todo con una convicción: el negocio no se arregla con una herramienta, se arregla con estrategia y
              sistemas.
            </p>
            <p className="text-fg">
              Hoy llevo 14 años en marketing y soy consultor de IA para empresas. En 2022 fundé Ingeniak para implementar
              IA en negocios que ya venden. Te ahorro el golpe que yo me di.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line" stagger={0.08}>
            {FACTS.map((f) => (
              <StaggerItem key={f.key} className="bg-bg/90 p-5 backdrop-blur-sm">
                <p className="font-display text-3xl font-extrabold tracking-tight">{f.value}</p>
                <p className="t-mono mt-1 text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">{f.label}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-10" delay={0.2}>
            <Link href="/historia" className={btn.text}>
              Leer mi historia completa
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
