/**
 * Horizontal-scroll affordance (round-8, IMG_7893/7894).
 *
 * iOS hides scrollbars entirely until the user touches the container, so
 * an overflowing whiteboard card hard-clips with no visual cue — a
 * clipped "-4x+1" reads as "-4x" (IMG_7893). This helper stamps
 * `data-hscroll-fade="right" | "left" | "both"` on a scrollable element
 * whenever content extends past the respective edge; globals.css turns
 * that into a mask-image gradient so the content visibly fades out
 * mid-glyph ("continues") instead of ending at a hard edge.
 *
 * Pure DOM (no React) so EquationRenderer's imperative fit loop and the
 * <HScrollFade> JSX wrapper share one implementation.
 */

export interface HScrollFadeHandle {
  /** Re-measure now (call after imperatively swapping content). */
  update: () => void;
  detach: () => void;
}

export function attachHScrollFade(el: HTMLElement): HScrollFadeHandle {
  let raf = 0;
  const update = () => {
    const max = el.scrollWidth - el.clientWidth;
    // 2px slack absorbs subpixel rounding on zoomed / DPR-scaled layouts.
    const overRight = max - el.scrollLeft > 2;
    const overLeft = el.scrollLeft > 2;
    const v = overRight && overLeft ? 'both' : overRight ? 'right' : overLeft ? 'left' : '';
    if (v) el.dataset.hscrollFade = v;
    else delete el.dataset.hscrollFade;
  };
  const schedule = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  };
  el.addEventListener('scroll', schedule, { passive: true });

  let ro: ResizeObserver | null = null;
  const observeSizes = () => {
    if (typeof ResizeObserver === 'undefined') return;
    ro?.disconnect();
    ro = new ResizeObserver(schedule);
    ro.observe(el);
    // scrollWidth changes don't resize `el` itself — watch the content.
    if (el.firstElementChild) ro.observe(el.firstElementChild);
  };
  observeSizes();

  // Content swapped wholesale (React re-render, katex.render) → the old
  // child's ResizeObserver subscription is dead; re-arm on the new one.
  let mo: MutationObserver | null = null;
  if (typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver(() => {
      observeSizes();
      schedule();
    });
    mo.observe(el, { childList: true });
  }

  update();
  return {
    update,
    detach: () => {
      el.removeEventListener('scroll', schedule);
      ro?.disconnect();
      mo?.disconnect();
      cancelAnimationFrame(raf);
    },
  };
}
