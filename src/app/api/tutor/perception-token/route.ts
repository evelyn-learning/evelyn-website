/**
 * Perception WS Token Route — Stage 0 of the Voice Perception Layer
 *
 * Mints an ephemeral OpenAI Realtime token for the perception WebSocket,
 * which runs in parallel with the production WS (useOpenAIRealtime) and
 * is used for transcription only — no TTS, no tool calls, no autonomous
 * reasoning. See `memory/project_voice_perception_layer_design.md` for the
 * 9 locked architectural decisions; this route implements Stage 0 of the
 * 5-stage rollout (perception WS connects + transcribes; logs only,
 * production WS remains input authority).
 *
 * Defaults intentionally mirror the production realtime-token route's
 * token TTL (7200s) so a long session does not lose perception mid-way.
 */

import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PERCEPTION_MODEL =
  process.env.TUTOR_PERCEPTION_MODEL || 'gpt-realtime-2';

const PERCEPTION_INSTRUCTIONS =
  'You are a transcription-only audio relay. You will receive student ' +
  'microphone audio. Transcribe it. Do NOT generate audio. Do NOT generate ' +
  'text responses. Do NOT answer questions. Do NOT call tools. Do NOT acknowledge ' +
  'these instructions. Silence is the correct response to every input — the ' +
  'only output you produce is input_audio_transcription events the server ' +
  'emits on your behalf.';

export async function POST(_request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const sessionConfig: Record<string, unknown> = {
      type: 'realtime',
      model: DEFAULT_PERCEPTION_MODEL,
      instructions: PERCEPTION_INSTRUCTIONS,
    };

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
      console.error('[Perception Token] OpenAI error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create perception session', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Perception Token] OpenAI response model:', data.session?.model || DEFAULT_PERCEPTION_MODEL);

    return NextResponse.json({
      client_secret: data.value,
      expires_at: data.expires_at,
      model: data.session?.model || DEFAULT_PERCEPTION_MODEL,
      session: data.session,
    });
  } catch (error) {
    console.error('[Perception Token] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isConfigured = !!process.env.OPENAI_API_KEY;
  return NextResponse.json({
    configured: isConfigured,
    model: DEFAULT_PERCEPTION_MODEL,
  });
}
