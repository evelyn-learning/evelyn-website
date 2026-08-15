/**
 * Phase 3 ship-gate test — chem/bio remaining manifests + renderer
 * DOM wiring (electron_configuration, orbital_diagram,
 * periodic_table_highlight, punnett_square).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase3-chembio.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildElectronConfigurationManifest,
  buildOrbitalDiagramManifest,
  buildPeriodicTableHighlightManifest,
  buildPunnettSquareManifest,
  electronConfigurationFeatureNames,
  orbitalDiagramFeatureNames,
  periodicTableHighlightFeatureNames,
  punnettSquareFeatureNames,
  solveElectronConfiguration,
  solveOrbitalDiagram,
  solvePeriodicTableHighlight,
  solvePunnettSquare,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/chem-bio';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const electronRenderer = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/app/tutor/components/whiteboard/CatalogElectronConfigurationRenderer.tsx'),
  'utf8',
);
const orbitalRenderer = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/app/tutor/components/whiteboard/CatalogOrbitalDiagramRenderer.tsx'),
  'utf8',
);
const periodicRenderer = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/app/tutor/components/whiteboard/CatalogPeriodicTableHighlightRenderer.tsx'),
  'utf8',
);
const punnettRenderer = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/app/tutor/components/whiteboard/CatalogPunnettSquareRenderer.tsx'),
  'utf8',
);
const dispatcherSource = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/lib/tutor/diagrams/manifests.ts'),
  'utf8',
);

// ── 1. electron_configuration ───────────────────────────────────────────────
{
  const figure = solveElectronConfiguration({ element: 'C' });
  const manifest = buildElectronConfigurationManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('notation'), 'electron_configuration manifest has "notation"');
  expect(names.has('element'), 'electron_configuration manifest has "element"');
  expect(names.has('subshell-1'), 'electron_configuration manifest has subshell-1');
  expect(names.has('subshell-2'), 'electron_configuration manifest has subshell-2');
  expect(names.has('subshell-3'), 'electron_configuration manifest has subshell-3 (C → 1s², 2s², 2p²)');
  const s1 = manifest.find((f) => f.name === 'subshell-1');
  expect(!!(s1?.labels ?? []).includes('1s'), 'subshell-1 carries the literal "1s" as a label');
  expect(electronRenderer.includes('electronConfigurationFeatureNames'), 'electron renderer imports helper');
  expect(electronRenderer.includes('data-feature={N.notation}'), 'electron renderer sets data-feature on notation block');
  expect(electronRenderer.includes('data-feature={N.subshell(i)}'), 'electron renderer sets data-feature on each subshell span');
}

// ── 2. orbital_diagram ──────────────────────────────────────────────────────
{
  const figure = solveOrbitalDiagram({ element: 'N' });
  const manifest = buildOrbitalDiagramManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('orbital-diagram'), 'orbital_diagram manifest has "orbital-diagram"');
  expect(names.has('element'), 'orbital_diagram manifest has "element"');
  expect(names.has('shell-1'), 'orbital_diagram manifest has shell-1');
  expect(names.has('shell-3'), 'orbital_diagram manifest has shell-3 (N → 1s, 2s, 2p)');
  const shell3 = manifest.find((f) => f.name === 'shell-3');
  expect(!!(shell3?.labels ?? []).includes('2p'), 'shell-3 (2p) carries literal subshell label');
  expect(!!(shell3?.labels ?? []).includes('shell-2p'), 'shell-3 carries semantic subshell-slug label');
  expect(orbitalRenderer.includes('orbitalDiagramFeatureNames'), 'orbital renderer imports helper');
  expect(orbitalRenderer.includes('data-feature={N.orbital}'), 'orbital renderer sets data-feature on root');
  expect(orbitalRenderer.includes('data-feature={N.shell(i)}'), 'orbital renderer sets data-feature on each shell row');
}

// ── 3. periodic_table_highlight ─────────────────────────────────────────────
{
  const figure = solvePeriodicTableHighlight({
    highlights: [
      { element: 'Na', color: '#fbbf24', label: 'sodium' },
      { element: 'Cl', color: '#22c55e', label: 'chlorine' },
    ],
    title: 'Salt building blocks',
  });
  const manifest = buildPeriodicTableHighlightManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('table'), 'periodic_table_highlight manifest has "table"');
  expect(names.has('element-Na'), 'manifest has element-Na for the Na highlight');
  expect(names.has('element-Cl'), 'manifest has element-Cl for the Cl highlight');
  const na = manifest.find((f) => f.name === 'element-Na');
  expect(!!(na?.labels ?? []).includes('sodium'), 'element-Na carries the human label "sodium"');
  expect(periodicRenderer.includes('periodicTableHighlightFeatureNames'), 'periodic renderer imports helper');
  expect(periodicRenderer.includes('data-feature={N.table}'), 'periodic renderer sets data-feature on root SVG');
  expect(periodicRenderer.includes('N.element(sym)'), 'periodic renderer sets data-feature on highlighted cells');
}

// ── 4. punnett_square ───────────────────────────────────────────────────────
{
  const figure = solvePunnettSquare({ parentA: 'Bb', parentB: 'Bb' });
  const manifest = buildPunnettSquareManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('punnett'), 'punnett manifest has "punnett"');
  expect(names.has('parent-a'), 'punnett manifest has parent-a');
  expect(names.has('parent-b'), 'punnett manifest has parent-b');
  expect(names.has('a-gamete-1'), 'punnett manifest has a-gamete-1');
  expect(names.has('b-gamete-2'), 'punnett manifest has b-gamete-2');
  expect(names.has('cell-r1-c1'), 'punnett manifest has cell-r1-c1');
  expect(names.has('cell-r2-c2'), 'punnett manifest has cell-r2-c2');
  const cell11 = manifest.find((f) => f.name === 'cell-r1-c1');
  expect(!!cell11?.displayName, 'cell-r1-c1 has a displayName (the genotype)');
  expect(punnettRenderer.includes('punnettSquareFeatureNames'), 'punnett renderer imports helper');
  expect(punnettRenderer.includes('data-feature={N.punnett}'), 'punnett renderer sets data-feature on root');
  expect(punnettRenderer.includes('data-feature={N.cell(r, k)}'), 'punnett renderer sets data-feature on each cell');
}

// ── 5. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of ['electron_configuration', 'orbital_diagram', 'periodic_table_highlight', 'punnett_square']) {
  expect(
    dispatcherSource.includes(`case '${kind}'`),
    `manifests.ts dispatcher has case for '${kind}'`,
  );
}

// ── Report ──
if (failures.length === 0) {
  console.log('✓ Phase 3 chem/bio: 4 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
