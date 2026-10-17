"use client";

import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CDMX_TZ,
  EMPTY_FORM,
  HOLD_MINUTES,
  INDUSTRIES,
  REVENUES,
  SESSION_RULES,
  TEAM_SIZES,
  TIME_DRAINS,
  formatDayEs,
  formatSlotEs,
  formatTimeEs,
  validateForm,
  type BookingForm,
  type DayAvailability,
  type FormErrors,
  type SessionType,
} from "@/lib/agenda/config";
import { UTM_KEYS, type UtmKey } from "@/content/leads";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";
import { useSafeReducedMotion } from "../motion";
import { Arrow, btn } from "../ui";

type Step = 1 | 2 | 3;
type Confirmed = { when: string; meetLink: string | null };

const STORAGE = (t: SessionType) => `rl_agenda_${t}`;
const UTM_STORAGE_KEY = "rl_utm";
const EASE = [0.22, 1, 0.36, 1] as const;

type AttributionPayload = Partial<Record<UtmKey, string>> & { referrer?: string; page_path?: string; zona?: string };

/** UTMs de la URL o de la primera visita (misma clave que el resto de formularios), más referrer y ruta. */
function readAttribution(zona: string | null): AttributionPayload {
  const out: AttributionPayload = {};
  try {
    const params = new URLSearchParams(window.location.search);
    let found = false;
    for (const k of UTM_KEYS) {
      const v = params.get(k)?.trim();
      if (v) {
        out[k] = v.slice(0, 200);
        found = true;
      }
    }
    if (found) {
      const utmOnly: Partial<Record<UtmKey, string>> = {};
      for (const k of UTM_KEYS) if (out[k]) utmOnly[k] = out[k];
      try {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmOnly));
      } catch {
        /* almacenamiento bloqueado */
      }
    } else {
      try {
        const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Record<UtmKey, string>>;
          for (const k of UTM_KEYS) {
            if (typeof parsed?.[k] === "string" && parsed[k]) out[k] = parsed[k].slice(0, 200);
          }
        }
      } catch {
        /* sin UTMs guardadas */
      }
    }
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) out.referrer = document.referrer.slice(0, 500);
    out.page_path = window.location.pathname.slice(0, 300);
    if (zona) out.zona = zona.slice(0, 80);
  } catch {
    /* sin window: la reserva sigue sin atribución */
  }
  return out;
}

/**
 * Agenda en tres pasos: datos del negocio → horario (próximos 5 días hábiles, leídos de Google Calendar)
 * → confirmar. La Discovery Session se confirma al instante; la Power Session aparta el horario y manda a Stripe.
 */
