'use client';

/**
 * Header Full screen control (demo-polish, 2026-10-29).
 *
 * The board tool cluster (Draw / pen / Text note / Camera / Full screen /
 * wrench) is hidden by default now — students never found Full screen in
 * it, and the upload button duplicated the header's. This labelled button
 * sits in the session header instead. It is a view over the stage's own
 * fullscreen machinery (`FullscreenApi`, reported by SessionStage): native
 * Fullscreen API where available, the iframe "expand" request where it is
 * not (iPhone Safari, iframes without allowfullscreen), nothing where
 * neither applies.
 */
import { Maximize2, Minimize2 } from 'lucide-react';
import { useSessionStrings } from '@/lib/tutor/i18n/SessionStringsContext';

export interface FullscreenApi {
  /** Native fullscreen or the iframe expand path is possible here. */
  available: boolean;
  /** Fullscreen (or expanded) right now. */
  active: boolean;
  toggle: () => void;
}

export function HeaderFullscreenButton({ api, compact = false }: { api: FullscreenApi | null | undefined; compact?: boolean }) {
  const S = useSessionStrings();
  if (!api || !api.available) return null;
  const label = api.active ? S.exitFullScreen : S.fullScreen;
  const Icon = api.active ? Minimize2 : Maximize2;
  return (
    <button
      type="button"
      data-testid="header-fullscreen"
      onClick={api.toggle}
      title={label}
      aria-label={label}
      className={compact
        ? 'grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600'
        : 'flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'}
    >
      <Icon className="w-4 h-4" />
      {!compact && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
