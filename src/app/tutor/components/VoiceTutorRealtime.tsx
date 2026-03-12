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

export interface RealtimeHandle {
  sendTextMessage: (text: string) => void;
}

// Words that Whisper commonly misrecognizes as inappropriate
const PROFANITY_REPLACEMENTS: Record<string, string> = {
  'condom': 'continuity',
  'condoms': 'continuity',
  'penis': 'Venus',
  'vagina': 'Regina',
  'cock': 'caulk',
  'cum': 'come',
  'shit': 'shift',
  'ass': 'gas',
  'damn': 'dam',
  'hell': 'held',
  'dick': 'thick',
  'bitch': 'pitch',
  'fuck': 'flux',
  'fucking': 'fluxing',
  'bastard': 'bustard',
  'crap': 'clap',
  'piss': 'psi',
  'whore': 'war',
  'slut': 'slot',
  'porn': 'born',
};

function filterTranscriptText(text: string): string {
  let filtered = text;
  for (const [bad, replacement] of Object.entries(PROFANITY_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${bad}\\b`, 'gi');
    filtered = filtered.replace(regex, replacement);
  }
  return filtered;
}

// Whisper hallucinations / background noise artifacts to ignore entirely.
// These are commonly produced when there's silence, background chatter, or ambient noise.
const NOISE_PATTERNS = new Set([
  'bye', 'bye bye', 'bye-bye', 'bye guys', 'bye.', 'bye bye.', 'bye-bye.',
  'goodbye', 'good bye',
  'thank you', 'thanks', 'thank you.', 'thanks.',
  'you', 'the', 'a', 'i', 'um', 'uh', 'hmm', 'huh', 'oh',
  'okay', 'ok', 'yes', 'no', 'yeah', 'yep', 'nah', 'nope',
  'so', 'and', 'but', 'like', 'well', 'right',
  'hello', 'hi', 'hey',
  // Common Whisper hallucinations on silence
  'you', 'thank you for watching', 'thanks for watching',
  'subscribe', 'like and subscribe',
  'music', 'applause', 'laughter',
]);

function isNoiseTranscript(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[.,!?;:]+/g, '').trim();
  // Exact match with known noise
  if (NOISE_PATTERNS.has(normalized)) return true;
  // Very short (1-2 words) and repeated words like "bye bye" or "hello hello"
  const words = normalized.split(/\s+/);
  if (words.length <= 3 && new Set(words).size === 1) return true;
  // Single word under 4 characters
  if (words.length === 1 && normalized.length < 4) return true;
  return false;
}

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
  handleRef?: React.MutableRefObject<RealtimeHandle | null>;
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
  handleRef,
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
        // Skip noise / background chatter that Whisper hallucinates
        if (isNoiseTranscript(text.trim())) {
          console.log('[VoiceTutorRealtime] Filtered noise transcript:', text.trim());
          currentUserTextRef.current = '';
          return;
        }
        // Filter inappropriate words from Whisper transcription
        const filteredText = filterTranscriptText(text.trim());
        // Add finalized user message to transcript
        const entry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: filteredText,
        };
        transcriptRef.current = [...transcriptRef.current, entry];
        onTranscriptUpdate(transcriptRef.current);
        onTrackInteraction?.('message', filteredText, undefined, 'student');
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

  // Read VAD tuning from env vars (NEXT_PUBLIC_ so they're available client-side)
  const vadThreshold = parseFloat(process.env.NEXT_PUBLIC_TUTOR_VAD_THRESHOLD || '0.8');
  const vadSilenceDurationMs = parseInt(process.env.NEXT_PUBLIC_TUTOR_VAD_SILENCE_MS || '1500', 10);
  const vadPrefixPaddingMs = parseInt(process.env.NEXT_PUBLIC_TUTOR_VAD_PREFIX_MS || '500', 10);

  // Initialize the realtime connection
  const realtime = useOpenAIRealtime({
    instructions,
    voice,
    vadThreshold,
    vadSilenceDurationMs,
    vadPrefixPaddingMs,
    onTranscriptUpdate: handleTranscriptUpdate,
    onWhiteboardCommand: handleWhiteboardCommand,
    onError: handleError,
    onStateChange,
  });

  // Expose sendTextMessage to parent via handleRef
  useEffect(() => {
    if (handleRef) {
      handleRef.current = {
        sendTextMessage: (text: string) => realtime.sendTextMessage(text),
      };
    }
    return () => {
      if (handleRef) handleRef.current = null;
    };
  }, [handleRef, realtime]);

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

        // Read optional voice personality from env
        const voicePersonality = process.env.NEXT_PUBLIC_TUTOR_VOICE_PERSONALITY
          || 'Be upbeat, enthusiastic, and warm. Use an encouraging and energetic tone — like a favorite teacher who genuinely loves the subject. Celebrate small wins ("Nice!", "Exactly!", "You\'re getting it!"). Vary your energy to keep the student engaged.';

        // Add OpenAI-specific voice instructions
        const openAIInstructions = `${systemPrompt}

## Voice Personality & Tone
${voicePersonality}

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
- ANY time you reference a formula in speech, you MUST also display it. No exceptions.

### show_function_graph — USE for ALL mathematical function graphs
This is your tool for plotting mathematical functions, curves, and shaded regions. The rendering engine computes exact coordinates automatically — you just provide function expressions.
- Use this INSTEAD of show_svg_diagram whenever you need to plot y=f(x) or x=f(y) curves.
- "functions" array: y=f(x) plots. Expression uses "x" variable with JS math: "4 - 0.5*x", "x**2", "Math.sin(x)".
- "functionsOfY" array: x=f(y) plots (e.g. x=y³). Expression uses "y" variable: "y**3", "3*y - 2".
- "points" array: labeled intersection points or key points to mark.
- "shadedRegion": shade area between two curves. Set axis="y" for horizontal slices (provide x=f(y) expressions), axis="x" for vertical slices (provide y=f(x) expressions), with from/to bounds.
- Set xRange and yRange to show the relevant portion of the coordinate plane.
- ALWAYS choose ranges that show the full region of interest including all intersection points and labeled features.

### show_svg_diagram — USE for physics diagrams and illustrations
Use this for physical setups (pipes, cars, ramps, pulleys, springs, circuits, etc.) — NOT for mathematical function graphs.
- Draw SVG with viewBox="0 0 400 300". Use actual shapes, arrows, labels.
- For diagrams: draw realistic shapes (e.g. actual car shapes for motion, actual pipes for fluid flow, actual objects for free body diagrams). Use fill colors, stroke, and clear labels.
- Use ACTUAL VALUES from the problem being discussed. Include title and description.
- Make diagrams educational, detailed, and visually appealing. Think like a textbook illustrator.
- CRITICAL — PROPORTIONAL SIZING: When drawing objects with different dimensions (e.g. a hose and nozzle), the SVG element sizes MUST be proportional to the actual values.
- SVG markup must be on a single line — do NOT include literal newlines in the SVG string.

RULE: If you say "let me show you" or describe any visual, you MUST call the tool. Never describe visuals without showing them.

### Homework uploads
When a student uploads a homework problem:
1. IMMEDIATELY draw the problem setup on the whiteboard:
   - For problems involving graphing functions/curves: use show_function_graph with the function expressions
   - For physics setups (diagrams, circuits, physical objects): use show_svg_diagram
2. Verbally acknowledge the upload and summarize what the problem asks.
3. As you work through each solution step, call show_equation for every formula and substitution.
4. Guide the student step by step, asking questions to check understanding.

### Solution steps on the whiteboard
As you solve problems, show EACH step on the whiteboard:
- The starting equation (show_equation)
- Each substitution with actual values (show_equation)
- Intermediate results (show_equation)
- The final answer (show_equation with a label like "Answer")
The student should be able to follow the entire solution by looking at the whiteboard.

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

  // Track if we've started the session (state, not ref, so pause button renders)
  const [hasStarted, setHasStarted] = useState(false);

  // Toggle listening
  const handleMicClick = useCallback(() => {
    if (realtime.state === 'listening') {
      realtime.stopListening();
    } else if (realtime.state === 'speaking') {
      realtime.interrupt();
      realtime.startListening();
    } else if (realtime.isConnected) {
      // On first click, send context-aware greeting to get tutor's introduction
      if (!hasStarted) {
        setHasStarted(true);
        const greetingMessage = getInitialGreetingPrompt(sessionGoal, topic);
        realtime.sendTextMessage(greetingMessage);
      }
      // Start listening for user's voice
      realtime.startListening();
    }
  }, [realtime, sessionGoal, topic, hasStarted]);

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
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          text: 'Connecting...',
          subtext: '',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'listening':
        return {
          icon: <Square className="w-4 h-4" />,
          text: 'Listening...',
          subtext: 'Click to stop',
          color: 'bg-red-500',
          pulse: true,
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          text: 'Thinking...',
          subtext: '',
          color: 'bg-yellow-500',
          pulse: false,
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-5 h-5" />,
          text: 'Tutor speaking',
          subtext: 'Click to interrupt',
          color: 'bg-green-500',
          pulse: true,
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          text: 'Error',
          subtext: '',
          color: 'bg-red-600',
          pulse: false,
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-5 h-5" />,
          text: 'Disconnected',
          subtext: '',
          color: 'bg-gray-500',
          pulse: false,
        };
      default:
        return {
          icon: <Mic className="w-5 h-5" />,
          text: transcriptRef.current.length === 0 ? 'Click to start' : 'Click to speak',
          subtext: 'Voice mode',
          color: 'bg-blue-500',
          pulse: false,
        };
    }
  };

  const stateUI = getStateUI();
  const isDisabled = realtime.state === 'connecting' || realtime.state === 'processing';

  return (
    <div className="voice-tutor-realtime flex items-center gap-3 py-2 px-2">
      {/* Connection indicator */}
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
        realtime.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {realtime.isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {realtime.isConnected ? 'Live' : 'Off'}
      </div>

      {isPaused ? (
        <>
          <button
            onClick={handleResume}
            className="w-10 h-10 rounded-full bg-green-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center flex-shrink-0"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
          <span className="text-sm font-medium text-amber-600">Paused</span>
        </>
      ) : (
        <>
          {/* Pause button */}
          {realtime.isConnected && (
            <button
              onClick={handlePause}
              className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all duration-200 flex items-center justify-center flex-shrink-0"
              title="Pause conversation"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {/* Main mic button */}
          <button
            onClick={handleMicClick}
            disabled={isDisabled}
            className={`
              relative w-12 h-12 rounded-full text-white flex-shrink-0
              transition-all duration-200 flex items-center justify-center
              ${stateUI.color}
              ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              ${stateUI.pulse ? 'animate-pulse' : ''}
            `}
          >
            {stateUI.icon}
          </button>

          {/* State text */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{stateUI.text}</p>
            {stateUI.subtext && (
              <p className="text-xs text-gray-500 truncate">{stateUI.subtext}</p>
            )}
          </div>
        </>
      )}

      {/* Error inline */}
      {errorMessage && (
        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded truncate max-w-[200px]">
          {errorMessage}
        </span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls on the right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isPaused && (
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg text-sm ${isMuted ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title={isMuted ? 'Unmute tutor' : 'Mute tutor'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {(realtime.state === 'error' || realtime.state === 'disconnected') && (
          <button
            onClick={() => { setErrorMessage(null); realtime.connect(); }}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
          >
            Reconnect
          </button>
        )}

        {onEndSession && (
          <button
            onClick={onEndSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            End
          </button>
        )}
      </div>
    </div>
  );
}
