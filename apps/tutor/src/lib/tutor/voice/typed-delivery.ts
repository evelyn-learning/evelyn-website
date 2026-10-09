/**
 * Typed-message delivery when the realtime socket is not open — pure
 * decisions, no I/O.
 *
 * ROOT CAUSE (2026-10-08, live text-mode partner session): the realtime
 * socket was still waiting on its token when the student typed at 33.9 s.
 * useOpenAIRealtime's sendTextMessage parked the message for `ws.onopen`
 * (R32 queue) — but the token request failed at 62.6 s, the socket never
 * opened, and the message, already shown in the transcript, was never
 * answered. In text mode with the brain relay the socket carries nothing the
 * turn needs: the brain is called over HTTP and nothing is voiced through
 * the socket. So that turn goes straight to the brain, and a failed realtime
 * connect is not an error the student should see.
 *
 * Voice mode is unchanged throughout: it parks and flushes on reconnect.
 *
 * Exercised by `npm run test:typed-delivery`.
 */

/** The R32 parked-message cap. */
export const TYPED_QUEUE_MAX = 5;

/** `error.name` of a failed realtime connect() (token or socket). */
export const REALTIME_CONNECT_ERROR_NAME = 'RealtimeConnectError';

export type TypedDelivery = 'send' | 'relay' | 'park' | 'drop';

/**
 * Where a sendTextMessage call goes.
 *  - 'send'  — socket open: the existing path (which itself relays to the
 *              brain in relay mode).
 *  - 'relay' — socket not open, text mode, brain relay: hand it to the brain
 *              now. Never parked, so the later onopen flush cannot deliver it
 *              a second time.
 *  - 'park' / 'drop' — socket not open, otherwise: queue for onopen, or drop
 *              once the queue is full (R32, unchanged).
 */
export function decideTypedDelivery(input: {
  socketOpen: boolean;
  textMode: boolean;
  relayActive: boolean;
  /** Messages already parked for onopen. */
  parkedCount: number;
}): TypedDelivery {
  if (input.socketOpen) return 'send';
  if (input.textMode && input.relayActive) return 'relay';
  return input.parkedCount < TYPED_QUEUE_MAX ? 'park' : 'drop';
}

/** May the composer submit? Text mode with the brain relay does not wait on
 *  the realtime connection; everything else gates on it as before. */
export function canSubmitTyped(input: { isConnected: boolean; textMode: boolean; relayActive: boolean }): boolean {
  return input.isConnected || (input.textMode && input.relayActive);
}

/** Should a realtime-hook error reach the banner and the parent's onError
 *  (which may end the session)? A failed connect in a text session with the
 *  brain relay costs the student nothing, so it stays a debug event. */
export function shouldSurfaceRealtimeError(input: { errorName: string | undefined; textMode: boolean; relayActive: boolean }): boolean {
  return !(input.textMode && input.relayActive && input.errorName === REALTIME_CONNECT_ERROR_NAME);
}

/** The connect() error for a token that never arrived. `failure` is what the
 *  token request recorded ("HTTP 429", a thrown fetch message); the prefetch
 *  resolves null on failure, which used to read as "missing client_secret"
 *  whatever had actually happened. */
export function describeTokenFailure(failure: string | null | undefined): string {
  const f = (failure ?? '').trim();
  return f ? `Failed to get realtime token: ${f}` : 'Invalid token response: missing client_secret';
}
