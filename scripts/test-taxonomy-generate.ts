import assert from 'node:assert/strict';
import { normalizeRawTaxonomy } from '../src/lib/tutor/lesson-plan/taxonomy-generate';

// 1. Happy path: slugs coerced, weights normalized to sum 100, orders sequential.
const raw = {
  title: 'CPHQ Exam',
  sections: [
    { key: 'Perf Improvement', title: 'Performance & Process Improvement', weightPct: 60 },
    { key: 'pt-safety', title: 'Patient Safety', weightPct: 90 }, // sums 150 → normalized
  ],
  los: [
    { loId: 'Risk Basics!', title: 'Risk basics', description: 'd', sectionKey: 'Perf Improvement',
      prerequisiteLoIds: [], suggestedOrder: 5 },
    { loId: 'cphq.pt-safety.culture', title: 'Safety culture', description: 'd', sectionKey: 'pt-safety',
      prerequisiteLoIds: ['Risk Basics!'], suggestedOrder: 2 },
  ],
};
const t = normalizeRawTaxonomy(raw, 'cphq');
assert.ok(t, 'normalizes');
assert.equal(t.sections[0].key, 'perf-improvement');
assert.equal(Math.round(t.sections[0].weightPct + t.sections[1].weightPct), 100);
assert.ok(t.los[0].loId.startsWith('cphq.perf-improvement.'), `got ${t.los[0].loId}`);
// prereq reference follows the slug rewrite:
assert.deepEqual(t.los[1].prerequisiteLoIds, [t.los[0].loId]);
// orders re-issued 1..n within the whole draft:
assert.deepEqual(t.los.map((l) => l.suggestedOrder), [1, 2]);

// 2. Dangling prereqs dropped; self-prereqs dropped.
const t2 = normalizeRawTaxonomy({ ...raw, los: [{ ...raw.los[1], prerequisiteLoIds: ['nope', 'cphq.pt-safety.culture'] }] }, 'cphq');
assert.ok(t2);
assert.deepEqual(t2.los[0].prerequisiteLoIds, []);

// 3. Garbage → null (never throws).
assert.equal(normalizeRawTaxonomy({ title: '' }, 'cphq'), null);
assert.equal(normalizeRawTaxonomy(null, 'cphq'), null);

console.log('test-taxonomy-generate: all assertions passed');
