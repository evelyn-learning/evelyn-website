/**
 * Grade 8 Science — Newton's Three Laws of Motion.
 *
 * NGSS MS-PS2-1 / MS-PS2-2: apply Newton's third law to design a
 * solution + plan an investigation to provide evidence that the
 * change in motion of an object depends on the sum of the forces
 * and the mass of the object. The full F=ma form arrives in HS
 * physics; here we focus on conceptual understanding.
 *
 * Source: NGSS MS-PS2, OpenStax Grade 8 Science, CK-12 Physical Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_NEWTONS_LAWS: LessonPlan = {
  id: 'evelyn.g8.science.physics.newtons-laws.v1',
  title: 'Newton\'s Three Laws of Motion',
  curriculum: 'NGSS',
  grade: '8',
  subject: 'science',
  topic: 'forces-and-motion',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ps2-1',
      description: 'Apply Newton\'s Third Law to design a solution to a problem involving the motion of two colliding objects.',
      standard: 'NGSS.MS-PS2-1',
    },
    {
      id: 'ngss.ms-ps2-2',
      description: 'Plan an investigation to provide evidence that the change in an object\'s motion depends on the sum of the forces on the object and the mass of the object.',
      standard: 'NGSS.MS-PS2-2',
    },
  ],
  prerequisites: ['ngss.3-ps2-1'],
  followUps: ['ngss.hs-ps2-1'],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle of why a heavy shopping cart is harder to start AND harder to stop than an empty one.',
      script: 'You\'re pushing a shopping cart. Empty, you can start it rolling with one hand. Full of bricks, it takes both hands and a hard shove — and once it\'s rolling, it\'s tough to stop. The CART hasn\'t changed. What changed?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-first-law',
      kind: 'concept',
      goal: 'Newton\'s First Law (inertia): an object at rest stays at rest, and an object in motion stays in motion in a straight line at constant speed — UNLESS a net force acts on it.',
      keyIdeas: [
        'Things don\'t change their motion on their own. They need a FORCE to start moving, stop, or turn.',
        'A book on a table sits still — and stays still — until something pushes it.',
        'A hockey puck on perfectly smooth ice would slide forever in a straight line if there were no friction.',
        'Real-world objects slow down because of FRICTION (a force from rubbing surfaces) and AIR DRAG.',
        'INERTIA = an object\'s "resistance to change in motion". More mass = more inertia.',
      ],
      vocabulary: [
        { term: 'inertia', definition: 'an object\'s tendency to keep doing what it\'s doing.' },
        { term: 'net force', definition: 'the leftover force after all forces are added together.' },
      ],
      suggestedTools: ['show_free_body_diagram'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-second-law',
      kind: 'concept',
      goal: 'Newton\'s Second Law: the more force you apply, the more an object accelerates. The more mass an object has, the LESS it accelerates for the same force. F = ma.',
      keyIdeas: [
        'ACCELERATION = how fast velocity changes (speeding up, slowing down, or turning).',
        'BIGGER force on the SAME mass → MORE acceleration.',
        'SAME force on a BIGGER mass → LESS acceleration.',
        'Formula: F = m × a (force = mass × acceleration). Units: F in newtons (N), m in kg, a in m/s².',
        'This is why the loaded cart is harder to start: same push, much bigger mass → less acceleration.',
      ],
      vocabulary: [
        { term: 'acceleration', definition: 'change in velocity over time.' },
        { term: 'newton (N)', definition: 'the unit of force; 1 N = 1 kg · m/s².' },
      ],
      suggestedTools: ['show_equation', 'show_free_body_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-third-law',
      kind: 'concept',
      goal: 'Newton\'s Third Law: for every action, there is an equal and opposite reaction. Forces always come in pairs.',
      keyIdeas: [
        'When object A pushes on object B, object B pushes BACK on A with EQUAL FORCE in the OPPOSITE DIRECTION.',
        'You push down on the floor; the floor pushes UP on you with the same force.',
        'A swimmer pushes water BACKWARD; the water pushes the swimmer FORWARD.',
        'A rocket pushes hot gas DOWN; the gas pushes the rocket UP.',
        'Action-reaction pairs act on DIFFERENT objects, which is why they don\'t cancel each other.',
      ],
      suggestedTools: ['show_free_body_diagram'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rocket',
      kind: 'worked_example',
      problem: 'A rocket pushes 5,000 N of hot gas downward to lift off. By Newton\'s 3rd Law, what happens to the rocket?',
      steps: [
        '3rd Law: every action has an equal + opposite reaction.',
        'Rocket pushes gas DOWN with 5,000 N → gas pushes rocket UP with 5,000 N.',
        'These two forces act on DIFFERENT objects (rocket and gas), so they don\'t cancel.',
        'The 5,000 N upward force on the rocket overcomes gravity (if rocket weighs less than 5,000 N) and the rocket accelerates upward.',
      ],
      answer: 'The gas pushes the rocket upward with 5,000 N, allowing it to lift off.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You push a shopping cart with 20 N of force. Empty, the cart has a mass of 10 kg. Loaded with groceries, its mass is 50 kg. In which case does the cart accelerate MORE — and roughly how much more?',
      expectedAnswer: 'empty cart accelerates 5 times more (a = F/m, so 20/10 = 2 m/s² vs 20/50 = 0.4 m/s²)',
      responseFormat: 'free',
      hints: [
        'F = ma → a = F/m. Same force, but mass changes.',
        'Compute a for each case and divide.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-equal-reaction-cancels',
      kind: 'misconception_check',
      question: 'A student says "if every force has an equal-and-opposite reaction, then NOTHING should ever move — the forces all cancel!" What\'s wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Yes — they all cancel.',
          misconception: 'Treating action-reaction pairs as if they act on the same object.',
          correctsTo: 'Action-reaction pairs act on TWO DIFFERENT objects. When you push the floor and the floor pushes back, the push on the floor moves the floor (a tiny amount), and the push on you moves YOU. Each object responds to the force on IT, not the force it gave away. They never cancel because they\'re not on the same object.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '1st Law (inertia): things keep doing what they\'re doing unless a net force changes them.',
        '2nd Law: F = ma. More force → more acceleration. More mass → less acceleration.',
        '3rd Law: every push comes with an equal-and-opposite push back, on a DIFFERENT object.',
        'Heavy things have more inertia — harder to start AND harder to stop.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
