/**
 * World History — Renaissance, Reformation & Exploration: The Age of
 * Exploration.
 *
 * The unit's pivot outward: Europe sails not because it dominates the
 * rich Asian trade but because it is locked OUT of it — with borrowed
 * technology, on somebody else's ocean. Sets up the Columbian Exchange
 * (6.4) and everything that follows from two hemispheres colliding.
 * Factual spine salvaged from the legacy world-maritime seed and
 * rewritten subject-first. C3 D2.His.1.9-12, D2.Geo.2.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U6_AGE_OF_EXPLORATION: LessonPlan = {
  id: 'evelyn.hs.whist.age-of-exploration.v1',
  title: 'The Age of Exploration',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.age-of-exploration',
      standard: 'WHIST-6.3',
      description:
        'Explain why European kingdoms turned to ocean voyages after 1450, how borrowed navigation technology and Portuguese and Spanish expeditions opened sea routes to Asia and the Americas, and how Europeans claimed lands already inhabited and governed by others (C3 D2.His.1.9-12, D2.Geo.2.9-12).',
    },
  ],
  prerequisites: ['whist.protestant-reformation'],
  followUps: ['whist.columbian-exchange'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Flip the story: Europe went to sea because it was shut out of the rich trade, not because it ran it.',
      script:
        'A pound of pepper in Lisbon in 1450 cost many times what it cost in an Indian port — and none of that markup was about pepper. It was about everyone standing between the two places: Ottoman officials collecting tolls, Venetian merchants controlling the last leg into Europe, each taking a cut. Western Europe was the far end of the world\'s richest trade route, last in line and paying the most. So a small kingdom on the Atlantic edge tried something reckless: go around. Sail down an unmapped African coast in small ships, using a compass invented in China and star instruments perfected in the Islamic world, and hope there is a way through. Within seventy years that gamble reshaped every continent on Earth. Today we follow it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-age-of-exploration',
      kind: 'concept',
      goal: 'Motives, borrowed technology, the Portuguese and Spanish voyages, and the claiming of an already-inhabited world.',
      keyIdeas: [
        'LOCKED OUT, NOT ON TOP — the biggest motive was commercial. Asian spices, silk, and porcelain reached Western Europe only after passing through Indian Ocean shipping, Ottoman-controlled overland and Red Sea routes, and finally Venetian middlemen. Every handoff added a toll and a profit. Iberian rulers wanted the goods without the markup — which meant finding a sea route nobody else controlled.',
        'GOD, GOLD, AND GLORY — the other motives stack on top: spreading Christianity (Spain and Portugal had just spent centuries fighting the Reconquista, completed in 1492, and carried that crusading energy outward), the hunt for gold and silver, and personal fame and noble titles for captains who found something. Rulers funded voyages the way governments later funded space programs: prestige plus payoff.',
        'A BORROWED TOOLBOX — almost nothing here was a European invention. The magnetic compass came from China; the astrolabe was a Greek instrument refined and transmitted by Islamic astronomers; the lateen (triangular) sail, which lets a ship sail at an angle INTO the wind instead of only with it, came from Arab and Indian Ocean sailing traditions. Europeans combined these into the caravel — small, fast, able to beat back up the African coast against the wind — and added shipboard cannon. The synthesis was European; the parts were not.',
        'PORTUGAL WENT FIRST — Prince Henry (called "the Navigator") funded a center at Sagres that gathered mapmakers, pilots, and instrument builders and pushed captains a little farther down the West African coast each decade. It took most of a century of incremental coasting: Bartolomeu Dias rounded the southern tip of Africa in 1488, and Vasco da Gama reached Calicut in India in 1498 — the sea route Europe had been hunting for.',
        'AN OPEN OCEAN, THEN A GUNNED ONE — recall the Indian Ocean world from 5.2: Swahili, Arab, Gujarati, Malay, and Chinese merchants had traded across it for centuries on monsoon winds under shared commercial custom, and ships mostly sailed unarmed. Portugal could not out-trade them, so it out-shot them: cannon-armed ships seized chokepoint ports (Goa, Malacca, Hormuz) and forced merchant vessels to buy Portuguese passes. Armed force on a trading sea was the innovation, not the trading.',
        'SPAIN SAILED WEST — Christopher Columbus proposed reaching Asia by crossing the Atlantic. Educated Europeans already knew the Earth was round; the real dispute was its SIZE, and Columbus was badly wrong — he shrank the globe and stretched Asia eastward. He made landfall in the Caribbean in 1492 and died still insisting he had reached the edge of Asia. Then Ferdinand Magellan\'s Spanish-funded fleet left in 1519 and one ship completed the first circumnavigation in 1522 — Magellan himself was killed in the Philippines in 1521, and the survivors came home under Juan Sebastián Elcano.',
        'DIVIDING A WORLD THAT WAS NOT THEIRS — with Spain and Portugal both claiming new coasts, the Treaty of Tordesillas (1494) drew a north-south line down the Atlantic: everything "newly discovered" west of it to Spain, east of it to Portugal (which is why Brazil speaks Portuguese). Note the perspective built into the word "unclaimed" — the Taino, the Inca, the peoples of West Africa and the Indian Ocean coast had governments, laws, and property of their own, and none of them were at the table.',
        'CONQUISTADORS ON THE HORIZON — the voyages became conquest fast. Hernán Cortés and his Indigenous allies brought down the Aztec capital Tenochtitlan in 1521; Francisco Pizarro captured and executed the Inca ruler Atahualpa and took Cusco by 1533. How two small forces toppled empires of millions — disease, alliances, and civil war as much as steel — is the subject of 6.4.',
      ],
      vocabulary: [
        { term: 'caravel', definition: 'a small, fast Iberian ship combining a borrowed lateen sail rig with square sails — maneuverable enough to sail back against the wind on long coastal voyages.' },
        { term: 'astrolabe', definition: 'a star-sighting instrument, Greek in origin and refined by Islamic astronomers, used to estimate a ship\'s latitude from the sun or stars.' },
        { term: 'Treaty of Tordesillas', definition: 'the 1494 agreement in which Spain and Portugal split the "newly discovered" world along an Atlantic line — with no participation from the people who lived there.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-portugal-sailed',
      kind: 'worked_example',
      problem:
        'Portugal in 1420 was small, poor, and stuck on the far western edge of Europe with no share of the Mediterranean trade. Build the causal chain that pushed exactly that kingdom out into the open Atlantic first.',
      steps: [
        'Start at the source: pepper, cinnamon, cloves, and nutmeg grew in South and Southeast Asia, and silk and porcelain came from China. Europe wanted all of it and produced none of it.',
        'Follow the route: goods crossed the Indian Ocean by ship, moved overland or up the Red Sea through Ottoman-controlled territory, and entered Europe through Venetian merchants at ports like Alexandria. Four or five handoffs, each with a toll and a profit margin.',
        'Follow the money: by the time spices reached Lisbon, the price reflected the chain, not the crop. Venice and the Ottomans grew rich on being IN the middle — and had every reason to keep the arrangement exactly as it was.',
        'Ask who had the worst seat: Portugal was last in line, with no fleet in the Mediterranean, no leverage over Venice, and no chance of fighting the Ottomans for the overland roads. Exclusion is the motive — a kingdom that already had a cut would not have gambled.',
        'Now look at the map from Lisbon instead of from Venice: the Atlantic is not an obstacle, it is the one road nobody controls. Chain closed: shut out of the rich trade → incentive to go around → decades of state-funded coasting under Prince Henry → Dias rounds Africa in 1488 → da Gama reaches India in 1498 → the middlemen are cut out.',
      ],
      answer:
        'Portugal sailed first because it was locked OUT: no share of the Ottoman- and Venice-controlled spice chain, so the only way to reach Asian goods was a sea route around Africa — which took a century of incremental voyages to find.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-columbus-confusion',
      kind: 'worked_example',
      problem:
        'A student writes: "Columbus discovered America in 1492 by proving the Earth was round when everyone else believed it was flat." Untangle the three separate errors packed into that one sentence.',
      steps: [
        'Error one — the shape. Educated Europeans had accepted a spherical Earth for roughly eighteen centuries; the Greek scholar Eratosthenes even measured its circumference around 240 BCE, and any sailor could watch a ship\'s hull vanish over the horizon before its mast did. Nobody at the Spanish court doubted the shape.',
        'Error two — the actual argument. The dispute was about SIZE and distance. Columbus cherry-picked the smallest estimates of the Earth\'s circumference and stretched Asia far eastward, making the westward crossing look like roughly 3,000 miles. Royal advisers in Portugal and Spain calculated a far longer distance and turned him down repeatedly — and they were right. On an empty ocean of that width, his crews would have died of thirst.',
        'Error three — "discovered." Two continents already held tens of millions of people with cities, states, farming systems, and long histories; Norse sailors had also reached Newfoundland around 1000 CE. What was genuinely new in 1492 was PERMANENT, sustained contact between hemispheres that had developed apart for thousands of years.',
        'Notice what saved him: an unexpected landmass sitting exactly where he assumed open water lay. He made landfall in the Caribbean, and he went to his grave in 1506 still insisting he had reached the outskirts of Asia.',
        'Rewrite the sentence honestly: "In 1492 Columbus, sailing west for Spain on a serious underestimate of the Earth\'s size, reached islands in the Caribbean — beginning lasting contact between two long-separated halves of the world." That contact, and its enormous costs and consequences, is 6.4.',
      ],
      answer:
        'Three errors: the roundness of the Earth was not in dispute (only its size was, and Columbus had it wrong); he never reached Asia and never admitted it; and "discovered" erases the millions already living there plus earlier Norse landfall — 1492 marks the start of sustained contact, not discovery.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-motives',
      kind: 'try_yourself',
      problem:
        'Why did Portuguese and Spanish rulers pour money into dangerous ocean voyages in the 1400s, when most ships that tried never came back?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Overland routes to Asia ran through Ottoman and Venetian hands, so a sea route promised the same goods without the middlemen\'s markup', correct: true },
        { id: 'b', text: 'European ships were far more advanced than anyone else\'s, so the voyages carried little real risk' },
        { id: 'c', text: 'Europe had run out of farmland and needed somewhere to move its surplus population' },
        { id: 'd', text: 'Asian rulers had closed their ports to all foreign merchants, ending trade completely' },
      ],
      expectedAnswer: 'Overland routes to Asia ran through Ottoman and Venetian hands, so a sea route promised the same goods without the middlemen\'s markup',
      hints: [
        'Follow the price of pepper, not the spirit of adventure — who was collecting a cut on every shipment?',
        'Being last in line on the richest trade route in the world is a powerful reason to look for a different road.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-indian-ocean',
      kind: 'try_yourself',
      problem:
        'For centuries before 1498, Swahili, Arab, Gujarati, and Chinese merchants traded across the Indian Ocean on monsoon winds under shared commercial custom, and their ships generally sailed unarmed. What changed once Portuguese ships arrived?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Portugal used cannon-armed ships to seize key ports and force other merchants to buy passes', correct: true },
        { id: 'b', text: 'Portugal introduced long-distance trade to an ocean that had not seen it before' },
        { id: 'c', text: 'Indian Ocean merchants adopted European ships and abandoned their own routes' },
        { id: 'd', text: 'Portugal negotiated equal trading rights and left the existing system untouched' },
      ],
      expectedAnswer: 'Portugal used cannon-armed ships to seize key ports and force other merchants to buy passes',
      hints: [
        'Portugal had little the Indian Ocean market wanted to buy — so trading its way in was not an option.',
        'The new element was not commerce; it was artillery on a sea where merchant ships did not carry it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tordesillas',
      kind: 'try_yourself',
      problem:
        'In 1494 Spain and Portugal signed the Treaty of Tordesillas, drawing a line down the Atlantic and dividing "newly discovered" lands between the two kingdoms. What is the most important limitation of that agreement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It divided lands that were already inhabited and governed by peoples who were never consulted', correct: true },
        { id: 'b', text: 'It was signed only after Cortés and Pizarro had already conquered the Aztec and Inca empires' },
        { id: 'c', text: 'It awarded England and France the largest shares of the Americas' },
        { id: 'd', text: 'It ended European exploration by settling every remaining claim in advance' },
      ],
      expectedAnswer: 'It divided lands that were already inhabited and governed by peoples who were never consulted',
      hints: [
        'Check the dates first: Tenochtitlan fell in 1521 and Cusco by 1533 — both well after 1494.',
        'Ask who was in the room. "Newly discovered" and "unclaimed" describe the world from one side of it only.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-tech-superiority',
      kind: 'misconception_check',
      question:
        'A student says: "Europeans crossed the oceans because they had invented better ships and instruments than anyone else in the world." What needs correcting?',
      commonErrors: [
        {
          answer: 'Europeans had uniquely advanced, self-invented maritime technology',
          misconception: 'Treating European voyaging as proof of European technological superiority, rather than as a borrowed toolkit put to use by kingdoms with an unusually strong reason to sail.',
          correctsTo:
            'The core technology was borrowed: the compass from China, the astrolabe from Greek origins by way of Islamic astronomers, the lateen sail from Arab and Indian Ocean traditions. Europeans synthesized these into the caravel and added shipboard cannon — a real innovation, but a recombination. What set Iberia apart was MOTIVE and sustained royal funding: being shut out of the Asian trade made a risky ocean route worth a century of investment. Capability alone never explains who sails; incentive does.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The driving motive was exclusion: Ottoman and Venetian middlemen controlled the routes to Asian goods, so Iberian rulers paid to go around them — God and glory rode along with the gold.',
        'The toolkit was borrowed — compass (China), astrolabe (Greek, refined in the Islamic world), lateen sail (Arab and Indian Ocean) — synthesized into the caravel and armed with cannon.',
        'Portugal coasted Africa for a century: Dias rounds the southern tip in 1488, da Gama reaches India in 1498, then cannon-armed ships force their way into an open Indian Ocean trading world (5.2).',
        'Spain sailed west: Columbus in 1492 (the Earth\'s roundness was never in doubt — he simply underestimated its size and hit an unexpected hemisphere) and Magellan\'s fleet circumnavigating the globe, 1519 to 1522.',
        'Tordesillas (1494) split the "unclaimed" world between two kingdoms — a phrase that only makes sense if you ignore everyone already living there. Conquest follows in 6.4.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'The Age of Exploration' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
