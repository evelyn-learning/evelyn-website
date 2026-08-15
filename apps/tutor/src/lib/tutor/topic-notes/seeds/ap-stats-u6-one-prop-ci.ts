/**
 * AP Statistics — Unit 6 CED 6.1–6.3: One-Proportion Confidence Interval.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.one-prop-ci.v1).
 * Theory tagged with kind/title + an inline normal_curve illustrating the
 * central confidence region, methods humanized (interval construction +
 * sample-size planning), pointers enriched to the calibration standard
 * (ap-stats-u1-normal-distribution.ts / ap-stats-u2-*.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.one-prop-ci';

export const BASELINE_AP_STATS_ONE_PROP_CI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.one-prop-ci.v1',
  course: 'AP Statistics',
  cedUnit: 6,
  cedTopic: '6.1-6.3',
  cedTitle: 'One-Proportion Confidence Interval',
  planId: 'evelyn.ap.stats.one-prop-ci.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.one-prop-ci.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'One-proportion z-interval',
      content:
        'A CONFIDENCE INTERVAL gives a range of plausible values for the population proportion p, built around the point estimate $\\hat{p}$: $\\hat{p} \\pm z^*\\sqrt{\\hat{p}(1-\\hat{p})/n}$. The **margin of error (ME)** is $z^*\\cdot SE$, where the **standard error** is $SE = \\sqrt{\\hat{p}(1-\\hat{p})/n}$. Common critical values: $z^*=1.645$ for 90% confidence, $z^*=1.96$ for 95%, $z^*=2.576$ for 99%.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Central 95% confidence region (standard normal)',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          shadeRegion: { from: -1.96, to: 1.96 },
          markValues: [
            { x: -1.96, label: 'z* = −1.96' },
            { x: 1.96, label: 'z* = 1.96' },
          ],
          shadeArea: 0.95,
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions to verify',
      content:
        'Before building any one-proportion interval, verify: **Random** — an SRS or random assignment. **Large Counts** — $n\\hat{p} \\ge 10$ and $n(1-\\hat{p}) \\ge 10$ (use $\\hat{p}$, since p is unknown). **10% condition** — $n \\le 0.10N$ when sampling without replacement. Write all three out explicitly in every CI problem.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Interpreting the interval vs. the confidence level',
      content:
        'Two DIFFERENT statements, often confused. **Interval interpretation**: "We are C% confident that the true proportion of [parameter in context] is between [lower] and [upper]." **Confidence-level interpretation**: "If we repeated this sampling procedure many times, about C% of the resulting intervals would capture the true population proportion." AP pitfall: never say "there is a 95% probability that p is in this interval" — once computed, p is either in it or not; the 95% describes the long-run procedure, not this one interval.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Choosing a sample size for a target margin of error',
      content:
        'To guarantee margin of error at most m: $n \\ge (z^*/m)^2\\,\\hat{p}(1-\\hat{p})$. When no prior estimate of $\\hat{p}$ exists, use $\\hat{p}=0.5$ — it maximizes $\\hat{p}(1-\\hat{p})$ and gives the most conservative (largest) required n.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'critical value z*',
      content: '$z^*$ — the standard normal value such that the central area between $-z^*$ and $z^*$ equals the confidence level.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'margin of error',
      content: '$ME = z^*\\cdot SE$ — the half-width of the confidence interval; adding/subtracting it from $\\hat{p}$ gives the interval bounds.',
    },
  ],
  methods: [
    {
      title: 'Construct and interpret a one-proportion z-interval',
      when_to_use:
        'When asked to build a confidence interval for an unknown population proportion p from one sample.',
      steps: [
        'Compute the point estimate: $\\hat{p} = x/n$ (successes over sample size).',
        'Verify conditions: Random, Large Counts ($n\\hat{p}\\ge10$ and $n(1-\\hat{p})\\ge10$), 10%.',
        'Find the critical value $z^*$ for the stated confidence level.',
        'Compute $SE = \\sqrt{\\hat{p}(1-\\hat{p})/n}$ and $ME = z^*\\cdot SE$.',
        'Build the interval $\\hat{p} \\pm ME$.',
        'Interpret the interval in context using the standard template.',
      ],
      example: {
        problem: 'A survey finds 250 of 400 voters favor a measure. Construct a 95% confidence interval for the population proportion p.',
        solution:
          '$\\hat{p} = 250/400 = 0.625$, $n=400$. Conditions: Random (assume SRS) ✓; Large Counts: $n\\hat{p}=400(0.625)=250\\ge10$ and $n(1-\\hat{p})=400(0.375)=150\\ge10$ ✓; 10%: assume voter population exceeds 4000 ✓. $z^*=1.96$ for 95%. $SE=\\sqrt{0.625(0.375)/400}\\approx0.0242$. $ME=1.96(0.0242)\\approx0.0474$. Interval: $\\hat{p}\\pm ME = 0.625\\pm0.0474=(0.578, 0.672)$. "We are 95% confident that the true proportion of voters who favor the measure is between 57.8% and 67.2%."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find the sample size needed for a target margin of error',
      when_to_use:
        'When asked how large a sample must be to guarantee a stated margin of error at a given confidence level.',
      steps: [
        'Identify the target margin of error m and confidence level (gives $z^*$).',
        'If a prior estimate of $\\hat{p}$ exists, use it in $n \\ge (z^*/m)^2\\hat{p}(1-\\hat{p})$.',
        'If no prior estimate exists, use $\\hat{p}=0.5$ for the most conservative (largest) n.',
        'Round up to the next whole number of subjects — sample size is always rounded UP.',
      ],
      example: {
        problem: 'A pollster wants a 95% CI with margin of error at most 0.03. (a) If a previous poll suggests $\\hat{p}\\approx0.4$, what sample size is needed? (b) If no previous data exists, what sample size is needed?',
        solution:
          '(a) $z^*=1.96$, $m=0.03$. $n \\ge (z^*/m)^2\\hat{p}(1-\\hat{p}) = (1.96/0.03)^2(0.4)(0.6) \\approx 4267.1(0.24) \\approx 1024$. Need $n\\ge1024$. (b) With no estimate, use $\\hat{p}=0.5$: $n \\ge (1.96/0.03)^2(0.5)(0.5) \\approx 4267.1(0.25) \\approx 1067$. Need $n\\ge1067$ — larger because $\\hat{p}(1-\\hat{p})=0.5(0.5)=0.25$ is the maximum possible value of $\\hat{p}(1-\\hat{p})$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: '$ME = z^*\\cdot SE$; the interval is always $\\hat{p}\\pm ME$ — compute SE and ME before writing the interval bounds.', kind: 'tip' },
    { content: 'Use $\\hat{p}$ (not p) in Large Counts and SE for a CI — p is unknown; only significance tests use a hypothesized $p_0$.', kind: 'common-error' },
    { content: 'State BOTH interpretations when asked: the interval ("we are C% confident...") and the confidence level ("C% of intervals from repeated sampling would capture p").', kind: 'frq-vocab' },
    { content: 'Never say "there is a 95% probability p is in this interval" — p is fixed; the 95% describes the long-run procedure, not this one interval.', kind: 'gotcha' },
    { content: 'No prior estimate of $\\hat{p}$ for a sample-size calculation? Use $\\hat{p}=0.5$ — the most conservative choice, yielding the largest required n.', kind: 'edge-case' },
  ],
};
