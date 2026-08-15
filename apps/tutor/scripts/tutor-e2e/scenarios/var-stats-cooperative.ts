import type { Scenario } from '../types';
/** Math/stats + COOPERATIVE student. Baseline completion under engagement. */
const scenario: Scenario = {
  name: 'var-stats-cooperative',
  description: 'AP Stats binomial — a cooperative student.',
  start: { subject: 'math', level: 'AP', topic: 'ap-stats', lessonPlanId: 'evelyn.ap.stats.binomial-distribution.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'binomial distribution' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'cooperative',
    firstSay: 'Can we work through a binomial probability — say 2 successes out of 10 tries with a 0.3 chance each?',
    goal: 'Compute P(X=2) for Binomial(n=10, p=0.3): C(10,2)·0.3²·0.7⁸. Known answer ≈ 0.2335 (≈0.23).',
    turns: 8,
  },
};
export default scenario;
