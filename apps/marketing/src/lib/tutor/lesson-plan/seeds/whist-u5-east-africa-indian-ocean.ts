/**
 * World History — Networks of Exchange: East Africa & the Indian Ocean World.
 *
 * The medieval world's busiest highway was water. Monsoon winds ran on a
 * schedule, Swahili coast city-states turned interior gold and ivory into
 * coral-stone wealth, and merchants from four continents met in the same
 * harbors — an open system the Portuguese would later try to lock (6.3).
 * Factual spine salvaged from the legacy Indian Ocean trade seed and
 * rewritten subject-first. C3 D2.His.14.9-12, D2.Geo.7.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U5_EAST_AFRICA_INDIAN_OCEAN: LessonPlan = {
  id: 'evelyn.hs.whist.east-africa-indian-ocean.v1',
  title: 'East Africa & the Indian Ocean World',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.east-africa-indian-ocean',
      standard: 'WHIST-5.2',
      description:
        'Explain how monsoon winds, seagoing trade, and interior gold linked East Africa to Arabia, India, and China, and evaluate how that maritime network shaped Swahili coast city-states before European arrival (C3 D2.His.14.9-12, D2.Geo.7.9-12).',
    },
  ],
  prerequisites: ['whist.west-african-empires'],
  followUps: ['whist.maya-aztec'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Flip the mental map: the ocean was not a barrier around Africa — it was the highway through the middle of the medieval world.',
      script:
        'Archaeologists digging at Great Zimbabwe, a stone city hundreds of miles inland in southern Africa, kept finding things that should not have been there: Chinese porcelain, Persian glass, glass beads from India. No European ship had reached that coast yet. So how did a Chinese bowl end up in the African interior around 1300? The answer is the Indian Ocean — the busiest, richest, best-organized trading network on Earth for centuries before Europe showed up, moving on winds so predictable you could plan a round trip around them. Today you learn how that ocean worked, who got rich off it, and why the map in your head that shows oceans separating continents is backwards.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-indian-ocean-world',
      kind: 'concept',
      goal: 'The wind engine, the Swahili coast city-states, the interior gold chain, the cosmopolitan ports, and the system Europeans walked into.',
      keyIdeas: [
        'THE OCEAN WAS THE HIGHWAY — between roughly 800 and 1500 CE, the Indian Ocean linked East Africa, Arabia, Persia, India, Southeast Asia, and China into one working commercial world. It moved far more cargo, far more cheaply, than the overland caravan routes: a single ship carried what hundreds of camels could not, and water needs no fodder, no passes, no tolls at every border.',
        'MONSOON WINDS RAN ON A SCHEDULE — this ocean has a wind system that reverses twice a year: out of the northeast in winter, out of the southwest in summer. That is the whole engine. A merchant sailed out on one monsoon, spent months in a foreign port doing business, and rode the reversed monsoon home. Predictability, not daring, is what made ocean trade a routine business instead of a gamble.',
        'THE DHOW AND THE LATEEN SAIL — the western ocean ran on the dhow: a wooden ship whose triangular lateen sail let it work across and even against the wind rather than only running before it. On the eastern end, big multi-masted Chinese junks did comparable work. Neither needed an engine; both needed a sailor who knew the calendar.',
        'THE SWAHILI COAST WAS A CHAIN OF CITY-STATES — Kilwa, Mombasa, Zanzibar, Malindi, Mogadishu, Sofala: dozens of independent port towns strung down the East African coast, each governed by its own ruling family, competing and trading with one another. They were never one empire. Their wealth shows in coral-stone mosques and palaces — the Great Mosque of Kilwa, built and rebuilt in coral rag stone, and Kilwa\'s own minted copper coins.',
        'SWAHILI IS AN AFRICAN LANGUAGE — Kiswahili is a BANTU language, African in grammar and structure, that absorbed a large layer of Arabic loanwords through centuries of trade contact (the name itself comes from an Arabic word for "coast"). The classic student error is to call the Swahili coast an Arab colony. It was African societies that adopted Islam, married into merchant families, and built a blended coastal culture on their own terms.',
        'GOLD CAME UP FROM THE INTERIOR — the coast sold what Africa produced: gold, ivory, iron, timber, and enslaved people. Much of the gold came from the plateau between the Zambezi and Limpopo rivers, controlled by GREAT ZIMBABWE (c. 1100-1450), a stone-built capital of mortarless granite walls up to five meters thick. Its rulers taxed gold and cattle; the gold traveled to the port of Sofala, and Kilwa grew rich by dominating the Sofala trade.',
        'THE PORTS WERE COSMOPOLITAN AND ISLAM TRAVELED WITH THE MERCHANTS — Arab, Persian, Indian (especially Gujarati), and Malay traders settled semi-permanently in these harbors, married locally, and did business across a shared Muslim commercial and legal world. Islam spread along the East African coast mainly by merchants, marriage, and prestige — not by armies. Cargo moved both ways: spices, Indian cotton cloth, Chinese porcelain, and glass in; African gold and ivory out.',
        'CHINA CAME, THEN LEFT — the Ming admiral Zheng He led seven enormous treasure-fleet voyages between 1405 and 1433, reaching Malindi and Mogadishu on the Swahili coast and carrying home tribute, envoys, and a giraffe. Then the Ming court, facing costs and northern frontier threats, halted the voyages and dismantled the fleets. China withdrew by choice — decades before any European ship rounded Africa.',
      ],
      vocabulary: [
        { term: 'monsoon', definition: 'a seasonal wind system that reverses direction roughly twice a year, letting Indian Ocean sailors plan predictable round-trip voyages.' },
        { term: 'dhow', definition: 'a wooden sailing ship of the western Indian Ocean, rigged with a triangular lateen sail that works across and against the wind.' },
        { term: 'city-state', definition: 'an independent state consisting of a city and the land it controls — the political form of the whole Swahili coast, which never unified into one kingdom.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-gold-chain',
      kind: 'worked_example',
      problem:
        'A Chinese porcelain bowl has been excavated at Great Zimbabwe, a stone city far inland with no port and no ships. Build the chain that could put it there around 1300 CE — and the chain that carried African gold the other way.',
      steps: [
        'Start at the source of value: Great Zimbabwe (c. 1100-1450) controlled the goldfields of the plateau between the Zambezi and Limpopo rivers. Its rulers controlled gold mining and cattle wealth and built the mortarless granite walls that still stand.',
        'Move the gold to salt water: porters and traders carried gold and ivory down river valleys and trails to the coastal port of Sofala, several hundred miles away. No single merchant made the whole journey — this is a relay, with goods changing hands and gaining price at each transfer.',
        'Hand it to the coastal middlemen: Kilwa, the strongest Swahili city-state of the 1300s, dominated the Sofala gold trade and taxed it. That tax revenue is what paid for coral-stone mosques, palaces, and Kilwa\'s own minted coins.',
        'Load it onto the wind: dhows carried the gold north on the monsoon to Arabian and Persian Gulf ports such as Aden and Hormuz, where it entered the wider Muslim commercial world — and where Indian and Southeast Asian goods were waiting.',
        'Now run the chain backwards for the bowl: Chinese porcelain moved west through Southeast Asian and Indian ports, was traded again in Arabia, sailed south to the Swahili coast, and went inland by the same relay that had carried the gold out. The bowl is not evidence that Chinese merchants visited Great Zimbabwe — it is evidence of a working, multi-stage network.',
        'State the takeaway: an inland African kingdom with no coastline was still economically plugged into China, because the ocean and the relay chain did the connecting.',
      ],
      answer:
        'Great Zimbabwe\'s gold moved by relay to Sofala, was taxed and shipped by Kilwa, and rode the monsoon north; Asian goods came back the same way. Long-distance goods travel through many hands, not one traveler.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-traveler-account',
      kind: 'worked_example',
      problem:
        'A North African scholar who visited the Swahili coast around 1331 later described it this way (paraphrased): "Kilwa is among the finest and most solidly built towns I have seen; its people are dark-skinned Muslims, devout and generous, and its wealth comes chiefly from the gold carried up from Sofala in the land of the Zanj to the south." What does this account tell us about the Indian Ocean world — and what should a careful reader be cautious about?',
      steps: [
        'Name what the source is: a Muslim traveler and legal scholar from Morocco, writing from memory after the fact. That means he is an outsider describing a place he passed through, not a resident keeping records.',
        'Take the physical claim seriously: "finest and most solidly built" is eyewitness testimony to real wealth. It matches the archaeology — coral-stone mosques and palaces at Kilwa, and locally minted coinage.',
        'Read the identity line carefully: he describes the townspeople as African AND Muslim in the same breath. That is the direct answer to the students who assume the Swahili coast was an Arab settlement. These are African communities that had adopted Islam and Arabic vocabulary through trade, not a transplanted foreign population.',
        'Trace the economics he names: the wealth "comes chiefly from the gold carried up from Sofala." One sentence confirms the whole relay chain — interior goldfields, a southern port, and a northern city-state that profits by controlling the flow.',
        'Now weigh the limits: he stayed with the Muslim coastal elite, so he tells us about rulers and merchants, not about the miners, porters, and farmers who produced the goods. He also uses the outsider term "Zanj" for interior peoples, which carries his own hierarchy. Wealth described from the top of a society usually looks tidier than it was.',
        'Close with what a historian can and cannot claim from it: strong evidence for coastal prosperity, Islamic coastal culture, and the Sofala gold link; weak evidence for how ordinary people in the interior lived.',
      ],
      answer:
        'It confirms Kilwa\'s wealth, its African Muslim coastal culture, and its dependence on interior gold routed through Sofala — but it is an elite, outsider, coastal view that says almost nothing about the interior producers who made that wealth possible.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-monsoon',
      kind: 'try_yourself',
      problem:
        'Merchants sailing between East Africa and India before 1450 regularly planned round-trip voyages months in advance. What made that planning possible?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Monsoon winds blew one direction for part of the year and reversed for the rest, so a return trip could be scheduled', correct: true },
        { id: 'b', text: 'Steam engines let ships sail on a fixed timetable regardless of wind' },
        { id: 'c', text: 'The Indian Ocean is calm and nearly windless, so voyages took the same time every trip' },
        { id: 'd', text: 'European navigators had charted the ocean and published sailing schedules' },
      ],
      expectedAnswer: 'Monsoon winds blew one direction for part of the year and reversed for the rest, so a return trip could be scheduled',
      hints: [
        'The advantage was not speed or safety — it was PREDICTABILITY. What about this ocean repeats on a calendar?',
        'Sail out on one season\'s wind, do business while you wait, ride the reversed wind home.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-swahili-culture',
      kind: 'try_yourself',
      problem:
        'Kiswahili is a Bantu language with a large number of Arabic loanwords, and Swahili coast cities built mosques from local coral stone. What does this pattern best show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'African communities adopted Islam and Arabic vocabulary through centuries of trade contact while remaining African societies', correct: true },
        { id: 'b', text: 'Arab settlers replaced the local population and founded the coastal cities themselves' },
        { id: 'c', text: 'Arab armies conquered the East African coast and imposed Islam by force' },
        { id: 'd', text: 'Portuguese missionaries introduced both the language and the architecture after 1500' },
      ],
      expectedAnswer: 'African communities adopted Islam and Arabic vocabulary through centuries of trade contact while remaining African societies',
      hints: [
        'Look at what the language IS underneath the borrowed words — Bantu grammar is African grammar.',
        'Loanwords and local building stone point to exchange and adoption over time, not conquest or replacement.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-zheng-he',
      kind: 'try_yourself',
      problem:
        'Zheng He\'s treasure fleets reached the East African coast between 1405 and 1433, then China ended the voyages and dismantled the fleets. What best explains the end of the voyages?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Ming court decided the enormous cost was not worth it and shifted resources toward inland frontier defense', correct: true },
        { id: 'b', text: 'Portuguese warships defeated the Chinese fleets in the Indian Ocean' },
        { id: 'c', text: 'The fleets were lost at sea because Chinese sailors could not handle the monsoon winds' },
        { id: 'd', text: 'African city-states closed their harbors and refused to trade with China' },
      ],
      expectedAnswer: 'The Ming court decided the enormous cost was not worth it and shifted resources toward inland frontier defense',
      hints: [
        'Check the dates before blaming Europeans — the voyages ended in 1433, and Vasco da Gama did not reach the ocean until 1498.',
        'This was a policy decision made in the Chinese court, not a defeat.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-portuguese-opened-trade',
      kind: 'misconception_check',
      question:
        'A student writes: "Vasco da Gama opened up trade in the Indian Ocean when he arrived in 1498, connecting Africa and Asia for the first time." What needs correcting?',
      commonErrors: [
        {
          answer: 'The Portuguese opened Indian Ocean trade and first connected Africa to Asia',
          misconception: 'Treating the moment Europeans arrive as the moment history starts — assuming a network only counts as connected once Europe joins it.',
          correctsTo:
            'The network was already centuries old and thoroughly connected: monsoon shipping, Swahili city-states, Gujarati and Persian merchant communities, and Chinese fleets that had come and gone before 1433. Vasco da Gama did not find his own way across — he hired a local pilot on the East African coast at Malindi to guide him to India in 1498. What was genuinely new was the METHOD: the Portuguese arrived with cannon and tried to control an open system by force, bombarding Kilwa and Mombasa in 1505, planting forts, and requiring ships to buy passes. The change was from an open trading world to one somebody tried to police.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Monsoon winds reverse seasonally — that predictability, plus the lateen-sailed dhow, made ocean trade routine business rather than a gamble.',
        'The Swahili coast was a chain of independent, competing city-states (Kilwa, Mombasa, Zanzibar, Sofala), not an empire — wealthy enough for coral-stone mosques and minted coins.',
        'Swahili culture is African: a Bantu language with Arabic loanwords, and African communities that adopted Islam through trade, marriage, and prestige rather than conquest.',
        'Interior gold and ivory from Great Zimbabwe (c. 1100-1450) reached the world by relay through Sofala and Kilwa; Asian porcelain and cloth came back the same way.',
        'Zheng He reached the coast in 1405-1433 and China then withdrew by choice; the Portuguese arrived in 1498 and tried to lock a trading system that had been open for centuries.',
        'The big idea: ocean basins connect people. Draw the map with the water in the middle and the medieval world stops looking like isolated continents.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'East Africa & the Indian Ocean World' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
