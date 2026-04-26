'use client';

/**
 * Whiteboard → SVG capture helpers for PDF export.
 *
 * Strategy: mount the existing CommandRenderer into a hidden off-screen
 * container using React 18's createRoot, wait for two animation frames so
 * all child components (SVG renderers, KaTeX, etc.) have painted, then
 * read the resulting DOM. This works identically for current-session and
 * past-session exports because we re-render from the raw command data in
 * both cases — no dependence on the on-screen whiteboard being visible.
 *
 * Two capture modes:
 *   - captureCommandSvg():   returns the first <svg> element's outerHTML
 *                            (used for structured diagram renderers)
 *   - captureCommandRaster(): returns a PNG data URL via html2canvas
 *                            (used for KaTeX-rendered equations and other
 *                             non-SVG React output)
 *
 * Both return null on failure so callers can fall back to the existing
 * text-label behavior without breaking the whole export.
 */

import type { WhiteboardCommand } from '@/lib/knowledge/types';

const CAPTURE_WIDTH_PX = 760;   // matches the whiteboard's nominal width
const CAPTURE_PADDING_PX = 16;  // matches the renderer's inner padding

type CaptureFn<T> = (command: WhiteboardCommand, container: HTMLDivElement) => Promise<T | null>;

/**
 * Mount CommandRenderer into a hidden container, run the capture callback,
 * then unmount and clean up. The container is positioned far off-screen so
 * the student never sees it during export.
 */
async function withMountedCommand<T>(command: WhiteboardCommand, capture: CaptureFn<T>): Promise<T | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  const [{ createRoot }, { CommandRenderer }] = await Promise.all([
    import('react-dom/client'),
    import('@/app/tutor/components/whiteboard/WhiteboardCanvas'),
  ]);
  const React = await import('react');

  const container = document.createElement('div');
  container.setAttribute('data-whiteboard-capture', 'true');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = `${CAPTURE_WIDTH_PX}px`;
  container.style.padding = `${CAPTURE_PADDING_PX}px`;
  container.style.background = 'white';
  container.style.pointerEvents = 'none';
  container.style.opacity = '1'; // keep visible to the layout engine
  document.body.appendChild(container);

  const root = createRoot(container);
  try {
    root.render(React.createElement(CommandRenderer, { command }));
    // Two rAFs — first lets React commit, second lets the browser paint and
    // any KaTeX / icon-font async work finish its first tick.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return await capture(command, container);
  } catch (err) {
    console.warn('[whiteboard-capture] Failed to render command for capture:', err);
    return null;
  } finally {
    try { root.unmount(); } catch { /* ignore */ }
    try { container.remove(); } catch { /* ignore */ }
  }
}

/**
 * Capture the first <svg> element rendered by the command. Returns the
 * serialized outerHTML (with xmlns attributes ensured) so svg2pdf.js can
 * parse and embed it. Returns null if no SVG was rendered (e.g. the
 * command is an equation or table).
 */
export async function captureCommandSvg(command: WhiteboardCommand): Promise<string | null> {
  return withMountedCommand(command, async (_cmd, container) => {
    const svg = container.querySelector('svg');
    if (!svg) return null;
    // Ensure xmlns is present so the SVG parses standalone.
    if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!svg.getAttribute('xmlns:xlink')) svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    return new XMLSerializer().serializeToString(svg);
  });
}

export interface RasterCapture {
  dataUrl: string;
  widthPx: number;
  heightPx: number;
}

/**
 * Capture the command's rendered DOM as a PNG data URL via html2canvas.
 * Used for equations (KaTeX spans) and other non-SVG output. Scale 2x for
 * retina-quality embedding into the PDF.
 *
 * If `scribbles` is provided, the helper first serializes the mounted SVG,
 * bakes the scribble marks in via overlayScribbles, re-parses the enriched
 * SVG back into the live DOM (replacing the original <svg>), then rasterizes.
 * This is the preferred path for renderers that mix emoji / system-font
 * glyphs into SVG <text>, because html2canvas uses the browser's font stack
 * (which has emoji) while svg2pdf relies on PDF-embedded fonts (which do
 * not).
 */
