'use client';

import React, { useState } from 'react';
import { useAFStore } from '../../store';
import { getClassData } from '../../data/mock-class';
import { getAssignableLessonsForGrade, getLessonById } from '../../data/lessons';
import { PRACTICE_TEST_TOPICS } from '../../data/curriculum';

export default function AssignmentsTab() {
  const currentUser = useAFStore((s) => s.currentUser);
  const assignLesson = useAFStore((s) => s.assignLesson);
  const assignTest = useAFStore((s) => s.assignTest);
  const assignedLessons = useAFStore((s) => s.assignedLessons);
  const assignedTests = useAFStore((s) => s.assignedTests);
  const completedLessons = useAFStore((s) => s.completedLessons);
  const testScores = useAFStore((s) => s.testScores);

  if (!currentUser) return null;

  const classData = getClassData(currentUser.grade);
  const assignableLessons = getAssignableLessonsForGrade(currentUser.grade);
  const topicMap = PRACTICE_TEST_TOPICS[currentUser.grade] || {};
  const allTestTopics = Object.values(topicMap).flat();

  const [lessonStudent, setLessonStudent] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [lessonSuccess, setLessonSuccess] = useState('');
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

  // Build assignment rows
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
    <div className="space-y-6">
      {/* Assign Content Forms */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Assign Content</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assign Lesson */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#003B71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Assign Lesson
            </h3>
            <div className="space-y-2">
              <select
                value={lessonStudent}
                onChange={(e) => setLessonStudent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#003B71] focus:border-transparent"
              >
                <option value="">Select student...</option>
                {classData.students.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
              <select
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#003B71] focus:border-transparent"
              >
                <option value="">Select lesson...</option>
                {assignableLessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.icon} {l.title} ({l.subject})</option>
                ))}
              </select>
              <button
                onClick={handleAssignLesson}
                disabled={!lessonStudent || !lessonId}
                className="w-full px-6 py-2.5 rounded-xl bg-[#003B71] hover:bg-[#002a55] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <svg className="w-4 h-4 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Assign Practice Test
            </h3>
            <div className="space-y-2">
              <select
                value={testStudent}
                onChange={(e) => setTestStudent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#003B71] focus:border-transparent"
              >
                <option value="">Select student...</option>
                {classData.students.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
              <select
                value={testTopic}
                onChange={(e) => setTestTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#003B71] focus:border-transparent"
              >
                <option value="">Select topic...</option>
                {allTestTopics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={handleAssignTest}
                disabled={!testStudent || !testTopic}
                className="w-full px-6 py-2.5 rounded-xl bg-[#F5A623] hover:bg-[#e6991a] text-[#003B71] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Assignment Tracking Table */}
      {assignmentRows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Assignments</h2>
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
                        row.type === 'Lesson' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
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

      {assignmentRows.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No assignments yet. Use the forms above to assign lessons or tests to students.</p>
        </div>
      )}
    </div>
  );
}
