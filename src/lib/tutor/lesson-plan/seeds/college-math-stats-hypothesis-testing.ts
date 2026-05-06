/**
 * College Intro Statistics — Hypothesis Testing.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_STATS_HYPOTHESIS_TESTING: LessonPlan = {
  id: 'evelyn.college.math.stats.hypothesis-testing.v1',
  title: 'Intro Statistics — Hypothesis Testing Workflow',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'college.math.stats.hypothesis-testing',
      description: 'Set up and execute a t-test or z-test for a single mean: state hypotheses, compute statistic, find p-value, decide and interpret.',
      standard: 'COLLEGE-INTRO-STATS',
    },
  ],
  prerequisites: ['college.math.intro-statistics'],
  followUps: ['college.math.stats.regression'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hypothesis testing turns "is this real or just chance?" into a procedure with a number.',
      script: 'A new drug seemed to lower blood pressure by 5 mmHg in a small trial. Real or random? Hypothesis testing computes the probability of seeing data this extreme IF the drug had no effect. Small probability ⟹ probably not random. We\'ll walk through the workflow that gets you to a defensible answer.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-hypothesis-testing',
      kind: 'concept',
      goal: 'Workflow, t vs z, one- vs two-tailed, p-value, decision rule, type I/II errors.',
      keyIdeas: [
        'WORKFLOW (six steps):',
        '  1. STATE hypotheses. H₀ (null): no effect / status quo. H₁ (alternative): the effect you\'re looking for.',
        '  2. CHOOSE significance level α (commonly 0.05).',
        '  3. CHECK assumptions: random sample, sufficient size (n ≥ 30 OR underlying distribution roughly normal).',
        '  4. COMPUTE test statistic.',
        '     z-test: when σ (population SD) is known. z = (x̄ − μ₀) / (σ/√n).',
        '     t-test: when σ unknown, use sample SD s. t = (x̄ − μ₀) / (s/√n), with df = n − 1.',
        '  5. FIND p-value.',
        '     Two-tailed: p = 2 · P(|test stat| > observed) — use when H₁ is "≠".',
        '     One-tailed: p = P(test stat > observed) [or < — depends on direction] — use when H₁ is ">" or "<".',
        '  6. DECIDE. If p < α, REJECT H₀ ("statistically significant"). Otherwise FAIL TO REJECT.',
        'INTERPRET in context: "we have evidence that the mean blood pressure decreased" — not "we proved the drug works."',
        'TYPE I ERROR: rejecting a true H₀ (false positive). Probability = α.',
        'TYPE II ERROR: failing to reject a false H₀ (false negative). Probability = β. POWER = 1 − β.',
        'COMMON MISINTERPRETATIONS:',
        '  p-value ≠ probability that H₀ is true.',
        '  "Failed to reject" ≠ "accepted H₀" — it means insufficient evidence to overturn it.',
        '  Statistical significance ≠ practical importance. A tiny effect can be "significant" with large n.',
      ],
      vocabulary: [
        { term: 'null hypothesis (H₀)', definition: 'the no-effect / status-quo claim being tested; rejected only when evidence is sufficient.' },
        { term: 'p-value', definition: 'probability of observing data at least as extreme as ours, assuming H₀ is true.' },
        { term: 'power', definition: 'probability of correctly rejecting a false null; 1 − β; depends on effect size, n, σ, α.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A factory claims its bolts have mean diameter 5.00 mm. You measure 36 bolts: x̄ = 4.96 mm, s = 0.10 mm. Is there evidence at α = 0.05 that the true mean differs from 5.00?',
      steps: [
        'Hypotheses (two-tailed):',
        '  H₀: μ = 5.00.  H₁: μ ≠ 5.00.',
        'σ unknown ⟹ use t-test with df = 35.',
        'Test statistic: t = (4.96 − 5.00) / (0.10/√36) = −0.04 / (0.10/6) = −0.04 / 0.01667 = −2.40.',
        'p-value (two-tailed, df = 35): for |t| = 2.40, p ≈ 0.022 (from t-table or software).',
        'Compare to α: 0.022 < 0.05 ⟹ REJECT H₀.',
        'Conclusion: at the 5% significance level, there IS evidence that the true mean diameter differs from 5.00 mm.',
        'CAVEAT: the difference (4.96 vs 5.00) is small — 0.04 mm. May not be practically important even though statistically significant. Always check effect size + practical relevance.',
      ],
      answer: 't = −2.40, p ≈ 0.022 < 0.05; reject H₀ — evidence of mean ≠ 5.00.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A student gets t = 1.50 with df = 25 in a two-tailed test, α = 0.05. The critical value at df = 25 is t* ≈ ±2.06. What\'s their conclusion?',
      expectedAnswer: '|t| = 1.50 < 2.06 ⟹ test stat is INSIDE the non-rejection region. p-value > 0.05. FAIL TO REJECT H₀. Conclusion: insufficient evidence at α = 0.05 to overturn the null. NOT "we accept H₀" — we just lack evidence to reject.',
      responseFormat: 'free',
      hints: [
        'Compare |t| to the critical value.',
        'What\'s the right phrasing — accept or fail to reject?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pvalue-meaning',
      kind: 'misconception_check',
      question: 'A student gets p = 0.04 and concludes "there\'s a 4% chance the null hypothesis is true." Why is this wrong?',
      commonErrors: [
        {
          answer: 'p = P(H₀ true)',
          misconception: 'Inverting the conditional probability the p-value expresses.',
          correctsTo: 'p = P(data this extreme | H₀ true) — NOT P(H₀ true | data). The two are different conditional probabilities (Bayes-related). The p-value tells you "if H₀ were true, would I expect data this extreme?" — not "given the data, how likely is H₀?" To get the inverted probability requires Bayesian methods (priors, likelihoods, posteriors). The American Statistical Association issued a 2016 statement specifically against this misinterpretation because it\'s widespread in published research.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six-step workflow: state, α, check, compute, p-value, decide.',
        'σ known → z-test; σ unknown → t-test (df = n − 1).',
        'p < α → reject H₀; p ≥ α → fail to reject (NOT "accept").',
        'p-value is NOT P(H₀ is true). Don\'t invert.',
        'Significant ≠ important — always report effect size.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
