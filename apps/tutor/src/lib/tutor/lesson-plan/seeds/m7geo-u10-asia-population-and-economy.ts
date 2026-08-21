/**
 * Grade 7 World Geography — Asia: Population & Economy.
 *
 * Concept-led regional row (National Geography Standards 9 and 11), shaped on
 * the m7geo exemplar m7geo-u3-migration-push-and-pull.ts. This row is where
 * the Unit 3 tools (distribution, density, age structure, urbanization) and
 * the Unit 5 tools (economic activity, development, trade) get pointed at one
 * region and made to pay.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters:
 *   1. NO STATISTICS ABOUT REAL PLACES appear anywhere in this file. No
 *      populations, no densities, no incomes, no growth rates, no percentages,
 *      no "largest" or "most populous" claims. Every number in here belongs to
 *      an invented country in a worked example. Real places are named only for
 *      long-settled PHYSICAL facts -- rivers, plains, deltas, plateaus,
 *      deserts, straits -- and for the plain fact of which region they sit in.
 *   2. NO RANKING. A country with many factories is not ahead of a country
 *      with many farms. Economies are different MIXES, never rungs on a
 *      ladder, and never a score for the people who live there.
 *   3. NO POPULATION POLICY OF ANY KIND, no government, no leader, no current
 *      event, no trade dispute, no labor politics. This is geography.
 *   4. Asia holds many countries, climates, languages and ways of living. Any
 *      sentence that treats it as one thing is wrong, and this file says so.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every pattern is
 * described in words, and every item is solvable from the words printed
 * inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U10_ASIA_POPULATION_AND_ECONOMY: LessonPlan = {
  id: 'evelyn.ms.m7geo.asia-population-and-economy.v1',
  title: 'Asia: Population & Economy',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.asia-population-and-economy',
      standard: 'M7GEO-10.3',
      description:
        'Explain why the people of Asia are clustered so unevenly by connecting settlement to river valleys, floodplains, deltas and the monsoon, explain why an average density figure hides that clustering, and describe the different mixes of economic activity across the region, including why coastal position and deep harbors allow export manufacturing in particular places (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface, and National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.south-and-east-asia-culture'],
  followUps: ['m7geo.oceania-and-antarctica'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the row in two ordinary things a twelve-year-old has already handled, before any vocabulary.',
      script:
        'Turn over your headphones, or a phone case, or a soccer ball, and read the small print. A lot of the time it names a place in Asia. Now think about dinner. If there was rice on your plate this week, the plant it came from is happiest in a flooded field in a warm, wet place, and a great many of those fields are in Asia too. Those two things -- a factory that ships things across an ocean, and a field that grows food in shallow water -- look like they have nothing to do with each other. They have everything to do with each other. Both of them sit where they sit because of rivers, coasts and rain. Today you take the tools from Unit 3 and Unit 5 and point them at one continent.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-asia-population-and-economy',
      kind: 'concept',
      goal: 'Install the uneven clustering and its physical causes, the averages trap, rapid urbanization, economies as mixes rather than a ladder, and differing age structures described without judgment.',
      keyIdeas: [
        'MOST OF THE PEOPLE IN THE WORLD LIVE IN ASIA, AND THEY ARE SPREAD ACROSS IT VERY UNEVENLY. This row is the payoff of everything you learned about distribution. The heaviest clusters sit in South Asia and East Asia, on river valleys, floodplains and deltas: the plains along the Ganges River in northern India and Bangladesh, the North China Plain crossed by the Huang He, the floodplain of the Indus in Pakistan, and the delta of the Mekong in southern Vietnam. Wide stretches of the same continent hold very few people -- the high Tibetan Plateau, the cold north of Siberia, and dry interiors such as the Gobi Desert. The thin places are thin for physical reasons -- cold air and short growing seasons on the high plateaus, a frozen north, and dry interiors without the water that farming needs -- and thin is a measurement, never a judgment. Asia also holds many countries, many climates and many languages, so a single sentence about Asia is almost never true of all of it.',
        'PHYSICAL GEOGRAPHY EXPLAINS THE PATTERN, USING THE SAME CONDITIONS YOU MET IN UNIT 3. River valleys and deltas are flat, which makes them easy to farm, to build on and to travel across. When a river floods, it drops fine mud called alluvial soil, and that soil is fertile. Fresh water is right there. And across South and Southeast Asia the monsoon brings a wet season, when moist air off the ocean carries heavy rain inland. Those conditions together allow wet-rice farming, in which rice grows in shallow flooded fields. A flooded rice field feeds a great many people from a small area of land, which is exactly why land like this has carried dense settlement for a very long time.',
        'AGE STRUCTURES DIFFER SHARPLY WITHIN THE REGION, AND AN AGE STRUCTURE IS A DESCRIPTION, NOT A GRADE. In some countries in Asia a large share of the people are young, and what those places need most is classrooms, teachers and, later, jobs for all those young people. In other countries in the same region the share of people over 65 is growing, and what those places need most is health care, home care, and enough working-age people to fill the jobs. Neither structure is better than the other and neither is a fault. Read the structure, say what the place will need, and stop there -- exactly as you learned to do in Unit 3.',
        'AN AVERAGE DENSITY FIGURE HIDES THE CLUSTERING, AND IN ASIA IT HIDES A LOT OF IT. Remember what density does: it smears every person evenly across every square mile of land. A country that is half high plateau and half crowded river valley gets one middling number that describes neither half. So a density figure by itself tells you almost nothing about where people actually are. It is a starting point, not an answer. To find out where the people are, you have to ask the distribution question separately, exactly as you did in Unit 3, and exactly as you learned to read a development indicator one thing at a time in Unit 5.',
        'CITIES IN MANY PARTS OF ASIA HAVE BEEN GROWING QUICKLY, AND RURAL-TO-URBAN MIGRATION IS THE ENGINE. People move from farming areas to cities looking for work, schooling and services, which raises the share of people living in cities -- that is urbanization, from Unit 3. Some of these cities are enormous. Fast growth puts real pressure on things a city has to build slowly: housing, water pipes, sewers, roads and trains. When people arrive faster than the housing and the transport can be built, the shortage is a planning problem, not a fault of anybody who moved.',
        'ECONOMIES ACROSS ASIA ARE DIFFERENT MIXES, NOT RUNGS ON A LADDER. Some countries have built large export manufacturing sectors, making goods to sell abroad. Others rest more on farming, on resources such as the oil and natural gas of Southwest Asia, or on services. Several have grown very fast in recent decades. Where the factories sit is a geography question, not an accident: making goods for far-away customers needs a coastal position and a harbor deep enough for container ships, because a container ship carries a load overseas far more cheaply than trucks can carry it overland. Ships between the Indian Ocean and the Pacific Ocean pass through the Strait of Malacca, a narrow passage between the Malay Peninsula and the island of Sumatra. Describe the mix a place has and the geography behind it. Never score it, and never describe one mix as further along than another.',
      ],
      vocabulary: [
        { term: 'delta', definition: 'the flat, fan-shaped land a river builds at its mouth out of the material it carries.' },
        { term: 'floodplain', definition: 'the flat land beside a river that the river covers when it floods.' },
        { term: 'alluvial soil', definition: 'fertile soil made of fine material dropped by a river when it floods.' },
        { term: 'monsoon', definition: 'a seasonal reversal of winds that brings a wet season and a dry season to a region.' },
        { term: 'wet-rice farming', definition: 'growing rice in shallow flooded fields.' },
        { term: 'export manufacturing', definition: 'making goods in one country in order to sell them in other countries.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-average-hides-the-valley',
      kind: 'worked_example',
      problem:
        'Neither country below is real. Find the overall population density of Meralon, then find the density of each of its two parts, and explain what the overall figure hides.\n\n"Meralon has 300,000 square miles of land and 60,000,000 people. Of that land, 30,000 square miles is the floodplain of one large river, and 48,000,000 people live there. The other 270,000 square miles is a dry, high plateau, and the remaining 12,000,000 people live on it."',
      steps: [
        'Overall density first. Density is population divided by land area. 60,000,000 people divided by 300,000 square miles equals 200 people per square mile.',
        'Now the floodplain on its own. 48,000,000 people divided by 30,000 square miles equals 1,600 people per square mile.',
        'Now the plateau on its own. 12,000,000 people divided by 270,000 square miles equals about 44 people per square mile.',
        'Compare the three numbers. The overall figure is 200. But no part of Meralon actually looks like 200 people per square mile. One part is around eight times denser than the overall figure, and the other part is far thinner than it.',
        'Say what the overall figure hid: it hid the clustering. It smeared the floodplain crowd evenly over a plateau where almost nobody lives, and produced a number that describes neither place.',
        'Last, connect it to the real pattern. This is the shape of the problem across much of South and East Asia, where river valleys, floodplains and deltas hold dense settlement while high, cold or dry land nearby holds very little. An average density for a whole country will always flatten that difference, so ask for the distribution as well.',
      ],
      answer:
        'Overall density is 200 people per square mile. The floodplain is 1,600 people per square mile and the plateau is about 44. The overall figure is an average that hides the clustering, because it describes neither the crowded floodplain nor the thinly settled plateau.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-why-the-factory-sits-on-the-coast',
      kind: 'worked_example',
      problem:
        'Neither place below is real. A company wants to build a factory that will make goods to sell in countries across the ocean. Explain which town it should choose, and why the choice is a geography question.\n\n"Port Halden sits on a bay with deep water close to shore, so the largest ocean ships can tie up at the dock. Inland Ferris sits 200 miles up a shallow river, on a good road, in a region with the same workers, the same electricity and the same raw materials as Port Halden."',
      steps: [
        'Notice what is the SAME in both towns. Workers, electricity and raw materials are equal, so none of those can decide the question. Whatever decides it has to be the one thing that differs.',
        'The one thing that differs is access to the ocean. Port Halden has deep water at the dock. Inland Ferris is 200 miles up a river too shallow for ocean ships.',
        'Work out what that difference costs. Goods made in Inland Ferris have to travel 200 miles by truck before they ever reach a ship. Goods made in Port Halden are loaded straight onto the ship. A container ship moves a load across an ocean far more cheaply than trucks move it overland, so every mile spent on land instead of water raises the price of the finished good.',
        'Check the depth point, because students skip it. A town can sit on water and still be no use for this. A shallow river will float small boats but not a loaded ocean ship. What export manufacturing needs is deep water, not just any water.',
        'State the answer in geography language: Port Halden, because its coastal position and its deep harbor connect the factory directly to ocean shipping.',
        'Now the callback. This is why export manufacturing across coastal East and Southeast Asia grew up in particular places rather than spread evenly. Where a factory CAN be is a question about harbors, coasts and shipping routes. It is not a ranking of the towns, and it says nothing whatever about the people in either one.',
      ],
      answer:
        'Port Halden. Everything else about the two towns is equal, so the deep harbor decides it: goods load straight onto ocean ships instead of traveling 200 miles overland first. Coastal position and water deep enough for container ships are what make export manufacturing possible in a place.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-the-delta-is-crowded',
      kind: 'try_yourself',
      problem:
        'Read the description, then choose the best explanation.\n\n"In the invented country of Sarreth, the delta at the mouth of the Kesh River is settled far more densely than the rocky uplands 50 miles inland. The delta is flat. The river floods it most years and leaves fine mud behind. Rain falls heavily in one season each year."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The delta stands higher than the land around it, which keeps it dry and easy to build on.' },
        { id: 'b', text: 'Delta soil is poor, so the only reason anyone lives there is to fish.' },
        {
          id: 'c',
          text: 'The delta is flat, the floods leave fertile soil, and fresh water and seasonal rain support farming that feeds many people from a small area.',
          correct: true,
        },
        { id: 'd', text: 'Deltas are always the most densely settled part of a country, wherever they are.' }
      ],
      expectedAnswer:
        'The delta is flat, the floods leave fertile soil, and fresh water and seasonal rain support farming that feeds many people from a small area.',
      hints: [
        'The description gives you three physical facts about the delta. Ask what each one does for a farmer: flat land, fine mud left by floods, and heavy seasonal rain.',
        'One choice contradicts what a delta is, one contradicts what flood mud does, and one states a rule about all deltas everywhere instead of explaining this one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-average-hides-clustering',
      kind: 'try_yourself',
      problem:
        'The invented country of Tavani reports a fairly low overall population density. A geographer then reports that nearly everyone in Tavani lives along one narrow river valley, and that most of the country is high, cold mountain land. Which statement is best supported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two reports disagree, so one of them must be a mistake.' },
        { id: 'b', text: 'Since the overall density is low, people in Tavani must be spread evenly and thinly everywhere.' },
        {
          id: 'c',
          text: 'Both can be true, because an overall density is an average that can hide a crowded valley inside a thinly settled country.',
          correct: true,
        },
        { id: 'd', text: 'The low overall density proves that Tavani has only a small number of people in total.' }
      ],
      expectedAnswer:
        'Both can be true, because an overall density is an average that can hide a crowded valley inside a thinly settled country.',
      hints: [
        'Density divides the whole population by the whole land area. Ask what happens to a crowded valley when it is averaged together with a large area of empty mountains.',
        'Two of the wrong choices confuse density with something else: one with an even spread, and one with total population size. Those are different questions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-port-and-export-manufacturing',
      kind: 'try_yourself',
      problem:
        'Two invented towns want the same new factory, which will make goods to sell overseas. Marrow Bay sits on a deep natural harbor on the coast. Elden Cross sits inland on a shallow river, and has more people than Marrow Bay. Workers, electricity and raw materials are the same in both. Which reason best explains choosing Marrow Bay?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Its deep harbor lets large container ships load at the dock, so goods do not have to travel overland first.',
          correct: true,
        },
        { id: 'b', text: 'Factories are always built in whichever town has the larger population.' },
        { id: 'c', text: 'Elden Cross is on a river, and any water at all works the same way for ocean shipping.' },
        { id: 'd', text: 'Marrow Bay is farther from the ocean, and distance from the coast lowers shipping costs.' }
      ],
      expectedAnswer:
        'Its deep harbor lets large container ships load at the dock, so goods do not have to travel overland first.',
      hints: [
        'Workers, electricity and raw materials are equal in both towns, so the answer has to involve the one thing that is different.',
        'Ask what a loaded ocean ship needs from the water it sits in, and which direction shipping costs move when goods have to go overland before they reach a ship.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-asia-is-one-thing',
      kind: 'misconception_check',
      question:
        'A student writes: "Asia is crowded everywhere, and the countries there with a lot of farming are behind the ones with a lot of factories." Two separate things are wrong. What are they?',
      commonErrors: [
        {
          answer: 'Asia is crowded everywhere.',
          misconception:
            'Turning one true statement -- that most of the people in the world live in Asia -- into a claim about every part of it, and treating a continent as if it were one uniform place.',
          correctsTo:
            'The people of Asia are clustered, not spread. WRONG: "Asia is crowded everywhere." CORRECT: "Most of the people in Asia are clustered in the river valleys, floodplains and deltas of South and East Asia, while the high plateaus, the cold north and the dry interiors hold very few people." The clustering is the whole point of the row, and it is exactly the thing an average density figure hides. Asia also contains many countries, climates and languages, so check any sentence that begins "Asia is" before you write it.',
        },
        {
          answer: 'Countries with a lot of farming are behind the countries with a lot of factories.',
          misconception:
            'Reading kinds of economic activity as steps on a ladder, so that a place with more primary activity gets scored as behind a place with more secondary activity -- and, without meaning to, so do the people who live there.',
          correctsTo:
            'The mix of activity in a place describes WHAT KIND of work is done there, not how good the place is. WRONG: "That country is behind because it farms." CORRECT: "That country has a mix weighted toward farming, and this one has a mix weighted toward export manufacturing." Each mix reflects the land, the water, the resources and the location a place has. Everybody eats food that farming produced, so no economy outgrows its farms. Describe the mix and the geography behind it, and never rank countries or the people in them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Most of the people in the world live in Asia, and they are clustered very unevenly -- densely in the river valleys, floodplains and deltas of South and East Asia, thinly on the high plateaus, the cold north and the dry interiors.',
        'The physical reasons are flat land, fertile alluvial soil left by floods, reliable fresh water, and a monsoon wet season that supports wet-rice farming, which feeds many people from a small area.',
        'An average density figure hides clustering. It describes no real part of a country that has both a crowded valley and empty highland. Ask for the distribution too.',
        'Cities in many parts of Asia have grown quickly, driven by rural-to-urban migration, and fast growth puts pressure on housing, water and transport.',
        'Economies across the region are different mixes -- export manufacturing, farming, resources, services -- and a mix is never a rung on a ladder.',
        'Export manufacturing needs coastal position and a harbor deep enough for container ships, so where a factory can be is a geography question.',
        'Age structures differ across the region, and an age structure tells you what a place will need, never how good it is.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Asia: Population & Economy' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
