/**
 * SAT Math — Percent Problems.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_PERCENT: LessonPlan = {
  id: 'evelyn.testprep.sat-math.percent.v1',
  title: 'SAT Math — Percent (Change, Original Value, Compound)',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.percent', description: 'Solve SAT percent problems: percent change, finding original from final, compound percent changes.', standard: 'CCSS.MATH.HSA.SSE.A.1' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Percent is the most-tested PSDA topic — and the most-missed because of compounding traps.', script: 'A 10% increase followed by a 10% decrease does NOT bring you back to the start. Why? Compounding. Today we drill percent calculations + the SAT traps.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Percent of, percent change, finding original, compound percentages.', keyIdeas: [
      'PERCENT = "per hundred." 25% = 25/100 = 0.25.',
      'PERCENT OF: "20% of 80" = 0.20 × 80 = 16.',
      'PERCENT CHANGE: (new − old) / old × 100. ALWAYS divide by ORIGINAL value.',
      '  Increase: positive %.',
      '  Decrease: negative %.',
      '  Example: $40 → $50. Change = 10/40 = 25% increase.',
      'INCREASE BY p%: multiply by (1 + p/100). +20% means × 1.20.',
      'DECREASE BY p%: multiply by (1 − p/100). −20% means × 0.80.',
      'FINDING ORIGINAL from final + percent:',
      '  After 25% increase, value is $50. Original = ?',
      '  $50 = original × 1.25. Original = $50/1.25 = $40.',
      '  KEY: divide final by the multiplier (1.25), don\'t just subtract 25%.',
      'COMPOUND percentages (sequential):',
      '  10% increase then 10% decrease: × 1.10 × 0.90 = × 0.99. NET: 1% DECREASE.',
      '  Don\'t add: 10% − 10% ≠ 0%. Multiply the multipliers.',
      '  20% increase then 20% increase: × 1.20 × 1.20 = × 1.44. NET: 44% increase, not 40%.',
      'SAT TRAP: "By what percent did x change?" — DIVIDE BY ORIGINAL, not by new value.',
      '  $50 → $40. Change = 10/50 = 20% decrease (not 10/40 = 25%).',
    ], vocabulary: [{ term: 'percent change', definition: '(new − old) / old × 100; always divide by original value.' }, { term: 'compound percent', definition: 'sequential percent changes multiply, don\'t add.' }], estimatedMinutes: 4 },
    { id: 'worked', kind: 'worked_example', problem: 'A jacket originally cost $80. It was discounted 25%. Then sales tax of 8% was added. What was the final price?', steps: [
      '25% discount: × 0.75. New price = 80 × 0.75 = $60.',
      'Then 8% tax: × 1.08. Final = 60 × 1.08 = $64.80.',
      'Sanity check: $80 → $60 (after discount) → $64.80 (after tax) ≈ $65 — reasonable.',
    ], answer: '$64.80', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A stock increases 20% one year, then DECREASES 20% the next year. What\'s the net change?', expectedAnswer: 'Multiplier: 1.20 × 0.80 = 0.96. Net change: −4%. The stock is 4% LOWER than at start, not back to start. Compounding!', responseFormat: 'free', hints: ['Multiply the two multipliers, don\'t add the percentages.', '+20% then −20% does NOT cancel out.'], estimatedMinutes: 2 },
    { id: 'misconception-percent-base', kind: 'misconception_check', question: 'A student computes percent change from $50 to $40 by dividing 10/40 = 25%. What\'s wrong?', commonErrors: [{ answer: '10/40 = 25%', misconception: 'Dividing by FINAL value instead of ORIGINAL.', correctsTo: 'Percent change is ALWAYS computed relative to ORIGINAL value, not new. Change: 50 − 40 = 10. Original: 50. So percent decrease = 10/50 = 20%. Dividing by 40 gives 25% — the WRONG answer. SAT specifically tests this trap; always identify what\'s the "original" reference.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Percent change = (new − old)/old × 100. Always divide by ORIGINAL.', 'Increase by p%: × (1 + p/100).', 'Compound percentages MULTIPLY, don\'t add.', '+20% then −20% ≠ 0% (= −4%).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
