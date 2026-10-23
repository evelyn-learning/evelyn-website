/**
 * Small helpers shared by the hand-written thumbnail writers (stats-svg.ts,
 * table-svg.ts, number-line-svg.ts, solid-svg.ts): XML escaping, compact
 * number formatting, a 1/2/5 tick step, and the root <svg> document. Pure.
 */

export const esc = (s: unknown): string => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** A coordinate, at most two decimals. */
export const fmt = (n: number): string => (Math.abs(n) < 1e-9 ? '0' : String(Number(n.toFixed(2))));

/** A value as a tick label: up to four decimals, a typographic minus. */
export const num = (n: number): string => {
  const v = Number(n.toFixed(4));
  return (Object.is(v, -0) ? '0' : String(v)).replace(/^-/, '−');
};

export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** A tick step of 1, 2 or 5 × 10^k giving about `count` ticks across the span. */
export function niceStep(span: number, count = 6): number {
  const raw = Math.abs(span) / count || 1;
  const p = 10 ** Math.floor(Math.log10(raw));
  const k = raw / p;
  return (k < 1.5 ? 1 : k < 3.5 ? 2 : k < 7.5 ? 5 : 10) * p;
}

/** Ticks from lo to hi (inclusive, within rounding) at `step`, starting on a multiple of it. */
export function ticks(lo: number, hi: number, step: number, max = 60): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9 && out.length < max; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

/** Text clipped to `max` characters with an ellipsis (before escaping). */
export const clip = (s: unknown, max: number): string => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

export const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

export function svgDoc(w: number, h: number, body: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(w)} ${fmt(h)}" font-family="${FONT}">${body.join('')}</svg>`;
}
