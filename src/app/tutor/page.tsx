'use client';

/**
 * AI Voice Tutor - Main Page
 *
 * The primary interface for voice tutoring sessions.
 * Supports both text and voice modes.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, BookOpen, Play, Send, Loader2, Mic, MessageSquare, DollarSign } from 'lucide-react';
import { getAllModuleMetadata, initializeRegistry, type ModuleMetadata } from '@/lib/knowledge/registry';
import Link from 'next/link';
import { TranscriptView } from './components/TranscriptView';
import { SessionControls } from './components/SessionControls';
import { WhiteboardCanvas } from './components/whiteboard';
import { VoiceTutor } from './components/VoiceTutor';
import { VoiceTutorRealtime } from './components/VoiceTutorRealtime';
import { getInitialGreetingPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import type { SessionGoal, TranscriptEntry, VoiceId, AVAILABLE_VOICES } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from './hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type VoiceEngine = 'classic' | 'realtime';

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
}

// Pricing per 1M tokens (Claude Sonnet 4)
const PRICING = {
  input: 3.0,   // $3 per 1M input tokens
  output: 15.0, // $15 per 1M output tokens
};

function calculateCost(usage: TokenUsage[]): number {
  const totals = usage.reduce(
    (acc, u) => ({
      input: acc.input + u.inputTokens,
      output: acc.output + u.outputTokens,
    }),
    { input: 0, output: 0 }
  );
  return (totals.input / 1_000_000) * PRICING.input + (totals.output / 1_000_000) * PRICING.output;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function TutorPage() {
  const [stage, setStage] = useState<'setup' | 'session' | 'summary'>('setup');
  const [availableTopics, setAvailableTopics] = useState<ModuleMetadata[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ModuleMetadata | null>(null);
  const [sessionGoal, setSessionGoal] = useState<SessionGoal>('practice');
  const [studentName, setStudentName] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  // Voice settings from env - no UI selection needed
  const selectedVoice: VoiceId = ENV_CLASSIC_VOICE;
  const voiceEngine: VoiceEngine = ENV_VOICE_ENGINE;
  const selectedOpenAIVoice: OpenAIVoice = ENV_OPENAI_VOICE;

  // Session state
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [whiteboardCommands, setWhiteboardCommands] = useState<WhiteboardCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Token usage tracking
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [showUsageDetails, setShowUsageDetails] = useState(false);

  // Load available topics from registry
  useEffect(() => {
    const loadTopics = async () => {
      await initializeRegistry();
      const modules = getAllModuleMetadata();
      setAvailableTopics(modules);
      if (modules.length > 0 && !selectedTopic) {
        setSelectedTopic(modules[0]);
      }
    };
    loadTopics();
  }, []);

  // Input state
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Send message to tutor API
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isProcessing || !selectedTopic) return;

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

      try {
        const response = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversationHistory,
            subject: selectedTopic.subject,
            topic: selectedTopic.topic,
            level: selectedTopic.level,
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

        // Update conversation history for context
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: data.rawText || data.text },
        ]);

        // Add whiteboard commands
        if (data.whiteboardCommands?.length > 0) {
          setWhiteboardCommands((prev) => [...prev, ...data.whiteboardCommands]);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsProcessing(false);
      }
    },
    [conversationHistory, selectedTopic, studentName, sessionGoal, isProcessing]
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
    if (!selectedTopic) return;

    setStage('session');
    setTranscript([]);
    setConversationHistory([]);
    setWhiteboardCommands([]);
    setTokenUsage([]); // Reset token usage for new session

    // For voice mode, VoiceTutor handles initialization
    if (inputMode === 'voice') {
      return;
    }

    // For text mode, get initial greeting (context-aware)
    const greetingMessage = getInitialGreetingPrompt(sessionGoal, selectedTopic.topic);

    setIsProcessing(true);
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: greetingMessage,
          conversationHistory: [],
          subject: selectedTopic.subject,
          topic: selectedTopic.topic,
          level: selectedTopic.level,
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
  }, [selectedTopic, studentName, sessionGoal, inputMode]);

  // Handle transcript updates from VoiceTutor
  const handleVoiceTranscriptUpdate = useCallback((entries: TranscriptEntry[]) => {
    setTranscript(entries);
  }, []);

  // Handle whiteboard commands from VoiceTutor
  const handleVoiceWhiteboardCommand = useCallback((commands: WhiteboardCommand[]) => {
    setWhiteboardCommands((prev) => [...prev, ...commands]);
  }, []);

  // Handle conversation history updates from VoiceTutor
  const handleVoiceConversationHistoryUpdate = useCallback((history: ConversationMessage[]) => {
    setConversationHistory(history);
  }, []);

  // End session
  const handleEndSession = useCallback(() => {
    setStage('summary');
  }, []);

  // Upload homework and extract problems
  const handleUploadHomework = useCallback(async (imageData: string, mimeType: string) => {
    if (!selectedTopic) return;
    console.log('[Tutor] Processing homework upload:', mimeType);
    setIsProcessing(true);
    setError(null);

    try {
      // Call the homework extraction API
      const response = await fetch('/api/tutor/extract-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          mimeType,
          subject: selectedTopic.subject,
          topic: selectedTopic.topic,
          level: selectedTopic.level,
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

      // Add user upload message to transcript (shows short text to user)
      const userEntry: TranscriptEntry = {
        id: `user-${Date.now()}`,
        timestamp: new Date(),
        role: 'student',
        text: '[Uploaded homework image]',
      };

      // Add tutor response to transcript
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

      console.log('[Tutor] Homework context stored in conversation history');
    } catch (err) {
      console.error('[Tutor] Homework upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process homework');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTopic, conversationHistory]);

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
              Practice with an AI tutor that helps you learn physics.
            </p>
          </div>

          {/* Setup form */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
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

            {/* Topic selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <div className="grid gap-3">
                {availableTopics.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 border border-dashed rounded-lg">
                    Loading topics...
                  </div>
                ) : (
                  availableTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-4 text-left border rounded-lg transition-all ${
                        selectedTopic?.id === topic.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {topic.displayName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {topic.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ~{topic.estimatedHours} hours to master
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Goal selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you want to do?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'practice', label: 'Practice Problems', icon: '📝' },
                  { id: 'homework-help', label: 'Homework Help', icon: '📚' },
                  { id: 'concept-review', label: 'Review Concepts', icon: '💡' },
                  { id: 'test-prep', label: 'Test Prep', icon: '🎯' },
                ].map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSessionGoal(goal.id as SessionGoal)}
                    className={`p-3 text-left border rounded-lg transition-all ${
                      sessionGoal === goal.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="block mt-1 text-sm font-medium">
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How do you want to interact?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setInputMode('text')}
                  className={`p-4 text-left border rounded-lg transition-all flex items-center gap-3 ${
                    inputMode === 'text'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <div>
                    <span className="block font-medium">Text Chat</span>
                    <span className="text-xs text-gray-500">Type messages</span>
                  </div>
                </button>
                <button
                  onClick={() => setInputMode('voice')}
                  className={`p-4 text-left border rounded-lg transition-all flex items-center gap-3 ${
                    inputMode === 'voice'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Mic className="w-6 h-6 text-blue-600" />
                  <div>
                    <span className="block font-medium">Voice Chat</span>
                    <span className="text-xs text-gray-500">Speak naturally</span>
                  </div>
                </button>
              </div>
            </div>


            {/* Start button */}
            <button
              onClick={handleStartSession}
              disabled={!selectedTopic}
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

  // Calculate totals for display
  const totalTokens = tokenUsage.reduce(
    (acc, u) => ({
      input: acc.input + u.inputTokens,
      output: acc.output + u.outputTokens,
    }),
    { input: 0, output: 0 }
  );
  const totalCost = calculateCost(tokenUsage);

  // Render session stage
  if (stage === 'session') {
    return (
      <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-gray-900">
                {selectedTopic?.displayName || 'AI Tutor'}
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
            </div>

            {/* Token usage badge */}
            {tokenUsage.length > 0 && (
              <button
                onClick={() => setShowUsageDetails(!showUsageDetails)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                title="Click to see usage details"
              >
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-mono text-gray-700">${totalCost.toFixed(4)}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500 text-xs">
                  {totalTokens.input + totalTokens.output} tokens
                </span>
              </button>
            )}
          </div>
        </header>

        {/* Token usage details dropdown */}
        {showUsageDetails && tokenUsage.length > 0 && (
          <div className="flex-shrink-0 bg-white border-b px-4 py-3">
            <div className="container mx-auto">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Session Token Usage</h3>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-gray-500">Input Tokens</p>
                  <p className="font-mono font-medium">{totalTokens.input.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-gray-500">Output Tokens</p>
                  <p className="font-mono font-medium">{totalTokens.output.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-gray-500">Est. Cost</p>
                  <p className="font-mono font-medium">${totalCost.toFixed(4)}</p>
                </div>
              </div>
              <div className="max-h-32 overflow-y-auto text-xs">
                {tokenUsage.map((u, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">{u.operation}</span>
                    <span className="font-mono">{u.inputTokens} in / {u.outputTokens} out</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Session controls */}
        <div className="flex-shrink-0 container mx-auto px-4 py-2">
          <SessionControls
            sessionId={sessionId}
            maxDuration={30}
            onEndSession={handleEndSession}
            onUploadHomework={handleUploadHomework}
          />
        </div>

        {/* Main content - increased height by using more vertical space */}
        <div className="flex-1 min-h-0 container mx-auto px-4 py-2 flex gap-4" style={{ minHeight: '60vh' }}>
          {/* Transcript - increased flex grow */}
          <div className="flex-1 min-h-0 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto" style={{ minHeight: '400px' }}>
              <TranscriptView
                transcript={transcript}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Whiteboard */}
          <div className="hidden lg:flex w-1/2 min-h-0 bg-white rounded-lg shadow-lg overflow-hidden flex-col">
            <WhiteboardCanvas
              commands={whiteboardCommands}
              onClear={() => setWhiteboardCommands([])}
            />
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white border-t px-4 py-4">
          <div className="container mx-auto">
            {inputMode === 'voice' && selectedTopic ? (
              voiceEngine === 'realtime' ? (
                <VoiceTutorRealtime
                  subject={selectedTopic.subject}
                  topic={selectedTopic.topic}
                  level={selectedTopic.level}
                  studentName={studentName || undefined}
                  sessionGoal={sessionGoal}
                  voice={selectedOpenAIVoice}
                  onTranscriptUpdate={handleVoiceTranscriptUpdate}
                  onWhiteboardCommand={handleVoiceWhiteboardCommand}
                  onError={(err) => setError(err.message)}
                  onEndSession={handleEndSession}
                />
              ) : (
                <VoiceTutor
                  subject={selectedTopic.subject}
                  topic={selectedTopic.topic}
                  level={selectedTopic.level}
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
  const usageByOperation = tokenUsage.reduce((acc, u) => {
    if (!acc[u.operation]) {
      acc[u.operation] = { input: 0, output: 0, count: 0 };
    }
    acc[u.operation].input += u.inputTokens;
    acc[u.operation].output += u.outputTokens;
    acc[u.operation].count += 1;
    return acc;
  }, {} as Record<string, { input: number; output: number; count: number }>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Great Session!
        </h1>
        <p className="text-gray-600 mb-8">
          You completed a tutoring session on {selectedTopic?.displayName || 'AI Tutor'}.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Session Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-left mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Messages Exchanged</p>
              <p className="text-2xl font-bold text-gray-900">
                {transcript.length}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Topic</p>
              <p className="text-lg font-medium text-gray-900">
                {selectedTopic?.topic || 'N/A'}
              </p>
            </div>
          </div>

          {/* Token usage summary */}
          {tokenUsage.length > 0 && (
            <>
              <h3 className="text-md font-semibold mb-3 text-left flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Token Usage & Cost
              </h3>
              <div className="grid grid-cols-3 gap-3 text-left mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">Input Tokens</p>
                  <p className="text-lg font-mono font-medium text-blue-700">
                    {totalTokens.input.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">${((totalTokens.input / 1_000_000) * PRICING.input).toFixed(4)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500">Output Tokens</p>
                  <p className="text-lg font-mono font-medium text-green-700">
                    {totalTokens.output.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">${((totalTokens.output / 1_000_000) * PRICING.output).toFixed(4)}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Cost</p>
                  <p className="text-lg font-mono font-medium text-yellow-700">
                    ${totalCost.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-400">{tokenUsage.length} API calls</p>
                </div>
              </div>

              {/* Breakdown by operation */}
              <div className="text-left text-sm bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 mb-2">By Operation</p>
                {Object.entries(usageByOperation).map(([op, data]) => (
                  <div key={op} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                    <span className="text-gray-600">{op} ({data.count}x)</span>
                    <span className="font-mono text-gray-800">
                      {data.input.toLocaleString()} in / {data.output.toLocaleString()} out
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-3 text-left">
                Note: OpenAI Realtime API usage is tracked separately and not included here.
                Pricing: Claude Sonnet 4 - $3/M input, $15/M output tokens.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
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
