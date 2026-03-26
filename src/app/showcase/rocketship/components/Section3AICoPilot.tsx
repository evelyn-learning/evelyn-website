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

const CHECKLIST: Record<Phase, { task: string; subtasks: string[] }> = {
  Brainstorm: {
    task: 'Generate ideas about your neighborhood',
    subtasks: [
      'List 3 places in your neighborhood',
      'Think about what makes your neighborhood special',
      'Talk about who lives there',
    ],
  },
  Draft: {
    task: 'Write your first draft',
    subtasks: [
      'Write a topic sentence',
      'Add 2-3 detail sentences',
      'Write a closing sentence',
    ],
  },
  Revise: {
    task: 'Make your writing stronger',
    subtasks: [
      'Check: Does each sentence connect to my main idea?',
      'Add one descriptive detail',
      'Fix any spelling or grammar',
    ],
  },
  Present: {
    task: 'Practice sharing your writing',
    subtasks: [
      'Read your writing out loud once',
      'Practice explaining your main idea in one sentence',
      'Think of one question your audience might ask',
    ],
  },
};

export default function Section3AICoPilot() {
  const [phase, setPhase] = useState<Phase>('Brainstorm');
  const [input, setInput] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [readingLevel, setReadingLevel] = useState({ grade: 'Grade 3', lexile: '520L' });
  const [speakResponses, setSpeakResponses] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking, speakingId } = useTTS();
  const presenterMode = usePresenterMode();

  const extraBody = useMemo(() => ({ mode: 'copilot', projectPhase: phase }), [phase]);

  const cleanContent = useCallback((content: string) => {
    return content
      // Remove JSON block with or without markdown code fences
      .replace(/```json\s*\{[\s\S]*?\}\s*```/g, '')
      .replace(/```\s*\{[\s\S]*?\}\s*```/g, '')
      .replace(/\{"readingLevel":\s*"[^"]*",\s*"lexile":\s*"[^"]*"\}/, '')
      .trim();
  }, []);

  const handleComplete = useCallback((fullText: string) => {
    // Extract JSON whether bare or wrapped in code fences
    const fencedMatch = fullText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const bareMatch = fullText.match(/\{"readingLevel":\s*"[^"]*",\s*"lexile":\s*"[^"]*"\}/);
    const jsonMatch = fencedMatch ? [fencedMatch[1]] : bareMatch;
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.readingLevel && parsed.lexile) {
          setReadingLevel({ grade: parsed.readingLevel, lexile: parsed.lexile });
        }
      } catch {
        // keep existing
      }
    }

    // Auto-speak if enabled
    if (speakResponses) {
      const cleaned = cleanContent(fullText);
      if (cleaned) {
        speak(cleaned, 'auto-speak');
      }
    }
  }, [speakResponses, speak, cleanContent]);

  const { messages, isStreaming, error, sendMessage, resetChat } = useStreamChat({
    endpoint: '/api/showcase/rocketship/chat',
    extraBody,
    onComplete: handleComplete,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'text-white shadow-sm' : 'border hover:bg-gray-50'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: p.color }
                      : { borderColor: '#E5E0DB', color: '#6B6B6B' }
                  }
                >
                  <Icon className="w-4 h-4" />
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
              const isChecked = checkedItems.has(subtask);
              return (
                <button
                  key={subtask}
                  onClick={() => toggleCheck(subtask)}
                  className="flex items-start gap-2 w-full text-left"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2A7B6F' }} />
                  ) : (
                    <Square className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#E5E0DB' }} />
                  )}
                  <span
                    className={`text-xs leading-relaxed ${isChecked ? 'line-through' : ''}`}
                    style={{ color: isChecked ? '#6B6B6B' : '#1A1A1A' }}
                  >
                    {subtask}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#E5E0DB' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: '#6B6B6B' }}>Progress</span>
              <span className="text-[10px] font-medium" style={{ color: '#2A7B6F' }}>
                {checklist.subtasks.filter((s) => checkedItems.has(s)).length}/{checklist.subtasks.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: '#E5E0DB' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: '#2A7B6F',
                  width: `${(checklist.subtasks.filter((s) => checkedItems.has(s)).length / checklist.subtasks.length) * 100}%`,
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
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-1.5`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'text-white rounded-br-md' : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? { backgroundColor: currentPhase.color }
                    : { backgroundColor: '#f5f0ed', color: '#1A1A1A' }
                }
              >
                {msg.role === 'user' ? msg.content : renderChatContent(cleanContent(msg.content))}
              </div>
              {/* Per-message speak button for assistant */}
              {msg.role === 'assistant' && cleanContent(msg.content) && !isStreaming && (
                <button
                  onClick={() => {
                    const cleaned = cleanContent(msg.content);
                    if (speakingId === `msg-${i}` && isSpeaking) {
                      stop();
                    } else {
                      speak(cleaned, `msg-${i}`);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 mb-1"
                  title="Listen"
                >
                  {speakingId === `msg-${i}` && isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5" style={{ color: currentPhase.color }} />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
                  )}
                </button>
              )}
            </div>
          ))}
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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type as Marco (${phase} mode)...`}
              disabled={isStreaming}
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{ borderColor: '#E5E0DB', color: '#1A1A1A' }}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-4 py-2.5 rounded-xl text-white transition-all disabled:opacity-50 hover:brightness-110"
              style={{ backgroundColor: currentPhase.color }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
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
