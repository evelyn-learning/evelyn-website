/**
 * AP Physics 1 — Circular Motion and Gravitation.
 *
 * Centripetal acceleration, Newton's law of gravitation, orbits.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_CIRCULAR_GRAVITATION: LessonPlan = {
  id: 'evelyn.ap.physics1.circular-gravitation.v1',
  title: 'Circular Motion and Gravitation',
  curriculum: 'NGSS',
  grade: 'ap',
  subject: 'science',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.circular',
      description: 'Apply centripetal force concepts to objects in circular motion and use Newton\'s law of universal gravitation to analyze orbits.',
      standard: 'AP-PHYS1-3.E',
    },
  ],
  prerequisites: ['apphys1.newtons-second'],
  followUps: ['apphys1.energy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Circular motion always has a force pointing toward the center.',
      script: 'A car turning. The moon orbiting Earth. Water in a bucket being swung over your head. They all share one rule: something is pulling each of them toward the center of the curve. No center-pull, no curve. Find that force and the rest unfolds.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-centripetal',
      kind: 'concept',
      goal: 'Centripetal acceleration and gravitation as the force behind orbits.',
      keyIdeas: [
        'CENTRIPETAL ACCELERATION: a_c = v²/r, directed toward the CENTER of the circle. Magnitude only — direction always changes.',
        'CENTRIPETAL FORCE: F_c = m·v²/r. NOT a new fundamental force — it\'s whichever existing force happens to point inward (tension on a rope, friction on a road, gravity on the moon, normal force on a banked curve).',
        'COMMON ERROR: thinking centripetal force points outward. The "outward feel" you experience in a turning car is your INERTIA — your body wants to go straight; the seat shoves you inward.',
        'NEWTON\'S LAW OF GRAVITATION: F_g = G·m_1·m_2 / r². G ≈ 6.67×10⁻¹¹. Always attractive. r is center-to-center distance.',
        'g AT EARTH\'S SURFACE: g = G·M_earth / r_earth² ≈ 9.8 m/s². Not a coincidence — it falls out of Newton\'s law.',
        'ORBIT: gravity provides the centripetal force. F_g = F_c → G·M·m/r² = m·v²/r → v_orbit = √(GM/r). ORBITAL PERIOD: T² = (4π²/GM)·r³ (Kepler\'s third law).',
        'GEOSYNCHRONOUS orbit: T = 24 hr; satellite stays over the same point on Earth. Solve r ≈ 42,000 km.',
      ],
      vocabulary: [
        { term: 'centripetal force', definition: 'the net inward force required to keep an object in circular motion.' },
        { term: 'orbit', definition: 'a closed path around a gravitating body where gravity provides the centripetal force.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-banked-turn',
      kind: 'worked_example',
      problem: 'A 1000 kg car moves in a horizontal circle of radius 50 m at 20 m/s. What centripetal force is required?',
      steps: [
        'F_c = m·v²/r.',
        '= 1000 · 20² / 50.',
        '= 1000 · 400 / 50.',
        '= 8000 N.',
        'Source: friction between tires and road must supply this. If the road can\'t (icy), the car slides outward.',
      ],
      answer: 'F_c = 8000 N (provided by friction, directed toward the center)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A satellite orbits 6400 km above Earth\'s surface. Earth\'s radius is 6400 km. Compare its orbital speed to a satellite at Earth\'s surface speed (LEO). Specifically: by what factor does v decrease?',
      expectedAnswer: '√2',
      responseFormat: 'numeric',
      hints: [
        'r doubled (6400 + 6400 = 2·6400). v ∝ 1/√r.',
        'v_new / v_old = 1/√2. So decrease factor is √2.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-centrifugal',
      kind: 'misconception_check',
      question: 'When you swing a ball on a string in a circle and let go, does the ball fly outward (radially)?',
      commonErrors: [
        {
          answer: 'yes, outward',
          misconception: 'Believing in an outward "centrifugal" force.',
          correctsTo: 'No — the ball flies TANGENT to the circle, in the direction it was moving when released. There\'s no outward force; releasing the string just removes the inward pull. With no force, the ball obeys Newton\'s 1st law and moves in a straight line. The "feel" of being thrown outward is inertia, not a real force.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a_c = v²/r toward center. F_c is whichever force happens to point inward.',
        'Newton\'s gravitation: F_g = G·m_1·m_2 / r².',
        'Orbital v = √(GM/r). Kepler 3: T² ∝ r³.',
        'When string releases, ball flies tangent — not outward.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do astronauts on the ISS feel weightless even though Earth\'s gravity at their altitude is still about 90% of surface g?',
      hint: 'They\'re in free fall around Earth. Both they and the station are accelerating toward Earth at the same rate, so there\'s no normal force between them and the floor. "Weightless" really means "no contact force from a surface."',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
