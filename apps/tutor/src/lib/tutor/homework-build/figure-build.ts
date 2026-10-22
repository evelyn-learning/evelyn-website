/**
 * Offline figure builder for the per-problem homework build: turns a problem's
 * text (with its `[Figure: …]` / `[Graph: …]` description) into a solver-
 * validated figure, or none. Every model call sits behind `FigureBuildDeps`;
 * tests inject stubs, only production code constructs `defaultFigureBuildDeps()`.
 *
 * Never throws: the caller runs it in parallel with the key solve and patches
 * the record either way.
 */

import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient, prepareParams } from '../ai/model-registry';
import { getGeometryStepKindsDescriptionTail } from '../diagrams/geometry-solver';
import { GEOMETRY_STEP_DOCS, GEOMETRY_STEP_DOCS_EXTRA } from '../diagrams/geometry-step-docs';
import { isCaptionLabel, labelIsFromText, validateFigure, namedPointsIn, POINT_KINDS } from './figure-validate';
import { functionSourceOf } from '../whiteboard/graph-function-source';
import type { FigureClaim, FigureCommand } from './types';

export interface TokenUsage { in: number; out: number }
export interface FigureProposal { figure: FigureCommand | null; claims: FigureClaim[]; note?: string; usage?: TokenUsage }

export interface FigureBuildDeps {
  /** Opus 5.5, adaptive thinking at low effort, JSON-schema output. */
  propose(input: { text: string; feedback?: string[]; previous?: FigureCommand | null }): Promise<FigureProposal>;
  /** Sonnet 5 in a fresh context: the relations the TEXT states, from the text alone. */
  extractClaims(text: string): Promise<{ claims: FigureClaim[]; usage?: TokenUsage }>;
}

export interface FigureBuildResult { figure: FigureCommand | null; note?: string; attempts: number; claims: FigureClaim[]; tokens?: TokenUsage }

const CALL_OPTS = { timeout: 60_000, maxRetries: 0 } as const;
const PROPOSE_MAX_TOKENS = 6000;
const CLAIMS_MAX_TOKENS = 2000;

