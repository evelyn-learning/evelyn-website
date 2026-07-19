import { computeManifest, parsePlanLosFromSource, deriveUnit, collectPlanLos, type PlanLo } from './problem-bank-gap-manifest';
import assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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

// --- deriveUnit: filename -u<N>- or cedCode digit extraction ---
assert.strictEqual(deriveUnit('ap-apworld-u2-mongol-empire.ts', 'AP-APWORLD-2.1'), 2, 'filename -u<N>- wins');
assert.strictEqual(deriveUnit('ap-world-imperialism.ts', 'AP-WORLD-6.1'), 6, 'cedCode first digit extracted');
assert.strictEqual(deriveUnit('ap-world-unit2-networks.ts', 'AP-WORLD-2.1-2.7'), 2, 'cedCode range first digit');
assert.strictEqual(deriveUnit('ap-world-x.ts', 'NO-UNIT-CODE'), 1, 'fallback to 1');

// --- collectPlanLos: deterministic duplicate preference (filename -u<N>- preferred) ---
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gap-manifest-test-'));
try {
  // Create legacy file (sorts first but has no -u<N>-)
  fs.writeFileSync(
    path.join(tmpDir, 'ap-aa-legacy-mongol.ts'),
    `los: [{ id: 'apworld.mongol-empire', description: 'mongol', standard: 'AP-WORLD-2.4' }]`,
  );
  // Create modern file (sorts after but has -u2- and better cedCode)
  fs.writeFileSync(
    path.join(tmpDir, 'ap-apworld-u2-mongol-empire.ts'),
    `los: [{ id: 'apworld.mongol-empire', description: 'mongol', standard: 'AP-APWORLD-2.1' }]`,
  );
  const collected = collectPlanLos(tmpDir, 'apworld');
  const mongol = collected.find((lo) => lo.loId === 'apworld.mongol-empire');
  assert.ok(mongol, 'apworld.mongol-empire must be found');
  assert.strictEqual(mongol.cedCode, 'AP-APWORLD-2.1', 'u2-file cedCode preferred despite later sort order');
  assert.strictEqual(mongol.unit, 2, 'u2-file unit preferred');
} finally {
  fs.rmSync(tmpDir, { recursive: true });
}

console.log('✓ test-gap-manifest: all assertions passed');
