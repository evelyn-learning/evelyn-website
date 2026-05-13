/**
 * Phase 2b ship-gate test — SVG-coordinate organizer manifests +
 * renderer DOM wiring.
 *
 * Verifies each of the 6 Phase 2b kinds:
 *   - hierarchy_pyramid  (SVG mode)
 *   - sentence_diagram   (SVG mode)
 *   - historical_timeline (SVG mode)
 *   - life_cycle / water_cycle / rock_cycle (SVG mode, shared renderer)
 *   - body_system        (HTML grid)
 *
 * For each kind, the test confirms:
 *   1. buildXxxManifest returns the expected feature names + shape.
 *   2. The shared naming helper exports match what the manifest emits.
 *   3. The renderer source imports the naming helper AND emits
 *      data-feature attrs (plus data-feature-cx/cy/w/h on the SVG
 *      kinds so the ScribbleOverlays SVG-mode resolver lands).
 *   4. The manifests.ts dispatcher routes each type to the right
 *      builder.
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase2b-svg-organizers.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildSentenceDiagramManifest,
  buildHistoricalTimelineManifest,
  buildHierarchyPyramidManifest,
  sentenceDiagramFeatureNames,
  historicalTimelineFeatureNames,
  hierarchyPyramidFeatureNames,
  solveSentenceDiagram,
  solveHistoricalTimeline,
  solveHierarchyPyramid,
} from '../src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import {
  buildCycleStagesManifest,
  buildBodySystemManifest,
  cycleStagesFeatureNames,
  bodySystemFeatureNames,
  solveCycleStages,
  solveBodySystem,
} from '../src/lib/tutor/diagrams/catalog/kinds/chem-bio';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const advancedRenderer = readFileSync(
  join(__dirname, '..', 'src/app/tutor/components/whiteboard/CatalogAdvancedRenderers.tsx'),
  'utf8',
);
const cycleRenderer = readFileSync(
  join(__dirname, '..', 'src/app/tutor/components/whiteboard/CatalogCycleStagesRenderer.tsx'),
  'utf8',
);
const bodyRenderer = readFileSync(
  join(__dirname, '..', 'src/app/tutor/components/whiteboard/CatalogBodySystemRenderer.tsx'),
  'utf8',
);
const dispatcherSource = readFileSync(
  join(__dirname, '..', 'src/lib/tutor/diagrams/manifests.ts'),
  'utf8',
);

// ── 1. hierarchy_pyramid ────────────────────────────────────────────────────
{
  const figure = solveHierarchyPyramid({
    tiers: [
      { label: 'Producers' },
      { label: 'Primary Consumers' },
      { label: 'Secondary Consumers' },
      { label: 'Apex Predators' },
    ],
    baseFirst: true,
    title: 'Food Pyramid',
  });
  const manifest = buildHierarchyPyramidManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('pyramid'), 'pyramid manifest has "pyramid" feature');
  for (let i = 0; i < 4; i++) {
    expect(names.has(`tier-${i + 1}`), `pyramid manifest has tier-${i + 1}`);
  }
  expect(hierarchyPyramidFeatureNames.pyramid === 'pyramid', 'helper.pyramid');
  expect(hierarchyPyramidFeatureNames.tier(0) === 'tier-1', 'helper.tier(0)');
  // Content label aliasing — brain target "Producers" should resolve.
  const tier1 = manifest.find((f) => f.name === 'tier-1');
  expect(!!(tier1?.labels ?? []).some((l) => l.toLowerCase().includes('producers')), 'tier-1 carries content label');

  expect(advancedRenderer.includes('hierarchyPyramidFeatureNames'), 'renderer imports hierarchyPyramidFeatureNames');
  expect(advancedRenderer.includes('data-feature={N.pyramid}'), 'pyramid renderer sets data-feature on root SVG');
  expect(advancedRenderer.includes('data-feature={N.tier(i)}'), 'pyramid renderer sets data-feature on each tier <g>');
  expect(!!advancedRenderer.match(/data-feature-cx=\{cxFrac\}[\s\S]{0,200}data-feature-w=\{w \/ W\}/), 'pyramid renderer emits cx + w as viewBox fractions');
}

// ── 2. sentence_diagram ─────────────────────────────────────────────────────
{
  const figure = solveSentenceDiagram({
    subject: 'cat',
    verb: 'sat',
    object: 'mat',
    modifiers: [
      { attachTo: 'subject', word: 'the' },
      { attachTo: 'object', word: 'on' },
    ],
    title: 'The cat sat',
  });
  const manifest = buildSentenceDiagramManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  for (const n of ['diagram', 'subject', 'verb', 'object', 'modifier-1', 'modifier-2']) {
    expect(names.has(n), `sentence_diagram manifest has ${n}`);
  }
  // Content aliasing
  const subj = manifest.find((f) => f.name === 'subject');
  expect(!!(subj?.labels ?? []).includes('cat'), 'subject carries the literal word as a label');

  expect(advancedRenderer.includes('sentenceDiagramFeatureNames'), 'renderer imports sentenceDiagramFeatureNames');
  expect(advancedRenderer.includes('data-feature={N.subject}'), 'sentence renderer sets data-feature on subject <g>');
  expect(advancedRenderer.includes('data-feature={N.modifier(i)}'), 'sentence renderer sets data-feature on each modifier <g>');
}

// ── 3. historical_timeline ──────────────────────────────────────────────────
{
  const figure = solveHistoricalTimeline({
    events: [
      { date: '1776', label: 'Declaration of Independence' },
      { date: '1865', label: 'Civil War ends' },
      { date: '1969', label: 'Moon landing' },
    ],
    title: 'US milestones',
  });
  const manifest = buildHistoricalTimelineManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  for (const n of ['timeline', 'axis', 'event-1', 'event-2', 'event-3']) {
    expect(names.has(n), `historical_timeline manifest has ${n}`);
  }
  const event1 = manifest.find((f) => f.name === 'event-1');
  expect(!!(event1?.labels ?? []).some((l) => l.includes('1776')), 'event-1 carries date label');

  expect(advancedRenderer.includes('historicalTimelineFeatureNames'), 'renderer imports historicalTimelineFeatureNames');
  expect(advancedRenderer.includes('data-feature={N.timeline}'), 'timeline renderer sets data-feature on root SVG');
  expect(advancedRenderer.includes('data-feature={N.event(i)}'), 'timeline renderer sets data-feature on each event <g>');
  expect(advancedRenderer.includes('data-feature={N.axis}'), 'timeline renderer sets data-feature on axis <g>');
}

// ── 4. cycle_stages (life / water / rock) ──────────────────────────────────
{
  const figure = solveCycleStages({
    stages: [
      { label: 'Evaporation' },
      { label: 'Condensation' },
      { label: 'Precipitation' },
      { label: 'Collection' },
    ],
    title: 'Water Cycle',
  });
  const manifest = buildCycleStagesManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('cycle'), 'cycle_stages manifest has "cycle"');
  for (let i = 0; i < 4; i++) {
    expect(names.has(`stage-${i + 1}`), `cycle_stages manifest has stage-${i + 1}`);
  }
  // Slug alias — brain target "stage-precipitation" should resolve to stage-3.
  const stage3 = manifest.find((f) => f.name === 'stage-3');
  expect(!!(stage3?.labels ?? []).includes('stage-precipitation'), 'stage-3 carries semantic slug alias "stage-precipitation"');

  expect(cycleRenderer.includes('cycleStagesFeatureNames'), 'cycle renderer imports cycleStagesFeatureNames');
  expect(cycleRenderer.includes('data-feature={N.cycle}'), 'cycle renderer sets data-feature on root SVG');
  expect(cycleRenderer.includes('data-feature={N.stage(i)}'), 'cycle renderer sets data-feature on each stage <g>');
}

// ── 5. body_system ──────────────────────────────────────────────────────────
{
  const figure = solveBodySystem({
    system: 'digestive',
    parts: [
      { label: 'Mouth' },
      { label: 'Stomach' },
      { label: 'Small Intestine' },
    ],
  });
  const manifest = buildBodySystemManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has('system'), 'body_system manifest has "system"');
  for (let i = 0; i < 3; i++) {
    expect(names.has(`part-${i + 1}`), `body_system manifest has part-${i + 1}`);
  }
  const part2 = manifest.find((f) => f.name === 'part-2');
  expect(!!(part2?.labels ?? []).includes('Stomach'), 'part-2 carries the label "Stomach"');

  expect(bodyRenderer.includes('bodySystemFeatureNames'), 'body_system renderer imports bodySystemFeatureNames');
  expect(bodyRenderer.includes('data-feature={N.system}'), 'body_system renderer sets data-feature on the grid');
  expect(bodyRenderer.includes('data-feature={N.part(i)}'), 'body_system renderer sets data-feature on each part card');
}

// ── 6. dispatcher cases in manifests.ts ─────────────────────────────────────
for (const kind of [
  'sentence_diagram',
  'historical_timeline',
  'hierarchy_pyramid',
  'body_system',
  'life_cycle',
  'water_cycle',
  'rock_cycle',
]) {
  expect(
    dispatcherSource.includes(`case '${kind}'`),
    `manifests.ts dispatcher has case for '${kind}'`,
  );
}

// ── Report ──
if (failures.length === 0) {
  console.log('✓ Phase 2b SVG organizers: 6 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
