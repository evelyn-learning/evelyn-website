/**
 * HS Physics — Newton's Second Law (F = ma).
 * NGSS HS-PS2-1: F = ma quantitative relationship.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_NEWTONS_SECOND_LAW: LessonPlan = {
  id: 'evelyn.hs.science.physics.newtons-second-law.v1',
  title: "Newton's Second Law (F = ma)",
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-1', description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.', standard: 'NGSS.HS-PS2-1' }],
  prerequisites: ['hs.phys.newtons-first-law'], followUps: ['hs.phys.newtons-third-law'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Quantify motion.', script: 'How hard do you push a 1000 kg car to accelerate it at 2 m/s²? Newton\'s 2nd Law gives the exact answer: 2000 newtons. F = ma is one of the most useful equations in physics — it predicts how anything will move under any force.', estimatedMinutes: 2 },
    { id: 'concept-equation', kind: 'concept', goal: 'F_net = m × a. Force and acceleration are vectors with the same direction.', keyIdeas: [
      'NEWTON\'S 2ND LAW: F_net = m × a.',
      '  · F_net = NET force (vector sum of all forces).',
      '  · m = mass (kg).',
      '  · a = acceleration (m/s²).',
      'UNITS: 1 NEWTON (N) = 1 kg·m/s². The force needed to accelerate 1 kg at 1 m/s².',
      'ACCELERATION points in the same direction as NET FORCE.',
      'BIGGER force → BIGGER acceleration (proportional).',
      'BIGGER mass → SMALLER acceleration for same force (inverse).',
      'WEIGHT is a force: W = mg (g = 9.8 m/s²). 1 kg weighs ~9.8 N on Earth.',
    ], vocabulary: [{ term: 'newton (N)', definition: 'unit of force = kg·m/s².' }, { term: 'free body diagram', definition: 'sketch showing all forces on an object.' }], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'concept-fbd', kind: 'concept', goal: 'Use FREE BODY DIAGRAMS to find net force.', keyIdeas: [
      'FREE BODY DIAGRAM (FBD): a sketch of an object as a dot, with arrows for ALL forces.',
      'COMMON FORCES:',
      '  · WEIGHT (W = mg): always down.',
      '  · NORMAL (N): perpendicular to surface, pushes up from surface.',
      '  · APPLIED (F): push or pull.',
      '  · FRICTION (f): opposes motion or attempted motion. Parallel to surface.',
      '  · TENSION (T): along ropes/cables.',
      'STEPS:',
      '  1. Draw the object as a dot.',
      '  2. Draw arrows for each force, starting at the dot.',
      '  3. Pick x and y axes (often horizontal/vertical, sometimes along an incline).',
      '  4. Sum forces in each direction.',
      '  5. Apply F_net = m·a in each direction.',
    ], estimatedMinutes: 4 },
    { id: 'worked-pushing', kind: 'worked_example', problem: 'You push a 50 kg crate across a floor with 200 N of force. Friction provides 50 N of resistance. What is the crate\'s acceleration?', steps: [
      'Identify forces (horizontal): applied = 200 N forward, friction = 50 N back.',
      'NET FORCE = 200 − 50 = 150 N forward.',
      'Apply F = ma → 150 = 50 × a.',
      'a = 150 / 50 = 3 m/s².',
      'The crate accelerates at 3 m/s² in the direction of the push.',
    ], answer: 'a = 3 m/s². Net force matters, not just applied force.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A 2 kg object is in free fall (only gravity acts on it, no air resistance). What is its acceleration? What net force acts on it?', expectedAnswer: 'Acceleration = g = 9.8 m/s² downward (same as any object in free fall regardless of mass). Net force = weight = m·g = 2 × 9.8 = 19.6 N downward. Note: a heavier object has more weight, but also more inertia → same acceleration. (Galileo\'s leaning tower experiment.)', responseFormat: 'free', hints: ['What\'s the only force? What is g?', 'F_net = m × a, both involve mass.'], estimatedMinutes: 3 },
    { id: 'misconception-heavy-falls-faster', kind: 'misconception_check', question: 'A friend says "a heavier object falls faster than a lighter one." Right?', commonErrors: [{ answer: 'Yes — heavier falls faster.', misconception: 'Confusing weight with falling speed.', correctsTo: 'In a vacuum, all objects fall at the same rate (g = 9.8 m/s²). Heavier object has MORE force (weight) but proportionally MORE mass — they cancel in F=ma. In real air, very LIGHT/large things (feather) DO fall slower because air resistance matters more relative to their weight. But in vacuum, even a feather and a hammer fall together (Apollo 15 demo).' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['F_net = m × a. Force in newtons.', 'Net force is the vector sum of all forces.', 'Free body diagrams: draw all forces as arrows.', 'Free fall: a = g = 9.8 m/s², regardless of mass.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
