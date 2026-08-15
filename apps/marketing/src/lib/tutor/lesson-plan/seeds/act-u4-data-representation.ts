/**
 * ACT — Science / Data Representation: reading charts, tables & graphs.
 *
 * Data Representation passages are the most common ACT Science format.
 * The section is a READING test wearing a lab coat — no outside science
 * knowledge needed for these questions, only precise figure-reading under
 * time pressure (~52 seconds per question). All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_DATA_REPRESENTATION: LessonPlan = {
  id: 'evelyn.testprep.act.data-representation.v1',
  title: 'Data Representation: Reading Charts, Tables & Graphs',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.data-representation',
      standard: 'ACT-4.1',
      description:
        'Locate values in tables and graphs, match variables to axes, and answer lookup questions from multi-figure science passages quickly and accurately.',
    },
  ],
  prerequisites: [],
  followUps: ['act.trends-extrapolation'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe ACT Science as figure-reading, not science knowledge — lowering anxiety and raising pace.',
      script:
        'Here is the best-kept secret of the ACT: the Science section barely tests science. Almost every Data Representation question is answered by reading a number off a table or graph. You have about 52 seconds per question, so today is about looking up values fast and not getting tricked by units or axes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-lookup-method',
      kind: 'concept',
      goal: 'The figures-first method and the three lookup traps: wrong figure, wrong axis/unit, wrong condition.',
      keyIdeas: [
        'FIGURES FIRST. Skim the intro in ~15 seconds, then go straight to the questions — each question names its figure ("According to Table 1…"). Read the passage prose only if a question forces you to.',
        'ANCHOR THE AXES. Before answering, say what the x-axis, y-axis, and units are. Half of wrong answers come from reading the right point off the wrong axis or in the wrong unit (mL vs L, °C vs K).',
        'TRAP 1 — WRONG FIGURE: the question says Table 2 but Figure 1 shows something similar. Always re-check which exhibit is named.',
        'TRAP 2 — WRONG CONDITION: tables often have one row per trial/temperature/concentration. Match EVERY condition in the question (Trial 3 AND 40°C), not just the first.',
        'TRAP 3 — WRONG DIRECTION: "as X increases, Y…" requires reading the trend along the correct variable, not the order rows happen to be printed in.',
      ],
      vocabulary: [
        { term: 'exhibit', definition: 'any numbered table or figure in the passage (Table 1, Figure 2…).' },
        { term: 'trial', definition: 'one run of the experiment — usually one row of a table.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-table-lookup',
      kind: 'worked_example',
      problem:
        'A study measured the solubility of Compound X in water. Table 1 — Temperature (°C): 10, 20, 30, 40; Solubility (g per 100 mL): 12, 19, 31, 48. According to Table 1, the solubility of Compound X at 30°C is closest to:',
      steps: [
        'The question names Table 1 — go there, nowhere else.',
        'Anchor the columns: temperature in °C on the left, solubility in g per 100 mL on the right.',
        'Find the 30°C row and read across: 31 g per 100 mL.',
        'Sanity-check the trend: solubility rises with temperature (12 → 19 → 31 → 48), and 31 fits between 19 and 48. ✓',
      ],
      answer: '31 g per 100 mL',
      estimatedMinutes: 3,
    },
    {
      id: 'try-condition-match',
      kind: 'try_yourself',
      problem:
        'Table 2 shows plant growth under two light colors. Rows (light, week 2 height in cm / week 4 height in cm): Red light — 8 / 17. Blue light — 6 / 21. According to Table 2, the height of the plants grown under blue light at week 4 was:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6 cm' },
        { id: 'b', text: '17 cm' },
        { id: 'c', text: '21 cm', correct: true },
        { id: 'd', text: '8 cm' },
      ],
      expectedAnswer: '21 cm',
      hints: ['Two conditions to match: blue light AND week 4.', 'The blue-light row reads 6 (week 2) and 21 (week 4).'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-axis-trap',
      kind: 'try_yourself',
      problem:
        'Figure 1 plots reaction time (y-axis, in MILLISECONDS, 0–500) against caffeine dose (x-axis, mg). The curve passes through (100 mg, 350 ms) and (200 mg, 250 ms). Based on Figure 1, as caffeine dose increased from 100 mg to 200 mg, reaction time:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'increased by 100 ms' },
        { id: 'b', text: 'decreased by 100 ms', correct: true },
        { id: 'c', text: 'decreased by 100 mg' },
        { id: 'd', text: 'stayed constant' },
      ],
      expectedAnswer: 'decreased by 100 ms',
      hints: ['Read y-values at the two x-values: 350 ms → 250 ms.', 'Watch the units in the choices — one distractor swaps ms for mg.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-row-order',
      kind: 'misconception_check',
      question:
        'A table lists trials in the order 4, 2, 1, 3. A student asked for "the trend as trial number increases" reads down the printed rows. What went wrong?',
      commonErrors: [
        {
          answer: 'Reading the printed row order as the trend',
          misconception: 'Assuming tables are sorted by the variable in the question.',
          correctsTo: 'Re-order mentally by the named variable (trial number) before reading the trend.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Figures first — the intro prose is usually skippable.',
        'Anchor axes and units before reading any value.',
        'Match every condition in the question (trial AND temperature AND week).',
        'ACT Science is timed reading of exhibits — about 52 seconds per question.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Data Representation: Reading Charts, Tables & Graphs' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
