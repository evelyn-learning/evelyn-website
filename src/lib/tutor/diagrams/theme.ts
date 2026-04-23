/**
 * Shared theme for structured whiteboard diagram renderers.
 *
 * Keeps colors, font sizes, stroke widths, and font stacks consistent across
 * every renderer so new tools visually harmonize with the already-shipped
 * Free-Body, Energy-Bars, Collision, and Reaction-Coordinate diagrams.
 */

export const DIAGRAM_COLORS = {
  // Semantic palette — match the FBD / EnergyBars renderers.
  primary: '#2563eb',   // blue — tension, main curves, generic highlights
  secondary: '#dc2626', // red — motion, KE, reactants, "danger"/input
  success: '#16a34a',   // green — gravity/weight, PE, products, living things
  warning: '#d97706',   // amber — normal force, catalysts, halt
  accent: '#9333ea',    // purple — friction, thermal, magnetic, niche
  cyan: '#0891b2',      // cyan — springs (sometimes), water, supplementary
  pink: '#db2777',      // pink — affection / heredity carrier markers
  slate: '#475569',     // slate — axes, baseline structural lines

  // Neutrals.
  text: '#0f172a',
  muted: '#64748b',
  axis: '#475569',
  grid: '#e2e8f0',
  panel: '#f8fafc',
  border: '#cbd5e1',

  white: '#ffffff',
  black: '#000000',

  // Rainbow cycle for scatter / legend series without explicit color.
  cycle: [
    '#2563eb', '#dc2626', '#16a34a', '#9333ea',
    '#ea580c', '#0891b2', '#db2777', '#0d9488',
  ],
} as const;

export type DiagramColor = keyof typeof DIAGRAM_COLORS;

export const DIAGRAM_FONTS = {
  family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "Cascadia Code", Consolas, monospace',

  sizes: {
    title: 16,
    heading: 14,
    body: 12,
    caption: 11,
    micro: 10,
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const DIAGRAM_STROKES = {
  hairline: 0.75,
  thin: 1,
  regular: 1.5,
  bold: 2,
  heavy: 3,
} as const;

/**
 * Slightly darken a hex color for stroke / outline contrast against its fill.
 */
export function darken(hex: string, amount = 40): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Slightly lighten a hex color (mix toward white).
 */
export function lighten(hex: string, amount = 40): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Add an alpha channel to a hex color (rrggbbaa form).
 */
export function withAlpha(hex: string, alpha: number): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const a = Math.max(0, Math.min(255, Math.round(alpha * 255)))
    .toString(16)
    .padStart(2, '0');
  return `#${m[1]}${a}`;
}

/**
 * Pick a color from the cycle palette (deterministic by index).
 */
export function cycleColor(index: number): string {
  return DIAGRAM_COLORS.cycle[((index % DIAGRAM_COLORS.cycle.length) + DIAGRAM_COLORS.cycle.length) % DIAGRAM_COLORS.cycle.length];
}
