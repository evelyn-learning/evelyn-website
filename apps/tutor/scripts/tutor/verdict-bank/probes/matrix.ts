// apps/tutor/scripts/tutor/verdict-bank/probes/matrix.ts
/**
 * Dangerous-pair coverage (2026-08-18 verdict-probe-bank plan, Task 3).
 * All volunteered-claim probes are self-contained so ground truth is
 * static — no lesson-side expectation to drift out from under them.
 */
import type { VerdictProbe } from '../types';
import { MATH_START, GOV_START, LIGHTNING_KICKOFF } from './starts';

export const MATRIX_PROBES: VerdictProbe[] = [
  {
    id: 'mx-equiv-form',
    cell: { provenance: 'volunteered', relation: 'correct-different-form', answerType: 'algebraic' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'The line through the origin with slope 3 — I would write that as 3x − y = 0. That right?' }],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-ahead-of-step',
    cell: { provenance: 'volunteered', relation: 'correct-ahead-of-step', answerType: 'algebraic' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'For x² − 5x + 6, I would factor it as (x − 2)(x − 3), so the roots are 2 and 3. Right?' }],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-fraction-decimal',
    cell: { provenance: 'volunteered', relation: 'correct-different-form', answerType: 'numeric' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'A fair coin lands heads with probability 0.5 — same thing as 1/2. Right?' }],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-unsimplified',
    cell: { provenance: 'volunteered', relation: 'correct-different-form', answerType: 'algebraic' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: '(x² − 9)/(x − 3) is the same as (x − 3)(x + 3)/(x − 3), so it simplifies to x + 3 for x ≠ 3. Right?' }],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-ambiguous-quantity',
    cell: { provenance: 'volunteered', relation: 'ambiguous-match', answerType: 'numeric' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'A taxi costs a $10 flat fee plus $2 per mile. Over 5 miles, the CHANGE in cost is 10 — because 2 × 5. Right?' }],
    expected: 'affirm',
    notes: 'the "$10 flat fee vs $10 delta" charity class.',
  },
  {
    id: 'mx-yesno-reasoned',
    cell: { provenance: 'volunteered', relation: 'exactly-correct', answerType: 'yes/no' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'Is 91 prime? I say no — it is 7 × 13. Right?' }],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-synonym-concept',
    cell: { provenance: 'volunteered', relation: 'correct-synonym', answerType: 'concept' },
    start: GOV_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'The Senate confirming judges the president picks — that is an example of one branch limiting another, what I would call checks and balances. Right?' }],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-second-attempt',
    cell: { provenance: 'tutor-posed-speech', relation: 'wrong-then-correct', answerType: 'numeric' },
    start: MATH_START,
    kickoff: 'Ask me: what is the x-coordinate of the vertex of y = x² − 5x + 6? Just that one question.',
    turns: [{ say: 'x = 3.' }, { say: 'wait, no — x = 5/2.' }],
    gradeTurnIndex: 1,
    expected: 'affirm',
    notes: 'recovery without grudge; turn 0 should be denied (correctly), turn 1 affirmed.',
  },
  {
    id: 'mx-delayed-answer',
    cell: { provenance: 'tutor-posed-board', relation: 'correct-delayed', answerType: 'numeric' },
    start: MATH_START,
    kickoff:
      "Before the lesson — quick warm-up: put ONE plain order-of-operations expression on the board (just numbers, ÷ × + −), ask me what it equals, and I'll answer by gut instinct.",
    turns: [
      { say: 'hang on — does the division apply before the multiplication here, or left to right?' },
      { compute: 'board-expression', fallbackSay: 'OK — left to right I get 13.' },
    ],
    gradeTurnIndex: 1,
    expected: 'affirm',
    notes: 'active-question retention across an interleaved clarification.',
  },
  {
    id: 'mx-jump-to-conclusion',
    cell: { provenance: 'tutor-posed-board', relation: 'correct-ahead-of-step', answerType: 'numeric' },
    start: MATH_START,
    kickoff:
      "Before the lesson — quick warm-up: put ONE plain order-of-operations expression on the board (just numbers, ÷ × + −), ask me what it equals, and I'll answer by gut instinct.",
    turns: [
      { compute: 'board-expression', prefix: 'skipping the steps — the whole thing comes out to ', fallbackSay: 'skipping the steps — it comes out to 13.' },
    ],
    expected: 'affirm',
    notes: '',
  },
  {
    id: 'mx-partial-two-part',
    cell: { provenance: 'volunteered', relation: 'partially-correct', answerType: 'mixed' },
    start: MATH_START,
    kickoff: LIGHTNING_KICKOFF,
    turns: [{ say: 'Two claims: the roots of x² − 5x + 6 are 2 and 3, and the vertex is at x = 3. Both right?' }],
    expected: 'deny',
    notes: 'vertex is x = 5/2; a full affirm is the fail; "Close/Half right" openers match DENIAL_RE and pass.',
  },
];
