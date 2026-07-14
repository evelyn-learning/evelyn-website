/**
 * AP World History — Unit 1 CED 1.4-1.5: State Building in the Americas /
 * State Building in Africa.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.americas-africa-states.v1`. Covers the Mexica
 * tribute empire (chinampas, the Triple Alliance), the Inca Empire
 * (mit'a, roads, quipu), Cahokia, and West/East African states (Mali,
 * Great Zimbabwe, Ethiopia, the Hausa city-states).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_AMERICAS_AFRICA_STATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.americas-africa-states.v1',
  course: 'AP World History: Modern',
  cedUnit: 1,
  cedTopic: '1.4-1.5',
  cedTitle: 'State Building in the Americas and Africa',
  planId: 'evelyn.ap.apworld.americas-africa-states.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.americas-africa-states.v1' }],
  theory: [
    {
      loId: 'apworld.americas-africa-states',
      kind: 'definition',
      title: 'chinampa',
      content:
        'A raised, highly fertile artificial agricultural island the Mexica built in the shallow lake around Tenochtitlan, enabling intensive, multi-harvest agriculture to support the capital\'s large population.',
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'definition',
      title: "mit'a",
      content:
        "The Inca system of rotational labor service, in which subject communities owed the state periods of labor (roads, state farmland, military service) rather than paying tribute in goods — a different administrative model than the Mexica's tribute empire.",
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'definition',
      title: 'quipu',
      content:
        'A system of knotted cords used by the Inca, without a written script, to record census data, tribute/labor obligations, and administrative information across the empire.',
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: 'the Mexica (Aztec) tribute empire',
      content:
        'Founded Tenochtitlan in 1325 on an island in Lake Texcoco. Grew via a Triple Alliance with Texcoco and Tlacopan (formed 1428) into a tribute empire: conquered city-states (altepetl) paid regular tribute in goods, labor, or captives rather than being directly administered.',
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: 'the Inca Empire (Tawantinsuyu)',
      content:
        "Centered in the Andes (capital Cuzco), expanded rapidly in the 15th century into the largest contiguous empire in the pre-Columbian Americas. An extensive road system (over 24,000 miles) enabled administration and army movement, linked to the mit'a labor system and quipu record-keeping.",
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: 'Cahokia',
      content:
        "A large Mississippian-culture urban center (modern Illinois) that reached its peak population and regional influence roughly 1050-1200, with monumental earthen mounds. Already declining by the later part of this unit's 1200-1450 window, but its earlier peak still shows complex, populous urban society in North America well before European contact.",
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: 'Great Zimbabwe',
      content:
        'A powerful, wealthy southeastern African state (c. 1200-1450) known for its monumental dry-stone (mortarless) architecture — the Great Enclosure — built by a centralized state that grew rich controlling regional trade reaching as far as the Indian Ocean coast.',
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: "Ethiopia's Solomonic dynasty and rock-hewn churches",
      content:
        "A Christian kingdom in the Horn of Africa (from 1270), notable for rock-hewn churches — most famously at Lalibela, carved directly downward out of solid rock roughly in the 12th-13th century — evidence of a sophisticated, centralized, enduring Christian state with its own ancient literate tradition (Ge'ez).",
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: 'Mali and the Catalan Atlas (1375)',
      content:
        'Mali\'s trans-Saharan gold wealth and Mansa Musa\'s 1324 hajj (see `apworld.trans-saharan-trade`) were internationally recognized decades later: the Catalan Atlas (1375) depicts him enthroned with a golden orb and sceptre, captioned "the richest and most noble lord of all this region on account of the abundance of gold that is gathered in his land" — European corroboration of Mali\'s reputation, filtered through decades of report rather than an eyewitness/Malian source.',
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'event',
      title: 'Hausa city-states',
      content:
        'A cluster of independent, walled city-states (e.g. Kano, Katsina) in what is now northern Nigeria, organized around trade, craft production, and increasing Islamic influence via trans-Saharan trade contacts — West African state complexity alongside, not subordinate to, Mali.',
    },
    {
      loId: 'apworld.americas-africa-states',
      kind: 'trap',
      title: 'pre-contact Americas and Africa were not stateless',
      content:
        'The absence of European written records or European-style political forms did not mean the absence of genuine, complex states. The Mexica, Inca, Great Zimbabwe, Ethiopia, Mali, the Hausa city-states, and (at its earlier peak) Cahokia all show large, centralized, administratively sophisticated states built entirely independent of European contact.',
    },
  ],
  methods: [
    {
      title: 'Weigh a described-visual (map/image) document\'s reliability',
      when_to_use:
        'Use this on any described-visual document (like the Catalan Atlas) where the source is an image + caption rather than a first-person textual account.',
      steps: [
        'Identify who made the visual, for whom, and how long after the events it depicts.',
        'Identify the specific visual/textual claim (e.g. enthroned figure, caption wording).',
        'Connect the claim to the concept it corroborates (e.g. Mali\'s wealth, already attested elsewhere).',
        'Note the audience-framing effect: a visual made for a foreign patron reflects that audience\'s interest, not the depicted subject\'s own self-representation.',
        'Conclude: strong evidence of REPUTATION/perception, not a precise firsthand account of internal governance.',
      ],
      example: {
        problem: 'What does the Catalan Atlas panel of Mansa Musa reveal, and what should a careful reader keep in mind?',
        solution:
          'It shows Mali\'s gold wealth was widely known across the Mediterranean world by 1375, corroborating al-Umari\'s account of the 1324 hajj. As a European map made for the king of Aragon roughly 50 years later, it reflects European PERCEPTION of Mali\'s reputation, not a Malian or eyewitness account of its governance.',
      },
      relatedLoIds: ['apworld.americas-africa-states'],
    },
  ],
  pointers: [
    { content: 'The single most important misconception to correct for this topic: pre-contact Americas/Africa were NOT isolated or stateless — cite Mexica, Inca, Great Zimbabwe, Ethiopia, Mali by name.', kind: 'trap' },
    { content: "Distinguish the Mexica's TRIBUTE model (goods/labor/captives from subordinated city-states) from the Inca's MIT'A model (rotational labor service) — different administrative systems, easy to conflate on an SAQ.", kind: 'tip' },
    { content: 'Cahokia\'s PEAK (c. 1050-1200) is slightly before this unit\'s 1200-1450 window and the city was already declining — cite it carefully as earlier evidence of the same broader pattern, not a still-thriving 1200-1450 metropolis.', kind: 'edge-case' },
    { content: 'The Catalan Atlas (1375) is a European-made described visual, not a Malian eyewitness source — use it as evidence of Mali\'s REPUTATION abroad.', kind: 'gotcha' },
    { content: 'Quipu (Inca) and champa rice/civil-service exam (China, Unit 1.1) are both good "specific innovation" answers for an SAQ part (a) — don\'t confuse which civilization each belongs to.', kind: 'frq-vocab' },
  ],
};
