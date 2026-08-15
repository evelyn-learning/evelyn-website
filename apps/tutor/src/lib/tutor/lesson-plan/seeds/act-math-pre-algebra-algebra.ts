/**
 * ACT Math — Pre-Algebra and Elementary Algebra (~24 questions / 60).
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_MATH_PRE_ALGEBRA_ALGEBRA: LessonPlan = {
  id: 'evelyn.testprep.act.math.pre-algebra-algebra.v1',
  title: 'ACT Math — Pre-Algebra and Elementary Algebra',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-math',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.math.pre-algebra-algebra',
      description: 'Drill the highest-frequency ACT Math topics: percentages, ratios, exponents, basic equations, inequalities, word translations.',
      standard: 'ACT-MATH',
    },
  ],
  prerequisites: ['testprep.act.math'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Roughly 40% of ACT Math is pre-algebra and elementary algebra — drilling these gets you the bulk of points.',
      script: 'The ACT tests middle-school + Algebra 1 content surprisingly heavily. Percentages, ratios, simple equations — these aren\'t advanced, but they\'re tested in tricky ways under time pressure. Today: the question patterns you\'ll see most often.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-act-math',
      kind: 'concept',
      goal: 'Frequent topics, calculator strategy, time per question, common traps.',
      keyIdeas: [
        'TIME: 60 minutes / 60 questions = 1 minute per question average. The first 30 are usually easier — bank time.',
        'CALCULATOR: allowed throughout. Use it for arithmetic but not for set-up — students who calculator-bash without thinking lose time.',
        'TOP TOPICS by frequency: percentages, ratios + proportions, exponents + roots, linear equations, basic geometry (lines, triangles, circles), word problems, fractions, scientific notation.',
        'PERCENTAGES: "x is what percent of y" → x/y × 100. "Increase by p%" → multiply by (1 + p/100). Compound % CHANGES — sequential 10% increases don\'t equal 20%.',
        'RATIOS: a:b means a parts of one to b parts of the other. Total parts = a + b. Scale up: if a:b = 3:5 and total = 40, then a = 15, b = 25.',
        'EXPONENT RULES: aᵐ × aⁿ = a^(m+n); (aᵐ)ⁿ = a^(mn); a⁰ = 1; a^(−n) = 1/aⁿ. ACT loves to mix these.',
        'COMMON TRAPS:',
        '  Mixing up "20% off" vs "20% of" (the latter is 20%, NOT 80%).',
        '  Sequential percentages: 50% off then 20% off ≠ 70% off.',
        '  Negative under square root: ACT MATH only deals with REAL solutions; if you get a negative under a √, check work.',
        'STRATEGY: skip + return. If a question takes more than 90 seconds, mark and move on. Get all the easy ones first, then return.',
      ],
      vocabulary: [
        { term: 'pacing strategy', definition: 'a deliberate plan for distributing time across questions; ACT Math: ~1 min/question on average, less on early questions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A jacket is on sale for 25% off. With a coupon code, you get an additional 10% off the sale price. The original price was $80. What\'s the final price?',
      steps: [
        'After 25% off: $80 × (1 − 0.25) = $80 × 0.75 = $60.',
        'After additional 10% off the sale price: $60 × 0.90 = $54.',
        'Trap: the total discount is NOT 25% + 10% = 35%. Sequential percentages compound: total discount = 1 − (0.75 × 0.90) = 1 − 0.675 = 32.5%.',
        'Final: $54.',
      ],
      answer: '$54 (32.5% total discount, NOT 35%)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a classroom, the ratio of boys to girls is 3:5. There are 32 students total. How many boys are there?',
      expectedAnswer: 'Total parts: 3 + 5 = 8. Each part = 32/8 = 4 students. Boys = 3 × 4 = 12.',
      responseFormat: 'numeric',
      hints: ['Sum the ratio numbers to find total parts.', 'Divide total students by total parts to get one part.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-off',
      kind: 'misconception_check',
      question: 'A student adds two sequential percentage discounts (40% off, then 25% off) to get 65% off. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Add discounts directly',
          misconception: 'Treating sequential percent changes as additive.',
          correctsTo: 'Sequential percentages COMPOUND, not add. After 40% off: pay 60% (multiply by 0.60). Then 25% off that: pay 75% of the 60% = 0.75 × 0.60 = 0.45 of original. So total discount is 55%, not 65%. Always: convert each discount to "what fraction you pay" and multiply them. Final pay-fraction = product of (1 − each_discount).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '60 questions / 60 min — pace ~1 min each.',
        'Sequential percentages compound (multiply), don\'t add.',
        'Ratios: sum parts → divide total by parts → multiply.',
        'Calculator helps; bad set-up wastes time.',
        'Skip and return — don\'t burn 5 min on one tough question.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
