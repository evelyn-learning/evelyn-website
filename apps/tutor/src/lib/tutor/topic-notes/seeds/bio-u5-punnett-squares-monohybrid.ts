/**
 * Biology — Unit 5 CED 5.2: Monohybrid Crosses & Punnett Squares.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.punnett-squares-monohybrid.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U5_PUNNETT_SQUARES_MONOHYBRID: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.punnett-squares-monohybrid.v1',
  course: 'Biology',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Monohybrid Crosses & Punnett Squares',
  planId: 'evelyn.hs.bio.punnett-squares-monohybrid.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.punnett-squares-monohybrid.v1' }],
  theory: [
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'Genotype vs phenotype', content: `GENOTYPE VS PHENOTYPE — the GENOTYPE is the allele pair an organism carries (RR, Rr, or rr); the PHENOTYPE is the trait you can observe (round or wrinkled). Different genotypes can share one phenotype: RR and Rr both look round.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'The three genotypes', content: `THE THREE GENOTYPES — homozygous dominant (RR), heterozygous (Rr), homozygous recessive (rr). A recessive phenotype appears ONLY as rr, because a single dominant allele masks the recessive one.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'The gamete rule', content: `THE GAMETE RULE — each parent gives exactly ONE allele per trait, chosen at random (Mendel's law of segregation). Rr makes two kinds of gamete, R and r, in equal numbers; RR makes only R.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'Building the square', content: `BUILDING THE SQUARE — write one parent's two gamete types across the top, the other parent's down the side, then fill each box by combining its row and column letters. Write the dominant (capital) letter first: Rr, never rR.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'The signature cross', content: `THE SIGNATURE CROSS — Rr × Rr gives boxes RR, Rr, Rr, rr: a GENOTYPE ratio of 1:2:1 and a PHENOTYPE ratio of 3:1 dominant to recessive. Memorize that these two ratios are different answers to different questions.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'Ratios are probabilities, not quotas', content: `RATIOS ARE PROBABILITIES, NOT QUOTAS — 3:1 means each offspring independently has a 3/4 chance of the dominant phenotype. It does NOT promise that 4 offspring will split 3 and 1; four recessive puppies in a row is unlikely but perfectly possible.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'framework', title: 'The test cross', content: `THE TEST CROSS — to find whether a dominant-looking organism is RR or Rr, cross it with rr. Any recessive offspring proves the unknown parent was Rr, because that offspring needed an r from each parent.` },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'definition', title: 'genotype', content: 'the pair of alleles an organism carries for a trait, written as two letters.' },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'definition', title: 'phenotype', content: 'the observable trait that results from the genotype.' },
    { loId: 'bio.punnett-squares-monohybrid', kind: 'definition', title: 'heterozygous', content: 'carrying two different alleles for a trait, such as Rr.' },
  ],
  methods: [
    {
      title: 'Worked heterozygous cross',
      steps: [
        `Find each parent's gametes: an Rr parent makes R and r in equal numbers. Both parents do, so the grid is R and r across the top, R and r down the side.`,
        `Fill the four boxes: top-left R+R = RR, top-right R+r = Rr, bottom-left r+R = Rr, bottom-right r+r = rr.`,
        'Count genotypes: one RR, two Rr, one rr — a genotype ratio of 1:2:1.',
        `Translate to phenotypes: RR and both Rr plants show round (3 boxes); only rr shows wrinkled (1 box) — a phenotype ratio of 3:1 round to wrinkled.`,
      ],
      example: { problem: `In pea plants, round seeds (R) are dominant to wrinkled seeds (r). Cross two heterozygous plants (Rr × Rr). Give the genotype ratio and the phenotype ratio of the offspring.`, solution: 'Genotype ratio 1:2:1 (RR : Rr : rr); phenotype ratio 3:1 (round : wrinkled)' },
      relatedLoIds: ['bio.punnett-squares-monohybrid'],
    },
    {
      title: 'Worked test cross',
      steps: [
        `Write what is certain: white is the recessive phenotype, so the white parent must be bb, and any white offspring must also be bb.`,
        `A bb offspring needs one b from each parent. The white parent supplies one b; the other b must have come from the black parent.`,
        `So the black parent carries a b allele. Since it looks black, it also carries B — its genotype is Bb.`,
        `Check by building the cross Bb × bb: the boxes are Bb, Bb, bb, bb — half black, half white, which matches a litter containing white offspring. (Had the parent been BB, every box would read Bb and no white offspring could appear.)`,
      ],
      example: { problem: `A black guinea pig (black, B, is dominant to white, b) has an unknown genotype — it could be BB or Bb. It is crossed with a white guinea pig, and the litter contains some white offspring. What is the black parent's genotype, and how do you know?`, solution: `Bb — a single white (bb) offspring proves the black parent carried a recessive b allele.` },
      relatedLoIds: ['bio.punnett-squares-monohybrid'],
    },
  ],
  pointers: [
    { content: `Each offspring independently has a 3/4 chance of being round — fertilization does not keep a tally. Four offspring could easily come out 4 round, or 2 and 2. The 3:1 ratio only emerges reliably across large numbers of offspring.`, kind: 'common-error' },
    { content: `Genotype = the allele pair (RR, Rr, rr); phenotype = the observable trait. RR and Rr look the same.`, kind: 'tip' },
    { content: `Each parent contributes one allele per trait; a heterozygote makes two gamete types in equal numbers.`, kind: 'tip' },
    { content: `Rr × Rr → genotype ratio 1:2:1 and phenotype ratio 3:1 — two different answers, so read the question.`, kind: 'tip' },
    { content: 'The recessive phenotype appears only in rr individuals.', kind: 'tip' },
    { content: `Ratios are probabilities per offspring, not quotas for a litter. A test cross with rr reveals a hidden recessive allele.`, kind: 'tip' },
    { content: `Read whether the question asks for the **genotype** ratio or the **phenotype** ratio. Rr × Rr gives 1:2:1 for genotypes but 3:1 for phenotypes — answering "3:1" to a genotype question is the #1 lost point in this topic.`, kind: 'common-error' },
    { content: `Write the dominant allele first inside every box: **Rr, never rR**. Also keep letter case meaningful — a sloppy lowercase 'r' that looks like 'R' turns a heterozygote into a homozygote and wrecks the ratio.`, kind: 'vocab-note' },
    { content: `A ratio is a **probability per offspring**, not a quota for a litter. 3:1 does NOT mean 3 of the next 4 offspring are dominant — each offspring is an independent 3/4 chance. Four wrinkled peas in a row is unlikely, not impossible.`, kind: 'gotcha' },
    { content: `The recessive phenotype has exactly ONE possible genotype (rr), but the dominant phenotype has two (RR or Rr). So a recessive-looking parent's genotype is always known; a dominant-looking one may need a test cross.`, kind: 'tip' },
    { content: `Work backwards from a recessive offspring: an rr pup needed one r from EACH parent. If two dominant-looking parents produce a recessive child, both parents must be heterozygous — no other combination works.`, kind: 'tip' },
    { content: `One test-cross litter with no recessive offspring does NOT prove the parent is RR — it just makes it likely. Small litters can miss the 1/2 chance entirely; a single recessive offspring, though, proves Rr immediately.`, kind: 'edge-case' },
    { content: `Down the side and across the top go GAMETES (single alleles), not parent genotypes. Don't write "Rr" in one header box — an Rr parent contributes R to one column and r to the other.`, kind: 'common-error' },
    { content: `A homozygous parent has only ONE gamete type, so its two rows (or columns) are identical — that's correct, not a mistake. Rr × rr therefore gives 1:1, never 3:1.`, kind: 'edge-case' },
  ],
};
