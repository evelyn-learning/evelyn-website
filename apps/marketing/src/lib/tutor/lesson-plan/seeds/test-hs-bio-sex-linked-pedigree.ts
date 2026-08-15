/**
 * TEST PLAN — HS Biology — Sex-Linked Inheritance and Pedigree Analysis.
 *
 * QA harness, not production content. Designed to invite:
 *   - show_pedigree — rare in existing seeds; exercises the standard
 *     genetics-notation chart (squares, circles, generations, marriages,
 *     children).
 *   - show_punnett — sex-linked monohybrid cross (X^a X^a × X^A Y).
 *   - show_concept_map — DENSE leaf row (5+ nodes with multi-line
 *     labels) to exercise the recent renderer fix that staggers and
 *     wraps overlapping rectangles.
 *   - show_table — genotype/phenotype frequency table; brain should
 *     follow with tutor_scribble({ target: "row-3-col-2" or similar
 *     cell name }, shape: "circle") to test cell-targeted scribbling.
 *
 * Coverage gap this fills: existing bio-mendelian-genetics covers
 * autosomal Punnett crosses; sex-linked + pedigree analysis is adjacent
 * and not directly covered.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_HS_BIO_SEX_LINKED_PEDIGREE: LessonPlan = {
  id: 'evelyn.test.hs.bio.sex-linked-pedigree.v1',
  title: '[TEST] HS Biology — Sex-Linked Inheritance and Pedigree Analysis',
  curriculum: 'NGSS',
  grade: '9-12',
  subject: 'science',
  topic: 'genetics',
  locale: 'en',
  los: [
    {
      id: 'ngss.hs-ls3-2',
      description: 'Make and defend a claim based on evidence that inheritable genetic variations may result from new genetic combinations through meiosis, viable errors during replication, and/or mutations caused by environmental factors.',
      standard: 'NGSS.HS-LS3-2',
    },
    {
      id: 'evelyn.hs.bio.sex-linked.cross',
      description: 'Predict offspring genotypes and phenotypes for X-linked traits using a Punnett square; interpret a pedigree to identify likely inheritance patterns.',
    },
  ],
  prerequisites: ['ngss.ms-ls3-2', 'evelyn.hs.bio.mendelian.basic-cross'],
  followUps: ['evelyn.hs.bio.population-genetics.hardy-weinberg'],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the surprising prevalence of red-green color blindness — about 1 in 12 men but only 1 in 200 women. Why the asymmetry?',
      script: 'Roughly 1 in 12 men is red-green color blind. For women: 1 in 200. Same condition, same gene — so why ten times more common in men? The answer: that gene lives on the X chromosome, and that one fact changes everything about how the trait is inherited.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-x-linkage',
      kind: 'concept',
      goal: 'Sex-linked traits live on the X (or much rarer, Y) chromosome. Because males have only one X, a single recessive allele expresses; females need two copies.',
      keyIdeas: [
        'AUTOSOMAL chromosomes are pairs 1-22 — both copies present in both sexes.',
        'SEX chromosomes: females are XX, males are XY.',
        'X-LINKED RECESSIVE traits live on the X. Females need TWO copies (X^a X^a) to express; males need only ONE (X^a Y) because there\'s no second X to mask it.',
        'CARRIER females (X^A X^a) don\'t express the trait but pass the allele to ~half their children.',
        'A father CANNOT pass an X-linked allele to his sons (he gives them his Y, not his X).',
      ],
      vocabulary: [
        { term: 'sex-linked', definition: 'a trait whose gene is on a sex chromosome (usually the X).' },
        { term: 'carrier', definition: 'an individual who has one copy of a recessive allele but does not express the trait.' },
        { term: 'hemizygous', definition: 'having only one copy of a gene — true of males for X-linked genes.' },
      ],
      suggestedTools: ['show_concept_map', 'show_table'],
      teacherNote: 'For show_concept_map, ask the brain to build a DENSE leaf row off a central "X-linked recessive" node: Carrier-female (X^A X^a, normal vision), Affected-female (X^a X^a, color-blind), Normal-male (X^A Y), Affected-male (X^a Y), and Unaffected-female (X^A X^A). Five leaves, multi-line labels — exercises the dense-row rendering fix.',
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cross',
      kind: 'worked_example',
      problem: 'A carrier mother (X^A X^a) and a normal-vision father (X^A Y) have children. What are the chances each child is color blind?',
      steps: [
        'Set up the Punnett square. Mother\'s gametes: X^A and X^a. Father\'s gametes: X^A and Y.',
        'Fill the four cells: X^A X^A, X^A X^a, X^A Y, X^a Y.',
        'Read off the four equally-likely outcomes — daughters: 1 normal, 1 carrier; sons: 1 normal, 1 affected.',
        'Probability any one child is color blind = 1/4. Among sons specifically = 1/2. Among daughters = 0.',
      ],
      answer: '1/4 of all children; 1/2 of sons; 0 of daughters.',
      estimatedMinutes: 5,
    },
    {
      id: 'concept-pedigree',
      kind: 'concept',
      goal: 'Pedigrees use standard symbols to track a trait across generations. Squares are males, circles are females, filled = affected.',
      keyIdeas: [
        'SQUARE = male. CIRCLE = female.',
        'FILLED shape = affected. UNFILLED = unaffected (may still be a carrier).',
        'A horizontal line between two shapes = a marriage.',
        'A vertical line dropping down to a row of children = their offspring.',
        'X-linked recessive PATTERN: more males affected; affected fathers can\'t have affected sons (a son got Dad\'s Y, not Dad\'s X); the trait often skips a generation through carrier mothers.',
      ],
      suggestedTools: ['show_pedigree'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A pedigree shows a grandfather who is color blind. His daughter has normal vision. Her two sons: one is color blind, one isn\'t. Is this consistent with X-linked recessive inheritance?',
      expectedAnswer: 'yes — the daughter is an obligate carrier (got X^a from dad), and her sons each have a 50% chance of being affected.',
      responseFormat: 'free',
      hints: [
        'Trace the X chromosomes. What did the daughter get from her color-blind father?',
        'A color-blind father passes X^a to ALL daughters. So his daughter must be a carrier (X^A X^a).',
        'A carrier mother\'s sons: half X^A Y (normal), half X^a Y (affected). One of each is exactly the expected ratio.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-father-to-son',
      kind: 'misconception_check',
      question: 'A student says "if a father is color blind, his sons will be color blind too." Why is that wrong?',
      commonErrors: [
        {
          answer: 'sons inherit it from the father',
          misconception: 'Forgetting that fathers pass Y (not X) to sons.',
          correctsTo: 'A father gives his sons the Y chromosome, not the X. The X-linked allele cannot move father → son. Sons inherit X-linked traits from their MOTHER. So a color-blind father cannot directly pass color blindness to his sons; only via his daughters (who become carriers and may pass it to grandsons).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Females XX, males XY. X-linked recessive expresses with one copy in males, two in females.',
        'Carrier females (X^A X^a) pass the allele to ~half their children.',
        'Father → son CANNOT transmit an X-linked allele.',
        'Pedigree pattern for X-linked recessive: more males, often skips generations through carrier mothers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are X-linked DOMINANT traits much rarer in casework than X-linked recessives, even though there are plenty of dominant X-linked alleles in nature?',
      hint: 'Dominant lethal alleles often kill the embryo; X-linked recessives are masked in carrier females, which lets them persist in populations.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
