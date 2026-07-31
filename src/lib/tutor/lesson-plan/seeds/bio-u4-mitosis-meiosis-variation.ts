/**
 * Biology — Cell Division: Comparing Mitosis & Meiosis: Sources of Genetic Variation.
 *
 * The synthesis slot for the HS Biology fan-out (NGSS HS-LS3-2). Both
 * processes have already been taught mechanically; this lesson puts them
 * side by side on six comparison rows and then spends its second half on
 * the three shuffling mechanisms — crossing over, independent assortment,
 * random fertilization — so variation stops being a vocabulary list and
 * becomes the reason sexual reproduction exists.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U4_MITOSIS_MEIOSIS_VARIATION: LessonPlan = {
  id: 'evelyn.hs.bio.mitosis-meiosis-variation.v1',
  title: 'Comparing Mitosis & Meiosis: Sources of Genetic Variation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.mitosis-meiosis-variation',
      standard: 'BIO-4.4',
      description:
        'Compare mitosis and meiosis across purpose, divisions, daughter-cell number, ploidy and genetic identity, and explain how crossing over, independent assortment and random fertilization generate the inheritable variation a population needs (NGSS HS-LS3-2).',
    },
  ],
  prerequisites: ['bio.meiosis'],
  followUps: ['bio.mendel-laws'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the lesson around why siblings differ while a healing cut does not.',
      script:
        'Cut your finger and the new skin is an exact copy of the old skin — your body would be in real trouble if it improvised there. But two siblings from the same parents can look nothing alike, and they came from the same two genomes. Your body runs two completely different division programs: one built to COPY, one built to SHUFFLE. Today you put them side by side, and then you find out exactly where the shuffling happens — three separate places, and together they are the reason no one has ever had your genome before.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-compare-and-shuffle',
      kind: 'concept',
      goal: 'The six-row mitosis/meiosis comparison, then the three sources of variation and their relative contributions.',
      keyIdeas: [
        'PURPOSE — mitosis is for GROWTH, REPAIR and asexual reproduction: it makes copies. Meiosis is for SEXUAL REPRODUCTION only: it makes gametes (eggs and sperm). Every row below follows from this one difference.',
        'DIVISIONS AND DAUGHTER CELLS — mitosis is ONE division producing 2 daughter cells. Meiosis is TWO divisions (meiosis I then meiosis II) with no DNA copying in between, producing 4 daughter cells.',
        'PLOIDY — mitosis starts 2n and ends 2n: the chromosome number is preserved. Meiosis starts 2n and ends n: the number is HALVED. Meiosis I is the reduction step, where homologous pairs separate; meiosis II separates sister chromatids and does not change ploidy.',
        'GENETIC IDENTITY — mitosis daughter cells are genetically IDENTICAL to the parent cell and to each other. Meiosis daughter cells are all genetically DIFFERENT from the parent and from one another. This is the row students most often get backwards.',
        'CELL TYPES INVOLVED — mitosis runs in body (somatic) cells: skin, liver, root tip. Meiosis runs only in the reproductive tissue that makes gametes. A human skin cell can never do meiosis, and a sperm cell is a dead end that never divides again.',
        'SOURCE 1: CROSSING OVER — during prophase I, homologous chromosomes pair up and physically swap matching segments. The result is a chromosome that is part maternal and part paternal, a combination that existed in neither parent. This happens before any counting of chromosomes, so it multiplies variation on top of everything below.',
        'SOURCE 2: INDEPENDENT ASSORTMENT — at metaphase I each homologous pair lines up facing either pole at random, independently of every other pair. With 23 human pairs that alone gives 2 to the 23rd power, about 8.4 million, different gamete chromosome combinations — the largest single contributor before fertilization.',
        'SOURCE 3: RANDOM FERTILIZATION — any one of those roughly 8.4 million eggs can meet any one of roughly 8.4 million sperm, which multiplies out to about 70 trillion possible zygotes from a single couple, and crossing over pushes it far past that. WHY IT MATTERS: a population of identical individuals meets a new disease or a climate shift with one identical response. Variation is the raw material natural selection acts on, which is exactly where Unit 7 picks up.',
      ],
      vocabulary: [
        { term: 'diploid (2n)', definition: 'a cell carrying two full sets of chromosomes, one from each parent — human body cells, 46 chromosomes.' },
        { term: 'haploid (n)', definition: 'a cell carrying one set of chromosomes — human gametes, 23 chromosomes.' },
        { term: 'homologous chromosomes', definition: 'the matching pair of chromosomes carrying the same genes, one inherited from each parent.' },
        { term: 'independent assortment', definition: 'the random pole-facing orientation of each homologous pair at metaphase I, shuffling whole chromosomes between gametes.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-the-process',
      kind: 'worked_example',
      problem:
        'A biologist watches a single cell from a grasshopper divide and records the outcome: it ends up as 4 cells, each with half as many chromosomes as the original, and DNA sequencing shows all 4 differ from one another. Which process was it, and which observation alone would have been enough to decide?',
      steps: [
        'Take the daughter-cell count first: 4 cells from one starting cell means two rounds of division. Mitosis produces 2 cells from one division, so 4 already points away from mitosis.',
        'Check ploidy: the chromosome number was halved, going 2n to n. Mitosis preserves chromosome number; only meiosis reduces it.',
        'Check genetic identity: the 4 cells differ from one another. Mitosis daughter cells are identical copies, so difference rules mitosis out a third time.',
        'All three observations agree, so the process is meiosis. Any ONE of them would have settled it, but the strongest single piece of evidence is the halved chromosome number, because that reduction happens in meiosis I and nowhere else in the cell cycle.',
      ],
      answer: 'Meiosis — and the halved chromosome number alone is decisive, since only meiosis goes from 2n to n.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-crossing-over-timing',
      kind: 'worked_example',
      problem:
        'A student claims: "Crossing over is what makes my skin cells slightly different from each other, and it is also why my two arms are not identical." Trace where that reasoning breaks down, and state where crossing over actually occurs.',
      steps: [
        'Name the process building skin cells: skin is body tissue, so it grows and repairs by mitosis. Mitosis makes genetically identical copies, so skin cells across the body carry the same genome.',
        'Ask when crossing over occurs: it happens in prophase I, a stage that exists only in meiosis I. Mitosis has a prophase, but homologous chromosomes never pair up in it, so there is no swapping partner and no crossing over.',
        'Follow the consequence: because mitosis has no crossing over and no independent assortment, it produces no genetic variation at all. Differences between two arms come from development and environment, not from shuffled DNA.',
        'Place crossing over correctly: it happens in the reproductive tissue that makes gametes, during prophase I, and its effect shows up in the NEXT generation — in the student\'s children, not in the student\'s own skin.',
      ],
      answer: 'The reasoning fails because skin arises by mitosis, which generates no variation. Crossing over occurs only in prophase I of meiosis, in gamete-forming cells, and affects offspring rather than the parent\'s own body.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-outcome-to-process',
      kind: 'try_yourself',
      problem:
        'A plant root-tip cell divides once and produces 2 daughter cells. Each daughter has exactly the same number of chromosomes as the original cell, and their DNA sequences are identical. Which process occurred, and what was it for?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Meiosis — it makes 2 haploid (n) cells for reproduction' },
        { id: 'b', text: 'Mitosis — it makes 2 identical diploid (2n) cells for growth and repair', correct: true },
        { id: 'c', text: 'Meiosis — it makes 4 genetically unique haploid (n) cells, two at a time' },
        { id: 'd', text: 'Mitosis — it makes 2 genetically unique diploid (2n) cells, which is how plants create variation' },
      ],
      expectedAnswer: 'Mitosis — it makes 2 identical diploid (2n) cells for growth and repair',
      hints: [
        'Two comparison rows are given to you here: the daughter-cell count and whether the DNA is identical. Which process matches both?',
        'A root tip is body tissue that is growing, and the chromosome number did not change — no reduction happened, so nothing was halved.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-source-of-variation',
      kind: 'try_yourself',
      problem:
        'During one cell division, a chromosome inherited from an organism\'s mother physically exchanges a matching segment with the chromosome inherited from its father, producing a chromosome that is part maternal and part paternal. Which source of variation is this, and when does it happen?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Independent assortment, during metaphase I of meiosis' },
        { id: 'b', text: 'Random fertilization, at the moment egg and sperm fuse' },
        { id: 'c', text: 'Crossing over, during prophase I of meiosis', correct: true },
        { id: 'd', text: 'Crossing over, during prophase of mitosis in body cells' },
      ],
      expectedAnswer: 'Crossing over, during prophase I of meiosis',
      hints: [
        'Two of the three sources shuffle WHOLE chromosomes between cells; only one physically swaps a piece of one chromosome for the matching piece of another.',
        'Homologous chromosomes have to pair up before they can swap segments — and that pairing happens in exactly one stage of one process.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-independent-assortment-count',
      kind: 'try_yourself',
      problem:
        'An imaginary animal has 4 pairs of homologous chromosomes (2n = 8). Considering independent assortment ALONE — ignore crossing over — how many genetically different gamete chromosome combinations can one individual produce, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '16 combinations, because each of the 4 pairs orients toward either pole independently, giving 2 to the 4th power', correct: true },
        { id: 'b', text: '8 combinations, because the animal has 8 chromosomes in total' },
        { id: 'c', text: '4 combinations, because there are 4 homologous pairs and each pair gives one gamete type' },
        { id: 'd', text: '2 combinations, because every gamete is either all-maternal or all-paternal' },
      ],
      expectedAnswer: '16 combinations, because each of the 4 pairs orients toward either pole independently, giving 2 to the 4th power',
      hints: [
        'At metaphase I each pair independently faces one pole or the other — that is 2 choices per pair, not 2 choices in total.',
        'Multiply the choices: 2 for the first pair, times 2 for the second, and so on for all 4 pairs. The human version of this same count is 2 to the 23rd power.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mitosis-makes-variation',
      kind: 'misconception_check',
      question:
        'A student writes: "Both mitosis and meiosis create genetic variation — meiosis just creates more of it, because it divides twice and crossing over happens in both processes." What went wrong?',
      commonErrors: [
        {
          answer: 'Mitosis creates variation too, just less of it',
          misconception:
            'Treating the mitosis/meiosis difference as a matter of DEGREE — more divisions, more shuffling — instead of a difference in KIND: one process is a copier, the other is a shuffler.',
          correctsTo:
            'Mitosis creates NO genetic variation at all. Its daughter cells are identical copies of the parent cell, which is precisely the point — you want replacement skin, not improvised skin. Crossing over requires homologous chromosomes to pair up, and that pairing happens only in prophase I of meiosis, never in mitosis. Meiosis is not a more-shuffled mitosis; it is the only one of the two that shuffles anything.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mitosis: 1 division, 2 daughter cells, 2n stays 2n, genetically identical, in body cells, for growth and repair.',
        'Meiosis: 2 divisions, 4 daughter cells, 2n becomes n, all genetically different, in gamete-forming cells, for sexual reproduction.',
        'Meiosis I is the reduction step (homologous pairs separate); meiosis II separates sister chromatids and does not change ploidy.',
        'Three sources of variation: crossing over (prophase I), independent assortment (metaphase I, about 8.4 million combinations in humans), random fertilization (about 70 trillion zygote combinations per couple).',
        'Mitosis preserves, meiosis shuffles — mitosis produces no variation whatsoever, and variation is the raw material natural selection needs.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Comparing Mitosis & Meiosis: Sources of Genetic Variation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
