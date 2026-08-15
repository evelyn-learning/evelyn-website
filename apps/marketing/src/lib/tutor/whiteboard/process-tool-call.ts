/**
 * Pure tool-call → WhiteboardCommand processor (test/harness seam).
 *
 * This is a FAITHFUL PORT of the tool-validity portion of
 * `handleWhiteboardCommand` in `VoiceTutorRealtime.tsx` (the stage-2
 * `commands.flatMap(...)` validator dispatch, ~lines 2706-3143). It runs
 * the SAME pure validators the live orchestrator runs, so a tool-call that
 * passes here is the one the brain would actually get rendered.
 *
 * What it INTENTIONALLY omits (session policy, not tool validity):
 *   - greeting guards, dedup-vs-session-history, label-dedup
 *   - prescribedRender enforcement, silent substitution, skip-turn gating
 *   - render-sync buffering / kill recovery / debug events
 *
 * Used by the render-harness route (`/tutor/render-harness`) to drive each
 * tool deterministically. NOT yet wired back into the orchestrator — see
 * the drift note in the audit plan; convergence is a later follow-up.
 *
 * Stage-1 mapping (raw `{name, args}` → `WhiteboardCommand`) mirrors the
 * brain-stream dispatcher: action = camelCase(name) with args spread
 * top-level, except `show_function_graph` → `{action:'showGraph', data}`.
 */

import { validateToolCall } from './validate-tool-call';
import { stripWbEmphasisText } from './wb-emphasis-strip';
import { validateGeometryCommand, type GeometryCommand } from './geometry-validator';
import { validateConicGraph } from './conic-validator';
import { validateIntersectionPoints } from './intersection-validator';
import { validateGraphLinearConsistency, validateFunctionGraphVars, validateFunctionValuePoints, validateFeaturePoints } from './graph-consistency-validator';
import { validateSecantTangentGraph } from './secant-tangent-validator';
import { isCurveLessConic, findPriorConic, carryForwardConicCurve } from './conic-construction';
import { validateCircuit } from '../diagrams/circuit-validator';
import { validateCollision } from '../diagrams/collision-validator';
import { validateEnergyBars } from '../diagrams/energy-bars-validator';
import { validateSpringMass } from '../diagrams/spring-mass-validator';
import { validateReactionCoordinate } from '../diagrams/reaction-coordinate-validator';
import { validateManipulative } from '../diagrams/manipulative-validator';
import { validatePedigree } from '../diagrams/pedigree-validator';
import { validateFlowchart } from '../diagrams/flowchart-validator';
import { solveGeometry } from '../diagrams/geometry-solver';
import { looksLikePunnett, repairPunnettHeaders } from '../validation/biology';

export type WhiteboardCommandLike = Record<string, unknown> & { action: string };

export interface ProcessToolCallContext {
  /** Prior commands this session — used only for conic curve carry-forward. */
  priorCommands?: WhiteboardCommandLike[];
  /** Last student utterance — circuit validator uses it for context. */
  lastStudentText?: string;
}

export type ProcessToolCallResult =
  | { ok: true; command: WhiteboardCommandLike }
  | { ok: false; reason: string };

/** snake_case tool name → camelCase action, with explicit renames. */
const ACTION_OVERRIDES: Record<string, string> = {
  show_function_graph: 'showGraph',
};

export function toAction(name: string): string {
  if (ACTION_OVERRIDES[name]) return ACTION_OVERRIDES[name];
  return name.replace(/_([a-z])/g, (_m, c: string) => c.toUpperCase());
}

/** Build the WhiteboardCommand the orchestrator would build from a tool call. */
export function toWhiteboardCommand(
  name: string,
  args: Record<string, unknown>,
): WhiteboardCommandLike {
  const action = toAction(name);
  if (action === 'showGraph') return { action, data: args };
  return { action, ...args };
}

