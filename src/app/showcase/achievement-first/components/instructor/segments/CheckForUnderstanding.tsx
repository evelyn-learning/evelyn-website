'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CheckForUnderstandingSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: CheckForUnderstandingSegment;
}

type PollState = 'question' | 'polling' | 'results';

export default function CheckForUnderstanding({ segment }: Props) {
  const [state, setState] = useState<PollState>('question');
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const totalStudents = segment.simulatedResults.reduce((sum, r) => sum + r.count, 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startPoll = () => {
    setState('polling');
    setProgress(0);
    setSubmitted(0);

    const duration = 3500; // 3.5 seconds
    const steps = 35;
    const stepTime = duration / steps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const pct = Math.min((step / steps) * 100, 100);
      setProgress(pct);
      setSubmitted(Math.min(Math.round((pct / 100) * totalStudents), totalStudents));

      if (step >= steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setState('results'), 300);
      }
    }, stepTime);
  };

  const maxCount = Math.max(...segment.simulatedResults.map((r) => r.count));

  const getBarColor = (index: number) => {
    if (index === segment.correctIndex) return 'bg-green-500';
    return 'bg-red-400';
  };

  return (
    <div className="flex flex-col items-center h-full gap-6 px-8 py-4 overflow-y-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-2">
          Check for Understanding
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{segment.title}</h2>
      </div>

      <div className="w-full max-w-2xl">
        {/* Question */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
          <p className="text-xl font-semibold text-gray-900 text-center">{segment.question}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {segment.options.map((opt, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl border-2 text-center font-medium ${
                  state === 'results' && i === segment.correctIndex
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <span className="font-bold text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </div>
            ))}
          </div>
        </div>

        {/* Poll states */}
        {state === 'question' && (
          <div className="text-center">
            <button
              onClick={startPoll}
              className="px-8 py-4 rounded-xl bg-[#F5A623] text-[#003B71] font-bold text-lg hover:bg-[#e6991a] transition-colors shadow-lg"
            >
              Start Poll
            </button>
          </div>
        )}

        {state === 'polling' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-[#003B71]">{submitted}/{totalStudents} submitted</p>
              <div className="w-full h-3 bg-blue-100 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-[#003B71] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-2">Waiting for responses...</p>
            </div>
          </div>
        )}

        {state === 'results' && (
          <div className="space-y-4">
            {/* Results bars */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Results</p>
              {segment.simulatedResults.map((result, i) => {
                const pct = Math.round((result.count / totalStudents) * 100);
                const isCorrect = i === segment.correctIndex;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-gray-600'}`}>
                        {String.fromCharCode(65 + i)}. {result.option}
                        {isCorrect && ' ✓'}
                      </span>
                      <span className="font-bold text-gray-800">{result.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full ${getBarColor(i)} rounded-lg transition-all duration-700`}
                        style={{ width: `${(result.count / maxCount) * 100}%` }}
                      />
                    </div>
                    {result.students.length > 0 && !isCorrect && (
                      <p className="text-xs text-gray-400 ml-1">{result.students.join(', ')}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary indicator */}
            {(() => {
              const correctPct = Math.round(
                ((segment.simulatedResults[segment.correctIndex]?.count ?? 0) / totalStudents) * 100
              );
              const color = correctPct >= 80 ? 'green' : correctPct >= 60 ? 'yellow' : 'red';
              return (
                <div className={`rounded-xl p-4 text-center border ${
                  color === 'green' ? 'bg-green-50 border-green-200' :
                  color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-lg font-bold ${
                    color === 'green' ? 'text-green-700' :
                    color === 'yellow' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {correctPct}% Correct
                    {color === 'green' ? ' — Great understanding!' :
                     color === 'yellow' ? ' — Review may be needed' :
                     ' — Reteach recommended'}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
