/**
 * AP Statistics — Unit 3 CED 3.1–3.3: Random Sampling Methods.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.sampling-methods.v1). Bullet-fragments consolidated into
 * framework/definition entries, methods humanized, pointers enriched to the
 * calibration standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.sampling-methods';

export const BASELINE_AP_STATS_SAMPLING_METHODS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.sampling-methods.v1',
  course: 'AP Statistics',
  cedUnit: 3,
  cedTopic: '3.1-3.3',
  cedTitle: 'Random Sampling Methods',
  planId: 'evelyn.ap.stats.sampling-methods.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.sampling-methods.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Three ways to collect data: observational study, experiment, census',
      content:
        'An **observational study** watches individuals and records what happens WITHOUT imposing any treatment — it can reveal association but never causation. An **experiment** deliberately IMPOSES treatments on subjects, which is what lets a well-designed study claim causation. A **census** measures every individual in the population; it is the gold standard but is usually too costly or impractical, which is why we sample instead.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Population, sample, and the four random sampling methods',
      content:
        'The **population** is the entire group we want to learn about; the **sample** is the subset we actually measure. Every legitimate random method uses CHANCE, not judgment, to pick individuals: **simple random sample (SRS)** — every group of n individuals is equally likely to be chosen; **stratified random sample** — split the population into strata, then take an SRS from each; **cluster sample** — split into clusters, randomly choose whole clusters, and measure everyone inside them; **systematic sample** — pick every kth individual after a random starting point.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Strata vs clusters — the key distinction',
      content:
        'This is the single most-tested contrast in this topic. A **stratum** is a group whose members are SIMILAR to each other on some trait that matters (grade level, gender) — you sample FROM EVERY stratum. A **cluster** is a group that is itself a mini-population, HETEROGENEOUS inside (a school, a city block) — you sample only SOME clusters, but take EVERYONE within the chosen ones. Stratifying reduces variability when the strata differ on the response; clustering is chosen for cost/convenience, at the price of some precision.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'simple random sample (SRS)',
      content: 'a sample chosen so that every group of n individuals from the population has an equal chance of being selected.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'stratified random sample',
      content: 'divide the population into strata (groups that are similar within themselves), then take a separate SRS from each stratum.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'cluster sample',
      content: 'divide the population into clusters (each a mini-population), randomly select some clusters, and measure every individual within the selected clusters.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'systematic sample',
      content: 'choose a random starting point, then select every kth individual from a list.',
    },
  ],
  methods: [
    {
      title: 'Implement an SRS from a numbered population',
      when_to_use: 'When asked to DESCRIBE (not just name) how to select a simple random sample of size n from a population of size N.',
      steps: [
        'Number every individual in the population from 1 to N (or 0001 to N for a digits table).',
        'Use a random number generator (or a table of random digits) to produce n UNIQUE integers between 1 and N.',
        'If using a printed digits table, read digit groups matching the width of N, discarding repeats and any values outside 1–N.',
        'The individuals whose numbers were drawn make up the SRS.',
        'State explicitly that the mechanism used CHANCE — "randomly" alone is not enough for full credit.',
      ],
      example: {
        problem: 'A school has 1500 students. Describe how to take an SRS of 100 students.',
        solution:
          'Number the 1500 students 0001 to 1500. Use a random number generator to produce 100 unique integers from 1 to 1500 (or, on paper, read 4-digit groups from a random digits table, ignoring repeats and numbers above 1500). The 100 students whose numbers are drawn form the SRS.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Choose and justify a sampling design for a scenario',
      when_to_use: 'When an FRQ describes a population with known subgroups and asks you to recommend or justify SRS vs stratified vs cluster sampling.',
      steps: [
        'Look for subgroups that plausibly differ on the variable of interest — that signals STRATIFIED (SRS within each) is worth considering.',
        'Look for a population already organized into natural, geographically or administratively separate groups — that signals CLUSTER (sample whole groups) may be appropriate.',
        'If stratifying, state the reason: it GUARANTEES both groups are represented and reduces variability versus an SRS that might over- or under-sample one group by chance.',
        'Describe the concrete procedure: name the strata (or clusters), state the sample size drawn from each, and name the random mechanism used.',
      ],
      example: {
        problem:
          'A university has 8000 undergrads (50% commuter, 50% on-campus) and wants a sample of 200 to gauge satisfaction with parking. (a) Why might stratified random sampling be better than SRS here? (b) Describe the procedure.',
        solution:
          '(a) Commuters and on-campus students likely have very different views on parking, so stratifying guarantees both groups are well represented and reduces variability compared to an SRS, which could by chance over- or under-represent one group. (b) Divide the 8000 students into two strata of 4000 (commuters, on-campus). Take an SRS of 100 from each stratum using a random number generator, then combine the two SRSs into the final sample of 200.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Four random methods: SRS (equal chance for every group of n), stratified (SRS within similar groups), cluster (all of some groups), systematic (every kth).', kind: 'tip' },
    { content: "FRQ vocab: don't just say 'randomly select' — describe the MECHANISM (numbered labels + RNG or digits table) to earn the method point.", kind: 'frq-vocab' },
    { content: 'Strata vs clusters is the #1 confusion: strata are SIMILAR within (sample from each); clusters are mini-populations, HETEROGENEOUS within (sample whole ones).', kind: 'common-error' },
    { content: 'A systematic sample (every kth) is not a true SRS — not every GROUP of n has an equal chance — even though every individual has an equal chance of selection.', kind: 'gotcha' },
    { content: 'A cluster sample only works well if the clusters themselves resemble the population; if clusters differ wildly, cluster sampling can be worse than SRS despite being cheaper.', kind: 'edge-case' },
  ],
};