/** Ported from VoiceTutorRealtime isPlaceholderLatex (~line 2687). */
function isPlaceholderLatex(latex: string): boolean {
  if (!latex) return true;
  const rhs = latex.includes('=') ? latex.split('=').pop()!.trim() : latex.trim();
  const placeholderRe = /\[[^[\]]*[a-zA-Z][a-zA-Z\s,.;:]{5,}\][^[\]]*$/;
  if (placeholderRe.test(rhs)) {
    const bracketed = rhs.match(/\[([^[\]]*)\]/)?.[1] || '';
    if (!/[\d+*/^=]/.test(bracketed)) return true;
  }
  if (/\[\s*(using|todo|coming soon|to be done|insert|placeholder|same as|[a-z]+ again|[a-z]+ formula)\b/i.test(rhs)) return true;
  return false;
}

/** Ported from the showTree validator block (~line 3055). Returns error or null. */
function validateTreeShape(root: unknown): string | null {
  const checkNode = (n: unknown, path: string): string | null => {
    if (!n || typeof n !== 'object') return `${path} is missing or not an object`;
    const children = (n as Record<string, unknown>).children;
    if (children === undefined || children === null) return null; // leaf
    if (!Array.isArray(children)) return `${path}.children must be an array`;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as Record<string, unknown> | undefined;
      if (!child || typeof child !== 'object') {
        return `${path}.children[${i}] is missing — each child must be { label, probability?, node }`;
      }
      if (child.node === undefined || child.node === null) {
        return `${path}.children[${i}] is missing the 'node' field — a child is an EDGE wrapper { label, probability?, node }, not a bare node`;
      }
      const sub = checkNode(child.node, `${path}.children[${i}].node`);
      if (sub) return sub;
    }
    return null;
  };
  if (!root) {
    return 'show_tree requires `root: { label, children?: TreeChild[] }`.';
  }
  const rootRec = root as Record<string, unknown>;
  if (!rootRec.children || !Array.isArray(rootRec.children) || (rootRec.children as unknown[]).length === 0) {
    return 'show_tree `root` has no `children`. Provide the full branching structure.';
  }
  return checkNode(root, 'root');
}

/**
 * Run a raw brain tool call through the real validate → convert path.
 * Returns the renderable WhiteboardCommand, or a rejection with the reason
 * the orchestrator would have fed back to the brain.
 */
