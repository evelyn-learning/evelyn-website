/**
 * Grades 6-8 Science — Mitosis and Meiosis.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SCI_MITOSIS_MEIOSIS: LessonPlan = {
  id: 'evelyn.g68.science.mitosis-meiosis.v1',
  title: 'Cell Biology — Mitosis vs Meiosis',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'science',
  topic: 'cell-biology',
  locale: 'en',
  los: [
    {
      id: 'g68.sci.cell-biology.mitosis-meiosis',
      description: 'Distinguish mitosis (body cell division) from meiosis (gamete production); explain the roles of each in growth and reproduction.',
      standard: 'NGSS-MS-LS3-2',
    },
  ],
  prerequisites: ['g68.sci.cell-biology.structure'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Cells divide for two completely different reasons — and the math is different for each.',
      script: 'A cut on your finger heals because skin cells divide. A baby is born because a sperm cell met an egg cell. Same word — division — but the cell math is different. Today: mitosis (1 cell → 2 identical) vs meiosis (1 cell → 4 unique).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mitosis-meiosis',
      kind: 'concept',
      goal: 'Purposes, chromosome counts, key differences, when each happens.',
      keyIdeas: [
        'BODY CELLS (somatic cells) have 46 chromosomes in humans (23 pairs). This is the DIPLOID number, written 2n.',
        'SEX CELLS (gametes — sperm, eggs) have 23 chromosomes — half. This is the HAPLOID number, n.',
        'When sperm + egg fuse, you get back to 2n (46 chromosomes) in the new cell.',
        'MITOSIS: 1 parent cell → 2 daughter cells. Each daughter is GENETICALLY IDENTICAL to the parent and has 2n chromosomes.',
        '  Used for: GROWTH (your body grows from 1 cell to trillions), REPAIR (skin heals after a cut), MAINTENANCE (replacing dead cells).',
        '  Happens in body cells.',
        'MEIOSIS: 1 parent cell → 4 daughter cells. Each daughter has n chromosomes (HALF). Each is GENETICALLY UNIQUE.',
        '  Used for: SEXUAL REPRODUCTION — making sperm and eggs.',
        '  Happens only in reproductive organs (ovaries, testes).',
        'WHY meiosis halves the chromosomes: when sperm + egg fuse, each contributes n. n + n = 2n. Without halving, the chromosome count would double every generation.',
        'GENETIC DIVERSITY in meiosis: chromosomes shuffle (random assortment) and exchange pieces (crossing over). This is why siblings look different.',
        'MITOSIS PHASES: Prophase, Metaphase, Anaphase, Telophase (PMAT). DNA copies, lines up, separates, divides.',
        'MEIOSIS has TWO rounds of division (Meiosis I and Meiosis II). That\'s why you get 4 cells, not 2.',
      ],
      vocabulary: [
        { term: 'chromosome', definition: 'a thread-like structure of DNA + protein; humans have 46 chromosomes (23 pairs) in body cells.' },
        { term: 'gamete', definition: 'a sex cell (sperm or egg); contains half the normal chromosome number.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A human skin cell undergoes mitosis. How many chromosomes does each daughter cell have?',
      steps: [
        'Skin cell = body cell, so it has 46 chromosomes (2n) before division.',
        'Mitosis produces 2 daughter cells, each genetically identical to the parent.',
        'Each daughter has 46 chromosomes.',
        'Mitosis preserves the chromosome count.',
      ],
      answer: '46 chromosomes',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A cell undergoes meiosis starting with 46 chromosomes. How many cells does it produce, and how many chromosomes does each have?',
      expectedAnswer: '4 daughter cells, each with 23 chromosomes (n). Meiosis halves the chromosome count and produces four cells (sperm or egg precursors).',
      responseFormat: 'free',
      hints: [
        'Meiosis = TWO rounds of division.',
        'It halves chromosome count — for what reason?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-same-cells',
      kind: 'misconception_check',
      question: 'A student says siblings have the same DNA because they came from the same parents. What about meiosis makes this wrong?',
      commonErrors: [
        {
          answer: 'Siblings = same DNA',
          misconception: 'Forgetting that meiosis produces UNIQUE gametes.',
          correctsTo: 'Each gamete (sperm or egg) is genetically UNIQUE because of (1) RANDOM ASSORTMENT — chromosomes shuffle independently, and (2) CROSSING OVER — chromosome pieces swap during meiosis. So even from the same two parents, each child receives a unique combination. That\'s why siblings (except identical twins) look different. Identical twins come from one fertilised egg that splits — same DNA.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mitosis: 1 → 2 identical cells. For growth/repair. Body cells.',
        'Meiosis: 1 → 4 unique cells. For sexual reproduction. Sex cells.',
        'Body cells = 2n (46 in humans). Gametes = n (23).',
        'Meiosis halves chromosomes so fertilisation restores 2n.',
        'Crossing over + random assortment make each gamete unique.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
