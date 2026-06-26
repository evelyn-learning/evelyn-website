/**
 * Portal Contract v1 — zod schemas (runtime validators).
 *
 * This module is the **shared contract** between the Evelyn tutor ENGINE
 * (this repo) and the external PORTAL that will consume it. It is an
 * in-repo module today (importable now) and is designed to be lifted into
 * a standalone `@evelyn/portal-contract` package later without code
 * changes — it imports nothing from the engine's runtime, only mirrors
 * its data shapes.
 *
 * Source-of-truth policy:
 *   - For PORTAL-OWNED wire shapes (StudentContext, SessionResult,
 *     RetrievePracticeRequest, GradeFreeResponse, ShowQuiz/ConceptMap
 *     payloads, FRQ rubric), THESE zod schemas are canonical and the TS
 *     types in `types.ts` are derived from them via `z.infer`.
 *   - For ENGINE-OWNED read shapes (RenderedTopicNotes, GapEntry,
 *     MasteryEntry), these schemas MIRROR the engine's interfaces so the
 *     engine's output validates at the portal boundary. `types.ts` carries
 *     compile-time drift guards that fail the build if the engine shape
 *     stops being assignable to the mirror.
 *
 * Mirrored engine sources (keep in sync):
 *   - src/lib/tutor/student-profile/types.ts  (MasteryEntry, GapEntry, ...)
 *   - src/lib/tutor/topic-notes/types.ts      (RenderedTopicNotes, ...)
 *   - src/app/tutor/hooks/toolDefinitions.ts  (show_quiz / show_concept_map)
 *
 * Breaking change ⇒ bump to a `v2` sibling folder; v1 stays frozen.
 */

import { z } from 'zod';

export const CONTRACT_VERSION = 'v1' as const;

// ===========================================================================
// Shared primitives
// ===========================================================================

/** Whiteboard/voice engine selector — mirrors the `VoiceEngine` union in
 *  `src/app/tutor/page.tsx`. */
export const VoiceEngineSchema = z.enum([
  'classic',
  'realtime',
  'realtime-2',
  'realtime-validated',
  'claude-brain',
  'gemini-live',
]);

// ===========================================================================
// ENGINE-OWNED read shapes — MIRRORS of engine interfaces
// ===========================================================================

// --- student-profile/types.ts ---------------------------------------------

export const ConfidenceBandSchema = z.enum(['low', 'medium', 'high']);

export const MasteryEntrySchema = z.object({
  loId: z.string(),
  score: z.number(),
  exposures: z.number(),
  lastTouchedAt: z.string(),
  confidence: ConfidenceBandSchema.optional(),
});

export const GapSignalCodeSchema = z.enum([
  'MISCONCEPTION_DETECTED',
  'STUDENT_VERBALIZED_CONFUSION',
  'INCORRECT_AFTER_HINT',
  'NO_RECOVERY',
  'INCORRECT_STREAK_2_PLUS',
  'STUCK_CUE',
  'SLOW_SEGMENT',
]);

export const GapEvidenceSchema = z.object({
  signals: z.array(GapSignalCodeSchema),
  observation: z.string(),
  studentQuotes: z.array(z.string()),
});

export const GapEntrySchema = z.object({
  id: z.string(),
  kind: z.enum(['lo', 'prerequisite']).optional(),
  loId: z.string().optional(),
  conceptLabel: z.string().optional(),
  conceptId: z.string().optional(),
  status: z.enum(['candidate', 'confirmed', 'resolved', 'open']),
  confidence: z.number().optional(),
  evidence: GapEvidenceSchema.optional(),
  sessionIds: z.array(z.string()).optional(),
  firstSeenAt: z.string(),
  lastSeenAt: z.string(),
  description: z.string().optional(),
});

// --- topic-notes/types.ts (RenderedTopicNotes tree) ------------------------

export const SourceRefSchema = z.object({
  type: z.enum(['plan', 'textbook', 'frq', 'ced', 'other']).optional(),
  planId: z.string().optional(),
  segmentId: z.string().optional(),
  book: z.string().optional(),
  chapter: z.string().optional(),
  page: z.number().optional(),
  exam: z.string().optional(),
  frqNumber: z.string().optional(),
  url: z.string().optional(),
});

export const DiagramSpecSchema = z.object({
  type: z.string(),
  params: z.record(z.string(), z.unknown()),
});

