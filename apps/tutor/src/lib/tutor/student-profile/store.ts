/**
 * Student profile storage + mutation helpers.
 *
 * Two layers:
 *   - persistence (MongoDB) for retail-logged-in students and B2B
 *     partners with persistent ids.
 *   - in-memory shim for the demo flow where there's no persistent
 *     identity. The shim is keyed by sessionId → ephemeral profile;
 *     the brain still gets a profile to read, but nothing survives
 *     the session.
 *
 * Load semantics: getOrCreate(id) — never returns null. A new profile
 * is empty (no mastery, no gaps, no recent sessions) but valid.
 *
 * Mutation helpers are designed to be called at session END, not
 * mid-turn. Mid-turn updates are accumulated in a SessionAccumulator
 * (lives in the orchestrator) and committed in one shot.
 */

import { randomUUID } from 'node:crypto';
import connectDB from '@core/db';
import { StudentProfileModel, toStudentProfile, type IStudentProfileDoc } from '@/models/StudentProfile';
import {
  type StudentProfile,
  type StudentPreferences,
  type MasteryEntry,
  type GapEntry,
  type GapEvidence,
  type GapSignalCode,
  type RecapRecord,
  type SessionMemory,
  type PlanContentFillings,
  type PlanContentSeen,
  STUDENT_PROFILE_SCHEMA_VERSION,
  RECENT_SESSIONS_CAP,
  PLAN_CONTENT_SEEN_CAP,
} from './types';

/** Promotion threshold: candidate → confirmed when single-session
 *  confidence reaches this. Cross-session promotion fires when the
 *  same gap re-triggers in 2+ distinct sessions regardless of confidence. */
const CONFIDENCE_PROMOTE_THRESHOLD = 0.75;
/** Confidence formula divisor — 4 signals = full confidence. */
const SIGNAL_CONFIDENCE_DENOMINATOR = 4;
/** Cap on accumulated student quotes per gap (keeps the entry small). */
const STUDENT_QUOTES_CAP = 4;
/** Mastery-delta threshold below which `applyCrossSessionPromotion`
 *  treats a segment-completion as evidence the student re-demonstrated
 *  an existing gap. Strict less-than: a delta of exactly 0.5 does NOT
 *  trigger. Tunable from telemetry — if false-positive rate is high
 *  (segments at 0.4 promoting gaps for students who actually recovered
 *  with scaffolding), tighten toward 0.2 or 0.0. If false-negative rate
 *  is high (clear struggles at 0.6 not promoting), loosen toward 0.7. */
const CROSS_SESSION_PROMOTION_DELTA_THRESHOLD = 0.5;
/** Cumulative mastery score above which `resolveSettledGaps` will
 *  auto-resolve an open LO gap. Aligned with render.ts SCORE_LABEL where
 *  ≥ 0.8 reads as "strong." Inclusive (>= so 0.8 exactly resolves). */
export const GAP_RESOLVE_SCORE_THRESHOLD = 0.8;
/** Minimum exposures required for resolution. Single-shot 0.8 from one
 *  attempt could be a lucky answer; require sustained performance.
 *  Aligned with applyMasteryDeltas confidence band: ≥ 3 exposures
 *  reads as "medium" or higher. Inclusive. */
export const GAP_RESOLVE_EXPOSURES_THRESHOLD = 3;
/** Lazy-decay TTL for candidate gaps. Past this age (since lastSeenAt,
 *  with no re-trigger), candidates are treated as stale by `isGapStale`
 *  and hidden from the rendered <student_profile> block. Underlying
 *  data is preserved so thresholds can be retuned from telemetry without
 *  losing history. 21 days = ~3 weeks: long enough for the student to
 *  re-encounter the LO, short enough to clear single-bad-day false
 *  positives. Strict greater-than (a 21-day-old gap is NOT stale yet). */
const GAP_DECAY_CANDIDATE_DAYS = 21;
/** TTL for confirmed gaps. Longer because confirmed signals are stronger
 *  and warrant more patience for the student to demonstrate growth.
 *  90 days = roughly one school quarter. Legacy 'open' status uses the
 *  same TTL as confirmed. */
const GAP_DECAY_CONFIRMED_DAYS = 90;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
/** Confidence cap for gaps whose first (or only) record came from the
 *  orchestrator's behavioural inference rather than a brain tool call.
 *  Inference is a weaker signal than a brain-observed misconception, so
 *  it must never single-session-promote a gap to 'confirmed' — only
 *  cross-session re-triggering (sessionIds.length >= 2) can. */
export const INFERRED_CONFIDENCE_CAP = 0.5;

function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function computeConfidence(signals: GapSignalCode[]): number {
  return clamp01(signals.length / SIGNAL_CONFIDENCE_DENOMINATOR);
}

/** Ephemeral fallback when DB is unavailable (demo / unauthenticated). */
const ephemeralStore = new Map<string, StudentProfile>();

function emptyProfile(id: string): StudentProfile {
  const now = new Date().toISOString();
  return {
    id,
    mastery: {},
    gaps: [],
    recentSessions: [],
    preferences: {},
    createdAt: now,
    updatedAt: now,
    schemaVersion: STUDENT_PROFILE_SCHEMA_VERSION,
  };
}

