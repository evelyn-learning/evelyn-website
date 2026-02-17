'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ─── Simulated data ──────────────────────────────────────────────────
interface Student {
  name: string;
  progress: number;
  status: 'On Track' | 'Excelling' | 'Needs Attention';
}

const STUDENTS: Student[] = [
  { name: 'Aiden Chen', progress: 78, status: 'On Track' },
  { name: 'Aanya Sharma', progress: 92, status: 'Excelling' },
  { name: 'Harpreet Singh', progress: 65, status: 'Needs Attention' },
  { name: 'Mei-Lin Wong', progress: 85, status: 'On Track' },
  { name: 'Riya Patel', progress: 44, status: 'Needs Attention' },
  { name: 'Ethan Williams', progress: 88, status: 'Excelling' },
  { name: 'Jaspreet Kaur', progress: 72, status: 'On Track' },
  { name: 'Noah Thompson', progress: 58, status: 'Needs Attention' },
  { name: 'Priya Dhillon', progress: 81, status: 'On Track' },
  { name: 'Lucas Martin', progress: 76, status: 'On Track' },
];

const CLASS_PERFORMANCE = [
  { topic: 'Number Sense', score: 82 },
  { topic: 'Fractions', score: 61 },
  { topic: 'Decimals', score: 74 },
  { topic: 'Ratios', score: 53 },
  { topic: 'Geometry', score: 79 },
  { topic: 'Data Analysis', score: 45 },
];

const ALERTS = [
  {
    name: 'Riya Patel',
    issues: 'Struggling with Fractions (44%) and Ratios (38%)',
    suggestion: 'Recommend extra practice worksheets and 1-on-1 tutoring sessions.',
  },
  {
    name: 'Noah Thompson',
    issues: 'Falling behind in Geometry (52%) and Decimals (48%)',
    suggestion: 'Consider visual learning aids and hands-on activities.',
  },
  {
    name: 'Harpreet Singh',
    issues: 'Needs help with Ratios (41%) and Data Analysis (35%)',
    suggestion: 'Assign foundational exercises before advancing to next unit.',
  },
];

// Parent View data
const PARENT_SKILLS = [
  { topic: 'Fractions', mastery: 95 },
  { topic: 'Measurement', mastery: 91 },
  { topic: 'Decimals', mastery: 88 },
  { topic: 'Geometry', mastery: 82 },
  { topic: 'Patterns & Algebra', mastery: 76 },
];

const PARENT_WEEKLY = {
  timeSpent: '4.5 hours',
  problemsSolved: 47,
  testsCompleted: 3,
  streak: '5 days',
};

// ─── Helpers ─────────────────────────────────────────────────────────
const statusColor = (status: string) => {
  if (status === 'Excelling') return 'bg-green-100 text-green-700';
  if (status === 'On Track') return 'bg-blue-100 text-blue-700';
  return 'bg-red-100 text-red-700';
};

const barColor = (score: number) => {
  if (score >= 75) return '#7c3aed';
  if (score >= 60) return '#a78bfa';
  return '#f87171';
};

// ─── Component ────────────────────────────────────────────────────────
export default function Dashboard() {
  const [view, setView] = useState<'instructor' | 'parent'>('instructor');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-purple-600">5.</span> Student &amp; Parent Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Real-time analytics for instructors and progress reports for parents
        </p>
      </div>

      <div className="p-6">
        {/* Tab Switcher */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-xs">
          <button
            onClick={() => setView('instructor')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'instructor'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Instructor View
          </button>
          <button
            onClick={() => setView('parent')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'parent'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Parent View
          </button>
        </div>

        {/* ─── Instructor View ──────────────────────────────── */}
        {view === 'instructor' && (
          <div className="space-y-6">
            {/* Class Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Class Overview — Grade 6 Mathematics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Student</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Progress</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STUDENTS.map((s) => (
                      <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-gray-800">{s.name}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-100 rounded-full">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${s.progress}%`,
                                  backgroundColor: s.progress >= 80 ? '#22c55e' : s.progress >= 60 ? '#7c3aed' : '#ef4444',
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{s.progress}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(s.status)}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Chart + Alerts side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Class Performance by Topic
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={CLASS_PERFORMANCE} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="topic"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        angle={-20}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [`${value}%`, 'Class Average']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                        {CLASS_PERFORMANCE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={barColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Students Needing Attention
                </h3>
                <div className="space-y-3">
                  {ALERTS.map((a) => (
                    <div key={a.name} className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
                      <p className="text-red-600 text-xs mt-1">{a.issues}</p>
                      <p className="text-gray-600 text-xs mt-1.5 italic">{a.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Parent View ──────────────────────────────────── */}
        {view === 'parent' && (
          <div className="space-y-6">
            {/* Student Header */}
            <div className="flex items-center gap-4 bg-purple-50 rounded-xl p-4">
              <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold">
                A
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Aanya Sharma</h3>
                <p className="text-sm text-gray-600">Grade 5 Mathematics</p>
              </div>
            </div>

            {/* Weekly Stats */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                This Week&apos;s Activity
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Time Spent', value: PARENT_WEEKLY.timeSpent, icon: '🕐' },
                  { label: 'Problems Solved', value: PARENT_WEEKLY.problemsSolved, icon: '✏️' },
                  { label: 'Tests Completed', value: PARENT_WEEKLY.testsCompleted, icon: '📝' },
                  { label: 'Study Streak', value: PARENT_WEEKLY.streak, icon: '🔥' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                    <span className="text-2xl block mb-1">{stat.icon}</span>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Skill Mastery
              </h3>
              <div className="space-y-3">
                {PARENT_SKILLS.map((skill) => (
                  <div key={skill.topic} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-36">{skill.topic}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${skill.mastery}%`,
                          backgroundColor: skill.mastery >= 90 ? '#22c55e' : skill.mastery >= 75 ? '#7c3aed' : '#facc15',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 w-10 text-right">{skill.mastery}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-3xl shadow-lg">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-700">This Week&apos;s Achievement</p>
                  <p className="text-xl font-bold text-gray-900">Mastered Decimal Addition!</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Aanya scored 95% or higher on 3 consecutive decimal addition tests. Amazing progress!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
