/**
 * Phase 11 ship-gate test — statistics manifests + renderer DOM wiring
 * (histogram, normal_curve, scatterplot_regression).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase11-statistics.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildHistogramManifest,
  buildNormalCurveManifest,
  buildScatterRegressionManifest,
  histogramFeatureNames,
  normalCurveFeatureNames,
  scatterRegressionFeatureNames,
  solveHistogram,
  solveNormalCurve,
  solveScatterRegression,
} from '../src/lib/tutor/diagrams/catalog/kinds/math-statistics';

type Fail = { msg: string };
const failures: Fail[] = [];
function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const READ = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
const dispatcherSource = READ('src/lib/tutor/diagrams/manifests.ts');
const histSource = READ('src/app/tutor/components/whiteboard/HistogramRenderer.tsx');
const normSource = READ('src/app/tutor/components/whiteboard/NormalCurveRenderer.tsx');
const scatSource = READ('src/app/tutor/components/whiteboard/ScatterRegressionRenderer.tsx');

// ── 1. histogram ────────────────────────────────────────────────────────────
{
  const figure = solveHistogram({
    bins: [[0, 5, 3], [5, 10, 7], [10, 15, 12], [15, 20, 5]],
    mean: 10.5,
    median: 10,
    xLabel: 'Score',
    title: 'Test Scores',
  });
  const m = buildHistogramManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(histogramFeatureNames.diagram), 'histogram has root');
  expect(names.has(histogramFeatureNames.bars), 'histogram has bars collective');
  expect(names.has(histogramFeatureNames.bin(0)), 'histogram has bin-0');
  expect(names.has(histogramFeatureNames.bin(3)), 'histogram has bin-3');
  expect(names.has(histogramFeatureNames.mean), 'histogram has mean line');
  expect(names.has(histogramFeatureNames.median), 'histogram has median line');
  const bin2 = m.find((f) => f.name === histogramFeatureNames.bin(1));
  expect(!!bin2?.labels?.includes('[5, 10)'), 'bin labeled by [lower, upper) range');
  expect(!!bin2?.labels?.some((l) => l.startsWith('bin 2:')), 'bin carries verbose description-form label');
  expect(histSource.includes('histogramFeatureNames'), 'histogram renderer imports helper');
  expect(histSource.includes('data-feature={N.bars}'), 'histogram renderer marks bars group');
  expect(histSource.includes('N.bin(i)'), 'histogram renderer marks each bin');
  expect(histSource.includes('data-feature={N.mean}'), 'histogram renderer marks mean line');
  // Verbose description-form label — brain emitted "mean line at x = 33"
  // in 2026-05-14 live test and was silently dropped.
  const meanFeat = m.find((f) => f.name === histogramFeatureNames.mean);
  expect(
    !!meanFeat?.labels?.includes('mean line at x = 10.5'),
    'histogram mean line carries verbose `mean line at x = <value>` label',
  );
  const medianFeat = m.find((f) => f.name === histogramFeatureNames.median);
  expect(
    !!medianFeat?.labels?.includes('median line at x = 10'),
    'histogram median line carries verbose `median line at x = <value>` label',
  );
}

// ── 2. normal_curve ─────────────────────────────────────────────────────────
{
  const figure = solveNormalCurve({
    mean: 0,
    sd: 1,
    shadeRegion: { from: -1, to: 1 },
    markValues: [[1.96, 'z = 1.96']],
    showSDLines: true,
    shadeArea: 0.6827,
    title: 'Standard Normal',
  });
  const m = buildNormalCurveManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(normalCurveFeatureNames.diagram), 'normal_curve has root');
  expect(names.has(normalCurveFeatureNames.curve), 'normal_curve has bell curve');
  expect(names.has(normalCurveFeatureNames.shadeRegion), 'normal_curve has shaded region');
  expect(names.has(normalCurveFeatureNames.mark(0)), 'normal_curve has mark-0');
  expect(names.has(normalCurveFeatureNames.sdLines), 'normal_curve has SD lines (showSDLines=true)');
  expect(names.has(normalCurveFeatureNames.shadeArea), 'normal_curve has shade area label');
  const mark = m.find((f) => f.name === normalCurveFeatureNames.mark(0));
  expect(!!mark?.labels?.includes('z = 1.96'), 'mark carries its display label');
  expect(
    !!mark?.labels?.includes('mark at x = 1.96 (z = 1.96)'),
    'mark carries verbose `mark at x = ... (label)` description-format label',
  );
  expect(normSource.includes('normalCurveFeatureNames'), 'normal renderer imports helper');
  expect(normSource.includes('data-feature={FN.curve}'), 'normal renderer marks bell curve');
  expect(normSource.includes('data-feature={FN.shadeRegion}'), 'normal renderer marks shaded region');
  expect(normSource.includes('FN.mark(i)'), 'normal renderer marks each mark');
}

// ── 3. scatterplot_regression ───────────────────────────────────────────────
{
  const figure = solveScatterRegression({
    points: [[1, 2], [2, 3.1], [3, 4.0], [4, 5.2], [5, 6.1]],
    regression: { slope: 1.05, intercept: 1.0 },
    equationLabel: 'ŷ = 1.00 + 1.05x',
    rValue: 0.998,
    rSquared: 0.996,
    highlightPoint: { x: 3, y: 4.0, label: 'mean point' },
    showResiduals: true,
    xLabel: 'X',
    yLabel: 'Y',
  });
  const m = buildScatterRegressionManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(scatterRegressionFeatureNames.diagram), 'scatter has root');
  expect(names.has(scatterRegressionFeatureNames.points), 'scatter has points collective');
  expect(names.has(scatterRegressionFeatureNames.regression), 'scatter has LSRL');
  expect(names.has(scatterRegressionFeatureNames.equation), 'scatter has equation label');
  expect(names.has(scatterRegressionFeatureNames.rValue), 'scatter has r value');
  expect(names.has(scatterRegressionFeatureNames.rSquared), 'scatter has r² value');
  expect(names.has(scatterRegressionFeatureNames.highlightPoint), 'scatter has highlight point');
  expect(names.has(scatterRegressionFeatureNames.residuals), 'scatter has residuals (showResiduals=true)');
  const reg = m.find((f) => f.name === scatterRegressionFeatureNames.regression);
  expect(!!reg?.labels?.includes('line of best fit'), 'LSRL carries "line of best fit" label');
  expect(!!reg?.labels?.includes('least squares line'), 'LSRL carries "least squares line" label');
  const hp = m.find((f) => f.name === scatterRegressionFeatureNames.highlightPoint);
  expect(
    !!hp?.labels?.includes('highlight point (3, 4) "mean point"'),
    'highlight point carries verbose description-format label',
  );
  expect(scatSource.includes('scatterRegressionFeatureNames'), 'scatter renderer imports helper');
  expect(scatSource.includes('data-feature={N.regression}'), 'scatter renderer marks LSRL');
  expect(scatSource.includes('data-feature={N.points}'), 'scatter renderer marks points group');
  expect(scatSource.includes('data-feature={N.residuals}'), 'scatter renderer marks residuals');
}

// ── 4. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of ['histogram', 'normal_curve', 'scatterplot_regression']) {
  expect(dispatcherSource.includes(`case '${kind}'`), `manifests.ts dispatcher has case for '${kind}'`);
}

if (failures.length === 0) {
  console.log('✓ Phase 11 statistics: 3 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
