/**
 * Shared SVG layout primitives for whiteboard diagram renderers.
 *
 * Every renderer uses the same viewBox aspect ratio (520×360) and a shared
 * padding convention so titles, legends, and notes line up consistently.
 */

export const DIAGRAM_VIEWBOX = {
  width: 520,
  height: 360,
} as const;

/**
 * Feature manifest — the structured list of named elements a renderer emits.
 * Returned back to the tutor as tool-result data so the model uses authoritative
 * names for targetFeature instead of guessing. Names here MUST match the
 * data-feature attributes the renderer writes into the DOM via feat().
 *
 * Kind is a coarse semantic bucket so the tutor can pick the right element
 * without parsing the name. Description is a short human-readable hint
 * ("data point A at (3, 4.2)") that helps the tutor match intent to name.
 * bbox is optional and normalized to 0–1 of the viewBox — when present it
 * lets the tutor reason about spatial relationships without a screenshot.
 */
export type FeatureKind =
  | 'point'
  | 'node'
  | 'vertex'
  | 'line'
  | 'edge'
  | 'segment'
  | 'curve'
  | 'axis'
  | 'annotation'
  | 'label'
  | 'equation'
  | 'region'
  | 'area'
  | 'zone'
  | 'shape'
  | 'object'
  | 'other';

export interface FeatureManifestEntry {
  name: string;
  kind: FeatureKind;
  description?: string;
  bbox?: { cx: number; cy: number; w: number; h: number };
  /**
   * Every natural-language variant that should resolve to this feature.
   * Populated by each renderer's buildXxxManifest — e.g. a point labeled
   * "A" at (2,3) in a coordinate plane declares:
   *   labels: ['A', 'point A', 'vertex A', 'point-a', 'vertex-a']
   * The WhiteboardCatalog matches the tutor's `target` string against
   * these (case + punctuation insensitive). If omitted, the catalog
   * falls back to a minimal auto-expansion of the canonical name.
   */
  labels?: string[];
  /**
   * Whether tutor_scribble can mark this feature. Defaults to true for
   * SVG/HTML elements we own. Iframe-backed renderers (Desmos, Ketcher)
   * register their whole-item feature with scribbleable: false — the
   * client cannot reach inside a cross-origin iframe to draw an overlay,
   * so scribble auto-redirects the tutor to tutor_scroll_whiteboard.
   */
  scribbleable?: boolean;
}

/**
 * Per-rendered-item manifest attached to a render result. pageTitle lets the
 * tutor disambiguate when multiple items live on a page. itemId is the same
 * id returned in assignedIds for the command.
 */
export interface RenderManifest {
  itemId: string;
  pageTitle?: string;
  pageIndex?: number;
  features: FeatureManifestEntry[];
}

export const DIAGRAM_PAD = {
  top: 36,       // room for a title
  bottom: 28,    // room for a caption / notes
  left: 24,
  right: 24,
} as const;

export function plotBox(viewbox = DIAGRAM_VIEWBOX, pad = DIAGRAM_PAD) {
  return {
    x: pad.left,
    y: pad.top,
    width: viewbox.width - pad.left - pad.right,
    height: viewbox.height - pad.top - pad.bottom,
    right: viewbox.width - pad.right,
    bottom: viewbox.height - pad.bottom,
    cx: viewbox.width / 2,
    cy: (pad.top + (viewbox.height - pad.bottom)) / 2,
  };
}

/**
 * Compact numeric formatting for on-chart labels.
 */
export function formatValue(v: number): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1000) return v.toFixed(0);
  if (abs >= 100) return v.toFixed(0);
  if (abs >= 10) return v.toFixed(1);
  if (abs >= 1) return v.toFixed(2).replace(/\.?0+$/, '');
  return v.toFixed(3).replace(/\.?0+$/, '');
}

/**
 * Evenly space N items within a range so adjacent items are separated by a
 * consistent gap and centered as a group.
 */
export function evenlySpaced(n: number, start: number, end: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [(start + end) / 2];
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/**
 * Rotate a point (px, py) around the origin by `angleRad` radians.
 */
export function rotate(px: number, py: number, angleRad: number): { x: number; y: number } {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return { x: px * c - py * s, y: px * s + py * c };
}

/**
 * Convert a degree angle (0° = East, 90° = North, as used elsewhere in the
 * codebase) to (dx, dy) in SVG coordinates where +y is down.
 */
export function degToVec(deg: number): { dx: number; dy: number } {
  const rad = (deg * Math.PI) / 180;
  return { dx: Math.cos(rad), dy: -Math.sin(rad) };
}

/**
 * Truncate a long label so it doesn't overflow a node / axis tick.
 */
export function truncate(s: string | undefined, max: number): string {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, Math.max(1, max - 1)) + '…';
}

/**
 * Build the data-feature-* attribute set used by tutor_scribble and
 * tutor_scroll_whiteboard to locate a labeled element without the tutor
 * having to guess coordinates. Inputs are the feature's bounding box in the
 * renderer's pixel space (cx/cy = center, w/h = extent); the helper converts
 * them to 0-1 fractions of the shared DIAGRAM_VIEWBOX.
 *
 * Consumers:
 *   - live: WhiteboardCanvas.ScribbleOverlays reads these via querySelector
 *   - PDF:  whiteboard-capture.overlayScribbles reads them from the
 *           captured SVG string via DOMParser
 *
 * Slug names for features should be lowercase-kebab-case (e.g. "stage-
 * precipitation", "vector-1", "species-shark") so the tutor can predict
 * them from visible labels without needing a lookup table.
 */
export function feat(
  name: string,
  bbox: { cx: number; cy: number; w: number; h: number },
  viewbox: { width: number; height: number } = DIAGRAM_VIEWBOX,
): Record<string, string> {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / viewbox.width).toFixed(3),
    'data-feature-cy': (bbox.cy / viewbox.height).toFixed(3),
    'data-feature-w': (bbox.w / viewbox.width).toFixed(3),
    'data-feature-h': (bbox.h / viewbox.height).toFixed(3),
  };
}

/**
 * Slugify a label to a safe data-feature suffix. Preserves alphanumerics
 * and collapses everything else to a single hyphen. Used by renderers that
 * derive feature names from tutor-supplied labels (e.g. cycle stages).
 */
export function featSlug(label: string): string {
  return String(label || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'unnamed';
}

/**
 * Short-label variant of featSlug for labels that carry coordinates or
 * parenthetical context (e.g. "A(2,3)", "B (left corner)"). Keeps only
 * the first alphanumeric token so the resulting feat name stays short
 * and matches how tutors / students refer to the element ("vertex A",
 * "point A"). Without this, featSlug("A(2,3)") = "a-2-3", and scribble
 * resolution of targetFeature="point-a" / "vertex-a" misses because the
 * renderer emitted data-feature="point-a-2-3" (2026-04-24 triangle ABC
 * session regression — scribble landed at the default fallback region).
 *
 * For labels without parentheses this returns the same thing as
 * featSlug, so it's safe to use everywhere.
 */
export function shortLabelSlug(label: string): string {
  const raw = String(label || '').trim();
  if (!raw) return 'unnamed';
  // Strip anything from the first opening paren or bracket onward.
  const beforeParen = raw.split(/[(\[]/)[0].trim();
  const source = beforeParen || raw;
  return featSlug(source);
}

