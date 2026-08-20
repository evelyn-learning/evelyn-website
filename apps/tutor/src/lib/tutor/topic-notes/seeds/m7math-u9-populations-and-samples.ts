/**
 * Grade 7 Math — Unit 9 CED 9.1: Populations & Samples.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.populations-and-samples.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U9_POPULATIONS_AND_SAMPLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.populations-and-samples.v1',
  course: 'Grade 7 Math',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Populations & Samples',
  planId: 'evelyn.ms.m7math.populations-and-samples.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.populations-and-samples.v1' }],
  theory: [
    { loId: 'm7math.populations-and-samples', kind: 'framework', title: 'The population is everyone you care about', content: `THE POPULATION IS EVERYONE YOU CARE ABOUT — it is the entire group your question is really about. If the question is what topping the 600 students at your school want, the population is all 600 students. The population is not always people: it could be all 250 bags of dog food in a warehouse, or all 1,200 books in the library. Name the population before you collect a single answer, because everything else depends on it.` },
    { loId: 'm7math.populations-and-samples', kind: 'framework', title: 'The sample is the part you actually ask', content: `THE SAMPLE IS THE PART YOU ACTUALLY ASK — a sample is a smaller group chosen out of the population. If you ask 50 of the 600 students, the population is 600 and the sample is 50. Asking every single member of the population instead is called a census. A census gives the exact answer, so when the population is small, take one.` },
    { loId: 'm7math.populations-and-samples', kind: 'framework', title: 'Why sample at all', content: `WHY SAMPLE AT ALL — three honest reasons. Cost: testing every battery in a factory costs a fortune. Time: 600 interviews will not finish before the party. Feasibility: some tests destroy what they test, so checking every bag of dog food would leave nothing to sell. A good sample gives you almost the same answer for a tiny fraction of the effort.` },
    { loId: 'm7math.populations-and-samples', kind: 'framework', title: 'Representative versus biased', content: `REPRESENTATIVE VERSUS BIASED — a sample is representative when it looks like the population in miniature, so the answers it gives match what the whole group would have said. A sample is biased when the way it was chosen tilts the answers. Asking the basketball team to name the best sport is biased, and no amount of careful arithmetic afterwards can fix it. Bias lives in HOW you picked, not in how you counted.` },
    { loId: 'm7math.populations-and-samples', kind: 'framework', title: 'Ways people pick samples', content: `WAYS PEOPLE PICK SAMPLES — a convenience sample takes whoever is nearby, such as your own math class. A voluntary response sample takes whoever chooses to reply to a posted poll, which favours people with strong feelings. A systematic sample takes every tenth person on a list. A random sample gives every member of the population an equal chance of being chosen, for example by drawing 60 ID numbers out of a hat that holds all 600. Only the random one is designed to be fair.` },
    { loId: 'm7math.populations-and-samples', kind: 'framework', title: 'A bigger sample does not undo bias', content: `A BIGGER SAMPLE DOES NOT UNDO BIAS — asking 200 members of the basketball team instead of 15 does not make the survey fairer. It just gives you a bigger pile of tilted answers. Fix the method first, then worry about the size.` },
    { loId: 'm7math.populations-and-samples', kind: 'definition', title: 'population', content: `the entire group a statistical question is about, such as all 600 students in a school.` },
    { loId: 'm7math.populations-and-samples', kind: 'definition', title: 'sample', content: 'the smaller part of the population that you actually collect data from.' },
    { loId: 'm7math.populations-and-samples', kind: 'definition', title: 'census', content: 'a survey that collects data from every single member of the population.' },
    { loId: 'm7math.populations-and-samples', kind: 'definition', title: 'representative sample', content: `a sample that looks like the population in miniature, so its answers match what the whole group would say.` },
    { loId: 'm7math.populations-and-samples', kind: 'definition', title: 'biased sample', content: `a sample chosen in a way that tilts the answers away from the truth about the population.` },
  ],
  methods: [
    {
      title: 'Worked name population and sample',
      steps: [
        `Start with the question itself. She wants to know about the students at Lincoln Middle School, all of them. So the population is all 600 students.`,
        `Now find who actually got asked. Fifty students answered, so the sample is those 50 students leaving the library.`,
        `Check the size. Fifty out of 600 is a small slice, which is fine. Sample size is not what makes a sample biased.`,
        `Check HOW they were chosen. They were chosen because they were walking out of the library. Students who stay after school in the library are the students who do a lot of homework there.`,
        `So the sample tilts toward heavy homework doers, and the average it produces will come out too high. The sample is biased, even though 50 students sounds like plenty.`,
        `A fix: number all 600 students and draw 50 of those numbers at random, so a student who never visits the library has exactly the same chance of being picked.`,
      ],
      example: { problem: `The principal wants to know how many minutes the 600 students at Lincoln Middle School spend on homework each night. She asks 50 students as they leave the library on Tuesday afternoon. Name the population and the sample, and say whether the sample is biased.`, solution: `Population: all 600 students at Lincoln Middle School. Sample: the 50 students leaving the library. The sample is biased, because library leavers do more homework than average.` },
      relatedLoIds: ['m7math.populations-and-samples'],
    },
    {
      title: 'Worked choose the method',
      steps: [
        `Look at Plan A. The 24 council members are already in the sample because they happen to be in the room. That is a convenience sample, and council members are the students most involved in school events, so their tastes are not typical.`,
        `Look at Plan B. Nobody is chosen at all here. People choose themselves by replying, which is a voluntary response sample. The students who follow the council page and feel strongly are the ones who answer, and quiet students are missing entirely.`,
        `Look at Plan C. Every one of the 600 ID numbers goes in the bin, so every student has the same chance of being drawn. That is a random sample.`,
        `Compare what tilts each one. Plan A tilts toward the involved. Plan B tilts toward the loud. Plan C has nothing tilting it, because the drawing does not know or care who anybody is.`,
        `Notice that Plan A uses 24 students and Plan C uses 60, but size is not the reason C wins. Plan A would still be biased with 200 council members, if such a thing existed.`,
      ],
      example: { problem: `The student council wants to know what the 600 students want for the end-of-year party theme. Three plans are proposed. Plan A: ask the 24 members of the student council. Plan B: post a poll on the council social media page and count whoever answers. Plan C: put all 600 student ID numbers in a bin and draw out 60 of them. Which plan gives a representative sample?`, solution: 'Plan C, the random draw of 60 ID numbers, is the only representative sample.' },
      relatedLoIds: ['m7math.populations-and-samples'],
    },
  ],
  pointers: [
    { content: `Students often say "The 22 students in my math class represent all 600 students in the school." — Asking everyone in the class is a census of the CLASS, not of the school. That class is one convenient group, and the students in it share a teacher, a class period, and often a course level, so their answers tilt together. The 578 students who were never asked may answer very differently. To speak for the school, draw names at random from a list of all 600 students.`, kind: 'common-error' },
    { content: `Students often say "Then I will ask 100 students, all from the same class period, and that will fix it." — Size and bias are two different problems. A larger sample chosen the same tilted way just collects more tilted answers, and it can look MORE convincing while being just as wrong. Fix how you pick first: give every one of the 600 students an equal chance. Then, if you want a steadier result, make that fair sample larger.`, kind: 'common-error' },
    { content: `The population is the whole group your question is about; the sample is the smaller part you actually collect data from.`, kind: 'tip' },
    { content: `Asking every member of the population is a census. People sample instead to save cost and time, and because some tests are impossible to run on everything.`, kind: 'tip' },
    { content: `A sample is representative when it looks like the population in miniature, and biased when the way it was picked tilts the answers.`, kind: 'tip' },
    { content: `Convenience samples and voluntary response samples are the two usual sources of bias. A random sample gives every member an equal chance and is the fair choice.`, kind: 'tip' },
    { content: `A bigger sample never fixes a biased method. Fix how you choose first, then think about size.`, kind: 'tip' },
    { content: `Read the question, not the story, to find the population. "How much homework do the 600 students do?" means the population is all 600 — even if only 50 were asked. The people surveyed are the sample, never the population.`, kind: 'common-error' },
    { content: `Bias comes from HOW people were picked, not from how many. 50 out of 600 can be fine; 200 out of 600 can still be garbage if they all came from one club. Never write "biased because the sample is too small."`, kind: 'gotcha' },
    { content: `Asking *everyone* in your math class is a census of the class, not of the school. "I asked all of them" only makes it a census when "them" is the whole population you're asking about.`, kind: 'vocab-note' },
    { content: `Know the difference: convenience = you grab whoever is nearby; voluntary response = people choose themselves by replying. An online poll is voluntary response, not random, even though strangers answer it.`, kind: 'vocab-note' },
    { content: `"Random" means every member has an equal chance of being picked — from a full list. Walking up to whoever you feel like in the hallway is not random; you're still doing the choosing.`, kind: 'common-error' },
    { content: `Populations aren't always people. It can be 250 bags of dog food or 1,200 library books. When asked "how many are in the population?", give the whole-group number (250), not the number tested (20).`, kind: 'edge-case' },
    { content: `When you say a sample is biased, name which way it tilts: "library leavers do MORE homework, so the average comes out too high." Saying only "it's unfair" doesn't earn the point.`, kind: 'tip' },
    { content: `If the population is small enough to ask everyone, take a census — sampling isn't automatically the right move. Sampling is for when a census costs too much, takes too long, or destroys what you test.`, kind: 'edge-case' },
  ],
};
