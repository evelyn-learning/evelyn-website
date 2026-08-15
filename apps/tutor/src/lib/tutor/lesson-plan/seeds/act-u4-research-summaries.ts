/**
 * ACT — Science / Research Summaries: reasoning across multi-experiment passages.
 *
 * Research Summaries are the most common ACT Science passage type (~50% of
 * questions). A passage describes 2-3 related experiments; the questions ask
 * you to compare their designs, explain why a procedural step exists, or
 * predict the result of a trial the passage never actually ran. No outside
 * science knowledge needed — every number and rationale is given inline.
 * All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_RESEARCH_SUMMARIES: LessonPlan = {
  id: 'evelyn.testprep.act.research-summaries.v1',
  title: 'Research Summaries: Experimental Design',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.research-summaries',
      standard: 'ACT-4.3',
      description:
        'Compare experimental designs across a multi-experiment passage, explain the purpose of a procedural step, and predict the outcome of a hypothetical new trial using the pattern an experiment already established.',
    },
  ],
  prerequisites: ['act.data-representation'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe Research Summaries as design-comparison, not chemistry recall — with realistic question-share and pacing.',
      script:
        'Research Summaries are the passage type you\'ll see the most on ACT Science — about half of the roughly 40 questions come from passages describing two or three related experiments. You still get about 52 seconds per question, same as the rest of the section, but Research Summaries reward one specific skill: precisely tracking what changed — and what didn\'t — from one experiment to the next. Today we build that skill: comparing experimental designs, explaining why a procedural step exists, and predicting a result the passage never actually shows you.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-research-summaries',
      kind: 'concept',
      goal: 'Multi-experiment passage anatomy — compare designs, read procedure for purpose, and predict new-trial results — plus the traps ACT plants around each.',
      keyIdeas: [
        'COMPARE DESIGNS, NOT JUST DATA. Research Summaries run 2-3 related experiments that usually change exactly ONE variable at a time while holding the rest constant. Before answering a "compare Experiment 1 and Experiment 2" question, list what stayed the same and what changed.',
        'TRAP — TWO THINGS CHANGED. Distractors often claim two variables changed between experiments when the procedure text says only one did. Re-read the setup for BOTH experiments before picking an answer.',
        '"WHY was a step performed" asks for PURPOSE (what confound it prevents, what variable it controls) — not the mechanical result of the step. Answer in terms of "so that ___ wouldn\'t affect the results," not "it did ___."',
        'TRAP — RESULT SWAPPED FOR PURPOSE. A wrong choice restates what the step does chemically or physically instead of why the experimental design needed it.',
        'PREDICTING A NEW TRIAL: match the hypothetical trial to the experiment with the SAME setup, then extend that experiment\'s OWN pattern — never borrow the pattern from a different experiment in the passage.',
        'TRAP — WRONG TABLE. The most common predicting error is applying the trend from the wrong experiment (e.g., using Experiment 1\'s rate of change for a trial that actually matches Experiment 2\'s setup).',
        'TRAP — OVER-EXTRAPOLATION. Only claim what the tested range supports. A prediction far outside the data, or built on just one or two data points, is not defensible — the correct answer usually stays inside or just beyond the tested pattern.',
      ],
      vocabulary: [
        { term: 'independent variable', definition: 'the one factor deliberately changed between trials or experiments.' },
        { term: 'dependent variable', definition: 'the outcome that is measured — what the researchers recorded.' },
        { term: 'controlled variable', definition: 'a factor kept the same across every trial so it can\'t explain a difference in results.' },
        { term: 'confound', definition: 'an uncontrolled factor that could explain the results instead of the variable being tested.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-compare-experiments',
      kind: 'worked_example',
      problem:
        'In Experiment 1, researchers measured reaction rate at 25°C using 10 mL of a 5% substrate solution mixed with enzyme volumes of 1, 2, 3, and 4 mL. Table 1 — Enzyme volume (mL): 1, 2, 3, 4; Reaction rate (mL gas/min): 2, 4, 6, 8. Experiment 2 used the identical 10 mL of 5% substrate solution and the identical enzyme volumes (1-4 mL), but the reaction flask was held at 40°C. Table 2 — Enzyme volume (mL): 1, 2, 3, 4; Reaction rate (mL gas/min): 3, 6, 9, 12. What was the ONE variable that changed between Experiment 1 and Experiment 2?',
      steps: [
        'List what stayed the same: substrate volume and concentration (10 mL, 5%) and the set of enzyme volumes tested (1-4 mL) — identical in both tables.',
        'List what\'s different in the setup description: Experiment 1 ran at 25°C; Experiment 2 ran at 40°C.',
        'Check the data is consistent with that being the only change: at every matching enzyme volume, Experiment 2\'s rate is higher (1 mL → 2 in Exp. 1 vs. 3 in Exp. 2; 4 mL → 8 vs. 12) — a uniform shift, exactly what you\'d expect from one variable changing, not several.',
        'Nothing about substrate amount or the tested enzyme volumes differs, so temperature is the one design change.',
      ],
      answer: 'Temperature (25°C in Experiment 1 vs. 40°C in Experiment 2).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-step-purpose',
      kind: 'worked_example',
      problem:
        'The procedure for both experiments above states: "Before each trial, the reaction flask was rinsed with distilled water and dried." Which best explains why this step was performed?',
      steps: [
        'Notice the step happens BEFORE every trial, in both experiments — a sign it\'s a controlled-variable step, not part of what\'s being measured.',
        'Ask what would go wrong if it were skipped: leftover enzyme or substrate from the previous trial could stay in the flask and mix into the next trial\'s reaction.',
        'A trap answer describes what rinsing does in general (e.g., "distilled water removes minerals") — true, but not the reason the experimental design needed it here.',
        'The design-based reason is a controlled-variable / confound argument: every trial should start from identical clean conditions, so leftover material from a prior trial can\'t affect the measured reaction rate.',
      ],
      answer:
        'To prevent leftover enzyme or substrate from a previous trial from contaminating the next trial and affecting the measured reaction rate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-changed',
      kind: 'try_yourself',
      problem:
        'A separate study tested seedling growth. Experiment 1: pots kept at 20°C, given 8, 10, 12, or 14 hours of light per day; height after 14 days (cm) — 8h: 12, 10h: 15, 12h: 18, 14h: 21. Experiment 2: pots given the identical range of light durations (8-14h) and measured after the identical 14 days, but kept at 28°C; height (cm) — 8h: 14, 10h: 17, 12h: 20, 14h: 23. What was the ONE variable that changed between Experiment 1 and Experiment 2?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The range of light durations tested' },
        { id: 'b', text: 'The temperature the pots were kept at', correct: true },
        { id: 'c', text: 'The number of days before height was measured' },
        { id: 'd', text: 'The number of seedlings per pot' },
      ],
      expectedAnswer: 'The temperature the pots were kept at',
      hints: [
        'List what stayed the same first: the light durations tested (8-14h) and the 14-day measurement point are identical in both tables.',
        'Compare heights at each matching light duration — Experiment 2\'s heights are consistently higher by the same amount, pointing to a temperature effect.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-step-purpose',
      kind: 'try_yourself',
      problem:
        'In the seedling study above, the procedure states: "Every pot in both experiments received exactly 50 mL of water per day." Which best explains why researchers gave every pot the same amount of water?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'To make sure water availability didn\'t affect plant height differently across pots, isolating light duration and temperature as the tested variables',
          correct: true,
        },
        { id: 'b', text: 'To make the plants taste better' },
        { id: 'c', text: 'To measure water absorption rate directly' },
        { id: 'd', text: 'To increase the amount of light each seedling received' },
      ],
      expectedAnswer:
        'To make sure water availability didn\'t affect plant height differently across pots, isolating light duration and temperature as the tested variables',
      hints: [
        'Ask what would go wrong if some pots got more water than others.',
        'A controlled variable rules out an alternative explanation for the results — it doesn\'t produce an effect of its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-predict-new-trial',
      kind: 'try_yourself',
      problem:
        'Suppose researchers ran one more trial using Experiment 2\'s setup (pots at 28°C) with 16 hours of light per day. Experiment 2\'s pattern was: 8h → 14 cm, 10h → 17 cm, 12h → 20 cm, 14h → 23 cm (a steady +3 cm for every +2 hours of light). Based on that pattern, the height after 14 days would most likely be closest to:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '24 cm' },
        { id: 'b', text: '23 cm' },
        { id: 'c', text: '26 cm', correct: true },
        { id: 'd', text: '29 cm' },
      ],
      expectedAnswer: '26 cm',
      hints: [
        'Use Experiment 2\'s own table, since the new trial matches Experiment 2\'s setup (28°C) — not Experiment 1\'s.',
        'The pattern is +3 cm for every +2 hours of light: 8→14, 10→17, 12→20, 14→23. Extend that same step one more time to 16 hours.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-over-extrapolation',
      kind: 'misconception_check',
      question:
        'A student argues: "Since raising the temperature from 20°C to 28°C increased seedling height at every light duration, raising it to 60°C would increase height even more." What went wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'The trend will just keep going, so 60°C must produce taller plants',
          misconception: 'Over-extrapolating a trend seen over a small tested range (only two temperatures) to a value far outside that range.',
          correctsTo:
            'The data only supports a conclusion within — or just beyond — the tested range. With only two temperatures tested (20°C and 28°C), the passage gives no basis for predicting what happens at 60°C; ACT Science never rewards extrapolation that far past the given data.',
        },
        {
          answer: 'The equal water amount is what made the plants grow taller',
          misconception: 'Treating a controlled variable as if it caused the result, instead of recognizing it was held constant specifically to rule out an alternative explanation.',
          correctsTo:
            'A controlled variable (like the fixed 50 mL of water) is kept the same precisely so it CAN\'T explain a difference in results — the difference must come from the variable that actually changed (temperature).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Before comparing experiments, list what stayed the same and what changed — usually just ONE variable.',
        '"Why was a step performed" asks for the PURPOSE it serves (what it controls), not what the step physically does.',
        'Predict a new trial using that SAME experiment\'s own pattern — never borrow another experiment\'s trend.',
        'Only trust predictions inside, or just beyond, the tested range; wild extrapolation is never the credited answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Research Summaries: Experimental Design' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
