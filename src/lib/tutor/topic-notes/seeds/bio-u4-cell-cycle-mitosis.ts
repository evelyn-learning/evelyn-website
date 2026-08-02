/**
 * Biology — Unit 4 CED 4.1: The Cell Cycle & Mitosis.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.cell-cycle-mitosis.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U4_CELL_CYCLE_MITOSIS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.cell-cycle-mitosis.v1',
  course: 'Biology',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'The Cell Cycle & Mitosis',
  planId: 'evelyn.hs.bio.cell-cycle-mitosis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.cell-cycle-mitosis.v1' }],
  theory: [
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'The cycle in two parts, and what interphase does', content: `THE CYCLE IN TWO PARTS, AND WHAT INTERPHASE DOES — a cell spends about 90% of its life in INTERPHASE and only a short burst in the M PHASE (mitosis, then cytokinesis). Interphase runs in order: G1, the cell grows and does its ordinary job; S, the DNA is REPLICATED so every chromosome carries two identical copies; G2, the cell grows more, builds the proteins for division, and proofreads the new DNA. The copying happens in S, BEFORE mitosis starts — never during prophase.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'Chromosome vs chromatid', content: `CHROMOSOME VS CHROMATID — after S phase, one chromosome is an X shape made of two SISTER CHROMATIDS, identical copies joined at a centromere. The counting rule: count CENTROMERES, not arms. A replicated X still counts as ONE chromosome; it becomes two chromosomes only when the centromere splits in anaphase.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'P is for prophase', content: `P IS FOR PROPHASE — the loose chromatin coils up into visible, condensed chromosomes; the nuclear envelope breaks apart; the spindle fibers assemble and reach for the chromosomes. Defining event: chromosomes become visible.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'M is for metaphase', content: `M IS FOR METAPHASE — spindle fibers pull the chromosomes into a single line across the middle of the cell (the metaphase plate). Defining event: chromosomes lined up at the equator, each still an X of two sister chromatids.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'A is for anaphase', content: `A IS FOR ANAPHASE — the centromeres split and the sister chromatids are dragged to opposite poles. Defining event: identical halves separating and moving apart. This is the step that guarantees each pole gets one full copy of every chromosome.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'T is for telophase', content: `T IS FOR TELOPHASE — the chromosomes arrive at the two poles, uncoil back into chromatin, and a new nuclear envelope forms around each group. Defining event: two nuclei, still inside one cell.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'Cytokinesis splits the cell', content: `CYTOKINESIS SPLITS THE CELL — mitosis divides the NUCLEUS; cytokinesis divides the CYTOPLASM. An ANIMAL cell pinches inward at the middle as a ring of protein tightens, forming a CLEAVAGE FURROW. A PLANT cell cannot pinch through its rigid cell wall, so it builds a CELL PLATE outward from the center, which matures into a new wall between the two cells.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'framework', title: 'The result and the point', content: `THE RESULT AND THE POINT — one parent cell becomes TWO daughter cells that are genetically IDENTICAL to the parent and to each other, each with the same full (diploid) chromosome number. That is exactly what growth, repair of damaged tissue, and asexual reproduction all require: more of the same cell, not a new combination.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'definition', title: 'sister chromatids', content: `the two identical copies of one chromosome made in S phase, joined at a centromere until anaphase.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'definition', title: 'centromere', content: `the pinched region holding sister chromatids together; count centromeres to count chromosomes.` },
    { loId: 'bio.cell-cycle-mitosis', kind: 'definition', title: 'cytokinesis', content: 'division of the cytoplasm that finishes the split into two separate cells.' },
  ],
  methods: [
    {
      title: 'Worked identify stage',
      steps: [
        `Sort the clues by what they rule out. The nuclear envelope is already gone, so prophase has finished — in prophase the envelope is still breaking down.`,
        `The chromosomes are lined up in a single row across the middle: that is the metaphase plate, the defining event of METAPHASE.`,
        `Confirm with the X shape. Each chromosome is still two sister chromatids joined at a centromere, so the centromeres have not split yet — anaphase has not begun.`,
        `Predict the next event: the centromeres split and the sister chromatids are pulled apart toward opposite poles. That is anaphase.`,
      ],
      example: { problem: `A student watches a dividing onion root cell and describes what she sees: the nuclear envelope is gone, and the condensed chromosomes have been pulled into one straight row across the middle of the cell, each one still an X shape attached to spindle fibers reaching toward both poles. Which stage of mitosis is this, and what happens next?`, solution: `Metaphase — chromosomes aligned at the equator, still paired as sister chromatids; anaphase comes next, when the chromatids separate.` },
      relatedLoIds: ['bio.cell-cycle-mitosis'],
    },
    {
      title: 'Worked chromosome bookkeeping',
      steps: [
        `Start of the cycle (G1): 8 chromosomes, each a single unreplicated strand — 8 centromeres, so 8 chromosomes.`,
        `End of S phase: every chromosome has been copied, so each is now an X of two sister chromatids. But the copies are still joined at ONE centromere each, so the count is still 8 CHROMOSOMES — made of 16 chromatids. Replication doubles the DNA, not the chromosome number.`,
        `At metaphase: those same 8 X-shaped chromosomes line up at the equator, so 16 individual chromatids are present in the row.`,
        `At anaphase the 8 centromeres split, sending 8 chromosomes to each pole — the moment the count doubles to 16 in the cell as a whole.`,
        `After telophase and cytokinesis those 16 are divided between two cells: each daughter cell gets 8 chromosomes, the same full number the parent started with, and the same genetic information.`,
      ],
      example: { problem: `A cell from an organism with 8 chromosomes goes through one full cell cycle. How many chromosomes does the cell have at the end of S phase, how many individual chromatids are lined up at metaphase, and how many chromosomes does each daughter cell end up with?`, solution: `8 chromosomes after S phase (as 16 chromatids); 16 chromatids at metaphase; 8 chromosomes in each daughter cell — identical to the parent.` },
      relatedLoIds: ['bio.cell-cycle-mitosis'],
    },
  ],
  pointers: [
    { content: `After S phase the cell holds 92 CHROMATIDS but still only 46 CHROMOSOMES, because each pair of identical copies stays joined at a single centromere. The count rises to 92 chromosomes only for the brief moment in anaphase when the centromeres split — and cytokinesis immediately divides those between two cells, giving 46 each.`, kind: 'common-error' },
    { content: `Interphase is G1 (grow) → S (DNA REPLICATES) → G2 (prepare and proofread); mitosis follows, then cytokinesis.`, kind: 'tip' },
    { content: `PMAT: Prophase — chromosomes condense and the nuclear envelope breaks down; Metaphase — chromosomes line up at the equator; Anaphase — sister chromatids separate to opposite poles; Telophase — two nuclei re-form.`, kind: 'tip' },
    { content: `Count centromeres, not arms: a replicated X is ONE chromosome made of two sister chromatids until anaphase splits it.`, kind: 'tip' },
    { content: `Cytokinesis: animal cells pinch inward into a cleavage furrow; plant cells build a cell plate that becomes a new cell wall.`, kind: 'tip' },
    { content: `The result is two genetically IDENTICAL daughter cells with the parent's full chromosome number — the basis of growth, tissue repair, and asexual reproduction.`, kind: 'tip' },
    { content: `Count **centromeres, not arms**. A replicated X is ONE chromosome made of two chromatids. A human cell after S phase has 46 chromosomes / 92 chromatids — never say "92 chromosomes at the start of mitosis."`, kind: 'common-error' },
    { content: `Say "sister chromatids," not "homologous chromosomes," when describing what separates in anaphase of mitosis. Sister chromatids are identical copies; homologs are the maternal/paternal pair — they don't pair up or separate in mitosis at all.`, kind: 'vocab-note' },
    { content: `DNA is copied in **S phase of interphase**, before mitosis begins — not in prophase. Prophase only condenses DNA that was already duplicated hours earlier.`, kind: 'gotcha' },
    { content: `Mitosis divides the **nucleus**; cytokinesis divides the **cytoplasm**. After telophase there are two nuclei still inside ONE cell — the cell isn't split until cytokinesis finishes.`, kind: 'vocab-note' },
    { content: `Cleavage furrow = animal (pinches inward); cell plate = plant (builds outward from the center). Don't give a plant cell a furrow — the rigid cell wall can't pinch.`, kind: 'common-error' },
    { content: `To identify a stage, use the **defining event**, not just one clue: envelope gone + single row of X's = metaphase; envelope gone + V-shaped halves moving apart = anaphase. If the chromosomes are still X-shaped, anaphase has NOT started.`, kind: 'tip' },
    { content: `The chromosome number doubles only for the brief window between centromere splitting in anaphase and cytokinesis. A 46-chromosome cell is momentarily 92 — then each daughter gets 46. The parent number is restored, never halved.`, kind: 'edge-case' },
    { content: `Interphase is ~90% of the cell's life but it is NOT a "resting stage" — G1 growth, S replication, and G2 proofreading are all active work. Also, interphase is part of the cell cycle, not a stage of mitosis.`, kind: 'gotcha' },
  ],
};
