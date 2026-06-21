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
    firstSay: "Can we do a free-fall problem — a ball dropped for 3 seconds, and use g = 10 m/s² to keep it simple — but honestly you'll probably have to just show me?",
    goal: 'Ball dropped from rest, t=3 s, with the STUDENT-SPECIFIED g=10 m/s² (NOT 9.8): v = gt = 30 m/s; distance s = ½gt² = 45 m. Known answers (using the given g=10): v=30 m/s, s=45 m. The tutor must HONOR the student-given g=10, and (gives-up student) work/show the answer rather than pushing endlessly.',
    turns: 8,
  },
};
export default scenario;
