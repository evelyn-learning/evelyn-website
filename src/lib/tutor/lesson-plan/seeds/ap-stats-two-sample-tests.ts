/**
 * AP Statistics — Two-sample t-tests.
 *
 * Comparing means between two independent groups. When and how
 * to use them.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_TWO_SAMPLE_TESTS: LessonPlan = {
  id: 'evelyn.ap.stats.two-sample-t-tests.v1',
  title: 'Two-sample t-tests: comparing two means',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'ap-statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.two-sample',
      description: 'Conduct two-sample t-tests to compare population means.',
      standard: 'AP-STATS-VAR-7',
    },
  ],
  prerequisites: ['apstats.hypothesis-test'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose the two-group comparison problem.',
      script: 'Drug A and Drug B treat the same condition. Group 1 takes A, Group 2 takes B. Group 1 averages 20% improvement, Group 2 averages 24%. Real difference, or random variation? Two-sample t-tests answer that.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-procedure',
      kind: 'concept',
      goal: 'When to use + test statistic + degrees of freedom + assumptions.',
      keyIdeas: [
        'WHEN: comparing means of TWO INDEPENDENT samples.',
        'HYPOTHESES: H₀: μ₁ = μ₂ (no difference). H_a: μ₁ ≠ μ₂ (two-sided) or μ₁ > μ₂ / μ₁ < μ₂ (one-sided).',
        'TEST STATISTIC: t = (x̄₁ − x̄₂) / SE, where SE = √(s₁²/n₁ + s₂²/n₂). The standard error of the DIFFERENCE.',
        'DEGREES OF FREEDOM (Welch\'s, conservative): use min(n₁−1, n₂−1) on AP. Calculator gives a more precise df via Welch-Satterthwaite formula.',
        'CONFIDENCE INTERVAL for difference: (x̄₁ − x̄₂) ± t* · SE.',
        'CONDITIONS: 1) Random samples or random assignment. 2) Independent groups. 3) Approximately normal distributions OR n₁ + n₂ ≥ 30 (Central Limit Theorem).',
        'PAIRED vs INDEPENDENT: if the two samples are LINKED (before-and-after for the same subjects), use PAIRED t-test (different procedure). Independent samples are different subjects.',
      ],
      vocabulary: [
        { term: 'two-sample t-test', definition: 'a hypothesis test comparing means of two independent samples.' },
        { term: 'paired t-test', definition: 'a test for two LINKED samples (same subjects measured twice).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-test',
      kind: 'worked_example',
      problem: 'Drug A: n=40, mean improvement 20%, s=5. Drug B: n=40, mean 24%, s=6. Test if Drug B is more effective at α=0.05.',
      steps: [
        'H₀: μ_B = μ_A. H_a: μ_B > μ_A.',
        'SE = √(5²/40 + 6²/40) = √(0.625 + 0.9) = √1.525 ≈ 1.235.',
        't = (24 − 20) / 1.235 ≈ 3.24.',
        'df ≈ 39 (conservative). For one-sided α=0.05, critical t ≈ 1.685.',
        '3.24 > 1.685 → REJECT H₀.',
        'Strong evidence Drug B has higher mean improvement than Drug A.',
      ],
      answer: 'reject H₀; t ≈ 3.24 > 1.685; B is more effective',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For BEFORE-and-AFTER measurements on the SAME 30 patients, would you use a two-sample or paired t-test?',
      expectedAnswer: 'paired',
      responseFormat: 'free',
      hints: [
        'Same subjects measured twice → linked, not independent.',
        'Pairing CONTROLS for individual variation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pool-variance',
      kind: 'misconception_check',
      question: 'Should you assume EQUAL variance between the two groups when computing SE?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Pooling variance always.',
          correctsTo: 'AP standard is Welch\'s t-test (no equal-variance assumption). Pooled t requires variance equality, which is rarely guaranteed in practice. Welch is safer and more flexible.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two-sample t-test: comparing two INDEPENDENT samples.',
        't = (x̄₁ − x̄₂)/SE, SE = √(s₁²/n₁ + s₂²/n₂).',
        'df ≈ min(n₁−1, n₂−1) on AP.',
        'Paired vs independent: same subjects = paired; different subjects = independent.',
        'Use Welch\'s (no equal-variance assumption).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does PAIRING reduce variance?',
      hint: 'Each subject is their own control. Individual differences (some people just respond more) are removed by looking at each person\'s CHANGE. Smaller SE → more statistical power.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
