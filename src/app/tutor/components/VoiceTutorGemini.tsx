'use client';

/**
 * Voice Tutor Gemini Component
 *
 * Uses Google Gemini 2.0 Flash Multimodal Live API for voice conversations.
 * Same interface as VoiceTutorRealtime — a drop-in replacement
 * selectable via NEXT_PUBLIC_TUTOR_VOICE_ENGINE=gemini-live.
 *
 * Reuses the same whiteboard intent detection, transcript filtering,
 * and validation pass logic from VoiceTutorRealtime.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, Square, Wifi, WifiOff, LogOut } from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { buildSystemPrompt, getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { loadModuleByParams } from '@/lib/knowledge/registry';
import { validateGeometryCommand, type GeometryCommand } from '@/lib/tutor/whiteboard/geometry-validator';
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { InteractionType } from '@/hooks/useDemoTracking';
import type { RealtimeState, RealtimeUsage } from '../hooks/useOpenAIRealtime';
import type { OpenAIVoice } from '../hooks/useOpenAIRealtime';

export interface GeminiRealtimeHandle {
  sendTextMessage: (text: string) => void;
}

interface VoiceTutorGeminiProps {
  subject: string;
  topic: string;
  level: string;
  studentName?: string;
  sessionGoal: SessionGoal;
  voice?: OpenAIVoice; // Mapped to Gemini voices internally
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  onWhiteboardCommand: (commands: WhiteboardCommand[]) => void;
  onStateChange?: (state: RealtimeState) => void;
  onError?: (error: Error) => void;
  onEndSession?: () => void;
  onTrackInteraction?: (type: InteractionType, content?: string, metadata?: Record<string, unknown>, role?: 'student' | 'tutor') => void;
  onUsageUpdate?: (usage: RealtimeUsage) => void;
  handleRef?: React.MutableRefObject<GeminiRealtimeHandle | null>;
}

export function VoiceTutorGemini({
  subject,
  topic,
  level,
  studentName,
  sessionGoal,
  voice = 'shimmer',
  onTranscriptUpdate,
  onWhiteboardCommand,
  onStateChange,
  onError,
  onEndSession,
  onTrackInteraction,
  onUsageUpdate,
  handleRef,
}: VoiceTutorGeminiProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const currentUserTextRef = useRef('');
  const currentAssistantTextRef = useRef('');

  // Transcript update handler
  const handleTranscriptUpdate = useCallback((role: 'user' | 'assistant', text: string, isFinal: boolean) => {
    if (role === 'user') {
      currentUserTextRef.current = text;
      if (isFinal && text.trim()) {
        const entry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: text.trim(),
        };
        transcriptRef.current = [...transcriptRef.current, entry];
        onTranscriptUpdate(transcriptRef.current);
        onTrackInteraction?.('message', text.trim(), undefined, 'student');
        currentUserTextRef.current = '';
      }
    } else {
      currentAssistantTextRef.current = text;
      if (isFinal && text.trim()) {
        const cleanText = text
          .replace(/```whiteboard[\s\S]*?```/g, '')
          .replace(/\[Whiteboard\][^\n]*/gi, '')
          .trim();

        const entry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: cleanText,
        };
        transcriptRef.current = [...transcriptRef.current, entry];
        onTranscriptUpdate(transcriptRef.current);
        onTrackInteraction?.('message', cleanText, undefined, 'tutor');
        currentAssistantTextRef.current = '';
      }
    }
  }, [onTranscriptUpdate, onTrackInteraction]);

  // Whiteboard command handler with geometry validation
  const handleWhiteboardCommand = useCallback((commands: WhiteboardCommand[]) => {
    const validated = commands.map(cmd =>
      cmd.action === 'showGeometry'
        ? (validateGeometryCommand(cmd as unknown as GeometryCommand) as unknown as WhiteboardCommand)
        : cmd
    );

    onWhiteboardCommand(validated);

    // Attach to transcript
    const lastIdx = transcriptRef.current.length - 1;
    if (lastIdx >= 0 && transcriptRef.current[lastIdx].role === 'tutor') {
      const existing = transcriptRef.current[lastIdx].whiteboardCommands || [];
      transcriptRef.current[lastIdx] = {
        ...transcriptRef.current[lastIdx],
        whiteboardCommands: [...existing, ...validated],
      };
      onTranscriptUpdate([...transcriptRef.current]);
    }

    validated.forEach((cmd) => {
      onTrackInteraction?.('tool_use', 'whiteboard', { command: cmd.action });
    });
  }, [onWhiteboardCommand, onTranscriptUpdate, onTrackInteraction]);

  // Response done handler
  const handleResponseDone = useCallback((usage?: RealtimeUsage) => {
    if (usage && onUsageUpdate) {
      onUsageUpdate(usage);
    }
  }, [onUsageUpdate]);

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error('[VoiceTutorGemini] Error:', error);
    onError?.(error);
  }, [onError]);

  // Build instructions ref — updated before connect
  const [instructions, setInstructions] = useState('');

  // Initialize the Gemini Live hook
  const {
    state,
    connect,
    disconnect,
    sendTextMessage,
    startListening,
    stopListening,
  } = useGeminiLive({
    instructions,
    voice: voice,
    onTranscriptUpdate: handleTranscriptUpdate,
    onWhiteboardCommand: handleWhiteboardCommand,
    onResponseDone: handleResponseDone,
    onError: handleError,
    onStateChange,
  });

  // Expose handle ref
  useEffect(() => {
    if (handleRef) {
      handleRef.current = { sendTextMessage };
    }
  }, [handleRef, sendTextMessage]);

  // Track connection state + send greeting on first connect
  const greetingSentRef = useRef(false);
  useEffect(() => {
    setIsConnected(state === 'connected' || state === 'listening' || state === 'processing' || state === 'speaking');

    // Start mic when first connected (the greeting is baked into system instruction)
    if (state === 'connected' && !greetingSentRef.current) {
      greetingSentRef.current = true;
      // Start listening — Gemini's first response will be the greeting
      setTimeout(() => startListening(), 300);
    }
  }, [state, sessionGoal, topic, sendTextMessage]);

  // Auto-connect on mount
  useEffect(() => {
    let cancelled = false;

    async function startSession() {
      try {
        let knowledgeModule = null;
        try {
          knowledgeModule = await loadModuleByParams(subject, topic, level);
        } catch {
          console.log('[VoiceTutorGemini] Module not loaded, using base prompts');
        }

        const systemPrompt = buildSystemPrompt({
          module: knowledgeModule,
          studentName,
          sessionGoal,
          timeRemainingMinutes: 30,
          currentState: 'greeting',
          subject,
          topic,
        });

        if (cancelled) return;

        // Append greeting instruction to system prompt so model speaks first
        const greetingMessage = getInitialGreetingPrompt(sessionGoal, topic);
        const fullPrompt = systemPrompt + `\n\n## IMPORTANT: Start by greeting the student\nThe student just connected. Start the conversation by responding to this as if the student said: "${greetingMessage}"\nSpeak your greeting immediately — do not wait for audio input first.`;

        setInstructions(fullPrompt);
        // Small delay to let React update the instructions state → ref
        await new Promise(r => setTimeout(r, 100));
        await connect();
      } catch (err) {
        console.error('[VoiceTutorGemini] Failed to start:', err);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    }

    startSession();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndSession = useCallback(() => {
    disconnect();
    onEndSession?.();
  }, [disconnect, onEndSession]);

  // State-based UI
  const stateLabel = state === 'listening' ? 'Listening...'
    : state === 'processing' ? 'Thinking...'
    : state === 'speaking' ? 'Speaking...'
    : state === 'connecting' ? 'Connecting to Gemini...'
    : state === 'connected' ? 'Ready'
    : state === 'error' ? 'Error'
    : 'Disconnected';

  const stateColor = state === 'listening' ? 'text-green-500'
    : state === 'processing' ? 'text-yellow-500'
    : state === 'speaking' ? 'text-blue-500'
    : state === 'error' ? 'text-red-500'
    : 'text-gray-500';

  return (
    <div className="flex items-center gap-3 px-2 py-1">
      {/* Engine badge */}
      <span className="text-[10px] font-mono text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">GEMINI</span>

      {/* Connection status */}
      <div className={`flex items-center gap-1.5 ${stateColor}`}>
        {state === 'connecting' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : state === 'error' ? (
          <AlertCircle className="w-4 h-4" />
        ) : isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">{stateLabel}</span>
      </div>

      {/* Mic toggle */}
      <button
        onClick={() => {
          if (isMuted) {
            startListening();
            setIsMuted(false);
          } else {
            stopListening();
            setIsMuted(true);
          }
        }}
        className={`p-2 rounded-full transition-colors ${
          isMuted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Audio toggle */}
      <button
        onClick={() => setIsAudioMuted(!isAudioMuted)}
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        title={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* End session */}
      <button
        onClick={handleEndSession}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors ml-auto"
      >
        <Square className="w-3 h-3" />
        End
      </button>
    </div>
  );
}
