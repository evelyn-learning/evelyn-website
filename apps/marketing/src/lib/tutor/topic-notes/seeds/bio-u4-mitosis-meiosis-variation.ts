/**
 * Biology — Unit 4 CED 4.4: Comparing Mitosis & Meiosis: Sources of Genetic Variation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.mitosis-meiosis-variation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U4_MITOSIS_MEIOSIS_VARIATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.mitosis-meiosis-variation.v1',
  course: 'Biology',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Comparing Mitosis & Meiosis: Sources of Genetic Variation',
  planId: 'evelyn.hs.bio.mitosis-meiosis-variation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.mitosis-meiosis-variation.v1' }],
  theory: [
    { loId: 'bio.mitosis-meiosis-variation', kind: 'framework', title: 'Purpose', content: `PURPOSE — mitosis is for GROWTH, REPAIR and asexual reproduction: it makes copies. Meiosis is for SEXUAL REPRODUCTION only: it makes gametes (eggs and sperm). Every row below follows from this one difference.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'framework', title: 'Divisions and daughter cells', content: `DIVISIONS AND DAUGHTER CELLS — mitosis is ONE division producing 2 daughter cells. Meiosis is TWO divisions (meiosis I then meiosis II) with no DNA copying in between, producing 4 daughter cells.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'framework', title: 'Ploidy', content: `PLOIDY — mitosis starts 2n and ends 2n: the chromosome number is preserved. Meiosis starts 2n and ends n: the number is HALVED. Meiosis I is the reduction step, where homologous pairs separate; meiosis II separates sister chromatids and does not change ploidy.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'framework', title: 'Genetic identity', content: `GENETIC IDENTITY — mitosis daughter cells are genetically IDENTICAL to the parent cell and to each other. Meiosis daughter cells are all genetically DIFFERENT from the parent and from one another. This is the row students most often get backwards.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'framework', title: 'Cell types involved', content: `CELL TYPES INVOLVED — mitosis runs in body (somatic) cells: skin, liver, root tip. Meiosis runs only in the reproductive tissue that makes gametes. A human skin cell can never do meiosis, and a sperm cell is a dead end that never divides again.` },
    { loId: 'bio.mitosis-meiosis-variation', content: `SOURCE 1: CROSSING OVER — during prophase I, homologous chromosomes pair up and physically swap matching segments. The result is a chromosome that is part maternal and part paternal, a combination that existed in neither parent. This happens before any counting of chromosomes, so it multiplies variation on top of everything below.` },
    { loId: 'bio.mitosis-meiosis-variation', content: `SOURCE 2: INDEPENDENT ASSORTMENT — at metaphase I each homologous pair lines up facing either pole at random, independently of every other pair. With 23 human pairs that alone gives 2 to the 23rd power, about 8.4 million, different gamete chromosome combinations — the largest single contributor before fertilization.` },
    { loId: 'bio.mitosis-meiosis-variation', content: `SOURCE 3: RANDOM FERTILIZATION — any one of those roughly 8.4 million eggs can meet any one of roughly 8.4 million sperm, which multiplies out to about 70 trillion possible zygotes from a single couple, and crossing over pushes it far past that. WHY IT MATTERS: a population of identical individuals meets a new disease or a climate shift with one identical response. Variation is the raw material natural selection acts on, which is exactly where Unit 7 picks up.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'definition', title: 'diploid (2n)', content: `a cell carrying two full sets of chromosomes, one from each parent — human body cells, 46 chromosomes.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'definition', title: 'haploid (n)', content: 'a cell carrying one set of chromosomes — human gametes, 23 chromosomes.' },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'definition', title: 'homologous chromosomes', content: `the matching pair of chromosomes carrying the same genes, one inherited from each parent.` },
    { loId: 'bio.mitosis-meiosis-variation', kind: 'definition', title: 'independent assortment', content: `the random pole-facing orientation of each homologous pair at metaphase I, shuffling whole chromosomes between gametes.` },
  ],
  methods: [
    {
      title: 'Worked identify the process',
      steps: [
        `Take the daughter-cell count first: 4 cells from one starting cell means two rounds of division. Mitosis produces 2 cells from one division, so 4 already points away from mitosis.`,
        `Check ploidy: the chromosome number was halved, going 2n to n. Mitosis preserves chromosome number; only meiosis reduces it.`,
        `Check genetic identity: the 4 cells differ from one another. Mitosis daughter cells are identical copies, so difference rules mitosis out a third time.`,
        `All three observations agree, so the process is meiosis. Any ONE of them would have settled it, but the strongest single piece of evidence is the halved chromosome number, because that reduction happens in meiosis I and nowhere else in the cell cycle.`,
      ],
      example: { problem: `A biologist watches a single cell from a grasshopper divide and records the outcome: it ends up as 4 cells, each with half as many chromosomes as the original, and DNA sequencing shows all 4 differ from one another. Which process was it, and which observation alone would have been enough to decide?`, solution: `Meiosis — and the halved chromosome number alone is decisive, since only meiosis goes from 2n to n.` },
      relatedLoIds: ['bio.mitosis-meiosis-variation'],
    },
    {
      title: 'Worked crossing over timing',
      steps: [
        `Name the process building skin cells: skin is body tissue, so it grows and repairs by mitosis. Mitosis makes genetically identical copies, so skin cells across the body carry the same genome.`,
        `Ask when crossing over occurs: it happens in prophase I, a stage that exists only in meiosis I. Mitosis has a prophase, but homologous chromosomes never pair up in it, so there is no swapping partner and no crossing over.`,
        `Follow the consequence: because mitosis has no crossing over and no independent assortment, it produces no genetic variation at all. Differences between two arms come from development and environment, not from shuffled DNA.`,
        `Place crossing over correctly: it happens in the reproductive tissue that makes gametes, during prophase I, and its effect shows up in the NEXT generation — in the student's children, not in the student's own skin.`,
      ],
      example: { problem: `A student claims: "Crossing over is what makes my skin cells slightly different from each other, and it is also why my two arms are not identical." Trace where that reasoning breaks down, and state where crossing over actually occurs.`, solution: `The reasoning fails because skin arises by mitosis, which generates no variation. Crossing over occurs only in prophase I of meiosis, in gamete-forming cells, and affects offspring rather than the parent's own body.` },
      relatedLoIds: ['bio.mitosis-meiosis-variation'],
    },
  ],
  pointers: [
    { content: `Mitosis creates NO genetic variation at all. Its daughter cells are identical copies of the parent cell, which is precisely the point — you want replacement skin, not improvised skin. Crossing over requires homologous chromosomes to pair up, and that pairing happens only in prophase I of meiosis, never in mitosis. Meiosis is not a more-shuffled mitosis; it is the only one of the two that shuffles anything.`, kind: 'common-error' },
    { content: `Mitosis: 1 division, 2 daughter cells, 2n stays 2n, genetically identical, in body cells, for growth and repair.`, kind: 'tip' },
    { content: `Meiosis: 2 divisions, 4 daughter cells, 2n becomes n, all genetically different, in gamete-forming cells, for sexual reproduction.`, kind: 'tip' },
    { content: `Meiosis I is the reduction step (homologous pairs separate); meiosis II separates sister chromatids and does not change ploidy.`, kind: 'tip' },
    { content: `Three sources of variation: crossing over (prophase I), independent assortment (metaphase I, about 8.4 million combinations in humans), random fertilization (about 70 trillion zygote combinations per couple).`, kind: 'tip' },
    { content: `Mitosis preserves, meiosis shuffles — mitosis produces no variation whatsoever, and variation is the raw material natural selection needs.`, kind: 'tip' },
    { content: `Mitosis produces **zero** genetic variation — not "a little less than meiosis." It's a difference in kind, not degree. Homologous chromosomes never pair in mitotic prophase, so crossing over is impossible there.`, kind: 'common-error' },
    { content: `Meiosis **I** is the reduction division (2n → n) because homologous pairs separate. Meiosis II separates sister chromatids and leaves ploidy unchanged — n in, n out. Don't say "meiosis II halves the number again."`, kind: 'gotcha' },
    { content: `Don't confuse homologous chromosomes (one maternal + one paternal, same genes, different alleles) with sister chromatids (identical copies joined at a centromere). Which pair separates tells you which division you're watching.`, kind: 'vocab-note' },
    { content: `Crossing over happens in prophase **I**; independent assortment at metaphase **I** — always attach the Roman numeral. Writing "prophase" or "metaphase" alone leaves the answer ambiguous with mitosis.`, kind: 'vocab-note' },
    { content: `For independent assortment use 2^(number of **pairs**), not 2^(total chromosomes). For 2n = 8 that's 2⁴ = 16, not 2⁸. In humans it's 2²³ ≈ 8.4 million.`, kind: 'common-error' },
    { content: `Crossing over in your gametes changes your **children**, never your own body. Differences between your two arms come from development and environment — skin is built by mitosis and carries the identical genome.`, kind: 'gotcha' },
    { content: `There is no S phase (no DNA replication) between meiosis I and meiosis II. That's exactly why the chromosome number stays halved instead of bouncing back to 2n.`, kind: 'edge-case' },
    { content: `To identify a process, any ONE of these settles it: halved chromosome number, 4 daughter cells, or non-identical daughters → meiosis. The halved number is strongest, since only meiosis goes 2n → n.`, kind: 'tip' },
  ],
};
