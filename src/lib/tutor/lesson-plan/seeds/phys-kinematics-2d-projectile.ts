/**
 * HS Physics — 2D Kinematics and Projectile Motion.
 * NGSS HS-PS2-1: predict motion using forces and kinematics.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_KINEMATICS_2D_PROJECTILE: LessonPlan = {
  id: 'evelyn.hs.science.physics.kinematics-2d-projectile.v1',
  title: '2D Kinematics: Projectile Motion',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-1', description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.', standard: 'NGSS.HS-PS2-1' }],
  prerequisites: ['hs.phys.kinematics-1d'], followUps: ['hs.phys.newtons-first-law'], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in projectile reality.', script: 'A baseball, a thrown football, a missile, a kicked soccer ball. Once they leave your hand or foot, gravity takes over. They all follow the same curved path: a PARABOLA. Same physics, regardless of object.', estimatedMinutes: 2 },
    { id: 'concept-independence', kind: 'concept', goal: 'Horizontal and vertical motion are INDEPENDENT.', keyIdeas: [
      'Once airborne (ignoring air resistance), only GRAVITY acts on a projectile.',
      'KEY INSIGHT: split motion into HORIZONTAL (x) and VERTICAL (y) — they don\'t affect each other.',
      'HORIZONTAL: no force → CONSTANT velocity. v_x = v_x0. x = v_x0 × t.',
      'VERTICAL: gravity (g = 9.8 m/s² down). v_y = v_y0 − g·t. y = v_y0·t − ½g·t².',
      'TIME is shared between x and y components.',
      'SHAPE of path: parabola.',
    ], vocabulary: [{ term: 'projectile', definition: 'object in flight under gravity only.' }, { term: 'trajectory', definition: 'path of a moving object.' }, { term: 'range', definition: 'horizontal distance traveled by projectile.' }], suggestedTools: ['show_diagram', 'show_equation'], estimatedMinutes: 5 },
    { id: 'concept-launch-angle', kind: 'concept', goal: 'Launch angle determines range. Components from sine/cosine.', keyIdeas: [
      'For a projectile launched at angle θ with speed v₀:',
      '  · v_x0 = v₀ × cos(θ).',
      '  · v_y0 = v₀ × sin(θ).',
      'TIME OF FLIGHT (returns to same height): t = 2v_y0 / g.',
      'MAX HEIGHT: H = v_y0² / (2g).',
      'RANGE (level ground): R = v₀² × sin(2θ) / g.',
      'MAX RANGE happens at θ = 45° (sin(2×45°) = sin(90°) = 1).',
      'Same range for complementary angles (e.g., 30° and 60°).',
    ], estimatedMinutes: 4 },
    { id: 'worked-cliff', kind: 'worked_example', problem: 'A cannonball is fired horizontally at 50 m/s from a 80 m cliff. How far does it land from the base? (g = 10 m/s²)', steps: [
      'SPLIT: horizontal (x) and vertical (y).',
      'VERTICAL: starts with v_y0 = 0. Falls 80 m.',
      '  · 80 = ½ × 10 × t² → t² = 16 → t = 4 s.',
      'HORIZONTAL: v_x = 50 m/s constant.',
      '  · x = 50 × 4 = 200 m.',
    ], answer: '200 m. Time set by vertical fall (4 s), horizontal distance = horizontal speed × time.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A soccer ball is kicked at 20 m/s at 30° above horizontal. What is the maximum height? (g = 10 m/s²)', expectedAnswer: 'v_y0 = 20 × sin(30°) = 20 × 0.5 = 10 m/s. H = v_y0² / (2g) = 100 / 20 = 5 m. Maximum height is 5 m.', responseFormat: 'numeric', hints: ['Get v_y0 from sin(30°).', 'Use H = v_y0² / (2g).'], estimatedMinutes: 3 },
    { id: 'misconception-fall-faster', kind: 'misconception_check', question: 'A ball thrown horizontally and a ball dropped from the same height — which hits the ground first?', commonErrors: [{ answer: 'The dropped one (it has nothing slowing it).', misconception: 'Thinking horizontal motion delays vertical fall.', correctsTo: 'They hit AT THE SAME TIME. Horizontal and vertical motion are INDEPENDENT. Both have v_y0 = 0 vertically; gravity pulls both down at g; same fall time. The horizontally-thrown ball just lands FARTHER. (Famous Mythbusters demo.)' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Horizontal and vertical motion are independent.', 'Horizontal: constant velocity. Vertical: free fall.', 'Range maximum at 45° launch angle.', 'Same fall time regardless of horizontal velocity.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
