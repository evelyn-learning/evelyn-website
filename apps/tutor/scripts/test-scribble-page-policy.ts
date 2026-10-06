/**
 * A scribble never yanks the board to another page (scribble-page-policy.ts),
 * and a repeat mark on one feature is dropped.
 *
 * Fixture: the board of the live voice session portal-897212b5 (2026-10-06)
 * at the moment the tutor painted its shaded graph and scribbled on "origin".
 * Built with the REAL catalog and the REAL feature manifests, so the test
 * covers the resolver, the graph's new point features, and the policy.
 *
 * Run: npx tsx scripts/test-scribble-page-policy.ts
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { WhiteboardCatalog } from '../src/lib/tutor/whiteboard/catalog';
import { buildManifestForCommand } from '../src/lib/tutor/diagrams/manifests';
import { planScribbleTarget, isRepeatScribble } from '../src/lib/tutor/whiteboard/scribble-page-policy';

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${!cond && detail ? ` (${detail})` : ''}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function add(cat: WhiteboardCatalog, itemId: string, cmd: any, title?: string) {
  cat.append({ itemId, action: cmd.action, title, features: buildManifestForCommand(cmd) ?? [] });
}

const PLANE_6 = {
  action: 'showCoordinatePlane',
  title: 'Second boundary line',
  points: [{ x: 0, y: -0.667, label: 'y-intercept (0, -2/3)' }, { x: 2, y: 0, label: '(2, 0)' }],
  segments: [{ from: { x: -4, y: -2 }, to: { x: 5, y: 1 }, label: 'y = (1/3)x - 2/3' }],
  vectors: [],
};
const GRAPH_WITH_ORIGIN = {
  action: 'showGraph', type: 'generic-xy',
  data: {
    title: 'Shading the solution region', xRange: [-4, 5], yRange: [-4, 6],
    functions: [{ latex: '-2x + 4', label: 'y = -2x + 4' }, { latex: 'x/3 - 2/3', label: 'y = x/3 - 2/3' }],
    points: [{ x: 0, y: 0, label: 'origin' }],
    shadedRegion: { axis: 'x', between: ['-2x+4', 'x/3 - 2/3'], from: -4, to: 0.5 },
  },
};
const GRAPH_NO_POINTS = { ...GRAPH_WITH_ORIGIN, data: { ...GRAPH_WITH_ORIGIN.data, points: [] } };

/** The voice session's board up to turn 59, then turn 60 paints a graph. */
function board(graph: typeof GRAPH_WITH_ORIGIN | null): WhiteboardCatalog {
  const cat = new WhiteboardCatalog();
  cat.setCurrentTurn(10);
  cat.openPage({ title: 'Problem 1: System of Inequalities' });
  add(cat, 'showEquation-3', { action: 'showEquation', latex: 'y < \\frac{x-2}{3}', label: 'Isolating y — second inequality, solved' }, 'Isolating y — second inequality, solved');
  cat.setCurrentTurn(40);
  cat.openPage({ title: 'Second boundary line' });
  add(cat, 'showCoordinatePlane-6', PLANE_6, 'Second boundary line');
  cat.setCurrentTurn(54);
  add(cat, 'showEquation-18', { action: 'showEquation', latex: '0 < -\\frac{2}{3}', label: 'Test point (0,0) in second inequality — result' }, 'Test point (0,0) in second inequality — result');
  if (graph) {
    cat.setCurrentTurn(60);
    cat.openPage({ title: 'Shading the solution region' });
    add(cat, 'showGraph-1', graph, 'Shading the solution region');
  }
  return cat;
}

