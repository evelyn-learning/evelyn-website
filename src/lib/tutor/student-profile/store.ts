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

import connectDB from '@/lib/db';
import { StudentProfileModel, toStudentProfile, type IStudentProfileDoc } from '@/models/StudentProfile';
import {
  type StudentProfile,
  type StudentPreferences,
  type MasteryEntry,
  type GapEntry,
  type GapEvidence,
  type GapSignalCode,
  type SessionMemory,
  STUDENT_PROFILE_SCHEMA_VERSION,
  RECENT_SESSIONS_CAP,
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
const GAP_RESOLVE_SCORE_THRESHOLD = 0.8;
/** Minimum exposures required for resolution. Single-shot 0.8 from one
 *  attempt could be a lucky answer; require sustained performance.
 *  Aligned with applyMasteryDeltas confidence band: ≥ 3 exposures
 *  reads as "medium" or higher. Inclusive. */
const GAP_RESOLVE_EXPOSURES_THRESHOLD = 3;
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
    const confidence = Math.max(
      existing.confidence ?? 0,
      computeConfidence(mergedSignals),
    );
    const promotable = existing.status === 'candidate' || existing.status === 'open';
    const shouldPromote = promotable
      && (confidence >= CONFIDENCE_PROMOTE_THRESHOLD || mergedSessionIds.length >= 2);
    const nextStatus: GapEntry['status'] = shouldPromote
      ? 'confirmed'
      : existing.status === 'open' ? 'confirmed' // migrate legacy entries
      : existing.status;
    const evidence: GapEvidence = {
      signals: mergedSignals,
      observation: input.observation, // most recent wins
      studentQuotes: mergedQuotes,
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

  // Resolved match — re-open as a fresh candidate (preserve id + firstSeenAt).
  const reopenIdx = profile.gaps.findIndex((g) => resolvedMatch(g, input));
  if (reopenIdx >= 0) {
    const existing = profile.gaps[reopenIdx];
    const signals = [...input.signals];
    const confidence = computeConfidence(signals);
    const status: GapEntry['status'] = confidence >= CONFIDENCE_PROMOTE_THRESHOLD ? 'confirmed' : 'candidate';
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
      },
      status,
    };
    return { ...profile, gaps: profile.gaps.map((g, i) => (i === reopenIdx ? reopened : g)) };
  }

  // No match — create new candidate (or confirmed if signals strong enough on first fire).
  const signals = [...input.signals];
  const confidence = computeConfidence(signals);
  const status: GapEntry['status'] = confidence >= CONFIDENCE_PROMOTE_THRESHOLD ? 'confirmed' : 'candidate';
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
