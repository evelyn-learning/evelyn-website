/**
 * Active seconds of a tutor session (resumed-session duration fix, 2026-10-03).
 *
 * A session can be resumed: same sessionId, a new page mount ("attempt").
 * Each mount measures its duration from its OWN start, and the session-usage
 * route used to $set `duration` from whichever mount saved last — so a resumed
 * embed session stored (and told the partner) its last sitting only: 515 s for
 * a 37-minute session.
 *
 * ONE definition, used everywhere a "how long was this session" figure is
 * shown or sent:
 *
 *   active seconds = the wall time covered by AT LEAST ONE attempt: the
 *   union of the attempts' [startedAt, startedAt + duration] intervals.
 *   Pauses between attempts are NOT counted. Sequential sittings (the normal
 *   resume) are simply added; attempts that overlap — two tabs or iframes on
 *   one sessionId — count their shared time once, not twice.
 *
 * Computed from the additive `attemptSpans` array (one entry per mount, keyed
 * by that mount's start); a session without spans — everything before
 * 2026-10-03 — keeps its stored `duration` as is.
 *
 * Pure and import-free on purpose: the session-usage route, the embed client,
 * the partner summary and the admin/replay pages all read it. Pinned by
 * scripts/test-session-active-seconds.ts.
 */

export interface AttemptSpan {
  /** Epoch ms of this attempt's (page mount's) start. */
  startedAtMs: number;
  /** Seconds this attempt ran, as last reported by that mount. */
  durationSec: number;
}

function toMs(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'string' || typeof v === 'number') return new Date(v).getTime();
  return NaN;
}

/** Tolerant read of the stored `attemptSpans` array (Dates, ISO strings or
 *  epoch ms). Malformed entries are dropped. Sorted by start. */
export function parseAttemptSpans(raw: unknown): AttemptSpan[] {
  if (!Array.isArray(raw)) return [];
  const out: AttemptSpan[] = [];
  for (const r of raw) {
    const startedAtMs = toMs((r as { startedAt?: unknown } | null)?.startedAt);
    const duration = (r as { duration?: unknown } | null)?.duration;
    if (!Number.isFinite(startedAtMs) || typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0) continue;
    out.push({ startedAtMs, durationSec: duration });
  }
  return out.sort((a, b) => a.startedAtMs - b.startedAtMs);
}

/** One entry per attempt start. Two entries for the same start are the same
 *  mount recorded twice (concurrent saves racing the upsert); a mount's
 *  duration only grows, so the longest report is the current one. */
export function dedupeAttemptSpans(spans: AttemptSpan[]): AttemptSpan[] {
  const byStart = new Map<number, number>();
  for (const s of spans) byStart.set(s.startedAtMs, Math.max(byStart.get(s.startedAtMs) ?? 0, s.durationSec));
  return Array.from(byStart, ([startedAtMs, durationSec]) => ({ startedAtMs, durationSec })).sort((a, b) => a.startedAtMs - b.startedAtMs);
}

/**
 * Active seconds of a set of attempts: the length of the UNION of their
 * [start, start + duration] intervals, each attempt start counted once.
 * Equal to the plain sum whenever no two attempts overlap (touching ones
 * included). Worked in whole milliseconds so sums stay exact.
 */
export function sumActiveSeconds(spans: AttemptSpan[]): number {
  let totalMs = 0;
  let coveredToMs = -Infinity;
  for (const s of dedupeAttemptSpans(spans)) { // sorted by start
    const endMs = s.startedAtMs + Math.round(s.durationSec * 1000);
    if (endMs <= coveredToMs) continue; // fully inside what is already counted
    totalMs += endMs - Math.max(s.startedAtMs, coveredToMs);
    coveredToMs = endMs;
  }
  return totalMs / 1000;
}

/**
 * The session's active seconds: from `attemptSpans` when it has any usable
 * entry, else the stored `duration` (sessions written before the spans
 * existed). null when the doc carries neither.
 */
export function sessionActiveSeconds(
  doc: { attemptSpans?: unknown; duration?: unknown } | null | undefined,
): number | null {
  const spans = parseAttemptSpans(doc?.attemptSpans);
  if (spans.length > 0) return sumActiveSeconds(spans);
  const d = doc?.duration;
  return typeof d === 'number' && Number.isFinite(d) && d >= 0 ? d : null;
}

/** Two starts this close are the same instant (ISO round-trips are exact;
 *  the slack only absorbs a Date re-serialised at lower precision). */
const SAME_START_MS = 1_000;

