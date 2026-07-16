'use client';

/**
 * useFitScale — reusable measure-then-shrink for wide whiteboard content
 * (task W1).
 *
 * Generalizes EquationRenderer's fit-to-width transform
 * (EquationRenderer.tsx ~96-150): measure the content's natural
 * (pre-transform) width against its container, and if the content is wider,
 * apply `transform: scale()` to shrink it down so it fits. Unlike
 * EquationRenderer — whose fixed 0.32 floor suits dense KaTeX math and stays
 * unchanged by this task — callers here supply their OWN `floor`. Content
 * that would need to shrink past `floor` to fully fit is instead rendered AT
 * `floor` and left wider than the container; `overflowing` flips to true so
 * the caller can give the container `overflow-x-auto` (this hook does NOT
 * add that class itself — it only measures/transforms — because whether the
 * scroll affordance should always be present or only appear once needed is
 * a per-renderer layout decision).
 *
 * Root bug this targets (live-session screenshot IMG_7807): the catalog's
 * `CatalogComparisonTableRenderer` renders an unconstrained `<table>` inside
 * a `w-full flex flex-col items-center` wrapper. A too-wide table
 * flex-centers and the board's `overflow-x-hidden` ancestor clips BOTH edges
 * symmetrically with no scroll affordance — the student can't reach the rest
 * of the table at all. `t_chart`'s CSS grid (max-w-[640px]) has the same
 * class of risk via grid-track blowout from an unbreakable long token.
 * Without a floor, EquationRenderer's plain "shrink to fit" would make an
 * extreme case (many columns) illegibly small; the floor + overflow-x-auto
 * fallback keeps it at least readable, with the remainder reachable by
 * scroll instead of invisibly gone.
 *
 * `containerRef` goes on a stable-width wrapper (its `clientWidth` is the
 * available space — must NOT itself shrink-to-fit its child, or there'd be
 * nothing to measure against). `contentRef` goes on the element to measure
 * and transform (its `scrollWidth` is the natural, pre-transform width).
 */

import { useEffect, useRef, useState, type DependencyList, type RefObject } from 'react';
import { computeFitScale } from './fit-scale-math';

export interface UseFitScaleOptions {
  /** Minimum scale factor, in (0, 1]. Content that would need to shrink
   *  below this to fit at the container's width is instead rendered AT this
   *  floor (still wider than the container) — see `overflowing`. */
  floor: number;
}

export interface UseFitScaleResult<Container extends HTMLElement, Content extends HTMLElement> {
  /** Attach to a wrapper whose width should NOT shrink to fit its child
   *  (e.g. a `w-full` div) — its `clientWidth` is what content is fit
   *  against. */
  containerRef: RefObject<Container>;
  /** Attach to the element to measure and shrink (the `<table>`, the grid
   *  `<div>`, etc.). */
  contentRef: RefObject<Content>;
  /** Scale currently applied, in (0, 1]. 1 before first measurement and
   *  whenever content already fits at natural size. */
  scale: number;
  /** True once `floor` has been clamped — i.e. the natural fit ratio
   *  (containerWidth / contentWidth) was below `floor`, so content is
   *  rendered at `floor` and is STILL wider than the container. Callers
   *  should ensure the container can scroll horizontally in this case. */
  overflowing: boolean;
}

/**
 * Measure `contentRef`'s natural width against `containerRef`'s available
 * width and apply a `transform: scale()` (floored at `options.floor`) so
 * wide content shrinks to fit instead of getting clipped by an ancestor's
 * `overflow-x-hidden`. Re-measures on resize (ResizeObserver) and whenever
 * an entry in `deps` changes (pass whatever data drives the content's
 * dimensions, e.g. the figure/props object, so a new figure with different
 * column counts gets re-measured instead of keeping a stale scale).
 */
export function useFitScale<
  Container extends HTMLElement = HTMLDivElement,
  Content extends HTMLElement = HTMLDivElement,
>(
  { floor }: UseFitScaleOptions,
  deps: DependencyList = [],
): UseFitScaleResult<Container, Content> {
  const containerRef = useRef<Container>(null);
  const contentRef = useRef<Content>(null);
  const [scale, setScale] = useState(1);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      // Reset before measuring — transform doesn't affect scrollWidth, but
      // measuring with a stale explicit `height` on the container could
      // (an old shrunk height would clip the natural-size re-measurement).
      content.style.transform = '';
      container.style.height = '';
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      const { scale: applied, overflowing: clamped } = computeFitScale({ containerWidth, contentWidth, floor });
      setScale(applied);
      setOverflowing(clamped);
      if (!(containerWidth > 0) || !(contentWidth > 0) || contentWidth <= containerWidth) {
        // Not yet measurable, or content already fits at natural size —
        // nothing to transform.
        return;
      }
      // NOTE: deliberately do NOT pin `content.style.width`. Unlike
      // EquationRenderer's inline-block `inner` (whose child is a KaTeX
      // node with fixed intrinsic sizing, unaffected by an ancestor width),
      // `content` here IS the `<table>`/grid itself — assigning it an
      // explicit width smaller than its natural size would make table/grid
      // layout reflow (columns redistributing) BEFORE the transform is
      // even applied, compounding with the scale instead of just shrinking
      // a fixed snapshot. `transform` alone doesn't touch layout size, so
      // the table/grid keeps its natural column layout; the container's
      // `overflow-x-auto` picks up the (scaled-down) painted overflow as
      // its scrollable region regardless of `content`'s unset width.
      content.style.transformOrigin = 'left top';
      content.style.transform = `scale(${applied})`;
      const contentHeight = content.scrollHeight;
      // +2px rounding buffer so sub-pixel scale math never clips the last
      // row (mirrors EquationRenderer's descender buffer, minus the
      // KaTeX-specific padding math which doesn't apply to tables/grids).
      container.style.height = `${Math.ceil(contentHeight * applied) + 2}px`;
    };

    const raf = requestAnimationFrame(fit);
    let observer: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(fit);
      observer.observe(containerRef.current);
      if (contentRef.current) observer.observe(contentRef.current);
    }
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floor, ...deps]);

  return { containerRef, contentRef, scale, overflowing };
}
