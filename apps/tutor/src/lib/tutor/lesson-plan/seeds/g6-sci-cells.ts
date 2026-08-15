/**
 * Grade 6 Science — Cells: Structure and Function.
 *
 * Introduces the cell as the basic unit of life and the major
 * organelles found in plant + animal cells. Focuses on STRUCTURE-
 * FUNCTION relationships (mitochondria → energy, chloroplasts →
 * photosynthesis, etc.) so students don't memorize names without
 * understanding the why. Aligns with NGSS MS-LS1-1 and MS-LS1-2.
 *
 * Source: NGSS MS-LS1, OpenStax Concepts of Biology / Grade 6 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_CELLS: LessonPlan = {
  id: 'evelyn.g6.science.biology.cells.v1',
  title: 'Cells: Structure and Function',
  curriculum: 'NGSS',
  grade: '6',
  subject: 'science',
  topic: 'cells-and-life',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ls1-1',
      description: 'Conduct an investigation to provide evidence that living things are made of cells; either one cell or many different numbers and types of cells.',
      standard: 'NGSS.MS-LS1-1',
    },
    {
      id: 'ngss.ms-ls1-2',
      description: 'Develop and use a model to describe the function of a cell as a whole and ways the parts of cells contribute to the function.',
      standard: 'NGSS.MS-LS1-2',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ls1-3', 'ngss.hs-ls1-1'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to grapple with the idea that everything alive — them, a tree, a mushroom, a bacterium — is built from the SAME basic unit.',
      script: 'You and an oak tree don\'t look much alike. But there\'s one thing you have in common with that tree, with mushrooms, with the slime on a pond — even with the bacteria on your hands. What is it?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cell-theory',
      kind: 'concept',
      goal: 'All living things are made of cells; cells are the smallest unit that counts as ALIVE.',
      keyIdeas: [
        'Cells are the BASIC UNIT of life — the smallest thing that can be called alive.',
        'Some organisms are ONE cell (bacteria, amoebas). Others are TRILLIONS (you).',
        'All cells come from other cells — they don\'t appear from nothing.',
        'Despite huge variety, all cells share core parts: a membrane (boundary), DNA (instructions), and ribosomes (protein-makers).',
      ],
      vocabulary: [
        { term: 'cell', definition: 'the smallest unit of life that can carry out all life functions.' },
        { term: 'organelle', definition: 'a tiny structure inside a cell with a specific job (like an organ in a body).' },
        { term: 'unicellular', definition: 'made of one cell (e.g. bacteria).' },
        { term: 'multicellular', definition: 'made of many cells (e.g. you, a tree).' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-organelles',
      kind: 'concept',
      goal: 'Each organelle has a SHAPE that fits its FUNCTION — structure tells you what it does.',
      keyIdeas: [
        'NUCLEUS — the control center. Holds DNA (instructions for everything).',
        'MITOCHONDRIA — the "power plants". Break down food to release energy. Cells that need a lot of energy (muscle, heart) have MORE mitochondria.',
        'CHLOROPLASTS — only in plants. Capture sunlight for photosynthesis (turn light + water + CO₂ into sugar).',
        'CELL MEMBRANE — the gatekeeper. Controls what enters and leaves.',
        'CELL WALL — only in plants/fungi/bacteria. Stiff outer layer for shape and protection.',
        'RIBOSOMES — protein factories. Read DNA instructions and build proteins.',
      ],
      vocabulary: [
        { term: 'mitochondria', definition: 'organelles that release energy from food.' },
        { term: 'chloroplast', definition: 'organelles that do photosynthesis (plants only).' },
        { term: 'membrane', definition: 'a thin layer that controls what passes through.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plant-vs-animal',
      kind: 'worked_example',
      problem: 'You look at two cells under a microscope. Cell A has a rectangular shape, a stiff outer wall, and many green oval structures inside. Cell B is roundish, has no wall (just a membrane), and no green structures. Which is the plant cell, and how do you know?',
      steps: [
        'The green oval structures are CHLOROPLASTS — only plants have them (they do photosynthesis).',
        'The stiff outer WALL keeps plants rigid (think of a tree standing tall) — animals don\'t have one.',
        'Cell A is the plant cell. Cell B (no wall, no chloroplasts) is the animal cell.',
        'The rectangular shape of A is a side-effect of the rigid wall keeping it boxy; animal cells are roundish because they only have a flexible membrane.',
      ],
      answer: 'Cell A is the plant cell — chloroplasts and a cell wall are the giveaways.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Heart muscle cells contract constantly — they need a LOT of energy. Which organelle would you expect to find in unusually high numbers in a heart cell, and why?',
      expectedAnswer: 'mitochondria, because they release energy from food and the heart needs constant energy',
      responseFormat: 'free',
      hints: [
        'Which organelle has the job of producing energy?',
        'Cells with high energy demands tend to have MORE of that organelle.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cells-empty',
      kind: 'misconception_check',
      question: 'A friend draws a cell as a circle with a dot in the middle (the nucleus) and nothing else. They say "the rest is just empty space." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — cells are mostly empty.',
          misconception: 'Thinking cells are mostly empty space with a few isolated organelles.',
          correctsTo: 'Cells are PACKED — cytoplasm fills them, ribosomes float everywhere, membranes thread through, vesicles move materials. The "empty look" in textbook diagrams is just simplification.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'All living things are made of cells.',
        'Each organelle has a job that fits its structure.',
        'Plant cells = animal cells + cell wall + chloroplasts (and a big central vacuole).',
        'Cells with high energy needs have more mitochondria.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Some bacteria don\'t have a nucleus — their DNA floats freely in the cell. We call these PROKARYOTIC. Cells WITH a nucleus (like yours) are EUKARYOTIC. Why might "putting DNA in its own room" have been an evolutionary advantage?',
      hint: 'Think about what could damage DNA, and how separating it from the rest of the cell could help.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
