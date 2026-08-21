/**
 * Grade 7 World Geography — Economic Geography: Measuring Development.
 *
 * Concept-led row for the m7geo course (National Geography Standard 11).
 * Teaches WHAT THE INDICATORS MEASURE and WHAT THEY MISS -- income per
 * person, life expectancy, access to schooling, access to clean water and
 * electricity, and composite measures that combine several of these.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more here than anywhere else
 * in the course: this is the row where rule 4 governs. Development is
 * MEASURED, never judged. NO REAL COUNTRY IS NAMED, RANKED OR GIVEN A FIGURE
 * anywhere in this file, and none may be added. Every example uses an invented
 * country. There are no statistics of any kind -- not one numeral describing a
 * place -- because an invented figure attached to a real place is the exact
 * failure mode this row could produce. The file characterizes NO group of
 * people (rule 5) and takes NO position on aid, trade or colonialism (rule 6).
 * The banned framings ("third world", "backward", "primitive", "advanced",
 * "civilized", "developed versus undeveloped peoples") appear ONCE, inside the
 * concept, explicitly named as language to reject -- naming them and saying
 * why is part of the teaching. They must never appear as an unlabeled answer
 * choice.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U5_LEVELS_OF_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.ms.m7geo.levels-of-development.v1',
  title: 'Measuring Development',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.levels-of-development',
      standard: 'M7GEO-5.3',
      description:
        'Describe the indicators geographers use to measure development -- income per person, life expectancy, access to schooling, and access to clean water and electricity -- explain why a composite measure combines several of them, and explain why one number never describes a country and why a national average hides the variation inside it (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.resources-and-economic-activity'],
  followUps: ['m7geo.trade-and-interdependence'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the one-number problem with something the student has actually experienced, before any indicator vocabulary appears.',
      script:
        'Imagine somebody spends one afternoon in your town. They walk down one street, eat at one place, and then go home and tell everybody what your town is like. Would they have it right? They would have something right -- they really did see that street. But they would be describing one street and calling it a town. Today we look at how geographers measure how easily people in a country can get things like schooling, health care, clean water and electricity. Those measurements are useful. And every single one of them has the one-street problem built into it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-measuring-development',
      kind: 'concept',
      goal: 'Install the indicators, the composite measure, the higher-income and lower-income language with the banned framings named and rejected, the one-number limit, and the fact that development changes.',
      keyIdeas: [
        'DEVELOPMENT IS SOMETHING GEOGRAPHERS MEASURE, NOT SOMETHING THEY JUDGE. When geographers measure development, they are asking one question: how easily can people in this country get the things a person needs, such as schooling, health care, clean water and electricity? They measure it so that governments and planners can see where something is missing. The measurement is a description of an economy. It is never a score for a country and it is never a score for the people who live there.',
        'THE MAIN INDICATORS EACH MEASURE ONE THING. Income per person: the money earned in a country, divided by the number of people. Life expectancy: how long people born in a country tend to live. Access to schooling: how many children go to school, and for how many years. Access to clean water and to electricity: how many households can turn on a tap or a light. Each of these is real information, and each one measures exactly one thing and nothing more.',
        'A COMPOSITE MEASURE COMBINES SEVERAL INDICATORS INTO ONE. Because money by itself misses health and schooling, geographers also use composite measures, which combine several indicators so that no single one decides the whole result. A composite measure is better than any one indicator alone. It is still a summary, and a summary is still not the place.',
        'THE WORDS ARE PART OF THE MEASUREMENT. Say HIGHER-INCOME and LOWER-INCOME. Those words describe an economy, which is what is actually being measured. Now the list of words to reject, and this list matters. Do not say third world. Do not say backward, or primitive, or advanced, or civilized. Do not talk about developed peoples and undeveloped peoples. Every one of those words describes people instead of an economy, and every one of them sorts human beings into better and worse. That is not a measurement. Income measures an economy. It does not measure how much a person is worth, how good a culture is, or what anybody is capable of.',
        'ONE NUMBER NEVER DESCRIBES A COUNTRY, BECAUSE AN AVERAGE HIDES WHAT IS INSIDE IT. This is the idea worth keeping from the whole lesson, and you have met it before with population density. A national figure smears the entire country into one number. A busy city with universities and hospitals and a distant rural district where many households have no electricity and no tap with clean water sit inside the very same average, and the average describes neither of them. So the variation INSIDE a country is often larger than the difference between two countries.',
        'DEVELOPMENT CHANGES, SO IT IS NOT A RANK. Access to electricity spreads. New schools open and more children finish them. A drought or a flood can undo progress in one region while another region gains. A measurement taken this year describes this year. Treating it as a permanent list of who is above whom turns a measurement back into a judgement, which is the thing we said it is not.',
      ],
      vocabulary: [
        {
          term: 'development',
          definition:
            'how easily people in a country can get things such as schooling, health care, clean water and electricity.',
        },
        {
          term: 'indicator',
          definition: 'one thing that is measured and reported, such as life expectancy or access to electricity.',
        },
        {
          term: 'income per person',
          definition: 'the money earned in a country divided by the number of people who live there.',
        },
        {
          term: 'life expectancy',
          definition: 'how long people born in a place tend to live.',
        },
        {
          term: 'composite measure',
          definition: 'a measure that combines several indicators so that no single indicator decides the result.',
        },
        {
          term: 'higher-income and lower-income',
          definition: 'words that describe the economy of a country. They describe the economy, not the people.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-indicators-disagree',
      kind: 'worked_example',
      problem:
        'Two invented countries are described below. Say what each indicator tells you, and then say what you can and cannot conclude.\n\n"Kestria: income per person is lower than in Tolara. Nearly all children finish primary and secondary school. People born there tend to live a long time. Most homes have electricity, and most have a tap with clean water."\n\n"Tolara: income per person is higher than in Kestria. Many children leave school early. People born there tend to live a shorter time than people born in Kestria. Homes in the largest city have electricity and clean water, and many homes outside it do not."',
      steps: [
        'Take the indicators one at a time and say only what each one actually measures. Do not combine them yet.',
        'Income per person: Tolara is higher, Kestria is lower. That is a fact about money earned in the economy, divided by people. It is one indicator.',
        'Access to schooling: Kestria is higher, Tolara is lower. That is a different indicator, and it points the other way.',
        'Life expectancy: Kestria is higher. Access to clean water and electricity: Kestria is higher across the country, while Tolara has it in one city and not everywhere else. Both of these also point the other way from income.',
        'Now count. Four indicators, and they do not agree. One is higher in Tolara and three are higher in Kestria. So the honest conclusion is that these two economies differ in different ways, and NO single indicator describes either country.',
        'WRONG conclusion: "Tolara has higher income per person, so Tolara is the more developed country." CORRECT conclusion: "Tolara has higher income per person. Kestria has longer life expectancy, more schooling, and wider access to clean water and electricity. Calling either one ahead of the other means picking a single indicator and ignoring the rest, which is exactly why geographers use composite measures instead of one number."',
        'One more thing to notice, because it is the next worked example: the Tolara description already told you that the largest city and the rest of the country are not alike. A single national figure for Tolara would hide that completely.',
      ],
      answer:
        'The indicators disagree. Income per person is higher in Tolara; schooling, life expectancy, and access to clean water and electricity are higher in Kestria. No single indicator describes a whole country, so neither country can be called ahead of the other on the strength of one number. A composite measure exists precisely because one indicator is never enough.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-average-hides-inside',
      kind: 'worked_example',
      problem:
        'An invented country, Norvane, reports one national figure for income per person. Norvane has a large port city with universities, hospitals and reliable electricity, and it has a northern farming district where many households have no electricity and no tap with clean water. Explain what the national figure does and does not tell you.',
      steps: [
        'Ask what a national figure for income per person is built from. It is all the money earned in Norvane, divided by everybody in Norvane. Every person in the port city and every person in the northern district is in that division.',
        'So the single figure lands somewhere between the port city and the northern district. It is above what the farming district looks like and below what the port city looks like.',
        'That means the figure describes the country and describes neither of its two parts. There may be no district in Norvane that actually looks like the national number.',
        'This is exactly the averages-hide-clustering idea from population density, arriving again in a new place. An average is the number that hides how uneven a place is. Density hid where people were; this figure hides who has what.',
        'WRONG conclusion: "Norvane has that income per person, so a family in the northern district has about that much." CORRECT conclusion: "That figure is the national average. The port city sits well above it and the northern farming district well below it, so the average describes Norvane as a whole and describes no household in it."',
        'The useful habit: whenever you meet one number for a whole country, ask the follow-up question immediately -- what is the variation INSIDE this country that this number just hid?',
      ],
      answer:
        'The national figure tells you the overall average for Norvane and nothing about where people within Norvane stand. The port city is above it and the northern farming district is below it, so the average may describe no actual household in the country. One number for a whole country always hides the variation inside it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-measurement-not-judgement',
      kind: 'try_yourself',
      problem:
        'Kestria and Tolara are invented countries. Which statement below is a MEASUREMENT of development rather than a judgement about a country?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Tolara is a worse place than Kestria.' },
        { id: 'b', text: 'Fewer households in Tolara have electricity in the home than in Kestria.', correct: true },
        { id: 'c', text: 'Tolara will always be a lower-income country.' },
        { id: 'd', text: 'Knowing that Tolara is a lower-income country tells you everything about life there.' }
      ],
      expectedAnswer: 'Fewer households in Tolara have electricity in the home than in Kestria.',
      hints: [
        'A measurement names one thing that was counted and reports it. A judgement decides that a place, or the people in it, are better or worse.',
        'Check the other three against the lesson: one ranks a place as worse, one treats development as permanent, and one claims a single indicator tells the whole story.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-average-hides-variation',
      kind: 'try_yourself',
      problem:
        'The invented country of Vellamar reports one national figure for income per person. Vellamar has a coastal city with reliable electricity and clean water, and an inland region where many households have neither. What does that single national figure tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It tells you that households across Vellamar are all in roughly the same situation.' },
        { id: 'b', text: 'It tells you that the inland region is close to that figure.' },
        { id: 'c', text: 'It summarizes the whole country and describes neither the coastal city nor the inland region.', correct: true },
        { id: 'd', text: 'It tells you that Vellamar has no well-off areas.' }
      ],
      expectedAnswer: 'It summarizes the whole country and describes neither the coastal city nor the inland region.',
      hints: [
        'The figure was made by dividing everything in the country by everybody in the country. Ask what that division does to the difference between the two regions.',
        'An average sits between the parts it was made from, so it can describe a country while describing no place inside it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-indicator',
      kind: 'try_yourself',
      problem:
        'For the invented country of Ambel, income per person is lower than for its neighbor. In Ambel, nearly all children finish school, people born there tend to live a long time, and almost every home has clean water. What is the best conclusion to draw?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The income figure must have been measured incorrectly.' },
        { id: 'b', text: 'Schooling, life expectancy and clean water are not really development indicators.' },
        { id: 'c', text: 'Ambel should be placed above its neighbor on a list of countries.' },
        { id: 'd', text: 'Different indicators can point in different directions, so one indicator alone does not describe a country.', correct: true }
      ],
      expectedAnswer:
        'Different indicators can point in different directions, so one indicator alone does not describe a country.',
      hints: [
        'Nothing in the item says any measurement is wrong. Every figure described can be true at the same time.',
        'Two of these choices try to settle which country comes out on top. The lesson said a measurement is not a ranking.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lower-income-means-worse',
      kind: 'misconception_check',
      question:
        'A student reads that a country is a lower-income country and writes: "So it is a worse place, and people there are worse off in every way." What has gone wrong in that sentence?',
      commonErrors: [
        {
          answer: 'It is a lower-income country, so it is a worse place and people there are worse off in every way.',
          misconception:
            'Turning one economic measurement into a verdict on a whole country and on the people who live in it. The student has taken a fact about money earned in an economy and stretched it into a claim about how good a place is and how good a life is.',
          correctsTo:
            'Two separate mistakes are stacked here. First, income per person is ONE indicator among several. A country with lower income per person may have long life expectancy, nearly all of its children finishing school, and clean water in almost every home, and those are development indicators too. Second, and this one is not a technical error but the point of the lesson: an income measurement describes an economy, and it does not measure how much a person is worth, how good a culture is, or what anybody is capable of. WRONG: "It is a lower-income country, so it is a worse place." CORRECT: "It is a lower-income country, which means income per person there is lower. To describe the country you would need the other indicators too, and none of them measure how good the place or the people are."',
        },
        {
          answer: 'Development is a fixed ranking, so a country stays where it is on the list.',
          misconception:
            'Reading a measurement as a permanent position, because a list looks like a standing order that does not move.',
          correctsTo:
            'Development changes, and it changes in both directions. Access to electricity spreads into places that did not have it. More children finish school than finished a generation earlier. A flood or a drought can undo progress in one region while another region gains. WRONG: "That country is a lower-income country, so that is what it is." CORRECT: "Those were the measurements reported for that year." A measurement has a date on it. A rank pretends it does not.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Development is measured, never judged. It describes how easily people can get schooling, health care, clean water and electricity.',
        'The indicators are income per person, life expectancy, access to schooling, and access to clean water and electricity. Each measures one thing.',
        'A composite measure combines several indicators so that no single one decides the result. It is still a summary.',
        'Say higher-income and lower-income. Those describe an economy. Reject third world, backward, primitive, advanced and civilized -- they sort people instead of measuring economies.',
        'One number never describes a country, and a national average hides the variation inside it. The gap between two districts of one country can be larger than the gap between two countries.',
        'Development changes over time, so it is not a fixed rank. Every measurement has a date on it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Measuring Development' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
