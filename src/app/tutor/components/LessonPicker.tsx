/**
 * LessonPicker — the tutor setup card's lesson-selection UI.
 *
 * Direction B ("search-hero + selected chip"): quick-search is the centerpiece.
 * The moment a lesson (or a browse topic) is chosen, the search field is
 * replaced by an explicit "Ready to start" chip showing exactly what will
 * begin — title, subject · level · duration — with Change / ✕ to revise. The
 * Subject → Level → Topic → Lesson drilldown is a quiet, collapsible
 * secondary path. Both read the in-memory index (usePlanIndex) so every
 * interaction is instant and resolves to the same taxonomy cells
 * (resolve-cell.ts).
 *
 * Selection state is OWNED BY THE PARENT (load-bearing for the session) —
 * this component is controlled via props. Clearing the selection is just
 * onSubjectChange('') (cascades level/topic/lesson to empty).
 */
'use client';

import { useState } from 'react';
import { Mic, Play, ChevronDown, X, Check } from 'lucide-react';
import PlanSearchBar from './PlanSearchBar';
import { usePlanIndex } from '../hooks/usePlanIndex';
import { getSubjectLabel, getLevelLabel, getTopicLabel } from '@/lib/tutor/topic-taxonomy';
import { unitLabel } from '@/lib/tutor/lesson-plan/unit-titles';
import type { PlanIndexEntry } from '@/lib/tutor/lesson-plan/plan-index-types';

