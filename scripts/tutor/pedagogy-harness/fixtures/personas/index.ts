/**
 * Fixture personas — the "test accounts" for the pedagogy testing harness
 * (Task H1). Mirrors the fixture-loading pattern in
 * scripts/tutor-render-harness/run.ts (JSON on disk, thin typed loader).
 *
 * 11 synthetic students: 5 demo (logged-out / trial) + 6 subscribed. Each
 * carries realistic social/personal/pedagogical context so later harness
 * tasks (opener, calibration, plan-as-seed, completion, write-back) can be
 * stress-tested against both new and returning students.
 *
 * `studentContext` (when present) is portal-owned durable state and MUST
 * validate against `StudentContextSchema` from `@evelyn/portal-contract/v1`
 * (enforced in personas.test.ts, not re-validated here — the loader stays a
 * dumb JSON reader so fixture authoring errors show up as test failures,
 * not thrown-at-import-time surprises).
 *
 * `profile` (when present) follows the engine's `StudentProfile` shape
 * (src/lib/tutor/student-profile/types.ts).
 */

import * as fs from 'fs';
import * as path from 'path';

/** Drives the Haiku student-simulator (Task H3) — NEVER sent to the brain. */
export interface SimProfile {
  grade: string;
  topic: string;
  /** What they SAY they know. */
  claim: string;
  /** What they ACTUALLY know (for the bluffer this differs from `claim`). */
  actualLevel: string;
  /** 'exploring' | 'considering-enrolling' | 'curious-about-ai' | 'enrolled' */
  intent: string;
  /** e.g. 'anxious-terse', 'chatty', 'cooperative' */
  style: string;
}

/** A fresh or stale lesson-plan checkpoint, for the resume-mid-node case
 *  (persona `ravi`). Shape mirrors the engine's lessonProgress checkpoint
 *  fields (contract `LessonProgressSchema` currentSegmentId/completedSegmentIds). */
export interface ResumeStateFixture {
  currentSegmentId: string;
  completedSegmentIds: string[];
  updatedAtISO: string;
}

export interface Persona {
  /** 'maya', 'leo', ... */
  id: string;
  mode: 'demo' | 'subscribed';
  /** Durable portal state for subscribed (and the one trial demo). Absent
   *  for logged-out demo personas. Validates against the contract's
   *  StudentContextSchema. */
  studentContext?: unknown;
  /** diego only: the diagnostic-target variant of studentContext (same
   *  student, `target: {kind:'diagnostic', loIds:[...]}` instead of the
   *  normal lessonNode target). */
  studentContextDiagnostic?: unknown;
  /** Engine-side pedagogical state (mastery/gaps) for subscribed personas
   *  that have history. Shape follows the engine StudentProfile. */
  profile?: unknown;
  /** ravi only: fresh checkpoint within the resume window. */
  resumeState?: ResumeStateFixture;
  /** ravi only: checkpoint older than RESUME_MAX_AGE_MS. */
  staleResumeState?: ResumeStateFixture;
  simProfile: SimProfile;
}

/** Canonical roster order — the "old file list of 9" this task supersedes;
 *  read authored ALL 11 (see task-H1-brief.md). */
export const PERSONA_IDS = [
  'maya',
  'leo',
  'aria',
  'sam',
  'anon',
  // Regression persona for the Store-B coherence bug (2026-07-03): a
  // student who confidently misquotes the problem's given values. Drives
  // the `storeb` scenario row's board-truth-authority rubric.
  'nina',
  'priya',
  'noah',
  'zoe',
  'kai',
  'diego',
  'ravi',
] as const;

export type PersonaId = (typeof PERSONA_IDS)[number];

const FIXTURES_DIR = __dirname;

export function loadPersona(id: string): Persona {
  const file = path.join(FIXTURES_DIR, `${id}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown persona id "${id}" — no fixture at ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Persona;
}

export function allPersonas(): Persona[] {
  return PERSONA_IDS.map((id) => loadPersona(id));
}
