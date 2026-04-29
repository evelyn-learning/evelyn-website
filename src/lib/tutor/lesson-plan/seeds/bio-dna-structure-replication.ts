/**
 * HS Biology — DNA Structure and Replication.
 * NGSS HS-LS3-1: DNA structure determines protein structure.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_DNA_STRUCTURE_REPLICATION: LessonPlan = {
  id: 'evelyn.hs.science.biology.dna-structure-replication.v1',
  title: 'DNA Structure and Replication',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'genetics', locale: 'en',
  los: [{ id: 'ngss.hs-ls3-1', description: 'Ask questions to clarify relationships about the role of DNA and chromosomes in coding the instructions for characteristic traits.', standard: 'NGSS.HS-LS3-1' }],
  prerequisites: ['ngss.ms-ls3-1'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in scale.', script: 'Every cell in your body contains 2 meters of DNA, packed into a nucleus a few micrometers wide. The instructions for building YOU are written in just 4 letters: A, T, G, C.', estimatedMinutes: 2 },
    { id: 'concept-double-helix', kind: 'concept', goal: 'DNA is a double helix of nucleotides. Bases pair: A-T, G-C.', keyIdeas: [
      'NUCLEOTIDE = sugar (deoxyribose) + phosphate + nitrogen base (A, T, G, or C).',
      'Two strands twist into a DOUBLE HELIX (Watson + Crick + Franklin, 1953).',
      'Sugar-phosphate BACKBONE on outside; bases on inside.',
      'BASE PAIRING: A pairs with T (2 H-bonds); G pairs with C (3 H-bonds). COMPLEMENTARY.',
      'Strands are ANTIPARALLEL (5\' → 3\' on one; 3\' → 5\' on the other).',
      'A gene is a sequence of bases coding for a protein.',
    ], vocabulary: [{ term: 'nucleotide', definition: 'DNA monomer (sugar + phosphate + base).' }, { term: 'complementary', definition: 'A-T and G-C pairing.' }, { term: 'antiparallel', definition: 'strands run in opposite directions.' }], estimatedMinutes: 4 },
    { id: 'concept-replication', kind: 'concept', goal: 'Replication is semiconservative: each new DNA has one original + one new strand.', keyIdeas: [
      'HELICASE unzips the double helix.',
      'PRIMASE places RNA primers.',
      'DNA POLYMERASE reads each parent strand 3\' → 5\' and adds complementary nucleotides 5\' → 3\'.',
      'LEADING strand: synthesized continuously.',
      'LAGGING strand: synthesized in fragments (Okazaki fragments) joined by LIGASE.',
      'Result: 2 identical DNA molecules, each with one OLD + one NEW strand (semiconservative).',
      'Speed: ~50 nucleotides/sec in humans; ~1000/sec in bacteria. Multiple origin sites in long genomes.',
    ], vocabulary: [{ term: 'helicase', definition: 'enzyme that unzips DNA.' }, { term: 'DNA polymerase', definition: 'enzyme that synthesizes new DNA.' }, { term: 'semiconservative', definition: 'each new DNA has 1 old strand + 1 new.' }], estimatedMinutes: 5 },
    { id: 'worked-complementary', kind: 'worked_example', problem: 'A DNA strand reads 5\'-ATCGGAT-3\'. What is the complementary strand?', steps: [
      'Pair each base: A↔T, T↔A, C↔G, G↔C, G↔C, A↔T, T↔A.',
      'Reading 3\' to 5\': T A G C C T A.',
      'Standardly written 5\' to 3\': A T C C G A T.',
      'Complementary strand (5\' → 3\'): ATCCGAT.',
    ], answer: '5\'-ATCCGAT-3\'.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'If a piece of DNA is 30% adenine (A), what percentage is guanine (G)?', expectedAnswer: '20%. By Chargaff\'s rule (base-pairing): A=T, G=C. If A=30%, then T=30%. Remaining 40% is G+C, split equally → G=20%, C=20%.', responseFormat: 'numeric', hints: ['A pairs with T, so they\'re equal.', 'A+T+G+C = 100%; G=C.'], estimatedMinutes: 2 },
    { id: 'misconception-dna-just-info', kind: 'misconception_check', question: 'A friend says "DNA is just static information — like a book on a shelf." Is DNA passive?', commonErrors: [{ answer: 'Yes — passive.', misconception: 'Treating DNA as static text.', correctsTo: 'DNA is constantly read (transcribed), repaired (when damaged), replicated (during cell division), and regulated (some genes turned on, others off). It\'s an ACTIVE molecule, not a passive book.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['DNA: double helix; A-T, G-C base pairing; antiparallel strands.', 'Replication: helicase unzips, polymerase copies, ligase joins.', 'Semiconservative: 1 old + 1 new strand per new DNA.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
