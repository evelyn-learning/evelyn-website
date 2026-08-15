/**
 * High School Biology — Cell Theory and Cell Structure.
 *
 * The HS-level deep dive on cells: cell theory's three tenets,
 * prokaryotic vs eukaryotic distinction, and a more thorough survey
 * of organelles + their functions. Builds on the MS-level intro
 * (g6-sci-cells) by adding endosymbiotic theory, the endomembrane
 * system, and structure-function reasoning at a higher level.
 *
 * Source: NGSS HS-LS1, OpenStax Biology 2e Chapter 4 (Cell Structure).
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_CELL_THEORY_STRUCTURE: LessonPlan = {
  id: 'evelyn.hs.science.biology.cell-theory-structure.v1',
  title: 'Cell Theory and Cell Structure',
  curriculum: 'NGSS',
  grade: '9-12',
  subject: 'science',
  topic: 'cell-biology',
  locale: 'en',
  los: [
    {
      id: 'ngss.hs-ls1-1',
      description: 'Construct an explanation based on evidence for how the structure of DNA determines the structure of proteins which carry out the essential functions of life through systems of specialized cells.',
      standard: 'NGSS.HS-LS1-1',
    },
    {
      id: 'ngss.hs-ls1-2',
      description: 'Develop and use a model to illustrate the hierarchical organization of interacting systems that provide specific functions within multicellular organisms.',
      standard: 'NGSS.HS-LS1-2',
    },
  ],
  prerequisites: ['ngss.ms-ls1-1', 'ngss.ms-ls1-2'],
  followUps: ['hs.bio.cell-membrane-transport', 'hs.bio.cellular-respiration'],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor cell biology in a concrete scale: ~37 trillion cells in your body, every one descended from a single cell (the zygote).',
      script: 'You started life as ONE cell. Right now you\'re about 37 trillion. Every one of those cells came from another cell — a continuous chain back to that first one. And every cell shares the same basic blueprint with bacteria, mushrooms, and oak trees. That shared blueprint IS what biologists mean by "cell theory."',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cell-theory',
      kind: 'concept',
      goal: 'State the three tenets of modern cell theory and the historical observations that built them.',
      keyIdeas: [
        '1) All living organisms are composed of one or more cells.',
        '2) The cell is the basic unit of structure and function in living things.',
        '3) All cells arise from pre-existing cells (no spontaneous generation).',
        'Hooke (1665) coined "cell" looking at cork. Schleiden + Schwann (1838-39) extended it to all life. Virchow (1855) added "all cells from cells".',
        'Modern additions: cells contain hereditary information (DNA) passed during reproduction; energy flow occurs within cells.',
      ],
      vocabulary: [
        { term: 'cell theory', definition: 'the foundational principle that all living things are composed of cells.' },
        { term: 'spontaneous generation', definition: 'the discredited idea that living things arise from non-living matter — disproved by Pasteur\'s swan-neck flask experiments.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_historical_timeline'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-prokaryote-eukaryote',
      kind: 'concept',
      goal: 'Contrast the two cell types — prokaryotic (no nucleus, simpler) vs eukaryotic (compartmentalized organelles).',
      keyIdeas: [
        'PROKARYOTES (bacteria, archaea): no membrane-bound nucleus; DNA in a nucleoid region. Simpler, smaller (1-10 μm). NO membrane-bound organelles. Older — first cells, ~3.5 billion years ago.',
        'EUKARYOTES (animals, plants, fungi, protists): nucleus encloses DNA in a membrane. Larger (10-100 μm). MANY membrane-bound organelles for compartmentalized function.',
        'KEY INSIGHT — compartmentalization: dividing tasks into separate organelles lets eukaryotic cells run incompatible reactions side-by-side (e.g., enzymes that destroy junk inside a lysosome don\'t hurt the rest of the cell).',
        'Endosymbiotic theory: mitochondria + chloroplasts were once free-living prokaryotes engulfed by an ancestor cell. Evidence: their own DNA, double membranes, and ribosomes that look prokaryotic.',
      ],
      vocabulary: [
        { term: 'prokaryote', definition: 'a cell without a membrane-bound nucleus.' },
        { term: 'eukaryote', definition: 'a cell with a nucleus and other membrane-bound organelles.' },
        { term: 'endosymbiosis', definition: 'the evolutionary process by which one cell engulfed another and the two became permanently dependent.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-organelles-deep',
      kind: 'concept',
      goal: 'Map each major organelle to its specific function and the structural features that enable that function.',
      keyIdeas: [
        'NUCLEUS: double membrane (nuclear envelope) with pores. Contains DNA in chromatin form. Nucleolus inside makes ribosomes.',
        'ROUGH ER: studded with ribosomes; folds and modifies proteins destined for export or membranes.',
        'SMOOTH ER: no ribosomes; synthesizes lipids, detoxifies drugs, stores Ca²⁺.',
        'GOLGI APPARATUS: receives proteins from ER, modifies them (glycosylation), packages into vesicles for shipping.',
        'LYSOSOMES: acidic interior with digestive enzymes; recycle worn-out parts and broken-down food.',
        'MITOCHONDRIA: double membrane (inner is highly folded into cristae); produce ATP via cellular respiration. Have their own DNA + ribosomes.',
        'CHLOROPLASTS (plants only): double membrane + thylakoid stacks (grana); do photosynthesis. Also have their own DNA.',
        'CYTOSKELETON: microtubules + microfilaments + intermediate filaments. Shape, structure, intracellular transport, cell division.',
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-secretory-pathway',
      kind: 'worked_example',
      problem: 'A pancreatic cell secretes insulin (a protein hormone) into the bloodstream. Trace insulin\'s path from DNA in the nucleus to release outside the cell, naming each organelle involved.',
      steps: [
        'NUCLEUS: insulin gene is transcribed into mRNA; mRNA exits through nuclear pores.',
        'ROUGH ER: mRNA binds to ribosomes on the ER surface; insulin protein is synthesized DIRECTLY into the ER lumen and folded.',
        'TRANSPORT VESICLE: pinches off the ER membrane carrying insulin to the Golgi.',
        'GOLGI APPARATUS: insulin is modified (cleaved into mature form) and packaged into secretory vesicles.',
        'SECRETORY VESICLE: travels along the cytoskeleton to the cell membrane.',
        'EXOCYTOSIS: vesicle fuses with the cell membrane, releasing insulin to the bloodstream.',
      ],
      answer: 'Nucleus → Rough ER → transport vesicle → Golgi → secretory vesicle → exocytosis at cell membrane.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A scientist analyzes a mystery cell sample. Under the microscope she sees: NO nucleus, a single circular chromosome free in the cytoplasm, NO membrane-bound organelles, and a cell wall containing peptidoglycan. What domain of life does this organism most likely belong to?',
      expectedAnswer: 'Bacteria (prokaryote)',
      responseFormat: 'free',
      hints: [
        'Membrane-bound nucleus? Yes → eukaryote. No → prokaryote.',
        'Among prokaryotes, peptidoglycan in the cell wall is the key signature of bacteria specifically (archaea use different molecules).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-plant-vs-animal-symmetric',
      kind: 'misconception_check',
      question: 'A student claims "plant cells are basically the same as animal cells, just with chloroplasts and a cell wall added." Is that fully accurate, or is something missing?',
      commonErrors: [
        {
          answer: 'Yes, that\'s the only difference.',
          misconception: 'Reducing plant-vs-animal differences to just chloroplasts + cell wall.',
          correctsTo: 'Plant cells also have a LARGE central vacuole (often >50% of cell volume — turgor pressure for rigidity, storage). Animal cells have small/many vacuoles instead. Plant cells lack centrioles for cell division (use a different mechanism). And plasmodesmata connect plant cells through their walls — animal cells use different junctions (gap, tight, desmosomes).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cell theory: cells are the basic unit; all life is cells; cells come from cells.',
        'Prokaryotic = no nucleus, no membrane-bound organelles, smaller, older.',
        'Eukaryotic = nucleus + compartmentalized organelles, larger, more recent.',
        'Endosymbiotic theory explains why mitochondria + chloroplasts have their own DNA.',
        'Each organelle\'s structure (membranes, folds, location) reflects its function.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Mitochondria have their own circular DNA, double membranes, and ribosomes that resemble prokaryotic ribosomes. If you discovered a new free-living bacterium with surprising similarities to mitochondria, what would that suggest about the evolutionary origin of mitochondria?',
      hint: 'This is exactly how endosymbiotic theory was strengthened — by finding modern bacterial relatives that look like ancestral mitochondria.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
