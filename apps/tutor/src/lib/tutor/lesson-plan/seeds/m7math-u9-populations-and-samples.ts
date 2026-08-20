/**
 * Grade 7 Math — Statistics & Sampling: Populations & Samples.
 *
 * The first statistics lesson of the course (CCSS 7.SP.A.1). It separates the
 * group you WANT to know about from the group you actually asked, explains why
 * anybody would sample instead of counting everyone, and names the difference
 * between a representative sample and a biased one. The trap this plan is built
 * to kill is the belief that a convenient group of people standing nearby is
 * good enough to speak for everybody.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U9_POPULATIONS_AND_SAMPLES: LessonPlan = {
  id: 'evelyn.ms.m7math.populations-and-samples.v1',
  title: 'Populations & Samples',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.populations-and-samples',
      standard: 'M7MATH-9.1',
      description:
        'Identify the population and the sample in a statistical question, explain why a sample is used instead of a census, and judge whether a sampling method is representative or biased (CCSS 7.SP.A.1).',
    },
  ],
  prerequisites: ['m7math.volume-of-prisms-and-composite-solids'],
  followUps: ['m7math.random-sampling-and-inferences'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the gap between the group you care about and the group you actually asked.',
      script:
        'The student council is picking one pizza topping for the end-of-year party. There are 600 students in the school. Asking all 600 would take days, so somebody says, let us just ask the six people at this table. Five of them say pineapple. So the council orders 600 slices of pineapple pizza, and the party is a disaster. The problem was not the math. The problem was who got asked. Today we sort out the difference between the whole group you care about and the smaller group you actually talk to, and we work out what makes that smaller group trustworthy.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-populations-and-samples',
      kind: 'concept',
      goal: 'Define population, sample, and census, justify sampling, and separate representative samples from biased ones.',
      keyIdeas: [
        'THE POPULATION IS EVERYONE YOU CARE ABOUT — it is the entire group your question is really about. If the question is what topping the 600 students at your school want, the population is all 600 students. The population is not always people: it could be all 250 bags of dog food in a warehouse, or all 1,200 books in the library. Name the population before you collect a single answer, because everything else depends on it.',
        'THE SAMPLE IS THE PART YOU ACTUALLY ASK — a sample is a smaller group chosen out of the population. If you ask 50 of the 600 students, the population is 600 and the sample is 50. Asking every single member of the population instead is called a census. A census gives the exact answer, so when the population is small, take one.',
        'WHY SAMPLE AT ALL — three honest reasons. Cost: testing every battery in a factory costs a fortune. Time: 600 interviews will not finish before the party. Feasibility: some tests destroy what they test, so checking every bag of dog food would leave nothing to sell. A good sample gives you almost the same answer for a tiny fraction of the effort.',
        'REPRESENTATIVE VERSUS BIASED — a sample is representative when it looks like the population in miniature, so the answers it gives match what the whole group would have said. A sample is biased when the way it was chosen tilts the answers. Asking the basketball team to name the best sport is biased, and no amount of careful arithmetic afterwards can fix it. Bias lives in HOW you picked, not in how you counted.',
        'WAYS PEOPLE PICK SAMPLES — a convenience sample takes whoever is nearby, such as your own math class. A voluntary response sample takes whoever chooses to reply to a posted poll, which favours people with strong feelings. A systematic sample takes every tenth person on a list. A random sample gives every member of the population an equal chance of being chosen, for example by drawing 60 ID numbers out of a hat that holds all 600. Only the random one is designed to be fair.',
        'A BIGGER SAMPLE DOES NOT UNDO BIAS — asking 200 members of the basketball team instead of 15 does not make the survey fairer. It just gives you a bigger pile of tilted answers. Fix the method first, then worry about the size.',
      ],
      vocabulary: [
        { term: 'population', definition: 'the entire group a statistical question is about, such as all 600 students in a school.' },
        { term: 'sample', definition: 'the smaller part of the population that you actually collect data from.' },
        { term: 'census', definition: 'a survey that collects data from every single member of the population.' },
        { term: 'representative sample', definition: 'a sample that looks like the population in miniature, so its answers match what the whole group would say.' },
        { term: 'biased sample', definition: 'a sample chosen in a way that tilts the answers away from the truth about the population.' },
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-population-and-sample',
      kind: 'worked_example',
      problem:
        'The principal wants to know how many minutes the 600 students at Lincoln Middle School spend on homework each night. She asks 50 students as they leave the library on Tuesday afternoon. Name the population and the sample, and say whether the sample is biased.',
      steps: [
        'Start with the question itself. She wants to know about the students at Lincoln Middle School, all of them. So the population is all 600 students.',
        'Now find who actually got asked. Fifty students answered, so the sample is those 50 students leaving the library.',
        'Check the size. Fifty out of 600 is a small slice, which is fine. Sample size is not what makes a sample biased.',
        'Check HOW they were chosen. They were chosen because they were walking out of the library. Students who stay after school in the library are the students who do a lot of homework there.',
        'So the sample tilts toward heavy homework doers, and the average it produces will come out too high. The sample is biased, even though 50 students sounds like plenty.',
        'A fix: number all 600 students and draw 50 of those numbers at random, so a student who never visits the library has exactly the same chance of being picked.',
      ],
      answer:
        'Population: all 600 students at Lincoln Middle School. Sample: the 50 students leaving the library. The sample is biased, because library leavers do more homework than average.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-choose-the-method',
      kind: 'worked_example',
      problem:
        'The student council wants to know what the 600 students want for the end-of-year party theme. Three plans are proposed. Plan A: ask the 24 members of the student council. Plan B: post a poll on the council social media page and count whoever answers. Plan C: put all 600 student ID numbers in a bin and draw out 60 of them. Which plan gives a representative sample?',
      steps: [
        'Look at Plan A. The 24 council members are already in the sample because they happen to be in the room. That is a convenience sample, and council members are the students most involved in school events, so their tastes are not typical.',
        'Look at Plan B. Nobody is chosen at all here. People choose themselves by replying, which is a voluntary response sample. The students who follow the council page and feel strongly are the ones who answer, and quiet students are missing entirely.',
        'Look at Plan C. Every one of the 600 ID numbers goes in the bin, so every student has the same chance of being drawn. That is a random sample.',
        'Compare what tilts each one. Plan A tilts toward the involved. Plan B tilts toward the loud. Plan C has nothing tilting it, because the drawing does not know or care who anybody is.',
        'Notice that Plan A uses 24 students and Plan C uses 60, but size is not the reason C wins. Plan A would still be biased with 200 council members, if such a thing existed.',
      ],
      answer: 'Plan C, the random draw of 60 ID numbers, is the only representative sample.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-population',
      kind: 'try_yourself',
      problem:
        'A city wants to know how many of its 4,000 middle school students walk to school. Researchers survey 200 of those students. What is the population?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The 200 students who were surveyed' },
        { id: 'b', text: 'All 4,000 middle school students in the city', correct: true },
        { id: 'c', text: 'Only the students who walk to school' },
        { id: 'd', text: 'Every person who lives in the city' },
      ],
      expectedAnswer: 'All 4,000 middle school students in the city',
      hints: [
        'Read the question the city is asking. Which group does it want to know about?',
        'The population is the whole group you care about. The smaller group that actually answered is the sample.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-representative-sample',
      kind: 'try_yourself',
      problem:
        'Maya wants to know the favorite sport of all 500 students at her school. Which sample is most likely to be representative?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The 15 players on the school basketball team' },
        { id: 'b', text: '50 students whose names are drawn at random from a list of all 500', correct: true },
        { id: 'c', text: 'The 30 students in the school band' },
        { id: 'd', text: 'The first 20 students who volunteer after she asks in the hallway' },
      ],
      expectedAnswer: '50 students whose names are drawn at random from a list of all 500',
      hints: [
        'Ask yourself who is left OUT of each group, and whether the ones left out would answer differently.',
        'A representative sample gives every student in the population the same chance of being picked.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-population-size',
      kind: 'try_yourself',
      problem:
        'A pet store owner has 250 bags of dog food in her warehouse. She opens 20 of the bags and weighs what is inside to check that the bags are full. How many bags are in the population? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '250',
      hints: [
        'The population is the whole group the owner wants to know about, not the part she checked.',
        'She wants to know about every bag in the warehouse. The 20 opened bags are her sample.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-convenience-sample',
      kind: 'misconception_check',
      question:
        'A student says: I asked all 22 kids in my math class what their favorite school subject is, so my results represent the whole school of 600 students. What went wrong?',
      commonErrors: [
        {
          answer: 'The 22 students in my math class represent all 600 students in the school.',
          misconception:
            'Treating a convenience sample as representative because it was easy to collect and because every member of that small group was asked.',
          correctsTo:
            'Asking everyone in the class is a census of the CLASS, not of the school. That class is one convenient group, and the students in it share a teacher, a class period, and often a course level, so their answers tilt together. The 578 students who were never asked may answer very differently. To speak for the school, draw names at random from a list of all 600 students.',
        },
        {
          answer: 'Then I will ask 100 students, all from the same class period, and that will fix it.',
          misconception:
            'Believing that a bigger sample repairs a biased method, so the cure for a tilted survey is simply more people.',
          correctsTo:
            'Size and bias are two different problems. A larger sample chosen the same tilted way just collects more tilted answers, and it can look MORE convincing while being just as wrong. Fix how you pick first: give every one of the 600 students an equal chance. Then, if you want a steadier result, make that fair sample larger.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The population is the whole group your question is about; the sample is the smaller part you actually collect data from.',
        'Asking every member of the population is a census. People sample instead to save cost and time, and because some tests are impossible to run on everything.',
        'A sample is representative when it looks like the population in miniature, and biased when the way it was picked tilts the answers.',
        'Convenience samples and voluntary response samples are the two usual sources of bias. A random sample gives every member an equal chance and is the fair choice.',
        'A bigger sample never fixes a biased method. Fix how you choose first, then think about size.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Populations & Samples' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
