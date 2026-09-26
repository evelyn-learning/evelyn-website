/**
 * Shaded-region runtime net — pure decision (GreenApple round 6, Task 3).
 *
 * Live 2026-09-24 (portal-7298bf27): the tutor said "…is shaded green" while
 * the only board write that turn was show_coordinate_plane (points +
 * segments) — a tool with NO shading capability — so the student never saw
 * the region. Only show_function_graph carries `shadedRegion`.
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
  const shadedOnGraph = toolCalls.some(
    (c) => SHADING_GRAPH_TOOLS.has(c.name) && c.args != null && c.args.shadedRegion != null,
  );
  return !shadedOnGraph;
}

export const SHADED_REGION_NOTE =
  '[runtime note — not from the student] You described a shaded region but the board tool you used cannot shade. ' +
  'Redraw it now with show_function_graph and a `shadedRegion` matching what you said, keeping the same axes and labels. ' +
  'Apply silently; never mention this note.';
