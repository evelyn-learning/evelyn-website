/**
 * NEET Physics — Mechanics Overview.
 *
 * NCERT class 11 Chapters 1-7. ~10-12 of the 45 NEET physics questions
 * each year come from mechanics. Highest-weight unit in the subject.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_PHYSICS_MECHANICS: LessonPlan = {
  id: 'evelyn.testprep.neet.physics.mechanics.v1',
  title: 'NEET Physics — Mechanics (Kinematics + Newton + Energy + Momentum + Rotation)',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-physics',
  locale: 'en',
  los: [
    {
      id: 'neet.physics.mechanics',
      description: 'Apply core mechanics formulas (kinematics, Newton\'s laws, conservation of energy and momentum, rotational equivalents) to NEET-style numerical problems.',
      standard: 'NEET-PHYS-MECH',
    },
  ],
  prerequisites: ['neet.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Mechanics is the highest-weight Physics unit on NEET.',
      script: 'About 10-12 of NEET\'s 45 physics questions come from mechanics every year. Students who get this section right tend to do well overall — the techniques (kinematic equations, FBDs, conservation) reappear throughout physics. Master the formula set, learn to draw FBDs reflexively, and recognize when conservation beats kinematics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-kinematics-newton',
      kind: 'concept',
      goal: 'Kinematic equations + Newton\'s laws.',
      keyIdeas: [
        'KINEMATIC EQUATIONS (constant acceleration only): v = u + at, s = ut + ½at², v² = u² + 2as, s = ½(u + v)t.',
        'PROJECTILE: x and y independent. ax = 0; ay = −g. RANGE = u²·sin(2θ)/g; MAX HEIGHT = u²·sin²θ/(2g); TIME OF FLIGHT = 2u·sinθ/g.',
        'NEWTON\'S LAWS: 1st (inertia), 2nd (F = ma), 3rd (action-reaction).',
        'FREE-BODY DIAGRAM: isolate the object, draw EVERY force as a vector arrow from its center. Most NEET force questions become trivial once the FBD is right.',
        'FRICTION: static (≤ μs N), kinetic (μk N, opposes motion). μs > μk in general.',
        'INCLINE: tilt axes along the slope. Weight components: mg·sin θ along slope, mg·cos θ perpendicular.',
        'CIRCULAR MOTION: a = v²/r toward center. Centripetal force = mv²/r — always existing force (tension, friction, normal, gravity), not a new force.',
        'BANKED CURVE without friction: tan θ = v²/(rg).',
      ],
      vocabulary: [
        { term: 'free-body diagram', definition: 'a sketch showing all forces acting on a single object.' },
        { term: 'centripetal force', definition: 'the net inward force required for circular motion; magnitude mv²/r.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-energy-momentum',
      kind: 'concept',
      goal: 'Energy, momentum, work-energy theorem.',
      keyIdeas: [
        'WORK done by a force: W = F·d·cos θ (θ angle between F and displacement). Work is a scalar.',
        'KINETIC ENERGY: KE = ½mv². WORK-ENERGY THEOREM: W_net = ΔKE.',
        'POTENTIAL ENERGY: gravitational PE = mgh. Spring PE = ½kx².',
        'CONSERVATION OF ENERGY: KE_i + PE_i = KE_f + PE_f when only conservative forces (gravity, spring) do work. With friction: include W_friction (negative).',
        'POWER: P = W/t = F·v. Average vs instantaneous.',
        'MOMENTUM: p = mv (vector). IMPULSE: J = F·Δt = Δp.',
        'CONSERVATION OF MOMENTUM: total p before = total p after if no external force. Always true in collisions (forces internal).',
        'COLLISIONS: ELASTIC — both p and KE conserved. INELASTIC — only p; KE lost. PERFECTLY INELASTIC — they stick (one final velocity).',
      ],
      vocabulary: [
        { term: 'work-energy theorem', definition: 'net work on an object equals its change in kinetic energy.' },
        { term: 'elastic collision', definition: 'a collision conserving both momentum and kinetic energy.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-rotation',
      kind: 'concept',
      goal: 'Rotational mechanics — translation\'s parallel.',
      keyIdeas: [
        'ROTATION/TRANSLATION DICTIONARY: x ↔ θ, v ↔ ω, a ↔ α, m ↔ I, F ↔ τ, p ↔ L.',
        'TORQUE: τ = r × F = rF·sinθ. Newton\'s 2nd rotational: Στ = Iα.',
        'MOMENT OF INERTIA: I = Σm·r². Common: solid disk ½MR², hoop MR², solid sphere (2/5)MR², hollow sphere (2/3)MR², rod about center (1/12)ML².',
        'PARALLEL AXIS THEOREM: I = I_cm + Md² for a parallel axis at distance d.',
        'PERPENDICULAR AXIS THEOREM (for FLAT objects only): I_z = I_x + I_y.',
        'ANGULAR MOMENTUM: L = Iω. Conserved when no external torque (skater pulling arms in spins faster).',
        'ROLLING WITHOUT SLIPPING: v = Rω. Total KE = ½Mv² + ½Iω².',
      ],
      vocabulary: [
        { term: 'angular momentum', definition: 'L = Iω; rotational analog of linear momentum; conserved without external torque.' },
        { term: 'parallel axis theorem', definition: 'I = I_cm + Md² — moment of inertia about an axis parallel to one through the center of mass.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-example',
      kind: 'worked_example',
      problem: 'A 2 kg block slides down a frictionless 30° incline of height 5 m. Find its speed at the bottom. (g = 10 m/s².)',
      steps: [
        'CHOOSE METHOD: energy conservation is faster than kinematics for "from height to speed" questions.',
        'TOP: at rest, h = 5 m. KE_i = 0. PE_i = mgh = 2·10·5 = 100 J.',
        'BOTTOM: h = 0. KE_f = ½mv². PE_f = 0.',
        'Conservation: 100 = ½·2·v² → v² = 100 → v = 10 m/s.',
        'CHECK: pure kinematics would give a = g·sin 30° = 5 m/s². Distance along slope = 5/sin 30° = 10 m. v² = 2·5·10 = 100 → v = 10 m/s. Same answer.',
      ],
      answer: '10 m/s',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bullet of mass 50 g moving at 200 m/s embeds itself in a 4 kg block at rest. Find the speed of the block + bullet immediately after.',
      expectedAnswer: '~2.47 m/s (or 2.5 m/s rounded)',
      responseFormat: 'numeric',
      hints: [
        'Perfectly inelastic collision (they stick).',
        'Conservation of momentum: mv = (m + M)v_f.',
        '0.05·200 = (0.05 + 4)·v_f → 10 = 4.05·v_f.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-centripetal-force',
      kind: 'misconception_check',
      question: 'Centripetal force is a separate, real force pointing inward that adds to gravity, friction, etc. on a circular-motion object. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating centripetal force as a fundamental force.',
          correctsTo: 'False. "Centripetal force" is a NAME for whatever NET inward force happens to be acting. It\'s NOT a separate force you add. For a car turning, friction provides the centripetal force. For a satellite orbiting Earth, gravity does. For a ball on a string, tension does. Drawing it as an additional arrow on an FBD is a common error — the existing forces (sum to mv²/r toward center) ARE the centripetal force.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Kinematic equations only valid for constant acceleration. Projectile range u²·sin(2θ)/g.',
        'Energy conservation faster than kinematics for "height to speed" problems.',
        'Momentum always conserved in collisions; KE only in elastic.',
        'Rotation parallels translation: I·α = Στ. Angular momentum conserved with no torque.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A solid sphere and a hoop of equal mass and radius roll without slipping down the same incline. Which reaches the bottom first?',
      hint: 'Both convert mgh to (½mv² + ½Iω²) with v = Rω. Solid sphere I = (2/5)MR², hoop I = MR². For the sphere: ½v² + ½(2/5)v² = (7/10)v² = gh → v² = (10/7)gh. For the hoop: ½v² + ½v² = v² = gh → v² = gh. Sphere\'s v² is larger → sphere arrives first. Less rotational KE share for the sphere.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
