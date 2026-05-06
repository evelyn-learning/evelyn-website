/**
 * College Intro Biology — Cell Structure and Function.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_INTROBIO_CELLS: LessonPlan = {
  id: 'evelyn.college.sci.introbio.cells.v1',
  title: 'Intro Biology — Cell Structure and Function',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'intro-biology',
  locale: 'en',
  los: [
    {
      id: 'college.sci.introbio.cells',
      description: 'Identify the major eukaryotic organelles, their functions, and the prokaryotic vs eukaryotic distinction.',
      standard: 'COLLEGE-INTROBIO',
    },
  ],
  prerequisites: [],
  followUps: ['college.sci.introbio.genetics'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The cell is the basic unit of life — and almost every other biology topic is downstream of cell structure.',
      script: 'Why does a heart pump? Heart cells have lots of mitochondria — they need ATP. Why does a neuron transmit signals? Membrane structure + ion pumps. Cell biology is the foundation; today we map the major organelles and what each does.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cells',
      kind: 'concept',
      goal: 'Pro vs eukaryote, organelles + roles, membrane, energy/info flow.',
      keyIdeas: [
        'PROKARYOTES (bacteria, archaea): no nucleus, no membrane-bound organelles. Small (1-5 μm). Single circular chromosome. 70S ribosomes.',
        'EUKARYOTES (animals, plants, fungi, protists): nucleus + membrane-bound organelles. Larger (10-100 μm). Linear chromosomes in nucleus. 80S ribosomes (cytoplasmic) + 70S (mito/chloro).',
        'KEY ORGANELLES (eukaryotic):',
        '  NUCLEUS: contains DNA. Surrounded by double membrane (nuclear envelope) with pores. Site of transcription.',
        '  RIBOSOMES: protein synthesis. Free in cytoplasm or on rough ER.',
        '  ROUGH ER: ribosome-studded membrane network. Synthesises secretory + membrane proteins.',
        '  SMOOTH ER: lipid synthesis, detoxification, calcium storage.',
        '  GOLGI APPARATUS: modifies, sorts, and packages proteins/lipids from ER. Cis face receives, trans face ships out.',
        '  MITOCHONDRIA: ATP production via cellular respiration. Has own DNA + 70S ribosomes (endosymbiotic origin).',
        '  CHLOROPLASTS (plants/algae only): photosynthesis. Also endosymbiotic origin.',
        '  LYSOSOMES: digestive enzymes; degrade waste, old organelles (autophagy).',
        '  PEROXISOMES: oxidative reactions; detox.',
        '  CYTOSKELETON: microfilaments (actin), intermediate filaments, microtubules. Shape, movement, transport, division.',
        'PLASMA MEMBRANE: phospholipid bilayer with embedded proteins. Selectively permeable. Fluid mosaic model.',
        'PLANT CELLS additionally have: rigid CELL WALL (cellulose), large CENTRAL VACUOLE, and chloroplasts.',
        'ENDOSYMBIOTIC THEORY: mitochondria + chloroplasts evolved from free-living bacteria engulfed by ancestor eukaryotic cells. Evidence: own DNA, 70S ribosomes, double membrane, divide independently.',
      ],
      vocabulary: [
        { term: 'organelle', definition: 'a specialised, membrane-bound (in eukaryotes) compartment within a cell with a specific function.' },
        { term: 'endosymbiotic theory', definition: 'theory that mitochondria and chloroplasts arose from engulfed bacteria; supported by their own DNA, ribosomes, and membranes.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A liver cell needs to detoxify alcohol. Trace which organelles are involved.',
      steps: [
        'Detoxification reactions occur in the SMOOTH ER (which contains the relevant enzymes including cytochrome P450 family).',
        'PEROXISOMES also play a role — they oxidise alcohols (with hydrogen peroxide as a byproduct that catalase then breaks down).',
        'Energy for the process: MITOCHONDRIA provide ATP for active transport / metabolic reactions.',
        'Synthesis of new detox enzymes when needed: NUCLEUS (transcription) → ROUGH ER (translation, since detox enzymes are membrane-embedded) → vesicle transport.',
        'Final answer: smooth ER + peroxisome do the chemistry; mitochondria provide energy; nucleus + rough ER produce more enzymes if induced.',
      ],
      answer: 'Smooth ER + peroxisomes (chemistry); mitochondria (ATP); nucleus + rough ER (enzyme synthesis).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A muscle cell has tons of mitochondria and lots of smooth ER (specifically sarcoplasmic reticulum). Why?',
      expectedAnswer: 'Mitochondria: muscle cells need vast ATP for contraction. Smooth ER (sarcoplasmic reticulum): stores Ca²⁺ ions; contraction is triggered by Ca²⁺ release from SR. Form follows function — both organelles are abundant because contraction demands continuous ATP supply and rapid Ca²⁺ release/reuptake.',
      responseFormat: 'free',
      hints: [
        'What does muscle do? What energy + ions does that require?',
        'Mitochondria → energy. Smooth ER → ?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pro-organelles',
      kind: 'misconception_check',
      question: 'A student says "prokaryotes don\'t have any organelles." Why is this slightly off?',
      commonErrors: [
        {
          answer: 'Prokaryotes have no organelles',
          misconception: 'Equating "organelle" exclusively with "membrane-bound."',
          correctsTo: 'Prokaryotes have ribosomes (70S — non-membrane organelles), and some have specialised structures like CARBOXYSOMES, MAGNETOSOMES, or GAS VESICLES. The defining feature is they LACK MEMBRANE-BOUND organelles (no nucleus, no mito, no ER, no Golgi). The DNA sits in a region called the nucleoid (no membrane around it). Ribosomes ARE organelles in some textbook definitions; tighten the language: "prokaryotes lack membrane-bound organelles."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pro = no nucleus, no membrane-bound organelles. Euk = nucleus + organelles.',
        'Nucleus → transcription. Ribosomes → translation. Rough ER → secretory proteins.',
        'Mitochondria → ATP. Chloroplasts → photosynthesis (plants).',
        'Endosymbiotic theory: mito + chloro from ancestral bacteria.',
        'Form follows function — abundance reflects cellular role.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
