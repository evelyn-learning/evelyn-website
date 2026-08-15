import type { Scenario } from '../types';
/** Cooperative-student measurement: does the tutor coherently derive the
 *  tangent to an ellipse with an engaged student? */
const scenario: Scenario = {
  name: 'coop-conics',
  description: 'Cooperative student — ellipse tangent derivation completion.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'conics' }, { say: 'ellipses' }],
  testTurns: [],
  cooperativeStudent: {
    goal: 'Derive the tangent line to the ellipse x²/9 + y²/4 = 1 at the point (√5, 4/3). Correct tangent: x·√5/9 + y·(4/3)/4 = 1, i.e. slope ≈ −0.745.',
    firstSay: 'How do I find the tangent to x²/9 + y²/4 = 1 at the point (√5, 4/3)?',
    persona: 'a motivated JEE-prep student',
    turns: 7,
  },
};
export default scenario;
