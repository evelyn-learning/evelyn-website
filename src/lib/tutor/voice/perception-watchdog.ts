/**
 * Transcription-watchdog recovery decision for the perception WS.
 *
 * NOTE: this guards usePerceptionWS (OpenAI Realtime transcription), the
 * FALLBACK STT path. Production runs Cartesia Ink 2
 * (NEXT_PUBLIC_TUTOR_STT_ENGINE=ink2 → useCartesiaInkWS), whose own
 * watchdog already recovers regardless of socket state.
 *
 * The watchdog arms on `speech_stopped` and fires when the transcriber
 * never returns a `transcription.completed`. The dangerous hang is on
 * a HEALTHY socket: readyState is OPEN, nothing errors, and the
 * student's utterance silently evaporates (observed as a 27s dead gap
 * in session-1783615559112 — the student repeated themselves twice and
 * left). Recovery is the same in every hang case: close the socket so
 * `onclose` runs the reconnect ladder and the mic processor re-attaches
 * to the fresh connection via `wsRef`.
 *
 * The only states that must NOT recover:
 * - intentional disconnect (session end / perception disabled),
 * - no socket (onclose already ran; reconnect is already owned there),
 * - CONNECTING (handshake in flight — closing it would race the very
 *   reconnect that is about to make things healthy again).
 */
export function shouldForceReconnectOnWatchdog(args: {
  hasSocket: boolean;
  readyState: number;
  intentionallyDisconnected: boolean;
}): boolean {
  const WS_CONNECTING = 0;
  if (!args.hasSocket) return false;
  if (args.intentionallyDisconnected) return false;
  if (args.readyState === WS_CONNECTING) return false;
  return true;
}
