/**
 * ACT — Math / Trigonometry: SOHCAHTOA through the unit circle.
 *
 * ACT trig runs broader than the SAT's right-triangle-only slice: it starts
 * at SOHCAHTOA and special triangles, then reaches into radians, the unit
 * circle, the Pythagorean identity (sin²θ + cos²θ = 1), and non-right
 * triangles via the laws of sines/cosines. Roughly 4-6 of the 60 Math
 * questions test trig, usually in the back third of the section, at
 * ~60 seconds per question with a calculator allowed.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_TRIGONOMETRY: LessonPlan = {
  id: 'evelyn.testprep.act.trigonometry.v1',
  title: 'Trigonometry',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.trigonometry',
      standard: 'ACT-2.9',
      description:
        'Apply SOHCAHTOA, the unit circle, radian measure, the Pythagorean identity, and the laws of sines and cosines to solve for angles and side lengths in ACT Math trigonometry questions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe ACT trig as a small, learnable toolkit, not a huge topic — and set the pacing expectation.',
      script:
        'Trigonometry shows up on about 4 to 6 of the ACT\'s 60 Math questions, almost always in the back third of the section where the format shifts from pure algebra into geometry and trig. At one minute per question with a calculator allowed, that\'s time you can bank — IF you know the small toolkit cold: SOHCAHTOA, the unit circle, radians, one identity, and two triangle laws the test always hands you when you need them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trig-basics',
      kind: 'concept',
      goal: 'The full ACT trig toolkit: SOHCAHTOA, radians, unit circle, quadrant signs, reference angles, the Pythagorean identity, and the laws of sines/cosines.',
      keyIdeas: [
        'SOHCAHTOA: sin θ = opposite/hypotenuse; cos θ = adjacent/hypotenuse; tan θ = opposite/adjacent. Always confirm WHICH angle θ is before labeling sides — opposite and adjacent flip depending on the angle.',
        'RADIANS: π radians = 180°. Convert with θ_rad = θ_deg × (π/180) and θ_deg = θ_rad × (180/π). The ACT mixes both units, so check which one a problem is using before you compute anything.',
        'UNIT CIRCLE: the circle of radius 1 centered at the origin. For any angle θ measured counterclockwise from the positive x-axis, the point on the circle is (cos θ, sin θ) — cosine is the x-coordinate, sine is the y-coordinate.',
        'QUADRANT SIGNS: in Quadrant I all ratios are positive; in QII only sine (and csc) is positive; in QIII only tangent (and cot) is positive; in QIV only cosine (and sec) is positive. Mnemonic: All Students Take Calculus.',
        'REFERENCE ANGLE: the acute angle between an angle\'s terminal side and the x-axis. A trig value of any angle equals the same trig value of its reference angle, with the sign set by the quadrant.',
        'PYTHAGOREAN IDENTITY: sin²θ + cos²θ = 1 for any angle θ. Given one ratio, solve for the magnitude of the other — but the identity alone never tells you the sign; the quadrant does.',
        'LAWS OF SINES/COSINES: for triangles that aren\'t right triangles, the ACT GIVES you the formula in the problem when you need it — Law of Sines: a/sin A = b/sin B = c/sin C. Law of Cosines: c² = a² + b² − 2ab·cos C. Your job is to recognize when a triangle isn\'t right and plug the given numbers in correctly.',
        'TRAP PATTERN: distractors routinely swap which side is "opposite" vs "adjacent" to the angle in question, or drop the sign that a quadrant should have added to an identity-derived value.',
      ],
      vocabulary: [
        { term: 'radian', definition: 'a unit of angle measure where 2π radians = 360°; commonly appears as fractions of π on the ACT (e.g. π/6, 2π/3).' },
        { term: 'unit circle', definition: 'the circle of radius 1 centered at the origin, used to define sin θ and cos θ as coordinates for any angle, not just acute ones.' },
        { term: 'reference angle', definition: 'the acute angle between an angle\'s terminal side and the x-axis — used to find trig values for angles outside Quadrant I.' },
        { term: 'Law of Sines / Law of Cosines', definition: 'formulas relating the sides and angles of ANY triangle, not just right triangles; the ACT always supplies the formula when a problem needs it.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sohcahtoa',
      kind: 'worked_example',
      problem:
        'A right triangle has a hypotenuse of 25 and one leg of length 7. Find cos θ, where θ is the angle between the hypotenuse and the other leg.',
      steps: [
        'Find the missing leg with the Pythagorean theorem: 7² + b² = 25² ⟹ 49 + b² = 625 ⟹ b² = 576 ⟹ b = 24. (This is a 7-24-25 triple.)',
        'θ is the angle between the hypotenuse and the leg of length 24 — so relative to θ, that leg of length 24 is ADJACENT, and the hypotenuse is 25.',
        'cos θ = adjacent/hypotenuse = 24/25.',
      ],
      answer: 'cos θ = 24/25',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-quadrant-sign-trap',
      kind: 'worked_example',
      problem:
        'θ is an angle in Quadrant II (90° < θ < 180°) with sin θ = 3/5. Use the Pythagorean identity to find cos θ.',
      steps: [
        'Start from sin²θ + cos²θ = 1.',
        'cos²θ = 1 − sin²θ = 1 − (3/5)² = 1 − 9/25 = 16/25.',
        'cos θ = ±4/5 — the identity alone can\'t tell you the sign; only the quadrant can.',
        'TRAP: θ is in Quadrant II, where cosine is NEGATIVE (only sine is positive there). So cos θ = −4/5, not +4/5.',
      ],
      answer: 'cos θ = −4/5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sohcahtoa-basic',
      kind: 'try_yourself',
      problem:
        'A right triangle has a hypotenuse of 10 and one leg of length 6. What is sin θ, where θ is the angle opposite the OTHER leg (the one you must solve for first)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3/5' },
        { id: 'b', text: '4/5', correct: true },
        { id: 'c', text: '5/4' },
        { id: 'd', text: '4/3' },
      ],
      expectedAnswer: '4/5',
      hints: [
        'Find the missing leg with the Pythagorean theorem first — this is a 6-8-10 triangle.',
        'sin = opposite/hypotenuse, and θ is opposite the leg you just solved for (length 8): 8/10 = 4/5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-unit-circle-radians',
      kind: 'try_yourself',
      problem: 'What is the value of cos(2π/3)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/2' },
        { id: 'b', text: '−1/2', correct: true },
        { id: 'c', text: '√3/2' },
        { id: 'd', text: '−√3/2' },
      ],
      expectedAnswer: '−1/2',
      hints: [
        'Convert to degrees: 2π/3 rad = 120°.',
        'The reference angle is 60° (π/3), where cos = 1/2 — but 120° is in Quadrant II, where cosine is negative.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-law-of-sines',
      kind: 'try_yourself',
      problem:
        'In triangle ABC (not a right triangle), angle A = 30°, angle B = 45°, and side a (opposite angle A) has length 10. Using the Law of Sines, a/sin A = b/sin B, find the length of side b (opposite angle B), rounded to the nearest tenth. Type your answer:',
      responseFormat: 'numeric',
      expectedAnswer: '14.1 (b = 10 × sin 45° / sin 30° = 10 × (√2/2) / (1/2) = 10√2 ≈ 14.1)',
      hints: [
        'Rearrange the Law of Sines to solve for b: b = a × sin B / sin A.',
        'sin 30° = 0.5 and sin 45° ≈ 0.7071, so b = 10 × 0.7071 / 0.5 ≈ 14.1.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-calculator-mode',
      kind: 'misconception_check',
      question:
        'A student needs sin(30°) and types "sin(30)" into a calculator that\'s set to RADIAN mode, getting about −0.988. What went wrong, and what should the student have gotten?',
      commonErrors: [
        {
          answer: '−0.988 is the correct value of sin(30°)',
          misconception: 'Not checking that the calculator\'s angle mode (degrees vs radians) matches the units in the problem.',
          correctsTo:
            'Always check the mode indicator before evaluating a trig expression. "30" in radian mode means 30 radians (way more than one full rotation), not 30°. Switched to degree mode, sin(30°) = 0.5. If a problem instead gives an angle in radians (e.g. sin(π/6)), switch to radian mode. Mixing up degree/radian mode is one of the most common wrong-answer traps on ACT trig items.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SOHCAHTOA: pin down WHICH angle you\'re finding before labeling opposite/adjacent — the same triangle gives different ratios for different angles.',
        'The unit circle defines cos θ and sin θ as the x- and y-coordinates of a point at angle θ — their signs flip by quadrant (All Students Take Calculus).',
        'sin²θ + cos²θ = 1 only gives you a magnitude; use the quadrant to choose the sign.',
        'Check your calculator\'s angle mode (degrees vs radians) before evaluating — and trust the Law of Sines/Cosines formulas whenever the ACT hands them to you.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.9', cedTitle: 'Trigonometry' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
