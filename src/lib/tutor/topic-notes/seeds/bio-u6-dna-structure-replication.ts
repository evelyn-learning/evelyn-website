/**
 * Biology — Unit 6 CED 6.1: DNA Structure & Replication.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.dna-structure-replication.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U6_DNA_STRUCTURE_REPLICATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.dna-structure-replication.v1',
  course: 'Biology',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'DNA Structure & Replication',
  planId: 'evelyn.hs.bio.dna-structure-replication.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.dna-structure-replication.v1' }],
  theory: [
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'The nucleotide', content: `THE NUCLEOTIDE — DNA is a polymer of one repeating unit with three parts: a PHOSPHATE group, a DEOXYRIBOSE sugar, and one NITROGENOUS BASE. Only the base changes from unit to unit, and there are four choices: A (adenine), T (thymine), C (cytosine), G (guanine). RNA uses uracil (U) instead of T — but DNA never contains U.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'The double helix', content: `THE DOUBLE HELIX — two strands twist around each other like a spiral staircase. The alternating sugar-phosphate BACKBONE forms the two handrails on the OUTSIDE; the bases point INWARD and meet in the middle as the steps.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'Complementary base pairing', content: `COMPLEMENTARY BASE PAIRING — the steps are not random. A always pairs with T, held by TWO hydrogen bonds; C always pairs with G, held by THREE. Each pair is one larger base with one smaller base, so every rung is the same width and the helix stays even. A-C and G-T pairs do not fit and do not form.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: `Chargaff's rule`, content: `CHARGAFF'S RULE — because pairing is strict, in any double-stranded DNA the percentage of A equals the percentage of T, and the percentage of C equals the percentage of G. So knowing %A gives you %T for free, and the remaining percentage splits evenly between C and G.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'Antiparallel strands', content: `ANTIPARALLEL STRANDS — each strand has a 5' end and a 3' end, and the two strands run in OPPOSITE directions: where one reads 5' to 3' left-to-right, its partner reads 3' to 5'. This is why writing a complementary strand takes two moves — swap each base for its partner, THEN reverse the order so you can write the answer 5' to 3' like everyone else does.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'Semiconservative replication', content: `SEMICONSERVATIVE REPLICATION — to copy DNA the cell pulls the two strands apart and uses EACH old strand as a template for a new partner. The result is two double helices that each keep ONE original strand and one brand-new strand. It is not CONSERVATIVE (one all-old molecule plus one all-new molecule) — no molecule is ever entirely new.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'The enzymes', content: `THE ENZYMES — HELICASE unzips the helix by breaking the hydrogen bonds between paired bases, opening a replication fork. DNA POLYMERASE then adds free nucleotides to a growing strand, and it also PROOFREADS, backing up to remove a mismatched base. That proofreading is why errors end up around one in a billion bases.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'Leading vs lagging strand', content: `LEADING VS LAGGING STRAND — DNA polymerase can only build in one direction (5' to 3'), and the two templates run opposite ways. So one new strand — the LEADING strand — is built continuously toward the fork, while the other — the LAGGING strand — is built in short pieces pointing away from the fork and then stitched together. Same chemistry, opposite geometry.` },
    { loId: 'bio.dna-structure-replication', kind: 'framework', title: 'Why pairing is what makes copying work', content: `WHY PAIRING IS WHAT MAKES COPYING WORK — because every base has exactly one legal partner, a single strand contains all the information needed to rebuild the other one. Accurate copying is not a separate trick the cell performs; it falls straight out of the structure.` },
    { loId: 'bio.dna-structure-replication', kind: 'definition', title: 'nucleotide', content: `the repeating unit of DNA: a phosphate, a deoxyribose sugar, and one nitrogenous base.` },
    { loId: 'bio.dna-structure-replication', kind: 'definition', title: 'complementary', content: `describes the fixed pairing A with T and C with G, so each strand specifies the other.` },
    { loId: 'bio.dna-structure-replication', kind: 'definition', title: 'antiparallel', content: `describes the two strands running in opposite directions, one 5' to 3' and the other 3' to 5'.` },
    { loId: 'bio.dna-structure-replication', kind: 'definition', title: 'semiconservative', content: `describes replication in which each new molecule keeps one original strand and one new strand.` },
  ],
  methods: [
    {
      title: 'Worked complementary strand',
      steps: [
        `Pair each base in order, left to right, with its partner: A goes with T, T with A, G with C, C with G, C with G, T with A, A with T, G with C. That gives the letters T A C G G A T C.`,
        `Note the direction those letters were written in. They line up underneath the template, and the partner strand is antiparallel, so as written this reads 3'-TACGGATC-5'.`,
        `Flip it to the standard 5' to 3' direction by reversing the letter order: TACGGATC read backwards is CTAGGCAT.`,
        `Write the finished answer with its ends labeled: 5'-CTAGGCAT-3'. Check one rung as a spot test — the first base of the template, A, sits opposite the LAST base of the answer, T. A with T is legal, so the alignment is right.`,
      ],
      example: { problem: `A DNA template strand reads 5'-ATGCCTAG-3'. Write its complementary strand, and give the answer in the standard 5' to 3' direction.`, solution: `5'-CTAGGCAT-3'` },
      relatedLoIds: ['bio.dna-structure-replication'],
    },
    {
      title: 'Worked semiconservative trace',
      steps: [
        `Start with what the enzymes do to the original molecule. Helicase breaks the hydrogen bonds between the paired bases and separates the two original strands — so the original molecule does NOT survive intact. That is where the prediction already fails.`,
        `Follow each separated strand. Each one is now a template: DNA polymerase reads it and builds a partner along it by complementary pairing, A opposite T and C opposite G.`,
        `Assemble the products. Original strand 1 is now paired with a new strand; original strand 2 is now paired with a different new strand. That gives two complete double helices.`,
        `Describe each product: one old strand plus one new strand — half conserved, which is exactly what SEMICONSERVATIVE means. The predicted all-old-plus-all-new outcome is the CONSERVATIVE model, and experiments ruled it out.`,
        `Sanity-check the sequences. Both products carry the same base sequence as the starting molecule, because each new strand was built as the exact complement of an original strand.`,
      ],
      example: { problem: `A single DNA molecule made of two original strands is copied once. A student predicts: "You get the original molecule back untouched, plus one completely new molecule beside it." Trace what actually happens to those two original strands, and say what the two product molecules contain.`, solution: `Both product molecules contain one original strand and one newly built strand (semiconservative), and both carry the original base sequence — the prediction described the conservative model, which is not what happens.` },
      relatedLoIds: ['bio.dna-structure-replication'],
    },
  ],
  pointers: [
    { content: `The strands are complementary, not identical: opposite 5'-ATGC-3' sits 3'-TACG-5', a different sequence entirely. Rebuilding works precisely BECAUSE each base has exactly one legal partner — A only with T, C only with G — so a strand specifies its partner without duplicating it. If the strands really were identical, an A would have to sit opposite an A, and that pair does not fit inside the helix.`, kind: 'common-error' },
    { content: `A nucleotide is phosphate + deoxyribose sugar + one base (A, T, C, G). DNA uses T, never U.`, kind: 'tip' },
    { content: `Double helix: sugar-phosphate backbone on the outside, paired bases on the inside.`, kind: 'tip' },
    { content: `A pairs with T (two hydrogen bonds), C pairs with G (three) — so %A = %T and %C = %G.`, kind: 'tip' },
    { content: `Strands are antiparallel, so writing a complementary strand means swap each base AND reverse the order to report it 5' to 3'.`, kind: 'tip' },
    { content: `Replication is semiconservative: helicase unzips, DNA polymerase builds and proofreads, and every product keeps one old strand plus one new one.`, kind: 'tip' },
    { content: `Complementary pairing is what makes accurate copying possible — each strand alone carries the whole message.`, kind: 'tip' },
    { content: `Writing a complementary strand takes TWO moves, not one: swap each base for its partner, **then reverse the order** to report it 5'→3'. Stopping after the swap gives the right letters in backwards order — a very common lost point.`, kind: 'common-error' },
    { content: `Always label the ends: 5'-CTAGGCAT-3'. An unlabeled string of letters is ambiguous — the same 8 letters mean two different strands depending on direction. Drop the primes and your answer can't be checked.`, kind: 'vocab-note' },
    { content: `Complementary ≠ identical. Opposite 5'-ATGC-3' sits 3'-TACG-5', a *different* sequence. Either strand can rebuild the other because each base has exactly one legal partner — not because they read the same.`, kind: 'gotcha' },
    { content: `Never write U in a DNA answer. Uracil belongs to RNA only; DNA always uses thymine. If a U appears in your complementary strand, you've slipped into RNA rules.`, kind: 'common-error' },
    { content: `Chargaff's rule only holds for **double-stranded** DNA. In a single strand (or in RNA) %A need not equal %T. Also: 30% A means 30% T, leaving 40% to split — so G is 20%, not 40%.`, kind: 'edge-case' },
    { content: `Semiconservative means EVERY product molecule is half old, half new. There is no all-old molecule and no all-new molecule — that's the conservative model, which experiments ruled out.`, kind: 'vocab-note' },
    { content: `Helicase breaks hydrogen bonds between paired bases, NOT the sugar-phosphate backbone. The backbone stays intact the whole time — that's why each old strand survives as a usable template.`, kind: 'gotcha' },
    { content: `Leading vs lagging is about geometry, not chemistry. DNA polymerase builds 5'→3' on both; because the templates run opposite ways, one strand is continuous toward the fork and the other is made in pieces pointing away.`, kind: 'tip' },
  ],
};
