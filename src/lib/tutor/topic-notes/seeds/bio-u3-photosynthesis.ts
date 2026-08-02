/**
 * Biology — Unit 3 CED 3.2: Photosynthesis: Light Reactions & the Calvin Cycle.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.photosynthesis.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U3_PHOTOSYNTHESIS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.photosynthesis.v1',
  course: 'Biology',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Photosynthesis: Light Reactions & the Calvin Cycle',
  planId: 'evelyn.hs.bio.photosynthesis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.photosynthesis.v1' }],
  theory: [
    { loId: 'bio.photosynthesis', kind: 'framework', title: 'The overall equation', content: `THE OVERALL EQUATION — 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. Read it as a conversion: low-energy inorganic molecules plus light become one high-energy sugar, with oxygen as a by-product.` },
    { loId: 'bio.photosynthesis', kind: 'framework', title: 'Where it happens', content: `WHERE IT HAPPENS — inside the chloroplast. Stage 1 (light reactions) runs in the THYLAKOID membranes, the stacked green discs. Stage 2 (Calvin cycle) runs in the STROMA, the fluid around the stacks.` },
    { loId: 'bio.photosynthesis', content: `STAGE 1: LIGHT REACTIONS — chlorophyll absorbs light and excites electrons. Water is SPLIT to replace those electrons, which is where the O2 in the air comes from. Outputs: ATP and NADPH (energy carriers) plus O2 (waste).` },
    { loId: 'bio.photosynthesis', content: `STAGE 2: CALVIN CYCLE — light-independent. It takes CO2 from the air and uses the ATP and NADPH from stage 1 to build glucose. It is called light-INDEPENDENT, not "the dark reactions": it needs no light directly, but it stalls in the dark because stage 1 stops delivering ATP and NADPH.` },
    { loId: 'bio.photosynthesis', kind: 'framework', title: 'The link molecules', content: `THE LINK MOLECULES — ATP and NADPH are the only handoff. Stage 1 makes them, stage 2 spends them, and the empty carriers (ADP and NADP+) cycle back. Nothing else crosses between the stages.` },
    { loId: 'bio.photosynthesis', kind: 'framework', title: 'Where the atoms go', content: `WHERE THE ATOMS GO — the oxygen released comes from WATER, not from CO2. The carbon in glucose comes from CO2. Tracking which source supplies which atom is the single most useful check in this unit.` },
    { loId: 'bio.photosynthesis', kind: 'framework', title: 'Chlorophyll and color', content: `CHLOROPHYLL AND COLOR — chlorophyll absorbs red and blue light strongly and reflects green, which is why leaves look green. The reflected wavelength is the one the plant does NOT use.` },
    { loId: 'bio.photosynthesis', kind: 'definition', title: 'thylakoid', content: 'the stacked membrane discs inside a chloroplast where the light reactions occur.' },
    { loId: 'bio.photosynthesis', kind: 'definition', title: 'stroma', content: 'the fluid surrounding the thylakoids, where the Calvin cycle occurs.' },
    { loId: 'bio.photosynthesis', kind: 'definition', title: 'NADPH', content: 'an electron carrier made by the light reactions and spent by the Calvin cycle.' },
  ],
  methods: [
    {
      title: 'Worked trace atoms',
      steps: [
        `Identify which input each product draws from. Two oxygen-containing inputs enter: H2O and CO2.`,
        `Recall stage 1: water is SPLIT to resupply electrons to chlorophyll, and the leftover oxygen atoms pair up and leave as O2 gas.`,
        `Recall stage 2: the carbon and oxygen built into glucose come from CO2 captured in the Calvin cycle.`,
        `So the label, which started in water, follows the water: it appears in the released O2 gas, not in the glucose.`,
      ],
      example: { problem: `A researcher grows a plant with water containing a heavy isotope of oxygen (labeled water) and ordinary CO2. Where does the labeled oxygen show up — in the released O2 gas, or in the glucose?`, solution: `In the released O2 gas — the oxygen given off comes from splitting water, not from CO2.` },
      relatedLoIds: ['bio.photosynthesis'],
    },
    {
      title: 'Worked dark stall',
      steps: [
        'Name what the Calvin cycle actually consumes: CO2, ATP, and NADPH — not light.',
        `Ask where the ATP and NADPH come from: only from the light reactions in the thylakoid membrane.`,
        `In darkness the light reactions halt, so no new ATP or NADPH is delivered to the stroma.`,
        `The small existing pool of ATP and NADPH is spent within minutes, and the Calvin cycle stalls for lack of fuel — an indirect dependence on light, not a direct one.`,
      ],
      example: { problem: `A plant is moved into complete darkness. The Calvin cycle needs no light directly, so why does glucose production stop within minutes?`, solution: `The Calvin cycle depends on light indirectly: it runs on the ATP and NADPH the light reactions supply, and that supply stops in the dark.` },
      relatedLoIds: ['bio.photosynthesis'],
    },
  ],
  pointers: [
    { content: `The Calvin cycle runs mostly in the DAYLIGHT, at the same time as the light reactions — it just does not absorb light itself. It needs the ATP and NADPH the light reactions are producing right then, so in the dark it stalls rather than starts.`, kind: 'common-error' },
    { content: `6CO2 + 6H2O + light → C6H12O6 + 6O2 — light energy becomes chemical energy in glucose.`, kind: 'tip' },
    { content: 'Light reactions: in the thylakoid membrane; split water; make ATP, NADPH and O2.', kind: 'tip' },
    { content: 'Calvin cycle: in the stroma; takes CO2; spends ATP and NADPH to build glucose.', kind: 'tip' },
    { content: 'The released O2 comes from WATER; the carbon in glucose comes from CO2.', kind: 'tip' },
    { content: 'Light-independent means "does not use light directly" — not "runs at night".', kind: 'tip' },
    { content: `The released O2 comes from **splitting water**, not from CO2. Trace atoms by source: H2O → O2 gas; CO2 → carbon and oxygen in glucose. Say it out loud before answering any isotope-labeling question.`, kind: 'common-error' },
    { content: `"Light-independent" ≠ "happens at night." The Calvin cycle runs mostly in daylight, right alongside the light reactions — it just doesn't absorb photons itself. Avoid the outdated term "dark reactions" in your answers.`, kind: 'vocab-note' },
    { content: `Don't mix up **thylakoid** (stacked membrane discs — light reactions) with **stroma** (surrounding fluid — Calvin cycle). Both are inside the chloroplast, so naming the organelle alone is not a complete location answer.`, kind: 'vocab-note' },
    { content: `NADPH (photosynthesis, thylakoid) is not NADH (respiration), and NADP+ is the *empty* carrier. Keep the P and the charge: writing "NADH" or "NADP" in a photosynthesis answer signals the wrong pathway.`, kind: 'gotcha' },
    { content: `ATP and NADPH are the **only** handoff between the two stages. Glucose, O2, and CO2 do not cross from one stage to the other — if your explanation has the Calvin cycle 'using oxygen' or the light reactions 'using CO2', it's wrong.`, kind: 'common-error' },
    { content: `Watch which stage a missing input blocks *directly*. No CO2 → Calvin cycle blocked first (light reactions keep running). No light or no water → light reactions blocked, and the Calvin cycle stalls only after its ATP/NADPH pool runs out.`, kind: 'edge-case' },
    { content: `Chlorophyll **reflects** green — green is the wavelength the plant does NOT use. Red and blue are absorbed. Saying "plants use green light because leaves are green" reverses the logic.`, kind: 'gotcha' },
    { content: `Check the coefficients in 6CO2 + 6H2O + light → C6H12O6 + 6O2. Dropping the 6s (or writing CO2 + H2O → glucose + O2) leaves the equation unbalanced — 6 carbons in, 6 carbons in the sugar.`, kind: 'tip' },
  ],
};
