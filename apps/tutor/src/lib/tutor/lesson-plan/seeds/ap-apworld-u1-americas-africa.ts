/**
 * AP World History: Modern — CED Unit 1.4-1.5: State Building in the
 * Americas / State Building in Africa.
 *
 * Unit-1 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did indigenous American empires and African states build centralized,
 * complex political and economic systems without European contact,
 * 1200-1450?); worked_example = annotated document/described-visual
 * analysis; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Passages: concept anchor is Hernán Cortés's Second Letter to Charles V
 * (REUSE from APUSH) — evelyn.passage.apush-cortes-tenochtitlan.v1 — on
 * Tenochtitlan's causeways and its great market. worked_example anchor is
 * the Catalan Atlas (REUSE, described visual) —
 * evelyn.passage.apworld-catalan-atlas.v1 — the Mansa Musa panel, used
 * here as European corroboration of Mali's wealth already established in
 * `ap-apworld-u2-trans-saharan-trade.ts` (Mansa Musa r. c. 1312-1337, hajj
 * 1324, stays consistent with that plan's facts).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_AMERICAS_AFRICA_STATES: LessonPlan = {
  id: 'evelyn.ap.apworld.americas-africa-states.v1',
  title: 'U1.4-1.5 State Building in the Americas and Africa',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.americas-africa-states',
      description:
        'Explain how Indigenous American empires (the Mexica and the Inca) and West and East African states (Mali, Great Zimbabwe, and Ethiopia) built centralized, complex political and economic systems with distinct administrative structures in the period 1200-1450.',
      standard: 'AP-APWORLD-1.4',
    },
  ],
  prerequisites: ['apworld.south-southeast-asia'],
  followUps: ['apworld.medieval-europe'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that the pre-contact Americas and Africa were full of politically sophisticated, populous, centralized states — not an empty or stateless world waiting for Europeans to arrive.',
      script:
        "In 1520, the Spanish conquistador Hernán Cortés wrote home to his king describing a city he had just seen: causeways wide enough for cavalry, a market square twice the size of one in Spain, with more than sixty thousand people buying and selling goods from across a vast tribute empire. That city, Tenochtitlan, was as large as Seville. On the other side of the world, a Majorcan mapmaker had, a century and a half earlier, already drawn a West African king holding a golden orb, captioned as the richest lord on earth because of his kingdom's gold. Neither of these is a coincidence or an exaggeration — they're two data points in a much bigger pattern: the Americas and Africa in this period were full of large, wealthy, centrally organized states, built and run entirely without European involvement.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-americas-africa-states',
      kind: 'concept',
      goal: 'Explain how the Mexica and Inca empires, and Mali, Great Zimbabwe, Ethiopia, and the Hausa city-states, built centralized political and economic systems in the Americas and Africa, 1200-1450.',
      keyIdeas: [
        'THE MEXICA (AZTEC) EMPIRE founded its capital, TENOCHTITLAN, in the Valley of Mexico in 1325 on an island in Lake Texcoco. It grew, through a Triple Alliance with the cities of Texcoco and Tlacopan (formed 1428), into a TRIBUTE EMPIRE: conquered or subordinated city-states (altepetl) were required to pay regular tribute in goods, labor, or captives to the imperial center, rather than being directly administered — a lighter-footprint model of empire than direct territorial rule.',
        'CHINAMPAS were raised, highly fertile artificial agricultural islands the Mexica built in the shallow lake around Tenochtitlan, letting a lake-bound capital support an enormous urban population through intensive, multi-harvest agriculture right at its doorstep.',
        "THE INCA EMPIRE (Tawantinsuyu), centered in the Andes with its capital at Cuzco, expanded rapidly in the 15th century into the largest contiguous empire in the pre-Columbian Americas. It was administered through a very different model than the Mexica's tribute system: the MIT'A system of rotational labor service, in which subject communities owed the state periods of labor (building roads, farming state lands, military service) rather than paying tribute in goods.",
        "AN EXTENSIVE ROAD SYSTEM (over 24,000 miles) linked the Inca Empire's length along the Andes, enabling administration and army movement, while the QUIPU — knotted cords used without a written script — recorded census data, tribute and labor obligations, and administrative information across the empire.",
        "CAHOKIA, a large Mississippian-culture urban center near the confluence of the Mississippi and Missouri rivers (modern Illinois), reached its peak population and regional influence roughly 1050-1200, functioning as a major political, ceremonial, and trade center with monumental earthen mounds. It was already in decline by the later part of this unit's 1200-1450 window, but its earlier peak still demonstrates that complex, populous, hierarchical urban societies existed in North America long before extensive European contact.",
        "THE MALI EMPIRE, already covered as West Africa's dominant trans-Saharan trading power (see the Unit-2 trans-Saharan-trade topic), grew wealthy controlling gold-salt trade routes and became internationally famous through Mansa Musa's 1324 hajj and gold-giving in Cairo.",
        'GREAT ZIMBABWE was a powerful, wealthy state in southeastern Africa, flourishing roughly 1200-1450, known for its monumental dry-stone (mortarless) architecture — the Great Enclosure — built by a centralized state that grew rich controlling regional trade in gold and other goods reaching as far as the Indian Ocean coast.',
        'ETHIOPIA, under the Christian Solomonic dynasty (from 1270) in the Horn of Africa, is notable for its distinctive rock-hewn churches — most famously at LALIBELA, carved directly downward out of solid rock roughly in the 12th-13th century — evidence of a sophisticated, centralized, and enduring Christian state with its own ancient literate and religious tradition (Ge\'ez), independent of the Islamic states covered elsewhere in this unit.',
        'THE HAUSA CITY-STATES (e.g. Kano, Katsina), a cluster of independent, walled city-states in what is now northern Nigeria, organized around trade, craft production, and — increasingly in this period — Islamic influence via trans-Saharan trade contacts, are a further example of West African state complexity operating alongside, not subordinate to, Mali.',
        'THE COMBINED EFFECT: across the Americas and Africa, this period\'s states show a wide range of sophisticated political and economic models for organizing large populations WITHOUT European contact or influence — tribute empires (the Mexica), labor-service empires with quipu record-keeping (the Inca), monumental trade-based states (Great Zimbabwe), an ancient Christian kingdom with a distinct architectural tradition (Ethiopia), a trans-Saharan trading empire (Mali), and networks of genuinely urban, complex city-states (the Hausa, and earlier Cahokia in North America).',
      ],
      vocabulary: [
        {
          term: 'chinampa',
          definition:
            "a raised, highly fertile artificial agricultural island built by the Mexica in the shallow lake around Tenochtitlan, enabling intensive, multi-harvest agriculture to support the capital's large population.",
        },
        {
          term: "mit'a",
          definition:
            'the Inca system of rotational labor service, in which subject communities owed the state periods of labor (roads, state farmland, military service) rather than paying tribute in goods.',
        },
        {
          term: 'quipu',
          definition:
            'a system of knotted cords used by the Inca, without a written script, to record census data, tribute and labor obligations, and administrative information across the empire.',
        },
        {
          term: 'Great Zimbabwe',
          definition:
            'a powerful, wealthy southeastern African state (c. 1200-1450) known for its monumental dry-stone architecture, grown rich controlling regional trade in gold and other goods.',
        },
      ],
      passageId: 'evelyn.passage.apush-cortes-tenochtitlan.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-catalan-atlas-mansa-musa',
      kind: 'worked_example',
      problem:
        'Analyze this description of a panel from the Catalan Atlas (1375), a map made by the Majorcan cartographer Abraham Cresques for the king of Aragon: the West African section shows a crowned Black king seated on a throne, holding a large golden orb in his raised right hand and a golden sceptre in his left; a caption identifies him as "Musse Melly, lord of the Blacks of Guinea," and states that "this king is the richest and most noble lord of all this region on account of the abundance of gold that is gathered in his land." A robed merchant on a camel approaches him across the Sahara. What does this map panel reveal about how Mali\'s wealth and power were perceived beyond West Africa, and what should a careful reader keep in mind about the source?',
      steps: [
        "SOURCE IT FIRST. The Catalan Atlas is a richly illustrated map of the known world made in 1375 by Abraham Cresques, a Majorcan cartographer, commissioned for the king of Aragon — a European royal audience, not a Malian one — roughly 50 years after Mansa Musa's 1324 hajj through Cairo.",
        'IDENTIFY THE CLAIM. The panel visually depicts Mansa Musa enthroned, crowned, and holding a golden orb and sceptre — visual shorthand for supreme wealth and royal authority — with a caption explicitly naming him and stating he is "the richest and most noble lord of all this region on account of the abundance of gold that is gathered in his land."',
        "CONNECT TO THE MALI-WEALTH CAUSE. This is independent, non-African corroboration — alongside al-Umari's contemporary account of Mansa Musa's Cairo gold-giving covered in the trans-Saharan-trade topic — that Mali's fame for extraordinary gold wealth was widely known across the Mediterranean and European world decades after the 1324 hajj. Visual and textual testimony converge on the same reputation.",
        "CONNECT TO THE EUROPEAN-AUDIENCE-FRAMING DETAIL. The merchant on a camel approaching the king frames Mali as a destination of trade and richness FROM a European vantage point — the map presents Mali's gold as something worth seeking, designed for a European royal patron's interest in the geography and wealth of the wider world, not for a West African audience's own self-representation.",
        "WEIGH THE SOURCE'S RELIABILITY. As a visual, secondhand European artifact made roughly two generations after the events it depicts, the Atlas reflects European PERCEPTION of Mali's wealth — filtered through decades of report and legend — rather than an eyewitness or Malian source. It is strong evidence of Mali's REPUTATION abroad, not a precise account of Mali's internal governance or economy.",
        "STATE THE LINK TO THE COURSE THESIS. The panel is powerful, if indirect, evidence that West African states like Mali built genuine, internationally recognized wealth and political sophistication — direct evidence against treating pre-contact African states as unknown or unremarkable to the wider world.",
      ],
      answer:
        'The Catalan Atlas panel — a crowned Mansa Musa holding a golden orb and sceptre, captioned as "the richest and most noble lord of all this region on account of the abundance of gold that is gathered in his land" — is independent European corroboration that Mali\'s extraordinary gold wealth was widely known across the Mediterranean world decades after the 1324 hajj, matching al-Umari\'s contemporary account of Mansa Musa\'s gold-giving in Cairo. A careful reader should note the map was made in 1375 by a Majorcan cartographer for the king of Aragon — a European audience whose interest in Mali\'s gold, not Mali\'s own self-representation, shaped the panel\'s framing — so it is best read as evidence of Mali\'s widespread REPUTATION abroad rather than a precise, firsthand account of its internal governance.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE American or African state, other than Mali, that built a complex, centralized political or economic system in the period 1200-1450. (b) Explain how ONE administrative, economic, or religious/architectural feature of that state demonstrated its political complexity. (c) Explain ONE way that state connected to a wider regional or interregional network.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine American or African state of the period — e.g. the Mexica (Aztec) Empire, the Inca Empire, Great Zimbabwe, Ethiopia (Solomonic dynasty), the Hausa city-states, or Cahokia. No credit for a vague statement with no identifiable specific polity, or for an anachronistic/incorrect one.',
            modelResponse:
              'One American state of this period was the Inca Empire, centered in the Andes with its capital at Cuzco.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate administrative, economic, or religious/architectural feature demonstrating political complexity — e.g. the mit'a labor system, the quipu record-keeping system, Great Zimbabwe's monumental architecture, or Ethiopia's rock-hewn churches. No credit for an explanation disconnected from the state named in (a).",
            modelResponse:
              "The Inca administered their empire through the mit'a system, in which subject communities owed the state periods of rotational labor — building roads, farming state lands, or serving in the military — instead of paying tribute in goods, letting a centralized government organize enormous labor projects across a vast, mountainous territory.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate connection to a wider regional or interregional network — e.g. an extensive road system enabling administration and trade, or ties to the Indian Ocean or trans-Saharan trade networks. No credit for a vague or unsupported claim.',
            modelResponse:
              'The Inca built an extensive road system, over 24,000 miles long, linking the length of the empire along the Andes — enabling administrators, armies, and the quipu-recorded information those roads carried to move efficiently across a territory that would otherwise have been very difficult to govern from a single center.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-isolated-stateless',
      kind: 'misconception_check',
      question:
        'True or false: American and African societies were isolated and largely stateless before sustained European contact.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming the absence of European written records or European-style political forms meant the absence of genuine, complex states — a common but historically inaccurate frame that erases well-documented indigenous political and economic sophistication.',
          correctsTo:
            'FALSE. The Americas and Africa in this period were home to large, centralized, administratively sophisticated states built entirely independent of European contact. The Mexica built a tribute empire supporting a capital of tens of thousands via chinampa agriculture; the Inca administered the largest empire in the pre-Columbian Americas through the mit\'a labor system, a 24,000-mile road network, and quipu record-keeping; Great Zimbabwe built monumental dry-stone architecture funded by regional trade reaching the Indian Ocean coast; Ethiopia\'s Solomonic dynasty sustained a centuries-old Christian kingdom with its own rock-hewn church tradition; and Mali\'s wealth was famous enough to be depicted on a European map, the Catalan Atlas, decades later. Cahokia\'s peak (c. 1050-1200) came slightly before this unit\'s window and the city was already declining by 1200-1450, but its earlier flourishing still shows populous, hierarchical urban society in North America well before European contact. On the AP exam, this misconception is the single most important one to correct for this topic.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Mexica (Aztec) Empire built a tribute empire from Tenochtitlan (founded 1325), fed by chinampa agriculture, and ruled through a Triple Alliance (1428) rather than direct territorial administration.',
        "The Inca Empire (Tawantinsuyu) administered the largest pre-Columbian American empire through the mit'a rotational labor system, a 24,000-mile road network, and quipu record-keeping.",
        "Cahokia's peak (c. 1050-1200) predates most of this unit's window and the city was declining by 1200-1450, but it still shows populous, complex urban society in North America well before European contact.",
        "Great Zimbabwe's monumental dry-stone architecture and Ethiopia's rock-hewn churches (Lalibela) both reflect centralized African states with distinct trade-based and religious foundations.",
        "Mali's internationally recognized gold wealth — corroborated by both al-Umari's Cairo account and the Catalan Atlas made decades later — is direct evidence against treating pre-contact African states as unknown or stateless.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.4-1.5',
    cedTitle: 'State Building in the Americas and Africa',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-cortes-tenochtitlan.v1',
        chapter: '1520',
        note: "Hernán Cortés, Second Letter to Charles V — anchor document for Tenochtitlan's scale as the Mexica tribute empire's capital (reused from APUSH).",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-catalan-atlas.v1',
        chapter: '1375',
        note: "The Catalan Atlas — Mansa Musa panel — European corroboration of Mali's internationally recognized wealth (reused from the Unit-2 packet).",
      },
    ],
  },
};
