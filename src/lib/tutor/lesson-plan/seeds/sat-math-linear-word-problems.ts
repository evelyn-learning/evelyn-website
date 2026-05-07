/**
 * SAT Math — Linear Equations from Word Problems (Heart of Algebra teaching).
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_LINEAR_WORD_PROBLEMS: LessonPlan = {
  id: 'evelyn.testprep.sat-math.linear-word-problems.v1',
  title: 'SAT Math — Linear Equations from Word Problems',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.linear-word-problems', description: 'Translate SAT word problems into linear equations and solve.', standard: 'CCSS.MATH.HSA.CED.A.1' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Word-problem translation is the most common SAT Math skill — and the most-missed one.', script: 'On the SAT, "translate this scenario into an equation" appears 5+ times. The math is easy once translated; the trick is the TRANSLATION itself. Today we drill the translation patterns.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Translation patterns, common SAT scenarios, signs of common errors.', keyIdeas: [
      'KEY translation map:',
      '  "more than", "added to", "increased by" → +',
      '  "less than", "decreased by", "fewer than" → −  (BUT: "5 less than x" = x − 5, not 5 − x).',
      '  "times", "of", "product of" → ×',
      '  "per", "for each", "rate of" → suggests a per-unit coefficient.',
      '  "is", "equals", "results in" → =',
      '  "twice", "double" → 2x. "thrice" / "triple" → 3x.',
      '  "half of" → x/2.',
      'COMMON SAT SCENARIOS:',
      '  COST + FEE: "membership $25 plus $10 per visit; total $85" → 25 + 10v = 85.',
      '  SAVINGS: "starts with $200, saves $30/month for n months → 200 + 30n.',
      '  RATES: "boat travels x miles in 2 hours" → speed = x/2.',
      '  AGE: "Maria is 5 years older than Tom; in 8 years she\'ll be twice his age" → m = t + 5; m + 8 = 2(t + 8). Solve as system.',
      '  MIXTURE: "30% solution mixed with 50% to make 40% solution".',
      'STEPS to translate:',
      '  1. ASSIGN VARIABLES with units. "Let n = number of hours."',
      '  2. EXPRESS each unknown using the variables.',
      '  3. WRITE the relationship as an equation.',
      '  4. SOLVE.',
      '  5. INTERPRET the answer in problem context.',
      'SAT TRICK: many problems give EXTRA INFO that\'s not needed. Identify what\'s being ASKED, then identify what\'s relevant.',
      'ANOTHER trick: variables in the answer choices. "x represents..." — pick the one matching what was asked, not just what was solved.',
    ], vocabulary: [{ term: 'linear equation', definition: 'an equation where variables only have power 1 (no x², √x, etc.).' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'A gym charges a $50 sign-up fee and $30 per month. After how many months will a member have paid exactly $290 total?', steps: [
      'Variables: m = number of months.',
      'Translate: $50 sign-up + $30 × m months = total. So 50 + 30m = 290.',
      'Solve: 30m = 240. m = 8.',
      'Interpret: 8 months. Answer is the number of MONTHS, not the total paid.',
    ], answer: '8 months', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Twice a number, decreased by 7, equals 17. What is the number?', expectedAnswer: '"Twice a number" = 2x. "Decreased by 7" = − 7. "Equals 17" = = 17. Equation: 2x − 7 = 17. Solve: 2x = 24. x = 12.', responseFormat: 'numeric', hints: ['"Twice" = multiply by 2.', '"Decreased by" = subtract from.'], estimatedMinutes: 2 },
    { id: 'misconception-less-than', kind: 'misconception_check', question: 'A student translates "5 less than x" as 5 − x. What\'s wrong?', commonErrors: [{ answer: '5 less than x = 5 − x', misconception: 'Reading word order literally instead of meaning.', correctsTo: '"5 less than x" means STARTING from x and subtracting 5 → x − 5. Not 5 − x. The phrase reads backward in math: the thing you\'re subtracting FROM comes after the words "less than." So "8 less than y" = y − 8. Drill this — it\'s a common SAT trap.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['"Less than" reverses order: "5 less than x" = x − 5.', 'Define variables WITH UNITS first.', 'Watch for what\'s ACTUALLY being asked (read the question stem twice).', 'Cost + per-unit fee = standard SAT pattern.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
