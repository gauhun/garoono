import type { Interval } from "./slots.js";

export type CalendarCreds = { clientId: string; clientSecret: string; refreshToken: string };

// garoonotech@gmail.com is a personal account: a refresh token, not a service account, so invites reach attendees
async function accessToken(c: CalendarCreds) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      refresh_token: c.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token ${res.status}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

export async function busyIntervals(c: CalendarCreds, from: number, to: number): Promise<Interval[]> {
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken(c)}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(), items: [{ id: "primary" }] }),
  });
  if (!res.ok) throw new Error(`Google freeBusy ${res.status}`);
  const data = (await res.json()) as { calendars?: { primary?: { busy?: { start: string; end: string }[]; errors?: unknown[] } } };
  // Fail closed: an unreadable calendar must not look free
  if (data.calendars?.primary?.errors?.length) throw new Error("Google freeBusy calendar error");
  return (data.calendars?.primary?.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}

export async function createCallEvent(
  c: CalendarCreds,
  call: { id: string; start: number; end: number; name: string; email: string; topic: string },
) {
  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${await accessToken(c)}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Fixed id per payment: a webhook retry gets 409 instead of a second event
        id: call.id,
        summary: `Call with ${call.name} · garoono.in`,
        description: `30 minute call booked on garoono.in/call\n\nTopic:\n${call.topic}`,
        start: { dateTime: new Date(call.start).toISOString(), timeZone: "Asia/Kolkata" },
        end: { dateTime: new Date(call.end).toISOString(), timeZone: "Asia/Kolkata" },
        attendees: [{ email: call.email, displayName: call.name }],
        conferenceData: { createRequest: { requestId: call.id, conferenceSolutionKey: { type: "hangoutsMeet" } } },
        reminders: { useDefault: true },
      }),
    },
  );
  if (res.status === 409) return { eventId: call.id, meetLink: null };
  if (!res.ok) throw new Error(`Google events.insert ${res.status}`);
  const ev = (await res.json()) as { id: string; hangoutLink?: string };
  return { eventId: ev.id, meetLink: ev.hangoutLink ?? null };
}
