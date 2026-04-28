'use client';

/**
 * Transcript View Component
 *
 * Displays the conversation history between student and tutor.
 */

import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import type { TranscriptEntry } from '@/lib/tutor/types';

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
  isProcessing?: boolean;
}

/** Render markdown-style *emphasis* and **strong** as actual styled spans
 *  instead of leaving the asterisks raw in the chat bubble. The brain
 *  uses *word* as a TTS hint AND as visual emphasis; we strip the
 *  asterisks and apply <em>/<strong> in their place. */
function renderInlineEmphasis(text: string): React.ReactNode {
  if (!text) return text;
  // Split on **bold** and *italic*. Order: bold first, then italic, so
  // ** doesn't get eaten by the * matcher.
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  // Combined regex: capture either a bold (**...**) or italic (*...*) run.
  const RE = /(\*\*([^*\n]+)\*\*|\*([^*\n]+)\*)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = RE.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    if (m[2] !== undefined) {
      parts.push(<strong key={`b-${key++}`} className="font-semibold">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      parts.push(<em key={`i-${key++}`} className="italic">{m[3]}</em>);
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  // If nothing matched, return the plain string unchanged.
  if (parts.length === 0) return text;
  void remaining; // silence linter
  return parts;
}

export function TranscriptView({ transcript, isProcessing }: TranscriptViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  if (transcript.length === 0 && !isProcessing) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p className="text-center">
          Your conversation will appear here.
          <br />
          Start speaking to begin!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
    >
      {transcript.map((entry) => (
        <div
          key={entry.id}
          className={`flex gap-3 ${
            entry.role === 'student' ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              entry.role === 'student'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-purple-100 text-purple-600'
            }`}
          >
            {entry.role === 'student' ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message */}
          <div
            className={`flex-1 ${
              entry.role === 'student' ? 'text-right' : ''
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                entry.role === 'student'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {/* `typing-caret` shows a blinking caret on the current
                  streaming tutor entry (id starts with "tutor-streaming-")
                  so the bubble visibly "types" as sentences land. */}
              <p className={`whitespace-pre-wrap ${entry.role === 'tutor' && entry.id.startsWith('tutor-streaming-') ? 'typing-caret' : ''}`}>
                {renderInlineEmphasis(entry.text)}
              </p>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-gray-400 mt-1">
              {formatTime(entry.timestamp)}
            </p>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isProcessing && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="inline-block bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
