/**
 * JEE — Rotational Mechanics (high-yield JEE topic).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_ROTATIONAL_MECHANICS: LessonPlan = {
  id: 'evelyn.jee.rotational-mechanics.v1',
  title: 'JEE Rotational Mechanics',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.rotational-mechanics',
      description: 'Apply moment of inertia, angular momentum, torque, and rolling without slipping to JEE-style problems.',
      standard: 'JEE-PHY-ROT',
    },
  ],
  prerequisites: ['jee.physics-strategy', 'apphys1.rotation'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Rotational mechanics is a JEE staple — and a high-discrimination topic.',
      script: 'Almost every JEE Advanced paper has 2-3 questions on rotational mechanics. Students who only memorize moment-of-inertia formulas without understanding fail. Students who internalize the parallel between linear and rotational quantities and can apply both energy and angular-momentum conservation can solve almost any rotational problem on the test.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Moment of inertia, parallel/perpendicular axis theorems, torque, angular momentum, rolling.',
      keyIdeas: [
        'MOMENT OF INERTIA I: rotational analog of mass. I = Σ m_i r_i² for discrete masses. For continuous bodies: I = ∫ r² dm.',
        'STANDARD I VALUES: solid disk about center I = (1/2)MR². Hoop I = MR². Solid sphere I = (2/5)MR². Hollow sphere I = (2/3)MR². Rod about center I = (1/12)ML². Rod about end I = (1/3)ML². Memorize these.',
        'PARALLEL AXIS THEOREM: for an axis parallel to one through the center of mass, separated by distance d: I = I_cm + Md². Useful when you need rotation about a non-CM axis.',
        'PERPENDICULAR AXIS THEOREM (for FLAT objects ONLY): I_z = I_x + I_y where z is perpendicular to the plane.',
        'TORQUE: τ = r × F = rF sin θ. For a particle, τ = dL/dt (rotational Newton\'s 2nd).',
        'ANGULAR MOMENTUM L = Iω (for rigid body rotation about fixed axis). For a particle, L = r × p = mvr sin θ. CONSERVED when no external torque.',
        'ROTATIONAL KE = (1/2)Iω². For pure rolling: total KE = translational + rotational = (1/2)Mv² + (1/2)Iω². With v = Rω: total KE = (1/2)v²(M + I/R²).',
        'ROLLING WITHOUT SLIPPING: v_cm = Rω AND a_cm = Rα. Friction at contact may be static (provides torque); doesn\'t do work because contact point is instantaneously at rest.',
        'COMMON PROBLEM TYPES: 1) Rolling object down incline. 2) Yo-yo / pulley with mass. 3) Conservation of angular momentum (skater pulling arms in, ballerina). 4) Atwood with pulley with mass. 5) Compound pendulum.',
      ],
      vocabulary: [
        { term: 'parallel axis theorem', definition: 'I = I_cm + Md² for an axis parallel to one through the center of mass.' },
        { term: 'rolling without slipping', definition: 'a wheel where the contact point with the ground is instantaneously at rest; v = Rω.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rolling-incline',
      kind: 'worked_example',
      problem: 'A solid sphere (mass M, radius R) rolls without slipping down an incline of angle θ. Find its acceleration.',
      steps: [
        'Forces: gravity Mg down, normal force N perpendicular to incline, friction f up the incline (provides torque).',
        'Translation along incline: Mg sin θ − f = Ma.',
        'Rotation about CM: torque = fR (only friction provides torque; gravity acts at CM, no torque about CM). f·R = I·α = (2/5)MR² · α.',
        'Rolling constraint: a = Rα → α = a/R.',
        'From rotation: f·R = (2/5)MR² · (a/R) → f = (2/5)Ma.',
        'Substitute into translation: Mg sin θ − (2/5)Ma = Ma → Mg sin θ = (7/5)Ma → a = (5/7)g sin θ.',
        'COMPARE: pure sliding object accelerates at g sin θ. The rolling sphere accelerates SLOWER because some energy goes into rotation.',
        'ALTERNATIVELY: energy conservation. If sphere rolls down height h, all PE converts to KE_total = (1/2)Mv² + (1/2)Iω² = (1/2)Mv² + (1/2)(2/5)MR²(v/R)² = (1/2)Mv² + (1/5)Mv² = (7/10)Mv². So Mgh = (7/10)Mv² → v² = (10/7)gh.',
      ],
      answer: 'a = (5/7) g sin θ',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A skater spinning at 4 rad/s with arms out (I = 5 kg·m²) pulls in to I = 2 kg·m². Find new ω.',
      expectedAnswer: '10 rad/s',
      responseFormat: 'free',
      hints: [
        'No external torque → angular momentum conserved.',
        'I_1 ω_1 = I_2 ω_2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-friction-rolling',
      kind: 'misconception_check',
      question: 'In pure rolling, does friction at the contact point do positive or negative work on the rolling object?',
      commonErrors: [
        {
          answer: 'negative work, since friction opposes motion',
          misconception: 'Treating rolling friction like sliding kinetic friction.',
          correctsTo: 'Static friction in rolling without slipping does ZERO work. Reason: the contact point is instantaneously at rest. Work = F · d, and d at the contact point is zero per instant. The friction provides the torque needed for the wheel to spin, but doesn\'t dissipate energy (which is why rolling preserves kinetic energy). Energy losses in real rolling come from rolling resistance (deformation), not from the idealized static friction at the contact.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'I values for sphere, disk, hoop, rod — memorize.',
        'Parallel axis: I = I_cm + Md². Perpendicular (flat objects only): I_z = I_x + I_y.',
        'Pure rolling: v = Rω, a = Rα. Total KE = (1/2)Mv² + (1/2)Iω².',
        'Angular momentum conserved when no external torque.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A disk and a sphere of equal mass and radius roll down the same incline. Which reaches the bottom first?',
      hint: 'Compare a values: disk a = (2/3)g sin θ, sphere a = (5/7)g sin θ. (5/7) > (2/3) → sphere is faster. Less mass at the rim means less rotational KE, so more translational KE per unit drop. Hollow shapes (hoop, hollow sphere) are slower because more I is "out there."',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
