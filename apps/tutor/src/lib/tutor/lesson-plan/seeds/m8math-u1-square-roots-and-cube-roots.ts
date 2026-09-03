/**
 * Grade 8 Math — Real Numbers: Square Roots & Cube Roots.
 *
 * PROCEDURE-LED. The student already squares and cubes whole numbers; what
 * is new is running those operations BACKWARD (CCSS 8.EE.A.2). The concept
 * segment is an ordered recipe: read the sign (bare √ is a square root, the
 * little 3 makes it a cube root), climb the perfect-square ladder to 225 or
 * the perfect-cube ladder to 1000 until the number under the sign appears,
 * and check by squaring or cubing the answer back. Then the two equation
 * forms: x² = p keeps BOTH signs, because (-7)² = 49 as surely as 7² does,
 * while x³ = p keeps one, because three negatives multiplied together stay
 * negative. Both worked examples end with a work-backward check. Three traps
 * this plan is built to kill: halving instead of rooting (√100 = 50), dropping
 * the negative solution of x² = p, and carrying the ± over to the cube case.
 * Salvaged from `g8-math-square-roots-irrationals.ts`: the inverse-of-squaring
 * framing and the perfect-square ladder only; its estimation material is row
 * 1.4's and its rational/irrational material is row 1.2's, and neither was
 * carried.
 *
 * SCOPE GUARD: Grade 8 row 1.3 evaluates square roots of perfect squares to
 * 225 and cube roots of perfect cubes to 1000; solves x² = p and x³ = p for
 * those p, keeping both signs for the square case and the single real cube
 * root; knows √2 is irrational (from 1.2). Assumes (-3)² vs -3² from
 * `m7math-u2-multiplying-dividing-rational-numbers.ts` and whole-number
 * exponents from `m6math` row 7.1. Withholds: x² = k for non-perfect k and
 * (x - h)² = k → `alg1-u8-solving-by-factoring-square-roots.ts`; simplifying
 * radicals → `alg1-u9-simplifying-radicals.ts`. Concretely: every number
 * under a √ that this plan evaluates is a perfect square no larger than 225,
 * every number under a ∛ that it evaluates is a perfect cube no larger than
 * 1000, and every equation it solves has a perfect-square or perfect-cube p;
 * no radical is ever rewritten (√50 never becomes 5√2), and no root is ever
 * estimated to a decimal place or trapped between two decimals (that is row
 * 1.4). √2 appears only to be named irrational, as a one-sentence recall of
 * row 1.2 — the plan states that no whole number squares to 2 and that the
 * decimal never ends or repeats, and it never solves x² = 2. Sideways: the
 * rational/irrational classification is row 1.2 and is recalled, not
 * re-taught; the (-3)² vs -3² distinction is recalled only as the reason
 * (-7)² = 49, never re-taught as its own idea. The cube case stays with
 * positive p: a negative cube such as (-4)³ = -64 is computed only to show
 * why x³ = 64 has one solution, and no equation x³ = -p is ever solved.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U1_SQUARE_ROOTS_AND_CUBE_ROOTS: LessonPlan = {
  id: 'evelyn.ms.m8math.square-roots-and-cube-roots.v1',
  title: 'Square Roots & Cube Roots',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.square-roots-and-cube-roots',
      standard: 'M8MATH-1.3',
      description:
        'Evaluate square roots of perfect squares to 225 and cube roots of perfect cubes to 1000; solve x² = p and x³ = p for those p, keeping both signs for the square case and the single real cube root; know √2 is irrational (CCSS 8.EE.A.2).',
    },
  ],
  prerequisites: ['m8math.rational-and-irrational-numbers'],
  followUps: ['m8math.estimating-and-locating-irrational-numbers'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn squaring and cubing backward on two real objects, so the student feels the question a root answers before the symbols arrive.',
      script:
        'The drama club is painting a square backdrop for the school play, and the plan says it has to cover 144 square feet. A square has area side × side, so before anyone buys fabric they need the side length. Squaring is a move you already own: 12 × 12 = 144 takes a second. This question runs the other way: which number, squared, gives 144? That backward question has its own symbol, √, and here its answer is 12. Then the stage crew stacks 343 identical foam cubes into one big cube for a prop and wants to know how many cubes run along each edge. That is cubing run backward: which number, multiplied by itself three times, gives 343? Today you learn to answer both questions fast, and to dodge the slip that catches almost everyone: when an equation like x² = 144 asks for x instead of a length, there are two answers, not one.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-roots-and-ladders',
      kind: 'concept',
      goal: 'Install the read-the-sign, climb-the-ladder, check-backward recipe for square and cube roots, then the two-signs-versus-one rule for x² = p and x³ = p.',
      keyIdeas: [
        'THE SQUARE ROOT UNDOES SQUARING — √p asks "which number, squared, gives p?" √144 = 12 because 12² = 144, and √25 = 5 because 5² = 25. The numbers whose square roots come out whole are the PERFECT SQUARES, and the ladder up to 225 is worth knowing cold: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, which are 1² through 15².',
        'THE CUBE ROOT UNDOES CUBING — ∛p asks "which number, cubed, gives p?" ∛125 = 5 because 5 × 5 × 5 = 125. The numbers whose cube roots come out whole are the PERFECT CUBES, and the ladder up to 1000 is short: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, which are 1³ through 10³. The little 3 on the sign tells you it is a cube root; a bare √ is always a square root.',
        'CHECK BY WORKING BACKWARD — a root is right only if it climbs back to p. To check √169 = 13, compute 13 × 13 = 169. To check ∛216 = 6, compute 6 × 6 = 36 and then 36 × 6 = 216. Halving is not rooting: √100 is 10, not 50, and the check 50 × 50 = 2500 exposes that slip instantly.',
        'x² = p HAS TWO SOLUTIONS — x² = 49 asks for EVERY number whose square is 49. 7² = 49, and (-7)² = 49 as well, because the parentheses make the minus part of the base and a negative times a negative is positive. So x = 7 or x = -7, written x = ±7, and in symbols x² = p is solved by x = ±√p. The bare symbol √49 means only the positive 7; the ± is added when you SOLVE an equation, and dropped again when the answer is a length that cannot be negative.',
        'x³ = p HAS ONE SOLUTION — x³ = 64 asks for every number whose cube is 64. 4³ = 64 works, but (-4)³ = (-4)(-4)(-4) = 16 × (-4) = -64, which is not 64. Three negatives multiplied together stay negative, so no negative number cubes to a positive p. x³ = p is solved by x = ∛p alone, with no ±.',
        '√2 IS IRRATIONAL — 2 is not on the perfect-square ladder, because 1² = 1 and 2² = 4 and no whole number squares to 2. So √2 is not a whole number, and from the last lesson it is not a fraction either: its decimal never ends and never repeats, which is exactly what irrational means. Write it as √2 and leave it exact.',
      ],
      vocabulary: [
        { term: 'square root', definition: 'the positive number that, when squared, gives the number under the √ sign; √81 = 9.' },
        { term: 'cube root', definition: 'the number that, when cubed, gives the number under the ∛ sign; ∛27 = 3.' },
        { term: 'perfect square', definition: 'a whole number that is some whole number squared, so its square root is whole; 1, 4, 9, 16, ..., 225.' },
        { term: 'perfect cube', definition: 'a whole number that is some whole number cubed, so its cube root is whole; 1, 8, 27, 64, ..., 1000.' },
        { term: 'radical sign', definition: 'the √ symbol; a small 3 in its crook, ∛, turns it into a cube root.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-evaluate-roots',
      kind: 'worked_example',
      problem: 'Evaluate √196 and ∛343.',
      steps: [
        'Read the signs first. √196 is a square root, so it asks which number, squared, gives 196. ∛343 has the little 3, so it asks which number, cubed, gives 343.',
        'Climb the perfect-square ladder toward 196: 12² = 144, 13² = 169, 14² = 196. It lands exactly at 14, so √196 = 14.',
        'Check by squaring: 14 × 14 = 196. That is the number under the sign, so 14 is right.',
        'WRONG: √196 = 98, because 196 ÷ 2 = 98. CORRECT: √196 = 14. A square root undoes squaring, not doubling, and the check catches the slip: 98 × 98 = 9604, nowhere near 196.',
        'Climb the perfect-cube ladder toward 343: 5³ = 125, 6³ = 216, 7³ = 343. It lands exactly at 7, so ∛343 = 7.',
        'Check by cubing: 7 × 7 = 49, then 49 × 7 = 343. That is the number under the sign, so 7 is right.',
        'Notice that each answer is a single positive number. A bare root symbol always names the positive root; the second sign only shows up when an equation asks for x, which is the next example.',
      ],
      answer: '√196 = 14 and ∛343 = 7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-solve-square-and-cube',
      kind: 'worked_example',
      problem: 'Solve each equation. (a) x² = 121 (b) x³ = 512',
      steps: [
        '(a) x² = 121 asks for EVERY number whose square is 121. On the ladder, 11² = 121, so x = 11 works.',
        'Now test the negative. (-11)² = (-11)(-11) = 121, because the parentheses make the minus part of the base and a negative times a negative is positive. So x = -11 works too. The equation has two solutions: x = 11 or x = -11, written x = ±11.',
        'WRONG: x = 11 only. CORRECT: x = 11 or x = -11. Dropping the negative loses half the answer. Substitute x = -11 back in: (-11)² = 121, exactly what the equation demands, so -11 is a solution whether or not it looks like one.',
        'Check both by squaring: 11 × 11 = 121 and (-11) × (-11) = 121. Both land on 121.',
        '(b) x³ = 512 asks for every number whose cube is 512. On the cube ladder, 8³ = 512, since 8 × 8 = 64 and 64 × 8 = 512. So x = 8 works.',
        'Now test the negative the same way. (-8)³ = (-8)(-8)(-8): the first two give 64, and 64 × (-8) = -512. That is -512, not 512, so x = -8 does NOT work. Three negatives multiplied together stay negative, so a negative number can never cube to a positive one. x³ = 512 has exactly one solution, x = 8.',
        'WRONG: x = ±8, copying the ± from the square case. CORRECT: x = 8. The ± belongs to squaring, where the two negatives cancel; cubing multiplies three negatives, and they do not.',
      ],
      answer: '(a) x = 11 or x = -11 (b) x = 8',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-x-squared',
      kind: 'try_yourself',
      problem: 'Solve for x: x² = 81',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 9 or x = -9', correct: true },
        { id: 'b', text: 'x = 9' },
        { id: 'c', text: 'x = 40.5' },
        { id: 'd', text: 'x = 6561' },
      ],
      expectedAnswer: 'x = 9 or x = -9',
      hints: [
        'Ask which numbers, squared, give 81. Check any candidate by multiplying it by itself, not by doubling or halving.',
        '9² = 81, and (-9)² = 81 as well, because the parentheses make the minus part of the base. An equation of the form x² = p keeps both signs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-solve-x-cubed',
      kind: 'try_yourself',
      problem: 'Solve for x: x³ = 729',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 9 or x = -9' },
        { id: 'b', text: 'x = 243' },
        { id: 'c', text: 'x = 9', correct: true },
        { id: 'd', text: 'x = 27' },
      ],
      expectedAnswer: 'x = 9',
      hints: [
        'The little 3 means cube root, so climb the cube ladder: 7³ = 343, 8³ = 512, and then 9³. Check a candidate by multiplying it by itself three times, not two.',
        '9 × 9 = 81 and 81 × 9 = 729. Then test the negative: (-9)³ = -729, which is not 729, so the cube case keeps only one sign.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-square-banner',
      kind: 'try_yourself',
      problem: 'A square banner for the school play has an area of 169 square feet. How long is one side of the banner, in feet? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'The area of a square is side × side, so you need the number whose square is 169. Climb the ladder: 12² = 144, so try the next rung.',
        '13 × 13 = 169. The equation s² = 169 has two solutions, 13 and -13, but a length cannot be negative, so only the positive one answers the question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dropped-sign-and-wrong-root',
      kind: 'misconception_check',
      question: 'Dev solves x² = 100 and writes x = 10. Lena evaluates ∛64 and writes 8. Work each answer backward, by squaring or cubing it, and decide what went wrong in each case.',
      commonErrors: [
        {
          answer: 'x = 10',
          misconception: 'Forgetting that (-10)² = 100 as well, so the negative solution of x² = p is dropped.',
          correctsTo:
            'Both 10² = 100 and (-10)² = 100, because the parentheses make the minus part of the base and a negative times a negative is positive. The equation x² = 100 therefore has two solutions, x = 10 or x = -10, written x = ±10. The only time you keep just the 10 is when the question is about a length or another quantity that cannot be negative, and this equation has no such story attached.',
        },
        {
          answer: '∛64 = 8',
          misconception: 'Taking the square root instead of the cube root, because 8 × 8 = 64.',
          correctsTo:
            'The little 3 on the sign asks which number, multiplied by itself THREE times, gives 64. Working 8 backward: 8 × 8 × 8 = 512, far too big. Working 4 backward: 4 × 4 = 16 and 16 × 4 = 64, so ∛64 = 4. The check is always the same: cube the answer and it must land exactly on the number under the sign. And the cube case does not gain a second sign, because (-4)³ = -64, not 64.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The square root undoes squaring: √p is the positive number whose square is p, and the perfect squares up to 225 are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.',
        'The cube root undoes cubing: ∛p is the number whose cube is p, and the perfect cubes up to 1000 are 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.',
        'Check every root by working backward: square it or cube it, and it must land exactly on p. Halving is not rooting.',
        'The equation x² = p has TWO solutions, x = ±√p, because a negative squared is positive. The bare symbol √p names only the positive one, and a length keeps only the positive one.',
        'The equation x³ = p, with p positive, has ONE solution, x = ∛p, because a negative cubed stays negative.',
        '√2 is irrational: no whole number squares to 2, and its decimal never ends or repeats, so write it as √2 and leave it exact.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Square Roots & Cube Roots' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
