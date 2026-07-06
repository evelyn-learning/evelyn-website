/**
 * Cartesia TTS API Route — sonic-3.5
 *
 * Streaming pass-through to Cartesia's `/tts/bytes` endpoint. Returns raw
 * Float32 PCM at 24 kHz, mono (pcm_f32le, container: raw — NOT a WAV
 * file) — same shape/headers as tts-openai.ts, so it drops directly into
 * the existing audio playback queue (see Global Constraints in
 * docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md: the
 * openai-mini HTTP-TTS flow is reused wholesale, only the fetch URL/body
 * differ).
 *
 * Response body is streamed through as-is (no buffering) so first-byte
 * latency to the client matches Cartesia's own TTFA.
 *
 * Retry (Task 2 review follow-up, folded into Task 3): the first request
 * after a cold start can hit an undici ConnectTimeoutError against
 * api.cartesia.ai, which — left unguarded — silently stalls the client for
 * ~10s before its own fetch gives up (dead air on the first post-deploy
 * sentence). Wrap attempt 1 with AbortSignal.timeout(3000) so a slow/dead
 * connect fails fast, then retry ONCE with a plain fetch (no timeout
 * wrapper) — by then the connection pool has usually recovered. Only
 * connect-level failures (thrown errors / AbortError) trigger the retry;
 * a normal non-OK HTTP response is NOT retried and falls straight through
 * to the existing 502 handling below.
 */

import { NextRequest } from 'next/server';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';
import { CARTESIA_DEFAULT_VOICE_ID } from '@/lib/tutor/voice/cartesia-voice-registry';

const CARTESIA_TTS_URL = 'https://api.cartesia.ai/tts/bytes';
const CARTESIA_VERSION = '2026-03-01';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.CARTESIA_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Cartesia API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { text, voiceId } = body as { text?: string; voiceId?: string };

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ttsBody = {
      model_id: 'sonic-3.5',
      transcript: rewriteForTTS(text),
      voice: { mode: 'id', id: voiceId ?? CARTESIA_DEFAULT_VOICE_ID },
      language: 'en',
      output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: 24000 },
    };

    const fetchOpts = {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsBody),
    } as const;

    let ttsRes: Response;
    try {
      // Attempt 1: fail fast on a dead/slow connect (cold-start undici
      // ConnectTimeoutError) instead of the client's own ~10s stall.
      ttsRes = await fetch(CARTESIA_TTS_URL, { ...fetchOpts, signal: AbortSignal.timeout(3000) });
    } catch (connectErr) {
      console.warn('[TTS-Cartesia] attempt 1 failed (connect/timeout), retrying once:', connectErr);
      // Attempt 2: plain fetch, no timeout wrapper — give the connection
      // pool a real chance to complete once it's warm.
      ttsRes = await fetch(CARTESIA_TTS_URL, fetchOpts);
    }

    if (!ttsRes.ok || !ttsRes.body) {
      const errorText = await ttsRes.text();
      console.error('[TTS-Cartesia] error:', ttsRes.status, errorText);
      return new Response(
        JSON.stringify({ error: 'TTS generation failed', details: errorText }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Cartesia already returns raw Float32 PCM (pcm_f32le) — no int16
    // conversion needed. Stream the body through untouched so first-byte
    // latency is preserved (do not buffer via arrayBuffer()).
    return new Response(ttsRes.body, {
      headers: {
        'Content-Type': 'audio/pcm',
        'X-Audio-Sample-Rate': '24000',
        'X-Audio-Channels': '1',
        'X-Audio-Encoding': 'pcm_f32le',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[TTS-Cartesia] error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
