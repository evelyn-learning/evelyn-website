'use client';

import React from 'react';
import { useAFStore } from '../../store';
import { getChildAccount } from '../../data/accounts';
import { getProgressForChild } from '../../data/mock-progress';

export default function ParentDashboard() {
  const currentUser = useAFStore((s) => s.currentUser);
  if (!currentUser) return null;

  const child = getChildAccount(currentUser.id);
  const progress = child ? getProgressForChild(child.id) : null;
  const childName = child?.name ?? 'Your Child';
  const childFirst = childName.split(' ')[0];

  // Mock cycle assessment data
  const cycleAssessments = [
    { cycle: 'Cycle 1', score: 82, date: 'Oct 2025' },
    { cycle: 'Cycle 2', score: 78, date: 'Dec 2025' },
    { cycle: 'Cycle 3', score: null, date: 'Feb 2026' },
  ];

  // REACH recognition
  const reachValues = [
    { letter: 'R', value: 'Respect', earned: true },
    { letter: 'E', value: 'Enthusiasm', earned: true },
    { letter: 'A', value: 'Achievement', earned: false },
    { letter: 'C', value: 'Citizenship', earned: true },
    { letter: 'H', value: 'Hard Work', earned: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-5">
        <div className="w-14 h-14 rounded-full bg-[#F5A623] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
          {child?.avatar ?? 'S'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{childFirst}&apos;s Learning Dashboard</h1>
          <p className="text-sm text-gray-600">Grade {currentUser.grade} &middot; Achievement First &middot; Math &amp; Science</p>
        </div>
        {progress && (
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-2xl font-bold text-[#003B71]">{progress.overallProgress}%</p>
            <p className="text-xs text-gray-500">Overall Progress</p>
          </div>
        )}
      </div>

      {progress && (
        <>
          {/* Weekly Stats */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">This Week&apos;s Activity</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Time Spent', value: progress.weeklyStats.timeSpent, icon: '🕐' },
                { label: 'Problems Solved', value: progress.weeklyStats.problemsSolved, icon: '✏️' },
                { label: 'Tests Completed', value: progress.weeklyStats.testsCompleted, icon: '📝' },
                { label: 'Study Streak', value: progress.weeklyStats.streak, icon: '🔥' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
                  <span className="text-2xl block mb-1">{stat.icon}</span>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cycle Assessments */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Cycle Assessment Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cycleAssessments.map((ca) => (
                <div key={ca.cycle} className={`rounded-xl p-4 border text-center ${
                  ca.score === null ? 'bg-gray-50 border-gray-200' :
                  ca.score >= 80 ? 'bg-green-50 border-green-200' :
                  ca.score >= 70 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <p className="text-sm font-semibold text-gray-700">{ca.cycle}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {ca.score !== null ? `${ca.score}%` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{ca.date}{ca.score === null ? ' (Upcoming)' : ''}</p>
                </div>
              ))}
            </div>
          </div>

          {/* REACH Recognition */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">REACH Values Recognition</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-center gap-4">
                {reachValues.map((rv) => (
                  <div key={rv.letter} className="text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-2 ${
                      rv.earned ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {rv.letter}
                    </div>
                    <p className={`text-xs font-medium ${rv.earned ? 'text-gray-700' : 'text-gray-400'}`}>{rv.value}</p>
                    {rv.earned && <p className="text-[10px] text-green-600 font-semibold mt-0.5">Earned</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Mastery */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Skill Mastery</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
              {progress.skills.map((skill) => (
                <div key={skill.topic} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-44 truncate">{skill.topic}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${skill.mastery}%`,
                        backgroundColor:
                          skill.mastery >= 90 ? '#22c55e' : skill.mastery >= 75 ? '#003B71' : skill.mastery >= 50 ? '#F5A623' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-10 text-right">{skill.mastery}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Activity</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {progress.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0">{activity.date}</span>
                  <span className="text-xs font-medium text-[#003B71] bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    {activity.action}
                  </span>
                  <span className="text-sm text-gray-700 truncate">{activity.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* College Readiness Indicator */}
          <div className="bg-gradient-to-r from-[#003B71] to-[#00295a] rounded-xl p-5 text-white">
            <h2 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-2">College Readiness Path</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#F5A623" strokeWidth="3"
                    strokeDasharray={`${progress.overallProgress} ${100 - progress.overallProgress}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#F5A623]">
                  {progress.overallProgress}%
                </span>
              </div>
              <div>
                <p className="font-semibold">{childFirst} is building a strong foundation</p>
                <p className="text-blue-200 text-sm mt-1">
                  On track for grade-level proficiency. Focus area:{' '}
                  <span className="text-[#F5A623] font-medium">
                    {progress.skills.reduce((a, b) => (a.mastery < b.mastery ? a : b)).topic}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* AF Recommendation */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h2 className="text-sm font-semibold text-[#003B71] mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AF Recommendation
            </h2>
            <p className="text-sm text-gray-700">
              {childFirst} is making great progress! Based on their recent activity, we recommend focusing on{' '}
              <span className="font-semibold">
                {progress.skills.reduce((a, b) => (a.mastery < b.mastery ? a : b)).topic}
              </span>{' '}
              this week to strengthen that skill area. Consistent daily practice (even 15-20 minutes) can make a big difference.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
