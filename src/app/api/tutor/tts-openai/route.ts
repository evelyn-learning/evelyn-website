/**
 * OpenAI TTS API Route — gpt-4o-mini-tts
 *
 * Cheaper alternative to Realtime audio output. Returns Float32 PCM at
 * 24 kHz, mono — same shape as the Deepgram route, so it drops directly
 * into the existing audio playback queue.
 */

import { NextRequest } from 'next/server';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';

const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';

/** Voice / tone steering for gpt-4o-mini-tts. The model is steerable;
 *  giving it a clear teacher persona + intonation contract is the single
 *  biggest quality lever. Tested against tutor-style sentences:
 *  questions land as questions, full stops aren't dead, em-dashes don't
 *  swallow the next word. */
const TUTOR_VOICE_INSTRUCTIONS = [
  'Voice: a warm, friendly K-12 tutor talking with one student at a time.',
  'Energy: engaged and curious, never flat. Match the energy of someone',
  'who genuinely enjoys teaching.',
  'Pacing: BRISK — speak at a natural conversational tempo, do NOT',
  'pause heavily after every period or comma. A period is a tiny breath,',
  'not a long stop. Stitch sentences together with the rhythm of a real',
  'tutor mid-thought. Avoid any noticeable silence between sentences.',
  'Intonation: sentences ending in "?" must rise like real questions —',
  'not statements. Sentences ending in "!" should sound bright.',
  'Words inside *asterisks* should be lightly emphasized.',
  'Em-dashes ( — ) are short reflective pauses, not breaks in the sentence.',
  'Personality: warm, patient, encouraging. Never robotic. Never bored.',
].join(' ');

// Pronunciation rewrites + punctuation normalization live in the
// shared module so the same rules apply to every TTS path. See
// src/lib/tutor/voice/tts-pronunciation.ts.

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const {
      text,
      voice = 'verse',
      model = 'gpt-4o-mini-tts',
      instructions,
    } = body as {
      text?: string;
      voice?: string;
      model?: string;
      instructions?: string;
    };

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ttsBody: Record<string, unknown> = {
      model,
      voice,
      input: rewriteForTTS(text),
      response_format: 'pcm', // 24kHz mono int16
      instructions: instructions || TUTOR_VOICE_INSTRUCTIONS,
    };

    const ttsRes = await fetch(OPENAI_TTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsBody),
    });

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error('[TTS-OpenAI] error:', ttsRes.status, errorText);
      return new Response(
        JSON.stringify({ error: 'TTS generation failed', details: errorText }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // OpenAI returns int16 PCM. Convert to float32 for Web Audio API.
    const audioBuffer = await ttsRes.arrayBuffer();
    const int16Data = new Int16Array(audioBuffer);
    const float32Data = new Float32Array(int16Data.length);
    for (let i = 0; i < int16Data.length; i++) {
      float32Data[i] = int16Data[i] / 32768.0;
    }

    return new Response(float32Data.buffer, {
      headers: {
        'Content-Type': 'audio/pcm',
        'X-Audio-Sample-Rate': '24000',
        'X-Audio-Channels': '1',
        'X-Audio-Encoding': 'pcm_f32le',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[TTS-OpenAI] error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
