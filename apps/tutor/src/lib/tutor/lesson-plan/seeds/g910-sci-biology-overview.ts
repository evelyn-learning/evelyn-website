/**
 * High School (9-10) Biology — overview unit.
 *
 * Cells, energy, genetics, evolution, ecosystems — five anchors of HS bio.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_BIOLOGY_OVERVIEW: LessonPlan = {
  id: 'evelyn.science.9-10.biology-overview.v1',
  title: 'HS biology — five big anchors',
  curriculum: 'NGSS',
  grade: '9',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'hsbio.anchors',
      description: 'Identify and connect the five anchor concepts of high-school biology: cells, energy, genetics, evolution, ecosystems.',
      standard: 'HS-LS1',
    },
  ],
  prerequisites: ['g6-8.cells'],
  followUps: ['hsbio.cell-structure', 'hsbio.dna-replication'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame biology as connected systems, not memorized facts.',
      script: 'Biology gets a bad rap as memorization. The trick is to see the FIVE BIG IDEAS that everything else hangs from. Cells. Energy. Genetics. Evolution. Ecosystems. Once you see how they connect, every fact has a home.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-anchors',
      kind: 'concept',
      goal: 'Five anchors and how they connect.',
      keyIdeas: [
        'CELLS: the smallest unit of life. All living things are cells or made of cells. Prokaryotes (no nucleus) vs eukaryotes (nucleus + organelles).',
        'ENERGY: cells need energy. Photosynthesis (plants make glucose from light + CO₂). Cellular respiration (glucose + O₂ → ATP). The two are mirrors.',
        'GENETICS: DNA → RNA → protein. Cells inherit DNA; mutations change DNA; proteins do the work.',
        'EVOLUTION: variation in DNA + selection pressure → populations change over time. Natural selection ≠ "survival of the fittest individual"; it\'s about reproductive success across generations.',
        'ECOSYSTEMS: cells make organisms; organisms interact in populations; populations form communities and ecosystems. Energy flows through food chains; matter cycles (carbon, nitrogen).',
        'CONNECTIONS: cells get energy via respiration → use it to copy DNA → DNA controls offspring → variation drives evolution → species fit into ecosystems.',
      ],
      vocabulary: [
        { term: 'cell', definition: 'the smallest functional unit of life.' },
        { term: 'photosynthesis', definition: 'process where plants convert light energy + CO₂ + water into glucose + oxygen.' },
        { term: 'natural selection', definition: 'process where organisms with advantageous traits reproduce more, shifting populations over generations.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-photosynthesis',
      kind: 'worked_example',
      problem: 'Write the photosynthesis equation. Then write cellular respiration. What do you notice?',
      steps: [
        'Photosynthesis: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂',
        'Cellular respiration: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP',
        'They are MIRRORS — the products of one are the reactants of the other.',
        'Plants do BOTH (photosynthesis when sunny, respiration always). Animals do only respiration.',
        'Energy flow: sunlight → glucose (photosynthesis) → ATP (respiration) → cellular work.',
      ],
      answer: 'They are inverse equations; together they cycle carbon and oxygen.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bird population has variation in beak size. A drought kills small-seed plants, leaving only big seeds. After 5 generations, what would you predict about average beak size?',
      expectedAnswer: 'larger — birds with bigger beaks survive and reproduce more',
      responseFormat: 'free',
      hints: [
        'Selection acts on the variation that already exists.',
        'Birds with big beaks crack big seeds; small-beaked birds starve.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-individuals-evolve',
      kind: 'misconception_check',
      question: 'A student says: "An individual giraffe stretched its neck and that\'s why giraffes have long necks now." Why is this wrong?',
      commonErrors: [
        {
          answer: 'because of stretching',
          misconception: 'Lamarckian inheritance — assuming acquired traits pass to offspring.',
          correctsTo: 'Individuals don\'t evolve. POPULATIONS do, over generations. Stretching your neck doesn\'t change your DNA, so your kids don\'t inherit longer necks. The actual story: giraffes with slightly longer necks (due to genetic variation) reached more food, had more offspring, and over many generations the population shifted toward longer necks. Selection acts on inherited variation, not lifetime experience.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five anchors: cells, energy, genetics, evolution, ecosystems.',
        'Photosynthesis and respiration are mirror processes.',
        'DNA → RNA → protein is the central dogma.',
        'Evolution = variation + selection across generations.',
        'Energy flows; matter cycles.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the cell membrane a particularly important boundary in biology?',
      hint: 'It separates inside from outside, allowing the cell to maintain conditions different from the environment (high K+ inside, low Na+; pH gradients; ATP storage). Most signaling, transport, and energy capture happens AT this boundary. Without selective membranes, no life — gradients dissipate, organization collapses.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
