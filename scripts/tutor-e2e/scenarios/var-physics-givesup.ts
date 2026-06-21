import type { Scenario } from '../types';
/** Sciences/physics + GIVES-UP student. Tutor should work/show the answer when
 *  the student disengages, not push Socratically forever. */
const scenario: Scenario = {
  name: 'var-physics-givesup',
  description: 'AP Physics 1 kinematics — a student who gives up easily.',
  start: { subject: 'science', level: 'AP', topic: 'ap-physics1', lessonPlanId: 'evelyn.ap.physics1.kinematics.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'free fall kinematics' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'gives-up',
    firstSay: "Can we do a free-fall problem — a ball dropped for 3 seconds — but honestly you'll probably have to just show me?",
    goal: 'Ball dropped from rest, t=3 s, g=10 m/s²: v = gt = 30 m/s; distance s = ½gt² = 45 m. Known answers: v=30 m/s, s=45 m. When the student gives up, the tutor should work/show the answer rather than pushing endlessly.',
    turns: 8,
  },
};
export default scenario;
