/**
 * Grade 8 Math — Linear Equations in One Variable: Equations with
 * Distribution & Like Terms.
 *
 * PROCEDURE-LED (row 4.2). The student already owns distributing a factor
 * over a bracket, combining like terms, and last lesson's collect-then-finish
 * move for a variable on both sides. What is new is an equation in which the
 * variable is locked inside parentheses and scattered across several terms,
 * so nothing can be collected until each side has been expanded and tidied
 * (CCSS 8.EE.C.7b). The concept segment is an ordered recipe: distribute
 * every bracket, combine like terms on each side separately, collect the
 * variable terms, finish the two-step equation that remains, and check by
 * substituting into BOTH sides of the original with the brackets still in.
 * Two traps this plan is built to kill: a negative multiplier that flips only
 * the first sign inside the bracket (-2(x - 3) is -2x + 6, never -2x - 6), and
 * combining a term with a factor that has not been distributed yet (in
 * 6x - 2(x - 4), the -2 belongs to the bracket, not to the 6x).
 *
 * SCOPE GUARD: Grade 8 row 4.2 solves equations that need the distributive
 * property and combining like terms before the variable can be isolated,
 * e.g. 3(x - 4) + 2x = 2(x + 5) - 1, including negative multipliers -2(x - 3).
 * Assumes `m7math-u5-distributive-property-and-factoring.ts` and
 * `m7math-u5-combining-like-terms.ts`. Withholds: rational coefficients
 * (row 4.3); `alg1-u2-multi-step-equations.ts` repeats this skill as HS
 * review. Distribution and like-term combining are Grade 7 ground, recalled
 * in a sentence each and never re-taught as the objective; factoring (the
 * other half of that Grade 7 file) never appears. Once each side is tidied,
 * the equation that remains IS row 4.1's ax + b = cx + d, and collecting the
 * variable terms and finishing as a two-step equation is in scope here as the
 * tail of every solve, not as the lesson. Every equation the student solves
 * has integer coefficients and constants and exactly one integer solution
 * (a decimal appears only as an MCQ distractor produced by a named error);
 * no equation reduces to a = a or a = b (row 4.4), and no coefficient is a
 * fraction or decimal (row 4.3). Negative multipliers and negative solutions
 * DO appear, because both are Grade 7 ground and the negative multiplier is
 * named in this row's scope.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U4_EQUATIONS_WITH_DISTRIBUTION_AND_LIKE_TERMS: LessonPlan = {
  id: 'evelyn.ms.m8math.equations-with-distribution-and-like-terms.v1',
  title: 'Equations with Distribution & Like Terms',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.equations-with-distribution-and-like-terms',
      standard: 'M8MATH-4.2',
      description:
        'Solve equations that need the distributive property and combining like terms before the variable can be isolated, e.g. 3(x - 4) + 2x = 2(x + 5) - 1, including negative multipliers -2(x - 3) (CCSS 8.EE.C.7b).',
    },
  ],
  prerequisites: ['m8math.equations-with-variables-on-both-sides'],
  followUps: ['m8math.equations-with-rational-coefficients'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a bracketed, many-term equation in front of the student, so the collect move from last lesson visibly cannot start until each side is expanded and tidied.',
      script:
        'Two groups of friends hit the trampoline park on the same Saturday. Tickets cost the same for everyone; call the price x. Devon has a coupon that takes $4 off a ticket, but it only works on 3 tickets, and the other 2 people in the group pay full price. Sam has 2 people in the group, each adds the $5 grip socks, and the desk knocks $1 off the total. Both groups end up paying exactly the same amount. Devon pays 3(x - 4) + 2x, Sam pays 2(x + 5) - 1, and the question is what x makes those equal: 3(x - 4) + 2x = 2(x + 5) - 1. Last lesson you learned to collect the variable terms on one side, but look at this one: some of the x is locked inside parentheses, and each side has more than two terms. You cannot collect what you cannot see. The fix is two moves you already own, distributing and combining like terms, done in the right order before the collecting starts.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-expand-tidy-then-collect',
      kind: 'concept',
      goal: 'Install the distribute, combine, collect, finish, check order, and pin the two traps: a negative multiplier that flips only one sign, and combining a term with a factor that has not been distributed.',
      keyIdeas: [
        'THE BRACKETS HAVE TO GO FIRST — in 3(x - 4) + 2x = 2(x + 5) - 1, part of the x is locked inside parentheses, and you cannot collect a term you cannot see. Distribute every bracket before anything else: 3(x - 4) = 3x - 12 and 2(x + 5) = 2x + 10. The factor multiplies EVERY term inside, so 3(x - 4) is 3x - 12, never 3x - 4.',
        'A NEGATIVE MULTIPLIER FLIPS EVERY SIGN — this is the same rule you already use for expanding expressions, and it is where most of the mistakes in this lesson live. In -2(x - 3), the multiplier is -2, minus included. -2 times x is -2x, and -2 times -3 is +6, because a negative times a negative is positive. So -2(x - 3) = -2x + 6, not -2x - 6. Decide each sign on its own.',
        'TIDY EACH SIDE ON ITS OWN — after distributing, the equation reads 3x - 12 + 2x = 2x + 10 - 1. Combine like terms on the left to get 5x - 12, and separately on the right to get 2x + 9. While you are tidying, the equals sign is a wall: a term only combines with terms on its own side.',
        'THEN IT IS LAST LESSON\'S EQUATION — 5x - 12 = 2x + 9 has the variable on both sides with nothing hidden, which is exactly the kind you solved last time. Subtract 2x from both sides to get 3x - 12 = 9, add 12 to get 3x = 21, divide by 3 to get x = 7. Nothing new happens after the tidying; the new part is getting there.',
        'NEVER COMBINE ACROSS A BRACKET — in 6x - 2(x - 4), the -2 belongs to the bracket, so 6x - 2 is not a pair of like terms and cannot become 4. Distribute first, 6x - 2x + 8, and only then combine to get 4x + 8. The order of moves is fixed: distribute, combine, collect, finish.',
        'CHECK IN THE ORIGINAL, BRACKETS AND ALL — put the answer back into the equation exactly as it was written and work out each side. For x = 7: left is 3(7 - 4) + 2(7) = 3(3) + 14 = 23, right is 2(7 + 5) - 1 = 2(12) - 1 = 23. Both sides land on 23. If they do not match, the first place to look is the sign on a negative multiplier.',
      ],
      vocabulary: [
        { term: 'distribute', definition: 'multiply the factor outside a bracket by every term inside it: 3(x - 4) becomes 3x - 12.' },
        { term: 'like terms', definition: 'terms whose variable part matches exactly, such as 3x and 2x, or two plain numbers; only like terms can be combined into one.' },
        { term: 'expanded form', definition: 'an equation with every bracket multiplied out, so that each side is a list of terms with no parentheses left.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trampoline-tickets',
      kind: 'worked_example',
      problem: 'Devon pays for 3 tickets with a $4-off coupon on each plus 2 full-price tickets. Sam pays for 2 tickets with $5 grip socks on each and gets $1 off the total. Both groups pay the same. Solve 3(x - 4) + 2x = 2(x + 5) - 1 to find the ticket price x.',
      steps: [
        'Distribute every bracket. On the left, 3(x - 4) = 3x - 12. On the right, 2(x + 5) = 2x + 10. The equation now reads 3x - 12 + 2x = 2x + 10 - 1, with no parentheses left.',
        'Combine like terms on each side separately. Left: 3x + 2x = 5x, so the left side is 5x - 12. Right: 10 - 1 = 9, so the right side is 2x + 9. The equation is 5x - 12 = 2x + 9.',
        'Now the variable is on both sides with nothing hidden, so collect it the way you did last lesson. Subtract the smaller variable term, 2x, from BOTH sides: 5x - 2x - 12 = 9, which is 3x - 12 = 9.',
        'Finish the two-step equation. Add 12 to both sides: 3x = 21. Divide both sides by 3: x = 7.',
        'Check in the ORIGINAL equation, brackets and all. Left: 3(7 - 4) + 2(7) = 3(3) + 14 = 9 + 14 = 23. Right: 2(7 + 5) - 1 = 2(12) - 1 = 24 - 1 = 23. Both sides give 23, so x = 7 holds.',
        'Read it back into the story: a ticket costs $7. Devon pays 3 × $3 + 2 × $7 = $9 + $14 = $23, and Sam pays 2 × $12 - $1 = $24 - $1 = $23. Same bill, which is what the equation said.',
      ],
      answer: 'x = 7 (a ticket costs $7 and each group pays $23)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-multiplier',
      kind: 'worked_example',
      problem: 'Solve: 5x - 2(x - 3) = 4(x + 1) + 8',
      steps: [
        'Distribute every bracket, and read the multiplier on the left bracket carefully: it is -2, minus included. -2 times x is -2x, and -2 times -3 is +6, because a negative times a negative is positive. So -2(x - 3) = -2x + 6. On the right, 4(x + 1) = 4x + 4. The equation reads 5x - 2x + 6 = 4x + 4 + 8.',
        'WRONG: writing -2(x - 3) as -2x - 6, keeping the minus on the 3, which leads to 3x - 6 = 4x + 12 and x = -18. CORRECT: the -2 multiplies the -3 as well, and a negative times a negative is positive, so the term is +6. The check exposes the slip: for x = -18, the left is 5(-18) - 2(-18 - 3) = -90 - 2(-21) = -90 + 42 = -48, and the right is 4(-18 + 1) + 8 = 4(-17) + 8 = -68 + 8 = -60. They do not match.',
        'Combine like terms on each side separately. Left: 5x - 2x = 3x, so the left side is 3x + 6. Right: 4 + 8 = 12, so the right side is 4x + 12. The equation is 3x + 6 = 4x + 12.',
        'Collect the variable terms. Subtract the smaller variable term, 3x, from BOTH sides: 6 = 4x - 3x + 12, which is 6 = x + 12.',
        'Finish: subtract 12 from both sides, 6 - 12 = x, so x = -6.',
        'Check in the ORIGINAL, brackets and all. Left: 5(-6) - 2(-6 - 3) = -30 - 2(-9) = -30 + 18 = -12. Right: 4(-6 + 1) + 8 = 4(-5) + 8 = -20 + 8 = -12. Both sides give -12, so x = -6 is the solution.',
      ],
      answer: 'x = -6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-one-bracket',
      kind: 'try_yourself',
      problem: 'Solve for x: 2(x + 3) + 4x = 30',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 4.5' },
        { id: 'b', text: 'x = 6' },
        { id: 'c', text: 'x = 4', correct: true },
        { id: 'd', text: 'x = 5' },
      ],
      expectedAnswer: 'x = 4',
      hints: [
        'Distribute the 2 to BOTH terms inside the bracket: 2(x + 3) is 2x + 6, not 2x + 3. Then combine the 2x with the 4x.',
        'That leaves 6x + 6 = 30, a two-step equation: subtract 6 from both sides first, then divide by 6. Check your answer in the original equation with the bracket still in.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-expand-both-sides',
      kind: 'try_yourself',
      problem: 'A student is solving 7x - 3(x - 2) = 2(x + 4). Which equation shows both sides correctly expanded, before any like terms are combined?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7x - 3x + 6 = 2x + 8', correct: true },
        { id: 'b', text: '7x - 3x - 6 = 2x + 8' },
        { id: 'c', text: '7x - 3x + 6 = 2x + 4' },
        { id: 'd', text: '7x + 3x - 6 = 2x + 8' },
      ],
      expectedAnswer: '7x - 3x + 6 = 2x + 8',
      hints: [
        'The multiplier on the left bracket is -3, minus included, and it multiplies BOTH the x and the -2. A negative times a negative is positive.',
        'On the right, the 2 multiplies both the x and the 4. Check the four products one at a time: -3 times x, -3 times -2, 2 times x, 2 times 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-negative-multiplier',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 2(x + 5) + 3x = -3(x - 2) + 4x',
      responseFormat: 'numeric',
      expectedAnswer: '-1',
      hints: [
        'Distribute both brackets first: 2(x + 5) is 2x + 10, and -3(x - 2) is -3x + 6, because the -3 multiplies the -2 as well. Then combine like terms on each side separately.',
        'After tidying, the left side is 5x + 10 and the right side is x + 6. Subtract x from both sides, subtract 10 from both sides, then divide by 4. Expect a negative answer, and check it in both sides of the original.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-flip-and-combine-across-bracket',
      kind: 'misconception_check',
      question: 'Aiden and Zoe both solve 6x - 2(x - 4) = 3(x - 1) + 7. Aiden gets x = 12 and Zoe gets x = 20. Substitute each answer into both sides of the original equation. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 12',
          misconception: 'Distributing -2 over (x - 4) as -2x - 8, so only the x picks up the minus and the -4 keeps its sign, which gives 4x - 8 = 3x + 4 and x = 12.',
          correctsTo:
            'The -2 multiplies the -4 as well, and a negative times a negative is positive: -2(x - 4) = -2x + 8. The equation then tidies to 4x + 8 = 3x + 4, so subtracting 3x gives x + 8 = 4 and x = -4. The check tells the story: for x = 12, the left is 6(12) - 2(12 - 4) = 72 - 16 = 56 and the right is 3(12 - 1) + 7 = 33 + 7 = 40, which do not match. For x = -4, the left is 6(-4) - 2(-4 - 4) = -24 + 16 = -8 and the right is 3(-4 - 1) + 7 = -15 + 7 = -8.',
        },
        {
          answer: 'x = 20',
          misconception: 'Combining the 6x with the -2 before the -2 has been distributed, as if 6x - 2 were a pair of like terms, so the left side becomes 4(x - 4) and the equation turns into 4x - 16 = 3x + 4 and x = 20.',
          correctsTo:
            'The -2 is the multiplier of the bracket, not a term that can be combined with 6x. Distribute first: 6x - 2x + 8. Only then combine like terms to get 4x + 8. The right side is 3x - 3 + 7 = 3x + 4, so the equation is 4x + 8 = 3x + 4 and x = -4. The check exposes x = 20: the left is 6(20) - 2(20 - 4) = 120 - 32 = 88 and the right is 3(20 - 1) + 7 = 57 + 7 = 64, nowhere near equal.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'When the variable is locked inside parentheses, distribute every bracket before anything else. The factor multiplies EVERY term inside.',
        'A negative multiplier flips every sign inside the bracket: -2(x - 3) = -2x + 6, never -2x - 6.',
        'Combine like terms on each side separately. While you tidy, the equals sign is a wall.',
        'Never combine a term with a factor that has not been distributed yet: in 6x - 2(x - 4), the -2 belongs to the bracket.',
        'After tidying, the equation has the variable on both sides with nothing hidden: collect the variable terms, then finish as a two-step equation.',
        'Check by substituting into BOTH sides of the original equation, brackets and all. Both sides must land on the same number.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Equations with Distribution & Like Terms' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
