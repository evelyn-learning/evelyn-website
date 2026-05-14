/**
 * Phase 6 ship-gate test — advanced math manifests + renderer DOM
 * wiring (unit_circle, transformation, inequality_graph) +
 * legacy show_unit_circle deprecation.
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase6-advanced-math.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildUnitCircleManifest,
  buildTransformationManifest,
  buildInequalityGraphManifest,
  unitCircleFeatureNames,
  transformationFeatureNames,
  inequalityGraphFeatureNames,
  solveUnitCircle,
  solveTransformation,
  solveInequalityGraph,
} from '../src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const rendererSource = readFileSync(
  join(__dirname, '..', 'src/app/tutor/components/whiteboard/CatalogAdvancedRenderers.tsx'),
  'utf8',
);
const dispatcherSource = readFileSync(
  join(__dirname, '..', 'src/lib/tutor/diagrams/manifests.ts'),
  'utf8',
);
const toolDefsSource = readFileSync(
  join(__dirname, '..', 'src/app/tutor/hooks/toolDefinitions.ts'),
  'utf8',
);

// ── 1. unit_circle ──────────────────────────────────────────────────────────
{
  const figure = solveUnitCircle({ angleDegrees: 60, showSinCos: true });
  const manifest = buildUnitCircleManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(unitCircleFeatureNames.circle), 'unit_circle has circle root');
  expect(names.has(unitCircleFeatureNames.angle), 'unit_circle has angle ray');
  expect(names.has(unitCircleFeatureNames.endpoint), 'unit_circle has endpoint');
  expect(names.has(unitCircleFeatureNames.cosLine), 'unit_circle has cos-line when showSinCos=true');
  expect(names.has(unitCircleFeatureNames.sinLine), 'unit_circle has sin-line when showSinCos=true');
  expect(names.has(unitCircleFeatureNames.thetaLabel), 'unit_circle has theta-label');
  const cos = manifest.find((f) => f.name === unitCircleFeatureNames.cosLine);
  expect(cos?.displayName === 'cos', 'cos line displayName is "cos"');
  expect(rendererSource.includes('unitCircleFeatureNames'), 'renderer imports unitCircleFeatureNames');
  expect(rendererSource.includes('data-feature={N.circle}'), 'renderer sets data-feature on root');
  expect(rendererSource.includes('data-feature={N.angle}'), 'renderer sets data-feature on angle ray');
  expect(rendererSource.includes('data-feature={N.endpoint}'), 'renderer sets data-feature on endpoint');
  // showSinCos=false should hide cos/sin features.
  const figNoSinCos = solveUnitCircle({ angleDegrees: 30, showSinCos: false });
  const manifestNoSinCos = buildUnitCircleManifest(figNoSinCos);
  const namesNoSinCos = new Set(manifestNoSinCos.map((f) => f.name));
  expect(!namesNoSinCos.has(unitCircleFeatureNames.cosLine), 'cos-line absent when showSinCos=false');
}

// ── 2. transformation ───────────────────────────────────────────────────────
{
  const figure = solveTransformation({
    shape: {
      type: 'triangle',
      vertices: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 3 }],
    },
    transform: { type: 'translate', tx: 4, ty: 0 },
    title: 'Slide Right',
  });
  const manifest = buildTransformationManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(transformationFeatureNames.diagram), 'transformation has root');
  expect(names.has(transformationFeatureNames.preimage), 'transformation has preimage');
  expect(names.has(transformationFeatureNames.image), 'transformation has image');
  expect(names.has(transformationFeatureNames.transformLabel), 'transformation has transform-label');
  const preimg = manifest.find((f) => f.name === transformationFeatureNames.preimage);
  expect(preimg?.displayName === 'pre-image', 'pre-image displayName is "pre-image"');
  expect(
    !!preimg?.labels?.includes('original shape'),
    'pre-image carries "original shape" as a label',
  );
  const tlabel = manifest.find((f) => f.name === transformationFeatureNames.transformLabel);
  expect(
    !!tlabel?.displayName?.includes('translate'),
    'transform-label displayName includes the transform type',
  );
  expect(rendererSource.includes('transformationFeatureNames'), 'renderer imports transformationFeatureNames');
  expect(rendererSource.includes('data-feature={N.diagram}'), 'renderer sets data-feature on root');
  expect(rendererSource.includes('data-feature={N.preimage}'), 'renderer sets data-feature on pre-image path');
  expect(rendererSource.includes('data-feature={N.image}'), 'renderer sets data-feature on image path');
}

// ── 3. inequality_graph ─────────────────────────────────────────────────────
{
  const figure = solveInequalityGraph({ variable: 'x', operator: '<=', value: 3 });
  const manifest = buildInequalityGraphManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(inequalityGraphFeatureNames.numberLine), 'inequality_graph has number-line root');
  expect(names.has(inequalityGraphFeatureNames.ray), 'inequality_graph has ray');
  expect(names.has(inequalityGraphFeatureNames.endpoint), 'inequality_graph has endpoint');
  expect(names.has(inequalityGraphFeatureNames.inequalityLabel), 'inequality_graph has inequality-label');
  const endpoint = manifest.find((f) => f.name === inequalityGraphFeatureNames.endpoint);
  expect(
    !!endpoint?.labels?.includes('closed circle'),
    'closed endpoint (operator <=/>=) carries "closed circle" label',
  );
  // Verbose description-format target — brain copied this verbatim
  // from the manifest's description field in 2026-05-13 testing and
  // it rejected. Must be in labels.
  expect(
    !!endpoint?.labels?.includes('endpoint at 3 (closed/filled)'),
    'closed endpoint carries verbose `endpoint at X (closed/filled)` label',
  );
  const figOpen = solveInequalityGraph({ variable: 'x', operator: '<', value: 3 });
  const manifestOpen = buildInequalityGraphManifest(figOpen);
  const endpointOpen = manifestOpen.find((f) => f.name === inequalityGraphFeatureNames.endpoint);
  expect(
    !!endpointOpen?.labels?.includes('open circle'),
    'open endpoint (operator </>) carries "open circle" label',
  );
  const label = manifest.find((f) => f.name === inequalityGraphFeatureNames.inequalityLabel);
  expect(label?.displayName === 'x <= 3', 'inequality-label displayName is the rendered text');
  expect(rendererSource.includes('inequalityGraphFeatureNames'), 'renderer imports inequalityGraphFeatureNames');
  expect(rendererSource.includes('data-feature={N.numberLine}'), 'renderer sets data-feature on root');
  expect(rendererSource.includes('data-feature={N.ray}'), 'renderer sets data-feature on ray');
  expect(rendererSource.includes('data-feature={N.endpoint}'), 'renderer sets data-feature on endpoint');
}

// ── 4. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of ['unit_circle', 'transformation', 'inequality_graph']) {
  expect(
    dispatcherSource.includes(`case '${kind}'`),
    `manifests.ts dispatcher has case for '${kind}'`,
  );
}

// ── 5. legacy show_unit_circle deprecation ──────────────────────────────────
{
  const ucDef = toolDefsSource.match(/name:\s*'show_unit_circle',[\s\S]{0,300}?description:\s*'([^']+)'/);
  expect(!!ucDef, 'show_unit_circle tool definition is findable');
  if (ucDef) {
    expect(
      ucDef[1].includes('DEPRECATED'),
      'show_unit_circle description carries DEPRECATED prefix',
    );
    expect(
      ucDef[1].includes('unit_circle'),
      'show_unit_circle description points at the catalog kind "unit_circle"',
    );
  }
}

// ── Report ──
if (failures.length === 0) {
  console.log('✓ Phase 6 advanced math: 3 kinds × manifest + renderer wiring + dispatcher + legacy deprecation, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