export const FIGURE_PROPOSE_SYSTEM = `You draw the figure that accompanies one homework problem, as a tool payload that a geometric solver renders exactly. You are given the problem text, including its bracketed figure or graph description. Reply with JSON only.

Output fields:
- figure_json: a JSON-encoded string holding ONE figure command, or "" when the problem needs no figure (text-only) or the description is too vague to draw faithfully (then say why in note).
  - Geometry: {"action":"showGeometryConstructed","title"?,"given":[...],"steps":[...],"display"?:{...}}. "given" holds raw objects with explicit data: points {id,kind:"point",x,y,label?}, circles {id,kind:"circle",center:pointId,radius}, segments {id,kind:"segment",from,to,label?}, lines, polygons. "steps" holds constructions {id,kind,label?,...args} that the solver evaluates, so you never do arithmetic for a derived point.
  - Graph: {"action":"showGraph","type":"function","data":{xLabel,yLabel,xRange,yRange,xAxisStep?,yAxisStep?,functions?,points?,...}}.
- claims: every relation the problem text or figure description states (point on a segment, point on a circle, parallel, perpendicular, collinear, between). Emit a claim for every stated relation; the solver checks the drawn figure against them.
- note: short free text, only when figure_json is "".

Rules:
1. Any figure with parallels, a transversal, a circle, a point on a segment, or an extended side must use constructed steps (section_point, midpoint, intersect, point_on_circle, parallel_through, and the other catalog kinds) for every dependent point. Never place a dependent point with free coordinates: coordinates you estimate will not satisfy the stated relation. Only the independent base points (for example the vertices of a base triangle) are free coordinates.
2. Labels are copied verbatim from the problem text, exactly as written there. Never compute a label, never write a value the text does not state, and leave an unknown quantity as the symbol the text uses. Do not add a legend.
3. A graph copies the sheet's axis marks: when an axis is marked in multiples of pi set xAxisStep ("pi/2", "pi", "2pi"), otherwise a numeric step. Plot only curves and points the description states, and attach no function label or equation text to a curve.
4. Keep proportions faithful to the stated lengths and ratios where the text gives them, and keep the drawing uncluttered.
5. If feedback from a previous attempt is given, you also get that attempt's figure: fix every item in the feedback and keep what was not criticized.
6. A geometry figure has no coordinate grid and no axes (display grid false, axes false) unless the problem itself is on a coordinate plane: it names coordinates, axes, the coordinate plane or ordered pairs.
7. A line the sheet names with a lowercase letter (p, q, r, l, m, t) is a line object {id, kind:"line", through:[P1, P2], label:"p"} — drawn long, labelled by its letter — never a segment, and never a point carrying the letter as its label. The two points that place such a line are helpers: give them no label. Label only points the problem names; a point you invent to place something (P1, Q1) carries no label and is drawn without one.
8. Draw the whole figure the description gives: every line to its full extent, every angle arc at the crossing it sits at, every mark; a figure with a line drawn short or a marked angle missing is incomplete.
9. An angle label (a degree sign, or a number or letter the text names as an angle) is the label of an angle_marker at the vertex it is printed at, opening between the two sides the description places it between — never a free-floating labelled point. A label the description places inside a shape beside a vertex, without naming its arc, is the angle of that shape at that vertex.
10. Shade exactly what the sheet shades: a region step whose outer is the shape whose inside is shaded and whose inner shapes are cut out; when the sheet shades a region, every polygon it leaves unshaded carries fill "none"; never shade a polygon to stand in for the sheet's shading.

Step reference (the steps array of showGeometryConstructed):
${GEOMETRY_STEP_DOCS}${getGeometryStepKindsDescriptionTail()}

${GEOMETRY_STEP_DOCS_EXTRA} translate_point: { kind: "translate_point", point: pointId, by: { dx, dy } | { from: pointId, to: pointId }, label? } — the point moved by a vector, given as numbers or as two points (the vector from → to, so ABCD's fourth vertex C is B translated by { from: "A", to: "D" }). region: { kind: "region", outer: circleId|polygonId, inner?: [circleId|polygonId, ...], label? } — shades the inside of outer with the inner shapes cut out (the four circular segments between a circle c1 and its inscribed square sq: { kind: "region", outer: "c1", inner: ["sq"] }); outer and inner name circles (given or step) or polygons (given or step, a sector included). A polygon (given or step) also takes fill: "none" to draw its outline only, so a square the sheet leaves white is not painted.`;

export const FIGURE_CLAIMS_SYSTEM = `You read one homework problem, including its bracketed figure or graph description, and list the geometric relations it states. Use only what the text says; do not infer relations from how a figure would look. Reply with JSON only: {"claims":[...]}. Claim kinds: on_segment (point, segment:[p,q]), on_circle (point, circle), parallel (a:[p,q], b:[r,s]), perpendicular (a, b), collinear (points:[...]), between (point, ends:[p,q]). Point names are the single letters or ids the text uses. If the text states no such relation, return {"claims":[]}.`;

const CLAIM_ITEM_SCHEMA = {
  type: 'object',
  properties: {
    kind: { type: 'string', enum: ['on_segment', 'on_circle', 'parallel', 'perpendicular', 'collinear', 'between'] },
    point: { type: 'string' },
    segment: { type: 'array', items: { type: 'string' } },
    circle: { type: 'string' },
    a: { type: 'array', items: { type: 'string' } },
    b: { type: 'array', items: { type: 'string' } },
    points: { type: 'array', items: { type: 'string' } },
    ends: { type: 'array', items: { type: 'string' } },
  },
  required: ['kind'],
  additionalProperties: false,
} as const;

/** The figure travels as a JSON string: the step catalog is open-ended objects,
 *  which a strict output schema cannot describe. */
export const FIGURE_PROPOSAL_SCHEMA = {
  type: 'object',
  properties: {
    figure_json: { type: 'string' },
    claims: { type: 'array', items: CLAIM_ITEM_SCHEMA },
    note: { type: 'string' },
  },
  required: ['figure_json', 'claims'],
  additionalProperties: false,
} as const;

export const FIGURE_CLAIMS_SCHEMA = {
  type: 'object',
  properties: { claims: { type: 'array', items: CLAIM_ITEM_SCHEMA } },
  required: ['claims'],
  additionalProperties: false,
} as const;

class ParseError extends Error {}
class TruncatedError extends Error {}