// ── the live defect ─────────────────────────────────────────────────────────
{
  // As it was: the graph has no "origin" feature → board-wide match is the old plane.
  const cat = board(GRAPH_NO_POINTS);
  const resolved = cat.resolveTarget('origin');
  check('fixture: board-wide "origin" resolves to the OLD coordinate plane', resolved.ok && resolved.itemId === 'showCoordinatePlane-6');
  const plan = planScribbleTarget(cat, 'origin', resolved);
  check('same turn as a new graph on another page ⇒ the scribble is dropped, not a page switch', plan.action === 'drop', JSON.stringify(plan));
  check('…with an advisory naming the page and what to do', plan.action === 'drop' && /page 2 "Second boundary line"/.test(plan.advisory) && /never switches pages/.test(plan.advisory), plan.action === 'drop' ? plan.advisory : '');

  // With item 2: the graph's labelled point IS a feature → resolves on the graph.
  const cat2 = board(GRAPH_WITH_ORIGIN);
  const r2 = cat2.resolveTarget('origin');
  check('with point features, "origin" resolves ON the new graph', r2.ok && r2.itemId === 'showGraph-1' && r2.scribbleable === true && r2.canonical === 'point-origin', JSON.stringify(r2));
  check('…and the policy keeps it', planScribbleTarget(cat2, 'origin', r2).action === 'keep');
  check('"(0, 0)" resolves on the graph too', (() => { const r = cat2.resolveTarget('(0, 0)'); return r.ok && r.itemId === 'showGraph-1'; })());

  // The following turn (no render): the page in view is still the graph's page.
  cat2.setCurrentTurn(63);
  const r3 = cat2.resolveTarget('origin');
  check('next turn, nothing painted: still on the graph, kept', r3.ok && r3.itemId === 'showGraph-1' && planScribbleTarget(cat2, 'origin', r3).action === 'keep');
  cat.setCurrentTurn(63);
  check('next turn on the old board: still no page switch', planScribbleTarget(cat, 'origin', cat.resolveTarget('origin')).action === 'drop');
}

// ── retarget ────────────────────────────────────────────────────────────────
{
  // Board-wide resolution prefers the newest item, so to exercise the retarget
  // the brain page-qualifies to the old page while a new figure with the same
  // feature was painted this turn.
  const cat = board(GRAPH_WITH_ORIGIN);
  const scoped = cat.resolveTarget('origin', { page: 2 });
  check('fixture: page-qualified "origin" resolves to the old plane', scoped.ok && scoped.itemId === 'showCoordinatePlane-6' && !scoped.pageFallback);
  const plan = planScribbleTarget(cat, 'origin', scoped, { explicitPage: true });
  check('a figure painted this turn has the feature ⇒ retarget to it, even with an explicit page', plan.action === 'retarget' && plan.result.itemId === 'showGraph-1' && plan.why === 'painted_this_turn', JSON.stringify(plan));

  // Nothing painted this turn, target on the page in view via another item.
  const cat2 = board(null);
  cat2.setCurrentTurn(70);
  cat2.openPage({ title: 'Problem 1: System of Inequalities (cont.)' });
  add(cat2, 'showCoordinatePlane-9', { action: 'showCoordinatePlane', title: 'Both lines', points: [], segments: [], vectors: [] }, 'Both lines');
  cat2.setCurrentTurn(72);
  const old = cat2.resolveTarget('origin', { page: 2 });
  const p2 = planScribbleTarget(cat2, 'origin', old, { explicitPage: false });
  check('a matching feature on the page in view ⇒ retarget there', p2.action === 'retarget' && p2.result.itemId === 'showCoordinatePlane-9' && p2.why === 'page_in_view', JSON.stringify(p2));
}

// ── deliberate navigation still works ───────────────────────────────────────
{
  const cat = board(GRAPH_NO_POINTS);
  cat.setCurrentTurn(64); // a later turn that paints nothing
  const scoped = cat.resolveTarget('line y = (1/3)x - 2/3', { page: 2 });
  check('fixture: an old-page feature resolves when page-qualified', scoped.ok && scoped.itemId === 'showCoordinatePlane-6' && !scoped.pageFallback, JSON.stringify(scoped));
  check('explicit page + nothing painted this turn ⇒ allowed (deliberate)', planScribbleTarget(cat, 'line y = (1/3)x - 2/3', scoped, { explicitPage: true }).action === 'keep');
  check('the same without an explicit page ⇒ dropped', planScribbleTarget(cat, 'line y = (1/3)x - 2/3', scoped, { explicitPage: false }).action === 'drop');
  // …but not on a turn that paints something new elsewhere.
  const cat2 = board(GRAPH_NO_POINTS); // turn 60 painted the graph
  const s2 = cat2.resolveTarget('line y = (1/3)x - 2/3', { page: 2 });
  check('explicit page on a turn that painted a new figure ⇒ dropped (it would hide the new figure)', planScribbleTarget(cat2, 'line y = (1/3)x - 2/3', s2, { explicitPage: true }).action === 'drop');
}

