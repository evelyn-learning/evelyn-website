import { strict as assert } from 'node:assert';
import { memoryMockStores, startOrResume, listForms, ATTEMPT_TTL_MS } from './service';
import { FIXTURE_FORM, FIXTURE_ITEMS } from './fixtures';

const T0 = 1_750_000_000_000;

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

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
