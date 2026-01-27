'use client';

import React, { useState } from 'react';

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  overallProgress: number;
  streak: number;
  subjects: {
    name: string;
    progress: number;
    trend: 'up' | 'down' | 'stable';
    recentScore: number;
  }[];
  recentActivity: {
    date: string;
    action: string;
    subject: string;
    result?: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
}

interface ClassData {
  totalStudents: number;
  averageProgress: number;
  activeToday: number;
  averageStreak: number;
  topPerformers: { name: string; progress: number }[];
  needsAttention: { name: string; issue: string; studentId?: string }[];
  subjectBreakdown: {
    name: string;
    classAverage: number;
    studentCount: number;
  }[];
  weeklyActivity: number[];
}

const MOCK_STUDENTS: StudentData[] = [
  {
    id: '1',
    name: 'Emma Wilson',
    avatar: '👩',
    grade: 'A-',
    overallProgress: 87,
    streak: 12,
    subjects: [
      { name: 'Math', progress: 92, trend: 'up', recentScore: 95 },
      { name: 'Reading', progress: 85, trend: 'stable', recentScore: 82 },
      { name: 'Science', progress: 88, trend: 'up', recentScore: 90 },
      { name: 'Writing', progress: 78, trend: 'down', recentScore: 75 },
    ],
    recentActivity: [
      { date: '2 hours ago', action: 'Completed', subject: 'Math Quiz', result: '95%' },
      { date: 'Yesterday', action: 'Practiced', subject: 'Algebra', result: '30 min' },
      { date: '2 days ago', action: 'Mastered', subject: 'Fractions', result: '100%' },
    ],
    strengths: ['Problem Solving', 'Critical Thinking', 'Numerical Analysis'],
    areasForImprovement: ['Essay Structure', 'Time Management'],
  },
  {
    id: '2',
    name: 'James Chen',
    avatar: '👨',
    grade: 'B+',
    overallProgress: 78,
    streak: 5,
    subjects: [
      { name: 'Math', progress: 72, trend: 'up', recentScore: 78 },
      { name: 'Reading', progress: 85, trend: 'up', recentScore: 88 },
      { name: 'Science', progress: 80, trend: 'stable', recentScore: 79 },
      { name: 'Writing', progress: 75, trend: 'up', recentScore: 80 },
    ],
    recentActivity: [
      { date: '3 hours ago', action: 'Completed', subject: 'Reading Passage', result: '88%' },
      { date: 'Yesterday', action: 'Started', subject: 'Quadratic Equations' },
      { date: '3 days ago', action: 'Reviewed', subject: 'Essay Feedback' },
    ],
    strengths: ['Reading Comprehension', 'Creativity', 'Collaboration'],
    areasForImprovement: ['Algebraic Concepts', 'Test-Taking Speed'],
  },
  {
    id: '3',
    name: 'Sofia Martinez',
    avatar: '👩',
    grade: 'A',
    overallProgress: 94,
    streak: 28,
    subjects: [
      { name: 'Math', progress: 96, trend: 'up', recentScore: 98 },
      { name: 'Reading', progress: 92, trend: 'stable', recentScore: 90 },
      { name: 'Science', progress: 95, trend: 'up', recentScore: 97 },
      { name: 'Writing', progress: 90, trend: 'up', recentScore: 92 },
    ],
    recentActivity: [
      { date: '1 hour ago', action: 'Completed', subject: 'Advanced Calculus', result: '98%' },
      { date: 'Today', action: 'Mastered', subject: 'Physics Concepts', result: '100%' },
      { date: 'Yesterday', action: 'Helped', subject: 'Peer Tutoring', result: '2 students' },
    ],
    strengths: ['All Subjects', 'Self-Motivation', 'Analytical Thinking'],
    areasForImprovement: ['Already excelling - consider advanced content'],
  },
];

// Extra students for "needs attention" that can be viewed
const ATTENTION_STUDENTS: StudentData[] = [
  {
    id: 'tyler',
    name: 'Tyler Robinson',
    avatar: '👦',
    grade: 'C',
    overallProgress: 52,
    streak: 0,
    subjects: [
      { name: 'Math', progress: 38, trend: 'down', recentScore: 45 },
      { name: 'Reading', progress: 65, trend: 'stable', recentScore: 62 },
      { name: 'Science', progress: 55, trend: 'down', recentScore: 50 },
      { name: 'Writing', progress: 50, trend: 'stable', recentScore: 55 },
    ],
    recentActivity: [
      { date: '3 days ago', action: 'Attempted', subject: 'Math Quiz', result: '45%' },
      { date: '5 days ago', action: 'Started', subject: 'Algebra' },
    ],
    strengths: ['Reading Comprehension'],
    areasForImprovement: ['Math fundamentals', 'Study consistency', 'Test preparation'],
  },
  {
    id: 'maya',
    name: 'Maya Lewis',
    avatar: '👧',
    grade: 'B-',
    overallProgress: 68,
    streak: 0,
    subjects: [
      { name: 'Math', progress: 70, trend: 'stable', recentScore: 72 },
      { name: 'Reading', progress: 72, trend: 'stable', recentScore: 70 },
      { name: 'Science', progress: 65, trend: 'down', recentScore: 60 },
      { name: 'Writing', progress: 64, trend: 'stable', recentScore: 65 },
    ],
    recentActivity: [
      { date: '5 days ago', action: 'Completed', subject: 'Reading Quiz', result: '70%' },
      { date: '6 days ago', action: 'Practiced', subject: 'Writing' },
    ],
    strengths: ['Consistent effort when engaged'],
    areasForImprovement: ['Regular practice schedule', 'Science concepts', 'Re-engagement needed'],
  },
];

