/**
 * Biology — Unit 6 CED 6.3: Mutations & Their Effects on Proteins.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.mutations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U6_MUTATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.mutations.v1',
  course: 'Biology',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Mutations & Their Effects on Proteins',
  planId: 'evelyn.hs.bio.mutations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.mutations.v1' }],
  theory: [
    { loId: 'bio.mutations', kind: 'framework', title: 'What a mutation is', content: `WHAT A MUTATION IS — any change in the DNA base sequence. Because the ribosome reads mRNA in non-overlapping CODONS of three bases from the start codon AUG, the only question that matters is: what does this change do to the codons?` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Point mutation', content: `POINT MUTATION — one base is SUBSTITUTED for another. The number of bases stays the same, so the reading frame is untouched and only ONE codon is affected. That single codon can land in three different ways: silent, missense, or nonsense.` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Silent', content: `SILENT — the new codon still codes for the SAME amino acid, because the genetic code is redundant (several codons share one amino acid: GAA and GAG both mean glutamic acid). The DNA changed; the protein did not. A silent mutation is still a real mutation.` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Missense', content: `MISSENSE — the new codon codes for a DIFFERENT amino acid, so the protein is built full-length with one wrong residue. The classic case is sickle cell anemia: GAG → GUG in the hemoglobin mRNA swaps glutamic acid for valine, and that one swap makes hemoglobin molecules stack into rods.` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Nonsense', content: `NONSENSE — the new codon becomes a STOP codon (UAA, UAG, or UGA) early in the message. Translation quits there and the protein comes out TRUNCATED — a fragment, usually useless. Nonsense is generally the most damaging of the three point mutations.` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Frameshift', content: `FRAMESHIFT — an INSERTION or DELETION of bases that is not a multiple of three shifts the reading frame, so every codon DOWNSTREAM of the change is misread. This is usually far more damaging than a substitution: one deleted base can garble hundreds of amino acids and wipe out the original stop codon. Adding or removing exactly three bases stays IN frame and only adds or removes one amino acid.` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Germline vs somatic', content: `GERMLINE VS SOMATIC — a GERMLINE mutation is in an egg or sperm cell (or the cells that make them) and is passed to offspring, appearing in every cell of that child. A SOMATIC mutation is in any other body cell — skin, lung, liver — and is copied only to that cell's descendants. Somatic mutations can cause cancer, but they are NOT inherited by children.` },
    { loId: 'bio.mutations', kind: 'framework', title: 'Causes and why mutations matter', content: `CAUSES AND WHY MUTATIONS MATTER — mutations arise from DNA-replication errors and from MUTAGENS such as UV light, tobacco smoke, and X-rays. Mutations are not inherently "bad": most are NEUTRAL, some are harmful, and a few are beneficial. They are the ULTIMATE source of every new allele — without them there would be no variation for natural selection to act on, which is where Unit 7 picks up.` },
    { loId: 'bio.mutations', kind: 'definition', title: 'frameshift mutation', content: `an insertion or deletion that is not a multiple of three bases, so every codon after it is misread.` },
    { loId: 'bio.mutations', kind: 'definition', title: 'germline mutation', content: 'a mutation in an egg or sperm cell, and therefore heritable by offspring.' },
    { loId: 'bio.mutations', kind: 'definition', title: 'mutagen', content: `an agent such as UV light, tobacco smoke, or X-rays that raises the rate of mutation.` },
  ],
  methods: [
    {
      title: 'Worked substitution vs deletion',
      steps: [
        `Translate the original: AUG / CCU / GAG / AAA / UAG → methionine - proline - glutamic acid - lysine - STOP. A four-amino-acid protein.`,
        `Mutation 1 (substitution A → U): the sequence becomes 5'-AUG-CCU-GUG-AAA-UAG-3'. The base count is unchanged, so the frame holds and only the third codon is touched: GAG → GUG. Translation gives methionine - proline - VALINE - lysine - STOP. One amino acid swapped — this is a MISSENSE mutation, the same kind that causes sickle cell anemia.`,
        `Mutation 2 (deletion of that A): removing one base leaves AUGCCUG GAAAUAG, which regroups as 5'-AUG-CCU-GGA-AAU-AG-3'. Everything after CCU has slid one position left.`,
        `Translate the shifted frame: AUG / CCU / GGA / AAU / AG... → methionine - proline - GLYCINE - ASPARAGINE - and then a partial codon. Note what else broke: the original UAG stop codon no longer exists as a codon, so the ribosome runs straight past where the protein should have ended.`,
        `Compare the damage. The substitution changed one residue out of four. The deletion changed EVERY residue after the mutation point and destroyed the stop signal — a FRAMESHIFT.`,
      ],
      example: { problem: `A gene produces the mRNA 5'-AUG-CCU-GAG-AAA-UAG-3', read in codons starting at AUG. Use these codons: AUG = methionine (start), CCU = proline, GAG = glutamic acid, GUG = valine, AAA = lysine, GGA = glycine, AAU = asparagine, UAG = stop. Compare two mutations at the SAME spot — the middle A of the GAG codon. Mutation 1 substitutes that A with a U. Mutation 2 deletes that A entirely. Which protein is more badly damaged?`, solution: `Mutation 2 — the deletion. The substitution is missense and changes one amino acid (glutamic acid → valine); the deletion causes a frameshift that misreads every downstream codon and abolishes the stop codon.` },
      relatedLoIds: ['bio.mutations'],
    },
    {
      title: 'Worked silent vs nonsense',
      steps: [
        `Translate the original: AUG / CAA / UCU / GGA / UAA → methionine - glutamine - serine - glycine - STOP.`,
        `Mutation A (U → C at the end of UCU): the sequence becomes 5'-AUG-CAA-UCC-GGA-UAA-3'. UCU and UCC BOTH code for serine, so the protein reads methionine - glutamine - serine - glycine - STOP. Identical. This is a SILENT mutation — the redundancy of the genetic code absorbed it.`,
        `Mutation B (C → U at the start of CAA): the sequence becomes 5'-AUG-UAA-UCU-GGA-UAA-3'. CAA became UAA, which is a STOP codon.`,
        `Translate mutation B: AUG / UAA → methionine, then STOP immediately. The ribosome releases a single-amino-acid fragment instead of a four-amino-acid protein. This is a NONSENSE mutation, and the protein is truncated to nothing usable.`,
        `So the claim fails. Both mutations changed exactly ONE base, in the same short sequence. One changed nothing at all; the other destroyed the entire protein. The number of bases changed does not predict the damage — what the new codon MEANS does.`,
      ],
      example: { problem: `A student claims: "A mutation that changes only one base can only ever do a little damage — the protein is basically fine." Test that claim on the mRNA 5'-AUG-CAA-UCU-GGA-UAA-3'. Use these codons: AUG = methionine (start), CAA = glutamine, UCU = serine, UCC = serine, GGA = glycine, UAA = stop. Mutation A changes the last base of the UCU codon from U to C. Mutation B changes the first base of the CAA codon from C to U. Judge each one.`, solution: `The claim is wrong. Mutation A is silent (UCU → UCC, still serine, protein unchanged); mutation B is nonsense (CAA → UAA, an early stop) and truncates the protein after a single amino acid.` },
      relatedLoIds: ['bio.mutations'],
    },
  ],
  pointers: [
    { content: `Most mutations are NEUTRAL — they are silent, or they fall in non-coding DNA, and the organism is unaffected. Some are harmful, like the nonsense mutations that truncate a protein. And a few are BENEFICIAL: the very sickle cell allele that causes disease in two copies protects against malaria in one copy, which is why it is common where malaria is. Mutations are the ultimate source of every new allele — with no mutation there is no new variation, and natural selection would have nothing to select from.`, kind: 'common-error' },
    { content: `A mutation is any change in the DNA sequence; what matters is what it does to the codons the ribosome reads.`, kind: 'tip' },
    { content: `Point mutation (one base substituted) → SILENT (same amino acid, redundant code), MISSENSE (one amino acid swapped, e.g. sickle cell GAG → GUG, glutamic acid → valine), or NONSENSE (early stop codon, truncated protein).`, kind: 'tip' },
    { content: `An insertion or deletion that is not a multiple of three causes a FRAMESHIFT — every downstream codon is misread, so it is usually far more damaging than a substitution.`, kind: 'tip' },
    { content: `Germline mutations (egg or sperm) are heritable; somatic mutations (any other body cell) are not, though they can cause cancer.`, kind: 'tip' },
    { content: `Mutagens such as UV light, tobacco smoke, and X-rays raise the mutation rate — and mutations are not inherently bad: most are neutral, a few are beneficial, and they are the ultimate source of the new alleles that evolution works on.`, kind: 'tip' },
    { content: `"Silent" does NOT mean "no mutation." The DNA base really changed — it just landed on a synonymous codon. If a question asks "did a mutation occur?" the answer is yes; if it asks "did the protein change?" the answer is no.`, kind: 'vocab-note' },
    { content: `Insertions and deletions are only frameshifts when the number of bases is NOT a multiple of three. Deleting 3 (or 6, or 9) bases keeps the frame and just removes whole amino acids. Count the bases before you shout "frameshift."`, kind: 'edge-case' },
    { content: `When you shift the frame, RE-GROUP the whole downstream sequence from scratch — rewrite it as one string, then chop into threes from AUG. Don't just delete a letter and leave the old codon dashes in place; that's where wrong answers come from.`, kind: 'common-error' },
    { content: `A frameshift usually destroys the original STOP codon too, so the ribosome reads past where the protein should end. Say this out loud in your answer — it's the part most students forget when explaining why frameshifts are worse than substitutions.`, kind: 'tip' },
    { content: `Nonsense = new STOP codon (UAA, UAG, UGA) → truncated protein. Missense = different amino acid → full-length protein, one wrong residue. Both are single-base substitutions; the label depends on what the NEW codon means, not on how much DNA changed.`, kind: 'vocab-note' },
    { content: `Somatic mutations can cause cancer but are never passed to children; germline mutations (egg/sperm or their precursors) appear in every cell of the offspring. A tumor is not heritable just because it was caused by a mutagen.`, kind: 'gotcha' },
    { content: `Don't write "mutations are bad." Most are neutral (silent or in non-coding DNA), some harmful, a few beneficial — the sickle cell allele protects heterozygotes from malaria. No mutation, no new alleles, nothing for natural selection to act on.`, kind: 'common-error' },
    { content: `Always translate the ORIGINAL sequence first and write out the amino acid chain, then translate the mutant and compare side by side. Judging damage by eyeballing the bases alone leads to calling nonsense mutations "minor."`, kind: 'tip' },
  ],
};