export async function captureCommandRaster(
  command: WhiteboardCommand,
  scribbles?: ScribbleInput[],
): Promise<RasterCapture | null> {
  return withMountedCommand(command, async (_cmd, container) => {
    // If scribbles requested, enrich the mounted SVG first so the rasterizer
    // captures the marks along with the underlying diagram.
    if (scribbles && scribbles.length > 0) {
      const svgWithFeatures = container.querySelector('svg [data-feature]')?.closest('svg');
      if (svgWithFeatures) {
        // SVG-mode item: bake scribbles into the SVG string and re-mount.
        if (!svgWithFeatures.getAttribute('xmlns')) svgWithFeatures.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const original = new XMLSerializer().serializeToString(svgWithFeatures);
        const enriched = overlayScribbles(original, scribbles);
        if (enriched !== original) {
          try {
            const doc = new DOMParser().parseFromString(enriched, 'image/svg+xml');
            const newSvg = doc.documentElement;
            if (newSvg && newSvg.nodeName.toLowerCase() === 'svg') {
              svgWithFeatures.parentNode?.replaceChild(document.importNode(newSvg, true), svgWithFeatures);
              await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            }
          } catch (err) {
            console.warn('[whiteboard-capture] Failed to re-mount enriched SVG:', err);
          }
        }
      } else {
        // HTML-mode item (KaTeX equation, table, problem card, ...).
        // Inject an absolutely-positioned SVG overlay over the rendered
        // element so html2canvas captures the marks together with the
        // content. Mirrors the live ScribbleOverlays HTML path.
        injectHtmlScribbleOverlay(container, scribbles);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    }
    const { default: html2canvas } = await import('html2canvas');
    // Find the smallest rendered child so we don't capture the full container
    // width when the content is narrow (keeps the PDF embed tight).
    const target = (container.firstElementChild as HTMLElement) || container;
    const canvas = await html2canvas(target, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
    });
    return {
      dataUrl: canvas.toDataURL('image/png'),
      widthPx: canvas.width,
      heightPx: canvas.height,
    };
  });
}

/**
 * Bake scribble overlays into an HTML-rendered command (equation, table,
 * problem card, ...) by appending an absolutely-positioned SVG to the
 * firstElementChild. The SVG's viewBox matches the target's CSS-pixel
 * dimensions and uses preserveAspectRatio="none" so marks stay 1:1 with
 * the captured area when html2canvas rasters it. Mirrors the live
 * ScribbleOverlays HTML mode so the PDF matches what the student saw.
 */