const pair = (v: unknown): [string, string] | null =>
  Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === 'string') ? [v[0], v[1]] : null;

/** Keeps only well-formed claims; a malformed one is dropped, not guessed at. */
export function normalizeClaims(raw: unknown): FigureClaim[] {
  if (!Array.isArray(raw)) return [];
  const out: FigureClaim[] = [];
  for (const c of raw as Array<Record<string, unknown>>) {
    if (!c || typeof c !== 'object') continue;
    const str = (v: unknown) => (typeof v === 'string' && v ? v : null);
    switch (c.kind) {
      case 'on_segment': { const p = str(c.point), s = pair(c.segment); if (p && s) out.push({ kind: 'on_segment', point: p, segment: s }); break; }
      case 'on_circle': { const p = str(c.point), k = str(c.circle); if (p && k) out.push({ kind: 'on_circle', point: p, circle: k }); break; }
      case 'parallel': case 'perpendicular': { const a = pair(c.a), b = pair(c.b); if (a && b) out.push({ kind: c.kind, a, b }); break; }
      case 'collinear': if (Array.isArray(c.points) && c.points.length >= 3 && c.points.every((x) => typeof x === 'string')) out.push({ kind: 'collinear', points: c.points as string[] }); break;
      case 'between': { const p = str(c.point), e = pair(c.ends); if (p && e) out.push({ kind: 'between', point: p, ends: e }); break; }
    }
  }
  return out;
}

/** The problem is set on a coordinate plane: it names coordinates, axes, a grid, a quadrant or an ordered pair. */
const COORDINATE_TEXT_RE = /\bcoordinates?\b|\bcoordinate plane\b|\bax[ie]s\b|\b[xy]-?\s?axis\b|\bordered pairs?\b|\bgrid\b|\bquadrants?\b|\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)/i;

/**
 * I5: a geometry figure is drawn without the coordinate grid and axes unless
 * the problem text is about a coordinate plane. Graphs are untouched. Pure.
 */
/** Given points and the step kinds whose result is one point (the solver labels each by its id when no label is given). */

export function normalizeFigureDisplay(figure: FigureCommand | null, problemText: string): FigureCommand | null {
  if (figure?.action === 'showGraph') return normalizeGraphFunctions(figure);
  if (!figure || figure.action !== 'showGeometryConstructed') return figure;
  // GAC acceptance 2026-10-21: the renderer labels an unlabelled point by its
  // id, so helper points the proposer invented (P1, Q1, R2) came out lettered
  // on the board. A point with no label whose id is not a word of the problem
  // text gets an empty label: the sheet never names it, so the board does not.
  const own = (o: unknown): o is { kind?: unknown; id?: unknown; label?: unknown } => !!o && typeof o === 'object';
  const unname = (arr: unknown) => Array.isArray(arr)
    ? arr.map((orig) => {
      if (!own(orig)) return orig;
      let o = orig;
      // A caption the proposer added (isCaptionLabel) is not on the sheet: drop
      // it, then fall through to the unnamed-id rule (final review, F8-cache:
      // returning here left a helper lettered by its id on pass 1 and unlettered
      // on the runner's cached-copy pass 2).
      if (typeof o.label === 'string' && isCaptionLabel(o.label)) { const { label: _drop, ...rest } = o; void _drop; o = rest; }
      if (typeof o.kind !== 'string' || !POINT_KINDS.has(o.kind) || typeof o.id !== 'string' || o.label !== undefined) return o;
      // A one-letter id is a point name only when the text names that point
      // (an article "A" is not); a longer id (P1, foot_1) is a helper.
      const isNamed = /^[A-Z]$/.test(o.id) ? pointNames.has(o.id) : labelIsFromText(o.id, problemText ?? '');
      return isNamed ? o : { ...o, label: '' };
    })
    : arr;
  const pointNames = namedPointsIn(problemText ?? '');
  const geo = figure as Extract<FigureCommand, { action: 'showGeometryConstructed' }>;
  const named = { ...geo, given: unname(geo.given) as typeof geo.given, steps: unname(geo.steps) as typeof geo.steps };
  // G7 (2026-10-22, hw-14b p3): a caption-like title is the proposer's own
  // words, never the sheet's: it is dropped from the stored figure.
  if (typeof named.title === 'string' && isCaptionLabel(named.title)) delete (named as { title?: string }).title;
  // keepLabels (2026-10-22, hw-13 p4): the sheet's "13" on a slant edge of an
  // oblique pyramid is the sheet's label, however long the drawn segment is;
  // the solver's mislabel guard is for the live tutor, not a stored figure.
  const display = geo.display && typeof geo.display === 'object' ? geo.display : {};
  if (COORDINATE_TEXT_RE.test(problemText ?? '')) return { ...named, display: { ...display, keepLabels: true } };
  return { ...named, display: { ...display, grid: false, axes: false, keepLabels: true } };
}

