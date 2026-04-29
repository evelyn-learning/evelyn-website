/**
 * HS Biology — Cell Cycle and Mitosis.
 * NGSS HS-LS1-4: cellular division during cell cycle.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_CELL_CYCLE_MITOSIS: LessonPlan = {
  id: 'evelyn.hs.science.biology.cell-cycle-mitosis.v1',
  title: 'Cell Cycle and Mitosis',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'cell-biology', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-4', description: 'Use a model to illustrate the role of cellular division (mitosis) and differentiation in producing and maintaining complex organisms.', standard: 'NGSS.HS-LS1-4' }],
  prerequisites: ['ngss.ms-ls1-1'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in scale.', script: 'Your body produces ~25 million NEW cells every second to replace dying ones. That\'s mitosis at work — the controlled cell division that makes growth, healing, and replacement possible.', estimatedMinutes: 2 },
    { id: 'concept-cell-cycle', kind: 'concept', goal: 'Cell cycle has phases: G1, S, G2 (interphase) + M (mitosis) + cytokinesis.', keyIdeas: [
      'INTERPHASE (90% of cycle):',
      '  · G1 — cell grows; performs normal functions.',
      '  · S — DNA REPLICATED (now 2 copies of each chromosome).',
      '  · G2 — cell prepares for division; checks DNA for errors.',
      'M PHASE (mitosis): nucleus divides into two identical nuclei.',
      'CYTOKINESIS: cytoplasm divides → two complete daughter cells.',
      'Result: 1 parent cell → 2 GENETICALLY IDENTICAL daughter cells.',
      'CHECKPOINTS at G1/S, G2/M, M/anaphase ensure quality. Failure → cell death (apoptosis) or cancer if checkpoints fail.',
    ], vocabulary: [{ term: 'mitosis', definition: 'nuclear division producing 2 identical nuclei.' }, { term: 'cytokinesis', definition: 'splitting of the cytoplasm.' }, { term: 'chromosome', definition: 'DNA + proteins, condensed during division.' }], estimatedMinutes: 4 },
    { id: 'concept-mitosis-stages', kind: 'concept', goal: 'Four mitosis stages: prophase, metaphase, anaphase, telophase (PMAT).', keyIdeas: [
      'PROPHASE: chromatin condenses into visible chromosomes (each 2 chromatids). Nuclear envelope breaks down. Spindle fibers form.',
      'METAPHASE: chromosomes line up at the cell\'s equator (metaphase plate). Spindle fibers attach.',
      'ANAPHASE: sister chromatids PULLED APART to opposite poles by spindle fibers.',
      'TELOPHASE: chromosomes reach poles; new nuclear envelopes form; chromosomes decondense.',
      'CYTOKINESIS overlaps with telophase: cell membrane pinches in (animals) or cell plate forms (plants).',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'worked-mitosis-trace', kind: 'worked_example', problem: 'A cell with 4 chromosomes enters mitosis. Trace what happens at each stage.', steps: [
      'Before: 4 chromosomes, each replicated to 2 chromatids = 8 total chromatids attached in pairs.',
      'PROPHASE: chromatin condenses. 4 visible X-shaped chromosomes (paired chromatids).',
      'METAPHASE: 4 chromosomes line up at equator.',
      'ANAPHASE: sister chromatids separated → 4 single chromatids move to each pole.',
      'TELOPHASE: each pole has 4 single chromosomes. Nuclei reform.',
      'CYTOKINESIS: 2 daughter cells, each with 4 chromosomes — same as parent.',
    ], answer: '2 daughter cells, each genetically identical to the original (4 chromosomes each).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A cell skips its G2 checkpoint and enters mitosis with damaged DNA. What\'s the likely consequence?', expectedAnswer: 'Damaged DNA gets passed to both daughter cells → mutations propagate. If checkpoints repeatedly fail, cells with errors keep dividing → can lead to CANCER. Normally cells with severe damage trigger APOPTOSIS (programmed death) instead of dividing.', responseFormat: 'free', hints: ['Checkpoints catch errors before division.', 'Failed checkpoints + division = uncontrolled growth.'], estimatedMinutes: 3 },
    { id: 'misconception-mitosis-makes-different-cells', kind: 'misconception_check', question: 'A friend says "mitosis creates different cell types — that\'s how a body has skin and muscle and bone." Right?', commonErrors: [{ answer: 'Yes — mitosis makes different cells.', misconception: 'Confusing division with differentiation.', correctsTo: 'Mitosis produces IDENTICAL daughter cells. DIFFERENT cell types (skin, muscle) come from DIFFERENTIATION — cells turning ON different genes during development. All your cells have the same DNA; they just express different parts.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Cell cycle: G1 → S (DNA replication) → G2 → M → cytokinesis.', 'Mitosis stages: PMAT.', 'Result: 2 identical daughter cells.', 'Checkpoints prevent cancer.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
