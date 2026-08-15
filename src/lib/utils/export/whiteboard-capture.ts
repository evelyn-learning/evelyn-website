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

import type { WhiteboardCommand } from '@core/knowledge/types';
import { strokeOutline, tickSpine, highlightBand } from '@/lib/tutor/whiteboard/hand-stroke';
import { drawOnEnabled } from '@/app/tutor/components/whiteboard/useDrawOn';
import { placeNote, type Rect } from '@/lib/tutor/whiteboard/ink-placement';
import { resolveNoteFontFamilies } from '@/lib/tutor/whiteboard/note-font';

const CAPTURE_WIDTH_PX = 760;   // matches the whiteboard's nominal width
const CAPTURE_PADDING_PX = 16;  // matches the renderer's inner padding

/**
 * Replace emoji codepoints in any string field with bracketed ASCII so the
 * off-screen capture (which runs in a headless layout pass without system
 * emoji fonts) doesn't render surrogate-pair halves as Latin-1 mojibake.
 * Observed 2026-04-29 integers-rational session: "Pizza Puzzle 🍕"
 * captured as "Pizza Puzzle Ø<ßU" (bytes D8 3C DF 55 = UTF-8(🍕U) read as
 * Latin-1). Applied recursively over the command's title/label/text-style
 * fields and any nested string in `data` / `params`.
 */