/**
 * 2026-10-22 (hw-14 p8, F8): the proposer wrote a graph function as
 * `{ expression }`. The validator and thumbnail read it, the board's
 * renderers read `expr | latex | fn` and drew y = x. A stored graph function
 * carries `expr`: `expression` moves there when no `expr` is set, and is
 * dropped. x = f(y) curves (`functionsOfY`) the same. Pure.
 */
function normalizeGraphFunctions(figure: Extract<FigureCommand, { action: 'showGraph' }>): FigureCommand {
  const data = figure.data as unknown as Record<string, unknown> | undefined;
  if (!data || typeof data !== 'object') return figure;
  const hasExpression = (arr: unknown) => Array.isArray(arr) && arr.some((f) => !!f && typeof f === 'object' && 'expression' in f);
  if (!hasExpression(data.functions) && !hasExpression(data.functionsOfY)) return figure;   // nothing to move: the same object
  const move = (arr: unknown) => Array.isArray(arr)
    ? arr.map((f) => {
      if (!f || typeof f !== 'object' || !('expression' in f)) return f;
      const { expression, ...rest } = f as Record<string, unknown>;
      // expr | latex | fn already win over expression (functionSourceOf): keep that choice.
      return functionSourceOf(rest) || typeof expression !== 'string' || !expression ? rest : { ...rest, expr: expression };
    })
    : arr;
  const out: Record<string, unknown> = { ...data };
  if ('functions' in data) out.functions = move(data.functions);
  if ('functionsOfY' in data) out.functionsOfY = move(data.functionsOfY);
  return { ...figure, data: out as unknown as typeof figure.data };
}

export function parseFigure(raw: unknown): FigureCommand | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  let v: unknown;
  try { v = JSON.parse(raw); } catch { throw new ParseError('figure_json is not JSON'); }
  const f = v as { action?: unknown } | null;
  if (!f || (f.action !== 'showGeometryConstructed' && f.action !== 'showGraph')) throw new ParseError('figure has no known action');
  return f as FigureCommand;
}

async function callJson(role: 'plangen-vision' | 'content-verify', maxTokens: number, system: string, user: string, schema: object): Promise<{ o: Record<string, unknown>; usage: TokenUsage }> {
  const { client, model } = getModelClient(role);
  const params = prepareParams(role, {
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low', format: { type: 'json_schema', schema } },
  });
  const msg = await client.messages.create(params as unknown as Anthropic.MessageCreateParamsNonStreaming, { ...CALL_OPTS });
  if (msg.stop_reason === 'max_tokens') throw new TruncatedError(`reply truncated at max_tokens=${maxTokens}`);
  const text = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
  try {
    const v = JSON.parse(text.trim());
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('not an object');
    return { o: v as Record<string, unknown>, usage: { in: msg.usage?.input_tokens ?? 0, out: msg.usage?.output_tokens ?? 0 } };
  } catch {
    throw new ParseError('model reply was not a JSON object');
  }
}

const errorKind = (e: unknown): string =>
  e instanceof TruncatedError ? 'truncated' : e instanceof ParseError ? 'parse' : (e as { constructor?: { name?: string } })?.constructor?.name || 'Error';

/** The model's JSON reply -> a proposal. A malformed figure becomes a failed proposal. */
export function parseProposal(o: Record<string, unknown>): FigureProposal {
  const claims = normalizeClaims(o.claims);
  try {
    const figure = parseFigure(o.figure_json);
    return { figure, claims, ...(typeof o.note === 'string' && o.note ? { note: o.note } : {}) };
  } catch (e) {
    return { figure: null, claims, note: `propose_failed:${errorKind(e)}` };
  }
}

