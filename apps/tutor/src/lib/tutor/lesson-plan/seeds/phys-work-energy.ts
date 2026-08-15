/**
 * HS Physics — Work and Energy.
 * NGSS HS-PS3-1: energy transfer calculations.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_WORK_ENERGY: LessonPlan = {
  id: 'evelyn.hs.science.physics.work-energy.v1',
  title: 'Work and Energy',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps3-1', description: 'Create a computational model to calculate the change in the energy of one component in a system when the change in energy of the other component(s) and energy flows in and out of the system are known.', standard: 'NGSS.HS-PS3-1' }],
  prerequisites: ['hs.phys.friction'], followUps: ['hs.phys.conservation-energy'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday energy.', script: 'Lift a book onto a shelf — that took ENERGY. The book now has GRAVITATIONAL POTENTIAL ENERGY. Drop it — it converts to KINETIC ENERGY (speed). Energy is the currency of the universe. Work is how it gets transferred.', estimatedMinutes: 2 },
    { id: 'concept-work', kind: 'concept', goal: 'Work = force × displacement (in the direction of force).', keyIdeas: [
      'WORK (W) = F × d × cos(θ).',
      '  · F = applied force (N).',
      '  · d = displacement (m).',
      '  · θ = angle between F and d.',
      'UNITS: 1 JOULE (J) = 1 N × 1 m.',
      'EXAMPLES:',
      '  · Push box 5 m with 10 N (in direction of motion): W = 10 × 5 = 50 J.',
      '  · Carry box across a room (force is UP, motion is HORIZONTAL): cos(90°) = 0 → W = 0 J! No work done on the box (you do work on yourself, though).',
      'NEGATIVE WORK: force opposes motion (friction does negative work on a sliding object).',
      'NO MOTION → no work, even if you\'re straining (pushing against a wall).',
    ], vocabulary: [{ term: 'work', definition: 'energy transferred by a force over a distance (W = Fd cos θ).' }, { term: 'joule', definition: 'unit of energy (1 N·m).' }, { term: 'kinetic energy', definition: 'energy of motion (KE = ½mv²).' }, { term: 'potential energy', definition: 'stored energy due to position.' }], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'concept-energy-types', kind: 'concept', goal: 'Kinetic and potential energy. Work-Energy Theorem connects them.', keyIdeas: [
      'KINETIC ENERGY (KE): energy of motion. KE = ½mv².',
      '  · Doubling SPEED → 4x kinetic energy.',
      '  · Doubling MASS → 2x kinetic energy.',
      'GRAVITATIONAL POTENTIAL ENERGY (PE): energy from height. PE = mgh.',
      '  · Higher = more PE. Reference point is arbitrary.',
      'OTHER POTENTIAL: spring (½kx²), chemical, electrical, etc.',
      'WORK-ENERGY THEOREM: W_net = ΔKE.',
      '  · Net work done on object = change in its kinetic energy.',
      'Work transfers energy between forms.',
    ], estimatedMinutes: 4 },
    { id: 'worked-lift-drop', kind: 'worked_example', problem: 'You lift a 2 kg book 1.5 m onto a shelf, then drop it. (a) How much work did you do lifting it? (b) How fast is it moving just before hitting the ground? (g = 10 m/s²)', steps: [
      '(a) WORK to lift: W = F × d. Force = weight = mg = 2 × 10 = 20 N. d = 1.5 m.',
      '  · W = 20 × 1.5 = 30 J. (You added 30 J of gravitational PE to the book.)',
      '(b) When dropped, PE → KE.',
      '  · Initial PE = mgh = 2 × 10 × 1.5 = 30 J.',
      '  · Just before landing, KE = 30 J (energy conserved).',
      '  · ½mv² = 30 → v² = 60/2 = 30 → v ≈ 5.5 m/s.',
    ], answer: '(a) 30 J of work to lift. (b) ~5.5 m/s on impact. Energy is converted, not created.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'How much KINETIC ENERGY does a 1500 kg car have at 20 m/s? At 40 m/s?', expectedAnswer: 'At 20 m/s: KE = ½ × 1500 × 20² = ½ × 1500 × 400 = 300,000 J = 300 kJ. At 40 m/s: KE = ½ × 1500 × 40² = ½ × 1500 × 1600 = 1,200,000 J = 1200 kJ. Doubling speed → 4x energy. That\'s why high-speed crashes are far more destructive.', responseFormat: 'numeric', hints: ['KE = ½mv². v² is what changes.', 'Note the v² scaling.'], estimatedMinutes: 3 },
    { id: 'misconception-holding-work', kind: 'misconception_check', question: 'A friend holds a heavy bag for 5 minutes and says "I\'m doing a lot of work!" Are they (in physics terms)?', commonErrors: [{ answer: 'Yes — they\'re tired.', misconception: 'Equating physical exertion with physics-work.', correctsTo: 'In physics, WORK requires DISPLACEMENT in the direction of force. Holding a bag stationary = no displacement = NO WORK done on the bag. Your muscles tire because they constantly contract (use chemical energy) to maintain force — but that\'s biology, not physics-work. A table holding the bag does no work either.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Work = Fd cos θ. No motion = no work.', 'KE = ½mv². Doubling speed = 4x energy.', 'PE = mgh (for gravity).', 'Work-Energy Theorem: W_net = ΔKE.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
