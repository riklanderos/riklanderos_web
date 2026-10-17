"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CONTACT_REASONS,
  EMAIL_RE,
  HONEYPOT_FIELD,
  LIMITS,
  REVENUE_RANGES,
  UTM_KEYS,
  isValidPhone,
  type LeadSource,
  type UtmKey,
} from "@/content/leads";
import { track } from "@/lib/analytics";
import { Arrow, btn } from "./ui";

/**
 * Formulario de captura (spec §8 LeadForm). Campos configurables por origen,
 * validación accesible (aria-invalid + aria-describedby), honeypot, estado de carga,
 * UTMs + referrer, POST JSON a /api/lead y redirección a /gracias?src=<origen>.
 */

type FieldName = "name" | "email" | "phone" | "business" | "revenue_range" | "reason" | "message";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "loading" | "success";
type FieldEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const FIELDS: Record<LeadSource, FieldName[]> = {
  radikales: ["name", "email", "business", "revenue_range", "message"],
  recurso: ["name", "email"],
  contacto: ["name", "email", "phone", "reason", "message"],
};

const DEFAULT_SUBMIT: Record<LeadSource, string> = {
  radikales: "Únete a la lista de interés",
  recurso: "Envíame el recurso",
  contacto: "Envía tu mensaje",
};

const EMPTY: Values = { name: "", email: "", phone: "", business: "", revenue_range: "", reason: "", message: "" };
const UTM_STORAGE_KEY = "rl_utm";

function validateField(source: LeadSource, field: FieldName, raw: string): string | undefined {
  const v = raw.trim();
  switch (field) {
    case "name":
      if (v.length < LIMITS.name.min) return "Escribe tu nombre.";
      return undefined;
    case "email":
      if (!v) return "Escribe tu correo.";
      if (!EMAIL_RE.test(v) || v.length > LIMITS.email.max) return "Revisa tu correo: parece incompleto.";
      return undefined;
    case "phone":
      if (v && !isValidPhone(v)) return "Revisa el teléfono: usa solo números y el código de país si aplica.";
      return undefined;
    case "business":
      if (v.length < LIMITS.business.min) return "Dime el nombre o giro de tu negocio.";
      return undefined;
    case "revenue_range":
      if (!v) return "Elige un rango de facturación.";
      return undefined;
    case "reason":
      if (!v) return "Elige el motivo de tu mensaje.";
      return undefined;
    case "message":
      if (source === "radikales" && v.length < LIMITS.stuck.min) return "Cuéntame en una o dos frases qué te tiene atrapado.";
      if (source === "contacto" && v.length < LIMITS.message.min) return "Cuéntame un poco más: fecha, formato o idea.";
      return undefined;
  }
}

/** Lee UTMs de la URL (y las guarda en sesión) o recupera las de la primera visita. */
function readAttribution(): Partial<Record<UtmKey, string>> & { referrer?: string; page_path?: string } {
  const out: Partial<Record<UtmKey, string>> & { referrer?: string; page_path?: string } = {};
  try {
    const params = new URLSearchParams(window.location.search);
    let found = false;
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) {
        out[k] = v.slice(0, 200);
        found = true;
      }
    }
    if (found) {
      try {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(out));
      } catch {
        /* almacenamiento bloqueado: no pasa nada */
      }
    } else {
      try {
        const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
        if (saved) Object.assign(out, JSON.parse(saved) as Partial<Record<UtmKey, string>>);
      } catch {
        /* sin UTMs guardadas */
      }
    }
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) out.referrer = document.referrer.slice(0, 500);
    out.page_path = window.location.pathname;
  } catch {
    /* entorno sin window: se envía sin atribución */
  }
  return out;
}

