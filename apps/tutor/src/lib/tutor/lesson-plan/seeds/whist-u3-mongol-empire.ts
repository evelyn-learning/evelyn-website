/**
 * World History — Postclassical Connections: The Mongol Empire & the Silk Roads.
 *
 * The course's clearest double-edged story: the most feared conquerors of the
 * age also built the safest long-distance trade corridor Eurasia had ever had —
 * and the plague rode those same protected roads west (bridge to 4.4). Salvaged
 * factual spine from the legacy world-history unit-2 Mongol and Silk Roads
 * seeds, reframed subject-first. C3 D2.His.14.9-12, D2.Geo.7.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U3_MONGOL_EMPIRE: LessonPlan = {
  id: 'evelyn.hs.whist.mongol-empire.v1',
  title: 'The Mongol Empire & the Silk Roads',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.mongol-empire',
      standard: 'WHIST-3.4',
      description:
        'Explain how the Mongols built the largest contiguous land empire in history and evaluate how the resulting Pax Mongolica moved goods, technologies, ideas — and disease — across Afro-Eurasia (C3 D2.His.14.9-12, D2.Geo.7.9-12).',
    },
  ],
  prerequisites: ['whist.tang-song-china'],
  followUps: ['whist.byzantine-empire'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the paradox: the same empire that leveled cities also made a Eurasian journey survivable for the first time in centuries.',
      script:
        'A saying spread across Eurasia in the 1200s: a young woman carrying a sack of gold could ride from one end of the Mongol realm to the other without being harmed. It was propaganda — but it was also, roughly, true. Here is the strange part. The people who made those roads safe were the same people who had just destroyed Baghdad, one of the greatest cities on earth. Both facts belong to the same story. For about a century, one family of conquerors held territory from Korea to Hungary, and goods, inventions, travelers, and eventually a plague moved across it faster than anything had before. Today you follow what crossed those roads — and what it cost.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mongol-empire',
      kind: 'concept',
      goal: 'The unification, the reasons conquest moved so fast, the khanates, and the double-edged Pax Mongolica.',
      keyIdeas: [
        'ONE MAN UNIFIED THE STEPPE — the grasslands north of China (the steppe) held rival herding tribes who raided each other more than anyone else. In 1206 a chieftain named Temujin finished uniting them and took the title Genghis Khan, "universal ruler." Uniting the steppe is the precondition for everything that follows: energy once spent on feuds got pointed outward.',
        'WHY CONQUEST WAS SO FAST — not one advantage but a stack. Every Mongol was a lifelong horse archer; armies moved with remounts and could cover distances no settled army could match. The composite bow shot farther than most infantry weapons. Officers were promoted for skill, not birth. Cities that surrendered were usually spared; cities that resisted were destroyed on purpose, so terror did work armies otherwise had to do. And crucially, the Mongols HIRED what they lacked — Chinese and Persian siege engineers gave a nomadic army the catapults and gunpowder bombs needed to take walled cities.',
        'THE LARGEST CONTIGUOUS LAND EMPIRE IN HISTORY — by the mid-1200s Mongol rule stretched from Korea and northern China across Central Asia to Persia, Russia, and the edge of Eastern Europe. "Contiguous" is the key word: connected by land, in one unbroken block — which is exactly why it could function as a highway.',
        'IT SPLIT INTO KHANATES — after a disputed succession, by about 1260 the empire had effectively divided into four khanates: the Yuan Dynasty in China under Kublai Khan, the Chagatai Khanate in Central Asia, the Ilkhanate in Persia, and the Golden Horde in Russia. Related by lineage, increasingly rivals in practice. So "the Mongol Empire" after 1260 means a family of successor states, not one government.',
        'PAX MONGOLICA — the "Mongol Peace." Once conquest ended, a merchant crossing thousands of miles faced ONE dominant power instead of dozens of hostile borders, unpredictable tolls, and bandits. The khans wanted trade: they taxed it, so they protected it. The yam relay system — supply stations roughly a day apart with fresh horses — let messengers and officials cross the empire in weeks.',
        'WHAT ACTUALLY CROSSED — silk, porcelain, and silver moved along the routes, but the durable transfers were knowledge: gunpowder weapons technology and knowledge of printing traveled from China westward, Persian astronomy and Chinese medicine met at Mongol courts, and travelers like Marco Polo (from Venice, in the late 1200s) and, a generation later, Ibn Battuta (from Morocco) could cross Eurasia and write it down. Roads that are safe carry ideas, not just cargo.',
        'THE DARK FLIP SIDE IS THE SAME ROAD — the destruction was real: Baghdad, the center of Islamic learning, was sacked in 1258, its libraries and irrigation works wrecked, and it never recovered its old standing. And in the 1340s the plague later called the Black Death traveled the protected routes west out of Central Asia, killing perhaps a third of Europe and comparable shares elsewhere. Connection is not a synonym for good — the same corridor moves whatever gets on it (see 4.4).',
        'CONNECTORS AND DESTROYERS — BOTH TRUE — the common student instinct is to pick one verdict. History does not require one. The Mongols killed on an enormous scale AND created the most integrated overland exchange zone Afro-Eurasia had yet seen. Holding both at once is the actual skill this topic teaches.',
      ],
      vocabulary: [
        { term: 'khanate', definition: 'one of the four successor states (Yuan China, Chagatai, Ilkhanate, Golden Horde) the Mongol Empire divided into by about 1260.' },
        { term: 'Pax Mongolica', definition: 'the "Mongol Peace" — the roughly century-long stretch when a single dominant power made overland Eurasian travel and trade far safer.' },
        { term: 'yam', definition: 'the Mongol relay system of supply stations, about a day\'s ride apart, stocked with fresh horses so messengers could cross the empire quickly.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-safety-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did the most destructive conquest of the age end up making long-distance travel across Eurasia SAFER than it had been in centuries?',
      steps: [
        'Start with the problem the conquest solved by accident. Before 1200, a caravan from the Mediterranean to China crossed dozens of separate territories — each with its own tolls, its own rulers, its own bandits, and no one responsible for the stretch in between. Risk, not distance, was what made the journey rare.',
        'Step one, unification: Genghis Khan unites the steppe tribes in 1206, so raiding energy that used to hit caravans gets aimed at conquest instead.',
        'Step two, conquest: mounted archers plus hired Chinese and Persian siege engineers let the Mongols take both open country and walled cities, and by the mid-1200s one authority holds an unbroken land block from Korea to Eastern Europe.',
        'Step three, incentive: the khans made money by TAXING trade, not by robbing it. A merchant who is robbed pays no customs duty again. So protecting the route was in the rulers\' own interest — and they backed it with the yam relay network and swift, brutal punishment of bandits.',
        'Step four, result: the traveler now deals with one set of rules across the whole journey. Marco Polo\'s family goes to China; a generation later Ibn Battuta crosses much of the same world. That is Pax Mongolica.',
        'Now close the loop honestly. The same conditions carried the plague west in the 1340s. The chain that produced safety and the chain that produced catastrophe are the SAME chain — a fast, protected corridor does not check what it is moving.',
      ],
      answer:
        'Unified steppe (1206) → conquest of an unbroken land block → rulers who profited by taxing trade rather than raiding it → one authority, one set of rules, plus the yam network → Pax Mongolica — and, along the identical route, the Black Death.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-traveler-account',
      kind: 'worked_example',
      problem:
        'A European friar sent to the Mongol court around 1250 reported (paraphrased): "The khan\'s messengers change horses at stations set a day apart, so a letter crosses in weeks a road that once took a season. Merchants who formerly hired armed men now travel with their goods alone — though we passed the bones of a city that had refused to surrender, and no one lives there now." What does this account reveal about Mongol rule?',
      steps: [
        'Source it first, briefly. A Christian friar sent as an envoy, writing for readers in Europe who knew the Mongols mainly as a terrifying rumor. He is an outsider, he is impressed, and he has reason to emphasize both wonder and horror — read the details, not the adjectives.',
        'First claim: relay stations "a day apart" and letters crossing in weeks. That is the yam, and it is evidence of ADMINISTRATION, not just conquest. Stations that reliably hold fresh horses across thousands of miles require sustained organization and money — something a purely destructive army does not build.',
        'Second claim: merchants who "formerly hired armed men now travel with their goods alone." Notice this is a comparison across time — before versus now. Dropping the cost of armed guards is exactly how Pax Mongolica shows up in a merchant\'s ledger, and cheaper travel means more of it.',
        'Third claim, and do not skip it: "the bones of a city that had refused to surrender." The same account that documents safe roads documents deliberate annihilation. The friar is describing the Mongol method exactly — submit and be governed, resist and be erased.',
        'Weigh it. One envoy\'s snapshot is not a statistic, and he may be repeating what his hosts wanted him to see. But the yam and the surrender-or-destruction policy are corroborated by Chinese, Persian, and Arabic sources, so the account is reliable in outline even where its emphasis is dramatic.',
        'State the conclusion. The passage captures the whole topic in one paragraph: infrastructure and terror as two halves of a single system of rule.',
      ],
      answer:
        'It shows administration (the yam relay stations), the commercial payoff of Pax Mongolica (merchants dropping armed escorts), and the terror that underwrote both (a destroyed city that refused to submit) — connectors and destroyers in one account.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-fast',
      kind: 'try_yourself',
      problem:
        'Which combination best explains why Mongol armies conquered so much territory so quickly in the 1200s?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Highly mobile mounted archers, promotion by skill rather than birth, and siege engineers hired from conquered lands', correct: true },
        { id: 'b', text: 'Cannon and firearms, which only the Mongols possessed at the time' },
        { id: 'c', text: 'Overwhelming numbers — Mongol armies were far larger than the states they attacked' },
        { id: 'd', text: 'Naval power that let them attack Europe and China from the sea' },
      ],
      expectedAnswer: 'Highly mobile mounted archers, promotion by skill rather than birth, and siege engineers hired from conquered lands',
      hints: [
        'The Mongols came from the grasslands and were usually OUTNUMBERED — so look for advantages of speed and organization, not size.',
        'Ask how a nomadic army takes a walled city: it does not invent siege engines, it recruits the people who already build them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pax-mongolica',
      kind: 'try_yourself',
      problem:
        'A merchant traveling from the Black Sea to China in 1300 faced far less risk than a merchant making the same trip in 1150. What best explains the change?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One dominant power now controlled the whole route, so the merchant faced a single authority instead of dozens of hostile borders and bandits', correct: true },
        { id: 'b', text: 'The Mongols built the first roads ever to link China with the Mediterranean world' },
        { id: 'c', text: 'Trade along the route had become tax-free under Mongol rule' },
        { id: 'd', text: 'Sea routes had closed, so all rulers cooperated to protect the overland journey' },
      ],
      expectedAnswer: 'One dominant power now controlled the whole route, so the merchant faced a single authority instead of dozens of hostile borders and bandits',
      hints: [
        'The roads and the trade were already ancient — ask what changed about who CONTROLLED the ground between the two ends.',
        'The khans taxed trade, which is precisely why they protected it rather than abolishing tolls.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plague-route',
      kind: 'try_yourself',
      problem:
        'The plague known as the Black Death reached the Middle East and Europe in the 1340s. What is the strongest explanation of how it traveled so far so fast?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It moved along the same secured overland trade routes that Mongol rule had made fast and safe for merchants and messengers', correct: true },
        { id: 'b', text: 'European armies invading Central Asia carried it home with them' },
        { id: 'c', text: 'It spread with the crowding of the first industrial cities' },
        { id: 'd', text: 'Mongol rulers deliberately engineered it as a weapon against distant enemies' },
      ],
      expectedAnswer: 'It moved along the same secured overland trade routes that Mongol rule had made fast and safe for merchants and messengers',
      hints: [
        'Whatever moves goods quickly also moves everything the goods travel with — people, animals, and what they carry.',
        'Check the century in each option: factory cities are five hundred years later, and the traffic in the 1300s was running east-to-west along the trade corridor.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-destroyers',
      kind: 'misconception_check',
      question:
        'A student writes: "The Mongols were just destroyers — they conquered, burned cities, and left nothing behind." What needs correcting?',
      commonErrors: [
        {
          answer: 'The Mongols were purely destructive and left no lasting contribution',
          misconception: 'Choosing one verdict when the evidence supports two — letting the (real) brutality of conquest erase the connectivity that Mongol rule produced.',
          correctsTo:
            'The destruction is real: Baghdad was sacked in 1258 and never regained its standing, and cities that resisted were annihilated on purpose. But once territory was held, the Mongols governed — the yam relay network, generally tolerant treatment of Buddhists, Muslims, and Christians, and skilled foreign officials employed regardless of origin. That produced the Pax Mongolica, which carried gunpowder technology and printing knowledge west, let Marco Polo and later Ibn Battuta cross Eurasia, and also carried the Black Death. Destroyers AND connectors — the correct answer is both, not one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Genghis Khan united the steppe tribes in 1206; unification came first, conquest followed.',
        'Speed came from a stack: mounted archers and remounts, the composite bow, promotion by merit, deliberate terror, and siege engineers hired from conquered lands.',
        'The largest contiguous land empire in history — an unbroken land block from Korea to Eastern Europe — split into four khanates by about 1260.',
        'Pax Mongolica: rulers who taxed trade protected it, so one authority plus the yam network made the whole route survivable — carrying gunpowder and printing knowledge west and travelers like Marco Polo and Ibn Battuta across.',
        'The same protected roads carried the Black Death west in the 1340s, and Baghdad fell in 1258: connectors and destroyers, both true.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'The Mongol Empire & the Silk Roads' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
