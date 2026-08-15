'use client';

import React, { useState } from 'react';
import { useExplorerStore } from '../../store';
import { getLessonById } from '../../data/lessons';
import { NarrationCard, VideoCard, QuestionCard, SummaryCard } from '../shared/SegmentRenderers';

export default function LessonPlayer() {
  const { activeLessonId, lessonSegmentIndex, advanceSegment, completeLesson, navigate } = useExplorerStore();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredSegments, setAnsweredSegments] = useState<Set<number>>(new Set());

  const lesson = activeLessonId ? getLessonById(activeLessonId) : null;

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Lesson not found.</p>
        <button onClick={() => navigate('student-home')} className="mt-4 text-purple-600 hover:underline">
          Back to Home
        </button>
      </div>
    );
  }

  const segments = lesson.segments;
  const currentIndex = lessonSegmentIndex;
  const currentSegment = segments[currentIndex];
  const isLastSegment = currentIndex >= segments.length - 1;
  const totalQuestions = segments.filter((s) => s.type === 'comprehension' || s.type === 'practice').length;

  // Check if current segment requires interaction before advancing
  const isQuestionSegment = currentSegment?.type === 'comprehension' || currentSegment?.type === 'practice';
  const isQuestionAnswered = answeredSegments.has(currentIndex);

  const handleNext = () => {
    if (isLastSegment) return;
    advanceSegment();
  };

  const handleCorrect = () => {
    setCorrectAnswers((c) => c + 1);
    setAnsweredSegments((s) => new Set(s).add(currentIndex));
  };

  const handleAnswered = () => {
    setAnsweredSegments((s) => new Set(s).add(currentIndex));
  };

  const handleFinish = () => {
    completeLesson(lesson.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header + Progress */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('student-home')}
          className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 text-center">{lesson.title}</p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {currentIndex + 1} / {segments.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / segments.length) * 100}%` }}
        />
      </div>

      {/* Current segment */}
      <div className="min-h-[300px]">
        {currentSegment?.type === 'narration' && (
          <NarrationCard segment={currentSegment} />
        )}
        {currentSegment?.type === 'video' && (
          <VideoCard segment={currentSegment} />
        )}
        {(currentSegment?.type === 'comprehension' || currentSegment?.type === 'practice') && (
          <QuestionCard
            key={currentIndex}
            segment={currentSegment}
            onCorrect={handleCorrect}
            onAnswered={handleAnswered}
            label={currentSegment.type === 'comprehension' ? 'Check Your Understanding' : 'Practice Problem'}
          />
        )}
        {currentSegment?.type === 'summary' && (
          <SummaryCard
            segment={currentSegment}
            correctCount={correctAnswers}
            totalQuestions={totalQuestions}
            onFinish={handleFinish}
          />
        )}
      </div>

      {/* Next button (hidden on summary) */}
      {currentSegment?.type !== 'summary' && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={isQuestionSegment && !isQuestionAnswered}
            className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLastSegment ? 'Finish' : 'Next'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
