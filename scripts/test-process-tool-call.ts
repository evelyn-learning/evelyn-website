/**
 * Unit test for the process-tool-call seam (the render-harness substrate).
 * Mirrors the deterministic-core test style (test:conic, test:graph-consistency).
 *   npm run test:process-tool-call
 */
import assert from 'node:assert';
import { processToolCall, toAction, toWhiteboardCommand } from '../src/lib/tutor/whiteboard/process-tool-call';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

console.log('process-tool-call: stage-1 name → action mapping');
check('snake → camel', () => assert.equal(toAction('show_circuit'), 'showCircuit'));
check('multi-word snake → camel', () => assert.equal(toAction('show_geometry_constructed'), 'showGeometryConstructed'));
check('go_to_page → goToPage', () => assert.equal(toAction('go_to_page'), 'goToPage'));
check('show_function_graph → showGraph (override)', () => assert.equal(toAction('show_function_graph'), 'showGraph'));
check('show_diagram → showDiagram', () => assert.equal(toAction('show_diagram'), 'showDiagram'));
check('args spread top-level', () => {
  const cmd = toWhiteboardCommand('show_diagram', { type: 'aggregate_demand_supply', params: { foo: 1 } });
  assert.equal(cmd.action, 'showDiagram');
  assert.equal((cmd as Record<string, unknown>).type, 'aggregate_demand_supply');
});
check('showGraph nests args under data', () => {
  const cmd = toWhiteboardCommand('show_function_graph', { functions: [{ expr: 'x^2' }] });
  assert.equal(cmd.action, 'showGraph');
  assert.ok((cmd as Record<string, unknown>).data);
});

console.log('process-tool-call: happy paths (render-producing tools render)');
check('show_equation valid → ok', () => {
  const r = processToolCall('show_equation', { latex: 'Y = C + I + G + NX', label: 'GDP' });
  assert.equal(r.ok, true);
});
check('show_table with rows → ok', () => {
  const r = processToolCall('show_table', { headers: ['Year', 'GDP'], rows: [['2020', '21']] });
  assert.equal(r.ok, true);
});
check('show_diagram econ kind → ok', () => {
  const r = processToolCall('show_diagram', { type: 'aggregate_demand_supply', params: { shift: 'AD-right' } });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_stats passes through → ok', () => {
  const r = processToolCall('show_stats', { chartType: 'bar', data: [1, 2, 3] });
  assert.equal(r.ok, true);
});
check('show_diagram doppler_effect (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'doppler_effect', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram standing_wave n=3 → ok', () => {
  const r = processToolCall('show_diagram', { type: 'standing_wave', params: { harmonic: 3 } });
  assert.equal(r.ok, true);
});
check('show_diagram interference_pattern (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'interference_pattern', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram mitosis (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'mitosis', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram mitosis phase=metaphase → ok', () => {
  const r = processToolCall('show_diagram', { type: 'mitosis', params: { phase: 'metaphase' } });
  assert.equal(r.ok, true);
});
check('show_diagram meiosis (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'meiosis', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram meiosis stage=crossing_over → ok', () => {
  const r = processToolCall('show_diagram', { type: 'meiosis', params: { stage: 'crossing over' } });
  assert.equal(r.ok, true);
});
check('show_diagram dna_replication (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'dna_replication', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram dna_replication showEnzymes=false → ok', () => {
  const r = processToolCall('show_diagram', { type: 'dna_replication', params: { showEnzymes: false } });
  assert.equal(r.ok, true);
});
check('show_diagram cell_membrane (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'cell_membrane', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram cell_membrane mode=active → ok', () => {
  const r = processToolCall('show_diagram', { type: 'cell_membrane', params: { mode: 'active' } });
  assert.equal(r.ok, true);
});
check('show_diagram bohr_model (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'bohr_model', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram bohr_model element=Na → ok', () => {
  const r = processToolCall('show_diagram', { type: 'bohr_model', params: { element: 'Na' } });
  assert.equal(r.ok, true);
});
check('show_diagram bohr_model explicit protons/shells → ok', () => {
  const r = processToolCall('show_diagram', { type: 'bohr_model', params: { protons: 8, neutrons: 8, shells: [2, 6] } });
  assert.equal(r.ok, true);
});
check('show_diagram galvanic_cell (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'galvanic_cell', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram galvanic_cell Mg/Ag → ok', () => {
  const r = processToolCall('show_diagram', { type: 'galvanic_cell', params: { anodeMetal: 'Mg', cathodeMetal: 'Ag' } });
  assert.equal(r.ok, true);
});
check('show_diagram titration_curve (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'titration_curve', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram titration_curve type=weak-strong → ok', () => {
  const r = processToolCall('show_diagram', { type: 'titration_curve', params: { type: 'weak-strong' } });
  assert.equal(r.ok, true);
});
check('show_diagram crystal_lattice (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'crystal_lattice', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram crystal_lattice type=fcc → ok', () => {
  const r = processToolCall('show_diagram', { type: 'crystal_lattice', params: { type: 'fcc' } });
  assert.equal(r.ok, true);
});
check('show_diagram crystal_lattice type=bcc → ok', () => {
  const r = processToolCall('show_diagram', { type: 'crystal_lattice', params: { type: 'bcc' } });
  assert.equal(r.ok, true);
});

console.log('process-tool-call: validator-layer rejections (the bug-prone path)');
check('show_table empty rows → rejected', () => {
  const r = processToolCall('show_table', { headers: ['A'], rows: [] });
  assert.equal(r.ok, false);
});
check('show_molecule blank smiles → rejected', () => {
  const r = processToolCall('show_molecule', { smiles: '' });
  assert.equal(r.ok, false);
});
check('show_equation placeholder latex → rejected', () => {
  const r = processToolCall('show_equation', { latex: '[Using the multiplier formula]' });
  assert.equal(r.ok, false);
});
check('show_problem short statement → rejected', () => {
  const r = processToolCall('show_problem', { problem: { statement: 'hi' } });
  assert.equal(r.ok, false);
});
check('show_function_graph polar-as-Cartesian-implicit (expr has y) → rejected', () => {
  const r = processToolCall('show_function_graph', { functions: [{ expr: '\\sqrt{x^2+y^2} - 2 - 2*(x/\\sqrt{x^2+y^2})', label: 'cardioid' }], xRange: [-5, 5], yRange: [-4, 4] });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /polar_graph|references y/i);
});
check('show_function_graph plain y=f(x) cubic → ok', () => {
  const r = processToolCall('show_function_graph', { functions: [{ expr: 'x^3 - 3x', label: 'f' }], xRange: [-3, 3], yRange: [-4, 4] });
  assert.equal(r.ok, true);
});
check('curve-less conic (no prior) → rejected with hint', () => {
  const r = processToolCall('show_geometry_constructed', {
    title: 'Ellipse with directrices',
    given: [],
    steps: [{ id: 'd', kind: 'conic_directrix', conic: 'e' }],
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /base curve|curve step/i);
});

console.log(`\nprocess-tool-call: ${passed} checks passed`);
