/**
 * AP Statistics — Unit 3 CED 3.7: Inference and Generalizability.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.inference-experiments.v1). Bullet-fragments consolidated
 * into framework/definition entries, methods humanized, pointers enriched to
 * the calibration standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.inference-experiments';

export const BASELINE_AP_STATS_INFERENCE_EXPERIMENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.inference-experiments.v1',
  course: 'AP Statistics',
  cedUnit: 3,
  cedTopic: '3.7',
  cedTitle: 'Inference and Generalizability',
  planId: 'evelyn.ap.stats.inference-experiments.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.inference-experiments.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two independent questions about a study',
      content:
        'Every study answers two SEPARATE questions. (1) Was the sample selected using random SAMPLING from the population? If yes, you may GENERALIZE the results to that population. (2) Were subjects randomly ASSIGNED to treatments? If yes, you may claim CAUSATION. These two questions are independent of each other — a study can have random sampling, random assignment, both, or neither.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The four-scenario scope-of-inference table',
      content:
        '**Random sample + random assignment** → can generalize AND claim causation — the strongest possible scope. **Random sample only** (observational study on a random sample) → can generalize the observed association to the population but CANNOT claim causation. **Random assignment only** (experiment on volunteers, not a random sample) → can claim causation for the subjects actually studied but CANNOT generalize beyond them. **Neither** → cannot generalize and cannot claim causation — the weakest scope.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why each type of randomness buys a different conclusion',
      content:
        'Random ASSIGNMENT balances lurking variables across the treatment groups on average, so any systematic difference in the response can be attributed to the treatment — this is what licenses a causal claim. Random SAMPLING ensures the sample resembles the population on average, so the sample\'s results can be extended to the population — this is what licenses generalization. Mixing these up is the single most common scope-of-inference error.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'random assignment',
      content: 'using chance to allocate experimental subjects to treatment groups — the mechanism that licenses a causal conclusion.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'scope of inference',
      content: 'the set of conclusions (generalization, causation, both, or neither) that a study\'s design actually justifies.',
    },
  ],
  methods: [
    {
      title: 'Evaluate the scope of inference for a study',
      when_to_use: 'When an FRQ describes a study and asks what conclusions (generalization and/or causation) are warranted.',
      steps: [
        'Ask: was the sample chosen using a RANDOM SAMPLING method from a defined population? Answer yes/no.',
        'Ask: were subjects randomly ASSIGNED to treatments (as opposed to just observed)? Answer yes/no.',
        'Match the two answers to the four-scenario table to determine what is and is not warranted.',
        'Write a conclusion that addresses BOTH generalizability and causation explicitly, in context, with a one-clause justification for each.',
      ],
      example: {
        problem:
          'A researcher takes an SRS of 500 adults from a city. She OBSERVES (does not assign) coffee consumption and heart-disease rates and finds a strong positive association. What can she conclude?',
        solution:
          'Random sampling: yes (SRS of city adults) → can generalize to all city adults. Random assignment: no (observational study) → cannot claim causation. Conclusion: among city adults, coffee consumption and heart disease are associated, but we cannot conclude that coffee causes heart disease — a lurking variable (e.g., stress, sleep) could confound the result.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Diagnose a weak-scope study and propose an improvement',
      when_to_use: 'When a study uses random assignment but a convenience sample (or vice versa), and the FRQ asks how to broaden the scope of inference.',
      steps: [
        'Determine whether random assignment was used — if so, causation is warranted FOR THE STUDIED SUBJECTS only.',
        'Determine whether the subjects were a random sample of a larger population — if not, generalization is NOT warranted, no matter how strong the effect.',
        'State plainly which of the two conclusions fails and why (name the missing ingredient).',
        'Propose a concrete fix: draw a random sample from the intended population, then randomly assign WITHIN that sample — combining both forms of randomness.',
      ],
      example: {
        problem:
          'A study at one hospital takes 200 willing patients and randomly assigns 100 to a new pain medication and 100 to a placebo; the new medication shows a statistically significant reduction in pain. (a) Can they claim causation? (b) Can they generalize to all patients with this condition? (c) Suggest one improvement.',
        solution:
          '(a) Yes — random assignment was used, so within this study\'s patients the new medication causes less pain. (b) No — the 200 patients are volunteers at one hospital, not a random sample, so findings may not extend to other hospitals or unwilling patients. (c) Take a random sample of patients from multiple hospitals (or a large patient registry), then randomly assign treatments within that sample — combining random sampling and random assignment broadens the scope to a well-defined population.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Random SAMPLING → generalize to the population. Random ASSIGNMENT → claim causation. The two are independent — check each separately.', kind: 'tip' },
    { content: 'FRQ vocab: when asked about scope of inference, address BOTH generalizability and causation explicitly, each with its own one-clause justification.', kind: 'frq-vocab' },
    { content: 'Common error: claiming causation from an observational study just because the association looks strong — strength of association never substitutes for random assignment.', kind: 'common-error' },
    { content: 'An experiment on volunteers (random assignment, no random sample) proves causation only FOR THOSE VOLUNTEERS — it does not automatically generalize further.', kind: 'gotcha' },
    { content: 'The strongest designs combine BOTH random sampling and random assignment in one study; most real studies achieve only one, which caps the possible conclusion.', kind: 'edge-case' },
  ],
};
