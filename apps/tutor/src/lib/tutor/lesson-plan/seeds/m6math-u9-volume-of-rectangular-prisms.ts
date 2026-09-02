/**
 * Grade 6 Math — Area, Surface Area & Volume: Volume of Rectangular Prisms.
 *
 * PROCEDURE-LED fan-out row for m6math. The formula V = l x w x h is not new by
 * itself; what is new, and what this lesson is actually built to teach, is that
 * the formula keeps working when the edges are fractions. The lesson earns that
 * claim by packing each box with same-size fractional cubes and counting them,
 * then showing the count always matches multiplying the three edges straight
 * across. Two traps this plan is built to kill: multiplying only two of the
 * three edges and mistaking a face's area for the volume, and choosing a
 * packing-cube size that does not divide evenly into every edge of the prism.
 *
 * SCOPE GUARD: Grade 6 row 9.3 finds the volume of a right rectangular prism
 * with fractional edge lengths, by packing it with same-size fractional unit
 * cubes and confirming the count matches V = l x w x h. Fractional edge lengths
 * are the point of this row, not an edge case, so they appear in every worked
 * example and try_yourself item; a plan that only multiplied whole-number
 * edges would have missed the standard. Every solid in this plan is a single
 * right rectangular prism: no pyramid and no composite solid built from more
 * than one prism ever appears, because both are Grade 7 (G7 U8). This row
 * never draws a net or computes surface area, which is row 9.4's skill: a
 * rectangular face's area appears only as a labeled wrong answer, the mistake
 * of multiplying just two of the three edges and stopping, never as the
 * quantity actually requested or as a correct answer anywhere in this plan.
 * This row does not find the area of a triangle or a non-rectangular
 * quadrilateral, which is row 9.1's skill, and it does not plot polygon
 * vertices on a coordinate grid, which is row 9.2's skill.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 9.2 -> 9.3 -> 9.4;
 * all three are wired to their real neighbors when the full 40-row batch is
 * registered together.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U9_VOLUME_OF_RECTANGULAR_PRISMS: LessonPlan = {
  id: 'evelyn.ms.m6math.volume-of-rectangular-prisms.v1',
  title: 'Volume of Rectangular Prisms',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.volume-of-rectangular-prisms',
      standard: 'M6MATH-9.3',
      description:
        'Find the volume of a right rectangular prism with fractional edge lengths by packing unit cubes and applying V = lwh (CCSS 6.G.A.2).',
    },
  ],
  prerequisites: ['m6math.polygons-in-the-coordinate-plane'],
  followUps: ['m6math.nets-and-surface-area'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Contrast the familiar whole-number volume formula with a fractional-edge box, so the student wants the packing argument that makes the formula trustworthy again.',
      script:
        'You are wrapping a present for a friend\'s birthday party. The gift box is shaped like a rectangular prism, 3 inches long, 2 inches wide, and 2 inches tall. You already know how to find how much space is inside: multiply length times width times height, 3 x 2 x 2 = 12 cubic inches. But a smaller jewelry box tucked inside that gift measures 3/2 inches long, 1 inch wide, and 1/2 inch tall. None of those three numbers are whole numbers. Does the same rule, multiply the three edges together, still work when the edges are fractions? Today you find out that it does, and you see exactly why, by packing that small box with tiny cubes and counting every single one.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-packing-fractional-cubes',
      kind: 'concept',
      goal: 'Install the packing argument for fractional edges and show it always agrees with V = l x w x h.',
      keyIdeas: [
        'VOLUME MEANS COUNTING CUBES THAT FILL A SOLID — the volume of a solid is the number of same-size cubes it takes to pack it completely, with no gaps and no cubes left sticking out. If those cubes are unit cubes, edge length 1, the count is the volume in cubic units.',
        'V = l x w x h COUNTS LAYERS OF UNIT CUBES — for a right rectangular prism with whole-number edges, multiplying length times width times height counts exactly that many unit cubes, layer by layer. A box 3 inches by 2 inches by 4 inches holds 3 x 2 x 4 = 24 unit cubes, arranged as 4 layers of 3 x 2 = 6 cubes each.',
        'FRACTIONAL EDGES NEED A SMALLER CUBE — when an edge length is a fraction, like 1/2 inch or 1/4 inch, a unit cube does not fit evenly. Instead, pack the prism with smaller cubes whose edge length is a unit fraction, chosen so that fraction fits a whole number of times along EVERY edge of the prism, not just one of them.',
        'EACH SMALL CUBE HAS ITS OWN FRACTIONAL VOLUME — a cube with edge length 1/2 inch has volume 1/2 x 1/2 x 1/2 = 1/8 cubic inch, since it takes 8 of them, stacked 2 by 2 by 2, to fill one unit cube. A cube with edge length 1/4 inch has volume 1/4 x 1/4 x 1/4 = 1/64 cubic inch. To find the total volume, count how many small cubes fit, then multiply that count by one small cube\'s volume.',
        'PACKING ALWAYS AGREES WITH V = l x w x h — count the small cubes along each edge, multiply those three counts together, then multiply by one small cube\'s volume, and the result is always exactly the same as multiplying the prism\'s three edge lengths straight across. That is why the same formula still works when the edges are fractions, not just whole numbers.',
        'MULTIPLY FRACTIONAL EDGES STRAIGHT ACROSS — to use V = l x w x h with fractional edges, multiply the three edge lengths the same way you multiply any fractions: numerator times numerator, denominator times denominator, writing a whole number as itself over 1. Volume is always measured in cubic units, such as cubic inches, because it counts cubes, not flat squares.',
      ],
      vocabulary: [
        { term: 'right rectangular prism', definition: 'a box shape with six flat rectangular faces, where every edge meets the next one at a right angle.' },
        { term: 'unit cube', definition: 'a cube with an edge length of exactly 1 unit, used as the basic building block for measuring volume.' },
        { term: 'unit fraction cube', definition: 'a small cube whose edge length is a unit fraction, such as 1/2 inch or 1/4 inch, used to pack a prism whose own edges are not whole numbers.' },
        { term: 'cubic unit', definition: 'the unit volume is measured in, such as cubic inches, because volume counts cubes rather than flat squares.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-jewelry-box-packing',
      kind: 'worked_example',
      problem:
        'A small rectangular jewelry box for a friend\'s birthday present measures 3/2 inches long, 1 inch wide, and 1/2 inch tall. Find its volume by packing it with small cubes and counting them.',
      steps: [
        'Pick a small cube size that fits a whole number of times along every edge. The edges are 3/2 inch, 1 inch, and 1/2 inch, and 1/2 inch fits evenly into all three, so pack the box with small cubes that each measure 1/2 inch on every edge.',
        'Count how many small cubes fit along each edge. Along the 3/2-inch edge: 3/2 divided by 1/2 = 3 small cubes. Along the 1-inch edge: 1 divided by 1/2 = 2 small cubes. Along the 1/2-inch edge: 1/2 divided by 1/2 = 1 small cube.',
        'Multiply the three counts to get the total number of small cubes: 3 x 2 x 1 = 6 small cubes fill the box.',
        'Find the volume of one small cube: edge 1/2 inch, so its volume is 1/2 x 1/2 x 1/2 = 1/8 cubic inch.',
        'Multiply the number of small cubes by the volume of one small cube: 6 x 1/8 = 6/8 cubic inch, which simplifies to 3/4 cubic inch.',
        'Check with the formula directly: V = l x w x h = 3/2 x 1 x 1/2 = 3/4 cubic inch. Packing and counting gives the exact same answer as multiplying the edges.',
        'Check by dividing back: dividing the volume by the base area, length times width, should return the height. 3/4 divided by (3/2 x 1) = 3/4 divided by 3/2 = 3/4 x 2/3 = 1/2, which matches the height exactly, so the volume is correct.',
      ],
      answer: '3/4 cubic inch',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-party-favor-box-formula',
      kind: 'worked_example',
      problem:
        'A small party favor box for the same birthday party measures 5/4 inches long, 1/2 inch wide, and 1 inch tall. Find its volume.',
      steps: [
        'Rewrite every edge so they share the same denominator: 5/4 inch stays 5/4, 1/2 inch becomes 2/4, and 1 inch becomes 4/4. Pack the box with small cubes that each measure 1/4 inch on every edge, since 1/4 fits evenly into all three.',
        'Count small cubes along each edge: 5 along the 5/4-inch edge, 2 along the 2/4-inch edge, and 4 along the 4/4-inch edge.',
        'Multiply the three counts: 5 x 2 x 4 = 40 small cubes fill the box.',
        'Find the volume of one small cube: edge 1/4 inch, so its volume is 1/4 x 1/4 x 1/4 = 1/64 cubic inch.',
        'Multiply: 40 x 1/64 = 40/64 cubic inch, which simplifies to 5/8 cubic inch.',
        'WRONG: multiplying only two of the three edges, such as length times height, 5/4 x 1 = 5/4, and calling that the volume. That number is the area of one rectangular face, in square inches, not the volume of the whole box. CORRECT: volume needs all three edges multiplied together: 5/4 x 1/2 x 1 = 5/8 cubic inch.',
        'Check with the formula directly: V = l x w x h = 5/4 x 1/2 x 1 = 5/8 cubic inch, matching the packing count.',
        'Check by dividing back: dividing the volume by the base area should return the height. 5/8 divided by (5/4 x 1/2) = 5/8 divided by 5/8 = 1, which matches the height exactly.',
      ],
      answer: '5/8 cubic inch',
      estimatedMinutes: 3,
    },
    {
      id: 'try-wooden-block-volume',
      kind: 'try_yourself',
      problem:
        'A small wooden block your younger cousin uses to build a tower is shaped like a rectangular prism. It measures 3/4 inch long, 4 inches wide, and 1/2 inch tall. What is its volume?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1 and 1/2 cubic inches', correct: true },
        { id: 'b', text: '3 cubic inches' },
        { id: 'c', text: '2 cubic inches' },
        { id: 'd', text: '6 cubic inches' },
      ],
      expectedAnswer: '1 and 1/2 cubic inches',
      hints: [
        'Multiply all three edge lengths together: length times width times height. Write the whole number 4 as 4/1 before multiplying.',
        '3/4 x 4 x 1/2 — multiply straight across, numerator times numerator and denominator times denominator, then simplify the result.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-packing-cube',
      kind: 'try_yourself',
      problem:
        'A small prism measures 1/3 inch by 1/3 inch by 2/3 inch. You want to pack it with small cubes that all have the same edge length, with no gaps and no leftover space. What edge length should each small cube have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1 inch' },
        { id: 'b', text: '1/2 inch' },
        { id: 'c', text: '1/3 inch', correct: true },
        { id: 'd', text: '2/3 inch' },
      ],
      expectedAnswer: '1/3 inch',
      hints: [
        'The small cube edge length must fit a whole number of times into EVERY edge of the prism, not just one of them.',
        'Test each choice against all three edges, 1/3 inch, 1/3 inch, and 2/3 inch. Only one size divides evenly into all three with nothing left over.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-trading-card-box',
      kind: 'try_yourself',
      problem:
        'A rectangular box for holding trading cards measures 5/2 inches long, 1/2 inch wide, and 2 inches tall. What is its volume, in cubic inches? Type your answer as a decimal number.',
      responseFormat: 'numeric',
      expectedAnswer: '2.5',
      hints: [
        'Multiply all three edge lengths straight across. Write the whole number 2 as 2/1 before multiplying.',
        '5/2 x 1/2 x 2 gives a fraction. Simplify it, then rewrite that fraction as a decimal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-added-edges-and-multiplied-only-two',
      kind: 'misconception_check',
      question:
        'A prism measures 2/3 inch long, 3 inches wide, and 1/2 inch tall. One student works out its volume and writes 4 and 1/6 cubic inches. Another student writes 2 cubic inches. What went wrong in each case?',
      commonErrors: [
        {
          answer: '4 and 1/6 cubic inches',
          misconception: 'Adding the three edge lengths instead of multiplying them: 2/3 + 3 + 1/2 = 4 and 1/6.',
          correctsTo:
            'Volume is never found by adding edges; it is found by multiplying them. Multiply straight across: 2/3 x 3 x 1/2 = (2 x 3 x 1) divided by (3 x 1 x 2) = 6/6 = 1 cubic inch. Adding gives a length-like number, not a volume, and it does not match packing the prism with small cubes and counting them.',
        },
        {
          answer: '2 cubic inches',
          misconception: 'Multiplying only two of the three edges, 2/3 x 3 = 2, and stopping there.',
          correctsTo:
            'Two edges multiplied together give the area of one rectangular face, in square inches, not the volume of the whole prism. All three edges must be multiplied: 2/3 x 3 x 1/2 = 1 cubic inch, which matches packing the prism with small cubes and counting them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Volume counts how many same-size cubes, unit cubes or smaller fractional cubes, it takes to fill a solid with no gaps and no overlaps.',
        'V = l x w x h works for fractional edges exactly the way it works for whole-number edges: packing with unit-fraction cubes and counting always agrees with multiplying the edges straight across.',
        'To pack a prism with fractional edges, choose a small cube edge length that fits a whole number of times into EVERY edge of the prism, not just one of them.',
        'Multiply fractional edge lengths straight across, numerator times numerator and denominator times denominator, writing any whole number as itself over 1.',
        'Volume is always measured in cubic units, such as cubic inches, because it counts cubes, not flat squares.',
        'Multiplying only two of the three edges gives the area of one face, not the volume — always use all three.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Volume of Rectangular Prisms' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
