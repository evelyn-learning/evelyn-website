import { strict as assert } from 'node:assert';
import { getBlueprint, validateBlueprint } from './index';

let passed = 0, failed = 0;
function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve().then(fn)
    .then(() => { passed++; console.log(`  ok - ${name}`); })
    .catch((e) => { failed++; console.log(`  FAIL - ${name}`); console.error(e); });
}

async function run() {
  await test('fixture blueprint resolves and validates clean', () => {
    const bp = getBlueprint('fixture');
    assert.equal(bp.examType, 'fixture');
    assert.deepEqual(validateBlueprint(bp), []);
  });
  await test('unknown examKey throws', () => {
    assert.throws(() => getBlueprint('nope'));
  });
  await test('fixture has an adaptive section with easy+hard variants', () => {
    const bp = getBlueprint('fixture');
    const sec = bp.sections[0];
    assert.ok(sec.adaptive);
    const variants = sec.modules.filter((m) => m.variant).map((m) => m.variant).sort();
    assert.deepEqual(variants, ['easy', 'hard']);
  });
  await test('validateBlueprint flags a section whose curve is missing', () => {
    const bp = JSON.parse(JSON.stringify(getBlueprint('fixture')));
    delete bp.scoring.curves[bp.sections[0].sectionId];
    assert.ok(validateBlueprint(bp).length > 0);
  });
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
