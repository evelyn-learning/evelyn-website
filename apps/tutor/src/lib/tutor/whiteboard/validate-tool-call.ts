/**
 * Tool-call payload validator (engine-agnostic).
 *
 * Tool schemas use JSON Schema `required` to ensure fields are *present*,
 * but they do not enforce semantic constraints like "rows must be non-empty"
 * or "smiles must not be a blank string". Both have been observed in prod:
 *
 *   • showTable emitted with `rows: []` → empty-headers-only table renders
 *     (Kayla biology session, 2026-05-11, table items #10 and #11).
 *   • showMolecule emitted with no SMILES → Ketcher placeholder stuck at
 *     "Loading chemistry editor…" (Kayla biology session, 2026-05-11, #4).
 *
 * This validator catches those at the dispatcher level. Callers should
 * drop the tool call and emit a `tool_call_rejected` debug event when
 * `ok: false` is returned.
 *
 * Generic by design — no subject- or topic-specific examples here.
 * Keep new rules structural (shape / non-emptiness / range), not content.
 */

export type ToolCallValidation =
  | { ok: true }
  | { ok: false; reason: string };

function isNonEmptyArray(v: unknown): v is unknown[] {
  return Array.isArray(v) && v.length > 0;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * Validate a tool call's args. Accepts both snake_case (Anthropic tool
 * names) and camelCase (legacy WhiteboardCommand action names) forms so
 * the validator is callable from either the brain stream dispatcher or
 * the response-parser fallback.
 */
export function validateToolCall(
  name: string,
  args: Record<string, unknown>,
): ToolCallValidation {
  const n = name.replace(/_/g, '').toLowerCase();

  if (n === 'showtable') {
    if (!isNonEmptyArray(args.rows)) {
      return { ok: false, reason: 'showTable: rows must be a non-empty array' };
    }
    return { ok: true };
  }

  if (n === 'showmolecule') {
    if (!isNonEmptyString(args.smiles)) {
      return { ok: false, reason: 'showMolecule: smiles must be a non-empty string' };
    }
    return { ok: true };
  }

  if (n === 'showequation') {
    // Self-application of a single-letter variable — "x(x)", "t(t)" — is
    // never valid notation; it's the observed corruption of "f(x)" (live
    // session 2026-07-22: the slip rendered, entered the board snapshot,
    // and the brain kept reproducing it across turns). Rejecting here
    // feeds the correction back via tool_result and breaks that echo loop.
    // Deliberately narrow: inner content must be EXACTLY the same letter,
    // so x(x+2), f(f(2)), v(t) all pass.
    if (typeof args.latex === 'string') {
      // Left boundary guard: the letter must not be the tail of a word
      // ("\text{perimeter (r)}" ends in r followed by (r) — legit prose).
      const selfApp = args.latex.match(/(?<![a-zA-Z])([a-zA-Z])\s*\(\s*\1\s*\)/);
      if (selfApp) {
        const m = `${selfApp[1]}(${selfApp[1]})`;
        return {
          ok: false,
          reason: `showEquation: latex contains "${m}" — a variable applied to itself is malformed function notation (did you mean f(${selfApp[1]}) or ${selfApp[1]}^2?)`,
        };
      }
      // Letter-collapse family (2026-07-22 quotient-rule session: narration
      // said f/g, latex collapsed every function name to h; the corrupted
      // cards then entrenched via the board snapshot across repair turns).
      // Rule A — the same name DEFINED twice with different bodies is
      // always letter drift... except piecewise, whose branches legitimately
      // repeat the name (\begin{cases} or "\text{if/for/when/otherwise}").
      const latex = args.latex;
      const piecewise = /\\begin\{cases\}|\\text\{\s*(if|for|when|otherwise)\b/i.test(latex);
      if (!piecewise) {
        const defs = new Map<string, string>();
        for (const m of latex.matchAll(/([a-zA-Z])\s*\(\s*[a-zA-Z]\s*\)\s*=\s*([^,;=]+)/g)) {
          const body = m[2].replace(/\s+/g, '');
          const prior = defs.get(m[1]);
          if (prior !== undefined && prior !== body) {
            return {
              ok: false,
              reason: `showEquation: the latex defines "${m[1]}(…)" more than once with different bodies — this is letter drift (writing one function's name where your narration uses another). Give each function the letter your narration uses.`,
            };
          }
          defs.set(m[1], body);
        }
      }
      // Rule B — a function defined in terms of ITSELF with the same
      // argument ("h(x) = h(x)/h(x)") is always malformed; shifted
      // arguments (recurrences like f(x) = f(x-1) + 2) stay legal.
      for (const d of latex.matchAll(/([a-zA-Z])('*)\s*\(\s*([a-zA-Z])\s*\)\s*=([^,;]+)/g)) {
        const selfRef = new RegExp(`${d[1]}${d[2] ? "'".repeat(d[2].length) : ''}\\s*\\(\\s*${d[3]}\\s*\\)`);
        if (selfRef.test(d[4])) {
          return {
            ok: false,
            reason: `showEquation: "${d[1]}${d[2]}(${d[3]})" is defined in terms of itself with the same argument — the right-hand side must use the OTHER functions' names from your narration (e.g. f and g), not the one being defined.`,
          };
        }
      }
    }
    return { ok: true };
  }

  return { ok: true };
}
