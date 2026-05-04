'use client';

import React, { useEffect, useState } from 'react';
import AIDetectionPanel from './AIDetectionPanel';
import PlagiarismPanel from './PlagiarismPanel';
import { SEVERITY_STYLES } from './constants';
import type { EnhancedAnalysisResult } from './types';

interface HistoryItem {
  _id: string;
  documentName: string;
  source: 'upload' | 'classroom';
  studentName?: string;
  studentEmail?: string;
  courseTitle?: string;
  assignmentTitle?: string;
  submittedAt?: string;
  createdAt: string;
  context?: { gradeLevel?: number; subject?: string; assignmentType?: string };
  result: EnhancedAnalysisResult;
}

interface Props {
  teacherId: string;
  id: string;
  onBack: () => void;
}

export default function HistoryDetail({ teacherId, id, onBack }: Props) {
  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/showcase/plagiarism-detection/history/${encodeURIComponent(id)}?teacherId=${encodeURIComponent(teacherId)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Failed to load');
          return;
        }
        setItem(data.item);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, teacherId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-500 text-sm">
        <div className="w-8 h-8 mx-auto mb-2 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        Loading analysis…
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <button onClick={onBack} className="text-sm text-orange-600 hover:text-orange-700 mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to history
        </button>
        <p className="text-red-700 text-sm">{error || 'Not found.'}</p>
      </div>
    );
  }

  const r = item.result;
  const scoreColor = (s: number) => s >= 75 ? 'text-green-600' : s >= 40 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = (s: number) => s >= 75 ? 'bg-green-50' : s >= 40 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to history
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{item.documentName}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Analyzed {new Date(item.createdAt).toLocaleString()}
            {item.source === 'classroom' && (
              <> · {[item.courseTitle, item.assignmentTitle, item.studentName].filter(Boolean).join(' · ')}</>
            )}
          </p>
        </div>

        {/* Overall score card */}
        <div className={`${scoreBg(r.overallScore)} rounded-xl p-5 mb-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Overall Originality</p>
              <p className={`text-4xl font-bold ${scoreColor(r.overallScore)}`}>{r.overallScore}%</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-medium text-sm ${
              r.overallVerdict === 'Original' ? 'bg-green-200 text-green-800' :
              r.overallVerdict === 'Needs Review' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {r.overallVerdict}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <AIDetectionPanel result={r} />
          <PlagiarismPanel result={r} />
        </div>

        {r.concerns.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-gray-800 mb-3">Concerns</h4>
            <div className="space-y-2">
              {r.concerns.map((c, i) => (
                <div key={i} className={`p-3 rounded-lg border ${SEVERITY_STYLES[c.severity]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium uppercase">{c.severity}</span>
                    <span className="font-medium text-sm">{c.type}</span>
                  </div>
                  <p className="text-sm mb-1">{c.description}</p>
                  <p className="text-xs opacity-80"><strong>Suggestion:</strong> {c.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.recommendations.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
            <ul className="space-y-1.5">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">&#10003;</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {r.annotations && r.annotations.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-gray-800 mb-3">Flagged Passages</h4>
            <div className="space-y-2">
              {r.annotations.map((a, i) => (
                <div key={i} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <p className="text-xs font-medium uppercase text-gray-500 mb-1">{a.type}</p>
                  <p className="text-sm italic text-gray-800 mb-1">&ldquo;{a.matchedText}&rdquo;</p>
                  <p className="text-xs text-gray-600">{a.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              The full original document is not stored — only the flagged passages above are kept for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
