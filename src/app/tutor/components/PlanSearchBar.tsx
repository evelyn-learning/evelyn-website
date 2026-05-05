/**
 * PlanSearchBar — fast catalog-wide search for lesson plans.
 *
 * Solves the multi-dropdown funnel: instead of forcing
 * Subject → Level → Topic → Plan, the student types what they want
 * ("AP Calc derivatives", "GCSE quadratics", "phonics") and gets
 * one-click results across the entire 699-plan catalog.
 *
 * On selection: emits the chosen plan up to the page, which auto-fills
 * subject/level/topic from the plan metadata and starts the session.
 *
 * Backed by /api/tutor/lesson-plans?q=…  — token-AND match across
 * title + LO descriptions + topic/subject/grade tags. Server caps at 50.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface PlanSearchResult {
  id: string;
  title: string;
  curriculum: string;
  grade: string;
  subject: string;
  topic?: string;
  estimatedMinutes: number;
  los: Array<{ id: string; description: string }>;
}

interface PlanSearchBarProps {
  onSelect: (plan: PlanSearchResult) => void;
  /** Optional placeholder override. */
  placeholder?: string;
  /** Auto-focus the input on mount. */
  autoFocus?: boolean;
}

const POPULAR_SUGGESTIONS = [
  'AP Calc derivatives',
  'GCSE quadratics',
  'fractions',
  'IB DP statistics',
  'JEE mechanics',
  'phonics',
  'civil rights',
  'photosynthesis',
];

export default function PlanSearchBar({
  onSelect,
  placeholder = '🔍 Search lessons (try "AP Calc derivatives", "GCSE quadratics", "phonics")',
  autoFocus = false,
}: PlanSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlanSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search — 200ms after last keystroke, hit the API.
  useEffect(() => {
    const trimmed = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tutor/lesson-plans?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = await res.json();
        setResults(Array.isArray(data.items) ? data.items : []);
        setActiveIdx(0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Click-outside to close the dropdown.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Cmd/Ctrl-K to focus the search bar from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSelect = useCallback(
    (plan: PlanSearchResult) => {
      setQuery('');
      setResults([]);
      setIsOpen(false);
      onSelect(plan);
    },
    [onSelect],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && (query.trim().length > 0 || results.length === 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-4 pr-20 border-2 border-blue-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm placeholder-gray-400"
          aria-label="Search lesson plans"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[10px] font-mono text-gray-500 pointer-events-none">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-2xl max-h-[480px] overflow-y-auto">
          {query.trim().length === 0 ? (
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-semibold">Try searching for…</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Or use the structured picker below to browse by subject and level.
              </p>
            </div>
          ) : isLoading ? (
            <div className="p-4 text-sm text-gray-500">Searching…</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No lessons found for <span className="font-medium">&ldquo;{query}&rdquo;</span>. Try simpler keywords.
            </div>
          ) : (
            <ul role="listbox">
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === activeIdx}>
                  <button
                    onClick={() => handleSelect(p)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                      i === activeIdx ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{p.title}</div>
                        {p.los[0]?.description && (
                          <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                            {p.los[0].description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium uppercase">
                            {p.curriculum}
                          </span>
                          <span className="text-gray-500">Grade {p.grade}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-500">{p.estimatedMinutes} min</span>
                        </div>
                      </div>
                      <kbd className="hidden sm:flex items-center text-[10px] text-gray-400 mt-1">↵</kbd>
                    </div>
                  </button>
                </li>
              ))}
              <li className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100 bg-gray-50/50">
                {results.length === 50 ? 'Showing top 50 — refine your search to see more' : `${results.length} result${results.length === 1 ? '' : 's'}`}
                <span className="ml-3">↑↓ to navigate · ↵ to start · esc to close</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
