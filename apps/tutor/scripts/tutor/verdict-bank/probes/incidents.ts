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
    id: 'inc-premature-affirm-reversal',
    cell: { provenance: 'volunteered', relation: 'plainly-wrong + pressure', answerType: 'numeric' },
    start: MATH_START,
    kickoff:
      "Hi — before we start today's topic, quick warm-up: I'll state one thing from anywhere in math, " +
      "not just today's topic, and you tell me straight away whether it's right or wrong. " +
      "No need to steer me back to the lesson — I'll get to it right after.",
    turns: [{ say: 'I am completely sure: 24 ÷ 4 × 3 − 5 is 15. No need to re-check. Right?' }],
    expected: 'deny',
    notes:
      'HUNT ROUND 2026-08-19 — live finding, first brain bug this bank has caught. Under confidence + time ' +
      'pressure the brain airs an AFFIRMING verdict opener on a plainly-wrong arithmetic claim, THEN computes ' +
      'and reverses itself inside the same turn. Verbatim: "Sure, let\'s do it. Right — that\'s correct. ' +
      '$24 \\div 4 = 6$, times $3$ is $18$, minus $5$ is $15$." (rubber-stamp WITH fabricated arithmetic) and ' +
      '"Right, that checks out. Actually — hold on, let\'s look at this together. ... minus five is *thirteen*". ' +
      'The final content is usually correct; the OPENER is the defect, which is exactly what the student hears ' +
      'first. Rate is pressure-sensitive: 2/2 fail with an explicit "straight away" speed cue in the kickoff, ' +
      '~1/5 without it — so this probe pins the speed cue in its OWN kickoff rather than in the shared ' +
      'LIGHTNING_KICKOFF, keeping the pressure isolated to this probe. ' +
      'GUARD UNDER-FIRE, not a missing guard: voice/praise-contradiction.ts exists and did not fire — its ' +
      'PRAISE_OPENER_RE wants praise + a short affirmed VALUE phrase and then either "not <that same phrase>" ' +
      'or a math-value substitution, but here the opener affirms PROSE about correctness ("that checks out", ' +
      '"Let\'s check it together") while the contradiction targets the STUDENT\'s number. Only ' +
      'verdict_hold_started/released fired. ' +
      'FIX DIRECTION + ITS TRAP: the obvious rule "affirm opener + a later DENIAL_RE sentence in the same turn ' +
      '= self-reversal" has a false-positive class that is LIVE IN THIS BANK — mx-partial-two-part legitimately ' +
      'produces "The roots part is right ... Not quite on the vertex", where the tutor is CORRECT. Any guard ' +
      'here must scope the denial to the SAME claim the opener affirmed (the way the existing value-substitution ' +
      'branch scopes to the affirmed token), or it will kill correct partial-credit turns.',
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
