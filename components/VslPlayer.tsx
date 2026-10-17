"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { Vsl } from "@/lib/videos";

const MARKS = [25, 50, 75] as const;
/** La portada sigue encima al menos este tiempo tras el clic: un doble clic no cae en los controles nativos. */
const GUARD_MS = 450;

/**
 * Reproductor de VSL: portada (next/image) con botón de play encima del <video>. El video (preload="none",
 * sin poster propio para no bajar la portada dos veces) no se descarga hasta el clic, y play() se llama dentro
 * del clic para que iOS permita reproducir con sonido. La portada se retira cuando el video ya reproduce;
 * entonces aparecen los controles nativos y el foco pasa al video.
 * Mide play, avance (25/50/75 %) y fin con los mismos eventos de analítica del sitio.
 */
export function VslPlayer({
  video,
  sizes = "(min-width: 1024px) 48vw, 92vw",
  className,
}: {
  video: Vsl;
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const sent = useRef(new Set<number>());
  const clickAt = useRef(0);
  const [started, setStarted] = useState(false);
  const [live, setLive] = useState(false);

  // Al retirar la portada el botón enfocado desaparece: el foco pasa al video para seguir con teclado.
  useEffect(() => {
    if (live) ref.current?.focus({ preventScroll: true });
  }, [live]);

  const reveal = () => {
    const wait = Math.max(0, GUARD_MS - (performance.now() - clickAt.current));
    window.setTimeout(() => setLive(true), wait);
  };

  const start = () => {
    const v = ref.current;
    if (!v || started) return;
    clickAt.current = performance.now();
    setStarted(true);
    // Si el navegador lo bloquea, igual se retira la portada y quedan los controles para darle play a mano.
    v.play().then(reveal, reveal);
    track("video_play", { video: video.id });
  };

  const onTime = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    for (const m of MARKS) {
      if (pct >= m && !sent.current.has(m)) {
        sent.current.add(m);
        track("video_progress", { video: video.id, percent: m });
      }
    }
  };

  return (
    <div className={`relative aspect-video overflow-hidden rounded-[14px] border border-line bg-black ${className ?? ""}`}>
      <video
        ref={ref}
        src={video.src}
        poster={started ? video.poster : undefined}
        preload="none"
        playsInline
        controls={live}
        onTimeUpdate={onTime}
        onEnded={() => track("video_complete", { video: video.id })}
        aria-label={`${video.label}: ${video.title}`}
        className="absolute inset-0 h-full w-full focus-visible:outline-offset-[-3px]"
      />
      {!live ? (
        <button
          type="button"
          onClick={start}
          aria-busy={started || undefined}
          className="group absolute inset-0 block w-full text-left focus-visible:outline-none"
          aria-label={`Reproducir video: ${video.title}, ${video.label} (${video.duration})`}
        >
          <Image
            src={video.poster}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          />
          {/* Sombra baja para que la duración se lea sobre cualquier portada (las portadas van sin subtítulos) */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent to-40%" />
          <span
            aria-hidden
            className={`absolute grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-[0_0_0_10px_color-mix(in_srgb,var(--accent)_18%,transparent)] transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110 md:h-24 md:w-24 ${
              video.playPos ?? "left-1/2 top-1/2"
            }`}
          >
            {started ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white md:h-8 md:w-8" />
            ) : (
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 md:h-8 md:w-8" fill="currentColor">
                <path d="M7 4.5v15l12-7.5z" />
              </svg>
            )}
          </span>
          {/* Sin título encima: la portada ya trae texto propio y cada sección rotula el video fuera del cuadro. */}
          <span
            aria-hidden
            className="t-mono absolute bottom-4 right-4 rounded-full border border-line-strong bg-bg/70 px-3 py-1.5 text-[11px] tracking-[0.12em] text-fg md:bottom-6 md:right-6"
          >
            {video.duration}
          </span>
          {/* Anillo de foco por dentro: el contenedor recorta (overflow-hidden) el outline global de :focus-visible */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[13px] opacity-0 ring-2 ring-inset ring-accent-soft transition-opacity group-focus-visible:opacity-100"
          />
        </button>
      ) : null}
    </div>
  );
}
