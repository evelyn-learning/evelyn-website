'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useExplorerStore, AdaptivePhase } from '../../store';
import { getAdaptiveLessonById } from '../../data/adaptive-lessons';
import { getVideosForTopic } from '../../data/curated-videos';
import { LessonSegment } from '../../data/lessons';
import { NarrationCard, VideoCard, QuestionCard, SummaryCard } from '../shared/SegmentRenderers';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// ─── Fun facts for ThinkingCard ──────────────────────────────

const FUN_FACTS = [
  'A group of flamingos is called a "flamboyance."',
  'Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs!',
  'Octopuses have three hearts and blue blood.',
  'The shortest war in history lasted 38 minutes.',
  'A bolt of lightning is 5 times hotter than the surface of the sun.',
  'Bananas are berries, but strawberries are not!',
  'The Eiffel Tower can grow 6 inches taller in summer due to heat expansion.',
  'There are more stars in the universe than grains of sand on Earth.',
  'A snail can sleep for up to 3 years.',
  'The human brain uses about 20% of the body\'s total energy.',
  'Dolphins sleep with one eye open.',
  'Venus is the only planet that spins clockwise.',
];

const PHASE_MESSAGES: Record<AdaptivePhase, string[]> = {
  INTRO: ['Getting ready...'],
  DIAGNOSTIC: [
    'Let me check what you already know...',
    'Preparing a question just for you...',
    'Checking your starting level...',
  ],
  TEACH: [
    'Preparing your next challenge...',
    'Building content based on your answers...',
    'Customizing your learning path...',
    'Finding the perfect next step for you...',
  ],
  ASSESS: [
    'Building your final assessment...',
    'Preparing your assessment questions...',
    'Let\'s see what you\'ve learned...',
  ],
  SUMMARY: [
    'Calculating your results...',
    'Putting together your personalized summary...',
  ],
};

// ─── ThinkingCard ────────────────────────────────────────────

