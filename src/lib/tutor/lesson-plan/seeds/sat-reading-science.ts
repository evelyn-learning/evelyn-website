/**
 * SAT Reading — Science passages.
 *
 * Reading scientific articles, interpreting data, hypothesis vs conclusion.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_READING_SCIENCE: LessonPlan = {
  id: 'evelyn.sat.reading.science.v1',
  title: 'SAT Reading — Science Passages',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'sat.reading-science',
      description: 'Apply specific strategies to science passages on the SAT Reading section, including identifying hypothesis, methodology, results, and interpreting graphs and tables.',
      standard: 'SAT-READING-SCI',
    },
  ],
  prerequisites: ['sat.reading-evidence'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Science passages reward structured reading, not memorized facts.',
      script: 'Science passages on the SAT aren\'t testing whether you know biology or astronomy. They test whether you can READ a research description: identify the hypothesis, understand the experiment, interpret the results, and distinguish what\'s SHOWN from what\'s SPECULATED. The structure is consistent — once you spot it, science passages become some of the easier ones.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Reading science passages for IMRaD structure + data.',
      keyIdeas: [
        'IMRaD STRUCTURE: Introduction (background + hypothesis), Methods (how the study was done), Results (what was found), and Discussion (what it means). Most SAT science passages follow this implicitly.',
        'IDENTIFY THE HYPOTHESIS: what did the researchers EXPECT to find? Often phrased "We hypothesized that..." or implied by the question being asked.',
        'IDENTIFY THE METHOD: who/what was studied, what variables were measured, what was the comparison/control? Quick scan — don\'t need to memorize.',
        'IDENTIFY THE FINDING: what did the data show? Look for explicit statements: "The results indicated...", "We found...", "The data suggest..."',
        'CORRELATION vs CAUSATION: a recurring SAT trap. The data may show a CORRELATION (X and Y move together) but the passage may discuss CAUSATION (X causes Y). The SAT often asks if the conclusion is justified — usually NOT, if it\'s causal from correlational data.',
        'LIMITATION-AWARE READING: scientists hedge ("suggests", "may", "is consistent with"). Don\'t overstate the finding. SAT loves answers with appropriately tentative language ("provides some evidence that") and false answers with overclaiming ("definitively proves").',
        'DATA / CHARTS / TABLES: read AXES and UNITS first. Identify the variable on each axis. Look for trends (increasing? decreasing? non-monotonic?). Specific values may be asked — read them precisely.',
        'PAIRED EXPERIMENTS: sometimes two scientists or two studies are presented. Compare what they each find and how they explain. Are they compatible? Conflicting?',
        'NEW-WORD VOCABULARY: science passages have technical terms (mitochondria, neural plasticity, exoplanet) — they\'re USUALLY DEFINED IN CONTEXT. Don\'t panic.',
      ],
      vocabulary: [
        { term: 'hypothesis', definition: 'a proposed explanation tested by an experiment.' },
        { term: 'control group', definition: 'a baseline comparison group not given the experimental treatment.' },
        { term: 'correlation vs causation', definition: 'two variables moving together (correlation) does not prove one causes the other (causation).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-correlation',
      kind: 'worked_example',
      problem: 'A passage reports: "Children who eat breakfast tend to score higher on standardized tests." A SAT question asks whether this means breakfast CAUSES higher scores. How do you reason about it?',
      steps: [
        'The data show a CORRELATION between breakfast and scores. Children who eat breakfast and children who score high are the same group.',
        'CAUSATION would require ruling out alternative explanations. Possible confounds: kids who eat breakfast may come from more stable home environments → both better breakfast AND more academic support. Or healthier kids → eat breakfast AND score higher. Or wealthier families → both.',
        'Without an EXPERIMENT (randomly assigning some kids to eat breakfast and others not), causal claims aren\'t supported. The correlation could go through any of those third-variable explanations.',
        'CORRECT SAT ANSWER would say something like: "the data are consistent with multiple explanations" or "do not support a causal conclusion".',
        'WRONG ANSWER: "the data prove that eating breakfast improves test scores".',
      ],
      answer: 'Correlation, not causation. Confounding variables (home stability, health, wealth) are unaccounted for.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A study compares cancer rates in city A (high air pollution) and city B (low pollution) and finds higher rates in A. The author concludes pollution causes cancer. What\'s a possible alternative explanation?',
      expectedAnswer: 'Confounding variables: city A may differ from city B in age distribution (older population → more cancer), smoking rates, healthcare access, occupational hazards, diet. Without controlling for these, the higher cancer rate may be from those factors, not pollution itself.',
      responseFormat: 'free',
      hints: [
        'What else could differ between cities besides pollution?',
        'Demographics, occupations, lifestyle, healthcare access.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-data-overclaim',
      kind: 'misconception_check',
      question: 'A SAT science passage says "data suggest" a relationship. Does that mean the relationship is proven?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating tentative scientific language as confirmation.',
          correctsTo: 'No. "Suggest" is hedge language — it means consistent with, possibly, not definitively. Strong scientific language: "demonstrate", "establish", "confirm". Tentative: "suggest", "may", "consistent with", "imply". The SAT specifically tests whether you read these distinctions correctly. Answer choices that overclaim from tentative data are common WRONG answers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'IMRaD structure: hypothesis → methods → results → discussion.',
        'Correlation ≠ causation. Look for confounds.',
        'Read the AXES and UNITS first on graphs.',
        'Hedge language ("suggest", "may") ≠ proof.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are RANDOMIZED CONTROLLED EXPERIMENTS so much stronger evidence than observational studies?',
      hint: 'In an RCT, researchers ASSIGN participants to groups randomly. This makes the groups statistically equivalent on AVERAGE — even on confounds you didn\'t measure. So differences between groups can be attributed to the treatment. In observational studies, groups self-select; differences may reflect any factor that drives selection. RCT design is the gold standard precisely because it neutralizes confounds.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
