/**
 * Task 15 (holistic-pedagogy plan 1) — pure renderer battery for the widened
 * `<learner_context>` boot block.
 *
 * PURE ONLY: `renderLearnerContextBlock` takes already-resolved rows, so this
 * script needs no Mongo and no env. The DB-backed join (`getLearnerContext` /
 * the back-compat `getLearnerContextBlock` wrapper) stays covered by
 * `scripts/test-learner-model.ts`'s Task-17 DB section.
 *
 * Run: npm run test:learner-context
 */

import {
  renderLearnerContextBlock,
  LEARNER_CONTEXT_MAX_CHARS,
} from '../src/lib/tutor/learner-model/context-block';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\nlearner-context — widened renderer (Task 15):\n');

const lo = (i: number) => ({
  loId: `lo${i}`,
  title: `Objective ${i}`,
  estimate: 0.4,
  confidence: 'medium',
  reviewDue: i === 1,
  trend: 'up' as const,
  practice: { correct: 3, total: 5, date: '2026-09-02' },
  quiz: { awarded: 6, max: 8, date: '2026-08-30' },
});

const full = renderLearnerContextBlock({
  los: [lo(1), lo(2)],
  gaps: [{ label: 'lo1', observation: 'adds numerators and denominators' }],
  ability: 'building',
  gapsResolved90d: 2,
  cadence: { daysSinceLast: 9, sessionsLast7d: 0 },
  nextTimeIntent: 'start with the vertex form',
  goals: ['Goal: an A in algebra by December'],
  homework: [
    {
      assignmentId: 'a',
      sessionId: 's',
      assignedAt: '2026-09-03T00:00:00Z',
      los: [{ loId: 'lo1', title: 'Objective 1', total: 4, attempted: 2, correct: 1, status: 'partial' as const }],
      overall: 'partial' as const,
    },
  ],
  recapCandidate: { loId: 'lo1', title: 'Objective 1', reason: 'homework-weak', soft: false },
})!;

check('renders', typeof full === 'string' && full.startsWith('<learner_context>'));
check(
  'LO line has band, trend, due, practice and quiz digests',
  /Objective 1: developing \(medium confidence\) ↑ — DUE FOR REVIEW · practice 3\/5 on 2026-09-02 · quiz 6\/8 pts on 2026-08-30/.test(full),
  full,
);
check('ability line', /ability: building/.test(full));
check('resolved line', /gaps resolved in the last 90 days: 2/.test(full));
check('cadence line', /cadence: last session 9 days ago; 0 sessions in the last 7 days/.test(full));
check('next time line', /next time \(your own note from last session\): "start with the vertex form"/.test(full));
check('homework line', /homework \(assigned 2026-09-03\): Objective 1 — 2 of 4 attempted, 1 correct/.test(full));
check('recap candidate line', /recap_candidate: Objective 1 — homework-weak/.test(full));
check('goal line', /goal: an A in algebra by December/.test(full));
check('cadence directive present', /after 7\+ days/.test(full));
check('progress-question directive present', /how they are doing/.test(full));
check('never-read-aloud directive present', /never read this block aloud/i.test(full));
check('size cap', full.length <= LEARNER_CONTEXT_MAX_CHARS, String(full.length));

check('empty → null', renderLearnerContextBlock({ los: [], gaps: [] }) === null);

const minimal = renderLearnerContextBlock({
  los: [{ loId: 'x', title: 'X', estimate: null, confidence: 'low', reviewDue: false }],
  gaps: [],
})!;
check('untouched LO bands as developing with no digests', /X: developing \(low confidence\)$/m.test(minimal), minimal);
// NOTE (deviation from the brief's literal regex, recorded in the task report):
// the always-on progress directive legitimately contains the word "homework"
// ("...name the trend, one gap that is closing, the homework status..."), so a
// bare /homework/ would fail on a block with no homework DATA line. The intent
// of this assertion is "no optional DATA lines when their inputs are absent",
// so the homework alternative is anchored on the data line's own prefix.
check('no optional lines when absent', !/cadence:|homework \(assigned|recap_candidate|goal:|next time \(/.test(minimal), minimal);

const big = renderLearnerContextBlock({
  los: Array.from({ length: 12 }, (_, i) => lo(i)),
  gaps: Array.from({ length: 6 }, (_, i) => ({ label: `g${i}`, observation: 'x'.repeat(300) })),
})!;
check(
  'caps LOs at 8 and gaps at 3',
  (big.match(/^- Objective/gm) ?? []).length === 8 && (big.match(/^- g\d/gm) ?? []).length === 3,
);
check('big input still under the char cap', big.length <= LEARNER_CONTEXT_MAX_CHARS, String(big.length));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