// ── same-page marks are untouched ───────────────────────────────────────────
{
  const cat = board(null);
  cat.setCurrentTurn(58);
  const r = cat.resolveTarget('Test point (0,0) in second inequality — result');
  check('a mark on the page in view is kept', r.ok && planScribbleTarget(cat, 'x', r).action === 'keep');
  const miss = cat.resolveTarget('no such thing at all');
  check('an unresolved target is left to the existing miss handling', !miss.ok && planScribbleTarget(cat, 'no such thing at all', miss).action === 'keep');
  const empty = new WhiteboardCatalog();
  empty.append({ itemId: 'showEquation-1', action: 'showEquation', title: 'E', features: buildManifestForCommand({ action: 'showEquation', latex: 'x=1', label: 'E' } as never) ?? [] });
  const re = empty.resolveTarget('E');
  check('a board with no page model is left alone', re.ok && planScribbleTarget(empty, 'E', re).action === 'keep');
}

// ── scoped resolution ───────────────────────────────────────────────────────
{
  const cat = board(GRAPH_WITH_ORIGIN);
  check('resolveTargetWithin never leaves its scope', cat.resolveTargetWithin('origin', new Set(['showEquation-3'])) === null);
  check('resolveTargetWithin finds the feature inside its scope', cat.resolveTargetWithin('origin', new Set(['showCoordinatePlane-6']))?.itemId === 'showCoordinatePlane-6');
  check('resolveTargetWithin strips a leading kind word', cat.resolveTargetWithin('point origin', new Set(['showGraph-1']))?.canonical === 'point-origin');
  check('resolveTargetWithin with an empty scope is null', cat.resolveTargetWithin('origin', new Set()) === null);
  check('the whole-graph feature is still not markable', (() => { const r = cat.resolveTarget('the graph'); return r.ok && r.scribbleable === false; })());
}

// ── repeat marks ────────────────────────────────────────────────────────────
{
  // scribble-5 and scribble-6 of the session: same feature, same shape, captions differ.
  const prior = [
    { action: 'showGraph', id: 'showGraph-1' },
    { action: 'scribble', target: 'origin', shape: 'tick', label: 'test point', targetId: 'showCoordinatePlane-6', targetFeature: 'origin', id: 'scribble-5' },
  ];
  check('same feature + same shape, different caption ⇒ repeat', isRepeatScribble(prior, { targetId: 'showCoordinatePlane-6', targetFeature: 'origin', shape: 'tick' }));
  check('a different shape on the same feature is not a repeat', !isRepeatScribble(prior, { targetId: 'showCoordinatePlane-6', targetFeature: 'origin', shape: 'circle' }));
  check('the same feature name on another item is not a repeat', !isRepeatScribble(prior, { targetId: 'showGraph-1', targetFeature: 'origin', shape: 'tick' }));
  check('another feature of the same item is not a repeat', !isRepeatScribble(prior, { targetId: 'showCoordinatePlane-6', targetFeature: 'x-axis', shape: 'tick' }));
  check('nothing on the board ⇒ not a repeat', !isRepeatScribble([], { targetId: 'a', targetFeature: 'b', shape: 'tick' }));
  check('an unresolved mark is never a repeat', !isRepeatScribble(prior, { shape: 'tick' }));
}

// ── wiring ──────────────────────────────────────────────────────────────────
{
  const vtr = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
  check('orchestrator consults the page policy before stamping a scribble', /planScribbleTarget\(catalogRef\.current, raw, resolvedBoardWide/.test(vtr) && /TUTOR_SCRIBBLE_STAY_ON_PAGE/.test(vtr));
  check('a dropped mark reaches the brain through the unrealized-marks advisory', /unrealizedMarkRef\.current\.push\(pagePlan\.advisory\)/.test(vtr));
  check('repeat marks are dropped', /isRepeatScribble\(whiteboardCommandsRef\.current/.test(vtr));
  check('id → position lookup matches by id (order drifts after removals)', /const isTarget = typeof cId === 'string' \? cId === targetId : o === entry\.order;/.test(vtr));
  check('a resolved-but-unlocatable scroll leaves a drop event', /resolved but not locatable on a page/.test(vtr));
}

console.log(failures === 0 ? '\nAll scribble page-policy checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
