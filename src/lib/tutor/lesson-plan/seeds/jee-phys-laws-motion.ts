/**
 * JEE Main Physics — Laws of Motion (Newton's Laws + Friction).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_LAWS_MOTION: LessonPlan = {
  id: 'evelyn.jee.phys.laws-motion.v1',
  title: 'JEE Physics — Laws of Motion',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.laws-motion',
      description: 'Apply Newton\'s three laws to multi-block, pulley, and inclined-plane systems including friction.',
      standard: 'JEE-MAIN-PHY-NLM',
    },
  ],
  prerequisites: ['jee.phys.kinematics'],
  followUps: ['jee.phys.work-energy-power'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Newton\'s laws are the bread-and-butter of JEE — multi-block pulley problems test free-body discipline.',
      script: 'Two blocks connected by a string over a pulley. Find the tension and acceleration. The setup tests whether you can draw clean free-body diagrams, apply F = ma to each, and use the constraint that the string is inextensible. Today we drill the algorithm.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-newton',
      kind: 'concept',
      goal: 'Three laws + friction + algorithms for blocks, pulleys, inclines.',
      keyIdeas: [
        'NEWTON 1: a body at rest stays at rest, a body in uniform motion stays in uniform motion, unless acted on by a net external force.',
        'NEWTON 2: F_net = m·a. Force is a vector; resolve into components for inclined surfaces.',
        'NEWTON 3: every action has equal and opposite reaction. Action-reaction forces act on DIFFERENT bodies.',
        'STATIC FRICTION: f_s ≤ μ_s · N. Adjusts up to its max to keep object at rest. Direction opposes potential motion.',
        'KINETIC FRICTION: f_k = μ_k · N. Object already sliding. Usually μ_k < μ_s.',
        'NORMAL FORCE: perpendicular to surface; equals component of weight perpendicular when no other vertical forces.',
        'INCLINED PLANE: weight components — mg sin θ along incline (down the slope), mg cos θ perpendicular.',
        'PULLEY (massless, frictionless): same tension throughout the string. Connected blocks have CONSTRAINED accelerations (one moves down, the other up by the same amount).',
        'ALGORITHM: 1) Draw FBD for each body. 2) Choose axes. 3) Write F = ma per body. 4) Identify constraints. 5) Solve.',
        'JEE TRAP: angle of incline AND angle of force application can both appear. Always sketch with the right axis choice — usually parallel/perpendicular to incline.',
      ],
      vocabulary: [
        { term: 'free body diagram', definition: 'a sketch isolating one body and showing every force acting on it.' },
        { term: 'coefficient of friction', definition: 'μ; ratio f/N. Static μ_s ≥ kinetic μ_k.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pulley',
      kind: 'worked_example',
      problem: 'Two blocks of mass 4 kg and 6 kg are connected by a string over a frictionless pulley. Find acceleration and tension. (g = 10 m/s²)',
      steps: [
        'FBD for 6 kg: weight 60 N down, tension T up. F = ma: 60 − T = 6a (taking down as positive for this block).',
        'FBD for 4 kg: weight 40 N down, tension T up. The 4 kg moves UP (heavier block pulls), so for this block T − 40 = 4a (taking up as positive).',
        'Add equations: 60 − T + T − 40 = 6a + 4a → 20 = 10a → a = 2 m/s².',
        'Substitute back: T = 40 + 4·2 = 48 N. (Or T = 60 − 6·2 = 48 N. ✓)',
      ],
      answer: 'a = 2 m/s²; T = 48 N',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 5 kg block on a horizontal surface (μ = 0.2) is pulled by a horizontal 20 N force. Find the acceleration. (g = 10 m/s²)',
      expectedAnswer: 'a = 2 m/s²',
      responseFormat: 'numeric',
      hints: [
        'Normal force N = mg = 50 N.',
        'Friction f = μN = 0.2·50 = 10 N opposing motion.',
        'Net force = 20 − 10 = 10 N. a = F/m = 10/5.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-action-reaction',
      kind: 'misconception_check',
      question: 'A book sits on a table. A student lists the weight of the book and the normal force from the table as an action-reaction pair. Correct?',
      commonErrors: [
        {
          answer: 'Weight and normal force are the action-reaction pair',
          misconception: 'Pairing forces by being equal and opposite, not by acting on different bodies.',
          correctsTo: 'Action-reaction pairs act on DIFFERENT bodies. Weight acts on the BOOK (Earth pulling); the reaction is the BOOK pulling Earth (a tiny upward force on Earth). Normal force acts on the BOOK (table pushing); reaction is BOOK pushing DOWN on the table. Two separate pairs, neither involves both forces acting on the book. The book\'s weight and normal force are equal and opposite by NEWTON 1 (book in equilibrium), not Newton 3.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F = ma per body. Always draw FBDs first.',
        'Friction: f ≤ μN (static), f = μN (kinetic). Direction opposes motion.',
        'Incline: mg sin θ along, mg cos θ perpendicular.',
        'Pulley: tension same throughout massless string; accelerations linked.',
        'Action-reaction acts on DIFFERENT bodies.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 2 kg block on a 30° incline (μ = 0.3) is held at rest. When released, does it slide? If so, find the acceleration. (g = 10 m/s²)',
      hint: 'mg sin 30° = 10 N (driving). N = mg cos 30° = 10√3 ≈ 17.3 N. Max static friction (assume μ_s = μ = 0.3): f_max = 0.3·17.3 ≈ 5.2 N. Since driving (10) > max static (5.2), block slides. Net force = 10 − 5.2 = 4.8 N. a = 4.8/2 = 2.4 m/s² down the incline.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
