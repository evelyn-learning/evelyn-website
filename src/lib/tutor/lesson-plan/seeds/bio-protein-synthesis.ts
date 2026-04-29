/**
 * HS Biology — Protein Synthesis (Transcription + Translation).
 * NGSS HS-LS1-1: DNA codes proteins via transcription + translation.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_PROTEIN_SYNTHESIS: LessonPlan = {
  id: 'evelyn.hs.science.biology.protein-synthesis.v1',
  title: 'Protein Synthesis: Transcription and Translation',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'genetics', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-1', description: 'Construct an explanation for how DNA structure determines protein structure which carries out essential functions.', standard: 'NGSS.HS-LS1-1' }],
  prerequisites: ['hs.bio.dna-structure-replication'], followUps: [], estimatedMinutes: 25,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor the chain.', script: 'DNA codes for proteins. Proteins do almost everything in cells — build structures, catalyze reactions, transport molecules. The bridge from DNA to protein is the central dogma of molecular biology.', estimatedMinutes: 2 },
    { id: 'concept-central-dogma', kind: 'concept', goal: 'DNA → mRNA (transcription) → protein (translation).', keyIdeas: [
      'CENTRAL DOGMA: DNA → RNA → Protein.',
      'TRANSCRIPTION: in nucleus. DNA → mRNA.',
      'TRANSLATION: in cytoplasm/ribosome. mRNA → protein.',
      'Why this two-step path: keeps DNA safe in nucleus; mRNA is the working copy that goes out.',
    ], vocabulary: [{ term: 'transcription', definition: 'making mRNA from DNA.' }, { term: 'translation', definition: 'making protein from mRNA.' }, { term: 'mRNA', definition: 'messenger RNA — the working copy.' }, { term: 'ribosome', definition: 'where translation happens.' }], estimatedMinutes: 3 },
    { id: 'concept-transcription', kind: 'concept', goal: 'RNA polymerase reads DNA and synthesizes mRNA.', keyIdeas: [
      'RNA POLYMERASE binds at promoter sequence.',
      'Unzips a section of DNA, reads template strand 3\' → 5\'.',
      'Adds RNA nucleotides 5\' → 3\' (RNA uses URACIL instead of thymine).',
      'Pre-mRNA is processed: introns removed, exons joined, 5\' cap + 3\' poly-A tail added.',
      'Mature mRNA exits nucleus through nuclear pores.',
    ], estimatedMinutes: 4 },
    { id: 'concept-translation', kind: 'concept', goal: 'Ribosome reads mRNA in codons (3 bases) → adds amino acids → forms protein.', keyIdeas: [
      'mRNA read in CODONS: 3-nucleotide units. 64 possible codons → ~20 amino acids.',
      'GENETIC CODE: each codon specifies an amino acid (or START/STOP).',
      'tRNA (transfer RNA): carries amino acids. Has ANTICODON matching mRNA codon.',
      'Ribosome (rRNA + protein) reads mRNA codon by codon, matches with tRNA, links amino acids.',
      'START codon: AUG (also codes for methionine).',
      'STOP codons: UAA, UAG, UGA — release the protein.',
      'Resulting AMINO ACID CHAIN folds into 3D protein with specific function.',
    ], vocabulary: [{ term: 'codon', definition: '3-base mRNA unit coding for one amino acid.' }, { term: 'tRNA', definition: 'carries amino acids to ribosome.' }, { term: 'anticodon', definition: 'tRNA bases matching mRNA codon.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'worked-decode', kind: 'worked_example', problem: 'mRNA sequence: 5\'-AUG-UCG-AAA-UGA-3\'. Decode it.', steps: [
      'Read in codons: AUG / UCG / AAA / UGA.',
      'AUG = START / Methionine (Met).',
      'UCG = Serine (Ser).',
      'AAA = Lysine (Lys).',
      'UGA = STOP.',
      'Resulting peptide: Met-Ser-Lys, then STOP. (Three amino acids; methionine often removed later.)',
    ], answer: 'Methionine-Serine-Lysine, then stop. A 3-amino-acid peptide.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A single DNA base mutation changes one mRNA codon from UCG (serine) to UCA (also serine). Will the protein be different?', expectedAnswer: 'NO. Both UCG and UCA code for serine — the genetic code is REDUNDANT. This is a SILENT mutation. Same protein.', responseFormat: 'free', hints: ['Look up both codons.', 'Same amino acid → same protein.'], estimatedMinutes: 3 },
    { id: 'misconception-one-gene-one-protein', kind: 'misconception_check', question: 'A friend says "one gene = one protein, always." Is it that simple?', commonErrors: [{ answer: 'Yes — 1:1.', misconception: 'Oversimplifying gene expression.', correctsTo: 'Many genes can be SPLICED differently (alternative splicing) → multiple proteins from one gene. Some genes code for RNA only (tRNA, rRNA). Some proteins are made of multiple subunits from different genes. The "one gene = one protein" idea is a useful simplification but not literal.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Central dogma: DNA → RNA → protein.', 'Transcription in nucleus; translation in ribosomes.', 'Codons (3 bases) → amino acids.', 'Genetic code is redundant (silent mutations possible).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
