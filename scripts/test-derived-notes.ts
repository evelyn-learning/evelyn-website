/**
 * Derived-baseline topic-notes tests — generated (`gen-<uuid>`) lesson
 * plans can never have an authored TS-seed baseline, so before this
 * change `resolveTopicNotes` returned null for every one of their topics
 * forever, even after a student session wrote real overlays. See
 * `src/lib/tutor/topic-notes/derive-baseline.ts`.
 *
 * Run: `npm run test:derived-notes`
 *
 * No live DB required: `connectDB` is short-circuited by pre-populating
 * the module-level `global.mongooseCache.conn` with a dummy truthy value
 * (see `src/lib/db.ts` — `connectDB` returns `cached.conn` immediately
 * when set, before ever calling `mongoose.connect`), and both
 * `LessonPlanModel.findById` / `StudentTopicNotesModel.findById` +
 * `findByIdAndUpdate` are stubbed directly, mirroring the DB-stub
 * convention in `scripts/test-practice-generated-plans.ts`. Note that
 * convention stubs `connectDB` itself via its default-export slot — that
 * relies on CJS `require()` semantics (that script runs under `ts-node
 * --compiler-options '{"module":"commonjs"}'`). This script runs under
 * `tsx` (ESM), where a default-export reassignment does NOT propagate to
 * other modules' already-bound `import connectDB from '@core/db'`
 * references — hence the `global.mongooseCache` short-circuit instead,
 * which is a plain object mutation and propagates regardless of ESM/CJS
 * import semantics. `MONGODB_URI` still needs a truthy dummy value (set
 * via the npm script, not here — `db.ts` reads it into a module-level
 * const at import time, before any of this file's own top-level code can
 * run) so `connectDB`'s early "not configured" throw never fires.
 */
import { strict as assert } from 'node:assert';
import { resolveTopicNotes } from '@/lib/tutor/topic-notes/resolve';
import { deriveBaselineFromPlan } from '@/lib/tutor/topic-notes/derive-baseline';
import { listTopicNotesBaselines } from '@/lib/tutor/topic-notes/store';
import { LessonPlanModel } from '@/models/LessonPlan';
import { StudentTopicNotesModel } from '@/models/StudentTopicNotes';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { StudentTopicNotes } from '@/lib/tutor/topic-notes/types';

if (!process.env.MONGODB_URI) {
  throw new Error('run via `npm run test:derived-notes` — it sets a dummy MONGODB_URI so db.ts never throws before the mongooseCache short-circuit below takes effect');
}
// db.ts's `connectDB` closes over a module-level `cached` const that was
// already bound to `global.mongooseCache` by the time any of THIS file's
// top-level code runs (db.ts is transitively imported above, and imports
// are evaluated before the rest of this file). So this MUST mutate the
// existing object's `.conn` property, not replace `global.mongooseCache`
// with a new object — a replacement would leave db.ts's `cached` closure
// variable pointing at the old (still-null) object.
type MongooseCache = { conn: unknown; promise: unknown };
const g = global as unknown as { mongooseCache?: MongooseCache };
if (g.mongooseCache) {
  g.mongooseCache.conn = {}; // truthy dummy — connectDB() returns this immediately
} else {
  g.mongooseCache = { conn: {}, promise: null };
}

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

// --- LessonPlanModel stub ---------------------------------------------------
let stubbedPlans: Record<string, LessonPlan> = {};
let findByIdCallCount = 0;
(LessonPlanModel as unknown as {
  findById: (id: string) => Promise<{ toJSON: () => LessonPlan } | null>;
}).findById = async (id: string) => {
  findByIdCallCount++;
  const plan = stubbedPlans[id];
  return plan ? { toJSON: () => plan } : null;
};

// --- StudentTopicNotesModel stub -------------------------------------------
let stubbedNotes: Record<string, StudentTopicNotes> = {};
(StudentTopicNotesModel as unknown as {
  findById: (id: string) => Promise<{ toJSON: () => StudentTopicNotes } | null>;
}).findById = async (id: string) => {
  const n = stubbedNotes[id];
  return n ? { toJSON: () => n } : null;
};
(StudentTopicNotesModel as unknown as {
  findByIdAndUpdate: (id: string, update: { $set: StudentTopicNotes }) => Promise<{ toJSON: () => StudentTopicNotes }>;
}).findByIdAndUpdate = async (id: string, update: { $set: StudentTopicNotes }) => {
  stubbedNotes[id] = update.$set;
  return { toJSON: () => update.$set };
};