export async function getOrCreateStudentProfile(id: string): Promise<StudentProfile> {
  if (!id) throw new Error('getOrCreateStudentProfile: id is required');
  // DB path — falls back to ephemeral on error.
  try {
    await connectDB();
    const doc = await StudentProfileModel.findById(id);
    if (doc) return toStudentProfile(doc as IStudentProfileDoc);
    const fresh = emptyProfile(id);
    await StudentProfileModel.create({ _id: id, ...fresh });
    return fresh;
  } catch {
    const cached = ephemeralStore.get(id);
    if (cached) return cached;
    const fresh = emptyProfile(id);
    ephemeralStore.set(id, fresh);
    return fresh;
  }
}

export async function getStudentProfile(id: string): Promise<StudentProfile | null> {
  if (!id) return null;
  try {
    await connectDB();
    const doc = await StudentProfileModel.findById(id);
    return doc ? toStudentProfile(doc as IStudentProfileDoc) : null;
  } catch {
    return ephemeralStore.get(id) ?? null;
  }
}

/** Save a profile. Updates `updatedAt` and prunes recentSessions. */
export async function saveStudentProfile(profile: StudentProfile): Promise<StudentProfile> {
  const next: StudentProfile = {
    ...profile,
    recentSessions: profile.recentSessions.slice(-RECENT_SESSIONS_CAP),
    updatedAt: new Date().toISOString(),
    schemaVersion: STUDENT_PROFILE_SCHEMA_VERSION,
  };
  try {
    await connectDB();
    await StudentProfileModel.findByIdAndUpdate(
      next.id,
      { $set: next },
      { upsert: true, new: true },
    );
  } catch {
    ephemeralStore.set(next.id, next);
  }
  return next;
}

/** Apply a list of mastery deltas to a profile. Each delta nudges the
 *  per-LO score toward 1 (for positive) or 0 (for negative), bounded
 *  to [0,1]. Exposures increment by 1 per delta. lastTouchedAt updates
 *  to now. Returns the mutated profile (does not save). */
export function applyMasteryDeltas(
  profile: StudentProfile,
  deltas: Array<{ loId: string; delta: number }>,
): StudentProfile {
  const now = new Date().toISOString();
  const mastery = { ...profile.mastery };
  for (const { loId, delta } of deltas) {
    if (!loId) continue;
    const prev: MasteryEntry = mastery[loId] ?? {
      loId, score: 0.5, exposures: 0, lastTouchedAt: now,
    };
    // Step toward 1 for positive, toward 0 for negative.
    const target = delta >= 0 ? 1 : 0;
    const stepSize = Math.min(1, Math.abs(delta));
    const score = prev.score + (target - prev.score) * stepSize * 0.4;
    mastery[loId] = {
      loId,
      score: Math.max(0, Math.min(1, score)),
      exposures: prev.exposures + 1,
      lastTouchedAt: now,
      confidence: prev.exposures + 1 >= 5 ? 'high' : prev.exposures + 1 >= 2 ? 'medium' : 'low',
    };
  }
  return { ...profile, mastery };
}

/** Input shape for recordGap — already merged signals (brain-emitted +
 *  orchestrator-stamped) and a sessionId for cross-session promotion
 *  bookkeeping. */
export interface RecordGapInput {
  kind: 'lo' | 'prerequisite';
  /** Required when kind='lo'. */
  loId?: string;
  /** Required when kind='prerequisite'. Free-form English. */
  conceptLabel?: string;
  observation: string;
  studentQuotes: string[];
  signals: GapSignalCode[];
  /** Session in which this gap was triggered. Used for cross-session
   *  promotion (a candidate fired in 2+ distinct sessions promotes to
   *  confirmed regardless of single-session confidence). */
  sessionId: string;
  /** How many times this record represents a RECURRENCE of the same gap
   *  (ledger count from the orchestrator's struggle-ledger). Summed into
   *  evidence.recurrenceCount on merge. */
  recurrences?: number;
  /** True when this record came from the orchestrator's behavioural
   *  inference rather than a brain tool call. See INFERRED_CONFIDENCE_CAP. */
  inferred?: boolean;
  /** Consent-gated recap offer/outcome for this record. Merged into
   *  evidence.recap via mergeRecap. */
  recap?: { offered: number; outcome?: RecapRecord['lastOutcome'] };
  /** Bookkeeping-only record. TRUE for entries whose ONLY purpose is to
   *  carry recap counters or a recurrence tally for a gap the session
   *  already knows about ("Recap offered this session.", "Recurred later
   *  in the session."). Such a record must never CREATE a gap (it would
   *  surface a phantom candidate to parents via /api/portal/v1/gaps and to
   *  the brain via <student_profile>) and must never overwrite the real
   *  observation/signals/quotes of an existing one. When true, recordGap
   *  merges ONLY `recap` + `recurrenceCount` into an EXISTING active match —
   *  lastSeenAt and sessionIds are left alone too — and is a no-op when there
   *  is no active match. */
  bookkeepingOnly?: boolean;
}

/** Match an existing GapEntry by identity (kind + key) regardless of status,
 *  excluding 'resolved' which goes through the re-open path. */
function activeMatch(g: GapEntry, input: RecordGapInput): boolean {
  if (g.status === 'resolved') return false;
  if (input.kind === 'lo') {
    return g.kind === 'lo' && !!g.loId && g.loId === input.loId;
  }
  // prerequisite — case-insensitive label match. Pre-normalizer canonicalization,
  // labels are free-form, so equality alone won't catch synonyms ("factoring
  // quadratics" vs "factor quadratics"). The async normalizer will canonicalize
  // labels into conceptId; once that lands, dedup widens to conceptId match.
  const a = (g.conceptLabel ?? '').trim().toLowerCase();
  const b = (input.conceptLabel ?? '').trim().toLowerCase();
  return g.kind === 'prerequisite' && a === b && a !== '';
}

