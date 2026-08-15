'use client';

/**
 * /tutor/settings — durable home of student preferences.
 *
 * Stage 3 ships the humor preference only. Future stages can add
 * pacing / modality / tone here following the same pattern (one row
 * per preference, the hook handles persistence).
 *
 * Identity: the page reads `?studentId=...` from the URL when present
 * and uses it to sync the preference with the persisted profile. When
 * absent, the page is localStorage-only — fine for retail today, will
 * be replaced by an auth-derived studentId once that lands.
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useStudentPreferences } from '@/hooks/useStudentPreferences';
import type { StudentPreferences } from '@/lib/tutor/student-profile/types';

type HumorLevel = NonNullable<StudentPreferences['humorCeiling']>;

interface HumorOption {
  value: HumorLevel | null;
  label: string;
  description: string;
}

const HUMOR_OPTIONS: HumorOption[] = [
  {
    value: null,
    label: 'Use default',
    description: 'Let the tutor pick what fits your grade. Conservative and warm.',
  },
  {
    value: 'off',
    label: 'Serious',
    description: 'Warm but no jokes. Examples and analogies still flow.',
  },
  {
    value: 'light',
    label: 'A little funny',
    description: 'Tiny puns and friendly framing of mistakes. Stays focused.',
  },
  {
    value: 'medium',
    label: 'Pretty funny',
    description: 'Playful framings, named characters in scenarios, callbacks within a turn.',
  },
  {
    value: 'heavy',
    label: 'Very funny',
    description: 'Extended parallel stories, callbacks across turns, peer-level wit. (Best for older students.)',
  },
];

function SettingsInner() {
  const params = useSearchParams();
  const studentId = params.get('studentId') ?? undefined;
  const { preferences, setPreference, clearPreference, source, isLoading } = useStudentPreferences({ studentId });

  const currentHumor: HumorLevel | null = preferences.humorCeiling ?? null;

  function selectHumor(value: HumorLevel | null) {
    if (value === null) {
      clearPreference('humorCeiling');
    } else {
      setPreference('humorCeiling', value);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/tutor"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to tutor
          </Link>
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Tutor settings</h1>
        <p className="mb-8 text-sm text-slate-600">
          These settings shape how the tutor talks with you. Change them anytime — they apply to your next turn.
        </p>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-medium text-slate-900">Humor</h2>
          <p className="mb-5 text-sm text-slate-600">
            How playful should the tutor be? Analogies and examples run at every level — humor controls the jokes and storytelling style on top.
          </p>

          <div className="space-y-2">
            {HUMOR_OPTIONS.map((opt) => {
              const checked = currentHumor === opt.value;
              return (
                <label
                  key={opt.value ?? 'default'}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                    checked
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="humorCeiling"
                    className="mt-1 h-4 w-4 text-blue-600"
                    checked={checked}
                    onChange={() => selectHumor(opt.value)}
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900">{opt.label}</div>
                    <div className="text-xs text-slate-600">{opt.description}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            {isLoading
              ? 'Loading your saved preference…'
              : source === 'db'
              ? 'Saved to your profile (syncs across devices).'
              : source === 'localStorage'
              ? studentId
                ? 'Saved on this device. Syncing to your profile…'
                : 'Saved on this device.'
              : 'No preference set — using grade default.'}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function TutorSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading…</div>}>
      <SettingsInner />
    </Suspense>
  );
}
