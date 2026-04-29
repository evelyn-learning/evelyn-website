/**
 * HS Chemistry — Periodic Trends.
 * NGSS HS-PS1-1: predict element properties from periodic position.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_PERIODIC_TRENDS: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.periodic-trends.v1',
  title: 'Periodic Trends',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-1', description: 'Use the periodic table as a model to predict the relative properties of elements based on the patterns of electrons in the outermost energy level of atoms.', standard: 'NGSS.HS-PS1-1' }],
  prerequisites: ['hs.chem.electron-config'], followUps: ['hs.chem.ionic-bonding'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Why is the periodic table arranged this way?', script: 'Mendeleev arranged elements by mass in 1869 — and noticed properties REPEATED in patterns. Now we know why: electron configurations repeat. Position on the table predicts atom size, reactivity, and bond behavior. The table is a periodic property forecaster.', estimatedMinutes: 2 },
    { id: 'concept-trends', kind: 'concept', goal: 'Atomic radius, ionization energy, electronegativity follow predictable trends.', keyIdeas: [
      'ATOMIC RADIUS (size of atom):',
      '  · DOWN a group: INCREASES (more shells).',
      '  · ACROSS a period (left to right): DECREASES (more protons pull electrons in tighter, no new shells).',
      'IONIZATION ENERGY (energy to remove an electron):',
      '  · DOWN a group: DECREASES (outer electron farther → easier to remove).',
      '  · ACROSS a period: INCREASES (more proton pull → harder to remove).',
      'ELECTRONEGATIVITY (pull on shared electrons in a bond):',
      '  · DOWN a group: DECREASES.',
      '  · ACROSS a period: INCREASES.',
      '  · FLUORINE = highest electronegativity (4.0). Cesium ≈ lowest.',
      'METALLIC CHARACTER: opposite of electronegativity. Increases down + left.',
    ], vocabulary: [{ term: 'atomic radius', definition: 'distance from nucleus to outermost electron.' }, { term: 'ionization energy', definition: 'energy needed to remove an electron.' }, { term: 'electronegativity', definition: 'pull on shared bond electrons.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'concept-why', kind: 'concept', goal: 'Trends come from two forces: nuclear charge (+) pulling and shell shielding.', keyIdeas: [
      'EFFECTIVE NUCLEAR CHARGE (Z_eff): the "felt" pull of the nucleus on outer electrons.',
      'Z_eff = protons − inner-shell shielding electrons.',
      'ACROSS a period: more protons but same shell → Z_eff RISES → atoms shrink, harder to remove electrons.',
      'DOWN a group: extra shells = more shielding → Z_eff barely rises → outer electrons farther + loose.',
      'EXCEPTIONS exist (especially with d-block transition metals) but the broad trends hold.',
    ], estimatedMinutes: 4 },
    { id: 'worked-compare', kind: 'worked_example', problem: 'Compare lithium (Li) and fluorine (F): which has larger radius? Higher ionization energy? Higher electronegativity?', steps: [
      'Both are in PERIOD 2 (same row).',
      'Li is on the LEFT (Group 1, alkali metal). F is on the RIGHT (Group 17, halogen).',
      'ATOMIC RADIUS: Li > F (radius decreases left → right because Z_eff rises).',
      'IONIZATION ENERGY: Li (520 kJ/mol) << F (1681 kJ/mol). F holds onto electrons hard.',
      'ELECTRONEGATIVITY: Li (1.0) << F (4.0). F is the most electronegative element.',
      'Why: F has more protons in the same shell → tighter pull on electrons.',
    ], answer: 'Li bigger, lower IE, lower EN. F smaller, higher IE, highest EN. Same period, opposite ends → opposite trends.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Order these by INCREASING atomic radius: Na, Cs, Li, K. Explain.', expectedAnswer: 'Li < Na < K < Cs. All Group 1 (alkali metals). DOWN the group, more shells → bigger atoms. Li (n=2) → Na (n=3) → K (n=4) → Cs (n=6). Cs is the largest naturally-occurring atom.', responseFormat: 'free', hints: ['What group are these in?', 'How does atomic radius change down a group?'], estimatedMinutes: 3 },
    { id: 'misconception-noble-gases-no-EN', kind: 'misconception_check', question: 'A friend says "noble gases must have the highest electronegativity since they\'re on the right." Right?', commonErrors: [{ answer: 'Yes — they\'re rightmost.', misconception: 'Applying trend to noble gases.', correctsTo: 'NOBLE GASES already have FULL outer shells — they don\'t want more electrons (and don\'t form bonds in most cases). Electronegativity is "pull on bond electrons" — which is undefined or near-zero for non-bonders. The trend stops at Group 17 (halogens). Fluorine, not Neon, has the highest EN.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Atomic radius: bigger DOWN, smaller ACROSS.', 'Ionization energy: lower DOWN, higher ACROSS.', 'Electronegativity: lower DOWN, higher ACROSS. F is highest.', 'Trends from Z_eff: more protons + same shielding = tighter pull.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