function injectHtmlScribbleOverlay(container: HTMLElement, scribbles: ScribbleInput[]): void {
  const target = (container.firstElementChild as HTMLElement) || null;
  if (!target) return;
  const targetRect = target.getBoundingClientRect();
  if (targetRect.width <= 0 || targetRect.height <= 0) return;

  type Resolved = { s: ScribbleInput; rx: number; ry: number; rw: number; rh: number };
  const resolved: Resolved[] = [];
  for (const s of scribbles) {
    if (!s.targetFeature) continue;
    const safe = s.targetFeature.replace(/"/g, '\\"');
    const el = target.querySelector(`[data-feature="${safe}"]`);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    resolved.push({
      s,
      rx: r.left - targetRect.left,
      ry: r.top - targetRect.top,
      rw: r.width,
      rh: r.height,
    });
  }
  if (resolved.length === 0) return;

  const computedPosition = window.getComputedStyle(target).position;
  if (computedPosition === 'static') target.style.position = 'relative';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(SVG_NS, 'svg');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('viewBox', `0 0 ${targetRect.width} ${targetRect.height}`);
  overlay.setAttribute('preserveAspectRatio', 'none');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  overlay.style.overflow = 'visible';

  const vw = targetRect.width;
  const vh = targetRect.height;

  resolved.forEach((entry, i) => {
    const { s, rx, ry, rw, rh } = entry;
    const color = s.color || '#f59e0b';
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;

    const group = document.createElementNS(SVG_NS, 'g');
    const setAttrs = (el: Element, attrs: Record<string, string | number>) => {
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    };

    switch (s.shape) {
      case 'circle': {
        const ellipse = document.createElementNS(SVG_NS, 'ellipse');
        setAttrs(ellipse, {
          cx, cy,
          rx: Math.max(vw * 0.015, rw / 2 + 4),
          ry: Math.max(vh * 0.015, rh / 2 + 4),
          fill: 'none', stroke: color,
          'stroke-width': Math.max(2, vw / 200),
        });
        group.appendChild(ellipse);
        break;
      }
      case 'underline': {
        const line = document.createElementNS(SVG_NS, 'line');
        setAttrs(line, {
          x1: rx, y1: ry + rh,
          x2: rx + rw, y2: ry + rh,
          stroke: color,
          'stroke-width': Math.max(2.5, vw / 170),
          'stroke-linecap': 'round',
        });
        group.appendChild(line);
        break;
      }
      case 'box': {
        const rect = document.createElementNS(SVG_NS, 'rect');
        setAttrs(rect, {
          x: rx - 2, y: ry - 2, width: rw + 4, height: rh + 4,
          fill: 'none', stroke: color,
          'stroke-width': Math.max(2, vw / 200),
        });
        group.appendChild(rect);
        break;
      }
      case 'highlight': {
        const rect = document.createElementNS(SVG_NS, 'rect');
        setAttrs(rect, {
          x: rx, y: ry, width: rw, height: rh,
          fill: color, 'fill-opacity': '0.25', stroke: 'none',
        });
        group.appendChild(rect);
        break;
      }
      case 'arrow': {
        const tailX = Math.max(0, rx - vw * 0.08);
        const tailY = Math.max(0, ry - vh * 0.08);
        const markerId = `pdf-html-arrow-${i}`;
        const defs = document.createElementNS(SVG_NS, 'defs');
        const marker = document.createElementNS(SVG_NS, 'marker');
        setAttrs(marker, {
          id: markerId, viewBox: '0 0 10 10',
          refX: '8', refY: '5',
          markerWidth: '4', markerHeight: '4',
          orient: 'auto-start-reverse',
        });
        const markerPath = document.createElementNS(SVG_NS, 'path');
        setAttrs(markerPath, { d: 'M0,0 L10,5 L0,10 Z', fill: color });
        marker.appendChild(markerPath);
        defs.appendChild(marker);
        group.appendChild(defs);
        const line = document.createElementNS(SVG_NS, 'line');
        setAttrs(line, {
          x1: tailX, y1: tailY, x2: cx, y2: cy,
          stroke: color,
          'stroke-width': Math.max(2, vw / 200),
          'marker-end': `url(#${markerId})`,
        });
        group.appendChild(line);
        break;
      }
    }

    if (s.label) {
      const text = document.createElementNS(SVG_NS, 'text');
      const labelY = Math.max(vh * 0.05, ry - 4);
      setAttrs(text, {
        x: cx, y: labelY,
        'font-size': Math.max(10, vw / 50),
        fill: color,
        'text-anchor': 'middle',
        'font-weight': '700',
        'paint-order': 'stroke',
        stroke: 'white',
        'stroke-width': Math.max(1.5, vw / 250),
        'stroke-linejoin': 'round',
      });
      text.textContent = s.label;
      group.appendChild(text);
    }

    overlay.appendChild(group);
  });

  target.appendChild(overlay);
}

/**
 * Set of show_* actions that should bypass the svg2pdf path and rasterize
 * via html2canvas instead. Add actions here when their renderer embeds
 * emoji / unicode / non-ASCII glyphs inside SVG <text> that svg2pdf can't
 * faithfully reproduce.
 */
export const RASTER_PREFERRED_ACTIONS: ReadonlySet<string> = new Set([
  'showCycleDiagram', // stage icons are emoji (🌧️, 🧬, ⚡)
  'showConceptMap',   // tutor-supplied node icons
  'showFlowchart',    // tutor-supplied node icons
]);

/**
 * Heuristic: does the captured SVG contain any character outside the
 * common Latin + punctuation + math range that svg2pdf renders faithfully?
 * This catches emoji and exotic unicode even when a renderer isn't in the
 * static allowlist above. Intentionally permissive — we'd rather raster a
 * few extra diagrams than ship a garbled glyph.
 */
export function svgContainsExoticGlyphs(svgString: string): boolean {
  return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F9FF}]/u.test(svgString);
}

/**
 * Embed a captured SVG into the jsPDF document at (x, y) scaled to fit
 * `width` while preserving aspect ratio. svg2pdf.js needs the SVG element
 * attached to the live DOM so getComputedStyle works, so we briefly mount
 * it off-screen, embed, then detach.
 *
 * Returns the height actually consumed in PDF units, for the caller's
 * vertical cursor. Falls back to returning 0 (no space consumed) if
 * anything goes wrong — the caller can then draw a text-label fallback.
 */
