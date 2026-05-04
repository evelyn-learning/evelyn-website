/**
 * GCSE Math Higher — Exact Trigonometric Values.
 * Memorising sin/cos/tan at 0°, 30°, 45°, 60°, 90° + non-calculator
 * exam techniques.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_TRIG_EXACT_VALUES: LessonPlan = {
  id: 'evelyn.gcse.math.trig-exact-values.v1',
  title: 'GCSE Higher — Exact Trigonometric Values',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.trig-exact-values',
      description: 'Recall and apply exact values of sin, cos, tan at 0°, 30°, 45°, 60°, 90°; use them in non-calculator paper questions.',
      standard: 'GCSE-MATH-A11/G21',
    },
  ],
  prerequisites: ['gcse.math.sine-cosine-rules'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Non-calculator papers REQUIRE exact values — and the table is short enough to memorise once and use forever.',
      script: 'On the non-calculator paper, you\'ll see a problem like "find the exact area of a triangle with sides 4, 6 and included angle 30°". You can\'t reach for a calculator. You need the exact values of sin, cos, tan at the special angles. Five angles, three functions — fifteen entries to know.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-table',
      kind: 'concept',
      goal: 'The exact-values table + derivation from special triangles.',
      keyIdeas: [
        'TABLE TO MEMORISE: sin 0°=0, sin 30°=1/2, sin 45°=√2/2, sin 60°=√3/2, sin 90°=1.',
        'COSINE: cos 0°=1, cos 30°=√3/2, cos 45°=√2/2, cos 60°=1/2, cos 90°=0. NOTE: cos table is sin table read backwards.',
        'TANGENT: tan 0°=0, tan 30°=1/√3 (or √3/3), tan 45°=1, tan 60°=√3, tan 90° UNDEFINED. Always tan = sin/cos.',
        'PATTERN: sin values can be written 0/2, 1/2, √2/2, √3/2, 4/2 — i.e. √n/2 for n = 0, 1, 2, 3, 4. Same for cos backwards.',
        'DERIVATION FROM 45° TRIANGLE: isosceles right triangle with legs = 1. Hypotenuse = √2 (Pythagoras). sin 45° = opp/hyp = 1/√2 = √2/2. cos 45° = same. tan 45° = 1/1 = 1.',
        'DERIVATION FROM 30°-60°-90° TRIANGLE: equilateral triangle of side 2 cut in half. Half-base = 1. Height = √3 (Pythagoras: √(4 − 1)). sin 30° = 1/2, sin 60° = √3/2.',
        'NON-CALC TECHNIQUE: when you see a special angle in a question, swap straight to its exact value — never approximate.',
      ],
      vocabulary: [
        { term: 'special angles', definition: '0°, 30°, 45°, 60°, 90° — the angles whose sine, cosine, tangent values are simple expressions involving √2 and √3.' },
        { term: 'rationalised form', definition: 'the convention of clearing surds from denominators; e.g. write 1/√2 as √2/2.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-area-exact',
      kind: 'worked_example',
      problem: 'A triangle has sides 8 cm and 6 cm with included angle 60°. Find the EXACT area.',
      steps: [
        'Use Area = (1/2)ab sin C with a = 8, b = 6, C = 60°.',
        'Substitute: Area = (1/2)·8·6·sin 60°.',
        'Recall sin 60° = √3/2 (exact).',
        'Compute: (1/2)·8·6·(√3/2) = (1/2)·48·(√3/2) = 24·(√3/2) = 12√3.',
        'Final: Area = 12√3 cm². (Approximate value 12·1.732 ≈ 20.8 cm² — but the exact form is what is asked for.)',
      ],
      answer: '12√3 cm²',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Without a calculator, evaluate (sin 60°)² + (cos 60°)². Express the answer in simplest form.',
      expectedAnswer: '1',
      responseFormat: 'numeric',
      hints: [
        'sin 60° = √3/2, cos 60° = 1/2.',
        '(√3/2)² = 3/4, (1/2)² = 1/4.',
        'Add 3/4 + 1/4. (This is the Pythagorean identity sin²θ + cos²θ = 1.)',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tan-30',
      kind: 'misconception_check',
      question: 'A student writes tan 30° = √3. Is this correct?',
      commonErrors: [
        {
          answer: 'tan 30° = √3',
          misconception: 'Confusing tan 30° with tan 60°.',
          correctsTo: 'tan 30° = 1/√3 = √3/3 (rationalised). tan 60° = √3. They are reciprocals: tan 30° × tan 60° = (1/√3)(√3) = 1. Mnemonic: 30° is the SMALLER angle in the 30-60-90 triangle, so its tangent (opposite/adjacent) is smaller. Specifically opposite = 1, adjacent = √3 → tan 30° = 1/√3.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'sin: 0, 1/2, √2/2, √3/2, 1 at 0°, 30°, 45°, 60°, 90°.',
        'cos: same list reversed.',
        'tan: 0, 1/√3, 1, √3, undefined.',
        'On non-calc papers, never approximate — keep √2 and √3 in the answer.',
        'sin²θ + cos²θ = 1 always.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Without a calculator, find the exact length of the third side of a triangle with sides 5 and 7 and included angle 60°.',
      hint: 'Cosine rule: a² = 5² + 7² − 2·5·7·cos 60° = 25 + 49 − 70·(1/2) = 74 − 35 = 39. So a = √39 cm. (Exact form expected; ≈ 6.24 cm.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
