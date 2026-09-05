import type { Scenario } from '../types';

/** Typed-input probe for the holistic-pedagogy round (Plan 1, Task 23).
 *  struggle ledger → in-session recap offer → DECLINE → tutor continues, no recap_started, offer dropped for the session */
const scenario: Scenario = {
  name: 'pedagogy-recap-decline',
  description: 'struggle ledger → in-session recap offer → DECLINE → tutor continues, no recap_started, offer dropped for the session',
  start: { subject: 'math', level: 'AP', topic: 'ap-calcbc', lessonPlanId: 'evelyn.ap.calcbc.derivative-definition.v1', studentName: 'Probe Student', studentId: 'e2e-probe-pedagogy-d' },
  seedTurns: [{ say: 'derivatives' }],
  testTurns: [
    { say: "I'm stuck, I don't get it", watchFor: 'ledger: stuck_cue+confusion ⇒ gap_inferred on the current LO' },
    { say: 'hmm ok. can you show me one more example of that?' },
    { say: 'okay, I think I follow that part' },
    { say: "no wait, I'm stuck again, I don't get it", watchFor: 'second detection after the 90s cooldown ⇒ gap_recurred + recap_offer_armed; the NEXT tutor turn should offer a quick recap and wait' },
    { say: "no thanks, let's keep going", watchFor: 'recap_offer_reply=decline; NO recap_started; tutor continues the lesson' },
    { say: 'ok, what is next?', watchFor: 'no re-offer this session' },
  ],
};
export default scenario;
