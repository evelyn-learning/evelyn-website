import type { Scenario } from '../types';
/** Cooperative-student measurement: inelastic collision worked to completion. */
const scenario: Scenario = {
  name: 'coop-physics',
  description: 'Cooperative student — inelastic collision completion/coherence.',
  start: { subject: 'science', level: 'AP', topic: 'ap-physics1', lessonPlanId: 'evelyn.ap.physics1.momentum.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'momentum and collisions' }],
  testTurns: [],
  cooperativeStudent: {
    goal: 'Solve a perfectly inelastic collision: 2 kg at 3 m/s strikes a stationary 1 kg and they stick. CORRECT final velocity = 2 m/s; kinetic energy lost = 3 J (9 J → 6 J).',
    firstSay: 'A 2 kg cart at 3 m/s hits a stationary 1 kg cart and they stick — can we find the final velocity?',
    persona: 'a cooperative AP Physics 1 student',
    turns: 7,
  },
};
export default scenario;
