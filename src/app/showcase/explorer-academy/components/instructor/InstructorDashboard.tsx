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
import { useExplorerStore } from '../../store';
import { getClassData } from '../../data/mock-class';
import { getAssignableLessonsForGrade, getLessonById } from '../../data/lessons';
import { PRACTICE_TEST_TOPICS } from '../../data/curriculum';

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

const priorityColor = (p: string) => {
  if (p === 'high') return 'bg-red-100 text-red-700';
  if (p === 'normal') return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-500';
};

export default function InstructorDashboard() {
  const currentUser = useExplorerStore((s) => s.currentUser);
  const assignLesson = useExplorerStore((s) => s.assignLesson);
  const assignTest = useExplorerStore((s) => s.assignTest);
  const assignedLessons = useExplorerStore((s) => s.assignedLessons);
  const assignedTests = useExplorerStore((s) => s.assignedTests);
  const completedLessons = useExplorerStore((s) => s.completedLessons);
  const testScores = useExplorerStore((s) => s.testScores);

  if (!currentUser) return null;

  const classData = getClassData(currentUser.grade);
  const assignableLessons = getAssignableLessonsForGrade(currentUser.grade);
  const topicMap = PRACTICE_TEST_TOPICS[currentUser.grade] || {};
  const allTestTopics = Object.values(topicMap).flat();

  const [tab, setTab] = useState<'overview' | 'path'>('overview');

  // Assign Lesson form state
  const [lessonStudent, setLessonStudent] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [lessonSuccess, setLessonSuccess] = useState('');

  // Assign Test form state
  const [testStudent, setTestStudent] = useState('');
  const [testTopic, setTestTopic] = useState('');
  const [testSuccess, setTestSuccess] = useState('');

  const handleAssignLesson = () => {
    if (!lessonStudent || !lessonId) return;
    const lesson = getLessonById(lessonId);
    assignLesson(lessonStudent, lessonId);
    setLessonSuccess(`Assigned "${lesson?.title}" to ${lessonStudent}`);
    setTimeout(() => setLessonSuccess(''), 3000);
    setLessonStudent('');
    setLessonId('');
  };

  const handleAssignTest = () => {
    if (!testStudent || !testTopic) return;
    assignTest(testStudent, testTopic);
    setTestSuccess(`Assigned "${testTopic}" test to ${testStudent}`);
    setTimeout(() => setTestSuccess(''), 3000);
    setTestStudent('');
    setTestTopic('');
  };

  // Build assignment tracking rows
  const assignmentRows: { student: string; type: 'Lesson' | 'Test'; content: string; status: string; statusColor: string }[] = [];
  for (const [student, lessonIds] of Object.entries(assignedLessons)) {
    for (const lid of lessonIds) {
      const lesson = getLessonById(lid);
      const done = completedLessons.includes(lid);
      assignmentRows.push({
        student,
        type: 'Lesson',
        content: lesson?.title || lid,
        status: done ? 'Completed' : 'Assigned',
        statusColor: done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
      });
    }
  }
  for (const [student, topics] of Object.entries(assignedTests)) {
    for (const t of topics) {
      const score = testScores[t];
      const done = score !== undefined;
      assignmentRows.push({
        student,
        type: 'Test',
        content: t,
        status: done ? `${score}/5` : 'Assigned',
        statusColor: done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
      });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}&apos;s Class</h1>
        <p className="text-gray-500 mt-1">{classData.gradeLabel}</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-xs">
        <button
          onClick={() => setTab('overview')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'overview' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Class Overview
        </button>
        <button
          onClick={() => setTab('path')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'path' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Learning Path
        </button>
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Student Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Student Progress</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-2.5 px-4 font-medium text-gray-500">Student</th>
                    <th className="text-left py-2.5 px-4 font-medium text-gray-500">Progress</th>
                    <th className="text-left py-2.5 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-2.5 px-4 font-medium text-gray-500 hidden md:table-cell">Current Topic</th>
                    <th className="text-left py-2.5 px-4 font-medium text-gray-500 hidden lg:table-cell">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.students.map((s) => (
                    <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4 font-medium text-gray-800">{s.name}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${s.progress}%`,
                                backgroundColor: s.progress >= 80 ? '#22c55e' : s.progress >= 60 ? '#7c3aed' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-gray-600 hidden md:table-cell">{s.currentTopic}</td>
                      <td className="py-2.5 px-4 text-gray-400 text-xs hidden lg:table-cell">{s.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Class Performance by Topic
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={classData.performance} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                    {classData.performance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Students Needing Attention
              </h2>
              <div className="space-y-3">
                {classData.alerts.map((a) => (
                  <div key={a.name} className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
                    <p className="text-red-600 text-xs mt-1">{a.issues}</p>
                    <p className="text-gray-600 text-xs mt-1.5 italic">{a.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assign Content — Two Forms */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Assign Content
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assign Lesson */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Assign Lesson
                </h3>
                <div className="space-y-2">
                  <select
                    value={lessonStudent}
                    onChange={(e) => setLessonStudent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select student...</option>
                    {classData.students.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <select
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select lesson...</option>
                    {assignableLessons.map((l) => (
                      <option key={l.id} value={l.id}>{l.icon} {l.title} ({l.subject})</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignLesson}
                    disabled={!lessonStudent || !lessonId}
                    className="w-full px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Lesson
                  </button>
                </div>
                {lessonSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {lessonSuccess}
                  </div>
                )}
              </div>

              {/* Assign Test */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Assign Practice Test
                </h3>
                <div className="space-y-2">
                  <select
                    value={testStudent}
                    onChange={(e) => setTestStudent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select student...</option>
                    {classData.students.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <select
                    value={testTopic}
                    onChange={(e) => setTestTopic(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select topic...</option>
                    {allTestTopics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignTest}
                    disabled={!testStudent || !testTopic}
                    className="w-full px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Test
                  </button>
                </div>
                {testSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {testSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Content Tracking */}
          {assignmentRows.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Assigned Content</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-2.5 px-4 font-medium text-gray-500">Student</th>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-500">Content</th>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentRows.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-4 font-medium text-gray-800">{row.student}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.type === 'Lesson' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-600">{row.content}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'path' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Curriculum Learning Path — {classData.gradeLabel}
          </h2>
          {/* Header row */}
          <div className="flex items-center gap-4 px-3 pb-2 border-b border-gray-100 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase w-6 text-center">#</span>
            <div className="flex-1">
              <span className="text-xs font-semibold text-gray-400 uppercase">Topic</span>
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase">Priority</span>
          </div>
          <div className="space-y-2">
            {classData.curriculumPath.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-bold text-gray-300 w-6 text-center">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.topic}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
