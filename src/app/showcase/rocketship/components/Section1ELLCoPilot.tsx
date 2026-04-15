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

// Toggle: flip to false to fall back to plain text bubbles with no visual strip.
const VISUAL_CUES_ENABLED = true;

interface ParsedAssistantMessage {
  text: string;
  vocabSpotlight: VocabWord[] | null;
  visualCues: string[];
}

function parseAssistantMessage(raw: string): ParsedAssistantMessage {
  const fenced = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  const bare = raw.match(/\{\s*"vocabSpotlight"[\s\S]*?\]\s*(?:,\s*"visualCues"\s*:\s*\[[^\]]*\])?\s*\}/);
  const jsonStr = fenced ? fenced[1] : bare ? bare[0] : null;

  let vocabSpotlight: VocabWord[] | null = null;
  let visualCues: string[] = [];
  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.vocabSpotlight)) vocabSpotlight = parsed.vocabSpotlight;
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
    .replace(/\{\s*"vocabSpotlight"[\s\S]*?\]\s*(?:,\s*"visualCues"\s*:\s*\[[^\]]*\])?\s*\}/, '')
    .replace(/\{\s*"vocabSpotlight"[\s\S]*$/, '')
    .trim();

  return { text, vocabSpotlight, visualCues };
}

const PICTURE_PROMPTS: { emoji: string; word: string }[] = [
  { emoji: '🏠', word: 'Home' },
  { emoji: '🌳', word: 'Trees' },
  { emoji: '🛝', word: 'Park' },
  { emoji: '👨‍👩‍👧', word: 'Family' },
];

export default function Section1ELLCoPilot() {
  const [widaLevel, setWidaLevel] = useState<WidaLevel>('Developing');
  const [bilingualMode, setBilingualMode] = useState(true);
  const [input, setInput] = useState('');
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([
    { word: 'houses', definition: 'The buildings where people live with their families.', example: 'The houses on my street are red and blue.' },
    { word: 'park', definition: 'A place with grass and trees where kids play.', example: 'We play at the park after school.' },
    { word: 'trees', definition: 'Tall plants with leaves that grow from the ground.', example: 'Big trees grow next to my house.' },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking, speakingId } = useTTS();
  const presenterMode = usePresenterMode();

  const extraBody = useMemo(
    () => ({ mode: 'ell', widaLevel, bilingualMode }),
    [widaLevel, bilingualMode]
  );

  const handleComplete = useCallback((fullText: string) => {
    const parsed = parseAssistantMessage(fullText);
    if (parsed.vocabSpotlight?.length) {
      setVocabWords(parsed.vocabSpotlight);
    }
  }, []);

  const { messages, isStreaming, error, sendMessage, resetChat } = useStreamChat({
    endpoint: '/api/showcase/rocketship/chat',
    extraBody,
    onComplete: handleComplete,
  });

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    vocabWords.forEach((v) => {
      const key = v.word.toLowerCase();
      if (imageCache[key]) return;
      fetch(`/api/showcase/rocketship/unsplash?q=${encodeURIComponent(v.word)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (cancelled || !data?.url) return;
          setImageCache((prev) => ({ ...prev, [key]: data.url }));
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [vocabWords, imageCache]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    sendMessage(trimmed);
  };

  const parsedAssistantMessages = useMemo(() => {
    const map: Record<number, ParsedAssistantMessage> = {};
    messages.forEach((m, i) => {
      if (m.role === 'assistant') map[i] = parseAssistantMessage(m.content);
    });
    return map;
  }, [messages]);

  // Prefetch Unsplash thumbnails for every visual cue across every assistant bubble.
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
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
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
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} className="flex justify-end">
                  <div
                    className="max-w-[80%] px-4 rounded-2xl rounded-br-md text-white"
                    style={{
                      backgroundColor: '#C8402A',
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
            const parsed = parsedAssistantMessages[i] ?? { text: msg.content, vocabSpotlight: null, visualCues: [] };
            const cleaned = parsed.text;
            const cues = VISUAL_CUES_ENABLED ? parsed.visualCues : [];
            const bubbleTTSId = `bubble-${i}`;
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
                      <VolumeX className="w-3.5 h-3.5" style={{ color: '#C8402A' }} />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" style={{ color: '#2A7B6F' }} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type as Sofia..."
              disabled={isStreaming}
              className="flex-1 px-4 rounded-xl border focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{ borderColor: '#E5E0DB', color: '#1A1A1A', minHeight: '56px', fontSize: '16px' }}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-4 rounded-xl text-white transition-all disabled:opacity-50 hover:brightness-110"
              style={{ backgroundColor: '#C8402A', minHeight: '56px' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {/* Picture prompt tiles */}
          <div className="flex gap-2 mt-2">
            {PICTURE_PROMPTS.map((p) => (
              <button
                key={p.word}
                type="button"
                onClick={() => {
                  setInput(`My neighborhood has ${p.word.toLowerCase()}...`);
                  inputRef.current?.focus();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:bg-white"
                style={{ borderColor: '#E5E0DB', backgroundColor: '#FFF8F5', color: '#1A1A1A' }}
              >
                <span className="text-base leading-none">{p.emoji}</span>
                <span>{p.word}</span>
              </button>
            ))}
          </div>
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
                  {imageCache[vocab.word.toLowerCase()] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imageCache[vocab.word.toLowerCase()]}
                      alt={vocab.word}
                      width={80}
                      height={80}
                      className="rounded-lg mb-2"
                      style={{ objectFit: 'cover', width: '80px', height: '80px' }}
                    />
                  ) : (
                    <div
                      className="rounded-lg mb-2"
                      style={{ width: '80px', height: '80px', backgroundColor: '#E5E0DB' }}
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <div className="font-semibold" style={{ color: '#C8402A', fontSize: '14px' }}>
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
                  <div className="mt-0.5" style={{ color: '#6B6B6B', fontSize: '12px' }}>
                    {vocab.definition}
                  </div>
                  <div className="mt-1 italic" style={{ color: '#6B6B6B', fontSize: '12px' }}>
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
