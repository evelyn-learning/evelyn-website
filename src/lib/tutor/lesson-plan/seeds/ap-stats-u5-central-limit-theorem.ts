/**
 * AP Statistics — CED Unit 5.3: The Central Limit Theorem.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U5_CENTRAL_LIMIT_THEOREM: LessonPlan = {
  id: 'evelyn.ap.stats.central-limit-theorem.v1', title: 'U5.3 The Central Limit Theorem',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.central-limit-theorem', description: 'State the Central Limit Theorem (CLT). Apply it: for large enough n, the sampling distribution of x̄ is approximately normal regardless of population shape.', standard: 'AP-STATS-5.3' }],
  prerequisites: ['apstats.sampling-distribution-concept'], followUps: ['apstats.proportions-sampling-dist'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame CLT as the magic theorem.', script: "The CENTRAL LIMIT THEOREM is the most important result in statistics. It says: even if the population is skewed or weird, the SAMPLING DISTRIBUTION OF X̄ becomes APPROXIMATELY NORMAL when n is large. This is what makes confidence intervals and significance tests work.", estimatedMinutes: 2 },
    { id: 'concept-clt', kind: 'concept', goal: 'State CLT and key consequences.',
      keyIdeas: [
        'CENTRAL LIMIT THEOREM (CLT): For SRS of size n from any population with mean μ and SD σ, as n increases, the sampling distribution of x̄ becomes approximately normal:',
        '  • CENTER: μ_x̄ = μ.',
        '  • SPREAD: σ_x̄ = σ/√n.',
        '  • SHAPE: approximately normal when n is large (rule of thumb: n ≥ 30).',
        'IF the population is ALREADY NORMAL: the sampling distribution of x̄ is EXACTLY normal for any n (no minimum required).',
        'NORMAL/LARGE-COUNTS CONDITION for AP inference (means): the population is normal, OR n ≥ 30 (CLT applies).',
        'INDEPENDENCE/10% CONDITION: when sampling without replacement, n ≤ 0.10·N (so observations are approximately independent).',
        'CRITICAL DISTINCTIONS:',
        '  • POPULATION distribution: distribution of values in the population.',
        '  • DISTRIBUTION OF SAMPLE DATA: histogram of one sample\'s values — looks like population distribution.',
        '  • SAMPLING DISTRIBUTION: distribution of x̄ across all possible samples of size n. CLT applies HERE.',
        'AP COMMON ERROR: claiming x̄ is normal because population is normal — WRONG framing. Either: x̄ is exactly normal (population is normal), or x̄ is approximately normal by CLT (large n).',
        'WHY σ/√n: as n grows, x̄ averages out — variability decreases by factor of √n.',
      ],
      vocabulary: [
        { term: 'central limit theorem', definition: 'sampling distribution of x̄ approaches normal as n grows, regardless of population shape.' },
        { term: 'standard error', definition: 'the SD of a sampling distribution (σ_x̄ = σ/√n).' },
      ],
      estimatedMinutes: 4 },
    { id: 'worked-clt', kind: 'worked_example',
      problem: 'Adult heights have μ = 70 inches, σ = 4 inches. SRS of 25 adults. (a) What\'s the sampling distribution of x̄? (b) P(x̄ > 71)?',
      steps: [
        '(a) μ_x̄ = 70. σ_x̄ = 4/√25 = 0.8. Population assumed normal (heights ≈ normal), so sampling distribution is EXACTLY N(70, 0.8). (Even if not strictly normal, n = 25 is borderline; if the population is reasonably symmetric, we\'re fine.)',
        '(b) z = (71 − 70)/0.8 = 1.25. P(Z > 1.25) ≈ 1 − 0.8944 = 0.1056. About 10.6% of samples of size 25 would have mean > 71.',
      ],
      answer: 'Sampling dist of x̄: N(70, 0.8). P(x̄ > 71) ≈ 0.106.', estimatedMinutes: 4 },
    { id: 'try-clt-skewed', kind: 'try_yourself',
      problem: 'Daily home power use is RIGHT-SKEWED with μ = 40 kWh, σ = 15 kWh. SRS of 100 homes. (a) Describe the sampling distribution of x̄. (b) Why is it OK to assume normality even though the population is skewed?',
      expectedAnswer: '(a) μ_x̄ = 40. σ_x̄ = 15/√100 = 1.5. By CLT (n = 100 ≥ 30), sampling distribution of x̄ is approximately N(40, 1.5). (b) The CLT guarantees that the sampling distribution of x̄ becomes approximately normal as n grows, regardless of the population shape. n = 100 is well past the rule-of-thumb threshold of 30.',
      responseFormat: 'free', hints: ['CLT applies: shape of x̄ → normal for large n.'], estimatedMinutes: 3 },
    { id: 'try-prob', kind: 'try_yourself',
      problem: 'Battery lifetimes are normal with μ = 800 hours, σ = 50 hours. SRS of 16 batteries. (a) Find the sampling distribution of x̄. (b) Find P(x̄ < 780).',
      expectedAnswer: '(a) Population is normal → sampling distribution of x̄ is exactly normal. μ_x̄ = 800, σ_x̄ = 50/√16 = 12.5. So x̄ ~ N(800, 12.5). (b) z = (780 − 800)/12.5 = -1.6. P(Z < -1.6) ≈ 0.0548. About 5.5%.',
      responseFormat: 'free', hints: ['Apply σ/√n; standardize; look up z.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A factory claims average widget weight is μ = 100 g, σ = 8 g. The population distribution is roughly bell-shaped. A quality auditor takes 64 widgets and finds mean weight 97 g. (a) Find the sampling distribution of x̄ assuming the claim is true. (b) Compute P(x̄ ≤ 97). (c) Interpret: should the auditor be suspicious of the claim?',
      expectedAnswer: '(a) μ_x̄ = 100, σ_x̄ = 8/√64 = 1. Sampling distribution: x̄ ~ N(100, 1). (Bell-shaped population OR n = 64 large → CLT.) (1.5)\n(b) z = (97 − 100)/1 = -3. P(Z ≤ -3) ≈ 0.00135 (about 0.13%). (1.5)\n(c) Yes — the auditor SHOULD be suspicious. If the claim were true, getting a sample mean as low as 97 g (or lower) would happen only about 0.13% of the time. This is strong evidence that the true mean is LESS than 100 g (or that something is wrong with the production). Formal hypothesis testing comes in Unit 6+. (2)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Sampling dist; standardize; interpret tail probability.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'CLT: sampling distribution of x̄ → normal as n grows.',
      'μ_x̄ = μ, σ_x̄ = σ/√n.',
      'n ≥ 30 rule of thumb. Population normal → x̄ exactly normal for any n.',
      'Don\'t confuse population, sample data, and sampling distributions.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Central Limit Theorem', sources: [{ type: 'concept', book: 'tps5e', chapter: '7', note: 'Standard CLT.' }] },
};
