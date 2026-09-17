'use client';

import { useState } from 'react';
import { NOTES } from '../data';
import { Card } from '../ui';

type View = 'detailed' | 'revision';

export default function Notes() {
  const [view, setView] = useState<View>('detailed');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Notes from your lesson: <span className="font-medium text-slate-900">{NOTES.lesson}</span>
        </p>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5" role="tablist" aria-label="Notes view">
          {(['detailed', 'revision'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              style={view === v ? { background: 'var(--ab-primary)', color: 'var(--ab-primary-fg)' } : undefined}
              className="px-3 py-1 rounded-md text-xs font-semibold text-slate-600 capitalize"
            >
              {v === 'detailed' ? 'Detailed' : 'Revision sheet'}
            </button>
          ))}
        </div>
      </div>

      {view === 'detailed' ? (
        <Card>
          <div className="space-y-4">
            {NOTES.detailed.map((section) => (
              <div key={section.heading}>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">{section.heading}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="space-y-2">
            {NOTES.revision.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-slate-800">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ab-primary)' }} />
                {line}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-4">In the platform, the revision sheet downloads as a print-ready PDF.</p>
        </Card>
      )}

      <p className="text-xs text-slate-500">
        Notes are written from what happened in the session — what was taught, what you got right, where you slipped — not a
        generic handout.
      </p>
    </div>
  );
}
