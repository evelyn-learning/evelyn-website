'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, RotateCcw, Lightbulb, PenLine, RefreshCw, Mic, CheckSquare, Square, Volume2, VolumeX } from 'lucide-react';
import { useStreamChat } from './useStreamChat';
import { renderChatContent } from './renderMarkdown';
import { useTTS } from './useTTS';
import { usePresenterMode } from './PresenterContext';

const PHASES = [
  { id: 'Brainstorm', label: 'Brainstorm', icon: Lightbulb, color: '#F59E0B' },
  { id: 'Draft', label: 'Draft', icon: PenLine, color: '#3B82F6' },
  { id: 'Revise', label: 'Revise', icon: RefreshCw, color: '#8B5CF6' },
  { id: 'Present', label: 'Present', icon: Mic, color: '#10B981' },
] as const;

type Phase = (typeof PHASES)[number]['id'];

interface Subtask {
  emoji: string;
  text: string;
}

const CHECKLIST: Record<Phase, { task: string; subtasks: Subtask[] }> = {
  Brainstorm: {
    task: 'Generate ideas about your neighborhood',
    subtasks: [
      { emoji: '📍', text: 'List 3 places in your neighborhood' },
      { emoji: '✨', text: 'Think about what makes your neighborhood special' },
      { emoji: '👨‍👩‍👧', text: 'Talk about who lives there' },
    ],
  },
  Draft: {
    task: 'Write your first draft',
    subtasks: [
      { emoji: '📝', text: 'Write a topic sentence' },
      { emoji: '➕', text: 'Add 2-3 detail sentences' },
      { emoji: '🏁', text: 'Write a closing sentence' },
    ],
  },
  Revise: {
    task: 'Make your writing stronger',
    subtasks: [
      { emoji: '🔗', text: 'Check: Does each sentence connect to my main idea?' },
      { emoji: '🎨', text: 'Add one descriptive detail' },
      { emoji: '✏️', text: 'Fix any spelling or grammar' },
    ],
  },
  Present: {
    task: 'Practice sharing your writing',
    subtasks: [
      { emoji: '🗣️', text: 'Read your writing out loud once' },
      { emoji: '💡', text: 'Practice explaining your main idea in one sentence' },
      { emoji: '❓', text: 'Think of one question your audience might ask' },
    ],
  },
};

const PICTURE_PROMPTS: Record<Phase, { emoji: string; label: string; starter: string }[]> = {
  Brainstorm: [
    { emoji: '🏠', label: 'Home', starter: 'My neighborhood has a house that...' },
    { emoji: '🌳', label: 'Trees', starter: 'There are trees near...' },
    { emoji: '🛝', label: 'Park', starter: 'The park in my neighborhood has...' },
    { emoji: '👨‍👩‍👧', label: 'Family', starter: 'My family likes to...' },
  ],
  Draft: [
    { emoji: '📝', label: 'Start', starter: 'My neighborhood is...' },
    { emoji: '➕', label: 'Add', starter: 'One more thing is that...' },
    { emoji: '✨', label: 'Detail', starter: 'A special thing is...' },
    { emoji: '🎯', label: 'Main idea', starter: 'The main idea of my writing is...' },
  ],
  Revise: [
    { emoji: '✂️', label: 'Shorter', starter: 'Can I make this shorter: ' },
    { emoji: '🔍', label: 'Check', starter: 'Does this sentence make sense: ' },
    { emoji: '💪', label: 'Stronger', starter: 'How do I make this stronger: ' },
    { emoji: '❓', label: 'Unclear', starter: 'I am not sure about: ' },
  ],
  Present: [
    { emoji: '🗣️', label: 'Say it', starter: 'I want to say my main idea like this: ' },
    { emoji: '🐢', label: 'Slow', starter: 'How do I slow down when I read...' },
    { emoji: '📢', label: 'Loud', starter: 'How do I speak more clearly about...' },
    { emoji: '👀', label: 'Look up', starter: 'How do I remember to look up when...' },
  ],
};

interface ParsedAssistantMessage {
  text: string;
  visualCues: string[];
  readingLevel: string | null;
  lexile: string | null;
}

function parseCopilotMessage(raw: string): ParsedAssistantMessage {
  const fenced = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  const bare = raw.match(/\{\s*"readingLevel"[\s\S]*?\}/);
  const jsonStr = fenced ? fenced[1] : bare ? bare[0] : null;

  let visualCues: string[] = [];
  let readingLevel: string | null = null;
  let lexile: string | null = null;
  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed.readingLevel === 'string') readingLevel = parsed.readingLevel;
      if (typeof parsed.lexile === 'string') lexile = parsed.lexile;
      if (Array.isArray(parsed.visualCues)) {
        visualCues = parsed.visualCues
          .filter((c: unknown): c is string => typeof c === 'string' && c.trim().length > 0)
          .map((c: string) => c.trim().toLowerCase())
          .slice(0, 4);
      }
    } catch {
      // ignore
    }
  }

  const text = raw
    .replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/g, '')
    .replace(/\{\s*"readingLevel"[\s\S]*?\}/, '')
    .replace(/\{\s*"readingLevel"[\s\S]*$/, '')
    .trim();

  return { text, visualCues, readingLevel, lexile };
}

