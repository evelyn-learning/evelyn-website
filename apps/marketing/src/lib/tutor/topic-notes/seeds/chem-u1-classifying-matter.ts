/**
 * Chemistry — Unit 1 topic 1.1: Classifying Matter: Elements, Compounds
 * & Mixtures.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u1-classifying-matter.ts
 * (planId evelyn.hs.chem.classifying-matter.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.classifying-matter';
const PLAN_ID = 'evelyn.hs.chem.classifying-matter.v1';

export const BASELINE_CHEM_U1_CLASSIFYING_MATTER: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Classifying Matter: Elements, Compounds & Mixtures',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The two-question sort',
      content:
        'Question 1 — pure substance or mixture? Pure = one kind of particle throughout, FIXED composition, identical in every sample. Mixture = two or more substances physically together in ANY ratio, nothing bonded. Question 2 — pure splits into element vs compound; mixture splits into homogeneous vs heterogeneous. Always in that order.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Element vs compound',
      content:
        'ELEMENT = one kind of atom only (Fe, He, O₂ — two identical atoms bonded is still an element); cannot be broken down chemically. COMPOUND = two or more DIFFERENT elements chemically bonded in a fixed ratio (H₂O, NaCl, CO₂); comes apart only in a chemical reaction.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Homogeneous vs heterogeneous',
      content:
        'HOMOGENEOUS (a solution) = uniform everywhere you sample, no visible boundaries — salt water, air, brass, stainless steel. HETEROGENEOUS = visibly different regions you can point at — granite, sand in water, oil and vinegar. Homogeneous describes appearance only; it says nothing about purity.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Fixed ratio = compound fingerprint',
      content:
        'A compound has ONE ratio, everywhere, forever: water is always 2 H per 1 O whether it came from a glacier or a tap. Salt water can be 1 % salt or 25 % salt and is still salt water. Variable ratio → mixture, no exceptions.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Separation is the operational test',
      content:
        'Mixtures come apart by PHYSICAL means — filtering, distilling, evaporating, a magnet, chromatography — because nothing is bonded. Compounds come apart only in a CHEMICAL reaction; splitting H₂O into H₂ and O₂ takes an electric current, not a hot plate.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Properties: new vs preserved',
      content:
        'Bonding into a compound produces NEW properties: sodium explodes in water and chlorine is a poison gas, yet NaCl is table salt. In a mixture every component keeps its own behavior — iron filings stirred into sand still jump to a magnet, dissolved salt still tastes salty.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Formula notation as a clue',
      content:
        'One chemical formula with no plus sign means the atoms are BONDED: H₂O is a single compound. A label with a plus sign, like a tank of H₂ + O₂, describes two elements sharing a space — a mixture. Subscripts bond; plus signs merely coexist.',
    },
  ],
  methods: [
    {
      title: 'Classify an unknown sample in four moves',
      when_to_use:
        'Any "is this an element, compound, homogeneous mixture, or heterogeneous mixture?" question.',
      steps: [
        'Ask whether the composition is FIXED (same everywhere, every sample) or adjustable. Fixed → pure substance branch; adjustable → mixture branch.',
        'Pure branch: count the kinds of atoms. One kind → ELEMENT. Two or more different elements in one formula with no plus sign → COMPOUND.',
        'Mixture branch: can you point at regions with different composition? Yes → HETEROGENEOUS. No visible boundaries → HOMOGENEOUS.',
        'Confirm with the separation test: if a physical method (boil, filter, magnet, distill) pulls the parts out, it was a mixture; if only a reaction does, it was a compound.',
      ],
      example: {
        problem:
          'Classify: (a) helium in a balloon, (b) table sugar C₁₂H₂₂O₁₁, (c) Italian dressing that settles into oil over vinegar, (d) brass melted from copper and zinc.',
        solution:
          '(a) one kind of atom → ELEMENT. (b) three elements locked at 12 C : 22 H : 1 O in one formula → COMPOUND. (c) two visible layers, poured apart physically → HETEROGENEOUS MIXTURE. (d) unbonded, recipe adjustable, but uniform with no boundaries → HOMOGENEOUS MIXTURE (an alloy is a solid solution).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Distinguish a homogeneous mixture from a compound',
      when_to_use:
        'When the sample looks uniform — a clear liquid or a single-colored solid — and appearance alone cannot decide it.',
      steps: [
        'Test the RATIO: can the sample be made with more or less of one component and still be the same thing? Variable → mixture. One fixed ratio in every sample → compound.',
        'Test the SEPARATION: try a physical method. Boiling salt water leaves dry salt behind (mixture); boiling water just makes steam that condenses back to water (compound).',
        'Test the PROPERTIES: do the components still behave like themselves? Dissolved salt still tastes salty and crystallizes back unchanged → nothing new was made → mixture.',
        'Only if all three point to fixed ratio, chemical-means-only separation, and new properties do you call it a compound.',
      ],
      example: {
        problem: 'A student claims salt water is a compound because it is one clear uniform liquid. Correct them.',
        solution:
          'Ratio varies (a pinch or enough to float an egg), boiling separates it physically, and the salt keeps its identity. Salt water is a HOMOGENEOUS MIXTURE — a solution of the compound NaCl in the compound H₂O. "Uniform" earns only the word homogeneous.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Uniform ≠ pure. Looking uniform earns the label HOMOGENEOUS and nothing more; purity requires a fixed ratio plus chemical bonds. Salt water and a compound look identical to the eye.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'O₂, N₂, H₂, Cl₂ are ELEMENTS, not compounds — two atoms of the SAME element bonded. Compound requires two or more DIFFERENT elements.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Air is the standard trap: 78 % N₂ / 21 % O₂ / 1 % Ar with percentages that drift by location, and it liquefies and distills apart physically. Homogeneous mixture, not a compound.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
    {
      content:
        'Alloys (brass, bronze, stainless steel) are homogeneous mixtures — solid solutions. Metals melted together are not bonded in a fixed ratio.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Separation is the tell: filter, distill, evaporate, or magnet → it was a mixture. Only an electric current or a reaction → it was a compound.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