function StepChip({ label, done }: { label: string; done: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        done ? 'bg-green-100 text-green-800' : 'bg-white text-blue-700 border border-blue-300'
      }`}
    >
      {done ? '✓' : '○'} {label}
    </span>
  );
}

export interface LessonPickerProps {
  studentName: string;
  onStudentName: (v: string) => void;
  subject: string;
  level: string;
  topicId: string;
  lessonPlanId: string;
  onSubjectChange: (id: string) => void;
  onLevelChange: (id: string) => void;
  onTopicChange: (id: string) => void;
  onLessonPlanChange: (id: string) => void;
  /** Fired when a quick-search result is chosen. */
  onSearchSelect: (entry: PlanIndexEntry) => void;
  canStart: boolean;
  onStart: () => void;
  inputMode: string;
  startButtonId?: string;
}

export default function LessonPicker({
  studentName,
  onStudentName,
  subject,
  level,
  topicId,
  lessonPlanId,
  onSubjectChange,
  onLevelChange,
  onTopicChange,
  onLessonPlanChange,
  onSearchSelect,
  canStart,
  onStart,
  inputMode,
  startButtonId = 'tutor-start-btn',
}: LessonPickerProps) {
  const planIndex = usePlanIndex();
  const [browseOpen, setBrowseOpen] = useState(false);

  const subjects = planIndex.subjects();
  const levels = subject ? planIndex.levelsFor(subject) : [];
  const topics = subject && level ? planIndex.topicsFor(subject, level) : [];
  const lessons = subject && level && topicId ? planIndex.lessonsFor(subject, level, topicId) : [];

  // A selection exists once a topic is locked in (via search OR browse).
  const hasSelection = !!topicId;
  const selEntry = lessonPlanId ? planIndex.byId(lessonPlanId) : undefined;
  const selTitle = selEntry?.title ?? (topicId ? getTopicLabel(subject, level, topicId) : '');
  const metaParts = [
    subject ? getSubjectLabel(subject) : '',
    level ? getLevelLabel(level) : '',
    selEntry ? `${selEntry.estimatedMinutes} min` : topicId ? 'open conversation' : '',
  ].filter(Boolean);

  const clearSelection = () => {
    onSubjectChange(''); // cascades level/topic/lesson → empty
    setBrowseOpen(false);
  };

  const showSearch = !hasSelection && !browseOpen;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">What do you want to learn?</h2>

      {/* ── Selection chip (search OR browse) ── */}
      {hasSelection ? (
        <div className="rounded-xl border-2 border-green-300 bg-green-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                <Check className="w-3.5 h-3.5" /> Ready to start
              </div>
              <div className="font-semibold text-gray-900 mt-1 break-words">{selTitle}</div>
              {metaParts.length > 0 && (
                <div className="text-xs text-gray-600 mt-0.5">{metaParts.join(' · ')}</div>
              )}
            </div>
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Clear selection"
              className="shrink-0 rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>
      ) : showSearch ? (
        <div>
          <PlanSearchBar onSelect={onSearchSelect} autoFocus />
          <p className="mt-2 text-xs text-gray-500">
            Type a topic or concept (e.g. “fractions”, “photosynthesis”, “quadratic equations”) and pick a result to begin.
          </p>
        </div>
      ) : null}

      {/* ── Secondary: collapsible browse ── */}
      <div>
        <button
          type="button"
          onClick={() => setBrowseOpen((o) => !o)}
          aria-expanded={browseOpen}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          {browseOpen ? 'Hide browse' : hasSelection ? 'Browse all subjects instead' : 'Or browse all subjects'}
          <ChevronDown className={`w-4 h-4 transition-transform ${browseOpen ? 'rotate-180' : ''}`} />
        </button>

        {browseOpen && (
          <div className="mt-3 space-y-4 rounded-lg border border-gray-200 p-4">
            {/* Step header */}
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-2.5">
              <div className="flex items-center gap-1.5 flex-wrap text-sm">
                <span className="font-semibold text-blue-900">3 choices:</span>
                <StepChip label="Subject" done={!!subject} />
                <span className="text-blue-300">›</span>
                <StepChip label="Level" done={!!level} />
                <span className="text-blue-300">›</span>
                <StepChip label="Topic" done={!!topicId} />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">1</span>
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a subject…</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon ? `${s.icon} ` : ''}{s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            {subject && (
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">2</span>
                  Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => onLevelChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a level…</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic */}
            {level && topics.length > 0 && (
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-2">3</span>
                  Topic
                </label>
                <select
                  id="topic"
                  value={topicId}
                  onChange={(e) => onTopicChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a topic…</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pick a lesson */}
            {topicId && lessons.length > 0 && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50/40 p-4">
                <label htmlFor="lesson-plan" className="block text-base font-semibold text-blue-900 mb-1">
                  ✨ Pick a lesson
                </label>
                <p className="text-xs text-blue-700/70 mb-3">Or leave blank for open conversation.</p>
                <select
                  id="lesson-plan"
                  value={lessonPlanId}
                  onChange={(e) => onLessonPlanChange(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                >
                  <option value="">— Just chat (no plan) —</option>
                  {renderLessonOptions(lessons)}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name (optional)
        </label>
        <input
          id="name"
          type="text"
          value={studentName}
          onChange={(e) => onStudentName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Start */}
      <button
        id={startButtonId}
        onClick={onStart}
        disabled={!canStart}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {inputMode === 'voice' ? <Mic className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        Start {inputMode === 'voice' ? 'Voice' : ''} Session
      </button>
      {!canStart && (
        <p className="text-center text-xs text-gray-400 -mt-2">
          Search for a lesson above, or browse to pick a subject &amp; topic.
        </p>
      )}
    </div>
  );
}

/** Group lessons by CED unit (<optgroup>) when present, else a flat list. */
function renderLessonOptions(lessons: PlanIndexEntry[]) {
  const groups = new Map<string, PlanIndexEntry[]>();
  let anyGrouped = false;
  for (const p of lessons) {
    const cedUnit = p.cedUnit ?? '';
    const key = cedUnit || '__flat__';
    if (cedUnit) anyGrouped = true;
    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  }
  if (!anyGrouped) {
    return lessons.map((p) => (
      <option key={p.id} value={p.id}>
        {p.title} · {p.estimatedMinutes} min
      </option>
    ));
  }
  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    if (a === '__flat__') return 1;
    if (b === '__flat__') return -1;
    const an = parseFloat(a);
    const bn = parseFloat(b);
    if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
    return a.localeCompare(b);
  });
  return sortedKeys.map((groupKey) => {
    const groupPlans = groups.get(groupKey) ?? [];
    const sample = groupPlans[0];
    const label =
      groupKey === '__flat__'
        ? 'Other'
        : sample
          ? unitLabel({ topic: sample.topic, metadata: { cedUnit: sample.cedUnit, cedTitle: sample.cedTitle } })
          : `UNIT ${groupKey}`;
    return (
      <optgroup key={groupKey} label={label}>
        {groupPlans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} · {p.estimatedMinutes} min
          </option>
        ))}
      </optgroup>
    );
  });
}
