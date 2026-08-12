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

// 4. Colliding LO titles → distinct loIds (ordinal suffix), with prereq
//    references still resolving after the rewrite. Two LOs sharing a loId
//    would give the portal's materialize() two nodes with the same _id
//    (E11000 on insertMany, after the Course row was already upserted).
const collide = normalizeRawTaxonomy({
  title: 'CPHQ Exam',
  sections: [{ key: 'ps', title: 'Patient Safety', weightPct: 100 }],
  los: [
    { loId: 'a', title: 'Risk Management', description: 'd1', sectionKey: 'ps', prerequisiteLoIds: [], suggestedOrder: 1 },
    { loId: 'b', title: 'risk management!', description: 'd2', sectionKey: 'ps', prerequisiteLoIds: ['a'], suggestedOrder: 2 },
    { loId: 'c', title: 'RISK MANAGEMENT', description: 'd3', sectionKey: 'ps', prerequisiteLoIds: ['b'], suggestedOrder: 3 },
  ],
}, 'cphq');
assert.ok(collide, 'colliding titles still normalize');
const collideIds = collide.los.map((l) => l.loId);
assert.equal(collideIds.length, 3, 'no LO dropped by the dedup');
assert.equal(new Set(collideIds).size, 3, `loIds must be distinct, got ${collideIds.join(', ')}`);
assert.equal(collideIds[0], 'cphq.ps.risk-management');
assert.equal(collideIds[1], 'cphq.ps.risk-management-2');
assert.equal(collideIds[2], 'cphq.ps.risk-management-3');
// prereq edges follow each LO to its deduped id:
assert.deepEqual(collide.los[1].prerequisiteLoIds, [collideIds[0]]);
assert.deepEqual(collide.los[2].prerequisiteLoIds, [collideIds[1]]);

// 5. Colliding SECTION keys are deduped too (two sections sharing a key made
//    weightPct edits and LO bucketing ambiguous).
const dupSections = normalizeRawTaxonomy({
  title: 'CPHQ Exam',
  sections: [
    { key: 'Patient Safety', title: 'Patient Safety', weightPct: 50 },
    { key: 'patient-safety', title: 'Patient safety (advanced)', weightPct: 50 },
  ],
  los: [{ loId: 'a', title: 'Safety culture', description: 'd', sectionKey: 'patient-safety', prerequisiteLoIds: [], suggestedOrder: 1 }],
}, 'cphq');
assert.ok(dupSections, 'colliding section keys still normalize');
assert.deepEqual(dupSections.sections.map((s) => s.key), ['patient-safety', 'patient-safety-2']);

// 6. Over-long titles are truncated to the contract's 200-char cap rather
//    than failing validation and discarding the whole draft to the fallback.
const longTitle = 'L'.repeat(260);
const trunc = normalizeRawTaxonomy({
  title: 'CPHQ Exam',
  sections: [{ key: 'ps', title: longTitle, weightPct: 100 }],
  los: [{ loId: 'a', title: longTitle, description: 'd', sectionKey: 'ps', prerequisiteLoIds: [], suggestedOrder: 1 }],
}, 'cphq');
assert.ok(trunc, 'over-long titles do not sink the draft');
assert.equal(trunc.sections[0].title.length, 200);
assert.equal(trunc.los[0].title.length, 200);
assert.ok(trunc.los[0].loId.length <= 120, `loId within contract cap, got ${trunc.los[0].loId.length}`);

console.log('test-taxonomy-generate: all assertions passed');
