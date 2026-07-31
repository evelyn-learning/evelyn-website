/**
 * World History — The Americas Before 1492: Mesoamerica, the Maya & the Aztec.
 *
 * The unit's corrective: the Americas were not an empty wilderness waiting
 * to be discovered. Two Mesoamerican civilizations — one that invented
 * writing and zero, one that built a lake city bigger than Paris — did it
 * with zero contact with Eurasia. The Aztec tribute system also plants the
 * fuse that Cortes lights in 6.4. Salvaged factual spine from the legacy
 * world-history state-building seed, reframed subject-first.
 * C3 D2.His.1.9-12, D2.His.14.9-12, D2.Geo.2.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U5_MAYA_AZTEC: LessonPlan = {
  id: 'evelyn.hs.whist.maya-aztec.v1',
  title: 'Mesoamerica: The Maya & the Aztec',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.maya-aztec',
      standard: 'WHIST-5.3',
      description:
        'Compare how the Maya city-states and the Aztec tribute empire organized power, cities, and knowledge in Mesoamerica, and explain how each was shaped by its environment and by centuries of development entirely independent of Eurasian contact (C3 D2.His.1.9-12, D2.His.14.9-12, D2.Geo.2.9-12).',
    },
  ],
  prerequisites: ['whist.east-africa-indian-ocean'],
  followUps: ['whist.inca-north-america'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Overturn the "empty wilderness" picture of the pre-1492 Americas with the scale of Tenochtitlan and the sophistication of Maya knowledge.',
      script:
        'In 1519, Spanish soldiers came over a mountain pass and saw a city floating on a lake — white towers, garden-islands, three stone causeways running out across the water, and roughly two hundred thousand people living in it. Tenochtitlan was larger than Paris. Larger than London. Several of the men who saw it wrote that they thought they were dreaming. And seven hundred years before that, a few hundred miles away, Maya scribes were writing history in a full writing system and doing arithmetic with a symbol for zero that Europe would not use for centuries. Here is the part that should stop you: none of these people had ever met anyone from Europe, Africa, or Asia. Every bit of it was invented from scratch, on this side of the ocean. Today you learn what was actually here.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-maya-aztec',
      kind: 'concept',
      goal: 'The Maya city-state world and its knowledge systems, the Aztec lake capital and tribute empire, and the independent-invention theme that ties them together.',
      keyIdeas: [
        'MAYA MEANS CITY-STATES, NOT AN EMPIRE — during the Classic period (c. 250-900 CE), the Maya lowlands held dozens of independent kingdoms: Tikal, Palenque, Calakmul, Copan. Each had its own dynasty, its own patron gods, and its own wars and alliances with the others. They shared a culture, a calendar, and a writing system but never a single ruler. The closest comparison you already know is the Greek poleis: one civilization, many rival states.',
        'A REAL WRITING SYSTEM — Maya glyphs record dates, royal births, marriages, accessions, wars, and defeats on stone monuments and in bark-paper books. This is the only fully developed writing system invented in the pre-contact Americas. It was unreadable to modern scholars until a breakthrough wave of decipherment in the 1970s and 1980s — which is why older textbooks call the Maya "mysterious." They are not mysterious now; we can read their history in their own words.',
        'ZERO AND THE SKY — the Maya used a positional number system in base 20 WITH a symbol for zero, developed independently of India, where zero was also invented. That math let them track the solar year, the 260-day ritual calendar, and the cycles of Venus with startling accuracy, and to write dates on a Long Count that runs continuously for thousands of years. Astronomy was not a hobby: calendars set the timing of planting, ritual, and war.',
        'THE "COLLAPSE" IS A MISNOMER — beginning around 800-900 CE, the great southern lowland cities stopped raising monuments and were abandoned. Climate records show severe multi-decade droughts; the inscriptions and defensive walls show intensifying warfare between kingdoms; population had pushed hard on thin tropical soils. But northern cities like Chichen Itza flourished afterward, and MILLIONS of Maya people are alive today in Guatemala, Mexico, Belize, and Honduras, speaking around thirty Mayan languages. Cities were abandoned; a people was not erased.',
        'THE MEXICA BUILT A CITY ON A LAKE — the Mexica (the people we usually call the Aztec) were late arrivals in the Valley of Mexico who founded Tenochtitlan on an island in Lake Texcoco in 1345. They engineered the site into a capital: chinampas (raised, endlessly fertile garden plots built up out of the lake bed) fed it, three great causeways connected it to the shore, an aqueduct carried fresh water in, and a dike held back brackish water. By 1500 it held roughly 200,000 people — bigger than any city in Europe at the time.',
        'A TRIBUTE EMPIRE, NOT A GOVERNED ONE — from 1428 the Mexica and two allied cities conquered outward, but they mostly did not administer what they took. Defeated city-states kept their own rulers and were required to send regular tribute — cloth, cacao, feathers, food, labor, captives — to Tenochtitlan. It was cheap to run and enormously profitable. It also left every subject people intact, armed, and resentful. When Cortes arrived in 1519, he did not defeat the empire with a few hundred Spaniards; he recruited tens of thousands of Tlaxcalan and other allies who had their own reasons to want Tenochtitlan gone. Hold that thread — you pick it up in 6.4.',
        'MERCHANTS, WARRIORS, AND RELIGION — pochteca were long-distance merchant guilds who traded across Mesoamerica and doubled as the empire\'s eyes and information network. Status came largely through war: capturing enemies alive raised a commoner into the warrior ranks. Mexica religion held that the sun required human blood to keep rising, and captives were sacrificed in state rituals at the Templo Mayor — a practice that is documented, was central to how the state justified conquest, and belongs in the same analytical frame you would apply to state violence and state religion anywhere else in this course, not in a horror story.',
        'INVENTED FROM SCRATCH — the Maya and the Mexica developed cities, monumental architecture, mathematics, writing, calendars, engineering, and imperial administration with NO contact with Eurasia or Africa. No wheels for transport (they had wheeled toys, but no draft animals to pull carts), no iron, no horses — and complex urban civilization anyway. That is the point of this lesson: sophisticated urban society is not a Eurasian invention that spread. Humans built it more than once, independently.',
      ],
      vocabulary: [
        { term: 'city-state', definition: 'an independent state consisting of one city and the land it controls — the Maya political unit, as in Tikal or Palenque.' },
        { term: 'chinampa', definition: 'a raised, artificially built garden plot in a shallow lake bed — extremely fertile, harvestable several times a year, and the reason Tenochtitlan could feed itself.' },
        { term: 'tribute empire', definition: 'an empire that leaves conquered peoples largely self-governing but requires regular payments of goods and labor to the imperial center.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tribute-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did the very structure that made the Aztec Empire cheap and profitable to run also make it possible for a few hundred Spaniards to bring it down in 1521?',
      steps: [
        'Start with the design choice. After 1428 the Mexica conquered widely but chose NOT to garrison, resettle, or directly administer most of what they took. Defeated city-states kept their own rulers, their own gods, and their own soldiers.',
        'Follow the money. What the Mexica took instead was tribute: fixed quotas of cloth, cacao, feathers, food, labor, and captives flowing into Tenochtitlan on a schedule. Low cost, high return — this is why the capital grew so rich so fast.',
        'Follow the resentment. Every tribute payment was a recurring reminder of defeat, and demands for sacrificial captives made it worse. Tlaxcala, never conquered and surrounded by Mexica territory, was a standing enemy. The empire had no program for turning subjects into Mexica.',
        'Now add the outsider. Cortes landed in 1519 with roughly 500 men — militarily trivial against a state that could field tens of thousands. What he found was a ready-made coalition: peoples who wanted Tenochtitlan gone and needed only a partner. Tens of thousands of Indigenous allies, above all Tlaxcalans, joined him.',
        'Close the chain, and add the factor nobody chose: smallpox, arriving with the Spanish, killed a huge share of Tenochtitlan\'s population during the siege, including the emperor Cuitlahuac. So: indirect rule → intact subject armies → accumulated resentment → an alliance the Spanish could join → epidemic disease → the fall of the capital in 1521. The conquest was mostly a Mesoamerican civil war with Spanish participants and a European disease.',
      ],
      answer:
        'Tribute rule was cheap because it left conquered peoples self-governing and armed — so it also left ready allies for anyone who challenged Tenochtitlan; Cortes supplied the occasion, tens of thousands of Indigenous allies supplied the army, and smallpox supplied the rest.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-collapse-confusion',
      kind: 'worked_example',
      problem:
        'A student writes: "The Maya civilization mysteriously vanished around 900 CE when the Aztecs conquered them." Untangle the three separate errors packed into that one sentence.',
      steps: [
        'Error one — the actor. The Aztec Empire did not exist in 900 CE. Tenochtitlan was founded in 1345 and the empire began expanding in 1428, more than four hundred years after the Maya cities were abandoned, and roughly 800 miles away. Two different regions, two different eras, no conquest between them.',
        'Error two — the "vanishing." What actually ended around 800-900 CE was the SOUTHERN LOWLAND CITIES: Tikal, Palenque, Copan and their neighbors stopped carving monuments and lost their populations. Meanwhile northern cities such as Chichen Itza rose to prominence afterward. When the Spanish arrived in the 1500s they fought Maya kingdoms that were still very much there — Nojpeten held out until 1697.',
        'Error three — "mysteriously." It is not a mystery, it is a multi-cause explanation: lake-sediment and cave records show severe droughts across the ninth century; inscriptions and hastily built defensive walls show escalating warfare between kingdoms; and dense population on thin tropical soils left no margin when harvests failed. Historians argue about the weighting, not about the existence of causes.',
        'Say what is actually true instead. About six to seven million Maya people live today across Guatemala, southern Mexico, Belize, and Honduras, speaking around thirty living Mayan languages. A civilization whose descendants are your contemporaries did not vanish.',
        'Extract the transferable habit: "mysteriously vanished" is almost always a signal that the writer means "I stopped following the evidence here." Ask which places, which century, and what the records actually show.',
      ],
      answer:
        'Wrong actor (the Aztec state did not exist until centuries later and never ruled the Maya), wrong claim (southern cities were abandoned around 800-900 CE while northern ones flourished), and wrong framing (drought, warfare, and agricultural strain are documented causes) — and the Maya people are still here, millions of them.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-maya-political',
      kind: 'try_yourself',
      problem:
        'Tikal, Palenque, and Calakmul each had their own dynasty and fought wars against one another while sharing a calendar, a writing system, and a religion. What does this pattern tell you about Classic Maya political organization?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Maya were one culture divided among many independent, competing city-states — much like the Greek poleis', correct: true },
        { id: 'b', text: 'The Maya were a single unified empire ruled from Tikal' },
        { id: 'c', text: 'The Maya had no permanent settlements and moved between temporary camps' },
        { id: 'd', text: 'The Maya were a province governed by the Aztec Empire' },
      ],
      expectedAnswer: 'The Maya were one culture divided among many independent, competing city-states — much like the Greek poleis',
      hints: [
        'Shared culture and shared warfare are not a contradiction — ask what political unit lets both be true at once.',
        'You have seen this shape before in this course: Athens and Sparta shared gods, games, and a language, and still fought each other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tenochtitlan-food',
      kind: 'try_yourself',
      problem:
        'Tenochtitlan stood on an island in a shallow lake and supported roughly 200,000 people by 1500 — more than Paris or London at the same date. Which factor most directly made feeding a city that size on that site possible?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Chinampas — raised garden plots built up from the lake bed, fertile enough to harvest several times a year', correct: true },
        { id: 'b', text: 'Large herds of cattle and sheep pastured in the valley' },
        { id: 'c', text: 'Iron plows that let farmers work the surrounding highlands deeply' },
        { id: 'd', text: 'Grain shipped across the Atlantic in exchange for gold' },
      ],
      expectedAnswer: 'Chinampas — raised garden plots built up from the lake bed, fertile enough to harvest several times a year',
      hints: [
        'Three of these require animals, metals, or contacts that simply did not exist in Mesoamerica before 1492.',
        'The Mexica did not find a good site — they engineered one. What did they build out into the water itself?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tribute-allies',
      kind: 'try_yourself',
      problem:
        'When Cortes marched on Tenochtitlan in 1519 with about 500 Spaniards, tens of thousands of Tlaxcalans and other Indigenous fighters joined him. Which feature of the Aztec Empire best explains why those allies were available?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Conquered peoples kept their own rulers and armies while owing heavy tribute, so resentful and intact rivals were everywhere', correct: true },
        { id: 'b', text: 'The Mexica had disbanded their own army and could not defend the capital' },
        { id: 'c', text: 'The Tlaxcalans had converted to Christianity before the Spanish arrived' },
        { id: 'd', text: 'The Aztec Empire had already collapsed from drought a century earlier' },
      ],
      expectedAnswer: 'Conquered peoples kept their own rulers and armies while owing heavy tribute, so resentful and intact rivals were everywhere',
      hints: [
        'A tribute empire buys cheapness with a trade-off — what does it never do to the peoples it defeats?',
        'Ask who else in the valley wanted Tenochtitlan gone, and whether the empire had ever taken away their ability to fight.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-outside-influence',
      kind: 'misconception_check',
      question:
        'A student says: "Pyramids, writing, and a symbol for zero in Mesoamerica? Somebody from Egypt or Asia must have crossed over and taught them." What needs correcting?',
      commonErrors: [
        {
          answer: 'Mesoamerican achievements must have been borrowed from an Old World civilization',
          misconception:
            'Assuming complex civilization has a single origin that spreads by contact — so any similarity between distant societies is treated as evidence of transmission rather than of independent invention.',
          correctsTo:
            'There is no archaeological, linguistic, or genetic evidence of pre-Columbian Eurasian contact with Mesoamerica, and the details rule it out: Maya glyphs share no signs or structure with Egyptian hieroglyphs, Maya math is base 20 while Old World systems are base 10 or 60, and Mesoamerican pyramids are flat-topped temple platforms with stairs, built for public ritual, not sealed tombs. Similar problems get similar solutions because humans everywhere face them: dense populations need monumental civic space, states need records, and astronomy needs place-value notation. Independent invention is the ordinary explanation — and the far more interesting one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Classic Maya (c. 250-900 CE) were many independent city-states — Tikal, Palenque, Calakmul — sharing one culture, like the Greek poleis; never one empire.',
        'Maya knowledge: a full writing system, largely deciphered only since the 1970s and 1980s, plus positional base-20 math with zero and precise astronomical calendars.',
        'The "collapse" was the abandonment of southern cities around 800-900 CE, driven by drought, warfare, and agricultural strain — not a disappearance. Millions of Maya people live in Central America today.',
        'The Mexica founded Tenochtitlan in 1345 on Lake Texcoco and engineered it — chinampas, causeways, aqueduct — into a city of about 200,000, larger than Paris or London.',
        'The Aztec Empire ruled by tribute, not administration: cheap, rich, and fatally resented — which is why Cortes found tens of thousands of Indigenous allies in 1519. Carry that into 6.4.',
        'All of it was built without any contact with Eurasia or Africa: the Americas before 1492 were densely populated, urban, and sophisticated on their own terms.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Mesoamerica: The Maya & the Aztec' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
