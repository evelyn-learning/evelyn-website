'use client';

/**
 * AI Voice Tutor - Main Page
 *
 * The primary interface for voice tutoring sessions.
 * Supports both text and voice modes.
 */

import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft, Play, Send, Loader2, Mic, MessageSquare } from 'lucide-react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import {
  SUBJECTS,
  SESSION_GOALS,
  getLevelsForSubject,
  getTopicsForSubjectLevel,
  buildDisplayName,
  getTopicLabel,
} from '@/lib/tutor/topic-taxonomy';
import Link from 'next/link';
import { TranscriptView } from './components/TranscriptView';
import { SessionControls } from './components/SessionControls';
import { WhiteboardCanvas } from './components/whiteboard';
import { VoiceTutor } from './components/VoiceTutor';
import { VoiceTutorRealtime, type RealtimeHandle } from './components/VoiceTutorRealtime';
import { LessonPlanProgress } from './components/LessonPlanProgress';
import type { LessonPlan as LessonPlanType } from '@/lib/tutor/lesson-plan/types';
import { VoiceTutorGemini } from './components/VoiceTutorGemini';
import { getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import type { SessionGoal, TranscriptEntry, VoiceId, AVAILABLE_VOICES } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from './hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type VoiceEngine = 'classic' | 'realtime' | 'realtime-validated' | 'claude-brain' | 'gemini-live';

// Voice settings from environment variables (hides UI options)
const ENV_VOICE_ENGINE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_ENGINE as VoiceEngine) || 'classic';
const ENV_OPENAI_VOICE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_OPENAI as OpenAIVoice) || 'alloy';
const ENV_CLASSIC_VOICE = (process.env.NEXT_PUBLIC_TUTOR_VOICE_CLASSIC as VoiceId) || 'male-1';

// Token usage tracking
interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  operation: string;
  timestamp: Date;
  // Realtime-specific: audio vs text token breakdown
  inputAudioTokens?: number;
  outputAudioTokens?: number;
  inputTextTokens?: number;
  outputTextTokens?: number;
}

// Pricing per 1M tokens
const PRICING = {
  // Claude Sonnet 4 (text chat mode)
  input: 3.0,   // $3 per 1M input tokens
  output: 15.0, // $15 per 1M output tokens
};

const REALTIME_PRICING = {
  // OpenAI Realtime API (voice mode)
  audioInput: 100.0,   // $100 per 1M audio input tokens
  audioOutput: 200.0,  // $200 per 1M audio output tokens
  textInput: 5.0,      // $5 per 1M text input tokens
  textOutput: 20.0,    // $20 per 1M text output tokens
};


interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function TutorPageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>}>
      <TutorPage />
    </Suspense>
  );
}

