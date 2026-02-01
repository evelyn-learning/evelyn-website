/**
 * Voice Controller
 *
 * Orchestrates the voice pipeline: STT → Processing → TTS
 * Handles interruptions, buffering, and state management.
 */

import { createDeepgramConnection, getDeepgramApiKey, type TranscriptionResult } from './deepgram-stt';
import { streamTTSHttp, getCartesiaApiKey, type TTSRequest } from './cartesia-tts';
import type { VoiceId, VoicePreference } from '../types';

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted';

export interface VoiceControllerConfig {
  voicePreference: VoicePreference;
  onStateChange: (state: VoiceState) => void;
  onTranscriptPartial: (text: string) => void;
  onTranscriptFinal: (text: string, confidence: number) => void;
  onAudioChunk: (chunk: ArrayBuffer) => void;
  onSpeakingComplete: () => void;
  onError: (error: Error) => void;
}

export class VoiceController {
  private config: VoiceControllerConfig;
  private state: VoiceState = 'idle';
  private deepgramConnection: ReturnType<typeof createDeepgramConnection> | null = null;
  private currentTTSAbort: AbortController | null = null;
  private partialTranscript = '';
  private finalTranscript = '';
  private isInitialized = false;

  constructor(config: VoiceControllerConfig) {
    this.config = config;
  }

  /**
   * Initialize the voice controller
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Verify API keys are available
    try {
      getDeepgramApiKey();
      getCartesiaApiKey();
    } catch (error) {
      throw new Error('Voice API keys not configured. Check DEEPGRAM_API_KEY and CARTESIA_API_KEY.');
    }

    this.isInitialized = true;
    this.setState('idle');
  }

  /**
   * Start listening for student speech
   */
  startListening(): void {
    if (this.state === 'speaking') {
      // Interrupt current speech
      this.interrupt();
    }

    if (this.deepgramConnection) {
      // Already listening
      return;
    }

    this.setState('listening');
    this.partialTranscript = '';
    this.finalTranscript = '';

    this.deepgramConnection = createDeepgramConnection(
      { apiKey: getDeepgramApiKey() },
      {
        onTranscript: (result: TranscriptionResult) => {
          if (result.isFinal) {
            this.finalTranscript += ' ' + result.text;
            this.config.onTranscriptFinal(
              this.finalTranscript.trim(),
              result.confidence
            );
          } else {
            this.partialTranscript = result.text;
            this.config.onTranscriptPartial(
              (this.finalTranscript + ' ' + this.partialTranscript).trim()
            );
          }
        },
        onError: (error: Error) => {
          console.error('[VoiceController] Deepgram error:', error);
          this.config.onError(error);
        },
        onClose: () => {
          console.log('[VoiceController] Deepgram connection closed');
          this.deepgramConnection = null;
        },
        onOpen: () => {
          console.log('[VoiceController] Deepgram connection opened');
        },
      }
    );
  }

  /**
   * Stop listening and get final transcript
   */
  stopListening(): string {
    if (this.deepgramConnection) {
      this.deepgramConnection.close();
      this.deepgramConnection = null;
    }

    const transcript = (this.finalTranscript + ' ' + this.partialTranscript).trim();
    this.partialTranscript = '';
    this.finalTranscript = '';

    if (this.state === 'listening') {
      this.setState('idle');
    }

    return transcript;
  }

  /**
   * Send audio data to Deepgram
   */
  sendAudioChunk(audioData: ArrayBuffer): void {
    if (this.deepgramConnection) {
      this.deepgramConnection.send(audioData);
    }
  }

  /**
   * Start speaking the given text
   */
  async speak(text: string): Promise<void> {
    // Cancel any existing speech
    if (this.currentTTSAbort) {
      this.currentTTSAbort.abort();
    }

    this.currentTTSAbort = new AbortController();
    this.setState('speaking');

    try {
      const request: TTSRequest = {
        text,
        voiceId: this.config.voicePreference.voiceId,
        speed: this.config.voicePreference.speed,
      };

      for await (const chunk of streamTTSHttp(
        { apiKey: getCartesiaApiKey() },
        request,
        this.currentTTSAbort.signal
      )) {
        if (this.state !== 'speaking') {
          // Interrupted
          break;
        }
        this.config.onAudioChunk(chunk);
      }

      if (this.state === 'speaking') {
        this.setState('idle');
        this.config.onSpeakingComplete();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Intentionally aborted
        console.log('[VoiceController] TTS aborted');
      } else {
        console.error('[VoiceController] TTS error:', error);
        this.config.onError(error instanceof Error ? error : new Error(String(error)));
        this.setState('idle');
      }
    } finally {
      this.currentTTSAbort = null;
    }
  }

  /**
   * Interrupt current speech (e.g., when student starts speaking)
   */
  interrupt(): void {
    if (this.state === 'speaking' && this.currentTTSAbort) {
      this.currentTTSAbort.abort();
      this.currentTTSAbort = null;
      this.setState('interrupted');
    }
  }

  /**
   * Set the voice preference
   */
  setVoicePreference(preference: VoicePreference): void {
    this.config.voicePreference = preference;
  }

  /**
   * Get current state
   */
  getState(): VoiceState {
    return this.state;
  }

  /**
   * Get current transcript (partial + final)
   */
  getCurrentTranscript(): string {
    return (this.finalTranscript + ' ' + this.partialTranscript).trim();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopListening();
    if (this.currentTTSAbort) {
      this.currentTTSAbort.abort();
    }
    this.isInitialized = false;
  }

  private setState(state: VoiceState): void {
    if (this.state !== state) {
      this.state = state;
      this.config.onStateChange(state);
    }
  }
}

/**
 * Create a voice controller instance
 */
export function createVoiceController(config: VoiceControllerConfig): VoiceController {
  return new VoiceController(config);
}
