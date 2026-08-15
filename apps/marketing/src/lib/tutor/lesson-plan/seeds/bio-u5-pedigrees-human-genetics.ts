/**
 * Biology — Heredity: Sex-Linked Traits & Reading Pedigrees.
 *
 * Follows the monohybrid-Punnett lesson in the same unit: the grid is now
 * built from X and Y chromosomes instead of plain letters, and the payoff is
 * reading a family chart. Every pedigree in this plan is described fully in
 * words so the lesson is solvable in a voice session with no figure on the
 * board. Checks stay MCQ — the answers are ratios, probabilities and genotype
 * strings, all of which have too many valid spellings to grade by exact match.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U5_PEDIGREES_HUMAN_GENETICS: LessonPlan = {
  id: 'evelyn.hs.bio.pedigrees-human-genetics.v1',
  title: 'Sex-Linked Traits & Reading Pedigrees',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.pedigrees-human-genetics',
      standard: 'BIO-5.5',
      description:
        'Predict the inheritance of X-linked traits from parental genotypes and infer whether a trait is dominant or recessive, autosomal or X-linked, by analyzing a family pedigree (NGSS HS-LS3-1, HS-LS3-3).',
    },
  ],
  prerequisites: ['bio.non-mendelian-inheritance'],
  followUps: ['bio.dna-structure-replication'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame sex-linked inheritance and pedigree reading as the working tools of genetic counseling and real family histories.',
      script:
        'Before a pilot ever flies, someone checks whether they can tell a red warning light from a green one — and about one man in twelve fails that test, against roughly one woman in two hundred. Hemophilia ran through the royal families of Europe for three generations, tracked by nothing more than a chart of squares and circles. A genetic counselor still draws that same chart today, asks a family a few questions, and can often tell them which parent carries the allele and what the odds are for the next child. In this lesson you learn to read that chart, and to explain the lopsided numbers behind it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-x-linkage-and-pedigrees',
      kind: 'concept',
      goal: 'Hemizygous males, carrier females, the father rule, and the symbol-by-symbol method for inferring a pattern from a pedigree.',
      keyIdeas: [
        'SEX CHROMOSOMES — the 23rd pair. Females are XX, males are XY. Genes on the X have nothing matching them on the tiny Y, so a male carries only ONE copy of every X gene. That state has a name: HEMIZYGOUS.',
        'WHY MALES ARE AFFECTED FAR MORE OFTEN — a female needs the recessive allele on BOTH X chromosomes (X^a X^a) to show an X-linked recessive trait, but a male needs it on his single X (X^a Y). One unlucky allele is enough, with no second X to mask it, which is why red-green color blindness and hemophilia are many times more common in males.',
        'CARRIER FEMALES — X^A X^a. She has normal vision or normal clotting because the dominant allele on her other X covers for the recessive one, but she passes X^a to about half her children: 1/2 of her sons are affected and 1/2 of her daughters are carriers.',
        'THE FATHER RULE — a father gives his X to every daughter and his Y to every son. So an affected father (X^a Y) passes the allele to ALL of his daughters (each is at least a carrier) and to NONE of his sons. Father-to-son transmission of an X-linked trait is impossible; a son gets his X from his mother.',
        'WRITE THE GENOTYPE THE RIGHT SHAPE — a male genotype has exactly one X and one Y: X^A Y or X^a Y. Writing X^a X^a for a male is the single most common error in this unit, and it makes the whole Punnett square come out wrong. A female genotype always has two X symbols: X^A X^A, X^A X^a, or X^a X^a.',
        'PEDIGREE SYMBOLS — a SQUARE is a male, a CIRCLE is a female. A SHADED symbol means affected; unshaded means unaffected, which does not rule out being a carrier. A HORIZONTAL line joins a mating pair, and a VERTICAL line drops from that pair to their children, who are drawn in a row. Generations are numbered with Roman numerals, oldest at the top.',
        'INFERRING RECESSIVE VS DOMINANT — the giveaway is two UNAFFECTED parents with an AFFECTED child. A dominant trait cannot appear from nowhere, since an affected child would need an affected parent, so that pattern means the trait is RECESSIVE and both parents carried the allele. A trait that appears in every generation, with every affected child having an affected parent, points to dominant instead.',
        'INFERRING X-LINKED VS AUTOSOMAL — X-linked recessive shows a strong male majority among the affected and skips through unaffected carrier mothers. The sharpest test is an AFFECTED DAUGHTER: she carries X^a X^a, and one of those came from her father, so if the trait is X-linked her father must be affected too. An affected daughter with an unaffected father says the trait is autosomal, not X-linked.',
      ],
      vocabulary: [
        { term: 'hemizygous', definition: 'having only one copy of a gene — true of males for every gene on the X chromosome.' },
        { term: 'carrier', definition: 'an individual carrying one recessive allele without showing the trait; for X-linked traits, only females can be carriers.' },
        { term: 'pedigree', definition: 'a chart of squares and circles that tracks a trait through the generations of one family.' },
      ],
      suggestedTools: ['show_pedigree', 'show_punnett', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-carrier-cross',
      kind: 'worked_example',
      problem:
        'Red-green color blindness is X-linked recessive. A woman with normal color vision whose father was color blind has children with a man who has normal color vision. What fraction of their sons, and what fraction of their daughters, are expected to be color blind?',
      steps: [
        'Pin down the mother first. Her father was color blind (X^a Y), and he gave his only X to every daughter — so she definitely received X^a. She sees color normally, so her other X carries X^A: she is a carrier, X^A X^a.',
        'Pin down the father. He has normal color vision and is hemizygous, so his genotype is X^A Y — one X, one Y.',
        "Set up the cross X^A X^a × X^A Y. The mother's gametes are X^A and X^a; the father's gametes are X^A and Y.",
        'Fill the four boxes: X^A X^A, X^A X^a, X^A Y, X^a Y.',
        'Sort by sex. The two daughters are X^A X^A (normal) and X^A X^a (carrier, normal vision) — so 0 of the daughters are color blind. The two sons are X^A Y (normal) and X^a Y (color blind) — so 1/2 of the sons are color blind.',
        'Sanity-check the shape of every box: each daughter box has two X symbols, each son box has one X and one Y. Nothing reads X^a X^a for a male.',
      ],
      answer: '1/2 of the sons are expected to be color blind; 0 of the daughters are (half of them are carriers).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pedigree-inference',
      kind: 'worked_example',
      problem:
        'Read this family in words. In generation I, an unaffected male is married to an unaffected female. They have two children: an affected son and an unaffected daughter. That unaffected daughter marries an unaffected male, and in generation III they have three children: an affected son, an unaffected son, and an unaffected daughter. Is the trait dominant or recessive, is it consistent with X-linked inheritance, and what is the generation-I mother\'s genotype?',
      steps: [
        'Start with dominance. In generation I two unaffected parents have an affected son. A dominant trait would have to show in at least one parent, so it cannot be dominant — the trait is RECESSIVE, and it skipped generation I visibly while being carried invisibly.',
        'Check the sexes of the affected people. Both affected individuals are males (squares), and no female in the chart is affected. A male-only pattern that skips through unaffected women is the signature of X-LINKED recessive inheritance.',
        "Test for a contradiction. X-linked recessive is ruled out if any affected daughter has an unaffected father, or if an affected father has an affected son. Neither happens here — there are no affected females at all, and the two affected males are in different families. So nothing contradicts X-linked recessive.",
        'Trace the alleles to the generation-I mother. Her affected son is X^a Y, and his single X came from her, not from his father (who gave the Y). She is unaffected, so her other X is X^A: she is a carrier, X^A X^a.',
        "Confirm with generation II. The generation-I daughter is unaffected, but her own son in generation III is affected (X^a Y) and got his X from her — so she is a carrier too, X^A X^a, exactly as expected for a carrier mother's daughter.",
      ],
      answer: 'Recessive, consistent with X-linked recessive inheritance; the generation-I mother is a carrier, X^A X^a.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-male-genotype',
      kind: 'try_yourself',
      problem:
        'Hemophilia is an X-linked recessive disorder. A man has hemophilia. Which genotype is written correctly for him?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'X^a X^a' },
        { id: 'b', text: 'X^A X^a' },
        { id: 'c', text: 'X^a Y', correct: true },
        { id: 'd', text: 'X^A Y' },
      ],
      expectedAnswer: 'X^a Y',
      hints: [
        'How many X chromosomes does a male have, and what is his second sex chromosome?',
        'A male genotype must show exactly one X and one Y. He is affected, so the allele on that single X has to be the recessive one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-affected-father',
      kind: 'try_yourself',
      problem:
        'A man who is red-green color blind (X^a Y) has children with a woman who carries no color-blindness allele at all (X^A X^A). What is expected of their children?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All of the daughters are carriers (X^A X^a) and none of the sons are color blind', correct: true },
        { id: 'b', text: 'All of the sons are color blind and none of the daughters carry the allele' },
        { id: 'c', text: '1/2 of the sons and 1/2 of the daughters are color blind, since the allele is equally likely to reach either' },
        { id: 'd', text: '1/4 of the children are color blind, split evenly between sons and daughters' },
      ],
      expectedAnswer: 'All of the daughters are carriers (X^A X^a) and none of the sons are color blind',
      hints: [
        'The father has only one X. Which of his children receive it, and which receive his Y instead?',
        'Every daughter gets the father\'s X^a plus an X^A from her mother; every son gets the father\'s Y plus an X^A from his mother.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pedigree-pattern',
      kind: 'try_yourself',
      problem:
        'Read this family in words. In generation I, an unaffected male is married to an unaffected female. They have three children: an affected daughter, an unaffected son, and an unaffected daughter. Which conclusion does this pedigree support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The trait is dominant, because it shows up in a child of this couple' },
        { id: 'b', text: 'The trait is X-linked recessive, and the father is a carrier who passed his X^a to his daughter' },
        { id: 'c', text: 'The trait is X-linked dominant, because a daughter is affected while her brother is not' },
        { id: 'd', text: 'The trait is recessive and autosomal, because an affected daughter would need an affected father if it were X-linked', correct: true },
      ],
      expectedAnswer: 'The trait is recessive and autosomal, because an affected daughter would need an affected father if it were X-linked',
      hints: [
        'First settle dominance: two unaffected parents produced an affected child. Can a dominant trait do that?',
        'Now test X-linkage. An affected daughter is X^a X^a, and one of those X chromosomes came from her father — but her father is unaffected, so the gene cannot be on the X.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equal-rates',
      kind: 'misconception_check',
      question:
        'A student says: "The color-blindness allele is just as likely to end up in a boy as in a girl, so about the same number of boys and girls should be color blind." What went wrong?',
      commonErrors: [
        {
          answer: 'Affected males and affected females should occur at about the same rate',
          misconception: 'Confusing how often the allele is INHERITED with how often it is EXPRESSED, and forgetting that males are hemizygous.',
          correctsTo:
            'Sons and daughters really do receive the allele at similar rates — but they need different amounts of it to show the trait. A son has one X, so a single X^a makes him affected (X^a Y). A daughter has two X chromosomes, so one X^a only makes her a carrier (X^A X^a); she must inherit X^a from BOTH parents to be affected. Needing two rare events instead of one is why affected females are so much rarer than affected males.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Males are hemizygous: X^A Y or X^a Y, one X only — never write two X alleles for a male.',
        'One recessive X allele affects a male; a female needs X^a X^a, so affected males far outnumber affected females.',
        'A carrier female X^A X^a shows nothing but passes X^a on: 1/2 of her sons affected, 1/2 of her daughters carriers.',
        'An affected father passes his X^a to ALL daughters and NO sons — father-to-son X-linked transmission is impossible.',
        'Pedigree reading: square = male, circle = female, shaded = affected, horizontal line = mating, vertical line = offspring.',
        'Two unaffected parents with an affected child → recessive. An affected daughter with an unaffected father → autosomal, not X-linked.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.5', cedTitle: 'Sex-Linked Traits & Reading Pedigrees' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
