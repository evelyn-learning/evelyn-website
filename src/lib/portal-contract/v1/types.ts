/**
 * Portal Contract v1 — TypeScript types.
 *
 * Types are DERIVED from the zod schemas in `schemas.ts` (single source of
 * truth) via `z.infer`. The bottom of this file carries compile-time
 * DRIFT GUARDS: if an engine interface stops being assignable to its
 * contract mirror, the build fails here — forcing a deliberate contract
 * update rather than silent skew.
 */

import type { z } from 'zod';
import type {
  VoiceEngineSchema,
  MasteryEntrySchema,
  GapEntrySchema,
  GapEvidenceSchema,
  GapSignalCodeSchema,
  RenderedTopicNotesSchema,
  ShowQuizPayloadSchema,
  ShowConceptMapPayloadSchema,
  SocialThreadSchema,
  StudentContextSchema,
  StudentContextPreferencesSchema,
  SessionResultSchema,
  SessionEmitRequestSchema,
  SessionEmitGapSchema,
  SocialMemoryDeltaSchema,
  NotesReadSchema,
  GapsReadSchema,
  MasteryReadSchema,
  RetrievePracticeRequestSchema,
  RetrievePracticeResponseSchema,
  PracticeItemSchema,
  GradeFreeResponseRequestSchema,
  GradeFreeResponseResponseSchema,
  FrqRubricSchema,
} from './schemas';

// --- Primitives -----------------------------------------------------------

export type VoiceEngine = z.infer<typeof VoiceEngineSchema>;

// --- Engine-owned read shapes (mirrors) -----------------------------------

export type MasteryEntry = z.infer<typeof MasteryEntrySchema>;
export type GapEntry = z.infer<typeof GapEntrySchema>;
export type GapEvidence = z.infer<typeof GapEvidenceSchema>;
export type GapSignalCode = z.infer<typeof GapSignalCodeSchema>;
export type RenderedTopicNotes = z.infer<typeof RenderedTopicNotesSchema>;

// --- Rendered artifacts ---------------------------------------------------

export type ShowQuizPayload = z.infer<typeof ShowQuizPayloadSchema>;
export type ShowConceptMapPayload = z.infer<typeof ShowConceptMapPayloadSchema>;

// --- Portal-owned wire shapes ---------------------------------------------

export type SocialThread = z.infer<typeof SocialThreadSchema>;
export type StudentContext = z.infer<typeof StudentContextSchema>;
export type StudentContextPreferences = z.infer<typeof StudentContextPreferencesSchema>;
export type SessionResult = z.infer<typeof SessionResultSchema>;
export type SessionEmitRequest = z.infer<typeof SessionEmitRequestSchema>;
export type SessionEmitGap = z.infer<typeof SessionEmitGapSchema>;
export type SocialMemoryDelta = z.infer<typeof SocialMemoryDeltaSchema>;

// --- Read endpoint responses ----------------------------------------------

export type NotesRead = z.infer<typeof NotesReadSchema>;
export type GapsRead = z.infer<typeof GapsReadSchema>;
export type MasteryRead = z.infer<typeof MasteryReadSchema>;

// --- Practice / grading ---------------------------------------------------

export type RetrievePracticeRequest = z.infer<typeof RetrievePracticeRequestSchema>;
export type RetrievePracticeResponse = z.infer<typeof RetrievePracticeResponseSchema>;
export type PracticeItem = z.infer<typeof PracticeItemSchema>;
export type GradeFreeResponseRequest = z.infer<typeof GradeFreeResponseRequestSchema>;
export type GradeFreeResponseResponse = z.infer<typeof GradeFreeResponseResponseSchema>;
export type FrqRubric = z.infer<typeof FrqRubricSchema>;

// ===========================================================================
// DRIFT GUARDS — compile-time assertions that engine shapes still satisfy
// their contract mirrors. These are type-only (erased at runtime, zero cost).
// A failure here means the engine interface changed; reconcile the mirror in
// `schemas.ts` (and bump to v2 if the change is breaking for the portal).
// ===========================================================================

import type { MasteryEntry as EngineMasteryEntry } from '@/lib/tutor/student-profile/types';
import type { GapEntry as EngineGapEntry } from '@/lib/tutor/student-profile/types';
import type { RenderedTopicNotes as EngineRenderedTopicNotes } from '@/lib/tutor/topic-notes/types';

/** `true` only if A is assignable to B; otherwise a type error. */
type AssertAssignable<A extends B, B> = A;

// The engine's output must always satisfy the contract the portal reads.
type _GuardMastery = AssertAssignable<EngineMasteryEntry, MasteryEntry>;
type _GuardGap = AssertAssignable<EngineGapEntry, GapEntry>;
type _GuardNotes = AssertAssignable<EngineRenderedTopicNotes, RenderedTopicNotes>;

// Reference the guard aliases so `noUnusedLocals` doesn't strip them.
export type __ContractDriftGuards = [_GuardMastery, _GuardGap, _GuardNotes];
