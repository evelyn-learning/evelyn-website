/**
 * Student profile — persistent across sessions.
 *
 * Shape designed to be loaded at session start and updated at session
 * end with deltas the brain produced during the session (mastery
 * deltas from mark_segment_complete, gaps recorded via record_gap,
 * topics covered, time spent).
 *
 * For retail: keyed by authenticated user id. For B2B: keyed by the
 * partner's external student id, optionally namespaced by partner id.
 */

export type ConfidenceBand = 'low' | 'medium' | 'high';

/** Per-LO mastery snapshot. */
export interface MasteryEntry {
  /** LO id, e.g. "ccss.math.5.nf.a.1". */
  loId: string;
  /** 0..1 — running estimate. 0 = never seen, 1 = mastered. */
  score: number;
  /** Number of sessions or problems contributing to the score. Drives
   *  confidence weighting — a 0.6 from 12 attempts is more reliable
   *  than a 0.6 from 1 attempt. */
  exposures: number;
  /** Last time this LO was touched (any session, any modality). ISO. */
  lastTouchedAt: string;
  /** Optional confidence label derived from exposures + variance. */
  confidence?: ConfidenceBand;
}

/** A recorded learning gap — something the brain noticed during a
 *  session that bears on future planning. */
export interface GapEntry {
  /** Stable id (uuid) so the same gap doesn't get duplicated across
   *  sessions when the brain re-detects it. */
  id: string;
  /** LO this gap relates to. */
  loId: string;
  /** Free-form description, ideally citing what the student said /
   *  did that revealed the gap. */
  description: string;
  /** When the gap was first observed. ISO. */
  firstSeenAt: string;
  /** When it was most recently re-observed. ISO. */
  lastSeenAt: string;
  /** "open" — still relevant; "resolved" — student demonstrated
   *  mastery in a later session. */
  status: 'open' | 'resolved';
}

/** Per-session note carried forward into future sessions. */
export interface SessionMemory {
  sessionId: string;
  /** ISO timestamp of session end. */
  endedAt: string;
  /** Subject + topic + grade + plan id (when plan-driven). */
  subject?: string;
  topic?: string;
  grade?: string;
  lessonPlanId?: string;
  /** LO ids touched during this session. */
  losTouched: string[];
  /** A short narrative summary the brain produced at end-of-session. */
  summary?: string;
  /** Time the student spent in the session, minutes. */
  durationMinutes?: number;
  /** Mastery deltas applied during this session. */
  masteryDeltas?: Array<{ loId: string; delta: number }>;
}

/** Per-student preferences. */
export interface StudentPreferences {
  /** Student/parent-set preference for humor level. The resolver treats
   *  this as the requested level, then min-clamps with any partner cap. */
  humorCeiling?: 'off' | 'light' | 'medium' | 'heavy';
  /** Pacing override: faster / slower than the grade default. */
  pacing?: 'slower' | 'default' | 'faster';
  /** Modality preference, e.g. visual-heavy vs equation-heavy. */
  modality?: 'visual' | 'equation' | 'mixed';
  /** Tone preference. */
  tone?: 'warm' | 'peer' | 'professional';
}

/** Partner-level (B2B) policy that constrains what students under a
 *  partner can opt into. Currently a stub — no UI surface, no admin
 *  panel; the field exists so the humor resolver can clamp preferences
 *  to a partner cap without us having to refactor the API later when a
 *  partner asks for the capability.
 *
 *  Semantics: each *Max field is a CAP, not an override. A student whose
 *  preference is *below* the cap keeps their preference; a preference
 *  *above* the cap clamps down to the cap. This matches how content-
 *  rating systems work — districts set a ceiling, families can be more
 *  conservative. */
export interface PartnerPolicy {
  /** Partner id this policy belongs to. */
  partnerId: string;
  /** Max humor level any student under this partner may experience.
   *  Resolver: min(studentPreference, humorCeilingMax). Undefined = no
   *  cap (full band default applies). */
  humorCeilingMax?: 'off' | 'light' | 'medium' | 'heavy';
}

export interface StudentProfile {
  /** Application-controlled id. For retail = userId. For B2B =
   *  `${partnerId}:${externalStudentId}`. */
  id: string;
  /** Display name (used in greetings / problem name pools). */
  name?: string;
  /** Grade as configured at last session. Brain overrides via session
   *  config when a new session sets a different grade. */
  grade?: string;
  /** Locale: "en-US" / "hi-IN" / "en-GB" — drives humor, name pools,
   *  number/date formatting, curriculum filtering. */
  locale?: string;
  /** Curriculum tag the student tracks against — drives lesson-plan
   *  filtering and curriculum-graph queries. */
  curriculum?: string;

  /** Per-LO mastery, keyed by LO id. */
  mastery: Record<string, MasteryEntry>;
  /** Open + resolved gaps. */
  gaps: GapEntry[];
  /** Recent session memories (capped, oldest pruned). */
  recentSessions: SessionMemory[];
  /** Preferences. */
  preferences: StudentPreferences;

  /** When the profile was first created. */
  createdAt: string;
  /** When it was last updated. */
  updatedAt: string;
  /** Schema version. */
  schemaVersion: number;
  /** B2B partner id, when applicable. */
  partnerId?: string;
  /** Free-form metadata for partners. */
  metadata?: Record<string, unknown>;
}

export const STUDENT_PROFILE_SCHEMA_VERSION = 1;

/** Cap on how many session memories we keep. Older sessions are pruned
 *  but their mastery deltas have already been merged into `mastery`. */
export const RECENT_SESSIONS_CAP = 10;
