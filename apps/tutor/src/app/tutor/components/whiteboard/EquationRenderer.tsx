'use client';

/**
 * Equation Renderer
 *
 * Renders LaTeX equations using KaTeX with optional highlighting
 * and labels for step-by-step explanations.
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { InlineMathText } from './InlineMathText';
import { splitLatexToLines } from '@/lib/tutor/whiteboard/equation-split';
import { preprocessKatexBody } from '@/lib/tutor/whiteboard/inline-math';
import { attachHScrollFade, type HScrollFadeHandle } from '@/lib/tutor/whiteboard/hscroll-fade';

interface EquationRendererProps {
  latex: string;
  label?: string;
  highlight?: string[];
  className?: string;
  displayMode?: boolean;
}

export function EquationRenderer({
  latex,
  label,
  highlight,
  className = '',
  displayMode = true,
}: EquationRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let processedLatex = '';
    try {
      // Fix double-escaped LaTeX (e.g. \\frac → \frac) that can come from AI model output.
      // The newline conversion uses a negative lookahead so it doesn't eat
      // the start of LaTeX commands that begin with `\n` — \neq, \not, \nabla,
      // \nu, \nrightarrow, etc. Without this, "23 \neq 5" rendered as "23eq5"
      // because the \n was stripped as a "literal newline" escape.
      processedLatex = preprocessKatexBody(latex);

      // Auto-wrap multi-line latex in \begin{aligned}...\end{aligned} when
      // the brain emits `\\` line breaks or `\hline` outside an environment.
      // KaTeX only interprets these inside aligned/array/cases/matrix; outside
      // it errors with throwOnError:false and renders the raw input in red
      // (the 2026-04-29 algebra session #30 "Subtraction Step" showed
      // "10x + 15y = 60 \\ -\;(10x + 8y = 46) \\ \hline 7y = 14 \implies y = 2"
      // as raw red text). The wrap also normalizes `\hline` to `\\\hline`
      // so the row break before the rule actually fires.
      const isAlreadyWrapped = /\\begin\{(aligned|array|cases|matrix|gathered|split|align|alignat|equation|multline)\}/.test(processedLatex);
      const looksMultiLine = /\\\\|\\hline\b/.test(processedLatex);
      if (looksMultiLine && !isAlreadyWrapped) {
        // Strip a stray leading `\\` that some emissions start with.
        processedLatex = processedLatex.replace(/^\s*\\\\\s*/, '');
        processedLatex = `\\begin{aligned}${processedLatex}\\end{aligned}`;
      }

      if (highlight && highlight.length > 0) {
        // Wrap highlighted terms in a colored box
        highlight.forEach((term) => {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          processedLatex = processedLatex.replace(
            new RegExp(escapedTerm, 'g'),
            `\\colorbox{yellow}{$${term}$}`
          );
        });
      }

    } catch (error) {
      console.error('KaTeX preprocessing error:', error);
      processedLatex = latex;
    }

    const renderTex = (tex: string) => {
      const el = containerRef.current;
      if (!el) return;
      try {
        katex.render(tex, el, {
          throwOnError: false,
          displayMode,
          trust: true,
          strict: false,
          macros: {
            // Common physics/math macros
            '\\vec': '\\mathbf{#1}',
            '\\unit': '\\,\\mathrm{#1}',
            '\\ms': '\\,\\mathrm{m/s}',
            '\\mss': '\\,\\mathrm{m/s^2}',
            '\\m': '\\,\\mathrm{m}',
            '\\s': '\\,\\mathrm{s}',
            '\\kg': '\\,\\mathrm{kg}',
            '\\N': '\\,\\mathrm{N}',
            '\\J': '\\,\\mathrm{J}',
          },
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        el.textContent = latex;
      }
    };
    renderTex(processedLatex);
    // Reflow-to-width (round-7 item 7). KaTeX equations don't wrap, and
    // the old answer — transform: scale() down to a 0.32 floor — rendered
    // equation text at a fraction of every other component's size
    // (IMG_7874/7875: postage-stamp equations beside full-size cards).
    // Now: when the rendered math overflows the container, re-render the
    // LaTeX split across lines at top-level relations / +− (see
    // equation-split.ts), the way a person wraps work on a real board.
    // Horizontal scroll (already on this container) remains only for math
    // with no safe split point. Fonts never shrink.
    // Round-8 third stage: the columns-aligned split lays out as
    // (widest LHS)+(widest RHS), so on a narrow pane continuation rows
    // start where line 1's relation sits — past the right edge
    // (IMG_7893/7894: clipped continuations). When the columns split
    // still overflows, re-render LEFT-FLUSH (rows share a left margin,
    // \quad-indented continuations) whose width is max(single row).
    // Only what survives all three stages scrolls — with an edge fade.
    let mode: 'natural' | 'reflow' | 'leftflush' = 'natural';
    let naturalWidth = 0; // scrollWidth of the natural (one-line) render
    let containerAtSplit = 0; // container width the current split was packed for
    let observer: ResizeObserver | null = null;
    let fade: HScrollFadeHandle | null = null;

    const mathNode = (): HTMLElement | null => {
      const el = containerRef.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!inner) return null;
      // KaTeX displayMode wraps in a centering parent; measure the
      // deepest element to get the actual math width.
      return (inner.querySelector('.katex') as HTMLElement) || inner;
    };

    // (Re-)attach the observer to the container and the CURRENT math
    // node — the math node is replaced wholesale by every re-render.
    // Observing the math node matters because the first fit can run
    // before the KaTeX_* webfonts swap in: the container never changes
    // size on font swap, the math node does (2026-07-16 AP World: a wide
    // \text-heavy line measured as fitting under fallback-font metrics
    // and was never re-fit).
    const observe = () => {
      if (typeof ResizeObserver === 'undefined' || !containerRef.current) return;
      observer?.disconnect();
      observer = new ResizeObserver(() => fit());
      observer.observe(containerRef.current);
      const m = mathNode();
      if (m) observer.observe(m);
    };

    const fit = () => {
      const el = containerRef.current;
      if (!el) return;
      const containerWidth = el.clientWidth;
      if (containerWidth <= 0) return;

      // Split at the current width: columns layout first (the classic
      // aligned-at-relation look), then left-flush when columns still
      // overflows (its width is leftPart+rightPart, which loses on
      // narrow panes — round-8, IMG_7893/7894). Sets mode + fitScale.
      const applySplit = (containerWidth: number) => {
        // Chars-per-pixel from the natural render calibrates the line
        // budget; 10% slack absorbs per-line width variance.
        const budget = Math.floor(processedLatex.length * (containerWidth / naturalWidth) * 0.9);
        const cols = splitLatexToLines(processedLatex, budget);
        if (!cols) {
          el.dataset.fitScale = 'scroll';
          fade?.update();
          return;
        }
        renderTex(cols);
        mode = 'reflow';
        containerAtSplit = containerWidth;
        observe();
        let rm = mathNode();
        if (rm && rm.scrollWidth > containerWidth) {
          const left = splitLatexToLines(processedLatex, budget, 'left');
          if (left && left !== cols) {
            renderTex(left);
            mode = 'leftflush';
            observe();
            rm = mathNode();
          }
        }
        el.dataset.fitScale =
          rm && rm.scrollWidth > containerWidth
            ? 'reflow-scroll'
            : mode === 'leftflush'
              ? 'reflow-left'
              : 'reflow';
        fade?.update();
      };

      if (mode === 'natural') {
        const m = mathNode();
        if (!m) return;
        naturalWidth = m.scrollWidth;
        delete el.dataset.fitScale;
        if (naturalWidth <= containerWidth) {
          fade?.update();
          return;
        }
        // Inline math flows inside prose — aligned blocks are display-
        // only, so an overflowing inline equation just scrolls.
        if (!displayMode) {
          el.dataset.fitScale = 'scroll';
          fade?.update();
          return;
        }
        applySplit(containerWidth);
        return;
      }

      // reflow / leftflush mode
      if (containerWidth >= naturalWidth) {
        // Panel widened enough for the one-line form again.
        renderTex(processedLatex);
        mode = 'natural';
        delete el.dataset.fitScale;
        observe();
        fit(); // re-measure — fonts may have swapped since the split
        return;
      }
      if (containerWidth < containerAtSplit * 0.9) {
        // Materially narrower than the width this split was packed for —
        // re-pack from scratch (columns first, left-flush fallback).
        applySplit(containerWidth);
        return;
      }
      const rm = mathNode();
      el.dataset.fitScale =
        rm && rm.scrollWidth > containerWidth
          ? 'reflow-scroll'
          : mode === 'leftflush'
            ? 'reflow-left'
            : 'reflow';
      fade?.update();
    };

    const raf = requestAnimationFrame(fit);
    observe();
    // Edge-fade affordance for whatever still scrolls after all fit
    // stages (unsplittable math, inline atoms) — see hscroll-fade.ts.
    if (containerRef.current) fade = attachHScrollFade(containerRef.current);
    // Belt-and-suspenders re-fit once web fonts finish loading, in case a
    // given browser/font doesn't produce a detectable box-size change on
    // swap (e.g. a fallback font with near-identical metrics to KaTeX's).
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fit();
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      fade?.detach();
      fade = null;
    };
  }, [latex, highlight, displayMode]);

  return (
    <div
      className={`equation-container ${className}`}
      data-feature="equation"
      // Hard horizontal containment. Long equations (especially ones
      // with \text{} content like 'Perpendicular condition on λ' from
      // the 2026-05-04 JEE coord-geo session) used to extend past the
      // whiteboard page on the left AND right — a wide math box can lay
      // the card out wider than its parent when nothing clips, and the
      // label above the scrollable inner inherited the runaway box.
      // overflow:hidden + min-width:0 on this container, plus
      // max-width:100% + word-break on the label, plus overflow-x-auto
      // on the inner content box, keeps everything bounded.
      style={{ position: 'relative', overflow: 'hidden', minWidth: 0 }}
    >
      {label && (
        <div
          className="text-sm font-medium text-gray-600 mb-2"
          data-feature="equation-label"
          style={{ maxWidth: '100%', overflowWrap: 'anywhere' }}
        >
          {/* Labels often carry math ("Tangent at (√5, 4/3)") — render any
              inline $…$ through KaTeX so label math matches the equation
              body instead of unicode-vs-KaTeX mixing (2026-07-10 audit). */}
          <InlineMathText text={label} />
        </div>
      )}
      <div
        ref={containerRef}
        // overflow-y-hidden: some platforms (e.g. non-overlay scrollbars
        // on Windows/Linux) reserve a horizontal strip of height for the
        // horizontal scrollbar and, on certain box-sizing edge cases,
        // let a vertical scrollbar sliver appear alongside it even
        // though this box never legitimately needs vertical scroll (its
        // height is either auto-sized to content or explicitly pinned in
        // fitToWidth() above). Suppress it defensively — it's a pure
        // display:none-equivalent no-op whenever content doesn't overflow
        // vertically, which is always the case here.
        className="equation-content overflow-x-auto overflow-y-hidden py-2 fit-to-width"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

/**
 * Inline equation for use within text
 */
export function InlineEquation({ latex }: { latex: string }) {
  return (
    <EquationRenderer
      latex={latex}
      displayMode={false}
      className="inline-block"
    />
  );
}

/**
 * Equation with step-by-step derivation
 */
interface DerivationStep {
  equation: string;
  explanation?: string;
}

interface DerivationRendererProps {
  steps: DerivationStep[];
  title?: string;
}

export function DerivationRenderer({ steps, title }: DerivationRendererProps) {
  return (
    <div className="derivation-container space-y-3">
      {title && (
        <h4 className="font-medium text-gray-800"><InlineMathText text={title} /></h4>
      )}
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <span className="text-gray-400 font-mono text-sm mt-2">
            {index + 1}.
          </span>
          <div className="flex-1">
            <EquationRenderer latex={step.equation} />
            {step.explanation && (
              <p className="text-sm text-gray-500 mt-1 ml-1">
                {step.explanation}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
