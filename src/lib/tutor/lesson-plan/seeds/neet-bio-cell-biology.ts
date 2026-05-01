/**
 * NEET Biology — Cell: The Unit of Life.
 *
 * Class 11 NCERT chapter. High-yield: 4-6 questions per NEET sitting.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_BIO_CELL_BIOLOGY: LessonPlan = {
  id: 'evelyn.testprep.neet.bio.cell-biology.v1',
  title: 'NEET Biology — Cell: The Unit of Life',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-biology',
  locale: 'en',
  los: [
    {
      id: 'neet.bio.cell-biology',
      description: 'Identify cell types (prokaryotic vs eukaryotic), organelle structure-function pairs, and recognize NEET-style factual questions on cell theory and the endomembrane system.',
      standard: 'NEET-BIO-CELL',
    },
  ],
  prerequisites: ['neet.format-2025'],
  followUps: ['neet.bio-genetics'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Cell biology is recall-heavy and a NEET staple.',
      script: 'Almost every NEET paper has 4-6 questions from this single chapter. The questions are mostly about which organelle does what, prokaryote vs eukaryote contrasts, and the precise lines of NCERT. If you can list the organelles plus their functions plus their distinguishing features cold, you bank these marks fast.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-organelles',
      kind: 'concept',
      goal: 'Organelle inventory + function.',
      keyIdeas: [
        'CELL THEORY (Schleiden 1838 plants, Schwann 1839 animals; Virchow 1855 added "all cells from cells"). Three points: all living things are made of cells; cell is the structural + functional unit; new cells form by division of existing cells.',
        'PROKARYOTIC: no membrane-bound nucleus or organelles. DNA in nucleoid. 70S ribosomes. Cell wall of peptidoglycan (bacteria). Examples: bacteria, archaea.',
        'EUKARYOTIC: membrane-bound nucleus + organelles. 80S ribosomes (free + on RER). Examples: protists, fungi, plants, animals.',
        'NUCLEUS: double membrane (nuclear envelope) with nuclear pores. Contains chromatin (DNA + histones), nucleolus (rRNA + ribosome assembly).',
        'MITOCHONDRIA: double membrane; outer smooth, inner folded into cristae. Site of aerobic respiration → ATP. Has its own DNA (circular) + 70S ribosomes (semi-autonomous). Endosymbiotic origin.',
        'CHLOROPLAST: double membrane + thylakoids stacked into grana. Site of photosynthesis. Own DNA + 70S ribosomes (semi-autonomous, endosymbiotic).',
        'ENDOPLASMIC RETICULUM: ROUGH ER (with ribosomes) → protein synthesis. SMOOTH ER → lipid synthesis, detox.',
        'GOLGI APPARATUS: cis face (receives from ER) → trans face (ships modified products). Glycosylation, sorting.',
        'LYSOSOMES: acidic (pH ~5), full of hydrolytic enzymes. Intracellular digestion ("suicide bags").',
        'PEROXISOMES: contain catalase. Detoxify H₂O₂, β-oxidation of fatty acids.',
        'RIBOSOMES: 80S in eukaryote cytoplasm (60S + 40S subunits), 70S in prokaryotes and inside mitochondria/chloroplasts.',
        'CYTOSKELETON: microtubules (tubulin, structural + cilia/flagella core), microfilaments (actin, movement), intermediate filaments (mechanical strength).',
      ],
      vocabulary: [
        { term: 'cristae', definition: 'inward folds of the inner mitochondrial membrane that house the electron transport chain.' },
        { term: 'thylakoid', definition: 'flattened membrane sac inside chloroplasts where light reactions of photosynthesis occur.' },
        { term: 'endosymbiotic theory', definition: 'mitochondria + chloroplasts originated as ancestral free-living prokaryotes engulfed by a host cell.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-example',
      kind: 'worked_example',
      problem: 'Identify the organelle and its key feature: "Membrane-bound, contains hydrolytic enzymes, internally acidic at pH ~5, derived from Golgi apparatus."',
      steps: [
        'Membrane-bound + hydrolytic enzymes + acidic interior + Golgi-derived → this is a LYSOSOME.',
        'Hydrolytic enzymes (proteases, lipases, nucleases) work optimally at low pH (5).',
        'Lysosome H+-ATPase pumps protons IN to maintain acidity.',
        'Function: intracellular digestion of macromolecules, autophagy, defense (in immune cells).',
        'Disease association: Tay-Sachs (hexosaminidase A deficiency), Pompe disease (acid maltase deficiency) — lysosomal storage diseases.',
      ],
      answer: 'Lysosome — acidic interior + hydrolytic enzymes from Golgi.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which of the following is found in BOTH plant and animal cells: chloroplast, central vacuole, cell wall, mitochondria?',
      expectedAnswer: 'Mitochondria. Chloroplasts, large central vacuole, and cell wall are plant-specific. Mitochondria are universal in eukaryotic cells.',
      responseFormat: 'free',
      hints: [
        'Three of these are plant-cell features.',
        'The one shared between both cell types is the powerhouse organelle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-prokaryote-orgs',
      kind: 'misconception_check',
      question: 'Prokaryotic cells have no organelles at all. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Conflating "membrane-bound organelles" with "all organelles".',
          correctsTo: 'False. Prokaryotes lack MEMBRANE-BOUND organelles (no nucleus, mitochondria, ER, Golgi, lysosomes), but they DO have ribosomes (70S type), a cell wall, sometimes flagella, and a nucleoid region with DNA. Ribosomes count as organelles in many definitions even though they\'re not membrane-bound. NEET often phrases questions to trap students on this distinction — read carefully whether the question says "no organelles" or "no membrane-bound organelles."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cell theory: cells from cells. Schleiden + Schwann + Virchow.',
        'Prokaryote vs eukaryote: membrane-bound nucleus + organelles is the key difference.',
        'Mitochondria + chloroplasts have own DNA + 70S ribosomes (endosymbiotic origin).',
        'Lysosome (acidic, hydrolytic) ≠ peroxisome (catalase, H₂O₂).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does the endosymbiotic theory explain why mitochondria divide independently of the cell cycle?',
      hint: 'Mitochondria descended from free-living bacteria engulfed by a host cell ~1.5 billion years ago. They retained their own circular DNA, 70S ribosomes (bacterial type), double membrane (the inner one is the original bacterial membrane; outer is host-derived), and ability to divide by binary fission. Their division is partly autonomous because they kept the bacterial fission machinery, but the host now controls when it happens via signaling. NEET sometimes asks "evidence for endosymbiotic theory" — these are the answer points.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
