import { strict as assert } from 'node:assert';
import { getBlueprint } from './blueprints';
import type { CurveAnchor } from './blueprints';
import { curveScaled, answersMatch, scoreMcqSections, applyCurves, apCompositeScore } from './scoring';
import { FIXTURE_ITEMS } from './fixtures';

let passed = 0, failed = 0;
function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve().then(fn)
    .then(() => { passed++; console.log(`  ok - ${name}`); })
    .catch((e) => { failed++; console.log(`  FAIL - ${name}`); console.error(e); });
}

async function run() {
  await test('curveScaled interpolates and clamps', () => {
    const anchors: CurveAnchor[] = [[0, 200], [10, 300], [20, 400]];
    assert.equal(curveScaled(anchors, 0), 200);
    assert.equal(curveScaled(anchors, 5), 250);
    assert.equal(curveScaled(anchors, 25), 400);   // clamped
    assert.equal(curveScaled(anchors, 13), 330);
  });
  await test('answersMatch: mcq letter, numeric tolerance, text', () => {
    assert.ok(answersMatch({ responseFormat: 'mcq', answer: 'B' }, 'b'));
    assert.ok(!answersMatch({ responseFormat: 'mcq', answer: 'B' }, 'C'));
    assert.ok(answersMatch({ responseFormat: 'numeric', answer: '42' }, '42.2'));
    assert.ok(!answersMatch({ responseFormat: 'numeric', answer: '42' }, '44'));
    assert.ok(!answersMatch({ responseFormat: 'mcq', answer: 'B' }, undefined));
  });
  await test('fixture end-to-end: 2/2 m1 routes hard; scaled via hard curve', () => {
    const bp = getBlueprint('fixture');
    const served = [
      { sectionIdx: 0, moduleId: 'm1', itemIds: ['fx-m1-1', 'fx-m1-2'] },
      { sectionIdx: 0, moduleId: 'm2-hard', itemIds: ['fx-m2h-1'] },
    ];
    const responses = [
      { itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m1-2', answer: 'B' },
      { itemId: 'fx-m2h-1', answer: '42' },
    ];
    const { rawSections, loBreakdown } = scoreMcqSections(bp, served, responses, FIXTURE_ITEMS);
    assert.equal(rawSections[0].rawCorrect, 3);
    const { scaled } = applyCurves(bp, rawSections, [{ sectionId: 'sec1', variant: 'hard' }], {});
    assert.equal(scaled.sections[0].scaled, 40);   // hard curve anchor [3,40]
    assert.deepEqual(loBreakdown.find((l) => l.loId === 'fx.lo1'), { loId: 'fx.lo1', correct: 2, total: 2 });
  });
  await test('ap-composite maps weighted fraction through cutPoints', () => {
    const spec = { kind: 'ap-composite', sectionScaledMin: 1, sectionScaledMax: 5, compositeMin: 1, compositeMax: 5,
      curves: { mcq: { default: [[0, 1], [10, 5]] as CurveAnchor[] } },
      ap: { mcqWeight: 0.5, frqWeight: 0.5, cutPoints: [0.25, 0.4, 0.55, 0.7] as [number, number, number, number] } };
    // mcq 8/10 = 0.8, frq 2/4 = 0.5 → 0.65 → score 4
    assert.equal(apCompositeScore(0.8, 0.5, spec.ap), 4);
  });
  await test('act-composite: sections scale via curves, composite averages only inComposite!==false sections', () => {
    const bp = getBlueprint('act');
    const rawSections = [
      { sectionId: 'english', rawCorrect: 41, rawTotal: 50 },
      { sectionId: 'math', rawCorrect: 35, rawTotal: 45 },
      { sectionId: 'reading', rawCorrect: 30, rawTotal: 36 },
      { sectionId: 'science', rawCorrect: 20, rawTotal: 40 },
    ];
    const { scaled, composite } = applyCurves(bp, rawSections, [], {});
    const byId = Object.fromEntries(scaled.sections.map((s) => [s.sectionId, s]));
    assert.equal(byId.english.scaled, 28);
    assert.equal(byId.math.scaled, 28);
    assert.equal(byId.reading.scaled, 29);
    assert.equal(byId.science.scaled, 20);
    assert.equal(byId.science.inComposite, false);
    assert.equal(composite, 28);   // round(mean(28,28,29)) — science excluded
    assert.equal(scaled.composite, 28);
  });
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
