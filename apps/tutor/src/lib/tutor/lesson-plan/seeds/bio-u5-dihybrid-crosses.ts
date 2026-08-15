/**
 * Biology — Mendelian Genetics: Dihybrid Crosses & Probability.
 *
 * The direct sequel to the monohybrid lesson (NGSS HS-LS3-3): the same
 * grid, now tracking two genes at once. Two skills carry the lesson —
 * splitting a dihybrid parent into its four gamete types, and the
 * probability shortcut that replaces the 16-box grid with one
 * multiplication. As in the monohybrid plan every check is an MCQ: ratios
 * like 9:3:3:1 and fractions like 3/16 have too many valid spellings to
 * grade by exact match, so the distractors carry the classic errors.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U5_DIHYBRID_CROSSES: LessonPlan = {
  id: 'evelyn.hs.bio.dihybrid-crosses.v1',
  title: 'Dihybrid Crosses & Probability',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.dihybrid-crosses',
      standard: 'BIO-5.3',
      description:
        'Predict offspring phenotype ratios for a two-trait cross by listing the four gamete types of a dihybrid parent and filling a 16-box Punnett square, and obtain the probability of any single combination by multiplying the two independent single-trait probabilities (NGSS HS-LS3-3).',
    },
  ],
  prerequisites: ['bio.punnett-squares-monohybrid'],
  followUps: ['bio.non-mendelian-inheritance'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame two-trait crosses as the everyday problem of breeding for two things at once.',
      script:
        'A wheat breeder almost never wants just one thing. She wants a plant that resists fungal blight AND produces a heavy head of grain — and she has to get both into the same seed. A tomato grower wants red fruit and thick skin; a dog breeder wants a coat color and a healthy hip. The four-box square you already know only tracks one trait. Today you learn the grid that tracks two, the famous 9:3:3:1 pattern it produces, and a shortcut that gets you the answer for one combination without drawing sixteen boxes at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dihybrid-mechanics',
      kind: 'concept',
      goal: 'Gametes from a dihybrid parent, the 16-box grid, the 9:3:3:1 signature, and the probability shortcut.',
      keyIdeas: [
        'TWO GENES, TWO LETTER PAIRS — a dihybrid genotype carries one pair per gene, written together: RrYy means Rr for the first gene and Yy for the second. In peas, R = round seed (dominant to r = wrinkled) and Y = yellow seed (dominant to y = green). Always keep the pairs in the same order so you can read them at a glance.',
        "INDEPENDENT ASSORTMENT — Mendel's second law: which allele a gamete gets for gene 1 does not affect which allele it gets for gene 2. That independence is the whole reason the two traits can be handled separately, and it is what the probability shortcut relies on.",
        'FOUR GAMETE TYPES, FOUND BY FOIL-STYLE PAIRING — a gamete gets exactly ONE letter from each pair. Take each letter of the first pair and pair it with each letter of the second: R with Y, R with y, r with Y, r with y. So RrYy → RY, Ry, rY, ry — four types, in equal numbers. The classic error is writing a gamete as RR or Yy: a gamete never carries both alleles of the same gene, and it never leaves a gene out.',
        'THE 16-BOX GRID — write the first parent\'s four gamete types across the top and the second parent\'s four down the side, then fill each of the 4 × 4 = 16 boxes by combining its row and column letters. Sort each box so the letters for the same gene sit together and the dominant one comes first: R and r and Y and y written as RrYy, never rRyY.',
        'THE SIGNATURE CROSS — RrYy × RrYy fills out to a PHENOTYPE ratio of 9:3:3:1 — 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green. Note what the numbers mean: 9 boxes show BOTH dominant traits, the two 3s show one dominant and one recessive, and the single 1 is the double recessive rryy. Answering 3:1 here is the single most common mistake — 3:1 is the one-trait answer.',
        'THE FORK / PROBABILITY SHORTCUT — because the genes assort independently, handle one trait at a time and MULTIPLY. For RrYy × RrYy: each single-trait cross is Rr × Rr, which gives 3/4 dominant and 1/4 recessive. So round and yellow = 3/4 × 3/4 = 9/16; round and green = 3/4 × 1/4 = 3/16; wrinkled green = 1/4 × 1/4 = 1/16. Multiplying the four combinations back out reproduces 9:3:3:1 without drawing a single box.',
        'MULTIPLY, NEVER ADD — probabilities of independent events that must BOTH happen are multiplied. Adding 3/4 + 3/4 gives 6/4, a probability above 1, which is impossible — a useful self-check. Add only when you want one outcome OR another, such as "round green or wrinkled yellow" = 3/16 + 3/16 = 6/16.',
        'THE DIHYBRID TEST CROSS — to expose a hidden genotype, cross the unknown with the double recessive rryy, which makes only ry gametes. If the unknown is RrYy it makes RY, Ry, rY and ry in equal numbers, so the offspring come out in a 1:1:1:1 phenotype ratio — round yellow : round green : wrinkled yellow : wrinkled green. Seeing 1:1:1:1 is direct evidence the tested parent was heterozygous for both genes.',
      ],
      vocabulary: [
        { term: 'dihybrid cross', definition: 'a cross that tracks two different genes at the same time, such as RrYy × RrYy.' },
        { term: 'independent assortment', definition: 'the rule that alleles of one gene sort into gametes without regard to the alleles of another gene.' },
        { term: 'gamete', definition: 'a sex cell carrying exactly one allele for each gene, such as RY or ry.' },
      ],
      suggestedTools: ['show_punnett', 'show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-nine-three-three-one',
      kind: 'worked_example',
      problem:
        'In pea plants, round seeds (R) are dominant to wrinkled seeds (r), and yellow seeds (Y) are dominant to green seeds (y). Two plants that are heterozygous for both genes are crossed: RrYy × RrYy. Derive the phenotype ratio of the offspring.',
      steps: [
        'List each parent\'s gametes by pairing one letter from each pair: R with Y, R with y, r with Y, r with y → RY, Ry, rY, ry. Both parents are RrYy, so both produce the same four types in equal numbers.',
        'Set up the grid: RY, Ry, rY, ry across the top and the same four down the side. That is 4 × 4 = 16 boxes, each equally likely.',
        'Fill the boxes by combining row and column letters, sorting each result so the gene-1 pair comes first and the dominant letter leads — for example the ry row crossed with the Ry column gives R, r, Y, y → RrYy.',
        'Now classify each box by PHENOTYPE, not genotype. A box is round if it contains at least one R, and yellow if it contains at least one Y.',
        'Count the four groups: 9 boxes have at least one R and at least one Y (round yellow); 3 boxes have at least one R but are yy (round green); 3 boxes are rr but have at least one Y (wrinkled yellow); exactly 1 box is rryy (wrinkled green).',
        'Check the count: 9 + 3 + 3 + 1 = 16, which matches the number of boxes — so nothing was missed or double-counted.',
      ],
      answer: '9:3:3:1 — 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-probability-shortcut',
      kind: 'worked_example',
      problem:
        'In pea plants, tall (T) is dominant to short (t), and yellow seeds (Y) are dominant to green seeds (y). Two plants heterozygous for both genes are crossed: TtYy × TtYy. Without drawing a 16-box grid, find the probability that a single offspring is TALL WITH GREEN SEEDS.',
      steps: [
        'Split the two-trait question into two one-trait questions, which is allowed because the genes assort independently.',
        'Trait 1 — height: the cross is Tt × Tt, the familiar 3:1 cross, so the probability of tall is 3/4.',
        'Trait 2 — seed color: the cross is Yy × Yy, also 3:1, so the probability of the recessive green (yy) is 1/4.',
        'The offspring must be tall AND green, so multiply the two independent probabilities: 3/4 × 1/4 = 3/16.',
        'Sanity-check against the full grid: 3/16 is exactly one of the two 3s in the 9:3:3:1 pattern, so the shortcut agrees with the 16 boxes. (Adding instead — 3/4 + 1/4 = 1 — would claim every offspring is tall and green, which is obviously wrong.)',
      ],
      answer: '3/16 — the probability of tall (3/4) times the probability of green (1/4).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-gametes',
      kind: 'try_yourself',
      problem:
        'In tomatoes, tall vines (T) are dominant to dwarf vines (t), and yellow fruit (Y) is dominant to red fruit (y). A plant with the genotype TtYy is used as a parent. Which set lists all the gamete types it can produce?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'TT, Tt, Yy, yy' },
        { id: 'b', text: 'TY, Ty, tY, ty', correct: true },
        { id: 'c', text: 'TtYy only' },
        { id: 'd', text: 'Tt and Yy' },
      ],
      expectedAnswer: 'TY, Ty, tY, ty',
      hints: [
        'A gamete carries exactly ONE letter for each gene — one from the Tt pair and one from the Yy pair. It never carries both alleles of the same gene, and it never skips a gene.',
        'Pair each letter of Tt with each letter of Yy in turn: T with Y, T with y, t with Y, t with y.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-phenotype-ratio',
      kind: 'try_yourself',
      problem:
        'In pea plants, round seeds (R) are dominant to wrinkled seeds (r), and yellow seeds (Y) are dominant to green seeds (y). Two plants heterozygous for both genes are crossed: RrYy × RrYy. What phenotype ratio is expected in the offspring?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3:1 round to wrinkled' },
        { id: 'b', text: '1:2:1 round yellow : round green : wrinkled green' },
        { id: 'c', text: '1:1:1:1 round yellow : round green : wrinkled yellow : wrinkled green' },
        { id: 'd', text: '9:3:3:1 round yellow : round green : wrinkled yellow : wrinkled green', correct: true },
      ],
      expectedAnswer: '9:3:3:1 round yellow : round green : wrinkled yellow : wrinkled green',
      hints: [
        'This cross tracks TWO genes, so the answer must name four phenotype groups, not two. A 3:1 answer is the one-trait result.',
        'Each parent makes four gamete types, so the grid has 4 × 4 = 16 equally likely boxes — and the four counts must add to 16.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-probability-combination',
      kind: 'try_yourself',
      problem:
        'In pea plants, tall (T) is dominant to short (t), and green pods (G) are dominant to yellow pods (g). Two plants heterozygous for both genes are crossed: TtGg × TtGg. What is the probability that a single offspring is TALL WITH YELLOW PODS?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3/16', correct: true },
        { id: 'b', text: '9/16' },
        { id: 'c', text: '1 (that is, 3/4 + 1/4)' },
        { id: 'd', text: '1/16' },
      ],
      expectedAnswer: '3/16',
      hints: [
        'Handle one trait at a time: the chance of tall from Tt × Tt, and the chance of yellow pods (the recessive gg) from Gg × Gg.',
        'The offspring must be tall AND yellow-podded, so MULTIPLY the two probabilities — adding them would give a value of 1, which cannot be right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-vs-multiply',
      kind: 'misconception_check',
      question:
        'A student is asked for the chance that an offspring of RrYy × RrYy is round AND yellow. They write: "Round is 3/4 and yellow is 3/4, so together that is 3/4 + 3/4 = 6/4." What went wrong?',
      commonErrors: [
        {
          answer: '6/4 (adding the two single-trait probabilities)',
          misconception: 'Adding independent probabilities for an outcome that requires BOTH events, instead of multiplying — and not noticing that the result exceeds 1.',
          correctsTo:
            'When two independent things must BOTH happen, multiply: 3/4 × 3/4 = 9/16, which matches the 9 in the 9:3:3:1 pattern. Addition is for "this OR that" outcomes, such as round green or wrinkled yellow = 3/16 + 3/16 = 6/16. Any probability above 1 is impossible, so 6/4 is an instant signal that the wrong operation was used.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A dihybrid genotype carries one pair per gene (RrYy); a gamete carries exactly one letter from each pair.',
        'RrYy → four gamete types in equal numbers: RY, Ry, rY, ry — pair each letter of the first gene with each letter of the second.',
        'RrYy × RrYy fills a 4 × 4 = 16-box grid and gives the phenotype ratio 9:3:3:1; 9 + 3 + 3 + 1 = 16 is the check. A 3:1 answer means only one trait was tracked.',
        'Shortcut: do each trait separately and MULTIPLY — 3/4 × 3/4 = 9/16 for both dominant, 3/4 × 1/4 = 3/16 for one of each, 1/4 × 1/4 = 1/16 for the double recessive. Add only for "one outcome OR another".',
        'A dihybrid test cross against the double recessive rryy gives a 1:1:1:1 phenotype ratio, showing the tested parent was heterozygous for both genes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Dihybrid Crosses & Probability' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
