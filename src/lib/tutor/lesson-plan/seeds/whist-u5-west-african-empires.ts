/**
 * World History — Regional Powers: West African Empires (Ghana, Mali, Songhai).
 *
 * The unit's answer to the "empty Africa" story students arrive with: a
 * thousand-year chain of gold-rich, city-building, book-collecting states
 * that ran on the desert trade — and whose fall in 1591 comes from guns,
 * not from any lack of sophistication. Factual spine salvaged from the
 * legacy world-history trans-Saharan seeds, reframed subject-first.
 * C3 D2.His.1.9-12, D2.Geo.7.9-12, D2.Eco.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U5_WEST_AFRICAN_EMPIRES: LessonPlan = {
  id: 'evelyn.hs.whist.west-african-empires.v1',
  title: 'West African Empires: Ghana, Mali & Songhai',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.west-african-empires',
      standard: 'WHIST-5.1',
      description:
        'Explain how trans-Saharan trade in gold and salt built the successive empires of Ghana, Mali, and Songhai, and evaluate how that wealth shaped cities, religion, scholarship, and the historical record of West Africa (C3 D2.His.1.9-12, D2.Geo.7.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.late-middle-ages'],
  followUps: ['whist.east-africa-indian-ocean'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Overturn the "Africa had no history before Europeans" assumption with one traveling king and a currency crash.',
      script:
        'In 1324, a king from West Africa crossed Egypt on his way to Mecca with a caravan so loaded with gold that he handed it out for months — and wrecked the value of gold in Cairo for years afterward. His name was Mansa Musa, and he ruled Mali. Fifty years later European mapmakers, who had never set foot south of the Sahara, drew him on their world maps holding a gold nugget, because that story was still being told. Meanwhile his empire held a city, Timbuktu, whose scholars were copying and collecting books by the tens of thousands. So when someone tells you Africa was isolated or empty before Europeans arrived, you now have the counter-question: how did a supposedly isolated place crash a foreign economy and end up on foreign maps? Today you learn the machine that made it possible — and why a desert was the reason, not the obstacle.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-west-african-empires',
      kind: 'concept',
      goal: 'The trade engine, the three empires it built in sequence, and how we know about them.',
      keyIdeas: [
        'THE SAHARA WAS A BRIDGE, NOT A WALL — on a map the desert looks like a dead zone, and for a long time it mostly was. Camels changed that: they carry heavy loads, go days without water, and tolerate the heat far better than horses or oxen. Add a saddle design suited to desert riding and you get caravans of hundreds of camels crossing on a schedule. Technology turned a barrier into a highway.',
        'GOLD MOVED NORTH, SALT MOVED SOUTH — the engine of the whole system was two things each region lacked. West Africa had goldfields (Bambuk, Bure, and later the Akan forest region) but little salt; the Sahara had salt mines (Taghaza, where blocks were cut straight out of the ground) but no gold. Salt was not a seasoning — in a hot climate, it preserves food and keeps people alive. In some markets the two traded close to weight for weight, which sounds absurd until you remember you cannot eat gold.',
        'GHANA TAXED THE ROAD (c. 700-1200) — the first great empire of the region sat between the goldfields and the desert crossings and charged traders coming and going. Ghana did not mine most of its gold; it collected from everyone who moved it. Two cautions students trip on: this Ghana was in the region of modern Mali and Mauritania, NOT where the modern country of Ghana is (that nation took the old name in 1957 as an honor), and its power came from position, not production.',
        'MALI SCALED IT UP (c. 1235-1600) — as Ghana weakened, Sundiata Keita united the Malinke and defeated the Sosso ruler around 1235, founding Mali. Mali took the same toll-collecting model and ran it over a far larger territory, adding control of trade cities like Timbuktu, Djenne, and Gao. The peak came under Mansa Musa (ruled about 1312-1337), one of the wealthiest rulers in recorded history.',
        'THE HAJJ OF 1324-25 — Mansa Musa, a Muslim ruler, made the pilgrimage to Mecca with an enormous retinue and gave away gold across Egypt on the way. He distributed so much that the price of gold in Cairo reportedly stayed depressed for years — a one-man inflation event. The diplomatic consequence outlasted the economic one: Mali entered the mental world of North Africa and Europe, and appears on the Catalan Atlas of 1375, a European map, as the realm of the richest lord in the region.',
        'TIMBUKTU TURNED WEALTH INTO LEARNING — trade money funded scholarship. Timbuktu became a center of Islamic study built around mosque-schools, above all Sankore, drawing teachers of law, theology, astronomy, and medicine. Private families assembled manuscript libraries; tens of thousands of those handwritten books survive today. Books were themselves a trade good, and reportedly among the most profitable ones.',
        'SONGHAI ROSE AND WAS SHOT DOWN (c. 1464-1591) — as Mali lost its grip, Songhai took over from Gao. Sunni Ali (ruled 1464-1492) built it by conquest, taking Timbuktu and Djenne; Askia Muhammad (ruled 1493-1528) organized it — provinces, appointed governors, standardized weights, an expanded bureaucracy, and heavy patronage of Islamic scholarship. It ended abruptly in 1591 when a Moroccan force crossed the Sahara carrying firearms and cannon and broke a far larger Songhai army at Tondibi. The empire fell to gunpowder, not to decline.',
        'ISLAM BLENDED RATHER THAN ERASED — Islam arrived along the caravan routes with North African merchants, and rulers and city merchants adopted it early, partly because shared faith meant shared law, credit, and contacts with trading partners. But it layered onto existing beliefs rather than wiping them out: rural practice, local spiritual traditions, and West African social structures persisted, and travelers noted customs that conservative outside visitors found un-Islamic. Religions blend at the edges; that is the normal pattern, not an exception.',
        'GRIOTS KEPT THE RECORD — West African societies preserved history through griots, professional oral historians who memorized genealogies, praise songs, and epics across generations. The Epic of Sundiata comes down to us this way. Oral does not mean unreliable: griots trained for years and were held to accuracy by their communities, and their accounts sit alongside written sources such as the North African traveler Ibn Battuta, who visited Mali around 1352. Historians cross-check them the same way they cross-check any two written sources.',
      ],
      vocabulary: [
        { term: 'trans-Saharan trade', definition: 'the camel-caravan routes crossing the Sahara that linked West Africa to North Africa and, through it, the Mediterranean and Islamic worlds.' },
        { term: 'Sahel', definition: 'the semi-arid belt of grassland just south of the Sahara where the trade cities and empire capitals sat.' },
        { term: 'griot', definition: 'a trained professional oral historian and musician who preserves genealogy, epic, and community history by memory.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trade-to-empire-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a desert — the least productive land in the region — end up producing three of the wealthiest empires in the medieval world?',
      steps: [
        'Start with the geography, not the empires. Two zones sit next to each other with opposite shortages: the savanna and forest south have gold and food but almost no salt; the desert has salt beds and no gold. A shortage on each side is a trade waiting to happen.',
        'Add the enabling technology. Wanting to trade is useless if the crossing kills you. The camel plus a desert-suited saddle makes a 1,000-mile crossing survivable and repeatable, so caravans run year after year on known routes to known market towns.',
        'Follow where the value concentrates. Not at the mine — the gold miners stayed deliberately obscure, and salt cutters worked in brutal isolation. Value concentrates at the CHOKE POINTS: the market cities and river crossings where every caravan must stop. Whoever controls those collects from all of it.',
        'Turn tolls into a state. Ghana taxed goods entering and leaving, and used the revenue to pay soldiers, who protected the routes, which attracted more traders, which raised revenue again. That feedback loop is the empire. Mali inherits it and runs it over more territory; Songhai inherits it from Mali and adds provincial administration.',
        'Follow the surplus past the treasury. Trade wealth funds mosques, schools, salaried scholars, and manuscript collecting at Timbuktu, Djenne, and Gao. So the chain runs all the way to a library: complementary shortages, then camel technology, then control of choke points, then taxes, then a state, then cities, then scholarship.',
      ],
      answer:
        'Opposite shortages (gold south, salt north) plus the camel made regular crossings profitable; empires grew by taxing the choke points that trade had to pass through, and converted that revenue into armies, cities, and scholarship.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cairo-account',
      kind: 'worked_example',
      problem:
        'An Egyptian official writing in Cairo about fifteen years after the event described Mansa Musa\'s visit roughly this way: "He left no royal officeholder without a gift of gold, and the merchants of the city made fortunes buying and selling with his people. So much gold changed hands that its price in Egypt fell and had not recovered." Work out what this tells us — and what it does not.',
      steps: [
        'Ask who is speaking and when. An Egyptian administrator in Cairo, writing roughly fifteen years later from other people\'s testimony. That is contemporary and well-placed, but it is secondhand — he did not stand in the market with a ledger.',
        'Separate the observation from the explanation. The observation is a price drop in a major commercial city. The explanation offered is a sudden flood of supply from one visiting caravan. That explanation is economically sensible: dump enough of any commodity into a market at once and its price falls.',
        'Test the size claim against something independent. Cairo was one of the richest cities in the Islamic world; moving ITS gold price is a very high bar. That the story was still repeated decades later, and that European mapmakers drew Mali as the land of the richest ruler on the Catalan Atlas in 1375, means the reputation traveled and stuck — independent corroboration of scale, if not of the exact price figure.',
        'Read what the account assumes without stating it. A king from south of the Sahara arrives in Cairo, is received by court officials, and is described in the vocabulary of shared Islamic practice. The gold is the headline, but the routine integration is the deeper evidence: Mali was inside the Afro-Eurasian world, not adjacent to it.',
        'Mark the limits honestly. "Had not recovered" is a dramatic, unverifiable claim from a writer with no price series to consult, so treat multi-year figures as an impression rather than a measurement. The core point — that Mansa Musa distributed an extraordinary quantity of gold — is corroborated from several directions and can be relied on.',
      ],
      answer:
        'It is strong contemporary evidence that Mali\'s gold wealth was large enough to move a major foreign market and to make Mali famous across the Mediterranean world; the specific claim of a years-long price depression is a secondhand impression rather than a measurement, so use it for scale, not for precision.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ghana-wealth',
      kind: 'try_yourself',
      problem:
        'Most of the gold traded across the Sahara was mined well to the south of the Empire of Ghana, in goldfields Ghana did not control. How did Ghana still become wealthy from it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It sat between the goldfields and the desert routes and taxed traders passing through in both directions', correct: true },
        { id: 'b', text: 'It owned and operated the largest gold mines in West Africa' },
        { id: 'c', text: 'It conquered North Africa and seized the gold in Mediterranean ports' },
        { id: 'd', text: 'It sold gold directly to European ships arriving on the Atlantic coast' },
      ],
      expectedAnswer: 'It sat between the goldfields and the desert routes and taxed traders passing through in both directions',
      hints: [
        'If you do not own the resource, what else about your position can still make you rich?',
        'Think of a toll booth on the only road: you never own the cargo, you just charge everything that passes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-timbuktu',
      kind: 'try_yourself',
      problem:
        'Timbuktu under Mali and Songhai supported mosque-schools such as Sankore and large private manuscript libraries. What does this best demonstrate about West Africa in this period?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Trade wealth funded a major urban center of Islamic scholarship with a literate book culture', correct: true },
        { id: 'b', text: 'Writing reached West Africa only after European missionaries arrived in the 1800s' },
        { id: 'c', text: 'Islamic practice completely replaced every local belief and custom across the region' },
        { id: 'd', text: 'Scholarship in Timbuktu was organized and paid for by North African rulers who governed the city' },
      ],
      expectedAnswer: 'Trade wealth funded a major urban center of Islamic scholarship with a literate book culture',
      hints: [
        'Ask what pays for full-time scholars: someone has to feed people who read for a living.',
        'Two of these answers get the century wrong or the ruler wrong — Timbuktu was governed from Mali and then Songhai, centuries before European contact inland.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-songhai-fall',
      kind: 'try_yourself',
      problem:
        'The Songhai Empire, the largest state in West African history, collapsed after 1591. What most directly brought it down?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A Moroccan army crossed the Sahara with firearms and cannon and destroyed a much larger Songhai force at Tondibi', correct: true },
        { id: 'b', text: 'European colonial powers conquered and partitioned the interior in the 1590s' },
        { id: 'c', text: 'The Sahara dried out and made all caravan trade impossible' },
        { id: 'd', text: 'Askia Muhammad abolished the provincial government, leaving no administration' },
      ],
      expectedAnswer: 'A Moroccan army crossed the Sahara with firearms and cannon and destroyed a much larger Songhai force at Tondibi',
      hints: [
        'Songhai was well administered and enormous — so ask what could beat numbers.',
        'This is a gunpowder story: European partition of the African interior is roughly three centuries later, and Askia Muhammad built the provincial system rather than abolishing it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-isolated-africa',
      kind: 'misconception_check',
      question:
        'A student writes: "Before Europeans arrived, West Africa had no cities, no writing, and no real states — just scattered villages, so we have no way to know its history." What needs correcting?',
      commonErrors: [
        {
          answer: 'West Africa had no cities, writing, or states before European arrival',
          misconception: 'Treating the absence of EUROPEAN records as the absence of history, and assuming a society without European-style institutions had none of its own.',
          correctsTo:
            'Every part of that sentence fails on the evidence. Cities: Timbuktu, Djenne, and Gao were substantial urban centers with markets, mosques, and schools. Writing: Timbuktu families held manuscript libraries in Arabic and in local languages written in Arabic script, and tens of thousands of those books survive. States: Ghana, Mali, and Songhai were tax-collecting empires with armies, governors, and standardized administration — Songhai ran provinces under appointed officials. And the record is rich: griot oral tradition preserved the Epic of Sundiata, outside writers such as Ibn Battuta described Mali firsthand around 1352, an Egyptian official recorded Mansa Musa in Cairo, and a European map of 1375 drew Mali as the richest realm in the region. The honest statement is the reverse: West Africa was wealthy, urban, literate, and internationally known long before European contact.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The camel and its desert saddle turned the Sahara from a barrier into a trade corridor; gold moved north, salt moved south, because each side lacked what the other had.',
        'Ghana (c. 700-1200), Mali (c. 1235-1600, founded by Sundiata), and Songhai (c. 1464-1591, built by Sunni Ali and organized by Askia Muhammad) all grew rich the same way: taxing trade at the choke points, not owning the mines.',
        "Mansa Musa's hajj of 1324-25 gave away enough gold to depress Cairo's prices for years and put Mali on European maps by 1375.",
        'Timbuktu converted trade wealth into scholarship — Sankore and family manuscript libraries made it a leading center of Islamic learning.',
        'Islam spread along the caravan routes and blended with local traditions rather than erasing them; griots and the Epic of Sundiata preserved history alongside written accounts.',
        'Songhai fell in 1591 to Moroccan gunpowder at Tondibi — an ending caused by weapons technology, not by any lack of wealth or organization.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'West African Empires: Ghana, Mali & Songhai' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
