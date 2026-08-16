/**
 * Per-partner burst, quota and metering (M1c Task 7).
 *
 * Failure policy, and why the two halves differ (spec section 6.1):
 *   - BURST fails OPEN. Crimsora is live paying traffic; serving an unmetered
 *     request beats 503-ing a student mid-session.
 *   - QUOTA fails CLOSED, but ONLY for partners that actually have a
 *     dailyQuota configured. Without that carve-out the two policies
 *     contradict each other: both counters share a store, so a store outage
 *     would trip fail-closed and the fail-open would never matter. No partner
 *     has a quota today, so an outage degrades to unmetered service rather
 *     than refusing traffic — fail-closed protects revenue only where there
 *     is revenue to protect.
 *
 * These policies are mostly theoretical, not load-bearing: MongoDB (not the
 * Redis already on the box) is the counter store, and Mongo is also the
 * engine's primary datastore — without it there are no profiles, plans or
 * sessions either, so "counters down but engine serving" is close to
 * unreachable. That is a real advantage of this choice over Redis, which
 * would be an INDEPENDENT failure mode the engine would otherwise survive —
 * do not "fix" this by adding Redis; that would make these policies
 * load-bearing for the first time, not safer.
 *
 * PORTAL_LIMITS_MODE=report-only logs what WOULD be blocked and allows it.
 */
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerCounterModel } from '@/models/PartnerCounter';
import type { PartnerRecord } from './registry';

export type LimitVerdict =
  | { ok: true }
  | { ok: false; status: 429 | 402; reason: string; retryAfterSec?: number };

export interface LimitsDeps {
  /** Increment and return the new count for one window. */
  bump(key: {
    partnerId: string; endpoint: string;
    windowKind: 'minute' | 'day'; windowStart: string;
  }): Promise<number>;
  now(): number;
  env: NodeJS.ProcessEnv;
}

const defaultLimitsDeps: LimitsDeps = {
  async bump(key) {
    // No DB configured at all (a hermetic env-only test, or before this app
    // has ever been pointed at Mongo) mirrors registry.ts's defaultDeps:
    // treated as "no counters exist", not as a store outage — returns 0 so
    // no window is ever seen as populated. A REAL outage (MONGODB_URI set
    // but connect failing) still throws out of connectDB() below,
    // uncaught, and is handled by the fail-open/fail-closed policy in
    // checkPartnerLimits — this guard only short-circuits the "no DB at
    // all" case, it does not add error-swallowing for a misconfigured-but-
    // present DB.
    if (!isDBConfigured()) return 0;
    await connectDB();
    const doc = await PartnerCounterModel.findOneAndUpdate(
      key,
      { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true },
    ).lean<{ count: number }>().exec();
    return doc?.count ?? 1;
  },
  now: () => Date.now(),
  env: process.env,
};

function minuteWindow(ms: number): string {
  return new Date(Math.floor(ms / 60_000) * 60_000).toISOString();
}
function dayWindow(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export async function checkPartnerLimits(
  partner: PartnerRecord,
  endpoint: string,
  deps: LimitsDeps = defaultLimitsDeps,
): Promise<LimitVerdict> {
  const reportOnly = deps.env.PORTAL_LIMITS_MODE === 'report-only';
  const hasQuota =
    typeof partner.limits.dailyQuota === 'number' && partner.limits.dailyQuota > 0;
  const nowMs = deps.now();

  const block = (v: Exclude<LimitVerdict, { ok: true }>): LimitVerdict => {
    if (reportOnly) {
      console.warn(
        `[portal/limits] would-block partner=${partner.partnerId} endpoint=${endpoint} reason=${v.reason}`,
      );
      return { ok: true };
    }
    return v;
  };

  // --- burst: fails OPEN -------------------------------------------------
  try {
    const count = await deps.bump({
      partnerId: partner.partnerId, endpoint,
      windowKind: 'minute', windowStart: minuteWindow(nowMs),
    });
    if (partner.limits.burst > 0 && count > partner.limits.burst) {
      const retryAfterSec = Math.ceil((60_000 - (nowMs % 60_000)) / 1000);
      return block({ ok: false, status: 429, reason: 'rate_limited', retryAfterSec });
    }
  } catch (err) {
    console.error(
      `[portal/limits] burst counter unavailable for partner=${partner.partnerId} — failing OPEN`,
      err,
    );
    // Deliberately fall through and serve the request.
  }

  // --- quota + metering: fails CLOSED, but only when a quota exists -------
  try {
    const count = await deps.bump({
      partnerId: partner.partnerId, endpoint,
      windowKind: 'day', windowStart: dayWindow(nowMs),
    });
    if (hasQuota && count > (partner.limits.dailyQuota as number)) {
      return block({ ok: false, status: 402, reason: 'quota_exceeded' });
    }
  } catch (err) {
    console.error(
      `[portal/limits] day counter unavailable for partner=${partner.partnerId} — ` +
        `failing ${hasQuota ? 'CLOSED (quota configured)' : 'OPEN (no quota configured)'}`,
      err,
    );
    if (hasQuota) {
      return block({ ok: false, status: 402, reason: 'quota_unverifiable' });
    }
  }

  return { ok: true };
}
