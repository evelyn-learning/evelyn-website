/**
 * Biology — Cell Division: Meiosis & Gamete Formation.
 *
 * The process template for the HS Biology fan-out (NGSS HS-LS3-2).
 * Two divisions that look alike but do opposite jobs — nearly every student
 * error here is a bookkeeping error about WHICH division separates WHAT and
 * what the chromosome number is at each step, so the concept segment is
 * organized around that ledger.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U4_MEIOSIS: LessonPlan = {
  id: 'evelyn.hs.bio.meiosis.v1',
  title: 'Meiosis & Gamete Formation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.meiosis',
      standard: 'BIO-4.3',
      description:
        'Explain how meiosis halves the chromosome number and produces four genetically different haploid gametes, tracing homologous separation in meiosis I, sister-chromatid separation in meiosis II, and the crossing over and independent assortment that generate variation (NGSS HS-LS3-2).',
    },
  ],
  prerequisites: ['bio.cell-cycle-regulation-cancer'],
  followUps: ['bio.mitosis-meiosis-variation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame meiosis as the reason no two siblings — and no child and parent — are ever the same person.',
      script:
        'You are not a copy of either parent, and unless you have an identical twin, nobody on Earth carries your exact combination of genes. Your brother got the same two parents you did and still came out different. That is not luck at the family level — it is a specific shuffling machine running inside the cells that make eggs and sperm. In this lesson you follow one cell through two divisions, count chromosomes at every step, and see exactly where the shuffling happens.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-divisions',
      kind: 'concept',
      goal: 'Diploid vs haploid, homologous pairs, what each of the two divisions separates, and where variation is generated.',
      keyIdeas: [
        'DIPLOID VS HAPLOID — a DIPLOID (2n) cell carries chromosomes in matching pairs, one member of each pair from each parent. A HAPLOID (n) cell carries just one member of each pair. Human body cells are 2n = 46 (23 pairs); human gametes are n = 23. Ploidy counts SETS, not chromosomes.',
        'HOMOLOGOUS CHROMOSOMES ARE NOT SISTER CHROMATIDS — homologous chromosomes are two SEPARATE chromosomes of the same type, one inherited from each parent, carrying the same genes but possibly different alleles. Sister chromatids are the two identical copies of ONE chromosome, joined at the centromere after DNA replication. Confusing these two is the root of most meiosis errors.',
        'ONE REPLICATION, TWO DIVISIONS — DNA is copied once, before meiosis I. Then the cell divides twice with no copying in between. One 2n cell becomes four n cells. That single-copy, double-divide pattern is what halves the number.',
        'MEIOSIS I IS THE REDUCTION DIVISION — homologous PAIRS separate and go to opposite poles. Each daughter cell now has only one member of each pair, so it is already haploid (n) even though each chromosome still has two sister chromatids attached. This is the step that cuts the number in half.',
        'MEIOSIS II IS THE MITOSIS-LIKE DIVISION — sister CHROMATIDS separate, exactly as in mitosis. No further halving happens here: n cells go in and n cells come out. The job of meiosis II is only to split the doubled chromosomes into single ones.',
        'CROSSING OVER IN PROPHASE I — homologous chromosomes pair up side by side (SYNAPSIS), forming a four-chromatid structure called a TETRAD, and swap matching segments. A chromosome that leaves prophase I is a mosaic of the copy from your mother and the copy from your father — a combination that has never existed before.',
        'INDEPENDENT ASSORTMENT IN METAPHASE I — each homologous pair lines up at the middle independently of every other pair, so which parent\'s member faces which pole is random for each pair. With 23 pairs that alone gives 2 to the 23rd power, over 8 million, possible gamete combinations before crossing over is even counted.',
        'THE PRODUCT AND THE RESTORE — meiosis yields FOUR haploid gametes that are genetically DIFFERENT from each other and from the parent cell. Fertilization then fuses one n egg with one n sperm to rebuild a 2n zygote, which is why the species number stays at 46 generation after generation.',
      ],
      vocabulary: [
        { term: 'homologous chromosomes', definition: 'a matching pair of chromosomes carrying the same genes, one inherited from each parent.' },
        { term: 'tetrad', definition: 'the four-chromatid structure formed when a homologous pair synapses in prophase I; the site of crossing over.' },
        { term: 'haploid (n)', definition: 'having one member of each chromosome pair, as in a gamete.' },
        { term: 'nondisjunction', definition: 'failure of chromosomes or chromatids to separate properly during a meiotic division.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-chromosome-bookkeeping',
      kind: 'worked_example',
      problem:
        'A fruit fly body cell is diploid with 2n = 8, meaning 4 homologous pairs. One such cell enters meiosis. State the number of chromosomes in each cell at four points: after DNA replication but before meiosis I, at the end of meiosis I, at the end of meiosis II, and in the zygote after fertilization by a normal fruit-fly sperm.',
      steps: [
        'After replication, before meiosis I: DNA has been copied, but copying does not create new chromosomes — each of the 8 chromosomes now simply has 2 sister chromatids. Count = 8 chromosomes (2n), each doubled.',
        'End of meiosis I: the 4 homologous pairs separate, one member of each pair to each daughter cell. Each daughter cell gets 4 chromosomes — haploid, n = 4 — and each of those 4 still carries 2 sister chromatids.',
        'End of meiosis II: sister chromatids separate, so each doubled chromosome becomes two single chromosomes that go to different cells. Each of the 4 final gametes still has 4 chromosomes, n = 4 — the number does not halve a second time.',
        'After fertilization: an n = 4 egg fuses with an n = 4 sperm, so the zygote carries 4 + 4 = 8 chromosomes, back to 2n = 8.',
      ],
      answer: 'After replication: 8 (2n, doubled). End of meiosis I: 4 (n, still doubled). End of meiosis II: 4 (n, single). Zygote: 8 (2n).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-which-division-separates-what',
      kind: 'worked_example',
      problem:
        'A student claims: "Meiosis I is the one that works like mitosis, because sister chromatids pull apart in it, and meiosis II is the reduction division, because that is where the cell finally becomes haploid." In a cell with 2n = 6, show where this reasoning breaks and state which division does which job.',
      steps: [
        'Set up the starting cell: 2n = 6 means 3 homologous pairs. After replication each of the 6 chromosomes has 2 sister chromatids, so there are 12 chromatids total but still 6 chromosomes.',
        'Test the claim on meiosis I. If sister chromatids separated here, each daughter cell would receive one chromatid from every one of the 6 chromosomes — that is 6 chromosomes per cell, still 2n. The number would never fall, so the claim already fails: the cell would stay diploid.',
        'What actually happens in meiosis I: whole homologous PAIRS separate. Each daughter cell gets one full member of each of the 3 pairs — 3 chromosomes, n = 3. The cell is haploid the moment meiosis I ends, so meiosis I is the reduction division.',
        'What meiosis II actually does: each of those 3 doubled chromosomes splits at the centromere and its sister chromatids go to opposite poles. Each final cell holds 3 single chromosomes, still n = 3. Chromatid separation with no change in chromosome number is exactly the mitosis pattern — so meiosis II is the mitosis-like division.',
        'Name the confusion precisely: the student swapped homologous chromosomes with sister chromatids. Separating pairs halves the count; separating chromatids does not.',
      ],
      answer: 'The claim is backwards. Meiosis I separates homologous pairs and is the reduction division (2n = 6 becomes n = 3); meiosis II separates sister chromatids and is the mitosis-like division (n = 3 stays n = 3).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-which-separates',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes what separates during meiosis I, and what the cell\'s ploidy is when meiosis I ends?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sister chromatids separate, and the cells are still diploid (2n) at the end of meiosis I' },
        { id: 'b', text: 'Sister chromatids separate, and the cells become haploid (n) at the end of meiosis I' },
        { id: 'c', text: 'Homologous chromosomes separate, and the cells are haploid (n) at the end of meiosis I', correct: true },
        { id: 'd', text: 'Homologous chromosomes separate, but the cells stay diploid (2n) until meiosis II is finished' },
      ],
      expectedAnswer: 'Homologous chromosomes separate, and the cells are haploid (n) at the end of meiosis I',
      hints: [
        'Only one kind of separation can cut the chromosome number in half — which one removes a whole partner chromosome from the cell?',
        'Meiosis I is called the REDUCTION division for a reason: once each pair has been split up, the cell has one member of each pair, which is the definition of haploid.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-gamete-count',
      kind: 'try_yourself',
      problem:
        'A plant species has body cells with 2n = 24. One cell in its reproductive tissue completes meiosis. How many cells are produced, and how many chromosomes does each one contain?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Four cells, each with 12 chromosomes', correct: true },
        { id: 'b', text: 'Two cells, each with 24 chromosomes' },
        { id: 'c', text: 'Four cells, each with 24 chromosomes' },
        { id: 'd', text: 'Two cells, each with 12 chromosomes' },
      ],
      expectedAnswer: 'Four cells, each with 12 chromosomes',
      hints: [
        'Count the divisions first: meiosis divides twice after copying the DNA once, so one starting cell ends as how many cells?',
        'Halve the diploid number once, and only once — the halving happens in meiosis I, not again in meiosis II.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-nondisjunction',
      kind: 'try_yourself',
      problem:
        'In a human egg cell forming from a 2n = 46 cell, one homologous pair fails to separate during meiosis I, so both members of that pair travel into the same daughter cell. That egg is fertilized by a normal sperm carrying 23 chromosomes. Which outcome describes the zygote?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The zygote has 46 chromosomes, because fertilization always corrects an unequal split' },
        { id: 'b', text: 'The zygote has 92 chromosomes, because the whole chromosome number doubles' },
        { id: 'c', text: 'The zygote has 23 chromosomes, because the extra chromosome is discarded before fertilization' },
        { id: 'd', text: 'The zygote has 47 chromosomes — three copies of one chromosome type, a trisomy — because the egg carried 24 instead of 23', correct: true },
      ],
      expectedAnswer: 'The zygote has 47 chromosomes — three copies of one chromosome type, a trisomy — because the egg carried 24 instead of 23',
      hints: [
        'Work out the egg first: if one pair went to the same cell instead of splitting, how many chromosomes does that egg carry?',
        'Add the sperm\'s 23 to the egg\'s count. Nothing in fertilization checks or repairs the number — the zygote simply gets the sum.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-four-identical',
      kind: 'misconception_check',
      question:
        'A student writes: "Meiosis makes two identical daughter cells, just like mitosis does, only with half the chromosomes." What went wrong?',
      commonErrors: [
        {
          answer: 'Meiosis produces two identical cells with half the chromosomes',
          misconception: 'Treating meiosis as mitosis with a smaller output — collapsing the two divisions into one and assuming the products are copies, which erases the entire point of the process.',
          correctsTo:
            'Meiosis divides TWICE after a single round of DNA copying, so one cell yields FOUR cells, not two. And those four are genetically DIFFERENT from one another: crossing over in prophase I rebuilds each chromosome as a mix of the two parental versions, and independent assortment in metaphase I sends a random member of each pair to each pole. Mitosis preserves the genome; meiosis deliberately shuffles it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Diploid (2n) means chromosomes in matching pairs; haploid (n) means one member of each pair. Humans: 2n = 46 body cells, n = 23 gametes.',
        'DNA is copied once, then the cell divides twice: one 2n cell yields four haploid gametes.',
        'Meiosis I separates HOMOLOGOUS PAIRS — the reduction division, where the number halves. Meiosis II separates SISTER CHROMATIDS and changes no numbers, just like mitosis.',
        'Variation comes from crossing over at the tetrads in prophase I and independent assortment of the pairs in metaphase I, so all four gametes differ.',
        'Nondisjunction — a pair or a chromatid failing to separate — gives a gamete with an extra or missing chromosome, and can produce a trisomy (47 chromosomes in humans). Normal fertilization restores 2n by fusing two haploid gametes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Meiosis & Gamete Formation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
