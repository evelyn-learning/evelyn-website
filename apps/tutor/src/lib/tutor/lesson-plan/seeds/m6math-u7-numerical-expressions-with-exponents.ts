/**
 * Grade 6 Math — Expressions & Exponents: Numerical Expressions with
 * Exponents.
 *
 * CONCEPT-LED lesson for the m6math fan-out. This is the first time exponent
 * notation appears in the course, so the whole lesson installs one mental
 * model: an exponent is a COUNT of repeated factors, not a second number to
 * multiply by (CCSS 6.EE.A.1). Two traps this plan is built to kill: reading
 * 3⁴ as 3 × 4 instead of 3 × 3 × 3 × 3, and letting an exponent reach across
 * a plus sign to grab a whole sum instead of only the base sitting next to
 * it.
 *
 * SCOPE GUARD: this lesson writes and evaluates NUMERICAL expressions with
 * whole-number exponents — every base and every exponent is a specific whole
 * number small enough to multiply out by hand. It never puts a letter in
 * place of a number: an expression built from a variable is row 7.2
 * (writing and evaluating algebraic expressions), and naming the parts of
 * such an expression (term, factor, coefficient) is row 7.3. It never states
 * or uses an exponent RULE — no product-of-powers, no zero or negative
 * exponent, no scientific notation — those belong to Grade 8 (8.EE.A.1) and
 * do not appear here. Order of operations shows up only far enough to place
 * a single power correctly next to one addition or multiplication in a short
 * expression; it is not a general multi-step order-of-operations unit.
 *
 * NOTATION: an exponent is written as a raised digit directly on the base
 * (3⁴, 6³, 2⁵), matching the convention already used in the shipped m7math
 * and Algebra 1 seeds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U7_NUMERICAL_EXPRESSIONS_WITH_EXPONENTS: LessonPlan = {
  id: 'evelyn.ms.m6math.numerical-expressions-with-exponents.v1',
  title: 'Numerical Expressions with Exponents',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.numerical-expressions-with-exponents',
      standard: 'M6MATH-7.1',
      description:
        'Write and evaluate numerical expressions involving whole-number exponents (CCSS 6.EE.A.1).',
    },
  ],
  prerequisites: ['m6math.solving-real-world-coordinate-plane-problems'],
  followUps: ['m6math.writing-and-evaluating-algebraic-expressions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make repeated multiplication feel long and clumsy to write, so the student wants a shorter way.',
      script:
        'You start a chain message in your group chat. Round one, you send it to 3 friends. Round two, each of those 3 friends forwards it to 3 more friends, so 3 × 3 = 9 new people see it. Round three, each of those 9 forwards it to 3 more, so it is now 3 × 3 × 3 = 27 new people. By round five, you would need to write 3 × 3 × 3 × 3 × 3, and that is already getting long to write out and easy to miscount. Today you learn a short way to write repeated multiplication like this, and a rule for evaluating it correctly every time.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-exponents-are-repeated-multiplication',
      kind: 'concept',
      goal: 'Install the exponent as a count of repeated factors, name its parts, and place it correctly inside a short expression.',
      keyIdeas: [
        'AN EXPONENT COUNTS REPEATED FACTORS — an exponent tells how many times a number, called the base, is multiplied by itself. In 3⁴, the base 3 is used as a factor four times: 3 × 3 × 3 × 3, which equals 81.',
        'NAME THE PARTS: BASE AND EXPONENT — in 3⁴, the 3 sitting on the line is the base, and the small raised 4 is the exponent. Say it out loud as "three to the fourth power" before computing anything, so it is clear which number is which.',
        'WRITE REPEATED MULTIPLICATION AS A POWER — to turn 6 × 6 × 6 into exponent form, count the factors. There are three 6s, so the exponent is 3 and the base is 6, giving 6³. The exponent is always the COUNT of factors, never one of the factors itself.',
        'THE EXPONENT NEVER MEANS TIMES — 3⁴ is not 3 × 4. Multiplying 3 by 4 only uses 3 as a factor once; the exponent 4 says to use 3 as a factor four separate times. 3⁴ = 81, while 3 × 4 = 12, and those two answers are far apart, so checking catches this mix-up fast.',
        'SQUARED, CUBED, AND BEYOND — an exponent of 2 is read "squared," and an exponent of 3 is read "cubed." Beyond that, just say the exponent as a number: 2⁵ is read "two to the fifth power."',
        'IN A BIGGER EXPRESSION, THE POWER GOES FIRST — when a power sits next to addition or multiplication with no parentheses, evaluate the power first. In 4 + 5², the exponent belongs only to the 5, so compute 5² = 25 before adding: 4 + 25 = 29. The exponent does not reach across the plus sign to grab the 4 as well.',
      ],
      vocabulary: [
        { term: 'base', definition: 'the number that gets multiplied by itself in a power. In 3⁴, the base is 3.' },
        { term: 'exponent', definition: 'the small raised number that tells how many times the base is used as a factor. In 3⁴, the exponent is 4.' },
        { term: 'power', definition: 'a base and an exponent written together, such as 3⁴, or the value it evaluates to.' },
        { term: 'squared', definition: 'raised to the exponent 2, so "5 squared" means 5².' },
        { term: 'cubed', definition: 'raised to the exponent 3, so "5 cubed" means 5³.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-write-and-evaluate-a-power',
      kind: 'worked_example',
      problem: 'Write 6 × 6 × 6 as a single expression using an exponent. Then evaluate it.',
      steps: [
        'Count how many times 6 appears as a factor. It appears three times, so the exponent is 3. The base is 6, the number being multiplied. Write it as 6³.',
        'To evaluate 6³, multiply 6 by itself three times: 6 × 6 × 6.',
        'Multiply two at a time: 6 × 6 = 36, then 36 × 6 = 216.',
        'WRONG: reading the exponent as an extra multiplication and computing 6 × 3 = 18. CORRECT: 6³ means three factors of 6 multiplied together, which is 216, not 6 times 3.',
        'Check by expanding the power back into its factors: 6 × 6 × 6 = 216. The multiplication matches, so the answer holds.',
      ],
      answer: '6³ = 216',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-of-operations-with-a-power',
      kind: 'worked_example',
      problem: 'Evaluate 4 + 5².',
      steps: [
        'Look for the base and exponent written right next to each other. Here that is 5², so the exponent 2 belongs only to the 5, not to the whole expression.',
        'Evaluate the power first: 5² = 5 × 5 = 25.',
        'Now finish the expression with the number that is left: 4 + 25 = 29.',
        'WRONG: adding first and squaring the sum, computing (4 + 5)² = 9² = 81. CORRECT: the exponent only touches the 5 next to it, so the answer is 29, not 81.',
        'Check by reading the steps back in order: the power came first and gave 25, and the addition came last and gave 29.',
      ],
      answer: '29',
      estimatedMinutes: 3,
    },
    {
      id: 'try-reading-the-exponent-correctly',
      kind: 'try_yourself',
      problem: 'What is the value of 2⁵?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '32', correct: true },
        { id: 'b', text: '10' },
        { id: 'c', text: '16' },
        { id: 'd', text: '25' },
      ],
      expectedAnswer: '32',
      hints: [
        'The exponent tells you how many times to multiply the base by itself. It does not mean multiply the base by the exponent.',
        'Write out all five factors of 2 and multiply them one at a time: 2 × 2 × 2 × 2 × 2. Count the factors as you go so you do not stop short.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exponent-inside-an-expression',
      kind: 'try_yourself',
      problem: 'Evaluate 6 + 2³.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '512' },
        { id: 'b', text: '12' },
        { id: 'c', text: '14', correct: true },
        { id: 'd', text: '11' },
      ],
      expectedAnswer: '14',
      hints: [
        'Look for the base and exponent right next to each other — here that is 2³. Evaluate that power first, before doing anything else in the expression.',
        '2³ means 2 × 2 × 2, which is 8. Now finish the expression: 6 + 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-evaluate-with-exponent',
      kind: 'try_yourself',
      problem:
        'A puzzle app doubles your score at the end of each round when you find the hidden gem. You start a round with 5 points, and the doubling happens 4 times in a row, so your final score is 5 × 2⁴. Evaluate 5 × 2⁴ to find the final score. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '80',
      hints: [
        'Evaluate the power first: work out 2⁴ before you multiply by 5.',
        '2⁴ is 2 × 2 × 2 × 2, which is 16. Now multiply: 5 × 16.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-times-the-exponent-and-grabbing-the-sum',
      kind: 'misconception_check',
      question:
        'A student is asked to evaluate 3⁴ and writes 12. Another student is asked to evaluate 5 + 2³ and writes 343. What went wrong in each case?',
      commonErrors: [
        {
          answer: '12',
          misconception: 'Reading the exponent as a second factor to multiply by, so 3⁴ is computed as 3 × 4.',
          correctsTo:
            'The exponent is a count of factors, not a number to multiply by. 3⁴ means 3 used as a factor four times: 3 × 3 × 3 × 3 = 81. Multiplying 3 by 4 only uses 3 once, which is a completely different question.',
        },
        {
          answer: '343',
          misconception:
            'Adding first and then raising the whole sum to the power, treating the exponent as if it reaches back across the plus sign to grab everything before it: (5 + 2)³ = 7³ = 343.',
          correctsTo:
            'An exponent applies only to the base written directly on the line next to it, which is 2. Evaluate 2³ first: 2 × 2 × 2 = 8. Then add: 5 + 8 = 13. The exponent never reaches across a plus sign unless parentheses group the sum together first.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An exponent tells how many times to multiply the base by itself; 3⁴ means 3 × 3 × 3 × 3, not 3 × 4.',
        'The base is the repeated factor, and the exponent is the count of how many times it is used.',
        'An exponent of 2 is read "squared," and an exponent of 3 is read "cubed."',
        'To write repeated multiplication as a power, count the factors: that count is the exponent.',
        'In a bigger expression, evaluate the power first, before addition, subtraction, or multiplication that sits next to it.',
        'An exponent applies only to the base written next to it, never to a sum on the other side of a plus or minus sign, unless parentheses group them together.',
        'Check a power by expanding it back into its repeated-multiplication factors and multiplying them one at a time.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Numerical Expressions with Exponents' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
