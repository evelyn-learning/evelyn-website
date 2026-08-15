'use client';

import React from 'react';
import { useExplorerStore } from '../../store';
import { getChildAccount } from '../../data/accounts';
import { getProgressForChild } from '../../data/mock-progress';

export default function ParentDashboard() {
  const currentUser = useExplorerStore((s) => s.currentUser);
  if (!currentUser) return null;

  const child = getChildAccount(currentUser.id);
  const progress = child ? getProgressForChild(child.id) : null;
  const childName = child?.name ?? 'Your Child';
  const childFirst = childName.split(' ')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 bg-purple-50 rounded-xl p-5">
        <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
          {child?.avatar ?? 'S'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{childFirst}&apos;s Learning Dashboard</h1>
          <p className="text-sm text-gray-600">Grade {currentUser.grade} &middot; Math &amp; Science</p>
        </div>
        {progress && (
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-2xl font-bold text-purple-700">{progress.overallProgress}%</p>
            <p className="text-xs text-gray-500">Overall Progress</p>
          </div>
        )}
      </div>

      {progress && (
        <>
          {/* Weekly Stats */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              This Week&apos;s Activity
            </h2>
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

          {/* Skill Mastery */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Skill Mastery
            </h2>
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
                          skill.mastery >= 90 ? '#22c55e' : skill.mastery >= 75 ? '#7c3aed' : skill.mastery >= 50 ? '#facc15' : '#ef4444',
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
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recent Activity
            </h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {progress.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0">{activity.date}</span>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    {activity.action}
                  </span>
                  <span className="text-sm text-gray-700 truncate">{activity.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {progress.achievements.map((ach, i) => (
                <div key={i} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{ach.title}</p>
                      <p className="text-xs text-gray-600">{ach.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explorer Recommendation */}
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h2 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Explorer Recommendation
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
