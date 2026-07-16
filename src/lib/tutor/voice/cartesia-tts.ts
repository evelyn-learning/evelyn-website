/**
 * Cartesia Text-to-Speech Integration
 *
 * Handles streaming TTS using Cartesia Sonic for low-latency voice synthesis.
 * Supports multiple voices and interruption handling.
 *
 * DEAD MODULE (confirmed 2026-07-16, Task W4): nothing outside
 * src/lib/tutor/voice/ imports this file — its only consumers are
 * ./voice-controller.ts and ./index.ts, and no app route/page/component
 * imports either of those. The LIVE Cartesia TTS path production actually
 * uses is src/app/api/tutor/tts-cartesia/route.ts, called from
 * src/app/tutor/hooks/useOpenAIRealtime.ts's fetchTTSPromise. This module
 * already threaded a `speed` param through streamTTS/generateTTS/
 * streamTTSHttp (see TTSRequest.speed below) before that param existed on
 * the live route — left in place, unmodified, as reference/history rather
 * than deleted, since deleting it would require also touching its two
 * (equally dead) importers, out of scope for W4.
 */

import { VoiceConfig, VoiceId, AVAILABLE_VOICES } from '../types';

export interface CartesiaConfig {
  apiKey: string;
  modelId?: string;
}

export interface TTSRequest {
  text: string;
  voiceId: VoiceId;
  speed?: number;
  outputFormat?: 'raw' | 'mp3' | 'wav';
}

export interface TTSStreamCallbacks {
  onAudioChunk: (chunk: ArrayBuffer) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

// Cartesia API endpoint
const CARTESIA_API_URL = 'https://api.cartesia.ai/tts/bytes';
const CARTESIA_STREAMING_URL = 'wss://api.cartesia.ai/tts/websocket';

// Default model - sonic-3 replaces sonic/sonic-english (deprecated June 1, 2026)
const DEFAULT_MODEL = 'sonic-3';

// Voice ID mapping to Cartesia voice IDs
// These are placeholder IDs - replace with actual Cartesia voice IDs
const CARTESIA_VOICE_MAP: Record<VoiceId, string> = {
  'female-1': '79a125e8-cd45-4c13-8a67-188112f4dd22', // Warm female
  'female-2': 'a0e99841-438c-4a64-b679-ae501e7d6091', // Professional female
  'male-1': 'ee7ea9f8-c0c1-498c-9f62-dc2627e1e3e0', // Calm male
  'male-2': '41534e16-2966-4c6b-9670-111411def906', // Energetic male
};

/**
 * Get the Cartesia voice ID for a given voice preference
 */
export function getCartesiaVoiceId(voiceId: VoiceId): string {
  return CARTESIA_VOICE_MAP[voiceId] || CARTESIA_VOICE_MAP['female-1'];
}

/**
 * Get voice configuration by ID
 */
export function getVoiceConfig(voiceId: VoiceId): VoiceConfig | undefined {
  return AVAILABLE_VOICES.find((v) => v.id === voiceId);
}

/**
 * Stream TTS using Cartesia WebSocket for lowest latency
 */
export async function streamTTS(
  config: CartesiaConfig,
  request: TTSRequest,
  callbacks: TTSStreamCallbacks,
  abortSignal?: AbortSignal
): Promise<void> {
  const ws = new WebSocket(`${CARTESIA_STREAMING_URL}?api_key=${config.apiKey}`);

  let aborted = false;

  if (abortSignal) {
    abortSignal.addEventListener('abort', () => {
      aborted = true;
      ws.close();
    });
  }

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      // Send TTS request
      ws.send(
        JSON.stringify({
          model_id: config.modelId || DEFAULT_MODEL,
          voice: {
            mode: 'id',
            id: getCartesiaVoiceId(request.voiceId),
          },
          transcript: request.text,
          output_format: {
            container: 'raw',
            encoding: 'pcm_f32le',
            sample_rate: 24000,
          },
          language: 'en',
          ...(request.speed && { speed: request.speed }),
        })
      );
    };

    ws.onmessage = async (event) => {
      if (aborted) return;

      try {
        // Handle both binary audio data and JSON messages
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          callbacks.onAudioChunk(arrayBuffer);
        } else if (typeof event.data === 'string') {
          const message = JSON.parse(event.data);
          if (message.type === 'done') {
            callbacks.onComplete();
            ws.close();
            resolve();
          } else if (message.type === 'error') {
            callbacks.onError(new Error(message.error || 'TTS error'));
            ws.close();
            reject(new Error(message.error));
          }
        }
      } catch (error) {
        console.error('[Cartesia] Error processing message:', error);
      }
    };

    ws.onerror = (error) => {
      if (!aborted) {
        callbacks.onError(new Error('WebSocket error'));
        reject(error);
      }
    };

    ws.onclose = () => {
      if (!aborted) {
        callbacks.onComplete();
        resolve();
      }
    };
  });
}

/**
 * Generate TTS using Cartesia REST API (non-streaming fallback)
 */
export async function generateTTS(
  config: CartesiaConfig,
  request: TTSRequest
): Promise<ArrayBuffer> {
  const response = await fetch(CARTESIA_API_URL, {
    method: 'POST',
    headers: {
      'X-API-Key': config.apiKey,
      'Cartesia-Version': '2024-06-10',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: config.modelId || DEFAULT_MODEL,
      voice: {
        mode: 'id',
        id: getCartesiaVoiceId(request.voiceId),
      },
      transcript: request.text,
      output_format: {
        container: request.outputFormat || 'raw',
        encoding: 'pcm_f32le',
        sample_rate: 24000,
      },
      language: 'en',
      ...(request.speed && { speed: request.speed }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cartesia TTS failed: ${response.status} - ${error}`);
  }

  return response.arrayBuffer();
}

/**
 * Stream TTS using HTTP streaming (works in serverless environments)
 */
export async function* streamTTSHttp(
  config: CartesiaConfig,
  request: TTSRequest,
  abortSignal?: AbortSignal
): AsyncGenerator<ArrayBuffer, void, unknown> {
  const response = await fetch(CARTESIA_API_URL, {
    method: 'POST',
    headers: {
      'X-API-Key': config.apiKey,
      'Cartesia-Version': '2024-06-10',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: config.modelId || DEFAULT_MODEL,
      voice: {
        mode: 'id',
        id: getCartesiaVoiceId(request.voiceId),
      },
      transcript: request.text,
      output_format: {
        container: 'raw',
        encoding: 'pcm_f32le',
        sample_rate: 24000,
      },
      language: 'en',
      ...(request.speed && { speed: request.speed }),
    }),
    signal: abortSignal,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cartesia TTS failed: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value.buffer;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Check if Cartesia API key is configured
 */
export function isCartesiaConfigured(): boolean {
  return !!process.env.CARTESIA_API_KEY;
}

/**
 * Get Cartesia API key from environment
 */
export function getCartesiaApiKey(): string {
  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey) {
    throw new Error('CARTESIA_API_KEY environment variable is not set');
  }
  return apiKey;
}
