/**
 * AP Statistics — Hypothesis testing intro.
 *
 * Null vs alternative hypothesis, p-value, significance level,
 * Type I/II errors. The 5-step procedure.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_HYPOTHESIS_TESTING: LessonPlan = {
  id: 'evelyn.ap.stats.hypothesis-testing.v1',
  title: 'Hypothesis testing: null, alternative, p-value',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'ap-statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.hypothesis-test',
      description: 'State and test hypotheses about a population parameter using sample data.',
      standard: 'AP-STATS-VAR-6',
    },
  ],
  prerequisites: ['apstats.sampling-distributions'],
  followUps: ['apstats.confidence-intervals'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a "is this just chance?" question.',
      script: 'A drug company tests a new medicine. 60% of patients improved on it vs 50% on placebo. Is the drug actually better — or could that 60% just be lucky randomness? That\'s what hypothesis testing is for.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-five-steps',
      kind: 'concept',
      goal: 'Hypothesis testing always follows the same 5-step structure.',
      keyIdeas: [
        'STEP 1: State H₀ (null hypothesis — "no effect" or "no difference") and H_a (alternative — what you\'re trying to show).',
        'STEP 2: Choose a SIGNIFICANCE LEVEL α (typically 0.05). This is the threshold for "unlikely under H₀".',
        'STEP 3: Compute the test STATISTIC and the P-VALUE — the probability of observing data this extreme IF H₀ were true.',
        'STEP 4: Compare p to α. If p < α → REJECT H₀. If p ≥ α → FAIL TO REJECT H₀.',
        'STEP 5: State the conclusion in plain language, IN CONTEXT.',
        'TYPE I ERROR: rejecting H₀ when it\'s actually true (false alarm). Probability = α.',
        'TYPE II ERROR: failing to reject H₀ when it\'s actually false (missed effect).',
      ],
      vocabulary: [
        { term: 'null hypothesis (H₀)', definition: 'the default assumption — usually "no effect".' },
        { term: 'p-value', definition: 'the probability of observing data this extreme assuming H₀ is true.' },
        { term: 'significance level (α)', definition: 'the cutoff for what counts as "unlikely". Usually 0.05.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-coin',
      kind: 'worked_example',
      problem: 'A coin is flipped 100 times and lands heads 65 times. Test at α = 0.05 whether the coin is fair.',
      steps: [
        'Step 1: H₀: p = 0.5 (fair). H_a: p ≠ 0.5 (not fair). Two-sided test.',
        'Step 2: α = 0.05.',
        'Step 3: Compute z = (p̂ − p₀)/√(p₀(1−p₀)/n) = (0.65 − 0.5)/√(0.5·0.5/100) = 0.15/0.05 = 3.0.',
        'For a two-sided test, p-value = 2·P(Z > 3.0) ≈ 2·0.00135 ≈ 0.0027.',
        'Step 4: 0.0027 < 0.05 → REJECT H₀.',
        'Step 5: There is strong evidence the coin is NOT fair (p ≈ 0.003).',
      ],
      answer: 'Reject H₀; coin is likely biased toward heads',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You test H₀: μ = 100 against H_a: μ > 100 and get p = 0.08. At α = 0.05, what\'s your conclusion?',
      expectedAnswer: 'fail to reject H₀',
      responseFormat: 'free',
      hints: [
        'Compare p to α: 0.08 vs 0.05.',
        'p > α → not significant → we cannot reject the null.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-prove-h0',
      kind: 'misconception_check',
      question: 'If you fail to reject H₀, have you "proven" the null is true?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "fail to reject" as "accept".',
          correctsTo: 'No — failing to reject H₀ just means you don\'t have ENOUGH evidence to reject it. Maybe the effect is small or sample is too small to detect. Statistics never "proves" the null; it can only fail to disprove it.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'H₀ = "no effect"; H_a = the claim you\'re testing.',
        'p-value < α → REJECT H₀. p ≥ α → fail to reject.',
        'A small p-value means the data would be unlikely IF H₀ were true.',
        'Failing to reject H₀ ≠ proving H₀.',
        'Type I = false alarm; Type II = missed effect.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is α = 0.05 the convention? What\'s wrong with using α = 0.50?',
      hint: 'α = 0.50 means accepting a 50% chance of false alarms — useless. 0.05 is a balance: low enough to limit false alarms, high enough to detect real effects.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
