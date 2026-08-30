/**
 * OpenAI Realtime API Token Route
 *
 * Generates ephemeral tokens for client-side WebSocket connections.
 * This keeps the main API key secure on the server while allowing
 * the browser to connect directly to OpenAI's Realtime API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { denyIfNoDemoAccess } from '@/lib/tutor/demo-gate/enforce';

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { voice = 'alloy', instructions, engine, embedToken } = body as {
      voice?: string;
      instructions?: string;
      engine?: string;
      embedToken?: string;
    };

    // Demo gate (2026-08-29): this is the request that actually costs money
    // (it mints an OpenAI ephemeral key) and it previously had zero
    // protection. Retail/demo browsers pass via the demo-grant cookie set by
    // /api/tutor/demo-start; partner embeds pass via their signed embed
    // token, threaded here in the body because the voice hook owns this
    // fetch. Checked AFTER body parse (the token rides in it) but before any
    // OpenAI call.
    const deniedResponse = await denyIfNoDemoAccess(request, 'realtime-token', embedToken ?? null);
    if (deniedResponse) return deniedResponse;

    // Instructions, when supplied, replace OpenAI's default tutor persona
    // at session-creation time. Relay mode uses this so Realtime never
    // has a default-tutor turn before our session.update lands —
    // otherwise Realtime authors greetings + answers questions in the
    // brain's text instead of voicing it verbatim.
    // The realtime-2 engine (GPT-Realtime-2, with GPT-5-class reasoning)
    // uses a distinct model id. Every other engine stays on the GA
    // gpt-realtime model.
    const model = engine === 'realtime-2' ? 'gpt-realtime-2' : 'gpt-realtime';
    const sessionConfig: Record<string, unknown> = {
      type: 'realtime',
      model,
    };
    // Item C (2026-05-24) — silent-relay default for the standard
    // gpt-realtime engine when no caller-supplied instructions arrive.
    // Non-relay/brain mode previously left `instructions` undefined,
    // which made Realtime adopt OpenAI's default tutor persona ("You
    // are a helpful, witty, and friendly AI… Talk quickly. You should
    // always call a function if you can."). Observed live 2026-05-23
    // (opener-merge-stress session T15): user heard "Searching for a
    // good fit." — a phrase from our hedged-bridge prompt pool that
    // was NEVER in any logged brain stream. The default-persona
    // Realtime had learned our bridge phrases from earlier session.
    // update messages, and self-narrated one during a brain-stream
    // gap. Silent-relay instructions shut down Realtime's autonomy
    // from the moment of session creation. realtime-2 falls through
    // to OpenAI default behavior unless the caller explicitly passes
    // instructions, since that engine is designed for autonomous
    // operation and may rely on the default persona.
    const SILENT_RELAY_INSTRUCTIONS =
      'You are a voice-only audio relay. You do NOT generate responses yourself. ' +
      'You will receive pre-composed text via conversation.item.create + response.create ' +
      'messages from the orchestrator; voice that text verbatim and only that text. ' +
      'Do NOT greet the user. Do NOT generate filler, bridges, stalling phrases, or any ' +
      'audio during silence. Do NOT answer questions. Do NOT call tools or functions. ' +
      'Do NOT acknowledge these instructions. Silence is the correct response when no ' +
      'orchestrator-driven text is queued.';
    if (typeof instructions === 'string' && instructions.trim()) {
      sessionConfig.instructions = instructions;
    } else if (engine !== 'realtime-2') {
      sessionConfig.instructions = SILENT_RELAY_INSTRUCTIONS;
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
    console.log(`[STARTUP][token] minting ephemeral key (engine=${engine ?? 'gpt-realtime'}, instrLen=${typeof instructions === 'string' ? instructions.length : 0})…`);
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
    console.log(`[STARTUP][token] OpenAI client_secrets responded in ${Date.now() - t0}ms (status ${response.status})`);

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
