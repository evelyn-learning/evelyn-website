/**
 * Digital SAT — Math / Geometry & Trigonometry: Area & Volume.
 *
 * Plug-into-the-reference-sheet arithmetic, composite figures, and the
 * digital test's signature trap on this skill: what happens to area and
 * volume when a figure's linear dimensions are SCALED. Area scales by the
 * square of the scale factor, volume by the cube — never by the factor
 * itself. Desmos is allowed on every math question.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U4_AREA_VOLUME: LessonPlan = {
  id: 'evelyn.testprep.dsat.area-volume.v1',
  title: 'Area & Volume',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.area-volume',
      standard: 'DSAT-4.1',
      description:
        'Compute areas and volumes of standard 2D and 3D figures using the SAT reference sheet, including composite figures and the effect of a linear scale factor on area (times k squared) and volume (times k cubed).',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame area/volume as free points because every formula needed is printed on the reference sheet — the difficulty is the scale-factor trap, not the arithmetic.',
      script:
        'Area and volume questions draw on formulas that are printed right on your reference sheet at the start of the math section — you never have to memorize them. The SAT makes these questions hard a different way: by asking what happens when a shape is scaled up or down. Learn that one trap and this becomes some of the fastest scoring on the test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-area-volume',
      kind: 'concept',
      goal: 'The reference-sheet formulas, composite figures, unit care, and the scale-factor trap for area (k squared) and volume (k cubed).',
      keyIdeas: [
        'REFERENCE SHEET — every digital SAT math section opens with a formula sheet: rectangle area A = lw, triangle area A = (1/2)bh, circle area A = πr² and circumference C = 2πr, plus volumes for a rectangular prism V = lwh, cylinder V = πr²h, sphere V = (4/3)πr³, and cone V = (1/3)πr²h, and the 30-60-90 / 45-45-90 special right-triangle ratios. You do not memorize these — you recognize which one a question needs.',
        'COMPOSITE FIGURES — many questions describe a shape built from two or more basic pieces (a rectangle with a semicircle on top, a cylinder with a cone drilled out). Break it into named pieces, apply the sheet formula to each, then ADD or SUBTRACT.',
        'UNITS — area is in squared units, volume in cubed units. If dimensions are given in mixed units (feet and inches), convert to one unit BEFORE plugging into a formula.',
        'THE SCALE-FACTOR TRAP — when every linear dimension of a figure is multiplied by a scale factor k, AREA is multiplied by k², and VOLUME is multiplied by k³. It is NOT multiplied by k. Double a radius (k = 2): area × 4, volume × 8. Triple a side (k = 3): area × 9, volume × 27.',
        'SPOTTING THE TRAP — the giveaway is wording like "similar," "scaled by a factor of," or "every dimension multiplied by," instead of two sets of raw numbers. That phrasing means apply kⁿ directly — you almost never need the original dimensions, only the original area/volume and k.',
        'WORKING BACKWARDS — if a question gives the old and new area or volume and asks for the scale factor, solve kⁿ = (new ÷ old), then take the nth root (square root for area, cube root for volume).',
        'DESMOS — the calculator is available on every math question. For a direct plug-in problem, just compute both values. For a scale-factor problem with no raw dimensions given, Desmos cannot save you — the kⁿ relationship is the only path.',
      ],
      vocabulary: [
        { term: 'scale factor', definition: 'the ratio k by which every linear dimension of a figure is multiplied to produce a similar figure.' },
        { term: 'similar figures', definition: 'figures with the same shape — corresponding angles equal, corresponding linear dimensions in a constant ratio k.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-composite',
      kind: 'worked_example',
      problem:
        'A window is a rectangle 4 feet wide and 6 feet tall, topped by a semicircle whose diameter equals the rectangle\'s width. Find the total area of the window, in terms of π.',
      steps: [
        'Split into two named pieces: the rectangle and the semicircle.',
        'Rectangle area: 4 × 6 = 24 square feet.',
        'Semicircle: diameter = 4, so radius = 2. Full circle area = π(2)² = 4π; a semicircle is half of that = 2π square feet.',
        'Total area = 24 + 2π square feet.',
      ],
      answer: '(24 + 2π) square feet',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scale-factor',
      kind: 'worked_example',
      problem:
        'A sphere has volume 36π cubic inches. A second sphere is similar to the first, with every linear dimension scaled by a factor of 2. What is the volume of the second sphere?',
      steps: [
        'This is a scale-factor question, not a plug-in-the-formula question — no radius is given, and none is needed.',
        'Volume scales by k³ for a linear scale factor k. Here k = 2, so volume is multiplied by 2³ = 8.',
        'New volume = 36π × 8 = 288π cubic inches. (A student who doubles 36π to 72π has fallen for the trap — that treats volume as if it scaled linearly.)',
      ],
      answer: '288π cubic inches',
      estimatedMinutes: 3,
    },
    {
      id: 'try-area-plugin',
      kind: 'try_yourself',
      problem: 'A circle has a radius of 6. What is its area, in terms of π?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '12π' },
        { id: 'b', text: '6π' },
        { id: 'c', text: '36π', correct: true },
        { id: 'd', text: '144π' },
      ],
      expectedAnswer: '36π',
      hints: ['Reference-sheet formula: Area = πr².', 'r = 6, so r² = 36 — don\'t confuse this with circumference (2πr = 12π) or use the diameter by mistake.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-volume-scale-trap',
      kind: 'try_yourself',
      problem:
        'A cube has volume 8 cubic centimeters. A larger, similar cube has every side length tripled. What is the volume of the larger cube, in cubic centimeters?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '24' },
        { id: 'b', text: '72' },
        { id: 'c', text: '216', correct: true },
        { id: 'd', text: '648' },
      ],
      expectedAnswer: '216',
      hints: [
        'Volume scales by k³ where k is the linear scale factor — not by k, and not by k².',
        'k = 3, so k³ = 27. Multiply the original volume by 27: 8 × 27 = 216.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-area-scale-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): A square has area 9. A similar square has each side length scaled by a factor of 4. What is the area of the new square?',
      responseFormat: 'numeric',
      expectedAnswer: '144',
      hints: ['Area scales by k² where k is the linear scale factor.', 'k = 4, so k² = 16. Multiply the original area by 16: 9 × 16 = 144.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-linear-scaling',
      kind: 'misconception_check',
      question:
        'A sphere has radius 4 and volume V. A second, similar sphere has radius 8. A student says the second sphere\'s volume is 2V, since the radius doubled. What went wrong?',
      commonErrors: [
        {
          answer: '2V',
          misconception: 'Assuming volume scales by the same factor as a linear dimension, instead of by the cube of the scale factor.',
          correctsTo:
            'The scale factor is k = 8/4 = 2, but volume scales by k³ = 8, not by k. The second sphere\'s volume is 8V, not 2V. (Direct check: V = (4/3)πr³, so doubling r multiplies V by 2³ = 8.)',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every reference-sheet formula (rectangle, triangle, circle areas; prism, cylinder, sphere, cone volumes) is given — know when to reach for each, not how to derive it.',
        'Composite figures: break into named pieces, then add or subtract areas/volumes.',
        'SCALE FACTOR: if every linear dimension scales by k, area scales by k² and volume scales by k³ — never by k itself.',
        'Watch for "similar," "scaled by," or "dimensions multiplied by" language — that\'s the signal to apply kⁿ directly instead of recomputing from raw dimensions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Area & Volume' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
