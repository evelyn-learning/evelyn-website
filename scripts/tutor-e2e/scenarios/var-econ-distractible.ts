import type { Scenario } from '../types';
/** Social-studies/econ + DISTRACTIBLE student. Tutor must redirect tangents
 *  gracefully without chasing them or losing the thread. */
const scenario: Scenario = {
  name: 'var-econ-distractible',
  description: 'AP Micro price elasticity — a distractible, off-topic student.',
  start: { subject: 'social-studies', level: 'AP', topic: 'ap-micro', lessonPlanId: 'evelyn.ap.micro.elasticity.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'price elasticity of demand' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'distractible',
    firstSay: 'Can we do price elasticity? Though, is this even on the AP exam?',
    goal: 'Compute price elasticity of demand when price rises 10→12 (+20%) and quantity falls 100→80 (−20%): |E| = 20/20 = 1 (unit elastic). Known answer: |E| = 1, unit elastic. The tutor should handle off-topic tangents gracefully and bring the student back.',
    turns: 8,
  },
};
export default scenario;
