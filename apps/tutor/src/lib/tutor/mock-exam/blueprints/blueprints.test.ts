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

  const AP_SPECS: Array<{ key: string; sections: Array<[string, number, number]>; mcqWeight: number; frqMax: number }> = [
    { key: 'ap-statistics', sections: [['mcq', 40, 90], ['frq', 6, 90]], mcqWeight: 0.5, frqMax: 24 },
    { key: 'ap-calculus-bc', sections: [['mcq-nocalc', 30, 60], ['mcq-calc', 15, 45], ['frq-calc', 2, 30], ['frq-nocalc', 4, 60]], mcqWeight: 0.5, frqMax: 54 },
    { key: 'ap-macroeconomics', sections: [['mcq', 60, 70], ['frq', 3, 60]], mcqWeight: 2 / 3, frqMax: 20 },
    { key: 'ap-psychology', sections: [['mcq', 75, 90], ['frq', 2, 70]], mcqWeight: 2 / 3, frqMax: 14 },
    { key: 'ap-environmental-science', sections: [['mcq', 80, 90], ['frq', 3, 70]], mcqWeight: 0.6, frqMax: 30 },
    { key: 'ap-english-language', sections: [['mcq', 45, 60], ['frq', 3, 135]], mcqWeight: 0.45, frqMax: 18 },
    { key: 'ap-us-history', sections: [['mcq', 55, 55], ['saq', 3, 40], ['dbq', 1, 60], ['leq', 1, 40]], mcqWeight: 0.4, frqMax: 22 },
    { key: 'ap-world-history', sections: [['mcq', 55, 55], ['saq', 3, 40], ['dbq', 1, 60], ['leq', 1, 40]], mcqWeight: 0.4, frqMax: 22 },
    { key: 'ap-us-government', sections: [['mcq', 55, 80], ['frq', 4, 100]], mcqWeight: 0.5, frqMax: 17 },
  ];
  for (const spec of AP_SPECS) {
    await test(`${spec.key} blueprint: sections, counts, ap spec, validates clean`, () => {
      const bp = getBlueprint(spec.key);
      assert.equal(bp.examType, 'ap');
      assert.deepEqual(bp.sections.map((s) => s.sectionId), spec.sections.map((x) => x[0]));
      assert.deepEqual(bp.sections.map((s) => s.modules.length), spec.sections.map(() => 1));
      assert.deepEqual(bp.sections.map((s) => s.modules[0].questionCount), spec.sections.map((x) => x[1]));
      assert.deepEqual(bp.sections.map((s) => s.modules[0].timeLimitMin), spec.sections.map((x) => x[2]));
      assert.equal(bp.scoring.kind, 'ap-composite');
      assert.ok(bp.scoring.ap);
      assert.ok(Math.abs(bp.scoring.ap!.mcqWeight - spec.mcqWeight) < 1e-9);
      assert.ok(Math.abs(bp.scoring.ap!.mcqWeight + bp.scoring.ap!.frqWeight - 1) < 1e-9);
      assert.equal(bp.scoring.compositeMax, 5);
      // FRQ sections' curve tops out at the locked rubric-point total.
      const frqSections = bp.sections.filter((s) => s.sectionId.startsWith('frq') || ['saq', 'dbq', 'leq'].includes(s.sectionId));
      const frqRawMax = frqSections.reduce((sum, s) => {
        const anchors = bp.scoring.curves[s.sectionId].default;
        return sum + anchors[anchors.length - 1][0];
      }, 0);
      assert.equal(frqRawMax, spec.frqMax);
      // Exactly one 10-min break, before the last FRQ block begins.
      assert.equal(bp.sections.filter((s) => s.breakAfterMin).length, 1);
      assert.deepEqual(validateBlueprint(bp), []);
    });
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
