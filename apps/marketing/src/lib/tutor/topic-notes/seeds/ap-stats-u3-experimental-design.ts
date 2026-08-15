/**
 * AP Statistics — Unit 3 CED 3.5–3.6: Experimental Design.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.experimental-design.v1). Bullet-fragments consolidated into
 * framework/definition entries, methods humanized, pointers enriched to the
 * calibration standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.experimental-design';

export const BASELINE_AP_STATS_EXPERIMENTAL_DESIGN: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.experimental-design.v1',
  course: 'AP Statistics',
  cedUnit: 3,
  cedTopic: '3.5-3.6',
  cedTitle: 'Experimental Design',
  planId: 'evelyn.ap.stats.experimental-design.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.experimental-design.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Experimental vocabulary',
      content:
        'The **experimental unit** is the entity a treatment is applied to (a person is called a **subject**; could also be a plant or a plot of land). A **factor** is an explanatory variable the experimenter manipulates, and its **levels** are the specific values it takes (e.g., drug dose: 0mg, 50mg, 100mg). A **treatment** is one specific combination of factor levels applied to a unit. The **response variable** is what the experimenter measures as the outcome.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Three principles of good experimental design',
      content:
        '**Comparison** — include at least two treatment groups (often with a control group); without a comparison group you cannot tell whether the treatment itself caused any change. **Randomization** — randomly ASSIGN units to treatments, which balances out lurking variables across groups and is what makes causal inference possible. **Replication** — use enough units per treatment so that chance variation averages out and real treatment effects can be detected.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Control, placebo, and blinding',
      content:
        'A **control group** receives no treatment (or a placebo) and serves as the baseline for comparison. A **placebo** is a fake treatment that looks, tastes, or feels like the real one, controlling for the placebo effect. **Single-blind** means subjects do not know which treatment they received; **double-blind** means neither the subjects NOR the people measuring outcomes know — this guards against bias in both response and measurement.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Three design types: CRD, block, matched pairs',
      content:
        'A **completely randomized design (CRD)** randomly assigns ALL units to treatments with no grouping — the default, simplest design. A **randomized block design** first groups units into blocks of similar individuals (by sex, age, school), then randomizes WITHIN each block — this reduces variability when blocks differ on the response. A **matched-pairs design** is a special block design with blocks of size 2: either pair up similar subjects and randomize within each pair, or give each subject BOTH treatments in a randomly chosen order.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'confounding',
      content: 'when the effect of one variable on the response cannot be separated from the effect of another — random assignment is the main defense against it.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'block',
      content: 'a group of experimental units that are similar to one another with respect to some trait expected to affect the response; randomization happens WITHIN each block.',
    },
  ],
  methods: [
    {
      title: 'Design a completely randomized experiment',
      when_to_use: 'When an FRQ gives a pool of units and two (or more) treatments to compare, with no reason to group units before assigning.',
      steps: [
        'Identify the experimental units, the factor and its levels, and the response variable.',
        'Number the units and use a random number generator (or slips of paper) to assign them to treatment groups.',
        'Apply the treatments, holding all other conditions identical across groups.',
        'Measure the response variable for every unit.',
        'Compare the treatment groups using the response — name comparison, randomization, and replication explicitly.',
      ],
      example: {
        problem: 'A researcher tests whether a new fertilizer increases tomato yield using 60 tomato plants. Describe a completely randomized design.',
        solution:
          'Units: 60 tomato plants. Factor: fertilizer (2 levels — new vs. standard). Response: yield in lbs per plant. Number the plants 1–60 and use a random number generator to draw 30 numbers without replacement for the new-fertilizer group; the rest get the standard fertilizer. Grow all plants under otherwise identical conditions, then compare mean yield between the two groups.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Design a randomized block design',
      when_to_use: 'When units fall into distinct subgroups that are likely to respond differently, and you want to remove that source of variability before comparing treatments.',
      steps: [
        'Identify the blocking variable — a trait, other than the treatment, expected to affect the response.',
        'Sort the units into blocks so that units WITHIN a block are similar on that trait.',
        'Within EACH block separately, randomly assign units to the treatments.',
        'Compare treatments within each block, then combine results across blocks.',
        'State why blocking helps: it reduces variability due to the blocking trait, making a real treatment effect easier to detect.',
      ],
      example: {
        problem: 'A study compares two reading methods on 4th-graders. The researcher knows boys and girls often respond differently. There are 50 boys and 50 girls. Describe a randomized block design.',
        solution:
          'Block by sex: the 50 boys form one block, the 50 girls form another. WITHIN the boys block, randomly assign 25 to Method A and 25 to Method B; do the same within the girls block. Compare methods within each block, then combine — this removes variability due to sex differences from the treatment comparison.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Three principles: COMPARISON (a control/second group), RANDOMIZATION (random assignment), REPLICATION (enough units per group).', kind: 'tip' },
    { content: "FRQ vocab: describe the randomization MECHANISM ('number units, use RNG to assign') — writing only 'randomly assign' loses the method point.", kind: 'frq-vocab' },
    { content: 'Common error: calling a randomized BLOCK design a stratified SAMPLE, or vice versa — blocking/stratifying both group similar units, but one assigns treatments and the other selects a sample.', kind: 'common-error' },
    { content: 'Matched pairs = a block of size 2: EITHER pair similar subjects and randomize within the pair, OR one subject gets both treatments in random order.', kind: 'gotcha' },
    { content: 'Confounding example: giving drug A to morning patients and drug B to afternoon patients confounds treatment with time of day — fix with random assignment (or block by time and randomize within).', kind: 'edge-case' },
  ],
};
