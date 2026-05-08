/**
 * AP Statistics — CED Unit 3.1+3.2+3.3: Study planning and random
 * sampling methods.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U3_SAMPLING_METHODS: LessonPlan = {
  id: 'evelyn.ap.stats.sampling-methods.v1', title: 'U3.1 Random Sampling Methods',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.sampling-methods', description: 'Distinguish observational study vs. experiment. Identify and apply random sampling methods (SRS, stratified, cluster, systematic).', standard: 'AP-STATS-3.1-3.3' }],
  prerequisites: [], followUps: ['apstats.sampling-bias'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the data-collection question.', script: "Statistics describes data. But where does the data come from? Today: how to PLAN a study and choose a SAMPLE.", estimatedMinutes: 2 },
    { id: 'concept-design-types', kind: 'concept', goal: 'Cover study types + sampling methods.',
      keyIdeas: [
        'STUDY TYPES:',
        '  • OBSERVATIONAL STUDY: observe individuals; do NOT impose treatments. Can show association but NOT causation.',
        '  • EXPERIMENT: deliberately impose treatments on subjects. Can establish CAUSATION (if well-designed).',
        '  • CENSUS: every individual in the population is measured. Often impractical.',
        'SAMPLE: the subset of the population actually measured. POPULATION: the larger group we want to learn about.',
        'RANDOM SAMPLING METHODS — all use chance to select individuals:',
        '  • SIMPLE RANDOM SAMPLE (SRS): every group of n individuals has equal chance of being chosen.',
        '  • STRATIFIED RANDOM SAMPLE: divide population into STRATA (homogeneous groups, e.g., by grade level), then take SRS within each stratum. Reduces variability when strata differ.',
        '  • CLUSTER SAMPLE: divide into CLUSTERS (geographically, naturally — e.g., schools, blocks), then RANDOMLY SELECT some clusters and survey EVERYONE in those clusters. Cheaper but less precise.',
        '  • SYSTEMATIC SAMPLE: pick every kth individual after a random starting point.',
        'KEY DISTINCTION strata vs clusters:',
        '  • STRATA: groups within which units are SIMILAR; sample FROM EACH stratum.',
        '  • CLUSTERS: groups that are MINIATURE POPULATIONS each (heterogeneous within); sample SOME clusters entirely.',
        'HOW TO IMPLEMENT an SRS: number all N individuals 1 to N; use random number generator (or table) to select n unique numbers; those individuals are the sample.',
      ],
      vocabulary: [
        { term: 'population', definition: 'the entire group of interest.' },
        { term: 'sample', definition: 'the subset actually measured.' },
        { term: 'stratified random sample', definition: 'SRS within each homogeneous stratum.' },
        { term: 'cluster sample', definition: 'select some clusters and survey all members.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-srs', kind: 'worked_example',
      problem: 'A school has 1500 students. Describe how to take an SRS of 100 students.',
      steps: [
        'STEP 1 — Number all 1500 students 0001 to 1500 (or 1 to 1500).',
        'STEP 2 — Use a random number generator to produce 100 unique random integers between 1 and 1500. (Or, for paper: use a random digits table, reading 4-digit groups, ignoring repeats and numbers > 1500.)',
        'STEP 3 — The students whose numbers were selected are the SRS.',
      ],
      answer: 'Number students; use RNG to draw 100 unique integers from 1-1500.', estimatedMinutes: 3 },
    { id: 'try-classify', kind: 'try_yourself',
      problem: 'For each scenario, identify the sampling method (SRS, stratified, cluster, systematic): \n(a) A school divides students by grade (9, 10, 11, 12), then takes 25 SRS from each grade. \n(b) A pollster picks every 50th name from a phone book starting at name #17. \n(c) A researcher randomly picks 5 of 100 high schools in a state and surveys ALL students at those 5 schools. \n(d) A teacher puts every student\'s name in a hat and draws 10 names without replacement.',
      expectedAnswer: '(a) Stratified (strata = grades, SRS within each). (b) Systematic (every 50th, random start). (c) Cluster (5 of 100 high schools, then EVERYONE in each). (d) SRS.',
      responseFormat: 'free', hints: ['Strata: SRS in each. Cluster: all in some.'], estimatedMinutes: 3 },
    { id: 'try-design', kind: 'try_yourself',
      problem: 'AP-style synthesis. A university has 8000 undergrads (50% commuter, 50% on-campus). They want a sample of 200 to gauge satisfaction with parking. (a) Why might stratified random sampling be better than SRS here? (b) Describe the stratified procedure.',
      expectedAnswer: '(a) Commuters and on-campus students likely have VERY DIFFERENT views on parking. Stratifying ensures BOTH groups are well-represented in the sample. SRS could (by chance) over- or under-represent one group, increasing variability of the result. (2)\n(b) Divide the 8000 students into two strata: 4000 commuters and 4000 on-campus. Take SRS of 100 from each stratum (100 commuters, 100 on-campus). Combine for the final sample of 200. (2)\nTotal: 4 points.',
      responseFormat: 'frq', hints: ['Stratification reduces variability when strata differ.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Observational vs experiment: only experiments can establish causation.',
      'SRS: every group of n equally likely.',
      'Strata: SRS within similar groups. Cluster: all of selected groups. Systematic: every kth.',
      'Always describe how to USE randomization (RNG, slips of paper, etc.).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '3', cedTopic: '3.1-3.3', cedTitle: 'Random Sampling Methods', sources: [{ type: 'concept', book: 'tps5e', chapter: '4', note: 'Standard sampling methods.' }] },
};
