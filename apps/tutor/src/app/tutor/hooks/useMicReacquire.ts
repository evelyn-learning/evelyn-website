'use client';
/**
 * The microphone follows the student when their input device changes.
 *
 * A student on AirPods whose AirPods move to their phone, or who unplugs a headset, leaves the page holding a
 * capture of a device that is gone: the tutor is still heard, through whatever output the laptop falls back to,
 * and the student is not heard again. The v1 runtime re-acquires the shared capture on the current default input
 * (VoiceTutorRealtime.tsx, Task 27 §G, GDI run 14); tutor v2 had no such watch, and a Crimsora lesson went deaf
 * for eight minutes until the student typed (English, portal-1f1d7348). This is that watch as a hook, for v2.
 *
 * Triggers: the browser reports a device change and the default input is no longer the captured one; the shared
 * track ends; the track is muted at the source for more than three seconds. Every capture graph swaps its source
 * (shared-mic.ts): no recogniser reconnects.
 */
import { useEffect, useRef } from 'react';
import { TUTOR_MIC_REACQUIRE } from '@/lib/tutor/orchestrator/flags';
import { micReacquireDecision, micReacquireReason, MIC_TRACK_MUTED_REACQUIRE_MS, defaultInputChanged, type MicReacquireTrigger } from '@/lib/tutor/voice/mic-reacquire';
import { getSharedMicLabel, reacquireSharedMicStream, sharedMicCaptureOpen, sharedMicReacquireInFlight, sharedMicTrackMuted } from '@/lib/tutor/voice/shared-mic';

export function useMicReacquire(opts: { enabled: boolean; onDebugEvent?: (type: string, message: string) => void; onNotice?: (up: boolean) => void }): void {
  const o = useRef(opts); o.current = opts;
  const enabled = opts.enabled;
  useEffect(() => {
    if (!TUTOR_MIC_REACQUIRE || !enabled || typeof window === 'undefined') return;
    const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
    let lastReacquireAt: number | null = null;
    let mutedSince: number | null = null;
    let muteTimer: ReturnType<typeof setTimeout> | null = null;
    let noticeTimer: ReturnType<typeof setTimeout> | null = null;
    let noticeUp = false;
    const clearNotice = () => {
      if (noticeTimer) { clearTimeout(noticeTimer); noticeTimer = null; }
      if (noticeUp) { noticeUp = false; o.current.onNotice?.(false); }
    };
    const showNotice = () => {
      noticeUp = true; o.current.onNotice?.(true);
      if (noticeTimer) clearTimeout(noticeTimer);
      noticeTimer = setTimeout(clearNotice, 15_000);
    };
    const run = (trigger: MicReacquireTrigger) => {
      const decision = micReacquireDecision(trigger, {
        enabled: true,
        captureOpen: sharedMicCaptureOpen(),
        inFlight: sharedMicReacquireInFlight(),
        sinceLastReacquireMs: lastReacquireAt == null ? null : Date.now() - lastReacquireAt,
      });
      if (decision === 'wait' && trigger.kind === 'track-muted') {
        if (muteTimer) clearTimeout(muteTimer);
        muteTimer = setTimeout(() => {
          muteTimer = null;
          if (mutedSince != null && sharedMicTrackMuted()) run({ kind: 'track-muted', mutedForMs: Date.now() - mutedSince });
        }, Math.max(0, MIC_TRACK_MUTED_REACQUIRE_MS - trigger.mutedForMs) + 50);
        return;
      }
      if (decision !== 'reacquire') return;
      lastReacquireAt = Date.now();
      const reason = micReacquireReason(trigger);
      o.current.onDebugEvent?.('mic_device_changed', reason);
      showNotice();
      reacquireSharedMicStream(reason)
        .then((stream) => {
          mutedSince = null;
          o.current.onDebugEvent?.('mic_reacquired', (stream.getAudioTracks()[0]?.label ?? '').slice(0, 60) || 'default input');
        })
        .catch((err) => {
          clearNotice();
          o.current.onDebugEvent?.('mic_reacquire_failed', err instanceof Error ? `${err.name}: ${err.message}`.slice(0, 120) : String(err).slice(0, 120));
        });
    };
    // Only when the default input is no longer the captured device.
    const onDeviceChange = () => {
      const trackLive = sharedMicCaptureOpen() && !!getSharedMicLabel();
      if (!trackLive || typeof md?.enumerateDevices !== 'function') { run({ kind: 'devicechange' }); return; }
      md.enumerateDevices()
        .then((list) => {
          if (defaultInputChanged(list, getSharedMicLabel())) run({ kind: 'devicechange' });
          else o.current.onDebugEvent?.('mic_device_change_ignored', `default input unchanged ("${getSharedMicLabel().slice(0, 40)}")`);
        })
        .catch(() => run({ kind: 'devicechange' }));
    };
    const onTrack = (e: Event) => {
      const kind = (e as CustomEvent<{ kind?: string }>).detail?.kind;
      if (kind === 'ended') run({ kind: 'track-ended' });
      else if (kind === 'mute') { mutedSince = Date.now(); run({ kind: 'track-muted', mutedForMs: 0 }); }
      else if (kind === 'unmute') { mutedSince = null; if (muteTimer) { clearTimeout(muteTimer); muteTimer = null; } }
    };
    const onFrame = () => clearNotice();
    md?.addEventListener?.('devicechange', onDeviceChange);
    window.addEventListener('evelyn:shared-mic-track', onTrack);
    window.addEventListener('evelyn:shared-mic-frame', onFrame);
    return () => {
      md?.removeEventListener?.('devicechange', onDeviceChange);
      window.removeEventListener('evelyn:shared-mic-track', onTrack);
      window.removeEventListener('evelyn:shared-mic-frame', onFrame);
      if (muteTimer) clearTimeout(muteTimer);
      clearNotice();
    };
  }, [enabled]);
}
