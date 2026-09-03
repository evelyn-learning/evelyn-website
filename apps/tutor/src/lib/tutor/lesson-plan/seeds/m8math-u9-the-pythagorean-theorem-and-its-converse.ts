/**
 * Grade 8 Math — Angles & the Pythagorean Theorem: The Pythagorean Theorem &
 * Its Converse.
 *
 * CONCEPT-LED row 9.3. This is the first time the student meets the theorem,
 * so the lesson builds one mental model before it computes anything: a
 * right angle leaves a fingerprint in the side lengths, and the fingerprint
 * is about AREAS of squares, not about the lengths themselves (CCSS 8.G.B.6,
 * 8.G.B.7). The concept segment names the parts (legs, hypotenuse), states
 * a² + b² = c², and then explains WHY it is true with the area-rearrangement
 * argument — four copies of one right triangle inside a square of side
 * a + b, packed two ways, leave the same uncovered area, once as a single
 * tilted square c² and once as two squares a² and b². Only then does the
 * lesson use the theorem in both directions: forward, to find a missing
 * hypotenuse (add the squares) or a missing leg (subtract the squares),
 * taking an exact root when the sum is a perfect square and trapping and
 * estimating the root to one decimal place when it is not; and backward,
 * the converse, which tests whether three given lengths make a right
 * triangle at all. Two traps this plan is built to kill: adding the squares
 * when the missing side is a leg (the leg comes out LONGER than the
 * hypotenuse, which cannot happen), and running the converse with the wrong
 * side as c (c is always the longest of the three).
 *
 * SCOPE GUARD: State a² + b² = c², explain an area-rearrangement proof,
 * find a hypotenuse or a leg in a right triangle (perfect squares, then √
 * estimates from row 1.4), and use the converse to decide whether three
 * given lengths make a right triangle. Withholds: the similar-triangles
 * proof and acute/obtuse classification → `geom-u7-pythagorean-theorem.ts`;
 * special right triangles and trig ratios →
 * `geom-u7-special-right-triangles.ts`, `geom-u7-trig-ratios.ts`;
 * `alg1-u9-radical-equations.ts` re-applies 8.G.B.7 as HS review.
 * Concretely: the only proof in this plan is the area rearrangement, and it
 * is argued in words and with the numbers 3, 4, 5 — the plan never expands
 * (a + b)² algebraically and never mentions the altitude to the hypotenuse
 * or similar triangles; the converse in this plan has exactly two outcomes,
 * "a right triangle" or "not a right triangle" — the plan never says acute
 * or obtuse and never compares a² + b² with c² by "less than" or "greater
 * than" to classify; a root that is not a perfect square (√65) is trapped
 * between consecutive whole numbers and estimated to one decimal place the
 * way row 1.4 taught, and is never rewritten in a shorter radical form
 * (`alg1-u9-simplifying-radicals.ts`); no special right triangle is named
 * and no ratio of sides is given a name. Sideways: every worked example and
 * try_yourself in this plan is either a right triangle handed to the student
 * by its side lengths or the proof figure itself (four triangles in a
 * square) — the hook uses a stage-crew frame only to motivate, and no
 * problem asks the student to find a right triangle hidden inside a ladder,
 * a screen, a box, or a pair of coordinate-plane points, because that is row
 * 9.4 (`pythagorean-applications-and-distance-between-points`); the plan
 * never uses the triangle angle sum or any angle measure other than the
 * right angle itself (row 9.2). Below, assumed and not re-taught: square
 * roots of perfect squares (row 1.3) and trapping a root between perfect
 * squares and refining to one decimal place (row 1.4), each recalled in a
 * sentence; the area of a square and of a right triangle, and the triangle
 * inequality (`m7math-u7-triangle-side-and-angle-conditions.ts`), which is
 * used only as a one-line sense check on an estimated hypotenuse and, inside
 * a distractor, as the test a student confuses with the converse — never
 * taught or assessed. Every GIVEN side length in this plan is a positive
 * whole number, every exact answer is a whole number, and every estimated
 * side is stated to one decimal place.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U9_THE_PYTHAGOREAN_THEOREM_AND_ITS_CONVERSE: LessonPlan = {
  id: 'evelyn.ms.m8math.the-pythagorean-theorem-and-its-converse.v1',
  title: 'The Pythagorean Theorem & Its Converse',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.the-pythagorean-theorem-and-its-converse',
      standard: 'M8MATH-9.3',
      description:
        'State a² + b² = c², explain an area-rearrangement proof, find a hypotenuse or a leg in a right triangle (perfect squares, then √ estimates), and use the converse to decide whether three given lengths make a right triangle (CCSS 8.G.B.6, 8.G.B.7).',
    },
  ],
  prerequisites: ['m8math.triangle-angle-sum-exterior-angles-and-aa-similarity'],
  followUps: ['m8math.pythagorean-applications-and-distance-between-points'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a right angle leaves a fingerprint in the side lengths, and that the fingerprint is about squares, not sums, before the theorem is named.',
      script:
        'The stage crew for the school play is building a wooden frame for a set wall, and the frame has to be a true rectangle or the painted wall will lean. The crew leader does not reach for a protractor. She measures 6 feet along the bottom board and 8 feet up the side board, and then measures the diagonal between those two marks. If the diagonal is exactly 10 feet, the corner is a perfect right angle, and she moves on. Why 10? It is not 6 + 8, because that is 14. But look at the squares: 6 × 6 = 36, 8 × 8 = 64, and 36 + 64 = 100, which is 10 × 10. The two smaller squares add up to the big one, exactly. That is not luck. Every right triangle in the world does this, and today you learn why, how to use it to find a missing side, and how to run it backward the way the crew leader did.',
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-squares-on-the-sides',
      kind: 'concept',
      goal: 'Name the parts of a right triangle, state a² + b² = c², explain why it is true by rearranging four triangles inside one square, and set up the forward and backward uses.',
      keyIdeas: [
        'LEGS AND HYPOTENUSE — a right triangle has one right angle. The two sides that form the right angle are the LEGS, and the side across from the right angle is the HYPOTENUSE. The hypotenuse is always the longest side, because it faces the biggest angle. We call the legs a and b and the hypotenuse c, and it never matters which leg is a and which is b.',
        'THE THEOREM IS ABOUT SQUARES — build a square on each side of the triangle. The square on one leg has area a², the square on the other leg has area b², and the square on the hypotenuse has area c². The Pythagorean theorem says the two leg squares together cover exactly the same area as the hypotenuse square: a² + b² = c². For legs 3 and 4 the hypotenuse is 5, because 9 + 16 = 25. The lengths themselves do not add, since 3 + 4 is 7, not 5; only the squares add.',
        'WHY IT IS TRUE — take four copies of a right triangle with legs 3 and 4 and put them inside a square that is 3 + 4 = 7 on each side, one triangle in each corner with its legs along the edges. The four hypotenuses form a tilted square in the middle, and its area is c². Now slide the same four triangles into a different arrangement inside the same 7-by-7 square, pairing them into two rectangles, and the uncovered space becomes two smaller squares, one 3 by 3 and one 4 by 4. Same big square, same four triangles, so the uncovered area must be the same both times: c² = 3² + 4² = 25. With numbers: the big square is 49, each triangle is (3 × 4) ÷ 2 = 6, four of them cover 24, and 49 - 24 = 25, which is 9 + 16. The argument never used the numbers 3 and 4 in any special way, so it works for every right triangle, and that is why a² + b² = c² always.',
        'FINDING THE HYPOTENUSE — square both legs, add, and take the square root. If the sum is a perfect square the root is exact, the way you found roots of perfect squares before. If it is not, do what you already do with any root: trap it between two consecutive perfect squares, then square candidates to one decimal place. Legs 4 and 7 give 16 + 49 = 65, and 65 sits between 64 and 81, so the hypotenuse is between 8 and 9, and it is about 8.1.',
        'FINDING A LEG — the hypotenuse square is the BIGGEST, so a leg square is what is left when the other leg square is taken away: a² = c² - b². Subtract, then take the root. Hypotenuse 13 and leg 5 give 169 - 25 = 144, so the other leg is 12. A quick sense check catches the most common slip: a leg must come out shorter than the hypotenuse, so if your leg is longer, you added when you should have subtracted.',
        'THE CONVERSE RUNS IT BACKWARD — the theorem says a right angle forces a² + b² = c². The converse says the reverse is also true: if three lengths satisfy a² + b² = c², with c the LONGEST of the three, then the triangle with those sides has a right angle across from c. If the two smaller squares do not add up to the largest square, the triangle is not a right triangle. Always square the longest side by itself on one side of the check, and the two shorter sides together on the other.',
      ],
      vocabulary: [
        { term: 'right triangle', definition: 'a triangle with one right angle, that is, one 90° angle.' },
        { term: 'hypotenuse', definition: 'the side of a right triangle across from the right angle; always the longest side, written c.' },
        { term: 'leg', definition: 'either of the two sides of a right triangle that meet at the right angle, written a and b.' },
        { term: 'Pythagorean theorem', definition: 'in any right triangle with legs a and b and hypotenuse c, a² + b² = c².' },
        { term: 'converse', definition: 'the statement run backward: if a² + b² = c² for the three sides of a triangle, with c the longest side, then the triangle is a right triangle.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-hypotenuse-then-leg',
      kind: 'worked_example',
      problem:
        'Two right triangles. (a) The legs are 9 cm and 12 cm. Find the hypotenuse. (b) The hypotenuse is 13 cm and one leg is 5 cm. Find the other leg.',
      steps: [
        '(a) Name the parts. The legs are 9 and 12, so a = 9 and b = 12, and the hypotenuse c is missing. The hypotenuse square is the sum of the leg squares: c² = 9² + 12² = 81 + 144 = 225.',
        'Take the square root. 225 is a perfect square, 15 × 15 = 225, so c = 15. The hypotenuse is 15 cm.',
        'Sense check: 15 is longer than both legs, 9 and 12, as a hypotenuse must be. Check with the theorem: 81 + 144 = 225 and 15² = 225, so the three sides fit.',
        '(b) Name the parts. Here the hypotenuse is known, c = 13, one leg is b = 5, and the missing side is a LEG. The leg square is what is left of the hypotenuse square after the other leg square is removed: a² = 13² - 5² = 169 - 25 = 144.',
        'WRONG: adding, 169 + 25 = 194, and estimating √194 as about 13.9. A 13.9 cm leg would be LONGER than the 13 cm hypotenuse, which is impossible, because the hypotenuse is always the longest side. CORRECT: the missing side is a leg, so subtract. 169 - 25 = 144.',
        'Take the square root. 144 is a perfect square, 12 × 12 = 144, so a = 12. The other leg is 12 cm.',
        'Check by putting all three sides back into the theorem: 5² + 12² = 25 + 144 = 169, and 13² = 169. The two leg squares add up to the hypotenuse square, so 12 cm is right.',
      ],
      answer: '(a) 15 cm, (b) 12 cm',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-estimate-then-converse',
      kind: 'worked_example',
      problem:
        '(a) A right triangle has legs 4 in and 7 in. Estimate the hypotenuse to one decimal place. (b) Do the lengths 20, 21 and 29 make a right triangle? Do the lengths 5, 6 and 8?',
      steps: [
        '(a) Both legs are known, so add the squares: c² = 4² + 7² = 16 + 49 = 65. Then c = √65.',
        '65 is not a perfect square, so trap it: 64 < 65 < 81, and those are 8² and 9², so the hypotenuse is between 8 and 9, and much closer to 8. Refine to one decimal place by squaring candidates: 8.0² = 64 and 8.1² = 65.61. The gap from 64 up to 65 is 1, and the gap from 65 up to 65.61 is only 0.61, so 8.1 is the closer estimate. The hypotenuse is about 8.1 in.',
        'Sense check: 8.1 is longer than both legs, 4 and 7, and it is shorter than 4 + 7 = 11, so it can be the third side. We leave the answer as 8.1; √65 does not come out exact, and an estimate to one decimal place is the form we use.',
        '(b) A converse question hands you three lengths and asks about the angle. First pick c: it must be the LONGEST length, so c = 29 and the legs would be 20 and 21. Square the two shorter sides and add: 20² + 21² = 400 + 441 = 841. Square the longest side by itself: 29² = 841.',
        'The two sides of the check are equal, 841 = 841, so by the converse the triangle with sides 20, 21 and 29 is a right triangle, with the right angle across from the 29.',
        'Now 5, 6 and 8. The longest is 8, so c = 8. Two shorter sides: 5² + 6² = 25 + 36 = 61. Longest side: 8² = 64. Since 61 is not 64, the squares do not fit the theorem, so this is NOT a right triangle. Close does not count; the converse needs the two sides of the check to be exactly equal.',
      ],
      answer: '(a) about 8.1 in, (b) 20-21-29 is a right triangle; 5-6-8 is not',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-set-is-right',
      kind: 'try_yourself',
      problem: 'Which set of three lengths makes a right triangle?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8, 15, 17', correct: true },
        { id: 'b', text: '7, 9, 12' },
        { id: 'c', text: '5, 12, 17' },
        { id: 'd', text: '6, 7, 9' },
      ],
      expectedAnswer: '8, 15, 17',
      hints: [
        'Use the converse. In each set, the longest length is c. Square the two shorter lengths and add them, then square the longest length by itself, and see whether the two results are exactly equal.',
        'Adding the two shorter lengths is not the test, and being able to form some triangle is not the test either. Only one set has the two smaller squares adding up to the largest square exactly; a near miss like 85 against 81 is a miss.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tilted-square-area',
      kind: 'try_yourself',
      problem:
        'Four copies of a right triangle with legs 3 units and 4 units are placed inside a square that is 7 units on each side, one in each corner, so that the space left uncovered is a tilted square in the middle. What is the area of that tilted square?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '43 square units' },
        { id: 'b', text: '1 square unit' },
        { id: 'c', text: '25 square units', correct: true },
        { id: 'd', text: '5 square units' },
      ],
      expectedAnswer: '25 square units',
      hints: [
        'The tilted square is whatever the four triangles do not cover. Start with the area of the whole 7-by-7 square, then take away the area of ALL four triangles, remembering that a right triangle covers half of the rectangle its legs make.',
        'Each triangle has area (3 × 4) ÷ 2 = 6, so the four together cover 24. The question asks for an AREA, not a side length; the side of the tilted square is the hypotenuse, and its area is that side squared.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-missing-leg',
      kind: 'try_yourself',
      problem:
        'A right triangle has a hypotenuse of 25 cm and one leg of 24 cm. How long is the other leg, in centimeters? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'The missing side is a leg, not the hypotenuse, so its square is the hypotenuse square with the other leg square taken away. Subtract, do not add.',
        '25² - 24² = 625 - 576. Take the square root of that difference, and check that your leg is shorter than 25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-for-a-leg-and-wrong-c',
      kind: 'misconception_check',
      question:
        'Two students, two slips. Dev is given a right triangle with hypotenuse 10 and one leg 6, and says the other leg is about 11.7. Lena is asked whether 7, 24 and 25 make a right triangle, checks 7² + 25² against 24², and says no. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The other leg is about 11.7.',
          misconception: 'Adding the squares, 100 + 36 = 136, and estimating √136, when the missing side is a leg and the leg square must be SUBTRACTED from the hypotenuse square.',
          correctsTo:
            'The hypotenuse square is the biggest of the three, so a leg square is what is left after the other leg square is removed: 10² - 6² = 100 - 36 = 64, and √64 = 8. The other leg is 8. The sense check would have caught the slip on its own: an 11.7 leg is longer than the 10 hypotenuse, and the hypotenuse is always the longest side. Confirm: 6² + 8² = 36 + 64 = 100 = 10².',
        },
        {
          answer: '7, 24 and 25 do not make a right triangle, because 7² + 25² is 674 and 24² is 576.',
          misconception: 'Running the converse with the wrong side as c; the longest side, 25, must be the one squared by itself, and the two shorter sides are the ones added.',
          correctsTo:
            'In the converse, c is always the longest of the three lengths, because the hypotenuse is always the longest side of a right triangle. Here c = 25, and the two shorter sides are 7 and 24. Check: 7² + 24² = 49 + 576 = 625, and 25² = 625. The two results are exactly equal, so 7, 24 and 25 DO make a right triangle, with the right angle across from the 25.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'In a right triangle the two sides at the right angle are the legs, a and b, and the side across from the right angle is the hypotenuse, c, always the longest side.',
        'The Pythagorean theorem: a² + b² = c². The squares on the two legs add up to the square on the hypotenuse; the lengths themselves do not add.',
        'Why it is true: four copies of the triangle inside a square of side a + b leave the same uncovered area whether that space is one tilted square c² or two squares a² and b².',
        'Missing hypotenuse: add the two leg squares and take the root. Missing leg: subtract the known leg square from the hypotenuse square and take the root. A leg must come out shorter than the hypotenuse.',
        'When the root is not a perfect square, trap it between two consecutive perfect squares and estimate to one decimal place; √65 is about 8.1.',
        'The converse: with c the longest of three lengths, a² + b² = c² exactly means the triangle is a right triangle, and anything else means it is not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'The Pythagorean Theorem & Its Converse' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
