/**
 * HS Physics — Newton's Third Law (Action-Reaction).
 * NGSS HS-PS2-3: design a device that minimizes force on a macroscopic object.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_NEWTONS_THIRD_LAW: LessonPlan = {
  id: 'evelyn.hs.science.physics.newtons-third-law.v1',
  title: "Newton's Third Law (Action-Reaction)",
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-1', description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.', standard: 'NGSS.HS-PS2-1' }],
  prerequisites: ['hs.phys.newtons-second-law'], followUps: ['hs.phys.friction'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in rockets.', script: 'A rocket pushes hot gas DOWN; the gas pushes the rocket UP. That\'s how rockets work in the vacuum of space — no air to push against, just NEWTON\'S THIRD LAW. Every action force has an equal-and-opposite reaction force.', estimatedMinutes: 2 },
    { id: 'concept-third-law', kind: 'concept', goal: 'For every action force, there is an equal and opposite reaction force.', keyIdeas: [
      'NEWTON\'S 3RD LAW: when object A exerts a force on B, then B exerts an EQUAL AND OPPOSITE force on A.',
      'Forces always come in PAIRS — never alone.',
      'The two forces:',
      '  · ACT ON DIFFERENT OBJECTS (one on A, one on B).',
      '  · Are the SAME magnitude.',
      '  · Are OPPOSITE in direction.',
      '  · Are the SAME TYPE (both gravity, both contact, both electric, etc.).',
      'EXAMPLES:',
      '  · You push a wall (action). Wall pushes you (reaction).',
      '  · Earth pulls you down (gravity). You pull Earth up (also gravity, equal magnitude).',
      '  · Rocket pushes gas down. Gas pushes rocket up.',
    ], vocabulary: [{ term: 'action-reaction pair', definition: 'two forces of N3L: equal, opposite, on different objects.' }, { term: 'thrust', definition: 'reaction force from expelled mass (rockets, jets).' }], estimatedMinutes: 4 },
    { id: 'concept-confusion', kind: 'concept', goal: 'N3L pairs act on DIFFERENT objects → don\'t cancel.', keyIdeas: [
      'IMPORTANT: action-reaction forces NEVER cancel because they act on DIFFERENT objects.',
      'EXAMPLE: when you push a box across a floor.',
      '  · You exert F (force on box) → box accelerates.',
      '  · Box exerts F (force on you) — but you also have your weight, friction with floor, etc.',
      '  · These two are an action-reaction pair: equal magnitude, opposite directions, BUT acting on different things.',
      'BALANCED forces (Newton\'s 1st Law) act on the SAME object.',
      'Don\'t confuse N3L pairs with balanced forces!',
      'ROCKET PROPULSION: explained ONLY by N3L. No air needed — works in vacuum.',
    ], estimatedMinutes: 4 },
    { id: 'worked-walking', kind: 'worked_example', problem: 'How does Newton\'s 3rd Law explain walking?', steps: [
      'You push your foot BACKWARD against the ground (action force).',
      'Ground pushes your foot FORWARD with equal force (reaction).',
      'That FORWARD force from the ground is what propels you.',
      'On ICE: low friction, your foot can\'t push back hard → ground can\'t push you forward → you slip.',
      'In space (no ground), you can\'t walk — nothing to push against.',
      'Same principle: cars accelerate (tires push road back, road pushes car forward), swimmers swim (push water back).',
    ], answer: 'Walking = pushing the ground backward; the ground pushes you forward (equal & opposite). Without friction, no walking.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A horse pulls a cart. Newton says the cart pulls the horse with an equal force. So how do they ever move?', expectedAnswer: 'The horse-cart pair (action-reaction) act on DIFFERENT objects — they don\'t cancel. The HORSE moves because the GROUND pushes its hooves forward (a separate N3L pair from horse-pushing-ground). The CART moves because the HORSE pulls it forward. Different pairs! Both move because the relevant forces all act on the same direction on each object.', responseFormat: 'free', hints: ['Action-reaction acts on DIFFERENT objects.', 'The ground is involved too.'], estimatedMinutes: 3 },
    { id: 'misconception-pairs-cancel', kind: 'misconception_check', question: 'A friend says "if every force has an equal and opposite reaction, nothing should ever accelerate." Right?', commonErrors: [{ answer: 'Yes — they cancel.', misconception: 'Treating N3L pairs as balanced forces.', correctsTo: 'Action-reaction forces act on DIFFERENT objects, so they DON\'T cancel each other on either one. Only forces on the SAME object can cancel. When you push a box, you exert F on box (box accelerates if no friction); box exerts F on you (you might or might not move depending on what else is acting on you). Acceleration of the box depends only on net force ON THE BOX.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Action-reaction: equal magnitude, opposite direction.', 'Pairs act on DIFFERENT objects → never cancel each other.', 'Walking, swimming, rockets all use N3L.', 'In space, rockets work because N3L doesn\'t need air.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
