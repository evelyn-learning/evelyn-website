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
  await test('digital-sat blueprint: 2 sections, adaptive, correct counts/times', () => {
    const bp = getBlueprint('digital-sat');
    assert.deepEqual(bp.sections.map((s) => s.sectionId), ['rw', 'math']);
    const rw = bp.sections[0], math = bp.sections[1];
    assert.deepEqual(rw.modules.map((m) => m.questionCount), [27, 27, 27]);
    assert.deepEqual(math.modules.map((m) => m.questionCount), [22, 22, 22]);
    assert.equal(rw.modules[0].timeLimitMin, 32);
    assert.equal(math.modules[0].timeLimitMin, 35);
    assert.equal(rw.breakAfterMin, 10);
    assert.equal(rw.tools.desmos, false);
    assert.equal(math.tools.desmos, true);
    assert.deepEqual(validateBlueprint(bp), []);
  });
  await test('act blueprint: 4 sections in order, correct counts/times, science excluded, math desmos', () => {
    const bp = getBlueprint('act');
    assert.deepEqual(bp.sections.map((s) => s.sectionId), ['english', 'math', 'reading', 'science']);
    const [english, math, reading, science] = bp.sections;
    assert.deepEqual(bp.sections.map((s) => s.modules[0].questionCount), [50, 45, 36, 40]);
    assert.deepEqual(bp.sections.map((s) => s.modules[0].timeLimitMin), [35, 50, 40, 40]);
    assert.equal(science.inComposite, false);
    assert.equal(math.tools.desmos, true);
    assert.equal(english.tools.desmos, false);
    assert.equal(reading.tools.desmos, false);
    assert.deepEqual(validateBlueprint(bp), []);
  });
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
