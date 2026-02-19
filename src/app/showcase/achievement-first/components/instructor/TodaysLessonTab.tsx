'use client';

import React from 'react';
import { useAFStore } from '../../store';
import { PRESENTATION_LESSONS } from '../../data/presentation-lessons';

export default function TodaysLessonTab() {
  const { currentUser, startPresentation } = useAFStore();
  if (!currentUser) return null;

  const gradeLessons = PRESENTATION_LESSONS.filter((l) => l.grade === currentUser.grade);
  const otherLessons = [
    { id: 'coming-1', title: 'Properties of Multiplication', standard: '3.OA.B.5', comingSoon: true },
    { id: 'coming-2', title: 'Geometry Basics', standard: '3.G.A.1', comingSoon: true },
    { id: 'coming-3', title: 'Measurement & Data', standard: '3.MD.C.7', comingSoon: true },
    { id: 'coming-4', title: 'Word Problems', standard: '3.OA.D.8', comingSoon: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Ready to Present
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradeLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl border-2 border-[#003B71]/20 p-5 hover:border-[#003B71]/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{lesson.standard} &middot; {lesson.segments.length} segments</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Ready
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {lesson.segments.map((seg, i) => {
                  const colors: Record<string, string> = {
                    'opener-hook': 'bg-yellow-100 text-yellow-700',
                    'direct-instruction': 'bg-blue-100 text-blue-700',
                    'think-pair-share': 'bg-purple-100 text-purple-700',
                    'guided-practice': 'bg-orange-100 text-orange-700',
                    'check-for-understanding': 'bg-red-100 text-red-700',
                    'independent-practice': 'bg-green-100 text-green-700',
                    'exit-ticket': 'bg-pink-100 text-pink-700',
                  };
                  const labels: Record<string, string> = {
                    'opener-hook': 'Do Now',
                    'direct-instruction': 'DI',
                    'think-pair-share': 'TPS',
                    'guided-practice': 'GP',
                    'check-for-understanding': 'CfU',
                    'independent-practice': 'IP',
                    'exit-ticket': 'Exit',
                  };
                  return (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[seg.type] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {labels[seg.type] || seg.type}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => startPresentation(lesson.id)}
                className="w-full py-3 rounded-xl bg-[#003B71] text-white font-semibold hover:bg-[#002a55] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
                Present to Class
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-gray-50 rounded-xl border border-gray-200 p-4 opacity-60"
            >
              <h3 className="font-semibold text-gray-700">{lesson.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{lesson.standard}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-xs font-medium">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
