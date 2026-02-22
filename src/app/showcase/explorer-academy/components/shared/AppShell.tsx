'use client';

import React from 'react';
import { useExplorerStore } from '../../store';

const SCREEN_LABELS: Record<string, string> = {
  'student-home': 'Home',
  lesson: 'Lesson',
  'adaptive-lesson': 'Adaptive Lesson',
  'math-helper': 'Math Helper',
  'practice-test': 'Practice Test',
  'homework-chat': 'Homework Chat',
  'parent-dashboard': 'Dashboard',
  'instructor-dashboard': 'Dashboard',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, screen, logout } = useExplorerStore();

  if (!currentUser) return null;

  const sectionLabel = SCREEN_LABELS[screen] || '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-purple-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="font-bold text-sm hidden sm:inline">Explorer Academy</span>
            {sectionLabel && (
              <>
                <span className="text-purple-400 mx-1 hidden sm:inline">/</span>
                <span className="text-purple-200 text-sm hidden sm:inline">{sectionLabel}</span>
              </>
            )}
          </div>

          {/* Right: User + Switch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full ${currentUser.color} text-white flex items-center justify-center text-sm font-bold`}
              >
                {currentUser.avatar}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{currentUser.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
