'use client';

import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { COURSE, UNITS, type LessonStatus } from '../data';
import { BrandButton, MasteryDots } from '../ui';

const ACTION: Record<LessonStatus, string> = { done: 'Review', 'in-progress': 'Resume', 'not-started': 'Study' };

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
  if (status === 'in-progress') return <PlayCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--ab-primary)' }} />;
  return <Circle className="w-5 h-5 text-slate-300 shrink-0" />;
}

export default function Lessons({ onStudy }: { onStudy: (lessonId: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--ab-soft)' }}>
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: 'var(--ab-primary)', color: 'var(--ab-primary-fg)' }}
        >
          {COURSE.teacher.name.replace(/^M[sr]s?\.\s*/, '')[0]}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Your teacher: {COURSE.teacher.name}</p>
          <p className="text-xs text-slate-600">{COURSE.teacher.style}</p>
        </div>
      </div>

      {UNITS.map((unit) => (
        <div key={unit.id}>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">{unit.title}</h4>
          <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {unit.lessons.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-3 p-3">
                <StatusIcon status={lesson.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{lesson.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{lesson.objective}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MasteryDots mastery={lesson.mastery} />
                    <span className="text-xs text-slate-400">~{lesson.minutes} min</span>
                  </div>
                </div>
                <BrandButton
                  variant={lesson.status === 'in-progress' ? 'solid' : 'soft'}
                  onClick={() => onStudy(lesson.id)}
                  className="shrink-0"
                >
                  {ACTION[lesson.status]}
                </BrandButton>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
