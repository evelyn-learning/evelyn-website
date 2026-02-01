/**
 * Tutor Hooks
 *
 * Export all hooks for the AI tutor.
 */

export { useAudioCapture, float32ToInt16, int16ToArrayBuffer } from './useAudioCapture';
export { useAudioPlayback, useUtteranceQueue } from './useAudioPlayback';
export { useTranscription } from './useTranscription';
export { useOpenAIRealtime } from './useOpenAIRealtime';

export type { AudioCaptureState, AudioCaptureResult } from './useAudioCapture';
export type { PlaybackState, AudioPlaybackResult } from './useAudioPlayback';
export type { TranscriptionResult, TranscriptionOptions } from './useTranscription';
export type { OpenAIVoice, RealtimeConfig, RealtimeState, RealtimeResult } from './useOpenAIRealtime';