export function processToolCall(
  name: string,
  args: Record<string, unknown>,
  ctx: ProcessToolCallContext = {},
): ProcessToolCallResult {
  // 1. Structural emptiness guard (showTable rows / showMolecule smiles).
  const structural = validateToolCall(name, args);
  if (!structural.ok) return { ok: false, reason: structural.reason };

  // 2. Shape into a WhiteboardCommand.
  const command = toWhiteboardCommand(name, args);
  const a = command.action;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = command as any;

  // 3. Per-tool validators (ported verbatim from handleWhiteboardCommand).
  if (a === 'showProblem') {
    const statement = (c.problem?.statement ?? '').toString().trim();
    if (statement.length < 10) {
      return { ok: false, reason: 'show_problem was rejected because `statement` is missing or empty.' };
    }
  }
  if (a === 'showCircuit') {
    const r = validateCircuit(Array.isArray(c.components) ? c.components : [], ctx.lastStudentText ?? '');
    if (!r.ok) return { ok: false, reason: r.reason || 'circuit validation failed' };
  }
  if (a === 'showCollision') {
    const r = validateCollision({ dimension: c.dimension, type: c.type, before: c.before, after: c.after });
    if (!r.ok) return { ok: false, reason: r.reason || 'collision validation failed' };
  }
  if (a === 'showEnergyBars') {
    const r = validateEnergyBars({ positions: c.positions });
    if (!r.ok) return { ok: false, reason: r.reason || 'energy_bars validation failed' };
  }
  if (a === 'showSpringMass') {
    const r = validateSpringMass({ elements: c.elements, k: c.k, mass: c.mass, displacement: c.displacement });
    if (!r.ok) return { ok: false, reason: r.reason || 'spring_mass validation failed' };
  }
  if (a === 'showReactionCoordinate') {
    const r = validateReactionCoordinate({
      reactants_energy: c.reactants_energy,
      products_energy: c.products_energy,
      activation_energies: c.activation_energies,
      curve_labels: c.curve_labels,
    });
    if (!r.ok) return { ok: false, reason: r.reason || 'reaction_coordinate validation failed' };
  }
  if (a === 'showManipulative') {
    const r = validateManipulative({ type: c.type, base10: c.base10, tenFrame: c.tenFrame, areaModel: c.areaModel });
    if (!r.ok) return { ok: false, reason: r.reason || 'manipulative validation failed' };
  }
  if (a === 'showPedigree') {
    const r = validatePedigree({ individuals: c.individuals, marriages: c.marriages, children: c.children });
    if (!r.ok) return { ok: false, reason: r.reason || 'pedigree validation failed' };
  }
  if (a === 'showFlowchart') {
    const r = validateFlowchart({ nodes: c.nodes, edges: c.edges });
    if (!r.ok) return { ok: false, reason: r.reason || 'flowchart validation failed' };
  }
  if (a === 'showGeometryConstructed') {
    if (isCurveLessConic(command)) {
      const prior = findPriorConic(command, (ctx.priorCommands ?? []));
      if (prior) {
        const merged = carryForwardConicCurve(command as unknown as Parameters<typeof carryForwardConicCurve>[0], prior);
        c.given = merged.given;
        c.steps = merged.steps;
      } else {
        return {
          ok: false,
          reason: `show_geometry_constructed: the conic figure "${c.title ?? ''}" has no base curve step, so it would render annotations (directrices / foci / asymptotes) with no ellipse / parabola / hyperbola. Include the base conic curve step in the SAME construction.`,
        };
      }
    }
    try {
      solveGeometry({ title: c.title, given: c.given, steps: c.steps, display: c.display });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, reason: `show_geometry_constructed solver rejected the spec: ${msg}.` };
    }
  }
  if (a === 'showEquation') {
    const latex = (c.latex ?? '').toString().trim();
    if (isPlaceholderLatex(latex)) {
      return { ok: false, reason: `The latex "${latex}" is a placeholder, not a real equation.` };
    }
  }
  if (a === 'showTree') {
    const err = validateTreeShape(c.root);
    if (err) return { ok: false, reason: err };
  }
  if (a === 'showGeometry') {
    const validated = validateGeometryCommand(command as unknown as GeometryCommand);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((validated as any)._incomplete) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const why = (validated as any)._incompleteReason || 'missing required primitives';
      return { ok: false, reason: `The geometry command was incomplete (${why}).` };
    }
    return { ok: true, command: validated as unknown as WhiteboardCommandLike };
  }
  if (a === 'showTable') {
    const headers: string[] = c.headers || [];
    const rows: string[][] = c.rows || [];
    if (looksLikePunnett(headers, rows)) {
      const repaired = repairPunnettHeaders(headers, rows);
      if (repaired) return { ok: true, command: { ...command, headers: repaired.headers, rows: repaired.rows } };
    }
  }
  if (a === 'showGraph' && c.data) {
    const original = c.data;
    // A y=f(x) `functions` entry must be a function of x — reject a polar curve
    // converted to a Cartesian-implicit form stuffed into `functions`.
    const vars = validateFunctionGraphVars(original);
    if (!vars.ok) return { ok: false, reason: vars.reason };
    const afterConic = validateConicGraph(original);
    const afterIntersections = validateIntersectionPoints(afterConic);
    // MVT-class repair (snap points to curve, refit secant, true tangent at c)
    // runs BEFORE the linear guard so the refit sees corrected points.
    const afterSecTan = validateSecantTangentGraph(afterIntersections);
    const afterLinear = validateGraphLinearConsistency(afterSecTan);
    // Last resort AFTER all repairs: a single curve that misses its own
    // value-claim labeled points ("f(5) = 7") can't be refit — reject with
    // a corrective so the brain re-emits (R32 "The Puzzle" graph).
    const valuePoints = validateFunctionValuePoints(afterLinear);
    if (!valuePoints.ok) return { ok: false, reason: valuePoints.reason };
    // Feature labels (local max/min/inflection) must be true of the plotted
    // curve — reject so the brain re-derives the expression (R35).
    const features = validateFeaturePoints(afterLinear);
    if (!features.ok) return { ok: false, reason: features.reason };
    if (afterLinear !== original) {
      return { ok: true, command: { ...command, data: afterLinear } };
    }
  }

  return { ok: true, command };
}

