/**
 * GCSE Math Higher — Upper & Lower Bounds, Error Intervals.
 * AQA/Edexcel/OCR Higher tier. Truncation, rounding, error intervals,
 * bounds in calculations.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_BOUNDS_ERROR: LessonPlan = {
  id: 'evelyn.gcse.math.bounds-error.v1',
  title: 'GCSE Higher — Bounds & Error Intervals',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.bounds-error',
      description: 'Calculate upper and lower bounds for rounded values; combine bounds in calculations including division.',
      standard: 'GCSE-MATH-N15/N16',
    },
  ],
  prerequisites: ['gcse.math.surds-indices'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Bounds questions are short, examiner-friendly marks — yet half of Higher candidates lose them by computing the WRONG combination.',
      script: 'Bounds questions look like this: "A rectangle has length 12 cm to the nearest cm and width 5 cm to the nearest cm. Find the upper bound for its area." If you naively use 12 × 5 = 60, you get zero. The trick is knowing which bounds to combine — and that depends on the operation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-bounds',
      kind: 'concept',
      goal: 'Build the rule set: how rounding creates an interval, and which bounds combine for ±, ×, ÷.',
      keyIdeas: [
        'A value rounded to the nearest n has an error interval of ±n/2. Example: 12 cm to the nearest cm → 11.5 ≤ length < 12.5.',
        'TRUNCATION (cutting off): 7.8 truncated to 1 d.p. means 7.8 ≤ x < 7.9. Different lower bound from "rounded".',
        'ERROR INTERVAL notation: a ≤ x < b. Lower bound is INCLUSIVE, upper bound is EXCLUSIVE.',
        'ADDITION: max sum uses both upper bounds. min sum uses both lower bounds. (x + y)_UB = x_UB + y_UB.',
        'SUBTRACTION: max DIFFERENCE = (largest first) − (smallest second) = x_UB − y_LB. Min difference = x_LB − y_UB.',
        'MULTIPLICATION (positive values): max product = x_UB × y_UB. Min product = x_LB × y_LB.',
        'DIVISION (positive values): max quotient = (largest top) / (smallest bottom) = x_UB / y_LB. Min quotient = x_LB / y_UB.',
        'KEY RULE for ÷ and −: opposites. To MAXIMISE you take UB on top / LB on bottom (or first − second).',
      ],
      vocabulary: [
        { term: 'error interval', definition: 'the range a measured value could lie in given its rounding precision, written a ≤ x < b.' },
        { term: 'lower bound', definition: 'the smallest value a measurement could take given its rounding (e.g. 12 to nearest cm has lower bound 11.5).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-density',
      kind: 'worked_example',
      problem: 'A block has mass 240 g (to the nearest 10 g) and volume 80 cm³ (to the nearest cm³). Find the upper bound for its density.',
      steps: [
        'Identify error intervals. Mass to nearest 10 g: 235 ≤ m < 245. Volume to nearest cm³: 79.5 ≤ V < 80.5.',
        'Density = mass / volume. We want max density, so maximise the top and minimise the bottom.',
        'Max density = m_UB / V_LB = 245 / 79.5.',
        'Compute: 245 / 79.5 = 3.0817... ≈ 3.08 g/cm³ (3 s.f.).',
        'COMMON ERROR: students use 245/80.5 (mismatched). Always remember: UB ÷ LB for division max.',
      ],
      answer: '3.08 g/cm³ (3 s.f.)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A number x is given as 6.3 to 1 decimal place. Write the error interval for x.',
      expectedAnswer: '6.25 ≤ x < 6.35',
      responseFormat: 'free',
      hints: [
        'For "to 1 d.p." the error is ±0.05.',
        'Lower bound is included; upper bound is strictly less than.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-subtraction',
      kind: 'misconception_check',
      question: 'You measure x = 8 to nearest unit (so 7.5 ≤ x < 8.5) and y = 3 to nearest unit (so 2.5 ≤ y < 3.5). What is the upper bound of x − y?',
      commonErrors: [
        {
          answer: '8.5 − 3.5 = 5',
          misconception: 'Always pairing the upper bound with the upper bound, no matter the operation.',
          correctsTo: 'For subtraction, max difference = x_UB − y_LB = 8.5 − 2.5 = 6. Test it: take x as large as possible AND y as small as possible — the gap is biggest. Pairing UB with UB only works for + and ×.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Error interval for "x = a to nearest n": (a − n/2) ≤ x < (a + n/2).',
        'Addition / multiplication MAX: combine UB with UB.',
        'Subtraction MAX: x_UB − y_LB. Division MAX (positive): x_UB ÷ y_LB.',
        'Final answers usually require sensible degree of accuracy — never quote bounds to more decimal places than the precision allows.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A train travels d = 150 km (to nearest 10 km) in t = 2.0 hours (to nearest 0.1 h). Could the train have been travelling at exactly 75 km/h? Justify with bounds.',
      hint: 'Compute the bounds of speed = d/t. Lower bound 145/2.05 ≈ 70.7 km/h. Upper bound 155/1.95 ≈ 79.5 km/h. Since 75 lies inside [70.7, 79.5), yes — exactly 75 km/h is consistent with the measurements.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
