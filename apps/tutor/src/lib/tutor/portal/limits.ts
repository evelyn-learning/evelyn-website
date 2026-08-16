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
 * PORTAL_LIMITS_MODE=report-only logs what WOULD be blocked and allows it —
 * but only a GENUINE reject skips metering (see the burst section below): a
 * report-only "would-block" is still served, so it is still counted. Fix
 * round 1 (I1) found the original code exiting before the day bump on every
 * burst block, report-only or not, which silently dropped exactly the
 * over-limit traffic the report-only rollout step exists to measure.
 *
 * `dailyQuota` is enforced PER ENDPOINT, not per partner — the key includes
 * `endpoint`, so a partner's real daily ceiling across N allowed endpoints is
 * `dailyQuota × N`, not `dailyQuota`. Someone will set 10000 expecting a
 * partner-wide cap; there is no partner-wide counter today.
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

// Logged at most once per process — isDBConfigured() reads a value `@core/db`
// captures from process.env at MODULE LOAD, so a process started without
// MONGODB_URI stays unmetered for its whole lifetime even if the var is
// later set in the environment; that's worth one loud line, not one per
// request.
let warnedNoDb = false;

// Logged at most once per process, the first time the limiter runs with
// PORTAL_LIMITS_MODE unset. Unset means ENFORCE (spec §10.1) — a deliberate,
// twice-corrected decision — but that also means a deploy that FORGOT to set
// `PORTAL_LIMITS_MODE=report-only` starts enforcing 60 req/min per (partner,
// endpoint) on live traffic from its first request. Without this line the
// only evidence of the mistake is the 429s themselves. It changes no
// limiting decision whatsoever; it just makes a forgotten flag visible in
// the logs.
let warnedLimitsModeUnset = false;

/** Test seam: lets the hermetic limits tests re-arm the once-per-process
 *  warnings above so their assertions do not depend on suite ordering.
 *  Production never calls this. */
export function __resetLimitsWarningsForTests(): void {
  warnedNoDb = false;
  warnedLimitsModeUnset = false;
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
    if (!isDBConfigured()) {
      if (!warnedNoDb) {
        console.warn('[portal/limits] MONGODB_URI not configured — all burst limiting, quota and metering are OFF for this process');
        warnedNoDb = true;
      }
      return 0;
    }
    await connectDB();
    try {
      const doc = await PartnerCounterModel.findOneAndUpdate(
        key,
        { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, new: true },
      ).lean<{ count: number }>().exec();
      return doc?.count ?? 1;
    } catch (err) {
      const e = err as { code?: number; codeName?: string };
      if (e.code !== 11000 && e.codeName !== 'DuplicateKey') throw err;
      // Two concurrent first-requests for a not-yet-existing window both hit
      // the upsert; the loser surfaces E11000 (same shape as
      // student-profile/store.ts's resolveProfileId — "the loser would
      // surface E11000 to a legitimate student"). The winner already
      // created the document, so re-issue the SAME $inc WITHOUT upsert: it
      // now targets an existing row and cannot race a second time.
      const retryDoc = await PartnerCounterModel.findOneAndUpdate(
        key,
        { $inc: { count: 1 } },
        { upsert: false, new: true },
      ).lean<{ count: number }>().exec();
      if (!retryDoc) {
        throw new Error(
          `[portal/limits] bump: upsert reported a duplicate for ${JSON.stringify(key)} but no row was found on retry`,
        );
      }
      return retryDoc.count;
    }
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
  // `!= null` (not `> 0`): dailyQuota: 0 means "block everything", not
  // "unlimited" — an operator zeroing a delinquent partner should get the
  // opposite of unlimited. (Fix round 1, minor.)
  const hasQuota = partner.limits.dailyQuota != null;
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

  // --- burst: fails OPEN ---------------------------------------------------
  // `rpm` was captured on every partner record but never enforced on its
  // own — burst's window IS a minute, so burst already measures requests-
  // per-minute over the same window rpm names. The effective cap is
  // whichever of the two is tighter; a non-positive value means "no cap"
  // for that field individually. (Fix round 1, minor: rpm was dead config.)
  const burstCaps = [partner.limits.rpm, partner.limits.burst].filter((n) => n > 0);
  const burstCap = burstCaps.length > 0 ? Math.min(...burstCaps) : 0;

  if (deps.env.PORTAL_LIMITS_MODE === undefined && !warnedLimitsModeUnset) {
    warnedLimitsModeUnset = true;
    console.warn(
      `[portal/limits] PORTAL_LIMITS_MODE is not set — limits are ENFORCED (unset means enforce, spec §10.1). ` +
        `Effective caps for the first partner seen (partner=${partner.partnerId} endpoint=${endpoint}): ` +
        `${burstCap > 0 ? `${burstCap} req/min` : 'no burst cap'} per (partner, endpoint), ` +
        `dailyQuota=${partner.limits.dailyQuota ?? 'none'} per (partner, endpoint). ` +
        `Set PORTAL_LIMITS_MODE=report-only to meter without blocking.`,
    );
  }

  let burstVerdict: LimitVerdict | null = null;
  try {
    const count = await deps.bump({
      partnerId: partner.partnerId, endpoint,
      windowKind: 'minute', windowStart: minuteWindow(nowMs),
    });
    if (burstCap > 0 && count > burstCap) {
      const retryAfterSec = Math.ceil((60_000 - (nowMs % 60_000)) / 1000);
      burstVerdict = block({ ok: false, status: 429, reason: 'rate_limited', retryAfterSec });
    }
  } catch (err) {
    console.error(
      `[portal/limits] burst counter unavailable for partner=${partner.partnerId} — failing OPEN`,
      err,
    );
    // Deliberately fall through and serve the request.
  }

  // A GENUINE reject (report-only ones were already converted to
  // `{ ok: true }` by block() above) skips the day bump below: a request
  // that was never served should not be metered/billed. A report-only
  // "would-block" deliberately falls through instead — see the file header
  // (I1): the whole point of report-only is to measure the over-limit
  // traffic, so it has to be counted, not dropped.
  if (burstVerdict && !burstVerdict.ok) {
    return burstVerdict;
  }

  // --- quota + metering: fails CLOSED, but only when a quota exists -------
  // NOT Promise.all'd with the burst bump above, on purpose: whether this
  // bump runs at all depends on the burst outcome (a genuine reject returns
  // above and never reaches here), so the two calls cannot be made
  // unconditionally concurrent without re-metering rejected requests.
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