// ─── Phase 4.2 (humanlike-latency): visible fallback for content-bearing rejects ───

export interface FallbackCardSpec {
  title: string;
  body: string;
}

/** Collect short display strings from a nested params shape (organizer cells,
 *  tree labels, table rows) — depth- and count-capped so a pathological
 *  payload can't flood the card. */
function collectDisplayStrings(v: unknown, depth: number, out: string[]): void {
  if (out.length >= 12 || depth > 3) return;
  if (typeof v === 'string') {
    const s = v.trim();
    if (s && s.length <= 80 && !out.includes(s)) out.push(s);
    return;
  }
  if (Array.isArray(v)) {
    for (const item of v) collectDisplayStrings(item, depth + 1, out);
    return;
  }
  if (v && typeof v === 'object') {
    for (const val of Object.values(v as Record<string, unknown>)) {
      collectDisplayStrings(val, depth + 1, out);
    }
  }
}

/**
 * Decide whether a REJECTED render deserves a plain fallback card instead of
 * silence (flag TUTOR_RENDER_FALLBACK_CARD, wired in the orchestrator).
 *
 * Eligible: content-bearing structural failures — an organizer/diagram or
 * tree whose TEXT is well-formed but whose shape failed validation (the
 * "brain narrates the comparison table while the board shows nothing" class,
 * 2026-05-04). NOT eligible, deliberately:
 *  - duplicates (dedup is working as intended — the content IS on the board);
 *  - equations (every showEquation reject class is a CORRECTNESS reject —
 *    letter drift, self-application — and wrong math must never paint);
 *  - geometry/graph/physics figures (broken geometry has no honest text form).
 */
export function decideFallbackCard(
  action: string,
  args: Record<string, unknown>,
  reason: string,
): FallbackCardSpec | null {
  const a = toAction(action);
  if (/duplicate/i.test(reason)) return null;
  if (a !== 'showDiagram' && a !== 'showTree') return null;

  const params = (args.params && typeof args.params === 'object' ? args.params : args) as Record<string, unknown>;
  const title =
    (typeof params.title === 'string' && params.title.trim()) ||
    (typeof args.title === 'string' && args.title.trim()) ||
    (typeof args.type === 'string' && args.type.trim().replace(/_/g, ' ')) ||
    '';

  const strings: string[] = [];
  if (a === 'showTree') collectDisplayStrings(args.root, 0, strings);
  else {
    for (const key of ['items', 'attributes', 'cells', 'rows', 'columns', 'stages', 'left', 'right', 'branches']) {
      if (key in params) collectDisplayStrings(params[key], 1, strings);
    }
  }
  // This path is built server-side from the RAW brain args (it never passes
  // through mapFunctionCallToCommand's deep strip on the client), so strip
  // markdown emphasis here. Per-string BEFORE joining — joining first could
  // pair stray asterisks ACROSS cells.
  const cleanTitle = stripWbEmphasisText(title);
  const body = strings.map(stripWbEmphasisText).filter((s) => s !== cleanTitle).join(' · ');
  // A card needs something to say: a title plus at least two content strings
  // (title alone reads as an empty promise; one string is usually a label).
  if (!cleanTitle || strings.length < 2) return null;
  return { title: cleanTitle, body };
}
