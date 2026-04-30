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
  /** Optional quick-answer dispatch. When the latest tutor turn ends
   *  in a yes/no or true/false question, render small buttons next
   *  to the bubble that send the answer immediately on tap — saves
   *  the student waiting for TTS to finish before they can speak.
   *  2026-04-30: feature request from a calc session. */
  onQuickAnswer?: (text: string) => void;
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
  // Scan backward for a sentence terminator. Allow a small run of
  // closing punctuation (quotes, parens, brackets — straight or curly)
  // BETWEEN the terminator and the next sentence boundary, since
  // narration often ends a quoted span with `." Which...` (period
  // inside the quote). Then require either whitespace or an immediate
  // uppercase letter (the brain sometimes drops the post-period space:
  // "...equals 1.Now, on that circle..."). The lookahead `[^.!?]*$`
  // ensures this is the LAST boundary before the trailing question.
  const boundary = trimmed.slice(0, lastQ).match(/[.!?][)\]'"’”]*(?:\s+|(?=[A-Z]))(?=[^.!?]*$)/);
  if (boundary) {
    qStart = boundary.index! + boundary[0].length;
  }
  const body = trimmed.slice(0, qStart).trimEnd();
  const question = trimmed.slice(qStart, lastQ + 1).trim() + (tail ? ' ' + tail : '');
  // Don't bold tiny questions ("Yes?") or ones that look like an
  // interjection — keep the bubble visually calm when the "question"
  // is just an acknowledgement.
  if (question.length < 6) return null;
  // If the body is empty (no sentence terminator before the ?), the
  // entire bubble is one question. Bolding the whole bubble looks
  // visually noisy — observed 2026-04-30, single-question turns
  // rendered fully bold. Skip the split so the renderer falls back
  // to plain rendering.
  if (!body) return null;
  return { body, question };
}

/** Classify the trailing question as yes/no, true/false, or open. Used to
 *  decide whether to render quick-answer buttons.
 *  - 'yes-no'      → "Does that make sense?", "Want to try one?", "Did you get it?"
 *  - 'true-false'  → "True or false: ...", "Is this right or wrong?"
 *  - 'open'        → anything else; no quick-answer buttons.
 *
 *  Conservative: only the most-clearly-structured patterns trigger
 *  buttons. False positives mean the student sees a quick-answer UI
 *  for a question that actually needed a longer answer — annoying but
 *  not blocking. False negatives mean no buttons (current default).
 */
export type QuickAnswerKind = 'yes-no' | 'true-false' | 'open';
export function classifyQuestionForQuickAnswer(question: string): QuickAnswerKind {
  if (!question) return 'open';
  const q = question.trim().toLowerCase();
  // True/false form: explicit "true or false" framing or "is this right or wrong"
  if (/\btrue or false\b/.test(q) || /\bright or wrong\b/.test(q) || /\bcorrect or incorrect\b/.test(q)) {
    return 'true-false';
  }
  // Yes/no form: starts with one of the canonical yes/no question words
  // and is reasonably short. Long questions usually want a richer answer
  // even when phrased as yes/no.
  if (q.length > 140) return 'open';
  // Polite-imperative open questions ("Can you tell me X?", "Could you
  // explain Y?", "Will you describe Z?") look like yes/no on the
  // surface but expect a content answer — filter them BEFORE the
  // yes-no test so they fall through to 'open'. Pattern: yes/no aux +
  // "you" + open-imperative verb. Observed 2026-04-30 pre-calc session
  // showing Yes/No buttons on "Can you tell me what the expansion of
  // (sin+cos)^2 actually is?".
  const politeImperative = /^(can|could|will|would|do|did|does|are|is|have|has)\s+(you|i)\s+(tell|explain|describe|show|give|find|name|list|state|write|solve|calculate|compute|figure|work|think|recall|remember|identify|expand|simplify|derive|estimate|guess)\b/;
  if (politeImperative.test(q)) return 'open';
  const yesNoStart = /^(does|did|do|is|are|was|were|will|would|can|could|should|shall|may|might|have|has|had|want|ready|sure|got|see|make sense|makes sense)\b/;
  if (yesNoStart.test(q)) return 'yes-no';
  // "Want to try X?" / "Ready to do Y?" common tutor close-out form
  if (/\b(want to|ready to|shall we|how about|wanna)\b.+\?$/.test(q)) return 'yes-no';
  // "Does that make sense?" / "Make sense?" specifically
  if (/\bmake[s]? sense\?$/.test(q)) return 'yes-no';
  return 'open';
}

export function TranscriptView({ transcript, isProcessing, picker, pickerAnchorIndex, onQuickAnswer }: TranscriptViewProps) {
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

  // Identify the LATEST tutor entry id — quick-answer buttons render
  // only on that one (and only when its trailing question is yes/no
  // or true/false). Without this gating we'd show buttons under every
  // tutor turn in scrollback, which would clutter and confuse.
  //
  // ADDITIONAL gate: hide the buttons once the student has responded
  // to that tutor turn (typed something, or already tapped a button).
  // The new tutor turn might still be in flight — latestTutorEntryId
  // doesn't shift until streaming completes — so without this, a
  // late tap on the now-stale buttons gets queued and processed as
  // an answer to the NEXT question. Observed 2026-04-30 geography
  // session: user typed "got it" / "ok" then clicked Yes; "Yes"
  // arrived as a fresh student turn against the next tutor question.
  let latestTutorEntryId: string | null = null;
  let studentRespondedAfterLatest = false;
  for (let i = visibleTranscript.length - 1; i >= 0; i--) {
    const e = visibleTranscript[i];
    if (e.role === 'tutor' && !e.streaming) {
      latestTutorEntryId = e.id;
      break;
    }
    if (e.role === 'student') {
      studentRespondedAfterLatest = true;
    }
  }

  const renderEntry = (entry: TranscriptEntry) => {
    const split = entry.role === 'tutor' && !entry.streaming ? splitTrailingQuestion(entry.text) : null;
    const quickKind = (
      onQuickAnswer && entry.id === latestTutorEntryId && split && !studentRespondedAfterLatest
        ? classifyQuestionForQuickAnswer(split.question)
        : 'open'
    );
    return (
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

        {/* Quick-answer buttons under the LATEST tutor turn when its
            trailing question is yes/no or true/false. Lets the student
            answer without waiting for TTS to finish or typing.
            Tap → sends text via onQuickAnswer (relayed to brain) and
            the buttons disappear because the next tutor turn becomes
            the new "latest". */}
        {onQuickAnswer && quickKind !== 'open' && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(quickKind === 'yes-no'
              ? [
                  { label: 'Yes', text: 'Yes' },
                  { label: 'No', text: 'No' },
                  { label: 'Not sure', text: 'I\'m not sure' },
                ]
              : [
                  { label: 'True', text: 'True' },
                  { label: 'False', text: 'False' },
                  { label: 'Not sure', text: 'I\'m not sure' },
                ]
            ).map((opt) => (
              <button
                key={opt.label}
                // Disable while a brain turn is in flight. Otherwise the
                // tap is queued and processed AFTER the in-flight turn
                // completes — by which point the question on screen has
                // already advanced (observed 2026-04-30 algebra-2
                // session: user typed "Sure", buttons remained on the
                // prior bubble during streaming, user also clicked
                // "Yes", brain treated it as a response to the next
                // question and revealed the misconception answer
                // unprompted).
                disabled={!!isProcessing}
                onClick={() => onQuickAnswer(opt.text)}
                className="px-3 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
    );
  };

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
