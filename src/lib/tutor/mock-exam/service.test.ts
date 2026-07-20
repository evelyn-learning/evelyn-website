import { strict as assert } from 'node:assert';
import {
  memoryMockStores,
  startOrResume,
  listForms,
  saveResponses,
  advance,
  GRACE_MS,
  ATTEMPT_TTL_MS,
  type FormDoc,
} from './service';
import { FIXTURE_FORM, FIXTURE_ITEMS } from './fixtures';
import type { SeedableItem } from './fixtures';
import { registerBlueprint, type ExamBlueprint } from './blueprints';

const T0 = 1_750_000_000_000;

// Dedicated blueprint (not the shared FIXTURE_BLUEPRINT, whose modules are
// all uniformly 4min and so can't distinguish position-matched from
// id-matched lookups) with deliberately asymmetric module time limits, to
// prove the fresh-start deadline stamp matches the form's first module by
// moduleId rather than by array position.
const ALL_TOOLS = { desmos: false, referenceSheet: false, eliminator: false, highlighter: false };
const MISMATCH_BLUEPRINT: ExamBlueprint = {
  examKey: 'fixture-mismatch-test',
  examType: 'fixture',
  label: 'Mismatch Test',
  sections: [
    {
      sectionId: 'sec1', label: 'Section 1', tools: ALL_TOOLS,
      modules: [
        { moduleId: 'm1', label: 'Module 1', questionCount: 1, timeLimitMin: 5 },
        { moduleId: 'm2', label: 'Module 2', questionCount: 1, timeLimitMin: 9 },
      ],
    },
  ],
  scoring: {
    kind: 'scaled-sections', sectionScaledMin: 10, sectionScaledMax: 40, compositeMin: 10, compositeMax: 40,
    curves: { sec1: { default: [[0, 10], [1, 40]] } },
  },
};
registerBlueprint(MISMATCH_BLUEPRINT);

const MISMATCH_ITEMS: SeedableItem[] = [
  { id: 'mm-1', loId: 'mm.lo', topic: 'Mismatch', topicId: 'mismatch', difficulty: 1, responseFormat: 'mcq', problemText: 'x?', choices: ['A', 'B'], answer: 'A', bankScope: 'mock' },
  { id: 'mm-2', loId: 'mm.lo', topic: 'Mismatch', topicId: 'mismatch', difficulty: 1, responseFormat: 'mcq', problemText: 'y?', choices: ['A', 'B'], answer: 'A', bankScope: 'mock' },
];

// Form lists 'm2' FIRST — reversed vs the blueprint's [m1, m2] order.
const MISMATCH_FORM: FormDoc = {
  formId: 'mismatch-form',
  examKey: 'fixture-mismatch-test',
  topicIds: ['mismatch'],
  label: 'Mismatch Form',
  status: 'live',
  sections: [
    { sectionId: 'sec1', modules: [
      { moduleId: 'm2', itemIds: ['mm-1'] },
      { moduleId: 'm1', itemIds: ['mm-2'] },
    ] },
  ],
};

let passed = 0, failed = 0;
function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve().then(fn)
    .then(() => { passed++; console.log(`  ok - ${name}`); })
    .catch((e) => { failed++; console.log(`  FAIL - ${name}`); console.error(e); });
}

