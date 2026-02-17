'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// ─── Types ───────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Robust text renderer: markdown + KaTeX ──────────────────────────
// Handles bold (**text**), line breaks, and inline math ($...$)
// Safely ignores unbalanced $ during streaming

function InlineKatex({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: false,
          strict: false,
        });
      } catch {
        ref.current.textContent = `$${latex}$`;
      }
    }
  }, [latex]);
  return <span ref={ref} />;
}

function FormattedText({ text }: { text: string }) {
  // Split into paragraphs by double newline
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => (
        <div key={pi}>
          {para.split('\n').map((line, li) => (
            <React.Fragment key={li}>
              {li > 0 && <br />}
              <FormattedLine text={line} />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

function FormattedLine({ text }: { text: string }) {
  // Parse inline elements: bold (**text**) and math ($...$)
  // Math: only match $ pairs where content is < 150 chars and no newlines
  const tokenRegex = /(\*\*[^*]+\*\*|\$[^$\n]{1,150}\$)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      // Bold
      parts.push(
        <strong key={`b${match.index}`} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('$') && token.endsWith('$')) {
      // Inline math
      parts.push(<InlineKatex key={`m${match.index}`} latex={token.slice(1, -1)} />);
    }

    lastIndex = match.index + token.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <span>{parts.length > 0 ? parts : text}</span>;
}

// ─── Conversation starters ───────────────────────────────────────────
const STARTERS = [
  { emoji: '🌱', text: 'Help me understand photosynthesis' },
  { emoji: '🔢', text: 'How do I solve 3x + 7 = 22?' },
  { emoji: '🧪', text: "What's the difference between a chemical and physical change?" },
  { emoji: '🍕', text: 'Explain fractions with unlike denominators' },
];

// ─── Component ────────────────────────────────────────────────────────
export default function HomeworkHelper() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll within the chat container only (not the whole page)
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setStreaming(true);
    setError('');

    // Add empty assistant message for streaming
    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);

    try {
      abortRef.current = new AbortController();

      const res = await fetch('/api/showcase/explorer-academy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              assistantContent += data.content;
              setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }]);
            } else if (data.type === 'error') {
              setError(data.content);
            }
          } catch {
            // Skip non-JSON lines
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Something went wrong. Please try again.');
        setMessages(updatedMessages);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-purple-600">3.</span> 24/7 AI Homework Helper
            </h2>
            <p className="text-gray-600 mt-1">
              Ask any Math or Science question and get guided, step-by-step help
            </p>
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Your Explorer Academy AI Tutor — available 24/7
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[480px] flex flex-col">
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Hi there! I&apos;m your AI tutor.</p>
              <p className="text-gray-400 text-sm mb-6">Ask me anything about Math or Science!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {STARTERS.map((starter) => (
                  <button
                    key={starter.text}
                    onClick={() => sendMessage(starter.text)}
                    className="text-left px-4 py-3 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm group"
                  >
                    <span className="mr-2">{starter.emoji}</span>
                    <span className="text-gray-700 group-hover:text-purple-700">{starter.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div>
                        <FormattedText text={msg.content} />
                        {streaming && i === messages.length - 1 && msg.content.length > 0 && (
                          <span className="inline-block w-1.5 h-5 bg-purple-500 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {streaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-50 text-red-600 text-sm text-center">{error}</div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              disabled={streaming}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[15px] disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
