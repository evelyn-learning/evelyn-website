/**
 * Keeps the screen on for the length of a spoken session, and records when the page is hidden and shown again.
 *
 * A voice conversation is minutes of listening and speaking with no touch. A phone dims and locks in that time,
 * the browser suspends the page, and the microphone and the tutor's voice stop: the person finds themselves back on
 * the phone's home screen in the middle of a sentence. Three sessions on an iPhone went that way (a partner's
 * review, 2026-11-17: in embed-1794953503551 nothing ran for six minutes, not even the silence check, and the
 * session then closed on "the time is up"). Nothing in the session record showed it, so the hidden and shown
 * moments are recorded too.
 *
 * The Screen Wake Lock API is released by the browser whenever the page is hidden, so it is asked for again each
 * time the page comes back. Kill switch: NEXT_PUBLIC_TUTOR_SCREEN_AWAKE=off.
 */
import { useEffect, useRef } from 'react';

interface WakeLockSentinelLike { release: () => Promise<void>; addEventListener?: (type: 'release', cb: () => void) => void }
type WakeLockNavigator = Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> } };

export const SCREEN_AWAKE_ON = process.env.NEXT_PUBLIC_TUTOR_SCREEN_AWAKE !== 'off';

export function useScreenAwake(active: boolean, onEvent?: (type: string, message: string) => void): void {
  const onEventRef = useRef(onEvent); onEventRef.current = onEvent;
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    let lock: WakeLockSentinelLike | null = null;
    let gone = false;
    let hiddenAt = 0;
    let said = '';
    const say = (message: string) => { if (message !== said) { said = message; onEventRef.current?.('v2_screen_awake', message); } };
    const hold = async () => {
      if (!SCREEN_AWAKE_ON || gone || lock || document.visibilityState !== 'visible') return;
      const wl = (navigator as WakeLockNavigator).wakeLock;
      if (!wl) { say('not supported by this browser'); return; }
      try {
        const got = await wl.request('screen');
        if (gone) { void got.release().catch(() => {}); return; }
        lock = got;
        got.addEventListener?.('release', () => { if (lock === got) lock = null; });
        say('held');
      } catch (err) { say(`refused: ${err instanceof Error ? err.name : 'error'}`); }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); onEventRef.current?.('v2_page_hidden', 'the page went to the background or the screen locked'); return; }
      onEventRef.current?.('v2_page_shown', hiddenAt ? `back after ${Math.round((Date.now() - hiddenAt) / 1000)} s` : 'shown');
      hiddenAt = 0;
      void hold();
    };
    document.addEventListener('visibilitychange', onVisibility);
    void hold();
    return () => {
      gone = true;
      document.removeEventListener('visibilitychange', onVisibility);
      const held = lock; lock = null;
      if (held) void held.release().catch(() => {});
    };
  }, [active]);
}
