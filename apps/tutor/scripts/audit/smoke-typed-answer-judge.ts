/**
 * LIVE check of the typed-answer judge (portal/grade-free-response.ts) with
 * the real grader model: a stated form requirement is enforced, equivalent
 * answers are still accepted.
 *
 * Real model calls, NO database, NO env files: the API key must be passed on
 * the command line —
 *
 *   ANTHROPIC_API_KEY=… npx tsx scripts/audit/smoke-typed-answer-judge.ts
 *
 * Not a registered test (it costs money and needs the network). Exits 1 when
 * any verdict is not the expected one.
 */
import { gradeFreeResponse, defaultGradeDeps, type GradeItem } from '../../src/lib/tutor/portal/grade-free-response';

interface Case {
  id: string;
  question: string;
  key: string;
  answer: string;
  expectCorrect: boolean;
  /** When set, the feedback must match (the unmet requirement is named). */
  feedbackMust?: RegExp;
}

const STD = 'Rewrite in standard form Ax + By + Cz = D, where A, B, C, D are integers and A is positive: 5y = 6x − 3z + 12';
const INEQ = 'Solve the inequality: 2x + 3 < 13';
const BIO = 'Why does increasing the temperature beyond an enzyme\'s optimum reduce the rate of the reaction it catalyses?';
const BIO_KEY = 'The enzyme denatures: its active site changes shape, so the substrate no longer fits and fewer enzyme–substrate complexes form.';
const INC = 'On what interval is f(x) = −x³ − (3/2)x² + 6x increasing?';

const CASES: Case[] = [
  { id: 'standard form, A negative', question: STD, key: '6x − 5y − 3z = −12', answer: '−6x + 5y + 3z = 12', expectCorrect: false, feedbackMust: /positive/i },
  { id: 'standard form, the key', question: STD, key: '6x − 5y − 3z = −12', answer: '6x - 5y - 3z = -12', expectCorrect: true },
  { id: 'inequality, other side', question: INEQ, key: 'x < 5', answer: '5 > x', expectCorrect: true },
  { id: 'inequality, wrong direction', question: INEQ, key: 'x < 5', answer: 'x > 5', expectCorrect: false },
  { id: 'conceptual, reworded', question: BIO, key: BIO_KEY, answer: 'Too much heat bends the enzyme out of shape (it gets denatured), so the active site can\'t hold the substrate any more.', expectCorrect: true },
  { id: 'conceptual, related but wrong', question: BIO, key: BIO_KEY, answer: 'The molecules have less kinetic energy at high temperature, so they collide with the enzyme less often.', expectCorrect: false },
  { id: 'increasing on, open vs closed', question: INC, key: '[−2, 1]', answer: '(−2, 1)', expectCorrect: true },
  { id: 'increasing on, wrong interval', question: INC, key: '[−2, 1]', answer: '(−1, 2)', expectCorrect: false },
  { id: 'numeric key, words (falls through)', question: 'A table of values suggests a limit. Estimate lim x→2 f(x).', key: '5', answer: 'about 4.98', expectCorrect: false },
  { id: 'numeric key, units (falls through)', question: 'A car travels 150 km in 3 hours. What is its average speed in km/h?', key: '50', answer: '50 km/h', expectCorrect: true },
];

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set (pass it on the command line).');
    process.exit(2);
  }
  const deps = defaultGradeDeps();
  let bad = 0;
  for (const c of CASES) {
    const item: GradeItem = { itemId: 'smoke', expectedAnswer: c.key, problemText: c.question };
    const r = await gradeFreeResponse({ studentId: 's', itemId: 'smoke', response: { text: c.answer } }, item, deps);
    const correct = r.totalPoints === 1;
    const fb = r.parts[0].feedback;
    const ok = correct === c.expectCorrect && (!c.feedbackMust || c.feedbackMust.test(fb));
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${c.id}`);
    console.log(`     key: ${c.key}   answer: ${c.answer}`);
    console.log(`     → ${correct ? 'correct' : 'incorrect'} (expected ${c.expectCorrect ? 'correct' : 'incorrect'}) — ${fb}`);
  }
  console.log(`\n${CASES.length - bad}/${CASES.length} as expected`);
  process.exit(bad === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
