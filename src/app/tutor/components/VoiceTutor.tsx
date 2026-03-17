'use client';

/**
 * Voice Tutor Component
 *
 * Main component for voice-based tutoring sessions.
 * Integrates audio capture, transcription, AI response, and audio playback.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, Square, LogOut } from 'lucide-react';
import { useTranscription } from '../hooks/useTranscription';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import type { VoiceId } from '@/lib/tutor/types';
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { InteractionType } from '@/hooks/useDemoTracking';

export type VoiceTutorState =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'processing'
  | 'speaking'
  | 'error';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VoiceTutorProps {
  subject: string;
  topic: string;
  level: string;
  studentName?: string;
  sessionGoal: SessionGoal;
  voiceId: VoiceId;
  externalConversationHistory?: ConversationMessage[];
  externalTranscript?: TranscriptEntry[];
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  onWhiteboardCommand: (commands: WhiteboardCommand[]) => void;
  onConversationHistoryUpdate?: (history: ConversationMessage[]) => void;
  onStateChange?: (state: VoiceTutorState) => void;
  onError?: (error: Error) => void;
  onEndSession?: () => void;
  onTrackInteraction?: (type: InteractionType, content?: string, metadata?: Record<string, unknown>, role?: 'student' | 'tutor') => void;
}

export function VoiceTutor({
  subject,
  topic,
  level,
  studentName,
  sessionGoal,
  voiceId,
  externalConversationHistory,
  externalTranscript,
  onTranscriptUpdate,
  onWhiteboardCommand,
  onConversationHistoryUpdate,
  onStateChange,
  onError,
  onEndSession,
  onTrackInteraction,
}: VoiceTutorProps) {
  const [state, setState] = useState<VoiceTutorState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversationHistoryRef = useRef<ConversationMessage[]>([]);
  const transcriptEntriesRef = useRef<TranscriptEntry[]>([]);
  const isInitializedRef = useRef(false);
  const initAbortControllerRef = useRef<AbortController | null>(null);
  const lastExternalHistoryLengthRef = useRef(0);
  const isProcessingRef = useRef(false);

  // Sync external conversation history when it changes (e.g., from homework upload)
  useEffect(() => {
    if (externalConversationHistory && externalConversationHistory.length > lastExternalHistoryLengthRef.current) {
      console.log('[VoiceTutor] Syncing external conversation history:', externalConversationHistory.length, 'items');
      conversationHistoryRef.current = [...externalConversationHistory];
      lastExternalHistoryLengthRef.current = externalConversationHistory.length;
    }
  }, [externalConversationHistory]);

  // Update state and notify parent
  const updateState = useCallback((newState: VoiceTutorState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // Transcription for STT
  const transcription = useTranscription({
    onError: (err) => {
      console.error('[VoiceTutor] Transcription error:', err);
      setError('Microphone error. Please check permissions.');
      updateState('error');
    },
  });

  // Audio playback for TTS
  const playback = useAudioPlayback({
    voiceId,
    onPlaybackStart: () => {
      updateState('speaking');
    },
    onPlaybackEnd: () => {
      updateState('idle');
    },
    onError: (err) => {
      console.error('[VoiceTutor] Playback error:', err);
      setError('Failed to play audio. Text shown instead.');
      updateState('idle');
    },
  });

  // Set voice when it changes
  useEffect(() => {
    playback.setVoice(voiceId);
  }, [voiceId, playback]);

  // Sync external transcript and speak new tutor responses (e.g., from homework upload)
  useEffect(() => {
    if (externalTranscript && externalTranscript.length > transcriptEntriesRef.current.length) {
      console.log('[VoiceTutor] Syncing external transcript:', externalTranscript.length, 'entries');

      // Find new entries that we haven't processed yet
      const newEntries = externalTranscript.slice(transcriptEntriesRef.current.length);
      transcriptEntriesRef.current = [...externalTranscript];

      // Speak any new tutor responses (e.g., from homework upload)
      const newTutorEntries = newEntries.filter(entry => entry.role === 'tutor');
      if (newTutorEntries.length > 0 && !isMuted && state === 'idle') {
        // Speak the last tutor response
        const latestTutorEntry = newTutorEntries[newTutorEntries.length - 1];
        console.log('[VoiceTutor] Speaking external tutor response');
        playback.speak(latestTutorEntry.text);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalTranscript]);

  // Handle student message
  const handleStudentMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      updateState('idle');
      return;
    }

    // Prevent concurrent API calls — if already processing, drop this message
    if (isProcessingRef.current) {
      console.log('[VoiceTutor] Dropping message, already processing');
      updateState('idle');
      return;
    }
    isProcessingRef.current = true;

    updateState('processing');

    // Add student message to transcript
    const studentEntry: TranscriptEntry = {
      id: `user-${Date.now()}`,
      timestamp: new Date(),
      role: 'student',
      text: message,
    };
    transcriptEntriesRef.current = [...transcriptEntriesRef.current, studentEntry];
    onTranscriptUpdate(transcriptEntriesRef.current);
    onTrackInteraction?.('message', message, undefined, 'student');

    try {
      // Send to tutor API
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistoryRef.current,
          subject,
          topic,
          level,
          studentName,
          sessionGoal,
        }),
      });

      const data = await response.json();

      // Handle API errors gracefully - show friendly message, don't throw
      if (!response.ok || data.error) {
        const errorMsg = data.error || 'Unable to get a response.';
        setError(errorMsg);
        updateState('error');
        return;
      }

      // Update conversation history
      conversationHistoryRef.current = [
        ...conversationHistoryRef.current,
        { role: 'user', content: message },
        { role: 'assistant', content: data.rawText || data.text },
      ];
      lastExternalHistoryLengthRef.current = conversationHistoryRef.current.length;

      // Notify parent of history update
      onConversationHistoryUpdate?.(conversationHistoryRef.current);

      // Add tutor response to transcript
      const tutorEntry: TranscriptEntry = {
        id: `tutor-${Date.now()}`,
        timestamp: new Date(),
        role: 'tutor',
        text: data.text,
        whiteboardCommands: data.whiteboardCommands,
        pedagogicalIntent: data.pedagogicalIntent,
      };
      transcriptEntriesRef.current = [...transcriptEntriesRef.current, tutorEntry];
      onTranscriptUpdate(transcriptEntriesRef.current);
      onTrackInteraction?.('message', data.text, data.pedagogicalIntent ? { pedagogicalIntent: data.pedagogicalIntent } : undefined, 'tutor');

      // Send whiteboard commands
      if (data.whiteboardCommands?.length > 0) {
        onWhiteboardCommand(data.whiteboardCommands);
        data.whiteboardCommands.forEach((cmd: WhiteboardCommand) => {
          onTrackInteraction?.('tool_use', 'whiteboard', { ...cmd });
        });
      }

      // Speak the response
      isProcessingRef.current = false;
      if (!isMuted) {
        await playback.speak(data.text);
      } else {
        updateState('idle');
      }
    } catch (err) {
      isProcessingRef.current = false;
      console.error('[VoiceTutor] Error:', err);
      setError('Failed to get response. Please try again.');
      updateState('error');
      onError?.(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [
    subject,
    topic,
    level,
    studentName,
    sessionGoal,
    isMuted,
    playback,
    onTranscriptUpdate,
    onWhiteboardCommand,
    onConversationHistoryUpdate,
    onError,
    onTrackInteraction,
    updateState,
  ]);

  // Start listening
  const startListening = useCallback(async () => {
    setError(null);
    updateState('listening');
    await transcription.startListening();
  }, [transcription, updateState]);

  // Stop listening and process
  const stopListeningAndProcess = useCallback(async () => {
    updateState('transcribing');
    const transcript = await transcription.stopListening();
    if (transcript) {
      handleStudentMessage(transcript);
    } else {
      setError('No speech detected. Try again.');
      updateState('idle');
    }
  }, [transcription, handleStudentMessage, updateState]);

  // Toggle listening
  const toggleListening = useCallback(async () => {
    if (state === 'listening') {
      await stopListeningAndProcess();
    } else if (state === 'idle' || state === 'error') {
      setError(null);
      await startListening();
    } else if (state === 'speaking') {
      // Interrupt speech and start listening
      playback.stop();
      await startListening();
    }
  }, [state, startListening, stopListeningAndProcess, playback]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (state === 'speaking') {
      playback.stop();
      updateState('idle');
    }
  }, [state, playback, updateState]);

  // Initialize with greeting
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // AbortController prevents duplicate API calls on React StrictMode remount
    const abortController = new AbortController();
    initAbortControllerRef.current = abortController;

    const initialize = async () => {
      updateState('processing');

      // Context-aware greeting based on session goal
      const greetingMessage = getInitialGreetingPrompt(sessionGoal, topic);

      try {
        // Get initial greeting from tutor
        const response = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: greetingMessage,
            conversationHistory: [],
            subject,
            topic,
            level,
            studentName,
            sessionGoal,
          }),
          signal: abortController.signal,
        });

        // If aborted during fetch, stop here
        if (abortController.signal.aborted) return;

        const data = await response.json();

        // If aborted while parsing, stop here
        if (abortController.signal.aborted) return;

        // Handle API errors gracefully - show friendly message, don't throw
        if (!response.ok || data.error) {
          const errorMsg = data.error || 'Unable to start the tutor session.';
          setError(errorMsg);
          updateState('error');
          return;
        }

        // Initialize conversation history
        conversationHistoryRef.current = [
          { role: 'user', content: greetingMessage },
          { role: 'assistant', content: data.rawText || data.text },
        ];
        lastExternalHistoryLengthRef.current = conversationHistoryRef.current.length;

        // Notify parent of history
        onConversationHistoryUpdate?.(conversationHistoryRef.current);

        // Add greeting to transcript
        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
          whiteboardCommands: data.whiteboardCommands,
        };
        transcriptEntriesRef.current = [tutorEntry];
        onTranscriptUpdate(transcriptEntriesRef.current);

        // Speak greeting (or just show it if muted)
        if (!abortController.signal.aborted && !isMuted) {
          await playback.speak(data.text);
        } else if (!abortController.signal.aborted) {
          updateState('idle');
        }
      } catch (err) {
        // Ignore AbortError — expected on StrictMode cleanup
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[VoiceTutor] Initialization error:', err);
        setError('Unable to connect to the tutor. Please check your connection and try again.');
        updateState('error');
      }
    };

    initialize();

    // Cleanup: abort pending init fetch on unmount (React StrictMode remount safety)
    return () => {
      abortController.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, topic, level, studentName, sessionGoal]);

  // Get state-specific UI
  const getStateUI = () => {
    switch (state) {
      case 'listening':
        return {
          icon: <Square className="w-6 h-6" />,
          text: 'Click to send',
          subtext: 'Recording...',
          color: 'bg-red-500',
          pulse: true,
        };
      case 'transcribing':
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin" />,
          text: 'Transcribing...',
          subtext: '',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin" />,
          text: 'Thinking...',
          subtext: '',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-8 h-8" />,
          text: 'Tutor speaking',
          subtext: 'Click to interrupt',
          color: 'bg-green-500',
          pulse: true,
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8" />,
          text: 'Error',
          subtext: 'Click to try again',
          color: 'bg-red-600',
          pulse: false,
        };
      default:
        return {
          icon: <Mic className="w-8 h-8" />,
          text: 'Click to speak',
          subtext: '',
          color: 'bg-blue-500',
          pulse: false,
        };
    }
  };

  const stateUI = getStateUI();
  const isDisabled = state === 'processing' || state === 'transcribing';

  return (
    <div className="voice-tutor flex flex-col items-center gap-4 py-4">
      {/* Main microphone button */}
      <button
        onClick={toggleListening}
        disabled={isDisabled}
        className={`
          relative w-20 h-20 rounded-full text-white
          transition-all duration-200 flex items-center justify-center
          ${stateUI.color}
          ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          ${stateUI.pulse ? 'animate-pulse' : ''}
        `}
      >
        {stateUI.icon}

        {/* Audio level indicator */}
        {state === 'listening' && (
          <div
            className="absolute inset-0 rounded-full border-4 border-white/50"
            style={{
              transform: `scale(${1 + transcription.audioLevel})`,
              transition: 'transform 0.1s ease-out',
            }}
          />
        )}
      </button>

      {/* State text */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">{stateUI.text}</p>
        {stateUI.subtext && (
          <p className="text-xs text-gray-500">{stateUI.subtext}</p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 max-w-xs text-center bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm
            ${isMuted ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4" />
              Unmute tutor
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              Mute tutor
            </>
          )}
        </button>

        {/* End Session button */}
        {onEndSession && (
          <button
            onClick={onEndSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        )}
      </div>
    </div>
  );
}
