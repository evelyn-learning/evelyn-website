/**
 * TTS API Route
 *
 * Streams audio from Deepgram Aura TTS for the AI tutor's speech.
 * Accepts text and voice preferences, returns streaming PCM audio.
 */

import { NextRequest } from 'next/server';
import type { VoiceId } from '@/lib/tutor/types';

// Deepgram Aura API configuration
const DEEPGRAM_TTS_URL = 'https://api.deepgram.com/v1/speak';

// Voice ID mapping to Deepgram Aura voice models
// See: https://developers.deepgram.com/docs/tts-models
const DEEPGRAM_VOICE_MAP: Record<VoiceId, string> = {
  'female-1': 'aura-asteria-en',   // Warm, friendly female
  'female-2': 'aura-luna-en',      // Professional female
  'male-1': 'aura-orion-en',       // Calm male
  'male-2': 'aura-arcas-en',       // Energetic male
};

/**
 * Add natural conversational pauses and rhythm
 */
function addConversationalRhythm(text: string): string {
  return text
    // Add slight pause after greeting words
    .replace(/^(Hey|Hi|Hello|Okay|Alright|So|Now|Great|Perfect|Excellent|Good)([,!]?\s)/gi, '$1.$2')
    // Add pause before questions to make them feel more thoughtful
    .replace(/(\.\s*)([A-Z][^.?!]*\?)/g, '$1... $2')
    // Add emphasis pause before "but", "however", "actually"
    .replace(/,?\s*(but|however|actually|though)\s/gi, '... $1 ')
    // Slow down for important words by adding comma pauses
    .replace(/\b(important|key|critical|remember|notice|interesting)\b/gi, '... $1')
    // Add natural filler-like pauses for thinking
    .replace(/\b(Let me|Let's|I think|You see|You know)\b/gi, '$1...')
    // Questions sound more natural with slight lead-in pause
    .replace(/(\?)\s*([A-Z])/g, '$1 ... $2');
}

/**
 * Expand scientific units and abbreviations for natural speech
 */
function expandForSpeech(text: string): string {
  return text
    // Physics units - velocity/speed
    .replace(/(\d+)\s*m\/s²/gi, '$1 meters per second squared')
    .replace(/(\d+)\s*m\/s/gi, '$1 meters per second')
    .replace(/(\d+)\s*km\/h/gi, '$1 kilometers per hour')
    .replace(/(\d+)\s*mph/gi, '$1 miles per hour')
    .replace(/(\d+)\s*ft\/s/gi, '$1 feet per second')
    // Distance
    .replace(/(\d+)\s*km\b/gi, '$1 kilometers')
    .replace(/(\d+)\s*cm\b/gi, '$1 centimeters')
    .replace(/(\d+)\s*mm\b/gi, '$1 millimeters')
    .replace(/(\d+)\s*m\b/gi, '$1 meters')
    // Time
    .replace(/(\d+)\s*min\b/gi, '$1 minutes')
    .replace(/(\d+)\s*sec\b/gi, '$1 seconds')
    .replace(/(\d+)\s*hr\b/gi, '$1 hours')
    .replace(/(\d+)\s*s\b/g, '$1 seconds')
    // Force
    .replace(/(\d+)\s*N\b/g, '$1 Newtons')
    .replace(/(\d+)\s*kN\b/gi, '$1 kilonewtons')
    // Mass
    .replace(/(\d+)\s*kg\b/gi, '$1 kilograms')
    .replace(/(\d+)\s*g\b/g, '$1 grams')
    // Acceleration
    .replace(/9\.8\s*m\/s²/gi, '9.8 meters per second squared')
    .replace(/g\s*=\s*9\.8/gi, 'g equals 9.8 meters per second squared')
    // Common physics abbreviations
    .replace(/\bv₀\b/g, 'v naught')
    .replace(/\bv_0\b/g, 'v naught')
    .replace(/\ba\b(?=\s*=)/g, 'acceleration')
    .replace(/\bΔ/g, 'delta ')
    // Math symbols - be context-aware with hyphens/minus
    .replace(/≈/g, 'approximately equals')
    .replace(/=/g, ' equals ')
    .replace(/\+/g, ' plus ')
    // Only "minus" when between numbers (math context): "5-3" -> "5 minus 3"
    .replace(/(\d)\s*-\s*(\d)/g, '$1 minus $2')
    // Em-dash and en-dash (used as pause/break) -> comma for natural pause
    .replace(/—/g, ', ')
    .replace(/–/g, ', ')
    // Hyphen surrounded by spaces (used as dash) -> comma for pause
    .replace(/\s+-\s+/g, ', ')
    // Hyphen in compound words like "real-world" -> just remove it
    .replace(/(\w)-(\w)/g, '$1 $2')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    // Clean up extra spaces and punctuation
    .replace(/,\s*,/g, ',')  // Remove double commas
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text: rawText, voiceId = 'female-1', speed = 1.0 } = body;

    if (!rawText) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clean text for TTS - replace newlines with pauses, expand abbreviations, add rhythm
    let text = rawText
      .replace(/\n\n+/g, '. ')  // Double newlines become sentence breaks
      .replace(/\n/g, ' ')       // Single newlines become spaces
      .replace(/\s+/g, ' ')      // Collapse multiple spaces
      .trim();

    text = expandForSpeech(text);
    text = addConversationalRhythm(text);

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'TTS not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the voice model
    const voiceModel = DEEPGRAM_VOICE_MAP[voiceId as VoiceId] || DEEPGRAM_VOICE_MAP['female-1'];

    // Call Deepgram Aura TTS API
    // Deepgram returns linear16 PCM at 24kHz by default
    const deepgramResponse = await fetch(`${DEEPGRAM_TTS_URL}?model=${voiceModel}&encoding=linear16&sample_rate=24000`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!deepgramResponse.ok) {
      const errorText = await deepgramResponse.text();
      console.error('[TTS API] Deepgram error:', deepgramResponse.status, errorText);
      return new Response(JSON.stringify({
        error: 'TTS generation failed',
        details: errorText,
        status: deepgramResponse.status
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Deepgram returns linear16 PCM - convert to float32 for Web Audio API compatibility
    const audioBuffer = await deepgramResponse.arrayBuffer();
    const int16Data = new Int16Array(audioBuffer);
    const float32Data = new Float32Array(int16Data.length);

    // Convert int16 (-32768 to 32767) to float32 (-1.0 to 1.0)
    for (let i = 0; i < int16Data.length; i++) {
      float32Data[i] = int16Data[i] / 32768.0;
    }

    // Return as float32 PCM (matching what the client expects)
    const headers = new Headers({
      'Content-Type': 'audio/pcm',
      'X-Audio-Sample-Rate': '24000',
      'X-Audio-Channels': '1',
      'X-Audio-Encoding': 'pcm_f32le',
      'Cache-Control': 'no-cache',
    });

    return new Response(float32Data.buffer, { headers });
  } catch (error) {
    console.error('[TTS API] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