// A minimal generated plan shaped exactly like generate-from-text.ts's
// output: two LOs, each with hook/concept/worked_example/try_yourself
// segments namespaced "<loId>-<kind>" (namespaceGeneratedLos's convention,
// which loGroupOf/derive-baseline.ts reverses).
const GEN_PLAN_ID = 'gen-test-cphq-uuid-1';
const LO1 = `${GEN_PLAN_ID}.lo-1`;
const LO2 = `${GEN_PLAN_ID}.lo-2`;
const GEN_PLAN: LessonPlan = {
  id: GEN_PLAN_ID,
  title: 'Quality Program Structure and Governance',
  curriculum: 'freestyle',
  grade: 'college',
  subject: 'Healthcare Quality',
  topic: 'CPHQ Domain 1',
  locale: 'en',
  los: [
    { id: LO1, description: 'Describe how a quality council governs program structure.', shortTitle: 'Quality council governance' },
    { id: LO2, description: 'Explain accountability lines between departments and leadership.', shortTitle: 'Accountability lines' },
  ],
  estimatedMinutes: 20,
  segments: [
    { id: 'intro', kind: 'hook', goal: 'Acknowledge the two objectives.' },
    { id: `${LO1}-hook`, kind: 'hook', goal: 'Why governance structure matters for accreditation.' },
    {
      id: `${LO1}-concept`,
      kind: 'concept',
      goal: 'Explain the quality council model.',
      keyIdeas: ['A quality council sets program priorities.', 'Reporting lines run up to the board.'],
    },
    {
      id: `${LO1}-worked`,
      kind: 'worked_example',
      problem: 'A hospital reorganizes its quality council reporting line — walk through who reports to whom.',
      steps: ['Identify the quality council.', 'Map reporting line to the board.', 'Confirm accountability for outcomes.'],
      answer: 'The quality council reports to the governing board.',
    },
    {
      id: `${LO1}-try`,
      kind: 'try_yourself',
      problem: 'Who does a hospital quality council typically report to?',
      expectedAnswer: 'The governing board',
    },
    { id: `${LO2}-concept`, kind: 'concept', goal: 'Explain cross-department accountability.', keyIdeas: ['Department leads answer to a quality officer.'] },
    { id: `${LO2}-try`, kind: 'try_yourself', problem: 'Who holds departments accountable for quality outcomes?', expectedAnswer: 'The quality officer' },
    { id: 'recap', kind: 'recap', mustRemember: ['Quality council reports to the board.', 'Departments answer to the quality officer.'] },
  ] as unknown as LessonPlan['segments'],
  schemaVersion: 1,
  metadata: { generatedFromText: true, generatorOk: true },
};

const STUDENT_ID = '1adfb404-ba04-475b-957a-cad3bbe5fe62';

