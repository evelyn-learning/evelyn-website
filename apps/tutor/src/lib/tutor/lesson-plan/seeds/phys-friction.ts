/**
 * HS Physics — Friction.
 * Static and kinetic friction. NGSS HS-PS2-1 application.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_FRICTION: LessonPlan = {
  id: 'evelyn.hs.science.physics.friction.v1',
  title: 'Friction',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-1', description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.', standard: 'NGSS.HS-PS2-1' }],
  prerequisites: ['hs.phys.newtons-third-law'], followUps: ['hs.phys.work-energy'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Friction is everywhere.', script: 'Without friction, you couldn\'t walk, drive, or hold a pencil. With too much friction, machines wear out and waste energy as heat. Engineers spend careers either reducing friction (lubricants) or increasing it (tire treads, brake pads). Both matter.', estimatedMinutes: 2 },
    { id: 'concept-types', kind: 'concept', goal: 'Static friction prevents motion. Kinetic friction opposes motion.', keyIdeas: [
      'FRICTION = force that opposes relative motion between two surfaces in contact.',
      'STATIC FRICTION: prevents an object from STARTING to move.',
      '  · Adjustable: equals applied force up to a maximum.',
      '  · f_s ≤ μ_s × N (where μ_s is the coefficient of static friction).',
      '  · When applied force exceeds f_s_max → object starts sliding.',
      'KINETIC FRICTION: opposes motion of a SLIDING object.',
      '  · f_k = μ_k × N (constant for a given pair of surfaces).',
      '  · Almost always μ_k < μ_s → easier to keep moving than to start.',
      'NORMAL FORCE (N): perpendicular force from surface (often = weight on flat ground).',
      'Friction does NOT depend on contact AREA (only on N and material).',
    ], vocabulary: [{ term: 'static friction', definition: 'force preventing motion (variable up to max).' }, { term: 'kinetic friction', definition: 'force opposing sliding motion (constant).' }, { term: 'coefficient of friction', definition: 'unitless number characterizing friction between surfaces (μ).' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-coefficients', kind: 'concept', goal: 'Coefficient of friction depends on materials.', keyIdeas: [
      'TYPICAL μ VALUES (kinetic):',
      '  · Rubber on dry concrete: ~0.7.',
      '  · Wood on wood: ~0.3.',
      '  · Steel on steel: ~0.4.',
      '  · Ice on ice: ~0.03 (very slippery!).',
      '  · Teflon on teflon: ~0.04.',
      'GROUND TIRES: μ_s > μ_k → why ABS brakes work (avoid skidding to keep static friction).',
      'INCLINE: friction acts along the surface, opposing motion.',
    ], estimatedMinutes: 3 },
    { id: 'worked-incline', kind: 'worked_example', problem: 'A 10 kg box sits on a flat floor. You push it horizontally with 30 N. The coefficient of kinetic friction is 0.2. (a) Does it move? (b) If yes, what is its acceleration? (g = 10 m/s²)', steps: [
      'NORMAL FORCE: floor pushes up, equal to weight. N = mg = 10 × 10 = 100 N.',
      'STATIC friction max: assume μ_s ≈ μ_k = 0.2 → f_s_max = μ_s × N = 0.2 × 100 = 20 N.',
      'Applied force = 30 N > 20 N → YES, it moves.',
      'Once moving, KINETIC friction: f_k = μ_k × N = 0.2 × 100 = 20 N.',
      'NET FORCE = 30 − 20 = 10 N forward.',
      'Acceleration: a = F/m = 10 / 10 = 1 m/s².',
    ], answer: 'Yes, it moves. a = 1 m/s². Kinetic friction reduces net force.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why does putting a heavier object on top of a sled make it harder to push, even though wheels still roll the same way?', expectedAnswer: 'Heavier object → larger NORMAL force from ground (N = total weight). Friction f = μN, so MORE friction. Doesn\'t matter that wheels are still wheels — the harder ground pushes up, the harder friction can resist motion. Why heavy trucks need more force to start moving (and stop).', responseFormat: 'free', hints: ['What does adding weight do to N?', 'How does N relate to friction?'], estimatedMinutes: 3 },
    { id: 'misconception-friction-area', kind: 'misconception_check', question: 'A friend says "wider tires give more friction because they touch the ground more." Right?', commonErrors: [{ answer: 'Yes — more area = more grip.', misconception: 'Linking friction to contact area.', correctsTo: 'Friction does NOT depend on contact area in the simple model. f = μN. Same μ, same weight, same friction — narrow or wide. Wider tires DO help in real life — but for OTHER reasons: heat dissipation, uneven pressure, deformation. The basic friction equation stays area-independent.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Static friction prevents motion (up to max).', 'Kinetic friction opposes sliding (constant).', 'f = μN; μ depends on materials.', 'Friction doesn\'t depend on contact area (in simple model).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
