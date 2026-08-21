/**
 * Grade 7 World Geography — Africa & the Middle East: Development Today.
 *
 * Closes Unit 9 (National Geography Standard 11). Applies the measured-never-
 * judged frame built in 5.3 to two regions at once, and teaches the
 * GEOGRAPHIC-ECONOMIC REASONING behind present-day patterns: variation between
 * and inside countries, inherited colonial boundaries and the landlocked
 * export route, commodity dependence, youthful age structures, fast-growing
 * cities, and the fact that a technology can skip a step.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters as much as it did in 5.3:
 * this is the row where a "poor continent" caricature would creep in, so the
 * guardrails here are deliberately tighter than the course minimum.
 *   - Rule 4 governs. NO COUNTRY IS RANKED, and there are NO STATISTICS of any
 *     kind -- no income figures, no growth rates, no percentages, no
 *     populations, no poverty figures. An invented figure attached to a real
 *     place is the failure mode this row could produce.
 *   - NO REAL COUNTRY IS NAMED ANYWHERE IN THIS FILE. Every example and every
 *     item uses an invented country. That is a deliberate choice, not an
 *     oversight: the region-level patterns taught here are true of many
 *     countries and of no single one, and attaching any of them to a named
 *     real country would turn a pattern into a label. Do not add names.
 *   - The thesis is that a single label for either region is always wrong,
 *     because each contains dozens of countries whose economies differ
 *     enormously, and conditions differ hugely inside each country too.
 *   - Rule 5: the file characterizes NO group of people, and portrays nobody
 *     as passive or as waiting for help.
 *   - Rule 6: NO current conflict, government, leader, aid debate or trade
 *     debate appears, and NO present-day dispute is named. The general
 *     pattern that boundaries drawn by outside powers without regard for the
 *     people living there have caused lasting difficulty is stated once, as a
 *     general pattern, with no case named. Keep it that way.
 *   - Rule 9: no group is a monolith. Say "many countries", never "the
 *     region".
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U9_AFRICA_MIDDLE_EAST_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.ms.m7geo.africa-middle-east-development.v1',
  title: 'Africa & the Middle East: Development Today',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.africa-middle-east-development',
      standard: 'M7GEO-9.4',
      description:
        'Explain present-day economic patterns in Africa and the Middle East as geography rather than as a ranking -- why a single label never fits a region of dozens of countries, how inherited boundaries left some countries landlocked and raised the cost of reaching a seaport, why export earnings resting on one or two products rise and fall together, what a youthful age structure means for schools and for future workers, and how a technology such as mobile money can spread without waiting for an older network first (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.middle-east-geography-and-resources'],
  followUps: ['m7geo.asia-physical-geography'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Break the one-label habit before any content arrives, using an error the student can feel from the receiving end.',
      script:
        'Suppose somebody who has never visited your country plays one video game set there, watches one short clip, and then tells the whole class what your country is like. They would get something right. They really did see that clip. But they would be describing one scene and calling it a country. Now make the mistake bigger. Africa is not a country. It is a continent of more than fifty countries. The Middle East is not a country either. It is a region of many countries, and geographers do not even all draw its edges in the same place. Today we look at what those countries are actually like economically, and the first thing to know is that they are not alike. One label for either region is always wrong.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-development-today',
      kind: 'concept',
      goal: 'Install variation as the thesis, then the four geographic reasons behind present-day patterns: inherited boundaries, commodity dependence, youthful age structure with fast-growing cities, and technology that skips a step.',
      keyIdeas: [
        'START WITH VARIATION, NOT WITH A LEVEL. Africa contains more than fifty countries, and the Middle East contains many more. Their economies differ enormously from one another: some are higher-income and some are lower-income, some earn most of their money from oil and gas, some from farming, some from factories, some from shipping and ports, some from services. And the differences INSIDE one country are often larger than the differences between two countries -- exactly the point from Measuring Development, where you learned that a national average hides the variation it was made from. A busy port city and a distant rural district sit inside the same average and the average describes neither. So the honest first sentence about either region is not a level. It is that a single label is always wrong.',
        'MANY COUNTRIES ARE YOUNGER THAN THEIR BORDERS. Most countries in Africa became independent in the middle of the twentieth century, chiefly during the 1950s and the 1960s. That is a plain historical fact, and it matters to geography for one reason: the boundaries those countries kept were largely the ones drawn during colonial rule, by outside powers, on maps made far away. Borders drawn by outsiders without regard for the people already living there have caused lasting difficulty in many parts of the world. Two of the results are geographic facts you can reason about today. Some countries ended up LANDLOCKED, with no coastline at all. And some boundaries run straight through a people, so relatives ended up on two sides of a line that nobody living there drew.',
        'BEING LANDLOCKED CHANGES THE COST OF SELLING ANYTHING ABROAD. A landlocked country has no seaport of its own, so goods leaving it must travel across at least one neighboring country before they reach a ship. Every extra mile of road or rail costs money, every border crossing takes time and paperwork, and the route depends on a railway and a port that another government maintains. This is the trade and interdependence idea from Unit 5 in a concrete form: a country can produce something the world wants and still face a longer, costlier path to the buyer than a coastal neighbor faces. It is a fact about position on the map, not a fact about the people or the product.',
        'WHEN EARNINGS REST ON A FEW EXPORTS, THEY MOVE TOGETHER. Some countries in these regions earn most of their export money from a small number of products -- oil, natural gas, cocoa, copper, other minerals. Geographers call that commodity dependence, and the risk in it is simple arithmetic: the country does not set the world price, so when that price falls, almost all of the export earnings fall at the same time, because there is no second large export to make up the difference. Countries have used the earnings from resources in different ways, and several have used them to build cities, ports, airports and universities. Describe that as a STRATEGY a government chose, and describe the results as what happened next. It is not a score, and neither is a price fall a verdict.',
        'A YOUTHFUL AGE STRUCTURE IS A STRUCTURE, NOT A PROBLEM. In many countries in both regions, a large share of the population is children and teenagers. Go back to age structure in Unit 3: a population with many young people and fewer older people has a wide base. That shape says two concrete things at once. It means strong demand for school places NOW, because the children are already born and already need classrooms and teachers. And it means many new workers arriving SOON, because those same young people reach working age within a few years. Cities in many of these countries are also growing quickly, which is the urbanization pattern from Unit 3 happening in the present tense. Planners read this shape and ask what to build. That is what an age structure is for.',
        'A TECHNOLOGY CAN SKIP A STEP, WHICH IS WHY THERE IS NO SINGLE PATH. Mobile phones spread widely across many countries in Africa and the Middle East without those countries first building landline telephone networks into every home, and mobile money -- storing and sending money using a phone rather than a bank branch -- became ordinary in a number of them. That is a well-documented pattern, and it is worth holding onto because it breaks a bad idea. The bad idea is that every country walks the same road in the same order, so some are simply further along it. They do not. When a newer technology is cheaper to install than the older one it replaced, a place can adopt the newer one first. Development is measured, and it changes, and it does not run on one track.',
      ],
      vocabulary: [
        {
          term: 'landlocked',
          definition: 'having no coastline, so goods must cross another country to reach a seaport.',
        },
        {
          term: 'commodity',
          definition:
            'a raw material that is bought and sold on world markets, such as oil, natural gas, cocoa or copper.',
        },
        {
          term: 'commodity dependence',
          definition:
            'earning most of the export money of a country from one or a few commodities, so those earnings rise and fall together.',
        },
        {
          term: 'age structure',
          definition: 'how a population is divided among younger and older people.',
        },
        {
          term: 'mobile money',
          definition: 'storing and sending money using a mobile phone instead of a bank branch.',
        },
        {
          term: 'higher-income and lower-income',
          definition: 'words that describe the economy of a country. They describe the economy, not the people.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-invented-neighbors',
      kind: 'worked_example',
      problem:
        'Two invented countries sit in the same world region. Say what each description tells you, and then say what one label for the region would get wrong.\n\n"Miravel: a coastal country with a deep-water port. Ships load cocoa and containers of clothing sewn in factories near the harbor. A new university opened in the port city. In the dry inland north, many households carry water from a well."\n\n"Sarova: a landlocked neighbor with no coastline. Copper from its mines travels by rail across Miravel to reach the sea. Its capital has grown quickly and has reliable electricity; several rural districts do not."',
      steps: [
        'Read each description for what it actually says, and resist the urge to sort the two countries into an order. Nothing here is a ranking.',
        'Miravel: a coastline, a port, two different exports (a farm commodity and manufactured clothing), and a university. Two exports rather than one means the earnings do not all depend on the same world price.',
        'Sarova: no coastline, and one main export that must cross a neighbor by rail to reach a ship. That is two separate facts about position and about earnings, and both of them are geography.',
        'Now look INSIDE each country, because this is where the lesson from Measuring Development returns. Miravel has a port city with a university and a dry north where households carry water. Sarova has a fast-growing capital with reliable electricity and rural districts without it. Neither country is one thing.',
        'WRONG conclusion: "This region is a poor region." CORRECT conclusion: "These two countries differ from each other in coastline, in exports and in what they have built, and each one differs from itself from district to district. A single label for the region would hide all four of those differences at once."',
        'Notice what did the explaining. Not a level, and not anything about the people. A coastline or the lack of one, how many products the export earnings rest on, and where inside the country you are standing.',
      ],
      answer:
        'Miravel is coastal with a port and two different exports; Sarova is landlocked and its copper must cross Miravel to reach a ship. Both contain districts that look very different from their largest city. One label for the region would hide the differences between the two countries and the variation inside each of them, so no single label fits.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-one-export-price',
      kind: 'worked_example',
      problem:
        'The invented country of Sarova earns most of its export money from copper. The world price of copper falls sharply and stays down for two years. Explain, step by step, why one price change reaches so much of the country, and say what a government could do about the risk in advance.',
      steps: [
        'Start with where the money comes from. Most of the money Sarova earns from selling to other countries comes from one product. So the size of that income depends on one world price.',
        'Ask who sets that price. Sarova does not. A world price is set by buyers and sellers everywhere, so a country that sells copper takes the price the market gives it, whether the price is high or low.',
        'Follow the fall. When the price drops, the same copper earns less. Because there is no second large export, nothing rises to fill the gap, so the total export earnings drop at nearly the same time.',
        'Follow it one step further, because this is the part students miss. Export earnings are also what pay for imported goods and fund government projects such as roads, clinics and schools. So a change in one price does not stay inside the mining industry.',
        'Now the advance question. The risk comes from having ONE source of earnings, so the way to lower the risk is to have more than one. Adding other exports, or processing the copper at home into something worth more, or using high-price years to build ports, power lines and universities that other industries can use, all spread the earnings across more than one price.',
        'WRONG way to say what happened: "The price fell, so the country failed." CORRECT way: "Export earnings that rest on one commodity move with one world price, and that price is set outside the country. Building a second and a third source of earnings is a strategy for making the next price fall smaller."',
      ],
      answer:
        'Because most export earnings come from one product whose price is set on world markets, a price fall cuts nearly all of those earnings at once, and export earnings also pay for imports and government projects, so the effect spreads well beyond mining. The way to reduce that risk in advance is to build additional exports or to process the commodity at home, so that earnings no longer depend on a single price.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-landlocked-export-cost',
      kind: 'try_yourself',
      problem:
        'The invented country of Sarova has no coastline. Its copper is sold to buyers overseas, so it travels by rail across a neighboring country to a seaport. Why does being landlocked tend to raise the cost of selling copper abroad?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The goods must be carried across at least one other country to reach a ship, which adds distance, border crossings and fees.',
          correct: true,
        },
        { id: 'b', text: 'A country without a coastline is not able to trade with other countries at all.' },
        { id: 'c', text: 'A country without a coastline has less fertile soil and fewer minerals underground.' },
        { id: 'd', text: 'A country without a coastline is always farther from the equator than its neighbors.' }
      ],
      expectedAnswer:
        'The goods must be carried across at least one other country to reach a ship, which adds distance, border crossings and fees.',
      hints: [
        'Trace the actual journey the copper makes, from the mine to the deck of a ship, and count what has to happen along the way.',
        'Landlocked is a fact about position on the map. Check whether each choice is about the route to the sea or about something else entirely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-export-risk',
      kind: 'try_yourself',
      problem:
        'The invented country of Tenari earns most of its export money from one commodity. Why is that riskier than earning export money from several different products?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Selling one product means the country runs out of that product sooner.' },
        { id: 'b', text: 'A country that sells one commodity can set its own world price and does not need other exports.' },
        {
          id: 'c',
          text: 'If the world price of that one commodity falls, almost all of the export earnings fall at the same time, because nothing else is large enough to make up the difference.',
          correct: true,
        },
        { id: 'd', text: 'A falling price affects only the companies that mine or grow the commodity, and not the rest of the economy.' }
      ],
      expectedAnswer:
        'If the world price of that one commodity falls, almost all of the export earnings fall at the same time, because nothing else is large enough to make up the difference.',
      hints: [
        'The risk is not about running out of something. Ask what happens to the total money coming in when the single price that decides it moves.',
        'Two of these choices are worth checking against the lesson: who sets a world price, and whether export earnings stay inside one industry.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-young-age-structure',
      kind: 'try_yourself',
      problem:
        'In the invented country of Ambel, a large share of the population is children and teenagers, and there are fewer people at older ages. What does that age structure most directly tell planners?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The total population of Ambel will begin shrinking within the next few years.' },
        { id: 'b', text: 'Ambel must be a lower-income country, because that is what a young population means.' },
        { id: 'c', text: 'The greatest need soon will be for hospitals and care built for people at older ages.' },
        {
          id: 'd',
          text: 'There will be strong demand for school places now, and many people reaching working age within a few years.',
          correct: true,
        }
      ],
      expectedAnswer:
        'There will be strong demand for school places now, and many people reaching working age within a few years.',
      hints: [
        'The children counted in this structure are already born. Ask what they need this year, and then ask what they will be doing in about ten years.',
        'Check the other three. An age structure is a shape, not an income measurement, and a wide base of young people is not the shape of a population about to shrink.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-label-for-a-region',
      kind: 'misconception_check',
      question:
        'A student finishes the unit and writes: "So Africa is poor and the Middle East is rich, and both are behind and are catching up to us." What has gone wrong?',
      commonErrors: [
        {
          answer: 'Africa is poor and the Middle East is rich.',
          misconception:
            'Collapsing dozens of countries into one word each. The student has taken something true of some places and made it a label for an entire continent and an entire region.',
          correctsTo:
            'Africa contains more than fifty countries and the Middle East contains many more, and their economies differ enormously from one another -- some higher-income, some lower-income, some resting on oil and gas, some on farming, some on factories, some on ports and services. Then apply the idea from Measuring Development: even one country is not one thing, because a national average hides the variation inside it, and the gap between a port city and a rural district in the same country is often larger than the gap between two countries. WRONG: "Africa is poor." CORRECT: "Africa is a continent of more than fifty countries whose economies differ from one another, and conditions differ inside each of them too, so no single label fits either the continent or any one country in it."',
        },
        {
          answer: 'These countries are behind us and are catching up along the same road.',
          misconception:
            'Imagining one fixed path that every country walks in the same order, so a country can only be further along it or further back. That turns a measurement into a ranking, which is the thing a measurement is not.',
          correctsTo:
            'There is no single road. Mobile phones spread widely across many countries in these regions without those countries first building landline networks into every home, and mobile money became ordinary in a number of them -- a newer technology adopted first, because it was cheaper to install than the older one it replaced. Development is measured rather than judged, it changes over time, and different countries build different things in a different order. WRONG: "They are behind on the same road." CORRECT: "Different countries are building different things, and a place can adopt a newer technology without ever installing the older one."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Africa is a continent of more than fifty countries and the Middle East is a region of many countries. Their economies differ enormously, and conditions differ inside each country too, so one label for either is always wrong.',
        'Most countries in Africa became independent in the middle of the twentieth century, chiefly in the 1950s and 1960s, and the boundaries they kept were largely the ones drawn during colonial rule.',
        'Landlocked countries have no seaport of their own, so exports must cross a neighbor to reach a ship, which adds distance, border crossings and cost.',
        'Commodity dependence means export earnings rest on one or a few products, so one world price can move almost all of them at once. Using resource earnings to build cities, ports and universities is a strategy, not a score.',
        'A youthful age structure means strong demand for schools now and many new workers soon. It is a structure with its own needs, not a problem.',
        'A technology can skip a step: mobile phones and mobile money spread widely without waiting for landline networks first. There is no single path every country follows.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Africa & the Middle East: Development Today' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
