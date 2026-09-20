'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Clock, Strikethrough } from 'lucide-react';
import { MOCK_EXAM } from '../data';
import { BrandButton, Card } from '../ui';

type Phase = 'intro' | 'running' | 'report';

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function MockExam({ onReviewWithTutor }: { onReviewWithTutor: () => void }) {
  const { questions } = MOCK_EXAM;
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [marked, setMarked] = useState<boolean[]>(() => questions.map(() => false));
  const [eliminated, setEliminated] = useState<Set<string>>(() => new Set());
  const [eliminating, setEliminating] = useState(false);
  const [remaining, setRemaining] = useState(MOCK_EXAM.seconds);

  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setPhase('report');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const start = () => {
    setAnswers(questions.map(() => null));
    setMarked(questions.map(() => false));
    setEliminated(new Set());
    setEliminating(false);
    setCurrent(0);
    setRemaining(MOCK_EXAM.seconds);
    setPhase('running');
  };

  const byUnit = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    questions.forEach((q, i) => {
      const row = map.get(q.unit) ?? { correct: 0, total: 0 };
      row.total += 1;
      if (answers[i] === q.answer) row.correct += 1;
      map.set(q.unit, row);
    });
    return [...map.entries()];
  }, [answers, questions]);

  if (phase === 'intro') {
    return (
      <Card>
        <h4 className="text-lg font-bold text-slate-900 mb-1">{MOCK_EXAM.title}</h4>
        <p className="text-sm text-slate-600 mb-4">
          {questions.length} questions · {formatClock(MOCK_EXAM.seconds)} · timed, autosaved, scored by unit. A short sample of the
          full exam player.
        </p>
        <ul className="text-sm text-slate-600 space-y-1 mb-4 list-disc pl-5">
          <li>Jump between questions from the palette</li>
          <li>Strike out options you have ruled out</li>
          <li>Mark questions to come back to</li>
        </ul>
        <BrandButton onClick={start}>Start mock exam</BrandButton>
      </Card>
    );
  }

  if (phase === 'report') {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    const missed = questions.map((q, i) => ({ q, i })).filter(({ q, i }) => answers[i] !== q.answer);
    return (
      <div className="space-y-4">
        <Card>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Score report</p>
          <p className="text-3xl font-bold text-slate-900 my-1">
            {correct} / {questions.length}
          </p>
          <div className="space-y-2 mt-3">
            {byUnit.map(([unit, row]) => (
              <div key={unit} className="flex items-center gap-3">
                <span className="w-14 text-xs font-medium text-slate-500 shrink-0">{unit}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${(row.correct / row.total) * 100}%`, background: 'var(--ab-primary)' }}
                  />
                </div>
                <span className="text-xs text-slate-600 w-8 text-right">
                  {row.correct}/{row.total}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title={missed.length ? 'Missed questions' : 'Nothing missed'}>
          {missed.length > 0 && (
            <ul className="space-y-3 mb-4">
              {missed.map(({ q, i }) => (
                <li key={i} className="text-sm">
                  <p className="text-slate-900">
                    Q{i + 1}. {q.prompt}
                  </p>
                  <p className="text-emerald-700 text-xs mt-0.5">Correct: {q.options[q.answer]}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            <BrandButton onClick={onReviewWithTutor}>Review with your tutor</BrandButton>
            <BrandButton variant="soft" onClick={start}>
              Retake
            </BrandButton>
          </div>
        </Card>
      </div>
    );
  }

  const q = questions[current]!;
  const low = remaining <= 60;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-900 text-white">
        <span className="text-sm font-medium truncate">{MOCK_EXAM.title}</span>
        <span className={`inline-flex items-center gap-1.5 text-sm font-mono ${low ? 'text-amber-300' : ''}`}>
          <Clock className="w-4 h-4" />
          {formatClock(remaining)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-slate-500">
            Question {current + 1} of {questions.length} · {q.unit}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-pressed={eliminating}
              onClick={() => setEliminating((v) => !v)}
              title="Answer eliminator"
              className={`p-1.5 rounded-md border text-slate-600 ${eliminating ? 'border-slate-800 bg-slate-100' : 'border-slate-200'}`}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-pressed={marked[current]}
              onClick={() => setMarked((m) => m.map((v, i) => (i === current ? !v : v)))}
              title="Mark for review"
              className={`p-1.5 rounded-md border ${marked[current] ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-600'}`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="font-medium text-slate-900 mb-3">{q.prompt}</p>
        <div className="space-y-2">
          {q.options.map((option, i) => {
            const key = `${current}:${i}`;
            const struck = eliminated.has(key);
            const selected = answers[current] === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (eliminating) {
                    setEliminated((prev) => {
                      const next = new Set(prev);
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    });
                    return;
                  }
                  setAnswers((a) => a.map((v, idx) => (idx === current ? i : v)));
                }}
                style={selected ? { borderColor: 'var(--ab-primary)', background: 'var(--ab-soft)' } : undefined}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg border border-slate-200 transition ${struck ? 'line-through text-slate-400' : 'text-slate-800'}`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex gap-1.5" role="group" aria-label="Question palette">
          {questions.map((_, i) => {
            const isCurrent = i === current;
            const answered = answers[i] !== null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to question ${i + 1}`}
                style={isCurrent ? { background: 'var(--ab-primary)', color: 'var(--ab-primary-fg)' } : undefined}
                className={`relative w-8 h-8 rounded-md text-xs font-semibold border ${
                  isCurrent ? 'border-transparent' : answered ? 'border-slate-300 bg-white text-slate-800' : 'border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {i + 1}
                {marked[i] && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <BrandButton variant="soft" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
            Back
          </BrandButton>
          {current + 1 < questions.length ? (
            <BrandButton onClick={() => setCurrent((c) => c + 1)}>Next</BrandButton>
          ) : (
            <BrandButton onClick={() => setPhase('report')}>Submit</BrandButton>
          )}
        </div>
      </div>
    </div>
  );
}
