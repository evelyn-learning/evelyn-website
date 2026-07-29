'use client';

/**
 * Drop-in replacement for a `overflow-x-auto` div/pre that adds the
 * horizontal-scroll affordance (edge fade via data-hscroll-fade +
 * globals.css; see lib/tutor/whiteboard/hscroll-fade.ts for why).
 *
 * `hint` additionally wraps the box in `.hscroll-hint`, whose CSS :has()
 * rule shows a small nudging chevron while unscrolled overflow exists —
 * used for grid-semantics cards (tables, T-charts) where scroll is the
 * intended interaction rather than a fallback.
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { attachHScrollFade } from '@/lib/tutor/whiteboard/hscroll-fade';

interface HScrollFadeProps {
  as?: 'div' | 'pre' | 'p' | 'ul';
  hint?: boolean;
  /** Extra classes for the .hscroll-hint wrapper (e.g. 'w-full' inside
   *  an items-center flex parent, where a bare div would shrink-to-fit). */
  hintClassName?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  'data-feature'?: string;
}

export function HScrollFade({ as = 'div', hint = false, hintClassName, className, style, children, ...rest }: HScrollFadeProps) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const handle = attachHScrollFade(ref.current);
    return handle.detach;
  }, []);
  const Tag = as;
  const inner = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
  return hint ? <div className={`hscroll-hint${hintClassName ? ` ${hintClassName}` : ''}`}>{inner}</div> : inner;
}