export function LeadForm({
  source,
  resource,
  submitLabel,
  autoFocus = false,
  className,
  note,
}: {
  source: LeadSource;
  /** Slug del recurso (obligatorio cuando source = "recurso"). */
  resource?: string;
  submitLabel?: string;
  /** Enfoca el primer campo al montar (formularios que se despliegan en línea). */
  autoFocus?: boolean;
  className?: string;
  /** Texto breve bajo el botón; reemplaza el aviso por defecto. */
  note?: ReactNode;
}) {
  const uid = useId();
  const router = useRouter();
  const fields = FIELDS[source];
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const refs = useRef<Partial<Record<FieldName, FieldEl | null>>>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const attribution = useRef<ReturnType<typeof readAttribution>>({});
  // Momento en que el formulario apareció: base del tiempo mínimo de llenado (filtro antispam).
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = performance.now();
    attribution.current = readAttribution();
    if (autoFocus) refs.current[fields[0]]?.focus({ preventScroll: true });
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const has = (f: FieldName) => fields.includes(f);
  const id = (f: string) => `${uid}-${f}`;

  function setValue(f: FieldName, v: string) {
    setValues((s) => ({ ...s, [f]: v }));
    // Si el campo ya mostraba error, se revalida mientras se corrige.
    if (errors[f]) setErrors((e) => ({ ...e, [f]: validateField(source, f, v) }));
  }

  function onBlur(f: FieldName) {
    const v = values[f];
    if (!v.trim() && !errors[f]) return; // no regañar por un campo que aún no se toca
    setErrors((e) => ({ ...e, [f]: validateField(source, f, v) }));
  }

  function focusFirst(errs: Errors) {
    const first = fields.find((f) => errs[f]);
    if (first) refs.current[first]?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;

    const next: Errors = {};
    for (const f of fields) {
      const err = validateField(source, f, values[f]);
      if (err) next[f] = err;
    }
    setErrors(next);
    if (Object.keys(next).length) {
      setFormError(Object.keys(next).length === 1 ? "Revisa el campo marcado." : "Revisa los campos marcados.");
      focusFirst(next);
      return;
    }

    setFormError(null);
    setStatus("loading");

    const payload: Record<string, unknown> = {
      source,
      ...Object.fromEntries(fields.map((f) => [f, values[f].trim()])),
      ...attribution.current,
      [HONEYPOT_FIELD]: honeypot.current?.value ?? "",
      elapsed_ms: Math.round(performance.now() - mountedAt.current),
    };
    if (source === "recurso") payload.resource = resource;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        const serverErrors: Errors = {};
        for (const f of fields) if (data.errors?.[f]) serverErrors[f] = data.errors[f];
        setErrors(serverErrors);
        setFormError(data.error ?? "No pudimos enviar tus datos. Inténtalo de nuevo.");
        setStatus("idle");
        // Los campos siguen deshabilitados hasta el siguiente render: enfocar después.
        setTimeout(() => focusFirst(serverErrors), 0);
        return;
      }

      track("lead_submit", resource ? { source, resource } : { source });
      if (source === "recurso" && resource) track("resource_download", { resource });
      setStatus("success");
      const query = new URLSearchParams({ src: source });
      if (resource) query.set("r", resource);
      router.push(`/gracias?${query.toString()}`);
    } catch {
      setFormError("No hay conexión. Revisa tu internet e inténtalo de nuevo.");
      setStatus("idle");
    }
  }

  const describedBy = (f: FieldName, hint?: boolean) =>
    [hint ? id(`${f}-hint`) : null, errors[f] ? id(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;

  const control = (f: FieldName) =>
    clsx(
      "block w-full !rounded-[10px] border bg-bg px-4 py-3.5 text-[16px] leading-snug text-fg placeholder:text-muted",
      "transition-colors duration-200 focus:border-accent-soft",
      "disabled:cursor-not-allowed disabled:opacity-60",
      errors[f] ? "border-accent" : "border-line-input hover:border-fg",
    );

  const busy = status !== "idle";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={status === "loading"}
      className={clsx("relative", className)}
      data-source={source}
    >
      {/* Honeypot: invisible para humanos y lectores de pantalla. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor={id(HONEYPOT_FIELD)}>No llenes este campo</label>
        <input ref={honeypot} id={id(HONEYPOT_FIELD)} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      {source === "recurso" && resource ? <input type="hidden" name="resource" value={resource} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Nombre" error={errors.name}>
          <input
            ref={(el) => {
              refs.current.name = el;
            }}
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name.max}
            value={values.name}
            onChange={(e) => setValue("name", e.target.value)}
            onBlur={() => onBlur("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            aria-required="true"
            disabled={busy}
            className={control("name")}
          />
        </Field>

        <Field id={id("email")} label="Correo" error={errors.email}>
          <input
            ref={(el) => {
              refs.current.email = el;
            }}
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={LIMITS.email.max}
            value={values.email}
            onChange={(e) => setValue("email", e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            aria-required="true"
            disabled={busy}
            className={control("email")}
          />
        </Field>

        {has("business") ? (
          <Field id={id("business")} label="Negocio" hint="Nombre o giro de tu empresa." error={errors.business}>
            <input
              ref={(el) => {
                refs.current.business = el;
              }}
              id={id("business")}
              name="business"
              type="text"
              autoComplete="organization"
              maxLength={LIMITS.business.max}
              value={values.business}
              onChange={(e) => setValue("business", e.target.value)}
              onBlur={() => onBlur("business")}
              aria-invalid={errors.business ? true : undefined}
              aria-describedby={describedBy("business", true)}
              aria-required="true"
              disabled={busy}
              className={control("business")}
            />
          </Field>
        ) : null}

        {has("revenue_range") ? (
          <Field id={id("revenue_range")} label="Facturación aproximada" hint="Mensual, en pesos mexicanos." error={errors.revenue_range}>
            <Select
              selectRef={(el) => {
                refs.current.revenue_range = el;
              }}
              id={id("revenue_range")}
              name="revenue_range"
              value={values.revenue_range}
              onChange={(v) => {
                setValue("revenue_range", v);
                setErrors((e) => ({ ...e, revenue_range: undefined }));
              }}
              placeholder="Elige un rango"
              options={REVENUE_RANGES}
              invalid={!!errors.revenue_range}
              describedBy={describedBy("revenue_range", true)}
              disabled={busy}
              className={control("revenue_range")}
            />
          </Field>
        ) : null}

        {has("phone") ? (
          <Field id={id("phone")} label="Teléfono" optional error={errors.phone}>
            <input
              ref={(el) => {
                refs.current.phone = el;
              }}
              id={id("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={LIMITS.phone.max}
              value={values.phone}
              onChange={(e) => setValue("phone", e.target.value)}
              onBlur={() => onBlur("phone")}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("phone")}
              disabled={busy}
              className={control("phone")}
            />
          </Field>
        ) : null}

        {has("reason") ? (
          <Field id={id("reason")} label="Motivo" error={errors.reason}>
            <Select
              selectRef={(el) => {
                refs.current.reason = el;
              }}
              id={id("reason")}
              name="reason"
              value={values.reason}
              onChange={(v) => {
                setValue("reason", v);
                setErrors((e) => ({ ...e, reason: undefined }));
              }}
              placeholder="Elige un motivo"
              options={CONTACT_REASONS}
              invalid={!!errors.reason}
              describedBy={describedBy("reason")}
              disabled={busy}
              className={control("reason")}
            />
          </Field>
        ) : null}

        {has("message") ? (
          <Field
            id={id("message")}
            label={source === "radikales" ? "¿Qué te tiene atrapado hoy?" : "Mensaje"}
            hint={
              source === "radikales"
                ? `Una o dos frases, sin adornos (mínimo ${LIMITS.stuck.min} caracteres).`
                : `Fecha, ciudad, formato o idea. Mínimo ${LIMITS.message.min} caracteres.`
            }
            error={errors.message}
            className="sm:col-span-2"
          >
            <textarea
              ref={(el) => {
                refs.current.message = el;
              }}
              id={id("message")}
              name="message"
              rows={source === "radikales" ? 3 : 5}
              maxLength={source === "radikales" ? LIMITS.stuck.max : LIMITS.message.max}
              value={values.message}
              onChange={(e) => setValue("message", e.target.value)}
              onBlur={() => onBlur("message")}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy("message", true)}
              aria-required="true"
              disabled={busy}
              className={clsx(control("message"), "min-h-[7rem] resize-y")}
            />
          </Field>
        ) : null}
      </div>

      <div role="alert" aria-live="assertive">
        {formError ? (
          <p className="mt-6 flex items-start gap-2.5 rounded-[10px] border border-accent/50 bg-accent/10 px-4 py-3 text-[15px] text-fg">
            <ErrorIcon className="mt-[3px] shrink-0 text-accent-text" />
            <span>{formError}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={busy} className={clsx(btn.primary, "w-full !whitespace-normal text-center disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:shrink-0")}>
          {status === "loading" ? (
            <>
              <Spinner />
              Enviando…
            </>
          ) : status === "success" ? (
            "Listo"
          ) : (
            <>
              {submitLabel ?? DEFAULT_SUBMIT[source]}
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
        <p className="min-w-0 text-[13px] leading-relaxed text-muted sm:max-w-[260px] sm:text-right">
          {note ?? (
            <>
              Uso tus datos solo para lo que pediste.{" "}
              <Link href="/privacidad" className="underline decoration-line-strong underline-offset-4 hover:text-fg">
                Aviso de privacidad
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}

/* ── Piezas internas ─────────────────────────────────────────── */

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
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-[13px] text-muted">
          {hint}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="sr-only">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-[13px] font-medium text-accent-text">
          <ErrorIcon className="mt-[2px] shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function Select({
  selectRef,
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  invalid,
  describedBy,
  disabled,
  className,
}: {
  selectRef: (el: HTMLSelectElement | null) => void;
  id: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  invalid: boolean;
  describedBy?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        ref={selectRef}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        aria-required="true"
        disabled={disabled}
        className={clsx(className, "cursor-pointer appearance-none pr-11", !value && "text-muted")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-fg">
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={clsx("h-3.5 w-3.5", className)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.75v4M8 11.1v.15" strokeLinecap="round" />
    </svg>
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
