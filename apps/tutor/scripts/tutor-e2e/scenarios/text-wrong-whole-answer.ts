import type { Scenario } from '../types';

/** Text-only mode, student-brought problem: the student opens with a WRONG
 *  answer to the whole problem. The tutor must say it does not match and
 *  point at the first thing to re-examine WITHOUT stating the correct result;
 *  a later clarifying question must not draw a "you were right / I was wrong"
 *  retraction. Driven via a minted embed token (--mode text). */
const scenario: Scenario = {
  name: 'text-wrong-whole-answer',
  description: 'Student-brought problem opened with a wrong final answer — no reveal, no spurious retraction.',
  start: { subject: 'science', level: '11-12', topic: 'physics', lessonPlanId: '', studentName: 'Test Student' },
  seedTurns: [
    {
      say: 'A 10 kg block rests on a frictionless 30 degree ramp, g = 9.8 m/s^2. I think the normal force is 98 N straight upward. Can you draw the forces and help me check that?',
      watchFor: 'says 98 N does not match; does NOT state 84.9 / mg cos 30 evaluated; asks one question about what to re-examine',
    },
  ],
  testTurns: [
    {
      say: "I don't understand. Should I be looking at forces along the ramp or perpendicular to it to find the normal force?",
      watchFor: 'answers the question; no apology/retraction for a disagreement that never happened; still no final value',
    },
    {
      say: 'N = 10*9.8*cos(30 degrees) = 84.9 N, perpendicular to the ramp.',
      watchFor: 'confirms correct',
    },
  ],
};

export default scenario;
