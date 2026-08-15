/**
 * World History — The Contemporary World: Globalization & the World Today.
 *
 * The course capstone. Every earlier unit was a story of connection
 * widening — Neolithic villages, classical empires, Silk Roads, Indian
 * Ocean monsoon routes, the Columbian Exchange, industrial supply lines,
 * world wars, Cold War blocs. Globalization is that same widening, run at
 * jet speed and satellite scale: the machinery (containers, jets, fiber,
 * mobile networks), the institutions (UN, World Bank/IMF, WTO, EU), the
 * national turns (China 1978, India 1991), and an honestly kept scorecard
 * of gains and costs. Salvaged factual spine from the legacy world-history
 * unit-9 globalization seeds, reframed subject-first for a survey course.
 * C3 D2.His.14.9-12, D2.Geo.7.9-12, D2.Eco.15.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U10_GLOBALIZATION: LessonPlan = {
  id: 'evelyn.hs.whist.globalization.v1',
  title: 'Globalization & the World Today',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.globalization',
      standard: 'WHIST-10.4',
      description:
        'Explain how transport, communication, and institutional changes after 1945 accelerated long-standing global connections into a single interdependent economy and culture, and evaluate globalization\'s documented gains and costs across regions (C3 D2.His.14.9-12, D2.Geo.7.9-12, D2.Eco.15.9-12).',
    },
  ],
  prerequisites: ['whist.end-of-cold-war'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame globalization as the acceleration of a connection story the course has traced from Unit 1 — and place the student inside the next chapter of it.',
      script:
        "Look at whatever device you are using right now. The design was probably drawn in one country, the chips etched in another, the battery minerals mined on a third continent, the whole thing assembled in a fourth, and the software written by people in a dozen more. Nobody planned that. It grew. And here is the thing worth noticing on the last day of this course: it is not new. Merchants moved silk, spices, ideas, and diseases along the same kind of chains a thousand years ago. What changed is the SPEED and the SCALE — a metal box on a ship, a jet, a satellite, a phone in a village that never had a telephone pole. Today we finish the story this course has been telling since the first farmers: connection widening. Only this time, you are living inside the chapter.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-globalization',
      kind: 'concept',
      goal: 'The machinery, the institutions, the national turns, the honest scorecard, and the cultural push-and-pull of the connected world.',
      keyIdeas: [
        'CONNECTION IS ANCIENT — SPEED AND SCALE ARE NEW — the Silk Roads (3.4) and the Indian Ocean monsoon routes (5.2) already moved goods, faiths, technologies, and germs across continents by c. 1200 CE. What globalization changed is not THAT the world is connected but how fast, how cheaply, and how completely: a cargo that once took two years now takes three weeks, and a message takes no time at all.',
        'THE HUMBLE BOX — before 1956, cargo was loaded piece by piece by hand, and moving goods could eat a large share of their value. Malcom McLean sent the first container ship, the Ideal-X, from Newark to Houston in April 1956; standardized steel boxes that slide from ship to train to truck without being unpacked collapsed shipping costs. Distance got cheap — the single most underrated cause in modern economic history.',
        'JETS, SATELLITES, FIBER, PHONES — commercial jets (widely adopted from the late 1950s) made a business trip or a migration a day-long affair instead of a voyage. Communications satellites, undersea fiber-optic cable, the internet, and mobile networks did the same for information. Many regions LEAPFROGGED: places that never built out landline networks went straight to mobile phones, and mobile subscriptions passed one per person worldwide by the mid-2010s.',
        'GLOBAL SUPPLY CHAINS — cheap shipping plus cheap communication let a company split production across dozens of countries instead of building everything in one factory town: design here, components there, assembly somewhere else. One smartphone can contain materials and parts from forty-odd countries. The trade-off: enormous efficiency, and a system where a single blocked canal or closed port can stall factories on the other side of the planet.',
        'THE INSTITUTIONS — countries built rules for the new traffic. The United Nations system (1945) for diplomacy, peacekeeping, health, and refugees; the World Bank and International Monetary Fund (created at the 1944 Bretton Woods conference) for lending and currency stability; the General Agreement on Tariffs and Trade (1947), which lowered tariffs round by round and became the permanent World Trade Organization in 1995. Rules made the flows predictable enough to invest in.',
        'THE EUROPEAN UNION — FORMER ENEMIES ON PURPOSE — after two world wars fought largely on their soil (9.1, 9.3), France, West Germany, Italy, and the Benelux countries pooled control of coal and steel in 1951 — the industries of war — precisely so that another war between them would be impractical. That coal-and-steel community grew into a common market, then the European Union, then a shared currency, the euro (notes and coins from 2002). Economic binding as a peace strategy.',
        'TWO NATIONAL TURNS THAT CHANGED THE ARITHMETIC — China under Deng Xiaoping began market reforms and Special Economic Zones in 1978, reorienting toward export manufacturing; India liberalized in 1991, cutting licensing rules and opening to foreign investment. Between them these two turns moved hundreds of millions of people out of extreme poverty — by most measures the fastest mass exit from poverty in recorded history.',
        'THE SCORECARD, HONESTLY KEPT — gains: the share of humanity in extreme poverty fell from roughly two in five people around 1990 to under one in ten by 2019; child deaths under age five roughly halved over the same span; adult literacy kept climbing. Costs: gains were uneven, factory regions in wealthy countries lost work as production moved, financial trouble now travels (the 1997 Asian crisis spread from Thailand across the region; the 2008 crisis spread from the US mortgage market worldwide in months), industrialization\'s emissions came due as global climate change (8.1; the Paris Agreement of 2015 was the broadest attempt to answer it), and pandemics ride the same connections goods do — the 1918 influenza followed troop ships, COVID-19 in 2020 followed flight paths, exactly as plague once followed trade routes (4.4).',
        'CULTURE PULLS BOTH WAYS — global brands, streaming, and English as a working lingua franca spread widely; at the same time cultural flows run in many directions (Indian film, Korean pop music, Nigerian film and music, football as the world\'s game), migration builds large diasporas that keep two homes at once, and language-revival and heritage movements grow in deliberate response. Backlash movements against open trade, migration, or international institutions became significant in many countries across the political spectrum — a documented feature of the era, contested and unresolved.',
      ],
      vocabulary: [
        { term: 'globalization', definition: 'the accelerating integration of economies, communications, and cultures across national borders — an intensification of very old connections, not a brand-new phenomenon.' },
        { term: 'containerization', definition: 'shipping goods in standardized steel boxes that transfer between ship, rail, and truck without unpacking — the change that made long-distance freight cheap.' },
        { term: 'supply chain', definition: 'the sequence of countries and firms that supply materials, components, and assembly for a single finished product.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-container-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a standardized steel box, first shipped in 1956, end up putting parts from forty countries inside one phone?',
      steps: [
        'Start with the old bottleneck. Before containers, dockworkers loaded ships sack by sack and crate by crate. Loading and unloading were slow, damage and theft were routine, and a ship might sit in port longer than it spent at sea. Freight cost was a serious share of a product\'s price.',
        'Apply the fix. A standard box that a crane lifts straight from truck to ship to train, sealed the whole way, cut port time from days to hours. Ports rebuilt around cranes; ships were built bigger because bigger no longer meant slower to load.',
        'Follow the cost. Ocean freight became a small fraction of the value of most manufactured goods. That flips a business calculation: it is now cheaper to make a component wherever it is made best or cheapest and ship it, than to make everything in one place because moving things is expensive.',
        'Add the second ingredient. Cheap shipping alone is not enough — you also have to COORDINATE a factory eight thousand miles away. Satellites, undersea fiber, and eventually the internet made that coordination nearly free and nearly instant.',
        'Close the chain. Cheap distance plus cheap coordination equals a production process that can be cut into pieces and scattered: minerals from one continent, chips from another, screens from a third, assembly in a fourth, software from everywhere. The box did not invent global trade — it made splitting production across the world cheaper than keeping it together.',
      ],
      answer:
        'Containers collapsed the cost of moving goods; satellites and the internet collapsed the cost of coordinating distant work. Together they made it cheaper to split production across many countries than to concentrate it in one — which is exactly what a modern supply chain is.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-sided-account',
      kind: 'worked_example',
      problem:
        'A retired machinist from a shipbuilding town in northern England described his life in 2016 (paraphrased): "The yard closed in the eighties and nothing that size ever replaced it — my mates went to warehouse work or nothing. My grandson\'s clothes and his television cost a fraction of what mine did, and he talks to friends in Manila for free, but he works two jobs and still cannot buy a house." What does this account let a historian say about globalization — and what does it not let them say?',
      steps: [
        'Source it first. One person, one occupation, one deindustrialized town, speaking about roughly forty years of change he lived through. That is a valuable window and a narrow one — a shipyard region is exactly where the costs concentrated.',
        'Read the cost he names. Manufacturing employment left; the replacement work paid less and carried less security. This is the best-documented cost of the era in wealthy countries: production moved toward lower-cost regions, and the regions that lost it often did not recover comparable work.',
        'Read the gains he also names, without noticing them as gains. Clothes and electronics cost a fraction of what they used to, and a free voice call to Manila would have been unthinkably expensive in 1980. Cheaper goods and near-free communication are globalization\'s benefits arriving quietly inside his own complaint.',
        'Notice the third thing in the sentence that is NOT about trade at all. Housing cost is driven heavily by local land, zoning, and interest rates. A careful historian does not let a source\'s grievances all get filed under one cause just because they appear in one sentence.',
        'State the limit. This account cannot tell you what happened in Shenzhen or Chennai over the same forty years — where the same shift showed up as factory jobs arriving and extreme poverty falling sharply. To judge globalization you need this source AND its counterpart; either one alone gives you half a ledger.',
      ],
      answer:
        'It is strong evidence for a real, concentrated cost — lost manufacturing work in an industrial region — and it also quietly records real gains (cheap goods, free long-distance contact). It cannot support a verdict on globalization overall, because it is silent on the regions where the same shift brought work and falling poverty, and it bundles in housing costs that have separate causes.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-containers',
      kind: 'try_yourself',
      problem:
        'Which change did the most to make it economical for a single product to be designed in one country, have components made in several others, and be assembled in yet another?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Standardized container shipping and cheap electronic communication, which together made distance and coordination cheap', correct: true },
        { id: 'b', text: 'The World Trade Organization, which built and operated international factories after 1995' },
        { id: 'c', text: 'The invention of the steam-powered railroad in the early 1800s' },
        { id: 'd', text: 'The rise of global supply chains, which allowed shipping costs to fall' },
      ],
      expectedAnswer: 'Standardized container shipping and cheap electronic communication, which together made distance and coordination cheap',
      hints: [
        'Splitting production only pays if BOTH moving parts and managing distant workers are cheap. Which option supplies both?',
        'Watch for the answer that reverses cause and effect: supply chains are the RESULT of cheap shipping, not the reason shipping got cheap.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-european-union',
      kind: 'try_yourself',
      problem:
        'In 1951 France, West Germany, Italy, Belgium, the Netherlands, and Luxembourg pooled control of their coal and steel industries in a single community. Why did they choose those two industries in particular?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Coal and steel were the raw materials of war-making, so sharing control made another war among them impractical', correct: true },
        { id: 'b', text: 'The United Nations required member states to place heavy industry under international ownership' },
        { id: 'c', text: 'Coal and steel were the only industries that had survived the Second World War undamaged' },
        { id: 'd', text: 'The agreement was a military alliance designed to fight the Soviet Union directly' },
      ],
      expectedAnswer: 'Coal and steel were the raw materials of war-making, so sharing control made another war among them impractical',
      hints: [
        'Ask what you would need to build tanks, ships, and artillery — and what happens if you cannot control that supply alone.',
        'These countries had just fought two wars against each other. The choice of industry was the whole point of the plan.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scorecard',
      kind: 'try_yourself',
      problem:
        'Which statement most accurately summarizes the documented record of global economic integration from about 1990 to 2020?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Extreme poverty and child mortality fell sharply worldwide, while gains were distributed unevenly and some manufacturing regions in wealthy countries declined', correct: true },
        { id: 'b', text: 'Living standards rose at roughly the same rate for every region and every group' },
        { id: 'c', text: 'Only already-wealthy countries gained; poverty rates in Asia were unchanged' },
        { id: 'd', text: 'Poverty fell everywhere and no group in any country was economically worse off' },
      ],
      expectedAnswer: 'Extreme poverty and child mortality fell sharply worldwide, while gains were distributed unevenly and some manufacturing regions in wealthy countries declined',
      hints: [
        'The honest answer usually has two halves. Three of these options report only good news or only bad news.',
        'Hold both facts at once: hundreds of millions left extreme poverty, AND specific regions lost the work that had sustained them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-globalization-is-new',
      kind: 'misconception_check',
      question:
        'A student writes: "Globalization began in the 1990s, when the internet connected the world for the first time." What needs correcting?',
      commonErrors: [
        {
          answer: 'Globalization started in the 1990s with the internet',
          misconception: 'Treating global interconnection as a recent invention rather than an ancient pattern that recently accelerated — and crediting one technology with the whole transformation.',
          correctsTo:
            'Long-distance connection is old news in this course: the Silk Roads and the Indian Ocean monsoon trade moved goods, religions, technologies, and diseases across continents by c. 1200 CE (3.4, 5.2), and the Columbian Exchange after 1492 tied together hemispheres that had been separate for millennia. What is genuinely new since about 1950 is SPEED, SCALE, and REACH: containers made freight cheap, jets made a voyage a day trip, satellites and fiber made communication instant, and integration reached nearly every community rather than a merchant class. The internet is one accelerant in a long chain, not the starting gun.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Globalization is acceleration, not invention: the Silk Roads and Indian Ocean routes already connected continents — containers (1956), jets, satellites, and mobile networks changed the speed, scale, and reach.',
        'Cheap distance plus cheap coordination equals global supply chains: production split across dozens of countries because moving and managing things stopped being expensive.',
        'Rules followed the flows: the UN system, World Bank and IMF (Bretton Woods, 1944), GATT (1947) becoming the WTO (1995), and the European Union, which began in 1951 by binding former enemies through coal and steel.',
        "China's opening after 1978 and India's liberalization in 1991 produced the fastest mass exit from poverty in recorded history.",
        'Keep the ledger honest: extreme poverty and child mortality fell sharply, while gains were uneven, manufacturing regions declined, financial crises spread (1997, 2008), climate change came due (Paris Agreement, 2015), and pandemics traveled the connections too (1918 influenza, COVID-19).',
        'Every unit of this course was a story of connection widening — and the habits you practiced here, tracing causes, weighing sources, comparing places, are the same tools for reading tomorrow\'s news.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Globalization & the World Today' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
