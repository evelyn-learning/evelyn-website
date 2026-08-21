/**
 * Grade 7 World Geography — Unit 5 CED 5.3: Measuring Development.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7geo.levels-of-development.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7GEO_U5_LEVELS_OF_DEVELOPMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7geo.levels-of-development.v1',
  course: 'Grade 7 World Geography',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Measuring Development',
  planId: 'evelyn.ms.m7geo.levels-of-development.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7geo.levels-of-development.v1' }],
  theory: [
    { loId: 'm7geo.levels-of-development', content: `DEVELOPMENT IS SOMETHING GEOGRAPHERS MEASURE, NOT SOMETHING THEY JUDGE. When geographers measure development, they are asking one question: how easily can people in this country get the things a person needs, such as schooling, health care, clean water and electricity? They measure it so that governments and planners can see where something is missing. The measurement is a description of an economy. It is never a score for a country and it is never a score for the people who live there.` },
    { loId: 'm7geo.levels-of-development', content: `THE MAIN INDICATORS EACH MEASURE ONE THING. Income per person: the money earned in a country, divided by the number of people. Life expectancy: how long people born in a country tend to live. Access to schooling: how many children go to school, and for how many years. Access to clean water and to electricity: how many households can turn on a tap or a light. Each of these is real information, and each one measures exactly one thing and nothing more.` },
    { loId: 'm7geo.levels-of-development', content: `A COMPOSITE MEASURE COMBINES SEVERAL INDICATORS INTO ONE. Because money by itself misses health and schooling, geographers also use composite measures, which combine several indicators so that no single one decides the whole result. A composite measure is better than any one indicator alone. It is still a summary, and a summary is still not the place.` },
    { loId: 'm7geo.levels-of-development', content: `THE WORDS ARE PART OF THE MEASUREMENT. Say HIGHER-INCOME and LOWER-INCOME. Those words describe an economy, which is what is actually being measured. Now the list of words to reject, and this list matters. Do not say third world. Do not say backward, or primitive, or advanced, or civilized. Do not talk about developed peoples and undeveloped peoples. Every one of those words describes people instead of an economy, and every one of them sorts human beings into better and worse. That is not a measurement. Income measures an economy. It does not measure how much a person is worth, how good a culture is, or what anybody is capable of.` },
    { loId: 'm7geo.levels-of-development', content: `ONE NUMBER NEVER DESCRIBES A COUNTRY, BECAUSE AN AVERAGE HIDES WHAT IS INSIDE IT. This is the idea worth keeping from the whole lesson, and you have met it before with population density. A national figure smears the entire country into one number. A busy city with universities and hospitals and a distant rural district where many households have no electricity and no tap with clean water sit inside the very same average, and the average describes neither of them. So the variation INSIDE a country is often larger than the difference between two countries.` },
    { loId: 'm7geo.levels-of-development', content: `DEVELOPMENT CHANGES, SO IT IS NOT A RANK. Access to electricity spreads. New schools open and more children finish them. A drought or a flood can undo progress in one region while another region gains. A measurement taken this year describes this year. Treating it as a permanent list of who is above whom turns a measurement back into a judgement, which is the thing we said it is not.` },
    { loId: 'm7geo.levels-of-development', kind: 'definition', title: 'development', content: `how easily people in a country can get things such as schooling, health care, clean water and electricity.` },
    { loId: 'm7geo.levels-of-development', kind: 'definition', title: 'indicator', content: `one thing that is measured and reported, such as life expectancy or access to electricity.` },
    { loId: 'm7geo.levels-of-development', kind: 'definition', title: 'income per person', content: 'the money earned in a country divided by the number of people who live there.' },
    { loId: 'm7geo.levels-of-development', kind: 'definition', title: 'life expectancy', content: 'how long people born in a place tend to live.' },
    { loId: 'm7geo.levels-of-development', kind: 'definition', title: 'composite measure', content: `a measure that combines several indicators so that no single indicator decides the result.` },
    { loId: 'm7geo.levels-of-development', kind: 'definition', title: 'higher-income and lower-income', content: `words that describe the economy of a country. They describe the economy, not the people.` },
  ],
  methods: [
    {
      title: 'Worked indicators disagree',
      steps: [
        `Take the indicators one at a time and say only what each one actually measures. Do not combine them yet.`,
        `Income per person: Tolara is higher, Kestria is lower. That is a fact about money earned in the economy, divided by people. It is one indicator.`,
        `Access to schooling: Kestria is higher, Tolara is lower. That is a different indicator, and it points the other way.`,
        `Life expectancy: Kestria is higher. Access to clean water and electricity: Kestria is higher across the country, while Tolara has it in one city and not everywhere else. Both of these also point the other way from income.`,
        `Now count. Four indicators, and they do not agree. One is higher in Tolara and three are higher in Kestria. So the honest conclusion is that these two economies differ in different ways, and NO single indicator describes either country.`,
        `WRONG conclusion: "Tolara has higher income per person, so Tolara is the more developed country." CORRECT conclusion: "Tolara has higher income per person. Kestria has longer life expectancy, more schooling, and wider access to clean water and electricity. Calling either one ahead of the other means picking a single indicator and ignoring the rest, which is exactly why geographers use composite measures instead of one number."`,
        `One more thing to notice, because it is the next worked example: the Tolara description already told you that the largest city and the rest of the country are not alike. A single national figure for Tolara would hide that completely.`,
      ],
      example: { problem: `Two invented countries are described below. Say what each indicator tells you, and then say what you can and cannot conclude.

"Kestria: income per person is lower than in Tolara. Nearly all children finish primary and secondary school. People born there tend to live a long time. Most homes have electricity, and most have a tap with clean water."

"Tolara: income per person is higher than in Kestria. Many children leave school early. People born there tend to live a shorter time than people born in Kestria. Homes in the largest city have electricity and clean water, and many homes outside it do not."`, solution: `The indicators disagree. Income per person is higher in Tolara; schooling, life expectancy, and access to clean water and electricity are higher in Kestria. No single indicator describes a whole country, so neither country can be called ahead of the other on the strength of one number. A composite measure exists precisely because one indicator is never enough.` },
      relatedLoIds: ['m7geo.levels-of-development'],
    },
    {
      title: 'Worked average hides inside',
      steps: [
        `Ask what a national figure for income per person is built from. It is all the money earned in Norvane, divided by everybody in Norvane. Every person in the port city and every person in the northern district is in that division.`,
        `So the single figure lands somewhere between the port city and the northern district. It is above what the farming district looks like and below what the port city looks like.`,
        `That means the figure describes the country and describes neither of its two parts. There may be no district in Norvane that actually looks like the national number.`,
        `This is exactly the averages-hide-clustering idea from population density, arriving again in a new place. An average is the number that hides how uneven a place is. Density hid where people were; this figure hides who has what.`,
        `WRONG conclusion: "Norvane has that income per person, so a family in the northern district has about that much." CORRECT conclusion: "That figure is the national average. The port city sits well above it and the northern farming district well below it, so the average describes Norvane as a whole and describes no household in it."`,
        `The useful habit: whenever you meet one number for a whole country, ask the follow-up question immediately -- what is the variation INSIDE this country that this number just hid?`,
      ],
      example: { problem: `An invented country, Norvane, reports one national figure for income per person. Norvane has a large port city with universities, hospitals and reliable electricity, and it has a northern farming district where many households have no electricity and no tap with clean water. Explain what the national figure does and does not tell you.`, solution: `The national figure tells you the overall average for Norvane and nothing about where people within Norvane stand. The port city is above it and the northern farming district is below it, so the average may describe no actual household in the country. One number for a whole country always hides the variation inside it.` },
      relatedLoIds: ['m7geo.levels-of-development'],
    },
  ],
  pointers: [
    { content: `Students often say "It is a lower-income country, so it is a worse place and people there are worse off in every way." — Two separate mistakes are stacked here. First, income per person is ONE indicator among several. A country with lower income per person may have long life expectancy, nearly all of its children finishing school, and clean water in almost every home, and those are development indicators too. Second, and this one is not a technical error but the point of the lesson: an income measurement describes an economy, and it does not measure how much a person is worth, how good a culture is, or what anybody is capable of. WRONG: "It is a lower-income country, so it is a worse place." CORRECT: "It is a lower-income country, which means income per person there is lower. To describe the country you would need the other indicators too, and none of them measure how good the place or the people are."`, kind: 'common-error' },
    { content: `Students often say "Development is a fixed ranking, so a country stays where it is on the list." — Development changes, and it changes in both directions. Access to electricity spreads into places that did not have it. More children finish school than finished a generation earlier. A flood or a drought can undo progress in one region while another region gains. WRONG: "That country is a lower-income country, so that is what it is." CORRECT: "Those were the measurements reported for that year." A measurement has a date on it. A rank pretends it does not.`, kind: 'common-error' },
    { content: `Development is measured, never judged. It describes how easily people can get schooling, health care, clean water and electricity.`, kind: 'tip' },
    { content: `The indicators are income per person, life expectancy, access to schooling, and access to clean water and electricity. Each measures one thing.`, kind: 'tip' },
    { content: `A composite measure combines several indicators so that no single one decides the result. It is still a summary.`, kind: 'tip' },
    { content: `Say higher-income and lower-income. Those describe an economy. Reject third world, backward, primitive, advanced and civilized -- they sort people instead of measuring economies.`, kind: 'tip' },
    { content: `One number never describes a country, and a national average hides the variation inside it. The gap between two districts of one country can be larger than the gap between two countries.`, kind: 'tip' },
    { content: `Development changes over time, so it is not a fixed rank. Every measurement has a date on it.`, kind: 'tip' },
    { content: `Say **higher-income** and **lower-income**, never "third world," "backward," "primitive," "advanced," or "civilized." Those words rate people. Income per person measures an economy — money earned divided by population — and nothing else.`, kind: 'vocab-note' },
    { content: `Don't turn "lower-income" into "worse place" or "worse people." A lower-income country can still have long life expectancy, nearly all children finishing school, and clean water in almost every home. Income is one indicator, not a verdict.`, kind: 'common-error' },
    { content: `When you see one national number, ask right away: *what variation inside the country did this just hide?* An average sits between the big city and the rural district, so it may describe no actual household anywhere in that country.`, kind: 'tip' },
    { content: `Indicators can disagree. If income per person is higher in one country but schooling, life expectancy, and clean water are higher in the other, the honest answer is "they differ in different ways" — not "the richer one is more developed."`, kind: 'gotcha' },
    { content: `A composite measure is better than one indicator, but it is still a summary. Combining four numbers into one does not stop that one number from hiding what is inside the country.`, kind: 'edge-case' },
    { content: `The gap between two districts of the SAME country can be bigger than the gap between two countries. A port city with hospitals and a district with no electricity share one national number.`, kind: 'edge-case' },
    { content: `Development is not a fixed list of who's on top. Electricity spreads, more children finish school, and a flood can undo gains in one region. Every measurement has a date on it — say "reported that year," not "that's what the country is."`, kind: 'common-error' },
    { content: `Check whether a sentence measures or judges. "Fewer households in Tolara have electricity" is a measurement. "Tolara is behind" is a judgement. If you can't say what was counted, it isn't an indicator.`, kind: 'tip' },
  ],
};
