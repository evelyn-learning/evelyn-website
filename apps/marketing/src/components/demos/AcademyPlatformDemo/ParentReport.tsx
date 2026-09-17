'use client';

import { Mail } from 'lucide-react';
import { DEMO_BRAND } from './brand';
import { COURSE, PARENT_REPORT } from './data';

export default function ParentReport() {
  const r = PARENT_REPORT;
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Mail className="w-4 h-4" />
        <span className="truncate">
          reports@{DEMO_BRAND.domain} → {r.to}
        </span>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4" style={{ background: 'var(--ab-primary)', color: 'var(--ab-primary-fg)' }}>
          <p className="text-xs opacity-80">{DEMO_BRAND.name} · Weekly progress</p>
          <p className="text-lg font-bold">
            {COURSE.learner}&apos;s week in {COURSE.title}
          </p>
          <p className="text-xs opacity-80">{r.week}</p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {r.stats.map((s) => (
              <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: 'var(--ab-soft)' }}>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <Section title="Nailed this week" items={r.nailed} tone="text-emerald-700" />
          <Section title="Now resolved" items={r.resolved} tone="text-slate-700" />
          <Section title="Still working on" items={r.stuck} tone="text-amber-700" />

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">A note from {r.teacher}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{r.note}</p>
          </div>

          <p className="text-xs text-slate-400">
            Sent automatically each week, written from the learner&apos;s actual sessions. Recipients can unsubscribe in one click.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className={`text-sm ${tone}`}>
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
