/**
 * AP Statistics — CED Unit 3.7: Inference and Experiments.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U3_INFERENCE_EXPERIMENTS: LessonPlan = {
  id: 'evelyn.ap.stats.inference-experiments.v1', title: 'U3.7 Inference and Generalizability',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.inference-experiments', description: 'Distinguish what conclusions are warranted: causation requires random assignment; generalization requires random sampling. Identify scope of inference.', standard: 'AP-STATS-3.7' }],
  prerequisites: ['apstats.experimental-design'], followUps: [], estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the scope-of-inference table.', script: "AP graders care about WHICH CONCLUSIONS are valid from a study. The two questions: \"Can we generalize?\" (depends on random sampling) and \"Can we claim causation?\" (depends on random assignment). They\'re INDEPENDENT.", estimatedMinutes: 2 },
    { id: 'concept-inference', kind: 'concept', goal: 'Cover the 2×2 scope-of-inference table.',
      keyIdeas: [
        'TWO INDEPENDENT QUESTIONS:',
        '  1. Was the SAMPLE selected randomly from the population? → If YES, can GENERALIZE to that population.',
        '  2. Were SUBJECTS randomly ASSIGNED to treatments? → If YES, can claim CAUSATION.',
        'FOUR SCENARIOS (the AP scope-of-inference table):',
        '  • Random sample + random assignment → can generalize AND can claim causation. STRONGEST.',
        '  • Random sample only → can generalize the OBSERVED association but CANNOT claim causation.',
        '  • Random assignment only → can claim causation FOR THE SUBJECTS in the study but cannot generalize beyond them.',
        '  • Neither → cannot generalize, cannot claim causation. WEAKEST.',
        'WHY: random ASSIGNMENT balances lurking variables across treatment groups, allowing causal claims. Random SAMPLING ensures the sample resembles the population, allowing generalization.',
        'AP STYLE: when asked about scope of inference, address BOTH (a) generalizability and (b) causation, with justification.',
        'COMMON MISTAKE: claiming causation from an observational study (no random assignment) just because the association is strong.',
      ],
      vocabulary: [
        { term: 'random assignment', definition: 'using chance to allocate subjects to treatments — enables causation.' },
        { term: 'generalizability', definition: 'extent to which study results apply to a wider population — requires random sampling.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-scope', kind: 'worked_example',
      problem: 'A researcher takes a SRS of 500 adults from a city. She OBSERVES (does not assign) coffee consumption and heart-disease rates and finds a strong positive association. What can she conclude?',
      steps: [
        'STEP 1 — Random sampling: YES (SRS of city adults). → Can GENERALIZE to all city adults.',
        'STEP 2 — Random assignment: NO (observational study). → CANNOT claim causation.',
        'STEP 3 — Conclusion: "Among city adults, coffee consumption and heart disease are associated. We CANNOT conclude that coffee CAUSES heart disease — there could be lurking variables (e.g., stress, sleep) confounding the result."',
      ],
      answer: 'Generalize: yes. Causation: no. State both, with reason.', estimatedMinutes: 3 },
    { id: 'try-scenarios', kind: 'try_yourself',
      problem: 'Classify each study\'s scope of inference (generalize? causation?): \n(a) 100 volunteers from a single university are randomly ASSIGNED to drug A or placebo. Drug A reduces headaches. \n(b) A pollster takes a SRS of 1500 voters and asks about candidate preference and education level; finds an association. \n(c) A nationwide SRS of 2000 high-schoolers is randomly assigned to two study-techniques. Method 1 shows higher scores.',
      expectedAnswer: '(a) Random assignment YES, but volunteers (not random sample). Can claim CAUSATION for these volunteers. CANNOT generalize beyond them — could differ from the broader population. (b) Random sample YES, no assignment. Can generalize to voters. CANNOT claim causation — observational. (c) BOTH. Can generalize to high-schoolers nationwide AND claim causation. Strongest scope.',
      responseFormat: 'free', hints: ['Two questions: random sample? random assignment?'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A study at one hospital takes 200 willing patients and randomly assigns 100 to a new pain medication and 100 to a placebo. The new medication shows a statistically significant reduction in pain. (a) Can the researchers claim causation? (b) Can they generalize to all patients with this condition? (c) Suggest one improvement to broaden the scope of inference.',
      expectedAnswer: '(a) YES — random assignment was used. Within this study\'s patients, the new medication CAUSES less pain. (1.5)\n(b) NO. The 200 patients are not a random sample; they\'re VOLUNTEERS at one hospital. Findings may not extend to other hospitals or unwilling patients. (1.5)\n(c) Take a random sample of patients from MULTIPLE hospitals (or a large patient registry), then randomly assign within that sample. This combines random sampling and random assignment, broadening the scope to a defined population. (2)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Address generalize and causation separately, then improve.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Random SAMPLING → generalize.',
      'Random ASSIGNMENT → causation.',
      'They\'re independent. A study can have one, both, or neither.',
      'AP scope-of-inference questions: address both with justification.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '3', cedTopic: '3.7', cedTitle: 'Inference and Generalizability', sources: [{ type: 'concept', book: 'tps5e', chapter: '4', note: 'Standard scope-of-inference table.' }] },
};
