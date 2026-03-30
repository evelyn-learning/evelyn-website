'use client';

/**
 * Embeddable Voice Tutor — lives inside partner iframes.
 *
 * Reads session config from a JWT token query param.
 * Skips setup/summary — goes straight to the tutoring session.
 * Applies partner branding (colors, logo, product name).
 *
 * Engine mapping:
 *   standard → classic (Deepgram STT + Claude + Deepgram TTS)
 *   premium  → realtime-validated (OpenAI Realtime API)
 */

import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Send, Loader2 } from 'lucide-react';
import { getTopicLabel, buildDisplayName } from '@/lib/tutor/topic-taxonomy';
import { getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { TranscriptView } from '@/app/tutor/components/TranscriptView';
import { SessionControls } from '@/app/tutor/components/SessionControls';
import { WhiteboardCanvas } from '@/app/tutor/components/whiteboard';
import { VoiceTutor } from '@/app/tutor/components/VoiceTutor';
import { VoiceTutorRealtime, type RealtimeHandle } from '@/app/tutor/components/VoiceTutorRealtime';
import type { SessionGoal, TranscriptEntry, VoiceId } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from '@/app/tutor/hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type InternalEngine = 'classic' | 'realtime-validated';

interface EmbedConfig {
  partner_id: string;
  student_id: string;
  student_name?: string;
  subject: string;
  topic?: string;
  level: string;
  session_goal?: SessionGoal;
  engine?: 'standard' | 'premium';
  locale?: string;
  input_mode?: InputMode;
  voice?: string;
  curriculum_module?: string;
  max_duration_minutes?: number;
  branding?: {
    primary_color?: string;
    logo_url?: string;
    product_name?: string;
  };
  features?: {
    homework_upload?: boolean;
    text_mode?: boolean;
    voice_mode?: boolean;
  };
  metadata?: Record<string, unknown>;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  operation: string;
  timestamp: Date;
  inputAudioTokens?: number;
  outputAudioTokens?: number;
  inputTextTokens?: number;
  outputTextTokens?: number;
}

function parseToken(tokenParam: string | null): EmbedConfig | null {
  if (!tokenParam) return null;
  try {
    // TODO: Replace with proper JWT verification using partner's API secret
    // For now, accept base64-encoded JSON for development/testing
    const decoded = atob(tokenParam);
    return JSON.parse(decoded);
  } catch {
    // Try plain JSON (for sandbox testing)
    try {
      return JSON.parse(decodeURIComponent(tokenParam));
    } catch {
      return null;
    }
  }
}

function mapEngine(engine?: string): InternalEngine {
  if (engine === 'premium') return 'realtime-validated';
  return 'classic'; // default to standard
}

function EmbedSession() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const config = useMemo(() => parseToken(tokenParam), [tokenParam]);

  // If no valid config, show error
  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900">Invalid Session Token</h1>
          <p className="text-sm text-gray-600">
            A valid session token is required to start a tutoring session.
            Please check your integration and try again.
          </p>
        </div>
      </div>
    );
  }

  return <EmbedSessionInner config={config} />;
}

