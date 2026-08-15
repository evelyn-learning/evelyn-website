/**
 * Biology — Unit 1 CED 1.2: Scientific Inquiry & Experimental Design in Biology.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.scientific-method-bio.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U1_SCIENTIFIC_METHOD_BIO: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.scientific-method-bio.v1',
  course: 'Biology',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Scientific Inquiry & Experimental Design in Biology',
  planId: 'evelyn.hs.bio.scientific-method-bio.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.scientific-method-bio.v1' }],
  theory: [
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'The independent variable', content: `THE INDEPENDENT VARIABLE — the ONE thing the experimenter deliberately changes. In a fertilizer trial it is the amount of fertilizer; in a drug trial it is whether the volunteer gets the drug. If you cannot point to who set its value, it is not an independent variable.` },
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'The dependent variable', content: `THE DEPENDENT VARIABLE — the outcome you MEASURE, which "depends" on the independent variable. Plant height in centimeters, number of asthma attacks per month, percentage of seeds that germinate. It always comes with a unit and a measuring instrument.` },
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'Controlled variables', content: `CONTROLLED VARIABLES — every other factor you deliberately hold IDENTICAL across all groups: soil type, pot size, water volume, temperature, hours of light, age of the test organisms. These are not the "control group"; they are the conditions that make the comparison fair. Any factor that changes alongside the independent variable is a CONFOUNDING variable, and it ruins the experiment because you can no longer tell which change caused the result.` },
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'Control group vs experimental group', content: `CONTROL GROUP VS EXPERIMENTAL GROUP — the EXPERIMENTAL group receives the treatment; the CONTROL group is treated identically in every way except the treatment, and provides the baseline you compare against. In human trials the control group gets a PLACEBO — an identical pill or injection with no active drug — so that expectation, not chemistry, cannot explain a difference.` },
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'The hypothesis is a testable if/then prediction', content: `THE HYPOTHESIS IS A TESTABLE IF/THEN PREDICTION — "IF bean plants receive more nitrogen fertilizer, THEN their average height after four weeks will increase." It names the independent variable, names the measured dependent variable, and could turn out false. "Fertilizer is good for plants" is not a hypothesis: nothing is measured and nothing could disprove it. A hypothesis is also NOT a guess you are trying to defend — an experiment that refutes it is a successful experiment.` },
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'Sample size and replication', content: `SAMPLE SIZE AND REPLICATION — one plant or one patient tells you almost nothing, because individual organisms vary for a hundred reasons. Use many individuals per group (REPLICATION within the study), report the AVERAGE rather than a single case, and expect independent researchers to repeat the whole study. Small samples are exactly how a random fluke gets mistaken for an effect.` },
    { loId: 'bio.scientific-method-bio', kind: 'framework', title: 'Correlation is not causation', content: `CORRELATION IS NOT CAUSATION — an OBSERVATIONAL study finds that two things vary together; only a controlled EXPERIMENT, where the researcher sets the independent variable and holds everything else steady, can show that one causes the other. When two variables are correlated, always ask whether a third factor drives both, or whether the causation runs backwards.` },
    { loId: 'bio.scientific-method-bio', kind: 'definition', title: 'independent variable', content: 'the single factor the experimenter deliberately changes between groups.' },
    { loId: 'bio.scientific-method-bio', kind: 'definition', title: 'controlled variable', content: `a factor deliberately held identical across all groups so it cannot explain the results.` },
    { loId: 'bio.scientific-method-bio', kind: 'definition', title: 'placebo', content: `an inactive treatment identical in appearance to the real one, given to the control group in a human trial.` },
    { loId: 'bio.scientific-method-bio', kind: 'definition', title: 'confounding variable', content: `an uncontrolled factor that changes along with the independent variable, making the cause of a result impossible to identify.` },
  ],
  methods: [
    {
      title: 'Worked fertilizer trial',
      steps: [
        `Find what she SET: the weekly amount of fertilizer, deliberately assigned at four levels (0, 2, 4 and 6 grams). That is the independent variable.`,
        `Find what she MEASURED at the end: plant height in centimeters after four weeks, averaged per group. That is the dependent variable.`,
        `List what she deliberately held the SAME across all four groups: seed variety, pot and soil type, temperature (22 °C), light (14 hours per day), and water (200 mL every second day). Those are controlled variables — they are the reason any height difference can be blamed on the fertilizer.`,
        `Find the baseline: group 1, the 20 plants receiving no fertilizer, is the control group. Groups 2, 3 and 4 are experimental groups. Note the sample size: 20 plants per group, so a single unusually tall plant cannot swing the group average.`,
        `Write the hypothesis in if/then form, naming both variables and a measurable outcome: IF bean plants receive more weekly nitrogen fertilizer, THEN their average height after four weeks will be greater.`,
      ],
      example: { problem: `A researcher wants to know whether a nitrogen fertilizer increases bean plant growth. She plants 80 bean seeds of the same variety in identical pots of the same potting soil, and splits them into four groups of 20. Group 1 gets no fertilizer, group 2 gets 2 grams per week, group 3 gets 4 grams per week, group 4 gets 6 grams per week. All 80 pots sit in the same greenhouse at 22 °C with 14 hours of light per day and 200 mL of water every second day. After four weeks she measures the height of every plant in centimeters and averages each group. Identify the independent variable, the dependent variable, three controlled variables, and the control group, and state a testable hypothesis.`, solution: `Independent variable: weekly grams of fertilizer (0, 2, 4, 6). Dependent variable: average plant height in cm after four weeks. Controlled variables include seed variety, soil and pot, 22 °C temperature, 14 hours of light, 200 mL water per two days. Control group: the 20 unfertilized plants. Hypothesis: IF bean plants receive more nitrogen fertilizer, THEN their average height after four weeks will increase.` },
      relatedLoIds: ['bio.scientific-method-bio'],
    },
    {
      title: 'Worked confounded trial',
      steps: [
        `Name the intended independent variable: fertilizer or no fertilizer. Name the dependent variable: average plant height after three weeks. So far so good.`,
        `Check whether anything ELSE differs between the two groups. It does — twice. The fertilized plants also got much more light, and they also got more water. Light and water are confounding variables: they changed along with the fertilizer.`,
        `State the consequence precisely: the fertilized plants really did grow taller, but the extra 13 cm could be caused by the fertilizer, by the sunlight, by the water, or by any combination. The experiment cannot separate them, so it supports no causal claim about fertilizer at all.`,
        `Check the sample size too: 3 plants per group. Tomato seedlings vary a lot on their own, so even a clean version of this design would need many more plants per group before an average difference means anything.`,
        `Fix it: put ALL plants in the same light, give every plant the same measured volume of water on the same schedule, use the same soil and pot size and seedling age, and let fertilizer be the only difference — then raise each group to 20 or more plants and compare the group averages.`,
      ],
      example: { problem: `A gardener tests the same fertilizer at home. He puts 3 fertilized tomato plants on a sunny south-facing windowsill and 3 unfertilized plants on a shaded shelf across the room, watering the windowsill plants whenever the soil looks dry and the shelf plants once a week. After three weeks the fertilized plants average 31 cm and the unfertilized plants average 18 cm. He concludes the fertilizer caused the extra growth. Explain why his conclusion is not supported, and describe how to fix the design.`, solution: `The trial is confounded: light and water differ between the groups along with the fertilizer, so the height difference cannot be attributed to fertilizer. Fix it by holding light, water, soil, pot and seedling age identical so fertilizer is the only variable that changes, and by using many more plants per group.` },
      relatedLoIds: ['bio.scientific-method-bio'],
    },
  ],
  pointers: [
    { content: `A control group only helps if it is identical to the experimental group in every way EXCEPT the treatment. Here the two groups differ in diet AND in room temperature, so temperature is a confounding variable and any difference in the mice cannot be blamed on the diet. Fix it by housing both groups in the same room, at the same temperature, with the same cage size, light cycle and handling — leaving diet as the only difference.`, kind: 'common-error' },
    { content: `Independent variable = what you CHANGE; dependent variable = what you MEASURE; controlled variables = everything you hold IDENTICAL.`, kind: 'tip' },
    { content: `The control group gets no treatment (or a placebo) and is otherwise identical to the experimental group — it is the baseline you compare against.`, kind: 'tip' },
    { content: `A hypothesis is a testable IF/THEN prediction naming both variables, and it must be capable of turning out false.`, kind: 'tip' },
    { content: `Any factor that changes along with the independent variable is a confounding variable, and it makes the result uninterpretable.`, kind: 'tip' },
    { content: `Use many individuals per group and compare averages; one organism is a story, not evidence.`, kind: 'tip' },
    { content: `Correlation is not causation — only a controlled experiment, not an observational survey, can establish a cause.`, kind: 'tip' },
    { content: `Don't say "my variables were controlled" when you mean "I had a control group." **Controlled variables** = factors held identical across groups; **control group** = the untreated comparison group. You can have a control group and still have zero controlled variables.`, kind: 'vocab-note' },
    { content: `The dependent variable must be written with its unit and time point: "average height in cm after 4 weeks," not "plant growth." If you can't name the instrument that measured it (ruler, scale, timer), you've named a vague outcome, not a dependent variable.`, kind: 'common-error' },
    { content: `An independent variable is something the *experimenter assigned*. In a survey of coffee drinkers, nobody assigned the coffee — so coffee is a measured variable, not an independent variable, and the study is observational.`, kind: 'gotcha' },
    { content: `"IF I add fertilizer THEN plants will be healthier" is not testable — nothing is measured. A hypothesis must name the IV, name the measurable DV with a direction, and be capable of being proven FALSE. An experiment that refutes your hypothesis is a successful experiment, not a failure.`, kind: 'common-error' },
    { content: `When a design is confounded, don't write "the results are wrong." The plants really were taller. Write instead: the difference *cannot be attributed to* the IV because light/water also differed — the cause is unidentifiable.`, kind: 'gotcha' },
    { content: `A control group with **zero** of the treatment (0 g fertilizer) still counts as a group in the experiment — it is not "left out." With multiple treatment levels (0, 2, 4, 6 g), only the 0 g group is the control; 2, 4 and 6 g are all experimental groups.`, kind: 'edge-case' },
    { content: `A placebo is only needed when expectation could affect the outcome — human (and sometimes animal) trials. Don't demand a "placebo" for bean plants; the plant control group simply receives no fertilizer.`, kind: 'edge-case' },
    { content: `Before accepting any causal claim, run the two-question check: (1) Did the researcher *assign* the treatment? (2) Is everything else identical between groups? If either answer is no — or if n is 3 per group — no cause has been shown, no matter how big the difference looks.`, kind: 'tip' },
  ],
};
