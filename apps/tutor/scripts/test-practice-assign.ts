/** Spec §C.3 — pure homework resolver over injected PracticeSources. Usage: npx tsx scripts/test-practice-assign.ts */
import { resolveAssignmentItems, difficultyForBand, ASSIGN_TUNING } from '../src/lib/tutor/practice-assign/resolve';
import type { PracticeSources, BankLite } from '../src/lib/tutor/portal/practice';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

const bank = (loId: string, n: number, difficulty: 1 | 2 | 3 | 4 = 2): BankLite[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${loId}-b${i}`, problemText: `q${i}`, answer: `${i}`, difficulty, loId }));
const sources: PracticeSources = {
  async plansForLoId() { return []; },
  async plansForTopic() { return []; },
  async bankForLoId(loId, difficulty) { return bank(loId, 6).filter((b) => difficulty === undefined || b.difficulty === difficulty); },
  async bankForTopic() { return []; },
};

check('band → difficulty', difficultyForBand('building') === 1 && difficultyForBand('steady') === 2 && difficultyForBand('strong') === 3);

(async () => {
  const out = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  check('one LO → perLo items', out.length === 1 && out[0].items.length === ASSIGN_TUNING.perLo, JSON.stringify(out.map((o) => o.items.length)));
  check('title carried', out[0].title === 'Alpha');

  const out2 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }, { loId: 'B', title: 'Beta' }, { loId: 'C', title: 'Gamma' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  const total = out2.reduce((n, o) => n + o.items.length, 0);
  check('three LOs capped at ASSIGN_TUNING.cap total', total === ASSIGN_TUNING.cap, String(total));
  check('first LO keeps its full share (weakest-first order preserved)', out2[0].items.length === ASSIGN_TUNING.perLo);

  const out3 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'steady', seenItemIds: ['A-b0', 'A-b1', 'A-b2', 'A-b3', 'A-b4'], studentId: 's', courseId: 'c' }, sources);
  check('seen items excluded (only 1 unseen left)', out3[0].items.length === 1 && out3[0].items[0].id === 'A-b5', JSON.stringify(out3[0].items.map((i) => i.id)));

  const out4 = await resolveAssignmentItems({ los: [{ loId: 'Z', title: 'Zeta' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, { ...sources, async bankForLoId() { return []; } });
  check('LO with no items is dropped', out4.length === 0);

  // difficulty passthrough: a 'strong' band asks for 3; our stub bank is all 2 → falls back to any difficulty
  const out5 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'strong', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  check('difficulty miss falls back to unfiltered retrieval', out5.length === 1 && out5[0].items.length === ASSIGN_TUNING.perLo);

  console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
