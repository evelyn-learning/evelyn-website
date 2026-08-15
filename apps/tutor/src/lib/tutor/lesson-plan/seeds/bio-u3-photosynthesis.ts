/**
 * Biology — Cell Energy: Photosynthesis: Light Reactions & the Calvin Cycle.
 *
 * The concept-heavy template for the HS Biology fan-out (NGSS HS-LS1-5).
 * Two stages, two locations, two currencies — most student errors here are
 * really bookkeeping errors about WHERE a molecule is made and WHICH stage
 * spends it, so the concept segment is organized around that ledger.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U3_PHOTOSYNTHESIS: LessonPlan = {
  id: 'evelyn.hs.bio.photosynthesis.v1',
  title: 'Photosynthesis: Light Reactions & the Calvin Cycle',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.photosynthesis',
      standard: 'BIO-3.2',
      description:
        'Explain how photosynthesis converts light energy into chemical energy stored in glucose, tracing the inputs and outputs of the light reactions and the Calvin cycle and the role of chlorophyll in the thylakoid membrane (NGSS HS-LS1-5).',
    },
  ],
  prerequisites: ['bio.atp-and-energy'],
  followUps: ['bio.cellular-respiration'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame photosynthesis as the entry point for essentially all energy in the living world.',
      script:
        'Almost every bite of food you have ever eaten traces back to a plant catching sunlight. Even a steak is grass, one step removed. Photosynthesis is the doorway energy uses to enter the living world — and the carbon in a redwood trunk came not from the soil, but out of thin air, from CO2. In this lesson you follow the energy and the atoms through two connected stages, and you will be able to say exactly where every input goes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-stages',
      kind: 'concept',
      goal: 'The overall equation, the two stages, their locations, and the molecules that link them.',
      keyIdeas: [
        'THE OVERALL EQUATION — 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. Read it as a conversion: low-energy inorganic molecules plus light become one high-energy sugar, with oxygen as a by-product.',
        'WHERE IT HAPPENS — inside the chloroplast. Stage 1 (light reactions) runs in the THYLAKOID membranes, the stacked green discs. Stage 2 (Calvin cycle) runs in the STROMA, the fluid around the stacks.',
        'STAGE 1: LIGHT REACTIONS — chlorophyll absorbs light and excites electrons. Water is SPLIT to replace those electrons, which is where the O2 in the air comes from. Outputs: ATP and NADPH (energy carriers) plus O2 (waste).',
        'STAGE 2: CALVIN CYCLE — light-independent. It takes CO2 from the air and uses the ATP and NADPH from stage 1 to build glucose. It is called light-INDEPENDENT, not "the dark reactions": it needs no light directly, but it stalls in the dark because stage 1 stops delivering ATP and NADPH.',
        'THE LINK MOLECULES — ATP and NADPH are the only handoff. Stage 1 makes them, stage 2 spends them, and the empty carriers (ADP and NADP+) cycle back. Nothing else crosses between the stages.',
        'WHERE THE ATOMS GO — the oxygen released comes from WATER, not from CO2. The carbon in glucose comes from CO2. Tracking which source supplies which atom is the single most useful check in this unit.',
        'CHLOROPHYLL AND COLOR — chlorophyll absorbs red and blue light strongly and reflects green, which is why leaves look green. The reflected wavelength is the one the plant does NOT use.',
      ],
      vocabulary: [
        { term: 'thylakoid', definition: 'the stacked membrane discs inside a chloroplast where the light reactions occur.' },
        { term: 'stroma', definition: 'the fluid surrounding the thylakoids, where the Calvin cycle occurs.' },
        { term: 'NADPH', definition: 'an electron carrier made by the light reactions and spent by the Calvin cycle.' },
      ],
      suggestedTools: ['show_diagram', 'show_balanced_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-atoms',
      kind: 'worked_example',
      problem:
        'A researcher grows a plant with water containing a heavy isotope of oxygen (labeled water) and ordinary CO2. Where does the labeled oxygen show up — in the released O2 gas, or in the glucose?',
      steps: [
        'Identify which input each product draws from. Two oxygen-containing inputs enter: H2O and CO2.',
        'Recall stage 1: water is SPLIT to resupply electrons to chlorophyll, and the leftover oxygen atoms pair up and leave as O2 gas.',
        'Recall stage 2: the carbon and oxygen built into glucose come from CO2 captured in the Calvin cycle.',
        'So the label, which started in water, follows the water: it appears in the released O2 gas, not in the glucose.',
      ],
      answer: 'In the released O2 gas — the oxygen given off comes from splitting water, not from CO2.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dark-stall',
      kind: 'worked_example',
      problem:
        'A plant is moved into complete darkness. The Calvin cycle needs no light directly, so why does glucose production stop within minutes?',
      steps: [
        'Name what the Calvin cycle actually consumes: CO2, ATP, and NADPH — not light.',
        'Ask where the ATP and NADPH come from: only from the light reactions in the thylakoid membrane.',
        'In darkness the light reactions halt, so no new ATP or NADPH is delivered to the stroma.',
        'The small existing pool of ATP and NADPH is spent within minutes, and the Calvin cycle stalls for lack of fuel — an indirect dependence on light, not a direct one.',
      ],
      answer: 'The Calvin cycle depends on light indirectly: it runs on the ATP and NADPH the light reactions supply, and that supply stops in the dark.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-oxygen-source',
      kind: 'try_yourself',
      problem: 'The oxygen gas released during photosynthesis comes from which molecule?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Water (H2O), split during the light reactions', correct: true },
        { id: 'b', text: 'Carbon dioxide (CO2), split during the Calvin cycle' },
        { id: 'c', text: 'Glucose (C6H12O6), as it is assembled' },
        { id: 'd', text: 'ATP, as its phosphate bonds are broken' },
      ],
      expectedAnswer: 'Water (H2O), split during the light reactions',
      hints: [
        'Which input molecule is physically SPLIT apart, and in which stage?',
        'Chlorophyll loses electrons and water is split to replace them — the leftover oxygen leaves as O2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-location',
      kind: 'try_yourself',
      problem: 'Where in the chloroplast does the Calvin cycle take place, and what does it consume from the other stage?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In the thylakoid membrane, consuming ATP and NADPH' },
        { id: 'b', text: 'In the stroma, consuming ATP and NADPH', correct: true },
        { id: 'c', text: 'In the stroma, consuming oxygen and light' },
        { id: 'd', text: 'In the thylakoid membrane, consuming CO2 and water' },
      ],
      expectedAnswer: 'In the stroma, consuming ATP and NADPH',
      hints: [
        'The light reactions run in the thylakoid membranes — the Calvin cycle runs in the other compartment.',
        'ATP and NADPH are the only two molecules handed from stage 1 to stage 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-limiting-input',
      kind: 'try_yourself',
      problem:
        'A greenhouse plant is given bright light and plenty of water, but the air around it is sealed and its CO2 has been almost completely removed. Which stage is directly blocked first, and what happens to glucose production?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The light reactions are blocked — CO2 is their main input, so no ATP is made' },
        { id: 'b', text: 'Neither stage is affected, because bright light alone is enough to make glucose' },
        { id: 'c', text: 'The Calvin cycle is blocked — with no CO2 there is no carbon to build glucose, so glucose production stops', correct: true },
        { id: 'd', text: 'Both stages stop immediately, because CO2 is required to split water' },
      ],
      expectedAnswer: 'The Calvin cycle is blocked — with no CO2 there is no carbon to build glucose, so glucose production stops',
      hints: [
        'Sort the inputs by stage: which stage takes in CO2, and which takes in light and water?',
        'The light reactions still run on light and water; the stage that needs carbon has nothing to build with.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dark-reactions',
      kind: 'misconception_check',
      question:
        'A student writes: "The Calvin cycle is called the dark reactions because it only runs at night, when the light reactions shut off." What went wrong?',
      commonErrors: [
        {
          answer: 'The Calvin cycle runs at night',
          misconception: 'Reading "light-independent" (or the old name "dark reactions") as "happens in the dark" rather than "does not use light directly".',
          correctsTo:
            'The Calvin cycle runs mostly in the DAYLIGHT, at the same time as the light reactions — it just does not absorb light itself. It needs the ATP and NADPH the light reactions are producing right then, so in the dark it stalls rather than starts.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '6CO2 + 6H2O + light → C6H12O6 + 6O2 — light energy becomes chemical energy in glucose.',
        'Light reactions: in the thylakoid membrane; split water; make ATP, NADPH and O2.',
        'Calvin cycle: in the stroma; takes CO2; spends ATP and NADPH to build glucose.',
        'The released O2 comes from WATER; the carbon in glucose comes from CO2.',
        'Light-independent means "does not use light directly" — not "runs at night".',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Photosynthesis: Light Reactions & the Calvin Cycle' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
