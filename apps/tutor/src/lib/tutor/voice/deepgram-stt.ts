/**
 * Deepgram Speech-to-Text Integration
 *
 * Handles real-time transcription of student speech using Deepgram Nova-2.
 * Supports streaming transcription with partial and final results.
 */

import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export interface TranscriptionResult {
  text: string;
  isFinal: boolean;
  confidence: number;
  words?: {
    word: string;
    start: number;
    end: number;
    confidence: number;
  }[];
}

export interface DeepgramConfig {
  apiKey: string;
  model?: string;
  language?: string;
  punctuate?: boolean;
  interimResults?: boolean;
  utteranceEndMs?: number;
  vadEvents?: boolean;
}

const DEFAULT_CONFIG: Partial<DeepgramConfig> = {
  model: 'nova-2',
  language: 'en-US',
  punctuate: true,
  interimResults: true,
  utteranceEndMs: 1000, // 1 second of silence to end utterance
  vadEvents: true,
};

/**
 * Create a Deepgram live transcription connection
 */
export function createDeepgramConnection(
  config: DeepgramConfig,
  callbacks: {
    onTranscript: (result: TranscriptionResult) => void;
    onError: (error: Error) => void;
    onClose: () => void;
    onOpen?: () => void;
  }
) {
  const deepgram = createClient(config.apiKey);

  const connection = deepgram.listen.live({
    model: config.model || DEFAULT_CONFIG.model,
    language: config.language || DEFAULT_CONFIG.language,
    punctuate: config.punctuate ?? DEFAULT_CONFIG.punctuate,
    interim_results: config.interimResults ?? DEFAULT_CONFIG.interimResults,
    utterance_end_ms: config.utteranceEndMs || DEFAULT_CONFIG.utteranceEndMs,
    vad_events: config.vadEvents ?? DEFAULT_CONFIG.vadEvents,
    smart_format: true,
    encoding: 'linear16',
    sample_rate: 16000,
    channels: 1,
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log('[Deepgram] Connection opened');
    callbacks.onOpen?.();
  });

  connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    const transcript = data.channel?.alternatives?.[0];
    if (transcript && transcript.transcript) {
      callbacks.onTranscript({
        text: transcript.transcript,
        isFinal: data.is_final ?? false,
        confidence: transcript.confidence ?? 0,
        words: transcript.words?.map((w: { word: string; start: number; end: number; confidence: number }) => ({
          word: w.word,
          start: w.start,
          end: w.end,
          confidence: w.confidence,
        })),
      });
    }
  });

  connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
    // This fires when VAD detects end of speech
    // Can be used to trigger processing
  });

  connection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error('[Deepgram] Error:', error);
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  });

  connection.on(LiveTranscriptionEvents.Close, () => {
    console.log('[Deepgram] Connection closed');
    callbacks.onClose();
  });

  return {
    /**
     * Send audio data to Deepgram
     * @param audioData - Raw audio data (PCM16, 16kHz, mono)
     */
    send: (audioData: ArrayBuffer | Buffer) => {
      if (connection.getReadyState() === 1) {
        // WebSocket.OPEN
        // Convert Buffer to ArrayBuffer if needed
        const data = audioData instanceof ArrayBuffer
          ? audioData
          : new Uint8Array(audioData).buffer;
        connection.send(data);
      }
    },

    /**
     * Close the connection
     */
    close: () => {
      connection.finish();
    },

    /**
     * Keep the connection alive
     */
    keepAlive: () => {
      connection.keepAlive();
    },

    /**
     * Get connection state
     */
    getState: () => connection.getReadyState(),
  };
}

/**
 * Server-side transcription using Deepgram REST API
 * Use this as a fallback when WebSocket is not available
 */
export async function transcribeAudio(
  audioData: Buffer,
  config: DeepgramConfig
): Promise<TranscriptionResult> {
  const deepgram = createClient(config.apiKey);

  const response = await deepgram.listen.prerecorded.transcribeFile(audioData, {
    model: config.model || 'nova-2',
    language: config.language || 'en-US',
    punctuate: true,
    smart_format: true,
  });

  const transcript = response.result?.results?.channels?.[0]?.alternatives?.[0];

  return {
    text: transcript?.transcript || '',
    isFinal: true,
    confidence: transcript?.confidence || 0,
    words: transcript?.words?.map((w) => ({
      word: w.word || '',
      start: w.start || 0,
      end: w.end || 0,
      confidence: w.confidence || 0,
    })),
  };
}

/**
 * Check if Deepgram API key is configured
 */
export function isDeepgramConfigured(): boolean {
  return !!process.env.DEEPGRAM_API_KEY;
}

/**
 * Get Deepgram API key from environment
 */
export function getDeepgramApiKey(): string {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPGRAM_API_KEY environment variable is not set');
  }
  return apiKey;
}
