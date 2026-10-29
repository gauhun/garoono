"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getCallSlots, holdCallSlot } from "../lib/access";
import { CALL } from "../data/offers";

const IST = "Asia/Kolkata";
const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { timeZone: IST, weekday: "short", day: "numeric", month: "short" });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { timeZone: IST, hour: "numeric", minute: "2-digit" });

type Return = "paid" | "failed" | null;

export default function CallBooking() {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", topic: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returned, setReturned] = useState<Return>(null);

  // Dodo sends buyers back to /call/?payment_id=…&status=…
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment_id")) {
      setReturned(params.get("status") === "succeeded" ? "paid" : "failed");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    getCallSlots()
      .then((r) => {
        setSlots(r.slots);
        if (r.slots[0]) setDay(dayLabel(r.slots[0]));
      })
      .catch(() => setLoadError(true));
  }, []);

  const byDay = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const s of slots ?? []) m.set(dayLabel(s), [...(m.get(dayLabel(s)) ?? []), s]);
    return m;
  }, [slots]);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!slot) return;
    setSending(true);
    setError(null);
    try {
      const { url } = await holdCallSlot({ slot, ...form });
      window.location.href = url;
    } catch (err) {
      setError((err as { message?: string }).message || "Couldn't hold that time. Try again");
      setSending(false);
    }
  }

  return (
    <div className="docs-page call-page">
      <Link href="/products/" className="docs-back">
        ← Products
      </Link>
      <h1 className="font-serif docs-title">Book a call</h1>
      <p className="offer-price">
        {CALL.price} <span>· {CALL.minutes} min on Google Meet · {CALL.hours}</span>
      </p>

      {returned === "paid" && (
        <p className="offer-done call-banner" role="status">
          Paid. Your calendar invite with the Meet link is on its way to your email
        </p>
      )}
      {returned === "failed" && (
        <p className="offer-error call-banner" role="status">
          The payment didn&apos;t go through. Your time stays held for 15 minutes, pick it again to retry
        </p>
      )}

      {loadError && <p className="offer-error">Couldn&apos;t load times. Refresh to try again</p>}
      {!slots && !loadError && <p className="docs-empty">Loading times…</p>}
      {slots && slots.length === 0 && <p className="docs-empty">No open times in the next 2 weeks. Check back soon</p>}

      {slots && slots.length > 0 && (
        <>
          <div className="docs-tabs call-days" role="tablist" aria-label="Day">
            {[...byDay.keys()].map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={day === d}
                className={`docs-tab ${day === d ? "is-active" : ""}`}
                onClick={() => {
                  setDay(d);
                  setSlot(null);
                }}
              >
                {d}
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
                {timeLabel(s)} IST
              </button>
            ))}
          </div>
        </>
      )}

      {slot && (
        <form className="offer-card call-form" onSubmit={pay}>
          <p className="offer-title">
            {dayLabel(slot)}, {timeLabel(slot)} IST
          </p>
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
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            className="docs-search offer-input"
            required
            maxLength={500}
            rows={3}
            placeholder="What do you want to talk about?"
            aria-label="What do you want to talk about?"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />
          <button type="submit" className="btn-primary pro-offer-buy" disabled={sending}>
            {sending ? "Holding your time…" : `Pay ${CALL.price}`}
          </button>
          {error && <p className="offer-error">{error}</p>}
        </form>
      )}
    </div>
  );
}