export const TheoryEntrySchema = z.object({
  loId: z.string().nullable(),
  kind: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  diagram: DiagramSpecSchema.optional(),
  sources: z.array(SourceRefSchema).optional(),
});

export const MethodExampleSchema = z.object({
  problem: z.string(),
  solution: z.string(),
});

export const MethodEntrySchema = z.object({
  title: z.string(),
  when_to_use: z.string().optional(),
  steps: z.array(z.string()),
  example: MethodExampleSchema.optional(),
  diagram: DiagramSpecSchema.optional(),
  relatedLoIds: z.array(z.string()).optional(),
  sources: z.array(SourceRefSchema).optional(),
});

export const PointerEntrySchema = z.object({
  content: z.string(),
  kind: z.string().optional(),
  relatedLoIds: z.array(z.string()).optional(),
  sources: z.array(SourceRefSchema).optional(),
});

export const TheoryOverlaySchema = z.object({
  overlayId: z.string(),
  loId: z.string().nullable(),
  kind: z.enum(['expansion', 'prereq-refresher', 'student-add']),
  conceptLabel: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  diagram: DiagramSpecSchema.optional(),
  addedInSessionId: z.string(),
  addedAt: z.string(),
  rationale: z.string().optional(),
  sourceGapId: z.string().optional(),
  reinforcedInSessionIds: z.array(z.string()).optional(),
  lastReinforcedAt: z.string().optional(),
});

export const MethodOverlaySchema = z.object({
  overlayId: z.string(),
  title: z.string(),
  when_to_use: z.string().optional(),
  steps: z.array(z.string()),
  example: MethodExampleSchema.optional(),
  diagram: DiagramSpecSchema.optional(),
  alternativeTo: z.string().optional(),
  relatedLoIds: z.array(z.string()).optional(),
  addedInSessionId: z.string(),
  addedAt: z.string(),
  rationale: z.string().optional(),
  sourceGapId: z.string().optional(),
  reinforcedInSessionIds: z.array(z.string()).optional(),
  lastReinforcedAt: z.string().optional(),
});

export const PointerOverlaySchema = z.object({
  overlayId: z.string(),
  content: z.string(),
  kind: z.string().optional(),
  relatedLoIds: z.array(z.string()).optional(),
  addedInSessionId: z.string(),
  addedAt: z.string(),
  rationale: z.string().optional(),
  sourceGapId: z.string().optional(),
  reinforcedInSessionIds: z.array(z.string()).optional(),
  lastReinforcedAt: z.string().optional(),
});

export const RenderedTheorySectionSchema = z.object({
  prereqRefreshers: z.array(TheoryOverlaySchema),
  perLO: z.array(
    z.object({
      loId: z.string(),
      baseline: z.array(TheoryEntrySchema),
      expansions: z.array(TheoryOverlaySchema),
    }),
  ),
  studentAdds: z.array(TheoryOverlaySchema),
  orphans: z.array(TheoryOverlaySchema),
});

export const RenderedMethodsSectionSchema = z.object({
  baseline: z.array(MethodEntrySchema),
  overlays: z.array(MethodOverlaySchema),
});

export const RenderedPointersSectionSchema = z.object({
  baseline: z.array(PointerEntrySchema),
  overlays: z.array(PointerOverlaySchema),
});

export const RenderedTopicNotesSchema = z.object({
  baselineId: z.string(),
  course: z.string(),
  cedUnit: z.number(),
  cedTopic: z.string(),
  cedTitle: z.string(),
  baselineVersion: z.number(),
  theory: RenderedTheorySectionSchema,
  methods: RenderedMethodsSectionSchema,
  pointers: RenderedPointersSectionSchema,
});

// ===========================================================================
// Rendered artifacts — MIRRORS of show_quiz / show_concept_map tool inputs
// ===========================================================================

export const ShowQuizChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  correct: z.boolean().optional(),
});

export const ShowQuizItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  format: z.enum(['mcq', 'frq', 'numeric']),
  choices: z.array(ShowQuizChoiceSchema).optional(),
  expectedAnswer: z.string().optional(),
  tolerance: z.number().optional(),
  explanation: z.string().optional(),
});

