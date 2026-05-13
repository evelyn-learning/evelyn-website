/**
 * Phase 2a ship-gate test — organizer manifests + renderer DOM wiring.
 *
 * Verifies each of the 5 Phase 2a organizer kinds:
 *   - t_chart
 *   - kwl_chart
 *   - frayer_model
 *   - argument_structure
 *   - government_branches
 *
 * For each kind, the test confirms:
 *   1. buildXxxManifest returns the expected feature names and shape.
 *   2. The shared naming helper exports match what the manifest emits.
 *   3. CatalogAdvancedRenderers.tsx imports the naming helper AND
 *      emits data-feature attrs for the key feature names (verified
 *      by static source-string check, since we can't render React
 *      components in ts-node without DOM setup).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase2a-organizers.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildTChartManifest,
  buildKwlChartManifest,
  buildFrayerModelManifest,
  buildArgumentStructureManifest,
  buildGovernmentBranchesManifest,
  tChartFeatureNames,
  kwlChartFeatureNames,
  frayerModelFeatureNames,
  argumentStructureFeatureNames,
  governmentBranchesFeatureNames,
  solveOrganizer,
  solveArgumentStructure,
  solveGovernmentBranches,
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

function expectInSource(token: string, kindLabel: string): void {
  expect(
    rendererSource.includes(token),
    `${kindLabel}: renderer source missing token "${token}"`,
  );
}

// ── t_chart ──────────────────────────────────────────────────────
{
  const figure = solveOrganizer('t_chart', {
    leftHeader: 'Pros',
    rightHeader: 'Cons',
    leftItems: ['Saves time', 'Easy to use'],
    rightItems: ['Costs money', 'Hard to learn'],
  });
  const manifest = buildTChartManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('chart'), 't_chart: missing "chart"');
  expect(names.has('left-header'), 't_chart: missing "left-header"');
  expect(names.has('right-header'), 't_chart: missing "right-header"');
  expect(names.has('left-column'), 't_chart: missing "left-column"');
  expect(names.has('right-column'), 't_chart: missing "right-column"');
  expect(names.has('left-item-1'), 't_chart: missing "left-item-1"');
  expect(names.has('left-item-2'), 't_chart: missing "left-item-2"');
  expect(names.has('right-item-1'), 't_chart: missing "right-item-1"');
  expect(names.has('right-item-2'), 't_chart: missing "right-item-2"');
  // Helper sanity
  expect(tChartFeatureNames.leftItem(0) === 'left-item-1', 't_chart helper leftItem(0)');
  expect(tChartFeatureNames.rightItem(1) === 'right-item-2', 't_chart helper rightItem(1)');
  // Content aliases
  const leftCol = manifest.find((f) => f.name === 'left-column');
  expect(!!(leftCol?.labels?.some((l) => l.toLowerCase().includes('pros'))), 't_chart: left-column missing content alias');
  // Renderer source
  expectInSource('tChartFeatureNames', 't_chart');
  expectInSource('data-feature={N.chart}', 't_chart');
  expectInSource('data-feature={N.leftHeader}', 't_chart');
  expectInSource('data-feature={N.rightHeader}', 't_chart');
  expectInSource('data-feature={N.leftItem(i)}', 't_chart');
  expectInSource('data-feature={N.rightItem(i)}', 't_chart');
}

// ── kwl_chart ────────────────────────────────────────────────────
{
  const figure = solveOrganizer('kwl_chart', {
    know: ['Plants need water'],
    want: ['How do plants make food?'],
    learned: ['Photosynthesis uses sunlight'],
  });
  const manifest = buildKwlChartManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('chart'), 'kwl: missing "chart"');
  expect(names.has('k-column'), 'kwl: missing "k-column"');
  expect(names.has('w-column'), 'kwl: missing "w-column"');
  expect(names.has('l-column'), 'kwl: missing "l-column"');
  expect(names.has('k-item-1'), 'kwl: missing "k-item-1"');
  expect(names.has('w-item-1'), 'kwl: missing "w-item-1"');
  expect(names.has('l-item-1'), 'kwl: missing "l-item-1"');
  expect(kwlChartFeatureNames.kItem(0) === 'k-item-1', 'kwl helper kItem(0)');
  expectInSource('kwlChartFeatureNames', 'kwl');
  expectInSource('data-feature={col.col}', 'kwl');
  expectInSource('data-feature={col.item(j)}', 'kwl');
}

// ── frayer_model ─────────────────────────────────────────────────
{
  const figure = solveOrganizer('frayer_model', {
    term: 'photosynthesis',
    definition: 'How plants make food from light',
    characteristics: ['Requires sunlight', 'Uses CO2'],
    examples: ['Sunflower', 'Tree'],
    nonExamples: ['Rock', 'Fungus'],
  });
  const manifest = buildFrayerModelManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('frayer'), 'frayer: missing "frayer"');
  expect(names.has('term'), 'frayer: missing "term"');
  expect(names.has('definition'), 'frayer: missing "definition"');
  expect(names.has('characteristics'), 'frayer: missing "characteristics"');
  expect(names.has('examples'), 'frayer: missing "examples"');
  expect(names.has('non-examples'), 'frayer: missing "non-examples"');
  expect(names.has('characteristic-item-1'), 'frayer: missing "characteristic-item-1"');
  expect(names.has('example-item-1'), 'frayer: missing "example-item-1"');
  expect(names.has('non-example-item-1'), 'frayer: missing "non-example-item-1"');
  // Term label includes the actual term text
  const termFeature = manifest.find((f) => f.name === 'term');
  expect(!!(termFeature?.labels?.includes('photosynthesis')), 'frayer: term label missing content');
  expectInSource('frayerModelFeatureNames', 'frayer');
  expectInSource('data-feature={N.frayer}', 'frayer');
  expectInSource('data-feature={N.term}', 'frayer');
  expectInSource('data-feature={N.definition}', 'frayer');
  expectInSource('data-feature={N.characteristics}', 'frayer');
  expectInSource('data-feature={N.examples}', 'frayer');
  expectInSource('data-feature={N.nonExamples}', 'frayer');
}

// ── argument_structure ──────────────────────────────────────────
{
  const figure = solveArgumentStructure({
    claim: 'School should start later',
    evidence: ['Teens need more sleep', 'Better focus in afternoon'],
    reasoning: ['Sleep is essential for learning'],
    counter: 'Working parents need early drop-off',
    rebuttal: 'After-school programs can fill the gap',
  });
  const manifest = buildArgumentStructureManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('argument'), 'argument: missing "argument"');
  expect(names.has('claim'), 'argument: missing "claim"');
  expect(names.has('evidence'), 'argument: missing "evidence"');
  expect(names.has('reasoning'), 'argument: missing "reasoning"');
  expect(names.has('counter'), 'argument: missing "counter"');
  expect(names.has('rebuttal'), 'argument: missing "rebuttal"');
  expect(names.has('evidence-item-1'), 'argument: missing "evidence-item-1"');
  expect(names.has('evidence-item-2'), 'argument: missing "evidence-item-2"');
  expect(names.has('reasoning-item-1'), 'argument: missing "reasoning-item-1"');
  expectInSource('argumentStructureFeatureNames', 'argument');
  expectInSource('data-feature={N.argument}', 'argument');
  expectInSource('data-feature={N.claim}', 'argument');
  expectInSource('data-feature={N.evidence}', 'argument');
  expectInSource('data-feature={N.reasoning}', 'argument');
  expectInSource('data-feature={N.evidenceItem(i)}', 'argument');
  expectInSource('data-feature={N.reasoningItem(i)}', 'argument');
  expectInSource('data-feature={N.counter}', 'argument');
  expectInSource('data-feature={N.rebuttal}', 'argument');
}

// ── government_branches ─────────────────────────────────────────
{
  const figure = solveGovernmentBranches({
    country: 'United States',
    branches: [
      { name: 'Executive', bodies: ['President'], powers: ['Veto laws', 'Command military'] },
      { name: 'Legislative', bodies: ['Senate', 'House'], powers: ['Make laws'] },
      { name: 'Judicial', bodies: ['Supreme Court'], powers: ['Interpret laws'] },
    ],
  });
  const manifest = buildGovernmentBranchesManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('branches'), 'gov: missing "branches"');
  expect(names.has('country'), 'gov: missing "country"');
  expect(names.has('branch-1'), 'gov: missing "branch-1"');
  expect(names.has('branch-2'), 'gov: missing "branch-2"');
  expect(names.has('branch-3'), 'gov: missing "branch-3"');
  expect(names.has('branch-1-bodies'), 'gov: missing "branch-1-bodies"');
  expect(names.has('branch-1-powers'), 'gov: missing "branch-1-powers"');
  // Content alias by branch name
  const b1 = manifest.find((f) => f.name === 'branch-1');
  expect(!!(b1?.labels?.includes('Executive')), 'gov: branch-1 missing content alias');
  expectInSource('governmentBranchesFeatureNames', 'gov');
  expectInSource('data-feature={N.branches}', 'gov');
  expectInSource('data-feature={N.country}', 'gov');
  expectInSource('data-feature={N.branch(i)}', 'gov');
  expectInSource('data-feature={N.branchBodies(i)}', 'gov');
  expectInSource('data-feature={N.branchPowers(i)}', 'gov');
}

// ── Manifest dispatcher coverage ────────────────────────────────
{
  // Quick check that the dispatcher in manifests.ts handles each kind.
  // Read source and verify the case labels appear.
  const dispatcherSource = readFileSync(
    join(__dirname, '..', 'src/lib/tutor/diagrams/manifests.ts'),
    'utf8',
  );
  expect(dispatcherSource.includes("case 't_chart':"), 'dispatcher: missing case t_chart');
  expect(dispatcherSource.includes("case 'kwl_chart':"), 'dispatcher: missing case kwl_chart');
  expect(dispatcherSource.includes("case 'frayer_model':"), 'dispatcher: missing case frayer_model');
  expect(dispatcherSource.includes("case 'argument_structure':"), 'dispatcher: missing case argument_structure');
  expect(dispatcherSource.includes("case 'government_branches':"), 'dispatcher: missing case government_branches');
}

// ── Report ───────────────────────────────────────────────────────
if (failures.length === 0) {
  console.log('✓ Phase 2a organizers: 5 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
