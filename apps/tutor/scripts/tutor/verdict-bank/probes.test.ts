// apps/tutor/scripts/tutor/verdict-bank/probes.test.ts
/**
 * Sanity checks on the probe bank itself (2026-08-18 verdict-probe-bank
 * plan, Task 3). Not a check of the brain — just structural integrity of
 * the 21 authored probes so a bad edit fails loudly before Tasks 4-5 ever
 * drive a real session against them.
 */
import { ALL_PROBES } from './probes/index';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  else console.log(`  ✓ ${name}`);
}

console.log('ALL_PROBES structure');
check('exactly 21 probes', ALL_PROBES.length, 21);

const ids = ALL_PROBES.map((p) => p.id);
check('all ids unique', new Set(ids).size, ids.length);

const noTurns = ALL_PROBES.filter((p) => p.turns.length < 1).map((p) => p.id);
check('every probe has >=1 turn', noTurns, []);

const badCompute = ALL_PROBES.flatMap((p) =>
  p.turns
    .filter((t): t is Extract<typeof t, { compute: 'board-expression' }> => 'compute' in t)
    .filter((t) => !t.fallbackSay || t.fallbackSay.length === 0)
    .map(() => p.id)
);
check('every compute turn has non-empty fallbackSay', badCompute, []);

const badGradeIndex = ALL_PROBES.filter(
  (p) => p.gradeTurnIndex !== undefined && (p.gradeTurnIndex < 0 || p.gradeTurnIndex >= p.turns.length)
).map((p) => p.id);
check('every gradeTurnIndex (when set) is a valid index', badGradeIndex, []);

const badExpected = ALL_PROBES.filter(
  (p) => p.expected !== 'affirm' && p.expected !== 'deny' && p.expected !== 'none'
).map((p) => p.id);
check('every expected is affirm/deny/none', badExpected, []);

const denyCount = ALL_PROBES.filter((p) => p.expected === 'deny').length;
const noneCount = ALL_PROBES.filter((p) => p.expected === 'none').length;
check('at least 4 probes expect deny', denyCount >= 4, true);
check('at least 3 probes expect none', noneCount >= 3, true);

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nAll probe-bank checks passed.');
