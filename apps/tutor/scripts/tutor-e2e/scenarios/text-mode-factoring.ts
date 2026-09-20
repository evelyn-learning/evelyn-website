import type { Scenario } from '../types';

/** Text-only mode (partner claim): typed turns, silent clock, sentence-paced
 *  reveal, board renders. Driven via a minted embed token
 *  (TUTOR_E2E_EMBED_TOKEN, --mode text) — the harness navigates to
 *  /tutor-portal/embed instead of /tutor, so `start` below is informational
 *  only (the embed session's subject/level/topic come from the token). */
const scenario: Scenario = {
  name: 'text-mode-factoring',
  description: 'Algebra I factoring in text-only mode — no mic, transcript grows per sentence, board renders anchored to sentences.',
  start: {
    subject: 'math',
    level: '9-10',
    topic: 'algebra-1',
    // Unused in embed-token mode (the token already carries subject/level/
    // topic) — present only to satisfy Scenario['start']'s required field.
    lessonPlanId: '',
    studentName: 'Test Student',
  },
  seedTurns: [{ say: "I don't get why we factor these. Like x^2 + 5x + 6" }],
  testTurns: [{ say: '2 and 3' }],
  cooperativeStudent: {
    profile: 'struggling',
    firstSay: 'can you show me the steps on the board?',
    goal: 'Factor x^2+5x+6 as (x+2)(x+3) with the steps written on the board.',
    turns: 3,
  },
};

export default scenario;
