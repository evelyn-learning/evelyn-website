'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Users, Bell, Check, X as XIcon } from 'lucide-react';

type GroupKey = 'extension' | 'core' | 'developing' | 'recovery';

interface GroupDef {
  key: GroupKey;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
}

const GROUP_DEFS: Record<GroupKey, GroupDef> = {
  extension: {
    key: 'extension',
    label: 'Extension',
    sublabel: 'Equivalent fractions mastery',
    color: '#2A7B6F',
    bg: '#E8F5F2',
  },
  core: {
    key: 'core',
    label: 'Core Practice',
    sublabel: 'Bridges Workplace 4B',
    color: '#C8402A',
    bg: '#FDECE7',
  },
  developing: {
    key: 'developing',
    label: 'Developing',
    sublabel: 'Same-denominator review',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  recovery: {
    key: 'recovery',
    label: 'Unlike Denominators Recovery',
    sublabel: 'Pull for 10-min intervention',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
};

interface QuizItem {
  item: number;
  prompt: string;
  options: string[];
  correct: number;
  skill: string;
}

const SOFIA_QUIZ: QuizItem[] = [
  {
    item: 1,
    prompt: 'Which fraction is greater? 2/4 or 1/4',
    options: ['2/4', '1/4', 'They are equal'],
    correct: 0,
    skill: 'like denominators',
  },
  {
    item: 2,
    prompt: 'Which fraction is greater? 2/3 or 3/4',
    options: ['2/3', '3/4', 'They are equal'],
    correct: 1,
    skill: 'unlike denominators',
  },
  {
    item: 3,
    prompt: 'Which fraction is greater? 5/8 or 3/8',
    options: ['5/8', '3/8', 'They are equal'],
    correct: 0,
    skill: 'like denominators',
  },
  {
    item: 4,
    prompt: 'Which is greater? 1/2 or 3/5',
    options: ['1/2', '3/5', 'They are equal'],
    correct: 1,
    skill: 'unlike denominators',
  },
];

// Sofia's simulated answers: items 1 & 3 correct (like denominators),
// items 2 & 4 incorrect (unlike denominators)
const SOFIA_ANSWERS = [0, 0, 0, 0];

const INITIAL_GROUPS: Record<GroupKey, string[]> = {
  extension: ['Aiden K.', 'Priya S.'],
  core: ['Marcus T.', 'Destiny M.', 'James L.'],
  developing: ['Sofia R.'],
  recovery: [],
};

const FINAL_GROUPS: Record<GroupKey, string[]> = {
  extension: ['Aiden K.', 'Priya S.'],
  core: ['James L.'],
  developing: [],
  recovery: ['Sofia R.', 'Destiny M.', 'Marcus T.'],
};

interface Decision {
  student: string;
  previous_group: string;
  new_group: string;
  rationale: string;
  teacher_action: string;
}

export default function Section4Dashboard() {
  const [phase, setPhase] = useState<'quiz' | 'submitting' | 'shifted'>('quiz');
  const [selectedAnswers, setSelectedAnswers] = useState<Array<number | null>>([null, null, null, null]);
  const [groups, setGroups] = useState<Record<GroupKey, string[]>>(INITIAL_GROUPS);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = selectedAnswers.every((a) => a !== null) && phase === 'quiz';

  const score = useMemo(() => {
    return selectedAnswers.reduce<number>((acc, a, i) => (a === SOFIA_QUIZ[i].correct ? acc + 1 : acc), 0);
  }, [selectedAnswers]);

  const autofillSofiaAnswers = () => {
    setSelectedAnswers([...SOFIA_ANSWERS]);
  };

  const handleSubmit = async () => {
    setError(null);
    setPhase('submitting');

    const items = SOFIA_QUIZ.map((q, i) => ({
      item: q.item,
      skill: q.skill,
      correct: selectedAnswers[i] === q.correct,
    }));
    const correct = items.filter((r) => r.correct).length;

    try {
      const response = await fetch('/api/showcase/rocketship/regroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: { name: 'Sofia R.', currentGroup: GROUP_DEFS.developing.label },
          quizResults: { correct, total: SOFIA_QUIZ.length, items },
          currentGroups: {
            [GROUP_DEFS.extension.label]: INITIAL_GROUPS.extension,
            [GROUP_DEFS.core.label]: INITIAL_GROUPS.core,
            [GROUP_DEFS.developing.label]: INITIAL_GROUPS.developing,
          },
          learningObjective: 'Comparing fractions with unlike denominators',
        }),
      });
      const data = await response.json();
      if (data.decision) {
        setDecision(data.decision as Decision);
      } else {
        // Fallback decision if API fails but request succeeded
        setDecision({
          student: 'Sofia R.',
          previous_group: 'Developing',
          new_group: 'Unlike Denominators Recovery',
          rationale:
            'Sofia answered like-denominator items correctly but missed both unlike-denominator items, indicating the specific misconception is cross-denominator comparison.',
          teacher_action:
            'Pull Sofia, Destiny, and Marcus for a 10-minute fraction-strip intervention during Learning Lab.',
        });
      }
      // Animate shift
      setGroups(FINAL_GROUPS);
      setPhase('shifted');
    } catch {
      setError('Failed to evaluate grouping. Please try again.');
      setPhase('quiz');
    }
  };

  const handleReset = () => {
    setGroups(INITIAL_GROUPS);
    setSelectedAnswers([null, null, null, null]);
    setDecision(null);
    setError(null);
    setPhase('quiz');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Teacher notification banner */}
      <AnimatePresence>
        {phase === 'shifted' && decision && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl border"
            style={{ backgroundColor: '#FFF3E8', borderColor: '#C8402A' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#C8402A' }}
            >
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C8402A' }}>
                Group shift detected
              </div>
              <div className="text-sm mt-0.5 font-medium" style={{ color: '#1A1A1A' }}>
                {decision.teacher_action}
              </div>
              <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                {decision.rationale}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border flex-shrink-0"
              style={{ borderColor: '#C8402A', color: '#C8402A', backgroundColor: '#FFFFFF' }}
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {/* LEFT — Quiz interface */}
        <div
          className="rounded-2xl border p-5 flex flex-col overflow-y-auto"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
                Student Quiz — Sofia R.
              </div>
              <div className="text-sm font-semibold mt-0.5" style={{ color: '#1A1A1A' }}>
                Comparing Fractions · 4 items
              </div>
            </div>
            {phase === 'quiz' && (
              <button
                onClick={autofillSofiaAnswers}
                className="text-[10px] px-2 py-1 rounded-lg border"
                style={{ borderColor: '#E5E0DB', color: '#6B6B6B' }}
              >
                Fill Sofia&apos;s answers
              </button>
            )}
          </div>

          <div className="space-y-4 flex-1">
            {SOFIA_QUIZ.map((q, i) => {
              const selected = selectedAnswers[i];
              const isSubmitted = phase !== 'quiz';
              const isCorrect = selected === q.correct;
              return (
                <div
                  key={q.item}
                  className="p-3 rounded-xl border"
                  style={{ borderColor: '#E5E0DB', backgroundColor: '#FFF8F5' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      {q.item}. {q.prompt}
                    </div>
                    {isSubmitted && selected !== null && (
                      <div className="flex-shrink-0 ml-2">
                        {isCorrect ? (
                          <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                        ) : (
                          <XIcon className="w-4 h-4" style={{ color: '#EF4444' }} />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide mb-2" style={{ color: '#6B6B6B' }}>
                    Skill: {q.skill}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = selected === oi;
                      const showCorrectness = isSubmitted && isSelected;
                      return (
                        <button
                          key={oi}
                          disabled={isSubmitted}
                          onClick={() =>
                            setSelectedAnswers((prev) => {
                              const next = [...prev];
                              next[i] = oi;
                              return next;
                            })
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:cursor-not-allowed"
                          style={{
                            borderColor: showCorrectness
                              ? isCorrect
                                ? '#10B981'
                                : '#EF4444'
                              : isSelected
                                ? '#C8402A'
                                : '#E5E0DB',
                            backgroundColor: showCorrectness
                              ? isCorrect
                                ? '#ECFDF5'
                                : '#FEF2F2'
                              : isSelected
                                ? '#FDECE7'
                                : '#FFFFFF',
                            color: isSelected ? '#C8402A' : '#1A1A1A',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#E5E0DB' }}>
            <div className="text-xs" style={{ color: '#6B6B6B' }}>
              {phase === 'quiz' && `${selectedAnswers.filter((a) => a !== null).length}/4 answered`}
              {phase === 'submitting' && 'Scoring quiz…'}
              {phase === 'shifted' && `Score: ${score}/4`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              style={{ backgroundColor: '#C8402A' }}
            >
              {phase === 'submitting' ? (
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Quiz
            </button>
          </div>
        </div>

        {/* RIGHT — Classroom groupings */}
        <div
          className="rounded-2xl border p-5 flex flex-col overflow-y-auto"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
                Ms. Chen&apos;s Grade 4
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Users className="w-4 h-4" style={{ color: '#1A1A1A' }} />
                <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                  Today&apos;s Groupings
                </span>
              </div>
            </div>
            {phase === 'submitting' && (
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#C8402A' }}>
                <Sparkles className="w-3 h-3 animate-pulse" />
                AI evaluating
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1">
            {(['extension', 'core', 'developing', 'recovery'] as GroupKey[])
              .filter((key) => groups[key].length > 0 || key === 'recovery' || key === 'developing')
              .map((key) => {
                const def = GROUP_DEFS[key];
                const isHighlighted = phase === 'shifted' && key === 'recovery';
                const students = groups[key];
                return (
                  <motion.div
                    key={key}
                    layout
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="p-3 rounded-xl border-2"
                    style={{
                      borderColor: isHighlighted ? def.color : '#E5E0DB',
                      backgroundColor: isHighlighted ? def.bg : '#FFFFFF',
                      boxShadow: isHighlighted ? `0 0 0 3px ${def.color}20` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-bold" style={{ color: def.color }}>
                          {def.label}
                        </div>
                        <div className="text-[10px]" style={{ color: '#6B6B6B' }}>
                          {def.sublabel}
                        </div>
                      </div>
                      <div
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: def.bg, color: def.color }}
                      >
                        {students.length} {students.length === 1 ? 'student' : 'students'}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
                      <AnimatePresence mode="popLayout">
                        {students.map((name) => {
                          const isSofia = name === 'Sofia R.';
                          const highlightSofia = phase === 'shifted' && isSofia && key === 'recovery';
                          return (
                            <motion.div
                              key={name}
                              layoutId={`student-${name}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.45, ease: 'easeInOut' }}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium"
                              style={{
                                backgroundColor: highlightSofia ? def.color : def.bg,
                                color: highlightSofia ? '#FFFFFF' : def.color,
                                border: `1px solid ${def.color}40`,
                              }}
                            >
                              {name}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {students.length === 0 && (
                        <span className="text-[10px] italic self-center" style={{ color: '#E5E0DB' }}>
                          No students
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>

          <div className="mt-3 text-[10px] text-center" style={{ color: '#E5E0DB' }}>
            Demo data — for illustration only
          </div>
        </div>
      </div>
    </div>
  );
}