const EMOJI_REPLACEMENTS: Record<string, string> = {
  '🍕': '[pizza]', '🍎': '[apple]', '🍊': '[orange]', '🍌': '[banana]', '🍇': '[grapes]',
  '🍓': '[strawberry]', '🍪': '[cookie]', '🍩': '[donut]', '🎂': '[cake]', '🍰': '[cake]',
  '🍞': '[bread]', '🧀': '[cheese]', '🍔': '[burger]', '🌭': '[hotdog]', '🌮': '[taco]',
  '🥕': '[carrot]', '🥦': '[broccoli]', '🌽': '[corn]', '🥚': '[egg]', '🥛': '[milk]',
  '🐶': '[dog]', '🐱': '[cat]', '🐭': '[mouse]', '🐰': '[rabbit]', '🦊': '[fox]',
  '🐻': '[bear]', '🐼': '[panda]', '🐯': '[tiger]', '🦁': '[lion]', '🐮': '[cow]',
  '🐷': '[pig]', '🐸': '[frog]', '🐔': '[chicken]', '🐧': '[penguin]', '🐦': '[bird]',
  '🐟': '[fish]', '🐢': '[turtle]', '🦋': '[butterfly]', '🐝': '[bee]', '🐛': '[bug]',
  '🌳': '[tree]', '🌲': '[tree]', '🌴': '[palm]', '🌵': '[cactus]',
  '⭐': '[star]', '✨': '[sparkles]', '🌟': '[star]', '🌙': '[moon]',
  '🌧️': '[rain]', '🌧': '[rain]', '☀️': '[sun]', '☀': '[sun]', '☁️': '[cloud]', '☁': '[cloud]',
  '🚗': '[car]', '🚌': '[bus]', '✈️': '[plane]', '✈': '[plane]',
  '🏠': '[house]', '🏫': '[school]', '⚽': '[soccer]', '🏀': '[basketball]',
  '🎯': '[target]', '🎲': '[dice]', '🧩': '[puzzle]',
  '📚': '[books]', '📖': '[book]', '🎨': '[art]', '🎵': '[music]', '💡': '[bulb]',
  '❤️': '[heart]', '❤': '[heart]', '💙': '[heart]', '💚': '[heart]', '💛': '[heart]',
  '👍': '[thumbs-up]', '👏': '[clap]', '🎉': '[party]', '🎊': '[party]', '🎁': '[gift]',
  '🎬': '[movie]', '🍿': '[popcorn]', '🎟️': '[ticket]', '🎟': '[ticket]', '🎫': '[ticket]',
  '🧬': '[dna]', '🧪': '[test-tube]', '🔬': '[microscope]',
  '⚡': '[lightning]', '🔋': '[battery]', '🧲': '[magnet]',
  '⚖️': '[scales]', '⚖': '[scales]', '⏱️': '[stopwatch]', '⏱': '[stopwatch]',
  '🔥': '[fire]', '❄️': '[snow]', '❄': '[snow]', '💧': '[water]',
};
function replaceEmojiInString(s: string): string {
  // Gate on ANY high surrogate (D800-DBFF) — earlier version checked only
  // the D83C high-surrogate, which silently skipped 1F400+ animals (D83D),
  // 1F600+ faces (D83D), and 1F900+ symbols (D83E), making most of the
  // EMOJI_REPLACEMENTS map dead code. Also include common BMP emoji ranges.
  if (!/[\uD800-\uDBFF]/.test(s) && !/[☀-➿⬀-⯿]/.test(s)) return s;
  let out = s;
  for (const [k, v] of Object.entries(EMOJI_REPLACEMENTS)) {
    if (out.includes(k)) out = out.split(k).join(v);
  }
  // Catch-all for surrogate pairs we didn't enumerate — replace with [emoji]
  // so the capture doesn't leak surrogate halves through Latin-1.
  out = out.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '[emoji]');
  return out;
}
function deepReplaceEmoji<T>(value: T): T {
  if (typeof value === 'string') return replaceEmojiInString(value) as T;
  if (Array.isArray(value)) return value.map(deepReplaceEmoji) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepReplaceEmoji(v);
    }
    return out as T;
  }
  return value;
}

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
    // Strip emoji from command before mounting so headless capture (no
    // system emoji fonts) doesn't render surrogate halves as Latin-1
    // mojibake. The brain still sees emoji on the live whiteboard;
    // this is PDF-export-only.
    const sanitizedCommand = deepReplaceEmoji(command);
    root.render(React.createElement(CommandRenderer, { command: sanitizedCommand }));
    // Two rAFs — first lets React commit, second lets the browser paint and
    // any KaTeX / icon-font async work finish its first tick.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    // Wait for ALL fonts referenced by the off-screen mount to finish
    // loading. Without this, html2canvas can capture a frame where
    // KaTeX has rendered the layout (so the math LOOKS placed) but
    // KaTeX_Main / KaTeX_Math / KaTeX_Size* fonts haven't finished
    // downloading — the radical glyph (√) renders without the vinculum
    // bar over its radicand and stacked fractions detach from their
    // numerator/denominator pieces. This was visible in the 2026-04-28
    // trig PDF (page 7 #15: tan 60° = √3/2 / 1/2). document.fonts.ready
    // resolves once every @font-face the document depends on has loaded
    // (or failed). Bounded with a 600ms timeout so a stuck/missing
    // font doesn't block the entire PDF export — better to ship a
    // slightly less crisp glyph than to hang forever.
    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => setTimeout(resolve, 600)),
      ]);
      // One more rAF after the font load so the browser repaints with
      // the now-loaded glyphs before html2canvas snapshots.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
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
  // 2026-07-11 round 3: feature-anchored notes now bake through THIS
  // raster path (not the vector path) — the browser rasterizer is the
  // only pipeline that renders them with the loaded Caveat webfont and
  // full Unicode; svg2pdf's WinAnsi fonts mangled both (see
  // overlayScribbles' routing doc). bakedNoteTextsOut mirrors the
  // out-param convention in pdf-tutor-session.ts's drawWhiteboardVisual.
  inkNotes?: InkNoteInput[],
  bakedNoteTextsOut?: string[],
): Promise<RasterCapture | null> {
  return withMountedCommand(command, async (_cmd, container) => {
    // If overlays requested, enrich the mounted SVG first so the rasterizer
    // captures the marks along with the underlying diagram.
    if ((scribbles && scribbles.length > 0) || (inkNotes && inkNotes.length > 0)) {
      const svgWithFeatures = container.querySelector('svg [data-feature]')?.closest('svg');
      if (svgWithFeatures) {
        // SVG-mode item: bake overlays into the SVG string and re-mount.
        if (!svgWithFeatures.getAttribute('xmlns')) svgWithFeatures.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const original = new XMLSerializer().serializeToString(svgWithFeatures);
        const { svg: enriched, bakedTexts } = overlayScribbles(original, scribbles, inkNotes);
        if (bakedNoteTextsOut && bakedTexts.length > 0) {
          bakedNoteTextsOut.push(...bakedTexts);
        }
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
      } else if (scribbles && scribbles.length > 0) {
        // HTML-mode item (KaTeX equation, table, problem card, ...).
        // Inject an absolutely-positioned SVG overlay over the rendered
        // element so html2canvas captures the marks together with the
        // content. Mirrors the live ScribbleOverlays HTML path. Notes
        // never bake on HTML-mode items (no data-feature SVG to resolve
        // against — see overlayScribbles' routing doc); they keep the
        // caption fallback.
        injectHtmlScribbleOverlay(container, scribbles);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    }
    // Find the smallest rendered child so we don't capture the full container
    // width when the content is narrow (keeps the PDF embed tight).
    const target = (container.firstElementChild as HTMLElement) || container;
    // Primary: html-to-image (SVG foreignObject — the BROWSER lays out the
    // node, so KaTeX vlist structures rasterize pixel-perfect). html2canvas
    // re-implements CSS layout and mispositions KaTeX fraction bars (the
    // rule strikes THROUGH the numerator) and detaches radical vinculums —
    // every fraction/radical in the 2026-07-10 coop-conics session PDF was
    // malformed; upstream html2canvas is unmaintained and the vlist bug is
    // open. Kept as fallback for anything foreignObject serialization
    // rejects (e.g. cross-origin subresources).
    try {
      const { toCanvas } = await import('html-to-image');
      const canvas = await toCanvas(target, { backgroundColor: '#ffffff', pixelRatio: 2 });
      if (canvas.width > 0 && canvas.height > 0) {
        return {
          dataUrl: canvas.toDataURL('image/png'),
          widthPx: canvas.width,
          heightPx: canvas.height,
        };
      }
    } catch (err) {
      console.warn('[whiteboard-capture] html-to-image failed, falling back to html2canvas:', err);
    }
    const { default: html2canvas } = await import('html2canvas');
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
    // Seed convention mirrors the live overlay (WhiteboardCanvas.tsx
    // ScribbleOverlays): targetFeature first, raw target second, 'mark'
    // fallback. ScribbleInput only declares targetFeature — the cast
    // tolerates a `target` field if a future caller ever plumbs it
    // through, without changing behavior today.
    const seed = `${(s as { targetFeature?: string; target?: string }).targetFeature ?? (s as { target?: string }).target ?? 'mark'}`;

    const group = document.createElementNS(SVG_NS, 'g');
    const setAttrs = (el: Element, attrs: Record<string, string | number>) => {
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    };

    // Post-redesign (2026-05-13): only `highlight` and `tick` paint
    // on the diagram. Legacy shapes (circle/underline/box/arrow) map
    // to `tick`. Labels move to the per-page annotation strip — they
    // don't render on the diagram itself anymore.
    if (s.shape === 'highlight') {
      // SmoothDraw P2: hand-drawn swipe when drawOnEnabled() and the
      // region is swipe-shaped; translucent rect otherwise (flag off,
      // or too-tall regions) — mirrors the live overlay exactly.
      const band = drawOnEnabled() ? highlightBand({ x: rx, y: ry, w: rw, h: rh }, seed) : null;
      if (band) {
        const swipe = document.createElementNS(SVG_NS, 'path');
        setAttrs(swipe, { d: strokeOutline(band.spine, band.width, seed), fill: color, 'fill-opacity': '0.3', stroke: 'none' });
        group.appendChild(swipe);
      } else {
        const rect = document.createElementNS(SVG_NS, 'rect');
        setAttrs(rect, {
          x: rx, y: ry, width: rw, height: rh,
          fill: color, 'fill-opacity': '0.25', stroke: 'none',
        });
        group.appendChild(rect);
      }
    } else {
      // Corner-outside anchor + clamps — mirrors the live overlay's tick
      // placement in WhiteboardCanvas.tsx (2026-07-10: the centered-right
      // anchor struck through equation content; see comment there).
      const tickSize = Math.max(16, Math.min(vw, vh) * 0.06);
      const half = tickSize / 2;
      let tx = rx + rw + half * 0.6;
      let ty = ry - half * 0.2;
      if (tx + half > vw - 2) tx = rx + rw - half * 0.8;
      if (ty - half * 0.6 < 2) ty = ry + half * 0.8;
      const inner = Math.max(3, tickSize * 0.25);
      if (drawOnEnabled()) {
        // Hand-drawn ✓: same spine geometry as the live overlay, two
        // filled variable-width outlines (white halo + colored tick).
        const spine = tickSpine(tx, ty, tickSize);
        const halo = document.createElementNS(SVG_NS, 'path');
        setAttrs(halo, { d: strokeOutline(spine, inner + Math.max(2, tickSize * 0.14) + 2, `${seed}-halo`), fill: '#ffffff', opacity: '0.95', stroke: 'none' });
        group.appendChild(halo);
        const handTick = document.createElementNS(SVG_NS, 'path');
        setAttrs(handTick, { d: strokeOutline(spine, inner + 1.5, seed), fill: color, stroke: 'none' });
        group.appendChild(handTick);
      } else {
        const d = `M ${tx - half} ${ty} L ${tx - half * 0.25} ${ty + half * 0.7} L ${tx + half} ${ty - half * 0.6}`;
        // White halo underneath for any-background readability —
        // matches the live overlay's dual-stroke approach.
        const halo = document.createElementNS(SVG_NS, 'path');
        setAttrs(halo, {
          d, fill: 'none', stroke: '#ffffff',
          'stroke-width': inner + Math.max(2, tickSize * 0.14),
          'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.95',
        });
        group.appendChild(halo);
        const tickPath = document.createElementNS(SVG_NS, 'path');
        setAttrs(tickPath, {
          d, fill: 'none', stroke: color,
          'stroke-width': inner,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        });
        group.appendChild(tickPath);
      }
    }
    // Labels deliberately not drawn on the diagram — moved to the
    // per-page annotation strip below the rendered items.
    void i;
    void cx;

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
  'showCycleDiagram',  // stage icons are emoji (🌧️, 🧬, ⚡)
  'showConceptMap',    // tutor-supplied node icons
  'showFlowchart',     // tutor-supplied node icons
  // The trig diagrams below embed √, π, and Greek letters in SVG <text>.
  // svg2pdf falls back to helvetica (WinAnsi only) and substitutes those
  // glyphs with whatever lookalike (or junk) sits at the same code point —
  // observed 2026-04-28: "(-1/2, √3/2)" rendered as "(-1/2, "3/2)" in the
  // unit-circle export. Force raster so the browser's font stack is used.
  'showUnitCircle',
  'showSpecialTriangles',
]);

/**
 * Char range that helvetica's WinAnsi (Latin-1) covers cleanly, plus the
 * common Unicode punctuation we transliterate up-stream. Anything OUTSIDE
 * this range that lands in SVG <text> via svg2pdf will either substitute,
 * drop, or render with a wrong glyph (the unit-circle "√" → '"' bug).
 *
 * Kept as a single regex per `svgContainsExoticGlyphs` call so the hot
 * path is one .test() per captured SVG.
 */
const EXOTIC_GLYPH_REGEX = new RegExp(
  // Emoji & symbols (kept from prior version)
  '[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{1F000}-\\u{1F9FF}]'
  // Greek + Coptic — π θ Δ Σ etc. (math labels in unit circle, geometry)
  + '|[\\u{0370}-\\u{03FF}]'
  // Mathematical Operators block — √ ∞ ∫ ∂ ≤ ≥ ≠ ± ⊥ ∥ ∈ ∉ etc.
  + '|[\\u{2200}-\\u{22FF}]'
  // Arrows (→ ← ⇒ ⇔) — appear as labels in vector diagrams
  + '|[\\u{2190}-\\u{21FF}]'
  // Superscripts/subscripts (² ³ ⁻ ₂ ₃) — common in physics diagrams
  + '|[\\u{2070}-\\u{209F}]'
  // Mathematical Alphanumeric Symbols (𝛼 𝜋 etc.) — rare but real
  + '|[\\u{1D400}-\\u{1D7FF}]',
  'u',
);

/**
 * Heuristic: does the captured SVG contain any character outside the
 * common Latin + punctuation range that svg2pdf renders faithfully?
 * Catches emoji, math operators (√ ∫ ∞ ≤), Greek letters (π θ Δ), and
 * arrows even when a renderer isn't in the static allowlist above.
 * Intentionally permissive — we'd rather raster a few extra diagrams
 * than ship a garbled glyph.
 */
export function svgContainsExoticGlyphs(svgString: string): boolean {
  return EXOTIC_GLYPH_REGEX.test(svgString);
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
  // Post-redesign vocabulary is `tick` + `highlight`. Legacy shapes
  // (circle/underline/arrow/box) are accepted-but-remapped to `tick`
  // by both the live overlay and PDF capture for back-compat with
  // old session state and cached brain calls.
  shape: 'tick' | 'highlight' | 'circle' | 'underline' | 'arrow' | 'box';
  targetFeature?: string;
  color?: string;
  label?: string;
}

/**
 * SmoothDraw Phase 3 (task 5) — a feature-anchored tutor note as it
 * appears in a `handwrite` WhiteboardCommand once its `near` string has
 * been resolved to a canonical `targetFeature` (see VoiceTutorRealtime's
 * near-resolution block). Narrowed for this helper, mirroring
 * ScribbleInput. Notes without a `targetFeature`, or whose `targetFeature`
 * doesn't match any `data-feature` element in the item being captured,
 * are NOT baked — `overlayScribbles` reports back only the ones it did
 * bake (see `bakedTexts` below) so the caller knows to keep the
 * existing caption-line rendering for everything else.
 */
export interface InkNoteInput {
  text: string;
  color?: string;
  targetFeature?: string;
}

/** Greedy word-wrap by character count (~24 chars/line), capped at 4
 *  lines with a trailing ellipsis on overflow. This is the documented
 *  approximation for note text baked into an SVG STRING — unlike the
 *  live InkNotesOverlay (measureNote in InkNotesOverlay.tsx), this
 *  pipeline never touches a mounted canvas 2d context, so there's no
 *  ctx.measureText available to wrap by actual glyph width. */
function wrapNoteByChars(text: string, maxChars = 24, maxLines = 4): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (probe.length <= maxChars || !line) {
      line = probe;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  else if (line && lines.length === maxLines) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(0, maxChars - 1))}…`;
  }
  return lines.length > 0 ? lines : [''];
}

/**
 * Bake scribble annotations AND (SmoothDraw P3) feature-anchored tutor
 * notes directly into a captured SVG string by appending overlay shapes.
 * The input coordinate space for scribble regions is 0–1 (fractions of
 * the target item); we scale to the SVG's viewBox extent so the marks
 * land in the right place after svg2pdf embeds it. Returns a new SVG
 * string plus the list of note texts that were actually baked; the
 * original SVG string is not mutated.
 *
 * Rendering rules mirror the on-screen ScribbleOverlays component in
 * WhiteboardCanvas.tsx so the PDF visually matches the live session.
 *
 * Return shape: `{ svg, bakedTexts }` rather than widening this into an
 * out-param, because both of this function's call sites (here and in
 * pdf-tutor-session.ts) already sit at a natural assignment point
 * (`svgString = overlayScribbles(...)` / `const enriched = ...`) — an
 * object destructure is a one-line change at each, and it keeps the
 * "did it bake" signal attached to its own SVG-mutation call instead of
 * threaded through a side-channel array the way the OUTER
 * drawWhiteboardVisual → export-loop hop is (see `bakedNoteTextsOut` in
 * pdf-tutor-session.ts, where widening the return type would have meant
 * touching ~15 call sites that only care about the `number` cursor).
 * `bakedTexts` matches by note TEXT, not identity — the caller passes
 * only the small set of notes it just supplied for THIS item, so a
 * text collision would only mis-attribute a bake within that same
 * item's own note list, an edge case not worth a synthetic id for.
 *
 * Note-bake routing (2026-07-11 round 3 — REVERSED from the original
 * "vector path only" scope): an SVG string carrying baked notes must be
 * RASTERIZED in the browser (captureCommandRaster), never handed to
 * svg2pdf/drawCapturedSvg. svg2pdf renders <text> with jsPDF's built-in
 * WinAnsi fonts — no Caveat (baked notes came out serif) and no Unicode
 * beyond Latin-1 (the user's "√(6² + 3²)" note baked as `"(6² + 3²)`;
 * √ mangled). The browser rasterizer lays the SVG out with the page's
 * loaded webfonts and full Unicode, so both problems vanish. Callers in
 * pdf-tutor-session.ts enforce the routing: items with pending inkNotes
 * go through captureCommandRaster (which threads them into this
 * function); the vector path only ever receives scribble ticks/
 * highlights (pure paths, no <text> — svg2pdf-safe). Still without a
 * bake path: the non-SVG HTML-mode fallback (injectHtmlScribbleOverlay —
 * DOM-measurement based, not this string/data-feature convention) and
 * `showEquation` (short-circuits to raster before any note lookup);
 * both keep the honest caption fallback.
 */