const VISUAL_CUES_ENABLED = true;

export default function Section3AICoPilot() {
  const [phase, setPhase] = useState<Phase>('Brainstorm');
  const [input, setInput] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [readingLevel, setReadingLevel] = useState({ grade: 'Grade 3', lexile: '520L' });
  const [speakResponses, setSpeakResponses] = useState(false);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak, stop, isSpeaking, speakingId } = useTTS();
  const presenterMode = usePresenterMode();

  const extraBody = useMemo(() => ({ mode: 'copilot', projectPhase: phase }), [phase]);

  const handleComplete = useCallback((fullText: string) => {
    const parsed = parseCopilotMessage(fullText);
    if (parsed.readingLevel && parsed.lexile) {
      setReadingLevel({ grade: parsed.readingLevel, lexile: parsed.lexile });
    }
    if (speakResponses && parsed.text) {
      speak(parsed.text, 'auto-speak');
    }
  }, [speakResponses, speak]);

  const { messages, isStreaming, error, sendMessage, resetChat } = useStreamChat({
    endpoint: '/api/showcase/rocketship/chat',
    extraBody,
    onComplete: handleComplete,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parsedAssistantMessages = useMemo(() => {
    const map: Record<number, ParsedAssistantMessage> = {};
    messages.forEach((m, i) => {
      if (m.role === 'assistant') map[i] = parseCopilotMessage(m.content);
    });
    return map;
  }, [messages]);

  useEffect(() => {
    if (!VISUAL_CUES_ENABLED) return;
    let cancelled = false;
    const allCues = new Set<string>();
    Object.values(parsedAssistantMessages).forEach((p) => p.visualCues.forEach((c) => allCues.add(c)));
    allCues.forEach((cue) => {
      if (imageCache[cue]) return;
      fetch(`/api/showcase/rocketship/unsplash?q=${encodeURIComponent(cue)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (cancelled || !data?.url) return;
          setImageCache((prev) => ({ ...prev, [cue]: data.url }));
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [parsedAssistantMessages, imageCache]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    sendMessage(trimmed);
  };

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const currentPhase = PHASES.find((p) => p.id === phase)!;
  const checklist = CHECKLIST[phase];

  return (
    <div className="flex gap-5 h-[calc(100vh-10rem)]">
      {/* Executive Function Sidebar */}
      <div className="w-64 flex flex-col gap-4">
        {/* Project context */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B6B6B' }}>
            Current Project
          </div>
          <div className="text-sm font-semibold mb-1" style={{ color: '#1A1A1A' }}>
            Our Neighborhood
          </div>
          <div className="text-[11px]" style={{ color: '#6B6B6B' }}>
            Grade 3 · Social Studies + ELA Integration
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPhase.color }} />
            <span className="text-xs font-medium" style={{ color: currentPhase.color }}>
              Phase: {phase}
            </span>
          </div>
        </div>

        {/* Phase selector */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6B6B' }}>
            Project Phase
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PHASES.map((p) => {
              const Icon = p.icon;
              const isActive = phase === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPhase(p.id);
                    resetChat();
                    stop();
                  }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'text-white shadow-sm' : 'border hover:bg-gray-50'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: p.color }
                      : { borderColor: '#E5E0DB', color: '#6B6B6B' }
                  }
                >
                  <Icon className="w-8 h-8" strokeWidth={2} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Checklist — Executive Function Ladder */}
        <div className="rounded-2xl border p-4 flex-1" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6B6B' }}>
            Executive Function Ladder
          </div>
          <div className="text-xs font-semibold mb-2" style={{ color: '#1A1A1A' }}>
            {checklist.task}
          </div>
          <div className="space-y-2">
            {checklist.subtasks.map((subtask) => {
              const isChecked = checkedItems.has(subtask.text);
              return (
                <button
                  key={subtask.text}
                  onClick={() => toggleCheck(subtask.text)}
                  className="flex items-start gap-2 w-full text-left"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2A7B6F' }} />
                  ) : (
                    <Square className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#E5E0DB' }} />
                  )}
                  <span className="text-base flex-shrink-0 leading-none mt-0.5" aria-hidden>
                    {subtask.emoji}
                  </span>
                  <span
                    className={`text-xs leading-relaxed ${isChecked ? 'line-through' : ''}`}
                    style={{ color: isChecked ? '#6B6B6B' : '#1A1A1A' }}
                  >
                    {subtask.text}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#E5E0DB' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: '#6B6B6B' }}>Progress</span>
              <span className="text-[10px] font-medium" style={{ color: '#2A7B6F' }}>
                {checklist.subtasks.filter((s) => checkedItems.has(s.text)).length}/{checklist.subtasks.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: '#E5E0DB' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: '#2A7B6F',
                  width: `${(checklist.subtasks.filter((s) => checkedItems.has(s.text)).length / checklist.subtasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
        {/* Student context */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#E5E0DB', backgroundColor: '#FFF8F5' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: currentPhase.color }}>
              M
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>Marco — Grade 3 Rocketeer</div>
              <div className="text-[11px]" style={{ color: '#6B6B6B' }}>
                Project: Our Neighborhood · Phase: {phase}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Reading level indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#f0ebe7', color: '#6B6B6B' }}>
              📖 {readingLevel.grade} · {readingLevel.lexile}
            </div>
            <button onClick={resetChat} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <RotateCcw className="w-4 h-4" style={{ color: '#6B6B6B' }} />
            </button>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🏘️</div>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                Project: Our Neighborhood
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                Type as Marco in {phase} mode. The AI will coach his thinking — never write for him.
              </p>
            </div>
          )}
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} className="flex justify-end">
                  <div
                    className="max-w-[80%] px-4 rounded-2xl rounded-br-md text-white"
                    style={{
                      backgroundColor: currentPhase.color,
                      fontSize: '16px',
                      lineHeight: 1.8,
                      paddingTop: '16px',
                      paddingBottom: '16px',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            }
            const parsed = parsedAssistantMessages[i] ?? { text: msg.content, visualCues: [], readingLevel: null, lexile: null };
            const cleaned = parsed.text;
            const cues = VISUAL_CUES_ENABLED ? parsed.visualCues : [];
            const bubbleTTSId = `msg-${i}`;
            const isThisBubbleSpeaking = speakingId === bubbleTTSId && isSpeaking;
            return (
              <div key={i} className="flex justify-start">
                <div
                  className="max-w-[80%] px-4 rounded-2xl rounded-bl-md relative"
                  style={{
                    backgroundColor: '#f5f0ed',
                    color: '#1A1A1A',
                    fontSize: '16px',
                    lineHeight: 1.8,
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    paddingRight: '36px',
                  }}
                >
                  {cues.length > 0 && (
                    <div className="flex gap-2 mb-2 -mt-1 flex-wrap">
                      {cues.map((cue) => {
                        const url = imageCache[cue];
                        return (
                          <div key={cue} className="flex flex-col items-center" style={{ width: '56px' }}>
                            {url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={url}
                                alt={cue}
                                className="rounded-lg"
                                style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div
                                className="rounded-lg animate-pulse"
                                style={{ width: '56px', height: '56px', backgroundColor: '#E5E0DB' }}
                              />
                            )}
                            <div
                              className="mt-1 text-center font-medium"
                              style={{ fontSize: '11px', color: '#6B6B6B', lineHeight: 1.2 }}
                            >
                              {cue}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {renderChatContent(cleaned)}
                  <button
                    onClick={() => {
                      if (isThisBubbleSpeaking) {
                        stop();
                      } else {
                        speak(cleaned, bubbleTTSId);
                      }
                    }}
                    className={`absolute bottom-1.5 right-1.5 p-1 rounded-full transition-all ${isThisBubbleSpeaking ? 'animate-pulse' : 'hover:bg-white'}`}
                    title={isThisBubbleSpeaking ? 'Stop' : 'Read aloud'}
                  >
                    {isThisBubbleSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5" style={{ color: currentPhase.color }} />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" style={{ color: '#2A7B6F' }} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          {error && <div className="text-center text-xs text-red-500 py-2">{error}</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t" style={{ borderColor: '#E5E0DB' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 items-center"
          >
            {/* Speak responses checkbox */}
            <button
              type="button"
              onClick={() => {
                setSpeakResponses(!speakResponses);
                if (speakResponses) stop();
              }}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all flex-shrink-0 ${
                speakResponses ? 'text-white' : 'border'
              }`}
              style={
                speakResponses
                  ? { backgroundColor: currentPhase.color }
                  : { borderColor: '#E5E0DB', color: '#6B6B6B' }
              }
              title={speakResponses ? 'Turn off auto-speak' : 'Speak AI responses aloud'}
            >
              {speakResponses ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              {speakResponses ? 'Speaking' : 'Speak'}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type as Marco (${phase} mode)...`}
              disabled={isStreaming}
              className="flex-1 px-4 rounded-xl border focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{ borderColor: '#E5E0DB', color: '#1A1A1A', minHeight: '56px', fontSize: '16px' }}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-4 rounded-xl text-white transition-all disabled:opacity-50 hover:brightness-110"
              style={{ backgroundColor: currentPhase.color, minHeight: '56px' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex gap-2 mt-2 flex-wrap">
            {PICTURE_PROMPTS[phase].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setInput(p.starter);
                  inputRef.current?.focus();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:bg-white"
                style={{ borderColor: '#E5E0DB', backgroundColor: '#FFF8F5', color: '#1A1A1A' }}
              >
                <span className="text-base leading-none">{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo watermark — hidden in presenter mode */}
      {!presenterMode && (
        <div className="absolute bottom-2 right-4 text-[10px]" style={{ color: '#E5E0DB' }}>
          Demo data — for illustration only
        </div>
      )}
    </div>
  );
}
