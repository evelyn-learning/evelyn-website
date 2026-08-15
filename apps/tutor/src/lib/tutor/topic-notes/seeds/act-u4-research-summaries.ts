/**
 * ACT — Unit 4 CED 4.3: Research Summaries: Experimental Design.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.research-summaries.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_RESEARCH_SUMMARIES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.research-summaries.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Research Summaries: Experimental Design',
  planId: 'evelyn.testprep.act.research-summaries.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.research-summaries.v1' }],
  theory: [
    { loId: 'act.research-summaries', content: `COMPARE DESIGNS, NOT JUST DATA. Research Summaries run 2-3 related experiments that usually change exactly ONE variable at a time while holding the rest constant. Before answering a "compare Experiment 1 and Experiment 2" question, list what stayed the same and what changed.` },
    { loId: 'act.research-summaries', kind: 'framework', title: 'Trap', content: `TRAP — TWO THINGS CHANGED. Distractors often claim two variables changed between experiments when the procedure text says only one did. Re-read the setup for BOTH experiments before picking an answer.` },
    { loId: 'act.research-summaries', content: `"WHY was a step performed" asks for PURPOSE (what confound it prevents, what variable it controls) — not the mechanical result of the step. Answer in terms of "so that ___ wouldn't affect the results," not "it did ___."` },
    { loId: 'act.research-summaries', kind: 'framework', title: 'Trap', content: `TRAP — RESULT SWAPPED FOR PURPOSE. A wrong choice restates what the step does chemically or physically instead of why the experimental design needed it.` },
    { loId: 'act.research-summaries', content: `PREDICTING A NEW TRIAL: match the hypothetical trial to the experiment with the SAME setup, then extend that experiment's OWN pattern — never borrow the pattern from a different experiment in the passage.` },
    { loId: 'act.research-summaries', kind: 'framework', title: 'Trap', content: `TRAP — WRONG TABLE. The most common predicting error is applying the trend from the wrong experiment (e.g., using Experiment 1's rate of change for a trial that actually matches Experiment 2's setup).` },
    { loId: 'act.research-summaries', kind: 'framework', title: 'Trap', content: `TRAP — OVER-EXTRAPOLATION. Only claim what the tested range supports. A prediction far outside the data, or built on just one or two data points, is not defensible — the correct answer usually stays inside or just beyond the tested pattern.` },
    { loId: 'act.research-summaries', kind: 'definition', title: 'independent variable', content: 'the one factor deliberately changed between trials or experiments.' },
    { loId: 'act.research-summaries', kind: 'definition', title: 'dependent variable', content: 'the outcome that is measured — what the researchers recorded.' },
    { loId: 'act.research-summaries', kind: 'definition', title: 'controlled variable', content: `a factor kept the same across every trial so it can't explain a difference in results.` },
    { loId: 'act.research-summaries', kind: 'definition', title: 'confound', content: `an uncontrolled factor that could explain the results instead of the variable being tested.` },
  ],
  methods: [
    {
      title: 'Worked compare experiments',
      steps: [
        `List what stayed the same: substrate volume and concentration (10 mL, 5%) and the set of enzyme volumes tested (1-4 mL) — identical in both tables.`,
        `List what's different in the setup description: Experiment 1 ran at 25°C; Experiment 2 ran at 40°C.`,
        `Check the data is consistent with that being the only change: at every matching enzyme volume, Experiment 2's rate is higher (1 mL → 2 in Exp. 1 vs. 3 in Exp. 2; 4 mL → 8 vs. 12) — a uniform shift, exactly what you'd expect from one variable changing, not several.`,
        `Nothing about substrate amount or the tested enzyme volumes differs, so temperature is the one design change.`,
      ],
      example: { problem: `In Experiment 1, researchers measured reaction rate at 25°C using 10 mL of a 5% substrate solution mixed with enzyme volumes of 1, 2, 3, and 4 mL. Table 1 — Enzyme volume (mL): 1, 2, 3, 4; Reaction rate (mL gas/min): 2, 4, 6, 8. Experiment 2 used the identical 10 mL of 5% substrate solution and the identical enzyme volumes (1-4 mL), but the reaction flask was held at 40°C. Table 2 — Enzyme volume (mL): 1, 2, 3, 4; Reaction rate (mL gas/min): 3, 6, 9, 12. What was the ONE variable that changed between Experiment 1 and Experiment 2?`, solution: 'Temperature (25°C in Experiment 1 vs. 40°C in Experiment 2).' },
      relatedLoIds: ['act.research-summaries'],
    },
    {
      title: 'Worked step purpose',
      steps: [
        `Notice the step happens BEFORE every trial, in both experiments — a sign it's a controlled-variable step, not part of what's being measured.`,
        `Ask what would go wrong if it were skipped: leftover enzyme or substrate from the previous trial could stay in the flask and mix into the next trial's reaction.`,
        `A trap answer describes what rinsing does in general (e.g., "distilled water removes minerals") — true, but not the reason the experimental design needed it here.`,
        `The design-based reason is a controlled-variable / confound argument: every trial should start from identical clean conditions, so leftover material from a prior trial can't affect the measured reaction rate.`,
      ],
      example: { problem: `The procedure for both experiments above states: "Before each trial, the reaction flask was rinsed with distilled water and dried." Which best explains why this step was performed?`, solution: `To prevent leftover enzyme or substrate from a previous trial from contaminating the next trial and affecting the measured reaction rate.` },
      relatedLoIds: ['act.research-summaries'],
    },
  ],
  pointers: [
    { content: `The data only supports a conclusion within — or just beyond — the tested range. With only two temperatures tested (20°C and 28°C), the passage gives no basis for predicting what happens at 60°C; ACT Science never rewards extrapolation that far past the given data.`, kind: 'common-error' },
    { content: `A controlled variable (like the fixed 50 mL of water) is kept the same precisely so it CAN'T explain a difference in results — the difference must come from the variable that actually changed (temperature).`, kind: 'common-error' },
    { content: `Before comparing experiments, list what stayed the same and what changed — usually just ONE variable.`, kind: 'tip' },
    { content: `"Why was a step performed" asks for the PURPOSE it serves (what it controls), not what the step physically does.`, kind: 'tip' },
    { content: `Predict a new trial using that SAME experiment's own pattern — never borrow another experiment's trend.`, kind: 'tip' },
    { content: `Only trust predictions inside, or just beyond, the tested range; wild extrapolation is never the credited answer.`, kind: 'tip' },
    { content: `Design-comparison answers often live in the passage's *prose*, not the tables. If Experiment 2's paragraph says only "the procedure of Experiment 1 was repeated, except...," that "except" clause is the answer. Read it before scanning any data.`, kind: 'tip' },
    { content: `Watch for the trap that names a variable that changed *within* an experiment (enzyme volume 1–4 mL) as the thing that changed *between* experiments. The independent variable inside each trial set is usually held identical across experiments — that's what makes them comparable.`, kind: 'gotcha' },
    { content: `"Which variable was held constant?" ≠ "which variable was measured?" The dependent variable is whatever is in the table's *right-hand* column heading with units; controlled variables are usually buried in the procedure sentence, never in a table at all.`, kind: 'vocab-note' },
    { content: `Purpose questions sometimes ask about a *control group* or a trial with 0 of something (0 mL enzyme, 0 hours light). Its purpose is a baseline comparison — to show the result would NOT occur without the tested variable — not to "test whether the equipment works."`, kind: 'edge-case' },
    { content: `Prediction stems say "a fifth trial," "an additional trial in Experiment 2," or "if the procedure of Experiment 1 were repeated with..." — circle the experiment number in the stem before touching a table. That number, not the data value, tells you which trend to use.`, kind: 'common-error' },
    { content: `For a hypothetical value *between* two tested points, don't extend the end-of-table trend — interpolate between the two bracketing rows. The credited answer usually falls strictly between those two measured values.`, kind: 'edge-case' },
    { content: `If a table's differences shrink (10, 15, 18, 20) instead of holding steady, do NOT add the last gap again. Curved/plateauing trends signal the answer is a value *less* than a straight-line extension — often the choice just above the last data point.`, kind: 'gotcha' },
    { content: `Answer choices for prediction questions often pair a number with a reason ("27 cm, because height increases with light duration"). Both halves must be right — check the reasoning clause even when your calculated number matches.`, kind: 'common-error' },
  ],
};
