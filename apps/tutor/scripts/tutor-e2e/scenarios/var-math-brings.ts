import type { Scenario } from '../types';
/** Math/calculus + BRINGS-OWN-PROBLEM student (tests grounding under realism). */
const scenario: Scenario = {
  name: 'var-math-brings',
  description: 'AP Calc derivatives — student brings their own homework problem.',
  start: { subject: 'math', level: 'AP', topic: 'ap-calcbc', lessonPlanId: 'evelyn.ap.calcbc.derivative-definition.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'derivatives' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'brings-problem',
    firstSay: 'Can you help me with my homework? I need to differentiate x³ − 4x.',
    goal: "Differentiate the STUDENT's own function x³ − 4x → 3x² − 4. Known answer: 3x² − 4. The tutor must work the student's function, not substitute a canned example.",
    turns: 8,
  },
};
export default scenario;
