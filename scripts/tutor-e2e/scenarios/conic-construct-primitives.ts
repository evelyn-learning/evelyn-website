import type { Scenario } from '../types';
/** P6 — exercise the conic geometry-solver PRIMITIVES (point_on_conic /
 *  normal_at / line∩conic intersect) that shipped but were never fired live,
 *  because the brain plots conics via show_function_graph (Desmos) instead of
 *  show_geometry_constructed. These requests are phrased to FORCE a geometric
 *  construction — a point marked ON the curve, the NORMAL at it as a segment,
 *  and the INTERSECTION points of a line with a conic — which map directly to
 *  the primitives. Verification: the bundle's tool_calls should include
 *  `show_geometry_constructed` (not just `show_function_graph`) with point_on_conic
 *  / normal_at / intersect steps, and NO "Rejected show_geometry_constructed".
 *  See project_tutor_conic_construction_fix + project_tutor_work_queue (P6). */
const scenario: Scenario = {
  name: 'conic-construct-primitives',
  description: 'JEE conics — force geometric construction (point_on_conic / normal_at / line∩conic) so the shipped solver primitives fire.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [
    { say: 'conics', watchFor: 'Tutor moves into the conics segment.' },
  ],
  testTurns: [
    {
      say: "Construct the parabola y² = 4x as a geometric figure on the board — mark the point P at (1, 2) lying ON the curve, then draw the NORMAL line to the parabola at P as a segment.",
      watchFor:
        'Expect show_geometry_constructed (NOT show_function_graph): a parabola curve step (vertex origin, focalLength 1, opens right), a point_on_conic step at [1,2] (P is on y²=4x since 2²=4·1), and a normal_at step at P (tangent slope dy/dx=2/y=1 → normal slope −1). ' +
        'PASS = show_geometry_constructed fires with point_on_conic + normal_at and the solver does NOT reject. FAIL/finding = the brain uses show_function_graph (Desmos) and the primitives never fire.',
      timeoutMs: 150_000,
    },
    {
      say: "Now construct the ellipse x²/9 + y²/4 = 1 and the line y = x as geometric objects, and mark the two points where the line INTERSECTS the ellipse.",
      watchFor:
        'Expect show_geometry_constructed: an ellipse curve step (center origin, a=3, b=2), a line/segment for y=x, and an intersect step of [line, ellipse] marking the two crossing points (±6/√13 ≈ ±1.664 on both axes). ' +
        'PASS = show_geometry_constructed fires with an intersect step on the line∩ellipse and the solver does NOT reject. FAIL/finding = the brain plots it via show_function_graph and intersect never fires.',
      timeoutMs: 150_000,
    },
  ],
};
export default scenario;
