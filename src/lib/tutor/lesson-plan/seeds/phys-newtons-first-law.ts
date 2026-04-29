/**
 * HS Physics — Newton's First Law (Inertia).
 * NGSS HS-PS2-1: Newton's laws of motion.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_NEWTONS_FIRST_LAW: LessonPlan = {
  id: 'evelyn.hs.science.physics.newtons-first-law.v1',
  title: "Newton's First Law (Inertia)",
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-1', description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.', standard: 'NGSS.HS-PS2-1' }],
  prerequisites: ['hs.phys.kinematics-1d'], followUps: ['hs.phys.newtons-second-law'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday inertia.', script: 'You\'re in a car. The driver brakes hard. Your body lurches FORWARD even though the car is slowing down. Why? Because your body wants to KEEP moving. That tendency is INERTIA — Newton\'s First Law in action.', estimatedMinutes: 2 },
    { id: 'concept-first-law', kind: 'concept', goal: 'An object at rest stays at rest; an object in motion stays in motion — unless acted on by a NET FORCE.', keyIdeas: [
      'NEWTON\'S FIRST LAW: an object\'s velocity stays CONSTANT unless a NET FORCE changes it.',
      'INERTIA = an object\'s resistance to change in motion. Mass = measure of inertia.',
      'NET FORCE = vector sum of ALL forces. If net force = 0, no acceleration.',
      'EQUILIBRIUM: net force = 0. Object either at rest OR moving at constant velocity.',
      'Things that LOOK like they need force to keep moving (like a rolling ball stopping) are slowed by FRICTION — a hidden force.',
      'In space (no friction), a thrown object keeps going forever.',
    ], vocabulary: [{ term: 'inertia', definition: 'tendency to resist change in motion.' }, { term: 'net force', definition: 'vector sum of all forces.' }, { term: 'equilibrium', definition: 'net force = 0.' }], estimatedMinutes: 4 },
    { id: 'concept-mass', kind: 'concept', goal: 'Mass measures inertia. Bigger mass = more force needed to change motion.', keyIdeas: [
      'MASS (kg): amount of matter; measure of INERTIA.',
      'A heavy truck takes more force to start AND more force to stop than a bike.',
      'Same anywhere in the universe — your mass is 70 kg on Earth or in deep space.',
      'WEIGHT ≠ MASS. Weight = force from gravity = mg. Weight changes with location (less on Moon, zero in space).',
      'EXAMPLES of inertia:',
      '  · Tablecloth trick: yank fast → dishes stay (inertia of rest).',
      '  · Seatbelt: stops you when car stops (you\'d keep moving).',
      '  · Throwing a bowling ball vs a tennis ball: bowling ball needs more force to throw or catch.',
    ], estimatedMinutes: 4 },
    { id: 'worked-passenger', kind: 'worked_example', problem: 'When a car suddenly accelerates forward, you feel pushed back into the seat. Apply Newton\'s First Law.', steps: [
      'You and the car start at rest together.',
      'Car accelerates forward. Engine pushes the car.',
      'Your BODY tends to STAY at rest (inertia).',
      'But the seat is attached to the car → the seat pushes you forward to keep up.',
      'Until the seat pushes you, you feel "left behind" — that\'s your INERTIA being overcome.',
      'NET FORCE on you = seat\'s push forward. That\'s what accelerates you.',
      'NO mysterious "pushing back" force exists — it\'s your inertia + the seat catching up to you.',
    ], answer: 'You feel "pushed back" because your body has inertia and resists the car\'s sudden acceleration. The seat applies the force that gets you moving with the car.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A book slides across a table and stops. Doesn\'t this contradict Newton\'s First Law?', expectedAnswer: 'No — there\'s a hidden force: FRICTION between book and table. The book is decelerating because friction opposes motion. Net force is NOT zero. In a frictionless world, the book would slide forever. Newton\'s First Law holds — you just need to identify ALL forces, including hidden ones.', responseFormat: 'free', hints: ['What force opposes the book\'s motion?', 'Is the net force really zero?'], estimatedMinutes: 3 },
    { id: 'misconception-need-force-to-move', kind: 'misconception_check', question: 'A friend says "anything moving must have a force pushing it forward — otherwise it would stop." Right?', commonErrors: [{ answer: 'Yes — moving needs a force.', misconception: 'Thinking like Aristotle.', correctsTo: 'Aristotle thought this for 2000 years. Newton showed otherwise. An object in motion CONTINUES in motion with NO force needed. What stops things is OPPOSING forces (friction, air resistance). In deep space, an object coasting at 1000 m/s keeps going — forever — until something else hits it. No force needed to maintain motion.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Newton\'s 1st Law: zero net force → constant velocity (rest counts).', 'Inertia = resistance to change in motion. Mass measures it.', 'Friction is often the hidden force that "stops" things.', 'No force is needed to keep something moving.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