export interface AttemptSavePlan {
  /** A span to record for a PRE-FIELD session's earlier sitting(s) — see
   *  below. null in every other case. */
  seed: AttemptSpan | null;
  /** Active seconds NOT covered by the attempt saving now: the union of every
   *  attempt minus this attempt's own duration. So prior + own is exactly the
   *  union — time this mount shares with an overlapping attempt is credited
   *  to this mount and never counted a second time in `prior`. */
  priorActiveSec: number;
  /** What `duration` must be stored as: the union of all attempts including
   *  this one. null when this save carries no duration (lesson-progress
   *  checkpoints). */
  activeSec: number | null;
  /** What this mount's span must hold: the larger of the stored and the
   *  incoming duration (a mount's duration only grows; a smaller figure is an
   *  older save arriving late). null when this save carries no duration. */
  ownDurationSec: number | null;
  /** This mount's span is already in the document that was read. */
  ownRecorded: boolean;
  /** Length of the `attemptSpans` array that was read — the write is only
   *  valid while no span has been added since (buildAttemptSpanWrite). */
  spanCountRead: number;
}

/**
 * Server-side arithmetic for one session-usage save: given the document as it
 * stands and the saving mount's own start + duration, what is the session's
 * cumulative active time? The client's figure is only ever trusted for ITS
 * OWN attempt; the total is always rebuilt from the recorded spans.
 *
 * Seed: a session whose earlier sitting(s) predate `attemptSpans` has a
 * stored `duration` and no spans. When a NEW mount (different start) saves
 * into it, that stored figure is carried forward as a first span anchored at
 * the session's startedAt, rather than being overwritten by the new mount's
 * own duration (which is exactly the under-reporting this module fixes). It is
 * the best available figure, not a perfect one: if the old session was itself
 * resumed before the field existed, its stored `duration` already was the
 * last sitting only.
 *
 * The seed is capped at the wall time between the session's start and this
 * mount's start: earlier sittings cannot have run longer than that, so a
 * seed can never contain this mount's own seconds — whatever the stored
 * `duration` was. (The route also writes seed + span + duration in one
 * guarded update, so a cumulative `duration` never exists without its spans;
 * the cap is what makes a wrong seed harmless rather than compounding.)
 */
export function planAttemptSave(input: {
  existing: { startedAt?: unknown; duration?: unknown; attemptSpans?: unknown } | null | undefined;
  attemptStartMs: number;
  attemptDurationSec: number | null;
}): AttemptSavePlan {
  const { existing, attemptStartMs, attemptDurationSec } = input;
  const recorded = dedupeAttemptSpans(parseAttemptSpans(existing?.attemptSpans));
  const rawSpans: unknown = existing?.attemptSpans;
  const spanCountRead = Array.isArray(rawSpans) ? rawSpans.length : 0;
  let seed: AttemptSpan | null = null;
  if (recorded.length === 0 && existing) {
    const docStartMs = toMs(existing.startedAt);
    const d = existing.duration;
    if (
      Number.isFinite(docStartMs) && Math.abs(docStartMs - attemptStartMs) > SAME_START_MS &&
      typeof d === 'number' && Number.isFinite(d) && d > 0
    ) {
      const gapSec = (attemptStartMs - docStartMs) / 1000;
      seed = { startedAtMs: docStartMs, durationSec: gapSec > 0 ? Math.min(d, gapSec) : d };
    }
  }
  const stored = recorded.find((s) => s.startedAtMs === attemptStartMs) ?? null;
  const incoming = typeof attemptDurationSec === 'number' && Number.isFinite(attemptDurationSec) && attemptDurationSec >= 0 ? attemptDurationSec : null;
  const ownDurationSec = incoming == null ? null : Math.max(incoming, stored?.durationSec ?? 0);
  // A checkpoint save (no duration) still measures against this mount's
  // recorded span, when it has one.
  const ownForUnion = ownDurationSec ?? stored?.durationSec ?? null;
  const others = (seed ? [seed] : recorded).filter((s) => s.startedAtMs !== attemptStartMs);
  const unionSec = sumActiveSeconds(ownForUnion == null ? others : [...others, { startedAtMs: attemptStartMs, durationSec: ownForUnion }]);
  const priorActiveSec = Math.max(0, Math.round((unionSec - (ownForUnion ?? 0)) * 1000) / 1000);
  return {
    seed,
    priorActiveSec,
    activeSec: ownDurationSec == null ? null : unionSec,
    ownDurationSec,
    ownRecorded: stored != null,
    spanCountRead,
  };
}

/** The span part of one session-usage save, as plain Mongo update pieces the
 *  route merges into its single `findOneAndUpdate` (filter is ANDed with
 *  `{ sessionId }`). Dates, so the driver stores what the schema declares. */
