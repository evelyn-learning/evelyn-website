// Pure funnel aggregation for GET /api/beacon/v1/funnel. The route only queries;
// all bucketing (UTC days, inclusive range, zero-filled) happens here.

export const FUNNEL_MAX_DAYS = 92;
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface FunnelDay {
  date: string;
  demoOpens: Record<string, number>;
  demoEngaged: Record<string, number>;
  tutorDemoSignups: number;
  contactForms: number;
}

export interface FunnelRows {
  demos: Array<{ productId: string; startedAt: Date; engaged: boolean }>;
  signups: Array<{ createdAt: Date }>;
  contacts: Array<{ createdAt: Date }>;
}

function parseDay(s: string | null | undefined): Date | null {
  if (!s || !DATE_RE.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  // Reject roll-over dates like 2026-02-31.
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) return null;
  return d;
}

export function parseFunnelRange(
  from: string | null | undefined,
  to: string | null | undefined
): { ok: true; start: Date; endExclusive: Date } | { ok: false; error: string } {
  const start = parseDay(from);
  const end = parseDay(to);
  if (!start || !end) return { ok: false, error: "from and to must be YYYY-MM-DD" };
  if (end < start) return { ok: false, error: "to is before from" };
  const days = Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
  if (days > FUNNEL_MAX_DAYS) return { ok: false, error: `range exceeds ${FUNNEL_MAX_DAYS} days` };
  return { ok: true, start, endExclusive: new Date(end.getTime() + DAY_MS) };
}

const dayKey = (d: Date) => new Date(d).toISOString().slice(0, 10);

export function bucketFunnel(rows: FunnelRows, from: string, to: string): FunnelDay[] {
  const range = parseFunnelRange(from, to);
  if (!range.ok) throw new Error(range.error);

  const byDate = new Map<string, FunnelDay>();
  const out: FunnelDay[] = [];
  for (let t = range.start.getTime(); t < range.endExclusive.getTime(); t += DAY_MS) {
    const day: FunnelDay = { date: dayKey(new Date(t)), demoOpens: {}, demoEngaged: {}, tutorDemoSignups: 0, contactForms: 0 };
    byDate.set(day.date, day);
    out.push(day);
  }

  for (const d of rows.demos) {
    const day = byDate.get(dayKey(d.startedAt));
    if (!day) continue;
    day.demoOpens[d.productId] = (day.demoOpens[d.productId] ?? 0) + 1;
    if (d.engaged) day.demoEngaged[d.productId] = (day.demoEngaged[d.productId] ?? 0) + 1;
  }
  for (const s of rows.signups) {
    const day = byDate.get(dayKey(s.createdAt));
    if (day) day.tutorDemoSignups++;
  }
  for (const c of rows.contacts) {
    const day = byDate.get(dayKey(c.createdAt));
    if (day) day.contactForms++;
  }
  return out;
}
