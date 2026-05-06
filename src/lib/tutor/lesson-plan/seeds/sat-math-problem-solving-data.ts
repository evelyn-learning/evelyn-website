/**
 * SAT — Math: Problem Solving and Data Analysis (ratios, percent,
 * unit rates, statistics, scatter plots).
 *
 * The SAT's PSDA domain — about 30% of the math section. Heavy
 * emphasis on real-world quantitative reasoning: ratios and
 * proportions, percent (and percent CHANGE), unit conversions,
 * reading scatter plots and tables, mean/median/mode, basic
 * probability.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_PROBLEM_SOLVING_DATA: LessonPlan = {
  id: 'evelyn.testprep.sat.math.problem-solving-data.v1',
  title: 'SAT Math: Problem Solving and Data Analysis',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [
    {
      id: 'sat.math.psda',
      description: 'Apply ratios, percent, unit rates, statistics, and data interpretation to SAT problems.',
    },
  ],
  prerequisites: ['ccss.math.7.rp.a.2'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame PSDA as the most-real-world part of the SAT.',
      script: 'Roughly 17 of 58 SAT Math questions are "Problem Solving and Data Analysis." These look least like school math — they\'re scatter plots, percent changes, unit conversions, statistics. The SAT loves these because they test if you can REASON about numbers, not just compute.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-psda',
      kind: 'concept',
      goal: 'Six high-frequency PSDA topics with the SAT-specific moves.',
      keyIdeas: [
        '1) PROPORTIONS / RATIOS. Set up a/b = c/d and cross-multiply. SAT often hides this in word problems ("If 6 cans of paint cover 240 square feet, how many for 600?").',
        '2) PERCENT. Three flavors:',
        '   - "X% of Y" → 0.0X × Y.',
        '   - PERCENT CHANGE: (new − old) / old × 100. Always divide by ORIGINAL, not the new.',
        '   - PERCENT INCREASE/DECREASE: 20% increase = multiply by 1.20; 20% decrease = multiply by 0.80.',
        '3) UNIT CONVERSIONS. "Dimensional analysis": multiply by fractions equal to 1 to swap units. "60 mph × (1 hr / 3600 s) × (1609 m / 1 mi) = 26.8 m/s".',
        '4) STATISTICS — mean, median, mode.',
        '   - Mean = sum / count.',
        '   - Median = middle value when sorted (or average of two middles).',
        '   - Mode = most-frequent value.',
        '   - SAT trap: "How does the median change if you remove the largest value?" The median of a list shifts predictably.',
        '5) SCATTER PLOTS — lines of best fit, positive vs negative correlation, predicting from a graph.',
        '6) PROBABILITY (one-step). favorable outcomes / total outcomes. SAT also asks conditional probability from tables — read the row OR column total carefully.',
        'SAT GENERAL TIP: when a question gives you a table or graph, READ THE LABELS first. Half the missed points come from misreading what a column means.',
      ],
      vocabulary: [
        { term: 'percent change', definition: '(new - old) / old × 100. Always divide by original.' },
        { term: 'mean', definition: 'sum divided by count — the average.' },
        { term: 'median', definition: 'middle value when sorted.' },
        { term: 'line of best fit', definition: 'a line that approximates the trend of scatter-plot data.' },
      ],
      suggestedTools: ['show_equation', 'show_table', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-percent-change',
      kind: 'worked_example',
      problem: 'A stock went from $80 to $92. What is the percent increase?',
      steps: [
        'Percent change formula: (new - old) / old × 100.',
        '(92 - 80) / 80 = 12 / 80 = 0.15 = 15%.',
        'Trap to avoid: dividing by 92 instead of 80 → 13%. Wrong. ALWAYS divide by ORIGINAL value.',
      ],
      answer: '15%',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-proportion',
      kind: 'worked_example',
      problem: 'A 5-pound bag of birdseed lasts 18 days. How many pounds are needed for 45 days?',
      steps: [
        'Set up: 5 lbs / 18 days = X lbs / 45 days.',
        'Cross-multiply: 5 × 45 = 18X → 225 = 18X → X = 12.5 lbs.',
      ],
      answer: '12.5 pounds',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A shirt is on sale for 25% off, now priced at $30. What was the original price?',
      expectedAnswer: '40',
      responseFormat: 'numeric',
      hints: [
        '25% off means you pay 75% of original. So 30 = 0.75 × original.',
        'Original = 30 / 0.75.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-percent-of-percent',
      kind: 'misconception_check',
      question: 'A jacket\'s price increases 20%, then decreases 20%. Sage says it\'s back to the original price. Right?',
      commonErrors: [
        {
          answer: 'yes — same percent up and down',
          misconception: 'Treating consecutive percent changes as if they cancel.',
          correctsTo: 'Wrong. Percentages are RELATIVE to whatever the current value is. Start at $100 → +20% → $120 → -20% (of $120) → $96. NOT back to $100. The 20% decrease is bigger in absolute dollars (relative to a bigger number) but doesn\'t fully reverse the increase.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PSDA = ~30% of SAT Math. High-leverage.',
        'Percent change: divide by ORIGINAL value, not new.',
        'Proportions: cross-multiply. Watch units.',
        'Mean / median / mode — know the difference.',
        'Read graph and table labels carefully — the SAT loves to test that.',
        'Consecutive percentages don\'t simply cancel.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A car\'s gas mileage is 32 mpg. Convert to km per liter (1 mile = 1.609 km, 1 gallon = 3.785 L).',
      hint: '32 mi/gal × (1.609 km / 1 mi) × (1 gal / 3.785 L) ≈ 13.6 km/L.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
