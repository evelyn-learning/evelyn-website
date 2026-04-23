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
 */
export async function captureCommandRaster(command: WhiteboardCommand): Promise<RasterCapture | null> {
  return withMountedCommand(command, async (_cmd, container) => {
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
