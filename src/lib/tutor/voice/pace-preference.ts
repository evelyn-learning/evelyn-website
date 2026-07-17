/**
 * Pace-bias default + resume derivation (Task Y5, round 14).
 *
 * Task Y5 product decision: default `paceBias` to -1 ("slow") for ALL new
 * sessions, rather than the old neutral 0. Rationale — slower-by-default
 * is the better pedagogical default, and it's still fully adjustable via
 * the Slow down / Speed up controls (clamps unchanged, -2..+2).
 *
 * Persisted `evelyn:pacing-v2:<planId>` state still wins on resume — a
 * student who explicitly dialed to +1 (or back down to 0 = "normal") keeps
 * that choice; only a session with NO persisted paceBias field at all gets
 * the new -1 default.
 *
 * "Never set" vs "explicitly set to 0" — what we found, what we did:
 *   Before Y5, `persistPacingState` (VoiceTutorRealtime.tsx) wrote
 *   `paceBias: paceBiasRef.current` UNCONDITIONALLY on every save
 *   (unmount / visibilitychange / step), including when the student never
 *   touched the pace controls at all (ref stayed at its 0 default). The
 *   resume-read side then special-cased `prior.paceBias !== 0` to mean
 *   "nothing to restore" — i.e. it treated EVERY stored 0 (touched or not)
 *   as absence, and would silently apply the ambient default in its place.
 *   So pre-Y5, the blob does NOT distinguish "never set" from "explicitly
 *   set to 0" — both serialize to the same `paceBias: 0` field, and the
 *   restore path could not have honored an explicit 0 even if it wanted to.
 *
 *   Y5 changes the derivation (this module) to treat ANY numeric
 *   `paceBias` field as an explicit, honor-it value — including 0 — and
 *   reserves the new -1 default for the truly-absent case (no field on
 *   the blob at all, e.g. a brand-new plan with no prior localStorage
 *   entry). Because the in-session default is no longer 0 but -1, an
 *   untouched NEW session no longer accidentally persists a `0` that
 *   could later be misread as "explicit" — only an intentional step to 0
 *   does. The one residual gap: a blob written by PRE-Y5 code (where an
 *   untouched session could have written `paceBias: 0`) will be read by
 *   the new logic as if it were an explicit "normal" choice, applying 0
 *   instead of the new -1 default for that one resume. This is a
 *   one-time, self-healing edge case (bounded by the existing 30-day TTL
 *   on the blob, and one click away from the new default), accepted as
 *   the pragmatic trade-off rather than adding a schema-version bump for
 *   a cosmetic pacing preference.
 *
 * Pure — no React, no DOM, no storage access — so it's usable identically
 * from the client component (VoiceTutorRealtime.tsx) and from unit tests
 * (test-pace-preference-block.ts).
 */

/** Default pace bias applied to a session with no persisted preference. */
export const DEFAULT_PACE_BIAS = -1;

/**
 * Resolve the paceBias a session should start at, given the parsed prior
 * pacing-v2 blob for this plan (or null/undefined if none / stale / absent).
 * Any numeric `paceBias` field — including 0 — is treated as an explicit
 * prior choice and wins over the default. Clamped to the same -2..+2 range
 * `stepPaceBias` enforces.
 *
 * Round-15 Issue 6 (2026-07-16): fresh-vs-resume gating. Observed live: a
 * discarded session's paceBias — nudged POSITIVE by verbal-cue detection
 * (STT mishears, content phrases like "the car speeds up") — persisted in
 * the plan-keyed blob and a brand-NEW session on the same curated plan
 * started at "Pace: fast" despite the Y5 slow-by-default. The gate:
 *   - RESUME (`opts.isResume` true): any numeric bias restores, marked or
 *     not — mid-session continuity keeps whatever pace the session was
 *     actually running at (legacy blobs included).
 *   - FRESH start: only a bias the student chose via the pace BUTTONS
 *     (`paceBiasSource === 'button'`, written by persistPacingState since
 *     this fix) counts as a durable preference. Cue-derived values and
 *     legacy unmarked blobs fall back to DEFAULT_PACE_BIAS.
 * Called without `opts` the function behaves like the pre-fix (resume)
 * path — acceptable only because the single call site passes opts
 * explicitly; kept for the pinned Y5 characterization tests.
 */
export function resolvePaceBiasOnLoad(
  prior: { paceBias?: number; paceBiasSource?: string } | null | undefined,
  opts?: { isResume?: boolean },
): number {
  if (prior && typeof prior.paceBias === 'number' && Number.isFinite(prior.paceBias)) {
    const isFreshStart = opts !== undefined && !opts.isResume;
    if (isFreshStart && prior.paceBiasSource !== 'button') {
      return DEFAULT_PACE_BIAS;
    }
    return Math.max(-2, Math.min(2, Math.round(prior.paceBias)));
  }
  return DEFAULT_PACE_BIAS;
}