export function overlayScribbles(
  svgString: string,
  scribbles?: ScribbleInput[],
  inkNotes?: InkNoteInput[],
): { svg: string; bakedTexts: string[] } {
  const hasScribbles = !!scribbles && scribbles.length > 0;
  const hasNotes = !!inkNotes && inkNotes.length > 0;
  if (!hasScribbles && !hasNotes) return { svg: svgString, bakedTexts: [] };
  try {
    const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    const svg = doc.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') return { svg: svgString, bakedTexts: [] };

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

    for (let i = 0; hasScribbles && i < (scribbles as ScribbleInput[]).length; i++) {
      const s = (scribbles as ScribbleInput[])[i];
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
      // Seed convention mirrors the live overlay (WhiteboardCanvas.tsx
      // ScribbleOverlays): targetFeature first, raw target second, 'mark'
      // fallback. ScribbleInput only declares targetFeature — the cast
      // tolerates a `target` field if a future caller ever plumbs it
      // through, without changing behavior today.
      const seed = `${(s as { targetFeature?: string; target?: string }).targetFeature ?? (s as { target?: string }).target ?? 'mark'}`;

      const group = doc.createElementNS(SVG_NS, 'g');

      const addAttrs = (el: Element, attrs: Record<string, string | number>) => {
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      };

      // Post-redesign vocabulary: only `highlight` paints a fill; every
      // other shape (including legacy `circle`/`underline`/`box`/`arrow`)
      // maps to a small tick just past the feature's right edge.
      if (s.shape === 'highlight') {
        // SmoothDraw P2: hand-drawn swipe when drawOnEnabled() and the
        // region is swipe-shaped; translucent rect otherwise (flag off,
        // or too-tall regions) — mirrors the live overlay exactly.
        const band = drawOnEnabled() ? highlightBand({ x: rx, y: ry, w: rw, h: rh }, seed) : null;
        if (band) {
          const swipe = doc.createElementNS(SVG_NS, 'path');
          addAttrs(swipe, { d: strokeOutline(band.spine, band.width, seed), fill: color, 'fill-opacity': '0.3', stroke: 'none' });
          group.appendChild(swipe);
        } else {
          const rect = doc.createElementNS(SVG_NS, 'rect');
          addAttrs(rect, {
            x: rx, y: ry, width: rw, height: rh,
            fill: color, 'fill-opacity': '0.25', stroke: 'none',
          });
          group.appendChild(rect);
        }
      } else {
        // Corner-outside anchor + clamps — keep in lockstep with the live
        // overlay (WhiteboardCanvas.tsx) and the capture mirror above.
        const tickSize = Math.max(16, Math.min(vw, vh) * 0.06);
        const half = tickSize / 2;
        let tx = rx + rw + half * 0.6;
        let ty = ry - half * 0.2;
        if (tx + half > vw - 2) tx = rx + rw - half * 0.8;
        if (ty - half * 0.6 < 2) ty = ry + half * 0.8;
        const inner = Math.max(3, tickSize * 0.25);
        if (drawOnEnabled()) {
          // Hand-drawn ✓: same spine geometry as the live overlay, two
          // filled variable-width outlines (white halo + colored tick).
          const spine = tickSpine(tx, ty, tickSize);
          const halo = doc.createElementNS(SVG_NS, 'path');
          addAttrs(halo, { d: strokeOutline(spine, inner + Math.max(2, tickSize * 0.14) + 2, `${seed}-halo`), fill: '#ffffff', opacity: '0.95', stroke: 'none' });
          group.appendChild(halo);
          const handTick = doc.createElementNS(SVG_NS, 'path');
          addAttrs(handTick, { d: strokeOutline(spine, inner + 1.5, seed), fill: color, stroke: 'none' });
          group.appendChild(handTick);
        } else {
          const d = `M ${tx - half} ${ty} L ${tx - half * 0.25} ${ty + half * 0.7} L ${tx + half} ${ty - half * 0.6}`;
          const halo = doc.createElementNS(SVG_NS, 'path');
          addAttrs(halo, {
            d, fill: 'none', stroke: '#ffffff',
            'stroke-width': inner + Math.max(2, tickSize * 0.14),
            'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.95',
          });
          group.appendChild(halo);
          const tickPath = doc.createElementNS(SVG_NS, 'path');
          addAttrs(tickPath, {
            d, fill: 'none', stroke: color,
            'stroke-width': inner,
            'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          });
          group.appendChild(tickPath);
        }
      }
      // Labels intentionally not drawn on the diagram — moved to the
      // per-page annotation strip mirror further down the PDF page.
      void cx;

      svg.appendChild(group);
    }

    // SmoothDraw P3 (task 5): bake feature-anchored notes. Runs AFTER the
    // scribbles loop so a note and a tick on the same feature both land
    // (order doesn't matter — they occupy different visual channels,
    // ticks corner-anchored vs notes slot-placed outside the target).
    const bakedTexts: string[] = [];
    if (hasNotes) {
      for (const note of inkNotes as InkNoteInput[]) {
        if (!note.text || !note.text.trim()) continue;
        // No targetFeature (unresolved `near`, or flag-off never sets one)
        // → this is a margin note; the caller keeps its caption line.
        if (!note.targetFeature) continue;
        const resolvedFrac = resolveFeature(note.targetFeature);
        // Doesn't match a data-feature element on THIS item's SVG — the
        // note's target lives on a different item (or nowhere). Silent,
        // round-7 style: caller falls back to the caption line.
        if (!resolvedFrac) continue;

        const targetRectPx: Rect = {
          x: resolvedFrac.x * vw,
          y: resolvedFrac.y * vh,
          w: resolvedFrac.w * vw,
          h: resolvedFrac.h * vh,
        };
        const lines = wrapNoteByChars(note.text);
        // Font-size scaled the same way the scribble tick above is
        // (`Math.max(floor, fraction * min(vw,vh))`) — a smaller fraction
        // because this sizes a multi-line text block, not one glyph.
        const fontSize = Math.max(10, Math.min(vw, vh) * 0.045);
        const lineH = fontSize * 1.2;
        // No canvas measureText in this string pipeline (see
        // wrapNoteByChars) — approximate glyph width ONLY for the note's
        // placement box; the visual wrap already happened above by
        // character count.
        const longestLine = Math.max(...lines.map((l) => l.length), 1);
        const noteW = Math.min(longestLine * fontSize * 0.52, vw * 0.6);
        const noteH = lines.length * lineH + fontSize * 0.3;
        // R2 E3 (2026-07-26): a note the student dragged live carries
        // `userPos` on its source WhiteboardCommand — a target-relative
        // offset in whole-PAGE host px (InkNotesOverlay measures against
        // the page wrapper, which can hold many stacked items). This bake
        // runs PER ITEM against that item's own local SVG viewBox
        // (`vw`/`vh` above), an entirely different coordinate space with
        // no available mapping back to "where was this item within the
        // live page, and at what host/viewBox scale" from here — this
        // pipeline never sees the host page at all. Deliberate v1 scope
        // (see task-6 brief step 8): `InkNoteInput` (this function's input
        // type, just above) intentionally does NOT carry `userPos` — the
        // caller (pdf-tutor-session.ts) narrows each command down to
        // `{text, color, targetFeature}` before it ever reaches here, so a
        // dragged note structurally cannot influence this bake and always
        // lands at the AUTO slot-engine position below, same as an
        // undragged one, rather than ship a coordinate conversion that's
        // wrong. The live board is the authoritative view of a dragged
        // note's position; only the exported PDF snapshot doesn't reflect
        // the drag.

        const placement = placeNote({
          target: targetRectPx,
          // Per the task-5 brief: place each note against the item's OWN
          // viewBox with an empty occupied set. Multiple notes baked into
          // the SAME item in one call can therefore overlap each other —
          // accepted for this scope (a captured item typically carries at
          // most one or two co-targeting notes). The live overlay
          // (InkNotesOverlay) is the one that accumulates `occupied`
          // across notes, because it places every note on a page in one
          // pass; this per-item bake call has no equivalent cross-note
          // view.
          occupied: [],
          page: { x: 0, y: 0, w: vw, h: vh },
          note: { w: noteW, h: noteH },
        });

        const color = note.color || '#a16207';
        // 2026-07-11 round 2 (user PDF: baked note rendered as solid white
        // blobs): round 1 used `paint-order="stroke"` + a white stroke on
        // the SAME <text> element — the SVG→raster/svg2pdf pipeline either
        // ignores paint-order (stroke painted OVER fill) or the stroke
        // swallowed the glyphs at item-viewBox font scale. Replaced with
        // the codebase's PROVEN dual-element halo pattern (see the tick
        // halo above: separate white copy UNDER the colored copy — no
        // paint-order reliance anywhere in that path, verified in prod
        // PDFs).
        //
        // Layer 1 — soft white backdrop rect behind the whole text block:
        // PDF lockstep with InkNotesOverlay's live note `background:
        // rgba(255,255,255,0.72)` + 4px radius/x-padding (that file's
        // note div references this site and vice versa). Proportions are
        // anchored to the live 22px reference font, scaled by this bake
        // site's own fontSize.
        const notePadX = fontSize * (4 / 22);
        const backdrop = doc.createElementNS(SVG_NS, 'rect');
        backdrop.setAttribute('x', String(placement.rect.x - notePadX));
        backdrop.setAttribute('y', String(placement.rect.y));
        backdrop.setAttribute('width', String(noteW + notePadX * 2));
        backdrop.setAttribute('height', String(noteH));
        backdrop.setAttribute('rx', String(notePadX));
        backdrop.setAttribute('fill', '#ffffff');
        backdrop.setAttribute('fill-opacity', '0.72');
        backdrop.setAttribute('stroke', 'none');
        svg.appendChild(backdrop);
        // Layers 2+3 — dual <text>: white-stroked halo copy first, clean
        // color-filled copy on top. stroke-width fontSize*0.25 (≈5.5px at
        // the 22px live reference — thick enough to halo, thin enough to
        // never swallow glyphs since the clean fill paints over it).
        // 2026-07-11 round 3 — two rendering contracts for this text:
        //   RAW text, ALWAYS. `lines` comes straight from note.text with
        //   no sanitizeForPDF/toWinAnsiSafe pass — those maps exist for
        //   jsPDF CAPTION text (WinAnsi-only built-in fonts; see
        //   drawNoteCaptionLine in pdf-tutor-session.ts, which keeps
        //   sanitizing). This SVG is rasterized BY THE BROWSER
        //   (captureCommandRaster), which renders √/²/π natively —
        //   sanitizing here would degrade correct output.
        //   Fonts: the family list is RESOLVED via the shared note-font
        //   module — next/font's hashed families are unreachable through
        //   the literal 'Caveat, Kalam' names (same class of bug as
        //   InkNotesOverlay's canvas noteFont; round-3 user PDF showed
        //   baked notes in serif). Capture runs in-browser with the page
        //   fonts loaded, so the resolved names rasterize correctly.
        const noteFontFamily = resolveNoteFontFamilies();
        const mkNoteText = (): Element => {
          const t = doc.createElementNS(SVG_NS, 'text');
          t.setAttribute('x', String(placement.rect.x));
          t.setAttribute('y', String(placement.rect.y + fontSize));
          t.setAttribute('font-family', noteFontFamily);
          t.setAttribute('font-size', String(fontSize));
          lines.forEach((line, li) => {
            const tspan = doc.createElementNS(SVG_NS, 'tspan');
            tspan.setAttribute('x', String(placement.rect.x));
            if (li > 0) tspan.setAttribute('dy', String(lineH));
            tspan.textContent = line;
            t.appendChild(tspan);
          });
          return t;
        };
        const haloText = mkNoteText();
        haloText.setAttribute('fill', '#ffffff');
        haloText.setAttribute('stroke', '#ffffff');
        haloText.setAttribute('stroke-width', String(fontSize * 0.25));
        haloText.setAttribute('stroke-linejoin', 'round');
        haloText.setAttribute('opacity', '0.95');
        svg.appendChild(haloText);
        const textEl = mkNoteText();
        textEl.setAttribute('fill', color);
        textEl.setAttribute('stroke', 'none');
        svg.appendChild(textEl);
        bakedTexts.push(note.text);
      }
    }

    return { svg: new XMLSerializer().serializeToString(svg), bakedTexts };
  } catch (err) {
    console.warn('[whiteboard-capture] overlayScribbles failed; returning original SVG:', err);
    return { svg: svgString, bakedTexts: [] };
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
