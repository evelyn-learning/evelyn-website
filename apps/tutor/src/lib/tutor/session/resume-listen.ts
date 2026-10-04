// src/lib/tutor/session/resume-listen.ts
/**
 * Should a session-start gesture open the production mic (realtime
 * .startListening())? Pure decision.
 *
 * WHY: `startListening` (useOpenAIRealtime) is the ONLY thing that creates
 * the ScriptProcessor feeding the student track of the session recording.
 * The normal Start tap calls it; the RESUME path ("Continue lesson" overlay
 * / mic-dock resume tap → resumeContinue) never did. Speech recognition kept
 * working (it captures through its own shared-mic consumer), so the gap was
 * invisible in the session itself — every resumed session simply had no
 * student audio in its recording.
 *
 * The rule is the one the Start tap already applies: open the mic unless the
 * student muted before starting, and never in text mode (which must not
 * touch the microphone at all).
 */
export type ListenOnStartReason = 'ok' | 'flag-off' | 'text-mode' | 'muted';

export function shouldStartListeningOnSessionStart(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_RESUME_START_LISTENING !== 'off'). */
  enabled: boolean;
  sessionMode: 'voice' | 'text';
  micMuted: boolean;
}): { start: boolean; reason: ListenOnStartReason } {
  if (input.sessionMode === 'text') return { start: false, reason: 'text-mode' };
  if (!input.enabled) return { start: false, reason: 'flag-off' };
  if (input.micMuted) return { start: false, reason: 'muted' };
  return { start: true, reason: 'ok' };
}
