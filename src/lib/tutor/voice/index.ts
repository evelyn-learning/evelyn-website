/**
 * Voice Pipeline Exports
 */

// Deepgram STT
export {
  createDeepgramConnection,
  transcribeAudio,
  isDeepgramConfigured,
  getDeepgramApiKey,
  type TranscriptionResult,
  type DeepgramConfig,
} from './deepgram-stt';

// Cartesia TTS
export {
  streamTTS,
  generateTTS,
  streamTTSHttp,
  getCartesiaVoiceId,
  getVoiceConfig,
  isCartesiaConfigured,
  getCartesiaApiKey,
  type CartesiaConfig,
  type TTSRequest,
  type TTSStreamCallbacks,
} from './cartesia-tts';

// Voice Controller
export {
  VoiceController,
  createVoiceController,
  type VoiceState,
  type VoiceControllerConfig,
} from './voice-controller';