/** Production deps. Any SDK / parse failure resolves as a failed proposal. */
export function defaultFigureBuildDeps(): FigureBuildDeps {
  return {
    async propose({ text, feedback, previous }) {
      const user = feedback?.length
        ? `${text}\n\nYour previous figure failed validation:\n${previous ? `${JSON.stringify(previous)}\n\n` : ''}Fix every item, keeping what was not criticized:\n${feedback.map((f) => `- ${f}`).join('\n')}`
        : text;
      try {
        const { o, usage } = await callJson('plangen-vision', PROPOSE_MAX_TOKENS, FIGURE_PROPOSE_SYSTEM, user, FIGURE_PROPOSAL_SCHEMA);
        return { ...parseProposal(o), usage };
      } catch (e) {
        return { figure: null, claims: [], note: `propose_failed:${errorKind(e)}` };
      }
    },
    async extractClaims(text) {
      try {
        const { o, usage } = await callJson('content-verify', CLAIMS_MAX_TOKENS, FIGURE_CLAIMS_SYSTEM, text, FIGURE_CLAIMS_SCHEMA);
        return { claims: normalizeClaims(o.claims), usage };
      } catch {
        return { claims: [] };
      }
    },
  };
}

function unionClaims(into: Map<string, FigureClaim>, more: FigureClaim[]): void {
  for (const c of more) into.set(JSON.stringify(c), c);
}

export async function buildFigure(
  problem: { n: number; text: string },
  deps: FigureBuildDeps,
  opts: { maxAttempts?: number } = {},
): Promise<FigureBuildResult> {
  const maxAttempts = Math.max(1, opts.maxAttempts ?? 2);
  const claims = new Map<string, FigureClaim>();
  let tokens: TokenUsage | undefined;
  const addUsage = (u?: TokenUsage): void => {
    if (u) tokens = { in: (tokens?.in ?? 0) + u.in, out: (tokens?.out ?? 0) + u.out };
  };
  const withTokens = <T extends object>(r: T): T & { tokens?: TokenUsage } => (tokens ? { ...r, tokens } : r);
  const safePropose = async (feedback?: string[], previous?: FigureCommand | null): Promise<FigureProposal> => {
    try {
      const r = await deps.propose({ text: problem.text, feedback, previous });
      addUsage(r?.usage);
      return r;
    }
    catch (e) { return { figure: null, claims: [], note: `propose_failed:${errorKind(e)}` }; }
  };

  const [first, extracted] = await Promise.all([
    safePropose(),
    (async () => deps.extractClaims(problem.text))().catch((): { claims: FigureClaim[]; usage?: TokenUsage } => ({ claims: [] })),
  ]);
  addUsage(extracted?.usage);
  unionClaims(claims, extracted?.claims ?? []);

  let proposal = first;
  let feedback: string[] | undefined;
  let reasons: string[] = [];
  let lastFigure: FigureCommand | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) proposal = await safePropose(feedback, lastFigure);
    unionClaims(claims, proposal.claims ?? []);
    const all = [...claims.values()];
    if (!proposal.figure) {
      if (!proposal.note?.startsWith('propose_failed')) return withTokens({ figure: null, note: proposal.note, attempts: attempt, claims: all });
      if (!reasons.length) reasons = [proposal.note];   // a failed call is an attempt; keep any validator reasons already found
      continue;
    }
    // Final review (F8): normalise first, so the figure validated is the
    // figure stored (a graph's `expression` is already `expr`).
    const figure = normalizeFigureDisplay(proposal.figure, problem.text)!;
    const v = validateFigure(figure, { problemText: problem.text, claims: all });
    if (v.ok) return withTokens({ figure, attempts: attempt, claims: all });
    reasons = v.reasons;
    // The rejected proposal itself, for the build notes: the note alone
    // ("not on any plotted function") said nothing about WHAT was drawn.
    console.warn(`[homework-figure] n=${problem.n} attempt=${attempt} rejected: ${v.reasons.join('; ').slice(0, 300)} | figure=${JSON.stringify(proposal.figure).slice(0, 1500)}`);
    feedback = v.reasons;
    lastFigure = proposal.figure;
  }
  return withTokens({ figure: null, note: reasons.join('; '), attempts: maxAttempts, claims: [...claims.values()] });
}
