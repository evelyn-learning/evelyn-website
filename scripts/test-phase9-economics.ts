/**
 * Phase 9 ship-gate test — economics manifests + renderer DOM wiring
 * (production_possibilities, business_cycle, aggregate_demand_supply,
 * money_market, loanable_funds, phillips_curve,
 * foreign_exchange_market).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase9-economics.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildProductionPossibilitiesManifest,
  buildBusinessCycleManifest,
  buildAggregateDemandSupplyManifest,
  buildMoneyMarketManifest,
  buildLoanableFundsManifest,
  buildPhillipsCurveManifest,
  buildForeignExchangeMarketManifest,
  productionPossibilitiesFeatureNames,
  businessCycleFeatureNames,
  adAsFeatureNames,
  moneyMarketFeatureNames,
  loanableFundsFeatureNames,
  phillipsCurveFeatureNames,
  fxMarketFeatureNames,
  solveProductionPossibilities,
  solveBusinessCycle,
  solveAggregateDemandSupply,
  solveMoneyMarket,
  solveLoanableFunds,
  solvePhillipsCurve,
  solveForeignExchangeMarket,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/economics';

type Fail = { msg: string };
const failures: Fail[] = [];
function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const READ = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
const dispatcherSource = READ('apps/marketing/src/lib/tutor/diagrams/manifests.ts');
const ppcSource = READ('apps/marketing/src/app/tutor/components/whiteboard/ProductionPossibilitiesRenderer.tsx');
const bcSource = READ('apps/marketing/src/app/tutor/components/whiteboard/BusinessCycleRenderer.tsx');
const adasSource = READ('apps/marketing/src/app/tutor/components/whiteboard/AdAsRenderer.tsx');
const mmSource = READ('apps/marketing/src/app/tutor/components/whiteboard/MoneyMarketRenderer.tsx');
const lfSource = READ('apps/marketing/src/app/tutor/components/whiteboard/LoanableFundsRenderer.tsx');
const pcSource = READ('apps/marketing/src/app/tutor/components/whiteboard/PhillipsCurveRenderer.tsx');
const fxSource = READ('apps/marketing/src/app/tutor/components/whiteboard/ForeignExchangeRenderer.tsx');

// ── 1. production_possibilities ─────────────────────────────────────────────
{
  // Regression: when brain claims `position: "on"` but passes
  // coordinates off the curve, the solver SNAPS y to the actual curve
  // at the given x. This keeps brain's narrative intent ("A is
  // efficient, on the curve") visually consistent with the rendered
  // dot. (Pre-2026-05-14 the dot sat inside the curve while the label
  // still said "efficient" — visual contradiction with brain narration.)
  {
    const snapFigure = solveProductionPossibilities({
      xAxis: { label: 'Guns', max: 100 },
      yAxis: { label: 'Butter', max: 100 },
      curve: 'bowed-out',
      points: [{ x: 20, y: 75, label: 'A', position: 'on' }],
    });
    const p = snapFigure.points[0];
    // Curve at x=20 on max-100 bowed-out: y = 100·sqrt(1 - 0.04) ≈ 98.
    expect(Math.abs(p.y - 97.98) < 0.1, 'PPC snaps `position:"on"` y to curve(x) — point ends up at y≈98 for x=20');
    expect(p.position === 'on', 'PPC point reports final position "on" after snap');
  }
  // Brain's `position: "inside"` (with coords actually inside) is
  // honored as-is — no snap.
  {
    const insideFigure = solveProductionPossibilities({
      xAxis: { label: 'Guns', max: 100 },
      yAxis: { label: 'Butter', max: 100 },
      curve: 'bowed-out',
      points: [{ x: 30, y: 30, label: 'B', position: 'inside' }],
    });
    const p = insideFigure.points[0];
    expect(p.y === 30, 'PPC does NOT snap when brain says "inside" — coords preserved');
    expect(p.position === 'inside', 'PPC inside point stays inside');
  }
  // Brain's `position: "outside"` (with coords actually outside) — no snap.
  {
    const outsideFigure = solveProductionPossibilities({
      xAxis: { label: 'Guns', max: 100 },
      yAxis: { label: 'Butter', max: 100 },
      curve: 'bowed-out',
      points: [{ x: 80, y: 80, label: 'D', position: 'outside' }],
    });
    const p = outsideFigure.points[0];
    expect(p.y === 80, 'PPC does NOT snap when brain says "outside" — coords preserved');
    expect(p.position === 'outside', 'PPC outside point stays outside');
  }

  const figure = solveProductionPossibilities({
    xAxis: { label: 'Guns', max: 100 },
    yAxis: { label: 'Butter', max: 100 },
    curve: 'bowed-out',
    points: [
      { x: 70, y: 60, label: 'A' },
      { x: 30, y: 30, label: 'B', position: 'inside' },
    ],
    shift: { direction: 'out', factor: 1.2 },
  });
  const manifest = buildProductionPossibilitiesManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(productionPossibilitiesFeatureNames.diagram), 'ppc has root');
  expect(names.has(productionPossibilitiesFeatureNames.curve), 'ppc has curve');
  expect(names.has(productionPossibilitiesFeatureNames.shiftedCurve), 'ppc has shifted curve');
  expect(names.has(productionPossibilitiesFeatureNames.point('A', 0)), 'ppc has point A');
  expect(names.has(productionPossibilitiesFeatureNames.point('B', 1)), 'ppc has point B');
  const ptB = manifest.find((f) => f.name === productionPossibilitiesFeatureNames.point('B', 1));
  expect(!!ptB?.labels?.includes('inefficient point'), 'inside point carries "inefficient point" label');
  expect(ppcSource.includes('productionPossibilitiesFeatureNames'), 'PPC renderer imports helper');
  expect(ppcSource.includes('data-feature={N.diagram}'), 'PPC renderer sets data-feature on root');
  expect(ppcSource.includes('data-feature={N.curve}'), 'PPC renderer sets data-feature on curve');
  expect(ppcSource.includes('N.point(p.label, i)'), 'PPC renderer sets data-feature per point');
}

// ── 2. business_cycle ───────────────────────────────────────────────────────
{
  const figure = solveBusinessCycle({
    cycles: 1.5,
    markers: [
      { t: 0.2, label: 'Peak' },
      { t: 0.5, label: 'Trough' },
    ],
  });
  const manifest = buildBusinessCycleManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(businessCycleFeatureNames.diagram), 'business_cycle has root');
  expect(names.has(businessCycleFeatureNames.cycle), 'business_cycle has cycle curve');
  expect(names.has(businessCycleFeatureNames.trend), 'business_cycle has trend line');
  expect(names.has(businessCycleFeatureNames.marker('Peak', 0)), 'business_cycle has Peak marker');
  expect(bcSource.includes('businessCycleFeatureNames'), 'BC renderer imports helper');
  expect(bcSource.includes('data-feature={N.diagram}'), 'BC renderer sets data-feature on root');
  expect(bcSource.includes('data-feature={N.cycle}'), 'BC renderer sets data-feature on cycle path');
}

// ── 3. aggregate_demand_supply ──────────────────────────────────────────────
{
  const figure = solveAggregateDemandSupply({
    potentialGdp: 50,
    initialEquilibriumGdp: 50,
    initialPriceLevel: 50,
    showLras: true,
    shift: { curve: 'AD', direction: 'right', magnitude: 10 },
  });
  const manifest = buildAggregateDemandSupplyManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(adAsFeatureNames.diagram), 'ad_as has root');
  expect(names.has(adAsFeatureNames.ad), 'ad_as has AD curve');
  expect(names.has(adAsFeatureNames.sras), 'ad_as has SRAS curve');
  expect(names.has(adAsFeatureNames.lras), 'ad_as has LRAS curve');
  expect(names.has(adAsFeatureNames.adShifted), 'ad_as has shifted AD when shift=AD');
  expect(names.has(adAsFeatureNames.eqInitial), 'ad_as has initial equilibrium');
  expect(names.has(adAsFeatureNames.eqFinal), 'ad_as has final equilibrium');
  expect(adasSource.includes('adAsFeatureNames'), 'AD/AS renderer imports helper');
  expect(adasSource.includes('data-feature={N.ad}'), 'AD/AS renderer sets data-feature on AD');
  expect(adasSource.includes('data-feature={N.sras}'), 'AD/AS renderer sets data-feature on SRAS');
  expect(adasSource.includes('data-feature={N.lras}'), 'AD/AS renderer sets data-feature on LRAS');
}

// ── 4. money_market ─────────────────────────────────────────────────────────
{
  const figure = solveMoneyMarket({
    moneySupplyQuantity: 50,
    initialInterestRate: 50,
    shift: { curve: 'Ms', direction: 'right', magnitude: 10 },
  });
  const manifest = buildMoneyMarketManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(moneyMarketFeatureNames.diagram), 'money_market has root');
  expect(names.has(moneyMarketFeatureNames.ms), 'money_market has Ms');
  expect(names.has(moneyMarketFeatureNames.md), 'money_market has Md');
  expect(names.has(moneyMarketFeatureNames.msShifted), 'money_market has shifted Ms');
  expect(mmSource.includes('moneyMarketFeatureNames'), 'MM renderer imports helper');
  expect(mmSource.includes('data-feature={N.ms}'), 'MM renderer sets data-feature on Ms');
  expect(mmSource.includes('data-feature={N.md}'), 'MM renderer sets data-feature on Md');
}

// ── 5. loanable_funds ───────────────────────────────────────────────────────
{
  const figure = solveLoanableFunds({
    initialQuantity: 50,
    initialRealRate: 50,
    shift: { curve: 'D', direction: 'right', magnitude: 10 },
  });
  const manifest = buildLoanableFundsManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(loanableFundsFeatureNames.diagram), 'loanable_funds has root');
  expect(names.has(loanableFundsFeatureNames.supply), 'loanable_funds has supply');
  expect(names.has(loanableFundsFeatureNames.demand), 'loanable_funds has demand');
  expect(names.has(loanableFundsFeatureNames.demandShifted), 'loanable_funds has shifted D');
  expect(lfSource.includes('loanableFundsFeatureNames'), 'LF renderer imports helper');
  expect(lfSource.includes('data-feature={N.supply}'), 'LF renderer sets data-feature on supply');
  expect(lfSource.includes('data-feature={N.demand}'), 'LF renderer sets data-feature on demand');
}

// ── 6. phillips_curve ───────────────────────────────────────────────────────
{
  const figure = solvePhillipsCurve({
    nairu: 50,
    initialUnemployment: 50,
    initialInflation: 50,
    showLrpc: true,
    shift: { curve: 'SRPC', direction: 'up', magnitude: 10 },
  });
  const manifest = buildPhillipsCurveManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(phillipsCurveFeatureNames.diagram), 'phillips_curve has root');
  expect(names.has(phillipsCurveFeatureNames.srpc), 'phillips_curve has SRPC');
  expect(names.has(phillipsCurveFeatureNames.lrpc), 'phillips_curve has LRPC');
  expect(names.has(phillipsCurveFeatureNames.srpcShifted), 'phillips_curve has shifted SRPC');
  expect(pcSource.includes('phillipsCurveFeatureNames'), 'PC renderer imports helper');
  expect(pcSource.includes('data-feature={N.srpc}'), 'PC renderer sets data-feature on SRPC');
}

// ── 7. foreign_exchange_market ──────────────────────────────────────────────
{
  const figure = solveForeignExchangeMarket({
    currency: 'USD',
    quoteCurrency: 'EUR',
    initialQuantity: 50,
    initialExchangeRate: 50,
    shift: { curve: 'D', direction: 'right', magnitude: 10 },
  });
  const manifest = buildForeignExchangeMarketManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(fxMarketFeatureNames.diagram), 'fx_market has root');
  expect(names.has(fxMarketFeatureNames.supply), 'fx_market has SUSD');
  expect(names.has(fxMarketFeatureNames.demand), 'fx_market has DUSD');
  expect(names.has(fxMarketFeatureNames.demandShifted), 'fx_market has shifted DUSD');
  const supply = manifest.find((f) => f.name === fxMarketFeatureNames.supply);
  expect(supply?.displayName === 'SUSD', 'fx supply displayName includes currency');
  expect(fxSource.includes('fxMarketFeatureNames'), 'FX renderer imports helper');
  expect(fxSource.includes('data-feature={N.supply}'), 'FX renderer sets data-feature on supply');
}

// ── 8. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of [
  'production_possibilities',
  'business_cycle',
  'aggregate_demand_supply',
  'money_market',
  'loanable_funds',
  'phillips_curve',
  'foreign_exchange_market',
]) {
  expect(
    dispatcherSource.includes(`case '${kind}'`),
    `manifests.ts dispatcher has case for '${kind}'`,
  );
}

// ── Report ──
if (failures.length === 0) {
  console.log('✓ Phase 9 economics: 7 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
