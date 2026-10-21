/**
 * Axis tick steps for show_function_graph.
 *
 * 2026-10-20 (GAC "Geometry & Graphs" upload portal-f7a639d4, problem 8): the
 * sheet's sine graph has its x-axis marked π/2, π, 3π/2, 2π; the board drew it
 * over 0…6.6 with numeric ticks, so the student could not read the period off
 * the board the way the sheet asks. The tool now takes `xAxisStep` /
 * `yAxisStep` as a number or a π expression ("pi/2", "π", "2pi", "3pi/4").
 */

const PI_STEP_RE = /^\s*(\d+(?:\.\d+)?)?\s*\*?\s*(?:pi|π)\s*(?:\/\s*(\d+(?:\.\d+)?))?\s*$/i;

/** A step as a number, or undefined when absent or unreadable. */
export function parseAxisStep(v: unknown): number | undefined {
  if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? v : undefined;
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  if (!s) return undefined;
  const m = s.match(PI_STEP_RE);
  if (m) {
    const num = m[1] ? parseFloat(m[1]) : 1;
    const den = m[2] ? parseFloat(m[2]) : 1;
    const step = (num * Math.PI) / den;
    return Number.isFinite(step) && step > 0 ? step : undefined;
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Is this step a rational multiple of π (so ticks should be labelled in π)? */
export function isPiStep(step: number | undefined): boolean {
  if (!step) return false;
  const k = step / Math.PI;
  for (const den of [1, 2, 3, 4, 6, 8, 12]) {
    const num = k * den;
    if (Math.abs(num - Math.round(num)) < 1e-9 && Math.round(num) >= 1) return true;
  }
  return false;
}

/** "π/2", "π", "3π/2", "2π", "0", "−π/2" — a tick value on a π-stepped axis. */
export function labelPiTick(value: number, step: number): string {
  const k = step / Math.PI;
  let den = 1;
  for (const d of [1, 2, 3, 4, 6, 8, 12]) {
    if (Math.abs(k * d - Math.round(k * d)) < 1e-9) { den = d; break; }
  }
  const n = Math.round((value / Math.PI) * den);
  if (n === 0) return '0';
  const sign = n < 0 ? '−' : '';
  const a = Math.abs(n);
  const g = gcd(a, den);
  const num = a / g;
  const d = den / g;
  const numText = num === 1 ? '' : String(num);
  return d === 1 ? `${sign}${numText}π` : `${sign}${numText}π/${d}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
