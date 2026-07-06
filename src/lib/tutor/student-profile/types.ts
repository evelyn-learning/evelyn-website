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

/** Diagnostic signal codes that contribute to a gap's evidence.
 *
 *  Some are BRAIN-EMITTED (subjective): the brain observed a
 *  misconception, the student verbalized confusion, the student got it
 *  wrong even after a hint, no recovery within the segment.
 *
 *  Others are ORCHESTRATOR-STAMPED (objective): derived from session
 *  metrics the orchestrator already tracks (incorrectStreak, cue,
 *  segmentTurns) — stamped at the moment of the tool call so the brain
 *  doesn't have to re-derive them.
 *
 *  A gap's `confidence` is computed deterministically as
 *  clamp(signals.length / 4, 0, 1). Threshold tuning therefore needs no
 *  schema change — only a constant in the orchestrator's stamp logic. */
export type GapSignalCode =
  // Brain-emitted (subjective)
  | 'MISCONCEPTION_DETECTED'
  | 'STUDENT_VERBALIZED_CONFUSION'
  | 'INCORRECT_AFTER_HINT'
  | 'NO_RECOVERY'
  // Orchestrator-stamped (objective)
  | 'INCORRECT_STREAK_2_PLUS'
  | 'STUCK_CUE'
  | 'SLOW_SEGMENT';

/** Structured evidence backing a GapEntry. The brain emits everything
 *  except the orchestrator-stamped signals, which are merged into
 *  `signals[]` at tool-call time. */
export interface GapEvidence {
  /** Union of brain-emitted + orchestrator-stamped codes. Order is not
   *  semantically meaningful. Drives `confidence`. */
  signals: GapSignalCode[];
  /** Brain's one-line account of what the student got wrong and (when
   *  inferable) why. Drives the weak-areas UI label and pre-session
   *  priming in future sessions. ~1–2 sentences. */
  observation: string;
  /** Verbatim student utterance(s) the brain considers most diagnostic.
   *  Used for "you previously said X" re-grounding in later sessions.
   *  At most 2 quotes, ≤30 words each. May be empty. */
  studentQuotes: string[];
}

/** A recorded learning gap — something the brain noticed during a
 *  session that bears on future planning.
 *
 *  Two kinds (discriminator: `kind`):
 *    - 'lo': gap on a learning objective in the CURRENTLY-active lesson
 *      plan. `loId` is set to the per-plan LO id.
 *    - 'prerequisite': gap on a foundational concept the active plan
 *      doesn't directly teach but builds on (e.g. factoring weakness
 *      surfacing in an AP Calc session). `conceptLabel` carries a free-
 *      form label the brain emitted; the async normalizer canonicalizes
 *      this to `conceptId` once the registry has coverage.
 *
 *  Status lifecycle: 'candidate' → 'confirmed' → 'resolved'.
 *    - 'candidate': single observation, decays in 21 days if not
 *      re-triggered.
 *    - 'confirmed': passed promotion (confidence ≥ 0.75 in one session
 *      OR fired in 2+ distinct sessions). Surfaces in weak-areas UI.
 *    - 'resolved': student demonstrated mastery later — closed.
 *    - 'open': legacy value from before the candidate/confirmed split;
 *      treated as 'confirmed' for surfacing purposes. Kept for
 *      backward compatibility with existing rows. */
export interface GapEntry {
  /** Stable id so the same gap doesn't get duplicated across sessions
   *  when the brain re-detects it. */
  id: string;
  /** Discriminator. Optional only for backward compatibility with
   *  legacy entries (which were all in-plan LO gaps). New writes always
   *  set this. */
  kind?: 'lo' | 'prerequisite';
  /** Present when kind='lo'. Per-plan LO id, matches LessonPlan.los[].id.
   *  Optional only for prerequisite-kind gaps and legacy schema-rescue
   *  reads — required at write-time when kind='lo'. */
  loId?: string;
  /** Present when kind='prerequisite'. Free-form English label the brain
   *  emitted (e.g. "factoring quadratics"). Canonicalized async by the
   *  concept-label normalizer. */
  conceptLabel?: string;
  /** Populated by the normalizer once a canonical concept exists in the
   *  registry. Empty until the registry has coverage for this label. */
  conceptId?: string;
  /** Lifecycle state. See lifecycle note above. 'open' is legacy. */
  status: 'candidate' | 'confirmed' | 'resolved' | 'open';
  /** Deterministic: clamp(evidence.signals.length / 4, 0, 1). Recomputed
   *  whenever signals change (re-trigger from a later session). */
  confidence?: number;
  /** Structured evidence — see GapEvidence. Optional only for legacy
   *  entries that pre-date this field; new writes always populate. */
  evidence?: GapEvidence;
  /** Distinct sessions in which this gap was triggered. Cross-session
   *  promotion fires when this length reaches 2. */
  sessionIds?: string[];
  /** When the gap was first observed. ISO. */
  firstSeenAt: string;
  /** When it was most recently re-observed. ISO. */
  lastSeenAt: string;
  /** Legacy single-string description. Kept readable on old entries;
   *  new writes populate `evidence.observation` instead. */
  description?: string;
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
  /** Per-bucket count of topic-notes overlay tool calls the orchestrator
   *  ALLOWED through (post-warmup, pre-rate-cap). Some may have landed
   *  as dedup-suppressed or reinforcement bumps rather than fresh
   *  entries — the count reflects brain INTENT this session, not
   *  persisted-overlay deltas. Used by render.ts to prime the brain's
   *  next-session callback ("we added 2 things to your notes last
   *  session"). Per Q11d in project_topic_notes_initiative.md. */
  notesOverlaysAddedThisSession?: { theory: number; methods: number; pointers: number };
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
  /** Stated interests (e.g. fandoms, hobbies) for themed analogies/examples.
   *  Captured + stored first-class via the portal context-ingest endpoint;
   *  brain-consumption ships in the committed Phase-2 personalization release.
   *  Additive/optional — `preferences` is stored as Mixed (no migration). */
  interests?: string[];
  /** Portal/parent-set CEILING for rapport recall ('off' default), a dial like
   *  humorCeiling. Stored (it is a setting); the social-memory THREADS remain
   *  transient and are never persisted engine-side. */
  socialMemoryLevel?: 'off' | 'light' | 'warm';
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
  /** Per-plan record of fillings already shown to this student (content
   *  variety Phase 1). Keyed by lessonPlanId. Absent for students who have
   *  never had a flagged session. */
  planContentSeen?: Record<string, PlanContentSeen>;
}

/** Bounded record of the specific FILLINGS a student has already been shown
 *  for a given plan, so repeat sessions can diverge from them (content-variety
 *  Phase 1). Short descriptors for narrative slots; problem statements for
 *  graded ones. */
export interface PlanContentSeen {
  hooks: string[];
  examples: string[];
  problems: string[];
}
/** Same shape, used as the per-session extraction payload written in. */
export type PlanContentFillings = PlanContentSeen;
/** Max prior renditions kept per slot per plan (FIFO). */
export const PLAN_CONTENT_SEEN_CAP = 3;

export const STUDENT_PROFILE_SCHEMA_VERSION = 1;

/** Cap on how many session memories we keep. Older sessions are pruned
 *  but their mastery deltas have already been merged into `mastery`. */
export const RECENT_SESSIONS_CAP = 10;
