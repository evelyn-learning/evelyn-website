/**
 * Grade 7 Science (Life Science) — Unit 1: Variables, Controls & Fair Tests.
 *
 * The bookkeeping lesson the whole course leans on (NGSS science and
 * engineering practice: planning and carrying out investigations). Every
 * later investigation in this course asks the student to sort the same three
 * roles — the one thing changed on purpose, the thing measured, and the long
 * list of things held identical — and then to spot the group that received no
 * treatment at all.
 *
 * The four traps it is built to kill are (a) collapsing "control group" into
 * "controlled variable" because the words look alike, (b) believing that
 * changing more things makes a stronger experiment, (c) treating the control
 * group as optional, and (d) accepting a single trial as evidence.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every setup in
 * this file is written out in words, and every item is solvable from the text
 * printed inside it. Never write "look at the setup shown above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U1_VARIABLES_AND_CONTROLS: LessonPlan = {
  id: 'evelyn.ms.m7sci.variables-and-controls.v1',
  title: 'Variables, Controls & Fair Tests',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.variables-and-controls',
      standard: 'M7SCI-1.3',
      description:
        'Plan a fair test by naming the independent variable, the dependent variable and the controlled variables, by including a control group for comparison, by changing only one thing at a time, and by using repeated trials rather than a single individual (NGSS science and engineering practice of planning and carrying out investigations).',
    },
  ],
  prerequisites: ['m7sci.scientific-investigation'],
  followUps: ['m7sci.data-graphs-and-conclusions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from an everyday comparison the student has already made, and show that it does not actually answer anything.',
      script:
        'Bread left on the kitchen counter grows fuzzy mold in a few days. Bread in the refrigerator stays fine for much longer. So cold slows down mold, right? Maybe. But the refrigerator is not only colder. It is also darker, and drier, and the bread in there is usually shut in a bag. Four things changed at once, so the honest answer is that we do not know which one did it. Today you learn the sort that fixes this: what you change, what you measure, and the long list of things you refuse to let move. Get that sort right and your investigation can actually answer a question.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-variables-and-controls',
      kind: 'concept',
      goal: 'Install the three variable roles, the control group, the one-thing-at-a-time rule, and repeated trials.',
      keyIdeas: [
        'THE INDEPENDENT VARIABLE IS THE ONE THING YOU CHANGE ON PURPOSE. You decide its value before the investigation starts. The amount of light a seedling gets. Whether a slice of bread was sprayed or not. How damp the soil is. If you cannot point to the person who chose it, it is not the independent variable. There is only ever ONE of them in a fair test.',
        'THE DEPENDENT VARIABLE IS WHAT YOU MEASURE. It is the outcome, and it DEPENDS on the independent variable. It always comes with a unit and a tool for reading it. The height of a plant in centimeters, read with a ruler. The number of seeds that sprouted, counted by eye. The number of days until mold appears, counted on a calendar. Here is the memory hook that actually works. The letter I: I change the Independent variable. The letter D: the Dependent variable Depends on it, and it is the one I measure.',
        'CONTROLLED VARIABLES ARE EVERYTHING YOU DELIBERATELY KEEP THE SAME. Same soil, same size cup, same amount of water, same room, same starting seeds, same amount of time. These are FACTORS, not groups, and there are usually a dozen of them. They are what makes the comparison fair, because a factor that is identical in both groups cannot be the reason the groups came out different.',
        'THE CONTROL GROUP IS THE SETUP THAT GETS NO TREATMENT. It is your baseline, the thing you compare against. If you are testing plant food, the control group is the plants that get no plant food and are otherwise treated exactly like the others. WRONG: "The control group and the controlled variables are the same thing." CORRECT: the control group is a GROUP of subjects, and the controlled variables are FACTORS held constant. Without a control group you have nothing to compare your result to, so a control group is not optional.',
        'THE CORE RULE IS CHANGE ONE THING AT A TIME. If two things are different between your groups, and the groups come out different, you cannot tell which change caused it. WRONG: "Changing more variables makes the experiment better, because you test more ideas at once." CORRECT: every extra thing you change makes the result LESS interpretable, not more. To test two ideas, run two investigations.',
        'USE REPEATED TRIALS. One plant proves very little, because living things vary for a hundred reasons that have nothing to do with your test. One seed was bigger. One cup sat closer to the window. Grow ten plants in each group instead of one, compare the group averages, and then run the whole investigation again. If a difference shows up every time, it is probably real. If it shows up once, it may just be luck.',
      ],
      vocabulary: [
        { term: 'independent variable', definition: 'the one factor you deliberately change between the groups.' },
        { term: 'dependent variable', definition: 'the outcome you measure, which depends on the independent variable.' },
        { term: 'controlled variable', definition: 'a factor you deliberately keep the same in every group so it cannot explain the result.' },
        { term: 'control group', definition: 'the group that gets no treatment, used as a baseline for comparison.' },
        { term: 'repeated trials', definition: 'testing many individuals, and running the investigation more than once, so a lucky result does not fool you.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-roles',
      kind: 'worked_example',
      problem:
        'A class wants to know whether spraying bread with a little vinegar slows down mold. They take 20 slices from the same loaf and seal each slice in its own identical plastic bag. Ten slices get two sprays of vinegar first. The other ten get two sprays of plain water. All 20 bags then sit in the same dark cupboard at the same room temperature. Every day for ten days, a student opens the cupboard and counts how many bags in each group have visible mold. Name the independent variable, the dependent variable, three controlled variables, and the control group.',
      steps: [
        'Ask what the class CHOSE before the investigation started. They chose which slices got vinegar and which got plain water. That is the independent variable, and it has two settings: sprayed with vinegar, or not.',
        'Ask what gets MEASURED at the end of each day. They count how many bags in each group show visible mold. That count is the dependent variable. Notice it has a number and a way to read it, which every dependent variable should have.',
        'List what the class deliberately kept the SAME for all 20 slices. Same loaf of bread. Same kind of bag. Same number of sprays. Same dark cupboard. Same room temperature. Same ten days. Those are the controlled variables, and any three of them is a correct answer.',
        'Find the group that got no treatment. That is the ten slices sprayed with plain water. They are the control group, and they tell you how fast this bread molds when nothing is done to it.',
        'Ask why the control group got plain water instead of nothing at all. Because a spray adds liquid, and liquid on its own might change how mold grows. Spraying both groups keeps the liquid the same, so vinegar is left as the only difference.',
        'Check the trials. Ten slices per group, not one, so a single strange slice cannot decide the answer. Better still, the class could run the whole thing again next month to see whether the same pattern shows up.',
      ],
      answer:
        'Independent variable: whether the slice was sprayed with vinegar or with plain water. Dependent variable: the number of bags in each group with visible mold each day. Controlled variables include the same loaf, the same bags, the same number of sprays, the same dark cupboard, the same room temperature, and the same ten days. Control group: the ten slices sprayed with plain water.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-things-changed',
      kind: 'worked_example',
      problem:
        'Dev wants to find out whether earthworms prefer damp soil. He fills a shallow box with soil. He makes the left side damp and covers it with a lid so it is dark. He leaves the right side dry and shines a bright desk lamp on it. He places one earthworm in the middle. Ten minutes later the worm is on the left side. Dev writes: "Earthworms prefer damp soil." Explain why his result cannot be interpreted, and fix the design.',
      steps: [
        'Start with what Dev meant to test. The independent variable was supposed to be how damp the soil is. The dependent variable is which side the worm ends up on. So far the idea is fine.',
        'Now compare the two sides item by item, and look for anything else that is different. The left side is damp AND dark. The right side is dry AND brightly lit. Two things changed at the same time.',
        'State the problem exactly. The worm really did move left. But it may have moved toward the damp soil, or it may have moved away from the bright lamp, or both. The setup gives no way to separate those, so the result supports no conclusion about dampness at all.',
        'Notice the second problem. Dev used ONE worm and watched it ONE time. Even a perfectly designed version of this would need many worms and several runs, because one worm crawling left could easily be chance.',
        'Fix the light. Make both sides equally dark, or equally lit, so that light becomes a controlled variable instead of a second thing that changed. Now dampness is the only difference between the sides.',
        'Fix the trials. Use twenty worms instead of one, place each in the middle the same way, and record how many are on each side after ten minutes. Then run the whole test again with fresh worms and see whether the pattern repeats.',
      ],
      answer:
        'The setup changed two things at once, dampness and light, so a worm moving left could be responding to the moisture or escaping the lamp, and there is no way to tell which. Fix it by making both sides equally dark so light is held constant, leaving dampness as the only difference, and by using many worms across repeated trials instead of one worm once.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-independent',
      kind: 'try_yourself',
      problem:
        'Maya wants to know whether the amount of light changes how tall radish seedlings grow. She plants 30 radish seeds in 30 identical cups using the same soil. Ten cups sit under a lamp for 4 hours a day, ten for 8 hours a day, and ten for 12 hours a day. Every cup gets 20 mL of water each morning, and all the cups stay on the same table in the same room. After two weeks Maya measures every seedling with a ruler. Which of these is the INDEPENDENT variable?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The ten cups placed in each of the three groups' },
        { id: 'b', text: 'The height of the seedlings in centimeters after two weeks' },
        { id: 'c', text: 'The 20 mL of water each cup receives every morning' },
        { id: 'd', text: 'The number of hours of light each group receives per day', correct: true },
      ],
      expectedAnswer: 'The number of hours of light each group receives per day',
      hints: [
        'Use the memory hook. I change the Independent variable, and the Dependent variable Depends on it and is the one I measure.',
        'Three of these Maya kept the same or read off a ruler at the end. Only one is the thing she deliberately set to a different value for each group.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-flawed-two-changes',
      kind: 'try_yourself',
      problem:
        'Ravi wants to know whether plant food makes bean plants grow taller. He puts three bean plants on a sunny windowsill and gives them plant food each week. He puts three other bean plants on a dark shelf across the room and gives them no plant food. Every plant gets the same soil, the same cup and the same water. After three weeks the windowsill plants are much taller, so Ravi says the plant food made them grow. Why can Ravi NOT draw that conclusion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He has a control group on the dark shelf, so his investigation was already a fair test' },
        { id: 'b', text: 'He should have changed even more things at once, because testing more variables makes an experiment stronger' },
        { id: 'c', text: 'His conclusion is fine, because the plants that got plant food really did end up taller' },
        { id: 'd', text: 'He changed two things at once, plant food and light, so he cannot tell which one caused the extra height', correct: true },
      ],
      expectedAnswer: 'He changed two things at once, plant food and light, so he cannot tell which one caused the extra height',
      hints: [
        'Compare the two groups item by item and list every single difference between them, not just the one Ravi was interested in.',
        'The plants on the windowsill got plant food. What ELSE did they get that the plants on the dark shelf did not?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-repeated-trials',
      kind: 'try_yourself',
      problem:
        'Jo tests whether mixing compost into the soil makes sunflower seedlings grow taller. She grows ONE seedling in soil with compost and ONE seedling in soil without compost. The cups, the seeds, the water, the light and the room are all identical, and compost is the only difference. After two weeks the compost seedling is 2 cm taller. What is the biggest problem with this investigation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'She changed too many variables at once, so the result cannot be interpreted' },
        { id: 'b', text: 'She should have added compost to both cups, so that everything was kept the same' },
        { id: 'c', text: 'She forgot to include a control group in the investigation' },
        { id: 'd', text: 'One seedling in each group is not enough, because plants vary on their own and a small difference could be luck', correct: true },
      ],
      expectedAnswer: 'One seedling in each group is not enough, because plants vary on their own and a small difference could be luck',
      hints: [
        'Read the setup again and check it against the rules one at a time. Is there one independent variable? Is there a group that got no treatment? How many plants are in each group?',
        'Two sunflower seedlings grown side by side in identical cups still end up different heights. So what would a 2 cm gap between just two plants really tell you?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-control-group-vs-controlled',
      kind: 'misconception_check',
      question:
        'A student writes: "My investigation had a control group, so all my variables were controlled. The treated crickets got the new food and lived in the warm tank, and the control crickets got the regular food in the cool tank." What went wrong?',
      commonErrors: [
        {
          answer: 'Having a control group means the variables are controlled',
          misconception:
            'Squashing together two different ideas that share a word. The CONTROL GROUP is the group that gets no treatment. The CONTROLLED VARIABLES are the factors held identical in every group. One is a group of living things, the others are conditions.',
          correctsTo:
            'A control group only helps if it is identical to the treated group in every way EXCEPT the treatment. Here the two groups differ in food AND in temperature, so two things changed at once and any difference in the crickets cannot be blamed on the food. Fix it by keeping both tanks at the same temperature, with the same size tank, the same light and the same handling, so food is the only difference. The habit that fixes this permanently: before you start, write two separate lists, one headed CONTROL GROUP and one headed KEPT THE SAME.',
        },
        {
          answer: 'Changing several things at once makes the investigation better, because you learn more from one test',
          misconception:
            'Treating extra changes as extra information, when each extra change actually removes information.',
          correctsTo:
            'Every additional thing you change makes the result less interpretable, not more. With two changes you can no longer say which one caused the difference, so you have learned nothing about either. Change ONE thing at a time. If you want to test food and temperature, run two separate investigations, each with its own control group and repeated trials.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'I change the Independent variable. The Dependent variable Depends on it, and it is the one I measure.',
        'Controlled variables are the factors you deliberately keep the same in every group.',
        'The control group is the setup that gets no treatment. It is the baseline you compare against, and it is not optional.',
        'A control group is a GROUP. Controlled variables are FACTORS. They are not the same thing.',
        'Change ONE thing at a time. If two things change together, you cannot tell which one caused the result.',
        'To test two ideas, run two investigations, not one messy one.',
        'Use many individuals in each group and run the test more than once. One plant proves very little.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Variables, Controls & Fair Tests' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
