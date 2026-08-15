/**
 * College Organic Chemistry — SN1, SN2, E1, E2 Mechanisms.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_ORGCHEM_MECHANISMS: LessonPlan = {
  id: 'evelyn.college.sci.orgchem.mechanisms.v1',
  title: 'Organic Chemistry — SN1, SN2, E1, E2 Mechanisms',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'organic-chemistry',
  locale: 'en',
  los: [
    {
      id: 'college.sci.orgchem.mechanisms',
      description: 'Distinguish SN1, SN2, E1, E2 mechanisms by substrate, nucleophile/base, leaving group, and solvent; predict the dominant pathway.',
      standard: 'COLLEGE-ORGCHEM',
    },
  ],
  prerequisites: ['college.sci.orgchem.functional-groups'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'SN/E mechanisms are the most-tested topic in sophomore orgo — and the decision tree is finite.',
      script: 'When a leaving group leaves, two things can happen: a NUCLEOPHILE substitutes (SN1 or SN2), or a BASE eliminates a hydrogen to form an alkene (E1 or E2). Which one wins depends on substrate, nucleophile/base strength, leaving group, and solvent. Learn the decision rules and you handle every variation.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mechanisms',
      kind: 'concept',
      goal: 'Compare the four mechanisms across substrate, nucleophile/base, kinetics, stereochemistry, solvent.',
      keyIdeas: [
        'SN2: one-step, BIMOLECULAR. Nucleophile attacks from BACK side as leaving group leaves. INVERSION of stereochemistry. Rate = k[substrate][Nu].',
        '  Best with PRIMARY substrate (uncrowded), STRONG nucleophile, POLAR APROTIC solvent (DMSO, acetone).',
        'SN1: two-step, UNIMOLECULAR. Leaving group leaves first → carbocation; nucleophile attacks the planar carbocation from EITHER face → RACEMIZATION. Rate = k[substrate].',
        '  Best with TERTIARY substrate (stable cation), WEAK nucleophile, POLAR PROTIC solvent (water, alcohols).',
        'E2: one-step, BIMOLECULAR. Base removes β-hydrogen as leaving group leaves. Anti-periplanar geometry. Forms alkene.',
        '  Best with STRONG, BULKY BASE (e.g. tert-butoxide), with primary or secondary substrates often.',
        'E1: two-step, UNIMOLECULAR. Leaving group leaves → carbocation; base removes β-hydrogen.',
        '  Best with TERTIARY substrate, WEAK base, polar protic solvent. Often competes with SN1.',
        'DECISION TREE:',
        '  PRIMARY substrate + strong nucleophile / weak base → SN2.',
        '  PRIMARY + strong, BULKY base → E2.',
        '  TERTIARY + weak nucleophile/base → SN1/E1 mixture.',
        '  TERTIARY + strong base → E2.',
        '  SECONDARY: depends heavily on conditions. Strong Nu/weak base → SN2. Strong base → E2.',
        'ZAITSEV vs HOFMANN: in elimination, Zaitsev (more substituted alkene) is usually favoured. Hofmann (less substituted) wins with bulky bases like tert-butoxide.',
      ],
      vocabulary: [
        { term: 'leaving group', definition: 'an atom or group that departs with a pair of electrons; good leaving groups are weak bases (I⁻ > Br⁻ > Cl⁻ > F⁻).' },
        { term: 'anti-periplanar', definition: 'the geometry in E2 where the leaving group and β-hydrogen are 180° apart for orbital alignment.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Predict the mechanism and major product: 2-bromo-2-methylpropane (tert-butyl bromide) + methanol.',
      steps: [
        'Substrate: TERTIARY (Br on tertiary C with three CH₃ groups).',
        'Nucleophile: methanol (weak nucleophile, polar protic solvent).',
        'Tertiary + weak Nu/base + polar protic ⟹ SN1 / E1 favored.',
        'Solvent (MeOH) is also the nucleophile (solvolysis). Carbocation forms first, then methanol attacks → tert-butyl methyl ether (SN1 product).',
        'E1 also competes: methanol can deprotonate the carbocation\'s β-hydrogen → 2-methylpropene (alkene).',
        'At room temperature with methanol, SN1 substitution typically dominates. Heat favours E1 elimination.',
      ],
      answer: 'SN1 dominant: tert-butyl methyl ether (with E1 alkene as minor product).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A primary alkyl halide is reacted with NaOEt (strong base) in ethanol. What mechanism dominates and why?',
      expectedAnswer: 'Primary substrate + strong base → SN2 OR E2 possible. Ethoxide (NaOEt) is a STRONG NUCLEOPHILE (small, not bulky), so SN2 is fastest. Product: substitution (ether). If the base were bulky like tert-butoxide, E2 would dominate even on primary substrates.',
      responseFormat: 'free',
      hints: [
        'Primary + strong nu/base usually goes which way?',
        'Is ethoxide bulky?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-strong-base-sn2',
      kind: 'misconception_check',
      question: 'A student says "strong base always does E2." Is this correct?',
      commonErrors: [
        {
          answer: 'Strong base = E2 always',
          misconception: 'Conflating "strong base" with "elimination only."',
          correctsTo: 'NOT always. Strong NUCLEOPHILES that aren\'t bulky (like ethoxide, hydroxide on primary substrates) do SN2 first. The decision depends on (1) BULKINESS of the base — bulky bases (tert-butoxide, LDA) prefer E2 because they can\'t fit for backside attack; (2) substrate degree — tertiary blocks SN2 entirely, forcing SN1/E1 or E2. The right rubric: SUBSTRATE × NUCLEOPHILE/BASE properties × SOLVENT, not any single factor in isolation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SN2: backside attack, primary substrates, strong Nu, polar aprotic.',
        'SN1: carbocation intermediate, tertiary substrates, weak Nu, polar protic.',
        'E2: bulky strong base, anti-periplanar, primary or secondary.',
        'E1: tertiary, weak base, often competes with SN1.',
        'Zaitsev usually wins; Hofmann with bulky bases.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
