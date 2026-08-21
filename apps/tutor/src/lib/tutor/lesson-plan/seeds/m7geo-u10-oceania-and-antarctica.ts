/**
 * Grade 7 World Geography — Oceania & Antarctica.
 *
 * The FINAL row of the forty-lesson course (National Geography Standard 4).
 * It is written as a close: every big idea in it is a deliberate callback to
 * an earlier unit -- physical factors explain where people live (3.1), plate
 * boundaries explain hazards (2.2), landforms and climate together explain
 * what a place can support (2.1 and 2.3), distance is a cost (5.4), a region
 * is a label drawn for a purpose (1.4), and countries cooperate through
 * agreements (6.4). The recap closes the course, not just the lesson.
 *
 * NOTE FOR FUTURE AUTHORS, and these matter:
 *
 * 1. The best idea in this row is HIGH ISLANDS VERSUS LOW ISLANDS. It gets the
 *    first worked example because it is Unit 2 reasoning applied at the
 *    smallest scale in the course: two islands the same distance from the
 *    Equator can support entirely different ways of living, and the reason is
 *    how the island was built.
 * 2. Indigenous peoples appear in the PRESENT TENSE, always. Aboriginal and
 *    Torres Strait Islander peoples live in Australia now. Maori live in New
 *    Zealand now. Pacific islands were settled by ocean navigators whose
 *    descendants live across the Pacific now. This file does not speak for
 *    anyone, does not describe what any group is like, and does not treat the
 *    Pacific as one culture -- it holds many countries, many languages and many
 *    ways of living. Write Maori in plain ASCII, without the macron.
 * 3. There are NO NUMBERS anywhere in this file: no areas, no populations, no
 *    elevations, no temperatures, no island counts. Measured physical
 *    superlatives -- coldest, windiest, driest continent -- are fine and carry
 *    no judgement.
 * 4. Antarctica is described physically and cooperatively ONLY. No territorial
 *    claim, no dispute, no politics. The low elevation of coral atolls makes
 *    them physically vulnerable to rising seas and storm surge; that is stated
 *    as a physical fact and is never turned into a policy argument.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * places is described in words inside the item that needs it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U10_OCEANIA_AND_ANTARCTICA: LessonPlan = {
  id: 'evelyn.ms.m7geo.oceania-and-antarctica.v1',
  title: 'Oceania & Antarctica',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.oceania-and-antarctica',
      standard: 'M7GEO-10.4',
      description:
        'Describe the physical characteristics of Oceania and Antarctica -- the arid interior and well-watered eastern coasts of Australia, the mountains and plate boundary of New Zealand, the difference between volcanic high islands and low coral atolls, and the cold, dry, ice-covered continent that has no permanent population -- and explain how those physical characteristics shape where people live and how places are connected (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m7geo.asia-population-and-economy'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open at the edge of the map the student has never looked at closely, and signal that this is the last stop in the course.',
      script:
        'Spin a globe and stop it with your finger somewhere in the middle of the Pacific. Almost every time, you will land on water. Keep looking though, because scattered across that blue are islands -- some of them mountains with rainforest running down to the shore, some of them thin rings of sand and coral barely lifted above the waves. Then slide your finger all the way to the bottom of the globe and you reach a whole continent of ice where nobody lives permanently at all. This is the last lesson of the course, and it is a good one to end on, because everything you have learned still works out here. Where is it. What is it like there. And why is it like that.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-oceania-antarctica',
      kind: 'concept',
      goal: 'Install the region of Oceania, the physical geography of Australia and New Zealand, the high-island versus low-island distinction, the cost of ocean distance, and the physical facts of Antarctica.',
      keyIdeas: [
        'OCEANIA IS MOSTLY OCEAN. The region takes in Australia, New Zealand and a great many islands spread across the Pacific. Geographers often sort those islands into three groups -- Melanesia, Micronesia and Polynesia -- but remember what a region is: a label people drew for a purpose. The lines are not painted on the water. Oceania holds many separate countries, many languages and many different ways of living, so it is never one place and never one culture. The islands were settled long ago by skilled long-distance ocean navigators who crossed enormous stretches of open water without instruments, reading swells, stars, winds and birds. That was one of the most remarkable pieces of applied geography anyone has ever done, and the descendants of those navigators live across the Pacific today. Pacific island countries have small land areas spread across enormous stretches of ocean, which makes transport, trade and communication expensive -- Unit 5 again, where distance itself is a cost.',
        'AUSTRALIA IS DRY IN THE MIDDLE AND WET ALONG THE EAST. The interior is largely arid, and Australians call it the outback. Most people live along the eastern and southeastern coasts, where rainfall is far more reliable. Look at what just happened: a physical fact about rain explains a human fact about where people live. That is the same reasoning you used back in Unit 3 on population distribution, and it is still doing the work in the last lesson of the course. Aboriginal and Torres Strait Islander peoples have lived in Australia for tens of thousands of years and live there today, in many distinct communities with many different languages.',
        'AUSTRALIA HAS BEEN ISOLATED FOR A VERY LONG TIME, and that shows up in its living things. Because the landmass has been separated from other continents for so long, a great many of its animals and plants are found nowhere else on Earth. Off the northeastern coast lies the Great Barrier Reef, a huge system of coral reefs living in the warm, shallow water there.',
        'NEW ZEALAND IS MOUNTAINOUS, COOLER AND GEOLOGICALLY ACTIVE. It sits farther from the Equator than most of Oceania, so it is cooler, and it is mountainous rather than flat. It also sits near a boundary between two tectonic plates, which is why it has volcanoes and earthquakes. That is Unit 2 again: hazards cluster where plates meet. Maori are the indigenous people of New Zealand and live there today.',
        'HIGH ISLANDS AND LOW ISLANDS ARE BUILT DIFFERENTLY, AND THAT CHANGES EVERYTHING. A HIGH ISLAND is volcanic. It is mountainous, its relief forces moist air upward so it catches more rain, it has streams running down it, and its broken-down volcanic rock makes richer soil. A LOW ISLAND is a coral atoll: a ring of coral built up on top of a sunken volcano, only slightly above the sea, with thin soil and no rivers. On a low island, FRESH WATER IS THE LIMITING RESOURCE -- rain caught and stored, and a thin layer of fresh groundwater sitting above the salty water below. Two islands the same distance from the Equator, in the same ocean, can therefore support completely different ways of living. Because they sit so low, atolls are also physically vulnerable to rising seas and to storm surge, which is simply what low elevation means near an ocean.',
        'ANTARCTICA IS COLD, DRY AND EMPTY OF PERMANENT RESIDENTS. It is the coldest, the windiest and the driest continent, and almost all of it lies under a thick sheet of ice. Here is the surprise: Antarctica counts as a DESERT, because a desert is defined by how little precipitation falls, not by how hot it is. Very little snow falls there in a year; the ice is thick because what does fall has been piling up for an immense length of time. Nobody lives in Antarctica permanently. People stay there temporarily at research stations and then go home. An international agreement sets the continent aside for peaceful and scientific use, which is Unit 6 cooperation working on the emptiest land on the planet.',
      ],
      vocabulary: [
        { term: 'Oceania', definition: 'the region made up of Australia, New Zealand and the islands of the Pacific Ocean.' },
        { term: 'outback', definition: 'the dry, thinly settled interior of Australia.' },
        { term: 'high island', definition: 'a volcanic island that is mountainous, catches more rain, and has streams and richer soil.' },
        { term: 'low island', definition: 'a coral island lying only slightly above the sea, with thin soil and no rivers.' },
        { term: 'atoll', definition: 'a ring-shaped coral island or chain of islets built up around a lagoon.' },
        { term: 'ice sheet', definition: 'a very thick, continent-sized layer of ice covering the land beneath it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-high-vs-low-island',
      kind: 'worked_example',
      problem:
        'Two invented Pacific islands lie the same distance from the Equator, in the same ocean, a short flight apart.\n\nIsland A: a steep mountain rising out of the sea, dark rocky soil, forest on the slopes, several small streams running down to the shore, and clouds that gather against the high ground most afternoons.\n\nIsland B: a narrow ring of low land curving around a shallow lagoon. The whole island is only slightly above the sea. The soil is thin and sandy, there are no streams anywhere on it, and coconut palms grow along the ring.\n\nSay which island is a high island and which is a low island, and name the resource that most limits daily life on the low one.',
      steps: [
        'Start with how each island was built, because that is what the two names actually describe. Island A is a mountain standing up out of the ocean, which is the shape a volcano makes. Island A is a HIGH ISLAND.',
        'Island B is a ring of low land around a lagoon. That is the shape of a coral atoll, built up by coral on top of a volcano that has since sunk below the surface. Island B is a LOW ISLAND.',
        'Now use the relief to explain the water. Island A is tall, so moist air blowing in is forced upward against the slopes, cools, and drops rain -- the clouds gathering against the high ground each afternoon are that happening. Rain that lands high up runs downhill, which is where the streams come from.',
        'Island B has no high ground, so there is nothing to force air upward and nothing for water to run down. No relief means no streams, no matter how much ocean surrounds it.',
        'Then the soil. Island A has dark rocky soil because volcanic rock has been breaking down over a long time. Island B has thin sandy soil because broken coral and sand is what an atoll has to work with.',
        'Finally, the limiting resource on Island B. The island is surrounded by water, but seawater is salty and there are no streams. So fresh water is what people must catch when it rains and store carefully, plus a thin layer of fresh groundwater sitting above the salty water underneath. FRESH WATER is the limiting resource -- not land, not food from the sea, not sunlight.',
      ],
      answer:
        'Island A is a high island: volcanic, mountainous, catching rain against its own relief, with streams and richer soil. Island B is a low island, a coral atoll around a lagoon, only slightly above the sea, with thin sandy soil and no streams. Fresh water is the resource that most limits daily life on Island B.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-antarctica-is-a-desert',
      kind: 'worked_example',
      problem:
        'A student writes: "Antarctica cannot be a desert. It is buried under ice, and deserts are hot and sandy." Explain what the student has gotten wrong, and state the correct test.',
      steps: [
        'Go back to the definition you learned with climate zones. A desert is defined by PRECIPITATION -- how much rain or snow falls in a year. It is not defined by temperature and it is not defined by sand.',
        'Apply that test to Antarctica. Very little precipitation falls there. By the definition, it is a desert. It is in fact the driest continent.',
        'Now deal with the ice, because that is the part that confuses people. Thick ice is not proof of heavy snowfall. Almost nothing melts in that cold, so even a small amount of snow each year piles up and stays, and it has been piling up for an immense length of time. Slow accumulation plus almost no melting equals a thick ice sheet.',
        'It also helps to know that very cold air holds very little moisture, so there is not much water available to fall as snow in the first place.',
        'WRONG way to say it: "Antarctica is not a desert because it is freezing and covered in ice." CORRECT way: "Antarctica is a desert because very little precipitation falls there, and the ice is thick because what falls almost never melts."',
      ],
      answer:
        'The student is using temperature and sand as the test. The real test is precipitation. Antarctica receives very little precipitation, so it is a desert -- the driest continent -- and its thick ice sheet is the result of slow accumulation with almost no melting, not of heavy snowfall.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-high-low-island',
      kind: 'try_yourself',
      problem:
        'Two invented islands sit the same distance from the Equator, in the same ocean. Island K is a steep, mountainous island with streams and deep dark soil. Island L is a low ring of coral around a lagoon, with thin sandy soil and no streams. Which is the best explanation of the difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Island K lies closer to the Equator, so it receives more rainfall than Island L.' },
        {
          id: 'b',
          text: 'Island K is a volcanic high island, so its relief catches more rain and its broken-down rock makes richer soil, while Island L is a low coral atoll with no high ground.',
          correct: true,
        },
        { id: 'c', text: 'Island K is larger, and larger islands always have cooler climates than smaller ones.' },
        { id: 'd', text: 'Island L is newer, and islands grow streams and soil only after people settle on them.' }
      ],
      expectedAnswer:
        'Island K is a volcanic high island, so its relief catches more rain and its broken-down rock makes richer soil, while Island L is a low coral atoll with no high ground.',
      hints: [
        'The question already tells you the two islands are the same distance from the Equator, so latitude cannot be the difference. Look at how each island was built instead.',
        'Ask what high ground does to moist air moving over an island, and where streams have to come from.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-australia-population',
      kind: 'try_yourself',
      problem:
        'In Australia, most people live along the eastern and southeastern coasts rather than in the interior. Which best explains why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The interior is covered by a thick ice sheet, so nobody can settle there.' },
        { id: 'b', text: 'The interior is too mountainous to build on, so settlement is pushed to flat coastal land.' },
        { id: 'c', text: 'The interior is largely arid, while the eastern and southeastern coasts get far more reliable rainfall.', correct: true },
        { id: 'd', text: 'People always settle on coasts, whatever the land inland is like.' }
      ],
      expectedAnswer: 'The interior is largely arid, while the eastern and southeastern coasts get far more reliable rainfall.',
      hints: [
        'This is the Unit 3 question again: which physical factor makes a place easy or hard to live in? Start with water.',
        'One of these choices belongs to a different continent entirely, and one of them is a rule that is not actually true -- plenty of people live far inland elsewhere in the world.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-antarctica-desert',
      kind: 'try_yourself',
      problem:
        'All four statements below about Antarctica are true. Which one is the reason geographers call Antarctica a desert?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is the coldest continent.' },
        { id: 'b', text: 'It is almost entirely covered by a thick ice sheet.' },
        { id: 'c', text: 'It has no permanent population.' },
        { id: 'd', text: 'Very little precipitation falls there.', correct: true }
      ],
      expectedAnswer: 'Very little precipitation falls there.',
      hints: [
        'Every choice is a true fact. The question is which fact matches the DEFINITION of a desert.',
        'Say the definition of a desert to yourself before you choose. Does it mention heat, ice or people at all?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pacific-and-desert',
      kind: 'misconception_check',
      question:
        'A student says: "Antarctica is way too icy to be a desert, and anyway all the Pacific islands are basically the same -- little sandy places in the middle of the ocean." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'Antarctica is too icy and too cold to be a desert.',
          misconception:
            'Treating a desert as a hot, sandy place, so that cold and ice seem to rule it out. The student is using temperature and appearance as the test instead of precipitation.',
          correctsTo:
            'A desert is defined by how little precipitation falls, not by how hot it is or what the ground looks like. Very little snow falls on Antarctica, so it is a desert -- the driest continent, as well as the coldest and the windiest. The ice sheet is thick because almost nothing melts, so tiny yearly amounts of snow have piled up over an immense length of time. WRONG: "It is icy, so it cannot be a desert." CORRECT: "Very little precipitation falls, so it is a desert, and the ice is thick because what falls stays."',
        },
        {
          answer: 'All the Pacific islands are basically the same.',
          misconception:
            'Flattening an entire ocean-sized region into one image, usually a low sandy island with palm trees. It ignores both the physical difference between islands and the fact that Oceania holds many countries, languages and ways of living.',
          correctsTo:
            'Physically, there are at least two very different kinds of island. A HIGH ISLAND is volcanic: mountainous, catching rain against its own relief, with streams and richer soil. A LOW ISLAND is a coral atoll: only slightly above the sea, with thin soil, no streams, and fresh water as its limiting resource. Two islands the same distance from the Equator can support completely different ways of living because of that. And Oceania is not one culture either -- it takes in many separate countries and many languages, so any sentence beginning "Pacific islanders are..." is already going wrong.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Oceania is Australia, New Zealand and the many islands of the Pacific. Melanesia, Micronesia and Polynesia are labels people drew, not lines found in nature.',
        'Australia is arid in the interior -- the outback -- and most people live along the eastern and southeastern coasts, where rainfall is reliable. Physical geography explains the population pattern.',
        'New Zealand is mountainous and cooler, and it sits near a plate boundary, so it has volcanoes and earthquakes.',
        'High islands are volcanic, catch rain on their own relief, and have streams and richer soil. Low islands are coral atolls, barely above the sea, with thin soil and fresh water as the limiting resource.',
        'Small land areas spread across an enormous ocean make transport, trade and communication expensive. Distance is a cost.',
        'Antarctica is the coldest, windiest and driest continent, a desert because so little precipitation falls, covered by a thick ice sheet, with no permanent population and an international agreement setting it aside for peaceful and scientific use.',
        'That is the end of the course. The three questions you started with in Unit 1 still work anywhere on the planet, including its emptiest corners: where is it, what is it like there, and why is it like that.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Oceania & Antarctica' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
