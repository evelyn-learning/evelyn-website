/**
 * Phase 12 ship-gate test — environmental/demographic manifests + renderer
 * DOM wiring (population_pyramid, climate_diagram).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase12-environmental.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildPopulationPyramidManifest,
  buildClimateDiagramManifest,
  populationPyramidFeatureNames,
  climateDiagramFeatureNames,
  solvePopulationPyramid,
  solveClimateDiagram,
} from '../src/lib/tutor/diagrams/catalog/kinds/environmental';

type Fail = { msg: string };
const failures: Fail[] = [];
function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const READ = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
const dispatcherSource = READ('src/lib/tutor/diagrams/manifests.ts');
const ppSource = READ('src/app/tutor/components/whiteboard/PopulationPyramidRenderer.tsx');
const cdSource = READ('src/app/tutor/components/whiteboard/ClimateDiagramRenderer.tsx');

// ── 1. population_pyramid ───────────────────────────────────────────────────
{
  const figure = solvePopulationPyramid({
    ageGroups: [
      ['0-4', 5.2, 5.0],
      ['5-9', 4.8, 4.6],
      ['10-14', 4.5, 4.3],
      ['65-69', 1.8, 2.4],
      ['80+', 0.4, 0.9],
    ],
    title: 'Nigeria (expanding)',
  });
  const m = buildPopulationPyramidManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(populationPyramidFeatureNames.diagram), 'pp has root');
  expect(names.has(populationPyramidFeatureNames.malesSide), 'pp has males side');
  expect(names.has(populationPyramidFeatureNames.femalesSide), 'pp has females side');
  expect(names.has(populationPyramidFeatureNames.base), 'pp has base feature');
  expect(names.has(populationPyramidFeatureNames.top), 'pp has top feature');
  expect(names.has(populationPyramidFeatureNames.ageGroup('0-4')), 'pp has 0-4 age group');
  expect(names.has(populationPyramidFeatureNames.maleBar('80+')), 'pp has male-80+ bar');
  expect(names.has(populationPyramidFeatureNames.femaleBar('0-4')), 'pp has female-0-4 bar');
  const base = m.find((f) => f.name === populationPyramidFeatureNames.base);
  expect(base?.displayName?.includes('0-4') ?? false, 'pp base displayName includes youngest age label');
  const top = m.find((f) => f.name === populationPyramidFeatureNames.top);
  expect(top?.displayName?.includes('80+') ?? false, 'pp top displayName includes oldest age label');
  expect(ppSource.includes('populationPyramidFeatureNames'), 'pp renderer imports helper');
  expect(ppSource.includes('data-feature={N.diagram}'), 'pp renderer marks root');
  expect(ppSource.includes('data-feature={N.malesSide}'), 'pp renderer marks males side');
  expect(ppSource.includes('data-feature={N.femalesSide}'), 'pp renderer marks females side');
  expect(ppSource.includes('N.ageGroup(g.ageLabel)'), 'pp renderer marks each age group row');
  expect(ppSource.includes('N.maleBar(g.ageLabel)'), 'pp renderer marks each male bar');
  expect(ppSource.includes('N.femaleBar(g.ageLabel)'), 'pp renderer marks each female bar');
  expect(ppSource.includes('data-feature={N.base}'), 'pp renderer marks base region');
  expect(ppSource.includes('data-feature={N.top}'), 'pp renderer marks top region');
}

// ── 2. climate_diagram ──────────────────────────────────────────────────────
{
  const figure = solveClimateDiagram({
    months: [
      ['Jan', 25, 250], ['Feb', 26, 210], ['Mar', 26, 250], ['Apr', 27, 240],
      ['May', 28, 220], ['Jun', 28, 175], ['Jul', 27, 165], ['Aug', 27, 175],
      ['Sep', 27, 200], ['Oct', 26, 220], ['Nov', 26, 250], ['Dec', 25, 280],
    ],
    location: 'Singapore',
  });
  const m = buildClimateDiagramManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(climateDiagramFeatureNames.diagram), 'cd has root');
  expect(names.has(climateDiagramFeatureNames.tempLine), 'cd has temp line');
  expect(names.has(climateDiagramFeatureNames.precipBars), 'cd has precip bars');
  expect(names.has(climateDiagramFeatureNames.month('Jan')), 'cd has Jan month');
  expect(names.has(climateDiagramFeatureNames.month('Jul')), 'cd has Jul month');
  expect(names.has(climateDiagramFeatureNames.meanTemp), 'cd has mean temp label (auto-computed)');
  expect(names.has(climateDiagramFeatureNames.totalPrecip), 'cd has total precip label (auto-computed)');
  expect(names.has(climateDiagramFeatureNames.location), 'cd has location label');
  const jul = m.find((f) => f.name === climateDiagramFeatureNames.month('Jul'));
  expect(!!jul?.labels?.includes('Jul'), 'cd month has bare label "Jul"');
  expect(
    !!jul?.labels?.some((l) => l.startsWith('Jul:')),
    'cd month carries verbose description-form label',
  );
  expect(cdSource.includes('climateDiagramFeatureNames'), 'cd renderer imports helper');
  expect(cdSource.includes('data-feature={N.diagram}'), 'cd renderer marks root');
  expect(cdSource.includes('data-feature={N.tempLine}'), 'cd renderer marks temp line');
  expect(cdSource.includes('data-feature={N.precipBars}'), 'cd renderer marks precip-bars group');
  expect(cdSource.includes('N.month(m.label)'), 'cd renderer marks each month bar');
  expect(cdSource.includes('smoothPath'), 'cd renderer uses smoothPath for temp line');
  // Verbose description-form label — brain emitted "monthly temperature
  // line (red)" verbatim in 2026-05-14 live test and was silently dropped.
  const tempLine = m.find((f) => f.name === climateDiagramFeatureNames.tempLine);
  expect(
    !!tempLine?.labels?.includes('monthly temperature line (red)'),
    'cd temp line carries verbose `monthly temperature line (red)` label',
  );
  const precipBars = m.find((f) => f.name === climateDiagramFeatureNames.precipBars);
  expect(
    !!precipBars?.labels?.includes('monthly precipitation bars (blue)'),
    'cd precip bars carries verbose `monthly precipitation bars (blue)` label',
  );
}

// ── 3. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of ['population_pyramid', 'climate_diagram']) {
  expect(dispatcherSource.includes(`case '${kind}'`), `manifests.ts dispatcher has case for '${kind}'`);
}

if (failures.length === 0) {
  console.log('✓ Phase 12 environmental: 2 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
