/**
 * AP Statistics — CED Unit 6.1+6.2+6.3: Confidence Interval for One
 * Proportion.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U6_ONE_PROP_CI: LessonPlan = {
  id: 'evelyn.ap.stats.one-prop-ci.v1', title: 'U6.1 One-Proportion Confidence Interval',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.one-prop-ci', description: 'Construct, interpret, and use a one-proportion z-confidence interval. Verify conditions. Interpret confidence level correctly.', standard: 'AP-STATS-6.1-6.3' }],
  prerequisites: ['apstats.proportions-sampling-dist'], followUps: ['apstats.one-prop-test'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame confidence intervals.', script: "A point estimate p̂ is one number — but the true p is rarely exactly p̂. A CONFIDENCE INTERVAL gives a RANGE of plausible values for p, with a stated confidence level. Today: how to build one for a single proportion.", estimatedMinutes: 2 },
    { id: 'concept-ci', kind: 'concept', goal: 'Cover formula, conditions, interpretation.',
      keyIdeas: [
        'ONE-PROPORTION z-INTERVAL: p̂ ± z* · √(p̂(1−p̂)/n).',
        '  • z* = critical value from the standard normal: z* = 1.645 for 90%; 1.96 for 95%; 2.576 for 99%.',
        'STANDARD ERROR (SE): SE = √(p̂(1−p̂)/n). The estimated SD of p̂.',
        'MARGIN OF ERROR (ME): ME = z* · SE. Half-width of the CI.',
        'CONDITIONS to verify (write these out in every CI problem):',
        '  • RANDOM: SRS or random assignment.',
        '  • LARGE COUNTS: np̂ ≥ 10 AND n(1−p̂) ≥ 10. (Note p̂ here, since p is unknown.)',
        '  • 10%: n ≤ 0.10·N (if sampling without replacement).',
        'INTERPRETATION OF THE INTERVAL: "We are C% confident that the true proportion of [parameter in context] is between [lower] and [upper]."',
        'INTERPRETATION OF THE CONFIDENCE LEVEL: "If we repeated this procedure many times, about C% of the resulting intervals would CAPTURE the true population proportion."',
        'AP RUBRIC PITFALL: do NOT say "There is a 95% probability that p is in this interval" — once computed, p is either in or not. The 95% applies to the long-run procedure, not the specific interval.',
        'SAMPLE SIZE: to achieve ME ≤ m, solve n ≥ (z*/m)² · p̂(1−p̂). When p̂ unknown, use 0.5 (most conservative) for max sample size.',
      ],
      vocabulary: [
        { term: 'critical value z*', definition: 'standard normal value such that the central area between -z* and z* equals the confidence level.' },
        { term: 'margin of error', definition: 'z* × SE; half-width of CI.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-ci', kind: 'worked_example',
      problem: 'A survey: 250 of 400 voters favor a measure. Construct a 95% CI for the population proportion p.',
      steps: [
        'STEP 1 — p̂ = 250/400 = 0.625. n = 400.',
        'STEP 2 — Conditions: random ✓ (assume SRS). Large Counts: np̂ = 400(0.625) = 250 ≥ 10 ✓; n(1−p̂) = 400(0.375) = 150 ≥ 10 ✓. 10%: assume voter pop > 4000 ✓.',
        'STEP 3 — z* for 95% = 1.96.',
        'STEP 4 — SE = √(0.625·0.375/400) = √0.000586 ≈ 0.0242.',
        'STEP 5 — ME = 1.96(0.0242) ≈ 0.0474.',
        'STEP 6 — CI: 0.625 ± 0.0474 = (0.5776, 0.6724).',
        'STEP 7 — Interpret: "We are 95% confident that the true proportion of voters who favor the measure is between 57.8% and 67.2%."',
      ],
      answer: '95% CI: (0.578, 0.672). Interpret confidence in long-run capture sense.', estimatedMinutes: 5 },
    { id: 'try-ci', kind: 'try_yourself',
      problem: 'In a SRS of 250 students, 75 own a car. Construct a 90% CI for the proportion of students who own a car.',
      expectedAnswer: 'p̂ = 75/250 = 0.30. SE = √(0.30·0.70/250) = √(0.00084) ≈ 0.0290. z* = 1.645 for 90%. ME = 1.645(0.0290) ≈ 0.0477. CI: 0.30 ± 0.0477 = (0.252, 0.348). \nConditions: Random ✓, Large Counts: 250(0.3) = 75 ≥ 10, 250(0.7) = 175 ≥ 10 ✓, 10%: assume student pop > 2500 ✓. \nInterpret: "We are 90% confident that the true proportion of students who own a car is between 25.2% and 34.8%."',
      responseFormat: 'frq', hints: ['p̂ first; then SE; ME = z*·SE; verify conditions; interpret.'], estimatedMinutes: 5 },
    { id: 'try-sample-size', kind: 'try_yourself',
      problem: 'A pollster wants a 95% CI for a proportion with margin of error at most 0.03. (a) If a previous poll suggests p̂ ≈ 0.4, what sample size is needed? (b) If no previous data, what sample size?',
      expectedAnswer: '(a) n ≥ (z*/m)²·p̂(1−p̂) = (1.96/0.03)²·(0.4)(0.6) = (4267.11)·(0.24) ≈ 1024. So n ≥ 1024. \n(b) Use p̂ = 0.5 (max of p̂(1−p̂)). n ≥ (1.96/0.03)²·(0.5)(0.5) = (4267.11)·(0.25) ≈ 1067. So n ≥ 1067.',
      responseFormat: 'numeric', hints: ['n ≥ (z*/m)²·p̂(1−p̂); if unknown, use p̂ = 0.5.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'CI: p̂ ± z*·√(p̂(1−p̂)/n).',
      'Conditions: Random, Large Counts (np̂ ≥ 10 AND n(1−p̂) ≥ 10), 10%.',
      '95% confidence: long-run, NOT a probability about THIS interval.',
      'n needed: (z*/m)²·p̂(1−p̂); use 0.5 if no estimate.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.1-6.3', cedTitle: 'One-Proportion CI', sources: [{ type: 'concept', book: 'tps5e', chapter: '8', note: 'Standard 1-prop z-interval.' }] },
};
