/**
 * Biology — Molecular Genetics: Mutations & Their Effects on Proteins.
 *
 * The sequence-manipulation lesson of the HS Biology fan-out (NGSS HS-LS3-2).
 * Every check here is an MCQ: the payoff is reading a codon at a time and
 * noticing WHERE the reading frame survives and where it collapses, so all
 * base sequences are written out in full in the problem or the choices —
 * nothing depends on a chart the student cannot hear.
 *
 * Genetic engineering (CRISPR, GMOs, gene therapy) is deliberately NOT here;
 * it belongs to lesson 6.4.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U6_MUTATIONS: LessonPlan = {
  id: 'evelyn.hs.bio.mutations.v1',
  title: 'Mutations & Their Effects on Proteins',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.mutations',
      standard: 'BIO-6.3',
      description:
        'Explain how point mutations (silent, missense, nonsense) and frameshift mutations caused by insertions or deletions change a protein, and predict whether a given change in the DNA sequence is likely to be harmful, beneficial, or neutral (NGSS HS-LS3-2).',
    },
  ],
  prerequisites: ['bio.transcription-translation'],
  followUps: ['bio.biotechnology'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame mutation as one changed letter with wildly different consequences — sometimes harmful, sometimes protective, usually nothing at all.',
      script:
        'One letter. In the gene for hemoglobin, changing a single A to a T swaps one amino acid out of 146 — and that is sickle cell anemia, red blood cells bent into crescents that jam in blood vessels. But carry just one copy of that same change and you are strongly protected against malaria, which is why the allele is common exactly where malaria is common. Meanwhile, every time you skip sunscreen, UV light is writing its own changes into your skin cells. Today you learn to read a DNA sequence, spot what changed, and predict whether the protein shrugs it off or falls apart.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mutation-types',
      kind: 'concept',
      goal: 'What a mutation is, the three point-mutation outcomes, why frameshifts are worse, germline vs somatic, and why mutations are the source of new alleles.',
      keyIdeas: [
        'WHAT A MUTATION IS — any change in the DNA base sequence. Because the ribosome reads mRNA in non-overlapping CODONS of three bases from the start codon AUG, the only question that matters is: what does this change do to the codons?',
        'POINT MUTATION — one base is SUBSTITUTED for another. The number of bases stays the same, so the reading frame is untouched and only ONE codon is affected. That single codon can land in three different ways: silent, missense, or nonsense.',
        'SILENT — the new codon still codes for the SAME amino acid, because the genetic code is redundant (several codons share one amino acid: GAA and GAG both mean glutamic acid). The DNA changed; the protein did not. A silent mutation is still a real mutation.',
        'MISSENSE — the new codon codes for a DIFFERENT amino acid, so the protein is built full-length with one wrong residue. The classic case is sickle cell anemia: GAG → GUG in the hemoglobin mRNA swaps glutamic acid for valine, and that one swap makes hemoglobin molecules stack into rods.',
        'NONSENSE — the new codon becomes a STOP codon (UAA, UAG, or UGA) early in the message. Translation quits there and the protein comes out TRUNCATED — a fragment, usually useless. Nonsense is generally the most damaging of the three point mutations.',
        'FRAMESHIFT — an INSERTION or DELETION of bases that is not a multiple of three shifts the reading frame, so every codon DOWNSTREAM of the change is misread. This is usually far more damaging than a substitution: one deleted base can garble hundreds of amino acids and wipe out the original stop codon. Adding or removing exactly three bases stays IN frame and only adds or removes one amino acid.',
        'GERMLINE VS SOMATIC — a GERMLINE mutation is in an egg or sperm cell (or the cells that make them) and is passed to offspring, appearing in every cell of that child. A SOMATIC mutation is in any other body cell — skin, lung, liver — and is copied only to that cell\'s descendants. Somatic mutations can cause cancer, but they are NOT inherited by children.',
        'CAUSES AND WHY MUTATIONS MATTER — mutations arise from DNA-replication errors and from MUTAGENS such as UV light, tobacco smoke, and X-rays. Mutations are not inherently "bad": most are NEUTRAL, some are harmful, and a few are beneficial. They are the ULTIMATE source of every new allele — without them there would be no variation for natural selection to act on, which is where Unit 7 picks up.',
      ],
      vocabulary: [
        { term: 'frameshift mutation', definition: 'an insertion or deletion that is not a multiple of three bases, so every codon after it is misread.' },
        { term: 'germline mutation', definition: 'a mutation in an egg or sperm cell, and therefore heritable by offspring.' },
        { term: 'mutagen', definition: 'an agent such as UV light, tobacco smoke, or X-rays that raises the rate of mutation.' },
      ],
      suggestedTools: ['show_diagram', 'show_table', 'show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-substitution-vs-deletion',
      kind: 'worked_example',
      problem:
        'A gene produces the mRNA 5\'-AUG-CCU-GAG-AAA-UAG-3\', read in codons starting at AUG. Use these codons: AUG = methionine (start), CCU = proline, GAG = glutamic acid, GUG = valine, AAA = lysine, GGA = glycine, AAU = asparagine, UAG = stop. Compare two mutations at the SAME spot — the middle A of the GAG codon. Mutation 1 substitutes that A with a U. Mutation 2 deletes that A entirely. Which protein is more badly damaged?',
      steps: [
        'Translate the original: AUG / CCU / GAG / AAA / UAG → methionine - proline - glutamic acid - lysine - STOP. A four-amino-acid protein.',
        'Mutation 1 (substitution A → U): the sequence becomes 5\'-AUG-CCU-GUG-AAA-UAG-3\'. The base count is unchanged, so the frame holds and only the third codon is touched: GAG → GUG. Translation gives methionine - proline - VALINE - lysine - STOP. One amino acid swapped — this is a MISSENSE mutation, the same kind that causes sickle cell anemia.',
        'Mutation 2 (deletion of that A): removing one base leaves AUGCCUG GAAAUAG, which regroups as 5\'-AUG-CCU-GGA-AAU-AG-3\'. Everything after CCU has slid one position left.',
        'Translate the shifted frame: AUG / CCU / GGA / AAU / AG... → methionine - proline - GLYCINE - ASPARAGINE - and then a partial codon. Note what else broke: the original UAG stop codon no longer exists as a codon, so the ribosome runs straight past where the protein should have ended.',
        'Compare the damage. The substitution changed one residue out of four. The deletion changed EVERY residue after the mutation point and destroyed the stop signal — a FRAMESHIFT.',
      ],
      answer:
        'Mutation 2 — the deletion. The substitution is missense and changes one amino acid (glutamic acid → valine); the deletion causes a frameshift that misreads every downstream codon and abolishes the stop codon.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-silent-vs-nonsense',
      kind: 'worked_example',
      problem:
        'A student claims: "A mutation that changes only one base can only ever do a little damage — the protein is basically fine." Test that claim on the mRNA 5\'-AUG-CAA-UCU-GGA-UAA-3\'. Use these codons: AUG = methionine (start), CAA = glutamine, UCU = serine, UCC = serine, GGA = glycine, UAA = stop. Mutation A changes the last base of the UCU codon from U to C. Mutation B changes the first base of the CAA codon from C to U. Judge each one.',
      steps: [
        'Translate the original: AUG / CAA / UCU / GGA / UAA → methionine - glutamine - serine - glycine - STOP.',
        'Mutation A (U → C at the end of UCU): the sequence becomes 5\'-AUG-CAA-UCC-GGA-UAA-3\'. UCU and UCC BOTH code for serine, so the protein reads methionine - glutamine - serine - glycine - STOP. Identical. This is a SILENT mutation — the redundancy of the genetic code absorbed it.',
        'Mutation B (C → U at the start of CAA): the sequence becomes 5\'-AUG-UAA-UCU-GGA-UAA-3\'. CAA became UAA, which is a STOP codon.',
        'Translate mutation B: AUG / UAA → methionine, then STOP immediately. The ribosome releases a single-amino-acid fragment instead of a four-amino-acid protein. This is a NONSENSE mutation, and the protein is truncated to nothing usable.',
        'So the claim fails. Both mutations changed exactly ONE base, in the same short sequence. One changed nothing at all; the other destroyed the entire protein. The number of bases changed does not predict the damage — what the new codon MEANS does.',
      ],
      answer:
        'The claim is wrong. Mutation A is silent (UCU → UCC, still serine, protein unchanged); mutation B is nonsense (CAA → UAA, an early stop) and truncates the protein after a single amino acid.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-substitution-vs-deletion',
      kind: 'try_yourself',
      problem:
        'A gene produces the mRNA 5\'-AUG-CCA-GGU-ACU-UAA-3\'. In copy 1 of the gene, the first G of the GGU codon is SUBSTITUTED with an A, giving 5\'-AUG-CCA-AGU-ACU-UAA-3\'. In copy 2, that same G is DELETED, giving 5\'-AUG-CCA-GUA-CUU-AA-3\'. Which copy is likely to produce the more badly damaged protein, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Copy 1, because a substitution always changes an amino acid while a deletion never does' },
        { id: 'b', text: 'Neither — both changed exactly one base, so each changes exactly one amino acid' },
        { id: 'c', text: 'Copy 2, because deleting one base shifts the reading frame, so every codon after it is misread', correct: true },
        { id: 'd', text: 'It makes no difference — all mutations are harmful, so both proteins are destroyed completely' },
      ],
      expectedAnswer: 'Copy 2, because deleting one base shifts the reading frame, so every codon after it is misread',
      hints: [
        'Line the two mutated sequences up against the original and ask which codons after the change still match the original codons.',
        'In copy 1 only the third codon differs (GGU → AGU) and the rest are untouched; in copy 2 every codon from the third one onward is a brand-new grouping.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-silent',
      kind: 'try_yourself',
      problem:
        'The original mRNA is 5\'-AUG-GAG-CCU-UAA-3\'. Use these codons: AUG = methionine (start), GAG = glutamic acid, GAA = glutamic acid, GUG = valine, CCU = proline, CUU = leucine, UAG = stop, UAA = stop. Which of the mutated sequences below is a SILENT mutation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5\'-AUG-GUG-CCU-UAA-3\'' },
        { id: 'b', text: '5\'-AUG-UAG-CCU-UAA-3\'' },
        { id: 'c', text: '5\'-AUG-GAG-CUU-AA-3\'' },
        { id: 'd', text: '5\'-AUG-GAA-CCU-UAA-3\'', correct: true },
      ],
      expectedAnswer: '5\'-AUG-GAA-CCU-UAA-3\'',
      hints: [
        'Silent means the amino acid sequence comes out exactly the same as the original: methionine - glutamic acid - proline - STOP.',
        'Two of the listed codons code for the same amino acid — find the sequence whose only change swaps one of those for the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-germline-vs-somatic',
      kind: 'try_yourself',
      problem:
        'A roofer works for years in strong sun without sunscreen. UV light causes a mutation in one of his skin cells, and that cell grows into a skin tumor. Separately, a replication error causes a mutation in one of the cells that will become his sperm. Which mutation can be passed on to his children?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both of them — any mutation anywhere in the body can be inherited by offspring' },
        { id: 'b', text: 'Only the sperm-cell mutation, because germline mutations are the only ones passed to offspring', correct: true },
        { id: 'c', text: 'Only the skin-cell mutation, because it was caused by a mutagen and mutagen damage is always heritable' },
        { id: 'd', text: 'Neither, because mutations are damage rather than information and are never inherited' },
      ],
      expectedAnswer: 'Only the sperm-cell mutation, because germline mutations are the only ones passed to offspring',
      hints: [
        'A child inherits DNA from exactly two cells: one egg and one sperm. Ask which of these two mutations is sitting in such a cell.',
        'A somatic mutation is copied only into the descendants of that one body cell — it can cause a tumor, but it never reaches an egg or sperm.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-all-mutations-bad',
      kind: 'misconception_check',
      question:
        'A student says: "Mutations are copying mistakes, so they are always bad — every mutation makes an organism worse off." What went wrong?',
      commonErrors: [
        {
          answer: 'All mutations are harmful',
          misconception: 'Treating "change from the normal sequence" as automatically meaning "damage", because the memorable examples in class are all diseases.',
          correctsTo:
            'Most mutations are NEUTRAL — they are silent, or they fall in non-coding DNA, and the organism is unaffected. Some are harmful, like the nonsense mutations that truncate a protein. And a few are BENEFICIAL: the very sickle cell allele that causes disease in two copies protects against malaria in one copy, which is why it is common where malaria is. Mutations are the ultimate source of every new allele — with no mutation there is no new variation, and natural selection would have nothing to select from.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mutation is any change in the DNA sequence; what matters is what it does to the codons the ribosome reads.',
        'Point mutation (one base substituted) → SILENT (same amino acid, redundant code), MISSENSE (one amino acid swapped, e.g. sickle cell GAG → GUG, glutamic acid → valine), or NONSENSE (early stop codon, truncated protein).',
        'An insertion or deletion that is not a multiple of three causes a FRAMESHIFT — every downstream codon is misread, so it is usually far more damaging than a substitution.',
        'Germline mutations (egg or sperm) are heritable; somatic mutations (any other body cell) are not, though they can cause cancer.',
        'Mutagens such as UV light, tobacco smoke, and X-rays raise the mutation rate — and mutations are not inherently bad: most are neutral, a few are beneficial, and they are the ultimate source of the new alleles that evolution works on.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Mutations & Their Effects on Proteins' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