function resolvedMatch(g: GapEntry, input: RecordGapInput): boolean {
  if (g.status !== 'resolved') return false;
  if (input.kind === 'lo') {
    return g.kind === 'lo' && !!g.loId && g.loId === input.loId;
  }
  const a = (g.conceptLabel ?? '').trim().toLowerCase();
  const b = (input.conceptLabel ?? '').trim().toLowerCase();
  return g.kind === 'prerequisite' && a === b && a !== '';
}

/** Merge one record's recap offer/outcome into the gap's accumulated
 *  RecapRecord. Pure — returns undefined only when there is neither a
 *  prior record nor an incoming one. */
function mergeRecap(prev: RecapRecord | undefined, input: RecordGapInput['recap'], now: string): RecapRecord | undefined {
  if (!input) return prev;
  const base: RecapRecord = prev ?? { offers: 0, accepts: 0, declines: 0, lastOfferAt: now };
  return {
    offers: base.offers + input.offered,
    // Count an ACCEPT exactly once, at the moment consent was given.
    // 'improved' / 'still_struggling' are the RETURN-time outcome of a
    // recap that was already counted as accepted (the orchestrator writes
    // 'accepted' at reply time and the outcome when the detour returns; a
    // profile flush can land between the two) — they only move
    // lastOutcome, never the accept counter, or one recap counts twice.
    accepts: base.accepts + (input.outcome === 'accepted' ? 1 : 0),
    declines: base.declines + (input.outcome === 'declined' ? 1 : 0),
    lastOfferAt: input.offered > 0 ? now : base.lastOfferAt,
    lastOutcome: input.outcome ?? base.lastOutcome,
  };
}

/** Cap confidence at INFERRED_CONFIDENCE_CAP when either this record or
 *  the existing entry originated from behavioural inference — inference
 *  must never single-session-promote a gap to 'confirmed'. */
function capInferred(confidence: number, inferred: boolean | undefined, prevInferred: boolean | undefined): number {
  return inferred || prevInferred ? Math.min(confidence, INFERRED_CONFIDENCE_CAP) : confidence;
}

/** Record (or update) a learning gap. Two-tier promotion model:
 *    - new gap → status='candidate' unless single-session confidence
 *      already ≥ CONFIDENCE_PROMOTE_THRESHOLD (multiple stacked signals
 *      in one session), in which case → 'confirmed' immediately.
 *    - existing candidate → promote to 'confirmed' when either
 *      (a) merged confidence ≥ threshold, or
 *      (b) sessionIds.length ≥ 2 (re-triggered across distinct sessions).
 *    - existing 'open' (legacy schema) → migrated to 'confirmed' on re-trigger.
 *    - existing 'resolved' → re-opened (the gap came back).
 *  Mutation is pure — caller is responsible for saveStudentProfile. */
