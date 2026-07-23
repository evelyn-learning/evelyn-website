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
import { computeFitScale } from './fit-scale-math';
import { preprocessKatexBody } from '@/lib/tutor/whiteboard/inline-math';

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

    try {
      // Fix double-escaped LaTeX (e.g. \\frac → \frac) that can come from AI model output.
      // The newline conversion uses a negative lookahead so it doesn't eat
      // the start of LaTeX commands that begin with `\n` — \neq, \not, \nabla,
      // \nu, \nrightarrow, etc. Without this, "23 \neq 5" rendered as "23eq5"
      // because the \n was stripped as a "literal newline" escape.
      let processedLatex = preprocessKatexBody(latex);

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

      katex.render(processedLatex, containerRef.current, {
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
      if (containerRef.current) {
        containerRef.current.textContent = latex;
      }
    }
    // Fit-to-width: KaTeX equations don't wrap. On narrow screens,
    // long expressions overflow and get clipped at the viewport edge.
    // Measure the rendered math, compare against the container, and
    // apply a scale transform if the math is wider than its container.
    // Re-runs on resize via ResizeObserver so the scale stays correct
    // when the panel width changes.
    const fitToWidth = () => {
      const el = containerRef.current;
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      inner.style.transform = '';
      inner.style.transformOrigin = 'left top';
      inner.style.display = 'inline-block';
      inner.style.width = '';
      el.style.height = '';
      const containerWidth = el.clientWidth;
      // KaTeX displayMode wraps in a centering parent; measure the
      // deepest element to get the actual math width.
      const mathEl = (inner.querySelector('.katex') as HTMLElement) || inner;
      const innerWidth = mathEl.scrollWidth;
      // Clear a stale stamp from a previous fit (e.g. panel widened enough
      // that the equation now fits at natural size) before possibly
      // re-setting it below.
      delete el.dataset.fitScale;
      if (containerWidth > 0 && innerWidth > containerWidth) {
        // Lower floor to 0.32 — the prior 0.5 floor wasn't enough for
        // chained identity rows on a narrow whiteboard panel
        // (observed 2026-04-30 pre-calc session: three Pythagorean
        // identities clipped on both edges). Below ~0.32 the math
        // becomes hard to read; the carousel allows horizontal scroll
        // for anything that still doesn't fit.
        // Shared with W1's useFitScale (fit-scale-math.ts) — same
        // never-upscale / never-NaN / floor-clamp semantics, just a
        // fixed 0.32 floor instead of a caller-supplied one.
        const { scale, overflowing } = computeFitScale({ containerWidth, contentWidth: innerWidth, floor: 0.32 });
        // Stamped for harness/visual verification only (no CSS/behavior
        // hooks off it) — mirrors W1's data-fit-scale="floor" convention.
        el.dataset.fitScale = overflowing ? 'floor' : 'scaled';
        inner.style.transform = `scale(${scale})`;
        // Pin the inline-block to the container width so its layout
        // box can't push the parent wider than the page. Combined
        // with the outer overflow:hidden, this stops the long-equation
        // overflow observed in the 2026-05-04 JEE session
        // (label "Perpendicular condition on λ" had its leading "Pe"
        // clipped because the pre-scale scrollWidth was wider than
        // the whiteboard page and the parent didn't clip).
        inner.style.width = `${containerWidth}px`;
        // KaTeX descenders (fraction denominators, brackets, subscripts)
        // can overhang scrollHeight by a few fractional pixels; combined
        // with box-sizing:border-box + py-2 padding (16px total) AND
        // overflow-x:auto coercing overflow-y to non-visible, the bottom
        // of fractions gets clipped when we set height = scaled content
        // height (the padding eats into the visible area). Add the el's
        // computed vertical padding back into the height + descender
        // buffer. Observed 2026-05-04 sessions: JEE rolling-step L_before
        // and AP Precalc polar-r equations rendered with bottom edge cut.
        const cs = (typeof window !== 'undefined' && typeof getComputedStyle === 'function')
          ? getComputedStyle(el)
          : null;
        const padY = cs
          ? (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)
          : 16;
        // KaTeX's own stylesheet gives `.katex-display` a default
        // `margin: 1em 0` (~32px unscaled at typical body font sizes).
        // `transform: scale()` shrinks the painted content box but NOT
        // margins — a scaled-down equation still carries its full,
        // unscaled top/bottom margin in the parent's layout. Discovered
        // via the Y6 verification harness (2026-07-16): once this task
        // added `overflow-y-hidden` to suppress a vertical-scrollbar
        // artifact, the pre-existing height formula (which only knew
        // about scaled content + our own padding, not this margin)
        // under-sized the box by ~2em and silently clipped the bottom of
        // EVERY scaled display equation — worse than the scrollbar it
        // replaced. Read the actual computed margin instead of assuming
        // it's zero.
        const innerCs = (typeof window !== 'undefined' && typeof getComputedStyle === 'function')
          ? getComputedStyle(inner)
          : null;
        const marginY = innerCs
          ? (parseFloat(innerCs.marginTop) || 0) + (parseFloat(innerCs.marginBottom) || 0)
          : 0;
        // +10 (was +8): the extra 2px absorbs independent sub-pixel
        // rounding between the height we assign here (float, rounded by
        // the browser to a `clientHeight` integer) and the content's own
        // separately-rounded `scrollHeight` — without it, a fractional
        // mismatch of ~1px could round the wrong way and reintroduce a
        // 1px vertical clip now that overflow-y is hidden instead of
        // auto-scrolling.
        const innerHeight = Math.ceil(inner.scrollHeight * scale) + marginY + padY + 10;
        el.style.height = `${innerHeight}px`;
      }
    };
    const raf = requestAnimationFrame(fitToWidth);
    // Watch the container for size changes (panel resize, viewport
    // rotation, mobile-tab toggle, etc.) and re-fit.
    let observer: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => fitToWidth());
      observer.observe(containerRef.current);
      // ALSO observe the rendered math node itself, not just the
      // container. The first fitToWidth() runs on the very next
      // animation frame after katex.render(), which can be BEFORE the
      // KaTeX_* webfonts finish loading/swapping in — the browser lays
      // out with fallback font metrics that happen to be a hair
      // narrower, so the initial measurement sees the equation as
      // fitting (~1:1, no scale applied). The container's own size
      // never changes when this happens, so without observing the math
      // node too, nothing re-triggers the fit once the real fonts swap
      // in and the equation grows past the container — the only visible
      // symptom is the plain overflow-x-auto fallback showing a
      // scrollbar sliver instead of the equation scaling down (2026-07-16
      // AP World live-session screenshot: a wide \text-heavy line with an
      // arrow, "Muslim ruling elite + jizya tax → Hindu majority left
      // largely self-governing"). ResizeObserver reports a node's
      // untransformed layout box, so this doesn't get confused by our own
      // `transform: scale()` on the ancestor `inner`.
      const inner = containerRef.current.firstElementChild as HTMLElement | null;
      const mathEl = inner ? ((inner.querySelector('.katex') as HTMLElement) || inner) : null;
      if (mathEl) observer.observe(mathEl);
    }
    // Belt-and-suspenders re-fit once web fonts finish loading, in case a
    // given browser/font doesn't produce a detectable box-size change on
    // swap (e.g. a fallback font with near-identical metrics to KaTeX's).
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fitToWidth();
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [latex, highlight, displayMode]);

  return (
    <div
      className={`equation-container ${className}`}
      data-feature="equation"
      // Hard horizontal containment. Long equations (especially ones
      // with \text{} content like 'Perpendicular condition on λ' from
      // the 2026-05-04 JEE coord-geo session) used to extend past the
      // whiteboard page on the left AND right because:
      //   1) inline-block + scale-transform doesn't shrink the
      //      pre-scale layout box, so scrollWidth still reports the
      //      pre-scale width and parents that don't clip horizontally
      //      lay out the card wider than themselves.
      //   2) the label, rendered above the scrollable inner, had no
      //      width control of its own — it inherited the runaway box.
      // overflow:hidden + min-width:0 on this container, plus
      // max-width:100% + word-break on the label, plus the inner
      // sized to clientWidth in fitToWidth, keeps everything bounded.
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
