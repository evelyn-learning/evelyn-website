import type { Scenario } from '../types';

/**
 * Measurement scenario (Pillar 3 broaden, 2026-06-20) — HUMANITIES / NO-MATH.
 * Exercises organizer tools (t_chart / comparison_table) with NO solver math
 * at all. Tests the hypothesis that humanities errors are a DIFFERENT kind —
 * structural (wrong organizer shape) or content (a wrong fact) — that
 * solver-deferred can't touch and that no numeric validator guards.
 */
const scenario: Scenario = {
  name: 'gov-organizer',
  description: 'AP Gov federalism — comparison organizer, no solver math (humanities baseline).',
  start: {
    subject: 'social-studies',
    level: 'AP',
    topic: 'ap-gov',
    lessonPlanId: 'evelyn.ap.gov.federalism.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'federalism', watchFor: 'Tutor enters the federalism segment.' },
  ],
  testTurns: [
    {
      say: 'Make a side-by-side comparison of enumerated vs reserved powers, with three examples of each.',
      watchFor: 'A two-column organizer; enumerated (e.g. coin money, declare war, regulate interstate commerce) vs reserved (e.g. education, licensing, police) correctly sorted. Any miscategorized fact? Right organizer shape?',
      timeoutMs: 180_000,
    },
    {
      say: 'Add concurrent powers as a third category.',
      watchFor: 'Concurrent powers (e.g. taxation, building roads, courts) added correctly; organizer extends cleanly.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
