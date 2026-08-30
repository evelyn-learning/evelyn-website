/**
 * Atomic reserve-then-rollback quota counters (Crimsora's dailyCounter
 * pattern, ported). The load-bearing property: reservation is ONE
 * findOneAndUpdate whose filter carries `count: { $lt: cap }`, so two
 * concurrent starts can never both squeeze under the cap, and a failed later
 * step hands its slot back with a best-effort `$inc: -1`.
 */

import { TutorDemoCounter } from '@/models/TutorDemoCounter';
import { TutorDemoLead } from '@/models/TutorDemoLead';

/** UTC day key — quotas roll at 00:00 UTC like Crimsora's. */
export function utcDateKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Start of UTC day + 2 — TTL with a full day of slack for admin forensics. */
function counterExpiresAt(now: Date = new Date()): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2));
  return d;
}

/**
 * Reserve one slot under `cap` for `key`. true = reserved; false = cap hit.
 * cap <= 0 means the dimension is disabled → false (deny) is wrong for a
 * kill-signal, so a non-positive cap returns true (dimension not enforced) —
 * turning a limit off must widen access, not close the demo.
 */
export async function reserveCounter(key: string, cap: number, now: Date = new Date()): Promise<boolean> {
  if (cap <= 0) return true;
  const attempt = (upsert: boolean) =>
    TutorDemoCounter.findOneAndUpdate(
      { key, count: { $lt: cap } },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: counterExpiresAt(now) } },
      { upsert, new: true },
    );
  try {
    return (await attempt(true)) !== null;
  } catch (err: unknown) {
    // E11000: either a concurrent insert raced ours, or the doc exists with
    // count >= cap so the filter missed and the upsert tried to insert a
    // duplicate key. Retry WITHOUT upsert — cleanly returns null at-cap
    // instead of surfacing a 500. (Crimsora's exact semantics.)
    const code = (err as { code?: number } | null)?.code;
    if (code === 11000) return (await attempt(false)) !== null;
    throw err;
  }
}

/** Best-effort. Never throws — a failed rollback must not mask the real error. */
export async function rollbackCounter(key: string): Promise<void> {
  try {
    await TutorDemoCounter.updateOne({ key, count: { $gt: 0 } }, { $inc: { count: -1 } });
  } catch {
    /* ignore */
  }
}

/**
 * Reserve one lifetime start for `email` (and stamp the lead's identity
 * fields). Same atomic $lt pattern, applied to TutorDemoLead.startCount.
 */
export async function reserveLead(opts: {
  email: string;
  name: string;
  cap: number;
  ip?: string;
  now?: Date;
}): Promise<boolean> {
  const { email, name, cap, ip } = opts;
  const now = opts.now ?? new Date();
  if (cap <= 0) {
    // Dimension disabled — still record the lead (it's the funnel), no cap.
    await TutorDemoLead.updateOne(
      { email },
      {
        $inc: { startCount: 1 },
        $set: { name, lastStartAt: now },
        ...(ip ? { $addToSet: { ips: ip } } : {}),
      },
      { upsert: true },
    ).catch(() => {});
    return true;
  }
  const attempt = (upsert: boolean) =>
    TutorDemoLead.findOneAndUpdate(
      { email, startCount: { $lt: cap } },
      {
        $inc: { startCount: 1 },
        $set: { name, lastStartAt: now },
        ...(ip ? { $addToSet: { ips: ip } } : {}),
      },
      { upsert, new: true },
    );
  try {
    return (await attempt(true)) !== null;
  } catch (err: unknown) {
    const code = (err as { code?: number } | null)?.code;
    if (code === 11000) return (await attempt(false)) !== null;
    throw err;
  }
}

/** Best-effort lead rollback (a later reservation failed). Never throws. */
export async function rollbackLead(email: string): Promise<void> {
  try {
    await TutorDemoLead.updateOne({ email, startCount: { $gt: 0 } }, { $inc: { startCount: -1 } });
  } catch {
    /* ignore */
  }
}
