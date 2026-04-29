/**
 * Grade 6 Science — Density and Buoyancy.
 * Conceptual + computational density (mass/volume) and Archimedes'
 * buoyancy at the middle-school level.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_DENSITY_BUOYANCY: LessonPlan = {
  id: 'evelyn.g6.science.physics.density-buoyancy.v1',
  title: 'Density and Buoyancy: Why Things Float',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'matter', locale: 'en',
  los: [{ id: 'ngss.ms-ps1-2', description: 'Analyze and interpret data on the properties of substances before and after the substances interact to determine if a chemical reaction has occurred.', standard: 'NGSS.MS-PS1-2' }],
  prerequisites: ['ngss.5-ps1-3'], followUps: ['ngss.hs-ps2-1'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in a paradox.', script: 'A steel bar SINKS in water. But a steel SHIP — made of much MORE steel — FLOATS. Why?', estimatedMinutes: 1 },
    { id: 'concept-density', kind: 'concept', goal: 'Density is mass per volume. Things less dense than water float; denser than water sink.', keyIdeas: [
      'DENSITY = mass ÷ volume. Units: g/cm³ or kg/m³.',
      'A small object can be DENSE (lead ball: heavy for its size).',
      'A big object can be LIGHT for its size (foam pillow: low density).',
      'Water density ≈ 1 g/cm³.',
      'Float rule: density LESS than the fluid → floats. MORE → sinks.',
    ], vocabulary: [{ term: 'density', definition: 'mass per unit volume.' }, { term: 'volume', definition: 'how much space something takes up.' }], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'concept-buoyancy', kind: 'concept', goal: 'Floating things experience an upward BUOYANT force. Archimedes: buoyant force = weight of fluid displaced.', keyIdeas: [
      'When you push something INTO water, it pushes the water OUT of the way (DISPLACES it).',
      'The water pushes BACK on the object — that\'s the BUOYANT FORCE (upward).',
      'ARCHIMEDES\' PRINCIPLE: buoyant force = weight of fluid displaced.',
      'If buoyant force ≥ object\'s weight → it FLOATS.',
      'If buoyant force < weight → it SINKS.',
      'A steel SHIP works because its hollow shape DISPLACES a huge volume of water. The buoyant force from all that displaced water > the ship\'s weight.',
    ], estimatedMinutes: 4 },
    { id: 'worked-density-of-rock', kind: 'worked_example', problem: 'A rock has mass 50g. You drop it into a graduated cylinder of water — the water level rises by 20 mL. What is the rock\'s density? Will it sink?', steps: [
      'Volume rise = volume of rock = 20 mL = 20 cm³.',
      'Density = mass / volume = 50g / 20cm³ = 2.5 g/cm³.',
      'Water density = 1 g/cm³. Rock = 2.5 g/cm³ > 1.',
      'Rock SINKS.',
    ], answer: 'Density = 2.5 g/cm³. Sinks (denser than water).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A piece of foam has mass 10g and volume 100 cm³. Will it float in water?', expectedAnswer: 'Density = 10/100 = 0.1 g/cm³. Less than 1 g/cm³ (water) → FLOATS.', responseFormat: 'free', hints: ['Use density = mass / volume.', 'Compare to water\'s 1 g/cm³.'], estimatedMinutes: 3 },
    { id: 'misconception-heavy-sinks', kind: 'misconception_check', question: 'A friend says "heavy things sink and light things float — that\'s the rule." Is that always right?', commonErrors: [{ answer: 'Yes — heavy sinks.', misconception: 'Confusing weight with density.', correctsTo: 'A heavy SHIP floats but a small marble sinks. It\'s DENSITY (mass per volume) that decides — not just weight. A 100,000 ton aircraft carrier floats because its hollow design has low overall density.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Density = mass / volume.', 'Less dense than the fluid → floats.', 'Buoyant force = weight of fluid displaced.', 'Ships float because their shape displaces a lot of water.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
