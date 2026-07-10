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

// Resume/reload/replay rehydration mounts a whole board in ONE React commit —
// every item on the page becomes a fresh mount at once. Serial-queuing N
// items (queueEndAtRef chains each item after the last) leaves later items
// INVISIBLE for many seconds: fill:'backwards' holds an item's animate-from
// frame until its delayed start finally fires. Beyond one budget's worth of
// backlog it's no longer "drawing on", it's just broken — so animateItem
// bails to instant final-state rendering rather than growing the queue
// further.
const MAX_QUEUE_DELAY_MS = 2000;

function isStrokeDrawable(el: SVGGeometryElement): boolean {
  const cs = window.getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  if (cs.stroke === 'none' || cs.stroke === '') return false;
  if (parseFloat(cs.strokeWidth || '0') <= 0) return false;
  return true;
}

// Reveal-pattern content (elements deliberately hidden via display/
// visibility/opacity — e.g. an answer key shown later) must never be faded
// visible by the draw-on engine; skip it entirely at collection time.
function isHiddenForFade(el: SVGElement): boolean {
  const cs = window.getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return true;
  const op = parseFloat(cs.opacity || '1');
  return Number.isFinite(op) && op === 0;
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
    if (baseDelay > MAX_QUEUE_DELAY_MS) {
      // Bulk-mount backlog bail — see MAX_QUEUE_DELAY_MS comment above.
      // wrapper.dataset.drawOn is already stamped; leave the element in its
      // natural (un-animated) CSS state, i.e. instantly in final form.
      return;
    }

    const iframe = wrapper.querySelector('iframe');
    // KaTeX emits inline <svg> for radicals/stretchy delimiters (e.g. a √
    // sign), so a plain `querySelector('svg')` misclassifies any equation
    // containing a square root as "SVG content": the radical fades while
    // the equation body pops in with no wipe. Only a non-KaTeX <svg> counts
    // as SVG content for the stroke-draw path.
    const svg = Array.from(wrapper.querySelectorAll('svg')).find((s) => !s.closest('.katex')) ?? null;

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
      // defs/marker/clipPath/pattern children are never rendered directly —
      // counting them inflates the stroke budget and burns stagger slots on
      // geometry nobody sees.
      if (el.closest('defs, marker, clipPath, pattern')) continue;
      if (el instanceof SVGGeometryElement && isStrokeDrawable(el)) {
        let length = 0;
        try { length = el.getTotalLength(); } catch { /* zero-size geometry */ }
        drawables.push({ kind: 'stroke', length });
        domFor.push(el);
      } else {
        // Reveal-pattern content must never be faded visible — skip hidden
        // non-stroke elements entirely (push to neither array).
        if (isHiddenForFade(el)) continue;
        drawables.push({ kind: 'fill' });
        domFor.push(el);
      }
    }
    const plan = planSvgDrawOn(drawables);
    // Fades must land on the element's OWN computed opacity, not a hardcoded
    // 1: with fill:'backwards' the animation reverts to the cascaded value
    // when its active phase ends, so animating 0→1 on a shape with a
    // translucent design opacity (e.g. a 0.55-opacity highlight circle)
    // would visibly snap down at the end. Ending exactly on the computed
    // value makes the revert a no-op.
    const fadeTargetOpacity = (el: SVGElement): number => {
      const v = parseFloat(window.getComputedStyle(el).opacity || '1');
      // Opacity-0 elements never reach here — they were skipped at
      // collection time by isHiddenForFade, so no `v > 0 ? v : 1` coercion
      // is needed to protect against fading a hidden element visible.
      return Number.isFinite(v) && v > 0 && v <= 1 ? v : 1;
    };
    plan.steps.forEach((s) => {
      const el = domFor[s.index];
      if (s.mode === 'stroke') {
        // Reuse the length measured during collection — no second
        // getTotalLength() call.
        const d = drawables[s.index];
        const len = d.kind === 'stroke' ? d.length : 0;
        if (!len || !isFinite(len)) {
          track(el.animate(
            [{ opacity: 0 }, { opacity: fadeTargetOpacity(el) }],
            { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-out', fill: 'backwards' },
          ));
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
          [{ opacity: 0 }, { opacity: fadeTargetOpacity(el) }],
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
