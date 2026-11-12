'use client';

/**
 * Planner tabs down the left edge of the board (tutor v2).
 *
 * The centre pill shows one page title and a count; a student could not see at a glance that a page had been
 * added or which page they were on (Praveen, chemistry, embed-1794512595935: "the skipping is not clear"). These
 * are the index tabs of a diary: one numbered tab per page, the current one larger and filled, a page just added
 * tinted until it has been looked at. Pointing at a tab shows its title.
 *
 * Many pages: the tabs first get shorter (down to TAB_MIN_PX), then the column scrolls, with the current tab kept
 * in view.
 */
import { useEffect, useRef, useState } from 'react';

export interface BoardPlannerTabsProps {
  index: number;
  count: number;
  titles: string[];
  goTo: (i: number) => void;
  pendingIndex?: number | null;
}

const TAB_MIN_PX = 22;
const TAB_MAX_PX = 36;
const FRESH_MS = 6000;

export default function BoardPlannerTabs({ index, count, titles, goTo, pendingIndex }: BoardPlannerTabsProps) {
  const [fresh, setFresh] = useState<number | null>(null);
  const lastCount = useRef(count);
  const currentRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (count > lastCount.current && lastCount.current > 0) {
      const added = count - 1;
      setFresh(added);
      const t = setTimeout(() => setFresh((f) => (f === added ? null : f)), FRESH_MS);
      lastCount.current = count;
      return () => clearTimeout(t);
    }
    lastCount.current = count;
    return undefined;
  }, [count]);
  useEffect(() => { currentRef.current?.scrollIntoView({ block: 'nearest' }); }, [index, count]);
  if (count < 1) return null;
  return (
    <nav aria-label="Board pages" className="absolute left-0 top-3 bottom-36 z-20 w-9 flex flex-col gap-1 overflow-y-auto overflow-x-visible pr-0 [scrollbar-width:none]">
      {Array.from({ length: count }, (_, i) => {
        const on = i === index;
        const isNew = !on && (i === fresh || i === pendingIndex);
        const title = (titles[i] || `Page ${i + 1}`).trim();
        return (
          <button
            key={i}
            ref={on ? currentRef : undefined}
            type="button"
            onClick={() => goTo(i)}
            title={`${i + 1}. ${title}`}
            aria-label={`Page ${i + 1}: ${title}`}
            aria-current={on ? 'page' : undefined}
            style={{ flex: `1 1 ${TAB_MAX_PX}px`, minHeight: on ? TAB_MAX_PX : TAB_MIN_PX, maxHeight: on ? TAB_MAX_PX + 8 : TAB_MAX_PX }}
            className={`group relative shrink grid place-items-center rounded-r-lg border border-l-0 text-xs font-semibold tabular-nums transition-all ${
              on
                ? 'w-9 bg-blue-600 border-blue-600 text-white text-sm shadow-sm'
                : isNew
                  ? 'w-7 bg-emerald-50 border-emerald-400 text-emerald-700'
                  : 'w-7 bg-white border-slate-200 text-slate-500 hover:w-9 hover:text-blue-700 hover:border-blue-300'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </nav>
  );
}
