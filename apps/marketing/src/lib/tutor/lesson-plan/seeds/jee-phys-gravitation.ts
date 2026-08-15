/**
 * JEE Main Physics — Gravitation.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_GRAVITATION: LessonPlan = {
  id: 'evelyn.jee.phys.gravitation.v1',
  title: 'JEE Physics — Gravitation',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.gravitation',
      description: 'Apply Newton\'s law of gravitation, orbital mechanics, escape velocity, and Kepler\'s laws.',
      standard: 'JEE-MAIN-PHY-GRAV',
    },
  ],
  prerequisites: ['jee.phys.work-energy-power'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Gravitation questions in JEE Main combine orbital mechanics with energy conservation — high-yield with clean formulas.',
      script: 'Satellites, escape velocity, Kepler\'s third law. JEE Main loves orbits because they bind together gravitation, circular motion, and energy. Master the formulas and the calculation flow becomes routine.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-gravitation',
      kind: 'concept',
      goal: 'Universal law + orbital + escape + Kepler.',
      keyIdeas: [
        'NEWTON\'S LAW: F = G·m₁m₂/r². G = 6.67 × 10⁻¹¹ N·m²/kg². Always attractive.',
        'GRAVITATIONAL FIELD g(r) = GM/r² (outside planet). At surface of Earth: g ≈ 9.8 m/s².',
        'POTENTIAL ENERGY (general): U = −GMm/r. Zero at infinity. NEGATIVE because gravity is attractive.',
        'NEAR SURFACE: U ≈ mgh (linear approximation, valid for h ≪ R_earth).',
        'CIRCULAR ORBIT: gravitational provides centripetal: GMm/r² = mv²/r → v_orbit = √(GM/r).',
        'ORBITAL PERIOD: T² = (4π²/GM)·r³ — Kepler\'s 3rd law.',
        'TOTAL ENERGY of orbiting body: E = −GMm/(2r). Negative (bound).',
        'ESCAPE VELOCITY: minimum speed to escape gravity. (1/2)mv_esc² = GMm/R → v_esc = √(2GM/R) = √2 · v_orbit (at surface).',
        'KEPLER\'S LAWS: 1) elliptical orbits, focus at sun. 2) equal areas in equal time (angular momentum conservation). 3) T² ∝ r³.',
      ],
      vocabulary: [
        { term: 'escape velocity', definition: 'minimum speed for an object to escape a gravitational well; v_esc = √(2GM/R).' },
        { term: 'orbital velocity', definition: 'speed of a circular orbit at radius r: v = √(GM/r).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-orbit',
      kind: 'worked_example',
      problem: 'A satellite orbits Earth at altitude 400 km. Find its orbital speed and period. Earth: M = 6 × 10²⁴ kg, R = 6.4 × 10⁶ m. G = 6.67 × 10⁻¹¹.',
      steps: [
        'Orbital radius r = R + altitude = 6.4 × 10⁶ + 4 × 10⁵ = 6.8 × 10⁶ m.',
        'GM = 6.67e−11 · 6e24 ≈ 4 × 10¹⁴ m³/s².',
        'v_orbit = √(GM/r) = √(4e14 / 6.8e6) = √(5.88 × 10⁷) ≈ 7670 m/s ≈ 7.67 km/s.',
        'Period T = 2πr/v = 2π·6.8e6 / 7670 ≈ 5570 s ≈ 92.8 min.',
      ],
      answer: 'v ≈ 7.67 km/s; T ≈ 93 min',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Earth\'s escape velocity is 11.2 km/s. If Earth\'s radius were halved (mass unchanged), what would the new escape velocity be?',
      expectedAnswer: '11.2·√2 ≈ 15.84 km/s',
      responseFormat: 'numeric',
      hints: [
        'v_esc = √(2GM/R). Halving R doubles 2GM/R.',
        'New v_esc = √2 · old.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-zero-grav-orbit',
      kind: 'misconception_check',
      question: 'An astronaut on the ISS feels weightless. A student says "gravity is zero up there." Correct?',
      commonErrors: [
        {
          answer: 'Gravity is zero at orbital altitude',
          misconception: 'Equating "feels weightless" with "no gravity".',
          correctsTo: 'At ISS altitude (~400 km), gravity is still ~89% of surface value. Astronauts feel weightless because they (and the station) are in CONTINUOUS FREE FALL — orbiting means falling toward Earth at exactly the rate Earth\'s surface curves away. Both astronaut and station accelerate together at g(r), so the contact force (normal force / scale reading) is zero. Gravity is far from absent; it\'s what holds the orbit together.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F = GMm/r²; U = −GMm/r (zero at infinity).',
        'Orbital v = √(GM/r); period T² = (4π²/GM)·r³.',
        'Escape v = √(2GM/R) = √2 · v_orbit (at surface).',
        'Total orbital energy = −GMm/(2r) (negative).',
        'Kepler: ellipses, equal-areas, T² ∝ r³.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A satellite orbits at 4·R_earth (measured from centre). Compare its orbital period with Earth\'s rotational period (24 h).',
      hint: 'T² ∝ r³. At surface (r = R), period would be ~84 min (low orbit). At r = 4R: T = 84·8 = 672 min ≈ 11.2 hours. Less than 24 hours, so satellite goes around Earth more than twice per day. Geostationary altitude is at r ≈ 6.6·R, where T = 24 h.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
