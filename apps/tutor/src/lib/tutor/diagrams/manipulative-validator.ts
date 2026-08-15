/**
 * Post-emit validator for show_manipulative. Each `type` requires a
 * matching parameter object and has its own constraints; this catches
 * mismatches before they reach the renderer.
 */

export interface Base10Params {
  ones?: number;
  tens?: number;
  hundreds?: number;
  thousands?: number;
}

export interface TenFrameParams {
  count?: number;
}

export interface AreaModelParams {
  rows?: number[];
  cols?: number[];
}

export interface ManipulativeInput {
  type?: 'base-10' | 'ten-frame' | 'area-model' | string;
  base10?: Base10Params;
  tenFrame?: TenFrameParams;
  areaModel?: AreaModelParams;
}

export interface ManipulativeValidationResult {
  ok: boolean;
  reason?: string;
}

function isNonNegInt(n: unknown): boolean {
  return typeof n === 'number' && isFinite(n) && n >= 0 && Math.floor(n) === n;
}

function isPositiveInt(n: unknown): boolean {
  return typeof n === 'number' && isFinite(n) && n > 0 && Math.floor(n) === n;
}

export function validateManipulative(input: ManipulativeInput): ManipulativeValidationResult {
  const type = input.type;
  if (type !== 'base-10' && type !== 'ten-frame' && type !== 'area-model') {
    return { ok: false, reason: 'show_manipulative `type` must be "base-10", "ten-frame", or "area-model".' };
  }

  if (type === 'base-10') {
    const p = input.base10;
    if (!p || typeof p !== 'object') {
      return { ok: false, reason: 'type "base-10" requires a `base10` object with ones/tens/hundreds/thousands counts.' };
    }
    const places = ['ones', 'tens', 'hundreds', 'thousands'] as const;
    let total = 0;
    for (const k of places) {
      const v = p[k];
      if (v === undefined) continue;
      if (!isNonNegInt(v)) {
        return { ok: false, reason: `base10.${k} must be a non-negative integer.` };
      }
      total += v;
    }
    if (total === 0) {
      return { ok: false, reason: 'base10 has zero counts across all places. Set at least one non-zero count.' };
    }
    if ((p.ones ?? 0) > 18) {
      return { ok: false, reason: `base10.ones is ${p.ones} — the renderer caps ones at 18 (regrouping demos use up to 18 to show overflow). Reduce ones or carry the regrouped value.` };
    }
    return { ok: true };
  }

  if (type === 'ten-frame') {
    const p = input.tenFrame;
    if (!p || typeof p !== 'object') {
      return { ok: false, reason: 'type "ten-frame" requires a `tenFrame` object with a `count` field.' };
    }
    if (!isNonNegInt(p.count)) {
      return { ok: false, reason: 'tenFrame.count must be a non-negative integer.' };
    }
    if ((p.count ?? 0) > 20) {
      return { ok: false, reason: `tenFrame.count is ${p.count} — capped at 20 (two ten-frames side-by-side).` };
    }
    return { ok: true };
  }

  // area-model
  const p = input.areaModel;
  if (!p || typeof p !== 'object') {
    return { ok: false, reason: 'type "area-model" requires an `areaModel` object with `rows` and `cols` arrays.' };
  }
  const rows = Array.isArray(p.rows) ? p.rows : [];
  const cols = Array.isArray(p.cols) ? p.cols : [];
  if (rows.length === 0) {
    return { ok: false, reason: 'areaModel.rows must be a non-empty array of positive integers.' };
  }
  if (cols.length === 0) {
    return { ok: false, reason: 'areaModel.cols must be a non-empty array of positive integers.' };
  }
  for (let i = 0; i < rows.length; i++) {
    if (!isPositiveInt(rows[i])) {
      return { ok: false, reason: `areaModel.rows[${i}] must be a positive integer.` };
    }
  }
  for (let i = 0; i < cols.length; i++) {
    if (!isPositiveInt(cols[i])) {
      return { ok: false, reason: `areaModel.cols[${i}] must be a positive integer.` };
    }
  }
  return { ok: true };
}
