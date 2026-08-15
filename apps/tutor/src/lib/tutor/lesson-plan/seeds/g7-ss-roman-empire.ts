/**
 * G7 — Social Studies: The Roman Empire.
 *
 * Roman Republic → Empire transition; geographic expansion; the
 * Pax Romana; cultural and engineering achievements (roads,
 * aqueducts, law, Latin); the long decline and fall.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_ROMAN_EMPIRE: LessonPlan = {
  id: 'evelyn.g7.ss.roman-empire.v1',
  title: 'The Roman Empire',
  curriculum: 'state-standards',
  grade: '7',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g7.world.rome',
      description: 'Describe the rise, government, achievements, and fall of Rome.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Rome as a 1,000+ year story.',
      script: 'Rome went from a small village in central Italy to ruling the entire Mediterranean — and then it lasted for ANOTHER 500 years after its peak before finally falling. The story spans more than 1,000 years. Roads, laws, languages (the romance languages: Spanish, French, Italian, Portuguese, Romanian), even the alphabet you\'re reading right now — all Roman heritage.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rome',
      kind: 'concept',
      goal: 'Republic → Empire → Pax Romana → decline. Government, achievements, fall.',
      keyIdeas: [
        'ROMAN REPUBLIC (~509-27 BCE): government with elected officials and a SENATE. Two consuls (executives) shared power. Republic = "res publica" = "the people\'s thing".',
        'EXPANSION: through wars (notably the PUNIC WARS against Carthage), Rome conquered most of the Mediterranean.',
        'TRANSITION TO EMPIRE: Republic broke down through civil wars. JULIUS CAESAR was assassinated in 44 BCE. His grand-nephew OCTAVIAN became the first emperor (AUGUSTUS) in 27 BCE.',
        'PAX ROMANA (~27 BCE-180 CE): "Roman Peace" — relative stability, prosperity, and growth across the empire. Trade flourished.',
        'GOVERNMENT: an EMPEROR (autocrat) ruled. The Senate continued but with less power. Provinces governed by appointed officials.',
        'ACHIEVEMENTS:',
        '  ENGINEERING: roads (50,000+ miles), aqueducts (water transport), concrete, the arch, sewers.',
        '  LAW: Roman law influenced almost every Western legal system — the idea of "innocent until proven guilty," written codes, contracts.',
        '  LANGUAGE: Latin became the language of administration; later evolved into Spanish, French, Italian, Portuguese, Romanian.',
        '  RELIGION: started polytheistic; Christianity spread, became official religion under Emperor THEODOSIUS in 380 CE.',
        'FALL OF THE WESTERN EMPIRE (476 CE): not a single event but a slow decline — economic problems, political instability, plague, mass migrations of "barbarian" tribes (Goths, Vandals, Huns), military overextension.',
        'EASTERN ROMAN EMPIRE (BYZANTINE): continued for ANOTHER 1,000 years until Constantinople fell to the Ottomans in 1453.',
      ],
      vocabulary: [
        { term: 'republic', definition: 'a government where power rests with elected representatives.' },
        { term: 'Pax Romana', definition: '~200 years of relative peace and prosperity in the Roman Empire.' },
        { term: 'aqueduct', definition: 'a Roman structure for transporting water across distances.' },
      ],
      suggestedTools: ['show_map', 'show_timeline'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-republic-vs-empire',
      kind: 'worked_example',
      problem: 'How was the Roman Republic different from the Roman Empire?',
      steps: [
        'GOVERNMENT FORM: Republic had elected officials (consuls, senate). Empire had a single emperor with autocratic power.',
        'POWER: Republic spread power across many people (with Senate as advisor). Empire concentrated it in one person.',
        'REPUBLIC: ~509-27 BCE (about 500 years).',
        'EMPIRE: ~27 BCE-476 CE Western (~500 years), Eastern continued to 1453 (another 1,000).',
        'TRANSITION: civil wars (especially after Julius Caesar) destroyed the Republic\'s institutions; Augustus formalized one-man rule.',
      ],
      answer: 'Republic = elected officials; Empire = emperor.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name one engineering achievement and one cultural achievement of Rome that still influences us today.',
      expectedAnswer: 'Engineering: roads / aqueducts / concrete. Cultural: Roman law / Latin / Romance languages.',
      responseFormat: 'free',
      hints: [
        'For engineering, think about INFRASTRUCTURE.',
        'For cultural, think LANGUAGE or LAW.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fall-fast',
      kind: 'misconception_check',
      question: 'Owen says "Rome fell in 476 CE because of barbarian invasions." What\'s missing from that picture?',
      commonErrors: [
        {
          answer: 'nothing — that\'s the date',
          misconception: 'Treating the fall as a single event with one cause.',
          correctsTo: 'The decline took CENTURIES. Many causes: economic issues (debasing currency → inflation), political instability (lots of civil wars and assassinations), plague, military overextension, climate shifts, gradual loss of central authority. Barbarian invasions were the FINAL push, not the only cause. Also: only the WESTERN empire fell — the Eastern (Byzantine) continued for another 1,000 years.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Republic (509-27 BCE) → civil wars → Empire (27 BCE-476 CE Western, 1453 Eastern).',
        'Pax Romana = ~200 years of peace and prosperity.',
        'Achievements: roads, aqueducts, concrete, law, Latin → Romance languages.',
        'Christianity became the official Roman religion in 380 CE.',
        'The "fall" took centuries with many causes; Eastern Empire (Byzantine) continued to 1453.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are Spanish, French, Italian, Portuguese, and Romanian called "Romance" languages?',
      hint: '"Romance" comes from "Roman" — these languages all evolved from Vulgar Latin (the spoken Latin of common people across the Roman Empire). After Rome fell, regional dialects diverged into separate languages.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
