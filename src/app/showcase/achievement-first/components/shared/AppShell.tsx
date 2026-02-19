'use client';

import React from 'react';
import { useAFStore } from '../../store';

const SCREEN_LABELS: Record<string, string> = {
  'student-home': 'Home',
  lesson: 'Lesson',
  'math-helper': 'Math Problem Solver',
  'practice-test': 'Practice Test',
  'homework-chat': 'Homework Help',
  'parent-dashboard': 'Dashboard',
  'instructor-dashboard': 'Dashboard',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, screen, logout } = useAFStore();

  if (!currentUser) return null;

  const sectionLabel = SCREEN_LABELS[screen] || '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-[#003B71] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#F5A623]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
              />
            </svg>
            <span className="font-bold text-sm hidden sm:inline">Achievement First</span>
            {sectionLabel && (
              <>
                <span className="text-blue-400 mx-1 hidden sm:inline">/</span>
                <span className="text-blue-200 text-sm hidden sm:inline">{sectionLabel}</span>
              </>
            )}
          </div>

          {/* Center: REACH */}
          <div className="hidden md:flex items-center gap-1 text-[10px] text-[#F5A623]/70 tracking-widest uppercase font-semibold">
            <span>R</span><span className="text-[#F5A623]/30">&middot;</span>
            <span>E</span><span className="text-[#F5A623]/30">&middot;</span>
            <span>A</span><span className="text-[#F5A623]/30">&middot;</span>
            <span>C</span><span className="text-[#F5A623]/30">&middot;</span>
            <span>H</span>
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
