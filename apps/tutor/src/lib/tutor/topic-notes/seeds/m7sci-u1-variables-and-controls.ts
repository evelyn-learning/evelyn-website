/**
 * Grade 7 Science — Unit 1 CED 1.3: Variables, Controls & Fair Tests.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.variables-and-controls.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U1_VARIABLES_AND_CONTROLS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.variables-and-controls.v1',
  course: 'Grade 7 Science',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Variables, Controls & Fair Tests',
  planId: 'evelyn.ms.m7sci.variables-and-controls.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.variables-and-controls.v1' }],
  theory: [
    { loId: 'm7sci.variables-and-controls', content: `THE INDEPENDENT VARIABLE IS THE ONE THING YOU CHANGE ON PURPOSE. You decide its value before the investigation starts. The amount of light a seedling gets. Whether a slice of bread was sprayed or not. How damp the soil is. If you cannot point to the person who chose it, it is not the independent variable. There is only ever ONE of them in a fair test.` },
    { loId: 'm7sci.variables-and-controls', content: `THE DEPENDENT VARIABLE IS WHAT YOU MEASURE. It is the outcome, and it DEPENDS on the independent variable. It always comes with a unit and a tool for reading it. The height of a plant in centimeters, read with a ruler. The number of seeds that sprouted, counted by eye. The number of days until mold appears, counted on a calendar. Here is the memory hook that actually works. The letter I: I change the Independent variable. The letter D: the Dependent variable Depends on it, and it is the one I measure.` },
    { loId: 'm7sci.variables-and-controls', content: `CONTROLLED VARIABLES ARE EVERYTHING YOU DELIBERATELY KEEP THE SAME. Same soil, same size cup, same amount of water, same room, same starting seeds, same amount of time. These are FACTORS, not groups, and there are usually a dozen of them. They are what makes the comparison fair, because a factor that is identical in both groups cannot be the reason the groups came out different.` },
    { loId: 'm7sci.variables-and-controls', content: `THE CONTROL GROUP IS THE SETUP THAT GETS NO TREATMENT. It is your baseline, the thing you compare against. If you are testing plant food, the control group is the plants that get no plant food and are otherwise treated exactly like the others. WRONG: "The control group and the controlled variables are the same thing." CORRECT: the control group is a GROUP of subjects, and the controlled variables are FACTORS held constant. Without a control group you have nothing to compare your result to, so a control group is not optional.` },
    { loId: 'm7sci.variables-and-controls', content: `THE CORE RULE IS CHANGE ONE THING AT A TIME. If two things are different between your groups, and the groups come out different, you cannot tell which change caused it. WRONG: "Changing more variables makes the experiment better, because you test more ideas at once." CORRECT: every extra thing you change makes the result LESS interpretable, not more. To test two ideas, run two investigations.` },
    { loId: 'm7sci.variables-and-controls', content: `USE REPEATED TRIALS. One plant proves very little, because living things vary for a hundred reasons that have nothing to do with your test. One seed was bigger. One cup sat closer to the window. Grow ten plants in each group instead of one, compare the group averages, and then run the whole investigation again. If a difference shows up every time, it is probably real. If it shows up once, it may just be luck.` },
    { loId: 'm7sci.variables-and-controls', kind: 'definition', title: 'independent variable', content: 'the one factor you deliberately change between the groups.' },
    { loId: 'm7sci.variables-and-controls', kind: 'definition', title: 'dependent variable', content: 'the outcome you measure, which depends on the independent variable.' },
    { loId: 'm7sci.variables-and-controls', kind: 'definition', title: 'controlled variable', content: `a factor you deliberately keep the same in every group so it cannot explain the result.` },
    { loId: 'm7sci.variables-and-controls', kind: 'definition', title: 'control group', content: 'the group that gets no treatment, used as a baseline for comparison.' },
    { loId: 'm7sci.variables-and-controls', kind: 'definition', title: 'repeated trials', content: `testing many individuals, and running the investigation more than once, so a lucky result does not fool you.` },
  ],
  methods: [
    {
      title: 'Worked sort the roles',
      steps: [
        `Ask what the class CHOSE before the investigation started. They chose which slices got vinegar and which got plain water. That is the independent variable, and it has two settings: sprayed with vinegar, or not.`,
        `Ask what gets MEASURED at the end of each day. They count how many bags in each group show visible mold. That count is the dependent variable. Notice it has a number and a way to read it, which every dependent variable should have.`,
        `List what the class deliberately kept the SAME for all 20 slices. Same loaf of bread. Same kind of bag. Same number of sprays. Same dark cupboard. Same room temperature. Same ten days. Those are the controlled variables, and any three of them is a correct answer.`,
        `Find the group that got no treatment. That is the ten slices sprayed with plain water. They are the control group, and they tell you how fast this bread molds when nothing is done to it.`,
        `Ask why the control group got plain water instead of nothing at all. Because a spray adds liquid, and liquid on its own might change how mold grows. Spraying both groups keeps the liquid the same, so vinegar is left as the only difference.`,
        `Check the trials. Ten slices per group, not one, so a single strange slice cannot decide the answer. Better still, the class could run the whole thing again next month to see whether the same pattern shows up.`,
      ],
      example: { problem: `A class wants to know whether spraying bread with a little vinegar slows down mold. They take 20 slices from the same loaf and seal each slice in its own identical plastic bag. Ten slices get two sprays of vinegar first. The other ten get two sprays of plain water. All 20 bags then sit in the same dark cupboard at the same room temperature. Every day for ten days, a student opens the cupboard and counts how many bags in each group have visible mold. Name the independent variable, the dependent variable, three controlled variables, and the control group.`, solution: `Independent variable: whether the slice was sprayed with vinegar or with plain water. Dependent variable: the number of bags in each group with visible mold each day. Controlled variables include the same loaf, the same bags, the same number of sprays, the same dark cupboard, the same room temperature, and the same ten days. Control group: the ten slices sprayed with plain water.` },
      relatedLoIds: ['m7sci.variables-and-controls'],
    },
    {
      title: 'Worked two things changed',
      steps: [
        `Start with what Dev meant to test. The independent variable was supposed to be how damp the soil is. The dependent variable is which side the worm ends up on. So far the idea is fine.`,
        `Now compare the two sides item by item, and look for anything else that is different. The left side is damp AND dark. The right side is dry AND brightly lit. Two things changed at the same time.`,
        `State the problem exactly. The worm really did move left. But it may have moved toward the damp soil, or it may have moved away from the bright lamp, or both. The setup gives no way to separate those, so the result supports no conclusion about dampness at all.`,
        `Notice the second problem. Dev used ONE worm and watched it ONE time. Even a perfectly designed version of this would need many worms and several runs, because one worm crawling left could easily be chance.`,
        `Fix the light. Make both sides equally dark, or equally lit, so that light becomes a controlled variable instead of a second thing that changed. Now dampness is the only difference between the sides.`,
        `Fix the trials. Use twenty worms instead of one, place each in the middle the same way, and record how many are on each side after ten minutes. Then run the whole test again with fresh worms and see whether the pattern repeats.`,
      ],
      example: { problem: `Dev wants to find out whether earthworms prefer damp soil. He fills a shallow box with soil. He makes the left side damp and covers it with a lid so it is dark. He leaves the right side dry and shines a bright desk lamp on it. He places one earthworm in the middle. Ten minutes later the worm is on the left side. Dev writes: "Earthworms prefer damp soil." Explain why his result cannot be interpreted, and fix the design.`, solution: `The setup changed two things at once, dampness and light, so a worm moving left could be responding to the moisture or escaping the lamp, and there is no way to tell which. Fix it by making both sides equally dark so light is held constant, leaving dampness as the only difference, and by using many worms across repeated trials instead of one worm once.` },
      relatedLoIds: ['m7sci.variables-and-controls'],
    },
  ],
  pointers: [
    { content: `Students often say "Having a control group means the variables are controlled" — A control group only helps if it is identical to the treated group in every way EXCEPT the treatment. Here the two groups differ in food AND in temperature, so two things changed at once and any difference in the crickets cannot be blamed on the food. Fix it by keeping both tanks at the same temperature, with the same size tank, the same light and the same handling, so food is the only difference. The habit that fixes this permanently: before you start, write two separate lists, one headed CONTROL GROUP and one headed KEPT THE SAME.`, kind: 'common-error' },
    { content: `Students often say "Changing several things at once makes the investigation better, because you learn more from one test" — Every additional thing you change makes the result less interpretable, not more. With two changes you can no longer say which one caused the difference, so you have learned nothing about either. Change ONE thing at a time. If you want to test food and temperature, run two separate investigations, each with its own control group and repeated trials.`, kind: 'common-error' },
    { content: `I change the Independent variable. The Dependent variable Depends on it, and it is the one I measure.`, kind: 'tip' },
    { content: `Controlled variables are the factors you deliberately keep the same in every group.`, kind: 'tip' },
    { content: `The control group is the setup that gets no treatment. It is the baseline you compare against, and it is not optional.`, kind: 'tip' },
    { content: `A control group is a GROUP. Controlled variables are FACTORS. They are not the same thing.`, kind: 'tip' },
    { content: `Change ONE thing at a time. If two things change together, you cannot tell which one caused the result.`, kind: 'tip' },
    { content: 'To test two ideas, run two investigations, not one messy one.', kind: 'tip' },
    { content: `Use many individuals in each group and run the test more than once. One plant proves very little.`, kind: 'tip' },
    { content: `"Control group" and "controlled variable" are not the same words wearing different hats. The control group is a **group of subjects** that gets no treatment. Controlled variables are **factors** (soil, water, temperature) kept identical. Saying "I had a control group so everything was controlled" is wrong.`, kind: 'vocab-note' },
    { content: `Before you name the independent variable, ask: "Who decided this, and when?" If nobody chose it before the test started, it is not the independent variable. The thing you measure at the end is always the dependent variable.`, kind: 'tip' },
    { content: `A dependent variable needs a number, a unit and a tool. "How the plant did" is not measurable. "Height in cm, read with a ruler" is. If you cannot say what you would write in the data table, you have not named it yet.`, kind: 'common-error' },
    { content: `Adding a second change does NOT test two ideas at once — it destroys both answers. Damp AND dark versus dry AND bright tells you nothing about dampness. Want to test two things? Run two separate investigations.`, kind: 'gotcha' },
    { content: `Scan the two groups side by side, item by item, before you start. Extra differences usually sneak in through where things sit: the sunny windowsill, the warmer tank, the cup near the door. Location smuggles in light and temperature.`, kind: 'tip' },
    { content: `The control group is not "the group we ignore." It gets the exact same handling, same water, same time, same everything — just no treatment. In the bread test the control slices still got sprayed, with plain water, so the spraying itself could not be the cause.`, kind: 'edge-case' },
    { content: `A perfect design with one individual per group is still a weak investigation. One seedling 2 cm taller could just be a bigger seed. Use many individuals, compare group averages, then run the whole thing again.`, kind: 'common-error' },
    { content: `Repeated trials means two things: many individuals in each group AND doing the whole investigation more than once. Measuring the same one plant every day for ten days is not repeated trials — that is still one plant.`, kind: 'gotcha' },
  ],
};
