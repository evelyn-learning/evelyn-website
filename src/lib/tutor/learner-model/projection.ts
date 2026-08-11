/**
 * Score projection — pure functions turning per-LO mastery estimates (plus,
 * optionally, real mock-exam anchors) into a display band on a target scale.
 *
 * Like `estimator.ts`, this module imports nothing DB-shaped: `curveScaled`
 * (from `mock-exam/scoring`) and `ScoringSpec` (from `mock-exam/blueprints`)
 * are both pure/type-only, so this stays usable from a plain Node process
 * with no Mongo connection. The route (Task 9, `route.ts`) is the only
 * caller that bridges this to Mongoose documents and `getBlueprint`.
 */

import { TUNING } from './estimator';
import { curveScaled } from '../mock-exam/scoring';
import type { ScoringSpec, CurveAnchor } from '../mock-exam/blueprints';

export type ProjectionScale = 'sat' | 'act' | 'ap' | 'readiness';

export interface ProjectLo {
  loId: string;
  estimate: number | null;
  confidence: 'low' | 'medium' | 'high';
  sectionId?: string;
}

export interface ProjectArgs {
  scale: ProjectionScale;
  los: ProjectLo[];
  /** Absent for 'readiness' — there's no exam curve for a generic band. */
  curves?: ScoringSpec;
  /** sectionId -> whether it counts toward the composite (mirrors
   *  `BlueprintSection.inComposite`, e.g. ACT science is `false`). A
   *  section absent from this map is treated as in-composite (`true`),
   *  matching the blueprint's own `inComposite ?? true` default and real
   *  `applyCurves`' `s.inComposite !== false` check. Only consulted for
   *  `curves.kind === 'act-composite'` — see `scaledMasteryCenter`. */
  sectionInComposite?: Record<string, boolean>;
  mockAnchors?: Array<{ composite: number; at: Date }>;
  now: Date;
}

export interface ProjectResult {
  low: number;
  high: number;
  basis: 'mock-anchored' | 'mastery-only';
}

/** `'digital-sat'` -> `'sat'`, `'act'` -> `'act'`, any `ap-*` -> `'ap'`,
 *  everything else (including undefined) -> `'readiness'`. */
export function scaleForTopic(topic: string | undefined | null): ProjectionScale {
  if (!topic) return 'readiness';
  if (topic === 'digital-sat') return 'sat';
  if (topic === 'act') return 'act';
  if (topic.startsWith('ap-')) return 'ap';
  return 'readiness';
}

/**
 * Derive an LO -> mock-section-id map from the student's mock evidence rows
 * (only mock-sourced `EvidenceEvent` rows carry `sectionId`). LOs with mock
 * evidence take their most-recently-seen section; LOs the mocks never
 * touched are spread round-robin across the sections that DID appear (or,
 * when the caller passes the blueprint's own section order as a fallback,
 * across those) — so a scaled projection always has coverage across every
 * exam section instead of collapsing onto one.
 *
 * Pure: takes rows the caller already fetched. Never queries.
 */
export function mapLoIdsToSections(
  loIds: string[],
  mockRows: Array<{ loId: string; sectionId?: string; occurredAt?: Date }>,
  sectionIds: string[],
): Map<string, string> {
  const bySeen = new Map<string, { sectionId: string; occurredAt: number }>();
  for (const row of mockRows) {
    if (!row.sectionId) continue;
    const at = row.occurredAt ? row.occurredAt.getTime() : 0;
    const existing = bySeen.get(row.loId);
    if (!existing || at >= existing.occurredAt) {
      bySeen.set(row.loId, { sectionId: row.sectionId, occurredAt: at });
    }
  }

  const map = new Map<string, string>();
  for (const [loId, v] of bySeen) map.set(loId, v.sectionId);

  const spreadAcross = sectionIds.length > 0 ? sectionIds : [...new Set(map.values())];
  if (spreadAcross.length > 0) {
    let i = 0;
    for (const loId of loIds) {
      if (!map.has(loId)) {
        map.set(loId, spreadAcross[i % spreadAcross.length]);
        i += 1;
      }
    }
  }
  return map;
}

function valueOf(lo: ProjectLo): number {
  return lo.estimate ?? TUNING.untouchedPrior;
}

/** Readiness center: weighted mean of per-LO values (untouched prior for
 *  LOs with no estimate yet), scaled to 0-100. */
function readinessCenter(los: ProjectLo[]): number {
  if (los.length === 0) return TUNING.untouchedPrior * 100;
  const mean = los.reduce((sum, lo) => sum + valueOf(lo), 0) / los.length;
  return mean * 100;
}

/**
 * Curve-set variant selection for one section. Non-adaptive sections (ACT,
 * AP, HS) only ever have a `'default'` key and that always wins. Adaptive
 * sections (digital-SAT rw/math) have NO `'default'` — only `'easy'`/`'hard'`
 * — because the real curve applied depends on which second-stage module the
 * student was actually routed to. This projection has no in-progress
 * adaptive-routing signal to read, so it approximates the same call the
 * router itself would make from the section's aggregated value: >= 0.5 (the
 * router's own success/fail split, not `adaptive.thresholdFraction` — this
 * is a projection-side approximation, not a replay of the real routing
 * rule) selects `'hard'`, otherwise `'easy'`. Any other/unexpected curve-set
 * shape falls back to its first available variant rather than an empty
 * curve (which would zero out the section).
 */
function pickCurveVariant(curveSet: Record<string, CurveAnchor[]>, sectionMean: number): CurveAnchor[] {
  if (curveSet.default) return curveSet.default;
  if (curveSet.easy && curveSet.hard) return sectionMean >= 0.5 ? curveSet.hard : curveSet.easy;
  return Object.values(curveSet)[0] ?? [];
}