export interface AttemptSpanWrite {
  filter: Record<string, unknown>;
  set: Record<string, unknown>;
  max: Record<string, number>;
  push: { attemptSpans: { $each: Array<{ startedAt: Date; duration: number; endedAt?: Date }> } } | null;
  /** Only a brand-new session may insert; an existing document that no
   *  longer matches the filter means "re-read and re-plan". */
  upsert: boolean;
}

/**
 * Turns a plan into ONE atomic write: the seed, this mount's span and the
 * cumulative `duration` land together or not at all — there is no window in
 * which `duration` is cumulative but the spans that explain it are missing
 * (the state that made a pre-spans session re-seed from its own total and
 * grow on every save).
 *
 *  - span already recorded → positional update of that span, matched by its
 *    start. `$max` on the span and on `duration`: neither ever decreases, so
 *    an older save arriving late changes nothing.
 *  - span not recorded → `$push` (seed first, when planned), guarded by
 *    "the array still has exactly the spans this plan was computed from"
 *    (`attemptSpans.<n>` must not exist; spans are only ever appended). A
 *    concurrent save that added a span — this mount's own, a seed, or another
 *    tab's — makes the guard miss; the route then re-reads and re-plans, so
 *    nothing is pushed twice and no stale total is stored.
 *
 * null when the save carries no duration (nothing to record).
 */
export function buildAttemptSpanWrite(input: {
  plan: AttemptSavePlan;
  attemptStartMs: number;
  endedAtMs: number | null;
  docExists: boolean;
}): AttemptSpanWrite | null {
  const { plan, attemptStartMs, endedAtMs, docExists } = input;
  if (plan.ownDurationSec == null || plan.activeSec == null) return null;
  const startedAt = new Date(attemptStartMs);
  const endedAt = endedAtMs != null && Number.isFinite(endedAtMs) ? new Date(endedAtMs) : null;
  if (plan.ownRecorded) {
    return {
      filter: { 'attemptSpans.startedAt': startedAt },
      set: endedAt ? { 'attemptSpans.$.endedAt': endedAt } : {},
      max: { 'attemptSpans.$.duration': plan.ownDurationSec, duration: plan.activeSec },
      push: null,
      upsert: false, // the positional operator cannot be used on an insert
    };
  }
  const seed = plan.seed ? [{ startedAt: new Date(plan.seed.startedAtMs), duration: plan.seed.durationSec }] : [];
  return {
    filter: { [`attemptSpans.${plan.spanCountRead}`]: { $exists: false } },
    set: {},
    max: { duration: plan.activeSec },
    push: { attemptSpans: { $each: [...seed, { startedAt, duration: plan.ownDurationSec, ...(endedAt ? { endedAt } : {}) }] } },
    upsert: !docExists,
  };
}

/**
 * After the span write: the `duration` the document SHOULD hold when what it
 * holds is behind its own spans, else null.
 *
 * Why it can be behind (found against a real MongoDB, 2026-10-04): a save
 * whose span is already recorded is not guarded on the OTHER spans — two
 * mounts saving at the same moment each compute the union from the other's
 * previous duration, and `$max` keeps the larger of two stale totals (A 100→130
 * and B 50→70 stored 180, spans said 200). The spans themselves are always
 * right ($max per span), so the route re-derives the union from the document
 * its own write returned and raises `duration` to it. The writer whose span
 * landed last sees every span, `$max` keeps the largest, and a union only
 * grows — so the last word is the true union whatever the interleaving.
 *
 * Only ever RAISES: a stored `duration` above the union (a capped seed) is
 * left alone, as `$max` in the main write leaves it.
 */
export function durationBehindSpans(
  doc: { attemptSpans?: unknown; duration?: unknown } | null | undefined,
): number | null {
  const spans = parseAttemptSpans(doc?.attemptSpans);
  if (spans.length === 0) return null;
  const union = sumActiveSeconds(spans);
  const d = doc?.duration;
  return typeof d === 'number' && Number.isFinite(d) && d >= union ? null : union;
}

/** Defensive read of a server-computed seconds field off a JSON response. */
export function readActiveSecondsField(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
}

/**
 * The `duration` the embed reports in `evelyn:session_ended`: this mount's
 * own seconds plus the last prior total the server told it (active time this
 * mount does not itself cover — see AttemptSavePlan.priorActiveSec). With no
 * known prior total (first sitting, or the request never answered) it is this
 * mount's duration — the message is never held up waiting for the server.
 */
export function endedDurationSeconds(mountSec: number, priorActiveSec: number | null | undefined): number {
  const prior = readActiveSecondsField(priorActiveSec) ?? 0;
  return Math.round(mountSec + prior);
}
