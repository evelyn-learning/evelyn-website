'use client';

import React, { useState, useCallback } from 'react';
import { LessonSegment } from '../../data/lessons';
import VideoEmbed from './VideoEmbed';

export function NarrationCard({ segment }: { segment: Extract<LessonSegment, { type: 'narration' }> }) {
  const [speaking, setSpeaking] = useState(false);

  const readAloud = useCallback(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [speaking, segment.text]);

  return (
    <div className="border-l-4 border-purple-500 bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">{segment.title}</h3>
          <p className="text-gray-700 leading-relaxed">{segment.text}</p>
          <button
            onClick={readAloud}
            className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {speaking ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              )}
            </svg>
            {speaking ? 'Stop' : 'Read Aloud'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoCard({ segment }: { segment: Extract<LessonSegment, { type: 'video' }> }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
      <h3 className="font-bold text-gray-900">{segment.title}</h3>
      <VideoEmbed youtubeId={segment.youtubeId} title={segment.title} caption={segment.caption} />
    </div>
  );
}

export function QuestionCard({
  segment,
  onCorrect,
  onAnswered,
  label,
}: {
  segment: Extract<LessonSegment, { type: 'comprehension' }> | Extract<LessonSegment, { type: 'practice' }>;
  onCorrect: () => void;
  onAnswered: () => void;
  label: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    onAnswered();
    if (selected === segment.correctIndex) {
      onCorrect();
    }
  };

  const isCorrect = submitted && selected === segment.correctIndex;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-2 ${
      submitted ? (isCorrect ? 'border-green-200' : 'border-red-200') : 'border-gray-100'
    }`}>
      <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-semibold text-gray-800 mb-4">{segment.question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {segment.options.map((opt, i) => {
          let cls = 'border-gray-200 hover:border-purple-300 cursor-pointer';
          if (selected === i && !submitted) cls = 'border-purple-500 bg-purple-50 ring-2 ring-purple-200';
          if (submitted && i === segment.correctIndex) cls = 'border-green-500 bg-green-50';
          if (submitted && selected === i && i !== segment.correctIndex) cls = 'border-red-500 bg-red-50';

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={`text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${cls} ${submitted ? 'cursor-default' : ''}`}
            >
              <span className="font-semibold text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <div className={`rounded-lg px-4 py-3 text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          <span className="font-semibold">{isCorrect ? 'Correct!' : 'Not quite.'} </span>
          {segment.explanation}
        </div>
      )}
    </div>
  );
}

export function SummaryCard({
  segment,
  correctCount,
  totalQuestions,
  onFinish,
}: {
  segment: Extract<LessonSegment, { type: 'summary' }>;
  correctCount: number;
  totalQuestions: number;
  onFinish: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm text-center space-y-6 border-2 border-green-200">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">{segment.title}</h3>
        {totalQuestions > 0 && (
          <p className="text-gray-600 mt-1">
            You got <span className="font-bold text-green-600">{correctCount}/{totalQuestions}</span> questions correct
          </p>
        )}
      </div>
      <div className="text-left max-w-md mx-auto">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Takeaways</p>
        <ul className="space-y-2">
          {segment.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onFinish}
        className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
}
