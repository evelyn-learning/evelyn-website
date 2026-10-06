/**
 * Shaded-region runtime net — pure decision (GreenApple round 6, Task 3).
 *
 * Live 2026-09-24 (portal-7298bf27): the tutor said "…is shaded green" while
 * the only board write that turn was show_coordinate_plane (points +
 * segments) — a tool with NO shading capability — so the student never saw
 * the region. Only show_function_graph can shade (`inequalities`, or
 * `shadedRegion` for the area between two curves).
 *
 * At stream end: the spoken text uses a shade word, the turn drew with a
 * figure tool that cannot shade, and no graph call carried `shadedRegion`
 * → plant a one-shot runtime note asking for the redraw. Generic: the only
 * lexical trigger is the shade word itself.
 */

export interface ShadedRegionNetInput {
  /** The tutor's full spoken text for the turn. */
  speech: string;
  /** This turn's dispatched tool calls (brain tool names, final args). */
  toolCalls: Array<{ name: string; args: Record<string, unknown> | undefined }>;
}

/** Whole-word shade / shades / shaded / shading ("shadow" does not match). */
export const SHADE_WORD_RE = /\bshad(e|ed|ing|es)\b/i;

/** Figure tools that draw axes/shapes but cannot shade a region. */
const NON_SHADING_FIGURE_TOOLS = new Set(['show_coordinate_plane', 'show_geometry']);

/** The graph tool that CAN shade (brain name; `show_graph` accepted as an alias). */
const SHADING_GRAPH_TOOLS = new Set(['show_function_graph', 'show_graph']);

export function shouldPlantShadedRegionNote({ speech, toolCalls }: ShadedRegionNetInput): boolean {
  if (!SHADE_WORD_RE.test(speech ?? '')) return false;
  const drewNonShading = toolCalls.some((c) => NON_SHADING_FIGURE_TOOLS.has(c.name));
  if (!drewNonShading) return false;
  // 2026-10-06: `inequalities` shade too (each one's solution side), and are
  // the right primitive for a half-plane or a system's solution.
  const hasInequalities = (v: unknown): boolean =>
    typeof v === 'string' ? v.trim() !== '' : Array.isArray(v) && v.length > 0;
  const shadedOnGraph = toolCalls.some(
    (c) => SHADING_GRAPH_TOOLS.has(c.name) && c.args != null
      && (c.args.shadedRegion != null || hasInequalities(c.args.inequalities)),
  );
  return !shadedOnGraph;
}

export const SHADED_REGION_NOTE =
  '[runtime note — not from the student] You described a shaded region but the board tool you used cannot shade. ' +
  'Redraw it now with show_function_graph, keeping the same axes and labels: for the solution of an inequality or a system pass `inequalities` (one entry per inequality — the boundaries and the shading are drawn for you); for the area between two curves over an interval pass `shadedRegion`. ' +
  'Apply silently; never mention this note.';
