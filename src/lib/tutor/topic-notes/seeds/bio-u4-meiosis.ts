/**
 * Biology — Unit 4 CED 4.3: Meiosis & Gamete Formation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.meiosis.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U4_MEIOSIS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.meiosis.v1',
  course: 'Biology',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Meiosis & Gamete Formation',
  planId: 'evelyn.hs.bio.meiosis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.meiosis.v1' }],
  theory: [
    { loId: 'bio.meiosis', kind: 'framework', title: 'Diploid vs haploid', content: `DIPLOID VS HAPLOID — a DIPLOID (2n) cell carries chromosomes in matching pairs, one member of each pair from each parent. A HAPLOID (n) cell carries just one member of each pair. Human body cells are 2n = 46 (23 pairs); human gametes are n = 23. Ploidy counts SETS, not chromosomes.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'Homologous chromosomes are not sister chromatids', content: `HOMOLOGOUS CHROMOSOMES ARE NOT SISTER CHROMATIDS — homologous chromosomes are two SEPARATE chromosomes of the same type, one inherited from each parent, carrying the same genes but possibly different alleles. Sister chromatids are the two identical copies of ONE chromosome, joined at the centromere after DNA replication. Confusing these two is the root of most meiosis errors.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'One replication, two divisions', content: `ONE REPLICATION, TWO DIVISIONS — DNA is copied once, before meiosis I. Then the cell divides twice with no copying in between. One 2n cell becomes four n cells. That single-copy, double-divide pattern is what halves the number.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'Meiosis i is the reduction division', content: `MEIOSIS I IS THE REDUCTION DIVISION — homologous PAIRS separate and go to opposite poles. Each daughter cell now has only one member of each pair, so it is already haploid (n) even though each chromosome still has two sister chromatids attached. This is the step that cuts the number in half.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'Meiosis ii is the mitosis-like division', content: `MEIOSIS II IS THE MITOSIS-LIKE DIVISION — sister CHROMATIDS separate, exactly as in mitosis. No further halving happens here: n cells go in and n cells come out. The job of meiosis II is only to split the doubled chromosomes into single ones.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'Crossing over in prophase i', content: `CROSSING OVER IN PROPHASE I — homologous chromosomes pair up side by side (SYNAPSIS), forming a four-chromatid structure called a TETRAD, and swap matching segments. A chromosome that leaves prophase I is a mosaic of the copy from your mother and the copy from your father — a combination that has never existed before.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'Independent assortment in metaphase i', content: `INDEPENDENT ASSORTMENT IN METAPHASE I — each homologous pair lines up at the middle independently of every other pair, so which parent's member faces which pole is random for each pair. With 23 pairs that alone gives 2 to the 23rd power, over 8 million, possible gamete combinations before crossing over is even counted.` },
    { loId: 'bio.meiosis', kind: 'framework', title: 'The product and the restore', content: `THE PRODUCT AND THE RESTORE — meiosis yields FOUR haploid gametes that are genetically DIFFERENT from each other and from the parent cell. Fertilization then fuses one n egg with one n sperm to rebuild a 2n zygote, which is why the species number stays at 46 generation after generation.` },
    { loId: 'bio.meiosis', kind: 'definition', title: 'homologous chromosomes', content: `a matching pair of chromosomes carrying the same genes, one inherited from each parent.` },
    { loId: 'bio.meiosis', kind: 'definition', title: 'tetrad', content: `the four-chromatid structure formed when a homologous pair synapses in prophase I; the site of crossing over.` },
    { loId: 'bio.meiosis', kind: 'definition', title: 'haploid (n)', content: 'having one member of each chromosome pair, as in a gamete.' },
    { loId: 'bio.meiosis', kind: 'definition', title: 'nondisjunction', content: `failure of chromosomes or chromatids to separate properly during a meiotic division.` },
  ],
  methods: [
    {
      title: 'Worked chromosome bookkeeping',
      steps: [
        `After replication, before meiosis I: DNA has been copied, but copying does not create new chromosomes — each of the 8 chromosomes now simply has 2 sister chromatids. Count = 8 chromosomes (2n), each doubled.`,
        `End of meiosis I: the 4 homologous pairs separate, one member of each pair to each daughter cell. Each daughter cell gets 4 chromosomes — haploid, n = 4 — and each of those 4 still carries 2 sister chromatids.`,
        `End of meiosis II: sister chromatids separate, so each doubled chromosome becomes two single chromosomes that go to different cells. Each of the 4 final gametes still has 4 chromosomes, n = 4 — the number does not halve a second time.`,
        `After fertilization: an n = 4 egg fuses with an n = 4 sperm, so the zygote carries 4 + 4 = 8 chromosomes, back to 2n = 8.`,
      ],
      example: { problem: `A fruit fly body cell is diploid with 2n = 8, meaning 4 homologous pairs. One such cell enters meiosis. State the number of chromosomes in each cell at four points: after DNA replication but before meiosis I, at the end of meiosis I, at the end of meiosis II, and in the zygote after fertilization by a normal fruit-fly sperm.`, solution: `After replication: 8 (2n, doubled). End of meiosis I: 4 (n, still doubled). End of meiosis II: 4 (n, single). Zygote: 8 (2n).` },
      relatedLoIds: ['bio.meiosis'],
    },
    {
      title: 'Worked which division separates what',
      steps: [
        `Set up the starting cell: 2n = 6 means 3 homologous pairs. After replication each of the 6 chromosomes has 2 sister chromatids, so there are 12 chromatids total but still 6 chromosomes.`,
        `Test the claim on meiosis I. If sister chromatids separated here, each daughter cell would receive one chromatid from every one of the 6 chromosomes — that is 6 chromosomes per cell, still 2n. The number would never fall, so the claim already fails: the cell would stay diploid.`,
        `What actually happens in meiosis I: whole homologous PAIRS separate. Each daughter cell gets one full member of each of the 3 pairs — 3 chromosomes, n = 3. The cell is haploid the moment meiosis I ends, so meiosis I is the reduction division.`,
        `What meiosis II actually does: each of those 3 doubled chromosomes splits at the centromere and its sister chromatids go to opposite poles. Each final cell holds 3 single chromosomes, still n = 3. Chromatid separation with no change in chromosome number is exactly the mitosis pattern — so meiosis II is the mitosis-like division.`,
        `Name the confusion precisely: the student swapped homologous chromosomes with sister chromatids. Separating pairs halves the count; separating chromatids does not.`,
      ],
      example: { problem: `A student claims: "Meiosis I is the one that works like mitosis, because sister chromatids pull apart in it, and meiosis II is the reduction division, because that is where the cell finally becomes haploid." In a cell with 2n = 6, show where this reasoning breaks and state which division does which job.`, solution: `The claim is backwards. Meiosis I separates homologous pairs and is the reduction division (2n = 6 becomes n = 3); meiosis II separates sister chromatids and is the mitosis-like division (n = 3 stays n = 3).` },
      relatedLoIds: ['bio.meiosis'],
    },
  ],
  pointers: [
    { content: `Meiosis divides TWICE after a single round of DNA copying, so one cell yields FOUR cells, not two. And those four are genetically DIFFERENT from one another: crossing over in prophase I rebuilds each chromosome as a mix of the two parental versions, and independent assortment in metaphase I sends a random member of each pair to each pole. Mitosis preserves the genome; meiosis deliberately shuffles it.`, kind: 'common-error' },
    { content: `Diploid (2n) means chromosomes in matching pairs; haploid (n) means one member of each pair. Humans: 2n = 46 body cells, n = 23 gametes.`, kind: 'tip' },
    { content: `DNA is copied once, then the cell divides twice: one 2n cell yields four haploid gametes.`, kind: 'tip' },
    { content: `Meiosis I separates HOMOLOGOUS PAIRS — the reduction division, where the number halves. Meiosis II separates SISTER CHROMATIDS and changes no numbers, just like mitosis.`, kind: 'tip' },
    { content: `Variation comes from crossing over at the tetrads in prophase I and independent assortment of the pairs in metaphase I, so all four gametes differ.`, kind: 'tip' },
    { content: `Nondisjunction — a pair or a chromatid failing to separate — gives a gamete with an extra or missing chromosome, and can produce a trisomy (47 chromosomes in humans). Normal fertilization restores 2n by fusing two haploid gametes.`, kind: 'tip' },
    { content: `Count chromosomes by CENTROMERES, not chromatids. After replication a 2n = 8 cell still has 8 chromosomes (16 chromatids). Writing "16 chromosomes after replication" is the #1 bookkeeping error.`, kind: 'common-error' },
    { content: `Say "homologous chromosomes" for the pair from mom and dad, and "sister chromatids" for the two identical copies of ONE chromosome. Swapping these two terms flips which division is the reduction division and is the root of most meiosis mistakes.`, kind: 'vocab-note' },
    { content: `A cell is already haploid the instant meiosis I ends — even though each chromosome still has two sister chromatids. "Doubled" and "diploid" are different words; don't call a doubled haploid cell 2n.`, kind: 'gotcha' },
    { content: `Meiosis II does NOT halve anything. n goes in, n comes out — it only splits doubled chromosomes into single ones. If your answer shows the number falling twice, you've halved once too many times.`, kind: 'common-error' },
    { content: `Don't describe meiosis as "mitosis with half the chromosomes." One replication + two divisions gives FOUR cells, and crossing over plus independent assortment make all four genetically different — mitosis copies, meiosis shuffles.`, kind: 'gotcha' },
    { content: `Locate the variation steps precisely: crossing over happens at tetrads in PROPHASE I; independent assortment happens at the metaphase plate in METAPHASE I. Neither occurs in meiosis II, and neither occurs in mitosis.`, kind: 'vocab-note' },
    { content: `Nondisjunction can hit either division: in meiosis I a whole homologous PAIR fails to separate; in meiosis II sister CHROMATIDS fail. Both give gametes with 24 or 22 chromosomes — say which structure failed, not just "they didn't separate."`, kind: 'edge-case' },
    { content: `The 2^23 figure counts independent assortment ONLY — crossing over multiplies variation far beyond it. Don't report 8 million as the total number of possible gametes.`, kind: 'tip' },
  ],
};
