/**
 * G11 / AP Stats — Confidence intervals.
 *
 * What a CI means (and doesn't mean), how to compute one for a mean,
 * margin of error, sample size effect.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_STATS_CONFIDENCE_INTERVALS: LessonPlan = {
  id: 'evelyn.g11.stats.confidence-intervals.v1',
  title: 'Confidence intervals',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.confidence-intervals',
      description: 'Construct and interpret confidence intervals for a population parameter.',
      standard: 'AP-STATS-UNC-3',
    },
  ],
  prerequisites: ['apstats.sampling-distributions'],
  followUps: ['apstats.hypothesis-test'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame CI as honest uncertainty quantification.',
      script: 'A poll says 52% of voters support Candidate A, "with a margin of error of ±3%". That\'s a CONFIDENCE INTERVAL — admitting we don\'t know exactly, but giving a likely range. Honest statistics never says "exactly".',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ci-meaning',
      kind: 'concept',
      goal: 'Define CI, compute one for a mean, distinguish what it does and doesn\'t mean.',
      keyIdeas: [
        'A CONFIDENCE INTERVAL gives a RANGE of plausible values for the population parameter, with a stated CONFIDENCE LEVEL (95%, 99%, etc.).',
        'For a mean: CI = x̄ ± z* · (σ/√n) where x̄ is sample mean, σ is population std dev, n is sample size, z* is the critical value for the confidence level (1.96 for 95%, 2.58 for 99%).',
        'MARGIN OF ERROR = z* · (σ/√n). It controls the WIDTH of the interval.',
        'BIGGER n → SMALLER margin → tighter interval. To halve the margin, you need 4× the sample.',
        'HIGHER confidence (95% → 99%) → WIDER interval (more cushion to be sure you covered it).',
        'INTERPRETATION (correct): "I am 95% confident the true mean is between L and U." OR: "If we repeated this many times, 95% of the resulting intervals would contain the true mean."',
        'INTERPRETATION (WRONG): "There is a 95% probability the true mean is in this specific interval." (The true mean is fixed; either it\'s in this interval or it isn\'t. The probability is about the PROCESS, not this one interval.)',
      ],
      vocabulary: [
        { term: 'confidence interval', definition: 'a range of plausible values for a population parameter.' },
        { term: 'margin of error', definition: 'half the width of a confidence interval.' },
        { term: 'critical value', definition: 'the multiplier that sets the confidence level (e.g., z* = 1.96 for 95%).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mean-ci',
      kind: 'worked_example',
      problem: 'A sample of 100 students has mean test score 78 with population std dev σ = 15. Build a 95% CI for the population mean.',
      steps: [
        'CI formula: x̄ ± z* · (σ/√n).',
        'Plug in: x̄ = 78, σ = 15, n = 100, z* = 1.96.',
        'Margin = 1.96 × (15/√100) = 1.96 × (15/10) = 1.96 × 1.5 = 2.94.',
        'CI: 78 ± 2.94 → (75.06, 80.94).',
        'Interpretation: "We are 95% confident the population mean test score is between 75.06 and 80.94."',
      ],
      answer: '(75.06, 80.94)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the above example, if we want to HALVE the margin of error (keep the same confidence level), what sample size would we need?',
      expectedAnswer: '400',
      responseFormat: 'numeric',
      hints: [
        'Margin scales with 1/√n. To halve it, need √n to DOUBLE.',
        'If √n doubles, n quadruples. 100 × 4 = 400.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-95-percent-this-interval',
      kind: 'misconception_check',
      question: 'For a 95% CI of (75, 81), is there a 95% probability that the true mean is between 75 and 81?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Misinterpreting probability of THIS interval.',
          correctsTo: 'No — the true mean is FIXED. Either this interval contains it (100%) or it doesn\'t (0%). The "95%" refers to the PROCEDURE: if we repeated this many times, 95% of intervals would contain the true mean. But for THIS one, we don\'t know.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CI = x̄ ± z* · (σ/√n) for a mean.',
        'Margin of error scales with 1/√n. To halve, need 4× sample.',
        'Higher confidence → WIDER interval.',
        '95% refers to the PROCEDURE\'s long-run rate, not this specific interval.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When you don\'t know population σ, you use the t-distribution and sample s instead. Why?',
      hint: 'σ is rarely known in practice. The t-distribution accounts for the extra uncertainty from estimating σ from a sample. For large n, t and z look identical; for small n, t is wider.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
