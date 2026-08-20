/**
 * Grade 7 Math — Expressions: Distributive Property & Factoring.
 *
 * The last move of the algebra strand (CCSS 7.EE.A.1): a(b + c) = ab + ac read
 * forwards to expand and backwards to factor. Two traps carry the lesson — a
 * negative multiplier flips the sign of EVERY product, so −2(x − 5) = −2x + 10,
 * and factoring must pull out the GREATEST common factor, not just any common
 * factor. Expanding hands the result straight to combining like terms from 5.3.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U5_DISTRIBUTIVE_PROPERTY_AND_FACTORING: LessonPlan = {
  id: 'evelyn.ms.m7math.distributive-property-and-factoring.v1',
  title: 'Distributive Property & Factoring',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.distributive-property-and-factoring',
      standard: 'M7MATH-5.4',
      description:
        'Expand linear expressions using the distributive property, including negative multipliers, and factor them by pulling out the greatest common factor, then combine like terms to reach simplest form (CCSS 7.EE.A.1).',
    },
  ],
  prerequisites: ['m7math.combining-like-terms'],
  followUps: ['m7math.one-step-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the distributive property as two counting routes to one total that a student already uses without naming it.',
      script:
        'You are filling 5 goodie bags for a party. Each bag gets a 3 dollar candy pack and a 2 dollar bouncy ball. How much do you spend? One way: each bag costs 3 + 2 = 5 dollars, and 5 bags is 5 times 5, so 25 dollars. Another way: buy all the candy at once for 5 times 3 = 15 dollars, buy all the balls for 5 times 2 = 10 dollars, and add to get 25 dollars. Same 25, two routes. That is not a coincidence, it is a rule, and it has a name. Today we use it to open up parentheses, and then we run it backwards to squeeze an expression back into parentheses.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distribute-and-factor',
      kind: 'concept',
      goal: 'State a(b + c) = ab + ac, drill the negative multiplier, and present factoring as the same rule read backwards.',
      keyIdeas: [
        'DISTRIBUTE MEANS HAND IT TO EVERY TERM — a(b + c) = ab + ac. The factor outside the parentheses multiplies each term inside, not just the first one. So 4(x + 3) = 4x + 12. Handing it only to the x and writing 4x + 3 is the most common way to lose this problem. It works with subtraction the same way: a(b − c) = ab − ac, so 4(x − 3) = 4x − 12.',
        'A NEGATIVE MULTIPLIER FLIPS EVERY SIGN — this is the case students get wrong. In −2(x − 5), the multiplier is −2 and it hits both terms. First: −2 times x = −2x. Second: −2 times −5 = +10, because a negative times a negative is positive. So −2(x − 5) = −2x + 10. It is NOT −2x − 10. Carry the minus sign into both products, then decide each sign on its own.',
        'A BARE MINUS IN FRONT OF PARENTHESES IS A HIDDEN −1 — 9 − (x − 4) means 9 plus (−1)(x − 4), which is 9 − x + 4, which simplifies to 13 − x. Every sign inside the parentheses flips. Writing the invisible 1 in as −1 before you distribute makes this one much safer.',
        'DISTRIBUTE FIRST, THEN COMBINE LIKE TERMS — expanding usually leaves terms that belong to the same pile, and sorting those piles is exactly the skill from last lesson. In 3(2x + 1) + 4x, distribute to get 6x + 3 + 4x, then combine the x pile: 6x + 4x = 10x, so the answer is 10x + 3. The 3 has no variable, so it stays on its own.',
        'FACTORING IS THE SAME RULE READ BACKWARDS — instead of opening parentheses, you build them. Find the greatest common factor of the numbers, write it outside, and write what is left inside: 6x + 9 = 3(2x + 3), because 6 divided by 3 is 2 and 9 divided by 3 is 3. Check by distributing back: 3 times 2x is 6x, and 3 times 3 is 9. If distributing your answer does not rebuild the original, the factoring is wrong.',
        'GREATEST MEANS GREATEST — 8x − 20 can be written as 2(4x − 10), and that is true, but it is not finished, because 4 and 10 still share a factor of 2. The greatest common factor of 8 and 20 is 4, so the fully factored form is 4(2x − 5). Keep asking whether the numbers left inside still share anything.',
      ],
      vocabulary: [
        { term: 'distributive property', definition: 'the rule a(b + c) = ab + ac — the outside factor multiplies every term inside the parentheses.' },
        { term: 'expand', definition: 'to use the distributive property to remove parentheses: 4(x + 3) becomes 4x + 12.' },
        { term: 'factor', definition: 'to write a sum as a product by pulling a common factor outside parentheses: 6x + 9 becomes 3(2x + 3).' },
        { term: 'greatest common factor', definition: 'the largest number that divides every coefficient in the expression — the 4 in 8x − 20.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-negative-multiplier',
      kind: 'worked_example',
      problem: 'Simplify: −2(x − 5) + 3x',
      steps: [
        'Name the multiplier before doing anything. The factor glued to the parentheses is −2, minus sign included. Carry that minus into both products.',
        'First product: −2 times x = −2x.',
        'Second product: −2 times −5 = +10. A negative times a negative is positive, so the sign flips here. WRONG answer to avoid: −2x − 10, which comes from carrying the minus into the first product only. RIGHT answer so far: −2x + 10.',
        'Rewrite the whole expression with the parentheses gone: −2x + 10 + 3x.',
        'Now combine like terms, exactly as in the last lesson. The x pile holds −2x and +3x, and −2 + 3 = 1, so it combines to 1x, which we write as x. The 10 has no variable, so it stays where it is.',
        'Final answer: x + 10. Check by substituting x = 4. Original: −2(4 − 5) + 3(4) = −2(−1) + 12 = 2 + 12 = 14. Simplified: 4 + 10 = 14. Both give 14.',
      ],
      answer: 'x + 10',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-factoring-gcf',
      kind: 'worked_example',
      problem: 'Factor completely: (a) 6x + 9, (b) 8x − 20',
      steps: [
        'Part (a) — look only at the numbers, 6 and 9. What is the largest number that divides both? The factors of 6 are 1, 2, 3, 6 and the factors of 9 are 1, 3, 9, so the greatest common factor is 3.',
        'Write the 3 outside and divide each term by it: 6x divided by 3 is 2x, and 9 divided by 3 is 3. That gives 3(2x + 3).',
        'Check by distributing back: 3 times 2x = 6x, and 3 times 3 = 9, which rebuilds 6x + 9. Part (a) is done.',
        'Part (b) — the numbers are 8 and 20. Common factors are 1, 2 and 4, so the greatest common factor is 4. Keep the subtraction sign with the second term.',
        '8x divided by 4 is 2x, and 20 divided by 4 is 5, so the answer is 4(2x − 5). Check: 4 times 2x = 8x, and 4 times −5 = −20, which rebuilds 8x − 20.',
        'Notice what NOT to stop at. Pulling out only a 2 gives 2(4x − 10), which is true but unfinished, because 4 and 10 still share a factor of 2. Always ask whether the numbers left inside still have something in common.',
      ],
      answer: '(a) 3(2x + 3)   (b) 4(2x − 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-expand-negative',
      kind: 'try_yourself',
      problem: 'Expand: −3(x − 4)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−3x + 12', correct: true },
        { id: 'b', text: '−3x − 12' },
        { id: 'c', text: '−3x − 4' },
        { id: 'd', text: '3x − 12' },
      ],
      expectedAnswer: '−3x + 12',
      hints: [
        'The multiplier is −3, minus sign included, and it has to reach both terms inside.',
        'Work out the second product on its own: −3 times −4. A negative times a negative is positive.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-factor-gcf',
      kind: 'try_yourself',
      problem: 'Factor completely: 12x + 8',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4(3x + 2)', correct: true },
        { id: 'b', text: '2(6x + 4)' },
        { id: 'c', text: '4(3x + 8)' },
        { id: 'd', text: '4x(3 + 2)' },
      ],
      expectedAnswer: '4(3x + 2)',
      hints: [
        'List what divides 12 and what divides 8, then take the largest number on both lists.',
        'Every term inside must be divided by the factor you pulled out. Distribute your answer back and see whether it rebuilds 12x + 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-expand-combine',
      kind: 'try_yourself',
      problem: 'Simplify 4(2x + 3) − 5x completely, then evaluate your simplified expression when x = 2. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '18',
      hints: [
        'Distribute the 4 to both terms inside first, then sort what is left into piles.',
        'After distributing you have 8x + 12 − 5x, which simplifies to 3x + 12. Now substitute x = 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-distribution',
      kind: 'misconception_check',
      question: 'A student expands −2(x − 5) and writes −2x − 10. Another student writes −2x + 5. What went wrong in each case?',
      commonErrors: [
        {
          answer: '−2x − 10',
          misconception: 'Multiplying 2 by 5 to get 10 and then copying the minus sign that was already sitting there, instead of multiplying −2 by −5 and letting the sign flip.',
          correctsTo: 'Both terms get multiplied by the full multiplier −2, sign included. The second product is −2 times −5, and a negative times a negative is positive, so it is +10. The correct expansion is −2x + 10. Check with x = 5: the original is −2(5 − 5) = −2(0) = 0. The correct answer gives −2(5) + 10 = −10 + 10 = 0. The wrong answer gives −10 − 10 = −20, so it cannot be right.',
        },
        {
          answer: '−2x + 5',
          misconception: 'Handing the −2 to the first term only and letting the 5 fall out of the parentheses untouched.',
          correctsTo: 'The factor outside multiplies EVERY term inside, which is the whole point of a(b + c) = ab + ac. Leaving the second term unmultiplied changes the value of the expression. Distribute to both and the answer is −2x + 10.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Distribute means multiply the outside factor by EVERY term inside: 4(x + 3) = 4x + 12.',
        'A negative multiplier changes the sign of both products: −2(x − 5) = −2x + 10, not −2x − 10.',
        'A bare minus in front of parentheses is a hidden −1, so every sign inside flips: 9 − (x − 4) = 13 − x.',
        'Distribute first, then combine like terms: 3(2x + 1) + 4x = 6x + 3 + 4x = 10x + 3.',
        'Factoring is the same rule backwards — pull out the greatest common factor: 6x + 9 = 3(2x + 3).',
        'Check any factoring by distributing it back. If it does not rebuild the original expression, it is wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Distributive Property & Factoring' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
