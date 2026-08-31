/**
 * ElevenLabs TTS fallback route (round-28b, 2026-07-18).
 *
 * The voice-matched replacement for the removed round-18 OpenAI-voice
 * fallback: when Cartesia exhausts its retries, the client posts the
 * unspoken sentence here with the session's Cartesia voiceId; we resolve
 * the matched ElevenLabs voice (Praveen clone / gender+accent match — see
 * elevenlabs-voice-map.ts), compress the text so the fallback voice says
 * LESS (Haiku, with a deterministic net), and return raw Float32 PCM at
 * 24 kHz — byte-compatible with the tts-cartesia/tts-openai responses, so
 * the client's `new Float32Array(buf)` playback path needs no changes.
 *
 * ElevenLabs only emits s16le PCM, so unlike the Cartesia route this one
 * buffers and converts rather than streaming — acceptable because
 * recovery lines are short by construction.
 *
 * Upstream error semantics: non-2xx from ElevenLabs → 502 with the
 * upstream body in `details` (the client logs it and falls to the
 * captions pin). Notable upstream shapes seen 2026-07-18 pre-subscription:
 * 403 `only_for_creator+` (Praveen professional clone needs Creator tier),
 * 402 `paid_plan_required` (library voices need any paid plan).
 */
import { NextRequest } from 'next/server';
import { getModelClient } from '@/lib/tutor/ai/model-registry';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';
import { resolveElevenLabsVoice } from '@/lib/tutor/voice/elevenlabs-voice-map';
import { needsShortening, pickRecoveryLine, pcm16ToFloat32, RECOVERY_MAX_WORDS } from '@/lib/tutor/voice/tts-recovery';

export const runtime = 'nodejs';

const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
// Flash: lowest-latency tier — this route only runs when the student has
// already waited through Cartesia's retries.
const ELEVENLABS_MODEL_ID = 'eleven_flash_v2_5';
// Same model tier as the question-gist route: small, well-scoped rewrite.
const { client: anthropic, model: SHORTEN_MODEL_ID } = getModelClient('tts-shorten');
const SHORTEN_TIMEOUT_MS = 1_800;

const SHORTEN_SYSTEM = `A voice tutor's speech engine failed mid-sentence and a backup voice will speak ONE short recovery line instead. Compress the tutor's undelivered text into at most ${RECOVERY_MAX_WORDS} words, keeping the single most actionable part — if it asks the student something, keep that question; otherwise keep the key statement. First person, natural spoken tone, no preamble, no quotes. Preserve any inline $...$ LaTeX exactly as written.`;

async function shortenForRecovery(text: string): Promise<string> {
  if (!needsShortening(text)) return text;
  try {
    const msg = await anthropic.messages.create(
      {
        model: SHORTEN_MODEL_ID,
        max_tokens: 100,
        system: SHORTEN_SYSTEM,
        messages: [{ role: 'user', content: text.slice(-2000) }],
      },
      { signal: AbortSignal.timeout(SHORTEN_TIMEOUT_MS) },
    );
    const raw = msg.content[0]?.type === 'text' ? msg.content[0].text.trim() : '';
    // A sane compression is non-empty and actually shorter than the input;
    // anything else falls to the deterministic net.
    if (raw && raw.length < text.length) return raw;
  } catch {
    // Timeout / API failure — deterministic net below.
  }
  return pickRecoveryLine(text);
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ElevenLabs API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { text, cartesiaVoiceId, studentName } = body as {
      text?: string; cartesiaVoiceId?: string; studentName?: string;
    };
    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const voiceId = resolveElevenLabsVoice(cartesiaVoiceId);
    const recoveryLine = await shortenForRecovery(text.trim());

    const ttsRes = await fetch(
      `${ELEVENLABS_TTS_URL}/${voiceId}?output_format=pcm_24000`,
      {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rewriteForTTS(recoveryLine, { studentName }),
          model_id: ELEVENLABS_MODEL_ID,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error('[TTS-ElevenLabs] error:', ttsRes.status, errorText);
      return new Response(
        JSON.stringify({ error: 'TTS generation failed', details: errorText }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const s16 = await ttsRes.arrayBuffer();
    // Guard odd byte counts (truncated upstream body) — Int16Array requires
    // even length.
    const even = s16.byteLength - (s16.byteLength % 2);
    const f32 = pcm16ToFloat32(new Int16Array(s16, 0, even / 2));
    // Copy into a plain ArrayBuffer — BodyInit rejects the ArrayBufferLike
    // typed-array backing under strict TS.
    const out = new ArrayBuffer(f32.byteLength);
    new Float32Array(out).set(f32);

    return new Response(out, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'no-store',
        // The client surfaces the (possibly shortened) spoken line in the
        // transcript-adjacent caption if it needs it; expose word count as
        // a cheap diagnostic without echoing the text into headers.
        'X-Recovery-Shortened': String(recoveryLine.length < text.trim().length),
      },
    });
  } catch (err) {
    console.error('[TTS-ElevenLabs] route error:', err);
    return new Response(JSON.stringify({ error: 'TTS route failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
