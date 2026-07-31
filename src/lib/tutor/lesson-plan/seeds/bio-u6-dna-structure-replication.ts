/**
 * Biology — Molecular Genetics: DNA Structure & Replication.
 *
 * The structure-to-mechanism template for the HS Biology fan-out
 * (NGSS HS-LS1-1). Almost every error in this topic traces back to one
 * idea students half-learn — that the two strands are COMPLEMENTARY
 * rather than identical — so the concept segment builds pairing first
 * and then shows replication as the payoff of that pairing.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U6_DNA_STRUCTURE_REPLICATION: LessonPlan = {
  id: 'evelyn.hs.bio.dna-structure-replication.v1',
  title: 'DNA Structure & Replication',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.dna-structure-replication',
      standard: 'BIO-6.1',
      description:
        'Describe the nucleotide and double-helix structure of DNA, apply complementary base pairing to write the partner of a given strand, and explain how semiconservative replication copies that sequence accurately (NGSS HS-LS1-1).',
    },
  ],
  prerequisites: ['bio.pedigrees-human-genetics'],
  followUps: ['bio.transcription-translation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame DNA as a readable, copyable sequence that identifies a person and traces their ancestry.',
      script:
        'A crime lab can match a single hair to one person out of billions, and a mail-in ancestry kit can tell you which regions your great-great-grandparents came from. Both do the same thing: they read the order of four letters — A, T, C, G — along a molecule coiled inside your cells. What makes that molecule so useful is that it stores information AND copies itself with astonishing accuracy. In this lesson you will build DNA from its parts, write the partner of any strand yourself, and see why the copying almost never goes wrong.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-structure-and-copying',
      kind: 'concept',
      goal: 'Nucleotide parts, the double helix, complementary and antiparallel pairing, and semiconservative replication.',
      keyIdeas: [
        'THE NUCLEOTIDE — DNA is a polymer of one repeating unit with three parts: a PHOSPHATE group, a DEOXYRIBOSE sugar, and one NITROGENOUS BASE. Only the base changes from unit to unit, and there are four choices: A (adenine), T (thymine), C (cytosine), G (guanine). RNA uses uracil (U) instead of T — but DNA never contains U.',
        'THE DOUBLE HELIX — two strands twist around each other like a spiral staircase. The alternating sugar-phosphate BACKBONE forms the two handrails on the OUTSIDE; the bases point INWARD and meet in the middle as the steps.',
        'COMPLEMENTARY BASE PAIRING — the steps are not random. A always pairs with T, held by TWO hydrogen bonds; C always pairs with G, held by THREE. Each pair is one larger base with one smaller base, so every rung is the same width and the helix stays even. A-C and G-T pairs do not fit and do not form.',
        "CHARGAFF'S RULE — because pairing is strict, in any double-stranded DNA the percentage of A equals the percentage of T, and the percentage of C equals the percentage of G. So knowing %A gives you %T for free, and the remaining percentage splits evenly between C and G.",
        "ANTIPARALLEL STRANDS — each strand has a 5' end and a 3' end, and the two strands run in OPPOSITE directions: where one reads 5' to 3' left-to-right, its partner reads 3' to 5'. This is why writing a complementary strand takes two moves — swap each base for its partner, THEN reverse the order so you can write the answer 5' to 3' like everyone else does.",
        'SEMICONSERVATIVE REPLICATION — to copy DNA the cell pulls the two strands apart and uses EACH old strand as a template for a new partner. The result is two double helices that each keep ONE original strand and one brand-new strand. It is not CONSERVATIVE (one all-old molecule plus one all-new molecule) — no molecule is ever entirely new.',
        'THE ENZYMES — HELICASE unzips the helix by breaking the hydrogen bonds between paired bases, opening a replication fork. DNA POLYMERASE then adds free nucleotides to a growing strand, and it also PROOFREADS, backing up to remove a mismatched base. That proofreading is why errors end up around one in a billion bases.',
        "LEADING VS LAGGING STRAND — DNA polymerase can only build in one direction (5' to 3'), and the two templates run opposite ways. So one new strand — the LEADING strand — is built continuously toward the fork, while the other — the LAGGING strand — is built in short pieces pointing away from the fork and then stitched together. Same chemistry, opposite geometry.",
        'WHY PAIRING IS WHAT MAKES COPYING WORK — because every base has exactly one legal partner, a single strand contains all the information needed to rebuild the other one. Accurate copying is not a separate trick the cell performs; it falls straight out of the structure.',
      ],
      vocabulary: [
        { term: 'nucleotide', definition: 'the repeating unit of DNA: a phosphate, a deoxyribose sugar, and one nitrogenous base.' },
        { term: 'complementary', definition: 'describes the fixed pairing A with T and C with G, so each strand specifies the other.' },
        { term: 'antiparallel', definition: "describes the two strands running in opposite directions, one 5' to 3' and the other 3' to 5'." },
        { term: 'semiconservative', definition: 'describes replication in which each new molecule keeps one original strand and one new strand.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-complementary-strand',
      kind: 'worked_example',
      problem:
        "A DNA template strand reads 5'-ATGCCTAG-3'. Write its complementary strand, and give the answer in the standard 5' to 3' direction.",
      steps: [
        "Pair each base in order, left to right, with its partner: A goes with T, T with A, G with C, C with G, C with G, T with A, A with T, G with C. That gives the letters T A C G G A T C.",
        "Note the direction those letters were written in. They line up underneath the template, and the partner strand is antiparallel, so as written this reads 3'-TACGGATC-5'.",
        "Flip it to the standard 5' to 3' direction by reversing the letter order: TACGGATC read backwards is CTAGGCAT.",
        "Write the finished answer with its ends labeled: 5'-CTAGGCAT-3'. Check one rung as a spot test — the first base of the template, A, sits opposite the LAST base of the answer, T. A with T is legal, so the alignment is right.",
      ],
      answer: "5'-CTAGGCAT-3'",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-semiconservative-trace',
      kind: 'worked_example',
      problem:
        'A single DNA molecule made of two original strands is copied once. A student predicts: "You get the original molecule back untouched, plus one completely new molecule beside it." Trace what actually happens to those two original strands, and say what the two product molecules contain.',
      steps: [
        'Start with what the enzymes do to the original molecule. Helicase breaks the hydrogen bonds between the paired bases and separates the two original strands — so the original molecule does NOT survive intact. That is where the prediction already fails.',
        'Follow each separated strand. Each one is now a template: DNA polymerase reads it and builds a partner along it by complementary pairing, A opposite T and C opposite G.',
        'Assemble the products. Original strand 1 is now paired with a new strand; original strand 2 is now paired with a different new strand. That gives two complete double helices.',
        'Describe each product: one old strand plus one new strand — half conserved, which is exactly what SEMICONSERVATIVE means. The predicted all-old-plus-all-new outcome is the CONSERVATIVE model, and experiments ruled it out.',
        'Sanity-check the sequences. Both products carry the same base sequence as the starting molecule, because each new strand was built as the exact complement of an original strand.',
      ],
      answer:
        'Both product molecules contain one original strand and one newly built strand (semiconservative), and both carry the original base sequence — the prediction described the conservative model, which is not what happens.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-complementary-strand',
      kind: 'try_yourself',
      problem:
        "A DNA strand reads 5'-TTAGCGCA-3'. Which sequence is its complementary strand, written in the standard 5' to 3' direction?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "5'-AATCGCGT-3'" },
        { id: 'b', text: "5'-UUAGCGCA-3'" },
        { id: 'c', text: "5'-TGCGCTAA-3'", correct: true },
        { id: 'd', text: "5'-TTAGCGCA-3'" },
      ],
      expectedAnswer: "5'-TGCGCTAA-3'",
      hints: [
        'Do it in two moves: first swap every base for its partner (A with T, C with G), then handle the direction.',
        "Pairing left to right gives AATCGCGT, but that is written 3' to 5'. Reverse the letter order to report it 5' to 3'.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-chargaff-percentages',
      kind: 'try_yourself',
      problem:
        'A sample of double-stranded DNA is found to be 30% adenine (A). What percentage of the sample is guanine (G)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '20% guanine — thymine is also 30%, leaving 40% to split evenly between C and G', correct: true },
        { id: 'b', text: '30% guanine — all four bases are present in equal amounts' },
        { id: 'c', text: '40% guanine — the leftover 40% after A and T is all guanine' },
        { id: 'd', text: '70% guanine — whatever is not adenine must be guanine' },
      ],
      expectedAnswer: '20% guanine — thymine is also 30%, leaving 40% to split evenly between C and G',
      hints: [
        'A pairs only with T, so start by writing down what the percentage of T must be.',
        'The four percentages add to 100. Subtract A and T, then remember that C and G are also equal to each other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-semiconservative',
      kind: 'try_yourself',
      problem:
        'A DNA molecule made of two original strands goes through one round of replication. What do the two resulting DNA molecules contain?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One molecule made of both original strands, and one molecule made of two brand-new strands' },
        { id: 'b', text: 'Two molecules that are each made entirely of newly built strands' },
        { id: 'c', text: 'Two molecules that each contain one original strand and one original copy of the same strand, so the sequences differ' },
        { id: 'd', text: 'Two molecules that each contain one original strand paired with one newly built strand', correct: true },
      ],
      expectedAnswer: 'Two molecules that each contain one original strand paired with one newly built strand',
      hints: [
        'Helicase separates the two original strands before any new nucleotides are added — so the original pair cannot stay together.',
        'Each separated original strand serves as a template for one new partner. That is what "semiconservative" names.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-identical-strands',
      kind: 'misconception_check',
      question:
        'A student says: "The two strands of DNA are identical copies of each other — that is why the cell can rebuild one strand from the other." What went wrong?',
      commonErrors: [
        {
          answer: 'The two strands carry the same sequence of bases',
          misconception:
            'Confusing COMPLEMENTARY with IDENTICAL — hearing that either strand can regenerate the other and concluding they must read the same.',
          correctsTo:
            "The strands are complementary, not identical: opposite 5'-ATGC-3' sits 3'-TACG-5', a different sequence entirely. Rebuilding works precisely BECAUSE each base has exactly one legal partner — A only with T, C only with G — so a strand specifies its partner without duplicating it. If the strands really were identical, an A would have to sit opposite an A, and that pair does not fit inside the helix.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A nucleotide is phosphate + deoxyribose sugar + one base (A, T, C, G). DNA uses T, never U.',
        'Double helix: sugar-phosphate backbone on the outside, paired bases on the inside.',
        'A pairs with T (two hydrogen bonds), C pairs with G (three) — so %A = %T and %C = %G.',
        "Strands are antiparallel, so writing a complementary strand means swap each base AND reverse the order to report it 5' to 3'.",
        'Replication is semiconservative: helicase unzips, DNA polymerase builds and proofreads, and every product keeps one old strand plus one new one.',
        'Complementary pairing is what makes accurate copying possible — each strand alone carries the whole message.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'DNA Structure & Replication' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