export function recordGap(profile: StudentProfile, input: RecordGapInput): StudentProfile {
  const now = new Date().toISOString();

  // Active match — update in place, merge signals/quotes/sessions, evaluate promotion.
  const idx = profile.gaps.findIndex((g) => activeMatch(g, input));
  if (idx >= 0) {
    const existing = profile.gaps[idx];
    // Bookkeeping-only: merge recap + recurrences and NOTHING else. The
    // record carries no evidence about the gap, only counters about how we
    // handled it, so observation, signals, studentQuotes, confidence and
    // status are left alone — and so are `lastSeenAt` and `sessionIds`.
    // Those two are load-bearing elsewhere: adding the sessionId here would
    // make applyCrossSessionPromotion's dedup guard skip this session (it
    // skips any gap whose sessionIds already contains the current one), and
    // freshening lastSeenAt would un-stale a gap on the strength of a
    // counter rather than on the student struggling with it again.
    if (input.bookkeepingOnly) {
      const bookkeepingRecap = mergeRecap(existing.evidence?.recap, input.recap, now);
      const bookkeepingRecurrences = (existing.evidence?.recurrenceCount ?? 0) + (input.recurrences ?? 0);
      const bookkeepingEvidence: GapEvidence = {
        ...(existing.evidence ?? { signals: [], observation: '', studentQuotes: [] }),
        ...(bookkeepingRecurrences > 0 ? { recurrenceCount: bookkeepingRecurrences } : {}),
        ...(bookkeepingRecap ? { recap: bookkeepingRecap } : {}),
      };
      const bookkept: GapEntry = { ...existing, evidence: bookkeepingEvidence };
      return { ...profile, gaps: profile.gaps.map((g, i) => (i === idx ? bookkept : g)) };
    }
    const mergedSignals: GapSignalCode[] = Array.from(new Set([
      ...((existing.evidence?.signals ?? []) as GapSignalCode[]),
      ...input.signals,
    ]));
    const mergedQuotes = Array.from(new Set([
      ...(existing.evidence?.studentQuotes ?? []),
      ...input.studentQuotes,
    ])).slice(-STUDENT_QUOTES_CAP);
    const mergedSessionIds = Array.from(new Set([
      ...(existing.sessionIds ?? []),
      input.sessionId,
    ]));
    const confidence = capInferred(
      Math.max(existing.confidence ?? 0, computeConfidence(mergedSignals)),
      input.inferred,
      existing.evidence?.inferred,
    );
    const promotable = existing.status === 'candidate' || existing.status === 'open';
    const shouldPromote = promotable
      && (confidence >= CONFIDENCE_PROMOTE_THRESHOLD || mergedSessionIds.length >= 2);
    const nextStatus: GapEntry['status'] = shouldPromote
      ? 'confirmed'
      : existing.status === 'open' ? 'confirmed' // migrate legacy entries
      : existing.status;
    const mergedRecap = mergeRecap(existing.evidence?.recap, input.recap, now);
    const evidence: GapEvidence = {
      signals: mergedSignals,
      observation: input.observation, // most recent wins
      studentQuotes: mergedQuotes,
      ...(existing.evidence?.inferred || input.inferred ? { inferred: true } : {}),
      ...((existing.evidence?.recurrenceCount ?? 0) + (input.recurrences ?? 0) > 0
        ? { recurrenceCount: (existing.evidence?.recurrenceCount ?? 0) + (input.recurrences ?? 0) } : {}),
      ...(mergedRecap ? { recap: mergedRecap } : {}),
    };
    const updated: GapEntry = {
      ...existing,
      kind: input.kind,
      loId: input.kind === 'lo' ? input.loId : existing.loId,
      conceptLabel: input.kind === 'prerequisite' ? input.conceptLabel : existing.conceptLabel,
      lastSeenAt: now,
      sessionIds: mergedSessionIds,
      confidence,
      evidence,
      status: nextStatus,
    };
    return { ...profile, gaps: profile.gaps.map((g, i) => (i === idx ? updated : g)) };
  }

  // Bookkeeping-only with no ACTIVE match: nothing to annotate. Never
  // create a gap and never re-open a resolved one from a counter-carrying
  // record — that is exactly the phantom-gap failure this flag prevents.
  if (input.bookkeepingOnly) return profile;

  // Resolved match — re-open as a fresh candidate (preserve id + firstSeenAt).
  const reopenIdx = profile.gaps.findIndex((g) => resolvedMatch(g, input));
  if (reopenIdx >= 0) {
    const existing = profile.gaps[reopenIdx];
    const signals = [...input.signals];
    const confidence = capInferred(computeConfidence(signals), input.inferred, undefined);
    const status: GapEntry['status'] = confidence >= CONFIDENCE_PROMOTE_THRESHOLD ? 'confirmed' : 'candidate';
    const reopenRecap = mergeRecap(undefined, input.recap, now);
    const reopened: GapEntry = {
      ...existing,
      kind: input.kind,
      loId: input.kind === 'lo' ? input.loId : undefined,
      conceptLabel: input.kind === 'prerequisite' ? input.conceptLabel : undefined,
      lastSeenAt: now,
      sessionIds: [input.sessionId],
      confidence,
      evidence: {
        signals,
        observation: input.observation,
        studentQuotes: [...input.studentQuotes],
        ...(input.inferred ? { inferred: true } : {}),
        ...(input.recurrences ? { recurrenceCount: input.recurrences } : {}),
        ...(reopenRecap ? { recap: reopenRecap } : {}),
      },
      status,
    };
    return { ...profile, gaps: profile.gaps.map((g, i) => (i === reopenIdx ? reopened : g)) };
  }

  // No match — create new candidate (or confirmed if signals strong enough on first fire).
  const signals = [...input.signals];
  const confidence = capInferred(computeConfidence(signals), input.inferred, undefined);
  const status: GapEntry['status'] = confidence >= CONFIDENCE_PROMOTE_THRESHOLD ? 'confirmed' : 'candidate';
  const newRecap = mergeRecap(undefined, input.recap, now);
  const newGap: GapEntry = {
    id: `gap_${Math.random().toString(36).slice(2, 10)}`,
    kind: input.kind,
    loId: input.kind === 'lo' ? input.loId : undefined,
    conceptLabel: input.kind === 'prerequisite' ? input.conceptLabel : undefined,
    status,
    confidence,
    evidence: {
      signals,
      observation: input.observation,
      studentQuotes: [...input.studentQuotes],
      ...(input.inferred ? { inferred: true } : {}),
      ...(input.recurrences ? { recurrenceCount: input.recurrences } : {}),
      ...(newRecap ? { recap: newRecap } : {}),
    },
    sessionIds: [input.sessionId],
    firstSeenAt: now,
    lastSeenAt: now,
  };
  return { ...profile, gaps: [...profile.gaps, newGap] };
}

/** Cross-session promotion fallback. When the brain marks a segment as
 *  sub-mastery (`masteryDelta < CROSS_SESSION_PROMOTION_DELTA_THRESHOLD`)
 *  on an LO that already has an open gap, this function bumps that
 *  gap's `sessionIds` with the current sessionId and promotes
 *  candidate → confirmed if sessionIds.length now reaches 2.
 *
 *  Why this exists. The brain can be unreliable about firing record_gap
 *  on cross-session re-occurrence — when a session is explicitly
 *  designed to revisit a known gap, the brain may interpret the student's
 *  predicted misconception as "expected state, not new evidence" and skip
 *  the tool call. The store layer's promotion rule (sessionIds.length ≥ 2)
 *  then never activates. This fallback closes that loop deterministically:
 *  if the orchestrator's mark_segment_complete reports sub-mastery on an
 *  LO with an existing open gap, that's a strong-enough signal to count
 *  as a re-occurrence — no LLM judgment required.
 *
 *  Safety:
 *    - Dedupes against the gap's existing sessionIds (a brain re-fire
 *      and this fallback won't double-count the same session).
 *    - Only operates on existing gaps (kind='lo', status in active
 *      states). Never creates new gaps.
 *    - Doesn't touch confidence or evidence — only sessionIds and
 *      lastSeenAt. The promotion rule does the rest.
 *    - Skips entries with no loId or non-numeric delta. */
