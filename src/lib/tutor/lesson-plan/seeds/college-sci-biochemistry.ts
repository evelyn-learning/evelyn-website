/**
 * College Intro — Biochemistry.
 *
 * Macromolecules, enzymes, metabolism, energy carriers.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_BIOCHEMISTRY: LessonPlan = {
  id: 'evelyn.college.biochemistry.v1',
  title: 'Biochemistry — macromolecules, enzymes, metabolism',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'biochemistry',
  locale: 'en',
  los: [
    {
      id: 'college.biochem',
      description: 'Connect macromolecule structure to enzyme function and metabolic pathways.',
      standard: 'COLLEGE-BIOCHEM',
    },
  ],
  prerequisites: ['college.bio', 'college.genchem'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame biochemistry as chemistry where every reaction is catalyzed.',
      script: 'In a test tube, most biological reactions wouldn\'t happen at body temperature. They\'d need extreme heat or pH. Inside cells, ENZYMES drop activation energies by orders of magnitude, allowing tightly-controlled reactions at 37°C and pH 7. Biochemistry is chemistry where catalysis isn\'t optional — it\'s everything.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-biochem',
      kind: 'concept',
      goal: 'Macromolecules + enzymes + metabolism + energy carriers.',
      keyIdeas: [
        'PROTEINS: chains of amino acids. Primary (sequence), secondary (α-helix, β-sheet via H-bonds), tertiary (3D fold via R-group interactions), quaternary (multi-subunit).',
        'CARBOHYDRATES: monosaccharides (glucose) → disaccharides (sucrose) → polysaccharides (starch, glycogen, cellulose). Energy + structure.',
        'LIPIDS: triglycerides (energy), phospholipids (membranes), steroids (signaling).',
        'NUCLEIC ACIDS: DNA + RNA. Sugar-phosphate backbone + bases. Information.',
        'ENZYMES: catalyze by binding substrate at active site; lower Eₐ. Michaelis-Menten: rate = (Vmax · [S]) / (Km + [S]).',
        'METABOLISM = CATABOLISM (breakdown, releases energy) + ANABOLISM (build-up, requires energy).',
        'ATP is the universal energy currency. ATP + H₂O → ADP + Pi releases ~7.3 kcal/mol — used to drive thermodynamically unfavorable reactions.',
        'Cellular respiration: glycolysis (cytoplasm) → Krebs cycle (mitochondrial matrix) → electron transport chain (inner mitochondrial membrane) → ~30-32 ATP per glucose.',
      ],
      vocabulary: [
        { term: 'enzyme', definition: 'a protein catalyst that lowers activation energy for a specific reaction.' },
        { term: 'ATP', definition: 'adenosine triphosphate; the universal energy currency of cells.' },
        { term: 'Michaelis constant Km', definition: 'substrate concentration at which an enzyme runs at half its maximum rate.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mm',
      kind: 'worked_example',
      problem: 'An enzyme has Km = 5 mM and Vmax = 100 μmol/min. What\'s the rate at [S] = 10 mM?',
      steps: [
        'Michaelis-Menten: v = (Vmax · [S]) / (Km + [S])',
        'v = (100 × 10) / (5 + 10) = 1000 / 15 ≈ 66.7 μmol/min.',
        'Notice: at [S] = Km (= 5 mM), v = Vmax/2 = 50.',
        'At [S] >> Km, v → Vmax. At [S] << Km, v ≈ (Vmax/Km)[S] (linear).',
      ],
      answer: '~66.7 μmol/min',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'An enzyme is denatured by heating to 60°C. What does this mean structurally, and why does it kill activity?',
      expectedAnswer: 'tertiary (and possibly secondary) structure unfolds; active site geometry is lost so substrate no longer binds productively',
      responseFormat: 'free',
      hints: [
        'Enzyme function depends on a precisely shaped active site.',
        'Hydrogen bonds and hydrophobic interactions hold the fold; heat disrupts them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-thermo-violation',
      kind: 'misconception_check',
      question: 'A student says: "Cells build complex molecules from simple ones — that violates the second law of thermodynamics." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because order increases',
          misconception: 'Forgetting that the second law applies to total system + surroundings.',
          correctsTo: 'Local order can increase as long as the surrounding entropy increases more. Cells couple anabolic reactions (decreasing entropy locally) to ATP hydrolysis and heat release (increasing entropy of surroundings more). Net entropy of the universe still rises. Living systems are LOCAL pockets of order maintained by EXPORTING disorder.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four macromolecule classes: proteins, carbs, lipids, nucleic acids.',
        'Protein structure: primary → quaternary; function depends on fold.',
        'Enzymes lower Eₐ; Michaelis-Menten describes kinetics.',
        'ATP is the universal energy currency; cells hydrolyze it to drive reactions.',
        'Glucose → ~30-32 ATP via glycolysis + Krebs + ETC.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
