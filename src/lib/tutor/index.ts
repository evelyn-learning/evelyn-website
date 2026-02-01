/**
 * AI Voice Tutor - Main Exports
 */

// Types
export * from './types';

// Voice Pipeline
export {
  createDeepgramConnection,
  transcribeAudio,
  isDeepgramConfigured,
  streamTTSHttp,
  isCartesiaConfigured,
  getVoiceConfig,
  VoiceController,
  createVoiceController,
  type VoiceState,
} from './voice';

// Engine
export { TutorEngine, type TutorEngineCallbacks } from './engine/tutor-engine';

// AI
export { buildSystemPrompt, type SystemPromptContext } from './ai/system-prompt-builder';
export { parseWhiteboardCommands, cleanTextForTTS, type ParsedResponse } from './ai/response-parser';

// Socket
export {
  initializeSocketServer,
  getActiveSessionCount,
  cleanupAllSessions,
} from './socket/socket-server';
