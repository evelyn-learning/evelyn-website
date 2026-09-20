import type { Scenario } from '../types';

/** Typed-input probe for the holistic-pedagogy round (Plan 1, Task 23).
 *  second session for the SAME student as pedagogy-recap-accept: opener should check the assigned homework (homework_checked) and/or offer a session-start recap */
const scenario: Scenario = {
  name: 'pedagogy-homework-check',
  description: 'second session for the SAME student as pedagogy-recap-accept: opener should check the assigned homework (homework_checked) and/or offer a session-start recap',
  start: { subject: 'math', level: 'AP', topic: 'ap-calcbc', lessonPlanId: 'evelyn.ap.calcbc.derivative-definition.v1', studentName: 'Probe Student', studentId: 'e2e-probe-pedagogy-c' },
  seedTurns: [],
  testTurns: [
    { say: 'hi, ready to start', timeoutMs: 120_000, watchFor: 'opener mentions the assigned practice ⇒ homework_checked; or recap_offer_armed source=session-start' },
    { say: 'yes, I did some of it', watchFor: 'if a session-start recap was offered this reply classifies as accept' },
    { say: 'okay lets go on' },
  ],
};
export default scenario;
