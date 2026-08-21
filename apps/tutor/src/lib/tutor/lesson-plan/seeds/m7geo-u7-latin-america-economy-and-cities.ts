/**
 * Grade 7 World Geography — Latin America: Economy & Cities.
 *
 * The THIRD row of the Latin America unit (National Geography Standard 11).
 * Its job is to take the economic tools built in Unit 5 -- primary through
 * quaternary activity, imports and exports, interdependence, and the rule
 * that development is measured and never judged -- and point them at one
 * region. It is an ECONOMIC and URBAN row. The physical geography belongs to
 * 7.1, the history and culture belong to 7.2, and the environmental change
 * belongs to 7.4. This file deliberately teaches none of those.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters. Four rules were the hardest
 * to hold here and all four must stay held:
 *
 *   1. THERE ARE NO NUMBERS IN THIS FILE. No populations, no export shares,
 *      no income figures, no "largest city" claims, no rankings of any kind.
 *      A remembered wrong number about a real city is worse than no number.
 *   2. NO PLACE IS RANKED AGAINST ANOTHER. Concentrated exports are
 *      described as a RISK, which is an economic fact, never as evidence
 *      that a country is behind. The words third world, backward, primitive,
 *      advanced and civilized appear nowhere except in the list of words the
 *      course refuses to use.
 *   3. THE PEOPLE OF THE REGION ARE NEVER CHARACTERIZED. Self-built
 *      neighborhoods are described as what happened to housing supply when
 *      cities grew quickly -- factually, with neither pity nor disparagement,
 *      and with the fact that services have often been extended to them over
 *      time. Nothing in this file says what anybody there is like.
 *   4. THE REGION IS NOT ONE ECONOMY. Mining, large-scale farming, factory
 *      manufacturing and tourism-and-service economies all sit inside it, and
 *      the file says so out loud more than once.
 *
 * The file also names no trade agreement, no current government, and nobody
 * who operates the canal. Those are live political subjects and the audience
 * is twelve.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * places is described in words inside the item that needs it, and every city
 * name is written in plain ASCII.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U7_LATIN_AMERICA_ECONOMY_AND_CITIES: LessonPlan = {
  id: 'evelyn.ms.m7geo.latin-america-economy-and-cities.v1',
  title: 'Latin America: Economy & Cities',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.latin-america-economy-and-cities',
      standard: 'M7GEO-7.3',
      description:
        'Describe the mix of farming, mining, manufacturing and services in the economies of Latin America, explain why earning most of the export income from a small number of products leaves an economy exposed to a fall in world prices, and account for the high level of urbanization in the region using the ideas of the primate city and of urban growth arriving faster than housing (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.latin-america-history-and-culture'],
  followUps: ['m7geo.latin-america-environment-issues'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from food and objects in the kitchen, then land the surprise that most people in the region live in cities.',
      script:
        'Go and look in your kitchen. There is a decent chance you will find a banana, some coffee, a bar of chocolate, or a carton of orange juice. Check the little stickers and the small print on the back. Quite a lot of that food was grown in one region of the world: Latin America, which means Mexico, Central America, South America and the islands of the Caribbean. So here is a question. If a region grows that much of the food, most of the people who live there must be farmers, right? That guess is wrong, and it is wrong by a long way. A large majority of the people in Latin America live in cities. Today we work out how both of those things can be true at the same time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-economy-and-cities',
      kind: 'concept',
      goal: 'Install the two-sided economy, export concentration as a risk rather than a rank, the urbanization surprise, the primate city, informal settlement as a housing-supply story, and the canal as location shaping trade.',
      keyIdeas: [
        'THE REGION SELLS RAW PRODUCTS AND MANUFACTURED GOODS, AND YOU HAVE TO SAY BOTH HALVES. Farms and mines across Latin America send out coffee, soybeans, beef, bananas, copper and oil, among many other things. Those are primary activity, straight out of Unit 5. But factories in the region also build cars, appliances, machinery, electronics and aircraft, and that manufacturing matters especially in Mexico and in Brazil. Calling Latin America a place that only digs things up and grows things is an out-of-date cartoon, and it is the first thing to drop. AND THE REGION IS NOT ONE ECONOMY EITHER. It holds many countries, and they do not earn a living the same way. Chile has large copper mines. Brazil and Argentina grow and ship a great deal of soybeans and beef. Brazil and Colombia grow coffee. Several Caribbean island economies depend heavily on visitors and on the services that visitors need. Mexico and Brazil run large manufacturing industries. One sentence cannot cover all of that, so do not try to write one.',
        'EARNING MOST OF YOUR EXPORT INCOME FROM A FEW PRODUCTS IS RISKY, AND THIS IS THE ANALYTICAL HEART OF THE LESSON. A COMMODITY is a raw product that is bought and sold on a world market at a world price, such as copper, oil, coffee or soybeans. No single country sets that price. So when the world price of a commodity drops, a country that earns most of its export money from that one commodity loses income all at once -- and because export earnings pay for imported goods, for government services and for the jobs connected to that industry, the fall reaches far past the mine or the farm itself. Spreading the earnings across more products and more industries is called DIVERSIFICATION, and it is the standard answer to this risk. Now the part that is not optional: this RISK IS NOT A RANK. It is a statement about how income is spread, exactly like the indicators in Unit 5, and it is not a score for a country or for anybody who lives there. Higher-income and lower-income describe economies. The words third world, backward, primitive, advanced and civilized describe people instead, and this course does not use them.',
        'LATIN AMERICA IS HIGHLY URBANIZED, WHICH SURPRISES ALMOST EVERYONE. Remember from Unit 3 that urbanization is a SHARE. In this region that share is high: a large majority of the people live in cities and towns rather than in the countryside. The region contains a number of very large metropolitan areas, among them Mexico City, Sao Paulo, Buenos Aires, Lima and Bogota. We are not putting those in order and we are not attaching numbers to them. The point is simply that great big cities are an ordinary feature of this region, not an exception in it.',
        'A PRIMATE CITY IS ONE CITY THAT IS FAR LARGER THAN ANY OTHER IN ITS COUNTRY AND THAT CONCENTRATES ALMOST EVERYTHING. Government offices, company headquarters, the main airport, the university everyone has heard of, and the roads and rail lines that all bend toward the same place. Several countries in this region have that pattern, and it is common elsewhere in the world too. Two warnings. A primate city is not the same thing as a capital city: those often overlap, but the capital of Brazil is Brasilia, while Sao Paulo is a separate and very large city, and Brazil contains several very large cities rather than a single one that dwarfs the rest. And primate is a description of size and concentration, not a compliment.',
        'WHEN CITIES GREW FASTER THAN HOUSING WAS BUILT, PEOPLE BUILT HOUSING THEMSELVES. Rural-to-urban migration and city-born children pushed many cities in the region to grow very quickly, and construction of homes, water pipes, sewers and paved roads did not keep pace. So new neighborhoods went up on the edges of cities and on steep hillsides, built by the residents themselves, often before any piped water or paved street reached them. Geographers call these INFORMAL SETTLEMENTS, meaning they were built outside the official planning and permit process. State the facts plainly: residents built these homes and improved them over years, many of these neighborhoods are well organized, they run their own associations and businesses, and in a great many cases water, electricity, transport and legal ownership have been extended to them since. This is a story about how fast housing can be built. It is not a story about what anybody is like.',
        'LOCATION STILL SHAPES TRADE HERE, EXACTLY AS UNIT 5 SAID IT WOULD. A canal cut across the narrow waist of Central America, in Panama, joins the Atlantic Ocean side to the Pacific Ocean side. Before it existed, a ship going between the two oceans had to sail all the way around the southern end of South America. The canal removes that entire journey, which is why so much shipping is funneled through one narrow lane of water. That is the same idea as the straits and passes in Unit 5, drawn at regional size: geography decides where trade piles up.',
      ],
      vocabulary: [
        {
          term: 'commodity',
          definition:
            'a raw product such as copper, oil, coffee or soybeans that is bought and sold on a world market at a world price.',
        },
        {
          term: 'export concentration',
          definition:
            'a situation in which most of the export income of a country comes from only one or a few products.',
        },
        {
          term: 'diversification',
          definition:
            'spreading the earnings of an economy across more products and industries so that no single price controls the result.',
        },
        {
          term: 'primate city',
          definition:
            'a city that is far larger than any other city in its country and concentrates government, business and transport.',
        },
        {
          term: 'informal settlement',
          definition:
            'a neighborhood built by its own residents outside the official planning and permit process, common where cities grew faster than housing was built.',
        },
        {
          term: 'canal',
          definition: 'a waterway dug across land so that ships can pass between two bodies of water.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-export-concentration',
      kind: 'worked_example',
      problem:
        'Two invented countries sit in the same region and both export a great deal. Work out which one is more exposed when a world price falls, and be careful to say what that does and does not mean.\n\n"Country Aldera earns nearly all of its export income from one mineral, which it digs up and ships out. Country Ravela earns its export income from four different things: a mineral, two farm crops, and finished goods from its factories. This year the world price of that one mineral drops sharply. It is the same mineral in both countries."',
      steps: [
        'Start with what a world price is. Neither country sets it. A commodity price is set on a world market, so both countries wake up to the same lower price and neither one chose it.',
        'Look at Aldera. Nearly all of its export income came from that mineral. When the price falls, nearly all of its export income falls with it. There is nothing else earning to cushion it.',
        'Now follow the fall past the mine, because this is the part students skip. Export earnings are what a country uses to pay for imported goods, and taxes on that industry help pay for government services, and the trucking companies, ports and repair shops that serve the mine all depend on it running at full speed. So a price set somewhere else reaches schools, hospitals and shops that never touched the mineral. That is why concentration is a whole-economy problem, not a mining problem.',
        'Now look at Ravela. The same mineral price fell for Ravela too, so it loses income as well. But three other earners are still working, and their prices did not move. The hit is real and it is smaller, and the rest of the economy keeps running.',
        'Name the difference correctly. This is EXPORT CONCENTRATION in Aldera versus DIVERSIFICATION in Ravela. It is a description of how income is SPREAD, and nothing else.',
        'Now the sentence that must not be skipped. WRONG: "Ravela is more advanced than Aldera." CORRECT: "Ravela is less exposed to a fall in the price of that one mineral than Aldera is." One of those describes an economy. The other one ranks countries, and this course does not rank countries. Notice also that Aldera did nothing foolish -- a country mines what is in the ground under it.',
      ],
      answer:
        'Aldera is more exposed, because nearly all of its export income depends on the single price that fell, and export earnings pay for imports, government services and the jobs connected to that industry. Ravela loses income too, but three other earners are unaffected. The correct way to state the difference is export concentration versus diversification, which describes how income is spread and does not rank either country against the other.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-read-a-city-pattern',
      kind: 'worked_example',
      problem:
        'Read this description of an invented country and answer two questions: is the city described a primate city, and what does the description tell you about how fast it grew?\n\n"In the country of Verano, one city holds the national government, the main international airport, the seaport that handles most cargo, and the head offices of nearly every large company. Far more people live there than in any other Verano city, and the next city down is a small fraction of its size. Over the past several decades many families moved in from rural districts. Neighborhoods spread up the slopes above the city, built by the families who live in them, and for years many of those streets had no piped water and no pavement. Water lines and bus routes have since reached most of them."',
      steps: [
        'Take the first question apart. A primate city needs two things: it is far larger than any other city in the country, AND it concentrates the important functions.',
        'Check the size test. The description says far more people live there than in any other city in Verano and that the next city down is a small fraction of its size. Size test passed.',
        'Check the concentration test. Government, the main international airport, the main cargo seaport, and the head offices of nearly every large company are all in the same city. Concentration test passed. So yes, this is a primate city.',
        'Careful with what that does NOT mean. It does not mean Verano has only one city, and it does not mean the city is well run or badly run. Primate describes size and concentration. It is not praise and it is not criticism.',
        'Now the second question. Read the growth sentences: many families moved in from rural districts over several decades, and neighborhoods went up on the slopes, built by the residents, without piped water or paved streets at first.',
        'Say what that shows in the right order. People arrived faster than homes, pipes and roads were built, so residents built homes themselves on land at the edges and on the hillsides. Those are INFORMAL SETTLEMENTS, meaning built outside the official planning process. The last sentence matters as much as the rest: water lines and bus routes have since reached most of them, which is a very common pattern.',
        'WRONG way to describe this: anything about what the residents are like. CORRECT way: a statement about how fast housing supply moved compared with how fast the city grew.',
      ],
      answer:
        'Yes, it is a primate city: it is far larger than any other city in Verano and it concentrates the government, the main airport, the main cargo port and most company head offices. The hillside neighborhoods show that people arrived faster than housing, water pipes and paved roads were built, so residents built homes themselves outside the official planning process, and services have since been extended to most of those neighborhoods.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-commodity-risk',
      kind: 'try_yourself',
      problem:
        'The invented country of Marisol earns most of its export income from a single mineral. The world price of that mineral falls sharply. Why does this affect the whole country and not only the people who work at the mines?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because that mineral is an ingredient in every product made inside Marisol' },
        { id: 'b', text: 'Because a country that exports a mineral is not allowed to have factories as well' },
        {
          id: 'c',
          text: 'Because export earnings pay for imported goods, government services and many jobs connected to that industry, so a fall in one price reaches far past the mines',
          correct: true,
        },
        { id: 'd', text: 'Because mining is a tertiary activity, and tertiary activity is the service part of an economy' }
      ],
      expectedAnswer:
        'Because export earnings pay for imported goods, government services and many jobs connected to that industry, so a fall in one price reaches far past the mines',
      hints: [
        'Ask what a country actually does with the money its exports earn. Follow that money out of the mine and see where it ends up.',
        'One choice mixes up the levels of economic activity from Unit 5. Digging something out of the ground is primary activity, not tertiary.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-primate-city',
      kind: 'try_yourself',
      problem:
        'In the invented country of Costera, one city has far more people than any other city in the country. The national government sits there, nearly every large company has its head office there, the busiest airport is there, and every main rail line ends there. Which term best describes that city?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A primate city, because it is far larger than any other city and concentrates the main functions', correct: true },
        { id: 'b', text: 'A break-of-bulk point, because goods must change transport where the rail lines end' },
        { id: 'c', text: 'A clustered settlement, because its buildings are grouped around a central point' },
        { id: 'd', text: 'A capital city, and that is all the description tells you, since the term only means the seat of government' }
      ],
      expectedAnswer:
        'A primate city, because it is far larger than any other city and concentrates the main functions',
      hints: [
        'Two facts are doing the work here: how the size of this city compares with every other city, and how many important functions sit inside it. Find the term that requires both.',
        'Being the capital is only one of the four facts listed, and break-of-bulk and clustered describe something much smaller than a whole country pattern.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-informal-settlement',
      kind: 'try_yourself',
      problem:
        'A city grew very quickly over several decades. New neighborhoods appeared on the edges of the city and on steep hillsides, built by the residents themselves, and at first they had no piped water and no paved streets. What does a geographer say this pattern shows?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That the city government planned and built those neighborhoods before anybody arrived' },
        { id: 'b', text: 'That the city grew faster than housing, water pipes and paved roads could be built', correct: true },
        { id: 'c', text: 'That the city was losing population, which left the hillsides as the only occupied land' },
        { id: 'd', text: 'That the hillsides were the flattest and easiest land in the area to build on' }
      ],
      expectedAnswer: 'That the city grew faster than housing, water pipes and paved roads could be built',
      hints: [
        'The question is about the speed of two things: how fast people arrived, and how fast homes and services were built. Compare them.',
        'Check each wrong option against the words in the item. Built by the residents themselves is the opposite of planned and built by a government, a growing city is not a shrinking one, and a steep hillside is not flat land.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-caricature-and-capital',
      kind: 'misconception_check',
      question:
        'A student writes: "Latin America is a poor region that just sells raw materials to richer countries, and its biggest cities are all national capitals." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'Latin America is a poor region that just sells raw materials to richer countries.',
          misconception:
            'Collapsing a whole region into one economy, keeping only the commodity half of it, and then turning that half into a rank. Three errors are stacked inside one sentence, which is why this idea is so sticky.',
          correctsTo:
            'Take the three apart. FIRST, the region is not one economy: it holds many countries, and mining, large-scale farming, factory manufacturing and tourism-and-service economies all sit inside it. Chile has large copper mines, Brazil and Argentina ship soybeans and beef, several Caribbean island economies depend heavily on visitors and services, and Mexico and Brazil run large manufacturing industries that build cars, machinery, electronics and aircraft. SECOND, the commodity half is only half. Saying the region only sells raw materials leaves out the factories entirely. THIRD, and this is the important one, poor and rich are not the categories here. WRONG: "That region is behind." CORRECT: "Some economies there earn most of their export income from a small number of commodities, which leaves them exposed when a world price falls." The second sentence describes how income is spread. The first one ranks places, and this course measures economies and never scores them.',
        },
        {
          answer: 'The biggest cities are all national capitals.',
          misconception:
            'Assuming that a primate city and a capital city are the same thing, because in many countries the two do happen to be the same place.',
          correctsTo:
            'Capital means the seat of government and nothing more. Primate city means far larger than any other city in the country and concentrating business, transport and services. Those two often land on the same city, but they do not have to. Brasilia is the capital of Brazil, and Sao Paulo is a separate and very large city. It also runs the other way: Brazil contains several very large cities rather than a single one that dwarfs all the rest, so not every country has a primate city at all. Check the two tests separately every time, and do not put cities in order of size, because that is a number nobody in this course is asking you for.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The region exports farm and mineral commodities AND manufactures goods. Say both halves, and remember it is many different economies, not one.',
        'A commodity has a world price that no single country sets.',
        'Export concentration means most export income comes from a few products, so a fall in one world price hits the whole economy. Diversification is the answer to it.',
        'Concentration is a risk, not a rank. Describe how income is spread; never score a country or its people.',
        'Latin America is highly urbanized: a large majority of its people live in cities and towns.',
        'A primate city is far larger than any other city in its country and concentrates government, business and transport. It is not the same thing as a capital city.',
        'Where cities grew faster than housing, residents built neighborhoods themselves on edges and hillsides, and services have often been extended to them since.',
        'The canal across Panama joins the Atlantic and Pacific sides and saves ships the voyage around the southern end of South America. Location still decides where trade piles up.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Latin America: Economy & Cities' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
