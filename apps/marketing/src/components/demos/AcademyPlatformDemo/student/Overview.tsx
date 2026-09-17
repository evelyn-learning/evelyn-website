'use client';

import { CalendarCheck, Sparkles, TrendingUp } from 'lucide-react';
import { GAPS, NEXT_ACTION, PACE, PROJECTION, REVIEW_DUE, UNITS, type Mastery } from '../data';
import { BrandButton, Card, MASTERY_LABEL } from '../ui';

const HEAT: Record<Mastery, string> = {
  none: '#f1f5f9',
  low: 'color-mix(in srgb, var(--ab-primary) 25%, white)',
  developing: 'color-mix(in srgb, var(--ab-primary) 55%, white)',
  strong: 'var(--ab-primary)',
};

export default function Overview({ onStudy }: { onStudy: (lessonId: string) => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--ab-primary)' }} />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Next best action</p>
              <p className="font-semibold text-slate-900">{NEXT_ACTION.title}</p>
              <p className="text-sm text-slate-600">{NEXT_ACTION.reason}</p>
            </div>
          </div>
          <BrandButton onClick={() => onStudy(NEXT_ACTION.lessonId)}>Start today&apos;s session</BrandButton>
        </div>
      </Card>

      <Card title={PROJECTION.label}>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-slate-900">
            {PROJECTION.low}–{PROJECTION.high}
            {PROJECTION.unit}
          </span>
          <TrendingUp className="w-5 h-5 mb-1.5 text-emerald-500" />
        </div>
        <div className="relative h-2 rounded-full bg-slate-100">
          <div
            className="absolute h-2 rounded-full"
            style={{ left: `${PROJECTION.low}%`, width: `${PROJECTION.high - PROJECTION.low}%`, background: 'var(--ab-primary)' }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">Projected from lessons, practice and quiz evidence — a band, not a guess at one number.</p>
      </Card>

      <Card title="Pace vs goal">
        <div className="flex items-center gap-2 mb-1">
          <CalendarCheck className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700">{PACE.goal}</span>
        </div>
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 mb-2">{PACE.status}</span>
        <p className="text-sm text-slate-600">{PACE.detail}</p>
      </Card>

      <Card title="Mastery by objective" className="md:col-span-2">
        <div className="overflow-x-auto">
          <div className="space-y-2 min-w-[300px]">
            {UNITS.map((unit) => (
              <div key={unit.id} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-xs font-medium text-slate-500">{unit.title.split(' · ')[0]}</span>
                <div className="flex gap-1.5 flex-1">
                  {unit.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      title={`${lesson.title} — ${MASTERY_LABEL[lesson.mastery]}`}
                      className="h-8 flex-1 rounded-md"
                      style={{ background: HEAT[lesson.mastery] }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {(Object.keys(HEAT) as Mastery[]).map((m) => (
            <span key={m} className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-3 h-3 rounded" style={{ background: HEAT[m] }} />
              {MASTERY_LABEL[m]}
            </span>
          ))}
        </div>
      </Card>

      <Card title="Top gaps">
        <ul className="space-y-3">
          {GAPS.map((gap) => (
            <li key={gap.lo}>
              <p className="text-sm font-medium text-slate-900">{gap.lo}</p>
              <p className="text-xs text-slate-600">{gap.evidence}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Review due">
        <ul className="space-y-2">
          {REVIEW_DUE.map((item) => (
            <li key={item.lo} className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-800">{item.lo}</span>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap">{item.due}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-3">Spaced review keeps finished objectives from fading.</p>
      </Card>
    </div>
  );
}
