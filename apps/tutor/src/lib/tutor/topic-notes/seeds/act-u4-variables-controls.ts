/**
 * ACT — Unit 4 CED 4.4: Variables & Controls.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.variables-controls.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_VARIABLES_CONTROLS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.variables-controls.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Variables & Controls',
  planId: 'evelyn.testprep.act.variables-controls.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.variables-controls.v1' }],
  theory: [
    { loId: 'act.variables-controls', content: `INDEPENDENT VARIABLE = what the researchers deliberately choose to change across trials or groups (dose, temperature, light exposure...). Ask: "What did the scientist SET?"` },
    { loId: 'act.variables-controls', content: `DEPENDENT VARIABLE = the outcome that is measured or recorded (growth, reaction rate, test score...). Ask: "What did the scientist MEASURE?"` },
    { loId: 'act.variables-controls', content: `CONTROLLED VARIABLES = every OTHER factor deliberately held the SAME across all groups, so any difference in the outcome can only be attributed to the independent variable.` },
    { loId: 'act.variables-controls', content: `CONTROL GROUP = a whole experimental condition (not a single factor) that receives no treatment, or the standard/current treatment, and serves as the baseline for comparison. It is asked about SEPARATELY from controlled variables.` },
    { loId: 'act.variables-controls', content: `WHY A CONTROL EXISTS: without a baseline, you cannot tell whether a change in the dependent variable was actually caused by the independent variable, or would have happened anyway.` },
    { loId: 'act.variables-controls', kind: 'framework', title: 'Trap', content: `TRAP — TERM CONFUSION: "controlled variable" (one held-constant factor) and "control group" (an entire baseline condition) sound alike and are DELIBERATELY both tested in the same passage. Read the exact wording of the question.` },
    { loId: 'act.variables-controls', kind: 'framework', title: 'Trap', content: `TRAP — ASSUMING THE FIRST GROUP IS THE CONTROL: the control isn't always listed first, and some passages include a second comparison group (e.g., "current standard treatment") that is NOT the true control. Only the no-treatment or explicitly-labeled-baseline group is the control.` },
    { loId: 'act.variables-controls', kind: 'framework', title: 'Trap', content: `TRAP — MULTIPLE EXPERIMENTS, MULTIPLE CONTROLS: a Research Summaries passage often runs 2-3 separate experiments; each may have its own independent variable and its own control. Don't assume Experiment 2 copies Experiment 1's setup.` },
    { loId: 'act.variables-controls', kind: 'definition', title: 'independent variable', content: 'the factor the researcher deliberately changes across groups or trials.' },
    { loId: 'act.variables-controls', kind: 'definition', title: 'dependent variable', content: 'the outcome the researcher measures; what changes (or not) in response.' },
    { loId: 'act.variables-controls', kind: 'definition', title: 'controlled variable', content: `a single factor held constant across every group so it cannot explain any difference in the outcome.` },
    { loId: 'act.variables-controls', kind: 'definition', title: 'control group', content: `the baseline condition (often no treatment) that other groups are compared against.` },
  ],
  methods: [
    {
      title: 'Worked identify all three',
      steps: [
        `Find what the researchers deliberately changed across the three groups: hours of light per day (4, 8, 12). That is the independent variable.`,
        `Find what was measured as the outcome: average plant height after 3 weeks. That is the dependent variable.`,
        `Find what was kept the same across all groups: soil, water, and temperature — any one of these is a controlled variable.`,
        `Note: this study has no "zero light" group — all three groups received some light, so the comparison is among light LEVELS, not treatment vs. no treatment.`,
      ],
      example: { problem: `A Research Summary describes a study on bean plant growth. Three groups of 10 seedlings each were planted in identical pots with the same soil, water, and temperature. Group 1 received 4 hours of light per day, Group 2 received 8 hours, and Group 3 received 12 hours. After 3 weeks, the average height of each group was measured. Identify the independent variable, the dependent variable, and one controlled variable.`, solution: `Independent: hours of light per day. Dependent: average plant height after 3 weeks. Controlled variables: soil, water, and temperature (held the same for all groups).` },
      relatedLoIds: ['act.variables-controls'],
    },
    {
      title: 'Worked control group trap',
      steps: [
        `A control group is the baseline that shows what happens WITHOUT the treatment being tested — the "no treatment" condition.`,
        `Group C receives no repellent, so Group C is the true control group here, not Group B.`,
        `Group B (current best-selling repellent) is a second COMPARISON group — it lets researchers compare the new repellent against an existing product, in addition to comparing against no repellent at all.`,
        `Trap: a passage can include multiple comparison groups. Only the one with NO treatment (or a group explicitly labeled as the baseline) is the control — never assume the "not-new" option is automatically the control.`,
      ],
      example: { problem: `A Research Summary describes testing a new insect repellent. Group A traps are treated with the NEW repellent. Group B traps are treated with the CURRENT best-selling repellent. Group C traps receive no repellent at all. All traps are identical in size and location and are checked after 24 hours for the number of insects caught. A student claims Group B is "the control group" because it doesn't use the new repellent being tested. Is the student correct, and which group is the actual control?`, solution: `The student is not correct — Group C (no repellent) is the true control group; Group B is a second comparison/reference group testing the new repellent against the current standard product.` },
      relatedLoIds: ['act.variables-controls'],
    },
  ],
  pointers: [
    { content: `The baseline group is the CONTROL GROUP — a whole experimental condition. A CONTROLLED VARIABLE is a single factor (like temperature, tank size, or amount of light) held constant across ALL groups, including the control group. The ACT tests both terms and often puts them in the same passage specifically to see if you conflate them.`, kind: 'common-error' },
    { content: `Independent variable = what the researcher SETS; dependent variable = what the researcher MEASURES.`, kind: 'tip' },
    { content: `Controlled variables = factors held the same across every group; control group = a whole baseline condition (usually no treatment).`, kind: 'tip' },
    { content: `A control group exists so you can tell whether the outcome was actually caused by the independent variable, not something else.`, kind: 'tip' },
    { content: `Never assume the first-listed group is the control, and check for "extra" comparison groups that aren't the true baseline.`, kind: 'tip' },
    { content: `The independent variable is usually the **column headings or row labels** of the data table; the dependent variable is the **numbers inside the cells**. If a table is labeled "Trial 1, 2, 3" down the side and "Dose (mg)" across the top, dose is what was set, not trial number.`, kind: 'tip' },
    { content: `On graphs, x-axis = independent, y-axis = dependent — but watch for a **third variable shown as separate curves or a key/legend**. If a figure has three lines labeled 20°C, 30°C, 40°C, temperature is a second independent variable, not a controlled one.`, kind: 'gotcha' },
    { content: `Question stems like "was held constant," "was the same in all trials," or "did NOT vary" are asking for a **controlled variable**. Stems like "served as a baseline," "for comparison," or "received no treatment" are asking for the **control group**. Underline the exact phrase before scanning.`, kind: 'vocab-note' },
    { content: `A study can legitimately have **no control group at all** — comparing 4, 8, and 12 hours of light has no zero-light condition. If asked "which group was the control?" and no group got zero treatment, the answer may be that none was, or the question is really asking for the lowest-level group.`, kind: 'edge-case' },
    { content: `In Research Summaries, a question naming "Experiment 2" means you look **only** at Experiment 2's setup paragraph. Experiment 2 often changes the independent variable and holds constant something Experiment 1 varied. Never carry Experiment 1's variable list forward.`, kind: 'common-error' },
    { content: `A placebo group IS a control group. Don't rule it out because the subjects "received something" — a sugar pill, plain water, or an untreated identical trap all count as no active treatment.`, kind: 'gotcha' },
    { content: `Answer choices that name a **result** (plant height, insect count, blood pressure) can never be the independent or controlled variable. Eliminate any measured outcome instantly when the stem asks what was set or held constant.`, kind: 'tip' },
    { content: `For "why was Group X included?" questions, the credited answer almost always says the results **can be attributed to the independent variable** rather than to time, chance, or other factors. Distractors say the control "proves the treatment works" — too strong.`, kind: 'common-error' },
  ],
};
