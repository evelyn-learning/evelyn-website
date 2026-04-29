/**
 * High School Biology — Cellular Respiration.
 *
 * NGSS HS-LS1-7: how cellular respiration breaks down food molecules
 * to produce ATP. Three stages — glycolysis, Krebs cycle, electron
 * transport chain — and how they fit together. Counterpart to
 * photosynthesis. Builds on cell-theory-structure (mitochondria as the
 * organelle where most of this happens).
 *
 * Source: NGSS HS-LS1, OpenStax Biology 2e Chapter 7.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_CELLULAR_RESPIRATION: LessonPlan = {
  id: 'evelyn.hs.science.biology.cellular-respiration.v1',
  title: 'Cellular Respiration',
  curriculum: 'NGSS',
  grade: '9-12',
  subject: 'science',
  topic: 'cell-biology',
  locale: 'en',
  los: [
    {
      id: 'ngss.hs-ls1-7',
      description: 'Use a model to illustrate that cellular respiration is a chemical process whereby the bonds of food molecules and oxygen molecules are broken and the bonds in new compounds are formed resulting in a net transfer of energy.',
      standard: 'NGSS.HS-LS1-7',
    },
  ],
  prerequisites: ['ngss.hs-ls1-1', 'ngss.hs-ls1-5'],
  followUps: ['hs.bio.photosynthesis-deep'],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor cellular respiration in the breath the student is taking right now.',
      script: 'Take a breath. The oxygen in that breath is heading to your cells RIGHT NOW. There, it gets combined with sugar from your last meal to release energy. The CO₂ you exhale is the leftover. That whole process is called cellular respiration — and it\'s how every cell in your body gets the energy to do anything.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-overall-equation',
      kind: 'concept',
      goal: 'State the overall equation, recognize it as the reverse of photosynthesis, and identify the energy currency (ATP).',
      keyIdeas: [
        'Overall equation: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP (energy).',
        'Glucose + oxygen → carbon dioxide + water + usable energy (ATP).',
        'This is the REVERSE of photosynthesis (which uses CO₂ + H₂O + light to MAKE glucose + O₂).',
        'ATP (adenosine triphosphate) is the cell\'s ENERGY CURRENCY — like cash that powers any cellular task.',
        'One glucose molecule yields about 30-32 ATP via complete aerobic respiration.',
        'Without oxygen, cells fall back to FERMENTATION — much less efficient (~2 ATP per glucose).',
      ],
      vocabulary: [
        { term: 'ATP', definition: 'adenosine triphosphate — the energy currency of cells.' },
        { term: 'aerobic', definition: 'requiring oxygen.' },
        { term: 'anaerobic', definition: 'NOT requiring oxygen (e.g., fermentation).' },
      ],
      suggestedTools: ['show_equation', 'show_balanced_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-three-stages',
      kind: 'concept',
      goal: 'Map the three stages of aerobic respiration to where they happen and what they produce.',
      keyIdeas: [
        'STAGE 1 — GLYCOLYSIS. Location: cytoplasm. Splits glucose (6C) into 2 pyruvate (3C each). Net: 2 ATP + 2 NADH. Anaerobic — works without oxygen.',
        'STAGE 2 — KREBS CYCLE (citric acid cycle). Location: mitochondrial matrix. Pyruvate → acetyl-CoA → enters cycle, releases CO₂. Per glucose: 2 ATP + 6 NADH + 2 FADH₂. Requires oxygen indirectly (NADH/FADH₂ need to be re-oxidized later).',
        'STAGE 3 — ELECTRON TRANSPORT CHAIN (ETC). Location: inner mitochondrial membrane (cristae). NADH and FADH₂ donate electrons → energy used to pump H⁺ → H⁺ flow back through ATP synthase → ~26-28 ATP per glucose. Oxygen is the FINAL electron acceptor (forms H₂O).',
        'Why mitochondria matter: stages 2 and 3 happen INSIDE mitochondria. Cells with high energy demand (muscle, neurons) have many mitochondria.',
      ],
      vocabulary: [
        { term: 'glycolysis', definition: 'first stage; splits glucose into pyruvate; in cytoplasm.' },
        { term: 'Krebs cycle', definition: 'second stage; in mitochondrial matrix; releases CO₂.' },
        { term: 'electron transport chain', definition: 'third stage; on inner mitochondrial membrane; produces most ATP.' },
        { term: 'ATP synthase', definition: 'enzyme that uses H⁺ flow to make ATP.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-glucose-trace',
      kind: 'worked_example',
      problem: 'Trace a single glucose molecule from your last meal through aerobic respiration. Where does each carbon atom end up?',
      steps: [
        'GLYCOLYSIS (cytoplasm): glucose (6 carbons) is split into 2 pyruvate molecules (3 carbons each). Net 2 ATP, 2 NADH. All 6 carbons still present.',
        'PYRUVATE → ACETYL-CoA (mitochondrial matrix): each pyruvate loses 1 carbon as CO₂. So 2 carbons exit as CO₂; 4 carbons enter the Krebs cycle as 2 acetyl-CoA.',
        'KREBS CYCLE: each acetyl-CoA (2C) is fully oxidized over one cycle, releasing 2 CO₂. Two cycles per glucose → 4 more CO₂ released.',
        'TOTAL CO₂ released: 2 (from pyruvate) + 4 (from Krebs) = 6 CO₂. Matches the overall equation.',
        'ELECTRON TRANSPORT CHAIN: NADH and FADH₂ from earlier stages donate electrons; oxygen accepts them at the end and combines with H⁺ to form 6 H₂O. Energy harvested → ~26 ATP.',
      ],
      answer: 'All 6 carbons exit as 6 CO₂ (you exhale them). Energy is captured as ~30 ATP total. Oxygen ends up as water.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'During intense exercise, your muscle cells run out of oxygen. They switch from aerobic respiration to lactic acid fermentation. What happens to (a) ATP yield per glucose and (b) the products?',
      expectedAnswer: 'ATP yield drops drastically (~30 → ~2 per glucose). Products change: instead of CO₂ + H₂O, fermentation produces lactic acid (which causes muscle fatigue/burning).',
      responseFormat: 'free',
      hints: [
        'Without O₂, the electron transport chain stalls. Only glycolysis runs.',
        'Glycolysis produces only 2 ATP per glucose, vs ~30 for full aerobic respiration.',
        'Pyruvate gets converted to lactic acid (in animals) instead of entering the Krebs cycle.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-burning-vs-respiration',
      kind: 'misconception_check',
      question: 'A student says "cellular respiration is just burning sugar inside cells — same chemistry, just slower." What\'s right and what\'s wrong about this?',
      commonErrors: [
        {
          answer: 'Yes — it\'s burning, just slower.',
          misconception: 'Equating cellular respiration to combustion at temperature.',
          correctsTo: 'PARTIALLY right — both convert glucose + O₂ to CO₂ + H₂O and release energy. But combustion releases energy as HEAT in one big burst (and would damage cells). Cellular respiration is a CONTROLLED, multi-step process that captures energy in small packets as ATP — usable, not destructive. The equation is the same; the mechanism is completely different.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Overall: glucose + O₂ → CO₂ + H₂O + ATP. Reverse of photosynthesis.',
        'Three stages: glycolysis (cytoplasm) → Krebs cycle (matrix) → electron transport chain (inner membrane).',
        'ETC produces the vast majority of ATP. Requires oxygen as the final electron acceptor.',
        'Total ~30 ATP per glucose with oxygen; only 2 ATP via fermentation without.',
        'Mitochondria are where stages 2 and 3 happen — high-demand cells have many.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
