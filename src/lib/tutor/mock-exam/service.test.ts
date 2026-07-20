import { strict as assert } from 'node:assert';
import { memoryMockStores, startOrResume, listForms, ATTEMPT_TTL_MS, type FormDoc } from './service';
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

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
