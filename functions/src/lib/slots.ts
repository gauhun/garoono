// Paid 30 minute calls: every day 20:00–22:00 IST. IST has no DST, so a fixed offset is exact
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const STARTS_IST = ["20:00", "20:30", "21:00", "21:30"];
export const SLOT_MS = 30 * 60 * 1000;
export const HOLD_MS = 15 * 60 * 1000;
const MIN_NOTICE_MS = 2 * 60 * 60 * 1000;
const MAX_AHEAD_MS = 14 * 24 * 60 * 60 * 1000;

export type Interval = { start: number; end: number };
export type SlotDoc = { status?: string; holdId?: string; holdUntil?: number; paymentId?: string };

// Canonical slot id: UTC ISO with milliseconds, e.g. 2026-10-29T14:30:00.000Z (20:00 IST)
export function generateSlots(now: number, busy: Interval[], taken: Set<string>): string[] {
  const out: string[] = [];
  const firstDayIst = Math.floor((now + IST_OFFSET_MS) / 86_400_000) * 86_400_000;
  for (let day = firstDayIst; day - IST_OFFSET_MS <= now + MAX_AHEAD_MS; day += 86_400_000) {
    for (const hm of STARTS_IST) {
      const [h, m] = hm.split(":").map(Number);
      const start = day - IST_OFFSET_MS + (h * 60 + m) * 60_000;
      if (start < now + MIN_NOTICE_MS || start > now + MAX_AHEAD_MS) continue;
      const end = start + SLOT_MS;
      if (busy.some((b) => b.start < end && b.end > start)) continue;
      const id = new Date(start).toISOString();
      if (!taken.has(id)) out.push(id);
    }
  }
  return out;
}

// A slot is taken while booked, or while someone's hold has not run out
export function isTaken(slot: SlotDoc | undefined, now: number) {
  if (!slot) return false;
  if (slot.status === "booked") return true;
  return slot.status === "held" && (slot.holdUntil ?? 0) > now;
}

// What the webhook does with a paid call: book it, ignore a retry, or refund
export function bookingDecision(slot: SlotDoc | undefined, holdId: string, paymentId: string): "book" | "duplicate" | "refund" {
  if (slot?.status === "booked") return slot.paymentId === paymentId ? "duplicate" : "refund";
  // A late payer keeps the slot if nobody else has held it since
  return slot?.status === "held" && slot.holdId === holdId ? "book" : "refund";
}

export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
