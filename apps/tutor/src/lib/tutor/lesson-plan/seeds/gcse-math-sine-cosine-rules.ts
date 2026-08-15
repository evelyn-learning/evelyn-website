/**
 * GCSE Math Higher — Sine Rule, Cosine Rule, Area = ½ab sin C.
 * Non-right-angled triangle trigonometry.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_SINE_COSINE_RULES: LessonPlan = {
  id: 'evelyn.gcse.math.sine-cosine-rules.v1',
  title: 'GCSE Higher — Sine & Cosine Rules',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.sine-cosine-rules',
      description: 'Apply the sine rule, cosine rule, and area formula ½ab sin C to non-right-angled triangles.',
      standard: 'GCSE-MATH-G22/G23',
    },
  ],
  prerequisites: [],
  followUps: ['gcse.math.trig-exact-values'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Right-angle trig (SOHCAHTOA) only handles right triangles. Sine and cosine rules unlock everything else.',
      script: 'A surveying problem, a navigation question, a dynamics setup with three forces — almost any triangle in the real world is NOT right-angled. The sine and cosine rules are the universal tools. Choosing between them is the only judgement call.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'State both rules, the area formula, and the choice criterion.',
      keyIdeas: [
        'NOTATION: in triangle ABC, the side opposite vertex A is lowercase a; opposite B is b; opposite C is c. Memorise this — every formula uses it.',
        'SINE RULE: a/sin A = b/sin B = c/sin C. Use when you have a side AND its opposite angle (a known pair) plus one extra side or angle.',
        'COSINE RULE: a² = b² + c² − 2bc·cos A. Use when (a) you know two sides and the INCLUDED angle and want the third side, or (b) you know all three sides and want any angle.',
        'AREA FORMULA: Area = (1/2)ab sin C. Two sides and the included angle. (Two pairs labelled — use the angle BETWEEN the two known sides.)',
        'CHOICE FLOWCHART: Have a side-angle PAIR? → Sine rule. Have SAS or SSS? → Cosine rule. Want the area? → ½ab sin C with the included angle.',
        'AMBIGUOUS CASE (sine rule for angles): when you compute sin⁻¹(value), there\'s a possible second angle 180° − that value. Check whether both are geometrically possible — sometimes only one fits.',
        'WHEN TO REARRANGE: cosine rule for an angle: cos A = (b² + c² − a²)/(2bc). Solve for A by inverse cosine.',
      ],
      vocabulary: [
        { term: 'included angle', definition: 'the angle between two specified sides of a triangle.' },
        { term: 'ambiguous case', definition: 'in the sine rule, when sin θ = value has two valid solutions (θ and 180° − θ), and either could fit the triangle.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cosine-rule',
      kind: 'worked_example',
      problem: 'In triangle ABC, AB = 7 cm, AC = 9 cm, angle BAC = 50°. Find the length of BC, giving your answer to 1 d.p.',
      steps: [
        'Identify what\'s known: SAS (two sides AB and AC, plus their included angle BAC). Use cosine rule.',
        'Label per convention: side a = BC (opposite A), b = AC = 9, c = AB = 7, angle A = 50°.',
        'Cosine rule: a² = b² + c² − 2bc·cos A = 9² + 7² − 2·9·7·cos 50°.',
        'Compute: 81 + 49 − 126·cos 50°.',
        'cos 50° ≈ 0.6428. So 126 × 0.6428 ≈ 80.99.',
        'a² ≈ 81 + 49 − 80.99 = 49.01.',
        'a ≈ √49.01 ≈ 7.0 cm.',
        'Final: BC ≈ 7.0 cm (1 d.p.).',
      ],
      answer: 'BC ≈ 7.0 cm',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In triangle PQR, angle P = 35°, angle Q = 65°, side PQ = 8 cm. Find side QR to 1 d.p.',
      expectedAnswer: 'QR ≈ 4.7 cm',
      responseFormat: 'free',
      hints: [
        'You have a side PQ with its opposite angle R = 180 − 35 − 65 = 80°. Use sine rule.',
        'QR/sin P = PQ/sin R → QR = PQ·sin P / sin R = 8·sin 35° / sin 80°.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-include-angle',
      kind: 'misconception_check',
      question: 'A student computes the area of triangle ABC where AB = 5, BC = 7, angle ABC = 60° using ½(5)(7)sin 60° and gets ≈ 15.16. Then they\'re asked for the area of triangle PQR where PQ = 5, QR = 7, angle QPR = 60°. They write the same formula. Correct?',
      commonErrors: [
        {
          answer: 'Same formula, area ≈ 15.16',
          misconception: 'Using ½ab sin C without checking whether C is the INCLUDED angle.',
          correctsTo: 'In triangle ABC: angle ABC IS the included angle between sides AB and BC. ✓ In triangle PQR: angle QPR is at vertex P, which is between sides PQ and PR — NOT between PQ and QR. The angle between PQ and QR is angle PQR. So you can\'t use 5, 7, and angle QPR directly. You\'d need to find angle PQR first (using sine rule on the side-angle pair PQ-angleP and QR), THEN apply the area formula. Always check the angle is sandwiched between the two named sides.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sine rule when you have a side-angle PAIR.',
        'Cosine rule when you have SAS (find the third side) or SSS (find any angle).',
        'Area = ½ab sin C — angle MUST be between the two given sides.',
        'Watch for the ambiguous case in the sine rule for angles.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A triangle has sides 8 cm, 11 cm, 14 cm. Find the largest angle.',
      hint: 'Largest angle is opposite the longest side (14). Cosine rule: cos A = (8² + 11² − 14²)/(2·8·11) = (64 + 121 − 196)/176 = −11/176 = −0.0625. A = cos⁻¹(−0.0625) ≈ 93.6°. (Negative cosine → obtuse, makes sense for the largest angle.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
