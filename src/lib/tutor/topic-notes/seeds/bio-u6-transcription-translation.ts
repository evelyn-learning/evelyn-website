/**
 * Biology — Unit 6 CED 6.2: Transcription, Translation & the Central Dogma.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.transcription-translation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U6_TRANSCRIPTION_TRANSLATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.transcription-translation.v1',
  course: 'Biology',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Transcription, Translation & the Central Dogma',
  planId: 'evelyn.hs.bio.transcription-translation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.transcription-translation.v1' }],
  theory: [
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'The central dogma', content: `THE CENTRAL DOGMA — information flows DNA → RNA → protein. DNA is the master file that stays in the nucleus; RNA is the disposable working copy that travels; protein is the finished machine that does the job. Two steps, two names: making the RNA copy is TRANSCRIPTION, building the protein from it is TRANSLATION.` },
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'Rna is not dna', content: `RNA IS NOT DNA — three differences, every time. RNA uses the sugar RIBOSE (DNA uses deoxyribose); RNA uses URACIL (U) wherever DNA would use thymine (T); RNA is SINGLE-stranded, not a double helix. If a T ever appears in your mRNA, you have made a mistake.` },
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'Transcription', content: `TRANSCRIPTION — happens in the NUCLEUS. The enzyme RNA POLYMERASE unzips a stretch of DNA and builds an mRNA strand by base-pairing against the template strand: DNA C pairs with RNA G, DNA G with C, DNA T with A, and DNA A with U (not T). The finished mRNA leaves the nucleus through a pore.` },
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'Translation', content: `TRANSLATION — happens at a RIBOSOME out in the CYTOPLASM. The ribosome clamps onto the mRNA and reads it three bases at a time, adding one amino acid per word, until the chain is finished and folds into a protein. Nothing is translated inside the nucleus.` },
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'Codons are three-base words', content: `CODONS ARE THREE-BASE WORDS — a CODON is three mRNA bases read together, and each codon names one amino acid. Reading always starts at the START CODON AUG (which itself codes for methionine) and moves in threes from there. Three codons — UAA, UAG and UGA — are STOP codons: they name no amino acid and simply end the chain.` },
    { loId: 'bio.transcription-translation', content: `tRNA CARRIES THE AMINO ACIDS — each transfer-RNA molecule holds a specific amino acid at one end and a three-base ANTICODON at the other. The anticodon base-pairs with the matching mRNA codon, which is how the right amino acid lands in the right spot. Codon AUG is met by anticodon UAC.` },
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'Redundant but not ambiguous', content: `REDUNDANT BUT NOT AMBIGUOUS — there are 64 codons for only about 20 amino acids, so most amino acids have several codons: GUU, GUC, GUA and GUG all code for valine. That is REDUNDANCY. But no single codon ever codes for two different amino acids, so reading is never a guess — given a codon, the amino acid is certain.` },
    { loId: 'bio.transcription-translation', kind: 'framework', title: 'Reading a codon chart in words', content: `READING A CODON CHART IN WORDS — find AUG, then cut the rest into groups of three without regrouping partway, look up each group, and stop at the first stop codon. The bases after a stop codon are simply not translated.` },
    { loId: 'bio.transcription-translation', kind: 'definition', title: 'codon', content: 'a group of three mRNA bases that names one amino acid or a stop signal.' },
    { loId: 'bio.transcription-translation', kind: 'definition', title: 'anticodon', content: 'the three bases on a tRNA that pair with a matching mRNA codon.' },
    { loId: 'bio.transcription-translation', kind: 'definition', title: 'mRNA', content: `messenger RNA — the single-stranded working copy of a gene that carries the message out of the nucleus.` },
  ],
  methods: [
    {
      title: 'Worked full trace',
      steps: [
        `Transcribe by PAIRING, not copying. Take the template one base at a time: DNA T gives RNA A, DNA A gives RNA U, DNA C gives RNA G. So TAC becomes AUG.`,
        `Continue through the rest of the template: CAC gives GUG, GGA gives CCU, ATT gives UAA. The full mRNA is 5'-AUGGUGCCUUAA-3'. Check it: no T anywhere, because RNA uses U.`,
        `Send the mRNA out of the nucleus to a ribosome in the cytoplasm, and cut it into codons starting at AUG: AUG / GUG / CCU / UAA.`,
        `Translate word by word using the meanings given: AUG is the start and places methionine, GUG places valine, CCU places proline, and UAA is a stop codon that ends the chain without adding an amino acid.`,
        `Count what was actually built: three amino acids, because the stop codon is punctuation, not a fourth amino acid.`,
      ],
      example: { problem: `A gene has the DNA template strand 3'-TACCACGGAATT-5'. Transcribe it into mRNA, then translate it. Use these codon meanings: AUG codes for methionine and is the start codon, GUG codes for valine, CCU codes for proline, and UAA is a stop codon.`, solution: `mRNA 5'-AUGGUGCCUUAA-3'; the polypeptide is methionine-valine-proline, built at a ribosome in the cytoplasm.` },
      relatedLoIds: ['bio.transcription-translation'],
    },
    {
      title: 'Worked copied template',
      steps: [
        `Name what the student actually did: they COPIED the template letter for letter and swapped T for U. Transcription does not copy the template — RNA polymerase base-PAIRS against it, so every base changes.`,
        `Test the student's answer for a start codon. Their mRNA begins UAC, which codes for tyrosine, not AUG. A ribosome would have nothing to start on — a strong sign the strand was copied instead of paired.`,
        `Redo it by pairing: DNA T gives A, DNA A gives U, DNA C gives G. So the template TAC gives AUG — the start codon, exactly what should appear.`,
        `Finish the strand the same way: AAA gives UUU, CCT gives GGA. The correct mRNA is 5'-AUGUUUGGA-3'. Notice it contains no T, and notice it is the student's answer with every base flipped to its partner.`,
        `Translate to confirm it makes sense: AUG / UUU / GGA gives methionine-phenylalanine-glycine — a real polypeptide that starts where it should.`,
      ],
      example: { problem: `A student is given the DNA template strand 3'-TACAAACCT-5' and writes the mRNA as 5'-UACAAACCU-3', explaining that they "changed every T to a U." Find the error and produce the correct mRNA. Codon meanings you need: AUG codes for methionine and is the start codon, UUU codes for phenylalanine, GGA codes for glycine, and UAC codes for tyrosine.`, solution: `The mRNA must be paired against the template, not copied from it: 5'-AUGUUUGGA-3', which translates to methionine-phenylalanine-glycine.` },
      relatedLoIds: ['bio.transcription-translation'],
    },
  ],
  pointers: [
    { content: `Redundancy runs the other way. Several codons can name the SAME amino acid — GUU, GUC, GUA and GUG all place valine — but no codon ever names two different amino acids. Given GUA, the answer is valine, every time, in every organism. The code is redundant but NOT ambiguous, which is exactly why a gene makes the same protein each time it is read.`, kind: 'common-error' },
    { content: `The central dogma: DNA → RNA → protein. Transcription makes the RNA copy; translation builds the protein.`, kind: 'tip' },
    { content: `RNA differs from DNA in three ways: ribose sugar, uracil in place of thymine, single-stranded. A T in your mRNA is an error.`, kind: 'tip' },
    { content: `Transcription happens in the nucleus by RNA polymerase, base-pairing against the template strand — pair with it, never copy it.`, kind: 'tip' },
    { content: `Translation happens at a ribosome in the cytoplasm: read the mRNA in three-base codons starting at AUG, and stop at UAA, UAG or UGA without adding an amino acid.`, kind: 'tip' },
    { content: `tRNA anticodons pair with mRNA codons to deliver amino acids; the code is redundant (several codons per amino acid) but never ambiguous.`, kind: 'tip' },
    { content: `Never write a T in an mRNA sequence. If a T shows up, you copied the DNA instead of pairing against it, or you forgot U replaces T. Scan your finished mRNA for stray T's before translating.`, kind: 'common-error' },
    { content: `Transcription PAIRS with the template, it doesn't copy it. Every base flips: T→A, A→U, C→G, G→C. If your mRNA looks like the template with T's swapped for U's, you did it backwards — and it usually won't start with AUG.`, kind: 'common-error' },
    { content: `"Redundant" means many codons → one amino acid, never one codon → many amino acids. GUU, GUC, GUA, GUG all give valine, but GUA gives valine every time, in every organism. Redundant ≠ ambiguous.`, kind: 'vocab-note' },
    { content: `Stop codons (UAA, UAG, UGA) are punctuation, not amino acids. Don't count them when you report the polypeptide length — AUG/GUG/CCU/UAA is three amino acids, not four.`, kind: 'gotcha' },
    { content: `Codon vs anticodon: the CODON is on the mRNA, the ANTICODON is on the tRNA, and they base-pair as complements (codon AUG ↔ anticodon UAC). Both are RNA, so both use U — never write a T in an anticodon either.`, kind: 'vocab-note' },
    { content: `Keep the locations straight: transcription in the nucleus (RNA polymerase), translation at a ribosome in the cytoplasm. Nothing is ever translated inside the nucleus — the mRNA must exit through a pore first.`, kind: 'gotcha' },
    { content: `Cut codons into clean groups of three starting at AUG and never regroup partway. Any bases left over after the stop codon simply aren't translated — don't force them into a final codon.`, kind: 'edge-case' },
    { content: `A DNA base change doesn't always change the protein. If GUG becomes GUA, both still place valine, so the polypeptide is identical — redundancy can absorb the change. Check the amino acid, not just the letters.`, kind: 'edge-case' },
  ],
};
