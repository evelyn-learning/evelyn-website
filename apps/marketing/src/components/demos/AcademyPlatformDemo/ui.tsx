'use client';

import type { ReactNode } from 'react';
import type { Mastery } from './data';

/**
 * GA4 events for this demo. Deliberately local: the shared `trackEvent` in
 * packages/core has a closed event-name union, and this page must ship
 * without touching core (core is bundled into the tutor app too).
 */
export function trackAcademyDemo(
  name: 'academy_demo_role_change' | 'academy_demo_tab_view' | 'academy_demo_live_lesson_open',
  params?: Record<string, string>,
): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.('event', name, params ?? {});
  } catch {
    // analytics must never break the demo
  }
}

export function Card({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 ${className}`}>
      {title && <h4 className="text-sm font-semibold text-slate-900 mb-3">{title}</h4>}
      {children}
    </div>
  );
}

const MASTERY_FILL: Record<Mastery, number> = { none: 0, low: 1, developing: 2, strong: 3 };
export const MASTERY_LABEL: Record<Mastery, string> = {
  none: 'Not started',
  low: 'Low',
  developing: 'Developing',
  strong: 'Strong',
};

export function MasteryDots({ mastery }: { mastery: Mastery }) {
  const filled = MASTERY_FILL[mastery];
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`Mastery: ${MASTERY_LABEL[mastery]}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: i < filled ? 'var(--ab-primary)' : '#e2e8f0' }}
        />
      ))}
    </span>
  );
}

export function BrandButton({
  children,
  onClick,
  disabled,
  variant = 'solid',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'soft';
  className?: string;
}) {
  const style =
    variant === 'solid'
      ? { background: 'var(--ab-primary)', color: 'var(--ab-primary-fg)' }
      : { background: 'var(--ab-soft)', color: 'var(--ab-primary)' };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
