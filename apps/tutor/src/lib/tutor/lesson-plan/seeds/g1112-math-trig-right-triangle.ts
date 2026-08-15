/**
 * Grades 11-12 Math — Trigonometry: Right Triangle (SOHCAHTOA).
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_TRIG_RIGHT_TRIANGLE: LessonPlan = {
  id: 'evelyn.g1112.math.trig.right-triangle.v1',
  title: 'Trigonometry — Right Triangle (SOHCAHTOA)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'trigonometry',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.trig.right-triangle',
      description: 'Use sine, cosine, and tangent ratios to solve for unknown sides and angles in right triangles.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.C.6-8',
    },
  ],
  prerequisites: ['g10.math.right-triangle-trig'],
  followUps: ['g1112.math.trig.unit-circle'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'SOHCAHTOA links angles to side ratios — every right-triangle problem gets solved with these three ratios.',
      script: 'In a right triangle, knowing one acute angle plus one side gives you everything else. The ratios are fixed: sin = opp/hyp, cos = adj/hyp, tan = opp/adj. SOHCAHTOA is the mnemonic. Master these three and you handle every right-triangle problem.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sohcahtoa',
      kind: 'concept',
      goal: 'Three ratios, identifying opposite/adjacent/hypotenuse, solving for sides and angles, special triangles.',
      keyIdeas: [
        'IN A RIGHT TRIANGLE with acute angle θ:',
        '  HYPOTENUSE = the side opposite the right angle (always the longest side).',
        '  OPPOSITE (to θ) = the side directly across from θ.',
        '  ADJACENT (to θ) = the leg next to θ that ISN\'T the hypotenuse.',
        'THE THREE RATIOS:',
        '  sin θ = OPPOSITE / HYPOTENUSE.',
        '  cos θ = ADJACENT / HYPOTENUSE.',
        '  tan θ = OPPOSITE / ADJACENT.',
        'MNEMONIC: SOH-CAH-TOA. (Sine = Opp/Hyp, Cosine = Adj/Hyp, Tangent = Opp/Adj.)',
        'TO SOLVE FOR A SIDE: pick the ratio that relates the angle, the known side, and the unknown side. Set up the ratio, solve.',
        'TO SOLVE FOR AN ANGLE: pick the ratio of the two known sides. Apply the inverse function: θ = sin⁻¹(opp/hyp), cos⁻¹(adj/hyp), or tan⁻¹(opp/adj). Calculator must be in DEGREE mode (or radian, depending on context).',
        'SPECIAL TRIANGLES (memorise):',
        '  30-60-90: side ratios 1 : √3 : 2 (short leg : long leg : hypotenuse).',
        '  45-45-90: side ratios 1 : 1 : √2.',
        'These give exact values like sin 30° = 1/2, cos 45° = √2/2, tan 60° = √3.',
        'CALCULATOR NOTES: sin⁻¹ ≠ 1/sin. The −1 here is INVERSE FUNCTION notation, returning the angle. To compute the reciprocal of sine (cosecant), use 1/sin θ.',
      ],
      vocabulary: [
        { term: 'hypotenuse', definition: 'the side opposite the right angle in a right triangle; always the longest side.' },
        { term: 'inverse trig function', definition: 'sin⁻¹, cos⁻¹, tan⁻¹ — return an angle whose ratio matches the input value.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A ladder leans against a wall, making a 65° angle with the ground. The ladder is 12 feet long. How high up the wall does it reach?',
      steps: [
        'Sketch a right triangle: ground = adjacent, wall = opposite, ladder = hypotenuse.',
        'Known: angle θ = 65°, hypotenuse = 12 ft. Want: opposite (height up wall).',
        'Ratio relating opposite and hypotenuse: SINE.',
        'sin 65° = opposite / 12.',
        'Calculator (degree mode): sin 65° ≈ 0.9063.',
        'Solve: opposite = 12 × 0.9063 ≈ 10.88 ft.',
        'Reasonable check: a steep 65° lean on a 12-ft ladder reaches about 11 ft up the wall — sensible.',
      ],
      answer: '≈ 10.88 ft up the wall',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A ramp 25 feet long rises 4 feet vertically. What angle does the ramp make with the ground?',
      expectedAnswer: 'Sketch: vertical rise (opposite) = 4, ramp length (hypotenuse) = 25. Use sine: sin θ = 4/25 = 0.16. θ = sin⁻¹(0.16) ≈ 9.21°.',
      responseFormat: 'free',
      hints: [
        'Identify which side is opposite the angle and which is the hypotenuse.',
        'Use sin (opp/hyp), then take the inverse to find the angle.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-ratio-flip',
      kind: 'misconception_check',
      question: 'A student needs to find the angle whose adjacent side is 8 and hypotenuse is 10, but writes θ = sin⁻¹(8/10). Why is this wrong?',
      commonErrors: [
        {
          answer: 'Uses sin instead of cos',
          misconception: 'Picking the wrong ratio when adjacent and hypotenuse are given.',
          correctsTo: 'Adjacent and hypotenuse → COSINE (CAH: Cos = Adj/Hyp). Sine uses opposite, not adjacent. Correct: θ = cos⁻¹(8/10) ≈ 36.87°. The fix: write the three ratios SOH-CAH-TOA next to each problem and circle which sides you have, then read off the matching ratio. Don\'t freestyle.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'sin = O/H, cos = A/H, tan = O/A. SOH-CAH-TOA.',
        'To find a side: choose the ratio that matches the angle and known side.',
        'To find an angle: use the inverse function on the ratio of two known sides.',
        'Calculator MODE matters — degree vs radian.',
        'Memorise 30-60-90 (1 : √3 : 2) and 45-45-90 (1 : 1 : √2).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
