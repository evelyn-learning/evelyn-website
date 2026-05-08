/**
 * AP Statistics — Unit 3 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U3_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u3-frq-practice.v1', title: 'U3 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u3-frq-practice', description: 'Apply Unit 3 design principles to AP-style FRQs.', standard: 'AP-STATS-3-FRQ' }],
  prerequisites: ['apstats.inference-experiments'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 3 FRQs on sampling design, experimental design, and scope of inference. AP wants your reasoning, not just labels.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Sampling: SRS / stratified / cluster / systematic. Bias types named explicitly.',
      'Experiment: comparison + randomization + replication; CRD vs block vs matched pairs.',
      'Scope of inference: generalize (random sample) and causation (random assignment) — independent.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-sample-design', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Sample Design. A school district wants to estimate the proportion of its 12,000 students who would prefer a later school start time. The district has 4 high schools (3000 students each) with very different demographics. (a) Describe how to take a stratified random sample of size 400. (b) Why is stratification BETTER than SRS in this scenario? (c) Identify one possible source of nonresponse bias and how it could distort results.',
      expectedAnswer: '(a) Stratify by high school: 4 strata of 3000 each. Take SRS of 100 from each high school using a random number generator (number students at each school 1-3000; draw 100 unique numbers). Combine for total 400. (3)\n(b) The four schools have different demographics, likely different start-time preferences. Stratifying GUARANTEES representation from each school, REDUCING variability of the proportion estimate compared to SRS, which could randomly over- or under-represent one school. (2)\n(c) Students who don\'t respond may differ — perhaps morning-people are less invested in the question and don\'t reply, while late-risers (who favor later start) respond more. This would OVERESTIMATE the proportion favoring later start. Mitigation: follow-ups, multiple modes (online + paper), incentives. (2)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Describe procedure step-by-step; give bias direction.'], estimatedMinutes: 7 },
    { id: 'try-frq-experiment', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Experimental Design. A researcher wants to test whether a new fertilizer increases the yield of corn. She has 100 cornfields available, half in soil type "A" (clay-rich) and half in soil type "B" (sandy). (a) Describe a completely randomized design. (b) Describe a randomized block design that uses soil type. (c) Why might the block design be preferred?',
      expectedAnswer: '(a) Number all 100 fields 1-100; use RNG to randomly assign 50 to "new fertilizer" and 50 to "standard fertilizer (control)." Apply treatments; measure yield; compare means. (2)\n(b) Block by soil type: 50 type-A fields form one block, 50 type-B form another. Within EACH block, randomly assign 25 to new fertilizer and 25 to control. Compare yields within blocks, then combine. (2.5)\n(c) Soil type likely has a LARGE effect on yield (clay vs sandy). In a CRD, by chance one fertilizer might get more of one soil type, CONFOUNDING soil with treatment. Blocking by soil type ELIMINATES this — both treatments get equal soil-type representation. Reduces variability and gives more precise treatment-effect estimates. (2.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['CRD: number + RNG. Block: randomize within blocks. Justify with variability reduction.'], estimatedMinutes: 7 },
    { id: 'try-frq-scope', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Scope of Inference. A psychology study takes 80 volunteers from one university and randomly assigns 40 to a 6-week meditation program and 40 to a control group. After the study, meditators report significantly less anxiety. (a) Can the researchers claim that meditation REDUCED anxiety in this group? Justify. (b) Can they generalize to all college students? Justify. (c) The researchers want to make a stronger claim. Suggest one specific change to the study to enable broader generalization.',
      expectedAnswer: '(a) YES, they can claim CAUSATION for these subjects. Random ASSIGNMENT to meditation vs control balances out lurking variables (personality, prior anxiety levels), so the difference in anxiety can be attributed to meditation. (2)\n(b) NO. The 80 participants were VOLUNTEERS from ONE university — not a random sample of college students. They may differ systematically (e.g., more motivated, predisposed to mindfulness). Cannot generalize beyond these volunteers. (2)\n(c) Take a random sample of college students from MULTIPLE universities (e.g., 80 randomly selected nationwide) BEFORE randomly assigning to meditation vs control. This combines random sampling AND random assignment, allowing both causal claims AND generalization to all college students. (2)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Two questions: random assignment? random sample? Address both.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Stratified for variability reduction; cluster for cost; SRS as default.',
      'CRD vs block: block when units differ in ways correlated with response.',
      'Causation = random assignment. Generalization = random sample.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '3', cedTopic: '3-FRQ', cedTitle: 'Unit 3 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-3 FRQs.' }] },
};
