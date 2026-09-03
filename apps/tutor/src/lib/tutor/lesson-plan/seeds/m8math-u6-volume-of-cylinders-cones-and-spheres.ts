/**
 * Grade 8 Math — Functions & Volume: Volume of Cylinders, Cones & Spheres.
 *
 * PROCEDURE-LED row 6.4 of the m8math fan-out. The student already owns
 * V = Bh for prisms and A = πr² for circles; what is new is that a cylinder
 * is a prism with a round base, so V = Bh becomes V = πr²h with no new idea,
 * and then two formulas that ARE new: a cone holds exactly one-third of the
 * cylinder it fits inside, V = (1/3)πr²h, and a sphere is V = (4/3)πr³
 * (CCSS 8.G.C.9). The concept segment is an ordered recipe: name the solid,
 * find the radius (halve a diameter), square or cube the radius FIRST, then
 * multiply by π and by the height and by the fraction the solid needs, and
 * write cubic units. Every solve ends with a check by working forward again.
 * The same recipe is then run backwards: divide the known volume by
 * everything that is known to recover a height, or a squared radius. Three
 * traps this plan is built to kill: using the diameter where the radius
 * belongs (four times too big for a cylinder or cone, eight times for a
 * sphere), dropping the (1/3) from the cone or the (4/3) from the sphere, and
 * writing r × 2 or r × 3 where r² or r³ belongs.
 *
 * SCOPE GUARD: Grade 8 row 6.4 extends V = Bh
 * (`m7math-u8-volume-of-prisms-and-composite-solids.ts`, assumed) to
 * cylinders using A = πr² (`m7math-u8-circumference-and-area-of-circles.ts`,
 * assumed), then V = (1/3)πr²h for cones and V = (4/3)πr³ for spheres; it
 * solves real-world problems and works backwards to a radius or height, and
 * sits in this unit as the IM/Eureka pairing (volume as a nonlinear function
 * of r; see sign-off 1). Withholds: surface area of curved solids, oblique
 * solids, Cavalieri's principle, hemispheres/composites ->
 * `geom-u10-prisms-cylinders.ts`, `geom-u10-pyramids-cones-spheres.ts`; cone
 * slant height. Concretely: no volume in this plan is found by adding or
 * subtracting two solids, and no half-sphere appears anywhere; the phrase
 * "surface area" never appears in a spoken field; every solid stands straight
 * up, and the slanted edge of a cone is mentioned only to say that the height
 * is NOT it; the one-third and two-thirds relationships between a cone, a
 * sphere and the cylinder they fit inside are stated as facts to remember, not
 * argued. Deliberately allowed: because the row's own scope names volume as a
 * nonlinear function of r, one keyIdea observes that doubling the radius
 * multiplies a cylinder's volume by 4 and a sphere's by 8 — an observation
 * only; the plan never runs row 6.2's linear-versus-nonlinear test and never
 * writes a rule in the form y = mx + b. Working backwards is in scope and
 * recovers a height by division, or a radius by dividing and then undoing a
 * square — a square root of a perfect square, which the student owns from
 * row 1.3 (`square-roots-and-cube-roots`) and which is recalled in one
 * clause, never re-taught. Below, assumed and not re-taught: V = Bh and
 * cubic-versus-square units, and A = πr² with π ≈ 3.14 and the
 * diameter-halving habit. Salvaged from `g8-math-volume-surface-area.ts`:
 * the three formulas and the "when to use each, units" framing only; its
 * title's surface area was deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U6_VOLUME_OF_CYLINDERS_CONES_AND_SPHERES: LessonPlan = {
  id: 'evelyn.ms.m8math.volume-of-cylinders-cones-and-spheres.v1',
  title: 'Volume of Cylinders, Cones & Spheres',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.volume-of-cylinders-cones-and-spheres',
      standard: 'M8MATH-6.4',
      description:
        'Extend V = Bh to cylinders using A = πr², then V = (1/3)πr²h for cones and V = (4/3)πr³ for spheres; solve real-world problems and work backwards to a radius or height (CCSS 8.G.C.9).',
    },
  ],
  prerequisites: ['m8math.comparing-functions-in-different-representations'],
  followUps: ['m8math.rate-of-change-and-initial-value-from-tables-and-graphs'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put three round containers in front of the student and show that the prism formula they already own reaches the first one with no new idea.',
      script:
        'You are working the snack stand at the school carnival. The slushie comes in a tall round cup, the snow cone comes in a paper cone, and the prize for the free-throw contest is a basketball. Your manager wants to know how much each one holds, because she orders syrup by the liter and she does not want to run out at 2 p.m. You already know how to find the volume of a box with V = Bh: the area of the base, stacked up h times. A slushie cup is a stack too, except the base is a circle, and you already know that a circle has area πr². So the cup is not a new problem at all. The cone and the ball need two formulas you have not met yet, but both of them are built out of the cup, and once you see how, you will never mix them up.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-solids-one-idea',
      kind: 'concept',
      goal: 'Install the three formulas as one recipe built from V = Bh, fix the radius-first-then-square-or-cube order, and show the recipe run backwards to a height or a radius.',
      keyIdeas: [
        'A CYLINDER IS A PRISM WITH A ROUND BASE — V = Bh still works, and the base is a circle, so B = πr². Put that in and the cylinder formula is V = πr²h. A cup with radius 4 cm and height 15 cm has a base of 3.14 × 16 = 50.24 cm², and 15 of those layers stacked up give 50.24 × 15 = 753.6 cm³. Nothing here is new except writing πr² where B used to be.',
        'A CONE IS ONE-THIRD OF ITS CYLINDER — V = (1/3)πr²h. Take a cone and a cylinder with the same radius and the same height: fill the cone with water and pour it into the cylinder, and it takes exactly three cone-fulls to fill the cylinder. So the cone formula is the cylinder formula with a (1/3) in front, and the h is the straight-up distance from the center of the base to the tip, never the slanted edge.',
        'A SPHERE HAS ONLY A RADIUS — V = (4/3)πr³. A ball has no separate height to multiply by, because its height is the radius twice over, and that is why the radius gets CUBED, not squared. One way to remember the fraction: a ball fits exactly inside a cylinder of the same radius and a height of 2r, and the ball takes up two-thirds of that cylinder. The cylinder is πr² × 2r = 2πr³, and two-thirds of 2πr³ is (4/3)πr³.',
        'RADIUS FIRST, THEN SQUARE OR CUBE, THEN THE REST — every formula wants the radius, so if the problem hands you a diameter, halve it before you do anything else. Then do the power first: r² means r × r and r³ means r × r × r, never r × 2 or r × 3. Only after that do you multiply by π, by the height if there is one, and by the fraction if the solid needs one. The answer is a volume, so it gets cubic units: cm³, m³, in³. Use π ≈ 3.14 unless the problem says to leave the answer in terms of π, in which case keep the π as a symbol, the way 36π cm³ does.',
        'RUN THE FORMULA BACKWARDS TO FIND WHAT IS MISSING — if the volume is known, put it in and divide out everything else. A cylinder with V = 1570 cm³ and r = 5 cm: 1570 = 3.14 × 25 × h, so 1570 = 78.5h and h = 1570 ÷ 78.5 = 20 cm. If the radius is the missing piece, you land on r² instead: a cylinder with V = 628 cm³ and h = 8 cm gives 628 = 3.14 × r² × 8, so r² = 628 ÷ 25.12 = 25, and the square root you already know how to take gives r = 5 cm. Check every backwards answer by running the formula forwards again.',
        'THE VOLUME DEPENDS ON THE RADIUS, AND NOT IN A STRAIGHT LINE — double the radius of a cylinder and keep its height, and the volume does not double, it multiplies by 4, because (2r)² = 4r². A cylinder with r = 2 cm and h = 10 cm holds 3.14 × 4 × 10 = 125.6 cm³; with r = 4 cm it holds 3.14 × 16 × 10 = 502.4 cm³, which is 4 × 125.6. Double the radius of a ball and its volume multiplies by 8, because (2r)³ = 8r³. A small change in the radius is a big change in what fits inside.',
      ],
      vocabulary: [
        { term: 'cylinder', definition: 'a solid with two identical circular bases joined by a curved side; a can or a cup.' },
        { term: 'cone', definition: 'a solid with one circular base that narrows to a single point, the apex; a snow cone or a party hat.' },
        { term: 'sphere', definition: 'a perfectly round solid in which every point on the surface is the same distance, the radius, from the center; a ball.' },
        { term: 'in terms of π', definition: 'writing an answer with the symbol π left in it, such as 36π cm³, instead of multiplying by 3.14.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cup-and-cone',
      kind: 'worked_example',
      problem:
        'The slushie cup is a cylinder with a radius of 4 cm and a height of 15 cm. The snow cone is a paper cone with the same radius, 4 cm, and the same height, 15 cm. How much does each one hold? Use π ≈ 3.14.',
      steps: [
        'Name what is where. The cup is a cylinder, so it needs V = πr²h. The problem gives the radius directly, r = 4 cm, so there is no diameter to halve. The height is h = 15 cm.',
        'Square the radius first: 4² = 4 × 4 = 16. Then multiply by π: 3.14 × 16 = 50.24. That is the base area, in cm², the same B you would have found for a prism.',
        'Stack it up: 50.24 × 15 = 753.6. So the cup holds 753.6 cm³. Since 1 cm³ is 1 milliliter, that is about 754 mL, a little more than three-quarters of a liter of slushie.',
        'Now the cone. Same radius and same height, so it needs V = (1/3)πr²h, and every number on the right is one you already have: (1/3) × 3.14 × 16 × 15. Do the 15 ÷ 3 first, because 15 splits into thirds cleanly: 3.14 × 16 × 5 = 3.14 × 80 = 251.2. The cone holds 251.2 cm³.',
        'Check by working forwards a different way: three cones should fill the cup. 3 × 251.2 = 753.6, and that is exactly the cup. In terms of π, the cup is 16 × 15 = 240π cm³ and the cone is 240π ÷ 3 = 80π cm³, and 80 × 3.14 = 251.2 again.',
        'Read it back into the story: the snow cone looks about as big as the slushie cup from across the stand, but it holds one-third as much syrup, so your manager needs three snow cones to use up one cup of it.',
      ],
      answer: 'Cup: 753.6 cm³ (240π cm³); cone: 251.2 cm³ (80π cm³), exactly one-third of the cup',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ball-and-backwards',
      kind: 'worked_example',
      problem:
        'The prize basketball has a diameter of 12 cm. (a) Find its volume. (b) The syrup for the snow cones comes in a cone-shaped paper cup that holds 235.5 cm³ and has a radius of 5 cm. How tall is the paper cup? Use π ≈ 3.14 for both parts.',
      steps: [
        '(a) The ball is a sphere, so it needs V = (4/3)πr³, and the formula wants the RADIUS. The problem gives a diameter of 12 cm, so halve it first: r = 12 ÷ 2 = 6 cm.',
        'Cube the radius: 6³ = 6 × 6 × 6 = 216. Then multiply by the fraction: (4/3) × 216 = 4 × 72 = 288. The volume in terms of π is 288π cm³.',
        'Multiply by 3.14: 288 × 3.14 = 904.32. The ball holds 904.32 cm³.',
        'WRONG: dropping the 12 straight into the formula and cubing it, 12³ = 1728, then (4/3) × 1728 = 2304 and 2304 × 3.14 = 7234.56 cm³. CORRECT: 12 cm is the diameter, and the formula wants r = 6 cm, which gives 904.32 cm³. The wrong answer is exactly eight times too big, 8 × 904.32 = 7234.56, because cubing a doubled number multiplies it by 8. Halve a diameter before you touch the formula.',
        '(b) The paper cup is a cone, so start from V = (1/3)πr²h and put in everything that is known: 235.5 = (1/3) × 3.14 × 25 × h. Here 5² = 25 was done first.',
        'Clear the fraction first by multiplying both sides by 3: 706.5 = 3.14 × 25 × h. Then 3.14 × 25 = 78.5, so 706.5 = 78.5h.',
        'Divide both sides by 78.5: h = 706.5 ÷ 78.5 = 9. The paper cup is 9 cm tall.',
        'Check by running the formula forwards: (1/3) × 3.14 × 25 × 9 = 3.14 × 25 × 3 = 3.14 × 75 = 235.5 cm³, which is the volume the problem gave. The height is 9 cm.',
      ],
      answer: '(a) 288π cm³ ≈ 904.32 cm³; (b) h = 9 cm',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cone-from-diameter',
      kind: 'try_yourself',
      problem: 'A paper snow cone is 6 cm across at the top and 10 cm deep. What is its volume? Use π ≈ 3.14.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '282.6 cm³' },
        { id: 'b', text: '62.8 cm³' },
        { id: 'c', text: '94.2 cm³', correct: true },
        { id: 'd', text: '376.8 cm³' },
      ],
      expectedAnswer: '94.2 cm³',
      hints: [
        'The 6 cm is the distance all the way across the top, so it is the diameter. The formula wants the radius, and it needs a (1/3) in front because this is a cone.',
        'r = 3 cm, so r² = 9. Then (1/3) × 3.14 × 9 × 10; do 9 ÷ 3 first to make the fraction easy, and check that your answer is one-third of the cylinder 3.14 × 9 × 10 = 282.6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sphere-in-terms-of-pi',
      kind: 'try_yourself',
      problem: 'A rubber bouncy ball has a radius of 3 cm. What is its volume, in terms of π?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '36π cm³', correct: true },
        { id: 'b', text: '12π cm³' },
        { id: 'c', text: '27π cm³' },
        { id: 'd', text: '108π cm³' },
      ],
      expectedAnswer: '36π cm³',
      hints: [
        'A ball is a sphere, so use V = (4/3)πr³. The radius is given, so there is nothing to halve, and the radius gets cubed, not squared.',
        '3³ = 27. Then (4/3) × 27: divide 27 by 3 first, then multiply by 4, and leave the π as a symbol.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-can-height',
      kind: 'try_yourself',
      problem: 'A soda can is a cylinder with a radius of 3 cm, and it holds 339.12 cm³. How tall is the can, in centimeters? Use π ≈ 3.14. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'Start from V = πr²h and put in what you know: 339.12 = 3.14 × 9 × h.',
        '3.14 × 9 = 28.26, so 339.12 = 28.26h. Divide both sides by 28.26, then check by multiplying your height by 28.26 to get 339.12 back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dropped-third-and-unsquared-radius',
      kind: 'misconception_check',
      question:
        'Ava and Ben both find the volume of a cone with a radius of 4 cm and a height of 9 cm, using π ≈ 3.14. Ava gets 452.16 cm³ and Ben gets 37.68 cm³. The correct volume is 150.72 cm³. What went wrong in each case?',
      commonErrors: [
        {
          answer: '452.16 cm³',
          misconception: 'Dropping the (1/3) and using the cylinder formula for a cone: 3.14 × 16 × 9 = 452.16.',
          correctsTo:
            'A cone holds one-third of the cylinder with the same radius and height, so the formula is V = (1/3)πr²h, not πr²h. Ava found the cylinder: 3.14 × 16 × 9 = 452.16 cm³. Divide by 3 to get the cone: 452.16 ÷ 3 = 150.72 cm³. The check is the pour test: three of Ava\'s cones would need three cylinders, which is far too much. Whenever the solid comes to a point, the (1/3) has to be there.',
        },
        {
          answer: '37.68 cm³',
          misconception: 'Forgetting to square the radius, so r² became just 4: (1/3) × 3.14 × 4 × 9 = 37.68.',
          correctsTo:
            'The formula wants r², which is r × r. With r = 4 that is 4 × 4 = 16, not 4. Ben used the (1/3) correctly but skipped the square, so his answer is four times too small: (1/3) × 3.14 × 16 × 9 = 3.14 × 16 × 3 = 3.14 × 48 = 150.72 cm³. Write the power out the long way, r × r for a cylinder or cone and r × r × r for a sphere, before you multiply by anything else.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A cylinder is a prism with a circle for its base, so V = Bh becomes V = πr²h.',
        'A cone holds one-third of the cylinder with the same radius and height: V = (1/3)πr²h.',
        'A sphere has only a radius, and it gets cubed: V = (4/3)πr³.',
        'Halve a diameter before you use any formula, do r² or r³ first, and write the answer in cubic units.',
        'To find a missing height or radius, put the known volume in and divide out everything else; a missing radius shows up as r², so take the square root last.',
        'Check every answer by running the formula forwards again, and remember that doubling a radius multiplies a cylinder\'s volume by 4 and a sphere\'s by 8.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Volume of Cylinders, Cones & Spheres' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