export function applyCrossSessionPromotion(
  profile: StudentProfile,
  masteryDeltas: Array<{ loId: string; delta: number }>,
  sessionId: string,
): StudentProfile {
  if (!masteryDeltas.length || !sessionId) return profile;
  const now = new Date().toISOString();
  let gaps = profile.gaps;
  for (const { loId, delta } of masteryDeltas) {
    if (!loId) continue;
    // typeof check catches non-numbers; isFinite filters NaN / ±Infinity
    // (NaN < 0.5 is false in JS, so without this guard NaN would slip through
    // the >= threshold check and trigger a spurious promotion — caught by
    // scripts/test-cross-session-promotion.ts).
    if (typeof delta !== 'number' || !Number.isFinite(delta)) continue;
    if (delta >= CROSS_SESSION_PROMOTION_DELTA_THRESHOLD) continue;
    const idx = gaps.findIndex((g) =>
      g.kind === 'lo'
      && !!g.loId
      && g.loId === loId
      && (g.status === 'candidate' || g.status === 'confirmed' || g.status === 'open')
      && !(g.sessionIds ?? []).includes(sessionId),
    );
    if (idx < 0) continue;
    const existing = gaps[idx];
    const newSessionIds = [...(existing.sessionIds ?? []), sessionId];
    const promotable = existing.status === 'candidate' || existing.status === 'open';
    const shouldPromote = promotable && newSessionIds.length >= 2;
    const nextStatus: GapEntry['status'] = shouldPromote
      ? 'confirmed'
      : existing.status === 'open' ? 'confirmed' // migrate legacy 'open' on touch
      : existing.status;
    gaps = gaps.map((g, i) => (i === idx ? {
      ...existing,
      sessionIds: newSessionIds,
      lastSeenAt: now,
      status: nextStatus,
    } : g));
  }
  return gaps === profile.gaps ? profile : { ...profile, gaps };
}

/** Mastery-based gap resolution. Walks active LO gaps and marks any
 *  whose underlying mastery score has reached strong/sustained levels
 *  (`score >= GAP_RESOLVE_SCORE_THRESHOLD` AND `exposures >=
 *  GAP_RESOLVE_EXPOSURES_THRESHOLD`) as `'resolved'`. Symmetric with
 *  `applyCrossSessionPromotion` in shape, opposite in direction:
 *
 *    | mastery signal                                   | action |
 *    |--------------------------------------------------|--------|
 *    | masteryDelta < 0.5 on LO with open gap           | bump sessionIds (cross-session promotion fallback) |
 *    | score >= 0.8 + exposures >= 3 on LO with gap     | mark resolved (this function) |
 *
 *  Why score+exposures together: a single 0.8 from one attempt could
 *  be a lucky right answer; sustained performance across multiple
 *  exposures is the signal we trust. Mirrors the confidence band
 *  semantics in `applyMasteryDeltas`.
 *
 *  Resolved gaps stop appearing in `<student_profile>` (render.ts
 *  filter) and stop being read by the brain in future sessions —
 *  closing the loop so a tutor doesn't keep harping on weakness the
 *  student has demonstrably outgrown.
 *
 *  Re-occurrence handling: if a resolved gap's misconception re-fires
 *  later (brain calls `record_gap` on it), `recordGap` has a
 *  re-open-from-resolved path that transitions it back to candidate.
 *  So resolution is reversible.
 *
 *  Scope: LO gaps only. Prerequisite gaps key on free-form
 *  `conceptLabel` and have no native mastery score; their resolution
 *  awaits the concept registry + canonicalization (deferred). */
export function resolveSettledGaps(profile: StudentProfile): StudentProfile {
  const now = new Date().toISOString();
  let mutated = false;
  const gaps = profile.gaps.map((g) => {
    if (g.kind !== 'lo') return g;
    if (!g.loId) return g;
    if (g.status === 'resolved') return g;
    const m = profile.mastery[g.loId];
    if (!m) return g;
    if (m.score < GAP_RESOLVE_SCORE_THRESHOLD) return g;
    if (m.exposures < GAP_RESOLVE_EXPOSURES_THRESHOLD) return g;
    mutated = true;
    return { ...g, status: 'resolved' as const, lastSeenAt: now };
  });
  return mutated ? { ...profile, gaps } : profile;
}

