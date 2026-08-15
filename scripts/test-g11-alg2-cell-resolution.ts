/**
 * Cell-resolution regression test for the g11 "algebra-2"-tagged seeds
 * (2026-08-07 triage, session-1786064015703 metadata mismatch).
 *
 * The 11-12 math band has no 'algebra-2' taxonomy topic, and the Batch-27
 * orphan bridge ('matrices': ['matrices', 'algebra-2']) made Matrices the
 * ONLY 11-12 cell matching a g11 plan tagged topic:'algebra-2' — so Conic
 * Sections and Complex Numbers both surfaced under (and resolved to) the
 * Matrices topic. A session started from that picker cell recorded
 * topic="matrices" with lessonPlanId=…conic-sections.v1.
 *
 * Run: npx tsx scripts/test-g11-alg2-cell-resolution.ts
 */
import { resolvePlanCell } from '../apps/marketing/src/lib/tutor/lesson-plan/resolve-cell';
import { SEED_G11_ALG2_CONIC_SECTIONS } from '../apps/marketing/src/lib/tutor/lesson-plan/seeds/g11-alg2-conic-sections';
import { SEED_G11_ALG2_COMPLEX_NUMBERS } from '../apps/marketing/src/lib/tutor/lesson-plan/seeds/g11-alg2-complex-numbers';
import { SEED_G11_ALG2_MATRICES_INTRO } from '../apps/marketing/src/lib/tutor/lesson-plan/seeds/g11-alg2-matrices-intro';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const conics = resolvePlanCell(SEED_G11_ALG2_CONIC_SECTIONS);
check('conic-sections resolves to a cell', conics !== null);
check('conic-sections → math / 11-12', conics?.subject === 'math' && conics?.level === '11-12', JSON.stringify(conics));
check('conic-sections → pre-calculus (NOT matrices)', conics?.topic === 'pre-calculus', `got ${conics?.topic}`);

const complex = resolvePlanCell(SEED_G11_ALG2_COMPLEX_NUMBERS);
check('complex-numbers resolves to a cell', complex !== null);
check('complex-numbers → pre-calculus (NOT matrices)', complex?.topic === 'pre-calculus', `got ${complex?.topic}`);

const matrices = resolvePlanCell(SEED_G11_ALG2_MATRICES_INTRO);
check('matrices-intro resolves to a cell', matrices !== null);
check('matrices-intro → matrices', matrices?.topic === 'matrices', `got ${matrices?.topic}`);

// Future-proofing: a hypothetical g11 plan still raw-tagged 'algebra-2' must
// not be orphaned — it should land in pre-calculus, the 11-12 catch-all for
// algebra-2 content (never matrices).
const strayAlg2 = resolvePlanCell({ subject: 'math', grade: '11', topic: 'algebra-2' });
check('stray g11 algebra-2 tag is not orphaned', strayAlg2 !== null);
check('stray g11 algebra-2 tag → pre-calculus', strayAlg2?.topic === 'pre-calculus', `got ${strayAlg2?.topic}`);

// The 9-10 band keeps its EXACT algebra-2 cell — the alias change must not
// pull 9-10 algebra-2 plans out of their own topic.
const g9Alg2 = resolvePlanCell({ subject: 'math', grade: '9', topic: 'algebra-2' });
check('g9 algebra-2 plan stays in the 9-10 algebra-2 cell', g9Alg2?.level === '9-10' && g9Alg2?.topic === 'algebra-2', JSON.stringify(g9Alg2));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} g11-alg2 cell-resolution tests passed.`);