/** Compact pill showing one setup step's done-or-pending state. */
function StepChip({ label, done }: { label: string; done: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        done ? 'bg-green-100 text-green-800' : 'bg-white text-blue-700 border border-blue-300'
      }`}
    >
      {done ? '✓' : '○'} {label}
    </span>
  );
}

function TutorPage() {
  // Demo tracking
  const { onView, onTry, onComplete, trackInteraction } = useDemoTracker('voice-tutor', 'AI Voice Tutor');

  // Track view on mount
  useEffect(() => {
    onView();
  }, [onView]);

  // Allow query param override for engine: /tutor?engine=classic
  const searchParams = useSearchParams();
  const engineParam = searchParams.get('engine') as VoiceEngine | null;
  const VALID_ENGINES: VoiceEngine[] = ['classic', 'realtime', 'realtime-validated', 'claude-brain', 'gemini-live'];
  // /tutor?tts=mini switches relay-mode TTS to gpt-4o-mini-tts for cost
  // comparison. Default 'realtime' (out-of-band response, highest quality).
  const ttsParam = searchParams.get('tts');
  const ttsProvider: 'realtime' | 'openai-mini' = ttsParam === 'mini' ? 'openai-mini' : 'realtime';

  const [stage, setStage] = useState<'setup' | 'session' | 'summary'>('setup');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  // Lesson-plan selection. Optional — when set, the brain runs in
  // plan-driven mode (treats segments as a teaching script) instead of
  // free-conversation mode.
  const [availableLessonPlans, setAvailableLessonPlans] = useState<Array<{ id: string; title: string; los: Array<{ id: string; description: string }>; estimatedMinutes: number }>>([]);
  const [selectedLessonPlanId, setSelectedLessonPlanId] = useState('');
  const [sessionGoal, setSessionGoal] = useState<SessionGoal>('practice');
  const [studentName, setStudentName] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  // Voice settings: query param > env var > default
  const selectedVoice: VoiceId = ENV_CLASSIC_VOICE;
  const baseVoiceEngine: VoiceEngine = (engineParam && VALID_ENGINES.includes(engineParam)) ? engineParam : ENV_VOICE_ENGINE;
  // Lesson plans only work in claude-brain mode (the brain orchestrator
  // is what consumes lessonPlanContext). Force the engine when one is
  // selected so the user doesn't have to know about engine flags.
  const voiceEngine: VoiceEngine = selectedLessonPlanId ? 'claude-brain' : baseVoiceEngine;
  const selectedOpenAIVoice: OpenAIVoice = ENV_OPENAI_VOICE;

  // Session state
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [whiteboardCommands, setWhiteboardCommands] = useState<WhiteboardCommand[]>([]);
  // Lesson-plan progress state — fed by VoiceTutorRealtime via onLessonPlanProgress.
  const [lessonProgress, setLessonProgress] = useState<{ plan: LessonPlanType | null; currentSegmentId: string }>({ plan: null, currentSegmentId: '' });
  // Source-of-truth event log for whiteboard commands. Each entry is captured
  // at the moment a command is emitted so we keep accurate timestamps and a
  // best-effort link to the surrounding transcript message. This avoids the
  // bug where the save path tried to reverse-engineer order/timing from a
  // walk over `transcript[].whiteboardCommands`, which silently dropped or
  // duplicated commands when the realtime tool calls fired before the tutor
  // transcript entry existed.
  const whiteboardEventsRef = useRef<Array<{
    command: WhiteboardCommand;
    timestamp: Date;
    sourceMessageIndex: number;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Token usage tracking
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const lastSavedTokenCountRef = useRef(0); // track what we've already pushed to avoid duplicates

  // Debug events — persisted to DB for post-session analysis
  interface DebugEvent {
    type: string;
    message: string;
    timestamp: string;
    data?: Record<string, unknown>;
  }
  const debugEventsRef = useRef<DebugEvent[]>([]);
  const lastSavedDebugCountRef = useRef(0);
  const sessionEndedRef = useRef(false);

  const addDebugEvent = useCallback((type: string, message: string, data?: Record<string, unknown>) => {
    debugEventsRef.current.push({
      type,
      message: message.slice(0, 500),
      timestamp: new Date().toISOString(),
      ...(data ? { data } : {}),
    });
  }, []);

  // Save session usage to DB (fire-and-forget, tolerates failures)
  const saveSessionUsage = useCallback((status: 'active' | 'completed' | 'abandoned' = 'active') => {
    if (!selectedTopicId || stage === 'setup') return;

    const now = new Date();
    const startTime = sessionStartTimeRef.current || now;
    const duration = Math.round((now.getTime() - startTime.getTime()) / 1000);
    const totalIn = tokenUsage.reduce((s, u) => s + u.inputTokens, 0);
    const totalOut = tokenUsage.reduce((s, u) => s + u.outputTokens, 0);

    // Calculate cost with correct pricing per operation type
    let cost = 0;
    for (const u of tokenUsage) {
      if (u.operation === 'realtime-response') {
        // OpenAI Realtime: separate audio and text token pricing
        const audioIn = u.inputAudioTokens || 0;
        const audioOut = u.outputAudioTokens || 0;
        const textIn = u.inputTextTokens || 0;
        const textOut = u.outputTextTokens || 0;
        cost += (audioIn / 1_000_000) * REALTIME_PRICING.audioInput
              + (audioOut / 1_000_000) * REALTIME_PRICING.audioOutput
              + (textIn / 1_000_000) * REALTIME_PRICING.textInput
              + (textOut / 1_000_000) * REALTIME_PRICING.textOutput;
      } else {
        // Claude API: standard text token pricing
        cost += (u.inputTokens / 1_000_000) * PRICING.input
              + (u.outputTokens / 1_000_000) * PRICING.output;
      }
    }

    // Only push new token entries since last save
    const newEntries = tokenUsage.slice(lastSavedTokenCountRef.current);
    lastSavedTokenCountRef.current = tokenUsage.length;

    // Only push new debug events since last save
    const newDebugEvents = debugEventsRef.current.slice(lastSavedDebugCountRef.current);
    lastSavedDebugCountRef.current = debugEventsRef.current.length;

    const isFinal = status === 'completed' || status === 'abandoned';

    const payload: Record<string, unknown> = {
      sessionId,
      subject: selectedSubject,
      topic: selectedTopicId,
      level: selectedLevel,
      sessionGoal,
      inputMode,
      voiceEngine: inputMode === 'voice' ? voiceEngine : undefined,
      source: 'tutor',
      studentName: studentName || undefined,
      startedAt: startTime.toISOString(),
      endedAt: status !== 'active' ? now.toISOString() : undefined,
      duration,
      messageCount: transcript.length,
      whiteboardItemCount: whiteboardCommands.length,
      totalInputTokens: totalIn,
      totalOutputTokens: totalOut,
      estimatedCost: Math.round(cost * 10000) / 10000,
      status,
      ...(newEntries.length > 0 ? { tokenUsage: newEntries.map(u => ({
        operation: u.operation,
        inputTokens: u.inputTokens,
        outputTokens: u.outputTokens,
        timestamp: u.timestamp.toISOString(),
        ...(u.inputAudioTokens ? { inputAudioTokens: u.inputAudioTokens } : {}),
        ...(u.outputAudioTokens ? { outputAudioTokens: u.outputAudioTokens } : {}),
        ...(u.inputTextTokens ? { inputTextTokens: u.inputTextTokens } : {}),
        ...(u.outputTextTokens ? { outputTextTokens: u.outputTextTokens } : {}),
      })) } : {}),
      ...(newDebugEvents.length > 0 ? { debugEvents: newDebugEvents } : {}),
      // Include full transcript + whiteboard data on final save
      ...(isFinal ? {
        transcript: transcript.map(t => ({
          role: t.role,
          text: t.text,
          timestamp: t.timestamp.toISOString(),
          ...(t.whiteboardCommands?.length ? { whiteboardCommands: t.whiteboardCommands } : {}),
          ...(t.pedagogicalIntent ? { pedagogicalIntent: t.pedagogicalIntent } : {}),
        })),
        whiteboardCommands: (() => {
          // Primary source of truth: the event log captured at emission time.
          // Each entry carries its own timestamp + transcript anchor, so the
          // replay UI gets a clean monotonic timeline with no dropped or
          // duplicated commands.
          if (whiteboardEventsRef.current.length > 0) {
            return whiteboardEventsRef.current.map((evt) => ({
              action: evt.command.action,
              data: { ...(evt.command as unknown as Record<string, unknown>), action: undefined },
              timestamp: evt.timestamp.toISOString(),
              sourceMessageIndex: evt.sourceMessageIndex,
            }));
          }
          // Fallback for non-voice flows that don't push through
          // handleVoiceWhiteboardCommand (text mode, homework upload). Just
          // dump the top-level state with a session-end timestamp — replay
          // timing won't be precise, but we don't lose commands.
          return whiteboardCommands.map((cmd) => ({
            action: cmd.action,
            data: { ...cmd, action: undefined },
            timestamp: now.toISOString(),
            sourceMessageIndex: -1,
          }));
        })(),
      } : {}),
    };

    // On final save, include the session-level topics-covered + weak-topics
    // map from the voice tutor handle so future sessions can surface targeted
    // review at the start.
    if (isFinal && realtimeHandleRef.current?.getSessionSummary) {
      try {
        const summary = realtimeHandleRef.current.getSessionSummary();
        if (summary.topicsCovered?.length) payload.topicsCovered = summary.topicsCovered;
        if (summary.weakTopics?.length) payload.weakTopics = summary.weakTopics;
      } catch (err) {
        console.warn('[saveSessionUsage] getSessionSummary threw:', err);
      }
    }

    // Use sendBeacon for unload, fetch otherwise
    if (status === 'abandoned') {
      navigator.sendBeacon('/api/tutor/session-usage', JSON.stringify(payload));
    } else {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [sessionId, selectedSubject, selectedLevel, selectedTopicId, stage, sessionGoal, inputMode, voiceEngine, studentName, transcript.length, whiteboardCommands.length, tokenUsage]);

  // Save on page unload (tab close) or component unmount (in-app navigation/back button)
  useEffect(() => {
    if (stage !== 'session') return;

    const handleBeforeUnload = () => {
      saveSessionUsage('abandoned');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save abandoned session on component unmount (e.g. browser back button in SPA)
      // Skip if session was already explicitly ended
      if (!sessionEndedRef.current) {
        saveSessionUsage('abandoned');
      }
    };
  }, [stage, saveSessionUsage]);

  // Derived taxonomy state
  const availableLevels = useMemo(() => getLevelsForSubject(selectedSubject), [selectedSubject]);
  const availableTopics = useMemo(() => getTopicsForSubjectLevel(selectedSubject, selectedLevel), [selectedSubject, selectedLevel]);
  const topicDisplayName = useMemo(
    () => selectedTopicId ? buildDisplayName(selectedSubject, selectedLevel, selectedTopicId) : '',
    [selectedSubject, selectedLevel, selectedTopicId]
  );
  const canStartSession = !!(selectedSubject && selectedLevel && selectedTopicId);

  // Reset downstream selections when parent changes
  const handleSubjectChange = useCallback((subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedLevel('');
    setSelectedTopicId('');
    setSelectedLessonPlanId('');
    setAvailableLessonPlans([]);
  }, []);

  const handleLevelChange = useCallback((levelId: string) => {
    setSelectedLevel(levelId);
    setSelectedTopicId('');
    setSelectedLessonPlanId('');
    setAvailableLessonPlans([]);
  }, []);

  // Fetch available lesson plans when (subject, level, topic) is set.
  // Plans are filtered server-side; the demo UI only shows a dropdown
  // when at least one plan matches.
  useEffect(() => {
    if (!selectedSubject || !selectedTopicId) {
      setAvailableLessonPlans([]);
      setSelectedLessonPlanId('');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        params.set('subject', selectedSubject);
        if (selectedLevel) params.set('grade', selectedLevel);
        const res = await fetch(`/api/tutor/lesson-plans?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setAvailableLessonPlans(data.items || []);
      } catch {
        if (!cancelled) setAvailableLessonPlans([]);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedSubject, selectedLevel, selectedTopicId]);

  // Resizable split between transcript and whiteboard (percentage for transcript)
  const [splitPercent, setSplitPercent] = useState(50);
  // Mobile tab state — on screens narrower than `lg`, the split-panel
  // layout doesn't fit. Show one panel at a time via a tab toggle and
  // let the user switch between the chat and whiteboard.
  const [mobileTab, setMobileTab] = useState<'chat' | 'whiteboard'>('whiteboard');
  // SSR-safe desktop detection. Defaults to false on the server (renders
  // mobile-friendly layout) then flips to true on the client when the
  // viewport is wider than the lg breakpoint (1024px). Listens to resize.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
    if (!mq) return;
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
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

  // Vertical resizable split between main content and input area (pixels from bottom)
  const [inputHeight, setInputHeight] = useState(64); // default compact height for voice bar
  const isDraggingVertical = useRef(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingVertical.current || !pageContainerRef.current) return;
      const rect = pageContainerRef.current.getBoundingClientRect();
      const fromBottom = rect.bottom - ev.clientY;
      setInputHeight(Math.max(48, Math.min(300, fromBottom)));
    };

    const onUp = () => {
      isDraggingVertical.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);


  // Input state
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const realtimeHandleRef = useRef<RealtimeHandle | null>(null);

  // Send message to tutor API
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isProcessing || !selectedTopicId) return;

      setIsProcessing(true);
      setError(null);

      // Add user message to transcript
      const userEntry: TranscriptEntry = {
        id: `user-${Date.now()}`,
        timestamp: new Date(),
        role: 'student',
        text: message,
      };
      setTranscript((prev) => [...prev, userEntry]);
      trackInteraction('message', message, undefined, 'student');

      try {
        const response = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversationHistory,
            subject: selectedSubject,
            topic: selectedTopicId,
            level: selectedLevel,
            studentName: studentName || undefined,
            sessionGoal,
          }),
        });

        const data = await response.json();

        // Handle API errors gracefully
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to get response from tutor');
        }

        // Track token usage
        if (data.usage) {
          setTokenUsage((prev) => [...prev, {
            inputTokens: data.usage.inputTokens,
            outputTokens: data.usage.outputTokens,
            operation: 'chat',
            timestamp: new Date(),
          }]);
        }

        // Add tutor response to transcript
        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
          whiteboardCommands: data.whiteboardCommands,
          pedagogicalIntent: data.pedagogicalIntent,
        };
        setTranscript((prev) => [...prev, tutorEntry]);
        trackInteraction('message', data.text, data.pedagogicalIntent ? { pedagogicalIntent: data.pedagogicalIntent } : undefined, 'tutor');

        // Update conversation history for context
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: data.rawText || data.text },
        ]);

        // Add whiteboard commands
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands((prev) => [...prev, ...data.whiteboardCommands]);
          data.whiteboardCommands.forEach((cmd: WhiteboardCommand) => {
            trackInteraction('tool_use', 'whiteboard', { ...cmd });
          });
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsProcessing(false);
      }
    },
    [conversationHistory, selectedSubject, selectedLevel, selectedTopicId, studentName, sessionGoal, isProcessing, trackInteraction]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputText.trim()) {
        sendMessage(inputText);
        setInputText('');
      }
    },
    [inputText, sendMessage]
  );

  // Start session with greeting
  const handleStartSession = useCallback(async () => {
    if (!canStartSession) return;

    // Track demo try
    onTry();
    trackInteraction('navigation', 'session_start', { topic: selectedTopicId, goal: sessionGoal, inputMode });

    setStage('session');
    setTranscript([]);
    setConversationHistory([]);
    setWhiteboardCommands([]);
    whiteboardEventsRef.current = [];
    setTokenUsage([]); // Reset token usage for new session
    sessionStartTimeRef.current = new Date();
    lastSavedTokenCountRef.current = 0;
    sessionEndedRef.current = false;

    // For voice mode, VoiceTutor handles initialization
    if (inputMode === 'voice') {
      return;
    }

    // For text mode, get initial greeting (context-aware)
    const topicLabel = getTopicLabel(selectedSubject, selectedLevel, selectedTopicId);
    const greetingMessage = getInitialGreetingPrompt(sessionGoal, topicLabel);

    setIsProcessing(true);
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: greetingMessage,
          conversationHistory: [],
          subject: selectedSubject,
          topic: selectedTopicId,
          level: selectedLevel,
          studentName: studentName || undefined,
          sessionGoal,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Track token usage
        if (data.usage) {
          setTokenUsage([{
            inputTokens: data.usage.inputTokens,
            outputTokens: data.usage.outputTokens,
            operation: 'greeting',
            timestamp: new Date(),
          }]);
        }

        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
          whiteboardCommands: data.whiteboardCommands,
        };
        setTranscript([tutorEntry]);
        setConversationHistory([
          { role: 'user', content: greetingMessage },
          { role: 'assistant', content: data.rawText || data.text },
        ]);
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands(data.whiteboardCommands);
        }
      }
    } catch (err) {
      console.error('Error starting session:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [canStartSession, selectedSubject, selectedLevel, selectedTopicId, studentName, sessionGoal, inputMode, onTry, trackInteraction]);

  // Handle transcript updates from VoiceTutor
  const handleVoiceTranscriptUpdate = useCallback((entries: TranscriptEntry[]) => {
    setTranscript(entries);
  }, []);

  // Handle whiteboard commands from VoiceTutor
  const handleVoiceWhiteboardCommand = useCallback((commands: WhiteboardCommand[]) => {
    console.log('[TutorPage] Received whiteboard commands:', commands.length, commands.map(c => c.action));
    // Capture the emission moment + nearest tutor transcript index right now,
    // before the next tutor turn lands. We don't try to be clever about which
    // message a command "belongs to" — for replay we only care that the
    // timeline is monotonic and the timestamps are real.
    const now = new Date();
    const lastTutorIdx = (() => {
      for (let i = transcript.length - 1; i >= 0; i--) {
        if (transcript[i].role === 'tutor') return i;
      }
      return -1;
    })();
    for (const command of commands) {
      whiteboardEventsRef.current.push({ command, timestamp: now, sourceMessageIndex: lastTutorIdx });
    }
    setWhiteboardCommands((prev) => {
      const next = [...prev, ...commands];
      console.log('[TutorPage] Total whiteboard commands now:', next.length);
      return next;
    });
  }, [transcript]);

  // Handle token usage from OpenAI Realtime responses
  const handleRealtimeUsage = useCallback((usage: { totalTokens: number; inputTokens: number; outputTokens: number; inputTextTokens: number; inputAudioTokens: number; outputTextTokens: number; outputAudioTokens: number }) => {
    if (usage.totalTokens === 0) return;
    setTokenUsage((prev) => [...prev, {
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      inputAudioTokens: usage.inputAudioTokens,
      outputAudioTokens: usage.outputAudioTokens,
      inputTextTokens: usage.inputTextTokens,
      outputTextTokens: usage.outputTextTokens,
      operation: 'realtime-response',
      timestamp: new Date(),
    }]);
  }, []);

  // Handle conversation history updates from VoiceTutor
  const handleVoiceConversationHistoryUpdate = useCallback((history: ConversationMessage[]) => {
    setConversationHistory(history);
  }, []);

  // End session
  const handleEndSession = useCallback(() => {
    // Track demo complete
    onComplete({
      topic: selectedTopicId,
      messagesExchanged: transcript.length,
      sessionGoal
    });
    // Save session as completed to DB
    sessionEndedRef.current = true;
    saveSessionUsage('completed');
    setStage('summary');
  }, [onComplete, selectedTopicId, transcript.length, sessionGoal, saveSessionUsage]);

  // Upload homework and extract problems
  const handleUploadHomework = useCallback(async (imageData: string, mimeType: string) => {
    if (!selectedTopicId) return;
    console.log('[Tutor] Processing homework upload:', mimeType);
    addDebugEvent('image_upload', `Homework upload: ${mimeType}`);
    setIsProcessing(true);
    setError(null);
    setStatusMessage('📷 Analyzing your problem...');

    try {
      // Call the homework extraction API
      const response = await fetch('/api/tutor/extract-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          mimeType,
          subject: selectedSubject,
          topic: selectedTopicId,
          level: selectedLevel,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process homework image');
      }

      const data = await response.json();

      // Track token usage (includes both extraction and tutor response)
      if (data.usage) {
        setTokenUsage((prev) => [...prev, {
          inputTokens: data.usage.inputTokens,
          outputTokens: data.usage.outputTokens,
          operation: 'homework-extraction',
          timestamp: new Date(),
        }]);
      }

      // Build user message that includes the extracted problem for context
      const userMessageForHistory = data.extractedProblem
        ? `I uploaded a homework problem. Here's what it says:\n\n${data.extractedProblem}\n\nCan you help me understand it and work through it?`
        : 'Here is my homework problem. Can you help me understand it and work through it?';

      // If in realtime voice mode, send extracted problem through the WebSocket
      // so the AI acknowledges it verbally and speaks its response
      if (inputMode === 'voice' && voiceEngine === 'realtime' && realtimeHandleRef.current && data.extractedProblem) {
        console.log('[Tutor] Sending extracted homework to realtime API for voice response');

        // Add user upload message to transcript for display only
        const userEntry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: '[Uploaded homework image]',
        };
        setTranscript((prev) => [...prev, userEntry]);

        // Show the uploaded image on the whiteboard
        setWhiteboardCommands(prev => [...prev, {
          action: 'showSvgDiagram',
          title: 'Uploaded Homework',
          svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <image href="${imageData}" x="10" y="10" width="380" height="280" preserveAspectRatio="xMidYMid meet"/>
          </svg>`,
        } as WhiteboardCommand]);

        // Send extracted problem to realtime WebSocket — the AI will speak its response
        realtimeHandleRef.current.sendTextMessage(
          `The student just uploaded a homework problem image. Here is the extracted text:\n\n${data.extractedProblem}\n\nYou MUST do ALL of the following:\n1. Draw the problem setup on the whiteboard — if it involves graphing functions or curves, use show_function_graph with the function expressions. For physics diagrams (objects, forces, circuits), use show_svg_diagram.\n2. Verbally acknowledge the upload and briefly summarize what the problem asks.\n3. As you work through each solution step, call show_equation to display each equation and substitution on the whiteboard.\n4. Guide the student through the solution step by step, asking them questions along the way.`
        );
      } else {
        // Text mode: add both entries to transcript
        const userEntry: TranscriptEntry = {
          id: `user-${Date.now()}`,
          timestamp: new Date(),
          role: 'student',
          text: '[Uploaded homework image]',
        };

        const tutorEntry: TranscriptEntry = {
          id: `tutor-${Date.now()}`,
          timestamp: new Date(),
          role: 'tutor',
          text: data.text,
        };

        setTranscript((prev) => [...prev, userEntry, tutorEntry]);

        // Store the FULL extracted problem in conversation history for context
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: userMessageForHistory },
          { role: 'assistant', content: data.text },
        ]);

        // Add whiteboard commands from homework extraction
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands((prev) => [...prev, ...data.whiteboardCommands]);
        }
      }

      console.log('[Tutor] Homework processed successfully');
    } catch (err) {
      console.error('[Tutor] Homework upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process homework');
    } finally {
      setIsProcessing(false);
      setStatusMessage(null);
    }
  }, [selectedSubject, selectedLevel, selectedTopicId, conversationHistory, inputMode, voiceEngine]);

  // Focus input when session starts
  useEffect(() => {
    if (stage === 'session' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [stage]);

  // Render setup stage
  if (stage === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">AI Tutor</h1>
            <p className="text-gray-600 mt-2">
              Practice with an AI tutor across any subject and level.
            </p>
          </div>

          {/* Setup form */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
            {/* Status header — shows the user exactly which steps remain
                so they don't feel like they're walking down an unknown
                tunnel of dropdowns. Subject → Level → Topic → Start. */}
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap text-sm">
                <span className="font-semibold text-blue-900">3 quick choices to begin:</span>
                <StepChip label="Subject" done={!!selectedSubject} />
                <span className="text-blue-300">›</span>
                <StepChip label="Level" done={!!selectedLevel} />
                <span className="text-blue-300">›</span>
                <StepChip label="Topic" done={!!selectedTopicId} />
                <span className="text-blue-300">›</span>
                <span className="text-blue-700/70 text-xs italic">then Start</span>
              </div>
            </div>

            {/* Name input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Subject selection */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">1</span>
                Subject
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                onInput={(e) => handleSubjectChange((e.target as HTMLSelectElement).value)}
                onBlur={(e) => {
                  const v = (e.target as HTMLSelectElement).value;
                  if (v !== selectedSubject) handleSubjectChange(v);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a subject…</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level selection */}
            {selectedSubject && (
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">2</span>
                  Level
                </label>
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  onInput={(e) => handleLevelChange((e.target as HTMLSelectElement).value)}
                  onBlur={(e) => {
                    const v = (e.target as HTMLSelectElement).value;
                    if (v !== selectedLevel) handleLevelChange(v);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a level…</option>
                  {availableLevels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic selection */}
            {selectedLevel && availableTopics.length > 0 && (
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">3</span>
                  Topic
                </label>
                <select
                  id="topic"
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  onInput={(e) => setSelectedTopicId((e.target as HTMLSelectElement).value)}
                  onBlur={(e) => {
                    const v = (e.target as HTMLSelectElement).value;
                    if (v !== selectedTopicId) setSelectedTopicId(v);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a topic…</option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Lesson plan — the primary "what are we doing today" picker.
                Visually emphasized: bigger, bolder, blue accent. When blank,
                the tutor runs in free-conversation mode. */}
            {selectedTopicId && availableLessonPlans.length > 0 && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50/40 p-4">
                <label htmlFor="lesson-plan" className="block text-base font-semibold text-blue-900 mb-1">
                  ✨ Pick a lesson
                </label>
                <p className="text-xs text-blue-700/70 mb-3">
                  Or leave blank for open conversation.
                </p>
                <select
                  id="lesson-plan"
                  value={selectedLessonPlanId}
                  onChange={(e) => setSelectedLessonPlanId(e.target.value)}
                  onInput={(e) => setSelectedLessonPlanId((e.target as HTMLSelectElement).value)}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                >
                  <option value="">— Just chat (no plan) —</option>
                  {availableLessonPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} · {p.estimatedMinutes} min
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mode is fixed to Voice — the in-session UI lets the
                student type as a fallback. No setup-time choice. */}


            {/* Start button */}
            <button
              onClick={handleStartSession}
              disabled={!canStartSession}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {inputMode === 'voice' ? <Mic className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              Start {inputMode === 'voice' ? 'Voice' : ''} Session
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Sessions are 30 minutes. You can end early anytime.</p>
            {inputMode === 'voice' && (
              <p className="mt-1 text-blue-600">Microphone access required for voice mode</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render session stage
  if (stage === 'session') {
    return (
      <div ref={pageContainerRef} className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden">
        {/* Desmos Graphing Calculator API */}
        <Script
          src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=47658ec5a4894397ae1e1a46a6174a9a"
          strategy="lazyOnload"
        />
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b px-4 py-2">
          <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-shrink-0 max-w-[60%] sm:max-w-[40%]">
              {/* When a lesson plan is active, the title IS the lesson — the
                  topic + level live in the subtitle. Otherwise, fall back
                  to topic display name + session-goal subtitle. */}
              {lessonProgress.plan ? (
                <>
                  <h1 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {lessonProgress.plan.title}
                  </h1>
                  <p className="text-xs text-gray-500 truncate hidden sm:block">
                    {topicDisplayName} · grade {lessonProgress.plan.grade}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="font-semibold text-gray-900 truncate">
                    {topicDisplayName || 'AI Tutor'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {sessionGoal === 'practice'
                      ? 'Practice Session'
                      : sessionGoal === 'homework-help'
                      ? 'Homework Help'
                      : sessionGoal === 'concept-review'
                      ? 'Concept Review'
                      : 'Test Prep'}
                  </p>
                </>
              )}
            </div>
            {/* Lesson-plan progress strip — sits inline with the title so
                it doesn't claim its own row. Hidden when no plan is active. */}
            {lessonProgress.plan && (
              <div className="hidden md:block flex-1 min-w-0 overflow-x-auto">
                <LessonPlanProgress plan={lessonProgress.plan} currentSegmentId={lessonProgress.currentSegmentId} />
              </div>
            )}
          </div>
        </header>

        {/* Session controls */}
        <div className="flex-shrink-0 container mx-auto px-4 py-1">
          <SessionControls
            sessionId={sessionId}
            maxDuration={30}
            onEndSession={handleEndSession}
            onUploadHomework={handleUploadHomework}
            transcript={transcript}
            whiteboardCommands={whiteboardCommands}
            topicName={topicDisplayName || 'AI Tutor'}
            sessionGoal={sessionGoal}
            studentName={studentName || undefined}
            subject={selectedSubject}
            level={selectedLevel}
          />
        </div>

        {/* Main content - resizable split on desktop, tabbed on mobile */}
        <div
          ref={splitContainerRef}
          className="flex-1 min-h-0 px-2 sm:px-4 py-1 flex flex-col"
        >
          {/* Status message banner */}
          {statusMessage && (
            <div className="flex items-center justify-center gap-2 py-1.5 px-4 mb-1 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 animate-pulse flex-shrink-0">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              {statusMessage}
            </div>
          )}

          {/* Mobile-only tab toggle. On desktop (lg+) the split layout
              shows both panels side-by-side and these tabs are hidden. */}
          <div className="lg:hidden flex gap-1 mb-2 bg-gray-100 rounded-lg p-1 flex-shrink-0">
            <button
              onClick={() => setMobileTab('chat')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mobileTab === 'chat' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setMobileTab('whiteboard')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mobileTab === 'whiteboard' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'
              }`}
            >
              📝 Board
              {whiteboardCommands.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {whiteboardCommands.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          {/* Transcript */}
          <div
            className={`min-h-0 bg-white rounded-lg shadow-lg overflow-hidden flex-col ${
              mobileTab === 'chat' ? 'flex' : 'hidden'
            } lg:flex`}
            style={{ width: isDesktop ? `${splitPercent}%` : '100%' }}
          >
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TranscriptView
                transcript={transcript}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Draggable split handle */}
          <div
            onMouseDown={handleSplitMouseDown}
            className="hidden lg:flex w-4 cursor-col-resize items-center justify-center group hover:bg-blue-100 active:bg-blue-200 transition-colors flex-shrink-0 rounded"
            title="Drag to resize panels"
          >
            <div className="flex flex-col gap-1 items-center">
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            </div>
          </div>

          {/* Whiteboard — full width on mobile (when its tab is active),
              splitPercent-based width on desktop. */}
          <div
            className={`min-h-0 bg-white rounded-lg shadow-lg overflow-hidden flex-col h-full ${
              mobileTab === 'whiteboard' ? 'flex' : 'hidden'
            } lg:flex`}
            style={{ width: isDesktop ? `${100 - splitPercent}%` : '100%' }}
          >
            <WhiteboardCanvas
              commands={whiteboardCommands}
              tutorBusy={isProcessing || (transcript.some((t) => t.role === 'tutor') && whiteboardCommands.length === 0)}
              onClear={() => setWhiteboardCommands([])}
              onAttentionShift={() => {
                // Tutor wants the student to look at the board — auto-
                // switch mobile tabs so they actually see it. No-op on
                // desktop where both panels are visible.
                if (!isDesktop) setMobileTab('whiteboard');
              }}
              onTryYourselfAnswer={(answer, expected, isCorrect) => {
                // Route the student's submitted answer back to the brain
                // as a synthetic student turn so the tutor can react with
                // personalized feedback. Wrap in a marker the brain
                // recognizes as a structured submission (not free chat).
                const correctness = isCorrect === true ? 'matches expected' : isCorrect === false ? 'does not match expected' : 'no expected answer set';
                const marker = `[try-yourself submission] The student submitted: "${answer}". Expected: ${expected ?? '(none)'} (${correctness}). Respond accordingly.`;
                if (realtimeHandleRef.current) {
                  realtimeHandleRef.current.sendTextMessage(marker);
                }
              }}
              onStudentInput={(type, content) => {
                // Add student input to whiteboard as a command
                const cmd: WhiteboardCommand = type === 'image'
                  ? { action: 'showSvgDiagram', title: 'Student Upload', svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="290" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
                  : type === 'drawing'
                  ? { action: 'showSvgDiagram', title: 'Student Drawing', svg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg"><image href="${content}" x="5" y="5" width="390" height="140" preserveAspectRatio="xMidYMid meet"/></svg>` } as WhiteboardCommand
                  // Plain text — render as SVG text, NOT LaTeX (avoids mangling x, =, etc.)
                  : { action: 'showSvgDiagram', title: 'Student Answer', svg: `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="390" height="50" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/><text x="200" y="22" text-anchor="middle" font-size="11" fill="#6b7280">Student wrote:</text><text x="200" y="42" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e40af">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text></svg>` } as WhiteboardCommand;

                setWhiteboardCommands(prev => [...prev, cmd]);

                // Show status message while processing
                if (type === 'drawing') setStatusMessage('✏️ Reading your drawing...');
                else if (type === 'image') setStatusMessage('📷 Analyzing your image...');
                else if (type === 'text') setStatusMessage('💬 Processing...');

                // Notify the AI about the student's input
                if (realtimeHandleRef.current) {
                  if (type === 'text') {
                    realtimeHandleRef.current.sendTextMessage(
                      `[The student wrote on the whiteboard: "${content}". Respond to what they wrote.]`
                    );
                    setTimeout(() => setStatusMessage(null), 1000);
                  } else if (type === 'drawing') {
                    // Send drawing to Claude to extract what's written, then tell the AI
                    (async () => {
                      try {
                        // Strip data URL prefix to get raw base64
                        const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
                        const resp = await fetch('/api/tutor/extract-homework', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            imageData: base64Data,
                            mimeType: 'image/png',
                            subject: selectedSubject,
                            topic: selectedTopicId,
                            level: selectedLevel,
                          }),
                        });
                        const data = await resp.json();
                        setStatusMessage(null);
                        if (data.extractedProblem && realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student drew on the whiteboard. Their drawing contains: "${data.extractedProblem}". Respond to what they drew and wrote.]`
                          );
                        } else if (realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student drew something on the whiteboard. Ask them to explain what they drew.]`
                          );
                        }
                      } catch {
                        setStatusMessage(null);
                        realtimeHandleRef.current?.sendTextMessage(
                          `[The student drew something on the whiteboard. Ask them to explain what they drew.]`
                        );
                      }
                    })();
                  } else if (type === 'image') {
                    // Process image through vision to extract content before telling the AI
                    (async () => {
                      try {
                        const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
                        const resp = await fetch('/api/tutor/extract-homework', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            imageData: base64Data,
                            mimeType: 'image/png',
                            subject: selectedSubject,
                            topic: selectedTopicId,
                            level: selectedLevel,
                          }),
                        });
                        const data = await resp.json();
                        setStatusMessage(null);
                        if (data.extractedProblem && realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student uploaded an image to the whiteboard. The image contains: "${data.extractedProblem}". Respond to what they shared.]`
                          );
                        } else if (realtimeHandleRef.current) {
                          realtimeHandleRef.current.sendTextMessage(
                            `[The student uploaded an image to the whiteboard but the content could not be extracted. Ask them to describe what the image shows.]`
                          );
                        }
                      } catch {
                        setStatusMessage(null);
                        realtimeHandleRef.current?.sendTextMessage(
                          `[The student uploaded an image to the whiteboard but it could not be analyzed. Ask them to describe what the image shows.]`
                        );
                      }
                    })();
                  }
                }

                trackInteraction('click', `whiteboard-${type}`, { content: content.slice(0, 100) });
              }}
            />
          </div>
          </div>{/* close inner flex */}
        </div>

        {/* Vertical resize handle — desktop only; mobile uses tabs and
            doesn't need a vertical drag-to-resize splitter. */}
        <div
          onMouseDown={handleVerticalMouseDown}
          className="hidden lg:flex flex-shrink-0 h-2 cursor-row-resize items-center justify-center group hover:bg-blue-100 active:bg-blue-200 transition-colors bg-white border-t"
          title="Drag to resize"
        >
          <div className="flex gap-1 items-center">
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
            <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500" />
          </div>
        </div>

        {/* Input area. On mobile, the voice-tutor's text input wraps to a
            second row (flex-wrap), which a fixed-height parent + overflow-hidden
            would clip. So height is fixed only on desktop; on mobile we let
            the row grow to fit its wrapped contents. */}
        <div
          className={`bg-white flex-shrink-0 ${inputMode === 'voice' ? 'px-2 py-0' : 'px-4 py-4 overflow-hidden'} lg:overflow-hidden`}
          style={isDesktop ? { height: `${inputHeight}px` } : undefined}
        >
          <div className={inputMode === 'voice' ? '' : 'container mx-auto'}>
            {inputMode === 'voice' && selectedTopicId ? (
              (voiceEngine === 'realtime' || voiceEngine === 'realtime-validated' || voiceEngine === 'claude-brain') ? (
                <VoiceTutorRealtime
                  subject={selectedSubject}
                  topic={selectedTopicId}
                  level={selectedLevel}
                  studentName={studentName || undefined}
                  sessionId={sessionId}
                  sessionStartedAtMs={sessionStartTimeRef.current?.getTime()}
                  sessionGoal={sessionGoal}
                  lessonPlanId={selectedLessonPlanId || undefined}
                  voice={selectedOpenAIVoice}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onUsageUpdate={handleRealtimeUsage}
                  onDebugEvent={addDebugEvent}
                  onError={(err) => setError(err.message)}
                  onEndSession={handleEndSession}
                  onTrackInteraction={trackInteraction}
                  handleRef={realtimeHandleRef}
                  validateToolCalls={voiceEngine === 'realtime-validated'}
                  claudeBrainMode={voiceEngine === 'claude-brain'}
                  ttsProvider={ttsProvider}
                  onLessonPlanProgress={setLessonProgress}
                  onTutorBusy={setIsProcessing}
                />
              ) : voiceEngine === 'gemini-live' ? (
                <VoiceTutorGemini
                  subject={selectedSubject}
                  topic={selectedTopicId}
                  level={selectedLevel}
                  studentName={studentName || undefined}
                  sessionGoal={sessionGoal}
                  voice={selectedOpenAIVoice}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onUsageUpdate={handleRealtimeUsage}
                  onError={(err) => setError(err.message)}
                  onEndSession={handleEndSession}
                  onTrackInteraction={trackInteraction}
                />
              ) : (
                <VoiceTutor
                  subject={selectedSubject}
                  topic={selectedTopicId}
                  level={selectedLevel}
                  studentName={studentName || undefined}
                  sessionGoal={sessionGoal}
                  voiceId={selectedVoice}
                  externalConversationHistory={conversationHistory}
                  externalTranscript={transcript}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onConversationHistoryUpdate={handleVoiceConversationHistoryUpdate}
                  onError={(err) => setError(err.message)}
                  onEndSession={handleEndSession}
                  onTrackInteraction={trackInteraction}
                />
              )
            ) : inputMode === 'text' ? (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !inputText.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Send
                </button>
              </form>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Loading session...
              </div>
            )}
          </div>
        </div>

        {/* Error toast */}
        {error && (
          <div className="fixed bottom-20 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render summary stage
  // Pull what was covered + how far the lesson plan got + minutes used.
  const sessionSummary = realtimeHandleRef.current?.getSessionSummary?.() ?? { topicsCovered: [], weakTopics: [] };
  const segmentsCompletedIdx = lessonProgress.plan
    ? lessonProgress.plan.segments.findIndex((s) => s.id === lessonProgress.currentSegmentId)
    : -1;
  const segmentsCompleted = lessonProgress.plan
    ? (segmentsCompletedIdx >= 0 ? segmentsCompletedIdx : lessonProgress.plan.segments.length)
    : 0;
  const totalSegments = lessonProgress.plan?.segments.length ?? 0;
  const planCompletePct = totalSegments > 0 ? Math.round((segmentsCompleted / totalSegments) * 100) : 0;
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Nice work, {studentName || 'student'}!
          </h1>
          <p className="text-gray-600">
            {lessonProgress.plan
              ? `You spent time on ${lessonProgress.plan.title}.`
              : `You spent time on ${topicDisplayName || 'AI Tutor'}.`}
          </p>
        </div>

        {/* Lesson plan progress card — only when a plan was active. */}
        {lessonProgress.plan && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">Lesson progress</h2>
              <span className="text-sm font-medium text-gray-600">
                {segmentsCompleted} of {totalSegments} segments · {planCompletePct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${planCompletePct}%` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {lessonProgress.plan.segments.map((s, i) => {
                const done = i < segmentsCompleted;
                return (
                  <span
                    key={s.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      done ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {done ? '✓' : '○'} {s.kind.replace(/_/g, ' ')}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* What you covered */}
        {sessionSummary.topicsCovered.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">What you covered</h2>
            <ul className="space-y-1.5">
              {sessionSummary.topicsCovered.map((t, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas to revisit (only when present) */}
        {sessionSummary.weakTopics.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-amber-400">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Worth revisiting</h2>
            <p className="text-xs text-gray-500 mb-3">Topics that came up more than once — try a focused practice session.</p>
            <ul className="space-y-1.5">
              {sessionSummary.weakTopics.slice(0, 5).map((w, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⚡</span>
                  <span>{w.topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested next step — pull from the lesson plan's followUps if any */}
        {lessonProgress.plan && lessonProgress.plan.followUps && lessonProgress.plan.followUps.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold text-blue-900 mb-2">Suggested next</h2>
            <p className="text-sm text-blue-800">
              When you&apos;re ready, the natural next step is one of: <span className="font-medium">{lessonProgress.plan.followUps.join(', ')}</span>
            </p>
          </div>
        )}

        {/* Stats card */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-xs text-gray-500">Messages</p>
            <p className="text-xl font-bold text-gray-900">{transcript.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-xs text-gray-500">Whiteboard items</p>
            <p className="text-xl font-bold text-gray-900">{whiteboardCommands.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-xs text-gray-500">Topic</p>
            <p className="text-sm font-medium text-gray-900 truncate" title={topicDisplayName}>{topicDisplayName || 'N/A'}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {transcript.length > 0 && (
            <button
              onClick={async () => {
                try {
                  const { exportTutorSessionPDF } = await import('@/lib/utils/export/pdf-tutor-session');
                  await exportTutorSessionPDF(
                    transcript,
                    whiteboardCommands,
                    topicDisplayName || 'AI Tutor',
                    sessionGoal,
                    studentName || undefined,
                    { subject: selectedSubject, level: selectedLevel }
                  );
                } catch (err) {
                  console.error('PDF export error:', err);
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Session PDF
            </button>
          )}
          <button
            onClick={() => {
              setSessionId(`session-${Date.now()}`);
              setTranscript([]);
              setConversationHistory([]);
              setWhiteboardCommands([]);
              setTokenUsage([]);
              setStage('setup');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Session
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