/** Lazy decay check: returns true if a gap's `lastSeenAt` is older than
 *  its status-specific TTL. Used by the renderer to hide stale gaps
 *  from the <student_profile> block WITHOUT mutating the underlying data.
 *
 *  Status-specific TTLs:
 *    - 'candidate' → GAP_DECAY_CANDIDATE_DAYS (21d). Single-observation
 *      gaps that haven't re-triggered in three weeks are likely
 *      false-positives or one-bad-day events.
 *    - 'confirmed' → GAP_DECAY_CONFIRMED_DAYS (90d). Strong signals
 *      warrant more patience for the student to grow out of the gap.
 *    - 'open' (legacy) → treated like 'confirmed'.
 *    - 'resolved' → never stale. Resolved status is independently
 *      filtered by render; staleness doesn't apply.
 *
 *  Why lazy (read-time filter) instead of active mutation:
 *    - Preserves telemetry — real decay rates remain queryable from raw data.
 *    - Reversible — change a constant, no migration.
 *    - No scheduled job needed.
 *    - Hard-delete cleanup of very old data (e.g. > 1 year) can land
 *      later as a separate cleanup script without affecting this logic.
 *
 *  Defensive: returns false for unparseable lastSeenAt strings so a
 *  malformed entry doesn't get silently hidden. Future timestamps
 *  (negative age) likewise return false.
 *
 *  `now` parameter is for testability; defaults to current time. */
export function isGapStale(gap: GapEntry, now: number = Date.now()): boolean {
  if (gap.status === 'resolved') return false;
  const lastSeen = Date.parse(gap.lastSeenAt);
  if (Number.isNaN(lastSeen)) return false;
  const ageDays = (now - lastSeen) / MS_PER_DAY;
  if (ageDays < 0) return false; // future timestamp; defensive
  if (gap.status === 'candidate') return ageDays > GAP_DECAY_CANDIDATE_DAYS;
  // 'confirmed' and legacy 'open'
  return ageDays > GAP_DECAY_CONFIRMED_DAYS;
}

/** Append a session memory entry. */
export function appendSessionMemory(profile: StudentProfile, memory: SessionMemory): StudentProfile {
  return { ...profile, recentSessions: [...profile.recentSessions, memory] };
}

/** Idempotent per-sessionId session-memory write (learning-gaps blending,
 *  2026-07-05). The commit endpoint now receives INCREMENTAL flushes — a
 *  debounced commit whenever the orchestrator's accumulator gains entries,
 *  a pagehide keepalive commit on abnormal exit, and the final End-button
 *  commit. Each carries only the increment since the last flush, so the
 *  same session commits several times; a blind append would spam one
 *  SessionMemory entry per flush. Merge semantics per field:
 *  losTouched union · masteryDeltas concat (each flush's deltas are new)
 *  · notesOverlays summed per bucket · endedAt/durationMinutes newest ·
 *  summary = new non-empty wins (final commit carries it), else keep old ·
 *  identity fields (subject/topic/grade/lessonPlanId) keep existing, fill
 *  when absent. Entry position is preserved so recentSessions stays in
 *  first-commit order. */
export function upsertSessionMemory(profile: StudentProfile, memory: SessionMemory): StudentProfile {
  const idx = profile.recentSessions.findIndex((s) => s.sessionId === memory.sessionId);
  if (idx === -1) {
    return { ...profile, recentSessions: [...profile.recentSessions, memory] };
  }
  const prev = profile.recentSessions[idx];
  const newerEnded = (memory.endedAt || '') >= (prev.endedAt || '');
  const sumNotes = (a?: SessionMemory['notesOverlaysAddedThisSession'], b?: SessionMemory['notesOverlaysAddedThisSession']) => {
    if (!a && !b) return undefined;
    return {
      theory: (a?.theory ?? 0) + (b?.theory ?? 0),
      methods: (a?.methods ?? 0) + (b?.methods ?? 0),
      pointers: (a?.pointers ?? 0) + (b?.pointers ?? 0),
    };
  };
  const merged: SessionMemory = {
    sessionId: prev.sessionId,
    endedAt: newerEnded ? memory.endedAt : prev.endedAt,
    subject: prev.subject ?? memory.subject,
    topic: prev.topic ?? memory.topic,
    grade: prev.grade ?? memory.grade,
    lessonPlanId: prev.lessonPlanId ?? memory.lessonPlanId,
    losTouched: [...new Set([...prev.losTouched, ...memory.losTouched])],
    summary: memory.summary || prev.summary,
    durationMinutes: newerEnded ? (memory.durationMinutes ?? prev.durationMinutes) : (prev.durationMinutes ?? memory.durationMinutes),
    masteryDeltas: (prev.masteryDeltas?.length || memory.masteryDeltas?.length)
      ? [...(prev.masteryDeltas ?? []), ...(memory.masteryDeltas ?? [])]
      : undefined,
    notesOverlaysAddedThisSession: sumNotes(prev.notesOverlaysAddedThisSession, memory.notesOverlaysAddedThisSession),
  };
  const next = [...profile.recentSessions];
  next[idx] = merged;
  return { ...profile, recentSessions: next };
}

export { PLAN_CONTENT_SEEN_CAP } from './types';

/** Merge one session's used fillings into the per-plan seen-memory (content
 *  variety Phase 1). Pure. Per slot: append new non-empty descriptors,
 *  case-insensitive dedup (newest position wins), FIFO-cap at
 *  PLAN_CONTENT_SEEN_CAP. Absent slots stay absent. */
