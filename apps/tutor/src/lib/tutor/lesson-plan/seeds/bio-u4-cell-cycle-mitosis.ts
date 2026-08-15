/**
 * Biology — Cell Division: The Cell Cycle & Mitosis.
 *
 * The stage-sequence template for the HS Biology fan-out (NGSS HS-LS1-4).
 * Almost every error in this unit is a bookkeeping error — WHEN the DNA
 * copies itself, and WHAT you are counting when you count "chromosomes" —
 * so the concept segment is organized around the timeline and the counting
 * rule, and the worked examples walk both.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U4_CELL_CYCLE_MITOSIS: LessonPlan = {
  id: 'evelyn.hs.bio.cell-cycle-mitosis.v1',
  title: 'The Cell Cycle & Mitosis',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.cell-cycle-mitosis',
      standard: 'BIO-4.1',
      description:
        'Model the cell cycle from interphase through the four stages of mitosis and cytokinesis, explaining how DNA replication in S phase and the separation of sister chromatids in anaphase produce two genetically identical diploid daughter cells (NGSS HS-LS1-4).',
    },
  ],
  prerequisites: ['bio.cellular-respiration'],
  followUps: ['bio.cell-cycle-regulation-cancer'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame mitosis as the everyday machinery behind healing, growing, and regeneration.',
      script:
        'Cut your finger on Monday and by Friday the skin has closed over — nobody sewed it shut, your cells copied themselves into the gap. The same process added inches to your height, and it lets a starfish rebuild a whole missing arm. Every one of those new cells is a full, exact copy of the cell it came from, and getting an exact copy takes a strict order of operations. This lesson follows one cell through that order, from copying its DNA to splitting in two.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cycle-and-pmat',
      kind: 'concept',
      goal: 'The interphase timeline, the PMAT stages and their defining events, cytokinesis in plants vs animals, and the chromosome-counting rule.',
      keyIdeas: [
        'THE CYCLE IN TWO PARTS, AND WHAT INTERPHASE DOES — a cell spends about 90% of its life in INTERPHASE and only a short burst in the M PHASE (mitosis, then cytokinesis). Interphase runs in order: G1, the cell grows and does its ordinary job; S, the DNA is REPLICATED so every chromosome carries two identical copies; G2, the cell grows more, builds the proteins for division, and proofreads the new DNA. The copying happens in S, BEFORE mitosis starts — never during prophase.',
        'CHROMOSOME VS CHROMATID — after S phase, one chromosome is an X shape made of two SISTER CHROMATIDS, identical copies joined at a centromere. The counting rule: count CENTROMERES, not arms. A replicated X still counts as ONE chromosome; it becomes two chromosomes only when the centromere splits in anaphase.',
        'P IS FOR PROPHASE — the loose chromatin coils up into visible, condensed chromosomes; the nuclear envelope breaks apart; the spindle fibers assemble and reach for the chromosomes. Defining event: chromosomes become visible.',
        'M IS FOR METAPHASE — spindle fibers pull the chromosomes into a single line across the middle of the cell (the metaphase plate). Defining event: chromosomes lined up at the equator, each still an X of two sister chromatids.',
        'A IS FOR ANAPHASE — the centromeres split and the sister chromatids are dragged to opposite poles. Defining event: identical halves separating and moving apart. This is the step that guarantees each pole gets one full copy of every chromosome.',
        'T IS FOR TELOPHASE — the chromosomes arrive at the two poles, uncoil back into chromatin, and a new nuclear envelope forms around each group. Defining event: two nuclei, still inside one cell.',
        'CYTOKINESIS SPLITS THE CELL — mitosis divides the NUCLEUS; cytokinesis divides the CYTOPLASM. An ANIMAL cell pinches inward at the middle as a ring of protein tightens, forming a CLEAVAGE FURROW. A PLANT cell cannot pinch through its rigid cell wall, so it builds a CELL PLATE outward from the center, which matures into a new wall between the two cells.',
        'THE RESULT AND THE POINT — one parent cell becomes TWO daughter cells that are genetically IDENTICAL to the parent and to each other, each with the same full (diploid) chromosome number. That is exactly what growth, repair of damaged tissue, and asexual reproduction all require: more of the same cell, not a new combination.',
      ],
      vocabulary: [
        { term: 'sister chromatids', definition: 'the two identical copies of one chromosome made in S phase, joined at a centromere until anaphase.' },
        { term: 'centromere', definition: 'the pinched region holding sister chromatids together; count centromeres to count chromosomes.' },
        { term: 'cytokinesis', definition: 'division of the cytoplasm that finishes the split into two separate cells.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-stage',
      kind: 'worked_example',
      problem:
        'A student watches a dividing onion root cell and describes what she sees: the nuclear envelope is gone, and the condensed chromosomes have been pulled into one straight row across the middle of the cell, each one still an X shape attached to spindle fibers reaching toward both poles. Which stage of mitosis is this, and what happens next?',
      steps: [
        'Sort the clues by what they rule out. The nuclear envelope is already gone, so prophase has finished — in prophase the envelope is still breaking down.',
        'The chromosomes are lined up in a single row across the middle: that is the metaphase plate, the defining event of METAPHASE.',
        'Confirm with the X shape. Each chromosome is still two sister chromatids joined at a centromere, so the centromeres have not split yet — anaphase has not begun.',
        'Predict the next event: the centromeres split and the sister chromatids are pulled apart toward opposite poles. That is anaphase.',
      ],
      answer: 'Metaphase — chromosomes aligned at the equator, still paired as sister chromatids; anaphase comes next, when the chromatids separate.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-chromosome-bookkeeping',
      kind: 'worked_example',
      problem:
        'A cell from an organism with 8 chromosomes goes through one full cell cycle. How many chromosomes does the cell have at the end of S phase, how many individual chromatids are lined up at metaphase, and how many chromosomes does each daughter cell end up with?',
      steps: [
        'Start of the cycle (G1): 8 chromosomes, each a single unreplicated strand — 8 centromeres, so 8 chromosomes.',
        'End of S phase: every chromosome has been copied, so each is now an X of two sister chromatids. But the copies are still joined at ONE centromere each, so the count is still 8 CHROMOSOMES — made of 16 chromatids. Replication doubles the DNA, not the chromosome number.',
        'At metaphase: those same 8 X-shaped chromosomes line up at the equator, so 16 individual chromatids are present in the row.',
        'At anaphase the 8 centromeres split, sending 8 chromosomes to each pole — the moment the count doubles to 16 in the cell as a whole.',
        'After telophase and cytokinesis those 16 are divided between two cells: each daughter cell gets 8 chromosomes, the same full number the parent started with, and the same genetic information.',
      ],
      answer: '8 chromosomes after S phase (as 16 chromatids); 16 chromatids at metaphase; 8 chromosomes in each daughter cell — identical to the parent.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-when-dna-replicates',
      kind: 'try_yourself',
      problem: 'At what point in the cell cycle is a cell\'s DNA copied, so that each chromosome ends up as two identical sister chromatids?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'During prophase, as the chromosomes condense and become visible' },
        { id: 'b', text: 'During S phase of interphase, before mitosis begins', correct: true },
        { id: 'c', text: 'During anaphase, as the chromatids are pulled to opposite poles' },
        { id: 'd', text: 'During cytokinesis, as the cytoplasm divides' },
      ],
      expectedAnswer: 'During S phase of interphase, before mitosis begins',
      hints: [
        'The chromosomes are already X-shaped the moment they first become visible in prophase — so the copying must have happened earlier.',
        'Interphase runs G1, then S, then G2. The S stands for synthesis: DNA synthesis.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-anaphase',
      kind: 'try_yourself',
      problem:
        'In a cell viewed under a microscope, the sister chromatids of every chromosome have just detached from each other at their centromeres and are being dragged toward opposite ends of the cell. Which stage is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Prophase — the chromosomes are condensing and the spindle is forming' },
        { id: 'b', text: 'Metaphase — the chromosomes are aligned at the equator' },
        { id: 'c', text: 'Telophase — two new nuclear envelopes are forming' },
        { id: 'd', text: 'Anaphase — the separated chromatids are moving to opposite poles', correct: true },
      ],
      expectedAnswer: 'Anaphase — the separated chromatids are moving to opposite poles',
      hints: [
        'Match the description to the defining event of each stage: condensing, lining up, separating, or re-forming nuclei.',
        'The chromatids have already split apart and are in motion — that is the one stage named for separation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-daughter-cell-outcome',
      kind: 'try_yourself',
      problem:
        'A human skin cell containing 46 chromosomes divides by mitosis to help close a cut. What do the two daughter cells contain, and how do they finish separating?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '46 chromosomes each, genetically identical to the parent cell; an animal cell separates by pinching inward to form a cleavage furrow', correct: true },
        { id: 'b', text: '23 chromosomes each, since mitosis halves the chromosome number; the cell pinches inward to form a cleavage furrow' },
        { id: 'c', text: '92 chromosomes each, since the DNA was replicated in S phase; the cell builds a cell plate down the middle' },
        { id: 'd', text: '46 chromosomes each, but genetically different from the parent because the chromosomes were shuffled; the cell builds a cell plate down the middle' },
      ],
      expectedAnswer: '46 chromosomes each, genetically identical to the parent cell; an animal cell separates by pinching inward to form a cleavage furrow',
      hints: [
        'Replication in S phase and separation in anaphase cancel out: the copy is made, then split evenly, so the count returns to where it started.',
        'A cell plate is built by plant cells, which cannot pinch through a rigid cell wall. A skin cell is an animal cell.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-chromatid-counting',
      kind: 'misconception_check',
      question:
        'A student writes: "A cell starts G1 with 46 chromosomes. In S phase the DNA is copied, so at the start of mitosis the cell has 92 chromosomes." What went wrong?',
      commonErrors: [
        {
          answer: '92 chromosomes at the start of mitosis',
          misconception: 'Counting chromatids as if each one were a separate chromosome, instead of counting centromeres.',
          correctsTo:
            'After S phase the cell holds 92 CHROMATIDS but still only 46 CHROMOSOMES, because each pair of identical copies stays joined at a single centromere. The count rises to 92 chromosomes only for the brief moment in anaphase when the centromeres split — and cytokinesis immediately divides those between two cells, giving 46 each.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Interphase is G1 (grow) → S (DNA REPLICATES) → G2 (prepare and proofread); mitosis follows, then cytokinesis.',
        'PMAT: Prophase — chromosomes condense and the nuclear envelope breaks down; Metaphase — chromosomes line up at the equator; Anaphase — sister chromatids separate to opposite poles; Telophase — two nuclei re-form.',
        'Count centromeres, not arms: a replicated X is ONE chromosome made of two sister chromatids until anaphase splits it.',
        'Cytokinesis: animal cells pinch inward into a cleavage furrow; plant cells build a cell plate that becomes a new cell wall.',
        'The result is two genetically IDENTICAL daughter cells with the parent\'s full chromosome number — the basis of growth, tissue repair, and asexual reproduction.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'The Cell Cycle & Mitosis' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
