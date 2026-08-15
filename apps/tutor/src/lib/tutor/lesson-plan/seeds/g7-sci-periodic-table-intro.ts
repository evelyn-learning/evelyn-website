/**
 * Grade 7 Science — Periodic Table Intro.
 * NGSS MS-PS1-1: model atomic composition.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_PERIODIC_TABLE_INTRO: LessonPlan = {
  id: 'evelyn.g7.science.chemistry.periodic-table-intro.v1',
  title: 'The Periodic Table',
  curriculum: 'NGSS', grade: '7', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.ms-ps1-1', description: 'Develop models to describe the atomic composition of simple molecules and extended structures.', standard: 'NGSS.MS-PS1-1' }],
  prerequisites: ['ngss.ms-ps1-1'], followUps: ['ngss.hs-ps1-1'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor the periodic table as a map.', script: 'The periodic table looks intimidating — 118 squares of letters and numbers. But it\'s actually a MAP. Once you know how to read it, you can predict how any element will behave.', estimatedMinutes: 2 },
    { id: 'concept-organization', kind: 'concept', goal: 'Periodic table is organized by atomic number (proton count). Rows = periods. Columns = groups (similar properties).', keyIdeas: [
      'Each square = one element. Symbol (e.g., He), name (Helium), atomic number (2), atomic mass (4).',
      'ATOMIC NUMBER = number of protons. Defines the element.',
      'Elements arranged by INCREASING atomic number.',
      'ROWS (PERIODS): 1-7. As you go right, properties change gradually.',
      'COLUMNS (GROUPS / FAMILIES): 1-18. Elements in the SAME column have SIMILAR chemical properties.',
      'Key groups: Group 1 (alkali metals — very reactive), Group 17 (halogens — also reactive), Group 18 (noble gases — almost never react).',
      'METALS on the left/middle. NONMETALS on the upper right. Metalloids on the staircase between.',
    ], vocabulary: [{ term: 'period', definition: 'a row in the periodic table.' }, { term: 'group', definition: 'a column in the periodic table.' }, { term: 'noble gas', definition: 'group 18; almost never reacts (helium, neon, argon).' }], estimatedMinutes: 5 },
    { id: 'concept-properties-by-position', kind: 'concept', goal: 'Position predicts properties. Same column = similar reactions. Same row = gradual change.', keyIdeas: [
      'Group 1 (Li, Na, K, Rb, Cs): all metals, all react explosively with water, all form +1 ions.',
      'Group 18 (He, Ne, Ar, Kr, Xe, Rn): all gases, all chemically unreactive — they\'re stable on their own.',
      'Group 17 (F, Cl, Br, I): all halogens, all react with metals to form salts (NaCl, KF, etc.).',
      'Knowing one element\'s behavior lets you predict its column-mates.',
    ], estimatedMinutes: 4 },
    { id: 'worked-sodium-vs-cesium', kind: 'worked_example', problem: 'Sodium (Na) and cesium (Cs) are both Group 1 metals. Sodium reacts vigorously with water. Predict cesium\'s reaction.', steps: [
      'Sodium and cesium are in the SAME GROUP (Group 1).',
      'Same group → similar properties.',
      'Cesium will also react with water — and likely even more vigorously (reactivity increases going DOWN Group 1).',
      'Indeed: cesium reacts EXPLOSIVELY with water — much more violent than sodium.',
    ], answer: 'Cesium reacts with water — even more violently than sodium does.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Helium is a noble gas (Group 18) and almost never reacts. What can you predict about argon (Ar), also in Group 18?', expectedAnswer: 'Argon should also be very unreactive — it\'s also a noble gas. (And it is — argon is used in light bulbs precisely because it doesn\'t react with anything.)', responseFormat: 'free', hints: ['Same group = similar chemistry.', 'Group 18 = noble gases.'], estimatedMinutes: 2 },
    { id: 'misconception-table-arbitrary', kind: 'misconception_check', question: 'A friend says "the periodic table\'s arrangement is arbitrary — they could have ordered it any way." Right?', commonErrors: [{ answer: 'Yes — arbitrary.', misconception: 'Underestimating the table\'s deep structure.', correctsTo: 'The arrangement reflects ATOMIC STRUCTURE — specifically, electron configuration. Elements in the same group have similar OUTER electron arrangements, which determines chemistry. Mendeleev predicted unknown elements based on gaps in the table; his predictions held — strong evidence the structure is REAL, not arbitrary.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Periodic table = map of all elements.', 'Rows = periods. Columns = groups (similar chemistry).', 'Group 1 = reactive metals; Group 18 = noble gases.', 'Position predicts behavior.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
