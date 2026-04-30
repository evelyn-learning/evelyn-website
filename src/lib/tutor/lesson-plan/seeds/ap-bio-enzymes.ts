/**
 * AP Bio — Enzymes.
 *
 * Active site, induced fit, factors affecting activity (temperature, pH), inhibition.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_ENZYMES: LessonPlan = {
  id: 'evelyn.ap.bio.enzymes.v1',
  title: 'Enzymes',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.enzymes',
      description: 'Explain how enzymes lower activation energy, identify factors that affect enzyme activity, and distinguish competitive from non-competitive inhibition.',
      standard: 'AP-BIO-ENE-1',
    },
  ],
  prerequisites: ['apbio.macromolecules'],
  followUps: ['apbio.cellular-respiration'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame enzymes as biological catalysts that make life possible.',
      script: 'A reaction that would take centuries on its own can finish in milliseconds inside a cell. The reason: enzymes. They\'re protein machines that grip a specific molecule, twist it just right, and release the product. Without enzymes the chemistry of life would be too slow to keep us alive. With them, every cell runs thousands of reactions per second.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanism',
      kind: 'concept',
      goal: 'Active site, induced fit, factors, inhibition.',
      keyIdeas: [
        'ENZYMES are CATALYSTS: they speed up reactions by lowering activation energy. They are NOT consumed — same enzyme can process millions of substrate molecules.',
        'ACTIVE SITE: the small region of the enzyme where the substrate binds. Shape and chemistry are highly specific. One enzyme = (usually) one reaction.',
        'INDUCED FIT: classic "lock and key" oversimplifies. The active site actually changes shape slightly when substrate binds, gripping it more tightly. Substrate is bent or strained, lowering the energy needed for the reaction.',
        'TEMPERATURE: each enzyme has an optimal T. Too low → slow molecular motion → fewer collisions. Too high → DENATURATION (the protein unfolds). Human enzymes optimal near 37°C.',
        'pH: each enzyme has an optimal pH. Too acidic or too basic disrupts hydrogen bonds and electrostatic interactions in the active site. Stomach pepsin works at pH ~2; pancreas trypsin works at pH ~8.',
        'COMPETITIVE INHIBITION: a molecule resembling the substrate binds the active site, blocking the real substrate. Can be overcome with HIGHER substrate concentration.',
        'NON-COMPETITIVE (allosteric) INHIBITION: inhibitor binds at a different site, changing the enzyme\'s shape. Higher substrate doesn\'t help — the active site is no longer functional.',
        'COFACTORS / COENZYMES: small molecules (Mg²⁺, NAD⁺, vitamins) needed for some enzymes to work.',
        'FEEDBACK INHIBITION: end product of a pathway inhibits an early enzyme — automatic regulation.',
      ],
      vocabulary: [
        { term: 'activation energy', definition: 'the energy barrier that must be crossed for a reaction to proceed.' },
        { term: 'denaturation', definition: 'unfolding of a protein\'s 3D structure, destroying its function.' },
        { term: 'allosteric site', definition: 'a non-active-site location on an enzyme where regulatory molecules bind.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-inhibition',
      kind: 'worked_example',
      problem: 'A drug inhibits an enzyme. When substrate concentration is increased, the inhibition is overcome. Is this competitive or non-competitive inhibition?',
      steps: [
        'COMPETITIVE: inhibitor and substrate fight for the same active site. With more substrate, substrate wins more often. Effect FADES.',
        'NON-COMPETITIVE: inhibitor binds elsewhere, changes the active-site shape. More substrate doesn\'t help — the enzyme is broken. Effect PERSISTS.',
        'OBSERVATION: inhibition fades with more substrate. → COMPETITIVE.',
        'GRAPH SIGNATURE: V_max stays the same (eventually you outcompete), but K_m (substrate needed for half max) goes UP.',
        'EXAMPLE: methanol poisoning treated with ethanol — both compete for the same enzyme (alcohol dehydrogenase), and the ethanol wins, slowing methanol\'s conversion to toxic formaldehyde.',
      ],
      answer: 'Competitive — increasing substrate concentration overcomes it.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Enzyme activity drops sharply when temperature rises from 37°C to 60°C. Why?',
      expectedAnswer: 'The enzyme denatures — high heat disrupts the hydrogen bonds and other interactions that hold its 3D shape, especially at the active site, so it can no longer bind substrate properly.',
      responseFormat: 'free',
      hints: [
        'Enzymes are PROTEINS. What does heat do to protein structure?',
        'Active site = specific shape.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy',
      kind: 'misconception_check',
      question: 'Do enzymes change whether a reaction happens — that is, do they change the equilibrium?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing rate with thermodynamics.',
          correctsTo: 'No. Enzymes change the SPEED of a reaction (kinetics), not the EQUILIBRIUM (thermodynamics). They lower activation energy, so the reaction reaches equilibrium faster — but the same equilibrium concentrations are reached either way. ΔG is unchanged. An endergonic reaction still requires energy input, even with an enzyme.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Enzymes lower activation energy, are not consumed.',
        'Active site + induced fit. Specificity from shape and chemistry.',
        'Temperature and pH have optima; extremes denature.',
        'Competitive (overcome by more substrate) vs non-competitive (can\'t overcome).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does feedback inhibition usually act on an enzyme EARLY in a pathway rather than the last one?',
      hint: 'Stopping the pathway early prevents the cell from wasting energy and intermediates that would just sit unused. Late inhibition would let intermediates pile up. Feedback inhibition\'s logic is conservation — switch off the production line at the start, not the end.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
