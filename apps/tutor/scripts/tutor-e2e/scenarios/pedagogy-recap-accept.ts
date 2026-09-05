import type { Scenario } from '../types';

/** Typed-input probe for the holistic-pedagogy round (Plan 1, Task 23).
 *  struggle ledger → in-session recap offer → ACCEPT → recap → return → close_session_notes at the goodbye (practice assignment written) */
const scenario: Scenario = {
  name: 'pedagogy-recap-accept',
  description: 'struggle ledger → in-session recap offer → ACCEPT → recap → return → close_session_notes at the goodbye (practice assignment written)',
  start: { subject: 'math', level: 'AP', topic: 'ap-calcbc', lessonPlanId: 'evelyn.ap.calcbc.derivative-definition.v1', studentName: 'Probe Student', studentId: 'e2e-probe-pedagogy-a' },
  seedTurns: [{ say: 'derivatives' }],
  endSession: true,
  testTurns: [
    { say: "I'm stuck, I don't get it", watchFor: 'ledger: stuck_cue+confusion ⇒ gap_inferred on the current LO' },
    { say: 'hmm ok. can you show me one more example of that?' },
    { say: 'okay, I think I follow that part' },
    { say: "no wait, I'm stuck again, I don't get it", watchFor: 'second detection after the 90s cooldown ⇒ gap_recurred + recap_offer_armed; the NEXT tutor turn should offer a quick recap and wait' },
    { say: 'yes please, a quick one', watchFor: 'recap_offer_reply=accept ⇒ recap_started; tutor reteaches the LO briefly on a fresh page' },
    { say: 'okay, that makes more sense now' },
    { say: 'got it, thanks. what were we doing before?', watchFor: 'recap_returned; tutor returns to where it left off without re-explaining' },
    { say: 'I have to go now, can we stop here? bye', timeoutMs: 120_000, watchFor: 'close_session_notes tool fires silently ⇒ practice_assigned / practice_assigned_auto (no locator ⇒ nothing spoken about homework)' },
  ],
};
export default scenario;