export const ShowQuizPayloadSchema = z.object({
  title: z.string().optional(),
  items: z.array(ShowQuizItemSchema),
  immediate: z.boolean().optional(),
});

export const ShowConceptMapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  color: z.string().optional(),
  level: z.number().optional(),
});

export const ShowConceptMapEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  directed: z.boolean().optional(),
  color: z.string().optional(),
});

export const ShowConceptMapPayloadSchema = z.object({
  title: z.string().optional(),
  nodes: z.array(ShowConceptMapNodeSchema),
  edges: z.array(ShowConceptMapEdgeSchema).optional(),
  notes: z.string().optional(),
});

// ===========================================================================
// PORTAL-OWNED wire shapes — canonical zod (types derived via z.infer)
// ===========================================================================

// --- StudentContext (portal → engine) -------------------------------------

export const SocialThreadSchema = z.object({
  id: z.string(),
  /** SHORT, light, positive/neutral. */
  note: z.string(),
  kind: z.enum(['interest', 'event', 'context']).optional(),
  capturedAt: z.string(),
  lastReferencedAt: z.string().optional(),
});

export const StudentContextPreferencesSchema = z.object({
  humorCeiling: z.enum(['off', 'light', 'medium', 'heavy']).optional(),
  pacing: z.enum(['slower', 'default', 'faster']).optional(),
  modality: z.enum(['visual', 'equation', 'mixed']).optional(),
  tone: z.enum(['warm', 'peer', 'professional']).optional(),
  /** FIRST-CLASS: captured + stored now; brain-consumption ships Phase-2. */
  interests: z.array(z.string()).optional(),
  /** Portal/parent-set CEILING, min-clamped like humorCeiling. Default 'off'. */
  socialMemoryLevel: z.enum(['off', 'light', 'warm']).default('off'),
});

export const StudentContextProfileSchema = z.object({
  name: z.string(),
  grade: z.string(),
  locale: z.string().optional(),
  curriculum: z.string().optional(),
});

export const StudentContextTargetSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('lessonNode'), lessonNodeId: z.string() }),
  z.object({ kind: z.literal('freestyle'), freestyleMaterial: z.string() }),
]);

export const StudentContextSessionConfigSchema = z.object({
  voiceEngine: VoiceEngineSchema,
});

export const StudentContextSchema = z.object({
  /** Opaque, portal-minted; fits the existing profile id field. */
  studentId: z.string(),
  isTrial: z.boolean(),
  courseId: z.string(),
  profile: StudentContextProfileSchema,
  preferences: StudentContextPreferencesSchema,
  /** Portal-owned light threads; engine READS, never persists. */
  socialMemory: z.array(SocialThreadSchema).optional(),
  target: StudentContextTargetSchema,
  sessionConfig: StudentContextSessionConfigSchema,
});

// --- SessionResult (engine → portal; also a checkpoint) --------------------

export const SessionResultStatusSchema = z.enum([
  'completed',
  'in_progress',
  'aborted',
]);

export const SessionMilestoneSchema = z.enum([
  'first_concept_complete',
  'first_try_yourself_success',
  'recap_reached',
  'none',
]);

export const NotesTouchedEntrySchema = z.object({
  baselineId: z.string(),
  cedTopic: z.string(),
  cedTitle: z.string(),
});

export const LearningStateDeltaSchema = z.object({
  gaps: z.object({
    new: z.array(GapEntrySchema),
    promoted: z.array(z.string()),
    resolved: z.array(z.string()),
  }),
  mastery: z.array(MasteryEntrySchema),
});

export const SocialMemoryDeltaSchema = z.object({
  /** Light threads picked up this session. */
  new: z.array(SocialThreadSchema),
  /** Thread ids used this session (portal updates lastReferencedAt / decay). */
  referenced: z.array(z.string()),
});

export const RenderedArtifactsSchema = z.object({
  quizzes: z.array(ShowQuizPayloadSchema),
  conceptMaps: z.array(ShowConceptMapPayloadSchema),
});

export const SessionResultSchema = z.object({
  sessionId: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  status: SessionResultStatusSchema,
  milestone: SessionMilestoneSchema,
  notesTouched: z.array(NotesTouchedEntrySchema),
  learningStateDelta: LearningStateDeltaSchema,
  /** Engine SUGGESTS; portal STORES. Engine never persists this. Absent/empty
   *  until the Phase-2 social-memory behavior ships. */
  socialMemoryDelta: SocialMemoryDeltaSchema.optional(),
  renderedArtifacts: RenderedArtifactsSchema,
  transcriptRef: z.string().optional(),
  pdfRef: z.string().optional(),
});

