/**
 * AP Statistics — Unit 3 CED 3.4: Sampling Bias.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.sampling-bias.v1). Bullet-fragments consolidated into
 * framework/definition entries + an inline bar chart illustrating the
 * direction of voluntary-response bias, methods humanized, pointers enriched
 * to the calibration standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.sampling-bias';

export const BASELINE_AP_STATS_SAMPLING_BIAS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.sampling-bias.v1',
  course: 'AP Statistics',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Sampling Bias',
  planId: 'evelyn.ap.stats.sampling-bias.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.sampling-bias.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Bias is systematic, not random',
      content:
        'BIAS is a SYSTEMATIC tendency for sample results to differ from the population truth in the same direction, every time you repeat the study the same way. This is fundamentally different from random sampling variability — a bigger sample size shrinks variability, but a bigger BIASED sample is just as wrong, only with more false confidence.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Six sources of sampling bias',
      content:
        '**Voluntary response bias** — respondents self-select (call-in polls, online surveys), so people with strong opinions are over-represented. **Convenience sampling** — surveying whoever is easiest to reach; not representative. **Undercoverage** — some part of the population is systematically left out of the sampling frame (e.g., landline-only calling misses cell-only households). **Nonresponse bias** — selected individuals cannot or will not respond, and nonresponders differ from responders. **Response bias** — respondents lie or distort answers, especially on sensitive topics. **Question-wording bias** — leading or loaded wording pushes respondents toward an answer.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Voluntary response bias overestimates support',
          categories: ['True city-wide support', "Call-in poll result"],
          values: [50, 80],
          yLabel: 'Percent in favor',
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'A huge biased sample can beat a tiny one — the wrong way',
      content:
        'A poorly designed sample of MILLIONS can be worse than a properly designed sample of HUNDREDS, because bias does not average out as n grows. The classic case: the 1936 Literary Digest poll surveyed 2.4 million people and predicted Landon over Roosevelt — wrong, because of voluntary response and undercoverage (the sampling frame skewed toward wealthier households).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'voluntary response bias',
      content: 'bias from letting respondents self-select into a sample (call-ins, online polls) — over-represents people with strong opinions.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'undercoverage',
      content: 'some part of the population is systematically excluded from the sampling frame before selection even happens.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'nonresponse bias',
      content: 'bias that arises when selected individuals cannot or will not respond, and those nonresponders differ systematically from responders.',
    },
  ],
  methods: [
    {
      title: 'Identify a source of bias and explain its direction',
      when_to_use: 'When an FRQ describes a data-collection scenario and asks you to name the bias and state whether the result over- or under-estimates the truth.',
      steps: [
        'Name the specific bias type (voluntary response, convenience, undercoverage, nonresponse, response, or question wording).',
        'Identify WHO is over- or under-represented as a result of that mechanism.',
        'State the DIRECTION: does the reported statistic likely overestimate or underestimate the true population value?',
        'Write one full sentence combining the name, the mechanism, and the direction — a bare label earns no credit.',
      ],
      example: {
        problem:
          'A radio host asks listeners to call in and vote on whether the city should build a new stadium. 80% of callers vote yes. Identify the bias and explain its likely direction.',
        solution:
          'Voluntary response bias: callers self-selected. Listeners who feel strongly about the stadium — likely fans who favor it — are the most motivated to call in. So the 80% likely OVERESTIMATES true city-wide support for the stadium.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Diagnose two overlapping sources of bias in one scenario',
      when_to_use: 'When a scenario plausibly involves more than one bias mechanism at once (a common synthesis-FRQ setup).',
      steps: [
        'Read the scenario for BOTH a response-quality cue (sensitive/self-flattering question) and a participation cue (who chose to respond).',
        'Name each bias separately — do not merge them into one vague answer.',
        'For each one, state its likely direction on the result.',
        'Combine into a conclusion: do the two biases push the result the SAME way (compounding) or opposite ways (partially offsetting)?',
      ],
      example: {
        problem:
          "A school sends a homework survey to parents: \"How often does your child do homework?\" 70% respond \"always.\" Identify two likely sources of bias and describe how each distorts the result.",
        solution:
          'Response bias: parents may exaggerate their child\'s diligence (social desirability), inflating "always/often" responses. Nonresponse bias: parents who respond may be more engaged, and their kids may genuinely do more homework, so the 70% overstates the true population rate. Both biases push the reported rate ABOVE the truth.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Bias is SYSTEMATIC — a larger sample size reduces variability but does NOT fix bias.', kind: 'tip' },
    { content: "FRQ vocab: always NAME the bias type AND explain the DIRECTION of distortion — 'voluntary response bias' alone earns no credit.", kind: 'frq-vocab' },
    { content: "Common error: writing 'increase the sample size' as a fix for a biased sampling method. Only a redesigned sampling FRAME fixes bias.", kind: 'common-error' },
    { content: 'Undercoverage happens BEFORE selection (excluded from the frame); nonresponse happens AFTER selection (chosen but didn\'t answer). Easy to mix up.', kind: 'gotcha' },
    { content: 'Scenarios can layer multiple biases at once (e.g., loaded wording + voluntary response) — name each one and its own direction rather than picking just one.', kind: 'edge-case' },
  ],
};
