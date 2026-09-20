/**
 * Portal Contract v1 — conformance tests.
 *
 * Run: `npm run test:portal-contract`
 *
 * Two kinds of assurance:
 *   1. COMPILE-TIME — sample objects are typed as the real ENGINE interfaces
 *      (MasteryEntry / GapEntry / RenderedTopicNotes). ts-node type-checks
 *      this file, so if the engine shape and the contract diverge, this file
 *      fails to compile (in addition to the drift guards in types.ts).
 *   2. RUNTIME — every sample is validated through the v1 zod schemas, and
 *      the portal-owned wire shapes (StudentContext / SessionResult /
 *      practice / grading) round-trip, reject malformed input, and apply the
 *      socialMemoryLevel default.
 *
 * Style mirrors scripts/test-cross-session-promotion.ts (node:assert,
 * table-driven, PASS/FAIL counters, non-zero exit on failure).
 */

import assert from 'node:assert';

import type {
  MasteryEntry as EngineMasteryEntry,
  GapEntry as EngineGapEntry,
} from '@/lib/tutor/student-profile/types';
import type { RenderedTopicNotes as EngineRenderedTopicNotes } from '@/lib/tutor/topic-notes/types';

// Side-effect import so this runner also type-checks the engine↔contract
// drift guards (also enforced by tsc/next build).
import '@/lib/tutor/portal/contract-drift-guard';

import {
  CONTRACT_VERSION,
  MasteryEntrySchema,
  MasteryReadSchema,
  GapEntrySchema,
  GapsReadSchema,
  RenderedTopicNotesSchema,
  NotesReadSchema,
  StudentContextSchema,
  SessionResultSchema,
  RetrievePracticeRequestSchema,
  RetrievePracticeResponseSchema,
  GradeFreeResponseRequestSchema,
  GradeFreeResponseResponseSchema,
  ShowQuizPayloadSchema,
  ShowConceptMapPayloadSchema,
  FrqRubricSchema,
  AssignedPracticeRequestSchema,
  AssignedPracticeResponseSchema,
} from '@evelyn/portal-contract/v1';

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}
function ok(schema: { safeParse: (v: unknown) => { success: boolean } }, value: unknown, msg: string) {
  const r = schema.safeParse(value);
  assert.strictEqual(r.success, true, `${msg} — expected VALID but got errors`);
}
function bad(schema: { safeParse: (v: unknown) => { success: boolean } }, value: unknown, msg: string) {
  const r = schema.safeParse(value);
  assert.strictEqual(r.success, false, `${msg} — expected INVALID but it passed`);
}

// ---------------------------------------------------------------------------
// Sample data typed as the REAL engine interfaces (compile-time conformance)
// ---------------------------------------------------------------------------

const engineMastery: EngineMasteryEntry = {
  loId: 'apstats.normal-distribution',
  score: 0.72,
  exposures: 4,
  lastTouchedAt: '2026-06-26T00:00:00.000Z',
  confidence: 'medium',
};

const engineGapFull: EngineGapEntry = {
  id: 'gap-1',
  kind: 'lo',
  loId: 'apstats.normal-distribution',
  status: 'confirmed',
  confidence: 0.75,
  evidence: {
    signals: ['MISCONCEPTION_DETECTED', 'INCORRECT_AFTER_HINT'],
    observation: 'Confused z-score direction.',
    studentQuotes: ['so a higher z means below the mean?'],
  },
  sessionIds: ['s1', 's2'],
  firstSeenAt: '2026-06-20T00:00:00.000Z',
  lastSeenAt: '2026-06-26T00:00:00.000Z',
};

// Legacy-minimal gap: only the always-present fields (pre-evidence schema).
const engineGapLegacy: EngineGapEntry = {
  id: 'gap-legacy',
  status: 'open',
  firstSeenAt: '2026-01-01T00:00:00.000Z',
  lastSeenAt: '2026-01-01T00:00:00.000Z',
  description: 'old single-string description',
};

