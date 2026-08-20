/**
 * Grade 7 Math — Measurement: Volume of Prisms & Composite Solids.
 *
 * The closing row of the measurement unit (CCSS 7.G.B.6). One formula covers
 * every prism — V = Bh, where B is the area of the base — so the real skill is
 * deciding which face is the base and computing its area. Composite solids get
 * decomposed into prisms and added. Volume fills a solid, so it is a 3-D
 * quantity in CUBIC units; surface area wraps it and stays in square units.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U8_VOLUME_OF_PRISMS_AND_COMPOSITE_SOLIDS: LessonPlan = {
  id: 'evelyn.ms.m7math.volume-of-prisms-and-composite-solids.v1',
  title: 'Volume of Prisms & Composite Solids',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.volume-of-prisms-and-composite-solids',
      standard: 'M7MATH-8.4',
      description:
        'Find the volume of any prism with V = Bh, where B is the area of the base, and find the volume of a composite solid by decomposing it into prisms and adding the parts (CCSS 7.G.B.6).',
    },
  ],
  prerequisites: ['m7math.surface-area-of-prisms-and-pyramids'],
  followUps: ['m7math.populations-and-samples'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Separate filling a solid from wrapping it, using a container the student can picture filling.',
      script:
        'Last lesson you wrapped a box. Today you fill it. Think about a fish tank: the glass is the outside, but the water is the inside, and nobody buys water by the square metre. Volume answers the question how much fits in here, and it gets counted in little cubes, so the units are cubic — cm³, m³, cubic inches. Here is the good news. There is not a different formula for every prism. There is one, and it works for a cereal box, a Toblerone and a hexagonal pencil all the same way.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-v-equals-bh',
      kind: 'concept',
      goal: 'Establish V = Bh as the single prism formula, teach how to pick the base, and lock in cubic units against square units.',
      keyIdeas: [
        'VOLUME COUNTS CUBES — volume is how many unit cubes fit inside a solid, so every volume answer ends in cubic units: cm³, m³, in³. Surface area wraps the outside and stays in square units. Same solid, two completely different questions, and the units are how you tell your reader which one you answered. A volume answer written in cm² is wrong even when the number is right.',
        'ONE FORMULA FOR EVERY PRISM — V = Bh. The capital B is the AREA OF THE BASE, and the little h is how far the solid stretches from one base to the other. Fill the base with a single layer of cubes, then stack h of those layers. That is the whole idea, and it does not care whether the base is a rectangle, a triangle or a hexagon.',
        'FINDING B IS THE REAL WORK — the base is one of the two identical parallel faces. Work out its area with whatever 2-D formula fits: a rectangle base is l × w, a triangle base is ½bh, and so on. B is an AREA, so write it with square units, and it becomes cubic units only after you multiply by the height.',
        'A RECTANGULAR PRISM IS THE FAMILIAR CASE — with a rectangle base, V = Bh becomes length × width × height. That is not a separate rule to memorise. It is V = Bh with B = l × w already multiplied out.',
        'THE HEIGHT IS PERPENDICULAR, AND IT MAY LIE ON ITS SIDE — h is the straight-across distance between the two bases, never a slanted edge. For a triangular prism lying down like a tent, the two triangles are the ends, so B is the triangle area and h is how LONG the tent is. Do not be fooled because that measurement runs sideways.',
        'COMPOSITE SOLIDS GET CHOPPED UP — a solid built from more than one prism has no formula of its own. Slice it into ordinary prisms, find V = Bh for each piece, and add the results. If a chunk has been hollowed out instead, find the whole solid and subtract the missing chunk. Keep the units on every line so the pieces add up honestly.',
      ],
      vocabulary: [
        { term: 'volume', definition: 'the amount of space a solid holds, measured in cubic units such as cm³.' },
        { term: 'prism', definition: 'a solid with two identical parallel bases joined by flat sides.' },
        { term: 'base area (B)', definition: 'the area of one of the two identical parallel faces, written in square units.' },
        { term: 'composite solid', definition: 'a solid made by joining simpler solids together, or by cutting a piece out of one.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-triangular-prism',
      kind: 'worked_example',
      problem: 'A camping tent is a triangular prism. Its triangular end has a base of 6 ft and a height of 4 ft, and the tent is 10 ft long. How much air is inside?',
      steps: [
        'Find the two identical parallel faces. They are the triangles at the front and the back of the tent, so the triangle is the base and B is its area.',
        'Compute B with the triangle formula: B = ½ × 6 × 4 = 12 ft². Square feet, because B is an area.',
        'Now find h, the distance between those two triangles. That is the length of the tent, 10 ft. It runs sideways, and that is fine — h just has to be perpendicular to the base, not pointing at the sky.',
        'Apply V = Bh: V = 12 × 10 = 120.',
        'Attach the units. An area in ft² times a length in ft gives ft³, so V = 120 ft³.',
        'WRONG answer to avoid: 6 × 4 × 10 = 240 ft³, which comes from skipping the ½ and treating the tent as a box. RIGHT answer: 120 ft³, exactly half of the box, because the end is a triangle and not a rectangle.',
      ],
      answer: '120 ft³',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-composite-step-block',
      kind: 'worked_example',
      problem: 'A concrete step is made of two rectangular blocks stacked to look like a stair. The bottom block is 10 cm by 4 cm on the ground and 3 cm tall. The top block sits on it and is 4 cm by 4 cm on the bottom and 5 cm tall. Find the total volume.',
      steps: [
        'There is no stair formula, so break the solid into pieces that ARE prisms. Two rectangular prisms, one on top of the other.',
        'Bottom block first. Its base is the 10 cm by 4 cm rectangle, so B = 10 × 4 = 40 cm². Its height is 3 cm.',
        'V of the bottom block = Bh = 40 × 3 = 120 cm³.',
        'Top block next. Its base is 4 cm by 4 cm, so B = 4 × 4 = 16 cm². Its height is 5 cm.',
        'V of the top block = Bh = 16 × 5 = 80 cm³.',
        'Add the pieces: 120 + 80 = 200 cm³. Both pieces were already in cubic centimetres, so they add directly. If one piece had been hollowed OUT of the other instead of stacked on top, the only change would be subtracting instead of adding.',
      ],
      answer: '200 cm³',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rectangular-prism-volume',
      kind: 'try_yourself',
      problem: 'An aquarium is a rectangular prism 30 cm long, 20 cm wide and 25 cm tall. How much water does it hold when full?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3700 cm²' },
        { id: 'b', text: '15000 cm³', correct: true },
        { id: 'c', text: '5000 cm³' },
        { id: 'd', text: '75 cm³' },
      ],
      expectedAnswer: '15000 cm³',
      hints: [
        'Start with the base on the bottom of the tank: B = 30 × 20.',
        'Then stack it up with V = Bh, multiplying that base area by the 25 cm height. Water filling a tank is volume, so the units are cubic.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-triangular-prism-volume',
      kind: 'try_yourself',
      problem: 'A chocolate bar is a triangular prism. Its triangular end has a base of 8 in and a height of 5 in, and the bar is 12 in long. What is its volume?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '480 in³' },
        { id: 'b', text: '25 in³' },
        { id: 'c', text: '240 in³', correct: true },
        { id: 'd', text: '120 in³' },
      ],
      expectedAnswer: '240 in³',
      hints: [
        'The two identical parallel faces are the triangles on the ends, so B is the area of a triangle.',
        'B = ½ × 8 × 5 first. Then multiply that base area by the 12 in length, and do not halve a second time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-container',
      kind: 'try_yourself',
      problem: 'A juice carton is a rectangular prism. Its base measures 8 cm by 6 cm and it stands 20 cm tall. How many cubic centimetres of juice does it hold when full? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '960',
      hints: [
        'Find the base area first: B = 8 × 6.',
        'Then use V = Bh with the 20 cm height. As a bonus, 1 cm³ of juice is 1 millilitre, so your number is also the millilitres on the label.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-surface-area-for-volume',
      kind: 'misconception_check',
      question: 'A box measures 5 cm by 4 cm by 3 cm. Asked for its volume, a student writes 94 cm². What went wrong?',
      commonErrors: [
        {
          answer: '94 cm²',
          misconception: 'Answering the surface area question instead of the volume question — adding up the six faces, 2(20 + 15 + 12) = 94, when the problem asked what fits inside.',
          correctsTo: 'Surface area wraps the outside; volume fills the inside. This problem asked how much fits in, so use V = Bh: the base is 5 × 4 = 20 cm², and the height is 3 cm, giving V = 20 × 3 = 60 cm³. The units are the giveaway — 94 cm² is measured in squares, and volume is never measured in squares. When an answer comes out in cm² but the question said volume, you have solved the wrong problem.',
        },
        {
          answer: '60 cm²',
          misconception: 'Getting the arithmetic exactly right but writing square units on a volume answer out of habit.',
          correctsTo: 'The number 60 is correct, but three lengths were multiplied together, so the units multiply too: cm × cm × cm = cm³. The answer is 60 cm³. Area comes from two lengths and gets square units; volume comes from three and gets cubic units. Carry the units through the multiplication and they will label themselves.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Volume fills a solid and is measured in cubic units such as cm³ or ft³; surface area wraps it and stays in square units.',
        'One formula covers every prism: V = Bh, where B is the area of the base and h is the distance between the two bases.',
        'Find B with the right 2-D formula first — l × w for a rectangle base, ½bh for a triangle base — and write it in square units.',
        'For a rectangular prism V = Bh is just length × width × height, and h may run sideways, as with the length of a tent.',
        'For a composite solid, chop it into prisms, find V = Bh for each piece, then add — or subtract a piece that was hollowed out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Volume of Prisms & Composite Solids' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
