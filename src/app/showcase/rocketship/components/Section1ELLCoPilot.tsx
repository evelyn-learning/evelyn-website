'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, RotateCcw, Globe, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { useStreamChat } from './useStreamChat';
import { renderChatContent } from './renderMarkdown';
import { useTTS } from './useTTS';
import { usePresenterMode } from './PresenterContext';

const WIDA_LEVELS = ['Emerging', 'Developing', 'Expanding', 'Bridging'] as const;
type WidaLevel = (typeof WIDA_LEVELS)[number];

const WIDA_DESCRIPTIONS: Record<WidaLevel, string> = {
  Emerging: 'Beginning English — single words, simple phrases',
  Developing: 'Simple sentences, basic academic vocabulary',
  Expanding: 'Expanded sentences, growing academic language',
  Bridging: 'Near grade-level, complex academic language',
};

interface VocabWord {
  word: string;
  definition: string;
  example: string;
}

export default function Section1ELLCoPilot() {
  const [widaLevel, setWidaLevel] = useState<WidaLevel>('Developing');
  const [bilingualMode, setBilingualMode] = useState(true);
  const [input, setInput] = useState('');
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([
    { word: 'neighborhood', definition: 'The area around where you live', example: 'My neighborhood has a park and a school.' },
    { word: 'describe', definition: 'To tell about something using words', example: 'Can you describe your favorite place?' },
    { word: 'community', definition: 'A group of people who live near each other', example: 'Our community has many families.' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking, speakingId } = useTTS();
  const presenterMode = usePresenterMode();

  const extraBody = useMemo(
    () => ({ mode: 'ell', widaLevel, bilingualMode }),
    [widaLevel, bilingualMode]
  );

  const handleComplete = useCallback((fullText: string) => {
    // Extract JSON whether bare or wrapped in code fences
    const fencedMatch = fullText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const bareMatch = fullText.match(/\{"vocabSpotlight":\s*\[[\s\S]*?\]\}/);
    const jsonStr = fencedMatch ? fencedMatch[1] : bareMatch ? bareMatch[0] : null;
    if (jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.vocabSpotlight?.length) {
          setVocabWords(parsed.vocabSpotlight);
        }
      } catch {
        // keep existing vocab
      }
    }
  }, []);

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

  const cleanContent = (content: string) => {
    return content
      .replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/g, '')
      .replace(/\{"vocabSpotlight":\s*\[[\s\S]*?\]\}/, '')
      .trim();
  };

  const widaIndex = WIDA_LEVELS.indexOf(widaLevel);

  return (
    <div className="flex gap-5 h-[calc(100vh-10rem)]">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
        {/* Student context bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#E5E0DB', backgroundColor: '#FFF8F5' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#C8402A' }}>
              S
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>Sofia — Grade 3 ELL Student</div>
              <div className="text-[11px]" style={{ color: '#6B6B6B' }}>Writing prompt: &quot;Describe your neighborhood&quot;</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBilingualMode(!bilingualMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                bilingualMode ? 'text-white' : 'border'
              }`}
              style={
                bilingualMode
                  ? { backgroundColor: '#2A7B6F' }
                  : { borderColor: '#E5E0DB', color: '#6B6B6B' }
              }
            >
              <Globe className="w-3 h-3" />
              Bilingual {bilingualMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={resetChat}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" style={{ color: '#6B6B6B' }} />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                Writing prompt: &quot;Describe your neighborhood&quot;
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                Type as Sofia to start the conversation. The AI will guide her writing using Socratic scaffolding.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? { backgroundColor: '#C8402A' }
                    : { backgroundColor: '#f5f0ed', color: '#1A1A1A' }
                }
              >
                {msg.role === 'user' ? msg.content : renderChatContent(cleanContent(msg.content))}
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#C8402A', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#C8402A', animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#C8402A', animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center text-xs text-red-500 py-2">{error}</div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t" style={{ borderColor: '#E5E0DB' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type as Sofia..."
              disabled={isStreaming}
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{ borderColor: '#E5E0DB', color: '#1A1A1A' }}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-4 py-2.5 rounded-xl text-white transition-all disabled:opacity-50 hover:brightness-110"
              style={{ backgroundColor: '#C8402A' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right panel — WIDA Level + Vocab */}
      <div className="w-72 flex flex-col gap-4">
        {/* WIDA Level Dial */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6B6B' }}>
            Language Level Dial
          </h3>
          <div className="space-y-2">
            {WIDA_LEVELS.map((level, i) => (
              <button
                key={level}
                onClick={() => {
                  setWidaLevel(level);
                  resetChat();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  widaLevel === level ? 'font-semibold text-white shadow-sm' : 'hover:bg-gray-50'
                }`}
                style={
                  widaLevel === level
                    ? { backgroundColor: '#2A7B6F' }
                    : { color: '#1A1A1A' }
                }
              >
                <div className="flex items-center justify-between">
                  <span>{level}</span>
                  <span className="text-[10px] opacity-70">WIDA {i + 1}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#E5E0DB' }}>
            <div className="flex items-center gap-1 mb-2">
              {WIDA_LEVELS.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: i <= widaIndex ? '#2A7B6F' : '#E5E0DB',
                  }}
                />
              ))}
            </div>
            <p className="text-[11px]" style={{ color: '#6B6B6B' }}>
              {WIDA_DESCRIPTIONS[widaLevel]}
            </p>
          </div>
        </div>

        {/* Vocab Spotlight */}
        <div className="rounded-2xl border p-5 flex-1" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4" style={{ color: '#2A7B6F' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
              Vocab Spotlight
            </h3>
          </div>
          <div className="space-y-3">
            {vocabWords.map((vocab, i) => {
              const vocabId = `vocab-${i}`;
              const isPlaying = speakingId === vocabId && isSpeaking;
              return (
                <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: '#FFF8F5' }}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm" style={{ color: '#C8402A' }}>
                      {vocab.word}
                    </div>
                    <button
                      onClick={() => {
                        if (isPlaying) {
                          stop();
                        } else {
                          speak(`${vocab.word}. ${vocab.definition}. For example: ${vocab.example}`, vocabId);
                        }
                      }}
                      className={`p-1 rounded-full transition-all ${isPlaying ? 'animate-pulse' : 'hover:bg-white'}`}
                      title={isPlaying ? 'Stop' : `Pronounce "${vocab.word}"`}
                    >
                      {isPlaying ? (
                        <VolumeX className="w-3.5 h-3.5" style={{ color: '#C8402A' }} />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" style={{ color: '#2A7B6F' }} />
                      )}
                    </button>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#1A1A1A' }}>
                    {vocab.definition}
                  </div>
                  <div className="text-[11px] mt-1 italic" style={{ color: '#6B6B6B' }}>
                    &quot;{vocab.example}&quot;
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo watermark — hidden in presenter mode */}
        {!presenterMode && (
          <div className="text-center text-[10px] py-1" style={{ color: '#E5E0DB' }}>
            Demo data — for illustration only
          </div>
        )}
      </div>
    </div>
  );
}
