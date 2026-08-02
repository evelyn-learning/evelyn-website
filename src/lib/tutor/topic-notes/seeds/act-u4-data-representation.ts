/**
 * ACT — Unit 4 CED 4.1: Data Representation: Reading Charts, Tables & Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.data-representation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_DATA_REPRESENTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.data-representation.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Data Representation: Reading Charts, Tables & Graphs',
  planId: 'evelyn.testprep.act.data-representation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.data-representation.v1' }],
  theory: [
    { loId: 'act.data-representation', content: `FIGURES FIRST. Skim the intro in ~15 seconds, then go straight to the questions — each question names its figure ("According to Table 1…"). Read the passage prose only if a question forces you to.` },
    { loId: 'act.data-representation', content: `ANCHOR THE AXES. Before answering, say what the x-axis, y-axis, and units are. Half of wrong answers come from reading the right point off the wrong axis or in the wrong unit (mL vs L, °C vs K).` },
    { loId: 'act.data-representation', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — WRONG FIGURE: the question says Table 2 but Figure 1 shows something similar. Always re-check which exhibit is named.` },
    { loId: 'act.data-representation', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — WRONG CONDITION: tables often have one row per trial/temperature/concentration. Match EVERY condition in the question (Trial 3 AND 40°C), not just the first.` },
    { loId: 'act.data-representation', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — WRONG DIRECTION: "as X increases, Y…" requires reading the trend along the correct variable, not the order rows happen to be printed in.` },
    { loId: 'act.data-representation', kind: 'definition', title: 'exhibit', content: 'any numbered table or figure in the passage (Table 1, Figure 2…).' },
    { loId: 'act.data-representation', kind: 'definition', title: 'trial', content: 'one run of the experiment — usually one row of a table.' },
  ],
  methods: [
    {
      title: 'Worked table lookup',
      steps: [
        'The question names Table 1 — go there, nowhere else.',
        `Anchor the columns: temperature in °C on the left, solubility in g per 100 mL on the right.`,
        'Find the 30°C row and read across: 31 g per 100 mL.',
        `Sanity-check the trend: solubility rises with temperature (12 → 19 → 31 → 48), and 31 fits between 19 and 48. ✓`,
      ],
      example: { problem: `A study measured the solubility of Compound X in water. Table 1 — Temperature (°C): 10, 20, 30, 40; Solubility (g per 100 mL): 12, 19, 31, 48. According to Table 1, the solubility of Compound X at 30°C is closest to:`, solution: '31 g per 100 mL' },
      relatedLoIds: ['act.data-representation'],
    },
  ],
  pointers: [
    { content: 'Re-order mentally by the named variable (trial number) before reading the trend.', kind: 'common-error' },
    { content: 'Figures first — the intro prose is usually skippable.', kind: 'tip' },
    { content: 'Anchor axes and units before reading any value.', kind: 'tip' },
    { content: 'Match every condition in the question (trial AND temperature AND week).', kind: 'tip' },
    { content: 'ACT Science is timed reading of exhibits — about 52 seconds per question.', kind: 'tip' },
    { content: `Answer choices are often stated in the *other* column's units or a neighboring cell's value. Before bubbling, re-read the row label AND the column header of the cell you picked — wrong-cell distractors are always real numbers from the same table.`, kind: 'gotcha' },
    { content: `Watch for graphs with TWO y-axes (left and right scales, different units). Trace which curve the legend ties to which axis before reading a value — a point read off the wrong scale is the single most common Figure error.`, kind: 'edge-case' },
    { content: `"Closest to" and "approximately" mean the exact number may not be printed — interpolate between gridlines or rows. Don't abandon a question because your value falls between two tick marks.`, kind: 'vocab-note' },
    { content: `Log or unevenly spaced axes: check that gridline spacing is constant before estimating. If ticks read 1, 10, 100, the midpoint of a box is NOT the average of the endpoints.`, kind: 'edge-case' },
    { content: `A question naming Study 2 or Experiment 3 may still point to a table shared across studies. Match the *exhibit number* named in the stem, not the study number — Table 1 can contain data from all three studies.`, kind: 'common-error' },
    { content: `Convert only when the answer choices force you to. If the table says 0.5 L and every choice is in mL, convert; if choices are in L, converting wastes 15 seconds and invites arithmetic slips.`, kind: 'tip' },
    { content: `"As X increased, Y ___" needs only DIRECTION plus sometimes magnitude — don't compute a rate or slope unless a choice demands it. Two data points and a direction word usually settle it.`, kind: 'tip' },
    { content: `Bar graphs with error bars or a shaded band: read the bar's top or the line's center for the value. Error bars answer 'was the difference significant?' questions, not 'what was the value?' questions.`, kind: 'gotcha' },
  ],
};
