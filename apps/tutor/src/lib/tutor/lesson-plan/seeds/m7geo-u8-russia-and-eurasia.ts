/**
 * Grade 7 World Geography — Regions: Russia & Eurasia Today. Closes Unit 8.
 *
 * Concept-led row (National Geography Standard 13). The lesson has one
 * question behind it, and only one: HOW DO SIZE, COLD AND DISTANCE SHAPE A
 * REGION? Everything here is settlement, climate, landforms, rivers,
 * transport and resources.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more than any other note in
 * the course: this file deliberately confines itself to PHYSICAL AND ECONOMIC
 * GEOGRAPHY. It names no war, no conflict, no invasion, no sanction, no
 * alliance, no treaty, no border dispute, no election, no leader and no
 * political party. It evaluates no government -- row 6.1 taught government
 * types without labeling real countries, and this row holds that line. It
 * describes no country's foreign relations. It does not characterize the
 * people of Russia or of any country in the region; the region contains many
 * countries, languages, religions and ethnic groups, and the file says so.
 * History appears in exactly one neutral sentence -- the Soviet Union
 * dissolved in 1991 into fifteen independent countries -- because that single
 * fact is why the political map of the region looks as it does. Nothing more.
 *
 * The test to apply before adding a sentence here: WOULD THIS SENTENCE LOOK
 * DIFFERENT DEPENDING ON TODAY'S NEWS? If yes, it does not belong in a
 * twelve-year-old's geography lesson. Cut it.
 *
 * There are also no figures in this file -- no area, no population, no count
 * of time zones, no temperatures, no reserve volumes -- and NO MAPS AND NO
 * IMAGES. Every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U8_RUSSIA_AND_EURASIA: LessonPlan = {
  id: 'evelyn.ms.m7geo.russia-and-eurasia.v1',
  title: 'Russia & Eurasia Today',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.russia-and-eurasia',
      standard: 'M7GEO-8.4',
      description:
        'Explain how enormous size, extreme cold and distance from useful ports shape where people live, how goods move and which resources can be used across northern Eurasia, including the clustering of settlement in the west, the effect of permafrost on building, the northward flow of the Siberian rivers, the role of the Trans-Siberian Railway, and the constraint that landlocked countries in Central Asia face in reaching a seaport (National Geography Standard 13: how the forces of cooperation and conflict among people influence the division and control of Earth surface).',
    },
  ],
  prerequisites: ['m7geo.europe-economy-and-union'],
  followUps: ['m7geo.africa-physical-geography'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make sheer size feel like a real problem before any vocabulary arrives.',
      script:
        'Think about the longest journey you have ever taken. Maybe a drive that ate a whole day, or a flight where the movie ended and you were still not there. Now think about a train ride that keeps going for days. You sleep on the train. You wake up, and the trees outside look exactly the same as they did yesterday. You wake up again, and they still do. That train ride is real, and it crosses one country. When the working day is beginning at one end of that country, people at the other end are already asleep. Today the whole lesson is about what happens to a place when it is that big, that cold, and that far from a warm sea.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-size-cold-distance',
      kind: 'concept',
      goal: 'Install size as a geographic cost, the western clustering of settlement, permafrost and the northern forests, the north-flowing rivers, hard-to-reach resources, and the landlocked constraint in Central Asia.',
      keyIdeas: [
        'SIZE IS ITSELF A GEOGRAPHIC PROBLEM. Russia is the largest country in the world by area. It stretches across northern Eurasia, from eastern Europe in the west all the way to the Pacific Ocean in the east, and it spans many time zones. Bigness sounds like an advantage, and sometimes it is, but it comes with a permanent bill: every road, every rail line, every pipeline and every delivery has to cover an enormous distance, and distance costs money, fuel and time. Eurasia is the single landmass that Europe and Asia together make up.',
        'MOST PEOPLE LIVE IN THE WEST. Settlement is clustered in the western part of the country, west of and around the Ural Mountains, which are the low range traditionally used to divide Europe from Asia. The vast areas to the east and to the north are sparsely populated. This is row 3.1 again: population is almost never spread evenly, and physical conditions explain where the clusters are. The east is not empty because nobody thought of going there. It is sparsely settled because of what the climate and the ground are like.',
        'COLD AND PERMAFROST EXPLAIN THE SPARSE PARTS. Across the north and much of Siberia, the ground is PERMAFROST -- soil that stays frozen all year, in some places to a great depth. Permafrost makes building difficult and expensive, because a heated building or a warm pipeline thaws the ground underneath it, and thawed ground shifts and sags, so roads buckle, pipelines bend and foundations have to be raised on piles driven down into the frozen layer. South of the tundra lies the TAIGA, a vast forest of coniferous trees -- spruce, pine, fir and larch -- that stretches across the whole width of the country. North of the taiga, where it is too cold for trees, is TUNDRA: low mosses, lichens and small shrubs.',
        'THE GREAT SIBERIAN RIVERS FLOW NORTH, AND THAT LIMITS THEIR USEFULNESS. The Ob, the Yenisei and the Lena all run northward and empty into the Arctic Ocean. Rivers are usually one of the best highways a region has, but these three carry far less trade than their size suggests, for three geographic reasons. First, they flow AWAY from where most people and most markets are, instead of toward them. Second, they are frozen for a large part of the year, so boats cannot use them. Third, when the spring thaw comes, the southern headwaters melt first while the mouths in the far north are still locked in ice, so the water backs up behind the ice and floods the land. East-west movement is carried instead by the TRANS-SIBERIAN RAILWAY, which runs from Moscow in the west to Vladivostok on the Pacific coast and is the backbone of overland travel and freight across the country.',
        'THE REGION HOLDS ENORMOUS RESOURCES IN HARD PLACES. Northern Eurasia has very large reserves of oil, natural gas, minerals and timber. But go back to row 5.2: a resource is only a resource if you can reach it and use it. Much of this wealth sits under permafrost, deep in the taiga, or far from any railway or port, so getting it out means building in frozen ground and then hauling it a very long way. The resource being there and the resource being usable are two different questions, and in this region the second one is the hard one.',
        'CENTRAL ASIA IS DRY, AND MUCH OF IT IS LANDLOCKED. South and east of the Caspian Sea lies Central Asia, a largely dry region of STEPPE -- wide, mostly treeless grassland -- and desert, where water is the limiting resource. Most of its countries are landlocked, meaning they have no coastline on an ocean, and that is a real geographic constraint, not a small one: as row 5.4 explained, a landlocked country has to move its exports across at least one neighboring country to reach a seaport, which adds cost, paperwork and delay to everything it sells abroad. The Caspian Sea itself is the largest inland body of water on Earth; it is salty and has no outlet to the ocean. One piece of history explains the political map here, and only one: the Soviet Union dissolved in 1991 into fifteen independent countries. Across those countries people speak many different languages, follow many different religions, and belong to many different ethnic groups, so no single description fits everyone who lives in this region.',
      ],
      vocabulary: [
        { term: 'Eurasia', definition: 'the single large landmass made up of Europe and Asia together.' },
        { term: 'permafrost', definition: 'ground that stays frozen all year round.' },
        { term: 'taiga', definition: 'the vast northern forest of coniferous trees such as spruce, pine and larch.' },
        { term: 'tundra', definition: 'the treeless cold zone north of the taiga, covered in mosses, lichens and low shrubs.' },
        { term: 'steppe', definition: 'wide, mostly treeless grassland in a dry climate.' },
        { term: 'landlocked', definition: 'having no coastline on an ocean, so goods must cross another country to reach a seaport.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-north-flowing-rivers',
      kind: 'worked_example',
      problem:
        'Two rivers are about the same size. Explain why one of them carries much more trade than the other.\n\nRiver A crosses a cold northern plain and empties into the Arctic Ocean. The land near its mouth is frozen for a large part of the year, and few people live along its lower course. River B crosses a mild plain and empties into a warm sea beside a large port city, and it stays unfrozen all year.',
      steps: [
        'Start with the one question that decides how useful a river is for trade: where does this river TAKE goods, and can boats travel on it when goods need to move?',
        'Ask where each river leads. River A leads north, toward the Arctic Ocean, and few people live along its lower course -- so it carries goods AWAY from the places that want to buy them. River B leads to a warm sea beside a large port, so it carries goods TOWARD buyers and toward ships.',
        'Ask when each river can be used. River A is frozen for a large part of the year, so for months no boat moves on it at all. River B is unfrozen all year, so it is open whenever a load is ready.',
        'Now add the piece that catches people out. A river that flows from a warmer south toward a colder north thaws at the wrong end first: the southern headwaters melt while the northern mouth is still ice. The meltwater arrives at a blocked outlet, backs up behind the ice, and spreads out over the land as flooding. That makes the lower course an unreliable place to build docks, warehouses and towns.',
        'Put the three together. Direction, season and spring flooding all work against River A, and none of them work against River B.',
        'Notice what this explains about the real region. The Ob, the Yenisei and the Lena in Siberia are all enormous rivers that flow north to the Arctic Ocean, and all three run into exactly these three problems. That is why the backbone of east-west movement across the country is the Trans-Siberian Railway and not a river.',
      ],
      answer:
        'River B carries more trade for three geographic reasons. It flows toward people, markets and a port instead of away from them; it stays unfrozen so it is open all year; and it does not suffer the spring flooding that hits a north-flowing river when its southern headwaters thaw while its northern mouth is still frozen. Size alone does not make a river useful -- direction, ice and where it ends do.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-resource-in-a-hard-place',
      kind: 'worked_example',
      problem:
        'A large deposit of minerals is found in a far northern area. The nearest rail line is many hundreds of miles away. The ground is permafrost, and there is no port within reach that stays ice-free. A mining company studies the site and decides not to open a mine there. Explain the decision using geography, not opinion.',
      steps: [
        'Recall the rule from row 5.2: something in the ground becomes a RESOURCE only when people have a use for it AND a way to obtain it. The minerals are clearly useful, so the whole question is the second half -- can they be obtained and moved.',
        'Look at the ground first. Building on permafrost is expensive, because a heated building or a warm pipe thaws the frozen soil under it, and thawed soil shifts. Foundations have to be raised on piles, roads need constant repair, and every structure costs more than the same structure would cost on solid, unfrozen ground.',
        'Look at the distance next. The nearest rail line is hundreds of miles away, so the company would have to build a road or a rail spur across that ground first, before a single load of ore ever moved.',
        'Look at the exit route last. There is no ice-free port within reach, so even ore that reaches the coast could not be shipped out for much of the year.',
        'Add the three costs up against the value of the ore. Reaching it costs a great deal, moving it costs a great deal, and for part of every year it cannot be moved at all. The deposit stays in the ground.',
        'State the general lesson carefully. This is NOT a claim that the region is poor -- northern Eurasia holds very large reserves of oil, natural gas, minerals and timber. It is a claim about reachability. WRONG: "There must not be much there." CORRECT: "There is a great deal there, and the cost of reaching it and moving it is what decides whether it gets used."',
      ],
      answer:
        'The minerals are valuable but hard to reach. Permafrost makes building expensive, the site is hundreds of miles from a rail line, and no ice-free port is within reach, so the cost of getting the ore out is greater than the ore is worth. A deposit becomes a usable resource only when it can be reached and moved, not simply when it exists.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-why-sparsely-settled',
      kind: 'try_yourself',
      problem:
        'Across northern Eurasia, settlement is clustered in the western part of the region, and the far northern and eastern areas are sparsely populated. Which of these is the best geographic explanation for the sparse areas?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Those areas are hot deserts, so they are too dry for people to farm or settle.' },
        { id: 'b', text: 'Those areas are extremely cold, and permafrost makes building roads and foundations difficult and expensive.', correct: true },
        { id: 'c', text: 'Those areas contain no natural resources, so there was never any reason to go there.' },
        { id: 'd', text: 'Those areas are separated from the west by an ocean, so no one can reach them by land.' }
      ],
      expectedAnswer: 'Those areas are extremely cold, and permafrost makes building roads and foundations difficult and expensive.',
      hints: [
        'Row 3.1 said that physical conditions explain where population clusters. Ask which choice names a physical condition of the ground and the climate.',
        'Check each of the other choices against the lesson. The far north is cold rather than hot and dry, it holds very large reserves of oil, natural gas, minerals and timber, and the Ural Mountains are a dividing line inside one landmass, not an ocean between continents.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-river-direction',
      kind: 'try_yourself',
      problem:
        'A very large river in the region flows northward and empties into the Arctic Ocean. Which statement best explains why this limits how useful the river is for trade?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A river that flows north is flowing uphill, so boats cannot travel along it.' },
        { id: 'b', text: 'A river can only be used for trade if it crosses a national border.' },
        { id: 'c', text: 'The river is too wide, and wide rivers cannot carry boats.' },
        { id: 'd', text: 'It carries goods away from where most people and markets are, and it is frozen for a large part of the year.', correct: true }
      ],
      expectedAnswer: 'It carries goods away from where most people and markets are, and it is frozen for a large part of the year.',
      hints: [
        'North on a map is not up a hill. Water flows downhill, and downhill can point in any compass direction.',
        'Ask the two questions from the worked example: where does this river take goods, and can boats use it all year?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-landlocked-constraint',
      kind: 'try_yourself',
      problem:
        'A country in Central Asia is landlocked. It grows cotton and mines metals that buyers in other parts of the world want. What is the geographic constraint that being landlocked places on this country?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its exports have to cross at least one other country to reach a seaport, which adds cost and delay.', correct: true },
        { id: 'b', text: 'It cannot trade with other countries at all.' },
        { id: 'c', text: 'It has no lakes, rivers or water of any kind inside its borders.' },
        { id: 'd', text: 'It shares no land border with any neighboring country.' }
      ],
      expectedAnswer: 'Its exports have to cross at least one other country to reach a seaport, which adds cost and delay.',
      hints: [
        'Landlocked means no coastline on an ocean. It says nothing about water inside the country, and nothing about whether trade is possible.',
        'Row 5.4 is the one to think with. Most goods that travel between distant regions travel by ship for part of the journey, so ask how a load gets from a place with no coast onto a ship.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-size-and-emptiness',
      kind: 'misconception_check',
      question:
        'A student writes: "Russia is the largest country in the world, so its people must be spread out evenly across it, and with all that land and all those resources everything there must be easy to get at." Two ideas in that sentence are wrong. What are they?',
      commonErrors: [
        {
          answer: 'It is the largest country, so the people must be spread out evenly across it.',
          misconception:
            'Treating area as if it decided distribution, and assuming that a big country spreads its population thinly and evenly over all of it.',
          correctsTo:
            'Area and distribution are separate questions, exactly as row 3.1 said. Settlement in this region is clustered in the western part, west of and around the Ural Mountains, while the far north and much of the east are sparsely populated. An average spread across the whole country would describe nowhere real. WRONG: "It is huge, so everyone must be spread out." CORRECT: "It is huge, and most people live in one part of it, because the climate and the ground make some parts far easier to live and build in than others."',
        },
        {
          answer: 'There are huge reserves of oil, gas, minerals and timber, so getting them out must be easy.',
          misconception:
            'Confusing a resource EXISTING with a resource being REACHABLE -- the exact trap from row 5.2.',
          correctsTo:
            'The reserves are genuinely very large, and much of that wealth is also in some of the hardest places on Earth to build in. Permafrost thaws under heated buildings and pipelines and then shifts, so foundations must be driven into the frozen layer and roads need constant repair. Many sites are hundreds of miles from a rail line, and rivers that could have carried the load flow north to the Arctic and freeze for a large part of the year. WRONG: "The resources are there, so they are available." CORRECT: "The resources are there, and reaching them and moving them is expensive, which is what decides whether they are used."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Russia is the largest country in the world by area and stretches across northern Eurasia from eastern Europe to the Pacific, spanning many time zones. Great size is a permanent cost: everything has to travel a long way.',
        'Settlement is clustered in the west, around and west of the Ural Mountains. The far north and much of the east are sparsely populated, and the climate and the ground explain why.',
        'Permafrost is ground frozen all year. Building on it is difficult and expensive, because thawed ground shifts under roads, pipelines and foundations. The taiga is the vast coniferous forest; the tundra is the treeless zone north of it.',
        'The great Siberian rivers flow north to the Arctic Ocean, so they lead away from people and markets, they freeze for much of the year, and their southern headwaters thaw first and cause flooding. The Trans-Siberian Railway is the backbone of east-west movement instead.',
        'The region holds very large reserves of oil, natural gas, minerals and timber, much of it in hard-to-reach places. A resource is only a resource if you can reach it and use it.',
        'Central Asia is a largely dry region of steppe and desert, and most of its countries are landlocked, so exports must cross a neighbor to reach a seaport. The Caspian Sea is the largest inland body of water on Earth.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Russia & Eurasia Today' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
