"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getCallSlots, holdCallSlot, type RecentCall } from "../lib/access";
import { CALL, CALLS_DONE, HELP_CALL } from "../data/offers";

const IST = "Asia/Kolkata";
const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
  });
const dayPart = (iso: string, part: "weekday" | "day" | "month") =>
  new Date(iso).toLocaleDateString("en-IN", {
    timeZone: IST,
    [part]: part === "day" ? "numeric" : "short",
  });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: IST,
    hour: "numeric",
    minute: "2-digit",
  });

type Return = "paid" | "failed" | null;

export default function CallBooking() {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [recent, setRecent] = useState<RecentCall[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [kind, setKind] = useState<"call" | "help">("call");
  const [form, setForm] = useState({ name: "", email: "", topic: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returned, setReturned] = useState<Return>(null);

  // Dodo sends buyers back to /call/?payment_id=…&status=…
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "help") setKind("help");
    if (params.get("payment_id")) {
      setReturned(params.get("status") === "succeeded" ? "paid" : "failed");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    getCallSlots()
      .then((r) => {
        setSlots(r.slots);
        setRecent(r.recent ?? []);
        if (r.slots[0]) setDay(dayLabel(r.slots[0]));
      })
      .catch(() => setLoadError(true));
  }, []);

  const byDay = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const s of slots ?? [])
      m.set(dayLabel(s), [...(m.get(dayLabel(s)) ?? []), s]);
    return m;
  }, [slots]);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!slot) return;
    setSending(true);
    setError(null);
    try {
      const { url } = await holdCallSlot({ slot, kind, ...form });
      window.location.href = url;
    } catch (err) {
      setError(
        (err as { message?: string }).message ||
          "Couldn't hold that time. Try again",
      );
      setSending(false);
    }
  }

  return (
    <div className="docs-page call-page">
      <Link href="/products/" className="docs-back">
        ← Products
      </Link>
      <h1 className="font-serif docs-title">Book a 1:1 call</h1>
      <p className="call-meta">
        {CALL.minutes} min on Google Meet · {CALL.hours}
      </p>
      <div className="call-kinds" role="radiogroup" aria-label="Call type">
        {(
          [
            ["call", "1:1 call", CALL.price],
            ["help", HELP_CALL.title, HELP_CALL.price],
          ] as const
        ).map(([k, title, price]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            className={`call-kind ${kind === k ? "is-active" : ""}`}
            onClick={() => setKind(k)}
          >
            <b>{title}</b>
            <span>{price}</span>
          </button>
        ))}
      </div>

      {returned === "paid" && (
        <p className="offer-done call-banner" role="status">
          Paid. Your calendar invite with the Meet link is on its way to your
          email
        </p>
      )}
      {returned === "failed" && (
        <p className="offer-error call-banner" role="status">
          The payment didn&apos;t go through. Your time stays held for 15
          minutes, pick it again to retry
        </p>
      )}

      {loadError && (
        <p className="offer-error">
          Couldn&apos;t load times. Refresh to try again
        </p>
      )}
      {!slots && !loadError && <p className="docs-empty">Loading times…</p>}
      {slots && slots.length === 0 && (
        <p className="docs-empty">
          No open times in the next 2 weeks. Check back soon
        </p>
      )}

      <div className="call-layout">
        <div>
          {slots && slots.length > 0 && (
            <div className="call-card">
              <div className="call-days" role="tablist" aria-label="Day">
                {[...byDay.entries()].map(([d, [first]]) => (
                  <button
                    key={d}
                    type="button"
                    role="tab"
                    aria-selected={day === d}
                    aria-label={d}
                    className={`call-day ${day === d ? "is-active" : ""}`}
                    onClick={() => {
                      setDay(d);
                      setSlot(null);
                    }}
                  >
                    <small>{dayPart(first, "weekday")}</small>
                    <b>{dayPart(first, "day")}</b>
                    <small>{dayPart(first, "month")}</small>
                  </button>
                ))}
              </div>
              <div className="call-times">
                {(byDay.get(day ?? "") ?? []).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`call-time ${slot === s ? "is-active" : ""}`}
                    aria-pressed={slot === s}
                    onClick={() => setSlot(s)}
                  >
                    {timeLabel(s)}
                  </button>
                ))}
              </div>

              {slot && (
                <form className="call-form" onSubmit={pay}>
                  <input
                    className="docs-search offer-input"
                    required
                    maxLength={80}
                    placeholder="Your name"
                    aria-label="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="docs-search offer-input"
                    type="email"
                    required
                    placeholder="you@email.com"
                    aria-label="Email for the invite"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <textarea
                    className="docs-search offer-input"
                    required
                    maxLength={500}
                    rows={3}
                    placeholder="What do you want to talk about?"
                    aria-label="What do you want to talk about?"
                    value={form.topic}
                    onChange={(e) =>
                      setForm({ ...form, topic: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="btn-primary pro-offer-buy"
                    disabled={sending}
                  >
                    {sending
                      ? "Holding your time…"
                      : `Pay ${kind === "help" ? HELP_CALL.price : CALL.price} · ${dayLabel(slot)}, ${timeLabel(slot)}`}
                  </button>
                  {error && <p className="offer-error">{error}</p>}
                </form>
              )}
            </div>
          )}
        </div>
        <aside className="call-done" aria-label="Calls done">
          <p className="call-done-count">{CALLS_DONE.length + recent.length}</p>
          <p className="call-done-label">calls booked so far</p>
          <ul>
            {recent.map((c) => (
              <li key={c.bookedAt}>
                <b>{c.name}</b>
                Call on {dayLabel(c.slot)}, {timeLabel(c.slot)}
                <small>
                  Booked {dayLabel(new Date(c.bookedAt).toISOString())}
                </small>
              </li>
            ))}
            {CALLS_DONE.map((c) => (
              <li key={c.name}>
                <b>{c.name}</b>
                {c.topic}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
