'use client';

/**
 * useTutorSession Hook
 *
 * Manages the tutoring session including WebSocket connection,
 * voice state, and conversation history.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  TutoringSessionConfig,
  SessionState,
  SessionSummary,
  TranscriptEntry,
  VoiceId,
} from '@/lib/tutor/types';
import type { WhiteboardCommand, Problem } from '@core/knowledge/types';

// Session store using Zustand
interface TutorSessionState {
  sessionId: string | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'active' | 'ended' | 'error';
  sessionState: SessionState;
  transcript: TranscriptEntry[];
  currentTranscript: string; // Partial transcript while speaking
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  voiceId: VoiceId;
  useTextMode: boolean;
  whiteboardCommands: WhiteboardCommand[];
  currentProblem: Problem | null;
  error: string | null;

  // Actions
  setSessionId: (id: string | null) => void;
  setStatus: (status: TutorSessionState['status']) => void;
  setSessionState: (state: SessionState) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  setCurrentTranscript: (text: string) => void;
  setIsListening: (value: boolean) => void;
  setIsSpeaking: (value: boolean) => void;
  setIsProcessing: (value: boolean) => void;
  setVoiceId: (id: VoiceId) => void;
  setUseTextMode: (value: boolean) => void;
  addWhiteboardCommand: (command: WhiteboardCommand) => void;
  clearWhiteboard: () => void;
  setCurrentProblem: (problem: Problem | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTutorStore = create<TutorSessionState>((set) => ({
  sessionId: null,
  status: 'disconnected',
  sessionState: 'idle',
  transcript: [],
  currentTranscript: '',
  isListening: false,
  isSpeaking: false,
  isProcessing: false,
  voiceId: 'female-1',
  useTextMode: false,
  whiteboardCommands: [],
  currentProblem: null,
  error: null,

  setSessionId: (id) => set({ sessionId: id }),
  setStatus: (status) => set({ status }),
  setSessionState: (sessionState) => set({ sessionState }),
  addTranscriptEntry: (entry) =>
    set((state) => ({ transcript: [...state.transcript, entry] })),
  setCurrentTranscript: (text) => set({ currentTranscript: text }),
  setIsListening: (value) => set({ isListening: value }),
  setIsSpeaking: (value) => set({ isSpeaking: value }),
  setIsProcessing: (value) => set({ isProcessing: value }),
  setVoiceId: (id) => set({ voiceId: id }),
  setUseTextMode: (value) => set({ useTextMode: value }),
  addWhiteboardCommand: (command) =>
    set((state) => ({ whiteboardCommands: [...state.whiteboardCommands, command] })),
  clearWhiteboard: () => set({ whiteboardCommands: [] }),
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      sessionId: null,
      status: 'disconnected',
      sessionState: 'idle',
      transcript: [],
      currentTranscript: '',
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      whiteboardCommands: [],
      currentProblem: null,
      error: null,
    }),
}));

export interface UseTutorSessionOptions {
  serverUrl?: string;
  onSessionEnd?: (summary: SessionSummary) => void;
  onError?: (error: string) => void;
}

export interface UseTutorSessionReturn {
  // State
  sessionId: string | null;
  status: TutorSessionState['status'];
  sessionState: SessionState;
  transcript: TranscriptEntry[];
  currentTranscript: string;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  voiceId: VoiceId;
  useTextMode: boolean;
  whiteboardCommands: WhiteboardCommand[];
  currentProblem: Problem | null;
  error: string | null;

  // Actions
  connect: () => void;
  disconnect: () => void;
  startSession: (config: TutoringSessionConfig) => void;
  endSession: () => void;
  sendMessage: (text: string) => void;
  sendAudioChunk: (chunk: ArrayBuffer, isFinal: boolean) => void;
  cancelAudio: () => void;
  submitAnswer: (problemId: string, answer: string) => void;
  requestHint: (problemId: string) => void;
  skipProblem: (problemId: string) => void;
  uploadHomework: (imageData: string, mimeType: string) => void;
  setVoicePreference: (voiceId: VoiceId) => void;
  toggleTextMode: () => void;
  clearError: () => void;
}

export function useTutorSession(
  options: UseTutorSessionOptions = {}
): UseTutorSessionReturn {
  const { serverUrl = '', onSessionEnd, onError } = options;

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  const store = useTutorStore();

  // Play queued audio
  const playNextAudio = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

    isPlayingRef.current = true;
    store.setIsSpeaking(true);

    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift();
      if (audioData) {
        // Play audio using Web Audio API
        try {
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(audioData.slice(0));
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);

          await new Promise<void>((resolve) => {
            source.onended = () => resolve();
            source.start();
          });
        } catch (err) {
          console.error('Error playing audio:', err);
        }
      }
    }

    isPlayingRef.current = false;
    store.setIsSpeaking(false);
  }, [store]);

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    store.setStatus('connecting');

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('[TutorSession] Connected to server');
      store.setStatus('connected');
      store.setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('[TutorSession] Disconnected:', reason);
      store.setStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('[TutorSession] Connection error:', error);
      store.setStatus('error');
      store.setError('Failed to connect to tutor server');
      onError?.('Failed to connect to tutor server');
    });

    // Session events
    socket.on('session:started', ({ sessionId, greeting }) => {
      console.log('[TutorSession] Session started:', sessionId);
      store.setSessionId(sessionId);
      store.setStatus('active');
      store.addTranscriptEntry({
        id: Date.now().toString(),
        timestamp: new Date(),
        role: 'tutor',
        text: greeting,
      });
    });

    socket.on('session:ended', ({ summary }) => {
      console.log('[TutorSession] Session ended');
      store.setStatus('ended');
      onSessionEnd?.(summary);
    });

    socket.on('session:error', ({ error, recoverable }) => {
      console.error('[TutorSession] Session error:', error);
      if (!recoverable) {
        store.setStatus('error');
      }
      store.setError(error);
      onError?.(error);
    });

    socket.on('session:stateChange', ({ state }) => {
      store.setSessionState(state);
    });

    // Transcript events
    socket.on('transcript:partial', ({ text }) => {
      store.setCurrentTranscript(text);
    });

    socket.on('transcript:final', ({ text }) => {
      store.setCurrentTranscript('');
      store.addTranscriptEntry({
        id: Date.now().toString(),
        timestamp: new Date(),
        role: 'student',
        text,
      });
    });

    // Tutor response events
    socket.on('tutor:thinking', () => {
      store.setIsProcessing(true);
    });

    socket.on('tutor:message', ({ text, whiteboardCommands }) => {
      store.setIsProcessing(false);
      store.addTranscriptEntry({
        id: Date.now().toString(),
        timestamp: new Date(),
        role: 'tutor',
        text,
        whiteboardCommands,
      });

      if (whiteboardCommands) {
        for (const command of whiteboardCommands) {
          store.addWhiteboardCommand(command);
        }
      }
    });

    // Audio events
    socket.on('audio:start', () => {
      audioQueueRef.current = [];
      store.setIsSpeaking(true);
    });

    socket.on('audio:chunk', ({ chunk }) => {
      audioQueueRef.current.push(chunk);
      playNextAudio();
    });

    socket.on('audio:end', () => {
      // Audio queue will be processed
    });

    // Mode events
    socket.on('mode:textFallback', ({ reason }) => {
      console.log('[TutorSession] Falling back to text mode:', reason);
      store.setUseTextMode(true);
    });

    socket.on('mode:voiceRestored', () => {
      console.log('[TutorSession] Voice mode restored');
      store.setUseTextMode(false);
    });

    // Whiteboard events
    socket.on('whiteboard:command', ({ command }) => {
      store.addWhiteboardCommand(command);
    });

    socket.on('whiteboard:clear', () => {
      store.clearWhiteboard();
    });

    // Problem events
    socket.on('problem:show', ({ problem }) => {
      store.setCurrentProblem(problem);
    });

    socket.on('problem:feedback', ({ correct, feedback, whiteboardCommands }) => {
      store.addTranscriptEntry({
        id: Date.now().toString(),
        timestamp: new Date(),
        role: 'tutor',
        text: feedback,
        whiteboardCommands,
      });

      if (whiteboardCommands) {
        for (const command of whiteboardCommands) {
          store.addWhiteboardCommand(command);
        }
      }
    });

    socket.on('problem:hint', ({ hint, whiteboardCommand }) => {
      store.addTranscriptEntry({
        id: Date.now().toString(),
        timestamp: new Date(),
        role: 'tutor',
        text: hint,
        whiteboardCommands: whiteboardCommand ? [whiteboardCommand] : undefined,
      });

      if (whiteboardCommand) {
        store.addWhiteboardCommand(whiteboardCommand);
      }
    });

    // Homework events
    socket.on('homework:extracted', ({ problems }) => {
      console.log('[TutorSession] Problems extracted:', problems.length);
      if (problems.length > 0) {
        store.setCurrentProblem(problems[0]);
      }
    });

    socket.on('homework:error', ({ error }) => {
      store.setError(error);
    });

    socketRef.current = socket;
  }, [serverUrl, store, onSessionEnd, onError, playNextAudio]);

  // Disconnect from server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    store.reset();
  }, [store]);

  // Start a tutoring session
  const startSession = useCallback(
    (config: TutoringSessionConfig) => {
      if (!socketRef.current?.connected) {
        console.error('[TutorSession] Not connected');
        return;
      }

      // Add voice preference to config
      const fullConfig: TutoringSessionConfig = {
        ...config,
        voicePreference: {
          voiceId: store.voiceId,
        },
      };

      socketRef.current.emit('session:start', fullConfig);
    },
    [store.voiceId]
  );

  // End the current session
  const endSession = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('session:end');
    }
  }, []);

  // Send a text message
  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current?.connected) return;

    store.addTranscriptEntry({
      id: Date.now().toString(),
      timestamp: new Date(),
      role: 'student',
      text,
    });

    socketRef.current.emit('text:message', { text });
  }, [store]);

  // Send audio chunk
  const sendAudioChunk = useCallback((chunk: ArrayBuffer, isFinal: boolean) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('audio:chunk', { chunk, isFinal });
  }, []);

  // Cancel current audio playback
  const cancelAudio = useCallback(() => {
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    store.setIsSpeaking(false);

    if (socketRef.current?.connected) {
      socketRef.current.emit('audio:cancel');
    }
  }, [store]);

  // Submit answer to problem
  const submitAnswer = useCallback((problemId: string, answer: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('problem:submit', { problemId, answer });
  }, []);

  // Request hint
  const requestHint = useCallback((problemId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('problem:requestHint', { problemId });
  }, []);

  // Skip problem
  const skipProblem = useCallback((problemId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('problem:skip', { problemId });
  }, []);

  // Upload homework image
  const uploadHomework = useCallback((imageData: string, mimeType: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('homework:upload', { imageData, mimeType });
  }, []);

  // Set voice preference
  const setVoicePreference = useCallback(
    (voiceId: VoiceId) => {
      store.setVoiceId(voiceId);
    },
    [store]
  );

  // Toggle text mode
  const toggleTextMode = useCallback(() => {
    store.setUseTextMode(!store.useTextMode);
  }, [store]);

  // Clear error
  const clearError = useCallback(() => {
    store.setError(null);
  }, [store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    sessionId: store.sessionId,
    status: store.status,
    sessionState: store.sessionState,
    transcript: store.transcript,
    currentTranscript: store.currentTranscript,
    isListening: store.isListening,
    isSpeaking: store.isSpeaking,
    isProcessing: store.isProcessing,
    voiceId: store.voiceId,
    useTextMode: store.useTextMode,
    whiteboardCommands: store.whiteboardCommands,
    currentProblem: store.currentProblem,
    error: store.error,

    // Actions
    connect,
    disconnect,
    startSession,
    endSession,
    sendMessage,
    sendAudioChunk,
    cancelAudio,
    submitAnswer,
    requestHint,
    skipProblem,
    uploadHomework,
    setVoicePreference,
    toggleTextMode,
    clearError,
  };
}
