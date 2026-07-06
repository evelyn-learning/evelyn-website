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
check('show_diagram geologic_cross_section (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'geologic_cross_section', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram geologic_cross_section reverse, no unconformity → ok', () => {
  const r = processToolCall('show_diagram', { type: 'geologic_cross_section', params: { faultType: 'reverse', showUnconformity: false } });
  assert.equal(r.ok, true);
});
check('show_diagram hr_diagram (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'hr_diagram', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram hr_diagram highlight=giants → ok', () => {
  const r = processToolCall('show_diagram', { type: 'hr_diagram', params: { highlight: 'giants' } });
  assert.equal(r.ok, true);
});
check('show_diagram volcano_cross_section (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'volcano_cross_section', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram volcano_cross_section showSideVent=false → ok', () => {
  const r = processToolCall('show_diagram', { type: 'volcano_cross_section', params: { showSideVent: false } });
  assert.equal(r.ok, true);
});
check('show_diagram atmosphere_layers (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'atmosphere_layers', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram atmosphere_layers highlight=stratosphere → ok', () => {
  const r = processToolCall('show_diagram', { type: 'atmosphere_layers', params: { highlight: 'stratosphere' } });
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
check('show_diagram nuclear_decay (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'nuclear_decay', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram nuclear_decay mode=beta-minus → ok', () => {
  const r = processToolCall('show_diagram', { type: 'nuclear_decay', params: { mode: 'beta-minus' } });
  assert.equal(r.ok, true);
});
check('show_diagram nuclear_decay mode=gamma → ok', () => {
  const r = processToolCall('show_diagram', { type: 'nuclear_decay', params: { mode: 'gamma' } });
  assert.equal(r.ok, true);
});
check('show_diagram em_induction (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'em_induction', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram em_induction motion=out → ok', () => {
  const r = processToolCall('show_diagram', { type: 'em_induction', params: { motion: 'out' } });
  assert.equal(r.ok, true);
});
check('show_diagram magnetic_field_current (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'magnetic_field_current', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram magnetic_field_current conductor=solenoid → ok', () => {
  const r = processToolCall('show_diagram', { type: 'magnetic_field_current', params: { conductor: 'solenoid' } });
  assert.equal(r.ok, true);
});
check('show_diagram projectile_motion (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'projectile_motion', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram projectile_motion angle=60 → ok', () => {
  const r = processToolCall('show_diagram', { type: 'projectile_motion', params: { angle: 60, showComponents: false } });
  assert.equal(r.ok, true);
});
// Phase 20 — bio anatomy / physiology
check('show_diagram leaf_cross_section (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'leaf_cross_section', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram leaf_cross_section highlight=palisade → ok', () => {
  const r = processToolCall('show_diagram', { type: 'leaf_cross_section', params: { highlight: ['palisade', 'stoma'], showGasExchange: false } });
  assert.equal(r.ok, true);
});
check('show_diagram nephron (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'nephron', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram nephron highlight=loop_of_henle → ok', () => {
  const r = processToolCall('show_diagram', { type: 'nephron', params: { highlight: 'loop of henle', showFlow: false } });
  assert.equal(r.ok, true);
});
check('show_diagram digestive_system (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'digestive_system', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram digestive_system highlight=stomach → ok', () => {
  const r = processToolCall('show_diagram', { type: 'digestive_system', params: { highlight: ['stomach', 'liver'] } });
  assert.equal(r.ok, true);
});
check('show_diagram circulatory_system (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'circulatory_system', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram circulatory_system highlight=left_ventricle → ok', () => {
  const r = processToolCall('show_diagram', { type: 'circulatory_system', params: { highlight: ['left_ventricle', 'aorta'], title: 'Double circulation' } });
  assert.equal(r.ok, true);
});

// Phase 22 — computer science
check('show_diagram data_structure (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'data_structure', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram data_structure queue → ok', () => {
  const r = processToolCall('show_diagram', { type: 'data_structure', params: { structure: 'queue', items: ['1', '2', '3'] } });
  assert.equal(r.ok, true);
});
check('show_diagram data_structure linked_list → ok', () => {
  const r = processToolCall('show_diagram', { type: 'data_structure', params: { structure: 'linked_list', items: ['7', '4', '9'] } });
  assert.equal(r.ok, true);
});
check('show_diagram graph_diagram (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'graph_diagram', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram graph_diagram directed+weights+bfs → ok', () => {
  const r = processToolCall('show_diagram', {
    type: 'graph_diagram',
    params: { nodes: ['A', 'B', 'C', 'D'], edges: [['A', 'B', 5], ['A', 'C', 2], ['B', 'D', 1], ['C', 'D', 7]], directed: true, traversal: 'bfs' },
  });
  assert.equal(r.ok, true);
});
check('show_diagram hash_table (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'hash_table', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram hash_table size+entries → ok', () => {
  const r = processToolCall('show_diagram', { type: 'hash_table', params: { size: 5, entries: [['cat', '1'], ['dog', '2'], ['ant', '3']] } });
  assert.equal(r.ok, true);
});
check('show_diagram recursion_tree (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'recursion_tree', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram recursion_tree factorial n=5 → ok', () => {
  const r = processToolCall('show_diagram', { type: 'recursion_tree', params: { kind: 'factorial', n: 5 } });
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

console.log('process-tool-call: Phase 23 — molecular / cell biology');
check('show_diagram protein_synthesis (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'protein_synthesis', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram protein_synthesis stage=translation → ok', () => {
  const r = processToolCall('show_diagram', { type: 'protein_synthesis', params: { stage: 'translation' } });
  assert.equal(r.ok, true);
});
check('show_diagram enzyme_action (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'enzyme_action', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram enzyme_action model=induced_fit → ok', () => {
  const r = processToolCall('show_diagram', { type: 'enzyme_action', params: { model: 'induced_fit' } });
  assert.equal(r.ok, true);
});
check('show_diagram cell_cycle (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'cell_cycle', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram cell_cycle highlight=S → ok', () => {
  const r = processToolCall('show_diagram', { type: 'cell_cycle', params: { highlight: 'S' } });
  assert.equal(r.ok, true);
});
check('show_diagram gene_expression (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'gene_expression', params: {} });
  assert.equal(r.ok, true);
});
check('show_diagram gene_expression state=on → ok', () => {
  const r = processToolCall('show_diagram', { type: 'gene_expression', params: { state: 'on' } });
  assert.equal(r.ok, true);
});

console.log('process-tool-call: Phase 25 — elementary-math manipulatives');
check('show_diagram clock_face 3:15 → ok', () => {
  const r = processToolCall('show_diagram', { type: 'clock_face', params: { hour: 3, minute: 15 } });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram clock_face bare (12:00) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'clock_face', params: { hour: 12 } });
  assert.equal(r.ok, true);
});
check('show_diagram ten_frame count=7 → ok', () => {
  const r = processToolCall('show_diagram', { type: 'ten_frame', params: { count: 7 } });
  assert.equal(r.ok, true);
});
check('show_diagram ten_frame count=14 (two frames) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'ten_frame', params: { count: 14 } });
  assert.equal(r.ok, true);
});
check('show_diagram base_ten_blocks value=1342 → ok', () => {
  const r = processToolCall('show_diagram', { type: 'base_ten_blocks', params: { value: 1342 } });
  assert.equal(r.ok, true);
});

console.log('process-tool-call: Phase 26 — microeconomics');
check('show_diagram supply_demand (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'supply_demand', params: {} });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.command.action, 'showDiagram');
});
check('show_diagram supply_demand D shift right → ok', () => {
  const r = processToolCall('show_diagram', { type: 'supply_demand', params: { good: 'coffee', shift: { curve: 'D', direction: 'right' } } });
  assert.equal(r.ok, true);
});
check('show_diagram supply_demand price ceiling → ok', () => {
  const r = processToolCall('show_diagram', { type: 'supply_demand', params: { priceControl: { type: 'ceiling', level: 30 } } });
  assert.equal(r.ok, true);
});
check('show_diagram circular_flow (bare) → ok', () => {
  const r = processToolCall('show_diagram', { type: 'circular_flow', params: {} });
  assert.equal(r.ok, true);
});

console.log(`\nprocess-tool-call: ${passed} checks passed`);
