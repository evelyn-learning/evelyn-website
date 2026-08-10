'use client';

import { useEffect, useRef, useState } from 'react';
import type { RailItem } from '@/lib/tutor/lesson-plan/rail-labels';

interface AgendaRailProps {
  items: RailItem[];
  orientation: 'horizontal' | 'vertical';
}

/** Persistent agenda rail. Display-only v1 (no jump navigation — grill-me 2026-08-10). */
export function AgendaRail({ items, orientation }: AgendaRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const doneCount = items.filter((i) => i.done).length;
  const currentKey = items.find((i) => i.current)?.key ?? null;

  // Auto-follow: keep the current tab in view, biased left so the next item peeks.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, [currentKey]);

  const tab = (it: RailItem) => {
    const compress = it.done && !it.current && orientation === 'horizontal';
    const text = compress ? `✓ ${it.label.split(' ')[0]}` : it.label;
    return (
      <div
        key={it.key}
        ref={it.current ? currentRef : undefined}
        title={it.label}
        aria-current={it.current ? 'step' : undefined}
        className={[
          // Horizontal: one-line pills, row scrolls. Vertical: the panel is
          // width-bound (fullscreen left rail), so labels wrap inside the
          // pill instead of bleeding past its edge (live-test 2026-08-10).
          orientation === 'vertical'
            ? 'shrink-0 whitespace-normal break-words rounded-xl px-2.5 py-1 text-xs'
            : 'shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs',
          it.current ? 'bg-slate-900 text-white font-medium'
            : it.done ? 'bg-emerald-50 text-emerald-700'
            : 'bg-slate-100 text-slate-500',
        ].join(' ')}
      >
        {!compress && it.done && !it.current ? '✓ ' : ''}{text}
      </div>
    );
  };

  const overlay = overlayOpen && (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-6"
      onClick={() => setOverlayOpen(false)} data-testid="agenda-rail-overlay">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[70vh] overflow-y-auto p-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-semibold text-slate-800 mb-2">Today&rsquo;s agenda</div>
        {items.map((it) => (
          <div key={it.key} className={['flex items-center gap-2 py-1.5 text-sm',
            it.current ? 'font-semibold text-slate-900' : it.done ? 'text-emerald-700' : 'text-slate-500'].join(' ')}>
            <span className="w-4 text-center">{it.done ? '✓' : it.current ? '▶' : '·'}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-1.5 overflow-y-auto p-2" data-testid="agenda-rail" data-orientation="vertical">
        {items.map(tab)}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 min-w-0" data-testid="agenda-rail" data-orientation="horizontal">
      <div ref={scrollerRef}
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none min-w-0 grow
                   [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)]">
        {items.map(tab)}
      </div>
      <button type="button" onClick={() => setOverlayOpen(true)}
        className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 tabular-nums"
        aria-label="Show full agenda" data-testid="agenda-rail-counter">
        {doneCount}/{items.length}
      </button>
      {overlay}
    </div>
  );
}
