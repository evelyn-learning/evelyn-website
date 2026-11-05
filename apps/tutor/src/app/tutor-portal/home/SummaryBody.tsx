'use client';

import { useState } from 'react';
import type { LearnerSummaryV1 } from '@/lib/tutor/portal/learner-summary';
import { levelBadge } from './home-rows';

function Bi({ en, ja }: { en: string; ja: string }) {
  return (
    <div>
      <p className="text-sm text-gray-800">{en}</p>
      {ja && <p className="text-xs text-gray-400">{ja}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{title}</p>
      {children}
    </div>
  );
}

export default function SummaryBody({ summary: s }: { summary: LearnerSummaryV1 }) {
  const [open, setOpen] = useState(false);
  const badge = levelBadge({ status: 'ready', summary: s });
  return (
    <div className="space-y-3">
      <Bi en={s.level.evidence_en} ja={s.level.evidence_ja} />
      {s.recommendations[0] && <Bi en={s.recommendations[0].en} ja={s.recommendations[0].ja} />}
      <button type="button" onClick={() => setOpen((v) => !v)} className="text-sm font-medium text-gray-700 underline">
        {open ? 'Hide full summary' : 'Show full summary'}
      </button>
      {open && (
        <div className="space-y-4 border-t border-gray-100 pt-3">
          <Section title="Level">
            <p className="text-sm font-medium text-gray-900">{badge ?? 'Not set'}</p>
            <Bi en={s.level.evidence_en} ja={s.level.evidence_ja} />
          </Section>
          <Section title="Grammar">
            <Bi en={s.assessment.grammar_en} ja={s.assessment.grammar_ja} />
            {s.assessment.corrections.map((c, i) => (
              <p key={i} className="text-sm text-gray-700">
                <span className="text-gray-400 line-through">{c.student}</span> → <span className="font-medium">{c.corrected}</span>
              </p>
            ))}
          </Section>
          <Section title="Pronunciation">
            {s.assessment.pronunciation.practised.map((p, i) => (
              <p key={i} className="text-sm text-gray-700">
                &ldquo;{p.sentence}&rdquo; — {Math.round(p.overall)}/100{p.weak.length ? ` · work on: ${p.weak.join(', ')}` : ''}
              </p>
            ))}
            <Bi en={s.assessment.pronunciation.comment_en} ja={s.assessment.pronunciation.comment_ja} />
          </Section>
          <Section title="Next steps">
            {s.recommendations.map((r, i) => <Bi key={i} en={r.en} ja={r.ja} />)}
          </Section>
        </div>
      )}
    </div>
  );
}