function ThinkingCard({ phase }: { phase: AdaptivePhase }) {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length));
  const [message] = useState(() => {
    const messages = PHASE_MESSAGES[phase];
    return messages[Math.floor(Math.random() * messages.length)];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-purple-100 min-h-[300px] flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
      </div>

      {/* Phase message */}
      <p className="text-lg font-semibold text-purple-700">{message}</p>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-purple-400"
            style={{
              animation: 'adaptiveBounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Fun fact */}
      <div className="max-w-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Did you know?</p>
        <p className="text-sm text-gray-500 transition-opacity duration-300">
          {FUN_FACTS[factIndex]}
        </p>
      </div>

      <style jsx>{`
        @keyframes adaptiveBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

// ─── Phase progress indicator ────────────────────────────────

const PHASE_ORDER: AdaptivePhase[] = ['INTRO', 'DIAGNOSTIC', 'TEACH', 'ASSESS', 'SUMMARY'];
const PHASE_LABELS: Record<AdaptivePhase, string> = {
  INTRO: 'Intro',
  DIAGNOSTIC: 'Diagnostic',
  TEACH: 'Learn',
  ASSESS: 'Assessment',
  SUMMARY: 'Summary',
};

function PhaseIndicator({ currentPhase }: { currentPhase: AdaptivePhase }) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  return (
    <div className="flex items-center gap-1 text-xs">
      {PHASE_ORDER.map((phase, i) => (
        <React.Fragment key={phase}>
          <span
            className={`px-2 py-0.5 rounded-full font-medium ${
              i < currentIdx
                ? 'bg-green-100 text-green-700'
                : i === currentIdx
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            {PHASE_LABELS[phase]}
          </span>
          {i < PHASE_ORDER.length - 1 && (
            <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────

export default function AdaptiveLessonPlayer() {
  const {
    adaptiveLessonId,
    adaptivePhase,
    adaptiveSegments,
    adaptiveSegmentIndex,
    adaptiveHistory,
    currentUser,
    setAdaptivePhase,
    appendAdaptiveSegments,
    advanceAdaptiveSegment,
    addAdaptiveHistory,
    addAdaptiveVideoUsed,
    completeAdaptiveLesson,
    navigate,
  } = useExplorerStore();

  const trackInteraction = useTrackInteraction();
  const [isLoading, setIsLoading] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCurrent, setAnsweredCurrent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs for counters that drive phase transitions to avoid stale closures
  const diagnosticCountRef = useRef(0);
  const teachSegmentCountRef = useRef(0);
  const assessAnsweredCountRef = useRef(0);

  const hasFetchedRef = useRef(false);

  const lesson = adaptiveLessonId ? getAdaptiveLessonById(adaptiveLessonId) : null;

  // Load intro segments on mount
  useEffect(() => {
    if (!lesson || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    appendAdaptiveSegments(lesson.introSegments);
  }, [lesson, appendAdaptiveSegments]);

  const currentSegment = adaptiveSegments[adaptiveSegmentIndex];
  const isLastIntroSegment =
    adaptivePhase === 'INTRO' &&
    lesson &&
    adaptiveSegmentIndex >= lesson.introSegments.length - 1;

  // ─── AI call ─────────────────────────────────────────────

  const fetchAdaptiveContent = useCallback(
    async (phase: AdaptivePhase, overrides?: { diagnosticDifficulty?: string }) => {
      if (!lesson || !currentUser) return;

      setIsLoading(true);
      setError(null);

      const videos = getVideosForTopic(lesson.topicKey);
      // Read current history from the store directly to avoid stale closures
      const currentHistory = useExplorerStore.getState().adaptiveHistory;
      const currentVideosUsed = useExplorerStore.getState().adaptiveVideosUsed;

      try {
        const res = await fetch('/api/showcase/explorer-academy/adaptive-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase,
            grade: lesson.grade,
            studentName: currentUser.name.split(' ')[0],
            lessonTopic: lesson.title,
            learningObjectives: lesson.learningObjectives,
            history: currentHistory,
            availableVideos: videos.map((v) => ({
              youtubeId: v.youtubeId,
              title: v.title,
              channel: v.channel,
              level: v.level,
              topics: v.topics,
            })),
            videosUsed: currentVideosUsed,
            constraints: {
              remainingTeachBudget:
                phase === 'TEACH' ? Math.max(0, 10 - teachSegmentCountRef.current) : undefined,
              diagnosticDifficulty: overrides?.diagnosticDifficulty,
            },
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `API error ${res.status}`);
        }

        const data = await res.json();

        // Track videos used
        for (const seg of data.segments) {
          if (seg.type === 'video' && seg.youtubeId) {
            addAdaptiveVideoUsed(seg.youtubeId);
          }
        }

        appendAdaptiveSegments(data.segments);
        trackInteraction('tool_use', 'adaptive_content', { phase, segmentCount: data.segments.length, topic: lesson.title });

        if (phase === 'TEACH') {
          teachSegmentCountRef.current += data.segments.length;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [lesson, currentUser, appendAdaptiveSegments, addAdaptiveVideoUsed]
  );

  // ─── Phase transitions ──────────────────────────────────

  const handleNext = useCallback(() => {
    // Intro → Diagnostic transition
    if (isLastIntroSegment) {
      setAdaptivePhase('DIAGNOSTIC');
      advanceAdaptiveSegment();
      fetchAdaptiveContent('DIAGNOSTIC', { diagnosticDifficulty: 'easy' });
      trackInteraction('navigation', 'phase_transition', { from: 'INTRO', to: 'DIAGNOSTIC' });
      return;
    }

    // In DIAGNOSTIC: after answering, fetch next diagnostic or move to TEACH
    if (adaptivePhase === 'DIAGNOSTIC' && answeredCurrent) {
      diagnosticCountRef.current += 1;
      setAnsweredCurrent(false);

      if (diagnosticCountRef.current >= 3) {
        // All 3 diagnostic questions done → TEACH
        setAdaptivePhase('TEACH');
        advanceAdaptiveSegment();
        fetchAdaptiveContent('TEACH');
        trackInteraction('navigation', 'phase_transition', { from: 'DIAGNOSTIC', to: 'TEACH' });
      } else {
        // Next diagnostic question
        const difficulties = ['easy', 'medium', 'hard'];
        advanceAdaptiveSegment();
        fetchAdaptiveContent('DIAGNOSTIC', {
          diagnosticDifficulty: difficulties[diagnosticCountRef.current],
        });
      }
      return;
    }

    // In TEACH: advance or fetch more
    if (adaptivePhase === 'TEACH' && (answeredCurrent || currentSegment?.type === 'narration' || currentSegment?.type === 'video')) {
      setAnsweredCurrent(false);

      // Read current segments length from store directly
      const storeState = useExplorerStore.getState();
      const nextIdx = storeState.adaptiveSegmentIndex + 1;
      const totalSegments = storeState.adaptiveSegments.length;

      // If there are more buffered segments, just advance
      if (nextIdx < totalSegments) {
        advanceAdaptiveSegment();
        return;
      }

      // Check if we should move to ASSESS (minimum 4 teach segments met)
      if (teachSegmentCountRef.current >= 4) {
        setAdaptivePhase('ASSESS');
        advanceAdaptiveSegment();
        fetchAdaptiveContent('ASSESS');
        trackInteraction('navigation', 'phase_transition', { from: 'TEACH', to: 'ASSESS' });
        return;
      }

      // Fetch more teach content
      advanceAdaptiveSegment();
      fetchAdaptiveContent('TEACH');
      return;
    }

    // In ASSESS: advance through the 4 questions
    if (adaptivePhase === 'ASSESS' && answeredCurrent) {
      assessAnsweredCountRef.current += 1;
      setAnsweredCurrent(false);

      if (assessAnsweredCountRef.current >= 4) {
        // All 4 assessment questions done → SUMMARY
        setAdaptivePhase('SUMMARY');
        advanceAdaptiveSegment();
        fetchAdaptiveContent('SUMMARY');
        trackInteraction('navigation', 'phase_transition', { from: 'ASSESS', to: 'SUMMARY' });
      } else {
        advanceAdaptiveSegment();
      }
      return;
    }

    // Default: just advance (for INTRO segments before the last one)
    advanceAdaptiveSegment();
    setAnsweredCurrent(false);
  }, [
    isLastIntroSegment,
    adaptivePhase,
    answeredCurrent,
    currentSegment?.type,
    setAdaptivePhase,
    advanceAdaptiveSegment,
    fetchAdaptiveContent,
  ]);

  // ─── Question handlers ─────────────────────────────────
  // QuestionCard calls onAnswered() always, then onCorrect() only if correct.
  // Both fire synchronously in the same click handler. We use a ref flag
  // to coordinate: onCorrect sets the flag and logs correct history;
  // onAnswered uses a microtask to check if onCorrect already logged,
  // and if not, logs the incorrect result.

  const correctFiredRef = useRef(false);

  const handleCorrect = useCallback(() => {
    correctFiredRef.current = true;
    setCorrectCount((c) => c + 1);
    setAnsweredCurrent(true);

    if (currentSegment && (currentSegment.type === 'comprehension' || currentSegment.type === 'practice')) {
      addAdaptiveHistory({
        phase: adaptivePhase,
        segmentType: currentSegment.type,
        objectiveId: currentSegment.objectiveId,
        question: currentSegment.question,
        studentAnswer: currentSegment.options[currentSegment.correctIndex],
        correctAnswer: currentSegment.options[currentSegment.correctIndex],
        isCorrect: true,
      });
      trackInteraction('tool_use', 'adaptive_answer', { phase: adaptivePhase, segmentType: currentSegment.type, isCorrect: true });
    }
  }, [currentSegment, adaptivePhase, addAdaptiveHistory, trackInteraction]);

  const handleAnswered = useCallback(() => {
    setAnsweredCurrent(true);

    if (currentSegment && (currentSegment.type === 'comprehension' || currentSegment.type === 'practice')) {
      const seg = currentSegment;
      const phase = adaptivePhase;

      // Microtask runs after both onAnswered and onCorrect complete
      queueMicrotask(() => {
        if (correctFiredRef.current) {
          // Correct handler already logged — just reset
          correctFiredRef.current = false;
          return;
        }
        addAdaptiveHistory({
          phase,
          segmentType: seg.type,
          objectiveId: seg.objectiveId,
          question: seg.question,
          correctAnswer: seg.options[seg.correctIndex],
          isCorrect: false,
        });
        trackInteraction('tool_use', 'adaptive_answer', { phase, segmentType: seg.type, isCorrect: false });
      });
    }
  }, [currentSegment, adaptivePhase, addAdaptiveHistory, trackInteraction]);

  // ─── Render ─────────────────────────────────────────────

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Adaptive lesson not found.</p>
        <button onClick={() => navigate('student-home')} className="mt-4 text-purple-600 hover:underline">
          Back to Home
        </button>
      </div>
    );
  }

  const isQuestionSegment =
    currentSegment?.type === 'comprehension' || currentSegment?.type === 'practice';
  const isSummary = currentSegment?.type === 'summary';
  const canAdvance = !isQuestionSegment || answeredCurrent;
  const totalQuestions = adaptiveHistory.filter((h) => h.isCorrect !== undefined).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
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
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-gray-800">{lesson.title}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          AI Adaptive
        </span>
      </div>

      {/* Phase indicator */}
      <PhaseIndicator currentPhase={adaptivePhase} />

      {/* Content area */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <ThinkingCard phase={adaptivePhase} />
        ) : error ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-red-100 text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchAdaptiveContent(adaptivePhase);
              }}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : currentSegment ? (
          <>
            {currentSegment.type === 'narration' && (
              <NarrationCard segment={currentSegment} />
            )}
            {currentSegment.type === 'video' && (
              <VideoCard segment={currentSegment} />
            )}
            {(currentSegment.type === 'comprehension' || currentSegment.type === 'practice') && (
              <QuestionCard
                key={adaptiveSegmentIndex}
                segment={currentSegment}
                onCorrect={handleCorrect}
                onAnswered={handleAnswered}
                label={
                  adaptivePhase === 'DIAGNOSTIC'
                    ? 'Diagnostic Check'
                    : adaptivePhase === 'ASSESS'
                      ? 'Assessment'
                      : currentSegment.type === 'comprehension'
                        ? 'Check Your Understanding'
                        : 'Practice Problem'
                }
              />
            )}
            {currentSegment.type === 'summary' && (
              <SummaryCard
                segment={currentSegment}
                correctCount={correctCount}
                totalQuestions={totalQuestions}
                onFinish={completeAdaptiveLesson}
              />
            )}
          </>
        ) : null}
      </div>

      {/* Next button */}
      {!isLoading && !error && currentSegment && !isSummary && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!canAdvance}
            className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
