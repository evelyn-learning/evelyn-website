/**
 * AP Chemistry — Thermodynamics: enthalpy, entropy, Gibbs free
 * energy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CHEM_THERMODYNAMICS: LessonPlan = {
  id: 'evelyn.ap.chem.thermodynamics.v1',
  title: 'Thermodynamics: enthalpy, entropy, Gibbs free energy',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'apchem.thermo',
      description: 'Apply ΔH, ΔS, and ΔG to predict the spontaneity of chemical reactions.',
      standard: 'AP-CHEM-ENE-3',
    },
  ],
  prerequisites: ['apchem.kinetics-rate'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why doesn\'t iron just turn back into iron ore?',
      script: 'Why does iron rust but rust never spontaneously becomes iron? Why does gunpowder explode forward, never reassemble? Thermodynamics tells us which direction reactions WANT to go — and gives us one master equation: ΔG = ΔH − TΔS.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-quantities',
      kind: 'concept',
      goal: 'Enthalpy, entropy, Gibbs free energy + spontaneity.',
      keyIdeas: [
        'ENTHALPY (ΔH): heat released or absorbed at constant pressure. NEGATIVE = exothermic (releases heat). POSITIVE = endothermic (absorbs heat).',
        'ENTROPY (ΔS): change in disorder. POSITIVE = system becomes more disordered. Generally: solid → liquid → gas all increase entropy. Mixing increases entropy.',
        'GIBBS FREE ENERGY (ΔG): predicts SPONTANEITY at constant T and P. ΔG = ΔH − TΔS.',
        '  ΔG < 0: SPONTANEOUS (proceeds forward without input).',
        '  ΔG > 0: NON-SPONTANEOUS (needs input to proceed; reverse is spontaneous).',
        '  ΔG = 0: at EQUILIBRIUM.',
        'TWO PROPERTIES driving favorable reactions:',
        '  EXOTHERMIC (negative ΔH): favored.',
        '  Increasing entropy (positive ΔS): favored.',
        'WHEN TEMPERATURE MATTERS: at LOW T, ΔH dominates. At HIGH T, ΔS dominates.',
        '  ΔH < 0, ΔS > 0: spontaneous at all T. Combustion.',
        '  ΔH > 0, ΔS < 0: non-spontaneous at all T.',
        '  ΔH < 0, ΔS < 0: spontaneous at LOW T (e.g., freezing).',
        '  ΔH > 0, ΔS > 0: spontaneous at HIGH T (e.g., melting).',
        'STANDARD CONDITIONS: ΔG° refers to standard state (1 atm, 1 M, 25°C).',
      ],
      vocabulary: [
        { term: 'enthalpy', definition: 'heat content of a system; ΔH is heat exchanged at constant pressure.' },
        { term: 'entropy', definition: 'a measure of disorder.' },
        { term: 'Gibbs free energy', definition: 'a thermodynamic quantity (ΔG = ΔH − TΔS) that predicts spontaneity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-melting',
      kind: 'worked_example',
      problem: 'For melting ice (H₂O solid → liquid), is ΔH positive or negative? ΔS positive or negative? At what temperature is melting spontaneous?',
      steps: [
        'ΔH: melting ABSORBS heat → ΔH > 0 (endothermic).',
        'ΔS: solid → liquid INCREASES disorder → ΔS > 0.',
        'ΔG = ΔH − TΔS. Both positive — depends on T.',
        'At LOW T (T·ΔS small): ΔG > 0 → non-spontaneous. Ice stays solid.',
        'At HIGH T (T·ΔS large): ΔG < 0 → spontaneous. Ice melts.',
        'Crossover at T = ΔH/ΔS = 0°C for water.',
      ],
      answer: 'ΔH > 0, ΔS > 0; spontaneous above 0°C',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Combustion of methane has ΔH < 0 and ΔS > 0. Is it spontaneous at all temperatures?',
      expectedAnswer: 'yes — both terms favor spontaneity',
      responseFormat: 'free',
      hints: [
        'ΔG = ΔH − TΔS. ΔH < 0 (favorable). −TΔS < 0 since ΔS > 0 (favorable).',
        'Both terms negative → ΔG always < 0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-spontaneous-fast',
      kind: 'misconception_check',
      question: 'Does "spontaneous" mean "fast" in chemistry?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating spontaneous with fast.',
          correctsTo: 'No — SPONTANEOUS means "happens without external input" (ΔG < 0). It says nothing about RATE. Diamond → graphite is spontaneous but takes millions of years. Rate is governed by ACTIVATION ENERGY (kinetics), not spontaneity (thermodynamics). They\'re different questions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'ΔG = ΔH − TΔS.',
        'ΔG < 0: spontaneous. ΔG > 0: needs input. ΔG = 0: equilibrium.',
        'Exothermic + increasing entropy = always spontaneous.',
        'T determines which term dominates when ΔH and ΔS have same sign.',
        'Spontaneous ≠ fast. Kinetics is separate.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is photosynthesis (CO₂ + H₂O → glucose + O₂) thermodynamically possible despite being non-spontaneous?',
      hint: 'Photosynthesis has ΔG > 0 — won\'t happen on its own. But sunlight INPUTS energy, driving the reaction in reverse of its thermodynamic preference. Cells couple unfavorable reactions to ATP hydrolysis to do the same.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
