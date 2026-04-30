/**
 * G7 — Social Studies: Middle Ages (Europe ~500-1500).
 *
 * Post-Roman Europe. Feudalism, manorialism, the Catholic Church's
 * dominance, the Crusades, the Black Death, and the Magna Carta.
 * Sets up the Renaissance.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_MIDDLE_AGES: LessonPlan = {
  id: 'evelyn.g7.ss.middle-ages.v1',
  title: 'The Middle Ages',
  curriculum: 'state-standards',
  grade: '7',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g7.world.middle-ages',
      description: 'Describe feudalism, the role of the Church, and major events of medieval Europe.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame "Middle Ages" as the 1,000 years between Rome and the Renaissance.',
      script: 'After Rome fell in 476, Europe entered a period historians later called the MIDDLE AGES — middle between Rome and the rebirth of classical learning we call the Renaissance. It lasted roughly 1,000 years. People used to call it the "Dark Ages," but that\'s outdated — universities were founded, cathedrals built, and ideas that shape modern law and government took root.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-medieval',
      kind: 'concept',
      goal: 'Feudalism, manorialism, Church, Crusades, plague, Magna Carta.',
      keyIdeas: [
        'After Rome fell, Europe was politically fragmented. No central authority replaced the Empire (in the West).',
        'FEUDALISM: a hierarchy of obligations.',
        '  KING grants land (FIEFS) to NOBLES (lords) in exchange for loyalty + military service.',
        '  Nobles grant smaller fiefs to KNIGHTS, who fight for them.',
        '  PEASANTS / SERFS work the land in exchange for protection. Serfs were tied to the land.',
        'MANORIALISM: the economic system. Each manor (estate) was largely self-sufficient. Lords ruled their peasants directly.',
        'THE CATHOLIC CHURCH: the dominant institution.',
        '  Spiritually: only authorized path to salvation in Western Europe.',
        '  Politically: popes had power rivaling kings; the Church owned huge tracts of land.',
        '  Educationally: monasteries preserved literacy and ancient texts.',
        'THE CRUSADES (1096-1291): Christian military campaigns to retake the Holy Land from Muslim control. Eight major Crusades; mostly failed strategically, but increased trade contact between Europe and the Middle East.',
        'BLACK DEATH (1347-1352): plague pandemic killed an estimated 30-60% of Europe\'s population. Massive social and economic disruption — labor shortages, weakening of feudalism, rise of wages.',
        'MAGNA CARTA (1215, England): nobles forced King John to sign a document limiting royal power and protecting some legal rights. Foundation of constitutional government.',
        'LATER MEDIEVAL: rise of TOWNS, GUILDS (craftsman associations), UNIVERSITIES (Oxford, Paris, Bologna). End of the period blends into the Renaissance.',
      ],
      vocabulary: [
        { term: 'feudalism', definition: 'a system of land-for-loyalty obligations between lords and vassals.' },
        { term: 'serf', definition: 'a peasant tied to a manor, bound to the land.' },
        { term: 'Crusades', definition: 'medieval Christian military expeditions to the Holy Land.' },
        { term: 'Magna Carta', definition: '1215 English document limiting royal power.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-feudalism',
      kind: 'worked_example',
      problem: 'Draw the feudal pyramid — who owes what to whom?',
      steps: [
        'TOP: KING — grants land (fiefs) to nobles in exchange for loyalty + military service.',
        'NEXT: NOBLES (lords) — manage their fiefs, supply knights to the king.',
        'NEXT: KNIGHTS — provide military service to lords.',
        'BOTTOM: PEASANTS / SERFS — work the manor land, give a portion of crops to lords. In exchange, get protection and land use.',
        'IMPORTANT: obligations went BOTH ways. Lord owed protection to peasant; peasant owed labor to lord. The whole system was a web of mutual obligations.',
      ],
      answer: 'King → Nobles → Knights → Peasants',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did the Black Death contribute to the END of feudalism?',
      expectedAnswer: 'Labor shortage gave surviving peasants more bargaining power, forcing higher wages and breaking down serfdom.',
      responseFormat: 'free',
      hints: [
        'Think about labor supply.',
        'When ~half the labor force dies, what happens to the value of remaining workers?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dark-ages',
      kind: 'misconception_check',
      question: 'Sami calls the Middle Ages "the Dark Ages — nothing happened intellectually for 1,000 years." Is that fair?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Adopting the outdated "Dark Ages" label.',
          correctsTo: 'Wrong. The "Dark Ages" was a Renaissance-era insult. The Middle Ages produced universities, Gothic cathedrals (engineering marvels), Islamic Golden Age scholarship that preserved Greek knowledge, Aquinas\'s philosophy, the Magna Carta, and many technological advances (heavy plow, water mills, three-field crop rotation). The "dark" framing reflects bias, not history.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Middle Ages ≈ 500-1500 CE in Europe.',
        'Feudalism: hierarchy of land-for-loyalty obligations.',
        'Manorialism: self-sufficient estates run by lords.',
        'Catholic Church dominated spiritually and politically.',
        'Crusades = ~200 years of Christian-Muslim conflict over the Holy Land.',
        'Black Death killed 30-60%, weakened feudalism.',
        'Magna Carta (1215) limited royal power — foundation for constitutional government.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the Magna Carta still important today, 800+ years later?',
      hint: 'It established the principle that even kings are bound by law — the foundation of constitutional governments and rule of law in countries like the US and UK.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
