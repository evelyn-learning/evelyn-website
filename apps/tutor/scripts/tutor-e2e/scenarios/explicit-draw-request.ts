import type { Scenario } from '../types';
/** Reproduces Console6: the student explicitly asks the tutor to DRAW a figure,
 *  but the Socratic-first default made it quiz + write the equation instead of
 *  drawing (it only drew after a "you didn't draw it" reminder). The new prompt
 *  rule ("honor an explicit request to DRAW a figure") should make the brain
 *  render a figure (show_geometry_constructed / show_function_graph) on the SAME
 *  turn as the request. PASS = a DRAW tool fires that turn (not show_equation
 *  only). See project_tutor_work_queue (Console6 finding). */
const scenario: Scenario = {
  name: 'explicit-draw-request',
  description: 'JEE parabola — student explicitly asks to DRAW a figure; the tutor must render it that turn, not quiz instead.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [
    { say: 'conics' },
    { say: "Draw the parabola y² = 8x + 4 on the board.", watchFor: 'Explicit draw → the parabola CURVE must be rendered (show_function_graph / show_geometry_constructed), not equation-only.' },
  ],
  testTurns: [
    {
      say: "Now draw the tangent to this parabola at its vertex, and tell me its equation.",
      watchFor:
        'EXPLICIT draw request. The tutor MUST render the tangent on the board THIS turn — a DRAW tool (show_geometry_constructed or show_function_graph), not show_equation ALONE. ' +
        'Writing the equation + asking a Socratic question WITHOUT drawing the tangent is a FAIL (the Console6 bug). It MAY ask a follow-up after, but the figure must appear this turn.',
      timeoutMs: 150_000,
    },
  ],
};
export default scenario;
