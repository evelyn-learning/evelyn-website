/**
 * AP Biology — Cellular respiration deep.
 *
 * Glycolysis → Krebs cycle → electron transport chain. Net ATP
 * yield, locations, key enzymes.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_CELLULAR_RESPIRATION_DEEP: LessonPlan = {
  id: 'evelyn.ap.bio.cellular-respiration-deep.v1',
  title: 'Cellular respiration: glycolysis, Krebs, ETC',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'ap-biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.respiration',
      description: 'Describe how cells extract energy from glucose through cellular respiration.',
      standard: 'AP-BIO-ENE-1',
    },
  ],
  prerequisites: ['apbio.cell-membrane'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame as the reverse of photosynthesis.',
      script: 'Plants make sugar from CO₂ and water. Animals (and plants) burn that sugar for energy in cellular respiration — releasing CO₂ and water, capturing energy in ATP. It\'s photosynthesis run BACKWARD to extract the stored sun-energy.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-stages',
      kind: 'concept',
      goal: 'Three stages, locations, products.',
      keyIdeas: [
        'OVERALL: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ~30-32 ATP.',
        'STAGE 1 — GLYCOLYSIS (in CYTOPLASM): 1 glucose → 2 pyruvate. Net 2 ATP, 2 NADH. NO oxygen needed (anaerobic).',
        'STAGE 2 — KREBS CYCLE / CITRIC ACID CYCLE (in MITOCHONDRIAL MATRIX): each pyruvate first converts to acetyl-CoA, then through the cycle. Per glucose: 2 ATP, 6 NADH, 2 FADH₂, 6 CO₂ released.',
        'STAGE 3 — ELECTRON TRANSPORT CHAIN (in INNER MITOCHONDRIAL MEMBRANE): NADH and FADH₂ donate electrons. Electrons flow through protein complexes, pumping H⁺ across membrane. ATP synthase makes ATP as H⁺ flows back. Per glucose: ~26-28 ATP. O₂ is the FINAL electron acceptor — combines with electrons + H⁺ to form WATER.',
        'TOTAL ATP PER GLUCOSE: ~30-32 (varies by cell type).',
        'WITHOUT OXYGEN: ETC stalls. Cells switch to FERMENTATION — produces only 2 ATP per glucose. Yeast: ethanol + CO₂. Animal muscle: lactic acid (causes burn during intense exercise).',
        'KEY: oxygen is needed only at the END (ETC) — but it\'s critical because without it, you\'re stuck with just 2 ATP/glucose.',
      ],
      vocabulary: [
        { term: 'ATP', definition: 'adenosine triphosphate — the main energy currency of cells.' },
        { term: 'electron transport chain', definition: 'series of proteins in mitochondrial membrane that build up H⁺ gradient.' },
        { term: 'fermentation', definition: 'anaerobic glucose breakdown producing only 2 ATP.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trace',
      kind: 'worked_example',
      problem: 'Trace one glucose molecule from blood to producing ATP.',
      steps: [
        'Glucose enters a cell via transport protein.',
        'GLYCOLYSIS in cytoplasm: glucose → 2 pyruvate. Net 2 ATP, 2 NADH.',
        'Pyruvate enters MITOCHONDRION → converted to acetyl-CoA → enters KREBS CYCLE.',
        'Krebs makes 2 ATP, 6 NADH, 2 FADH₂, releases 6 CO₂.',
        'NADH and FADH₂ deliver electrons to the ETC in inner mitochondrial membrane.',
        'ETC pumps H⁺ across the membrane → H⁺ flows back through ATP synthase → ~26-28 ATP made.',
        'O₂ accepts the electrons at the end → becomes H₂O.',
        'TOTAL: ~30-32 ATP per glucose.',
      ],
      answer: 'glycolysis (cytoplasm) → Krebs (matrix) → ETC (inner membrane); ~30-32 ATP total',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does intense exercise cause your muscles to BURN?',
      expectedAnswer: 'oxygen runs short → fermentation produces lactic acid as byproduct',
      responseFormat: 'free',
      hints: [
        'Heavy exercise outpaces oxygen delivery.',
        'Without enough O₂, ETC slows. Cells switch to fermentation.',
        'Animal fermentation produces what acid?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-glucose-burns',
      kind: 'misconception_check',
      question: 'Does cellular respiration just "burn" glucose like a fire burns wood?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating respiration as combustion.',
          correctsTo: 'Same overall chemistry, but VERY different process. Combustion releases all energy as HEAT and LIGHT in seconds. Respiration captures most of the energy in ATP, releasing tiny amounts of heat. The CONTROLLED step-by-step extraction is the whole point — it\'s why we can use the energy.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three stages: glycolysis (cytoplasm) → Krebs (matrix) → ETC (inner membrane).',
        'Glycolysis is anaerobic (no O₂). Krebs and ETC need O₂.',
        '~30-32 ATP per glucose with O₂; only 2 ATP per glucose with fermentation.',
        'O₂ is the FINAL electron acceptor in the ETC.',
        'CO₂ released in Krebs (the "carbon" in carbohydrate).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are mitochondria called the "powerhouses of the cell" — and why do they have their OWN DNA?',
      hint: 'Mitochondria run respiration, providing nearly all ATP. ENDOSYMBIOTIC THEORY: mitochondria evolved from free-living bacteria absorbed by ancestral cells billions of years ago. They retain ancient bacterial DNA from that origin.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
