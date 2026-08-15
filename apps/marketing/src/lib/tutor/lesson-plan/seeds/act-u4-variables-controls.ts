/**
 * ACT — Science / Variables & Controls: the most-repeated question type
 * on Research Summaries passages.
 *
 * Research Summaries passages describe 2-3 experiments and make up about
 * half the ACT Science section. Every single one asks at least one
 * question about independent/dependent/controlled variables or the
 * control group — and the ACT deliberately baits students into
 * confusing "controlled variable" (one held-constant factor) with
 * "control group" (a whole baseline condition). No outside science
 * knowledge needed, only precise reading of the experiment description.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_VARIABLES_CONTROLS: LessonPlan = {
  id: 'evelyn.testprep.act.variables-controls.v1',
  title: 'Variables & Controls',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.variables-controls',
      standard: 'ACT-4.4',
      description:
        'Identify a study\'s independent, dependent, and controlled variables, and explain why a control group is needed to draw a valid conclusion.',
    },
  ],
  prerequisites: ['act.data-representation'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe variables/controls as the single most-repeated question type on ACT Science Research Summaries passages — a guaranteed few points if the four terms are locked down.',
      script:
        'Research Summaries passages make up about half of the ACT Science section — roughly 3 to 4 of the 6-7 passages — and EVERY one of them asks at least one question about independent variables, dependent variables, controlled variables, or the control group. That\'s a guaranteed handful of the 40 questions, answerable in under 52 seconds each, if you know exactly what each term means and never mix them up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-variables-controls',
      kind: 'concept',
      goal: 'The four terms — independent, dependent, controlled variable, control group — and the traps the ACT builds around confusing them.',
      keyIdeas: [
        'INDEPENDENT VARIABLE = what the researchers deliberately choose to change across trials or groups (dose, temperature, light exposure...). Ask: "What did the scientist SET?"',
        'DEPENDENT VARIABLE = the outcome that is measured or recorded (growth, reaction rate, test score...). Ask: "What did the scientist MEASURE?"',
        'CONTROLLED VARIABLES = every OTHER factor deliberately held the SAME across all groups, so any difference in the outcome can only be attributed to the independent variable.',
        'CONTROL GROUP = a whole experimental condition (not a single factor) that receives no treatment, or the standard/current treatment, and serves as the baseline for comparison. It is asked about SEPARATELY from controlled variables.',
        'WHY A CONTROL EXISTS: without a baseline, you cannot tell whether a change in the dependent variable was actually caused by the independent variable, or would have happened anyway.',
        'TRAP — TERM CONFUSION: "controlled variable" (one held-constant factor) and "control group" (an entire baseline condition) sound alike and are DELIBERATELY both tested in the same passage. Read the exact wording of the question.',
        'TRAP — ASSUMING THE FIRST GROUP IS THE CONTROL: the control isn\'t always listed first, and some passages include a second comparison group (e.g., "current standard treatment") that is NOT the true control. Only the no-treatment or explicitly-labeled-baseline group is the control.',
        'TRAP — MULTIPLE EXPERIMENTS, MULTIPLE CONTROLS: a Research Summaries passage often runs 2-3 separate experiments; each may have its own independent variable and its own control. Don\'t assume Experiment 2 copies Experiment 1\'s setup.',
      ],
      vocabulary: [
        { term: 'independent variable', definition: 'the factor the researcher deliberately changes across groups or trials.' },
        { term: 'dependent variable', definition: 'the outcome the researcher measures; what changes (or not) in response.' },
        { term: 'controlled variable', definition: 'a single factor held constant across every group so it cannot explain any difference in the outcome.' },
        { term: 'control group', definition: 'the baseline condition (often no treatment) that other groups are compared against.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify-all-three',
      kind: 'worked_example',
      problem:
        'A Research Summary describes a study on bean plant growth. Three groups of 10 seedlings each were planted in identical pots with the same soil, water, and temperature. Group 1 received 4 hours of light per day, Group 2 received 8 hours, and Group 3 received 12 hours. After 3 weeks, the average height of each group was measured. Identify the independent variable, the dependent variable, and one controlled variable.',
      steps: [
        'Find what the researchers deliberately changed across the three groups: hours of light per day (4, 8, 12). That is the independent variable.',
        'Find what was measured as the outcome: average plant height after 3 weeks. That is the dependent variable.',
        'Find what was kept the same across all groups: soil, water, and temperature — any one of these is a controlled variable.',
        'Note: this study has no "zero light" group — all three groups received some light, so the comparison is among light LEVELS, not treatment vs. no treatment.',
      ],
      answer:
        'Independent: hours of light per day. Dependent: average plant height after 3 weeks. Controlled variables: soil, water, and temperature (held the same for all groups).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-control-group-trap',
      kind: 'worked_example',
      problem:
        'A Research Summary describes testing a new insect repellent. Group A traps are treated with the NEW repellent. Group B traps are treated with the CURRENT best-selling repellent. Group C traps receive no repellent at all. All traps are identical in size and location and are checked after 24 hours for the number of insects caught. A student claims Group B is "the control group" because it doesn\'t use the new repellent being tested. Is the student correct, and which group is the actual control?',
      steps: [
        'A control group is the baseline that shows what happens WITHOUT the treatment being tested — the "no treatment" condition.',
        'Group C receives no repellent, so Group C is the true control group here, not Group B.',
        'Group B (current best-selling repellent) is a second COMPARISON group — it lets researchers compare the new repellent against an existing product, in addition to comparing against no repellent at all.',
        'Trap: a passage can include multiple comparison groups. Only the one with NO treatment (or a group explicitly labeled as the baseline) is the control — never assume the "not-new" option is automatically the control.',
      ],
      answer:
        'The student is not correct — Group C (no repellent) is the true control group; Group B is a second comparison/reference group testing the new repellent against the current standard product.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-dependent-variable',
      kind: 'try_yourself',
      problem:
        'Researchers study how sleep duration affects test performance. Three groups of students sleep 4, 6, or 8 hours the night before a test. All students take the identical test, in the same room, at the same time of day. What is the DEPENDENT variable in this study?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hours of sleep the students got' },
        { id: 'b', text: 'The room where the test was taken' },
        { id: 'c', text: 'Test score', correct: true },
        { id: 'd', text: 'Time of day the test was given' },
      ],
      expectedAnswer: 'Test score',
      hints: [
        'The independent variable is what the researchers deliberately set: hours of sleep.',
        'The dependent variable is the OUTCOME they measured — look for what was recorded after the fact.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-purpose-of-control',
      kind: 'try_yourself',
      problem:
        'Researchers test a new blood-pressure drug. Group A receives the drug. Group B receives a sugar pill with no active ingredient (a placebo), under otherwise identical conditions. Why does this study include Group B?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'To increase the independent variable' },
        { id: 'b', text: 'To measure the dependent variable twice' },
        {
          id: 'c',
          text: 'To provide a baseline, so researchers can tell whether any change is caused by the drug rather than something else',
          correct: true,
        },
        { id: 'd', text: 'To serve as the controlled variable for the study' },
      ],
      expectedAnswer:
        'To provide a baseline, so researchers can tell whether any change is caused by the drug rather than something else',
      hints: [
        'A control group doesn\'t get the treatment being tested — it shows what happens WITHOUT it.',
        'Without Group B, could the researchers tell if the blood pressure change was caused by the drug, or would it have happened anyway?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-controlled-variable-vs-control-group',
      kind: 'try_yourself',
      problem:
        'To test how fertilizer type affects tomato plant growth, researchers set up three identical greenhouses with the same amount of water, sunlight, and soil type. Greenhouse 1 gets no fertilizer, Greenhouse 2 gets Fertilizer A, and Greenhouse 3 gets Fertilizer B. Plant height is measured after 6 weeks. Which of the following is a CONTROLLED VARIABLE in this experiment?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Greenhouse 1 (the no-fertilizer group)' },
        { id: 'b', text: 'Fertilizer type' },
        { id: 'c', text: 'Amount of sunlight', correct: true },
        { id: 'd', text: 'Plant height after 6 weeks' },
      ],
      expectedAnswer: 'Amount of sunlight',
      hints: [
        'A controlled variable is something held the SAME across every greenhouse — not something that changed.',
        'Greenhouse 1 is the CONTROL GROUP (a whole condition), which is different from a controlled variable (one factor held constant).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-terms-conflated',
      kind: 'misconception_check',
      question:
        'A student is asked what the "controlled variable" was in an experiment comparing three groups: one with no treatment (baseline) and two with different drug doses. The student answers: "The baseline group."',
      commonErrors: [
        {
          answer: 'The baseline/no-treatment group',
          misconception: 'Treating "control group" and "controlled variable" as the same thing.',
          correctsTo:
            'The baseline group is the CONTROL GROUP — a whole experimental condition. A CONTROLLED VARIABLE is a single factor (like temperature, tank size, or amount of light) held constant across ALL groups, including the control group. The ACT tests both terms and often puts them in the same passage specifically to see if you conflate them.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Independent variable = what the researcher SETS; dependent variable = what the researcher MEASURES.',
        'Controlled variables = factors held the same across every group; control group = a whole baseline condition (usually no treatment).',
        'A control group exists so you can tell whether the outcome was actually caused by the independent variable, not something else.',
        'Never assume the first-listed group is the control, and check for "extra" comparison groups that aren\'t the true baseline.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Variables & Controls' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
