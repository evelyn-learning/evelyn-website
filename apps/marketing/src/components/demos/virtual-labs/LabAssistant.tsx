'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { marked } from 'marked';

// Configure marked for inline rendering (no wrapping <p> tags for short responses)
marked.setOptions({ breaks: true, gfm: true });

function renderMarkdown(text: string): string {
  return marked.parse(text, { async: false }) as string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LabAssistantProps {
  labContext: string;
}

export default function LabAssistant({ labContext }: LabAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [height, setHeight] = useState(500);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(500);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [height]);

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = e.clientY - startYRef.current;
      const newHeight = Math.max(300, Math.min(800, startHeightRef.current + delta));
      setHeight(newHeight);
    };

    const handleResizeEnd = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/products/virtual-labs/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          labContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: last.content + data.content };
                }
                return updated;
              });
            } else if (data.type === 'error') {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: data.content };
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.role === 'assistant' && !updated[updated.length - 1].content) {
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Sorry, I had trouble responding. Please try again.',
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const suggestedQuestions = [
    'What am I seeing in this simulation?',
    'How do these parameters relate to the real world?',
    'What experiment should I try next?',
    'Explain the physics/chemistry behind this.',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col" style={{ height }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Lab Assistant</h3>
          <p className="text-xs text-gray-500">Ask questions about your experiment</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔬</div>
            <p className="text-sm text-gray-500 mb-4">
              Hi! I&apos;m your AI Lab Assistant. Ask me anything about the simulation.
            </p>
            <div className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    inputRef.current?.focus();
                  }}
                  className="block w-full text-left text-xs px-3 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-gray-100 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about the experiment..."
            disabled={isStreaming}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className="h-2 shrink-0 cursor-ns-resize flex items-center justify-center rounded-b-2xl hover:bg-gray-100 transition-colors group"
      >
        <div className="w-10 h-1 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-colors" />
      </div>
    </div>
  );
}

// Separate component to memoize markdown rendering
function MessageBubble({ message }: { message: Message }) {
  const html = useMemo(() => {
    if (message.role === 'assistant' && message.content) {
      return renderMarkdown(message.content);
    }
    return null;
  }, [message.role, message.content]);

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
          message.role === 'user'
            ? 'bg-teal-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.role === 'assistant' ? (
          message.content ? (
            <div
              className="prose prose-sm prose-gray max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:pl-4 [&>ol]:mb-2 [&>ol]:pl-4 [&_li]:mb-0.5 [&>p>strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: html! }}
            />
          ) : (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
