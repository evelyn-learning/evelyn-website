/**
 * AP Physics 1 — Newton's Second Law (deep with free-body diagrams).
 *
 * F_net = ma. Drawing FBDs, summing components, multi-object systems
 * (Atwood, inclined plane).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS_NEWTONS_SECOND_DEEP: LessonPlan = {
  id: 'evelyn.ap.physics1.newtons-second-deep.v1',
  title: 'Newton\'s Second Law with free-body diagrams',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys.fbd-newtons-2nd',
      description: 'Apply Newton\'s second law using free-body diagrams to predict the motion of an object.',
      standard: 'AP-PHYS1-3.A',
    },
  ],
  prerequisites: ['phys.kinematics', 'phys.newtons-laws'],
  followUps: ['apphys.energy-conservation'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame F=ma as the central equation of mechanics.',
      script: 'Want to predict how anything moves? Find every force on it, add them as vectors, divide by mass. F = ma. Almost all of mechanics reduces to this one equation, applied to free-body diagrams.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'Five-step method for any FBD problem.',
      keyIdeas: [
        'STEP 1: ISOLATE the object. Draw it alone in space.',
        'STEP 2: DRAW EVERY FORCE acting on it as a vector arrow from the center: weight (mg, down), normal force (N, perpendicular to surface), friction (f, opposing motion or attempted motion), tension (T, along rope, away from object), applied force (F).',
        'STEP 3: CHOOSE COORDINATES. For inclines, tilt axes along the slope so motion is purely along x.',
        'STEP 4: SUM FORCES in each direction. ΣF_x = ma_x. ΣF_y = ma_y. (For static problems, both = 0.)',
        'STEP 5: SOLVE the resulting equations.',
        'COMMON SCENARIOS: 1) Object on flat surface with friction. 2) Object on incline. 3) Atwood machine (two masses on a pulley). 4) Pulled at an angle.',
        'INCLINE TIP: weight has TWO components on a tilted axis: mg·cos θ perpendicular (balances normal), mg·sin θ along slope (drives motion).',
      ],
      vocabulary: [
        { term: 'free-body diagram', definition: 'a diagram showing all forces on a single object.' },
        { term: 'normal force', definition: 'the force a surface exerts perpendicular to itself.' },
        { term: 'tension', definition: 'force transmitted through a rope or cable.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-incline',
      kind: 'worked_example',
      problem: 'A 5 kg block sits on a 30° frictionless incline. Find its acceleration down the slope.',
      steps: [
        'FBD: gravity (mg = 50 N down), normal force (perpendicular to incline). No friction.',
        'Tilt axes along the incline. x-axis points down the slope.',
        'Weight components: mg·sin 30° along slope = 50 × 0.5 = 25 N. mg·cos 30° perpendicular = 50 × 0.866 ≈ 43.3 N.',
        'Perpendicular: ΣF_y = N − mg·cos θ = 0 (no perpendicular acceleration). So N ≈ 43.3 N.',
        'Along slope: ΣF_x = mg·sin θ = m·a → 25 = 5·a → a = 5 m/s².',
        'Note: a = g·sin θ = 9.8·0.5 ≈ 4.9 m/s² (close — we used g = 10 for simplicity).',
      ],
      answer: 'a ≈ 5 m/s² down the slope',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 2 kg block on a horizontal surface is pulled by a horizontal rope with 10 N force. Friction force is 4 N (opposite to motion). Find the acceleration.',
      expectedAnswer: '3 m/s²',
      responseFormat: 'numeric',
      hints: [
        'ΣF_x = T − f = ma. (10 − 4) = 2a.',
        'Solve for a.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-normal-equals-weight',
      kind: 'misconception_check',
      question: 'Is the normal force ALWAYS equal to mg?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating N = mg as universal.',
          correctsTo: 'No — N = mg only on a flat horizontal surface with no vertical acceleration. On an incline, N = mg·cos θ. With a vertical pull or push, N changes. ALWAYS derive N from ΣF_y = ma_y.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F = ma applied to free-body diagrams.',
        'Five steps: isolate, draw forces, choose coords, sum components, solve.',
        'On inclines: tilt axes along slope. Use mg·sin θ along, mg·cos θ perpendicular.',
        'N is NOT always mg — derive it from ΣF_y = ma_y.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In an Atwood machine (two masses connected by a rope over a pulley), why do BOTH masses share the SAME magnitude of acceleration?',
      hint: 'The rope is inextensible. If one moves down by a meter, the other must move up by a meter — same speed, same magnitude of acceleration. Pulley reverses direction.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
