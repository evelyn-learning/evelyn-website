'use client';

/**
 * SmoothDraw Phase 1 — DOM side of the draw-on engine.
 *
 * Collects drawables from a freshly mounted item wrapper, plans the
 * timeline with the pure planner (draw-on.ts), and applies it with the
 * Web Animations API. Compositor-only: stroke-dashoffset / clip-path /
 * opacity. No React state, no rAF loops.
 *
 * finishAll() jumps every tracked animation to its end state — wired by
 * WhiteboardCanvas to kill-recovery (revisingIds), turn end, and the
 * __tutorFinishDrawOn dev hook. Unmount/page-switch needs no handling:
 * the page subtree remounts and seenAnimIdsRef prevents re-animation,
 * so a fresh mount renders the final (un-animated) state.
 */

import { useCallback, useEffect, useRef } from 'react';
import { planSvgDrawOn, planHtmlWipe, IFRAME_FADE_MS, SERIAL_SPACING_MS, type Drawable } from '@/lib/tutor/whiteboard/draw-on';

export function drawOnEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_TUTOR_DRAW_ON !== 'true') return false;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch { /* matchMedia unavailable — treat as no preference */ }
  return true;
}

const STROKE_SELECTOR = 'path, line, polyline, polygon, circle, ellipse, rect';

function isStrokeDrawable(el: SVGGeometryElement): boolean {
  const cs = window.getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  if (cs.stroke === 'none' || cs.stroke === '') return false;
  if (parseFloat(cs.strokeWidth || '0') <= 0) return false;
  return true;
}

export function useDrawOn() {
  const animsRef = useRef<Set<Animation>>(new Set());
  // Serial queue across items in the same batch: the next item's
  // animation starts SERIAL_SPACING_MS after the previous item's ends.
  const queueEndAtRef = useRef(0);

  const track = useCallback((a: Animation) => {
    animsRef.current.add(a);
    const drop = () => animsRef.current.delete(a);
    a.addEventListener('finish', drop);
    a.addEventListener('cancel', drop);
  }, []);

  const finishAll = useCallback(() => {
    for (const a of Array.from(animsRef.current)) {
      try { a.finish(); } catch { try { a.cancel(); } catch { /* detached */ } }
    }
    animsRef.current.clear();
    queueEndAtRef.current = 0;
  }, []);

  const animateItem = useCallback((wrapper: HTMLElement) => {
    if (wrapper.dataset.drawOn) return; // idempotent per element
    wrapper.dataset.drawOn = '1';

    const now = performance.now();
    const baseDelay = Math.max(0, queueEndAtRef.current - now);

    const iframe = wrapper.querySelector('iframe');
    const svg = wrapper.querySelector('svg');

    if (iframe || !svg) {
      // Iframe content (Desmos/Ketcher) or pure-HTML content (KaTeX
      // equations, cards, tables): wipe/fade. Row-detect for tables.
      const rows = wrapper.querySelectorAll('tr');
      if (!iframe && rows.length > 1) {
        const plan = planHtmlWipe(rows.length);
        plan.steps.forEach((s) => {
          const el = rows[s.index] as HTMLElement;
          track(el.animate(
            [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }],
            { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-out', fill: 'backwards' },
          ));
        });
        queueEndAtRef.current = now + baseDelay + plan.totalMs + SERIAL_SPACING_MS;
        return;
      }
      const dur = iframe ? IFRAME_FADE_MS : planHtmlWipe(1).totalMs;
      const frames = iframe
        ? [{ opacity: 0, transform: 'scale(0.985)' }, { opacity: 1, transform: 'scale(1)' }]
        : [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }];
      track(wrapper.animate(frames, { delay: baseDelay, duration: dur, easing: 'ease-out', fill: 'backwards' }));
      queueEndAtRef.current = now + baseDelay + dur + SERIAL_SPACING_MS;
      return;
    }

    // SVG content: stroke-by-stroke draw-on.
    const els = Array.from(svg.querySelectorAll<SVGElement>(`${STROKE_SELECTOR}, text, image, foreignObject`));
    const drawables: Drawable[] = [];
    const domFor: SVGElement[] = [];
    for (const el of els) {
      if (el instanceof SVGGeometryElement && isStrokeDrawable(el)) {
        let length = 0;
        try { length = el.getTotalLength(); } catch { /* zero-size geometry */ }
        drawables.push({ kind: 'stroke', length });
      } else {
        drawables.push({ kind: 'fill' });
      }
      domFor.push(el);
    }
    const plan = planSvgDrawOn(drawables);
    plan.steps.forEach((s) => {
      const el = domFor[s.index];
      if (s.mode === 'stroke') {
        const geo = el as SVGGeometryElement;
        let len = 0;
        try { len = geo.getTotalLength(); } catch { /* skip */ }
        if (!len || !isFinite(len)) {
          track(el.animate([{ opacity: 0 }, { opacity: 1 }], { delay: baseDelay + s.delayMs, duration: s.durMs, fill: 'backwards' }));
          return;
        }
        el.style.strokeDasharray = `${len}`;
        const a = el.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-in-out', fill: 'backwards' },
        );
        a.addEventListener('finish', () => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; });
        track(a);
      } else {
        track(el.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-out', fill: 'backwards' },
        ));
      }
    });
    queueEndAtRef.current = now + baseDelay + plan.totalMs + SERIAL_SPACING_MS;
  }, [track]);

  // Safety: finish everything if the hook's owner unmounts mid-animation.
  useEffect(() => () => { finishAll(); }, [finishAll]);

  return { animateItem, finishAll };
}
