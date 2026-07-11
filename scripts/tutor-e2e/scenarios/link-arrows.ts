import type { Scenario } from '../types';

/**
 * SmoothDraw Phase-4 gate: hand-drawn arrows. FRESH SESSION required (new
 * tool in the prompt). Requires NEXT_PUBLIC_TUTOR_LINKS=true (+ the P1-3
 * defaults) in .env.local and a dev-server restart. TUTOR_E2E_VIDEO=1.
 */
const scenario: Scenario = {
  name: 'link-arrows',
  description: 'Arrows draw between features with labels; misses drop silently.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Draw the triangle with vertices (0,0), (6,0) and (0,3), then draw an arrow from the vertex at (6,0) to the vertex at (0,3) labeled "the hypotenuse runs here".',
      watchFor: 'Curved hand-drawn arrow from the (6,0) vertex to the (0,3) vertex with barbed head at (0,3); label beside the arrow waist, not overlapping the figure; arrow wipes on.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now write the area formula as an equation, and draw an arrow from that equation to the triangle labeled "computes this area".',
      watchFor: 'Cross-item arrow (equation card → figure) on the same page; label placed clear of notes/content; no overlap.',
      timeoutMs: 150_000,
    },
    {
      say: 'Draw an arrow from the circumcenter to vertex A.',
      watchFor: 'No circumcenter exists on the board — the arrow must drop SILENTLY: no error speech, no retry loop; tutor responds naturally (may draw the point first — also fine; judge from debug events link_dropped or a legitimately drawn arrow).',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
