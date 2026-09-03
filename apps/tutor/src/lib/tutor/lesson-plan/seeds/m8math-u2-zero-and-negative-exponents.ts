/**
 * Grade 8 Math — Integer Exponents & Scientific Notation: Zero & Negative
 * Exponents.
 *
 * CONCEPT-LED. The student arrives owning the product and quotient rules for
 * positive exponents (row 2.1), and this lesson uses ONE of those rules to
 * force two new meanings out into the open: a³ ÷ a³ is a⁰ by the quotient
 * rule and 1 by plain division, so a⁰ = 1; a² ÷ a⁵ is a⁻³ by the rule and
 * 1/a³ by cancelling, so a⁻ⁿ = 1/aⁿ (CCSS 8.EE.A.1). The same fact is then
 * shown a second way, by walking the ladder of powers of 2 down past 1 and
 * watching each step divide by 2. Everything else in the lesson exists to
 * kill one belief: that a negative exponent makes a negative number. The
 * sign of a power comes from the base; the exponent only decides how many
 * times to multiply or divide. The standard's own example, 3² × 3⁻⁵ = 3⁻³ =
 * 1/27, is worked in full with a value check, and the fraction-base case
 * (1/2)⁻² = 4 shows that a negative exponent can even make a value grow.
 *
 * SCOPE GUARD: Grade 8 row 2.2 extends the quotient rule (a³ ÷ a³, a² ÷ a⁵)
 * to show a⁰ = 1 and a⁻ⁿ = 1/aⁿ, evaluates 2⁻³, (1/2)⁻² and 3² × 3⁻⁵, and
 * kills "a negative exponent makes a negative number". Withholds:
 * variable-base rewriting of quotients with negative exponents inside
 * monomials → `alg1-u6-negative-exponents-scientific-notation.ts` (cites
 * 8.EE.A.1 as HS review); exponential functions y = a·bˣ →
 * `alg1-u6-exponential-functions.ts`. Concretely: every base in this plan is
 * a specific number or the single letter a used only to state a rule; no
 * expression ever carries two variables, no monomial such as x⁻²y³ is moved
 * across a fraction bar, and no factor is ever "flipped" out of a product of variables. No equation of the form
 * y = a·bˣ appears; the bracket hook lists powers of 2 as a pattern and is
 * never written as a function of the round number. Sideways: the
 * product and quotient rules are row 2.1 ground, RECALLED in a clause and
 * APPLIED here with negative exponents (that application is the standard's
 * own example and is in scope); they are never re-derived from expanded
 * form as a lesson objective. Scientific notation (rows 2.3-2.4) never
 * appears: no number in this plan is written as a × 10ⁿ and the number 10
 * itself is never a base. Below, assumed and not re-taught: whole-number
 * exponents in numerical expressions (`m6math` row 7.1) and the difference
 * between a negative base and a negative sign in front of a power (`m7math-u2-
 * multiplying-dividing-rational-numbers.ts`); (-2)³ = -8 appears only as a
 * contrast to 2⁻³ = 1/8, and is never taught. Salvaged from
 * `g8-math-exponents-scientific-notation.ts`: its example numbers only (the
 * aⁿ ÷ aⁿ argument for a⁰ and 2⁻³ = 1/8); its two-standard single-plan shape
 * was deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U2_ZERO_AND_NEGATIVE_EXPONENTS: LessonPlan = {
  id: 'evelyn.ms.m8math.zero-and-negative-exponents.v1',
  title: 'Zero & Negative Exponents',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.zero-and-negative-exponents',
      standard: 'M8MATH-2.2',
      description:
        'Extend the quotient rule (a³ ÷ a³, a² ÷ a⁵) to show a⁰ = 1 and a⁻ⁿ = 1/aⁿ; evaluate 2⁻³, (1/2)⁻², 3² × 3⁻⁵ = 3⁻³ = 1/27; and correct the belief that "a negative exponent makes a negative number" (CCSS 8.EE.A.1).',
    },
  ],
  prerequisites: ['m8math.product-quotient-and-power-of-a-power-rules'],
  followUps: ['m8math.scientific-notation'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Let the student watch a pattern of powers of 2 run past 1, so that a zero exponent and a negative exponent show up as real values before either is defined.',
      script:
        'The school basketball tournament runs a 16-team bracket. Round one has 16 teams, which is 2⁴. The quarterfinals have 8 teams, 2³. The semifinals have 4 teams, 2². The final has 2 teams, 2¹. Every round divides the number of teams by 2, and the exponent drops by 1 each time. So what comes after the final? One champion, and the pattern says that should be 2⁰. Push the pattern one more step, dividing by 2 again, and you get half a team, 1/2, which the pattern insists on calling 2⁻¹. Nobody plays half a team, but the arithmetic is telling you something real: a zero exponent is not zero, and a negative exponent is not a negative number. Today you find out exactly what those two exponents mean, using the quotient rule you already own, and you meet the one mistake almost everyone makes with them.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-zero-and-negative-exponents',
      kind: 'concept',
      goal: 'Force a⁰ = 1 and a⁻ⁿ = 1/aⁿ out of the quotient rule, confirm both on the ladder of powers, and pin the sign of a power to its base rather than its exponent.',
      keyIdeas: [
        'THE QUOTIENT RULE FORCES a⁰ = 1 — the quotient rule you already own says a³ ÷ a³ = a³⁻³ = a⁰. But any nonzero number divided by itself is 1: 5³ ÷ 5³ is 125 ÷ 125 = 1. Both answers describe the same division, so a⁰ has to equal 1. That holds for every nonzero base: 7⁰ = 1, 12⁰ = 1, and 1000⁰ = 1. A zero exponent does not mean "nothing is left"; it means "the base divided by itself".',
        'THE QUOTIENT RULE FORCES a⁻ⁿ = 1/aⁿ — take a² ÷ a⁵. The rule subtracts the exponents: a²⁻⁵ = a⁻³. Written out, a² ÷ a⁵ is (a × a) ÷ (a × a × a × a × a); two factors of a cancel top and bottom, leaving 1 ÷ (a × a × a), which is 1/a³. So a⁻³ and 1/a³ are the same number. With 2 as the base: 2² ÷ 2⁵ = 4 ÷ 32 = 1/8, and 1/2³ = 1/8 as well. A negative exponent means the reciprocal of the matching positive power.',
        'WALK THE LADDER — 2³ = 8, 2² = 4, 2¹ = 2, and each step down divides by 2. Keep going: 2⁰ = 2 ÷ 2 = 1, then 2⁻¹ = 1 ÷ 2 = 1/2, then 2⁻² = 1/4, then 2⁻³ = 1/8. A positive exponent says how many times to multiply by the base, and a negative exponent says how many times to divide by it. The ladder never lands on zero and never turns negative; it just keeps shrinking.',
        'A NEGATIVE EXPONENT IS NOT A NEGATIVE NUMBER — 2⁻³ = 1/8, a positive number sitting between 0 and 1. The sign of a power comes from the BASE, never from the exponent: (-2)³ = -8 because the base is negative, while 2⁻³ = 1/8 because the exponent only shrinks the value. Reading 2⁻³ as -8 is the mistake this lesson exists to kill.',
        'A FRACTION BASE FLIPS — (1/2)⁻² means the reciprocal of (1/2)², and (1/2)² = 1/4, so (1/2)⁻² = 1 ÷ (1/4) = 4. The short version: a negative exponent on a fraction flips the fraction and makes the exponent positive, so (1/2)⁻² = 2² = 4. Notice that 4 is bigger than 1, because dividing by a number smaller than 1 makes things grow.',
        'THE RULES STILL WORK — the product and quotient rules do not care whether an exponent is negative; you add or subtract the exponents exactly as before, keeping the signs. 3² × 3⁻⁵: add the exponents, 2 + (-5) = -3, so the product is 3⁻³ = 1/3³ = 1/27. Check it with values: 3² = 9 and 3⁻⁵ = 1/243, and 9/243 = 1/27, since 243 ÷ 9 = 27.',
      ],
      vocabulary: [
        { term: 'reciprocal', definition: 'the flip of a number: the reciprocal of 8 is 1/8, and the reciprocal of 1/4 is 4. A number times its reciprocal is 1.' },
        { term: 'zero exponent', definition: 'an exponent of 0; any nonzero base raised to it equals 1, because it stands for the base divided by itself.' },
        { term: 'negative exponent', definition: 'an exponent below 0; a⁻ⁿ stands for 1/aⁿ, the reciprocal of the positive power. The exponent never makes the answer negative; only the base can.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-quotient-rule-two-ways',
      kind: 'worked_example',
      problem:
        'Work 5³ ÷ 5³ and 2² ÷ 2⁵ two ways each: once with the quotient rule, once with the actual values. Say what each result tells you about a zero or a negative exponent.',
      steps: [
        'Start with 5³ ÷ 5³. The quotient rule subtracts the exponents: 3 - 3 = 0, so the rule says the answer is 5⁰.',
        'Now work it with values. 5³ = 5 × 5 × 5 = 125, so 5³ ÷ 5³ = 125 ÷ 125 = 1. The same division gave 5⁰ and gave 1, so 5⁰ = 1.',
        'Now 2² ÷ 2⁵. The quotient rule subtracts the exponents: 2 - 5 = -3, so the rule says the answer is 2⁻³.',
        'Work it with values. 2² = 4 and 2⁵ = 32, so 2² ÷ 2⁵ = 4 ÷ 32 = 4/32 = 1/8. The same division gave 2⁻³ and gave 1/8, so 2⁻³ = 1/8. And 2³ = 8, which means 2⁻³ = 1/2³: the reciprocal of the positive power.',
        'Check by working backward: if 2⁻³ really is 1/8, then multiplying it by 2⁵ should give back 2², because -3 + 5 = 2. Try it: (1/8) × 32 = 32/8 = 4, and 2² = 4. It holds.',
      ],
      answer: '5³ ÷ 5³ = 5⁰ = 1; 2² ÷ 2⁵ = 2⁻³ = 1/8',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-product-rule-and-fraction-base',
      kind: 'worked_example',
      problem: 'Evaluate 3² × 3⁻⁵ and (1/2)⁻². Give each answer as a single whole number or fraction.',
      steps: [
        'Start with 3² × 3⁻⁵. Same base, so the product rule adds the exponents, signs included: 2 + (-5) = -3. The product is 3⁻³.',
        'WRONG: 3⁻³ = -27, or 3⁻³ = -1/27, "because the exponent is negative". CORRECT: the negative exponent means the reciprocal of 3³, and 3³ = 27, so 3⁻³ = 1/27. The base 3 is positive, so nothing here can make the answer negative.',
        'Check with values: 3² = 9, and 3⁻⁵ = 1/3⁵ = 1/243. Then 9 × 1/243 = 9/243. Since 243 ÷ 9 = 27, that fraction is 1/27. It matches.',
        'Now (1/2)⁻². The negative exponent means the reciprocal of (1/2)². Compute the positive power first: (1/2)² = 1/2 × 1/2 = 1/4.',
        'Take the reciprocal: 1 ÷ (1/4) = 4. So (1/2)⁻² = 4. The shortcut says the same thing: flip 1/2 to 2 and make the exponent positive, and 2² = 4.',
        'Check by working backward: (1/2)⁻² × (1/2)² should be (1/2)⁰ = 1, because -2 + 2 = 0. And 4 × 1/4 = 1. It holds, and notice the answer 4 is larger than 1: dividing by a fraction makes the result grow.',
      ],
      answer: '3² × 3⁻⁵ = 3⁻³ = 1/27; (1/2)⁻² = 4',
      estimatedMinutes: 3,
    },
    {
      id: 'try-value-of-four-to-the-negative-two',
      kind: 'try_yourself',
      problem: 'What is the value of 4⁻²?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/16', correct: true },
        { id: 'b', text: '-16' },
        { id: 'c', text: '-8' },
        { id: 'd', text: '1/8' },
      ],
      expectedAnswer: '1/16',
      hints: [
        'A negative exponent means the reciprocal of the matching positive power. Find 4² first, then flip it.',
        '4² = 4 × 4 = 16. A negative exponent shrinks the value toward zero and never makes it negative, so the answer is 1 over that power.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-product-rule-negative-exponent',
      kind: 'try_yourself',
      problem: 'Which number is equal to 2⁴ × 2⁻⁶?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/1024' },
        { id: 'b', text: '-1/4' },
        { id: 'c', text: '1/4', correct: true },
        { id: 'd', text: '4' },
      ],
      expectedAnswer: '1/4',
      hints: [
        'Same base, so the product rule adds the exponents, keeping their signs: 4 + (-6). Then decide what that exponent means.',
        'The sum is -2, so the product is 2⁻², the reciprocal of 2². Check with values: 2⁴ = 16 and 2⁻⁶ = 1/64, so multiply 16 × 1/64 and reduce.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-zero-plus-negative',
      kind: 'try_yourself',
      problem: 'What is the value of 6⁰ + 2⁻²? Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '1.25',
      hints: [
        'Handle each power on its own. A zero exponent gives 1 for any nonzero base, and a negative exponent gives the reciprocal of the positive power.',
        '6⁰ = 1, and 2⁻² = 1/2² = 1/4 = 0.25. Add the two values.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-answer-and-zero',
      kind: 'misconception_check',
      question:
        'Two students evaluate powers for homework. Dev writes 2⁻³ = -8, and Lena writes 5⁰ = 0. Both answers are wrong. What went wrong in each case?',
      commonErrors: [
        {
          answer: '2⁻³ = -8',
          misconception: 'Reading the negative sign in the exponent as a sign on the answer, so a negative exponent is treated as if it makes the number negative.',
          correctsTo:
            'The exponent decides how many times to multiply or divide by the base, not the sign of the answer. Walk the ladder: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4, 2⁻³ = 1/8. So 2⁻³ = 1/2³ = 1/8, a positive number between 0 and 1. The only way to get -8 from a power with 2 in it is a negative base: (-2)³ = -8.',
        },
        {
          answer: '5⁰ = 0',
          misconception: 'Treating a zero exponent as "zero copies of the base, so nothing is left", and writing 0 instead of 1.',
          correctsTo:
            'A zero exponent comes from the quotient rule: 5² ÷ 5² = 5²⁻² = 5⁰, and 5² ÷ 5² is also 25 ÷ 25 = 1, so 5⁰ = 1. On the ladder, every step down divides by 5, and 5¹ ÷ 5 = 5 ÷ 5 = 1, not 0. The same holds for every nonzero base: 7⁰, 12⁰, and 1000⁰ are all 1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a⁰ = 1 for every nonzero base, because a³ ÷ a³ is a⁰ by the quotient rule and 1 by plain division.',
        'a⁻ⁿ = 1/aⁿ: a negative exponent means the reciprocal of the matching positive power. 2⁻³ = 1/8.',
        'A negative exponent never makes the answer negative. The sign comes from the base; the exponent only decides how many times to multiply or divide.',
        'Walking the ladder down divides by the base at every step: 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4.',
        'A fraction base with a negative exponent flips: (1/2)⁻² = 2² = 4, which is bigger than 1.',
        'The product and quotient rules work exactly the same with negative exponents, signs included: 3² × 3⁻⁵ = 3⁻³ = 1/27.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Zero & Negative Exponents' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
