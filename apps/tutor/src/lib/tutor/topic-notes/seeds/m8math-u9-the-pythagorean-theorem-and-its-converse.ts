/**
 * Grade 8 Math — Unit 9 CED 9.3: The Pythagorean Theorem & Its Converse.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.the-pythagorean-theorem-and-its-converse.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U9_THE_PYTHAGOREAN_THEOREM_AND_ITS_CONVERSE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.the-pythagorean-theorem-and-its-converse.v1',
  course: 'Grade 8 Math',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'The Pythagorean Theorem & Its Converse',
  planId: 'evelyn.ms.m8math.the-pythagorean-theorem-and-its-converse.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.the-pythagorean-theorem-and-its-converse.v1' }],
  theory: [
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'framework', title: 'Legs and hypotenuse', content: `LEGS AND HYPOTENUSE — a right triangle has one right angle. The two sides that form the right angle are the LEGS, and the side across from the right angle is the HYPOTENUSE. The hypotenuse is always the longest side, because it faces the biggest angle. We call the legs a and b and the hypotenuse c, and it never matters which leg is a and which is b.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'framework', title: 'The theorem is about squares', content: `THE THEOREM IS ABOUT SQUARES — build a square on each side of the triangle. The square on one leg has area a², the square on the other leg has area b², and the square on the hypotenuse has area c². The Pythagorean theorem says the two leg squares together cover exactly the same area as the hypotenuse square: a² + b² = c². For legs 3 and 4 the hypotenuse is 5, because 9 + 16 = 25. The lengths themselves do not add, since 3 + 4 is 7, not 5; only the squares add.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'framework', title: 'Why it is true', content: `WHY IT IS TRUE — take four copies of a right triangle with legs 3 and 4 and put them inside a square that is 3 + 4 = 7 on each side, one triangle in each corner with its legs along the edges. The four hypotenuses form a tilted square in the middle, and its area is c². Now slide the same four triangles into a different arrangement inside the same 7-by-7 square, pairing them into two rectangles, and the uncovered space becomes two smaller squares, one 3 by 3 and one 4 by 4. Same big square, same four triangles, so the uncovered area must be the same both times: c² = 3² + 4² = 25. With numbers: the big square is 49, each triangle is (3 × 4) ÷ 2 = 6, four of them cover 24, and 49 - 24 = 25, which is 9 + 16. The argument never used the numbers 3 and 4 in any special way, so it works for every right triangle, and that is why a² + b² = c² always.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'framework', title: 'Finding the hypotenuse', content: `FINDING THE HYPOTENUSE — square both legs, add, and take the square root. If the sum is a perfect square the root is exact, the way you found roots of perfect squares before. If it is not, do what you already do with any root: trap it between two consecutive perfect squares, then square candidates to one decimal place. Legs 4 and 7 give 16 + 49 = 65, and 65 sits between 64 and 81, so the hypotenuse is between 8 and 9, and it is about 8.1.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'framework', title: 'Finding a leg', content: `FINDING A LEG — the hypotenuse square is the BIGGEST, so a leg square is what is left when the other leg square is taken away: a² = c² - b². Subtract, then take the root. Hypotenuse 13 and leg 5 give 169 - 25 = 144, so the other leg is 12. A quick sense check catches the most common slip: a leg must come out shorter than the hypotenuse, so if your leg is longer, you added when you should have subtracted.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'framework', title: 'The converse runs it backward', content: `THE CONVERSE RUNS IT BACKWARD — the theorem says a right angle forces a² + b² = c². The converse says the reverse is also true: if three lengths satisfy a² + b² = c², with c the LONGEST of the three, then the triangle with those sides has a right angle across from c. If the two smaller squares do not add up to the largest square, the triangle is not a right triangle. Always square the longest side by itself on one side of the check, and the two shorter sides together on the other.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'definition', title: 'right triangle', content: 'a triangle with one right angle, that is, one 90° angle.' },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'definition', title: 'hypotenuse', content: `the side of a right triangle across from the right angle; always the longest side, written c.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'definition', title: 'leg', content: `either of the two sides of a right triangle that meet at the right angle, written a and b.` },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'definition', title: 'Pythagorean theorem', content: 'in any right triangle with legs a and b and hypotenuse c, a² + b² = c².' },
    { loId: 'm8math.the-pythagorean-theorem-and-its-converse', kind: 'definition', title: 'converse', content: `the statement run backward: if a² + b² = c² for the three sides of a triangle, with c the longest side, then the triangle is a right triangle.` },
  ],
  methods: [
    {
      title: 'Worked hypotenuse then leg',
      steps: [
        `(a) Name the parts. The legs are 9 and 12, so a = 9 and b = 12, and the hypotenuse c is missing. The hypotenuse square is the sum of the leg squares: c² = 9² + 12² = 81 + 144 = 225.`,
        `Take the square root. 225 is a perfect square, 15 × 15 = 225, so c = 15. The hypotenuse is 15 cm.`,
        `Sense check: 15 is longer than both legs, 9 and 12, as a hypotenuse must be. Check with the theorem: 81 + 144 = 225 and 15² = 225, so the three sides fit.`,
        `(b) Name the parts. Here the hypotenuse is known, c = 13, one leg is b = 5, and the missing side is a LEG. The leg square is what is left of the hypotenuse square after the other leg square is removed: a² = 13² - 5² = 169 - 25 = 144.`,
        `WRONG: adding, 169 + 25 = 194, and estimating √194 as about 13.9. A 13.9 cm leg would be LONGER than the 13 cm hypotenuse, which is impossible, because the hypotenuse is always the longest side. CORRECT: the missing side is a leg, so subtract. 169 - 25 = 144.`,
        `Take the square root. 144 is a perfect square, 12 × 12 = 144, so a = 12. The other leg is 12 cm.`,
        `Check by putting all three sides back into the theorem: 5² + 12² = 25 + 144 = 169, and 13² = 169. The two leg squares add up to the hypotenuse square, so 12 cm is right.`,
      ],
      example: { problem: `Two right triangles. (a) The legs are 9 cm and 12 cm. Find the hypotenuse. (b) The hypotenuse is 13 cm and one leg is 5 cm. Find the other leg.`, solution: '(a) 15 cm, (b) 12 cm' },
      relatedLoIds: ['m8math.the-pythagorean-theorem-and-its-converse'],
    },
    {
      title: 'Worked estimate then converse',
      steps: [
        `(a) Both legs are known, so add the squares: c² = 4² + 7² = 16 + 49 = 65. Then c = √65.`,
        `65 is not a perfect square, so trap it: 64 < 65 < 81, and those are 8² and 9², so the hypotenuse is between 8 and 9, and much closer to 8. Refine to one decimal place by squaring candidates: 8.0² = 64 and 8.1² = 65.61. The gap from 64 up to 65 is 1, and the gap from 65 up to 65.61 is only 0.61, so 8.1 is the closer estimate. The hypotenuse is about 8.1 in.`,
        `Sense check: 8.1 is longer than both legs, 4 and 7, and it is shorter than 4 + 7 = 11, so it can be the third side. We leave the answer as 8.1; √65 does not come out exact, and an estimate to one decimal place is the form we use.`,
        `(b) A converse question hands you three lengths and asks about the angle. First pick c: it must be the LONGEST length, so c = 29 and the legs would be 20 and 21. Square the two shorter sides and add: 20² + 21² = 400 + 441 = 841. Square the longest side by itself: 29² = 841.`,
        `The two sides of the check are equal, 841 = 841, so by the converse the triangle with sides 20, 21 and 29 is a right triangle, with the right angle across from the 29.`,
        `Now 5, 6 and 8. The longest is 8, so c = 8. Two shorter sides: 5² + 6² = 25 + 36 = 61. Longest side: 8² = 64. Since 61 is not 64, the squares do not fit the theorem, so this is NOT a right triangle. Close does not count; the converse needs the two sides of the check to be exactly equal.`,
      ],
      example: { problem: `(a) A right triangle has legs 4 in and 7 in. Estimate the hypotenuse to one decimal place. (b) Do the lengths 20, 21 and 29 make a right triangle? Do the lengths 5, 6 and 8?`, solution: '(a) about 8.1 in, (b) 20-21-29 is a right triangle; 5-6-8 is not' },
      relatedLoIds: ['m8math.the-pythagorean-theorem-and-its-converse'],
    },
  ],
  pointers: [
    { content: `Students often say "The other leg is about 11.7." — The hypotenuse square is the biggest of the three, so a leg square is what is left after the other leg square is removed: 10² - 6² = 100 - 36 = 64, and √64 = 8. The other leg is 8. The sense check would have caught the slip on its own: an 11.7 leg is longer than the 10 hypotenuse, and the hypotenuse is always the longest side. Confirm: 6² + 8² = 36 + 64 = 100 = 10².`, kind: 'common-error' },
    { content: `Students often say "7, 24 and 25 do not make a right triangle, because 7² + 25² is 674 and 24² is 576." — In the converse, c is always the longest of the three lengths, because the hypotenuse is always the longest side of a right triangle. Here c = 25, and the two shorter sides are 7 and 24. Check: 7² + 24² = 49 + 576 = 625, and 25² = 625. The two results are exactly equal, so 7, 24 and 25 DO make a right triangle, with the right angle across from the 25.`, kind: 'common-error' },
    { content: `In a right triangle the two sides at the right angle are the legs, a and b, and the side across from the right angle is the hypotenuse, c, always the longest side.`, kind: 'tip' },
    { content: `The Pythagorean theorem: a² + b² = c². The squares on the two legs add up to the square on the hypotenuse; the lengths themselves do not add.`, kind: 'tip' },
    { content: `Why it is true: four copies of the triangle inside a square of side a + b leave the same uncovered area whether that space is one tilted square c² or two squares a² and b².`, kind: 'tip' },
    { content: `Missing hypotenuse: add the two leg squares and take the root. Missing leg: subtract the known leg square from the hypotenuse square and take the root. A leg must come out shorter than the hypotenuse.`, kind: 'tip' },
    { content: `When the root is not a perfect square, trap it between two consecutive perfect squares and estimate to one decimal place; √65 is about 8.1.`, kind: 'tip' },
    { content: `The converse: with c the longest of three lengths, a² + b² = c² exactly means the triangle is a right triangle, and anything else means it is not.`, kind: 'tip' },
    { content: `Don't add the leg lengths to find the hypotenuse. Add the *squares* of the legs: a² + b² = c². Legs 3 and 4 give 9 + 16 = 25, so c = 5, not 3 + 4 = 7.`, kind: 'common-error' },
    { content: `When finding a missing LEG, always subtract: leg² = c² - (other leg)². Never add. If your leg comes out longer than the hypotenuse, you added by mistake.`, kind: 'gotcha' },
    { content: `In the converse test, c is always the *longest* of the three given lengths. Square it by itself on one side; add the squares of the two shorter sides on the other. If they're equal, it's a right triangle.`, kind: 'vocab-note' },
    { content: `Perfect squares under 100: 1, 4, 9, 16, 25, 36, 49, 64, 81. When a² + b² is not one of these, trap the root between two consecutive perfect squares, then test decimals to one place.`, kind: 'tip' },
    { content: `The converse needs *exactly* equal: if a² + b² ≠ c², the triangle is not a right triangle. 'Close' does not count—20² + 21² = 841, and 29² = 841, so they match. But 5² + 6² = 61 and 8² = 64, so no.`, kind: 'edge-case' },
    { content: `The hypotenuse is *always* the longest side of a right triangle. If you solve for a side and get an answer longer than the hypotenuse, stop and check your arithmetic.`, kind: 'tip' },
    { content: `When you have a leg and the hypotenuse and need the other leg, identify which is which first. Write c² and subtract the known leg² — don't add. Subtract, then root.`, kind: 'common-error' },
  ],
};
