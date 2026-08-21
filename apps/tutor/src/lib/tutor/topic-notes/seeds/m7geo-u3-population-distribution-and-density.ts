/**
 * Grade 7 World Geography — Unit 3 CED 3.1: Population Distribution & Density.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7geo.population-distribution-and-density.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7GEO_U3_POPULATION_DISTRIBUTION_AND_DENSITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7geo.population-distribution-and-density.v1',
  course: 'Grade 7 World Geography',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Population Distribution & Density',
  planId: 'evelyn.ms.m7geo.population-distribution-and-density.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7geo.population-distribution-and-density.v1' }],
  theory: [
    { loId: 'm7geo.population-distribution-and-density', content: `TWO DIFFERENT QUESTIONS. DISTRIBUTION asks WHERE people are -- which parts of a place have people and which parts do not, and whether they are spread out or bunched together. DENSITY asks HOW MANY people there are for each unit of area. Distribution is a pattern you describe in words. Density is a number you calculate. Confusing the two is the single most common mistake in this topic.` },
    { loId: 'm7geo.population-distribution-and-density', content: `DENSITY IS POPULATION DIVIDED BY LAND AREA. Take the number of people, divide by the number of square miles of land, and you get people per square mile. Geographers also use people per square kilometer. Densely settled means many people for each square mile; sparsely settled means few. That is all the words mean.` },
    { loId: 'm7geo.population-distribution-and-density', content: `PEOPLE CLUSTER WHERE THE PHYSICAL GEOGRAPHY MAKES LIVING EASIER. Five conditions do most of the work: fresh water, arable land that crops will grow in, a moderate climate, flat or gently rolling land, and access to the coast or to a trade route. River valleys and coastal plains have several of these at once, which is why they have carried dense settlement for a very long time. The plains along the Ganges River in South Asia and the valley and delta of the Nile in Egypt are both long-settled farming lands of exactly this kind.` },
    { loId: 'm7geo.population-distribution-and-density', content: `PEOPLE ARE SPARSE WHERE THE PHYSICAL GEOGRAPHY MAKES LIVING HARD. Very dry places, such as the Sahara in North Africa. Very cold places, such as the interior of Greenland, which is buried under an ice sheet, or Antarctica, which has no permanent residents at all and only research stations. Very high places, such as the high ranges of the Himalaya. And very wet, dense, difficult places, such as the interior of the Amazon rainforest, while most of Brazil is settled near the Atlantic coast instead.` },
    { loId: 'm7geo.population-distribution-and-density', content: `DENSITY IS AN AVERAGE, AND AVERAGES HIDE CLUSTERING. This is the idea worth keeping from this whole lesson. A density figure smears every person evenly across every square mile of a country, and almost nowhere on Earth is anyone actually spread out that way. A country can have a low overall density and still have nearly everybody living in a handful of cities. So a density figure by itself tells you very little about where people actually are. To answer that, you need the distribution.` },
    { loId: 'm7geo.population-distribution-and-density', content: `DENSE AND SPARSE ARE MEASUREMENTS, NOT JUDGMENTS. A densely settled place is not automatically crowded, unpleasant or unhealthy, and a sparsely settled place is not empty, unwanted or lesser. Those words describe how many people are in an area, and nothing else. Geographers measure population; they do not grade it.` },
    { loId: 'm7geo.population-distribution-and-density', kind: 'definition', title: 'population distribution', content: 'the pattern of where people live across an area.' },
    { loId: 'm7geo.population-distribution-and-density', kind: 'definition', title: 'population density', content: `the number of people for each unit of area, found by dividing population by land area.` },
    { loId: 'm7geo.population-distribution-and-density', kind: 'definition', title: 'densely populated', content: 'having many people for each unit of area.' },
    { loId: 'm7geo.population-distribution-and-density', kind: 'definition', title: 'sparsely populated', content: 'having few people for each unit of area.' },
    { loId: 'm7geo.population-distribution-and-density', kind: 'definition', title: 'arable land', content: 'land where crops can be grown.' },
    { loId: 'm7geo.population-distribution-and-density', kind: 'definition', title: 'average', content: `a single number that stands in for a whole group, which can hide how uneven the group really is.` },
  ],
  methods: [
    {
      title: 'Worked predict the distribution',
      steps: [
        `Do not guess first. Go through the five conditions one at a time and mark where each one is satisfied.`,
        `Fresh water: the wide river is on the eastern plain. Arable land: the deep soil is on the eastern plain. Moderate climate: rain in every season is on the eastern plain. Flat land: the plain is flat, and the west is steep. Access to trade: the sheltered bay is a place ships can use, and it is on the eastern side.`,
        `That is five out of five on the eastern third. The prediction is that settlement is dense there.`,
        `Now check the west against the same list. Steep mountains fail the flat-land test and the arable-land test. The high plateau is very dry and very cold, so it fails the water test and the climate test. The prediction is sparse settlement in the west.`,
        `Say the distribution in words: people are clustered along the eastern coastal plain, most likely thickest where the river meets the bay, and thin to almost nobody across the mountains and the dry plateau.`,
        `Notice what you did NOT do. You did not calculate anything. Distribution is a pattern you describe, and you can predict it from physical geography alone.`,
      ],
      example: { problem: `Predict the population distribution of an island from its physical geography, using only the five conditions from the concept.

"Calder Island is shaped like a tilted plate. The eastern third is a flat coastal plain. A wide river crosses it and empties into a sheltered bay, rain falls in every season, and the soil is deep. The western two thirds rise into steep mountains, and behind the mountains sits a high plateau where almost no rain falls and the nights are freezing."`, solution: `Settlement is predicted to be dense on the eastern coastal plain -- it has fresh water, deep soil, year-round rain, flat ground and a usable bay -- and sparse across the steep western mountains and the dry, freezing plateau behind them, which fail every one of those tests.` },
      relatedLoIds: ['m7geo.population-distribution-and-density'],
    },
    {
      title: 'Worked average hides clustering',
      steps: [
        'Use the definition: density equals population divided by land area.',
        `6,000,000 people divided by 300,000 square miles equals 20 people per square mile. That is the population density of Marovia, and it is a low figure.`,
        `Now ask the honest question: does that number describe any actual place in Marovia? Read the case again. Four out of five people are in four cities on one river.`,
        `So the desert has far fewer than 20 people per square mile, and the four cities have far more. There may be no square mile in the entire country where exactly 20 people live. The average describes the country and describes nowhere in it.`,
        `WRONG conclusion: "Marovia has a density of 20 people per square mile, so people there have lots of space and are spread thinly across the land." CORRECT conclusion: "Marovia has a low average density, but its distribution is heavily clustered along one river, so most Marovians live packed close together."`,
        `The lesson generalizes. Density answers how many for each square mile ON AVERAGE. It never answers where. To answer where, you need the distribution, and the two claims can point in opposite directions at once.`,
      ],
      example: { problem: `Calculate the population density of an invented country, then explain what the number does not tell you.

"Marovia has a population of 6,000,000 people and a land area of 300,000 square miles. Four out of every five Marovians live in one of four cities, and all four cities sit along the same river. The rest of the country is desert."`, solution: `The density is 20 people per square mile, because 6,000,000 divided by 300,000 equals 20. That figure is an average and hides the clustering: with four out of five people in four cities on one river, the desert is far below 20 per square mile and the cities are far above it, so the low density does not mean people are spread out.` },
      relatedLoIds: ['m7geo.population-distribution-and-density'],
    },
  ],
  pointers: [
    { content: `Students often say "The density is low, so people there are spread out across the country." — Density and distribution answer different questions. WRONG: "Low density means people are spread out." CORRECT: "Low density means there are few people for each square mile on average, and the distribution could still be heavily clustered." A country can have a low overall density while nearly everyone lives in a few cities along one river or one coast. The average and the pattern can point in opposite directions at the same time, so a density figure alone never tells you where people are.`, kind: 'common-error' },
    { content: `Students often say "A low-density country therefore has open, usable land everywhere in it." — The land area in the density calculation includes every square mile, including the parts almost nobody can farm or build on. That is often exactly WHY the density is low. So a low figure is frequently a sign that a large share of the country is very dry, very cold, very high or very difficult, rather than a sign that there is comfortable open space waiting everywhere.`, kind: 'common-error' },
    { content: `Distribution is WHERE people are. Density is HOW MANY people there are for each unit of area. Two different questions.`, kind: 'tip' },
    { content: `Density equals population divided by land area, giving people per square mile or per square kilometer.`, kind: 'tip' },
    { content: `People cluster where there is fresh water, arable land, a moderate climate, flat land, and access to the coast or a trade route.`, kind: 'tip' },
    { content: `People are sparse where it is very dry, very cold, very high, or very wet and difficult.`, kind: 'tip' },
    { content: `Density is an average, and averages hide clustering. A low density can sit on top of a heavily clustered distribution.`, kind: 'tip' },
    { content: `Dense and sparse are measurements, not judgments. They say how many people are in an area, and nothing more.`, kind: 'tip' },
    { content: `Don't answer a distribution question with a number. If the question asks WHERE people live, describe the pattern in words ("clustered along the eastern coast, thin in the mountains"). Save "people per square mile" for density questions only.`, kind: 'common-error' },
    { content: `Low density does NOT mean "spread out." It means few people per square mile **on average**. Nearly everyone could still be packed into three cities on one river. The average and the real pattern can point opposite directions.`, kind: 'gotcha' },
    { content: `Divide by LAND area, not population. Density = people ÷ square miles. If your answer comes out as a tiny decimal like 0.05, you probably flipped it. Always write the unit: "20 people per square mile," not just "20."`, kind: 'common-error' },
    { content: `"Dense" and "sparse" are measurements, not insults or compliments. Densely settled ≠ crowded, poor or unpleasant. Sparsely settled ≠ empty, unwanted or backward. Write "sparsely populated," never "nobody lives there."`, kind: 'vocab-note' },
    { content: `The land area in a density figure includes the deserts, ice and mountains too. That is often WHY the number is low — not proof there's comfortable open land everywhere.`, kind: 'edge-case' },
    { content: `Check all five conditions before predicting, don't stop at one. Water alone isn't enough — the Amazon interior has plenty of water and is sparsely settled. Look for water, arable land, moderate climate, flat land, AND coast or trade access together.`, kind: 'tip' },
    { content: `Antarctica is the true edge case: no permanent residents, only research stations. Don't say the same about Greenland or the Sahara — those are sparsely populated, not uninhabited. People do live there.`, kind: 'edge-case' },
    { content: `Watch the wording: "How many people per square mile?" = density. "Which parts of the country have people?" = distribution. Underline the question word before you start — how many vs. where.`, kind: 'tip' },
  ],
};
