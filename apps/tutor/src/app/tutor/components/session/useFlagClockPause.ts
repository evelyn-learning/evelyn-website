'use client';

/**
 * Task 7s (HEADER_CLOCK_PAUSE): the time the tester's debug flag panel held the lesson clock (TutorVoiceV2 dispatches the window
 * event `evelyn:lesson-clock-paused` while it is open; development only, 7n FLAG_CLOCK_PAUSE). The header timers leave it out, as
 * the lesson clock and the embed's `evelyn:clock` do: mic test 5 (embed-1795050656326) showed 22:35 / 20:00 with about five
 * minutes of flags. `sinceMs`: a pause under way (the clock stands still); `totalMs`: the pauses closed. Production: always zero.
 */
import { useEffect, useState } from 'react';
import { TUTOR_V2_HEADER_CLOCK_PAUSE } from '@/lib/tutor/orchestrator/flags';

export interface FlagClockPause { totalMs: number; sinceMs: number | null }

export function useFlagClockPause(): FlagClockPause {
  const [pause, setPause] = useState<FlagClockPause>({ totalMs: 0, sinceMs: null });
  useEffect(() => {
    if (!TUTOR_V2_HEADER_CLOCK_PAUSE || process.env.NODE_ENV === 'production' || typeof window === 'undefined') return;
    const on = (e: Event) => {
      const paused = !!(e as CustomEvent<{ paused?: boolean }>).detail?.paused; const now = Date.now();
      setPause((p) => (paused && p.sinceMs === null ? { ...p, sinceMs: now } : !paused && p.sinceMs !== null ? { totalMs: p.totalMs + (now - p.sinceMs), sinceMs: null } : p));
    };
    window.addEventListener('evelyn:lesson-clock-paused', on);
    return () => window.removeEventListener('evelyn:lesson-clock-paused', on);
  }, []);
  return pause;
}

/** Seconds in the session at `nowMs` with the flag time left out (a pause under way stands the clock still at its start). */
export function flagFreeElapsedSec(startedAtMs: number, nowMs: number, pause: FlagClockPause): number {
  const end = pause.sinceMs !== null ? Math.min(nowMs, pause.sinceMs) : nowMs;
  return Math.max(0, Math.floor((end - startedAtMs - pause.totalMs) / 1000));
}
