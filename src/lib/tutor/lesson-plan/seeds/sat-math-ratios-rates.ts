/**
 * SAT Math — Ratios, Rates, and Unit Conversion.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_RATIOS_RATES: LessonPlan = {
  id: 'evelyn.testprep.sat-math.ratios-rates.v1',
  title: 'SAT Math — Ratios, Rates, and Unit Conversion',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.ratios-rates', description: 'Solve SAT ratio, rate, and unit-conversion problems using proportional reasoning.', standard: 'CCSS.MATH.HSA.SSE.A.1' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Ratios + rates appear in every SAT — and dimensional analysis (units cancellation) is the unifying tool.', script: 'How fast in mph is 100 km/hr? How long does it take to fill a tank at a given rate? These all use the same skill: track units carefully and let them cancel. SAT loves this.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Ratio language, proportions, rates, dimensional analysis.', keyIdeas: [
      'RATIO compares two quantities. "3:5" = 3 parts to 5 parts.',
      '  Total parts: 3 + 5 = 8. Each part = total / 8.',
      '  Example: 40 students with boys:girls = 3:5. Each part = 40/8 = 5. Boys = 15, girls = 25.',
      'PROPORTION sets two ratios equal: a/b = c/d.',
      '  Cross-multiply: ad = bc.',
      '  Solve for unknown.',
      '  Example: 3/4 = x/12 → 4x = 36 → x = 9.',
      'RATE = quantity per unit (miles per hour, dollars per item).',
      '  Distance / Time = Speed.',
      '  Work / Time = Rate of work.',
      'UNIT CONVERSION (dimensional analysis):',
      '  Multiply by conversion factor written so units CANCEL.',
      '  Example: 60 miles/hour × 1 hour/60 min = 1 mile/min.',
      '  Example: 100 km/hr × 0.621 mi/km ≈ 62.1 mph.',
      '  Strategy: write the GIVEN, multiply by what cancels the unwanted unit.',
      'SAT-COMMON conversions to memorise:',
      '  Length: 12 in = 1 ft. 3 ft = 1 yd. 5280 ft = 1 mile.',
      '  Time: 60 sec = 1 min. 60 min = 1 hr. 24 hr = 1 day.',
      '  Volume: 16 oz = 1 lb (in cooking). 1 gallon = 4 quarts.',
      'SAT often gives a CONVERSION FACTOR in the question: "1 km = 0.621 miles." USE IT.',
      'WORK problems: if A does a job in 4 hr and B in 6 hr, together they do (1/4 + 1/6) = 5/12 of the job per hour. Together, complete in 12/5 = 2.4 hours.',
    ], vocabulary: [{ term: 'proportion', definition: 'an equation stating two ratios are equal: a/b = c/d.' }, { term: 'rate', definition: 'a quantity expressed per unit of another (miles per hour, dollars per item).' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'A car travels 75 miles on 3 gallons of fuel. At this rate, how many gallons are needed for 250 miles?', steps: [
      'Set up proportion: 75 miles / 3 gallons = 250 miles / x gallons.',
      'Cross-multiply: 75x = 750.',
      'x = 10 gallons.',
      'Reasonable: 250 miles is more than 3× the original 75; needs more than 3× the gallons (would be 9 gallons for 225). 10 for 250 is consistent.',
    ], answer: '10 gallons', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Convert 60 miles per hour to feet per second. (1 mile = 5280 ft.)', expectedAnswer: '60 mi/hr × 5280 ft/mi × 1 hr/3600 sec = 60 × 5280 / 3600 ft/sec = 88 ft/sec.', responseFormat: 'numeric', hints: ['Multiply by conversion factors so units cancel.', 'mi/hr × ft/mi × hr/sec = ft/sec.'], estimatedMinutes: 3 },
    { id: 'misconception-ratio-vs-fraction', kind: 'misconception_check', question: 'A student treats "3 to 5" as if it means 3/5 of the total. What\'s the right interpretation?', commonErrors: [{ answer: '3:5 = 3/5 of total', misconception: 'Confusing ratio of parts with fraction of whole.', correctsTo: 'A 3:5 ratio means 3 PARTS to 5 PARTS, with TOTAL = 8 PARTS. The first quantity is 3/8 of the total, the second is 5/8. NOT 3/5. So "boys to girls = 3:5 in a class of 40" means boys = 3/8 × 40 = 15, NOT 3/5 × 40 = 24. SAT routinely tests this distinction.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Ratio: 3:5 means 3 parts + 5 parts = 8 parts total.', 'Proportion: cross-multiply.', 'Unit conversion: multiply by factor that cancels unwanted units.', 'Common conversions (mile, foot, hour) — memorise.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
