/**
 * Biology — Unit 5 CED 5.3: Dihybrid Crosses & Probability.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.dihybrid-crosses.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U5_DIHYBRID_CROSSES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.dihybrid-crosses.v1',
  course: 'Biology',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Dihybrid Crosses & Probability',
  planId: 'evelyn.hs.bio.dihybrid-crosses.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.dihybrid-crosses.v1' }],
  theory: [
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'Two genes, two letter pairs', content: `TWO GENES, TWO LETTER PAIRS — a dihybrid genotype carries one pair per gene, written together: RrYy means Rr for the first gene and Yy for the second. In peas, R = round seed (dominant to r = wrinkled) and Y = yellow seed (dominant to y = green). Always keep the pairs in the same order so you can read them at a glance.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'Independent assortment', content: `INDEPENDENT ASSORTMENT — Mendel's second law: which allele a gamete gets for gene 1 does not affect which allele it gets for gene 2. That independence is the whole reason the two traits can be handled separately, and it is what the probability shortcut relies on.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'Four gamete types, found by foil-style pairing', content: `FOUR GAMETE TYPES, FOUND BY FOIL-STYLE PAIRING — a gamete gets exactly ONE letter from each pair. Take each letter of the first pair and pair it with each letter of the second: R with Y, R with y, r with Y, r with y. So RrYy → RY, Ry, rY, ry — four types, in equal numbers. The classic error is writing a gamete as RR or Yy: a gamete never carries both alleles of the same gene, and it never leaves a gene out.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'The 16-box grid', content: `THE 16-BOX GRID — write the first parent's four gamete types across the top and the second parent's four down the side, then fill each of the 4 × 4 = 16 boxes by combining its row and column letters. Sort each box so the letters for the same gene sit together and the dominant one comes first: R and r and Y and y written as RrYy, never rRyY.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'The signature cross', content: `THE SIGNATURE CROSS — RrYy × RrYy fills out to a PHENOTYPE ratio of 9:3:3:1 — 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green. Note what the numbers mean: 9 boxes show BOTH dominant traits, the two 3s show one dominant and one recessive, and the single 1 is the double recessive rryy. Answering 3:1 here is the single most common mistake — 3:1 is the one-trait answer.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'The fork / probability shortcut', content: `THE FORK / PROBABILITY SHORTCUT — because the genes assort independently, handle one trait at a time and MULTIPLY. For RrYy × RrYy: each single-trait cross is Rr × Rr, which gives 3/4 dominant and 1/4 recessive. So round and yellow = 3/4 × 3/4 = 9/16; round and green = 3/4 × 1/4 = 3/16; wrinkled green = 1/4 × 1/4 = 1/16. Multiplying the four combinations back out reproduces 9:3:3:1 without drawing a single box.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'Multiply, never add', content: `MULTIPLY, NEVER ADD — probabilities of independent events that must BOTH happen are multiplied. Adding 3/4 + 3/4 gives 6/4, a probability above 1, which is impossible — a useful self-check. Add only when you want one outcome OR another, such as "round green or wrinkled yellow" = 3/16 + 3/16 = 6/16.` },
    { loId: 'bio.dihybrid-crosses', kind: 'framework', title: 'The dihybrid test cross', content: `THE DIHYBRID TEST CROSS — to expose a hidden genotype, cross the unknown with the double recessive rryy, which makes only ry gametes. If the unknown is RrYy it makes RY, Ry, rY and ry in equal numbers, so the offspring come out in a 1:1:1:1 phenotype ratio — round yellow : round green : wrinkled yellow : wrinkled green. Seeing 1:1:1:1 is direct evidence the tested parent was heterozygous for both genes.` },
    { loId: 'bio.dihybrid-crosses', kind: 'definition', title: 'dihybrid cross', content: 'a cross that tracks two different genes at the same time, such as RrYy × RrYy.' },
    { loId: 'bio.dihybrid-crosses', kind: 'definition', title: 'independent assortment', content: `the rule that alleles of one gene sort into gametes without regard to the alleles of another gene.` },
    { loId: 'bio.dihybrid-crosses', kind: 'definition', title: 'gamete', content: 'a sex cell carrying exactly one allele for each gene, such as RY or ry.' },
  ],
  methods: [
    {
      title: 'Worked nine three three one',
      steps: [
        `List each parent's gametes by pairing one letter from each pair: R with Y, R with y, r with Y, r with y → RY, Ry, rY, ry. Both parents are RrYy, so both produce the same four types in equal numbers.`,
        `Set up the grid: RY, Ry, rY, ry across the top and the same four down the side. That is 4 × 4 = 16 boxes, each equally likely.`,
        `Fill the boxes by combining row and column letters, sorting each result so the gene-1 pair comes first and the dominant letter leads — for example the ry row crossed with the Ry column gives R, r, Y, y → RrYy.`,
        `Now classify each box by PHENOTYPE, not genotype. A box is round if it contains at least one R, and yellow if it contains at least one Y.`,
        `Count the four groups: 9 boxes have at least one R and at least one Y (round yellow); 3 boxes have at least one R but are yy (round green); 3 boxes are rr but have at least one Y (wrinkled yellow); exactly 1 box is rryy (wrinkled green).`,
        `Check the count: 9 + 3 + 3 + 1 = 16, which matches the number of boxes — so nothing was missed or double-counted.`,
      ],
      example: { problem: `In pea plants, round seeds (R) are dominant to wrinkled seeds (r), and yellow seeds (Y) are dominant to green seeds (y). Two plants that are heterozygous for both genes are crossed: RrYy × RrYy. Derive the phenotype ratio of the offspring.`, solution: '9:3:3:1 — 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green' },
      relatedLoIds: ['bio.dihybrid-crosses'],
    },
    {
      title: 'Worked probability shortcut',
      steps: [
        `Split the two-trait question into two one-trait questions, which is allowed because the genes assort independently.`,
        `Trait 1 — height: the cross is Tt × Tt, the familiar 3:1 cross, so the probability of tall is 3/4.`,
        `Trait 2 — seed color: the cross is Yy × Yy, also 3:1, so the probability of the recessive green (yy) is 1/4.`,
        `The offspring must be tall AND green, so multiply the two independent probabilities: 3/4 × 1/4 = 3/16.`,
        `Sanity-check against the full grid: 3/16 is exactly one of the two 3s in the 9:3:3:1 pattern, so the shortcut agrees with the 16 boxes. (Adding instead — 3/4 + 1/4 = 1 — would claim every offspring is tall and green, which is obviously wrong.)`,
      ],
      example: { problem: `In pea plants, tall (T) is dominant to short (t), and yellow seeds (Y) are dominant to green seeds (y). Two plants heterozygous for both genes are crossed: TtYy × TtYy. Without drawing a 16-box grid, find the probability that a single offspring is TALL WITH GREEN SEEDS.`, solution: '3/16 — the probability of tall (3/4) times the probability of green (1/4).' },
      relatedLoIds: ['bio.dihybrid-crosses'],
    },
  ],
  pointers: [
    { content: `When two independent things must BOTH happen, multiply: 3/4 × 3/4 = 9/16, which matches the 9 in the 9:3:3:1 pattern. Addition is for "this OR that" outcomes, such as round green or wrinkled yellow = 3/16 + 3/16 = 6/16. Any probability above 1 is impossible, so 6/4 is an instant signal that the wrong operation was used.`, kind: 'common-error' },
    { content: `A dihybrid genotype carries one pair per gene (RrYy); a gamete carries exactly one letter from each pair.`, kind: 'tip' },
    { content: `RrYy → four gamete types in equal numbers: RY, Ry, rY, ry — pair each letter of the first gene with each letter of the second.`, kind: 'tip' },
    { content: `RrYy × RrYy fills a 4 × 4 = 16-box grid and gives the phenotype ratio 9:3:3:1; 9 + 3 + 3 + 1 = 16 is the check. A 3:1 answer means only one trait was tracked.`, kind: 'tip' },
    { content: `Shortcut: do each trait separately and MULTIPLY — 3/4 × 3/4 = 9/16 for both dominant, 3/4 × 1/4 = 3/16 for one of each, 1/4 × 1/4 = 1/16 for the double recessive. Add only for "one outcome OR another".`, kind: 'tip' },
    { content: `A dihybrid test cross against the double recessive rryy gives a 1:1:1:1 phenotype ratio, showing the tested parent was heterozygous for both genes.`, kind: 'tip' },
    { content: `A gamete never contains two alleles of the same gene. \`RR\`, \`Yy\`, or \`RrY\` are not gamete types. Each gamete gets exactly one letter per gene — so \`RrYy\` gives only RY, Ry, rY, ry.`, kind: 'common-error' },
    { content: `9:3:3:1 is a PHENOTYPE ratio, not a genotype ratio. The 16 boxes hold 9 different genotypes; the 9 in 9:3:3:1 just counts boxes with at least one R AND at least one Y.`, kind: 'vocab-note' },
    { content: `Answering 3:1 to a two-gene cross means you tracked only one trait. 3:1 belongs to Rr × Rr; a dihybrid cross of two heterozygotes always yields four phenotype classes, not two.`, kind: 'gotcha' },
    { content: `Multiply for AND, add for OR. Round AND yellow = 3/4 × 3/4 = 9/16. Round-green OR wrinkled-yellow = 3/16 + 3/16 = 6/16. If your answer exceeds 1, you added when you should have multiplied.`, kind: 'common-error' },
    { content: `Sort each box consistently: gene-1 letters together, dominant first — \`RrYy\`, not \`rRyY\` or \`RYry\`. Scrambled letters make identical genotypes look different when you count phenotype classes.`, kind: 'tip' },
    { content: `After filling the grid, check that your four counts sum to 16. If you get 9+3+3+2 or 8+3+3+1, you double-counted or skipped a box — recount before trusting the ratio.`, kind: 'tip' },
    { content: `A test cross uses the DOUBLE recessive (rryy) because it produces only ry gametes, so offspring phenotypes reveal the unknown parent's gametes directly. Crossing with a heterozygote proves nothing.`, kind: 'edge-case' },
    { content: `The multiply-the-traits shortcut only works if the two genes assort independently. Genes physically linked on the same chromosome break this rule — the 9:3:3:1 pattern is evidence FOR independent assortment, not a guarantee of it.`, kind: 'edge-case' },
  ],
};
