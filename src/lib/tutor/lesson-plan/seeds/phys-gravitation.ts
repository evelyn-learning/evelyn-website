/**
 * HS Physics — Universal Gravitation.
 * NGSS HS-PS2-4: Newton's law of gravitation, planetary motion.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_GRAVITATION: LessonPlan = {
  id: 'evelyn.hs.science.physics.gravitation.v1',
  title: 'Universal Gravitation',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-4', description: 'Use mathematical representations of Newton\'s Law of Gravitation and Coulomb\'s Law to describe and predict the gravitational and electrostatic forces between objects.', standard: 'NGSS.HS-PS2-4' }],
  prerequisites: ['hs.phys.circular-motion'], followUps: ['hs.phys.simple-harmonic-motion'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in Newton\'s insight.', script: 'Newton looked at an apple falling and a Moon orbiting and asked: are these the SAME force? Yes. The force pulling the apple is the same one keeping the Moon in orbit. UNIVERSAL gravitation — between every pair of masses in the universe.', estimatedMinutes: 2 },
    { id: 'concept-law', kind: 'concept', goal: 'F = G m₁m₂ / r². Inverse square law.', keyIdeas: [
      'NEWTON\'S LAW OF UNIVERSAL GRAVITATION:',
      '  · F = G × m₁ × m₂ / r².',
      '  · G = 6.67 × 10⁻¹¹ N·m²/kg² (gravitational constant — extremely small).',
      'INVERSE SQUARE: doubling distance → 1/4 the force. Tripling → 1/9.',
      'Force always ATTRACTIVE, always between centers of mass.',
      'EXPLAINS:',
      '  · Why apples fall.',
      '  · Why Moon orbits Earth.',
      '  · Why planets orbit Sun.',
      '  · Why galaxies hold together.',
      'g (Earth\'s surface gravity) = G × M_Earth / R_Earth² ≈ 9.8 m/s². Same g for any object — heavy or light.',
    ], vocabulary: [{ term: 'gravitational constant (G)', definition: '6.67×10⁻¹¹ N·m²/kg².' }, { term: 'inverse square law', definition: 'F decreases as 1/r².' }], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'concept-orbits', kind: 'concept', goal: 'Orbits arise when gravity provides the centripetal force.', keyIdeas: [
      'For an object in CIRCULAR ORBIT around a planet:',
      '  · Gravity = centripetal force.',
      '  · GMm/r² = mv²/r → v² = GM/r.',
      '  · Smaller orbital radius → faster speed (closer satellites are faster).',
      'KEPLER\'S 3RD LAW: T² ∝ r³ (period squared proportional to radius cubed).',
      'GEOSTATIONARY orbit: T = 24 hours → matches Earth\'s rotation. r ≈ 42,000 km.',
      'ESCAPE VELOCITY: minimum speed to leave a planet\'s gravity.',
      '  · v_escape = sqrt(2GM/r). Earth: ~11.2 km/s.',
    ], estimatedMinutes: 4 },
    { id: 'worked-iss', kind: 'worked_example', problem: 'The ISS orbits at 400 km above Earth. Earth radius = 6371 km, M_Earth = 5.97×10²⁴ kg. Estimate ISS orbital speed.', steps: [
      'r (from center) = 6371 + 400 = 6771 km = 6.771×10⁶ m.',
      'v² = GM/r = (6.67×10⁻¹¹)(5.97×10²⁴) / (6.771×10⁶).',
      'Numerator: 6.67×10⁻¹¹ × 5.97×10²⁴ ≈ 3.98×10¹⁴.',
      'v² ≈ 3.98×10¹⁴ / 6.771×10⁶ ≈ 5.88×10⁷.',
      'v ≈ √5.88×10⁷ ≈ 7670 m/s ≈ 7.67 km/s.',
      'Matches reality (~7.66 km/s) — orbit complete in ~90 minutes.',
    ], answer: 'v ≈ 7.67 km/s. Even at 400 km altitude, gravity is still ~89% of surface gravity. The ISS doesn\'t fall because it\'s moving sideways fast.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'If the distance between two objects doubles, how does the gravitational force between them change?', expectedAnswer: 'Inverse square: F ∝ 1/r². If r doubles → r² quadruples → F is 1/4 of original. Same masses, but distance squared in the denominator. (This is why gravity weakens fast with distance — important for understanding orbits and tides.)', responseFormat: 'numeric', hints: ['What\'s the relationship between F and r?', 'It\'s a square in the denominator.'], estimatedMinutes: 3 },
    { id: 'misconception-no-gravity-orbit', kind: 'misconception_check', question: 'A friend says "astronauts in orbit are weightless because there\'s no gravity that high." Right?', commonErrors: [{ answer: 'Yes — no gravity in orbit.', misconception: 'Confusing weightlessness with gravity-free.', correctsTo: 'At ISS altitude (400 km), gravity is still ~89% of surface gravity. Astronauts are weightless because they\'re in CONTINUOUS FREE FALL around Earth — both they and the station fall together at the same rate, so they don\'t press on the station. Same as why you feel weightless at the top of a roller coaster drop.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['F = G m₁m₂/r². Inverse square law.', 'Gravity always attractive.', 'Orbit: gravity supplies centripetal force.', 'Weightlessness in orbit = free fall, not zero gravity.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
