import type { Scenario } from '../types';
/** Cooperative-student measurement: humanities content correctness + coherence
 *  with an engaged student (no solver math). */
const scenario: Scenario = {
  name: 'coop-gov',
  description: 'Cooperative student — federalism powers content/coherence.',
  start: { subject: 'social-studies', level: 'AP', topic: 'ap-gov', lessonPlanId: 'evelyn.ap.gov.federalism.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'federalism' }],
  testTurns: [],
  cooperativeStudent: {
    goal: 'Correctly distinguish ENUMERATED powers (federal: coin money, declare war, regulate interstate commerce), RESERVED powers (states: education, licensing, intrastate police), and CONCURRENT powers (both: taxation, building roads, courts), with valid examples and no miscategorized facts.',
    firstSay: 'Can you help me understand the difference between enumerated, reserved, and concurrent powers?',
    persona: 'a cooperative AP Gov student',
    turns: 6,
  },
};
export default scenario;
