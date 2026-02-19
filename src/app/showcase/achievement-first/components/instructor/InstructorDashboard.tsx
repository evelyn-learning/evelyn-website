'use client';

import React, { lazy, Suspense } from 'react';
import { useAFStore, InstructorTab } from '../../store';

const TodaysLessonTab = lazy(() => import('./TodaysLessonTab'));
const ClassDataTab = lazy(() => import('./ClassDataTab'));
const AssignmentsTab = lazy(() => import('./AssignmentsTab'));
const ScopeSequenceTab = lazy(() => import('./ScopeSequenceTab'));

const TABS: { key: InstructorTab; label: string }[] = [
  { key: 'todays-lesson', label: "Today's Lesson" },
  { key: 'class-data', label: 'Class Data' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'scope-sequence', label: 'Scope & Sequence' },
];

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-[#003B71]" />
    </div>
  );
}

export default function InstructorDashboard() {
  const currentUser = useAFStore((s) => s.currentUser);
  const instructorTab = useAFStore((s) => s.instructorTab);
  const setInstructorTab = useAFStore((s) => s.setInstructorTab);

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}&apos;s Classroom</h1>
        <p className="text-gray-500 mt-1">Grade {currentUser.grade} &middot; Math &amp; Science</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setInstructorTab(tab.key)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              instructorTab === tab.key
                ? 'bg-white text-[#003B71] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Suspense fallback={<TabLoader />}>
        {instructorTab === 'todays-lesson' && <TodaysLessonTab />}
        {instructorTab === 'class-data' && <ClassDataTab />}
        {instructorTab === 'assignments' && <AssignmentsTab />}
        {instructorTab === 'scope-sequence' && <ScopeSequenceTab />}
      </Suspense>
    </div>
  );
}
