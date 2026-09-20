'use client';

import { useState } from 'react';
import { AlertTriangle, Lock, MessageSquareQuote } from 'lucide-react';
import { DRILL, HOMEWORK, OBJECTIVES, QUIZZES } from '../data';
import { BrandButton, Card, MasteryDots } from '../ui';

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 64;
  const h = 20;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / 100) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke="var(--ab-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Drill({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= DRILL.length;

  if (done) {
    return (
      <Card>
        <p className="text-lg font-bold text-slate-900 mb-1">
          {score} / {DRILL.length} correct
        </p>
        <p className="text-sm text-slate-600 mb-4">
          In the real platform this result updates the objective&apos;s mastery, and your tutor sees it before the next lesson.
        </p>
        <BrandButton onClick={onClose}>Back to practice</BrandButton>
      </Card>
    );
  }

  const q = DRILL[index]!;
  const answered = picked !== null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">
          Question {index + 1} of {DRILL.length} · {HOMEWORK.lo}
        </span>
        <button type="button" onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">
          Exit
        </button>
      </div>
      <p className="font-medium text-slate-900 mb-3">{q.prompt}</p>
      <div className="space-y-2">
        {q.options.map((option, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === picked;
          let cls = 'border-slate-200 hover:border-slate-300 bg-white';
          if (answered && isAnswer) cls = 'border-emerald-400 bg-emerald-50';
          else if (answered && isPicked) cls = 'border-rose-300 bg-rose-50';
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => {
                setPicked(i);
                if (isAnswer) setScore((s) => s + 1);
              }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition ${cls}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 flex-1 min-w-[200px]">{q.explain}</p>
          <BrandButton
            onClick={() => {
              setPicked(null);
              setIndex((n) => n + 1);
            }}
          >
            {index + 1 === DRILL.length ? 'Finish' : 'Next'}
          </BrandButton>
        </div>
      )}
    </Card>
  );
}

export default function Practice() {
  const [drilling, setDrilling] = useState(false);

  if (drilling) return <Drill onClose={() => setDrilling(false)} />;

  return (
    <div className="space-y-4">
      <Card title="From your tutor">
        <div className="flex items-start gap-3">
          <MessageSquareQuote className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--ab-primary)' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{HOMEWORK.lo}</p>
            <p className="text-sm text-slate-600 italic my-1">{HOMEWORK.reason}</p>
            <p className="text-xs text-slate-400 mb-3">{HOMEWORK.assigned}</p>
            <BrandButton onClick={() => setDrilling(true)}>Start</BrandButton>
          </div>
        </div>
      </Card>

      <Card title="Practice by objective">
        <ul className="divide-y divide-slate-100">
          {OBJECTIVES.map((o) => (
            <li key={o.lo} className="flex items-center gap-3 py-2.5">
              <MasteryDots mastery={o.mastery} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 truncate">{o.lo}</p>
                <p className="text-xs text-slate-400">{o.last}</p>
              </div>
              {o.reviewDue && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <AlertTriangle className="w-3 h-3" />
                  Review due
                </span>
              )}
              <BrandButton variant="soft" onClick={() => setDrilling(true)} className="shrink-0">
                Practice
              </BrandButton>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Quizzes & Unit Test">
        <div className="grid sm:grid-cols-3 gap-3">
          {QUIZZES.map((quiz) => (
            <div key={quiz.name} className={`rounded-lg border border-slate-200 p-3 ${quiz.locked ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-slate-900">{quiz.name}</p>
                {quiz.locked && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mb-2">{quiz.state}</p>
              <Sparkline values={quiz.history} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
