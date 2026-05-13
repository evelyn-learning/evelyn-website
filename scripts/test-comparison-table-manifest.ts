/**
 * Structural test for the comparison_table manifest <-> renderer
 * naming convention. Phase 1 of the whiteboard markup initiative
 * (audit 2026-05-13).
 *
 * What this verifies:
 *   1. buildComparisonTableManifest returns the feature-name shape
 *      we depend on (table, header-row, col-N, row-N, cell-rN-cM).
 *   2. The names match comparisonTableFeatureNames helper outputs
 *      exactly — proves the manifest and the renderer (both consume
 *      the helper) cannot drift.
 *   3. CatalogAdvancedRenderers.tsx imports + uses the helper, so
 *      the DOM markers are wired to the same source of truth.
 *
 * Run with: npx ts-node -r tsconfig-paths/register --compiler-options
 *   '{"module":"commonjs","baseUrl":"./"}' scripts/test-comparison-table-manifest.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildComparisonTableManifest,
  comparisonTableFeatureNames,
  solveComparisonTable,
} from '../src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

function eq<T>(actual: T, expected: T, msg: string): void {
  if (actual !== expected) failures.push({ msg: `${msg} — expected ${String(expected)}, got ${String(actual)}` });
}

// ── Fixture ──
const figure = solveComparisonTable({
  items: ['Solid', 'Liquid', 'Gas'],
  attributes: ['Shape', 'Volume', 'Compressibility'],
  cells: [
    ['Fixed', 'Takes container shape', 'Fills container'],
    ['Definite', 'Definite', 'Variable'],
    ['Near-zero', 'Slight', 'High'],
  ],
  title: 'States of Matter',
});

const manifest = buildComparisonTableManifest(figure);

// ── 1. Feature shape ──
const names = new Set(manifest.map((f) => f.name));
expect(names.has('table'), 'manifest missing "table"');
expect(names.has('header-row'), 'manifest missing "header-row"');
for (let i = 0; i < 3; i++) {
  expect(names.has(`col-${i + 1}`), `manifest missing col-${i + 1}`);
  expect(names.has(`row-${i + 1}`), `manifest missing row-${i + 1}`);
}
for (let ri = 0; ri < 3; ri++) {
  for (let ci = 0; ci < 3; ci++) {
    expect(names.has(`cell-r${ri + 1}-c${ci + 1}`), `manifest missing cell-r${ri + 1}-c${ci + 1}`);
  }
}

// ── 2. Helper match ──
eq(comparisonTableFeatureNames.table, 'table', 'helper.table');
eq(comparisonTableFeatureNames.headerRow, 'header-row', 'helper.headerRow');
eq(comparisonTableFeatureNames.col(0), 'col-1', 'helper.col(0)');
eq(comparisonTableFeatureNames.col(2), 'col-3', 'helper.col(2)');
eq(comparisonTableFeatureNames.row(0), 'row-1', 'helper.row(0)');
eq(comparisonTableFeatureNames.cell(0, 0), 'cell-r1-c1', 'helper.cell(0,0)');
eq(comparisonTableFeatureNames.cell(2, 2), 'cell-r3-c3', 'helper.cell(2,2)');

// Cross-check: every manifest name with structure should equal helper output.
for (let i = 0; i < figure.items.length; i++) {
  expect(names.has(comparisonTableFeatureNames.col(i)), `manifest missing helper.col(${i})`);
}
for (let i = 0; i < figure.attributes.length; i++) {
  expect(names.has(comparisonTableFeatureNames.row(i)), `manifest missing helper.row(${i})`);
}
for (let ri = 0; ri < figure.attributes.length; ri++) {
  for (let ci = 0; ci < figure.items.length; ci++) {
    expect(names.has(comparisonTableFeatureNames.cell(ri, ci)), `manifest missing helper.cell(${ri},${ci})`);
  }
}

// ── 3. Scribbleability ──
const tableFeature = manifest.find((f) => f.name === 'table');
expect(tableFeature?.scribbleable === true, 'table must be scribbleable');
const headerRowFeature = manifest.find((f) => f.name === 'header-row');
expect(headerRowFeature?.scribbleable === true, 'header-row must be scribbleable');
const row1 = manifest.find((f) => f.name === 'row-1');
expect(row1?.scribbleable === true, 'row-1 must be scribbleable');
expect(row1?.kind === 'area', 'row-1 must be kind "area" to pass snapshot filter');
const col1 = manifest.find((f) => f.name === 'col-1');
expect(col1?.kind === 'area', 'col-1 must be kind "area" to pass snapshot filter');
const cell11 = manifest.find((f) => f.name === 'cell-r1-c1');
expect(cell11?.scribbleable === true, 'cell-r1-c1 must be scribbleable');
expect(cell11?.kind === 'label', 'cell-r1-c1 must be kind "label"');

// ── 4. Content aliases on rows + cols (Phase 1 grilling decision Q4-b) ──
const compressibilityRow = manifest.find((f) => f.name === 'row-3');
const compressibilityLabels = compressibilityRow?.labels ?? [];
expect(
  compressibilityLabels.some((l) => l.toLowerCase().includes('compressibility')),
  'row-3 (Compressibility) must carry content-aware labels',
);
const solidCol = manifest.find((f) => f.name === 'col-1');
const solidLabels = solidCol?.labels ?? [];
expect(
  solidLabels.some((l) => l.toLowerCase().includes('solid')),
  'col-1 (Solid) must carry content-aware labels',
);

// ── 5. Renderer DOM wiring (static source check) ──
const rendererSource = readFileSync(
  join(__dirname, '..', 'src/app/tutor/components/whiteboard/CatalogAdvancedRenderers.tsx'),
  'utf8',
);
expect(
  rendererSource.includes('comparisonTableFeatureNames'),
  'CatalogAdvancedRenderers.tsx must import comparisonTableFeatureNames',
);
expect(rendererSource.includes('data-feature={N.table}'), 'renderer must set data-feature-id on outer <table>');
expect(rendererSource.includes('data-feature={N.headerRow}'), 'renderer must set data-feature-id on header <tr>');
expect(rendererSource.includes('data-feature={N.col('), 'renderer must set data-feature-id on each item <th>');
expect(rendererSource.includes('data-feature={N.row('), 'renderer must set data-feature-id on each attribute <tr>');
expect(rendererSource.includes('data-feature={N.cell('), 'renderer must set data-feature-id on each cell <td>');

// ── Report ──
if (failures.length === 0) {
  console.log(`✓ comparison_table manifest <-> renderer: ${manifest.length} features, all checks passed.`);
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
