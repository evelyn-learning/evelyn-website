import { computeManifest, parsePlanLosFromSource, type PlanLo } from './problem-bank-gap-manifest';
import assert from 'assert';

// --- parsePlanLosFromSource: extracts LO id + standard from plan seed source ---
const src = `
  los: [{ id: 'apush.columbian-exchange', description: 'x', standard: 'AP-APUSH-1.4' },
        { id: 'apush.spanish-colonization', description: 'y', standard: 'AP-APUSH-1.5' }],
`;
const parsed = parsePlanLosFromSource(src, 'apush');
assert.deepStrictEqual(
  parsed.map((p) => [p.loId, p.cedCode]),
  [['apush.columbian-exchange', 'AP-APUSH-1.4'], ['apush.spanish-colonization', 'AP-APUSH-1.5']],
);

// --- computeManifest: deficits, frq exclusion, difficulty gaps ---
const planLos: PlanLo[] = [
  { loId: 'apush.columbian-exchange', cedCode: 'AP-APUSH-1.4', unit: 1, frqPracticeOnly: false },
  { loId: 'apush.uncovered-lo', cedCode: 'AP-APUSH-2.1', unit: 2, frqPracticeOnly: false },
  { loId: 'apush.u1-dbq-practice', cedCode: 'AP-APUSH-1-DBQ', unit: 1, frqPracticeOnly: true },
];
const bankCounts = new Map([
  ['apush.columbian-exchange', { total: 3, byDifficulty: { 1: 1, 2: 2, 3: 0, 4: 0 } }],
]);
const manifest = computeManifest(planLos, bankCounts, 4);
assert.strictEqual(manifest.length, 2, 'frq-practice-only LO must be excluded');
const covered = manifest.find((m) => m.loId === 'apush.columbian-exchange')!;
assert.strictEqual(covered.deficit, 1);
assert.deepStrictEqual(covered.difficultyGaps, [3, 4]);
const uncovered = manifest.find((m) => m.loId === 'apush.uncovered-lo')!;
assert.strictEqual(uncovered.deficit, 4);
assert.deepStrictEqual(uncovered.difficultyGaps, [1, 2, 3, 4]);
assert.strictEqual(uncovered.unit, 2);

console.log('✓ test-gap-manifest: all assertions passed');