// Avoiding a top-level jsPDF import keeps the module happy on the server
// (pdf-tutor-session.ts is 'use client' already; this helper is too, but
// we want an any-compatible signature for easy consumption).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function drawCapturedSvg(pdf: any, svgString: string, x: number, y: number, widthMm: number): Promise<number> {
  if (typeof window === 'undefined') return 0;
  try {
    const { svg2pdf } = await import('svg2pdf.js');
    const { width: vbW, height: vbH } = parseSvgDimensions(svgString);
    const heightMm = (vbH / vbW) * widthMm;

    // Parse and mount off-screen so svg2pdf can compute styles.
    const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    const svgEl = doc.documentElement;
    if (!svgEl || svgEl.nodeName.toLowerCase() !== 'svg') return 0;

    const host = document.createElement('div');
    host.setAttribute('data-svg2pdf-host', 'true');
    host.style.position = 'fixed';
    host.style.left = '-99999px';
    host.style.top = '0';
    // Give it a concrete pixel size so layout + getComputedStyle resolve.
    host.style.width = `${vbW}px`;
    host.style.height = `${vbH}px`;
    document.body.appendChild(host);
    host.appendChild(svgEl);

    try {
      await svg2pdf(svgEl, pdf, { x, y, width: widthMm, height: heightMm });
      return heightMm;
    } finally {
      try { host.remove(); } catch { /* ignore */ }
    }
  } catch (err) {
    console.warn('[whiteboard-capture] drawCapturedSvg failed:', err);
    return 0;
  }
}

/**
 * A scribble command as it appears in WhiteboardCommand — narrowed for
 * this helper so callers don't need to import the full union.
 *
 * targetFeature is the canonical data-feature name the catalog resolver
 * stamped on the scribble command. The PDF overlay looks it up directly
 * against the captured SVG's data-feature-* attributes — no aliases, no
 * fuzzy matching. Mirrors the live ScribbleOverlays behavior so the PDF
 * is visually identical to the session.
 */
export interface ScribbleInput {
  shape: 'circle' | 'underline' | 'arrow' | 'box' | 'highlight';
  targetFeature?: string;
  color?: string;
  label?: string;
}

/**
 * Bake scribble annotations directly into a captured SVG string by
 * appending overlay shapes. The input coordinate space for scribble
 * regions is 0–1 (fractions of the target item); we scale to the SVG's
 * viewBox extent so the marks land in the right place after svg2pdf
 * embeds it. Returns a new SVG string; the original is not mutated.
 *
 * Rendering rules mirror the on-screen ScribbleOverlays component in
 * WhiteboardCanvas.tsx so the PDF visually matches the live session.
 */
