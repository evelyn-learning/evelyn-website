/**
 * College Intro — Intro Statistics.
 *
 * Anchor plan covering the freshman stats course shape: descriptive
 * stats, distributions, sampling, hypothesis testing, regression.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_INTRO_STATISTICS: LessonPlan = {
  id: 'evelyn.college.math.intro-statistics.v1',
  title: 'Intro Statistics — descriptive stats to inference',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'college.math.intro-statistics',
      description: 'Apply descriptive statistics, sampling distributions, hypothesis testing, and basic regression to interpret data.',
      standard: 'COLLEGE-INTRO-STATS',
    },
  ],
  prerequisites: ['g912.math.statistics-probability'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Statistics is how science decides whether a finding is real or just noise.',
      script: 'A drug trial reports the treatment group did 5% better than placebo. Real effect or random fluctuation? A poll says candidate A leads by 3 points. Real lead or sampling jitter? Intro stats teaches you the toolkit that separates signal from noise — and the language to communicate the answer with appropriate uncertainty.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-stats',
      kind: 'concept',
      goal: 'Descriptive stats, distributions, sampling, hypothesis testing, regression.',
      keyIdeas: [
        'DESCRIPTIVE statistics summarise a sample: MEAN, MEDIAN, MODE for central tendency; STANDARD DEVIATION for spread; QUARTILES for tails.',
        'NORMAL DISTRIBUTION: symmetric bell curve. ~68% within 1σ, ~95% within 2σ, ~99.7% within 3σ of the mean. Many natural phenomena cluster normally.',
        'SAMPLING DISTRIBUTION: if you repeatedly sample n observations and compute the mean, the means form a distribution centred on the true population mean, with standard error σ/√n.',
        'CENTRAL LIMIT THEOREM: regardless of the underlying distribution, sample means converge to a normal distribution as n grows. This is what makes most of inferential stats work.',
        'HYPOTHESIS TESTING workflow: state H₀ (null) and H₁ (alternative), choose significance α (commonly 0.05), compute test statistic, get p-value, compare to α, conclude.',
        'p-VALUE = P(observing data this extreme | H₀ is true). Small p ⟹ data unlikely under H₀ ⟹ reject H₀.',
        'CONFIDENCE INTERVAL (95% CI) gives a range that contains the true parameter in 95% of repeated samples. Reporting CI is usually MORE informative than reporting only a p-value.',
        'CORRELATION ≠ CAUSATION. r measures linear association strength (-1 to 1). High |r| does not establish that one variable causes the other.',
        'REGRESSION fits a line y = β₀ + β₁x by least squares. β₁ is the predicted change in y per unit change in x — IN THE STUDIED RANGE, holding other variables constant only if multivariate.',
        'SAMPLE SIZE matters: larger n shrinks the confidence interval and increases statistical power. Underpowered studies miss real effects.',
      ],
      vocabulary: [
        { term: 'p-value', definition: 'the probability of observing data at least as extreme as ours, assuming the null hypothesis is true; small p ⟹ evidence against H₀.' },
        { term: 'confidence interval', definition: 'a range that contains the true parameter in some specified % (e.g. 95%) of repeated samples; communicates uncertainty better than a point estimate.' },
        { term: 'central limit theorem', definition: 'sample means converge to a normal distribution as n grows, even when the population is non-normal.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-htest',
      kind: 'worked_example',
      problem: 'A teacher claims her test-prep class raises SAT scores by an average of 50 points. You test 36 students, observe a mean improvement of 42 points with sample standard deviation 30. Is there evidence at α = 0.05 that the true improvement differs from 50?',
      steps: [
        'H₀: μ = 50 (the claim). H₁: μ ≠ 50 (two-tailed).',
        'Test statistic (t-test, n = 36, df = 35): t = (x̄ − μ₀) / (s/√n) = (42 − 50) / (30/√36) = -8 / 5 = -1.60.',
        'p-value (two-tailed, df = 35): P(|t| ≥ 1.60). From t-tables: ≈ 0.118.',
        'Compare: p = 0.118 > α = 0.05.',
        'Conclusion: fail to reject H₀. We do not have sufficient evidence at the 5% level to conclude the true improvement differs from 50. The observed difference is plausibly chance variation.',
        'CAREFUL phrasing: "fail to reject" ≠ "accept." We did not prove the claim correct — we just lacked evidence to overturn it. With a larger sample, an 8-point shortfall might become statistically detectable.',
      ],
      answer: 't = -1.60, p ≈ 0.118 > 0.05; fail to reject the 50-point claim.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A study reports r = 0.85 between coffee consumption and life expectancy across 200 countries. Can you conclude coffee causes longer life?',
      expectedAnswer: 'No. Correlation is not causation. Multiple alternative explanations: (1) reverse causation (longer-lived populations end up consuming more coffee over their lifetimes), (2) confounding — wealthy countries both drink more coffee AND have better healthcare, sanitation, nutrition. (3) selection / measurement issues at the country level. To infer causation we would need a randomised trial or a strong natural experiment that breaks the confounding.',
      responseFormat: 'free',
      hints: [
        'r measures association strength, nothing more.',
        'What other explanations could produce a high r without coffee → longevity?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-pvalue',
      kind: 'misconception_check',
      question: 'A student says "p = 0.04, so there\'s a 4% chance the null hypothesis is true." What is wrong with this interpretation?',
      commonErrors: [
        {
          answer: 'p is the probability the null is true',
          misconception: 'Inverting the conditional probability the p-value actually expresses.',
          correctsTo: 'p-value = P(data this extreme | H₀ is true), NOT P(H₀ is true | data). The two are different conditional probabilities. The p-value tells you "if the null is true, would you expect to see data this extreme?" — not "given the data, how likely is the null?" To get the second, you need Bayesian methods (priors + likelihoods → posterior). This misinterpretation is widespread, including in published research, and is part of why the American Statistical Association issued a 2016 statement against over-interpreting p-values.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean/median/SD describe; sampling distributions enable inference.',
        'CLT: sample means → normal as n grows.',
        'Hypothesis test: H₀, H₁, statistic, p-value, decision.',
        'p ≠ probability null is true; report CIs alongside p-values.',
        'Correlation ≠ causation.',
        'Sample size matters: underpowered studies miss real effects.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