/**
 * Scaled center: group LOs by section, average each section's per-LO value,
 * multiply by that section's raw ceiling (the curve's last raw anchor —
 * i.e. the raw score at which the curve saturates), curve it (picking the
 * adaptive variant via `pickCurveVariant` when the section has one), then
 * roll the per-section scaled values up into a composite the same way
 * `applyCurves` (real mock scoring, `mock-exam/scoring.ts`) does per
 * `scoring.kind` — INCLUDING `act-composite`'s `inComposite !== false`
 * section filter (ACT science is `inComposite: false`: it still gets
 * curved/aggregated above, just excluded from the composite average here,
 * exactly like real `applyCurves`). `ap-composite` and `scaled-sections`
 * don't filter by `inComposite` in the real scorer either, so neither do
 * we. LOs with no `sectionId` are dropped here — callers resolve
 * `sectionId` for every LO first via `mapLoIdsToSections`.
 */
function scaledMasteryCenter(
  los: ProjectLo[],
  curves: ScoringSpec,
  sectionInComposite: Record<string, boolean> = {},
): number {
  const bySection = new Map<string, number[]>();
  for (const lo of los) {
    if (!lo.sectionId) continue;
    const arr = bySection.get(lo.sectionId) ?? [];
    arr.push(valueOf(lo));
    bySection.set(lo.sectionId, arr);
  }

  const roundTo = curves.sectionScaledMax <= 50 ? 1 : 10;
  const sectionScaled: Array<{ sectionId: string; scaled: number }> = [];
  for (const [sectionId, values] of bySection) {
    const curveSet = curves.curves[sectionId];
    if (!curveSet) continue;
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const anchors = pickCurveVariant(curveSet, mean);
    if (anchors.length === 0) continue;
    const rawCeiling = anchors[anchors.length - 1][0];
    sectionScaled.push({ sectionId, scaled: curveScaled(anchors, mean * rawCeiling, roundTo) });
  }

  if (sectionScaled.length === 0) return (curves.compositeMin + curves.compositeMax) / 2;

  if (curves.kind === 'act-composite') {
    const counted = sectionScaled.filter((s) => sectionInComposite[s.sectionId] !== false);
    const pool = counted.length > 0 ? counted : sectionScaled;
    return pool.reduce((s, x) => s + x.scaled, 0) / pool.length;
  }
  if (curves.kind === 'ap-composite') {
    return sectionScaled.reduce((s, x) => s + x.scaled, 0) / sectionScaled.length;
  }
  // 'scaled-sections' (digital SAT, HS full-lengths): composite = section sum.
  return sectionScaled.reduce((s, x) => s + x.scaled, 0);
}

/** Fit a line through the (day-offset, composite) points and evaluate it at
 *  `now` — a single anchor has no slope, so it's just that anchor's value. */
function mockTrendline(anchors: Array<{ composite: number; at: Date }>, now: Date): number {
  if (anchors.length === 1) return anchors[0].composite;
  const sorted = [...anchors].sort((a, b) => a.at.getTime() - b.at.getTime());
  const t0 = sorted[0].at.getTime();
  const xs = sorted.map((p) => (p.at.getTime() - t0) / 86400000);
  const ys = sorted.map((p) => p.composite);
  const n = xs.length;
  const sumX = xs.reduce((s, x) => s + x, 0);
  const sumY = ys.reduce((s, y) => s + y, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const sumXX = xs.reduce((s, x) => s + x * x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return ys[ys.length - 1]; // same-day anchors → no slope info
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const nowX = (now.getTime() - t0) / 86400000;
  return intercept + slope * nowX;
}

const CONFIDENCE_WEIGHT: Record<ProjectLo['confidence'], number> = { low: 0, medium: 0.5, high: 1 };

/** 0 (all low) .. 1 (all high); linear for a medium/mixed mean. */
function meanConfidenceWeight(los: ProjectLo[]): number {
  if (los.length === 0) return 0;
  const sum = los.reduce((s, lo) => s + CONFIDENCE_WEIGHT[lo.confidence], 0);
  return sum / los.length;
}

function scaleBounds(scale: ProjectionScale, curves?: ScoringSpec): [number, number] {
  if (scale === 'readiness' || !curves) return [0, 100];
  return [curves.compositeMin, curves.compositeMax];
}

/**
 * Score projection (spec §4.4): a [low, high] band around a mastery- (and,
 * with mock evidence, mock-anchor-blended) center. Half-width scales down
 * linearly toward `highConfidenceScale` as mean per-LO confidence rises.
 */
export function projectScore(a: ProjectArgs): ProjectResult {
  const masteryCenter =
    a.scale === 'readiness' || !a.curves
      ? readinessCenter(a.los)
      : scaledMasteryCenter(a.los, a.curves, a.sectionInComposite);

  let center = masteryCenter;
  let basis: ProjectResult['basis'] = 'mastery-only';
  if (a.mockAnchors && a.mockAnchors.length > 0) {
    const trend = mockTrendline(a.mockAnchors, a.now);
    center = TUNING.projection.mockAlpha * trend + (1 - TUNING.projection.mockAlpha) * masteryCenter;
    basis = 'mock-anchored';
  }

  const base = TUNING.projection.bandHalfWidth[a.scale];
  const t = meanConfidenceWeight(a.los);
  const halfWidth = base * (1 - t * (1 - TUNING.projection.highConfidenceScale));

  const [boundMin, boundMax] = scaleBounds(a.scale, a.curves);
  const low = Math.max(boundMin, center - halfWidth);
  const high = Math.min(boundMax, center + halfWidth);

  return { low, high, basis };
}