export function overlayScribbles(svgString: string, scribbles: ScribbleInput[]): string {
  if (!scribbles || scribbles.length === 0) return svgString;
  try {
    const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    const svg = doc.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') return svgString;

    const { width: vw, height: vh } = parseSvgDimensions(svgString);
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Resolve a scribble's targetFeature against the captured SVG by exact
    // data-feature match. Same rule as the live overlay (ScribbleOverlays):
    // the catalog has already translated the tutor's input to a canonical
    // name that matches what the renderer emitted, so no aliases are needed.
    const resolveFeature = (name: string): { x: number; y: number; w: number; h: number } | null => {
      const safe = name.replace(/"/g, '\\"');
      const el = svg.querySelector(`[data-feature="${safe}"]`);
      if (!el) return null;
      const cx = Number(el.getAttribute('data-feature-cx'));
      const cy = Number(el.getAttribute('data-feature-cy'));
      const w = Number(el.getAttribute('data-feature-w'));
      const h = Number(el.getAttribute('data-feature-h'));
      if (![cx, cy, w, h].every(Number.isFinite)) return null;
      return {
        x: Math.max(0, cx - w / 2),
        y: Math.max(0, cy - h / 2),
        w: Math.min(1, w),
        h: Math.min(1, h),
      };
    };

    for (let i = 0; i < scribbles.length; i++) {
      const s = scribbles[i];
      const color = s.color || '#f59e0b';
      const resolved = s.targetFeature ? resolveFeature(s.targetFeature) : null;
      const rxFrac = resolved ? resolved.x : 0.35;
      const ryFrac = resolved ? resolved.y : 0.40;
      const rwFrac = resolved ? resolved.w : 0.30;
      const rhFrac = resolved ? resolved.h : 0.25;
      const rx = rxFrac * vw;
      const ry = ryFrac * vh;
      const rw = rwFrac * vw;
      const rh = rhFrac * vh;
      const cx = rx + rw / 2;
      const cy = ry + rh / 2;

      const group = doc.createElementNS(SVG_NS, 'g');

      const addAttrs = (el: Element, attrs: Record<string, string | number>) => {
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      };

      switch (s.shape) {
        case 'circle': {
          const ellipse = doc.createElementNS(SVG_NS, 'ellipse');
          addAttrs(ellipse, {
            cx, cy,
            rx: Math.max(4, rw / 2),
            ry: Math.max(3, rh / 2),
            fill: 'none',
            stroke: color,
            'stroke-width': Math.max(2, vw / 200),
          });
          group.appendChild(ellipse);
          break;
        }
        case 'underline': {
          const line = doc.createElementNS(SVG_NS, 'line');
          addAttrs(line, {
            x1: rx, y1: ry + rh,
            x2: rx + rw, y2: ry + rh,
            stroke: color,
            'stroke-width': Math.max(2.5, vw / 170),
            'stroke-linecap': 'round',
          });
          group.appendChild(line);
          break;
        }
        case 'box': {
          const rect = doc.createElementNS(SVG_NS, 'rect');
          addAttrs(rect, {
            x: rx, y: ry, width: rw, height: rh,
            fill: 'none', stroke: color,
            'stroke-width': Math.max(2, vw / 200),
          });
          group.appendChild(rect);
          break;
        }
        case 'highlight': {
          const rect = doc.createElementNS(SVG_NS, 'rect');
          addAttrs(rect, {
            x: rx, y: ry, width: rw, height: rh,
            fill: color, 'fill-opacity': '0.25', stroke: 'none',
          });
          group.appendChild(rect);
          break;
        }
        case 'arrow': {
          const tailX = Math.max(0, rx - vw * 0.08);
          const tailY = Math.max(0, ry - vh * 0.08);
          const markerId = `pdf-scribble-arrow-${i}`;
          const defs = doc.createElementNS(SVG_NS, 'defs');
          const marker = doc.createElementNS(SVG_NS, 'marker');
          addAttrs(marker, {
            id: markerId, viewBox: '0 0 10 10',
            refX: '8', refY: '5',
            markerWidth: '4', markerHeight: '4',
            orient: 'auto-start-reverse',
          });
          const markerPath = doc.createElementNS(SVG_NS, 'path');
          addAttrs(markerPath, { d: 'M0,0 L10,5 L0,10 Z', fill: color });
          marker.appendChild(markerPath);
          defs.appendChild(marker);
          group.appendChild(defs);
          const line = doc.createElementNS(SVG_NS, 'line');
          addAttrs(line, {
            x1: tailX, y1: tailY,
            x2: cx, y2: cy,
            stroke: color,
            'stroke-width': Math.max(2, vw / 200),
            'marker-end': `url(#${markerId})`,
          });
          group.appendChild(line);
          break;
        }
      }

      if (s.label) {
        // Stagger labels so multiple annotations on the same item don't
        // collide at the same y. Alternating above/below with widening
        // gaps matches the live overlay's behavior.
        const staggerSign = i % 2 === 0 ? -1 : 1;
        const staggerBand = Math.floor(i / 2) * vh * 0.03;
        const labelY = staggerSign < 0
          ? Math.max(vh * 0.05, ry - 4 - staggerBand)
          : Math.min(vh * 0.97, ry + rh + (vw / 50) + staggerBand);
        const text = doc.createElementNS(SVG_NS, 'text');
        addAttrs(text, {
          x: cx, y: labelY,
          'font-size': Math.max(10, vw / 50),
          fill: color,
          'text-anchor': 'middle',
          'font-weight': '700',
          'paint-order': 'stroke',
          stroke: 'white',
          'stroke-width': Math.max(1.5, vw / 250),
          'stroke-linejoin': 'round',
        });
        text.textContent = s.label;
        group.appendChild(text);
      }

      svg.appendChild(group);
    }
    return new XMLSerializer().serializeToString(svg);
  } catch (err) {
    console.warn('[whiteboard-capture] overlayScribbles failed; returning original SVG:', err);
    return svgString;
  }
}

/**
 * Parse the natural width/height of a captured SVG for PDF-layout sizing.
 * Prefers the viewBox if present, falls back to width/height attributes,
 * final fallback to the DIAGRAM_VIEWBOX defaults (520×360).
 */
export function parseSvgDimensions(svgString: string): { width: number; height: number } {
  const DEFAULT = { width: 520, height: 360 };
  try {
    const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    const svg = doc.documentElement;
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
        return { width: parts[2] || DEFAULT.width, height: parts[3] || DEFAULT.height };
      }
    }
    const w = Number.parseFloat(svg.getAttribute('width') || '');
    const h = Number.parseFloat(svg.getAttribute('height') || '');
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { width: w, height: h };
  } catch {
    /* fall through */
  }
  return DEFAULT;
}
