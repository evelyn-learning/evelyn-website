/**
 * WS error-surfacing + foreground-reconnect decisions (round-7 item 3).
 *
 * Shared by useOpenAIRealtime / useCartesiaInkWS / usePerceptionWS.
 *
 * Background (session portal-b2fe010e, 2026-07-28): a WebSocket `error`
 * event is always followed by `close`. When the hook's onclose runs a
 * reconnect ladder, surfacing the error from onerror banners the user
 * mid-recovery — in that session the ladder recovered within ~1s while
 * the 'WebSocket connection error' banner stuck for the rest of the
 * session (nothing clears it). The error path must only fire when
 * reconnect machinery does NOT own recovery.
 *
 * Foreground re-arm: the ladders are bounded (3 attempts) and only
 * re-enter via ws.onclose. A backgrounded tab throttles timers and drops
 * the network, so the ladder can burn out with the socket already gone —
 * after which no onclose ever comes and the hook is dead until the user
 * reloads. On visibilitychange→visible the hook resets the ladder and,
 * when the socket is genuinely dead, reconnects silently.
 */

/**
 * Should a ws `error` event notify the user-facing error path, or stay
 * silent because onclose's reconnect ladder owns recovery?
 */
export function shouldSurfaceWsError(args: {
  intentionallyDisconnected: boolean;
  reconnectEnabled: boolean;
}): boolean {
  // Late error events during session teardown are expected noise.
  if (args.intentionallyDisconnected) return false;
  // Ladder owns recovery (including its own exhaustion signal) — the
  // frozen banner-from-onerror behavior only survives with the flag off.
  return !args.reconnectEnabled;
}

/**
 * On visibilitychange→visible: should the hook reconnect a dead socket?
 *
 * `wsReadyState: null` means no socket object at all (onclose already
 * ran and nulled the ref) — the burned-out-in-background case.
 */
export function shouldReconnectOnForeground(args: {
  visible: boolean;
  intentionallyDisconnected: boolean;
  /** True once ws.onopen has ever fired — never connect before session start. */
  everConnected: boolean;
  wsReadyState: number | null;
  reconnectTimerPending: boolean;
}): boolean {
  const WS_OPEN = 1;
  if (!args.visible) return false;
  if (args.intentionallyDisconnected) return false;
  if (!args.everConnected) return false;
  // A pending backoff timer fires as soon as timers unthrottle — let it.
  if (args.reconnectTimerPending) return false;
  // CONNECTING (0) or OPEN (1): healthy or already recovering.
  if (args.wsReadyState !== null && args.wsReadyState <= WS_OPEN) return false;
  return true;
}