const MOCK_CLASS_DATA: ClassData = {
  totalStudents: 28,
  averageProgress: 76,
  activeToday: 22,
  averageStreak: 8,
  topPerformers: [
    { name: 'Sofia M.', progress: 94 },
    { name: 'Emma W.', progress: 87 },
    { name: 'Alex K.', progress: 85 },
  ],
  needsAttention: [
    { name: 'Tyler R.', issue: 'Falling behind in Math', studentId: 'tyler' },
    { name: 'Maya L.', issue: 'No activity for 5 days', studentId: 'maya' },
  ],
  subjectBreakdown: [
    { name: 'Math', classAverage: 74, studentCount: 28 },
    { name: 'Reading', classAverage: 82, studentCount: 28 },
    { name: 'Science', classAverage: 78, studentCount: 25 },
    { name: 'Writing', classAverage: 71, studentCount: 28 },
  ],
  weeklyActivity: [85, 92, 78, 95, 88, 42, 38],
};

export default function AnalyticsDashboardDemo() {
  const [view, setView] = useState<'class' | 'student'>('class');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 to-blue-100 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Student Analytics Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore class-wide insights and individual student progress with real-time data visualization.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl p-1 shadow-lg inline-flex">
            <button
              onClick={() => {
                setView('class');
                setSelectedStudent(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                view === 'class'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Class Overview
            </button>
            <button
              onClick={() => setView('student')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                view === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👤 Student View
            </button>
          </div>
        </div>

        {view === 'class' ? (
          /* Class Overview */
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: MOCK_CLASS_DATA.totalStudents, icon: '👥', color: 'bg-blue-500' },
                { label: 'Class Average', value: `${MOCK_CLASS_DATA.averageProgress}%`, icon: '📊', color: 'bg-green-500' },
                { label: 'Active Today', value: MOCK_CLASS_DATA.activeToday, icon: '✨', color: 'bg-purple-500' },
                { label: 'Avg Streak', value: `${MOCK_CLASS_DATA.averageStreak} days`, icon: '🔥', color: 'bg-orange-500' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                    {metric.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Subject Performance</h3>
                <div className="space-y-4">
                  {MOCK_CLASS_DATA.subjectBreakdown.map((subject, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{subject.name}</span>
                        <span className="font-medium">{subject.classAverage}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(subject.classAverage)} transition-all`}
                          style={{ width: `${subject.classAverage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Weekly Activity</h3>
                <div className="flex items-end justify-between h-40 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                        style={{ height: `${MOCK_CLASS_DATA.weeklyActivity[idx]}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lists Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Performers */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">🏆 Top Performers</h3>
                <div className="space-y-3">
                  {MOCK_CLASS_DATA.topPerformers.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                      <span className="font-bold text-green-600">{student.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Attention */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">⚠️ Needs Attention</h3>
                <div className="space-y-3">
                  {MOCK_CLASS_DATA.needsAttention.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-yellow-700">{student.issue}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const attentionStudent = ATTENTION_STUDENTS.find(s => s.id === student.studentId);
                          if (attentionStudent) {
                            setSelectedStudent(attentionStudent);
                            setView('student');
                          }
                        }}
                        className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-300 transition"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">All Students</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {MOCK_STUDENTS.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setView('student');
                    }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{student.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="font-bold text-blue-600">{student.overallProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${getProgressColor(student.overallProgress)}`}
                        style={{ width: `${student.overallProgress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Student View */
          <div className="space-y-6">
            {/* Student Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-4 overflow-x-auto">
              {MOCK_STUDENTS.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition whitespace-nowrap ${
                    selectedStudent?.id === student.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{student.avatar}</span>
                  {student.name}
                </button>
              ))}
            </div>

            {selectedStudent ? (
              <>
                {/* Student Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-6">
                    <span className="text-6xl">{selectedStudent.avatar}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                      <div className="flex gap-4 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Grade: {selectedStudent.grade}
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                          🔥 {selectedStudent.streak} day streak
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {selectedStudent.overallProgress}% Progress
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${selectedStudent.overallProgress * 2.51} 251`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{selectedStudent.overallProgress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject Progress */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Subject Progress</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedStudent.subjects.map((subject, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{subject.name}</span>
                          <span className={`flex items-center gap-1 ${getTrendColor(subject.trend)}`}>
                            {getTrendIcon(subject.trend)}
                            <span className="text-sm">{subject.trend}</span>
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full ${getProgressColor(subject.progress)}`}
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{subject.progress}% mastery</span>
                          <span>Last score: {subject.recentScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity & Insights */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {selectedStudent.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                            {activity.action === 'Completed' ? '✅' : activity.action === 'Mastered' ? '🏆' : '📚'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{activity.action}</span> {activity.subject}
                            </p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                          {activity.result && (
                            <span className="font-medium text-blue-600">{activity.result}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">💪 Strengths</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.strengths.map((strength, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">🎯 Areas to Improve</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.areasForImprovement.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <span className="text-5xl mb-4 block">👤</span>
                <p className="text-gray-500">Select a student above to view their detailed analytics</p>
              </div>
            )}
          </div>
        )}

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Dashboard Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📊', title: 'Real-time Data', desc: 'Live progress tracking' },
              { icon: '🎯', title: 'Insights', desc: 'AI-powered recommendations' },
              { icon: '📈', title: 'Trend Analysis', desc: 'Performance over time' },
              { icon: '⚠️', title: 'Early Alerts', desc: 'At-risk identification' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
