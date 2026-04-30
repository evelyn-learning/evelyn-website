/**
 * AP Statistics — Chi-square tests.
 *
 * Goodness-of-fit and test for independence. Categorical data
 * inference.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_CHI_SQUARE: LessonPlan = {
  id: 'evelyn.ap.stats.chi-square.v1',
  title: 'Chi-square tests: goodness-of-fit and independence',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.chi-square',
      description: 'Conduct chi-square goodness-of-fit and independence tests on categorical data.',
      standard: 'AP-STATS-DAT-3',
    },
  ],
  prerequisites: ['apstats.hypothesis-test'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a question about CATEGORIES, not means.',
      script: 'You roll a die 600 times. You\'d expect 100 of each face. You get: 90, 110, 95, 105, 100, 100. Is the die fair? Chi-square tells you whether your observed counts deviate from expected by more than chance.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-two-tests',
      kind: 'concept',
      goal: 'Two chi-square tests + the formula + degrees of freedom.',
      keyIdeas: [
        'CHI-SQUARE TESTS work on CATEGORICAL data (counts in categories), not continuous measurements.',
        'GOODNESS-OF-FIT: tests whether observed counts match an expected distribution. (Is the die fair? Are colors of M&Ms in advertised proportions?)',
        'TEST FOR INDEPENDENCE: tests whether two categorical variables are RELATED. (Does smoking depend on income? Does treatment relate to outcome?)',
        'STATISTIC: χ² = Σ (Observed − Expected)² / Expected. Sum across all cells.',
        'DEGREES OF FREEDOM: goodness-of-fit: df = (categories − 1). Independence (r×c table): df = (rows − 1)(columns − 1).',
        'Compare χ² to a critical value (or compute p-value). Large χ² → big mismatch → reject H₀ ("data fits expected" or "variables independent").',
        'CONDITIONS: all expected counts ≥ 5 (some books say ≥ 1, with no more than 20% < 5). Random sample.',
      ],
      vocabulary: [
        { term: 'goodness-of-fit', definition: 'a chi-square test comparing observed counts to an expected distribution.' },
        { term: 'test for independence', definition: 'a chi-square test for whether two categorical variables are related.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-die',
      kind: 'worked_example',
      problem: 'Roll a die 600 times. Observed: 90, 110, 95, 105, 100, 100. Test if the die is fair at α = 0.05.',
      steps: [
        'H₀: die is fair (each face has p = 1/6, expected = 100).',
        'H_a: die is not fair.',
        'χ² = Σ (O − E)² / E for each face.',
        '= (90−100)²/100 + (110−100)²/100 + (95−100)²/100 + (105−100)²/100 + (100−100)²/100 + (100−100)²/100.',
        '= 100/100 + 100/100 + 25/100 + 25/100 + 0 + 0 = 1 + 1 + 0.25 + 0.25 = 2.5.',
        'df = 6 − 1 = 5. Critical value for α = 0.05, df = 5: χ² ≈ 11.07.',
        '2.5 < 11.07 → FAIL TO REJECT H₀. No strong evidence the die is unfair.',
      ],
      answer: 'χ² = 2.5; not significant; die appears fair',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a 2×3 contingency table (independence test), what is the degrees of freedom?',
      expectedAnswer: '2',
      responseFormat: 'numeric',
      hints: [
        'df = (rows − 1)(cols − 1).',
        '(2-1)(3-1) = 1 × 2 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-chi-on-continuous',
      kind: 'misconception_check',
      question: 'Can you use a chi-square test to compare TWO MEANS (like average heights)?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Applying chi-square to continuous data.',
          correctsTo: 'No — chi-square is for COUNTS in CATEGORIES. For means, use t-tests or ANOVA. Chi-square is fundamentally about whether a frequency distribution matches expectations.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'χ² = Σ (O − E)²/E. Always categorical data.',
        'Goodness-of-fit (one variable, expected distribution).',
        'Independence (two variables, r×c table).',
        'df: GOF: k-1. Independence: (r-1)(c-1).',
        'Large χ² → reject H₀.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A genetics experiment expects a 9:3:3:1 phenotype ratio. After 320 offspring, observed 175, 65, 55, 25. Is this close enough to 9:3:3:1?',
      hint: 'Expected from 9:3:3:1: 180, 60, 60, 20. χ² = (175-180)²/180 + (65-60)²/60 + (55-60)²/60 + (25-20)²/20 ≈ 0.14 + 0.42 + 0.42 + 1.25 = 2.23. df = 4-1 = 3. Critical value at 0.05 ≈ 7.81. Don\'t reject — fits expected.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
