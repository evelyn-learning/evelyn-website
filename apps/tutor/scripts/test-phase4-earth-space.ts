/**
 * Phase 4 ship-gate test — earth & space manifests + renderer DOM
 * wiring (phases_of_moon, solar_system, earth_layers, eclipse_diagram,
 * seasons_diagram, plate_tectonics).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase4-earth-space.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildPhasesOfMoonManifest,
  buildSolarSystemManifest,
  buildEarthLayersManifest,
  buildEclipseDiagramManifest,
  buildSeasonsDiagramManifest,
  buildPlateTectonicsManifest,
  phasesOfMoonFeatureNames,
  solarSystemFeatureNames,
  earthLayersFeatureNames,
  eclipseDiagramFeatureNames,
  seasonsDiagramFeatureNames,
  plateTectonicsFeatureNames,
  solvePhasesOfMoon,
  solveSolarSystem,
  solveEarthLayers,
  solveEclipseDiagram,
  solveSeasonsDiagram,
  solvePlateTectonics,
} from '../src/lib/tutor/diagrams/catalog/kinds/earth-space';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const rendererSource = readFileSync(
  join(__dirname, '..', 'src/app/tutor/components/whiteboard/CatalogEarthSpaceRenderers.tsx'),
  'utf8',
);
const dispatcherSource = readFileSync(
  join(__dirname, '..', 'src/lib/tutor/diagrams/manifests.ts'),
  'utf8',
);

// ── 1. phases_of_moon ───────────────────────────────────────────────────────
{
  const figure = solvePhasesOfMoon({ phase: 'waxing_crescent' });
  const manifest = buildPhasesOfMoonManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(phasesOfMoonFeatureNames.moon), 'phases_of_moon manifest has "moon"');
  expect(names.has(phasesOfMoonFeatureNames.litSide), 'phases_of_moon manifest has "lit-side"');
  expect(names.has(phasesOfMoonFeatureNames.darkSide), 'phases_of_moon manifest has "dark-side"');
  expect(names.has(phasesOfMoonFeatureNames.phaseLabel), 'phases_of_moon manifest has "phase-label"');
  const phaseLabel = manifest.find((f) => f.name === phasesOfMoonFeatureNames.phaseLabel);
  expect(!!phaseLabel?.displayName, 'phase-label has a displayName');
  expect(rendererSource.includes('phasesOfMoonFeatureNames'), 'renderer imports phasesOfMoonFeatureNames');
  expect(rendererSource.includes('data-feature={N.moon}'), 'renderer sets data-feature on moon root');
  expect(rendererSource.includes('data-feature={N.litSide}'), 'renderer sets data-feature on lit-side rect');
  expect(rendererSource.includes('data-feature={N.phaseLabel}'), 'renderer sets data-feature on phase label');
}

// ── 2. solar_system ─────────────────────────────────────────────────────────
{
  const figure = solveSolarSystem({ highlight: ['Earth', 'Mars'] });
  const manifest = buildSolarSystemManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(solarSystemFeatureNames.system), 'solar_system manifest has system root');
  expect(names.has(solarSystemFeatureNames.sun), 'solar_system manifest has Sun');
  expect(names.has(solarSystemFeatureNames.planet('Earth')), 'solar_system manifest has Earth');
  expect(names.has(solarSystemFeatureNames.planet('Neptune')), 'solar_system manifest has Neptune');
  const earth = manifest.find((f) => f.name === solarSystemFeatureNames.planet('Earth'));
  expect(earth?.displayName === 'Earth', 'Earth displayName is "Earth"');
  expect(rendererSource.includes('solarSystemFeatureNames'), 'renderer imports solarSystemFeatureNames');
  expect(rendererSource.includes('data-feature={N.system}'), 'renderer sets data-feature on solar-system root');
  expect(rendererSource.includes('data-feature={N.planet(p.name)}'), 'renderer sets data-feature on each planet');
}

// ── 3. earth_layers ─────────────────────────────────────────────────────────
{
  const figure = solveEarthLayers({});
  const manifest = buildEarthLayersManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(earthLayersFeatureNames.earth), 'earth_layers manifest has root');
  // Default model: Crust, Mantle, Outer Core, Inner Core
  expect(names.has(earthLayersFeatureNames.layer('Crust')), 'earth_layers has Crust layer');
  expect(names.has(earthLayersFeatureNames.layer('Outer Core')), 'earth_layers has "Outer Core" layer (slugged)');
  expect(names.has(earthLayersFeatureNames.layer('Inner Core')), 'earth_layers has "Inner Core" layer');
  const crust = manifest.find((f) => f.name === earthLayersFeatureNames.layer('Crust'));
  expect(crust?.displayName === 'Crust', 'Crust displayName is "Crust"');
  expect(rendererSource.includes('earthLayersFeatureNames'), 'renderer imports earthLayersFeatureNames');
  expect(rendererSource.includes('data-feature={N.earth}'), 'renderer sets data-feature on earth-layers root');
  expect(rendererSource.includes('data-feature={N.layer(layerName)}'), 'renderer sets data-feature on each layer circle');
}

// ── 4. eclipse_diagram ──────────────────────────────────────────────────────
{
  // Defaults: when brain omits `type`, solver should fall back to 'solar'
  // instead of throwing. (Brain frequently confuses outer/inner type.)
  const defaulted = solveEclipseDiagram({ title: 'Eclipse' });
  expect(defaulted.type === 'solar', 'eclipse_diagram defaults to type="solar" when omitted');
  const lunar = solveEclipseDiagram({ type: 'lunar' });
  expect(lunar.type === 'lunar', 'eclipse_diagram preserves explicit type="lunar"');

  const figure = solveEclipseDiagram({ type: 'solar' });
  const manifest = buildEclipseDiagramManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(eclipseDiagramFeatureNames.eclipse), 'eclipse_diagram manifest has root');
  expect(names.has(eclipseDiagramFeatureNames.sun), 'eclipse_diagram manifest has Sun');
  expect(names.has(eclipseDiagramFeatureNames.moon), 'eclipse_diagram manifest has Moon');
  expect(names.has(eclipseDiagramFeatureNames.earth), 'eclipse_diagram manifest has Earth');
  expect(names.has(eclipseDiagramFeatureNames.alignmentLine), 'eclipse_diagram manifest has alignment-line');
  expect(rendererSource.includes('eclipseDiagramFeatureNames'), 'renderer imports eclipseDiagramFeatureNames');
  expect(rendererSource.includes('data-feature={N.eclipse}'), 'renderer sets data-feature on eclipse root');
  expect(rendererSource.includes('data-feature={N.alignmentLine}'), 'renderer sets data-feature on alignment line');
}

// ── 5. seasons_diagram ──────────────────────────────────────────────────────
{
  const figure = solveSeasonsDiagram({ hemisphere: 'northern' });
  const manifest = buildSeasonsDiagramManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(seasonsDiagramFeatureNames.orbit), 'seasons_diagram manifest has orbit root');
  expect(names.has(seasonsDiagramFeatureNames.sun), 'seasons_diagram manifest has Sun');
  for (const s of ['Summer', 'Autumn', 'Winter', 'Spring']) {
    expect(
      names.has(seasonsDiagramFeatureNames.season(s)),
      `seasons_diagram manifest has season "${s}"`,
    );
  }
  expect(rendererSource.includes('seasonsDiagramFeatureNames'), 'renderer imports seasonsDiagramFeatureNames');
  expect(rendererSource.includes('data-feature={N.orbit}'), 'renderer sets data-feature on orbit root');
  expect(rendererSource.includes('data-feature={N.season(s.name)}'), 'renderer sets data-feature on each season position');
}

// ── 6. plate_tectonics ──────────────────────────────────────────────────────
{
  // Defaults: when brain omits `boundary`, solver should fall back to
  // 'convergent' instead of throwing. (Same audio-gibberish-retry guard
  // as eclipse_diagram.)
  const defaulted = solvePlateTectonics({ title: 'Plates' });
  expect(defaulted.boundary === 'convergent', 'plate_tectonics defaults to boundary="convergent" when omitted');
  const transform = solvePlateTectonics({ boundary: 'transform' });
  expect(transform.boundary === 'transform', 'plate_tectonics preserves explicit boundary="transform"');

  const figure = solvePlateTectonics({
    boundary: 'convergent',
    labels: { left: 'Indian', right: 'Eurasian' },
  });
  const manifest = buildPlateTectonicsManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(plateTectonicsFeatureNames.boundary), 'plate_tectonics manifest has boundary root');
  expect(names.has(plateTectonicsFeatureNames.plateA), 'plate_tectonics manifest has plate-a');
  expect(names.has(plateTectonicsFeatureNames.plateB), 'plate_tectonics manifest has plate-b');
  expect(names.has(plateTectonicsFeatureNames.boundaryLabel), 'plate_tectonics manifest has boundary-label');
  const plateA = manifest.find((f) => f.name === plateTectonicsFeatureNames.plateA);
  expect(plateA?.displayName === 'Indian', 'plate-a displayName picks up custom label "Indian"');
  expect(rendererSource.includes('plateTectonicsFeatureNames'), 'renderer imports plateTectonicsFeatureNames');
  expect(rendererSource.includes('data-feature={N.boundary}'), 'renderer sets data-feature on boundary root');
  expect(rendererSource.includes('data-feature={N.plateA}'), 'renderer sets data-feature on plate A rect');
  expect(rendererSource.includes('data-feature={N.plateB}'), 'renderer sets data-feature on plate B rect');
}

// ── 7. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of [
  'phases_of_moon',
  'solar_system',
  'earth_layers',
  'eclipse_diagram',
  'seasons_diagram',
  'plate_tectonics',
]) {
  expect(
    dispatcherSource.includes(`case '${kind}'`),
    `manifests.ts dispatcher has case for '${kind}'`,
  );
}

// ── Report ──
if (failures.length === 0) {
  console.log('✓ Phase 4 earth-space: 6 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