export function recordPlanContentSeen(
  profile: StudentProfile,
  planId: string,
  fillings: PlanContentFillings,
): StudentProfile {
  const prev: PlanContentSeen = profile.planContentSeen?.[planId] ?? { hooks: [], examples: [], problems: [] };
  const mergeSlot = (old: string[], incoming: string[]): string[] => {
    const out = [...old];
    for (const raw of incoming) {
      const v = (raw ?? '').trim();
      if (!v) continue;
      const i = out.findIndex((e) => e.toLowerCase() === v.toLowerCase());
      if (i !== -1) out.splice(i, 1); // drop old occurrence; re-add at end (newest)
      out.push(v);
    }
    return out.slice(-PLAN_CONTENT_SEEN_CAP);
  };
  const next: PlanContentSeen = {
    hooks: mergeSlot(prev.hooks, fillings.hooks),
    examples: mergeSlot(prev.examples, fillings.examples),
    problems: mergeSlot(prev.problems, fillings.problems),
  };
  return { ...profile, planContentSeen: { ...(profile.planContentSeen ?? {}), [planId]: next } };
}

/**
 * M1c: identity resolution is flag-gated because resolveProfileId does NOT adopt
 * a pre-existing row lacking partnerId/externalStudentId — it mints a new
 * surrogate _id. Turning this on before the Task 6 backfill has stamped the 495
 * existing profiles would hand every existing student a blank profile while
 * their mastery stayed on the old _id. Flip it at rollout step 5a, after the
 * backfill and the index build. Default off so a deploy is always safe.
 */
export function identityResolutionEnabled(): boolean {
  return process.env.PORTAL_IDENTITY_RESOLUTION === 'on';
}

export interface ResolveProfileInput {
  partnerId: string;
  externalStudentId: string;
}

export interface ResolverDeps {
  findExisting(input: ResolveProfileInput): Promise<{ _id: string } | null>;
  findOneAndUpsert(
    input: ResolveProfileInput & { newId: string },
  ): Promise<{ _id: string } | null>;
  newId(): string;
}

/**
 * The Mongo filter that carries the M1c guarantee: identity is the PAIR,
 * never `externalStudentId` alone. Exported and used by both
 * `defaultResolverDeps` methods below (not duplicated), and pinned directly
 * by a hermetic test — the fake-store tests below exercise the fake's own
 * key, not this line, so this is the only thing standing between "correct"
 * and "regressed to filtering on externalStudentId alone" reaching prod
 * undetected.
 */
export function identityFilter({ partnerId, externalStudentId }: ResolveProfileInput) {
  return { partnerId, externalStudentId };
}

/**
 * M1c Task 5 (fix round 2, IMPORTANT D) — a structural discriminator (same
 * idiom as `secret-box.ts`'s `SecretDecryptError`) for `resolveProfileId`'s
 * three NON-operational throws: a missing `partnerId`/`externalStudentId`
 * (a caller bug — should be unreachable given every caller now declares
 * `partnerId` required, but this is the backstop), and "upsert reported a
 * duplicate but no row was found" (the loudest possible signal that
 * identity data is CORRUPT — a unique-index violation whose winner can't be
 * found is not a transient condition to paper over). `resolveProfileIdOrRaw`
 * re-throws these instead of degrading to the raw id; only genuine
 * operational failures (a real Mongo blip on the upsert/read) still degrade.
 */
export class ProfileIdentityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileIdentityError';
  }
}

