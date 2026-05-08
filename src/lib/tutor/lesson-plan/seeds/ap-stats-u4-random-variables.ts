/**
 * AP Statistics — CED Unit 4.6+4.7: Random Variables and their
 * distributions.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_RANDOM_VARIABLES: LessonPlan = {
  id: 'evelyn.ap.stats.random-variables.v1', title: 'U4.6 Random Variables — Mean and SD',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.random-variables', description: 'Distinguish discrete vs. continuous random variables. Compute the mean (expected value) μ_X = Σ x · P(x) and standard deviation σ_X = √Σ(x−μ)²·P(x) for a discrete random variable.', standard: 'AP-STATS-4.6-4.7' }],
  prerequisites: ['apstats.conditional-independence'], followUps: ['apstats.combining-rv'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame random variables.', script: "A RANDOM VARIABLE assigns a NUMBER to each outcome of a random process. The PROBABILITY DISTRIBUTION lists possible values and their probabilities. We can then compute mean and SD just like for data.", estimatedMinutes: 2 },
    { id: 'concept-rv', kind: 'concept', goal: 'Cover RV, distributions, mean, SD.',
      keyIdeas: [
        'RANDOM VARIABLE X: numerical outcome of a random process. Notation X (capital).',
        'TYPES:',
        '  • DISCRETE: X takes a countable set of values (e.g., number of heads in 10 flips: 0, 1, 2, ..., 10).',
        '  • CONTINUOUS: X takes any value in an interval (e.g., height, time).',
        'PROBABILITY DISTRIBUTION of a discrete RV: a table of values x and their probabilities P(X = x). Probabilities sum to 1.',
        'MEAN (EXPECTED VALUE): μ_X = E(X) = Σ x_i · P(X = x_i). Weighted average of values, weighted by probabilities.',
        'STANDARD DEVIATION: σ_X = √Σ(x_i − μ_X)² · P(X = x_i). VARIANCE: σ_X² = same expression without the square root.',
        'INTERPRETATION OF MEAN: long-run average value of X over MANY trials. Not necessarily a possible value.',
        'INTERPRETATION OF SD: typical deviation of X from its mean.',
        'AP CALCULATOR: enter values in L1, probabilities in L2, then 1-VarStats L1, L2 — calculator returns μ, σ, etc. for the distribution.',
      ],
      vocabulary: [
        { term: 'random variable', definition: 'a numerical outcome of a random process.' },
        { term: 'expected value', definition: 'mean of a random variable; long-run average.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-mean-sd', kind: 'worked_example',
      problem: 'X = number of heads in 2 fair coin flips. Compute the distribution, mean, and SD.',
      steps: [
        'STEP 1 — Possible values: 0, 1, 2.',
        'STEP 2 — Probabilities: P(0) = 1/4 (TT). P(1) = 2/4 (HT or TH). P(2) = 1/4 (HH). Sum to 1 ✓.',
        'STEP 3 — Mean: μ = 0(1/4) + 1(2/4) + 2(1/4) = 0 + 0.5 + 0.5 = 1.',
        'STEP 4 — Variance: σ² = (0 − 1)²(1/4) + (1 − 1)²(2/4) + (2 − 1)²(1/4) = (1)(0.25) + 0 + (1)(0.25) = 0.5.',
        'STEP 5 — SD: σ = √0.5 ≈ 0.707.',
      ],
      answer: 'μ = 1; σ ≈ 0.707.', estimatedMinutes: 4 },
    { id: 'try-distribution', kind: 'try_yourself',
      problem: 'A spinner has values 1, 2, 5 with probabilities 0.4, 0.3, 0.3. Compute the mean.',
      expectedAnswer: 'μ = 1(0.4) + 2(0.3) + 5(0.3) = 0.4 + 0.6 + 1.5 = 2.5.',
      responseFormat: 'numeric', hints: ['Multiply each value by its probability and sum.'], estimatedMinutes: 2 },
    { id: 'try-sd', kind: 'try_yourself',
      problem: 'X has distribution: P(X = 0) = 0.5, P(X = 1) = 0.3, P(X = 2) = 0.2. (a) Compute μ. (b) Compute σ.',
      expectedAnswer: '(a) μ = 0(0.5) + 1(0.3) + 2(0.2) = 0.7. (b) σ² = (0−0.7)²(0.5) + (1−0.7)²(0.3) + (2−0.7)²(0.2) = (0.49)(0.5) + (0.09)(0.3) + (1.69)(0.2) = 0.245 + 0.027 + 0.338 = 0.61. σ = √0.61 ≈ 0.781.',
      responseFormat: 'numeric', hints: ['Mean first; then squared deviations weighted by probabilities.'], estimatedMinutes: 4 },
    { id: 'try-interpret', kind: 'try_yourself',
      problem: 'AP-style synthesis. The number of cars sold per day at a dealership is a random variable X with distribution: P(0) = 0.10, P(1) = 0.20, P(2) = 0.40, P(3) = 0.20, P(4) = 0.10. (a) Find the mean and SD. (b) Interpret the mean in context.',
      expectedAnswer: '(a) μ = 0(0.1) + 1(0.2) + 2(0.4) + 3(0.2) + 4(0.1) = 0 + 0.2 + 0.8 + 0.6 + 0.4 = 2.0 cars. \nσ² = (0−2)²(0.1) + (1−2)²(0.2) + (2−2)²(0.4) + (3−2)²(0.2) + (4−2)²(0.1) = 4(0.1) + 1(0.2) + 0 + 1(0.2) + 4(0.1) = 0.4 + 0.2 + 0 + 0.2 + 0.4 = 1.2. σ = √1.2 ≈ 1.095. (3.5)\n(b) "Over many days, the dealership averages 2 cars sold per day. The typical day-to-day variation is about 1.1 cars from this average." (1.5)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Compute, then interpret in context.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Discrete RV: list values + probabilities (sum to 1).',
      'μ = Σ x·P(x). σ = √Σ(x−μ)²·P(x).',
      'Mean = long-run average; SD = typical deviation.',
      'Use 1-VarStats L1, L2 on the calculator.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4.6-4.7', cedTitle: 'Random Variables', sources: [{ type: 'concept', book: 'tps5e', chapter: '6', note: 'Standard discrete RV.' }] },
};
