/**
 * Grade 6 Science — Atoms and Elements.
 * NGSS MS-PS1-1: develop models to describe the atomic composition of
 * simple molecules and extended structures.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_ATOMS_ELEMENTS: LessonPlan = {
  id: 'evelyn.g6.science.matter.atoms-elements.v1',
  title: 'Atoms and Elements',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'matter', locale: 'en',
  los: [{ id: 'ngss.ms-ps1-1', description: 'Develop models to describe the atomic composition of simple molecules and extended structures.', standard: 'NGSS.MS-PS1-1' }],
  prerequisites: ['ngss.5-ps1-1'], followUps: ['ngss.hs-ps1-1'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday materials.', script: 'Look around. Wood, metal, water, air, your body — all made from a small set of basic building blocks called ELEMENTS. Just 92 natural ones combine in endless ways to make everything.', estimatedMinutes: 2 },
    { id: 'concept-atoms-and-elements', kind: 'concept', goal: 'Atoms are the smallest unit of matter that retains element identity. Elements are pure substances of one kind of atom.', keyIdeas: [
      'ATOM: the smallest piece of an element (like carbon) that\'s still that element.',
      'ELEMENT: a pure substance made of only ONE kind of atom (e.g., gold = only gold atoms).',
      'About 92 elements occur naturally; ~118 known total (some lab-made).',
      'Atoms have a NUCLEUS (center) and ELECTRONS (around it).',
      'In the nucleus: PROTONS (+) and NEUTRONS (no charge).',
      'Number of protons = the ELEMENT\'S IDENTITY (atomic number).',
      'PERIODIC TABLE organizes all elements by atomic number.',
    ], vocabulary: [{ term: 'atom', definition: 'smallest unit of an element.' }, { term: 'element', definition: 'pure substance of one kind of atom.' }, { term: 'molecule', definition: 'two or more atoms bonded together.' }, { term: 'compound', definition: 'a molecule made of TWO or more different elements.' }], estimatedMinutes: 5 },
    { id: 'concept-molecules-compounds', kind: 'concept', goal: 'Atoms combine to form molecules and compounds. Most matter we see is made of compounds.', keyIdeas: [
      'A MOLECULE is two or more atoms BONDED together.',
      'Some molecules are pure elements: O₂ (oxygen gas, 2 O atoms).',
      'A COMPOUND is a molecule of DIFFERENT elements: H₂O (2 H + 1 O).',
      'Compounds have NEW properties — totally different from the elements that made them.',
      '  · Water (H₂O) is a liquid you drink. Hydrogen is a flammable gas; oxygen is one too. Combined → safe drinkable liquid.',
      '  · Salt (NaCl) is edible. Sodium is a reactive metal that explodes in water; chlorine is a poisonous green gas.',
      'Chemical bonds hold atoms together — energy makes/breaks them.',
    ], estimatedMinutes: 4 },
    { id: 'worked-water', kind: 'worked_example', problem: 'Water is H₂O. Identify what each part of that formula means and what kind of substance water is.', steps: [
      'H = element hydrogen. ₂ subscript = TWO atoms of H.',
      'O = element oxygen. No subscript = ONE atom of O.',
      'H₂O means: 2 hydrogen atoms + 1 oxygen atom bonded together = ONE water molecule.',
      'Water has 2 different elements → it\'s a COMPOUND.',
      'It\'s also a MOLECULE (atoms bonded together).',
    ], answer: 'Water = 2 hydrogen + 1 oxygen, bonded → a compound (and a molecule).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'CO₂ — what does this formula tell you? Is it an element, molecule, or compound?', expectedAnswer: '1 carbon atom + 2 oxygen atoms bonded. It\'s a MOLECULE (atoms bonded) AND a COMPOUND (different elements).', responseFormat: 'free', hints: ['C is carbon. O is oxygen. Subscript 2 means 2 atoms.', 'Different elements bonded = compound.'], estimatedMinutes: 2 },
    { id: 'misconception-compound-mix', kind: 'misconception_check', question: 'A friend says "salt is just sodium and chlorine mixed together." Is salt the same as a mixture of those elements?', commonErrors: [{ answer: 'Yes — same as a mix.', misconception: 'Confusing chemical bond with simple mixing.', correctsTo: 'NO. Salt (NaCl) is a COMPOUND — Na and Cl atoms are CHEMICALLY BONDED. The properties are completely new (edible safe crystal). A simple mix would be deadly (sodium metal + chlorine gas separately). Bonds make compounds different from their elements.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Atoms = smallest unit of an element.', 'Elements = pure substances of one atom type.', 'Molecules = atoms bonded.', 'Compounds = molecules with multiple elements.', 'Compound properties differ from element properties.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