(async () => {
  await test('deriveBaselineFromPlan — one theory entry per LO, worked-example content folded in, method extracted', () => {
    const baseline = deriveBaselineFromPlan(GEN_PLAN);
    assert.ok(baseline, 'baseline should be derived');
    assert.equal(baseline!.baselineId, GEN_PLAN_ID);
    assert.equal(baseline!.planId, GEN_PLAN_ID);
    assert.equal(baseline!.course, 'Healthcare Quality');
    assert.equal(baseline!.cedTitle, GEN_PLAN.title);
    assert.equal(baseline!.baselineVersion, 0);
    assert.equal(baseline!.derived, true);
    assert.equal(baseline!.theory.length, 2, 'one theory entry per LO');
    const lo1Entry = baseline!.theory.find((t) => t.loId === LO1);
    assert.ok(lo1Entry, 'LO1 theory entry present');
    assert.ok(lo1Entry!.content.includes('Describe how a quality council governs'), 'LO description folded into content');
    assert.ok(
      lo1Entry!.content.includes('reorganizes its quality council reporting line'),
      'most content-ful segment (worked example) folded into content, not the shorter hook',
    );
    assert.equal(baseline!.methods.length, 1, 'exactly one worked_example segment across both LOs');
    assert.deepEqual(baseline!.methods[0].steps, GEN_PLAN.segments[3] && (GEN_PLAN.segments as unknown as { steps: string[] }[])[3].steps);
    assert.equal(baseline!.pointers.length, 0, 'no pointers extracted — documented "else empty"');
  });

  await test('deriveBaselineFromPlan — a plan with no LOs returns null', () => {
    const empty: LessonPlan = { ...GEN_PLAN, los: [] };
    assert.equal(deriveBaselineFromPlan(empty), null);
  });

  await test('resolveTopicNotes — registry miss + stored generated plan renders per-LO theory', async () => {
    stubbedPlans = { [GEN_PLAN_ID]: GEN_PLAN };
    stubbedNotes = {};
    const rendered = await resolveTopicNotes(STUDENT_ID, GEN_PLAN_ID);
    assert.ok(rendered, 'derived baseline should resolve, not 404');
    assert.equal(rendered!.baselineId, GEN_PLAN_ID);
    assert.equal(rendered!.theory.perLO.length, 2);
    assert.deepEqual(rendered!.theory.perLO.map((g) => g.loId).sort(), [LO1, LO2].sort());
    assert.equal(rendered!.methods.baseline.length, 1);
    assert.deepEqual(rendered!.theory.prereqRefreshers, []);
    assert.deepEqual(rendered!.theory.studentAdds, []);
    assert.deepEqual(rendered!.theory.orphans, []);
  });

  await test('resolveTopicNotes — overlays merge onto a derived baseline exactly as onto an authored one', async () => {
    stubbedPlans = { [GEN_PLAN_ID]: GEN_PLAN };
    const now = new Date().toISOString();
    const noteId = `${STUDENT_ID}::${GEN_PLAN_ID}`;
    stubbedNotes = {
      [noteId]: {
        id: noteId,
        studentId: STUDENT_ID,
        baselineId: GEN_PLAN_ID,
        baselineVersionAtFork: 0,
        theoryOverlays: [
          {
            overlayId: 'ov-1',
            loId: LO1,
            kind: 'expansion',
            title: 'From my session',
            content: 'From my session: the council also signs off on annual QAPI priorities.',
            addedInSessionId: 'sess-1',
            addedAt: now,
          },
        ],
        methodsAdds: [],
        pointersAdds: [
          {
            overlayId: 'ov-2',
            content: 'Watch for "quality council" vs "quality committee" — CPHQ questions use both terms for the same body.',
            kind: 'tip',
            addedInSessionId: 'sess-1',
            addedAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
        schemaVersion: 1,
      },
    };
    const rendered = await resolveTopicNotes(STUDENT_ID, GEN_PLAN_ID);
    assert.ok(rendered);
    const lo1Group = rendered!.theory.perLO.find((g) => g.loId === LO1);
    assert.ok(lo1Group, 'LO1 group present');
    assert.equal(lo1Group!.expansions.length, 1);
    assert.equal(lo1Group!.expansions[0].overlayId, 'ov-1');
    assert.equal(rendered!.pointers.overlays.length, 1);
    assert.equal(rendered!.pointers.overlays[0].overlayId, 'ov-2');
    // Baseline content is untouched by the overlay merge.
    assert.equal(rendered!.pointers.baseline.length, 0);
  });

  await test('resolveTopicNotes — registry hit is byte-identical: no plan lookup attempted', async () => {
    const registered = listTopicNotesBaselines()[0];
    assert.ok(registered, 'at least one authored baseline must be registered to run this check');
    stubbedPlans = {}; // if the code path fell through to derivation, this would 404
    stubbedNotes = {};
    const before = findByIdCallCount;
    const rendered = await resolveTopicNotes(STUDENT_ID, registered.baselineId);
    assert.ok(rendered, 'authored baseline should still resolve');
    assert.equal(rendered!.baselineId, registered.baselineId);
    assert.equal(findByIdCallCount, before, 'LessonPlanModel.findById must NOT be called on a registry hit');
  });

  await test('resolveTopicNotes — registry miss + no stored plan returns null exactly as before', async () => {
    stubbedPlans = {};
    stubbedNotes = {};
    const rendered = await resolveTopicNotes(STUDENT_ID, 'gen-does-not-exist-anywhere');
    assert.equal(rendered, null);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
