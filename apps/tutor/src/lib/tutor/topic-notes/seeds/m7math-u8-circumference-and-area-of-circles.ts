/**
 * Grade 7 Math — Unit 8 CED 8.2: Circumference & Area of Circles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.circumference-and-area-of-circles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U8_CIRCUMFERENCE_AND_AREA_OF_CIRCLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.circumference-and-area-of-circles.v1',
  course: 'Grade 7 Math',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Circumference & Area of Circles',
  planId: 'evelyn.ms.m7math.circumference-and-area-of-circles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.circumference-and-area-of-circles.v1' }],
  theory: [
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'framework', title: 'Radius and diameter', content: `RADIUS AND DIAMETER — the radius r runs from the center of the circle out to the edge. The diameter d runs all the way across, through the center, so it is exactly two radii: d = 2r, and r = d ÷ 2. Almost every circle mistake starts by mixing these two up, so name which one you have been given before you touch a formula.` },
    { loId: 'm7math.circumference-and-area-of-circles', content: `π IS ONE FIXED NUMBER — wrap a string around any circle and compare it to the distance across. The string is always about 3.14 times as long, for every circle that has ever existed. That ratio is π. We will use π ≈ 3.14 in this lesson, and because it is rounded, our answers are approximate too — use ≈ instead of = when you round, and give two decimal places when the answer does not stop on its own.` },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'framework', title: 'Circumference is a distance around', content: `CIRCUMFERENCE IS A DISTANCE AROUND — C = πd, and since d = 2r you can also write C = 2πr. Both give the same number. Circumference is a length, like the length of a piece of string, so it gets plain units: cm, m, in. Never square units.` },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'framework', title: 'Area is the surface inside', content: `AREA IS THE SURFACE INSIDE — A = πr². The little 2 means r × r, so square the radius FIRST and then multiply by π. Area gets square units: cm², m², in². Circumference is the crust, area is the cheese.` },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'framework', title: 'Area always wants the radius', content: `AREA ALWAYS WANTS THE RADIUS — the formula says r, and it means r. If the problem gives you a diameter, cut it in half before you square anything. Squaring the diameter instead makes your answer four times too big, which is the single most common circle error there is.` },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'framework', title: 'You can run the formula backwards', content: `YOU CAN RUN THE FORMULA BACKWARDS — if you know the circumference and want the radius, undo the multiplication: C = 2πr means r = C ÷ (2π), so divide by 6.28. A circumference of 62.8 ft gives r = 62.8 ÷ 6.28 = 10 ft. Check it by going forwards again.` },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'definition', title: 'radius', content: 'the distance from the center of a circle to its edge; half the diameter.' },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'definition', title: 'diameter', content: 'the distance straight across a circle through the center; twice the radius.' },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'definition', title: 'circumference', content: 'the distance all the way around a circle, measured in plain units of length.' },
    { loId: 'm7math.circumference-and-area-of-circles', kind: 'definition', title: 'π', content: `the number you get when you divide any circle circumference by its diameter, about 3.14.` },
  ],
  methods: [
    {
      title: 'Worked diameter to both',
      steps: [
        `Write down what you were given: d = 10 cm. That is the diameter, not the radius. Say it out loud so you do not forget it later.`,
        `Circumference first, because C = πd takes the diameter exactly as it is: C ≈ 3.14 × 10 = 31.4 cm. Plain centimeters, because that is a distance around.`,
        `Now switch to area, and area needs the radius. Halve the diameter: r = 10 ÷ 2 = 5 cm.`,
        'Apply A = πr². Square the radius first: 5² = 5 × 5 = 25.',
        `Then multiply by π: A ≈ 3.14 × 25 = 78.5 cm². Square centimeters, because that is a surface.`,
        `So C ≈ 31.4 cm and A ≈ 78.5 cm². WRONG answer to avoid: 3.14 × 10² = 314 cm², which comes from dropping the diameter into the area formula. RIGHT answer: 78.5 cm². That wrong answer is four times too big, every single time.`,
      ],
      example: { problem: `A round clock face has a diameter of 10 cm. Find its circumference and its area. Use π ≈ 3.14.`, solution: 'C ≈ 31.4 cm and A ≈ 78.5 cm²' },
      relatedLoIds: ['m7math.circumference-and-area-of-circles'],
    },
    {
      title: 'Worked circumference backwards',
      steps: [
        `This one is backwards: the distance around is known and the radius is missing. Start from C = 2πr and put the number in: 251.2 = 2 × 3.14 × r.`,
        'Simplify the front: 2 × 3.14 = 6.28, so 251.2 = 6.28r.',
        `Undo the multiplication by dividing both sides by 6.28: r = 251.2 ÷ 6.28 = 40 cm.`,
        `Check it forwards before going on: 6.28 × 40 = 251.2. That matches, so the radius is right.`,
        'The width across is the diameter: d = 2r = 2 × 40 = 80 cm.',
        `For the floor inside, use A = πr². Square first: 40² = 1600. Then A ≈ 3.14 × 1600 = 5024 cm². So the hoop is 80 cm across and encloses about 5024 cm².`,
      ],
      example: { problem: `A hula hoop has a circumference of 251.2 cm. How wide is it across, and how much floor does it enclose? Use π ≈ 3.14.`, solution: 'r = 40 cm, d = 80 cm, and A ≈ 5024 cm²' },
      relatedLoIds: ['m7math.circumference-and-area-of-circles'],
    },
  ],
  pointers: [
    { content: `Students often say "452.16 cm²" — The formula A = πr² wants the RADIUS. Here 12 cm is the diameter, so halve it first: r = 12 ÷ 2 = 6 cm. Then 6² = 36, and A ≈ 3.14 × 36 = 113.04 cm². Notice 452.16 is exactly four times 113.04 — using the diameter always multiplies your area by four, because squaring a doubled number quadruples it. Circle the word diameter or radius in the problem before you start.`, kind: 'common-error' },
    { content: `Students often say "37.68 cm²" — The exponent 2 means the radius times itself, not the radius times 2. With r = 6 that is 6 × 6 = 36, not 6 × 2 = 12. So A ≈ 3.14 × 36 = 113.04 cm², not 3.14 × 12 = 37.68. Write out r × r the long way whenever the little 2 tempts you.`, kind: 'common-error' },
    { content: `The diameter is twice the radius: d = 2r, and r = d ÷ 2. Name which one you have before choosing a formula.`, kind: 'tip' },
    { content: `Circumference is the distance around: C = πd = 2πr, and it gets plain units like cm or ft.`, kind: 'tip' },
    { content: 'Area is the surface inside: A = πr², and it gets square units like cm² or in².', kind: 'tip' },
    { content: `Area needs the RADIUS. Squaring the diameter by mistake makes the answer four times too big.`, kind: 'tip' },
    { content: `Working backwards from a circumference: r = C ÷ (2π), so divide by 6.28 when π ≈ 3.14.`, kind: 'tip' },
    { content: `Before you write any formula, circle the word **radius** or **diameter** in the problem. Dropping a diameter into A = πr² makes your area exactly 4 times too big — the #1 circle error.`, kind: 'common-error' },
    { content: `r² means r × r, NOT r × 2. With r = 6, that's 6 × 6 = 36, not 12. When the little 2 tempts you, write the multiplication out the long way.`, kind: 'common-error' },
    { content: `Units tell you if you used the right formula: circumference is a distance, so plain cm, m, ft. Area is a surface, so cm², m², ft². If you wrote cm² after C = πd, something's wrong.`, kind: 'vocab-note' },
    { content: `Since π ≈ 3.14 is rounded, your answer is approximate too. Write ≈ instead of =, and round to two decimal places when the decimals don't stop (like 153.86 in²).`, kind: 'tip' },
    { content: `C = πd and C = 2πr are the SAME formula. Use πd when you're handed a diameter, 2πr when you're handed a radius. Don't do both — that doubles your answer.`, kind: 'gotcha' },
    { content: `Going backwards from circumference gives the RADIUS, not the diameter: r = C ÷ 6.28. If the question asks how wide the circle is across, you still have to double it.`, kind: 'edge-case' },
    { content: `Check a backwards answer by running it forwards: found r = 10 from C = 62.8? Then 6.28 × 10 = 62.8 ✓. Takes five seconds and catches division slips.`, kind: 'tip' },
    { content: `One problem can need both formulas with different numbers: for d = 10 cm, circumference uses 10 but area uses r = 5. Don't reuse the first number out of laziness.`, kind: 'gotcha' },
  ],
};
