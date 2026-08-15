/**
 * AP Biology — Photosynthesis (deep with light + Calvin cycle).
 *
 * Two stages: light-dependent reactions (in thylakoids) producing
 * ATP and NADPH; Calvin cycle (in stroma) fixing CO₂ into sugar.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_PHOTOSYNTHESIS_DEEP: LessonPlan = {
  id: 'evelyn.ap.bio.photosynthesis-deep.v1',
  title: 'Photosynthesis: light reactions and Calvin cycle',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.photosynthesis',
      description: 'Explain how cells use light energy and CO2 to synthesize carbohydrates.',
      standard: 'AP-BIO-ENE-1',
    },
  ],
  prerequisites: ['apbio.cell-membrane'],
  followUps: ['apbio.respiration'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the big picture: plants are atmospheric machines.',
      script: 'Plants take SUNLIGHT, WATER, and CO₂ — and make sugar. Then release oxygen as a "waste" product. We breathe that oxygen. Photosynthesis isn\'t just chemistry — it\'s the foundation of nearly all food chains and the source of breathable air.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-two-stages',
      kind: 'concept',
      goal: 'Light reactions + Calvin cycle + where each happens.',
      keyIdeas: [
        'OVERALL: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ (glucose) + 6 O₂.',
        'TWO STAGES: 1) LIGHT-DEPENDENT reactions, 2) LIGHT-INDEPENDENT (Calvin cycle).',
        'STAGE 1 — LIGHT REACTIONS (in THYLAKOID membranes): Chlorophyll absorbs light. Photosystems II then I excite electrons. Water is split (releasing O₂). Electron transport chain pumps protons across membrane. ATP synthase makes ATP. NADP⁺ → NADPH.',
        'STAGE 1 OUTPUTS: O₂ (released to atmosphere), ATP and NADPH (used in stage 2).',
        'STAGE 2 — CALVIN CYCLE (in STROMA, the fluid surrounding thylakoids): No light needed directly. CO₂ is "FIXED" into organic molecules using the enzyme RUBISCO. Three turns of the cycle produce one G3P; two G3P combine to glucose. Uses ATP and NADPH from stage 1.',
        'KEY MOLECULES: CHLOROPHYLL absorbs red and blue light, reflects green (why plants look green). RUBISCO is the most abundant protein on Earth — fixes CO₂ in the Calvin cycle.',
        'STRUCTURE: chloroplast = inner stroma + stacks of thylakoid disks (grana). Light reactions on thylakoid membranes. Calvin cycle in stroma fluid.',
      ],
      vocabulary: [
        { term: 'thylakoid', definition: 'flat membrane disks inside chloroplasts where light reactions occur.' },
        { term: 'stroma', definition: 'fluid inside chloroplasts where the Calvin cycle occurs.' },
        { term: 'RuBisCO', definition: 'enzyme that fixes CO₂ into organic molecules; most abundant protein on Earth.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trace',
      kind: 'worked_example',
      problem: 'Trace what happens to a CO₂ molecule taken in through a leaf\'s stomata.',
      steps: [
        'CO₂ enters the leaf through STOMATA (small pores), diffuses to the mesophyll cells.',
        'Inside chloroplasts, CO₂ enters the STROMA.',
        'In the Calvin cycle, RuBisCO attaches CO₂ to RuBP (a 5-carbon sugar) → forming an unstable 6-carbon intermediate that splits into two 3-PGAs.',
        '3-PGAs are reduced (using ATP and NADPH from light reactions) → G3P.',
        'After 3 turns: 6 G3P produced; 5 regenerate RuBP, 1 leaves the cycle.',
        'Two G3Ps combine to form GLUCOSE (C₆H₁₂O₆), which the plant uses for energy or builds into starch, cellulose, etc.',
        'Net: CO₂\'s carbon is now LOCKED into sugar — "fixed" from gas to solid.',
      ],
      answer: 'CO₂ → stomata → stroma → fixed by RuBisCO → ultimately part of glucose',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Where does the OXYGEN we breathe (released by photosynthesis) come from — the CO₂ or the H₂O?',
      expectedAnswer: 'water (H₂O)',
      responseFormat: 'free',
      hints: [
        'In the light reactions, water is SPLIT.',
        'Splitting water releases O₂. The oxygen in CO₂ ends up in the sugar.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plants-eat-soil',
      kind: 'misconception_check',
      question: 'Do plants get most of their MASS from soil?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating plant mass as coming from "food" in the soil.',
          correctsTo: 'No — most of a plant\'s dry mass comes from CO₂ pulled out of the AIR. Carbon is fixed during photosynthesis. Soil provides water and minor nutrients (nitrogen, phosphorus, potassium), but the bulk carbon comes from atmospheric CO₂. A tree weighing tons literally pulled tons of carbon out of the air.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Light reactions (thylakoid): water split → O₂; light → ATP and NADPH.',
        'Calvin cycle (stroma): CO₂ fixed via RuBisCO → G3P → glucose.',
        'O₂ comes from H₂O, NOT from CO₂.',
        'Most plant mass is carbon from atmospheric CO₂.',
        'Photosynthesis is the foundation of nearly all life energy.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'C4 and CAM plants have evolved to deal with HOT, DRY conditions. What problem of regular C3 photosynthesis are they solving?',
      hint: 'In hot dry conditions, stomata close to save water. Without CO₂ entering, RuBisCO grabs O₂ instead (photorespiration), wasting energy. C4 (corn, sugarcane) and CAM (succulents) concentrate CO₂ around RuBisCO to avoid this. Evolution found two separate solutions.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