const engineNotes: EngineRenderedTopicNotes = {
  baselineId: 'evelyn.ap.stats.normal.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.10',
  cedTitle: 'The Normal Distribution',
  baselineVersion: 1,
  theory: {
    prereqRefreshers: [],
    perLO: [
      {
        loId: 'apstats.normal-distribution',
        baseline: [{ loId: 'apstats.normal-distribution', content: '68-95-99.7 rule.', kind: 'framework' }],
        expansions: [
          {
            overlayId: 'ov-1',
            loId: 'apstats.normal-distribution',
            kind: 'expansion',
            content: 'Sketch the curve and shade.',
            addedInSessionId: 's2',
            addedAt: '2026-06-26T00:00:00.000Z',
            sourceGapId: 'gap-1',
          },
        ],
      },
    ],
    studentAdds: [],
    orphans: [],
  },
  methods: { baseline: [], overlays: [] },
  pointers: { baseline: [], overlays: [] },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

console.log(`\nPortal Contract conformance (version=${CONTRACT_VERSION})\n`);

console.log('Engine-owned read shapes (runtime conformance):');
test('MasteryEntry — real engine object validates', () => ok(MasteryEntrySchema, engineMastery, 'mastery'));
test('MasteryRead — Record<loId, MasteryEntry> validates', () =>
  ok(MasteryReadSchema, { [engineMastery.loId]: engineMastery }, 'mastery-read'));
test('GapEntry — full evidence gap validates', () => ok(GapEntrySchema, engineGapFull, 'gap-full'));
test('GapEntry — legacy minimal gap validates', () => ok(GapEntrySchema, engineGapLegacy, 'gap-legacy'));
test('GapsRead — GapEntry[] validates', () => ok(GapsReadSchema, [engineGapFull, engineGapLegacy], 'gaps-read'));
test('RenderedTopicNotes — real engine object validates', () => ok(RenderedTopicNotesSchema, engineNotes, 'notes'));
test('NotesRead === RenderedTopicNotes', () => ok(NotesReadSchema, engineNotes, 'notes-read'));
test('GapEntry — bad status rejected', () =>
  bad(GapEntrySchema, { ...engineGapFull, status: 'archived' }, 'gap-bad-status'));

console.log('\nStudentContext (portal → engine):');
const minimalContext = {
  studentId: 'partner1:abc',
  isTrial: false,
  courseId: 'ap-statistics',
  profile: { name: 'Sam', grade: '12' },
  preferences: {},
  target: { kind: 'lessonNode', lessonNodeId: 'evelyn.ap.stats.normal.v1' },
  sessionConfig: { voiceEngine: 'claude-brain' },
};
test('StudentContext — minimal valid', () => ok(StudentContextSchema, minimalContext, 'ctx-min'));
test('StudentContext — socialMemoryLevel defaults to off', () => {
  const r = StudentContextSchema.parse(minimalContext);
  assert.strictEqual(r.preferences.socialMemoryLevel, 'off', 'default not applied');
});
test('StudentContext — round-trips socialMemory + interests + socialMemoryLevel', () => {
  const full = {
    ...minimalContext,
    preferences: {
      humorCeiling: 'light',
      pacing: 'default',
      modality: 'mixed',
      tone: 'warm',
      interests: ['spider-man', 'basketball'],
      socialMemoryLevel: 'warm',
    },
    socialMemory: [
      { id: 't1', note: 'mentioned the new Spider-Man Sat', kind: 'event', capturedAt: '2026-06-20T00:00:00.000Z' },
    ],
  };
  const r = StudentContextSchema.parse(full);
  assert.deepStrictEqual(r.preferences.interests, ['spider-man', 'basketball']);
  assert.strictEqual(r.preferences.socialMemoryLevel, 'warm');
  assert.strictEqual(r.socialMemory?.[0].note, 'mentioned the new Spider-Man Sat');
});
test('StudentContext — freestyle target valid', () =>
  ok(StudentContextSchema, { ...minimalContext, target: { kind: 'freestyle', freestyleMaterial: 'a worksheet' } }, 'ctx-freestyle'));
test('StudentContext — bad target kind rejected', () =>
  bad(StudentContextSchema, { ...minimalContext, target: { kind: 'whatever', x: 1 } }, 'ctx-bad-target'));
test('StudentContext — missing required profile rejected', () => {
  const { profile: _p, ...rest } = minimalContext;
  bad(StudentContextSchema, rest, 'ctx-no-profile');
});
test('StudentContext — bad voiceEngine rejected', () =>
  bad(StudentContextSchema, { ...minimalContext, sessionConfig: { voiceEngine: 'gpt-realtime' } }, 'ctx-bad-engine'));

console.log('\nSessionResult (engine → portal, + checkpoint mode):');
const baseResult = {
  sessionId: 'sess-1',
  studentId: 'partner1:abc',
  courseId: 'ap-statistics',
  status: 'completed',
  milestone: 'first_try_yourself_success',
  notesTouched: [{ baselineId: 'evelyn.ap.stats.normal.v1', cedTopic: '1.10', cedTitle: 'The Normal Distribution' }],
  learningStateDelta: {
    gaps: { new: [engineGapFull], promoted: ['gap-1'], resolved: [] },
    mastery: [engineMastery],
  },
  renderedArtifacts: { quizzes: [], conceptMaps: [] },
};
test('SessionResult — completed, no socialMemoryDelta (omittable)', () => ok(SessionResultSchema, baseResult, 'result-min'));
test('SessionResult — checkpoint mode status:in_progress', () =>
  ok(SessionResultSchema, { ...baseResult, status: 'in_progress' }, 'result-checkpoint'));
test('SessionResult — with socialMemoryDelta validates', () =>
  ok(SessionResultSchema, {
    ...baseResult,
    socialMemoryDelta: { new: [{ id: 't2', note: 'got a puppy named Rex', capturedAt: '2026-06-26T00:00:00.000Z' }], referenced: ['t1'] },
  }, 'result-social'));
test('SessionResult — bad status rejected', () =>
  bad(SessionResultSchema, { ...baseResult, status: 'paused' }, 'result-bad-status'));

console.log('\nRendered artifacts (show_quiz / show_concept_map mirrors):');
test('ShowQuizPayload — mcq + frq + numeric items', () =>
  ok(ShowQuizPayloadSchema, {
    title: 'Quick check',
    immediate: true,
    items: [
      { id: 'q1', question: 'Pick one', format: 'mcq', choices: [{ id: 'a', text: 'A', correct: true }, { id: 'b', text: 'B' }] },
      { id: 'q2', question: 'Explain', format: 'frq', expectedAnswer: 'because' },
      { id: 'q3', question: 'Compute', format: 'numeric', expectedAnswer: '3.14', tolerance: 0.01 },
    ],
  }, 'quiz'));
test('ShowQuizPayload — bad format rejected', () =>
  bad(ShowQuizPayloadSchema, { items: [{ id: 'q1', question: 'x', format: 'essay' }] }, 'quiz-bad-format'));
test('ShowConceptMapPayload — nodes + edges', () =>
  ok(ShowConceptMapPayloadSchema, {
    title: 'Map',
    nodes: [{ id: 'n1', label: 'Root', level: 0 }, { id: 'n2', label: 'Child' }],
    edges: [{ from: 'n1', to: 'n2', directed: true }],
    notes: 'hi',
  }, 'cmap'));
test('ShowConceptMapPayload — missing nodes rejected', () =>
  bad(ShowConceptMapPayloadSchema, { edges: [] }, 'cmap-no-nodes'));

console.log('\nPractice retrieval + grading:');
test('RetrievePracticeRequest — scope by loId', () =>
  ok(RetrievePracticeRequestSchema, { studentId: 's', courseId: 'c', scope: { loId: 'apstats.x' }, count: 3 }, 'retr-lo'));
test('RetrievePracticeRequest — scope by topicId', () =>
  ok(RetrievePracticeRequestSchema, { studentId: 's', courseId: 'c', scope: { topicId: 'ap-statistics' }, difficulty: 2, count: 1 }, 'retr-topic'));
test('RetrievePracticeRequest — both loId+topicId rejected (strict union)', () =>
  bad(RetrievePracticeRequestSchema, { studentId: 's', courseId: 'c', scope: { loId: 'x', topicId: 'y' }, count: 1 }, 'retr-both'));
test('RetrievePracticeResponse — items validate', () =>
  ok(RetrievePracticeResponseSchema, {
    items: [
      { id: 'p1', source: 'plan-try-yourself', problemText: 'try this', loId: 'apstats.x', cedCode: 'AP-STATS-1.10' },
      { id: 'p2', source: 'bank', problemText: 'bank one', difficulty: 3, responseFormat: 'numeric' },
    ],
  }, 'retr-resp'));
test('GradeFreeResponseRequest — text response', () =>
  ok(GradeFreeResponseRequestSchema, { studentId: 's', itemId: 'i', response: { text: 'my answer' } }, 'grade-text'));
test('GradeFreeResponseRequest — imageRef response', () =>
  ok(GradeFreeResponseRequestSchema, { studentId: 's', itemId: 'i', response: { imageRef: 'blob://x' } }, 'grade-img'));
test('GradeFreeResponseRequest — both text+imageRef rejected', () =>
  bad(GradeFreeResponseRequestSchema, { studentId: 's', itemId: 'i', response: { text: 'a', imageRef: 'b' } }, 'grade-both'));
test('GradeFreeResponseResponse — part-by-part validates', () =>
  ok(GradeFreeResponseResponseSchema, {
    totalPoints: 2, maxPoints: 3,
    parts: [{ criterionId: 'c1', pointsAwarded: 1, maxPoints: 1, feedback: 'good' }, { criterionId: 'c2', pointsAwarded: 1, maxPoints: 2, feedback: 'partial' }],
    modelResponse: 'full solution',
  }, 'grade-resp'));
test('FrqRubric — parts validate', () =>
  ok(FrqRubricSchema, { parts: [{ criterionId: 'c1', maxPoints: 2, scoringCriteria: 'states H0/Ha', modelResponse: 'H0: p=0.5' }] }, 'rubric'));

console.log('\nAssigned practice (v1.15.0 — homework read, spec §C.8):');
test('AssignedPracticeRequest — studentId only', () =>
  ok(AssignedPracticeRequestSchema, { studentId: 's' }, 'assigned-req-min'));
test('AssignedPracticeRequest — with courseId + includeAcknowledged', () =>
  ok(AssignedPracticeRequestSchema, { studentId: 's', courseId: 'ap-statistics', includeAcknowledged: true }, 'assigned-req-full'));
test('AssignedPracticeRequest — missing studentId rejected', () =>
  bad(AssignedPracticeRequestSchema, { courseId: 'ap-statistics' }, 'assigned-req-bad'));
test('AssignedPracticeResponse — assignments with status validate', () =>
  ok(AssignedPracticeResponseSchema, {
    assignments: [{
      assignmentId: 'a1',
      sessionId: 's1',
      assignedAt: '2026-09-05T00:00:00.000Z',
      locator: 'Unit 2 · Practice',
      los: [{
        loId: 'apstats.normal-distribution',
        title: 'Normal distribution',
        reason: 'still shaky on z-scores',
        items: [{ id: 'p1', source: 'plan-try-yourself', problemText: 'try this' }],
        status: { attempted: 1, correct: 1, total: 1, lastAttemptAt: '2026-09-05T01:00:00.000Z' },
      }],
    }],
  }, 'assigned-resp'));

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
