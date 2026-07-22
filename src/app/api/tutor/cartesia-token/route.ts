/**
 * Cartesia Access-Token Route — Task 4 of
 * docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md.
 *
 * Mints a short-lived Cartesia access token with an `stt` grant so the
 * browser (useCartesiaInkWS, Task 5) can open the Ink 2 STT WebSocket
 * WITHOUT ever seeing the server-side CARTESIA_API_KEY. Mirrors the
 * structure of src/app/api/tutor/perception-token/route.ts (POST mints,
 * GET reports configured-state).
 *
 * Verified against https://docs.cartesia.ai/api-reference/auth/access-token.md
 * (fetched live 2026-07-06) — exact shapes, not guessed:
 *
 *   POST https://api.cartesia.ai/access-token
 *   Headers: `Cartesia-Version: 2026-03-01` (required) + auth. The docs'
 *     own examples authenticate this endpoint with `Authorization: Bearer
 *     <api_key>`, but per the "authenticate-your-client-applications" page,
 *     Cartesia accepts X-Api-Key interchangeably for server-side calls
 *     (case-insensitive), so we keep `X-API-Key` here for consistency with
 *     tts-cartesia/route.ts (Task 2) — same key, same header convention
 *     across all our server-to-Cartesia calls.
 *   Request body (TokenRequest): `{ grants?: { tts?: boolean; stt?: boolean;
 *     agent?: boolean }, expires_in?: number }` — expires_in max is 3600s.
 *   Response body (TokenResponse): `{ token: string }` — ONLY a token
 *     field. There is NO expires_at (or expires_in) in the response, so we
 *     compute expires_at ourselves from the request's expires_in and
 *     return it as a convenience for the client's refresh logic.
 *
 * WS auth for Task 5 (verified from get-started/authenticate-your-client-
 * applications.md, "Browser WebSocket" example): the browser cannot set
 * custom WS headers, so the token is passed as a QUERY PARAM named
 * `access_token` (NOT `api_key`), alongside `cartesia_version` also as a
 * query param (not a header) — e.g.
 *   wss://api.cartesia.ai/stt/turns/websocket?cartesia_version=2026-03-01&access_token=<token>
 * Task 5's useCartesiaInkWS MUST build its URL this way.
 *
 * Live-verify (2026-07-06) reproduced the exact cold-start undici
 * ConnectTimeoutError documented in tts-cartesia/route.ts's header comment
 * (first-ever fetch to api.cartesia.ai from a fresh process). Since this
 * route is hit on every STT reconnect (Task 5's ladder), it gets the same
 * fail-fast-then-retry-once treatment: attempt 1 wrapped in a 3s
 * AbortSignal.timeout, attempt 2 wrapped in a 10s AbortSignal.timeout
 * (final-review fix — an unguarded retry could otherwise hang indefinitely
 * against a still-dead pool) — only connect-level failures retry; a real
 * non-OK HTTP response falls straight through.
 */

import { NextRequest, NextResponse } from 'next/server';

const CARTESIA_TOKEN_URL = 'https://api.cartesia.ai/access-token';
const CARTESIA_VERSION = '2026-03-01';
const DEFAULT_EXPIRES_IN = 3600; // seconds — Cartesia's documented max.

export async function POST(_request: NextRequest) {
  try {
    const apiKey = process.env.CARTESIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cartesia API key not configured' },
        { status: 500 }
      );
    }

    const fetchOpts = {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Task 3.1 (humanlike-latency plan): + tts grant so the same token
        // also opens the TTS WebSocket (useCartesiaSonicWS). Verified live
        // 2026-07-22 via scripts/spike-cartesia-ws-tts.ts — /access-token
        // accepts a tts grant and the TTS WS accepts the resulting token.
        grants: { stt: true, tts: true },
        expires_in: DEFAULT_EXPIRES_IN,
      }),
    } as const;

    let response: Response;
    try {
      // Attempt 1: fail fast on a dead/slow connect (cold-start undici
      // ConnectTimeoutError) instead of stalling the client for ~10s.
      response = await fetch(CARTESIA_TOKEN_URL, { ...fetchOpts, signal: AbortSignal.timeout(3000) });
    } catch (connectErr) {
      console.warn('[Cartesia Token] attempt 1 failed (connect/timeout), retrying once:', connectErr);
      // Attempt 2: connection pool has usually recovered by now, but keep
      // a bound so a still-dead pool can't hang this request indefinitely.
      response = await fetch(CARTESIA_TOKEN_URL, { ...fetchOpts, signal: AbortSignal.timeout(10000) });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cartesia Token] error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create Cartesia access token', details: errorText },
        { status: response.status }
      );
    }

    const data = (await response.json()) as { token: string };

    return NextResponse.json({
      token: data.token,
      // Not returned by Cartesia — computed here so the client can drive
      // its own refresh-before-expiry logic without a round trip.
      expires_at: Date.now() + DEFAULT_EXPIRES_IN * 1000,
      // Task 3.1: test-key voice remaps (see substituteCartesiaVoiceId).
      // The HTTP TTS route applies these server-side; the TTS WebSocket
      // path builds its generation requests in the browser, so it needs
      // the raw mapping (voice ids only — not a secret). Unset in prod.
      voice_substitutions: process.env.CARTESIA_VOICE_SUBSTITUTIONS ?? null,
    });
  } catch (error) {
    console.error('[Cartesia Token] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isConfigured = !!process.env.CARTESIA_API_KEY;
  return NextResponse.json({
    configured: isConfigured,
    expiresIn: DEFAULT_EXPIRES_IN,
  });
}
