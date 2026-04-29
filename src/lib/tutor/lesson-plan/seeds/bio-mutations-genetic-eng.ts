/**
 * HS Biology — Mutations and Genetic Engineering.
 * NGSS HS-LS3-2: structural changes to genes can result in harmful,
 * beneficial, or neutral effects.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_MUTATIONS_GENETIC_ENG: LessonPlan = {
  id: 'evelyn.hs.science.biology.mutations-genetic-eng.v1',
  title: 'Mutations and Genetic Engineering',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'genetics', locale: 'en',
  los: [{ id: 'ngss.hs-ls3-2', description: 'Structural changes to genes may affect proteins.', standard: 'NGSS.HS-LS3-2' }],
  prerequisites: ['hs.bio.protein-synthesis'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor with two real mutations.', script: 'A single base change in one gene caused sickle cell disease. A different mutation in the same lineage gives MALARIA RESISTANCE. Same kind of mutation, different effects. Today we explore how DNA changes shape life.', estimatedMinutes: 2 },
    { id: 'concept-mutation-types', kind: 'concept', goal: 'Mutations: point (substitution, insertion, deletion), chromosomal. Effects: silent, missense, nonsense, frameshift.', keyIdeas: [
      'POINT mutations: change one base.',
      '  · SILENT — changes codon but same amino acid (no protein effect).',
      '  · MISSENSE — different amino acid (sickle cell: glutamate → valine).',
      '  · NONSENSE — early STOP codon (truncated, often nonfunctional protein).',
      'INSERTIONS / DELETIONS: add/remove base(s).',
      '  · Multiple of 3 → still in frame (might just add/remove an amino acid).',
      '  · NOT multiple of 3 → FRAMESHIFT — every codon downstream is wrong. Usually catastrophic.',
      'CHROMOSOMAL: inversion, deletion, duplication, translocation. Affects MANY genes.',
      'Mutations CAUSED BY: radiation (UV, X-ray), chemicals (mutagens), replication errors, viruses.',
    ], vocabulary: [{ term: 'mutation', definition: 'change in DNA sequence.' }, { term: 'frameshift', definition: 'insertion/deletion shifts reading frame.' }, { term: 'mutagen', definition: 'something that causes mutations.' }], estimatedMinutes: 5 },
    { id: 'concept-genetic-eng', kind: 'concept', goal: 'Genetic engineering: deliberately changing DNA. CRISPR, gene cloning, GMOs.', keyIdeas: [
      'CRISPR-Cas9: a precise gene-editing tool. A guide RNA targets a specific DNA sequence; Cas9 cuts; cell\'s repair machinery edits.',
      'GENE CLONING: copy a gene of interest (e.g., insulin gene → into bacteria → bacteria produce human insulin for diabetics).',
      'GMOs (Genetically Modified Organisms): crops engineered for pest resistance, longer shelf life, vitamin enrichment (e.g., Golden Rice).',
      'GENE THERAPY: replace defective genes in a patient (treats some inherited diseases).',
      'ETHICS: powerful technology raises questions (designer babies, ecological release of GMOs, consent in gene therapy).',
    ], vocabulary: [{ term: 'CRISPR', definition: 'precise gene-editing tool.' }, { term: 'GMO', definition: 'genetically modified organism.' }, { term: 'gene therapy', definition: 'treating disease by altering genes.' }], estimatedMinutes: 4 },
    { id: 'worked-frameshift', kind: 'worked_example', problem: 'Original mRNA: 5\'-AUG-UCG-AAA-CCC-UGA-3\'. A single A is INSERTED right after AUG. Show the new reading frame.', steps: [
      'Original codons: AUG / UCG / AAA / CCC / UGA → Met / Ser / Lys / Pro / STOP.',
      'After inserting A: AUG-A-UCG-AAA-CCC-UGA → AUG / AUC / GAA / ACC / CUG / A...',
      'Recoded: Met / Ile / Glu / Thr / Leu / ... (no stop yet — continues until next chance STOP).',
      'Every codon downstream is wrong. The protein is completely different and probably nonfunctional.',
    ], answer: 'Frameshift — entire downstream protein is wrong. Likely nonfunctional.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Sickle cell disease is caused by a single base change (A → T) that changes one amino acid (glutamate → valine) in hemoglobin. What kind of point mutation is this?', expectedAnswer: 'MISSENSE mutation — different amino acid, still translates to a (defective) protein.', responseFormat: 'free', hints: ['Same number of bases (just one changed).', 'Different amino acid as a result.'], estimatedMinutes: 2 },
    { id: 'misconception-mutations-bad', kind: 'misconception_check', question: 'A friend says "all mutations are harmful." Right?', commonErrors: [{ answer: 'Yes — all bad.', misconception: 'Treating mutations as uniformly negative.', correctsTo: 'Most mutations are NEUTRAL (silent, in non-coding regions, etc.). SOME are harmful. A FEW are BENEFICIAL — they\'re the raw material for evolution. Sickle cell carriers are protected from malaria. Antibiotic resistance evolves through beneficial (to bacteria) mutations.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Mutation types: point (silent/missense/nonsense), insertion, deletion (frameshift), chromosomal.', 'Effects range from neutral to catastrophic.', 'Genetic engineering: CRISPR, cloning, GMOs, gene therapy.', 'Ethics matter.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