// --- Session emit request (portal → engine; the emitter's INPUT) ----------
// Mirrors the internal session-commit body so the authed portal path reuses
// the same store functions. The emitter's OUTPUT is `SessionResult` above.

export const SessionEmitGapSchema = z.object({
  kind: z.enum(['lo', 'prerequisite']),
  loId: z.string().optional(),
  conceptLabel: z.string().optional(),
  observation: z.string(),
  studentQuotes: z.array(z.string()).default([]),
  signals: z.array(GapSignalCodeSchema).default([]),
});

export const SessionEmitRequestSchema = z.object({
  sessionId: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  /** 'in_progress' ⇒ checkpoint mode. */
  status: SessionResultStatusSchema.default('completed'),
  milestone: SessionMilestoneSchema.optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  grade: z.string().optional(),
  lessonPlanId: z.string().optional(),
  losTouched: z.array(z.string()).default([]),
  masteryDeltas: z.array(z.object({ loId: z.string(), delta: z.number() })).default([]),
  gaps: z.array(SessionEmitGapSchema).default([]),
  notesTouched: z.array(NotesTouchedEntrySchema).default([]),
  /** Optional explicit artifacts; otherwise sourced from the logged session. */
  renderedArtifacts: RenderedArtifactsSchema.optional(),
});

// --- Read endpoints -------------------------------------------------------

/** NotesRead === RenderedTopicNotes (existing resolve.ts output). */
export const NotesReadSchema = RenderedTopicNotesSchema;
/** GapsRead === staleness-filtered GapEntry[]. */
export const GapsReadSchema = z.array(GapEntrySchema);
/** MasteryRead === Record<loId, MasteryEntry>. */
export const MasteryReadSchema = z.record(z.string(), MasteryEntrySchema);

// --- Practice retrieval (retrieval, NOT generation) -----------------------

export const RetrievePracticeScopeSchema = z.union([
  z.object({ loId: z.string() }).strict(),
  z.object({ topicId: z.string() }).strict(),
]);

export const RetrievePracticeRequestSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  scope: RetrievePracticeScopeSchema,
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  count: z.number().int().positive(),
});

export const PracticeItemSchema = z.object({
  id: z.string(),
  /** Where the item came from. */
  source: z.enum(['plan-try-yourself', 'bank']),
  problemText: z.string(),
  expectedAnswer: z.string().optional(),
  hints: z.array(z.string()).optional(),
  responseFormat: z.enum(['mcq', 'frq', 'numeric', 'free']).optional(),
  choices: z.array(ShowQuizChoiceSchema).optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  /** Canonical LO code (the plan's los[].id), when known. */
  loId: z.string().optional(),
  /** CED topic reference (AP-Stats: most-specific topic level), when known. */
  cedCode: z.string().optional(),
});

export const RetrievePracticeResponseSchema = z.object({
  items: z.array(PracticeItemSchema),
});

// --- Free-response grading (rubric WHEN PRESENT, else single-answer judge) -

export const GradeFreeResponseRequestSchema = z.object({
  studentId: z.string(),
  itemId: z.string(),
  response: z.union([
    z.object({ text: z.string() }).strict(),
    z.object({ imageRef: z.string() }).strict(),
  ]),
});

export const GradeFreeResponsePartSchema = z.object({
  criterionId: z.string(),
  pointsAwarded: z.number(),
  maxPoints: z.number(),
  feedback: z.string(),
});

export const GradeFreeResponseResponseSchema = z.object({
  totalPoints: z.number(),
  maxPoints: z.number(),
  parts: z.array(GradeFreeResponsePartSchema),
  modelResponse: z.string(),
});

/** Optional AP-rubric representation on an FRQ item (Phase 3(d)). Existing
 *  single-`expectedAnswer` FRQs keep working (rubric absent → legacy judge). */
export const FrqRubricSchema = z.object({
  parts: z.array(
    z.object({
      criterionId: z.string(),
      maxPoints: z.number(),
      scoringCriteria: z.string(),
      modelResponse: z.string(),
    }),
  ),
});