function EmbedSessionInner({ config }: { config: EmbedConfig }) {
  const subject = config.subject;
  const level = config.level;
  const topic = config.topic || '';
  const studentName = config.student_name || '';
  const sessionGoal: SessionGoal = config.session_goal || 'practice';
  const inputMode: InputMode = config.input_mode || 'voice';
  const voiceEngine: InternalEngine = mapEngine(config.engine);
  const openAIVoice: OpenAIVoice = (config.voice as OpenAIVoice) || 'coral';
  const classicVoice: VoiceId = 'male-1';
  const maxDuration = config.max_duration_minutes || 30;
  const branding = config.branding;

  // Apply branding color as CSS variable
  const brandStyle = branding?.primary_color
    ? { '--brand-color': branding.primary_color } as React.CSSProperties
    : {};

  // Session state
  const [sessionId] = useState(() => `embed-${Date.now()}`);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [whiteboardCommands, setWhiteboardCommands] = useState<WhiteboardCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const sessionStartRef = useRef(new Date());

  // Input state
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const realtimeHandleRef = useRef<RealtimeHandle | null>(null);

  // Resizable split
  const [splitPercent, setSplitPercent] = useState(50);
  const isDraggingSplit = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const handleSplitMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSplit.current = true;
    const onMove = (ev: MouseEvent) => {
      if (!isDraggingSplit.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.max(25, Math.min(75, pct)));
    };
    const onUp = () => {
      isDraggingSplit.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  const topicDisplayName = useMemo(
    () => topic ? buildDisplayName(subject, level, topic) : `${subject} — ${level}`,
    [subject, level, topic]
  );

  // Auto-start text mode session with greeting
  useEffect(() => {
    if (inputMode !== 'text' || !topic) return;

    const topicLabel = getTopicLabel(subject, level, topic);
    const greetingMessage = getInitialGreetingPrompt(sessionGoal, topicLabel);

    setIsProcessing(true);
    fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: greetingMessage,
        conversationHistory: [],
        subject,
        topic,
        level,
        studentName: studentName || undefined,
        sessionGoal,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.usage) {
          setTokenUsage([{ inputTokens: data.usage.inputTokens, outputTokens: data.usage.outputTokens, operation: 'greeting', timestamp: new Date() }]);
        }
        const entry: TranscriptEntry = { id: `tutor-${Date.now()}`, timestamp: new Date(), role: 'tutor', text: data.text, whiteboardCommands: data.whiteboardCommands };
        setTranscript([entry]);
        setConversationHistory([{ role: 'user', content: greetingMessage }, { role: 'assistant', content: data.rawText || data.text }]);
        if (data.whiteboardCommands?.length > 0) setWhiteboardCommands(data.whiteboardCommands);
      })
      .catch(console.error)
      .finally(() => setIsProcessing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send text message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isProcessing || !topic) return;
      setIsProcessing(true);
      setError(null);

      const userEntry: TranscriptEntry = { id: `user-${Date.now()}`, timestamp: new Date(), role: 'student', text: message };
      setTranscript((prev) => [...prev, userEntry]);

      try {
        const response = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, conversationHistory, subject, topic, level, studentName: studentName || undefined, sessionGoal }),
        });
        const data = await response.json();
        if (!response.ok || data.error) throw new Error(data.error || 'Failed to get response');

        if (data.usage) {
          setTokenUsage((prev) => [...prev, { inputTokens: data.usage.inputTokens, outputTokens: data.usage.outputTokens, operation: 'chat', timestamp: new Date() }]);
        }

        const tutorEntry: TranscriptEntry = { id: `tutor-${Date.now()}`, timestamp: new Date(), role: 'tutor', text: data.text, whiteboardCommands: data.whiteboardCommands, pedagogicalIntent: data.pedagogicalIntent };
        setTranscript((prev) => [...prev, tutorEntry]);
        setConversationHistory((prev) => [...prev, { role: 'user', content: message }, { role: 'assistant', content: data.rawText || data.text }]);
        if (data.whiteboardCommands?.length > 0) setWhiteboardCommands((prev) => [...prev, ...data.whiteboardCommands]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsProcessing(false);
      }
    },
    [conversationHistory, subject, level, topic, studentName, sessionGoal, isProcessing]
  );

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) { sendMessage(inputText); setInputText(''); }
  }, [inputText, sendMessage]);

  // Voice callbacks
  const handleVoiceTranscriptUpdate = useCallback((entries: TranscriptEntry[]) => setTranscript(entries), []);
  const handleVoiceWhiteboardCommand = useCallback((commands: WhiteboardCommand[]) => setWhiteboardCommands((prev) => [...prev, ...commands]), []);
  const handleRealtimeUsage = useCallback((usage: { totalTokens: number; inputTokens: number; outputTokens: number; inputTextTokens: number; inputAudioTokens: number; outputTextTokens: number; outputAudioTokens: number }) => {
    if (usage.totalTokens === 0) return;
    setTokenUsage((prev) => [...prev, { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, inputAudioTokens: usage.inputAudioTokens, outputAudioTokens: usage.outputAudioTokens, inputTextTokens: usage.inputTextTokens, outputTextTokens: usage.outputTextTokens, operation: 'realtime-response', timestamp: new Date() }]);
  }, []);
  const handleVoiceConversationHistoryUpdate = useCallback((history: ConversationMessage[]) => setConversationHistory(history), []);

  // End session — notify parent window
  const handleEndSession = useCallback(() => {
    setSessionEnded(true);
    const duration = Math.round((Date.now() - sessionStartRef.current.getTime()) / 1000);
    // Post message to parent window for partner integration
    window.parent.postMessage({
      type: 'evelyn:session_ended',
      data: {
        session_id: sessionId,
        duration,
        message_count: transcript.length,
        whiteboard_items: whiteboardCommands.length,
      },
    }, '*');
  }, [sessionId, transcript.length, whiteboardCommands.length]);

  // Session ended view
  if (sessionEnded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50" style={brandStyle}>
        <div className="max-w-md text-center p-8">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Session Complete</h1>
          <p className="text-sm text-gray-600">
            {transcript.length} messages exchanged, {whiteboardCommands.length} visuals generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gray-100" style={brandStyle}>
      <Script
        src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=47658ec5a4894397ae1e1a46a6174a9a"
        strategy="lazyOnload"
      />

      {/* Header */}
      <header className="flex-shrink-0 border-b bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo_url} alt="" className="h-6" />
            )}
            <div>
              <h1 className="font-semibold text-gray-900">
                {branding?.product_name || topicDisplayName || 'AI Tutor'}
              </h1>
              <p className="text-xs text-gray-500">{topicDisplayName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Session controls */}
      <div className="flex-shrink-0 px-4 py-1">
        <SessionControls
          sessionId={sessionId}
          maxDuration={maxDuration}
          onEndSession={handleEndSession}
          onUploadHomework={() => {}}
          transcript={transcript}
          whiteboardCommands={whiteboardCommands}
          topicName={topicDisplayName || 'AI Tutor'}
          sessionGoal={sessionGoal}
          studentName={studentName || undefined}
          subject={subject}
          level={level}
        />
      </div>

      {/* Main content */}
      <div ref={splitContainerRef} className="flex min-h-0 flex-1 px-4 py-1">
        {/* Transcript */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg bg-white shadow-lg" style={{ width: `${splitPercent}%` }}>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <TranscriptView transcript={transcript} isProcessing={isProcessing} />
          </div>
        </div>

        {/* Split handle */}
        <div
          onMouseDown={handleSplitMouseDown}
          className="group hidden w-4 flex-shrink-0 cursor-col-resize items-center justify-center rounded transition-colors hover:bg-blue-100 active:bg-blue-200 lg:flex"
        >
          <div className="flex flex-col items-center gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            ))}
          </div>
        </div>

        {/* Whiteboard — always visible in embed (iframe may be narrower than lg breakpoint) */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg bg-white shadow-lg" style={{ width: `${100 - splitPercent}%` }}>
          <WhiteboardCanvas
            commands={whiteboardCommands}
            onClear={() => setWhiteboardCommands([])}
          />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 bg-white px-2 py-1">
        {inputMode === 'voice' && topic ? (
          voiceEngine === 'realtime-validated' ? (
            <VoiceTutorRealtime
              subject={subject}
              topic={topic}
              level={level}
              studentName={studentName || undefined}
              sessionGoal={sessionGoal}
              voice={openAIVoice}
              onTranscriptUpdate={handleVoiceTranscriptUpdate}
              onWhiteboardCommand={handleVoiceWhiteboardCommand}
              onUsageUpdate={handleRealtimeUsage}
              onDebugEvent={() => {}}
              onError={(err) => setError(err.message)}
              onEndSession={handleEndSession}
              onTrackInteraction={() => {}}
              handleRef={realtimeHandleRef}
              validateToolCalls
            />
          ) : (
            <VoiceTutor
              subject={subject}
              topic={topic}
              level={level}
              studentName={studentName || undefined}
              sessionGoal={sessionGoal}
              voiceId={classicVoice}
              externalConversationHistory={conversationHistory}
              externalTranscript={transcript}
              onTranscriptUpdate={handleVoiceTranscriptUpdate}
              onWhiteboardCommand={handleVoiceWhiteboardCommand}
              onConversationHistoryUpdate={handleVoiceConversationHistoryUpdate}
              onError={(err) => setError(err.message)}
              onEndSession={handleEndSession}
              onTrackInteraction={() => {}}
            />
          )
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              style={branding?.primary_color ? { backgroundColor: branding.primary_color } : {}}
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Send
            </button>
          </form>
        )}
      </div>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-20 right-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700 shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">x</button>
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <EmbedSession />
    </Suspense>
  );
}
