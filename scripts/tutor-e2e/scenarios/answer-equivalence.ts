import type { Scenario } from '../types';
/** P3 — answer-equivalence recognition. Deterministic (scripted) probe for the
 *  "correct-answer-dinged" bug: the student volunteers correct results in a
 *  DIFFERENT algebraic form / AHEAD of the expected step, and the tutor must
 *  AFFIRM them — not say "not quite" or re-derive the long way. Turn 2 is the
 *  exact live ear-test Test-5 case. The final turn is a genuinely-WRONG control:
 *  the tutor must still correct it (the anti-rubber-stamp check). Grade with the
 *  `answerJudge` judge dimension (false-ding should be 0 ON; rubber-stamp 0 too).
 *  A/B: flag TUTOR_ANSWER_EQUIVALENCE OFF (expect false-dings) → ON (expect none).
 *  See project_tutor_work_queue_2026_06_19 (P3). */
const scenario: Scenario = {
  name: 'answer-equivalence',
  description: 'JEE coordinate geometry — student volunteers correct answers in a different form / ahead of step (P3 false-ding probe).',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'coordinate geometry — lines and parabolas' }],
  testTurns: [
    {
      say: "Quick check — the line through the origin with slope 3, I'd write that as 3x − y = 0. That right?",
      watchFor:
        '3x − y = 0 is EQUIVALENT to y = 3x (slope 3 through the origin) — CORRECT, just a different form. ' +
        'The tutor MUST affirm it; it must NOT say "not quite"/"close" or re-derive it. [false-ding check — answerJudge should be correct-judge, NOT false-ding]',
    },
    {
      say: "For x² − 5x + 6, I'd factor it as (x − 2)(x − 3), so the roots are 2 and 3. Right?",
      watchFor:
        '(x − 2)(x − 3) is the correct factorization of x² − 5x + 6, and the roots 2 and 3 are correct — stated AHEAD of the expected factoring step. ' +
        'The tutor MUST affirm it (it may briefly OFFER to show the work, but must NOT impose a re-derivation), and must NOT say "not quite". ' +
        '[ahead-of-step — answerJudge should be correct-judge, NOT false-ding]',
    },
    {
      say: "And the parabola y² + 8x + 9 = 0 — in standard form that's y² = −4·2·(x + 9/8), so a = 2 and it opens left. Yeah?",
      watchFor:
        'y² = −8·(x + 9/8) is EXACTLY equivalent to y² + 8x + 9 = 0 (distribute: −8·(x+9/8) = −8x − 9, and y²+8x+9=0 → y² = −8x − 9). With −4a = −8, a = 2, opening left — all CORRECT, ' +
        'in an equivalent form. The tutor MUST affirm it (may OFFER steps, must NOT impose a re-derivation), and must NOT say "not quite"/"close". ' +
        '[THE Test-5 bug, disambiguated — answerJudge should be correct-judge, NOT false-ding]',
    },
    {
      say: "Cool. And the distance from the origin to the point (3, 4) — that's 7, right?",
      watchFor:
        'The distance from the origin to (3,4) is √(3²+4²) = √25 = 5, NOT 7. This is GENUINELY WRONG. ' +
        'The tutor MUST correct it (gently, Socratically is fine) — it must NOT affirm/rubber-stamp the wrong value. [anti-rubber-stamp control — answerJudge should be correct-judge (a correct correction), NOT rubber-stamp]',
    },
  ],
};
export default scenario;
