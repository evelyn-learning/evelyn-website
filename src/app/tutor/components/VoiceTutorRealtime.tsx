'use client';

/**
 * Voice Tutor Realtime Component
 *
 * Uses OpenAI's Realtime API for low-latency voice conversations.
 * This replaces the separate STT -> Claude -> TTS pipeline with
 * a single real-time WebSocket connection to OpenAI.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, Square, Wifi, WifiOff, LogOut, Pause, Play } from 'lucide-react';
import { useOpenAIRealtime, OpenAIVoice, RealtimeState } from '../hooks/useOpenAIRealtime';
import { buildSystemPrompt, getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { loadModuleByParams } from '@/lib/knowledge/registry';
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { InteractionType } from '@/hooks/useDemoTracking';

interface VoiceTutorRealtimeProps {
  subject: string;
  topic: string;
  level: string;
  studentName?: string;
  sessionGoal: SessionGoal;
  voice?: OpenAIVoice;
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  onWhiteboardCommand: (commands: WhiteboardCommand[]) => void;
  onStateChange?: (state: RealtimeState) => void;
  onError?: (error: Error) => void;
  onEndSession?: () => void;
  onTrackInteraction?: (type: InteractionType, content?: string, metadata?: Record<string, unknown>, role?: 'student' | 'tutor') => void;
}

// Map our voice IDs to OpenAI voices
const VOICE_MAP: Record<string, OpenAIVoice> = {
  'female-1': 'shimmer',  // Warm, friendly
  'female-2': 'coral',    // Professional
  'male-1': 'echo',       // Calm
  'male-2': 'alloy',      // Energetic
};

export function VoiceTutorRealtime({
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
}: VoiceTutorRealtimeProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const currentUserTextRef = useRef('');
  const currentAssistantTextRef = useRef('');

  // Handle transcript updates from the realtime API
  const handleTranscriptUpdate = useCallback((role: 'user' | 'assistant', text: string, isFinal: boolean) => {
    if (role === 'user') {
      currentUserTextRef.current = text;
      if (isFinal && text.trim()) {
        // Add finalized user message to transcript
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
        // Remove whiteboard command blocks from displayed text
        const cleanText = text.replace(/```whiteboard[\s\S]*?```/g, '').trim();

        // Add finalized assistant message to transcript
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

  // Handle whiteboard commands
  const handleWhiteboardCommand = useCallback((commands: WhiteboardCommand[]) => {
    onWhiteboardCommand(commands);
    commands.forEach((cmd) => {
      onTrackInteraction?.('tool_use', 'whiteboard', { command: cmd.action });
    });
  }, [onWhiteboardCommand, onTrackInteraction]);

  // Handle errors
  const handleError = useCallback((error: Error) => {
    console.error('[VoiceTutorRealtime] Error:', error);
    setErrorMessage(error.message);
    onError?.(error);
  }, [onError]);

  // Initialize the realtime connection
  const realtime = useOpenAIRealtime({
    instructions,
    voice,
    onTranscriptUpdate: handleTranscriptUpdate,
    onWhiteboardCommand: handleWhiteboardCommand,
    onError: handleError,
    onStateChange,
  });

  // Build system prompt / instructions on mount
  useEffect(() => {
    const buildInstructions = async () => {
      try {
        // Load knowledge module
        let knowledgeModule = null;
        try {
          knowledgeModule = await loadModuleByParams(subject, topic, level);
        } catch (e) {
          console.log('[VoiceTutorRealtime] Module not loaded, using base prompts');
        }

        // Build system prompt using existing builder
        const systemPrompt = buildSystemPrompt({
          module: knowledgeModule,
          studentName,
          sessionGoal,
          timeRemainingMinutes: 30,
          currentState: 'greeting',
        });

        // Add OpenAI-specific voice instructions
        const openAIInstructions = `${systemPrompt}

## Voice Interaction Guidelines
- You are in a real-time voice conversation. Responses are spoken aloud.
- Keep responses concise: 1-3 sentences for most exchanges.
- Use natural conversational speech patterns.
- React naturally to student responses - you'll hear them in real-time.
- If the student interrupts, acknowledge it and adjust your response.

## Visual Tools — MANDATORY USAGE

CRITICAL: You MUST use whiteboard tools proactively. Students learn visually.

### show_equation — USE EVERY TIME you mention a formula
Call show_equation EVERY TIME you mention ANY equation, formula, or mathematical relationship.
- Say "pressure equals rho g h" → MUST also call show_equation with latex "P = \\\\rho g h"
- Say "buoyant force equals weight of displaced fluid" → call show_equation with "F_b = \\\\rho_{fluid} \\\\cdot V_{disp} \\\\cdot g"
- Say "fraction submerged is density ratio" → call show_equation with "\\\\frac{V_{sub}}{V_{total}} = \\\\frac{\\\\rho_{object}}{\\\\rho_{fluid}}"
- ANY time you reference a formula in speech, you MUST also display it. No exceptions.

### show_diagram — USE for physical situations
Choose the RIGHT diagram type for the topic:
- **Buoyancy, floating, sinking, any force analysis** → type "free-body" with upward buoyant force (green) and downward weight (red)
- **Comparing velocities, relative motion, vector addition** → type "vectors"
- **Thrown objects, trajectories** → type "projectile" with initial_velocity and launch_angle
- **Circular motion** → type "circular-path"
- **Position changing over time** → type "motion"
- **Geometry/trig problems** → type "triangle" with height, base, angle

When drawing diagrams, use ACTUAL VALUES from the problem and include a descriptive title.

### show_graph
Use for position-time, velocity-time, pressure-depth, or other quantitative relationships.

RULE: If you say "let me show you" or describe any equation/diagram, you MUST call the tool. Never describe visuals without showing them.

Start by warmly greeting the student and asking how you can help them today.`;

        setInstructions(openAIInstructions);
        setIsInitialized(true);
      } catch (err) {
        console.error('[VoiceTutorRealtime] Failed to build instructions:', err);
        setErrorMessage('Failed to initialize tutor');
      }
    };

    buildInstructions();
  }, [subject, topic, level, studentName, sessionGoal]);

  // Connect when instructions are ready
  useEffect(() => {
    if (isInitialized && instructions && !realtime.isConnected && realtime.state === 'disconnected') {
      realtime.connect();
    }
  }, [isInitialized, instructions, realtime]);

  // When connected, prompt user to click to start
  // Don't auto-send greeting - let user initiate by clicking the mic
  useEffect(() => {
    if (realtime.isConnected && realtime.state === 'connected') {
      console.log('[VoiceTutorRealtime] Connected and ready - click mic to start');
    }
  }, [realtime.isConnected, realtime.state]);

  // Track if we've started the session
  const hasStartedRef = useRef(false);

  // Toggle listening
  const handleMicClick = useCallback(() => {
    if (realtime.state === 'listening') {
      realtime.stopListening();
    } else if (realtime.state === 'speaking') {
      realtime.interrupt();
      realtime.startListening();
    } else if (realtime.isConnected) {
      // On first click, send context-aware greeting to get tutor's introduction
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        const greetingMessage = getInitialGreetingPrompt(sessionGoal, topic);
        realtime.sendTextMessage(greetingMessage);
      }
      // Start listening for user's voice
      realtime.startListening();
    }
  }, [realtime, sessionGoal, topic]);

  // Pause conversation (stop mic + audio, keep connection)
  const handlePause = useCallback(() => {
    setIsPaused(true);
    realtime.pause();
  }, [realtime]);

  // Resume conversation
  const handleResume = useCallback(() => {
    setIsPaused(false);
    realtime.startListening();
  }, [realtime]);

  // Toggle mute (just controls whether we play audio)
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (realtime.state === 'speaking') {
      realtime.interrupt();
    }
  }, [realtime]);

  // Get state-specific UI
  const getStateUI = () => {
    switch (realtime.state) {
      case 'connecting':
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin" />,
          text: 'Connecting...',
          subtext: 'Establishing real-time connection',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'listening':
        return {
          icon: <Square className="w-6 h-6" />,
          text: 'Listening...',
          subtext: 'Click to stop',
          color: 'bg-red-500',
          pulse: true,
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
          subtext: 'Click to reconnect',
          color: 'bg-red-600',
          pulse: false,
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-8 h-8" />,
          text: 'Disconnected',
          subtext: 'Click to connect',
          color: 'bg-gray-500',
          pulse: false,
        };
      default:
        return {
          icon: <Mic className="w-8 h-8" />,
          text: transcriptRef.current.length === 0 ? 'Click to start' : 'Click to speak',
          subtext: 'Real-time voice mode',
          color: 'bg-blue-500',
          pulse: false,
        };
    }
  };

  const stateUI = getStateUI();
  const isDisabled = realtime.state === 'connecting' || realtime.state === 'processing';

  return (
    <div className="voice-tutor-realtime flex flex-col items-center gap-4 py-4">
      {/* Connection status badge */}
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        realtime.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {realtime.isConnected ? (
          <>
            <Wifi className="w-3 h-3" />
            Realtime
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Not connected
          </>
        )}
      </div>

      {isPaused ? (
        <>
          {/* Paused state */}
          <button
            onClick={handleResume}
            className="w-20 h-20 rounded-full bg-green-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>

          <div className="text-center">
            <p className="text-sm font-medium text-amber-600">Session Paused</p>
            <p className="text-xs text-gray-500">Click play to resume</p>
          </div>
        </>
      ) : (
        <>
          {/* Main buttons row */}
          <div className="flex items-center gap-4">
            {/* Pause button - visible when session is active */}
            {realtime.isConnected && hasStartedRef.current && (
              <button
                onClick={handlePause}
                className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all duration-200 flex items-center justify-center"
                title="Pause conversation"
              >
                <Pause className="w-6 h-6" />
              </button>
            )}

            {/* Main microphone button */}
            <button
              onClick={handleMicClick}
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
            </button>
          </div>

          {/* State text */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">{stateUI.text}</p>
            {stateUI.subtext && (
              <p className="text-xs text-gray-500">{stateUI.subtext}</p>
            )}
          </div>
        </>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="text-sm text-red-600 max-w-xs text-center bg-red-50 px-3 py-2 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        {/* Mute button */}
        {!isPaused && (
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
        )}

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

      {/* Reconnect button for error/disconnected states */}
      {(realtime.state === 'error' || realtime.state === 'disconnected') && (
        <button
          onClick={() => {
            setErrorMessage(null);
            realtime.connect();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          Reconnect
        </button>
      )}
    </div>
  );
}
