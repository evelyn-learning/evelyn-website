/**
 * Biology — Unit 5 CED 5.5: Sex-Linked Traits & Reading Pedigrees.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.pedigrees-human-genetics.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U5_PEDIGREES_HUMAN_GENETICS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.pedigrees-human-genetics.v1',
  course: 'Biology',
  cedUnit: 5,
  cedTopic: '5.5',
  cedTitle: 'Sex-Linked Traits & Reading Pedigrees',
  planId: 'evelyn.hs.bio.pedigrees-human-genetics.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.pedigrees-human-genetics.v1' }],
  theory: [
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Sex chromosomes', content: `SEX CHROMOSOMES — the 23rd pair. Females are XX, males are XY. Genes on the X have nothing matching them on the tiny Y, so a male carries only ONE copy of every X gene. That state has a name: HEMIZYGOUS.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Why males are affected far more often', content: `WHY MALES ARE AFFECTED FAR MORE OFTEN — a female needs the recessive allele on BOTH X chromosomes (X^a X^a) to show an X-linked recessive trait, but a male needs it on his single X (X^a Y). One unlucky allele is enough, with no second X to mask it, which is why red-green color blindness and hemophilia are many times more common in males.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Carrier females', content: `CARRIER FEMALES — X^A X^a. She has normal vision or normal clotting because the dominant allele on her other X covers for the recessive one, but she passes X^a to about half her children: 1/2 of her sons are affected and 1/2 of her daughters are carriers.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'The father rule', content: `THE FATHER RULE — a father gives his X to every daughter and his Y to every son. So an affected father (X^a Y) passes the allele to ALL of his daughters (each is at least a carrier) and to NONE of his sons. Father-to-son transmission of an X-linked trait is impossible; a son gets his X from his mother.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Write the genotype the right shape', content: `WRITE THE GENOTYPE THE RIGHT SHAPE — a male genotype has exactly one X and one Y: X^A Y or X^a Y. Writing X^a X^a for a male is the single most common error in this unit, and it makes the whole Punnett square come out wrong. A female genotype always has two X symbols: X^A X^A, X^A X^a, or X^a X^a.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Pedigree symbols', content: `PEDIGREE SYMBOLS — a SQUARE is a male, a CIRCLE is a female. A SHADED symbol means affected; unshaded means unaffected, which does not rule out being a carrier. A HORIZONTAL line joins a mating pair, and a VERTICAL line drops from that pair to their children, who are drawn in a row. Generations are numbered with Roman numerals, oldest at the top.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Inferring recessive vs dominant', content: `INFERRING RECESSIVE VS DOMINANT — the giveaway is two UNAFFECTED parents with an AFFECTED child. A dominant trait cannot appear from nowhere, since an affected child would need an affected parent, so that pattern means the trait is RECESSIVE and both parents carried the allele. A trait that appears in every generation, with every affected child having an affected parent, points to dominant instead.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'framework', title: 'Inferring x-linked vs autosomal', content: `INFERRING X-LINKED VS AUTOSOMAL — X-linked recessive shows a strong male majority among the affected and skips through unaffected carrier mothers. The sharpest test is an AFFECTED DAUGHTER: she carries X^a X^a, and one of those came from her father, so if the trait is X-linked her father must be affected too. An affected daughter with an unaffected father says the trait is autosomal, not X-linked.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'definition', title: 'hemizygous', content: `having only one copy of a gene — true of males for every gene on the X chromosome.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'definition', title: 'carrier', content: `an individual carrying one recessive allele without showing the trait; for X-linked traits, only females can be carriers.` },
    { loId: 'bio.pedigrees-human-genetics', kind: 'definition', title: 'pedigree', content: `a chart of squares and circles that tracks a trait through the generations of one family.` },
  ],
  methods: [
    {
      title: 'Worked carrier cross',
      steps: [
        `Pin down the mother first. Her father was color blind (X^a Y), and he gave his only X to every daughter — so she definitely received X^a. She sees color normally, so her other X carries X^A: she is a carrier, X^A X^a.`,
        `Pin down the father. He has normal color vision and is hemizygous, so his genotype is X^A Y — one X, one Y.`,
        `Set up the cross X^A X^a × X^A Y. The mother's gametes are X^A and X^a; the father's gametes are X^A and Y.`,
        'Fill the four boxes: X^A X^A, X^A X^a, X^A Y, X^a Y.',
        `Sort by sex. The two daughters are X^A X^A (normal) and X^A X^a (carrier, normal vision) — so 0 of the daughters are color blind. The two sons are X^A Y (normal) and X^a Y (color blind) — so 1/2 of the sons are color blind.`,
        `Sanity-check the shape of every box: each daughter box has two X symbols, each son box has one X and one Y. Nothing reads X^a X^a for a male.`,
      ],
      example: { problem: `Red-green color blindness is X-linked recessive. A woman with normal color vision whose father was color blind has children with a man who has normal color vision. What fraction of their sons, and what fraction of their daughters, are expected to be color blind?`, solution: `1/2 of the sons are expected to be color blind; 0 of the daughters are (half of them are carriers).` },
      relatedLoIds: ['bio.pedigrees-human-genetics'],
    },
    {
      title: 'Worked pedigree inference',
      steps: [
        `Start with dominance. In generation I two unaffected parents have an affected son. A dominant trait would have to show in at least one parent, so it cannot be dominant — the trait is RECESSIVE, and it skipped generation I visibly while being carried invisibly.`,
        `Check the sexes of the affected people. Both affected individuals are males (squares), and no female in the chart is affected. A male-only pattern that skips through unaffected women is the signature of X-LINKED recessive inheritance.`,
        `Test for a contradiction. X-linked recessive is ruled out only by an affected daughter with an unaffected father (she would need X^a from him too). An affected father with an affected son proves nothing either way — a son's X always comes from his mother, so his status is independent of his father's genotype. There is no affected daughter anywhere in this pedigree, so nothing contradicts X-linked recessive.`,
        `Trace the alleles to the generation-I mother. Her affected son is X^a Y, and his single X came from her, not from his father (who gave the Y). She is unaffected, so her other X is X^A: she is a carrier, X^A X^a.`,
        `Confirm with generation II. The generation-I daughter is unaffected, but her own son in generation III is affected (X^a Y) and got his X from her — so she is a carrier too, X^A X^a, exactly as expected for a carrier mother's daughter.`,
      ],
      example: { problem: `Read this family in words. In generation I, an unaffected male is married to an unaffected female. They have two children: an affected son and an unaffected daughter. That unaffected daughter marries an unaffected male, and in generation III they have three children: an affected son, an unaffected son, and an unaffected daughter. Is the trait dominant or recessive, is it consistent with X-linked inheritance, and what is the generation-I mother's genotype?`, solution: `Recessive, consistent with X-linked recessive inheritance; the generation-I mother is a carrier, X^A X^a.` },
      relatedLoIds: ['bio.pedigrees-human-genetics'],
    },
  ],
  pointers: [
    { content: `Sons and daughters really do receive the allele at similar rates — but they need different amounts of it to show the trait. A son has one X, so a single X^a makes him affected (X^a Y). A daughter has two X chromosomes, so one X^a only makes her a carrier (X^A X^a); she must inherit X^a from BOTH parents to be affected. Needing two rare events instead of one is why affected females are so much rarer than affected males.`, kind: 'common-error' },
    { content: `Males are hemizygous: X^A Y or X^a Y, one X only — never write two X alleles for a male.`, kind: 'tip' },
    { content: `One recessive X allele affects a male; a female needs X^a X^a, so affected males far outnumber affected females.`, kind: 'tip' },
    { content: `A carrier female X^A X^a shows nothing but passes X^a on: 1/2 of her sons affected, 1/2 of her daughters carriers.`, kind: 'tip' },
    { content: `An affected father passes his X^a to ALL daughters and NO sons — father-to-son X-linked transmission is impossible.`, kind: 'tip' },
    { content: `Pedigree reading: square = male, circle = female, shaded = affected, horizontal line = mating, vertical line = offspring.`, kind: 'tip' },
    { content: `Two unaffected parents with an affected child → recessive. An affected daughter with an unaffected father → autosomal, not X-linked.`, kind: 'tip' },
    { content: `Never write \`X^a X^a\` (or \`X^A X^a\`) for a male. A male genotype has exactly one X and one Y: \`X^A Y\` or \`X^a Y\`. Before filling a Punnett square, check that every son box reads X_Y and every daughter box has two X symbols.`, kind: 'common-error' },
    { content: `"Carrier" is not a synonym for "has the allele." A carrier is unaffected while carrying one recessive allele — for X-linked traits only females qualify, because an affected male isn't a carrier, he's affected.`, kind: 'vocab-note' },
    { content: `Don't say males are homozygous or heterozygous for X genes — they're HEMIZYGOUS. There's no second allele to pair with, so dominance never applies on a male's X.`, kind: 'vocab-note' },
    { content: `An unshaded symbol does NOT mean 'no allele.' Unaffected females can be carriers, and you often must infer that from a child. Trace backward: an affected son's X came from his mother, so she is at least a carrier.`, kind: 'tip' },
    { content: `Sons and daughters inherit the allele at equal rates — they just need different doses to show it. One X^a affects a son; a daughter needs X^a from BOTH parents. Frequency of inheritance ≠ frequency of expression.`, kind: 'gotcha' },
    { content: `An affected daughter is the sharpest test: her father must also be affected if the trait is X-linked. Affected daughter + unaffected father ⇒ autosomal, even if most affected people in the chart are male.`, kind: 'edge-case' },
    { content: `Two unaffected parents with an affected child proves RECESSIVE, not X-linked. Dominance and chromosome location are two separate questions — settle dominance first, then check sexes and the father-daughter rule.`, kind: 'common-error' },
    { content: `Father-to-son transmission of an X-linked trait is impossible — a son gets his father's Y, not his X. But that does NOT make an affected father with an affected son evidence against X-linkage: the son's genotype comes entirely from his mother, so this pairing is unremarkable under X-linked recessive too (e.g. an affected father with a carrier or affected mother). The diagnostic test stays the affected-daughter one, not this.`, kind: 'gotcha' },
  ],
};
