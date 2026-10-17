import "server-only";
import { CDMX_TZ } from "./config";
import { connectorToken } from "./connect.server";

const API = "https://www.googleapis.com/calendar/v3";

async function gfetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await connectorToken("google");
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}`, "content-type": "application/json" },
  });
  if (res.status === 204) return undefined as T;
  const json = (await res.json().catch(() => ({}))) as T & { error?: { code: number; message: string } };
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${json.error?.message ?? "error"}`);
  return json;
}

export type CalendarSummary = { id: string; summary: string; primary?: boolean; accessRole: string; timeZone?: string };

export async function listCalendars(): Promise<CalendarSummary[]> {
  const j = await gfetch<{ items?: CalendarSummary[] }>(
    "/users/me/calendarList?fields=items(id,summary,primary,accessRole,timeZone)",
  );
  return j.items ?? [];
}

export type Busy = { start: string; end: string };

export async function freeBusy(calendarIds: string[], timeMin: string, timeMax: string): Promise<Busy[]> {
  const j = await gfetch<{ calendars?: Record<string, { busy?: Busy[]; errors?: unknown[] }> }>("/freeBusy", {
    method: "POST",
    body: JSON.stringify({ timeMin, timeMax, timeZone: CDMX_TZ, items: calendarIds.map((id) => ({ id })) }),
  });
  return Object.values(j.calendars ?? {}).flatMap((c) => c.busy ?? []);
}

export type CalEvent = {
  id: string;
  summary?: string;
  status?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  hangoutLink?: string;
  attendees?: { email: string }[];
  extendedProperties?: { private?: Record<string, string> };
};

export async function listEvents(
  calendarId: string,
  params: { timeMin: string; timeMax: string; privateProps?: Record<string, string> },
): Promise<CalEvent[]> {
  const q = new URLSearchParams({ timeMin: params.timeMin, timeMax: params.timeMax, singleEvents: "true", maxResults: "250" });
  for (const [k, v] of Object.entries(params.privateProps ?? {})) q.append("privateExtendedProperty", `${k}=${v}`);
  const j = await gfetch<{ items?: CalEvent[] }>(`/calendars/${encodeURIComponent(calendarId)}/events?${q}`);
  return (j.items ?? []).filter((e) => e.status !== "cancelled");
}

export async function getEvent(calendarId: string, eventId: string): Promise<CalEvent> {
  return gfetch<CalEvent>(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`);
}

type EventInput = {
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  attendeeEmail?: string;
  withMeet?: boolean;
  privateProps: Record<string, string>;
  transparency?: "opaque" | "transparent";
};

function eventBody(e: EventInput) {
  return {
    summary: e.summary,
    description: e.description,
    start: { dateTime: e.startIso, timeZone: CDMX_TZ },
    end: { dateTime: e.endIso, timeZone: CDMX_TZ },
    attendees: e.attendeeEmail ? [{ email: e.attendeeEmail }] : [],
    extendedProperties: { private: e.privateProps },
    reminders: { useDefault: true },
    ...(e.withMeet
      ? { conferenceData: { createRequest: { requestId: `rl-${crypto.randomUUID()}`, conferenceSolutionKey: { type: "hangoutsMeet" } } } }
      : {}),
  };
}

export async function insertEvent(calendarId: string, e: EventInput): Promise<CalEvent> {
  const q = new URLSearchParams({ conferenceDataVersion: "1", sendUpdates: e.attendeeEmail ? "all" : "none" });
  return gfetch<CalEvent>(`/calendars/${encodeURIComponent(calendarId)}/events?${q}`, {
    method: "POST",
    body: JSON.stringify(eventBody(e)),
  });
}

export async function patchEvent(calendarId: string, eventId: string, e: EventInput): Promise<CalEvent> {
  const q = new URLSearchParams({ conferenceDataVersion: "1", sendUpdates: e.attendeeEmail ? "all" : "none" });
  return gfetch<CalEvent>(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?${q}`, {
    method: "PATCH",
    body: JSON.stringify(eventBody(e)),
  });
}

export async function deleteEvent(calendarId: string, eventId: string): Promise<void> {
  await gfetch<void>(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`, {
    method: "DELETE",
  }).catch((e: Error) => {
    if (!/ 410:| 404:/.test(e.message)) throw e;
  });
}
