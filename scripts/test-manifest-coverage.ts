/**
 * Value-blindness coverage tests (audit 2026-07-23, after live round 5 /
 * session-1784778855564): the board snapshot (item title + non-region
 * feature descriptions) is the brain's ONLY per-turn view of its own cards.
 * These tests assert that the VALUES on value-bearing cards actually reach
 * a snapshot-visible feature description — the failure mode behind the
 * hallucinated f_k=15 / invented 20N problem was values that existed only
 * in render args.
 *
 * Run: npx tsx scripts/test-manifest-coverage.ts
 */
import { buildManifestForCommand, buildGenericContentManifest } from '../src/lib/tutor/diagrams/manifests';
import type { WhiteboardCommand } from '../src/lib/knowledge/types';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

/** Snapshot-visible text = what getSnapshot would surface (non-region,
 *  described features). Mirrors catalog.ts getSnapshot's filter. */
function visibleText(cmd: Record<string, unknown>): string {
  const m = buildManifestForCommand(cmd as unknown as WhiteboardCommand) ?? [];
  return m.filter((f) => f.kind !== 'region' && !!f.description).map((f) => f.description).join(' | ');
}

// ─── The two live-diagnosed cards ───
const tyText = visibleText({ action: 'showTryYourself', problem: 'A 5 kg box is pushed with a net force of 30 N. What is its acceleration?', expectedAnswer: '6' });
check('try-yourself: statement visible', tyText.includes('30 N'), tyText);
check('try-yourself: expected answer visible', tyText.includes('expected answer: 6'));

const fbdText = visibleText({
  action: 'showFreeBodyDiagram',
  object: { label: 'm', shape: 'box', mass: '10 kg' },
  surface: { type: 'inclined', angle: 30, friction: true },
  forces: [{ name: 'f_k', direction: 'down-slope', magnitude: 'f_k' }, { name: 'F_app', direction: 'up-slope', magnitude: '60 N' }],
  notes: 'm = 10 kg, F_app = 60 N up the slope, f_k = 10 N, θ = 30°',
});
check('FBD: mass value visible', fbdText.includes('mass 10 kg'), fbdText);
check('FBD: notes givens visible', fbdText.includes('f_k = 10 N'));
check('FBD: numeric magnitude visible', fbdText.includes('60 N'));

// ─── Problem card: statement verbatim (was a placeholder string) ───
const probText = visibleText({ action: 'showProblem', problem: { statement: 'A car of mass 800 kg accelerates at 3 m/s². What is the net force?', title: 'Net force' } });
check('problem: statement text visible', probText.includes('800 kg'), probText);

// ─── Iframe cards: plotted/structural content (builders took no args) ───
const graphText = visibleText({ action: 'showGraph', data: { functions: [{ expr: 'x^2 - 4', label: 'parabola' }], points: [{ x: 2, y: 0, label: 'root' }] } });
check('graph: function expr visible', graphText.includes('x^2 - 4'), graphText);
check('graph: point visible', graphText.includes('(2, 0)'));

const molText = visibleText({ action: 'showMolecule', smiles: 'CCO', title: 'Ethanol' });
check('molecule: SMILES visible', molText.includes('CCO'), molText);

// ─── Generic content fallback: previously manifest-less actions ───
const matrixText = visibleText({ action: 'showMatrix', rows: [[1, 2], [3, 4]], label: 'A' });
check('matrix (no bespoke case): cell values via generic fallback', matrixText.includes('1') && matrixText.includes('4'), matrixText);

const punnettText = visibleText({ action: 'showPunnett', parent1: 'Aa', parent2: 'aa', trait: 'seed color' });
check('punnett: genotypes via generic fallback', punnettText.includes('Aa') && punnettText.includes('aa'), punnettText);

const balText = visibleText({ action: 'showBalancedEquation', equation: 'Fe + O2 -> Fe2O3' });
check('balanced equation via generic fallback', balText.includes('Fe + O2'), balText);

const workedText = visibleText({ action: 'showWorkedExample', example: { title: 'Quotient rule', steps: [{ text: 'f(x) = x^2 / (x+1)' }] } });
check('worked example via generic fallback', workedText.includes('x^2 / (x+1)'), workedText);

// ─── show_diagram catch-all kinds: params now visible via fallback ───
const pieText = visibleText({ action: 'showDiagram', type: 'pie_chart', params: { title: 'Budget', slices: [{ label: 'Rent', value: 40 }, { label: 'Food', value: 25 }] } });
check('pie_chart (catch-all kind): values visible', pieText.includes('Rent') && pieText.includes('40'), pieText);

// ─── Physics builders: dropped numbers now carried ───
const collText = visibleText({ action: 'showCollision', dimension: '1D', type: 'elastic', before: [{ label: 'A', mass: 2, velocity: 3 }, { label: 'B', mass: 1, velocity: -1 }], after: [] });
check('collision: velocity visible', collText.includes('v = 3'), collText);

const ebText = visibleText({ action: 'showEnergyBars', positions: [{ label: 'Top', pe: 100, ke: 0 }, { label: 'Bottom', pe: 0, ke: 100 }] });
check('energy bars: component values visible', ebText.includes('PE 100 J'), ebText);

const waveText = visibleText({ action: 'showWave', wave: { wavelength: 2, amplitude: 0.5 }, frequency: 4 });
check('wave: frequency visible', waveText.includes('f = 4 Hz'), waveText);

const projText = visibleText({ action: 'showProjectileMotion', v0: 20, angle: 30, g: 10, notes: 'launched from a cliff' });
check('projectile: g + notes visible', projText.includes('g = 10') && projText.includes('cliff'), projText);

const boxText = visibleText({ action: 'showStats', type: 'boxplot', boxplot: { datasets: [{ label: 'Scores', min: 2, q1: 4, median: 6, q3: 8, max: 10 }] } });
check('boxplot: five-number summary visible', boxText.includes('Q1 4') && boxText.includes('Q3 8'), boxText);

const motionText = visibleText({ action: 'showMotionDiagram', series: [{ kind: 'velocity', points: [{ t: 0, value: 0 }, { t: 1, value: 5 }] }] });
check('motion diagram: series values visible', motionText.includes('(1, 5)'), motionText);

const ptText = visibleText({ action: 'showPeriodicTable', highlight: ['Na', 'Cl'] });
check('periodic table: highlight visible', ptText.includes('Na'), ptText.slice(0, 120));

// ─── Generic fallback hygiene ───
check('meta action → no generic manifest', buildGenericContentManifest({ action: 'newPage', title: 'X' }) === null);
check('empty show command → null (title-only, as before)', buildGenericContentManifest({ action: 'showSomething' }) === null);
const generic = buildGenericContentManifest({ action: 'showCallStack', frames: [{ fn: 'main', locals: { x: 42 } }] });
check('generic fallback is snapshot-visible (non-region)', !!generic && generic[0].kind !== 'region' && generic[0].description.includes('42'));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} manifest-coverage tests passed.`);
