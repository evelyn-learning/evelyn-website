/**
 * OpenAI Realtime API Token Route
 *
 * Generates ephemeral tokens for client-side WebSocket connections.
 * This keeps the main API key secure on the server while allowing
 * the browser to connect directly to OpenAI's Realtime API.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { voice = 'alloy', instructions } = body as {
      voice?: string;
      instructions?: string;
    };

    // Instructions, when supplied, replace OpenAI's default tutor persona
    // at session-creation time. Relay mode uses this so Realtime never
    // has a default-tutor turn before our session.update lands —
    // otherwise Realtime authors greetings + answers questions in the
    // brain's text instead of voicing it verbatim.
    const sessionConfig: Record<string, unknown> = {
      type: 'realtime',
      model: 'gpt-realtime',
    };
    if (typeof instructions === 'string' && instructions.trim()) {
      sessionConfig.instructions = instructions;
    }
    // Caching-initiative lever 1 (2026-05-18): extend the ephemeral-key
    // TTL from OpenAI's ~600s default to the 7200s (2h) max. Observed
    // failure: a ~10-min idle expired the key (log: expires_at =
    // session_start + 602s) → no reconnect/refresh path → 12s
    // transcription-watchdog → "technical issue" dead session
    // (project_voice_tutor_issues 2026-05-18). This widens the
    // idle-vulnerability window 10min → ~2h. Server-route only — does
    // NOT touch the frozen useOpenAIRealtime voice hook, turn_detection,
    // mic-gate, VAD env, or transcript-filters. `anchor:'created_at'`
    // + `seconds` per the OpenAI /v1/realtime/client_secrets API
    // (valid range 10–7200). Partial mitigation; the robust fix is the
    // reactive token-refresh + reconnect (levers 2–3, to be grilled).
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expires_after: { anchor: 'created_at', seconds: 7200 },
        session: sessionConfig,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Realtime Token] OpenAI error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create realtime session', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Realtime Token] OpenAI response:', JSON.stringify(data, null, 2));

    // Response format: { value: "ek_...", expires_at: ..., session: {...} }
    return NextResponse.json({
      client_secret: data.value,  // The token value directly
      expires_at: data.expires_at,
      session: data.session,
    });
  } catch (error) {
    console.error('[Realtime Token] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if OpenAI Realtime is configured
 */
export async function GET() {
  const isConfigured = !!process.env.OPENAI_API_KEY;
  return NextResponse.json({ configured: isConfigured });
}
