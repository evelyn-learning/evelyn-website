'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAFStore } from '../../../store';
import type { ExitTicketSegment } from '../../../data/presentation-lessons';

interface Props {
  segment: ExitTicketSegment;
}

type TicketState = 'preview' | 'submitting' | 'results' | 'intervention-assigned';

export default function ExitTicket({ segment }: Props) {
  const [state, setState] = useState<TicketState>('preview');
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const assignIntervention = useAFStore((s) => s.assignIntervention);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalStudents = 24;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startSubmission = () => {
    setState('submitting');
    setProgress(0);
    setSubmitted(0);

    const duration = 4000;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const pct = Math.min((step / steps) * 100, 100);
      setProgress(pct);
      setSubmitted(Math.min(Math.round((pct / 100) * totalStudents), totalStudents));

      if (step >= steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setState('results'), 500);
      }
    }, stepTime);
  };

  const handleAutoAssign = () => {
    assignIntervention('Exit Ticket Remediation', segment.flaggedStudents);
    setState('intervention-assigned');
  };

  return (
    <div className="flex flex-col items-center h-full gap-6 px-8 py-4 overflow-y-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-2">
          Exit Ticket
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{segment.title}</h2>
      </div>

      <div className="w-full max-w-2xl">
        {/* Questions preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Questions</p>
          <div className="space-y-3">
            {segment.questions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#003B71] text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-800">{q.question}</p>
                  {state === 'results' || state === 'intervention-assigned' ? (
                    <p className="text-xs text-green-600 mt-1 font-medium">Answer: {q.correctAnswer}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State-dependent content */}
        {state === 'preview' && (
          <div className="text-center">
            <button
              onClick={startSubmission}
              className="px-8 py-4 rounded-xl bg-[#F5A623] text-[#003B71] font-bold text-lg hover:bg-[#e6991a] transition-colors shadow-lg"
            >
              Simulate Submission
            </button>
          </div>
        )}

        {state === 'submitting' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-3">
            <p className="text-lg font-bold text-[#003B71]">{submitted}/{totalStudents} submitted</p>
            <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#003B71] rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {Array.from({ length: totalStudents }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    i < submitted ? 'bg-green-500 scale-100' : 'bg-gray-200 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {(state === 'results' || state === 'intervention-assigned') && (
          <div className="space-y-4">
            {/* Class average */}
            <div className={`rounded-xl p-6 text-center border ${
              segment.simulatedClassAvg >= 80 ? 'bg-green-50 border-green-200' :
              segment.simulatedClassAvg >= 60 ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <p className="text-4xl font-bold text-gray-900">{segment.simulatedClassAvg}%</p>
              <p className="text-sm text-gray-600 mt-1">Class Average</p>
            </div>

            {/* Per-question breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Per-Question Breakdown</p>
              {segment.questions.map((q, i) => {
                const pct = Math.round(segment.simulatedClassAvg + (i === 0 ? 8 : i === 1 ? -3 : -5));
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-6">Q{i + 1}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-10 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Flagged students */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Flagged Students ({segment.flaggedStudents.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {segment.flaggedStudents.map((name) => (
                  <span key={name} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Auto-assign button */}
            {state === 'results' && (
              <div className="text-center">
                <button
                  onClick={handleAutoAssign}
                  className="px-8 py-4 rounded-xl bg-[#003B71] text-white font-bold text-lg hover:bg-[#002a55] transition-colors shadow-lg"
                >
                  Auto-Assign Intervention Practice
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Assigns targeted practice to flagged students based on exit ticket results
                </p>
              </div>
            )}

            {state === 'intervention-assigned' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg font-bold text-green-700">Intervention Practice Assigned</p>
                <p className="text-sm text-green-600 mt-1">
                  {segment.flaggedStudents.join(', ')} will see targeted practice in their work queue
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
