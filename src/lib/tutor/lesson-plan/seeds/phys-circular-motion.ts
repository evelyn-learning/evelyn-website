/**
 * HS Physics — Circular Motion.
 * Centripetal force and acceleration.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_CIRCULAR_MOTION: LessonPlan = {
  id: 'evelyn.hs.science.physics.circular-motion.v1',
  title: 'Circular Motion',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-1', description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.', standard: 'NGSS.HS-PS2-1' }],
  prerequisites: ['hs.phys.newtons-second-law'], followUps: ['hs.phys.gravitation'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in spinning motion.', script: 'A car turns a corner. The Moon orbits the Earth. A ball whirls on a string. All circular motion. The trick: even at constant speed, you\'re accelerating — because direction is changing. And anything accelerating needs a force.', estimatedMinutes: 2 },
    { id: 'concept-centripetal', kind: 'concept', goal: 'Circular motion requires a centripetal (center-pointing) force and acceleration.', keyIdeas: [
      'In CIRCULAR MOTION, an object\'s VELOCITY constantly changes DIRECTION — even if speed is constant.',
      'Changing velocity = ACCELERATION → there must be a FORCE.',
      'CENTRIPETAL ACCELERATION (a_c): always points toward CENTER of the circle.',
      '  · a_c = v² / r.',
      'CENTRIPETAL FORCE: F_c = m × a_c = m × v² / r. Toward the center.',
      'WHAT supplies F_c? Various things:',
      '  · Tension (ball on string).',
      '  · Friction (car turning).',
      '  · Gravity (planets/moons).',
      '  · Normal force (loop-the-loop).',
      'CENTRIPETAL force is NOT a new force — it\'s the NAME for whatever points toward center.',
    ], vocabulary: [{ term: 'centripetal', definition: 'pointing toward center.' }, { term: 'centripetal force', definition: 'net force keeping an object in circular motion.' }, { term: 'period', definition: 'time for one full revolution (T).' }], suggestedTools: ['show_diagram', 'show_equation'], estimatedMinutes: 5 },
    { id: 'concept-no-centrifugal', kind: 'concept', goal: 'There is no real "centrifugal" force — only the absence of one.', keyIdeas: [
      'When riding in a car turning left, you feel "thrown to the right" — like a force pushing you outward.',
      'NO real outward force exists. Your INERTIA wants you to go STRAIGHT.',
      'The car turns LEFT (centripetal force from wheels gripping road). The seat or door pushes YOU left to keep you in circular motion.',
      'You feel pushed against the seat — that\'s the seat pushing you toward the center.',
      'In a NON-INERTIAL (rotating) frame, the apparent outward force is called "centrifugal" — but it\'s a PSEUDO-force, not a real one.',
    ], estimatedMinutes: 3 },
    { id: 'worked-car-turn', kind: 'worked_example', problem: 'A 1000 kg car rounds a flat curve of radius 50 m at 20 m/s. What centripetal force is needed? Where does it come from?', steps: [
      'F_c = mv²/r = (1000)(20²)/50 = (1000)(400)/50 = 8000 N.',
      'Source: FRICTION between tires and road, pointing toward the center of the curve.',
      'If road is icy → friction can\'t supply 8000 N → car slides outward (in a STRAIGHT line, not "thrown out").',
    ], answer: 'F_c = 8000 N, supplied by friction. Lose the friction → lose the curve.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why does the Moon orbit Earth instead of flying off into space?', expectedAnswer: 'Earth\'s GRAVITY supplies the centripetal force. The Moon\'s sideways velocity would carry it off in a straight line; gravity constantly pulls it toward Earth, BENDING its path into a circle (actually an ellipse). Without gravity, no orbit. Without sideways motion, the Moon would fall straight in.', responseFormat: 'free', hints: ['What force always points toward Earth?', 'Combine sideways motion with center-pointing force.'], estimatedMinutes: 3 },
    { id: 'misconception-centrifugal', kind: 'misconception_check', question: 'A friend says "spinning a bucket of water creates a centrifugal force pushing the water outward." Right?', commonErrors: [{ answer: 'Yes — outward force.', misconception: 'Treating centrifugal as a real force.', correctsTo: 'There is NO outward force. The bucket pushes the water INWARD (centripetal). The water\'s INERTIA wants to fly off in a straight line. That gives the FEELING of being pushed out, but the only real force is the bucket pushing in. "Centrifugal" is a useful pseudo-force in rotating frames, but in normal physics, it isn\'t real.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Circular motion = constant direction change = acceleration.', 'a_c = v²/r, points toward center.', 'F_c = mv²/r, supplied by some real force (gravity, tension, friction).', '"Centrifugal" force isn\'t real — it\'s inertia.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