async function run() {
  await test('start pins module 1 and strips answers', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, { studentId: 's1', topicId: 'fixture', formId: 'fixture-form-a' }, T0);
    assert.equal(state.status, 'in_section');
    assert.equal(state.section!.deadlineAt, T0 + 4 * 60_000);
    assert.deepEqual(state.section!.items.map((i) => i.itemId), ['fx-m1-1', 'fx-m1-2']);
    assert.ok(!JSON.stringify(state.section).includes('"answer"'));
    assert.ok(!JSON.stringify(state.section).includes('rubric'));
  });

  await test('re-entry within deadline re-serves same module with saved responses', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const first = await startOrResume(stores, { studentId: 's1', topicId: 'fixture', formId: 'fixture-form-a' }, T0);

    // saveResponses doesn't exist until Task 8 — simulate it by writing
    // directly into the store's attempt.
    const attempt = await stores.findAttempt(first.attemptId);
    assert.ok(attempt);
    attempt!.responses = [{ itemId: 'fx-m1-1', answer: 'A' }];
    await stores.saveAttempt(attempt!);

    const again = await startOrResume(stores, { studentId: 's1', topicId: 'fixture', formId: 'fixture-form-a' }, T0 + 60_000);
    assert.equal(again.attemptId, first.attemptId);
    assert.equal(again.status, 'in_section');
    assert.deepEqual(again.section!.items.map((i) => i.itemId), ['fx-m1-1', 'fx-m1-2']);
    assert.equal(again.section!.savedResponses.length, 1);
    assert.equal(again.section!.savedResponses[0].answer, 'A');
  });

  await test('start after 7 days expires the old attempt and starts fresh', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const first = await startOrResume(stores, { studentId: 's1', topicId: 'fixture', formId: 'fixture-form-a' }, T0);
    const again = await startOrResume(stores, { studentId: 's1', topicId: 'fixture', formId: 'fixture-form-a' }, T0 + ATTEMPT_TTL_MS + 1);
    assert.notEqual(again.attemptId, first.attemptId);
    const old = await stores.findAttempt(first.attemptId);
    assert.equal(old!.status, 'expired');
  });

  await test('listForms reports adaptive question counts once (3 not 4 for fixture)', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const { forms } = await listForms(stores, 's1', 'fixture', T0);
    assert.equal(forms[0].sections[0].questionCount, 3);   // 2 (m1) + 1 (one m2 variant)
    assert.equal(forms[0].totalTimeMin, 12);               // 4 + 4 + 4
  });

  await test('fresh start matches the first module by moduleId, not array position, when stamping the deadline', async () => {
    const stores = memoryMockStores({ forms: [MISMATCH_FORM], items: MISMATCH_ITEMS });
    const state = await startOrResume(stores, { studentId: 's1', topicId: 'mismatch', formId: 'mismatch-form' }, T0);
    // Form's first module is 'm2' (timeLimitMin 9), even though the blueprint's
    // array position 0 is 'm1' (timeLimitMin 5). A position-based lookup would
    // wrongly stamp T0 + 5*60_000; id-based matching stamps T0 + 9*60_000.
    assert.equal(state.section!.deadlineAt, T0 + 9 * 60_000);
    assert.deepEqual(state.section!.items.map((i) => i.itemId), ['mm-1']);
  });

  await test('fresh start throws form_module_not_in_blueprint when the form references a module the blueprint lacks', async () => {
    const badForm: FormDoc = {
      ...MISMATCH_FORM,
      formId: 'bad-form',
      sections: [{ sectionId: 'sec1', modules: [{ moduleId: 'not-a-real-module', itemIds: ['mm-1'] }] }],
    };
    const stores = memoryMockStores({ forms: [badForm], items: MISMATCH_ITEMS });
    await assert.rejects(
      () => startOrResume(stores, { studentId: 's1', topicId: 'mismatch', formId: 'bad-form' }, T0),
      /form_module_not_in_blueprint/
    );
  });

  // --- Task 8: saveResponses / advance / finalize ---

  const START = { studentId: 's1', topicId: 'fixture', formId: 'fixture-form-a' };

  await test('merge autosave: markedForReview does not wipe answer', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    const attemptId = state.attemptId;

    // First save writes an answer.
    await saveResponses(stores, {
      studentId: 's1', attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', answer: 'A' }],
    }, T0 + 1_000);
    // Second (autosave) carries ONLY markedForReview.
    await saveResponses(stores, {
      studentId: 's1', attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', markedForReview: true }],
    }, T0 + 2_000);

    const attempt = await stores.findAttempt(attemptId);
    const r = attempt!.responses.find((x) => x.itemId === 'fx-m1-1');
    assert.equal(r!.answer, 'A');            // not wiped
    assert.equal(r!.markedForReview, true);  // merged in
  });

  await test('saveResponses ignores itemIds outside the open module', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await saveResponses(stores, {
      studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m2h-1', answer: '42' }],
    }, T0 + 1_000);
    const attempt = await stores.findAttempt(state.attemptId);
    assert.deepEqual(attempt!.responses.map((r) => r.itemId), ['fx-m1-1']);
  });

  await test('save after deadline+grace rejects with deadline_passed', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await assert.rejects(
      () => saveResponses(stores, {
        studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
        responses: [{ itemId: 'fx-m1-1', answer: 'A' }],
      }, T0 + 4 * 60_000 + GRACE_MS + 1),
      /deadline_passed/
    );
  });

  await test('save with mismatched cursor rejects with attempt_not_open', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await assert.rejects(
      () => saveResponses(stores, {
        studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 1 },
        responses: [{ itemId: 'fx-m1-1', answer: 'A' }],
      }, T0 + 1_000),
      /attempt_not_open/
    );
  });

  await test('advance from m1 with 2/2 routes to m2-hard', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await saveResponses(stores, {
      studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m1-2', answer: 'B' }],
    }, T0 + 30_000);
    const next = await advance(stores, {
      studentId: 's1', attemptId: state.attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 },
    }, T0 + 60_000);
    assert.equal(next.status, 'in_section');
    assert.deepEqual(next.cursor, { sectionIdx: 0, moduleIdx: 1 });
    assert.deepEqual(next.section!.items.map((i) => i.itemId), ['fx-m2h-1']);
    const attempt = await stores.findAttempt(state.attemptId);
    assert.deepEqual(attempt!.moduleRouting, [{ sectionId: 'sec1', variant: 'hard' }]);
    assert.equal(next.section!.deadlineAt, T0 + 60_000 + 4 * 60_000);
  });

  await test('advance from m1 with 0/2 routes to m2-easy', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await saveResponses(stores, {
      studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', answer: 'C' }, { itemId: 'fx-m1-2', answer: 'C' }],
    }, T0 + 30_000);
    const next = await advance(stores, {
      studentId: 's1', attemptId: state.attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 },
    }, T0 + 60_000);
    assert.equal(next.status, 'in_section');
    assert.deepEqual(next.section!.items.map((i) => i.itemId), ['fx-m2e-1']);
    const attempt = await stores.findAttempt(state.attemptId);
    assert.deepEqual(attempt!.moduleRouting, [{ sectionId: 'sec1', variant: 'easy' }]);
  });

  // Helper: drive an attempt to just-inside sec2 (FRQ) open.
  async function drivePastSec1(stores: ReturnType<typeof memoryMockStores>) {
    const state = await startOrResume(stores, START, T0);
    await saveResponses(stores, {
      studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m1-2', answer: 'B' }],
    }, T0 + 30_000);
    await advance(stores, {
      studentId: 's1', attemptId: state.attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 },
    }, T0 + 60_000); // now at m2-hard, cursor {0,1}
    return state.attemptId;
  }

  await test('advance out of last module of sec1 lands at_break (1 min)', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const attemptId = await drivePastSec1(stores);
    const brk = await advance(stores, {
      studentId: 's1', attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 1 },
    }, T0 + 120_000);
    assert.equal(brk.status, 'at_break');
    assert.equal(brk.breakMinutes, 1);
    assert.equal(brk.nextSectionLabel, 'Section 2');
    assert.deepEqual(brk.cursor, { sectionIdx: 1, moduleIdx: 0 });
  });

  await test('advance from break opens sec2 with fresh deadline', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const attemptId = await drivePastSec1(stores);
    await advance(stores, { studentId: 's1', attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 1 } }, T0 + 120_000);
    const sec2 = await advance(stores, {
      studentId: 's1', attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 },
    }, T0 + 200_000);
    assert.equal(sec2.status, 'in_section');
    assert.deepEqual(sec2.section!.items.map((i) => i.itemId), ['fx-frq-1']);
    assert.equal(sec2.section!.deadlineAt, T0 + 200_000 + 4 * 60_000);
  });

  await test('advance out of sec2 (FRQ answered) -> status grading with rawSections persisted', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const attemptId = await drivePastSec1(stores);
    await advance(stores, { studentId: 's1', attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 1 } }, T0 + 120_000);
    await advance(stores, { studentId: 's1', attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 } }, T0 + 200_000);
    await saveResponses(stores, {
      studentId: 's1', attemptId, cursor: { sectionIdx: 1, moduleIdx: 0 },
      responses: [{ itemId: 'fx-frq-1', frqText: 'Let them be 2k and 2m, so 2(k+m) is even.' }],
    }, T0 + 210_000);
    const done = await advance(stores, {
      studentId: 's1', attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 },
    }, T0 + 260_000);
    assert.equal(done.status, 'grading');
    const attempt = await stores.findAttempt(attemptId);
    assert.equal(attempt!.status, 'grading');
    assert.ok(attempt!.rawSections && attempt!.rawSections.length >= 1);
    const sec1Raw = attempt!.rawSections!.find((r) => r.sectionId === 'sec1');
    assert.equal(sec1Raw!.rawTotal, 3);    // 2 m1 mcq + 1 m2-hard numeric
    assert.equal(sec1Raw!.rawCorrect, 2);  // m1 2/2 correct; m2-hard numeric never answered
    assert.ok(!attempt!.scaled);           // curves wait for Task 9
  });

  await test('deadline blow-past on startOrResume auto-finalizes with saved answers', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await saveResponses(stores, {
      studentId: 's1', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
      responses: [{ itemId: 'fx-m1-1', answer: 'A' }],  // 1/2 correct -> 0.5 >= 0.5 -> hard
    }, T0 + 30_000);
    const resumed = await startOrResume(stores, START, T0 + 4 * 60_000 + GRACE_MS + 1);
    assert.equal(resumed.status, 'in_section');
    assert.deepEqual(resumed.cursor, { sectionIdx: 0, moduleIdx: 1 });
    assert.deepEqual(resumed.section!.items.map((i) => i.itemId), ['fx-m2h-1']);
    const attempt = await stores.findAttempt(state.attemptId);
    assert.deepEqual(attempt!.moduleRouting, [{ sectionId: 'sec1', variant: 'hard' }]);
  });

  await test('advance with stale fromCursor is idempotent (returns current state, no double-advance)', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    const same = await advance(stores, {
      studentId: 's1', attemptId: state.attemptId, fromCursor: { sectionIdx: 9, moduleIdx: 9 },
    }, T0 + 60_000);
    assert.equal(same.status, 'in_section');
    assert.deepEqual(same.cursor, { sectionIdx: 0, moduleIdx: 0 });
    assert.deepEqual(same.section!.items.map((i) => i.itemId), ['fx-m1-1', 'fx-m1-2']);
    const attempt = await stores.findAttempt(state.attemptId);
    assert.equal(attempt!.servedModules.length, 1);  // no variant pinned
    assert.deepEqual(attempt!.moduleRouting, []);
  });

  await test('save with wrong studentId rejects with attempt_not_open', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await assert.rejects(
      () => saveResponses(stores, {
        studentId: 'intruder', attemptId: state.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
        responses: [{ itemId: 'fx-m1-1', answer: 'A' }],
      }, T0 + 1_000),
      /attempt_not_open/
    );
    const attempt = await stores.findAttempt(state.attemptId);
    assert.equal(attempt!.responses.length, 0);  // no write leaked through
  });

  await test('advance with wrong studentId rejects and does not mutate', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const state = await startOrResume(stores, START, T0);
    await assert.rejects(
      () => advance(stores, {
        studentId: 'intruder', attemptId: state.attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 },
      }, T0 + 60_000),
      /attempt_not_open/
    );
    const attempt = await stores.findAttempt(state.attemptId);
    assert.deepEqual(attempt!.cursor, { sectionIdx: 0, moduleIdx: 0 });  // no advance
    assert.equal(attempt!.servedModules.length, 1);
    assert.deepEqual(attempt!.moduleRouting, []);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
