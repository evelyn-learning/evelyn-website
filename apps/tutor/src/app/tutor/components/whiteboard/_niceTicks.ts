/**
 * Axis ticks at round numbers (1, 2, 2.5 or 5 × a power of ten) for the plot renderers.
 *
 * The plots used to cut the axis range into four equal parts, which labels an axis from 0.44 to
 * 8.56 with 0.44, 2.47, 4.5 … — numbers no teacher would write on a board. A tick belongs at a
 * multiple of a round step; the axis ends themselves need no label.
 */

/** A round step that gives about `target` intervals across `span`. */
export function niceStep(span: number, target = 5): number {
  if (!(span > 0) || !Number.isFinite(span)) return 1;
  const raw = span / Math.max(1, target);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10;
  return nice * pow;
}

/** The multiples of a round step that fall inside [min, max]. */
export function niceTicks(min: number, max: number, target = 5): { ticks: number[]; step: number } {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return { ticks: [], step: 1 };
  const step = niceStep(max - min, target);
  const eps = step * 1e-6;
  const ticks: number[] = [];
  for (let k = Math.ceil((min - eps) / step); k * step <= max + eps && ticks.length < 200; k += 1) {
    ticks.push(cleanNumber(k * step, step));
  }
  return { ticks, step };
}

/** Decimal places a value at this step needs (0.25 → 2, 5 → 0, 0.0001 → 4). */
export function stepDecimals(step: number): number {
  if (!(step > 0) || !Number.isFinite(step)) return 0;
  for (let d = 0; d <= 10; d += 1) {
    const scaled = step * Math.pow(10, d);
    if (Math.abs(scaled - Math.round(scaled)) < 1e-6 * Math.max(1, scaled)) return d;
  }
  return 10;
}

function cleanNumber(v: number, step: number): number {
  const d = Math.min(12, stepDecimals(step) + 2);
  const out = Number(v.toFixed(d));
  return out === 0 ? 0 : out; // never −0
}

/** A tick label: as many decimals as the step needs, a true minus sign, no −0. */
export function formatTick(v: number, step: number): string {
  const d = Math.min(10, stepDecimals(step));
  let s = v.toFixed(d);
  if (Number(s) === 0) s = (0).toFixed(d);
  if (d > 0) s = s.replace(/\.?0+$/, (m) => (m.startsWith('.') ? '' : m.replace(/0+$/, '')));
  if (s === '' || s === '-') s = '0';
  return s.replace(/^-/, '−');
}

/** A data value for a label: at most `sig` significant figures, trailing zeros dropped. */
export function formatValue(v: number, sig = 4): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const s = Number(v.toPrecision(sig));
  const abs = Math.abs(s);
  const text = abs >= 1e6 || abs < 1e-4 ? s.toExponential().replace('e', ' × 10^').replace('+', '') : String(s);
  return text.replace(/^-/, '−');
}

/** Rough width of a label in an SVG sans font, for collision checks (about 0.56 em a glyph). */
export function textWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56;
}