export function BookingFlow({ type, canceled = false }: { type: SessionType; canceled?: boolean }) {
  const rule = SESSION_RULES[type];
  const isPower = type === "power";
  const uid = useId();
  const reduce = useSafeReducedMotion();
  const topRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const origin = useRef<string | null>(null);
  const attribution = useRef<AttributionPayload>({});

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [days, setDays] = useState<DayAvailability[] | null>(null);
  const [daysError, setDaysError] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    canceled ? "Cancelaste el pago y tu horario quedó libre. Puedes elegir el mismo u otro." : null,
  );
  const [done, setDone] = useState<Confirmed | null>(null);
  const [honey, setHoney] = useState("");
  const [localTz, setLocalTz] = useState<string | null>(null);

  const loadDays = useCallback(async () => {
    setDaysError(null);
    try {
      const r = await fetch(`/api/agenda/disponibilidad?tipo=${type}`, { cache: "no-store" });
      const j = (await r.json()) as { ok: boolean; days?: DayAvailability[]; error?: string };
      if (!j.ok || !j.days) throw new Error(j.error || "No pude leer la agenda.");
      setDays(j.days);
      setDate((d) => (d && j.days!.some((x) => x.date === d && x.slots.length) ? d : (j.days!.find((x) => x.slots.length)?.date ?? null)));
      setSlot((s) => (s && j.days!.some((x) => x.slots.includes(s)) ? s : null));
    } catch (e) {
      setDays(null);
      setDaysError(e instanceof Error ? e.message : "No pude leer la agenda.");
    }
  }, [type]);

  // Al montar: disponibilidad en paralelo con el formulario, datos guardados, zona horaria y origen.
  useEffect(() => {
    startedAt.current = Date.now();
    void loadDays();
    try {
      const saved = sessionStorage.getItem(STORAGE(type));
      if (saved) {
        const f = { ...EMPTY_FORM, ...(JSON.parse(saved) as Partial<BookingForm>) };
        setForm(f);
        if (canceled && !Object.keys(validateForm(type, f)).length) setStep(2);
      }
    } catch {}
    let zona: string | null = null;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) zona = tz;
      if (tz && tz !== CDMX_TZ) setLocalTz(tz);
    } catch {}
    const p = new URLSearchParams(window.location.search);
    origin.current = [p.get("desde") && `Sección: ${p.get("desde")}`, p.get("utm_source"), p.get("utm_campaign"), p.get("utm_content")].filter(Boolean).join(" · ") || null;
    attribution.current = readAttribution(zona);
    if (canceled) {
      window.history.replaceState(null, "", window.location.pathname);
      // Regresó de Stripe: directo al formulario, no al hero.
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: "start" }));
    }
    track("booking_view", { tipo: type, desde: p.get("desde") ?? undefined });
  }, [type, canceled, loadDays]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE(type), JSON.stringify(form));
    } catch {}
  }, [form, type]);

  function goTo(s: Step) {
    setStep(s);
    setServerError(null);
    track("booking_step", { tipo: type, step: s });
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  }

  function set<K extends keyof BookingForm>(k: K, v: BookingForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function submitDetails(e: FormEvent) {
    e.preventDefault();
    const errs = validateForm(type, form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    goTo(2);
  }

  async function confirm() {
    if (!slot) return;
    setBusy(true);
    setServerError(null);
    track(isPower ? "booking_checkout_start" : "booking_submit", { tipo: type });
    try {
      const r = await fetch("/api/agenda/reservar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tipo: type,
          form,
          start: slot,
          origen: origin.current,
          atribucion: attribution.current,
          website_url: honey,
          elapsed_ms: Date.now() - startedAt.current,
        }),
      });
      const j = (await r.json()) as {
        ok: boolean;
        kind?: "confirmed" | "checkout";
        url?: string;
        when?: string;
        meetLink?: string | null;
        error?: string;
        slotTaken?: boolean;
        errors?: FormErrors;
      };
      if (!j.ok) {
        if (j.slotTaken) {
          setSlot(null);
          setNotice(j.error ?? "Ese horario se acaba de ocupar. Elige otro, por favor.");
          await loadDays();
          goTo(2);
        } else if (j.errors) {
          setErrors(j.errors);
          goTo(1);
        } else setServerError(j.error ?? "No pude completar la reserva.");
        setBusy(false);
        return;
      }
      if (j.kind === "checkout" && j.url) {
        window.location.assign(j.url);
        return;
      }
      setDone({ when: j.when ?? formatSlotEs(slot), meetLink: j.meetLink ?? null });
      track("booking_confirmed", { tipo: type });
      try {
        sessionStorage.removeItem(STORAGE(type));
      } catch {}
      setBusy(false);
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
    } catch {
      setServerError("Se perdió la conexión. Inténtalo de nuevo.");
      setBusy(false);
    }
  }

  const control = (k: keyof BookingForm) =>
    clsx(
      "block w-full !rounded-[10px] border bg-bg px-4 py-3.5 text-[16px] leading-snug text-fg placeholder:text-muted",
      "transition-colors duration-200 focus:border-accent-soft",
      errors[k] ? "border-accent" : "border-line-input hover:border-fg",
    );
  const aria = (k: keyof BookingForm) => ({
    id: `${uid}-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-error` : undefined,
  });

  const anim = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.45, ease: EASE },
      };

  if (done) {
    return (
      <div ref={topRef} className="card scroll-mt-28 p-6 sm:p-10">
        <motion.div {...anim}>
          <span aria-hidden className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="t-h3 mt-6 !text-[1.9rem]">Listo, {form.fullName.split(" ")[0]}. Tu {rule.label} quedó agendada.</h2>
          <p className="mt-4 text-[17px] text-fg">{done.when} (hora del centro de México)</p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Te envié la invitación de Google Calendar a <strong className="text-fg">{form.email}</strong> con el enlace de Google
            Meet. Si no la ves en unos minutos, revisa promociones o spam.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {done.meetLink ? (
              <a href={done.meetLink} target="_blank" rel="noopener noreferrer" className={btn.primary}>
                Abrir enlace de Meet
                <Arrow />
              </a>
            ) : null}
            <Link href="/" className={btn.ghost}>
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps = ["Tus datos", "Horario", isPower ? "Pago" : "Confirmar"];
  const day = days?.find((d) => d.date === date) ?? null;
  const anySlots = !!days?.some((d) => d.slots.length);

  return (
    <div ref={topRef} className="card scroll-mt-28 overflow-hidden">
      <ol className="grid grid-cols-3 border-b border-line" aria-label="Pasos">
        {steps.map((label, i) => {
          const n = (i + 1) as Step;
          const state = n === step ? "now" : n < step ? "done" : "next";
          return (
            <li
              key={label}
              aria-current={state === "now" ? "step" : undefined}
              className={clsx(
                "relative flex items-center gap-2 px-3 py-4 text-[13px] sm:px-6 sm:text-[14px]",
                state === "next" ? "text-muted" : "text-fg",
              )}
            >
              <span
                className={clsx(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px]",
                  state === "now" ? "bg-accent text-white" : state === "done" ? "bg-fg text-bg" : "border border-line-strong",
                )}
              >
                {state === "done" ? "✓" : n}
              </span>
              <span className="truncate">{label}</span>
              {state === "now" ? (
                <motion.span layoutId={`${uid}-bar`} className="absolute inset-x-0 bottom-0 h-[2px] bg-accent" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="p-5 sm:p-8">
        {notice ? (
          <p role="status" className="mb-6 rounded-[10px] border border-line-strong bg-elev-2 px-4 py-3 text-[15px] text-fg">
            {notice}
          </p>
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.form key="s1" {...anim} noValidate onSubmit={submitDetails} className="relative">
              <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label>
                  No llenar
                  <input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
                </label>
              </div>

              <Group title="Sobre ti">
                <Field id={`${uid}-fullName`} label="Nombre completo" error={errors.fullName}>
                  <input {...aria("fullName")} className={control("fullName")} autoComplete="name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                </Field>
                <Field id={`${uid}-email`} label="Correo" hint="Ahí te llega la invitación con el enlace de Meet." error={errors.email}>
                  <input {...aria("email")} type="email" inputMode="email" className={control("email")} autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
                <Field id={`${uid}-whatsapp`} label="WhatsApp" hint="Con lada. Solo para avisos de tu sesión." error={errors.whatsapp}>
                  <input {...aria("whatsapp")} type="tel" inputMode="tel" className={control("whatsapp")} autoComplete="tel" placeholder="+52 55 1234 5678" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
                </Field>
              </Group>

              <Group title="Sobre tu negocio">
                <Field id={`${uid}-businessName`} label="Nombre del negocio" error={errors.businessName}>
                  <input {...aria("businessName")} className={control("businessName")} autoComplete="organization" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} />
                </Field>
                <Field id={`${uid}-website`} label="Sitio web o redes" optional error={errors.website}>
                  <input {...aria("website")} className={control("website")} autoComplete="url" placeholder="instagram.com/tunegocio" value={form.website} onChange={(e) => set("website", e.target.value)} />
                </Field>
                <Field id={`${uid}-industry`} label="Giro" error={errors.industry}>
                  <Select {...aria("industry")} className={control("industry")} value={form.industry} onChange={(v) => set("industry", v)} placeholder="Elige uno" options={INDUSTRIES} />
                </Field>
                <Field id={`${uid}-teamSize`} label="Personas en tu equipo" error={errors.teamSize}>
                  <Select {...aria("teamSize")} className={control("teamSize")} value={form.teamSize} onChange={(v) => set("teamSize", v)} placeholder="Elige uno" options={TEAM_SIZES} />
                </Field>
                <Field id={`${uid}-revenue`} label="Facturación mensual aproximada" className="sm:col-span-2" error={errors.revenue}>
                  <Select {...aria("revenue")} className={control("revenue")} value={form.revenue} onChange={(v) => set("revenue", v)} placeholder="Elige un rango" options={REVENUES} />
                </Field>
              </Group>

              <Group title="Para preparar la sesión">
                {isPower ? (
                  <fieldset className="min-w-0 sm:col-span-2" aria-describedby={errors.timeDrains ? `${uid}-timeDrains-error` : undefined}>
                    <legend className="mb-3 text-[14px] font-medium text-fg">
                      ¿Dónde se te va más el tiempo? <span className="text-muted">(hasta 3)</span>
                    </legend>
                    <div className="flex flex-wrap gap-2" id={`${uid}-timeDrains`} tabIndex={-1}>
                      {TIME_DRAINS.map((d) => {
                        const on = form.timeDrains.includes(d);
                        const full = !on && form.timeDrains.length >= 3;
                        return (
                          <button
                            key={d}
                            type="button"
                            aria-pressed={on}
                            disabled={full}
                            onClick={() => set("timeDrains", on ? form.timeDrains.filter((x) => x !== d) : [...form.timeDrains, d])}
                            className={clsx(
                              "rounded-full border px-4 py-2 text-[14px] transition-colors duration-200",
                              on ? "border-accent bg-accent text-white" : "border-line-input text-fg hover:border-fg",
                              full && "cursor-not-allowed opacity-40",
                            )}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError id={`${uid}-timeDrains-error`} error={errors.timeDrains} />
                  </fieldset>
                ) : null}
                {isPower ? (
                  <Field id={`${uid}-tools`} label="¿Qué herramientas usan hoy?" hint="CRM, Excel, WhatsApp Business, facturación…" className="sm:col-span-2" error={errors.tools}>
                    <input {...aria("tools")} className={control("tools")} value={form.tools} onChange={(e) => set("tools", e.target.value)} />
                  </Field>
                ) : null}
                <Field
                  id={`${uid}-goal`}
                  label={isPower ? "¿Qué quieres resolver en la sesión?" : "¿Qué te gustaría lograr con el sistema?"}
                  hint={isPower ? "Mientras más concreto, mejor llego preparado." : "Una o dos frases bastan."}
                  className="sm:col-span-2"
                  error={errors.goal}
                >
                  <textarea {...aria("goal")} rows={4} className={clsx(control("goal"), "min-h-[7rem] resize-y")} value={form.goal} onChange={(e) => set("goal", e.target.value)} />
                </Field>
              </Group>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" className={clsx(btn.primary, "w-full sm:w-auto")}>
                  Elegir horario
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="text-[13px] leading-relaxed text-muted sm:max-w-[280px] sm:text-right">
                  Tus datos solo se usan para preparar tu sesión.{" "}
                  <Link href="/privacidad" className="underline decoration-line-strong underline-offset-4 hover:text-fg">
                    Aviso de privacidad
                  </Link>
                </p>
              </div>
            </motion.form>
          ) : step === 2 ? (
            <motion.div key="s2" {...anim}>
              <h2 className="t-h3">Elige día y hora</h2>
              <p className="mt-2 text-[15px] text-muted">
                Próximos 5 días hábiles · {rule.minutes} min · Horarios en hora del centro de México (CDMX).
              </p>

              {daysError ? (
                <div className="mt-6 rounded-[10px] border border-accent/50 bg-accent/10 px-4 py-4 text-[15px]">
                  <p>{daysError}</p>
                  <button type="button" onClick={() => void loadDays()} className={clsx(btn.text, "mt-3")}>
                    Reintentar
                    <Arrow />
                  </button>
                </div>
              ) : !days ? (
                <div className="mt-6 grid grid-cols-5 gap-2" aria-busy="true" aria-label="Cargando horarios">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="h-[84px] animate-pulse rounded-[10px] bg-elev-2" />
                  ))}
                </div>
              ) : !anySlots ? (
                <div className="mt-6 rounded-[10px] border border-line-strong px-4 py-5 text-[15px] leading-relaxed">
                  {isPower
                    ? "Esta semana ya no quedan Power Sessions (abro solo 4 por semana). "
                    : "No quedan horarios libres en los próximos días. "}
                  Escríbeme a{" "}
                  <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>{" "}
                  y te busco un espacio.
                </div>
              ) : (
                <>
                  <div role="tablist" aria-label="Días disponibles" className="-mx-1 mt-6 grid grid-cols-5 gap-1.5 px-1 sm:gap-2">
                    {days.map((d) => {
                      const f = formatDayEs(d.date);
                      const on = d.date === date;
                      const empty = !d.slots.length;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          role="tab"
                          aria-selected={on}
                          disabled={empty}
                          onClick={() => {
                            setDate(d.date);
                            setSlot(null);
                          }}
                          className={clsx(
                            "flex flex-col items-center rounded-[10px] border px-1 py-3 transition-colors duration-200",
                            on ? "border-accent bg-accent text-white" : "border-line-input hover:border-fg",
                            empty && "cursor-not-allowed opacity-35 hover:border-line-input",
                          )}
                        >
                          <span className="t-mono text-[10px] uppercase tracking-[0.12em]">{f.weekday.slice(0, 3)}</span>
                          <span className="mt-1 font-display text-[1.6rem] font-semibold leading-none">{f.day}</span>
                          <span className={clsx("mt-1 text-[11px]", on ? "text-white/85" : "text-muted")}>
                            {empty ? "Lleno" : f.month.slice(0, 3)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {day ? (
                    <div role="tabpanel" className="mt-6">
                      <p className="text-[14px] text-muted">
                        {cap(formatDayEs(day.date).weekday)} {formatDayEs(day.date).day} de {formatDayEs(day.date).month}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {day.slots.map((s) => {
                          const on = s === slot;
                          return (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={on}
                              onClick={() => setSlot(s)}
                              className={clsx(
                                "rounded-[10px] border px-3 py-3 text-center transition-colors duration-200",
                                on ? "border-accent bg-accent text-white" : "border-line-input hover:border-fg",
                              )}
                            >
                              <span className="block text-[16px] font-medium">{formatTimeEs(s)}</span>
                              {localTz ? (
                                <span className={clsx("mt-0.5 block text-[11px]", on ? "text-white/85" : "text-muted")}>
                                  {formatTimeEs(s, localTz)} tu hora
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => goTo(1)} className={btn.ghost}>
                  Atrás
                </button>
                <button
                  type="button"
                  disabled={!slot}
                  onClick={() => {
                    setNotice(null);
                    goTo(3);
                  }}
                  className={clsx(btn.primary, "disabled:cursor-not-allowed disabled:opacity-40")}
                >
                  Continuar
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="s3" {...anim}>
              <h2 className="t-h3">{isPower ? "Revisa y paga" : "Revisa y confirma"}</h2>
              <dl className="mt-6 divide-y divide-line rounded-[10px] border border-line text-[15px]">
                <Row label="Sesión">
                  {rule.label} · {rule.minutes} min · Google Meet
                </Row>
                <Row label="Cuándo">
                  {slot ? formatSlotEs(slot) : ""} <span className="text-muted">(CDMX)</span>
                  {slot && localTz ? <span className="block text-[13px] text-muted">{formatTimeEs(slot, localTz)} en tu zona horaria</span> : null}
                </Row>
                <Row label="Para">
                  {form.fullName} · {form.businessName}
                  <span className="block text-[13px] text-muted">{form.email}</span>
                </Row>
                <Row label="Costo">{isPower ? `${SITE.powerSessionPrice} · pago único` : "Sin costo"}</Row>
              </dl>
              <p className="mt-5 text-[14px] leading-relaxed text-muted">
                {isPower
                  ? `Te llevo a Stripe para pagar con tarjeta. Tu horario queda apartado ${HOLD_MINUTES - 1} minutos mientras pagas; en cuanto se confirma el pago te llega la invitación con el enlace de Meet.`
                  : "Al confirmar, te llega la invitación de Google Calendar con el enlace de Meet."}
              </p>
              {serverError ? (
                <p role="alert" className="mt-5 rounded-[10px] border border-accent/50 bg-accent/10 px-4 py-3 text-[15px]">
                  {serverError}
                </p>
              ) : null}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" disabled={busy} onClick={() => goTo(2)} className={btn.ghost}>
                  Cambiar horario
                </button>
                <button type="button" disabled={busy} onClick={() => void confirm()} className={clsx(btn.primary, "disabled:cursor-wait disabled:opacity-80")}>
                  {busy ? <Spinner /> : null}
                  {busy ? (isPower ? "Abriendo pago…" : "Agendando…") : isPower ? `Pagar ${SITE.powerSessionPrice}` : "Confirmar mi sesión"}
                  {busy ? null : <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-8 first-of-type:mt-0">
      <legend className="t-eyebrow mb-5">{title}</legend>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx("min-w-0", className)}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[14px] font-medium text-fg">
        <span>{label}</span>
        {optional ? <span className="t-mono text-[10px] uppercase tracking-[0.14em] text-muted">Opcional</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-2 text-[13px] text-muted">{hint}</p> : null}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-[13px] font-medium text-accent-text">
      {error}
    </p>
  );
}

function Select({
  options,
  placeholder,
  value,
  onChange,
  className,
  ...rest
}: {
  id: string;
  options: readonly string[];
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  className: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  return (
    <div className="relative">
      <select
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(className, "cursor-pointer appearance-none pr-11", !value && "text-muted")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-fg">
            {o}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 px-4 py-3.5 sm:grid-cols-[120px_1fr] sm:gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-fg">{children}</dd>
    </div>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
