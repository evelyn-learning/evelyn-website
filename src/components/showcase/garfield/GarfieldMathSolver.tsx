'use client';

import React, { useEffect, useRef, useState } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';

const SYSTEM_PROMPT_OVERRIDE = `You are a patient, encouraging math tutor helping a Grade 8 student at
Panguitch Middle School with a math problem. You teach using a Socratic method
aligned with Utah Core standards.

Rules:
- Never give the student the answer. Guide them to it.
- Ask ONE focused question per message. Keep messages short (1–2 sentences).
- For word problems, walk the student through in stages: (1) what is the
  problem asking? (2) what information do we have? (3) how do we translate
  the words into math? (4) solve. Move to the next stage only when the
  student grasps the current one.
- If the student says they don't know, simplify. Don't repeat the same
  question — rephrase, or ask something simpler that gets them to the same
  idea.
- If the student gets it right, acknowledge it briefly ("Nice!" or "Exactly.")
  and move on. Do not over-praise.
- If the student says they want to stop or move on, let them. Do not push.
- Use American English and American conventions.
- Plain text only. No LaTeX, no markdown. Use * for multiplication if needed.
- No emojis.
- If the student is rude or off-topic, gently redirect once. If it continues,
  end the session politely.

Your goal: the student understands the problem well enough to solve a similar
one on their own tomorrow.`;

interface ExampleProblem {
  id: string;
  label: string;
  tag: string;
  problem: string;
  note: string;
}

const EXAMPLES: ExampleProblem[] = [
  {
    id: 'systems',
    label: 'Example A — Systems of Equations (word problem)',
    tag: '8.EE.C.8',
    problem:
      "The sum of two numbers is 24. Their difference is 8. What are the two numbers?",
    note: "Jace's #1 pain point: word-problem translation.",
  },
  {
    id: 'story',
    label: 'Example B — Story problem',
    tag: '8.EE.C.7',
    problem:
      "A car rental costs $30 per day plus $0.25 per mile. If Sarah has $75 for the day, how many miles can she drive?",
    note: "Jace's #2 pain point: story problems.",
  },
  {
    id: 'order-of-ops',
    label: 'Example C — Basic math rules',
    tag: 'Order of operations',
    problem: "Simplify: 3 + 4 * 2^2 - (5 - 3)",
    note: "Jace's #3 pain point: basic math rules.",
  },
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function GarfieldMathSolver() {
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  // Scroll the messages list itself — not the page — when content changes.
  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const selectedExample = EXAMPLES.find((e) => e.id === selectedExampleId);

  const startExample = async (example: ExampleProblem) => {
    setSelectedExampleId(example.id);
    setError(null);
    const openingUser: ChatMessage = {
      role: 'user',
      content: `I need help with this problem: ${example.problem}`,
    };
    setMessages([openingUser]);
    await sendToTutor([openingUser]);
  };

  const resetSession = () => {
    setSelectedExampleId(null);
    setMessages([]);
    setInput('');
    setError(null);
  };

  const sendToTutor = async (convo: ChatMessage[]) => {
    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: convo,
          systemPrompt: SYSTEM_PROMPT_OVERRIDE,
          max_tokens: 400,
        }),
      }
    );

    if (apiError) {
      setError(apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.text! },
      ]);
    }

    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const next: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];
    setMessages(next);
    setInput('');
    await sendToTutor(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-gray-200"
        style={{ backgroundColor: '#FAFAF8' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              The student experience — Socratic Math Tutor
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Grade 8 · Utah Core · word-problem-first. Tuned to never hand over
              the answer.
            </p>
          </div>
          {selectedExampleId && (
            <button
              type="button"
              onClick={resetSession}
              className="text-xs text-gray-600 hover:text-gray-900 underline"
            >
              Choose another example
            </button>
          )}
        </div>
      </div>

      {/* Example picker or chat */}
      {!selectedExampleId ? (
        <div className="p-6">
          <div className="text-sm text-gray-700 mb-4">
            Pick an example to start. The tutor will walk the student through
            one question at a time — no answers handed over.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => startExample(ex)}
                className="text-left rounded-xl border border-gray-200 p-4 hover:border-gray-400 hover:shadow-md transition-all bg-white"
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-wide mb-1"
                  style={{ color: '#8B1A1A' }}
                >
                  {ex.tag}
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  {ex.label}
                </div>
                <div className="text-xs text-gray-700 font-mono leading-snug mb-2">
                  {ex.problem}
                </div>
                <div className="text-[11px] text-gray-500 italic">
                  {ex.note}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col" style={{ height: 520 }}>
          {/* Problem banner */}
          <div
            className="px-6 py-3 border-b border-gray-200"
            style={{ backgroundColor: '#FEF2F2' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: '#8B1A1A' }}
              >
                {selectedExample?.tag}
              </span>
              <div className="text-sm text-gray-800 font-mono">
                {selectedExample?.problem}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesScrollRef}
            className="flex-1 min-h-0 overflow-y-auto p-6 space-y-3 bg-gray-50"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: '#8B1A1A' }
                      : undefined
                  }
                >
                  {msg.role === 'assistant' && (
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Math tutor
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-500">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 bg-white p-4 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type what you're thinking — even if you're not sure..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50"
              style={
                {
                  ['--tw-ring-color' as string]: '#8B1A1A',
                } as React.CSSProperties
              }
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#8B1A1A' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
