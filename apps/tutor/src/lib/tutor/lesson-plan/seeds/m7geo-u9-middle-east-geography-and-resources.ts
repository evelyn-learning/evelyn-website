/**
 * Grade 7 World Geography — The Middle East: Geography & Resources.
 *
 * Concept-led regional row (National Geography Standard 16).
 *
 * THIS FILE DELIBERATELY CONFINES ITSELF TO PHYSICAL AND RESOURCE GEOGRAPHY.
 * That is a deliberate scope decision, not an oversight, and it is the reason
 * the file can be trusted on a page a twelve-year-old reads. What is taught
 * here: the regional LABEL and why it is a human construction, aridity and
 * where fresh water is, why settlement concentrates where it does, the
 * shared-river situation as a GENERAL geographic problem, the geology of
 * petroleum and natural gas around the Persian Gulf, the Unit 5 rule that a
 * resource is only a resource when a use and a means exist for it, adaptation
 * to aridity, and the crossroads location.
 *
 * What is NOT here, and must NOT be added by a later author: any current or
 * recent war, conflict, occupation, contested territory, sanction, alliance,
 * government, leader or political movement; any country's politics or foreign
 * relations; who controls any waterway; any group grievance. Religion is
 * OUT OF SCOPE in this row -- Unit 4 (world religions) owns that material and
 * treats it respectfully and from the outside, and this file does no more
 * than point there in a single clause.
 *
 * There are also no figures anywhere in this file -- no reserves, no
 * populations, no rainfall totals, no percentages, no rankings -- because
 * those change and cannot be kept true. Every real-place claim here is a
 * long-settled physical or geological fact.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U9_MIDDLE_EAST_GEOGRAPHY_AND_RESOURCES: LessonPlan = {
  id: 'evelyn.ms.m7geo.middle-east-geography-and-resources.v1',
  title: 'The Middle East: Geography & Resources',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.middle-east-geography-and-resources',
      standard: 'M7GEO-9.3',
      description:
        'Explain why "the Middle East" is a region defined by people rather than a natural object, describe how aridity and the location of fresh water shape where settlement concentrates, and explain why the petroleum and natural gas concentrated around the Persian Gulf became a resource only when a use and a means of obtaining them existed (National Geography Standard 16: the characteristics, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m7geo.africa-history-and-culture'],
  followUps: ['m7geo.africa-middle-east-development'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Take the regional label apart before any content, so the student never treats "the Middle East" as a natural object sitting on the ground.',
      script:
        'You have heard the phrase "the Middle East." Stop and take the two words apart for a second. Middle of what? East of what? Nothing on Earth is east all by itself. East is a direction from somewhere, and that name was invented by people in Europe looking outward from where they were standing. So before we look at a single river or a single rock layer, here is the first thing to know: "the Middle East" is not an object you could trip over. It is a label. The deserts, the rivers and the geology are real, and those are what today is about. The line drawn around them is a human decision, and different sources draw it differently.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-region-water-and-resources',
      kind: 'concept',
      goal: 'Install the label-is-human idea, aridity and the water-decides-settlement pattern, the shared-river situation as a general problem, the geology and use-dependence of petroleum, adaptation to aridity with the rate arithmetic, and the crossroads location.',
      keyIdeas: [
        '"THE MIDDLE EAST" IS A REGION LABEL, NOT A NATURAL OBJECT. Unit 1 defined a region as an area people group together because the grouping is useful for some purpose. This is one of those groupings. Different atlases, agencies and textbooks include different countries in it, and none of them is reading the answer off the land. The name itself comes from a European vantage point: this area is "middle" and "east" only if you are standing in Europe and looking outward. Some geographers prefer the label Southwest Asia and North Africa, which names locations instead of a direction from somewhere else. And whatever edges a source draws, what sits inside them is not one thing. The area holds many countries and many languages, among them Arabic, Persian, Turkish and Hebrew, plus coastlines, high mountains, irrigated farmland and large modern cities. There is no single way of living here, and most people are not desert nomads.',
        'WATER IS THE DEFINING SCARCITY, AND WATER DECIDES WHERE PEOPLE ARE. Most of this region is arid or semi-arid. The Arabian Desert covers much of the Arabian Peninsula, and dry land reaches across a great deal of the rest. Unit 3 taught that physical factors explain where population is dense and where it is thin, and this region is one of the clearest demonstrations of that anywhere on Earth. Settlement concentrates in four kinds of place. Along the Tigris and the Euphrates, two rivers that rise in the mountains of eastern Turkey and flow southeast across Iraq to the Persian Gulf. Along the Nile, which flows north across Egypt to the Mediterranean Sea, with most of the people of Egypt living in the narrow river valley and the delta. Around oases, where groundwater reaches the surface in the middle of dry land. And in and near mountains such as the Zagros in Iran and the Taurus in Turkey, which stand high enough to squeeze more precipitation out of the air than the lowlands below them receive.',
        'A RIVER THAT CROSSES A BORDER HAS TO BE SHARED, AND THAT IS A GENERAL GEOGRAPHIC SITUATION, NOT A STORY ABOUT ANY ONE PLACE. Picture any river anywhere that begins in one country and flows onward into a second. Whatever the upstream country does with the water changes what reaches the downstream country and when it arrives: storing water behind a dam, diverting some of it to fields, or taking more of it in a dry year. Neither country can settle this alone, because water does not stop at a line on a map. Unit 6 gave the reason countries build agreements and joint commissions in the first place: shared rivers, shared seas and shared air are exactly the kind of problem one government cannot fix by itself. Rivers that cross borders are common on every inhabited continent, and this region has several, which is why the situation is worth understanding here.',
        'PETROLEUM AND NATURAL GAS ARE HEAVILY CONCENTRATED AROUND THE PERSIAN GULF, AND THE REASON IS GEOLOGY. Long ago this area lay under warm, shallow seas. Enormous numbers of tiny marine organisms sank into the mud of the sea floor, were buried under layer after layer of sediment, and were cooked slowly by heat and pressure over millions of years into oil and gas. Those liquids and gases then collected in porous rock, trapped underneath a cap of rock they could not seep through. By the Unit 5 sort that makes them nonrenewable: they formed on a timescale of millions of years and are not being remade at any speed that matters to people. Now recall the other Unit 5 rule. Something is a resource only when people have a use for it AND a way to obtain it. Through almost all of human history neither half was true here. Nothing anyone owned ran on petroleum, and nobody could drill deep or refine crude oil into fuel, so people walked, farmed and traded above it while it was worth nothing to them. Engines created the demand, and drilling and refining supplied the means. The rock did not change. The use changed. One more Unit 5 point belongs right here. When a single export supplies a large share of what an economy earns, the price of that one thing sets the weather for everything else, and that price moves for reasons decided outside the country: a high price funds schools, roads and water plants, and a low price cuts the same budget in the same year. That is a vulnerability as well as an advantage. Economies shaped that way exist on several continents, and Unit 5 was explicit that economic structure is measured, never ranked.',
        'PEOPLE ADAPT TO ARIDITY IN THREE MAIN WAYS, AND ONE OF THEM COMES WITH ARITHMETIC. IRRIGATION carries water to fields that rain does not reach. DESALINATION removes the salt from seawater to make it drinkable, which is possible anywhere with a coastline and a great deal of energy, and is used most where fresh water is scarce. GROUNDWATER is pumped up from layers of rock below the surface -- and that is where the arithmetic comes in, because it is the same bucket and slow tap you met in Unit 5. Groundwater is refilled when rain soaks down through soil and rock, so in principle it renews. But in a dry region that tap runs extremely slowly, and in some places the water down there soaked in long ago, when the climate was wetter than it is now. Pump it out faster than the refill rate and the level falls, year after year, no matter how renewable the water technically is. WRONG: it is groundwater, so it will refill. CORRECT: it refills at a rate, and whether it lasts depends on whether people take less than that rate.',
        'THE REGION IS A CROSSROADS, AND NARROW WATER MATTERS OUT OF ALL PROPORTION TO ITS SIZE. Asia, Africa and Europe meet at this region, so routes between three continents have run across it for a very long time, and Unit 5 already made the point that location shapes trade. The geography here is unusually sharp about it. The Suez Canal is a channel people dug to join the Mediterranean Sea to the Red Sea, so that ships can pass between those two seas instead of sailing all the way around Africa. The Strait of Hormuz is a narrow opening connecting the Persian Gulf to the Gulf of Oman and the open ocean. A great deal of the shipping of the world passes through openings that narrow, which is what being a crossroads means in practice. A crossroads carries ideas as well as cargo, and several major world religions began in this region -- Unit 4 is where this course studies world religions, and that is where that subject belongs.',
      ],
      vocabulary: [
        { term: 'arid', definition: 'receiving very little precipitation, so that dryness is the main limit on what can grow.' },
        { term: 'semi-arid', definition: 'dry, but less dry than a desert -- enough precipitation in most years for grasses and grazing.' },
        { term: 'oasis', definition: 'a place in a dry region where groundwater reaches or nearly reaches the surface, so plants and settlement are possible.' },
        { term: 'groundwater', definition: 'water held in spaces inside soil and rock below the surface.' },
        { term: 'desalination', definition: 'removing the salt from seawater to produce fresh water.' },
        { term: 'petroleum', definition: 'oil formed from the remains of marine organisms buried in sea-floor sediment and cooked under heat and pressure over millions of years.' },
        { term: 'strait', definition: 'a narrow passage of water connecting two larger bodies of water.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-where-the-people-are',
      kind: 'worked_example',
      problem:
        'Work out where most people in this imaginary country would live, and say why.\n\n"Karsen is a country in a dry part of the world, and most of it is desert. One large river enters from the mountains in the north and flows south across the whole country to the sea. Along the northern edge, a range of mountains rises high enough to catch rain and snow. Far out in the eastern desert there is a small oasis where groundwater comes near the surface. The southern coast is dry, but a port town sits where the river meets the sea."',
      steps: [
        'Do not start with the towns. Start with the water, because in an arid place water is the factor that limits everything else.',
        'List every source of fresh water the description gives. The river running the length of the country. The northern mountains, which catch rain and snow. The oasis in the east. That is the entire list. The open desert supplies none.',
        'Now put people on top of the water. Expect a strip of settlement following the river from north to south, because a river in a desert is a line of water drawn through a place that has none.',
        'Expect people in and near the northern mountains too, for the Unit 2 reason: air forced upward over high land cools as it rises, and cooler air holds less water vapor, so more precipitation falls there than on the lowland. Wetter land supports farming.',
        'Expect a SMALL settlement at the oasis, not a large one. Groundwater near the surface makes life possible at that one spot, but the amount is limited and the desert around it is not.',
        'The port at the river mouth has two advantages stacked on each other: fresh water arriving down the river, and a connection to shipping. Expect that to be one of the larger places in Karsen.',
        'Now check the trap. The empty desert has enormous amounts of flat, open land. Space is not what people are short of in an arid region. Water is. Available land does not predict settlement here; available water does.',
      ],
      answer:
        'Most people should be strung along the river, in and near the wetter northern mountains, and at the port where the river meets the sea, with a small settlement at the oasis. The desert interior should be nearly empty -- in an arid region it is fresh water, not open land, that limits where people can live.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-when-oil-became-a-resource',
      kind: 'worked_example',
      problem:
        'A student writes: "Oil has always been the most valuable thing under that region." Explain what is wrong with the word "always," and then explain one risk that comes with an economy built mostly on a single export.',
      steps: [
        'Start with the geology, because it sets the timeline. The oil and gas around the Persian Gulf formed from marine organisms buried in ancient sea-floor sediment and cooked under heat and pressure over millions of years. The oil was in the rock long before there were any people anywhere near it.',
        'Now apply the Unit 5 definition of a resource. Something counts as a resource only when people have a use for it AND a way to obtain it. Both halves are required, and the definition fails if either one is missing.',
        'For almost all of human history neither half was true here. Nothing people owned ran on petroleum, and nobody could drill down to it or refine crude oil into fuel. Farmers, herders and traders crossed ground with oil beneath it, and to them it was worth nothing.',
        'What changed was not the rock. Engines created the demand. Drilling and refining supplied the means. The same buried sediment became extremely valuable without changing at all, which is exactly what National Geography Standard 16 means by the changing meaning of resources.',
        'So "always" is precisely the wrong word. The value is recent, and it is a fact about human technology and human demand, not a fact about the geology.',
        'Now the second half of the question. When one export supplies a large share of what an economy earns, the price of that single thing sets the weather for the entire economy. That price moves for reasons decided outside the country: demand elsewhere, new supply somewhere else, a new technology. A high price funds schools, roads and water plants. A low price cuts the same budget in the same year.',
        'That exposure is why places with one dominant export usually work to build other kinds of activity alongside it. And say clearly what this is NOT: it is not a judgment about any country or about anyone who lives there. Unit 5 was explicit that economic structure is measured, never ranked.',
      ],
      answer:
        '"Always" is wrong because petroleum became a resource only once a use for it and a way to obtain it both existed -- before engines, drilling and refining, the same oil sat in the rock unused. The risk of a single dominant export is that its price is set outside the country and swings both ways, so the earnings are a vulnerability alongside the advantage.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-region-is-a-label',
      kind: 'try_yourself',
      problem:
        'Two reference books list different countries as belonging to "the Middle East." Which explanation is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One book must simply be wrong, because there is an official list of which countries count.' },
        { id: 'b', text: 'The Middle East is a region people defined, so different sources draw its edges differently depending on their purpose.', correct: true },
        { id: 'c', text: 'The edges of the region shift over time as its rivers change course.' },
        { id: 'd', text: 'The Middle East is a continent, and continents are difficult to count consistently.' }
      ],
      expectedAnswer: 'The Middle East is a region people defined, so different sources draw its edges differently depending on their purpose.',
      hints: [
        'Go back to the Unit 1 definition. A region is an area people group together because the grouping is useful for a purpose. Is a region something you could dig up?',
        'Two of these treat the label as a natural object with one true answer, and one confuses a region with a continent. Only one answer says who decides the edges.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-water-and-settlement',
      kind: 'try_yourself',
      problem:
        'A country is mostly desert. A large river crosses it from mountains in the north to the sea in the south. Along the western coast, low mountains catch noticeably more rain than the flat interior. Where would you expect most of the people to live?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Spread evenly across the desert interior, because the land there is flat and open.' },
        { id: 'b', text: 'In the driest part of the interior, because a desert offers the most room to build.' },
        { id: 'c', text: 'Wherever the borders of the country run, because borders are what decide settlement.' },
        { id: 'd', text: 'Along the river and near the wetter coastal mountains, because that is where the fresh water is.', correct: true }
      ],
      expectedAnswer: 'Along the river and near the wetter coastal mountains, because that is where the fresh water is.',
      hints: [
        'In an arid region, ask one question first: where is the fresh water? Everything else follows from the answer.',
        'Two of these choices assume open land attracts people. Check whether land is the thing that is scarce here, or whether water is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-groundwater-rate',
      kind: 'try_yourself',
      problem:
        'In a dry region, farms pump water from a layer of rock below the surface. Rain soaks down and refills that layer, but very slowly. Year after year, more water is pumped out than soaks back in. What does that tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The supply will last forever, because rain refills groundwater and that makes it renewable.' },
        { id: 'b', text: 'The water level in the layer will fall over time, because it is being used faster than it is replaced.', correct: true },
        { id: 'c', text: 'Groundwater must be nonrenewable, since a supply that can run short cannot be renewable at all.' },
        { id: 'd', text: 'Because the water is underground, how much is pumped out does not affect how much is down there.' }
      ],
      expectedAnswer: 'The water level in the layer will fall over time, because it is being used faster than it is replaced.',
      hints: [
        'Picture the Unit 5 bucket with a slow tap running into it. What happens if you scoop out more than the tap puts in?',
        'Renewable describes how a resource is replaced, not how much of it there is. Compare the rate going out with the rate coming in.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-desert-and-oil',
      kind: 'misconception_check',
      question:
        'A student writes: "The Middle East is a desert region, so everyone there lives the same way, and it has always been rich because of its oil." Two separate things in that sentence are wrong. What are they?',
      commonErrors: [
        {
          answer: 'The Middle East is a desert region, so everyone there lives the same way.',
          misconception:
            'Taking one dominant climate and stretching it into a description of an entire region and of every person in it. The dryness is real; the leap from dryness to a single way of living is not.',
          correctsTo:
            'WRONG: the region is all desert and holds one way of life. CORRECT: much of the region is arid or semi-arid, and it also contains high mountains that catch snow, long sea coasts, great river valleys and a delta, irrigated farmland, and large modern cities where most people live in apartments and go to ordinary jobs. It contains many countries and many languages, among them Arabic, Persian, Turkish and Hebrew. A description of climate tells you about precipitation. It never tells you what people are like, and it is not evidence about anyone.',
        },
        {
          answer: 'It has always been rich because of its oil.',
          misconception:
            'Treating a substance as valuable by nature rather than valuable because a use and a means of obtaining it exist -- and treating one big export as a guaranteed benefit.',
          correctsTo:
            'WRONG: the oil made the region wealthy all along. CORRECT: the oil formed millions of years ago and sat unused through almost all of human history, because nothing ran on it and nobody could reach it. It became a resource only when engines created the demand and drilling and refining supplied the means. And income from a single export is not a guarantee of anything: the price is set outside the country and swings both ways, so it is a vulnerability as well as an advantage. Note also that the region contains many countries with very different economies, so no single sentence about wealth can cover them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '"The Middle East" is a label people created for a purpose, not a natural object. Different sources draw it differently, and the name means "middle" and "east" only from a European vantage point.',
        'The region contains many countries, many languages and many ways of living. It is not one culture, and most of it is not desert nomads.',
        'Most of the region is arid or semi-arid, and in an arid place fresh water, not open land, is what limits settlement.',
        'People concentrate along the Tigris and Euphrates, along the Nile, around oases, and near mountains that squeeze more precipitation out of the air.',
        'A river that crosses a border has to be shared, because what an upstream country does changes what reaches a downstream one. That is a general geographic situation, found on every inhabited continent.',
        'Oil and gas around the Persian Gulf formed in ancient marine sediments over millions of years, and became a resource only when a use and a means of obtaining them existed.',
        'Groundwater pumped faster than it refills drops year after year. Renewable means replaced at a rate, not unlimited.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'The Middle East: Geography & Resources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
