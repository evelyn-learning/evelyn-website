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

/* ------------------------------------------------------------------ */
/* Fix round 1 — the trim must actually CONVERGE and be load-bearing.   */
/* The first cut used two non-looping regex passes over the finished    */
/* string: neither touched homework/goal/ability/cadence/directive      */
/* lines, and stage 2's ` · …$` truncated ANY line containing " · "     */
/* (a goal, a homework title). Nothing in the battery ever pushed the   */
/* block over the cap, so none of that was observable.                  */
/* ------------------------------------------------------------------ */

const longTitle = (i: number) => `Long objective title number ${i} about interpreting slope in a real-world context`;
const fatLo = (i: number) => ({
  loId: `lo${i}`,
  title: longTitle(i),
  estimate: 0.4,
  confidence: 'medium',
  reviewDue: false,
  trend: 'up' as const,
  practice: { correct: 3, total: 5, date: '2026-09-02' },
  quiz: { awarded: 6, max: 8, date: '2026-08-30' },
  mock: { correct: 2, total: 4, date: '2026-08-20' },
});
const fatHomework = (i: number) => ({
  assignmentId: `a${i}`,
  sessionId: `s${i}`,
  assignedAt: `2026-09-0${i + 1}T00:00:00Z`,
  los: Array.from({ length: 3 }, (_, j) => ({
    loId: `lo${i}-${j}`,
    title: `Homework objective ${i}.${j} on multi-step linear equations`,
    total: 4,
    attempted: 2,
    correct: 1,
    status: 'partial' as const,
  })),
  overall: 'partial' as const,
});

const overflowing = renderLearnerContextBlock({
  los: Array.from({ length: 8 }, (_, i) => fatLo(i)),
  gaps: Array.from({ length: 3 }, (_, i) => ({ label: `gap-${i}`, observation: 'y'.repeat(400) })),
  ability: 'building',
  gapsResolved90d: 4,
  cadence: { daysSinceLast: 9, sessionsLast7d: 0 },
  nextTimeIntent: 'start with the vertex form and work back to the standard form',
  goals: [
    'Goal: lift my algebra grade from a C+ to an A before the December report card',
    'Goal: stop losing marks to sign errors on multi-step equations under time pressure',
  ],
  homework: Array.from({ length: 5 }, (_, i) => fatHomework(i)),
  recapCandidate: { loId: 'lo0', title: longTitle(0), reason: 'homework-weak', soft: false },
})!;

check('overflowing input still fits the cap', overflowing.length <= LEARNER_CONTEXT_MAX_CHARS, String(overflowing.length));
check('trimmed block still opens with the fence', overflowing.startsWith('<learner_context>'));
check('trimmed block still closes with the fence', overflowing.endsWith('\n</learner_context>'));
check('trimmed block keeps directive 1 (teach to this)', overflowing.includes('Teach to this: fast-track objectives marked strong'));
check('trimmed block keeps directive 2 (cadence)', overflowing.includes('Cadence: after 7+ days away'));
check('trimmed block keeps directive 3 (progress question)', overflowing.includes('When the student asks how they are doing'));
check('trimmed block keeps directive 4 (never read aloud)', overflowing.includes('Never read this block aloud'));
// Proof the stages actually fired, in order: digests dropped (stage 2) and
// goals dropped (stage 3) and only the newest homework kept (stage 4)...
check('trim dropped the LO digest tails', !/ · practice /.test(overflowing), overflowing);
check('trim dropped the goal lines', !/^goal: /m.test(overflowing));
check('trim kept only one homework line', (overflowing.match(/^homework \(assigned/gm) ?? []).length === 1);
// ...while the load-bearing content survived.
check('trim kept the first LO title', overflowing.includes(longTitle(0)));
check('trim kept the standing band on that LO', new RegExp(`${longTitle(0)}: developing \\(medium confidence\\) ↑$`, 'm').test(overflowing));
check('trim kept the recap candidate', overflowing.includes('recap_candidate: '));
// FINDING (reported to the controller): this fixture — 8 LOs, five 3-LO
// homework statuses, 2 goals, 3 gaps — overflows 2400 even at the HARSHEST
// stage, so it lands in the last-resort hard truncation and loses the gap
// lines. That is the designed floor, not a bug, but it does say the cap is
// tight for a genuinely busy student.
check('the richest realistic input reaches the last-resort truncation', overflowing.includes('\n… (truncated)\n'));

// Stage 1 in isolation: gap observations re-clipped to 80, LO digests KEPT.
const stage1 = renderLearnerContextBlock({
  los: Array.from({ length: 6 }, (_, i) => fatLo(i)),
  gaps: Array.from({ length: 3 }, (_, i) => ({ label: `gap-${i}`, observation: 'y'.repeat(400) })),
})!;
check('stage 1 fits the cap', stage1.length <= LEARNER_CONTEXT_MAX_CHARS, String(stage1.length));
check('stage 1 clips gap observations to 80 chars', /^- gap-0: y{80}…$/m.test(stage1), stage1);
check('stage 1 keeps the LO digests', / · practice 3\/5 on 2026-09-02 · quiz 6\/8 pts on 2026-08-30 · mock 2\/4 \(2026-08-20\)/.test(stage1));

// Stage 2 in isolation: two more LOs and the digests have to go too.
const stage2 = renderLearnerContextBlock({
  los: Array.from({ length: 8 }, (_, i) => fatLo(i)),
  gaps: Array.from({ length: 3 }, (_, i) => ({ label: `gap-${i}`, observation: 'y'.repeat(400) })),
})!;
check('stage 2 fits the cap', stage2.length <= LEARNER_CONTEXT_MAX_CHARS, String(stage2.length));
check('stage 2 still clips gap observations', /^- gap-0: y{80}…$/m.test(stage2));
check('stage 2 drops the LO digests', !/ · practice /.test(stage2));
check('stage 2 keeps every LO band line', (stage2.match(/^- Long objective title number \d/gm) ?? []).length === 8);

// A goal containing " · " must survive intact when the block is UNDER the
// cap — the old stage-2 regex would have eaten everything after the dot.
const dotGoal = renderLearnerContextBlock({
  los: [{ loId: 'x', title: 'X', estimate: 0.9, confidence: 'high', reviewDue: false }],
  gaps: [],
  goals: ['Goal: finish algebra · then start geometry'],
})!;
check('under the cap, a goal containing " · " is not truncated', dotGoal.includes('goal: finish algebra · then start geometry'), dotGoal);
check('under-cap block is genuinely under the cap', dotGoal.length <= LEARNER_CONTEXT_MAX_CHARS, String(dotGoal.length));

// Last resort: content so large that even the harshest stage overflows.
// The body is hard-truncated, but the fence and all four directives stay.
const hopeless = renderLearnerContextBlock({
  los: Array.from({ length: 8 }, (_, i) => ({
    loId: `lo${i}`,
    title: `Objective ${i} ${'z'.repeat(500)}`,
    estimate: 0.4,
    confidence: 'medium',
    reviewDue: false,
  })),
  gaps: [{ label: 'g', observation: 'w'.repeat(400) }],
})!;
check('hopeless input still fits the cap', hopeless.length <= LEARNER_CONTEXT_MAX_CHARS, String(hopeless.length));
check('hopeless input is marked as truncated', hopeless.includes('\n… (truncated)\n'));
check('hopeless input still closes with the fence', hopeless.endsWith('\n</learner_context>'));
check(
  'hopeless input keeps all four directives',
  ['Teach to this: fast-track', 'Cadence: after 7+ days away', 'asks how they are doing', 'Never read this block aloud'].every((d) =>
    hopeless.includes(d),
  ),
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
