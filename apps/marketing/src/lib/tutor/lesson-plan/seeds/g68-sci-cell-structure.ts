/**
 * Grades 6-8 Science — Cell Structure and Function.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SCI_CELL_STRUCTURE: LessonPlan = {
  id: 'evelyn.g68.science.cell-structure.v1',
  title: 'Cell Biology — Cell Structure and Organelles',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'science',
  topic: 'cell-biology',
  locale: 'en',
  los: [
    {
      id: 'g68.sci.cell-biology.structure',
      description: 'Identify the major organelles of plant and animal cells and link each organelle to its function.',
      standard: 'NGSS-MS-LS1-2',
    },
  ],
  prerequisites: [],
  followUps: ['g68.sci.cell-biology.mitosis'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A cell is like a tiny city — every organelle has a job.',
      script: 'Imagine a city with a power plant, a recycling center, a delivery service, walls around it. A cell has all of those — they\'re called organelles. Today we tour the cell\'s "buildings" and see what each does.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cell-structure',
      kind: 'concept',
      goal: 'Plant vs animal cells, key organelles, function-structure links.',
      keyIdeas: [
        'CELL = the smallest unit of life. Every living thing is made of one or more cells.',
        'NUCLEUS: the cell\'s "control center." Holds DNA. Decides which proteins to make.',
        'CELL MEMBRANE: thin layer surrounding the cell. Controls what enters and exits — like a security guard.',
        'CYTOPLASM: jelly-like fluid filling the cell. Organelles float in it.',
        'MITOCHONDRIA: the "power plants." Convert food to usable energy (ATP).',
        'RIBOSOMES: tiny "factories" that make proteins.',
        'ENDOPLASMIC RETICULUM (ER): network of folded membranes; transports proteins around the cell.',
        'GOLGI APPARATUS: the "post office." Packages proteins for shipping.',
        'LYSOSOMES (animal cells): the "recycling center." Break down waste and worn-out parts.',
        'PLANT CELLS have extra parts:',
        '  CELL WALL: rigid layer outside the cell membrane. Made of cellulose. Gives plants their shape.',
        '  CHLOROPLASTS: the "solar panels." Capture sunlight for photosynthesis.',
        '  CENTRAL VACUOLE: large fluid-filled sac. Stores water and nutrients.',
        'KEY MEMORY: animal cells DON\'T have cell walls, chloroplasts, or large central vacuoles. Plant cells DO. Otherwise both share the basic organelles.',
      ],
      vocabulary: [
        { term: 'organelle', definition: 'a small structure inside a cell with a specific job — like nucleus, mitochondria, ribosomes.' },
        { term: 'cell membrane', definition: 'the thin barrier around a cell that controls what enters and leaves.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A scientist looks at a cell under a microscope and sees a cell wall, chloroplasts, and a large central vacuole. Is it a plant cell or animal cell?',
      steps: [
        'Cell wall: only PLANT cells have one.',
        'Chloroplasts: only plant cells (they do photosynthesis).',
        'Large central vacuole: characteristic of plant cells.',
        'All three features point to plant cell. Confirmed.',
      ],
      answer: 'plant cell',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A cell has lots of mitochondria. What does this tell you about the cell\'s job?',
      expectedAnswer: 'Lots of mitochondria = lots of ATP production = the cell needs MUCH energy. This is true for muscle cells (need energy for contraction) and active cells like sperm or heart cells. The structure (many mito) reflects the function (high energy demand).',
      responseFormat: 'free',
      hints: [
        'What do mitochondria do?',
        'What kind of cell would need lots of energy?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cell-wall',
      kind: 'misconception_check',
      question: 'A student thinks animal cells have a cell wall because they need protection. What\'s the correct picture?',
      commonErrors: [
        {
          answer: 'Animal cells have a cell wall',
          misconception: 'Confusing the cell membrane with a cell wall.',
          correctsTo: 'Animal cells have only a CELL MEMBRANE, not a cell wall. Plants need a cell wall because they don\'t have skeletons — the cell wall provides rigidity. Animals get rigidity from their bones / exoskeletons. Animal cells have cell membranes (thin, flexible), not walls (rigid). Bacteria and fungi also have cell walls but with different chemistry.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Nucleus = control. Mitochondria = energy. Ribosomes = protein.',
        'Plant cells have cell wall + chloroplasts + central vacuole.',
        'Animal cells don\'t have those — but have lysosomes.',
        'Structure reflects function — many mito = high energy need.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
