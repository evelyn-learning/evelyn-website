/**
 * MCAT — Biological and Biochemical Foundations.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_BIO_BIOCHEM_DOMAINS: LessonPlan = {
  id: 'evelyn.testprep.mcat.bio-biochem.domains.v1',
  title: 'MCAT Bio/Biochem — Section Overview and High-Yield Domains',
  curriculum: 'MCAT',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-bio-biochem',
  locale: 'en',
  los: [
    {
      id: 'testprep.mcat.bio-biochem.domains',
      description: 'Map the MCAT Bio/Biochem section: content distribution, organ-system focus, biochem fundamentals, passage strategy.',
      standard: 'MCAT-BB',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Bio/Biochem is the largest test of biology background in any standardised test — and the MOST important section for medical schools.',
      script: 'Bio/Biochem covers ~65% biology and ~25% biochemistry. Med schools weight it heavily because it overlaps directly with year-1 medical school content. Today: section format, the organ systems that get tested most, the biochem fundamentals, and the passage strategy.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mcat-bb',
      kind: 'concept',
      goal: 'Format, content distribution, organ systems emphasised, biochem fundamentals.',
      keyIdeas: [
        'FORMAT: 59 questions, 95 minutes. Identical structure to Chem/Phys.',
        'CONTENT:',
        '  BIOLOGY (~65%): cell biology, molecular biology, genetics, organ systems.',
        '  BIOCHEMISTRY (~25%): enzymes, metabolism, amino acids/proteins, nucleic acids, lipids, carbohydrates.',
        '  GEN/ORG CHEMISTRY (~10%): especially related to biomolecules and reactions.',
        'ORGAN SYSTEMS heavily tested:',
        '  CARDIOVASCULAR (heart cycles, blood pressure, hemodynamics, hemoglobin O₂ binding).',
        '  RESPIRATORY (gas exchange, ventilation, transport).',
        '  NERVOUS (action potentials, neurotransmission, sensory).',
        '  ENDOCRINE (hormones, feedback loops, signal transduction).',
        '  RENAL (filtration, reabsorption, secretion, acid-base).',
        '  IMMUNE (innate vs adaptive, antibodies, complement).',
        '  REPRODUCTIVE + GASTROINTESTINAL also tested.',
        'BIOCHEMISTRY fundamentals:',
        '  ENZYME KINETICS (Michaelis-Menten, inhibition types).',
        '  CELLULAR RESPIRATION (glycolysis, TCA, ETC, ATP yield).',
        '  PHOTOSYNTHESIS (lighter touch).',
        '  PROTEIN STRUCTURE (primary → quaternary, denaturation).',
        '  AMINO ACIDS — memorise the 20, plus their pKa and properties.',
        '  DNA REPLICATION + TRANSCRIPTION + TRANSLATION (central dogma in detail).',
        '  GENE REGULATION (operons, eukaryotic regulation).',
        'PASSAGE TYPES:',
        '  EXPERIMENTAL: most common; describes a study with controls and results.',
        '  CASE-BASED: clinical scenarios with patient info.',
        '  SYNTHESIS: ties together multiple topics in one passage.',
        'STRATEGY: amino acids and metabolism pathways are heavily testable. Memorise structures and pKa values. Action potentials and hormone-receptor signaling are common. Read carefully for novel mechanisms presented in passages — questions often test integration of new info with established knowledge.',
      ],
      vocabulary: [
        { term: 'central dogma', definition: 'DNA → RNA → protein, the foundational flow of genetic information; MCAT tests each step in detail.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A passage describes a missense mutation in hemoglobin where glutamic acid is replaced by valine. What is the likely effect, and which disease does this mutation cause?',
      steps: [
        'Glutamic acid: charged (negative), polar amino acid.',
        'Valine: hydrophobic, nonpolar.',
        'A charged-to-hydrophobic substitution can drastically alter protein folding or surface properties.',
        'In hemoglobin (β-chain, position 6), this exact substitution causes SICKLE CELL DISEASE. The mutated hemoglobin (HbS) polymerises under low oxygen, distorting RBC shape.',
        'Effect: RBCs sickle in capillaries → vaso-occlusion → pain, infarction, anemia.',
        'High-yield connection: shows how a single amino acid change can cause systemic disease — the kind of integration MCAT loves.',
      ],
      answer: 'Sickle cell disease (HbS); hydrophobic patch causes hemoglobin polymerisation under low O₂.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the loop of Henle, the descending limb is permeable to water but not solutes; the ascending limb is impermeable to water but pumps NaCl out. What is the result?',
      expectedAnswer: 'Counter-current multiplier system. Descending limb: water leaves into the increasingly hyperosmotic medullary interstitium → tubular fluid becomes concentrated. Ascending limb: NaCl is pumped out, but water can\'t follow → fluid becomes dilute. The net effect: maintains the medullary osmotic gradient, which is what allows the collecting duct to concentrate urine when ADH is present. This is one of the most-tested kidney mechanisms.',
      responseFormat: 'free',
      hints: [
        'What flows out of each limb?',
        'How does this set up an osmotic gradient?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-memorize-everything',
      kind: 'misconception_check',
      question: 'A student tries to memorise every metabolic pathway atom-by-atom. Why is this often wasteful?',
      commonErrors: [
        {
          answer: 'Memorise atom-by-atom',
          misconception: 'Treating MCAT biochem as a memorisation test rather than an integration test.',
          correctsTo: 'MCAT tests UNDERSTANDING of pathways — key inputs, outputs, regulation, and ATP yield — not every molecular structure. You should know glycolysis\'s key steps (rate-limiting enzyme = PFK-1; net products: 2 pyruvate, 2 ATP, 2 NADH), but you don\'t need to memorise every intermediate\'s exact structure. Focus on REGULATION (allosteric activators/inhibitors), ENERGY YIELD, and where pathways connect (acetyl-CoA from beta-oxidation, etc.). Time is better spent on integration than on rote atom-counting.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '65% biology, 25% biochem, ~10% chem.',
        'High-yield: cardiovascular, neuro, renal, endocrine.',
        'Memorise amino acids + central dogma + key pathways.',
        'Focus on regulation and integration, not raw memorisation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
