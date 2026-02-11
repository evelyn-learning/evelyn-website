'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Mic } from 'lucide-react';

// ── Script ──────────────────────────────────────────────────────────────────

interface ScriptEntry {
  role: 'tutor' | 'student';
  text: string;
  equation?: string;
}

const CONVERSATION: ScriptEntry[] = [
  { role: 'tutor', text: "Hi! I'm your AI physics tutor. What topic would you like to explore today?" },
  { role: 'student', text: "Can you help me understand Newton's second law?" },
  { role: 'tutor', text: "Great choice! Newton's Second Law says the net force on an object equals its mass times its acceleration.", equation: 'F = m · a' },
  { role: 'tutor', text: "Let's try a problem: A 5 kg box accelerates at 3 m/s². What force is applied?", equation: 'F = 5 kg × 3 m/s²' },
  { role: 'student', text: "So F = 5 × 3 = 15 Newtons?" },
  { role: 'tutor', text: "Exactly right! 15 N. Notice how force scales linearly with both mass and acceleration.", equation: 'F = 15 N  ✓' },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function VoiceTutorPreview() {
  const [messages, setMessages] = useState<ScriptEntry[]>([]);
  const [equation, setEquation] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-play conversation, restart on cycle change
  useEffect(() => {
    setMessages([]);
    setEquation(null);
    setElapsed(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 800;

    CONVERSATION.forEach((entry) => {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, entry]);
        if (entry.equation) setEquation(entry.equation);
        if (entry.role === 'tutor') {
          setSpeaking(true);
          timers.push(setTimeout(() => setSpeaking(false), 1500));
        }
      }, t));
      t += entry.role === 'student' ? 2000 : 3000;
    });

    // Restart after pause
    timers.push(setTimeout(() => setCycle(c => c + 1), t + 4000));

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  // Fake session timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Mock tutor interface */}
      <div className="flex" style={{ height: 420 }}>
        {/* ── Transcript panel ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Mock header */}
          <div className="px-4 py-2.5 bg-white border-b flex items-center justify-between flex-shrink-0">
            <div>
              <div className="text-sm font-semibold text-gray-900">Newton&apos;s Laws of Motion</div>
              <div className="text-xs text-gray-500">Practice Session</div>
            </div>
            <div className="flex items-center gap-3">
              {speaking && (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Mic className="w-3.5 h-3.5" />
                  <div className="flex gap-0.5 items-center h-4">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="w-0.5 bg-blue-500 rounded-full animate-bounce"
                        style={{
                          height: `${6 + (i % 3) * 4}px`,
                          animationDelay: `${i * 100}ms`,
                          animationDuration: '0.6s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <span className="text-xs font-mono text-gray-400 tabular-nums">{mins}:{secs}</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'student'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {speaking && messages.length < CONVERSATION.length && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-200 shadow-sm">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mock input bar */}
          <div className="px-4 py-3 bg-white border-t flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-400">
                Type or speak your question&hellip;
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Whiteboard panel ────────────────────────────────────────── */}
        <div className="hidden md:flex w-[45%] bg-white border-l flex-col">
          <div className="px-4 py-2.5 border-b flex-shrink-0">
            <div className="text-sm font-semibold text-gray-900">Whiteboard</div>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-white to-slate-50">
            {equation ? (
              <div className="text-center transition-all duration-500">
                <div className="text-4xl font-mono font-bold text-gray-900 tracking-wide">
                  {equation}
                </div>
                <div className="mt-4 w-24 h-0.5 bg-blue-200 rounded-full mx-auto" />
                <div className="mt-2 text-xs text-gray-400">Live equation rendering</div>
              </div>
            ) : (
              <div className="text-center text-gray-300">
                <div className="text-5xl mb-3">📐</div>
                <div className="text-sm">Equations and diagrams appear here</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CTA overlay ──────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent pt-20 pb-6 px-6">
        <div className="text-center">
          <Link
            href="/tutor"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            Launch Full Voice Tutor
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-3">
            Full-screen experience with voice chat, whiteboard &amp; homework upload
          </p>
        </div>
      </div>
    </div>
  );
}
