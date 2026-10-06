/**
 * Inequalities on a function graph — parser, Desmos LaTeX, gate, region check,
 * board description, graph point features, shaded-region net.
 *
 * Fixtures are the two live sessions of 2026-10-06 (portal-897212b5 voice,
 * portal-347539a7 text): "solve 2x + y < 4 and x − 3y > 2 by graphing", where
 * the tutor shaded the strip BETWEEN the two boundary lines with solid lines.
 *
 * Run: npx tsx scripts/test-graph-inequalities.ts
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  boardProblemStatement,
  graphRelatesToProblem,
  parseXYRelation,
  parseXYExpression,
  extractProblemInequalities,
  boardProblemInequalities,
  checkGraphRegion,
  gateInequalityGraph,
  describeGraphRegions,
  resolveInequalityEntry,
  normalizeLineStyle,
} from '../src/lib/tutor/whiteboard/graph-inequalities';
import { buildManifestForCommand } from '../src/lib/tutor/diagrams/manifests';
import { graphPointFeatures } from '../src/lib/tutor/whiteboard/graph-features';
import { WhiteboardCatalog } from '../src/lib/tutor/whiteboard/catalog';
import { buildWhiteboardSummary } from '../src/lib/tutor/whiteboard/summary';
import { shouldPlantShadedRegionNote, SHADED_REGION_NOTE } from '../src/lib/tutor/voice/shaded-region-net';
import { WHITEBOARD_TOOLS, mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildFeatureManifest = (cmd: any) => buildManifestForCommand(cmd) ?? [];

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${!cond && detail ? ` (${detail})` : ''}`);
}

const STATEMENT = 'Solve the system of inequalities by graphing:\n$2x + y < 4$\n$x - 3y > 2$';

// The exact graph the TEXT session painted (session-doc-text-347539a7.json).
const TEXT_SESSION_GRAPH = {
  title: 'System: $y<-2x+4$ and $y<\\frac{x-2}{3}$',
  xLabel: 'x', yLabel: 'y', xRange: [-6, 8], yRange: [-6, 8],
  functions: [
    { latex: '-2x+4', fn: '-2x+4', color: 'blue', label: 'y=-2x+4' },
    { latex: '(x-2)/3', fn: '(x-2)/3', color: 'green', label: 'y=(x-2)/3' },
  ],
  functionsOfY: [], points: [],
  shadedRegion: { axis: 'x', between: ['-2x+4', '(x-2)/3'], from: -4, to: 2, opacity: 0.3 },
};
// The exact graph the VOICE session painted (session-doc.json, showGraph-1).
const VOICE_SESSION_GRAPH = {
  title: 'Shading the solution region',
  xLabel: 'x', yLabel: 'y', xRange: [-4, 5], yRange: [-4, 6],
  functions: [
    { latex: '-2x + 4', fn: '-2x + 4', color: '#2563eb', label: 'y = -2x + 4' },
    { latex: 'x/3 - 2/3', fn: 'x/3 - 2/3', color: '#dc2626', label: 'y = x/3 - 2/3' },
  ],
  functionsOfY: [], points: [{ x: 0, y: 0, label: 'origin' }],
  shadedRegion: { axis: 'x', between: ['-2x+4', 'x/3 - 2/3'], from: -4, to: 0.5, color: '#16a34a', opacity: 0.35 },
};
// What the brain should send now.
const CORRECT_GRAPH = {
  title: 'Solution of the system',
  xRange: [-6, 8], yRange: [-6, 8],
  inequalities: [
    { expr: 'y < -2x + 4', color: '#2563eb', label: 'y < -2x + 4' },
    { expr: 'y < x/3 - 2/3', color: '#dc2626', label: 'y < x/3 - 2/3' },
  ],
  points: [{ x: 2, y: 0, label: 'boundaries cross (2, 0)' }, { x: 0, y: 0, label: 'origin' }],
};

// ── 1. parser ───────────────────────────────────────────────────────────────
{
  const forms: Array<[string, (x: number, y: number) => boolean]> = [
    ['y < -2x + 4', (x, y) => y < -2 * x + 4],
    ['y >= x/3 - 2/3', (x, y) => y >= x / 3 - 2 / 3],
    ['x > 2', (x) => x > 2],
    ['y ≤ 3', (_x, y) => y <= 3],
    ['y \\le \\frac{1}{3}x - \\frac{2}{3}', (x, y) => y <= x / 3 - 2 / 3],
    ['y \\ge -x^2 + 1', (x, y) => y >= -(x * x) + 1],
    ['2x + y < 4', (x, y) => 2 * x + y < 4],
    ['x − 3y > 2', (x, y) => x - 3 * y > 2],
    ['$y<\\frac{x-2}{3}$', (x, y) => y < (x - 2) / 3],
    ['y < (1/3)x - 2/3', (x, y) => y < x / 3 - 2 / 3],
    ['-1 < y <= 3', (_x, y) => -1 < y && y <= 3],
    ['y > |x| - 2', (x, y) => y > Math.abs(x) - 2],
  ];
  const probes: Array<[number, number]> = [[0, 0], [1, 1], [-3, 2], [2.5, -4], [4, 0.1], [-1.5, -0.3]];
  for (const [text, truth] of forms) {
    const p = parseXYRelation(text);
    check(`parses "${text}"`, p.ok, p.ok ? '' : p.reason);
    if (!p.ok) continue;
    check(`"${text}" agrees with its meaning at 6 points`, probes.every(([x, y]) => p.relation.holds(x, y) === truth(x, y)));
  }
  const strict = parseXYRelation('y < -2x + 4');
  const loose = parseXYRelation('y \\le -2x + 4');
  check('< is strict, \\le is not', strict.ok && strict.relation.strict && loose.ok && !loose.relation.strict);
  check('Desmos LaTeX keeps the strict sign', strict.ok && /</.test(strict.relation.desmosLatex) && !/\\le /.test(strict.relation.desmosLatex), strict.ok ? strict.relation.desmosLatex : '');
  check('Desmos LaTeX uses \\le for ≤', loose.ok && /\\le /.test(loose.relation.desmosLatex));
  const frac = parseXYRelation('y >= x/3 - 2/3');
  check('division serialises as \\frac', frac.ok && frac.relation.desmosLatex.includes('\\frac{x}{3}'), frac.ok ? frac.relation.desmosLatex : '');
  // The serialised LaTeX round-trips to the same region.
  for (const [text] of forms) {
    const a = parseXYRelation(text);
    if (!a.ok) continue;
    const b = parseXYRelation(a.relation.desmosLatex);
    check(`LaTeX of "${text}" re-parses to the same region`, b.ok && probes.every(([x, y]) => a.relation.holds(x, y) === b.relation.holds(x, y)), b.ok ? a.relation.desmosLatex : `${a.relation.desmosLatex} → ${b.reason}`);
  }

  const bad: Array<[string, RegExp]> = [
    ['y = 2x + 1', /equation/],
    ['y < 1/2x + 3', /\(1\/2\)x/],
    ['y < 2t + 1', /only the variables x and y/],
    ['3 < 5', /no x or y/],
    ['y <', /incomplete|empty/],
    ['y < 2x +', /incomplete/],
    ['2x + 1', /no comparison sign/],
    ['y < 2x \\text{ and } y > 0', /words/],
    ['y \\neq 2', /not equal/],
    ['1 < y > 0', /mixes/],
    ['', /empty/],
  ];
  for (const [text, why] of bad) {
    const p = parseXYRelation(text);
    check(`refuses "${text}" with a usable reason`, !p.ok && why.test(p.reason), p.ok ? 'parsed' : p.reason);
  }
  const fr = parseXYRelation('y \\le \\frac{1}{2}x + 1');
  check('readable form of a fraction coefficient is "(1/2)x", which parses back', fr.ok && fr.relation.pretty === 'y ≤ (1/2)x + 1' && parseXYRelation(fr.relation.pretty).ok, fr.ok ? fr.relation.pretty : fr.reason);
  const fr2 = parseXYRelation('y<\\frac{x-2}{3}');
  check('readable form of a fraction with a compound numerator', fr2.ok && fr2.relation.pretty === 'y < (x-2)/3' && parseXYRelation(fr2.relation.pretty).ok, fr2.ok ? fr2.relation.pretty : '');
  const e = parseXYExpression('(x-2)/3');
  check('bare expression evaluates', e.ok && Math.abs(e.evaluate(5, 0) - 1) < 1e-12);
  check('JS-style power in a legacy fn reads', (() => { const q = parseXYExpression('x**2 - 1'); return q.ok && q.evaluate(3, 0) === 8; })());
  check('lineStyle normalises', normalizeLineStyle('Dashed') === 'dashed' && normalizeLineStyle('solid') === 'solid' && normalizeLineStyle('wavy') === undefined && normalizeLineStyle('dotted') === 'dashed');
}

// ── 2. problem relations ────────────────────────────────────────────────────
{
  const p = extractProblemInequalities(STATEMENT);
  check('the session statement yields both inequalities', p.ok && p.relations.length === 2, p.ok ? '' : p.reason);
  check('both are strict', p.ok && p.relations.every((r) => r.strict));
  const one = extractProblemInequalities('Solve and graph: $4x + 9 \\le 33$');
  check('a one-variable problem is not checked', !one.ok && /two-variable/.test(one.reason), one.ok ? 'ok' : one.reason);
  const dom = extractProblemInequalities('Find the greatest integer pair with $2x + y < 4$ and $x - 3y > 2$');
  check('a domain / extreme-value statement is not checked', !dom.ok);
  const prose = extractProblemInequalities('Mia has less than 4 dollars. How much can she spend on x pens and y pads if $2x + y$ is the cost?');
  check('a statement without a readable inequality is not checked', !prose.ok);
  const listed = extractProblemInequalities('Graph the solution set: $y \\ge 2x - 1,\\; y < 3$');
  check('two inequalities in one span are both read', listed.ok && listed.relations.length === 2, listed.ok ? '' : listed.reason);
  const half = extractProblemInequalities('Graph: $y \\ge 2x - 1$ and $y < 3 \\oplus x$');
  check('one unreadable inequality ⇒ the whole statement is "cannot tell"', !half.ok);
  const cases = extractProblemInequalities('Graph the system $\\begin{cases} x + y \\le 6 \\\\ y > 1 \\end{cases}$');
  check('a cases block is read', cases.ok && cases.relations.length === 2, cases.ok ? '' : cases.reason);

  // Board fallback: the voice session's own equation cards.
  const board = [
    { action: 'showProblem', problem: { statement: 'unreadable here' } },
    { action: 'showEquation', latex: '2x + y < 4 \\;\\;\\Rightarrow\\;\\; y < 4 - 2x' },
    { action: 'showEquation', latex: 'x - 3y > 2 \\;\\;\\Rightarrow\\;\\; -3y > 2 - x' },
    { action: 'showEquation', latex: '-3y > 2 - x \\;\\;\\Rightarrow\\;\\; y < \\frac{2-x}{-3} \\;\\;\\Rightarrow\\;\\; y < \\frac{x-2}{3}' },
    { action: 'showEquation', latex: 'y < -2x + 4 \\quad \\Rightarrow \\quad \\text{slope} = -2,\\ \\ y\\text{-intercept} = 4' },
    { action: 'showEquation', latex: '0 \\overset{?}{<} -2(0) + 4' },
  ];
  const b = boardProblemInequalities(board);
  check('board fallback reduces the equivalent forms to the two inequalities', b.ok && b.relations.length === 2, b.ok ? b.relations.map((r) => r.pretty).join(' | ') : b.reason);
  const conflicted = boardProblemInequalities([...board, { action: 'showEquation', latex: 'y > \\frac{x-2}{3}' }]);
  check('a conflicting version on the board ⇒ "cannot tell"', !conflicted.ok && /conflicting/.test(conflicted.reason));
  check('an empty board ⇒ "cannot tell"', !boardProblemInequalities([]).ok);
  check('the newest problem card\'s statement is read off the board', boardProblemStatement([{ action: 'showProblem', problem: { statement: 'old' } }, { action: 'showEquation', latex: 'x' }, { action: 'showProblem', problem: { statement: STATEMENT } }]) === STATEMENT);
  check('no problem card ⇒ null', boardProblemStatement([{ action: 'showEquation', latex: 'x' }]) === null);
}

// ── 3. region check ─────────────────────────────────────────────────────────
{
  const problem = extractProblemInequalities(STATEMENT);
  if (!problem.ok) throw new Error('fixture');
  const text = checkGraphRegion(TEXT_SESSION_GRAPH, problem.relations);
  check('TEXT session strip is a mismatch', text.verdict === 'mismatch' && text.kind === 'includes_non_solution', JSON.stringify(text));
  check('…and the witness is the origin, with the inequality it fails', text.verdict === 'mismatch' && /includes \(0, 0\), which does not satisfy x - 3y > 2/.test(text.reason), text.verdict === 'mismatch' ? text.reason : '');
  check('…and the message says where the solution is', text.verdict === 'mismatch' && /all of these hold: 2x \+ y < 4 and x - 3y > 2/.test(text.reason));
  const voice = checkGraphRegion(VOICE_SESSION_GRAPH, problem.relations);
  check('VOICE session strip is a mismatch at the origin', voice.verdict === 'mismatch' && /\(0, 0\)/.test(voice.reason), JSON.stringify(voice));
  const good = checkGraphRegion(CORRECT_GRAPH, problem.relations);
  check('the correct `inequalities` graph passes', good.verdict === 'pass', JSON.stringify(good));
  const equivalentForms = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['2x + y < 4', 'x - 3y > 2'] }, problem.relations);
  check('the problem written in its own form passes', equivalentForms.verdict === 'pass', JSON.stringify(equivalentForms));
  const subset = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['y < -2x + 4', 'y < x/3 - 2/3', 'x > -5'] }, problem.relations);
  check('a drawn subset of the solution passes', subset.verdict === 'pass', JSON.stringify(subset));
  const wrongSide = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['y < -2x + 4', 'y > x/3 - 2/3'] }, problem.relations);
  check('one flipped inequality is a mismatch', wrongSide.verdict === 'mismatch' && wrongSide.kind === 'includes_non_solution', JSON.stringify(wrongSide));
  const onlyOne = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['y < -2x + 4'] }, problem.relations);
  check('ONE of the problem\'s inequalities drawn faithfully passes as a partial picture (step-by-step shading)', onlyOne.verdict === 'pass' && onlyOne.partial === true, JSON.stringify(onlyOne));
  const onlyOneOwnForm = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['x - 3y > 2'] }, problem.relations);
  check('…in whichever form it is written', onlyOneOwnForm.verdict === 'pass' && onlyOneOwnForm.partial === true);
  const onlyOneFlipped = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['y > -2x + 4'] }, problem.relations);
  check('one inequality on the WRONG side is still a mismatch', onlyOneFlipped.verdict === 'mismatch', JSON.stringify(onlyOneFlipped));
  const invented = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['y < -2x + 4', 'y < 5'] }, problem.relations);
  check('a problem inequality plus an invented one is sampled, and fails', invented.verdict === 'mismatch');
  const looseLine = checkGraphRegion({ ...CORRECT_GRAPH, inequalities: ['y <= -2x + 4', 'y < x/3 - 2/3'] }, problem.relations);
  check('≤ where the problem is strict is a strictness mismatch', looseLine.verdict === 'mismatch' && looseLine.kind === 'strictness' && /dashed/.test(looseLine.reason), JSON.stringify(looseLine));
  const strictWhereLoose = checkGraphRegion({ xRange: [-5, 5], yRange: [-5, 5], inequalities: ['y < 2x - 1'] }, (() => { const q = extractProblemInequalities('Graph $y \\ge 2x - 1$'); if (!q.ok) throw new Error('fixture'); return q.relations; })());
  check('< where the problem is ≥ is a mismatch', strictWhereLoose.verdict === 'mismatch');
  const miss = checkGraphRegion({ xRange: [-6, 8], yRange: [-6, 8], shadedRegion: { axis: 'x', between: ['7', '7.5'], from: 7, to: 7.5 } }, problem.relations);
  check('a shaded patch entirely outside the solution is a mismatch', miss.verdict === 'mismatch');
  const offWindow = checkGraphRegion({ xRange: [-6, 8], yRange: [-6, 8], inequalities: ['y < -100'] }, problem.relations);
  check('a region with no point in the window that misses a visible solution is a mismatch', offWindow.verdict === 'mismatch' && offWindow.kind === 'misses_solution', JSON.stringify(offWindow));
  const unreadableShade = checkGraphRegion({ xRange: [-6, 8], yRange: [-6, 8], shadedRegion: { axis: 'x', between: ['f(x)', '0'], from: 0, to: 2 } }, problem.relations);
  check('an unevaluable shading is skipped, not rejected', unreadableShade.verdict === 'skipped');
  const noShade = checkGraphRegion({ xRange: [-6, 8], yRange: [-6, 8], functions: [{ expr: '-2x+4' }] }, problem.relations);
  check('a graph with no shading is skipped', noShade.verdict === 'skipped');
}

// ── 4. the gate ─────────────────────────────────────────────────────────────
{
  // Validation.
  const bad = gateInequalityGraph({ title: 't', inequalities: ['y < 2x + 1', 'y < 2t'] });
  check('a bad entry is soft-rejected with its index and the form to use', !bad.ok && /inequalities\[1\]/.test(bad.reason) && /only the variables x and y/.test(bad.reason) && /Write each entry/.test(bad.reason), bad.ok ? 'ok' : bad.reason);
  const eq = gateInequalityGraph({ title: 't', inequalities: [{ expr: 'y = 2x' }] });
  check('an equation in `inequalities` is rejected toward `functions`', !eq.ok && /functions/.test(eq.reason));
  const notList = gateInequalityGraph({ title: 't', inequalities: { a: 1 } });
  check('a non-list is rejected', !notList.ok);
  const tooMany = gateInequalityGraph({ title: 't', inequalities: ['x>0', 'x>1', 'x>2', 'x>3', 'x>4', 'x>5', 'x>6'] });
  check('more than six is rejected', !tooMany.ok && /at most 6/.test(tooMany.reason));
  const str = gateInequalityGraph({ title: 't', inequalities: 'y < 2x + 1' });
  check('a single string is accepted as a one-entry list', str.ok && Array.isArray((str.data as { inequalities: unknown[] }).inequalities));

  // Normalisation.
  const g = gateInequalityGraph(CORRECT_GRAPH, { problemStatement: STATEMENT, rejections: new Map() });
  check('the correct graph passes the gate', g.ok, g.ok ? '' : g.reason);
  if (g.ok) {
    const ineqs = (g.data as { inequalities: Array<{ expr: string; latex: string; strict: boolean; color?: string }> }).inequalities;
    check('entries carry Desmos LaTeX, strictness and their colour', ineqs.length === 2 && ineqs.every((i) => i.strict === true && typeof i.latex === 'string') && ineqs[0].color === '#2563eb');
    check('gate records the region pass', g.notes.some((n) => n.kind === 'region_pass'));
  }
  const same = { title: 't', xRange: [-5, 5], yRange: [-5, 5], functions: [{ expr: 'x^2', label: 'f' }] };
  const untouched = gateInequalityGraph(same, { problemStatement: STATEMENT });
  check('a graph with no inequalities / shading / lineStyle keeps its identity', untouched.ok && untouched.data === same);

  // Line style: a function on an inequality's boundary takes its style.
  const withLines = gateInequalityGraph({
    title: 't', xRange: [-6, 8], yRange: [-6, 8],
    functions: [{ expr: '-2x + 4', label: 'y = -2x + 4' }, { expr: 'x/3 - 2/3', label: 'b', lineStyle: 'solid' }, { expr: 'x^2', label: 'unrelated' }],
    inequalities: ['y < -2x + 4', 'y <= x/3 - 2/3'],
  });
  if (withLines.ok) {
    const fns = (withLines.data as { functions: Array<{ lineStyle?: string }> }).functions;
    check('boundary of a strict inequality is forced dashed', fns[0].lineStyle === 'dashed');
    check('boundary of a non-strict inequality stays solid', (fns[1].lineStyle ?? 'solid') === 'solid');
    check('an unrelated curve is left alone', fns[2].lineStyle === undefined);
  } else check('line-style graph passes', false, withLines.reason);
  const junkStyle = gateInequalityGraph({ title: 't', functions: [{ expr: 'x', label: 'a', lineStyle: 'wavy' }, { expr: '2x', label: 'b', lineStyle: 'DASHED' }] });
  check('lineStyle is normalised (junk dropped, case folded)', junkStyle.ok && (() => { const f = (junkStyle.data as { functions: Array<{ lineStyle?: string }> }).functions; return f[0].lineStyle === undefined && f[1].lineStyle === 'dashed'; })());

  // Region check: reject once, then repair from the statement.
  const rejections = new Map<string, number>();
  const first = gateInequalityGraph(TEXT_SESSION_GRAPH, { problemStatement: STATEMENT, rejections });
  check('TEXT session graph is soft-rejected', !first.ok, first.ok ? 'passed' : '');
  check('…with the precise reason and what to send instead', !first.ok && /^show_function_graph: the shaded region includes \(0, 0\), which does not satisfy x - 3y > 2/.test(first.reason) && /Redraw with `inequalities`/.test(first.reason) && /Do not use `shadedRegion`/.test(first.reason), first.ok ? '' : first.reason);
  const second = gateInequalityGraph(TEXT_SESSION_GRAPH, { problemStatement: STATEMENT, rejections });
  check('a second miss on the same problem is repaired, not rejected again', second.ok && second.notes.some((n) => n.kind === 'region_repaired'), second.ok ? JSON.stringify(second.notes) : second.reason);
  if (second.ok) {
    const d = second.data as { inequalities: Array<{ expr: string; strict: boolean }>; shadedRegion?: unknown; functions: Array<{ lineStyle?: string }> };
    check('the repaired graph draws the problem\'s own inequalities and no strip', d.inequalities.length === 2 && d.shadedRegion === undefined && d.inequalities.every((i) => i.strict));
    check('…with both boundary lines dashed', d.functions.every((f) => f.lineStyle === 'dashed'));
    const problem = extractProblemInequalities(STATEMENT);
    check('…and it passes the region check', problem.ok && checkGraphRegion(d, problem.relations).verdict === 'pass');
  }
  // Never block when the problem cannot be read.
  const noProblem = gateInequalityGraph(TEXT_SESSION_GRAPH, { problemStatement: 'Tell me about slopes.', boardCommands: [], rejections: new Map() });
  check('an unreadable problem never blocks the graph', noProblem.ok && noProblem.notes.some((n) => n.kind === 'region_skipped'));
  const nullProblem = gateInequalityGraph(TEXT_SESSION_GRAPH, { problemStatement: null });
  check('no active problem never blocks the graph', nullProblem.ok);
  // Calculus area-between-curves is untouched (no inequality in the problem).
  const calc = gateInequalityGraph({ title: 'Area', xRange: [0, 4], yRange: [0, 10], functions: [{ expr: '2x', label: 'f' }], shadedRegion: { axis: 'x', between: ['2x', '0'], from: 0, to: 3 } }, { problemStatement: 'Find the area under $y = 2x$ from $x = 0$ to $x = 3$.', boardCommands: [] });
  check('area-under-a-curve with shadedRegion is untouched', calc.ok);
  // Boundary lines of a strict system are dashed even before anything is shaded.
  const linesOnly = gateInequalityGraph({
    title: 'Both boundary lines', xRange: [-6, 8], yRange: [-6, 8],
    functions: [{ latex: '-2x+4', fn: '-2x+4', label: 'y=-2x+4' }, { latex: '(x-2)/3', fn: '(x-2)/3', label: 'y=(x-2)/3' }, { expr: 'x', label: 'y = x' }],
  }, { problemStatement: STATEMENT, rejections: new Map() });
  check('lines-only graph of a strict system: both boundaries become dashed, other curves untouched', linesOnly.ok && (() => { const f = (linesOnly.data as { functions: Array<{ lineStyle?: string }> }).functions; return f[0].lineStyle === 'dashed' && f[1].lineStyle === 'dashed' && f[2].lineStyle === undefined; })(), JSON.stringify(linesOnly));
  const linesNoProblem = { title: 'Lines', xRange: [-6, 8], yRange: [-6, 8], functions: [{ expr: '-2x+4', label: 'a' }] };
  check('lines-only graph with no readable problem keeps its identity', (() => { const r = gateInequalityGraph(linesNoProblem, { problemStatement: 'Graph the line.', boardCommands: [] }); return r.ok && r.data === linesNoProblem; })());
  // A side example that shares no boundary with the problem is not judged.
  const aside = gateInequalityGraph({ title: 'Shading above a line', xRange: [-5, 5], yRange: [-5, 5], inequalities: ['y > 2x'] }, { problemStatement: STATEMENT, rejections: new Map() });
  check('an unrelated example graph is neither rejected nor redrawn', aside.ok && aside.notes.some((n) => n.kind === 'region_skipped' && /shares no boundary/.test(n.detail)) && (aside.data as { inequalities: Array<{ expr: string }> }).inequalities[0].expr === 'y > 2x', JSON.stringify(aside));
  const asideStrip = gateInequalityGraph({ title: 'Area', xRange: [0, 4], yRange: [0, 10], functions: [{ expr: 'x^2', label: 'f' }], shadedRegion: { axis: 'x', between: ['x^2', '0'], from: 0, to: 2 } }, { problemStatement: STATEMENT, rejections: new Map() });
  check('an unrelated area-under-a-curve is not judged against the system', asideStrip.ok && asideStrip.notes.some((n) => n.kind === 'region_skipped'));
  check('the session graphs DO relate to the problem (their strip is bounded by its two lines)', (() => { const pr = extractProblemInequalities(STATEMENT); return pr.ok && graphRelatesToProblem(TEXT_SESSION_GRAPH, pr.relations) && graphRelatesToProblem(VOICE_SESSION_GRAPH, pr.relations) && graphRelatesToProblem(CORRECT_GRAPH, pr.relations); })());
  // Flags.
  const offCheck = gateInequalityGraph(TEXT_SESSION_GRAPH, { problemStatement: STATEMENT, regionCheck: false });
  check('region-check flag off ⇒ no rejection', offCheck.ok);
  const offIneq = gateInequalityGraph({ title: 't', inequalities: ['y < 2t'] }, { enabled: false, regionCheck: false });
  check('inequalities flag off ⇒ the gate does not validate them', offIneq.ok);
  // The active-problem slot is empty (a recap detour clears it) but the
  // problem card is still on the board: its statement drives the check.
  const viaCard = gateInequalityGraph(TEXT_SESSION_GRAPH, {
    problemStatement: null,
    boardCommands: [{ action: 'showProblem', problem: { statement: STATEMENT } }, { action: 'showEquation', latex: 'y > \\frac{1}{3}(2-x)' }],
    rejections: new Map(),
  });
  check('no active problem, problem card on the board ⇒ its statement drives the check', !viaCard.ok && /does not satisfy x - 3y > 2/.test(viaCard.reason), viaCard.ok ? JSON.stringify(viaCard.notes) : viaCard.reason);

  // Equation cards alone are working, not the problem: they never reject.
  // These are the TEXT session's own cards, including the student's wrong
  // version "y > (1/3)(2 − x)" that the tutor boarded.
  const TEXT_SESSION_CARDS = [
    { action: 'showEquation', latex: '2x + y < 4 \\Rightarrow y < 4 - 2x' },
    { action: 'showEquation', latex: 'y < -2x + 4' },
    { action: 'showEquation', latex: '-3y > 2-x' },
    { action: 'showEquation', latex: 'y < \\frac{x-2}{3}' },
    { action: 'showEquation', latex: 'y > \\frac{1}{3}(2-x)' },
    { action: 'showEquation', latex: 'x - 3y > 2 \\implies y < \\frac{x-2}{3}' },
    { action: 'showEquation', latex: '0 > 2 \\text{ is false}' },
  ];
  const correctVsCards = gateInequalityGraph(CORRECT_GRAPH, { problemStatement: 'How do I graph this system from my worksheet?', boardCommands: TEXT_SESSION_CARDS, rejections: new Map() });
  check('equation cards with a boarded WRONG version never reject the correct graph', correctVsCards.ok, correctVsCards.ok ? '' : correctVsCards.reason);
  const stripVsCards = gateInequalityGraph(TEXT_SESSION_GRAPH, { problemStatement: 'How do I graph this system from my worksheet?', boardCommands: TEXT_SESSION_CARDS, rejections: new Map() });
  check('…and (by the same rule) do not reject a wrong one either — logged, painted as sent', stripVsCards.ok && stripVsCards.notes.some((n) => n.kind === 'region_unverified_mismatch'));
  check('…but they do make the strict boundaries dashed', stripVsCards.ok && (stripVsCards.data as { functions: Array<{ lineStyle?: string }> }).functions.every((f) => f.lineStyle === 'dashed'));
}

// ── 5. what the brain reads back ────────────────────────────────────────────
{
  const d = describeGraphRegions(CORRECT_GRAPH).join(' · ');
  check('description lists each inequality with its boundary style', /y < -2x \+ 4 \(dashed boundary, line not included\)/.test(d) && /y < x\/3 - 2\/3 \(dashed boundary/.test(d), d);
  check('description says where the solution is', /where ALL hold, is the solution/.test(d));
  const strip = describeGraphRegions(VOICE_SESSION_GRAPH).join(' · ');
  check('a shadedRegion is described with its bounds', /BETWEEN -2x\+4 and x\/3 - 2\/3 for x from -4 to 0.5/.test(strip) && /bounded strip/.test(strip), strip);

  const manifest = buildFeatureManifest({ action: 'showGraph', type: 'generic-xy', data: VOICE_SESSION_GRAPH });
  const whole = manifest.find((f) => f.name === 'graph');
  check('graph manifest: plots are listed (latex/fn shape, not only expr)', !!whole && /plots: -2x \+ 4 \(y = -2x \+ 4\)/.test(whole.description ?? ''), whole?.description);
  check('graph manifest: the shaded strip and its bounds are in the description', !!whole && /shaded region: the area BETWEEN/.test(whole.description ?? '') && /from -4 to 0.5/.test(whole.description ?? ''), whole?.description);
  const origin = manifest.find((f) => f.kind === 'point');
  check('graph manifest: the labelled point is a scribbleable feature answering to "origin"', !!origin && origin.scribbleable !== false && (origin.labels ?? []).includes('origin') && /\(0, 0\)/.test(origin.description ?? ''), JSON.stringify(origin));
  const m2 = buildFeatureManifest({ action: 'showGraph', type: 'generic-xy', data: { ...CORRECT_GRAPH, functions: [{ expr: '-2x + 4', label: 'L1', lineStyle: 'dashed' }] } });
  const whole2 = m2.find((f) => f.name === 'graph');
  check('graph manifest: inequalities and a dashed function are described', !!whole2 && /inequalities shaded: y < -2x \+ 4 \(dashed boundary/.test(whole2.description ?? '') && /\[dashed\]/.test(whole2.description ?? ''), whole2?.description);
  check('graph manifest: both labelled points are features', m2.filter((f) => f.kind === 'point').length === 2);

  const feats = graphPointFeatures([{ x: 0, y: 0, label: 'origin' }, { x: 0, y: 0 }, { x: 2, y: 0, label: 'origin' }, { x: 1, y: 'a' }]);
  check('point features: unlabelled (0,0) still answers to "origin"', feats[1].labels.includes('origin') && feats[1].name === 'point-2');
  check('point features: duplicate labels get distinct names', new Set(feats.map((f) => f.name)).size === feats.length, feats.map((f) => f.name).join(','));
  check('point features: a malformed point is skipped', feats.length === 3);

  const plane = buildFeatureManifest({ action: 'showCoordinatePlane', segments: [{ from: { x: -3, y: 10 }, to: { x: 4, y: -4 }, label: 'y = -2x + 4', dashed: true }, { from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, label: 'solid one' }] });
  check('coordinate plane: a dashed segment says so in its description', plane.some((f) => /dashed/.test(f.description ?? '')) && plane.filter((f) => /dashed/.test(f.description ?? '')).length === 1);
}

// ── 5b. …and it reaches the prompt's board summary ───────────────────────────
{
  const cat = new WhiteboardCatalog();
  cat.openPage({ title: 'Shading the solution region' });
  cat.append({ itemId: 'showGraph-1', action: 'showGraph', title: 'Shading the solution region', features: buildFeatureManifest({ action: 'showGraph', type: 'generic-xy', data: VOICE_SESSION_GRAPH }) });
  const summary = buildWhiteboardSummary(cat.getSnapshot());
  check('board summary carries the shaded strip and its bounds', /shaded region: the area BETWEEN -2x\+4 and x\/3 - 2\/3 for x from -4 to 0\.5/.test(summary), summary);
  check('board summary carries the plotted lines', /plots: -2x \+ 4/.test(summary));
  check('board summary lists the origin as a point of THIS graph', /point "origin" at \(0, 0\)/.test(summary));
  const cat2 = new WhiteboardCatalog();
  cat2.append({ itemId: 'showGraph-2', action: 'showGraph', title: 'Solution', features: buildFeatureManifest({ action: 'showGraph', type: 'generic-xy', data: CORRECT_GRAPH }) });
  const s2 = buildWhiteboardSummary(cat2.getSnapshot());
  check('board summary carries inequalities with their boundary style', /inequalities shaded: y < -2x \+ 4 \(dashed boundary, line not included\); y < x\/3 - 2\/3 \(dashed boundary/.test(s2), s2);
}

// ── 6. tool schema + conversion ─────────────────────────────────────────────
{
  const tool = WHITEBOARD_TOOLS.find((t) => t.name === 'show_function_graph');
  const props = (tool?.parameters as { properties: Record<string, { description?: string; items?: { properties?: Record<string, unknown> } }> }).properties;
  check('schema: `inequalities` exists', !!props.inequalities);
  check('schema: functions carry `lineStyle`', !!props.functions.items?.properties?.lineStyle);
  check('description steers to `inequalities` for a solution region', /inequalit/i.test(tool?.description ?? '') && /never approximate/i.test(tool?.description ?? ''));
  check('`shadedRegion` is scoped to the area between two curves', /ONLY for the area between two curves/i.test(props.shadedRegion.description ?? ''));
  const plane = WHITEBOARD_TOOLS.find((t) => t.name === 'show_coordinate_plane');
  check('show_coordinate_plane sends an inequality region to `inequalities`', /holds \(half-plane, feasible region\), use show_function_graph with `inequalities`/.test(plane?.description ?? '') && !/For ANY shaded region/.test(plane?.description ?? ''));

  const cmd = mapFunctionCallToCommand('show_function_graph', {
    title: 'Solution of the system', xRange: [-6, 8], yRange: [-6, 8],
    functions: [{ expr: '-2x + 4', label: 'L1', lineStyle: 'dashed' }],
    inequalities: [{ expr: 'y < -2x + 4' }, { expr: 'y < x/3 - 2/3' }],
  }) as unknown as { action: string; data: { inequalities?: unknown[]; functions: Array<{ lineStyle?: string }> } } | null;
  check('tool call → showGraph keeps inequalities and lineStyle', cmd?.action === 'showGraph' && cmd.data.inequalities?.length === 2 && cmd.data.functions[0].lineStyle === 'dashed', JSON.stringify(cmd));
  const r = resolveInequalityEntry({ expr: 'y < x/3 - 2/3', color: 'red' });
  check('renderer helper resolves an entry to LaTeX + strictness', !!r && r.strict && r.color === 'red' && r.latex.includes('\\frac{x}{3}'));
  check('renderer helper returns null for an unreadable entry', resolveInequalityEntry({ expr: 'y < 2t' }) === null);
}

// ── 7. shaded-region net knows about inequalities ───────────────────────────
{
  check('net: shade word + coordinate plane, no graph ⇒ note', shouldPlantShadedRegionNote({ speech: 'Let me fix the shading so it is accurate.', toolCalls: [{ name: 'show_coordinate_plane', args: {} }] }));
  check('net: a graph carrying `inequalities` counts as shading', !shouldPlantShadedRegionNote({ speech: 'The shaded overlap is the solution.', toolCalls: [{ name: 'show_coordinate_plane', args: {} }, { name: 'show_function_graph', args: { inequalities: ['y < 2x'] } }] }));
  check('net: a graph carrying `shadedRegion` still counts', !shouldPlantShadedRegionNote({ speech: 'shaded', toolCalls: [{ name: 'show_geometry', args: {} }, { name: 'show_function_graph', args: { shadedRegion: {} } }] }));
  check('net note asks for `inequalities` for a solution region', /`inequalities`/.test(SHADED_REGION_NOTE));
}

// ── 8. wiring ───────────────────────────────────────────────────────────────
{
  const renderer = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'whiteboard', 'DesmosGraphRenderer.tsx'), 'utf8');
  check('renderer draws `inequalities`', /data\.inequalities/.test(renderer) && /resolveInequalityEntry\(/.test(renderer));
  check('renderer draws dashed functions', /Styles\.DASHED/.test(renderer));
  check('renderer exposes labelled points as data-feature marks', /data-feature=\{/.test(renderer) && /graphPointFeatures\(/.test(renderer));
  const vtr = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
  check('orchestrator runs the gate on showGraph', /gateInequalityGraph\(/.test(vtr) && /TUTOR_GRAPH_REGION_CHECK/.test(vtr));
  const server = readFileSync(join(__dirname, '..', 'src', 'lib', 'tutor', 'whiteboard', 'process-tool-call.ts'), 'utf8');
  check('render-harness / server path runs the gate too', /gateInequalityGraph\(/.test(server));
}

console.log(failures === 0 ? '\nAll graph-inequality checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
