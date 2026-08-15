'use client';

import React from 'react';
import { useExplorerStore } from '../../store';
import { getDefaultLessonsForGrade, getLessonById } from '../../data/lessons';
import { getAdaptiveLessonsForGrade } from '../../data/adaptive-lessons';
import { getProgressForStudent } from '../../data/mock-progress';

export default function StudentHome() {
  const { currentUser, startLesson, startAdaptiveLesson, navigate, completedLessons, assignedLessons, assignedTests, setPreSelectedTestTopic } = useExplorerStore();
  if (!currentUser) return null;

  const defaultLessons = getDefaultLessonsForGrade(currentUser.grade);
  const progress = getProgressForStudent(currentUser.id);

  // Get assigned content for this student
  const myAssignedLessonIds = assignedLessons[currentUser.name] || [];
  const myAssignedLessons = myAssignedLessonIds
    .map((id) => getLessonById(id))
    .filter((l): l is NonNullable<typeof l> => l !== undefined);
  const myAssignedTests = assignedTests[currentUser.name] || [];

  const instructorName = currentUser.grade === 3 ? 'Ms. Chen' : 'Mr. Thompson';

  // Total lessons = default + assigned
  const totalLessons = defaultLessons.length + myAssignedLessons.length;
  const completedCount = [...defaultLessons, ...myAssignedLessons].filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : (progress?.overallProgress ?? 0);

  const goals = progress?.todaysGoals ?? [];

  // Determine which lesson to continue (default first, then assigned)
  const allLessons = [...defaultLessons, ...myAssignedLessons];
  const nextLesson = allLessons.find((l) => !completedLessons.includes(l.id)) || allLessons[0];

  const handleTakeTest = (topic: string) => {
    setPreSelectedTestTopic(topic);
    navigate('practice-test');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome + Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">Grade {currentUser.grade} &middot; Math &amp; Science</p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke="#e9d5ff"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="3"
                strokeDasharray={`${overallProgress} ${100 - overallProgress}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-purple-700">
              {overallProgress}%
            </span>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">Overall Progress</p>
            <p className="text-gray-500">{completedCount} of {totalLessons} lessons</p>
          </div>
        </div>
      </div>

      {/* Continue Learning CTA */}
      {nextLesson && (
        <button
          onClick={() => startLesson(nextLesson.id)}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg group"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
            {nextLesson.icon}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-purple-200">Continue Learning</p>
            <p className="text-lg font-bold">{nextLesson.title}</p>
            <p className="text-sm text-purple-200 mt-0.5">{nextLesson.subject} &middot; Grade {nextLesson.grade}</p>
          </div>
          <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Default Lesson cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Lessons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {defaultLessons.map((lesson) => {
            const done = completedLessons.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => startLesson(lesson.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all group ${
                  done
                    ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                    : 'border-gray-100 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{lesson.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {lesson.title}
                      </p>
                      {done && (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-2 bg-purple-100 text-purple-700 font-medium">
                      {lesson.subject}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assigned Content */}
      {(myAssignedLessons.length > 0 || myAssignedTests.length > 0) && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Assigned to You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assigned Lessons */}
            {myAssignedLessons.map((lesson) => {
              const done = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => startLesson(lesson.id)}
                  className={`text-left p-5 rounded-xl border-2 transition-all group ${
                    done
                      ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                      : 'border-orange-200 bg-orange-50/30 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{lesson.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                          {lesson.title}
                        </p>
                        {done && (
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                          {lesson.subject}
                        </span>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                          Assigned by {instructorName}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Assigned Tests */}
            {myAssignedTests.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTakeTest(topic)}
                className="text-left p-5 rounded-xl border-2 border-yellow-200 bg-yellow-50/30 hover:border-yellow-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                      Practice Test: {topic}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Take a practice test on this topic to check your understanding.</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        Practice Test
                      </span>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                        Assigned by {instructorName}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-yellow-500 text-purple-900 text-xs font-bold">
                    Take Test
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive AI Lessons (only for adaptive accounts) */}
      {currentUser.isAdaptive && (() => {
        const adaptiveLessons = getAdaptiveLessonsForGrade(currentUser.grade);
        if (adaptiveLessons.length === 0) return null;
        return (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Adaptive Lessons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {adaptiveLessons.map((lesson) => {
                const done = completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => startAdaptiveLesson(lesson.id)}
                    className={`text-left p-5 rounded-xl border-2 transition-all group ${
                      done
                        ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                        : 'border-amber-200 bg-amber-50/30 hover:border-amber-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{lesson.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                            {lesson.title}
                          </p>
                          {done && (
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                            {lesson.subject}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                            AI Adaptive
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Quick Tools */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Tools</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Math Helper',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zM9.75 9h4.5m-4.5 0a2.25 2.25 0 00-2.25 2.25v6a2.25 2.25 0 002.25 2.25h4.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25m-4.5 0V6.75A2.25 2.25 0 0112 4.5a2.25 2.25 0 012.25 2.25V9" />
                </svg>
              ),
              screen: 'math-helper' as const,
            },
            {
              label: 'Practice Test',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              screen: 'practice-test' as const,
            },
            {
              label: 'Homework Chat',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              ),
              screen: 'homework-chat' as const,
            },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={() => navigate(tool.screen)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                {tool.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Goals */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Today&apos;s Goals</h2>
          <div className="space-y-2">
            {goals.map((goal, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  goal.done ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {goal.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${goal.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {goal.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
