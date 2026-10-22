/**
 * The source text of a graph function, whichever field carries it. Pure, no
 * React: the board renderers (GraphRenderer, DesmosGraphRenderer) and the
 * homework figure validator/thumbnail all read a function through this one
 * order, so the board draws the curve the thumbnail drew.
 *
 * `expr` is show_function_graph's documented field; `latex` and `fn` are
 * legacy. `expression` is last (2026-10-22, hw-14 p8, F8): a stored homework
 * graph carried only `expression`, the renderers ignored it and drew y = x.
 * No live tool call sends `expression`, so the fallback changes nothing else.
 */
export interface GraphFunctionSourceFields {
  expr?: string;
  latex?: string;
  fn?: string;
  expression?: string;
}

/** The canonical source order: expr, latex, fn, expression; '' when none. */
export const functionSourceOf = (f: GraphFunctionSourceFields): string => f.expr || f.latex || f.fn || f.expression || '';
