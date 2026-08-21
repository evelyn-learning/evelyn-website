/**
 * Grade 7 World Geography — Economic Geography: Trade & Global Interdependence.
 *
 * Closes Unit 5 (National Geography Standard 11). Concept-led, following the
 * shape of m7geo-u3-migration-push-and-pull.ts. Teaches WHY places trade (no
 * place has everything, and different places can produce different things more
 * easily), the two directions of trade (imports and exports), interdependence,
 * supply chains, and the fact that location concentrates trade at ports,
 * navigable rivers, straits and mountain passes.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: trade is a live political
 * subject and the audience is twelve. This file carries NO trade figures, NO
 * GDP, NO "largest exporter" claims and NO country rankings. It names no
 * current trade dispute and takes no position on tariffs or trade policy.
 * Country-level examples are generic ("a country with a long coastline and
 * deep harbors") or invented. A country that imports a great deal is never
 * described as weak, poor or behind -- see the misconception check, which
 * exists mainly to shut that idea down.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U5_TRADE_AND_INTERDEPENDENCE: LessonPlan = {
  id: 'evelyn.ms.m7geo.trade-and-interdependence.v1',
  title: 'Trade & Global Interdependence',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.trade-and-interdependence',
      standard: 'M7GEO-5.4',
      description:
        'Explain why places trade with one another, use the terms import and export correctly from either side of an exchange, and trace an everyday object back through the supply chain of places that contributed to it (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.levels-of-development'],
  followUps: ['m7geo.types-of-government'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from an object in the room, so that trade is something the student is already holding rather than a topic.',
      script:
        'Look at whatever is nearest to you right now. A phone, a shoe, a snack wrapper, the pencil in your hand. Almost none of it started here. The banana in a lunchbox grew somewhere hot and wet. The metal in a bike frame came out of the ground somewhere else again. Even the pencil is a piece of wood from one place, a graphite core from another, and a little band of metal from a third. No single place on Earth grows, digs up and builds everything it uses. That is not a problem to be fixed. It is the reason trade exists, and today we follow one ordinary object all the way back.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trade-and-interdependence',
      kind: 'concept',
      goal: 'Install why places trade, the two-way import/export vocabulary, interdependence and supply chains, and the way location concentrates trade.',
      keyIdeas: [
        'PLACES TRADE BECAUSE NO PLACE HAS EVERYTHING. A place has the climate it has, the rocks and soil it has, the amount of flat land it has, the fresh water it has, and the skills and machines its workers have built up. Nowhere has the whole list. Trade is how a place gets the things it cannot produce for itself.',
        'DIFFERENT PLACES CAN PRODUCE DIFFERENT THINGS MORE EASILY. Bananas and cocoa need a hot, wet, tropical climate; wheat grows well in cooler temperate regions with wide flat fields. A place with iron ore in the ground can mine it and a place without any cannot, no matter how hard it tries. So places tend to produce what their climate, land, resources, skills and location suit them for, and trade for the rest.',
        'AN EXPORT LEAVES, AN IMPORT ARRIVES -- AND EVERY TRADE IS BOTH AT ONCE. When a shipment of coffee sails from one country to another, that coffee is an EXPORT for the country it left and an IMPORT for the country it reached. Same coffee, same voyage, two labels, depending on which side you are standing on. This is why trade is never one-directional: goods move one way, and payment, and usually other goods, move back.',
        'INTERDEPENDENCE MEANS PLACES DEPEND ON EACH OTHER, IN BOTH DIRECTIONS. The word has "inter" in front of "dependence" for a reason. A country that sells machinery and buys tea is depending on its tea sellers, and they are depending on it right back. Interdependence is also not new. Long-distance trade routes across Asia carried silk, spices and ideas for centuries, and sailors crossed the Indian Ocean using winds that reverse with the seasons long before anyone had an engine.',
        'A SUPPLY CHAIN IS THE WHOLE ROUTE AN OBJECT TOOK BEFORE IT REACHED YOU. Raw materials are grown or mined in one set of places, turned into parts in another, assembled into a finished product somewhere else, then shipped to a store. A label that reads "Assembled in" names only the last step. Most manufactured things you own were put together out of pieces made in several different countries.',
        'LOCATION CONCENTRATES TRADE. Goods are cheapest to move by water, so trade piles up where water works: natural deep harbors that big ships can enter, rivers boats can travel inland on, and narrow straits that funnel every ship between two seas into one lane. On land, a mountain pass does the same thing, because it is the one gap in a wall. Look back at Unit 2 -- the landforms you learned there are the reason certain cities became trading centers and others did not.',
      ],
      vocabulary: [
        { term: 'trade', definition: 'the exchange of goods and services between people or places.' },
        { term: 'export', definition: 'a good or service sent out of a place to be sold somewhere else.' },
        { term: 'import', definition: 'a good or service brought into a place from somewhere else.' },
        { term: 'interdependence', definition: 'a situation in which places rely on each other, each supplying something the other does not have.' },
        { term: 'supply chain', definition: 'the full sequence of places and steps that a product passes through, from raw material to finished item.' },
        { term: 'raw material', definition: 'a natural material, grown or mined, that has not been turned into anything yet.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-the-object',
      kind: 'worked_example',
      problem:
        'Trace a chocolate bar back through its supply chain. The wrapper says only "Made in Country M." List the kinds of places that had to contribute before the bar could exist, and explain what the label does and does not tell you.',
      steps: [
        'Start with the ingredients, not the factory. Read the list: cocoa, sugar, milk. Then ask the geography question about each one -- where on Earth will this grow?',
        'Cocoa comes from cacao trees, and cacao trees only grow in hot, wet, tropical climates near the equator. So the cocoa did not come from a cool country. It came from somewhere tropical, whether or not the wrapper says so.',
        'Sugar comes either from sugarcane, which is a tropical and subtropical crop, or from sugar beet, which grows in cooler temperate regions. Either way it is a farm somewhere, and possibly a different somewhere from the cocoa.',
        'Milk comes from dairy farms, which need grass, and grass needs steady rainfall and mild temperatures. That points to a temperate region -- again, possibly a third place.',
        'Now add the steps that are not ingredients. Cocoa beans have to be dried and shipped. Somebody made the foil and the paper wrapper. Somebody built and runs the factory in Country M, which melts and mixes and molds. Then trucks or ships carried the finished bars to a store near you.',
        'Finally, read the label honestly. "Made in Country M" describes the last step, where the bar was assembled into a bar. It does not mean Country M grew the cocoa, and if Country M has a cool climate, it certainly did not. WRONG: "This chocolate comes from Country M." CORRECT: "This chocolate was made in Country M out of ingredients from tropical and temperate farms in several other places."',
      ],
      answer:
        'A tropical farming region grew the cocoa. A tropical or temperate farming region grew the sugar. A temperate dairy region supplied the milk. Packaging came from somewhere else again, a factory in Country M combined everything, and transport carried the bars to the store. The label names only the last step in that chain.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-two-way-ledger',
      kind: 'worked_example',
      problem:
        'Two invented countries trade with each other. Country A is warm and wet all year and has a long coastline with deep harbors. Country B is cooler, with wide flat plains and factories that build farm machinery. Country A sends bananas to Country B; Country B sends tractors to Country A. Label each good as an import or an export from each country, then explain one benefit and one risk of the arrangement.',
      steps: [
        'Do not label anything yet. First write down the two shipments: bananas move A to B, tractors move B to A. Notice immediately that goods are moving in BOTH directions. Trade is an exchange, not a one-way delivery.',
        'Now take Country A side. Bananas leave Country A, so bananas are an EXPORT for Country A. Tractors arrive in Country A, so tractors are an IMPORT for Country A.',
        'Now stand in Country B instead. The very same bananas are arriving, so bananas are an IMPORT for Country B. The very same tractors are leaving, so tractors are an EXPORT for Country B. One shipment, two labels -- the label depends on which country you are standing in, never on the good itself.',
        'Why does this exchange happen at all? Bananas need a hot, wet climate, and Country A has one while Country B does not. Building tractors needs factories and skilled workers, which Country B has built up. Each country is producing what it is suited to and trading for the rest. That is interdependence: each one now depends on the other.',
        'The benefit: people in Country B can eat bananas that cannot grow in their climate, and farmers in Country A can use machinery their country does not build. Both places end up with more variety, and usually at a lower price, than either could manage alone.',
        'The risk is the same fact seen from the other end. If a severe storm shuts Country A harbors for two weeks, shelves in Country B go empty even though nothing at all has happened in Country B. Depending on a distant place means distant trouble can be felt at home. Interdependence cuts both ways, and a full answer says so.',
      ],
      answer:
        'For Country A, bananas are an export and tractors are an import. For Country B, bananas are an import and tractors are an export. The benefit is that each country obtains goods its climate or its factories cannot supply, with more variety and usually a lower price. The risk is that a disruption in one country, such as a storm closing its harbors, is felt in the other.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-import-or-export',
      kind: 'try_yourself',
      problem:
        'A country lies near the equator and is warm and rainy all year. It grows far more coffee than the people who live there could ever drink, and it sells the extra abroad. It also buys wheat from cooler countries, because wheat does not grow well in its climate. Which statement uses the words import and export correctly for that country?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Coffee is an export and wheat is an import.', correct: true },
        { id: 'b', text: 'Coffee is an import and wheat is an export.' },
        { id: 'c', text: 'Coffee and wheat are both imports, because both of them cross a border.' },
        { id: 'd', text: 'Neither one counts as trade, because trade means only manufactured goods.' }
      ],
      expectedAnswer: 'Coffee is an export and wheat is an import.',
      hints: [
        'Stand inside the country described and ask, for each good, which way it is moving. Is it leaving, or is it arriving?',
        'An export leaves; an import arrives. Crops are traded exactly like anything else, so both goods here are trade.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-supply-chain-label',
      kind: 'try_yourself',
      problem:
        'The box of a tablet computer says "Assembled in Country R." The glass for its screen was made in Country S, the cells in its battery were made in Country T, and the design work was done in Country U. Which statement best describes where the tablet comes from?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It comes only from Country R, because that is the country printed on the box.' },
        { id: 'b', text: 'It comes from a supply chain: parts made in several countries were brought together and assembled in Country R.', correct: true },
        { id: 'c', text: 'It comes from Country U, because the country that designs a product is the country that makes it.' },
        { id: 'd', text: 'It has no country of origin at all, because the parts crossed borders on the way.' }
      ],
      expectedAnswer: 'It comes from a supply chain: parts made in several countries were brought together and assembled in Country R.',
      hints: [
        'The word "assembled" is doing a lot of work on that box. Assembling means putting existing parts together, so ask where those parts were before.',
        'Count how many countries the question actually names. A single-country answer has to ignore some of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-location-and-trade',
      kind: 'try_yourself',
      problem:
        'Two towns sit on the same large island. Town A stands on a deep, sheltered bay where big ships can dock, and a wide river that boats can travel runs inland from the bay. Town B stands in a high valley reached only by one steep, narrow road. Which town is more likely to grow into a trading center, and for what reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Town B, because goods are worth more in places that are harder to reach.' },
        { id: 'b', text: 'Town A, because towns beside water always sit on more natural resources than towns inland.' },
        { id: 'c', text: 'Town A, because a deep sheltered harbor and a navigable river make it cheap and easy to move goods in and out.', correct: true },
        { id: 'd', text: 'Town B, because a valley is more sheltered from storms than a coast is.' }
      ],
      expectedAnswer: 'Town A, because a deep sheltered harbor and a navigable river make it cheap and easy to move goods in and out.',
      hints: [
        'Trade collects wherever moving heavy goods is easy and cheap, and water is the cheapest way to move heavy goods.',
        'Two of these choices pick Town A. Read their reasons carefully -- only one of the reasons is actually true.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-imports-mean-weak',
      kind: 'misconception_check',
      question:
        'A student sees that a country buys a great deal from other countries and writes: "That country must be weak, because it cannot make its own things." What is wrong with that reasoning?',
      commonErrors: [
        {
          answer: 'A country that imports a lot must be weak, because it cannot make its own things.',
          misconception:
            'Treating imports as a scoreboard, and reading "buys from abroad" as "cannot manage on its own". This turns a description of what a place trades into a judgment about the place and the people in it.',
          correctsTo:
            'Importing is not a weakness and it is not a rank. EVERY country imports, because no country has every climate, every mineral, every kind of land and every industry. A country buys wheat because wheat does not grow in its climate, not because something is wrong with it. Buying is also only half of the picture -- the same country is exporting something in return, or it could not pay for the imports at all. And remember what interdependence means: if Country A depends on Country B, Country B depends on Country A too. Describe what a place trades and why its geography leads to that. Do not use it to rank countries against each other.',
        },
        {
          answer: 'Trade goes one way: strong countries sell things and other countries buy them.',
          misconception:
            'Picturing trade as a delivery rather than an exchange, so goods only ever flow in one direction and one side is always the seller.',
          correctsTo:
            'Trade is an exchange, so every trade has two directions. The very same shipment is an export for the country it leaves and an import for the country it reaches, and goods, services and payment flow back the other way. WRONG: "Country B sells and Country A buys." CORRECT: "Country A exports bananas to Country B and imports tractors from Country B." If your description of a trading relationship only has arrows pointing one way, you have described half of it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Places trade because no place has everything, and different climates, resources, land and skills suit different places to different products.',
        'An export leaves and an import arrives. The same shipment is both, depending on which country you are standing in.',
        'Interdependence means the depending runs in both directions, and long-distance trade is ancient, not new.',
        'A supply chain is every place an object passed through. A label naming one country names only the last step.',
        'Trade concentrates where goods move easily: deep harbors, navigable rivers, straits and mountain passes.',
        'Interdependence brings cheaper and more varied goods, and it also means a disruption far away can be felt at home.',
        'Importing a lot is not a weakness and never a ranking. Every country imports something.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Trade & Global Interdependence' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
