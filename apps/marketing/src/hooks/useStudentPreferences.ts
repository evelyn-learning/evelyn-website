/**
 * useStudentPreferences — single source of truth for the client-side
 * preference cache.
 *
 * Persistence model (Stage 3):
 *   - localStorage is the read path the tutor session uses live (no
 *     network on session start).
 *   - When a `studentId` is available (URL param today, auth context
 *     later), we additionally GET on mount to seed/update localStorage,
 *     and PATCH on every set so cross-device works.
 *   - DB sync failures are logged but do NOT block the local update.
 *     A student should never see their setting bounce because the API
 *     was slow or unavailable.
 *
 * Returns `{ preferences, setPreference, clearPreference, source }`.
 *   - source = 'localStorage' until the DB GET resolves, then 'db' (or
 *     stays 'localStorage' if no studentId / GET failed).
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';

const LS_KEY = 'evelyn_student_preferences';

type PreferenceSource = 'localStorage' | 'db' | 'none';

function readLocalStorage(): StudentPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as StudentPreferences) : {};
  } catch {
    return {};
  }
}

// Same-tab broadcast channel. The native `storage` event only fires in OTHER
// tabs, so two hook instances in the SAME tab (e.g. the in-session ⋯ menu and
// the VoiceTutorRealtime brain-prompt builder) wouldn't see each other's
// changes — a mid-session humor/pacing change would never reach the brain.
// This custom event closes that gap.
const PREFS_EVENT = 'studentPreferencesChanged';

function writeLocalStorage(prefs: StudentPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage can be disabled / full; the in-memory state still
    // reflects the user's choice for this session.
  }
  // Defer the broadcast: writeLocalStorage is called inside a setState updater,
  // so dispatching synchronously would invoke other instances' listeners (→
  // their setState) DURING render ("Cannot update a component while rendering a
  // different component"). A microtask runs after the current render/commit.
  try { queueMicrotask(() => { try { window.dispatchEvent(new Event(PREFS_EVENT)); } catch { /* no window */ } }); } catch { /* no queueMicrotask */ }
}

export interface UseStudentPreferencesOptions {
  /** When provided, the hook syncs with the persisted profile via the
   *  /api/tutor/student-profile/[id]/preferences endpoint. When absent,
   *  the hook is localStorage-only. */
  studentId?: string;
}

export interface UseStudentPreferencesResult {
  preferences: StudentPreferences;
  setPreference: <K extends keyof StudentPreferences>(key: K, value: StudentPreferences[K]) => void;
  clearPreference: (key: keyof StudentPreferences) => void;
  source: PreferenceSource;
  /** True while the initial DB GET (when studentId is provided) is in flight. */
  isLoading: boolean;
}

export function useStudentPreferences(options: UseStudentPreferencesOptions = {}): UseStudentPreferencesResult {
  const { studentId } = options;
  // SSR-safe initial state. The actual localStorage read happens in the
  // mount effect below — reading it synchronously inside useState's
  // initializer would return `{}` on the server but the real value on
  // the client, producing a hydration mismatch on the very first paint
  // when a preference is already saved.
  const [preferences, setPreferences] = useState<StudentPreferences>({});
  const [source, setSource] = useState<PreferenceSource>('none');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On mount (and whenever studentId changes), hydrate from localStorage
  // first, then optionally upgrade to the DB value. localStorage gives
  // the user instant feedback; the DB call promotes it to the cross-
  // device source of truth when authenticated. DB sync failures are
  // logged but don't break the local UX.
  useEffect(() => {
    const local = readLocalStorage();
    setPreferences(local);
    setSource(Object.keys(local).length > 0 ? 'localStorage' : 'none');

    if (!studentId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tutor/student-profile/${encodeURIComponent(studentId)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { profile?: { preferences?: StudentPreferences } };
        const dbPrefs = data.profile?.preferences ?? {};
        if (cancelled) return;
        setPreferences(dbPrefs);
        writeLocalStorage(dbPrefs);
        setSource('db');
      } catch (err) {
        console.warn('[useStudentPreferences] DB sync failed, using localStorage', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  // Stay in sync with OTHER hook instances (same tab via PREFS_EVENT, other
  // tabs via the native storage event) so an in-session preference change is
  // reflected everywhere — including the brain-prompt builder.
  useEffect(() => {
    const onChange = () => setPreferences(readLocalStorage());
    window.addEventListener(PREFS_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(PREFS_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const persistRemote = useCallback(
    async (patch: Partial<Record<keyof StudentPreferences, StudentPreferences[keyof StudentPreferences] | null>>) => {
      if (!studentId) return;
      try {
        await fetch(`/api/tutor/student-profile/${encodeURIComponent(studentId)}/preferences`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      } catch (err) {
        console.warn('[useStudentPreferences] DB write failed; localStorage retains the change', err);
      }
    },
    [studentId],
  );

  const setPreference = useCallback(
    <K extends keyof StudentPreferences>(key: K, value: StudentPreferences[K]) => {
      setPreferences((prev) => {
        const next = { ...prev, [key]: value };
        writeLocalStorage(next);
        return next;
      });
      setSource((s) => (s === 'db' ? 'db' : 'localStorage'));
      void persistRemote({ [key]: value } as Partial<Record<keyof StudentPreferences, StudentPreferences[keyof StudentPreferences] | null>>);
    },
    [persistRemote],
  );

  const clearPreference = useCallback(
    (key: keyof StudentPreferences) => {
      setPreferences((prev) => {
        const next = { ...prev };
        delete next[key];
        writeLocalStorage(next);
        return next;
      });
      void persistRemote({ [key]: null } as Partial<Record<keyof StudentPreferences, StudentPreferences[keyof StudentPreferences] | null>>);
    },
    [persistRemote],
  );

  return { preferences, setPreference, clearPreference, source, isLoading };
}
