/**
 * Grade 8 Math — Unit 1 CED 1.3: Square Roots & Cube Roots.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.square-roots-and-cube-roots.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U1_SQUARE_ROOTS_AND_CUBE_ROOTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.square-roots-and-cube-roots.v1',
  course: 'Grade 8 Math',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Square Roots & Cube Roots',
  planId: 'evelyn.ms.m8math.square-roots-and-cube-roots.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.square-roots-and-cube-roots.v1' }],
  theory: [
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'framework', title: 'The square root undoes squaring', content: `THE SQUARE ROOT UNDOES SQUARING — √p asks "which number, squared, gives p?" √144 = 12 because 12² = 144, and √25 = 5 because 5² = 25. The numbers whose square roots come out whole are the PERFECT SQUARES, and the ladder up to 225 is worth knowing cold: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, which are 1² through 15².` },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'framework', title: 'The cube root undoes cubing', content: `THE CUBE ROOT UNDOES CUBING — ∛p asks "which number, cubed, gives p?" ∛125 = 5 because 5 × 5 × 5 = 125. The numbers whose cube roots come out whole are the PERFECT CUBES, and the ladder up to 1000 is short: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, which are 1³ through 10³. The little 3 on the sign tells you it is a cube root; a bare √ is always a square root.` },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'framework', title: 'Check by working backward', content: `CHECK BY WORKING BACKWARD — a root is right only if it climbs back to p. To check √169 = 13, compute 13 × 13 = 169. To check ∛216 = 6, compute 6 × 6 = 36 and then 36 × 6 = 216. Halving is not rooting: √100 is 10, not 50, and the check 50 × 50 = 2500 exposes that slip instantly.` },
    { loId: 'm8math.square-roots-and-cube-roots', content: `x² = p HAS TWO SOLUTIONS — x² = 49 asks for EVERY number whose square is 49. 7² = 49, and (-7)² = 49 as well, because the parentheses make the minus part of the base and a negative times a negative is positive. So x = 7 or x = -7, written x = ±7, and in symbols x² = p is solved by x = ±√p. The bare symbol √49 means only the positive 7; the ± is added when you SOLVE an equation, and dropped again when the answer is a length that cannot be negative.` },
    { loId: 'm8math.square-roots-and-cube-roots', content: `x³ = p HAS ONE SOLUTION — x³ = 64 asks for every number whose cube is 64. 4³ = 64 works, but (-4)³ = (-4)(-4)(-4) = 16 × (-4) = -64, which is not 64. Three negatives multiplied together stay negative, so no negative number cubes to a positive p. x³ = p is solved by x = ∛p alone, with no ±.` },
    { loId: 'm8math.square-roots-and-cube-roots', content: `√2 IS IRRATIONAL — 2 is not on the perfect-square ladder, because 1² = 1 and 2² = 4 and no whole number squares to 2. So √2 is not a whole number, and from the last lesson it is not a fraction either: its decimal never ends and never repeats, which is exactly what irrational means. Write it as √2 and leave it exact.` },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'definition', title: 'square root', content: `the positive number that, when squared, gives the number under the √ sign; √81 = 9.` },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'definition', title: 'cube root', content: 'the number that, when cubed, gives the number under the ∛ sign; ∛27 = 3.' },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'definition', title: 'perfect square', content: `a whole number that is some whole number squared, so its square root is whole; 1, 4, 9, 16, ..., 225.` },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'definition', title: 'perfect cube', content: `a whole number that is some whole number cubed, so its cube root is whole; 1, 8, 27, 64, ..., 1000.` },
    { loId: 'm8math.square-roots-and-cube-roots', kind: 'definition', title: 'radical sign', content: 'the √ symbol; a small 3 in its crook, ∛, turns it into a cube root.' },
  ],
  methods: [
    {
      title: 'Worked evaluate roots',
      steps: [
        `Read the signs first. √196 is a square root, so it asks which number, squared, gives 196. ∛343 has the little 3, so it asks which number, cubed, gives 343.`,
        `Climb the perfect-square ladder toward 196: 12² = 144, 13² = 169, 14² = 196. It lands exactly at 14, so √196 = 14.`,
        `Check by squaring: 14 × 14 = 196. That is the number under the sign, so 14 is right.`,
        `WRONG: √196 = 98, because 196 ÷ 2 = 98. CORRECT: √196 = 14. A square root undoes squaring, not doubling, and the check catches the slip: 98 × 98 = 9604, nowhere near 196.`,
        `Climb the perfect-cube ladder toward 343: 5³ = 125, 6³ = 216, 7³ = 343. It lands exactly at 7, so ∛343 = 7.`,
        `Check by cubing: 7 × 7 = 49, then 49 × 7 = 343. That is the number under the sign, so 7 is right.`,
        `Notice that each answer is a single positive number. A bare root symbol always names the positive root; the second sign only shows up when an equation asks for x, which is the next example.`,
      ],
      example: { problem: 'Evaluate √196 and ∛343.', solution: '√196 = 14 and ∛343 = 7' },
      relatedLoIds: ['m8math.square-roots-and-cube-roots'],
    },
    {
      title: 'Worked solve square and cube',
      steps: [
        `(a) x² = 121 asks for EVERY number whose square is 121. On the ladder, 11² = 121, so x = 11 works.`,
        `Now test the negative. (-11)² = (-11)(-11) = 121, because the parentheses make the minus part of the base and a negative times a negative is positive. So x = -11 works too. The equation has two solutions: x = 11 or x = -11, written x = ±11.`,
        `WRONG: x = 11 only. CORRECT: x = 11 or x = -11. Dropping the negative loses half the answer. Substitute x = -11 back in: (-11)² = 121, exactly what the equation demands, so -11 is a solution whether or not it looks like one.`,
        'Check both by squaring: 11 × 11 = 121 and (-11) × (-11) = 121. Both land on 121.',
        `(b) x³ = 512 asks for every number whose cube is 512. On the cube ladder, 8³ = 512, since 8 × 8 = 64 and 64 × 8 = 512. So x = 8 works.`,
        `Now test the negative the same way. (-8)³ = (-8)(-8)(-8): the first two give 64, and 64 × (-8) = -512. That is -512, not 512, so x = -8 does NOT work. Three negatives multiplied together stay negative, so a negative number can never cube to a positive one. x³ = 512 has exactly one solution, x = 8.`,
        `WRONG: x = ±8, copying the ± from the square case. CORRECT: x = 8. The ± belongs to squaring, where the two negatives cancel; cubing multiplies three negatives, and they do not.`,
      ],
      example: { problem: 'Solve each equation. (a) x² = 121 (b) x³ = 512', solution: '(a) x = 11 or x = -11 (b) x = 8' },
      relatedLoIds: ['m8math.square-roots-and-cube-roots'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 10" — Both 10² = 100 and (-10)² = 100, because the parentheses make the minus part of the base and a negative times a negative is positive. The equation x² = 100 therefore has two solutions, x = 10 or x = -10, written x = ±10. The only time you keep just the 10 is when the question is about a length or another quantity that cannot be negative, and this equation has no such story attached.`, kind: 'common-error' },
    { content: `Students often say "∛64 = 8" — The little 3 on the sign asks which number, multiplied by itself THREE times, gives 64. Working 8 backward: 8 × 8 × 8 = 512, far too big. Working 4 backward: 4 × 4 = 16 and 16 × 4 = 64, so ∛64 = 4. The check is always the same: cube the answer and it must land exactly on the number under the sign. And the cube case does not gain a second sign, because (-4)³ = -64, not 64.`, kind: 'common-error' },
    { content: `The square root undoes squaring: √p is the positive number whose square is p, and the perfect squares up to 225 are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.`, kind: 'tip' },
    { content: `The cube root undoes cubing: ∛p is the number whose cube is p, and the perfect cubes up to 1000 are 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.`, kind: 'tip' },
    { content: `Check every root by working backward: square it or cube it, and it must land exactly on p. Halving is not rooting.`, kind: 'tip' },
    { content: `The equation x² = p has TWO solutions, x = ±√p, because a negative squared is positive. The bare symbol √p names only the positive one, and a length keeps only the positive one.`, kind: 'tip' },
    { content: `The equation x³ = p, with p positive, has ONE solution, x = ∛p, because a negative cubed stays negative.`, kind: 'tip' },
    { content: `√2 is irrational: no whole number squares to 2, and its decimal never ends or repeats, so write it as √2 and leave it exact.`, kind: 'tip' },
  ],
};
