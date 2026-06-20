import type { Scenario } from '../types';
/** Cooperative-student measurement: does the tutor COMPLETE a worked long
 *  division when the student engages? Goal embeds the known answer. */
const scenario: Scenario = {
  name: 'coop-arith',
  description: 'Cooperative student — long division completion/coherence.',
  start: { subject: 'math', level: 'Elementary', topic: 'g4-math', lessonPlanId: 'evelyn.g4.math.long-division.v1', studentName: 'Test Student' },
  seedTurns: [{ say: "let's do long division" }],
  testTurns: [],
  cooperativeStudent: {
    goal: 'Work through 4823 ÷ 7 step by step to the CORRECT final answer 689 remainder 0 (689 r0), with the student doing the DMSB steps.',
    firstSay: 'Can we work through 4823 divided by 7 together, step by step?',
    persona: 'a cooperative, attentive 4th-grade student',
    turns: 7,
  },
};
export default scenario;
