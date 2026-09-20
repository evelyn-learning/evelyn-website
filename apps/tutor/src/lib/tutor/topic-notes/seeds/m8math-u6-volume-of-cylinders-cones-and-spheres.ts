/**
 * Grade 8 Math — Unit 6 CED 6.4: Volume of Cylinders, Cones & Spheres.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.volume-of-cylinders-cones-and-spheres.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U6_VOLUME_OF_CYLINDERS_CONES_AND_SPHERES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.volume-of-cylinders-cones-and-spheres.v1',
  course: 'Grade 8 Math',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Volume of Cylinders, Cones & Spheres',
  planId: 'evelyn.ms.m8math.volume-of-cylinders-cones-and-spheres.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.volume-of-cylinders-cones-and-spheres.v1' }],
  theory: [
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'framework', title: 'A cylinder is a prism with a round base', content: `A CYLINDER IS A PRISM WITH A ROUND BASE — V = Bh still works, and the base is a circle, so B = πr². Put that in and the cylinder formula is V = πr²h. A cup with radius 4 cm and height 15 cm has a base of 3.14 × 16 = 50.24 cm², and 15 of those layers stacked up give 50.24 × 15 = 753.6 cm³. Nothing here is new except writing πr² where B used to be.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'framework', title: 'A cone is one-third of its cylinder', content: `A CONE IS ONE-THIRD OF ITS CYLINDER — V = (1/3)πr²h. Take a cone and a cylinder with the same radius and the same height: fill the cone with water and pour it into the cylinder, and it takes exactly three cone-fulls to fill the cylinder. So the cone formula is the cylinder formula with a (1/3) in front, and the h is the straight-up distance from the center of the base to the tip, never the slanted edge.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'framework', title: 'A sphere has only a radius', content: `A SPHERE HAS ONLY A RADIUS — V = (4/3)πr³. A ball has no separate height to multiply by, because its height is the radius twice over, and that is why the radius gets CUBED, not squared. One way to remember the fraction: a ball fits exactly inside a cylinder of the same radius and a height of 2r, and the ball takes up two-thirds of that cylinder. The cylinder is πr² × 2r = 2πr³, and two-thirds of 2πr³ is (4/3)πr³.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'framework', title: 'Radius first, then square or cube, then the rest', content: `RADIUS FIRST, THEN SQUARE OR CUBE, THEN THE REST — every formula wants the radius, so if the problem hands you a diameter, halve it before you do anything else. Then do the power first: r² means r × r and r³ means r × r × r, never r × 2 or r × 3. Only after that do you multiply by π, by the height if there is one, and by the fraction if the solid needs one. The answer is a volume, so it gets cubic units: cm³, m³, in³. Use π ≈ 3.14 unless the problem says to leave the answer in terms of π, in which case keep the π as a symbol, the way 36π cm³ does.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'framework', title: 'Run the formula backwards to find what is missing', content: `RUN THE FORMULA BACKWARDS TO FIND WHAT IS MISSING — if the volume is known, put it in and divide out everything else. A cylinder with V = 1570 cm³ and r = 5 cm: 1570 = 3.14 × 25 × h, so 1570 = 78.5h and h = 1570 ÷ 78.5 = 20 cm. If the radius is the missing piece, you land on r² instead: a cylinder with V = 628 cm³ and h = 8 cm gives 628 = 3.14 × r² × 8, so r² = 628 ÷ 25.12 = 25, and the square root you already know how to take gives r = 5 cm. Check every backwards answer by running the formula forwards again.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'framework', title: 'The volume depends on the radius, and not in a straight line', content: `THE VOLUME DEPENDS ON THE RADIUS, AND NOT IN A STRAIGHT LINE — double the radius of a cylinder and keep its height, and the volume does not double, it multiplies by 4, because (2r)² = 4r². A cylinder with r = 2 cm and h = 10 cm holds 3.14 × 4 × 10 = 125.6 cm³; with r = 4 cm it holds 3.14 × 16 × 10 = 502.4 cm³, which is 4 × 125.6. Double the radius of a ball and its volume multiplies by 8, because (2r)³ = 8r³. A small change in the radius is a big change in what fits inside.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'definition', title: 'cylinder', content: `a solid with two identical circular bases joined by a curved side; a can or a cup.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'definition', title: 'cone', content: `a solid with one circular base that narrows to a single point, the apex; a snow cone or a party hat.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'definition', title: 'sphere', content: `a perfectly round solid in which every point on the surface is the same distance, the radius, from the center; a ball.` },
    { loId: 'm8math.volume-of-cylinders-cones-and-spheres', kind: 'definition', title: 'in terms of π', content: `writing an answer with the symbol π left in it, such as 36π cm³, instead of multiplying by 3.14.` },
  ],
  methods: [
    {
      title: 'Worked cup and cone',
      steps: [
        `Name what is where. The cup is a cylinder, so it needs V = πr²h. The problem gives the radius directly, r = 4 cm, so there is no diameter to halve. The height is h = 15 cm.`,
        `Square the radius first: 4² = 4 × 4 = 16. Then multiply by π: 3.14 × 16 = 50.24. That is the base area, in cm², the same B you would have found for a prism.`,
        `Stack it up: 50.24 × 15 = 753.6. So the cup holds 753.6 cm³. Since 1 cm³ is 1 milliliter, that is about 754 mL, a little more than three-quarters of a liter of slushie.`,
        `Now the cone. Same radius and same height, so it needs V = (1/3)πr²h, and every number on the right is one you already have: (1/3) × 3.14 × 16 × 15. Do the 15 ÷ 3 first, because 15 splits into thirds cleanly: 3.14 × 16 × 5 = 3.14 × 80 = 251.2. The cone holds 251.2 cm³.`,
        `Check by working forwards a different way: three cones should fill the cup. 3 × 251.2 = 753.6, and that is exactly the cup. In terms of π, the cup is 16 × 15 = 240π cm³ and the cone is 240π ÷ 3 = 80π cm³, and 80 × 3.14 = 251.2 again.`,
        `Read it back into the story: the snow cone looks about as big as the slushie cup from across the stand, but it holds one-third as much syrup, so your manager needs three snow cones to use up one cup of it.`,
      ],
      example: { problem: `The slushie cup is a cylinder with a radius of 4 cm and a height of 15 cm. The snow cone is a paper cone with the same radius, 4 cm, and the same height, 15 cm. How much does each one hold? Use π ≈ 3.14.`, solution: `Cup: 753.6 cm³ (240π cm³); cone: 251.2 cm³ (80π cm³), exactly one-third of the cup` },
      relatedLoIds: ['m8math.volume-of-cylinders-cones-and-spheres'],
    },
    {
      title: 'Worked ball and backwards',
      steps: [
        `(a) The ball is a sphere, so it needs V = (4/3)πr³, and the formula wants the RADIUS. The problem gives a diameter of 12 cm, so halve it first: r = 12 ÷ 2 = 6 cm.`,
        `Cube the radius: 6³ = 6 × 6 × 6 = 216. Then multiply by the fraction: (4/3) × 216 = 4 × 72 = 288. The volume in terms of π is 288π cm³.`,
        'Multiply by 3.14: 288 × 3.14 = 904.32. The ball holds 904.32 cm³.',
        `WRONG: dropping the 12 straight into the formula and cubing it, 12³ = 1728, then (4/3) × 1728 = 2304 and 2304 × 3.14 = 7234.56 cm³. CORRECT: 12 cm is the diameter, and the formula wants r = 6 cm, which gives 904.32 cm³. The wrong answer is exactly eight times too big, 8 × 904.32 = 7234.56, because cubing a doubled number multiplies it by 8. Halve a diameter before you touch the formula.`,
        `(b) The paper cup is a cone, so start from V = (1/3)πr²h and put in everything that is known: 235.5 = (1/3) × 3.14 × 25 × h. Here 5² = 25 was done first.`,
        `Clear the fraction first by multiplying both sides by 3: 706.5 = 3.14 × 25 × h. Then 3.14 × 25 = 78.5, so 706.5 = 78.5h.`,
        'Divide both sides by 78.5: h = 706.5 ÷ 78.5 = 9. The paper cup is 9 cm tall.',
        `Check by running the formula forwards: (1/3) × 3.14 × 25 × 9 = 3.14 × 25 × 3 = 3.14 × 75 = 235.5 cm³, which is the volume the problem gave. The height is 9 cm.`,
      ],
      example: { problem: `The prize basketball has a diameter of 12 cm. (a) Find its volume. (b) The syrup for the snow cones comes in a cone-shaped paper cup that holds 235.5 cm³ and has a radius of 5 cm. How tall is the paper cup? Use π ≈ 3.14 for both parts.`, solution: '(a) 288π cm³ ≈ 904.32 cm³; (b) h = 9 cm' },
      relatedLoIds: ['m8math.volume-of-cylinders-cones-and-spheres'],
    },
  ],
  pointers: [
    { content: `Students often say "452.16 cm³" — A cone holds one-third of the cylinder with the same radius and height, so the formula is V = (1/3)πr²h, not πr²h. Ava found the cylinder: 3.14 × 16 × 9 = 452.16 cm³. Divide by 3 to get the cone: 452.16 ÷ 3 = 150.72 cm³. The check is the pour test: three of Ava's cones would need three cylinders, which is far too much. Whenever the solid comes to a point, the (1/3) has to be there.`, kind: 'common-error' },
    { content: `Students often say "37.68 cm³" — The formula wants r², which is r × r. With r = 4 that is 4 × 4 = 16, not 4. Ben used the (1/3) correctly but skipped the square, so his answer is four times too small: (1/3) × 3.14 × 16 × 9 = 3.14 × 16 × 3 = 3.14 × 48 = 150.72 cm³. Write the power out the long way, r × r for a cylinder or cone and r × r × r for a sphere, before you multiply by anything else.`, kind: 'common-error' },
    { content: 'A cylinder is a prism with a circle for its base, so V = Bh becomes V = πr²h.', kind: 'tip' },
    { content: `A cone holds one-third of the cylinder with the same radius and height: V = (1/3)πr²h.`, kind: 'tip' },
    { content: 'A sphere has only a radius, and it gets cubed: V = (4/3)πr³.', kind: 'tip' },
    { content: `Halve a diameter before you use any formula, do r² or r³ first, and write the answer in cubic units.`, kind: 'tip' },
    { content: `To find a missing height or radius, put the known volume in and divide out everything else; a missing radius shows up as r², so take the square root last.`, kind: 'tip' },
    { content: `Check every answer by running the formula forwards again, and remember that doubling a radius multiplies a cylinder's volume by 4 and a sphere's by 8.`, kind: 'tip' },
    { content: `If the problem gives a diameter, halve it FIRST before you put it into any formula. Cubing or squaring a diameter instead of the radius multiplies your answer way too much (by 8 for a sphere, by 4 for a cylinder).`, kind: 'common-error' },
    { content: `Do the exponent (r² or r³) BEFORE you multiply by π, by the height, or by any fraction. Write it out: r × r or r × r × r. Never compute r × 2 or r × 3.`, kind: 'tip' },
    { content: `A cone formula always has the (1/3). Don't drop it. If you get the same answer as the cylinder formula, you forgot it—divide your answer by 3.`, kind: 'common-error' },
    { content: `When you work backwards (given volume, find radius or height), a missing radius lands on r², so you'll need to take a square root. A missing height is just division.`, kind: 'tip' },
    { content: `In a cone formula, the h is always the straight-up height from the center of the base to the tip, never the slanted edge of the paper.`, kind: 'vocab-note' },
    { content: `The answer is a volume, so it MUST have cubic units (cm³, m³, in³, mL). If you forget to include units or use square units instead, you've lost the meaning of your answer.`, kind: 'common-error' },
    { content: `When asked for the answer 'in terms of π,' write the number, then π as a symbol (like 36π cm³), not as 3.14. When π is not mentioned, use π ≈ 3.14 and write a decimal.`, kind: 'vocab-note' },
    { content: `Always check a backwards answer by plugging the radius or height back into the formula forwards. If you don't get the original volume, something went wrong.`, kind: 'tip' },
  ],
};
