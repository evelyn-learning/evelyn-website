// apps/tutor/scripts/tutor/verdict-bank/probes/incidents.ts
/**
 * Five pinned live incidents (2026-08-18 verdict-probe-bank plan, Task 3).
 * Each reproduces a real mis-grading session so a regression in the
 * corresponding class is caught by the bank.
 */
import type { VerdictProbe } from '../types';
import { MATH_START, GOV_START } from './starts';

export const INCIDENT_PROBES: VerdictProbe[] = [
  {
    id: 'inc-arith-tutor-posed',
    cell: { provenance: 'tutor-posed-board', relation: 'exactly-correct', answerType: 'numeric' },
    start: MATH_START,
    kickoff:
      "Before the lesson — quick warm-up: put the expression 24 ÷ 4 × 3 − 5 on the board, ask me what it equals, and I'll answer by gut instinct.",
    turns: [
      { compute: 'board-expression', prefix: '', fallbackSay: '24 ÷ 4 × 3 − 5 — I say that equals 13. Right?' },
    ],
    expected: 'affirm',
    notes:
      'portal-e3af265a — the brain graded a correct 13 against the lesson script\'s expected-wrong gut answer. ' +
      'Final review (2026-08-18): the kickoff now pins the exact expression, because compute: \'board-expression\' ' +
      'always falls back to fallbackSay (no debug event exposes latex today, see README known limitation 1) — ' +
      'the fallback asserts "13" and an unpinned kickoff would let the tutor write any expression, making that assertion wrong.',
  },
  {
    id: 'inc-concept-denied',
    cell: { provenance: 'tutor-posed-speech', relation: 'exactly-correct', answerType: 'concept' },
    start: GOV_START,
    kickoff:
      'Quiz me on one thing: which practice lets each branch of government limit the other two? Ask me that as a question first.',
    turns: [{ say: 'checks and balances.' }],
    expected: 'affirm',
    notes:
      'portal-a972c7e9 class (deny-then-reveal on a correct concept name) transplanted to the gov domain; watch denied_answer_stashed/denied_answer_reversal_kill events.',
  },
  {
    id: 'inc-nonanswer-submission',
    cell: { provenance: 'tutor-posed-card', relation: 'non-answer', answerType: 'n/a' },
    start: MATH_START,
    kickoff: "Give me a quick free-response try-yourself problem about lines (not multiple choice) — I'll answer.",
    turns: [{ say: 'a' }],
    expected: 'none',
    notes:
      'session-1786064015703 — "a" was praised as "Right, a circle!"; any affirm/deny here is a fail. ' +
      'Final review (2026-08-18): kickoff pinned to free-response because "a" is a legitimate answer on a ' +
      'multiple-choice card — an unpinned kickoff risks the tutor posing an MCQ, in which case a verdict ' +
      'on "a" would be correct behavior and this probe would false-FAIL.',
  },
  {
    id: 'inc-request-not-answer',
    cell: { provenance: 'tutor-posed-speech', relation: 'non-answer', answerType: 'request' },
    start: MATH_START,
    kickoff: 'Ask me one quick question about slopes.',
    turns: [{ say: 'give me another example first' }],
    expected: 'none',
    notes: 'embed-1786076855391 — request was answered with "One eighth. Nice."',
  },
  {
    id: 'inc-idk-no-praise',
    cell: { provenance: 'tutor-posed-speech', relation: 'non-answer', answerType: 'give-up' },
    start: MATH_START,
    kickoff: 'Ask me one question about the slope of a vertical line.',
    turns: [{ say: "I don't know." }],
    expected: 'none',
    notes:
      'reveal is allowed, but a praise-phrased reveal ("Right — undefined!") classifies affirm → fail.',
  },
];
