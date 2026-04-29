'use client';

/**
 * Transcript View Component
 *
 * Displays the conversation history between student and tutor.
 */

import React, { useEffect, useRef, useState } from 'react';
import { User, Bot } from 'lucide-react';
import type { TranscriptEntry } from '@/lib/tutor/types';

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
  isProcessing?: boolean;
  /** In-session lesson picker bubble. Rendered INLINE between
   *  visible-transcript entries, anchored at `pickerAnchorIndex`
   *  (captured the first time the picker becomes eligible). Without
   *  the anchor the picker would float at the end of the transcript
   *  and "drift downward" as the conversation grows — observed
   *  2026-04-29 geometry session, where the picker bubble kept
   *  jumping to the bottom on every new turn. */
  picker?: React.ReactNode;
  /** Visible-transcript index (post-bracket-strip) at/before which
   *  the picker should be inserted. e.g. 1 → picker appears after
   *  the first visible entry. */
  pickerAnchorIndex?: number | null;
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

/** Find the trailing question in a tutor turn — the actionable ask the
 *  student needs to respond to. The brain typically structures turns as
 *  "[explanation]. [question]?", and the question is what we want to
 *  highlight visually. We look for the LAST sentence-ending '?' and
 *  treat everything from the prior sentence boundary to that '?' as
 *  the question. Returns [bodyBefore, question, restAfter] or null when
 *  no trailing question exists (statement-only turns aren't bolded).
 *
 *  Conservative on edge cases: a '?' inside parens or quotes still
 *  counts (the heuristic is "last ? in the text"). The boundary
 *  detection uses /[.!?]\s+/ before the question — same heuristic the
 *  SentenceBuffer uses on the brain side. */
function splitTrailingQuestion(text: string): { body: string; question: string } | null {
  if (!text) return null;
  // The trailing ? must be near the end of the text — no significant
  // content after it, otherwise it's a mid-sentence question.
  const trimmed = text.trimEnd();
  const lastQ = trimmed.lastIndexOf('?');
  if (lastQ < 0) return null;
  const tail = trimmed.slice(lastQ + 1).trim();
  // Allow a short trailing fragment after the ? (e.g., "?)" or "? :)")
  // but not a whole sentence.
  if (tail.length > 8) return null;
  // Find the last sentence boundary BEFORE the question. Look for
  // ". " or "! " or "? " before lastQ. The chosen boundary is the
  // start of the question sentence.
  let qStart = 0;
  // Scan backward for a sentence terminator followed by whitespace.
  const boundary = trimmed.slice(0, lastQ).match(/[.!?]\s+(?=[^.!?]*$)/);
  if (boundary) {
    qStart = boundary.index! + boundary[0].length;
  }
  const body = trimmed.slice(0, qStart).trimEnd();
  const question = trimmed.slice(qStart, lastQ + 1).trim() + (tail ? ' ' + tail : '');
  // Don't bold tiny questions ("Yes?") or ones that look like an
  // interjection — keep the bubble visually calm when the "question"
  // is just an acknowledgement.
  if (question.length < 6) return null;
  return { body, question };
}

export function TranscriptView({ transcript, isProcessing, picker, pickerAnchorIndex }: TranscriptViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive (or when the picker
  // mounts/unmounts so it stays visible).
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, picker]);

  // Progressive hint under the typing-dots while the brain is composing.
  // Most turns finish in 2-7s; if it takes longer, fade in a soft
  // "still thinking…" reassurance, then a recovery hint near the
  // page-level 10s watchdog so the student knows what to do if the
  // request truly stalled.
  const [thinkingHint, setThinkingHint] = useState<string | null>(null);
  useEffect(() => {
    if (!isProcessing) {
      setThinkingHint(null);
      return;
    }
    setThinkingHint(null);
    const t1 = setTimeout(() => setThinkingHint('Still thinking…'), 4000);
    const t2 = setTimeout(() => setThinkingHint('Hmm, that\'s taking a moment — feel free to type below if I missed you.'), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isProcessing]);

  if (transcript.length === 0 && !isProcessing && !picker) {
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

  // Strip bracketed system-style segments from student bubbles. The
  // picker / homework-upload paths embed runtime instructions for the
  // brain inside `[...]` so the model knows context without the student
  // seeing model-facing text. Two cases:
  //   - Whole-bubble bracketed (e.g. "[start session]"): hide entirely.
  //   - Mixed bubble ("Let's do: Algebra. [Use show_segment_card...]"):
  //     keep the visible prefix, strip the brackets at render time.
  // The brain still sees the FULL text in its prompt — only the chat
  // display is sanitized.
  //
  // Defensive: also strip a TRAILING orphan `]...]` if a synthetic
  // message accidentally contained nested brackets (e.g. `segments[]`
  // inside the instruction) — observed 2026-04-29 trig session, where
  // " array — do not invent segment ids.]" leaked into the bubble
  // because the inner `]` truncated the non-greedy match early.
  const visibleTranscript = transcript
    .map((entry) => {
      if (entry.role !== 'student') return entry;
      let stripped = entry.text.replace(/\s*\[[\s\S]*?\]\s*/g, ' ');
      // Trailing orphan `]` (no matching `[` ahead in remaining text):
      // anything from the last unmatched `]` back to the prior sentence
      // boundary is brain-only instruction that leaked.
      if (stripped.includes(']') && !stripped.includes('[')) {
        const lastBracket = stripped.lastIndexOf(']');
        const cutFrom = stripped.lastIndexOf('.', lastBracket);
        stripped = (cutFrom >= 0 ? stripped.slice(0, cutFrom + 1) : '').trim();
      }
      stripped = stripped.replace(/\s+/g, ' ').trim();
      if (!stripped) return null;
      return stripped === entry.text ? entry : { ...entry, text: stripped };
    })
    .filter((e): e is TranscriptEntry => e !== null);

  // Compute the split point: clamp the anchor to [0, visibleTranscript.length].
  // If the anchor was never set (picker not yet eligible) or the picker
  // is null (dismissed/started), no split happens.
  const anchor = picker != null && typeof pickerAnchorIndex === 'number'
    ? Math.max(0, Math.min(pickerAnchorIndex, visibleTranscript.length))
    : null;
  const beforePicker = anchor !== null ? visibleTranscript.slice(0, anchor) : visibleTranscript;
  const afterPicker = anchor !== null ? visibleTranscript.slice(anchor) : [];

  const renderEntry = (entry: TranscriptEntry) => (
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
          {entry.role === 'tutor' && !entry.streaming
            ? (() => {
                const split = splitTrailingQuestion(entry.text);
                if (!split) {
                  return (
                    <p className="whitespace-pre-wrap">
                      {renderInlineEmphasis(entry.text)}
                    </p>
                  );
                }
                return (
                  <p className="whitespace-pre-wrap">
                    {split.body && (
                      <>
                        {renderInlineEmphasis(split.body)}
                        {' '}
                      </>
                    )}
                    <span className="font-semibold">
                      {renderInlineEmphasis(split.question)}
                    </span>
                  </p>
                );
              })()
            : (
              <p className={`whitespace-pre-wrap ${entry.role === 'tutor' && entry.streaming ? 'typing-caret' : ''}`}>
                {renderInlineEmphasis(entry.text)}
              </p>
            )
          }
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-400 mt-1">
          {formatTime(entry.timestamp)}
        </p>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
    >
      {beforePicker.map(renderEntry)}
      {anchor !== null && picker}
      {afterPicker.map(renderEntry)}

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
              {thinkingHint && (
                <p className="text-xs text-gray-500 mt-1.5 italic">{thinkingHint}</p>
              )}
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