const defaultResolverDeps: ResolverDeps = {
  newId: () => randomUUID(),
  async findExisting(input) {
    await connectDB();
    return StudentProfileModel
      .findOne(identityFilter(input))
      .select('_id')
      .lean<{ _id: string }>()
      .exec();
  },
  async findOneAndUpsert({ partnerId, externalStudentId, newId }) {
    await connectDB();
    const now = new Date().toISOString();
    return StudentProfileModel.findOneAndUpdate(
      identityFilter({ partnerId, externalStudentId }),
      {
        $setOnInsert: {
          _id: newId,
          ...emptyProfile(newId),
          partnerId,
          externalStudentId,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).select('_id').lean<{ _id: string }>().exec();
  },
};

/**
 * Turn a partner-scoped identity into the surrogate profile `_id`.
 *
 * This is the M1c choke point. Two partners sending the same
 * `externalStudentId` get two profiles because the unique index on
 * (partnerId, externalStudentId) refuses otherwise — the guarantee is the
 * database's, not a convention every call site must remember.
 *
 * Find-or-create is ONE atomic upsert, not a read followed by a write: two
 * concurrent first-requests for the same new student would both miss and both
 * insert, and the loser would surface E11000 to a legitimate student. On that
 * error we re-read and adopt whoever won. `findExisting` MUST NOT be called
 * on the happy path — that's the read-then-write anti-pattern this function
 * exists to avoid, and the test suite asserts the call count to prove it.
 */
export async function resolveProfileId(
  input: ResolveProfileInput,
  deps: ResolverDeps = defaultResolverDeps,
): Promise<string> {
  if (!input.partnerId) throw new ProfileIdentityError('resolveProfileId: partnerId is required');
  if (!input.externalStudentId) {
    throw new ProfileIdentityError('resolveProfileId: externalStudentId is required');
  }
  const newId = deps.newId();
  try {
    const doc = await deps.findOneAndUpsert({ ...input, newId });
    if (doc) return doc._id;
  } catch (err) {
    const e = err as { code?: number; codeName?: string };
    // Accept both shapes: the driver's top-level numeric code, and a
    // codeName that a wrapper/proxy might surface instead of (or in
    // addition to) the numeric code.
    if (e.code !== 11000 && e.codeName !== 'DuplicateKey') throw err;
  }
  const existing = await deps.findExisting(input);
  if (!existing) {
    throw new ProfileIdentityError(
      `resolveProfileId: upsert reported a duplicate for ${input.partnerId} but no row was found`,
    );
  }
  return existing._id;
}

/**
 * M1c Task 5 (fix round 1, IMPORTANT 4; narrowed in fix round 2, IMPORTANT D)
 * — the flag-gated wrapper every call site should use, instead of
 * hand-rolling `identityResolutionEnabled() ? resolveProfileId(...) : raw`
 * at each of the ~20 entry points.
 *
 * `getOrCreateStudentProfile` catches every DB error and degrades to an
 * in-memory ephemeral profile — it never throws. `resolveProfileId` rethrows
 * anything that isn't a duplicate-key race. Running it in front of
 * `getOrCreateStudentProfile` (as every call site now must, per spec §4.1)
 * would otherwise turn a transient Mongo blip on `/gaps`, `/mastery`,
 * `/learner-state`, etc. from "200 with an empty/ephemeral profile" — the
 * pre-M1c and still-getOrCreateStudentProfile contract — into a customer-
 * visible 500. This wrapper preserves that contract for OPERATIONAL
 * failures (a real Mongo blip on the upsert/read): it logs and degrades to
 * the RAW `externalStudentId`, exactly what every call site did before M1c
 * and what it does today with the flag off. A degraded response briefly
 * reads/writes the wrong-keyed (unresolved) profile until the next
 * successful resolve — judged the lesser risk against turning infra
 * flakiness into an outage.
 *
 * `ProfileIdentityError` (a missing partnerId/externalStudentId, or an
 * upsert-reported duplicate whose row can't be found) is NOT one of those
 * operational failures — it stays loud. A missing `partnerId` should be
 * unreachable given every caller now declares it a required, non-optional
 * argument (a compile error, not a runtime path here) — this re-throw is
 * the backstop if that guarantee is ever violated. And a duplicate-key
 * upsert with no findable winner is the loudest possible signal that
 * identity data is corrupt; swallowing it into "degrade to the raw id"
 * would silently paper over exactly the failure mode this milestone exists
 * to catch.
 *
 * M1c Task 5 (fix round 2, IMPORTANT E) — `trial:`-prefixed external ids
 * NEVER resolve, flag on or off. Two guarantees depend on a trial id
 * staying literally `trial:...` all the way through: `appendEvidence`
 * drops any `EvidenceInput` whose `studentId` starts with `trial:` (demo/
 * trial sessions don't feed the persistent learner model — 68 such
 * profiles), and every write-path call site now shares ONE resolved id
 * across the profile, evidence, projections, Elo and snapshot stores (spec
 * §4.1). If trial ids resolved like any other, that shared id would become
 * an opaque UUID with no `trial:` prefix left to filter on — silently
 * turning "dropped by construction" into "written normally" — AND a
 * request authenticated as one partner (e.g. the academy's own
 * `/api/portal/v1/learner-state`) would mint a FRESH surrogate for a
 * `trial:` id that pre-M1c (and the Task 6 backfill) always left on its
 * bare, partner-agnostic `_id` — splitting that trial profile from itself
 * depending on which route touched it. Short-circuiting here, in the one
 * function every call site funnels through, means no call site has to
 * remember this case individually.
 */
export async function resolveProfileIdOrRaw(
  input: ResolveProfileInput,
  /** M1c Task 5 (fix round 3, MINOR F) — injectable, same as
   *  `resolveProfileId`'s own `deps` param. Added so the `trial:`
   *  short-circuit above is provably never followed by a deps call in a
   *  hermetic test, rather than the short-circuit's absence being masked
   *  by this function's OWN degrade-on-failure catch below (a fake/real
   *  `connectDB()` failure with no `MONGODB_URI` configured is a plain
   *  `Error`, which that catch treats as operational and degrades to the
   *  raw id too — so "returns the raw id" alone does not prove the
   *  short-circuit ran; only "deps was never touched" does). */
  deps: ResolverDeps = defaultResolverDeps,
): Promise<string> {
  if (input.externalStudentId.startsWith('trial:')) return input.externalStudentId;
  if (!identityResolutionEnabled()) return input.externalStudentId;
  try {
    return await resolveProfileId(input, deps);
  } catch (err) {
    if (err instanceof ProfileIdentityError) throw err;
    console.error('[student-profile] resolveProfileId failed, degrading to the raw id:', err);
    return input.externalStudentId;
  }
}

/** Patch the preferences sub-object on a profile and persist. Only keys
 *  present in `patch` are written; everything else (mastery, gaps,
 *  recentSessions) is preserved. Used by the settings page and any
 *  other surface that lets the student/parent change a preference
 *  without committing a full session.
 *
 *  Pass `null` for a key to clear it (revert to grade default). */
export async function updateStudentPreferences(
  id: string,
  patch: Partial<Record<keyof StudentPreferences, StudentPreferences[keyof StudentPreferences] | null>>,
): Promise<StudentProfile> {
  const profile = await getOrCreateStudentProfile(id);
  const merged: StudentPreferences = { ...profile.preferences };
  for (const [k, v] of Object.entries(patch)) {
    const key = k as keyof StudentPreferences;
    if (v === null || v === undefined) {
      delete merged[key];
    } else {
      // The cast is safe: each key maps to its own type, and the patch
      // shape constrains values to the matching field type. TS can't
      // narrow per-key when we iterate Object.entries.
      (merged as Record<string, unknown>)[key] = v;
    }
  }
  return saveStudentProfile({ ...profile, preferences: merged });
}
