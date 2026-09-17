'use client';

/**
 * Interactive demo for /products/academy#demo — a simulated Evelyn Academy
 * course workspace (sample data, no backend, no login) with a live brand
 * switcher and a role switcher. The one real thing inside it is the tutor:
 * "Study" mounts the existing gated VoiceTutorLiveDemo, so this adds no new
 * engine surface and no new cost exposure.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, GraduationCap, Palette, Radio, ShieldCheck, Users } from 'lucide-react';
import {
  BRAND_PRESETS,
  CUSTOM_BRAND_ID,
  DEFAULT_CUSTOM_BRAND,
  MAX_BRAND_NAME,
  brandInitials,
  brandStyle,
  isHexColor,
  type DemoBrand,
} from './brand';
import { COURSE, UNITS } from './data';
import { trackAcademyDemo } from './ui';
import Overview from './student/Overview';
import Lessons from './student/Lessons';
import Practice from './student/Practice';
import MockExam from './student/MockExam';
import Notes from './student/Notes';
import ParentReport from './ParentReport';
import AdminRoster from './AdminRoster';

// Lazy: the live tutor (and its @core voice/persona imports) loads only when
// a visitor actually clicks Study.
const VoiceTutorLiveDemo = dynamic(() => import('@/components/demos/VoiceTutorLiveDemo'), {
  ssr: false,
  loading: () => <div className="h-[420px] bg-slate-100 rounded-2xl animate-pulse" />,
});

const LIVE_DEMO_SOURCE = 'products-academy-demo';

type Role = 'student' | 'parent' | 'admin';
type StudentTab = 'overview' | 'lessons' | 'practice' | 'mock' | 'notes';

const ROLES: { id: Role; label: string; icon: typeof Users }[] = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'parent', label: 'Parent / Sponsor', icon: Users },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

const STUDENT_TABS: { id: StudentTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'practice', label: 'Practice & Quizzes' },
  { id: 'mock', label: 'Mock Exams' },
  { id: 'notes', label: 'Notes' },
];

function lessonTitle(lessonId: string | null): string {
  if (!lessonId) return 'Review with your tutor';
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson.title;
  }
  return 'Live lesson';
}

export default function AcademyPlatformDemo() {
  const [brand, setBrand] = useState<DemoBrand>(BRAND_PRESETS[0]!);
  const [custom, setCustom] = useState<DemoBrand>(DEFAULT_CUSTOM_BRAND);
  const [role, setRole] = useState<Role>('student');
  const [tab, setTab] = useState<StudentTab>('overview');
  // undefined = no live pane; null = opened from "Review with your tutor".
  const [liveLesson, setLiveLesson] = useState<string | null | undefined>(undefined);

  const isCustom = brand.id === CUSTOM_BRAND_ID;
  const displayName = brand.name.trim() || DEFAULT_CUSTOM_BRAND.name;
  const domain = `${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'academy'}.com`;

  const pickPreset = (next: DemoBrand) => {
    setBrand(next);
    trackAcademyDemo('academy_demo_brand_change', { brand: next.id });
  };

  const updateCustom = (patch: Partial<DemoBrand>) => {
    const next = { ...custom, ...patch };
    setCustom(next);
    setBrand(next);
  };

  const openLive = (lessonId: string | null) => {
    setLiveLesson(lessonId);
    trackAcademyDemo('academy_demo_live_lesson_open', { from: lessonId ? 'lesson' : 'mock_review' });
  };

  return (
    <div>
      {/* Brand switcher — sits OUTSIDE the frame: it is the visitor's control, not part of the product. */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-slate-500" />
          <p className="text-sm font-semibold text-slate-900">Make it yours — switch the brand</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {BRAND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={brand.id === preset.id}
              onClick={() => pickPreset(preset)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition ${
                brand.id === preset.id ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: preset.primary }} />
              {preset.name}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={isCustom}
            onClick={() => {
              setBrand(custom);
              trackAcademyDemo('academy_demo_brand_change', { brand: CUSTOM_BRAND_ID });
            }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition ${
              isCustom ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-dashed border-slate-300 hover:border-slate-400'
            }`}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: custom.primary }} />
            Your brand
          </button>
        </div>

        {isCustom && (
          <div className="flex flex-wrap items-end gap-3 mt-3">
            <label className="flex-1 min-w-[200px]">
              <span className="block text-xs font-medium text-slate-500 mb-1">Institution name</span>
              <input
                type="text"
                value={custom.name}
                maxLength={MAX_BRAND_NAME}
                onChange={(e) => updateCustom({ name: e.target.value })}
                placeholder="e.g. Northfield Business School"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </label>
            <label>
              <span className="block text-xs font-medium text-slate-500 mb-1">Brand colour</span>
              <input
                type="color"
                value={custom.primary}
                onChange={(e) => isHexColor(e.target.value) && updateCustom({ primary: e.target.value })}
                className="h-[38px] w-16 rounded-lg border border-slate-200 bg-white p-1 cursor-pointer"
                aria-label="Brand colour"
              />
            </label>
          </div>
        )}
      </div>

      {/* The product frame */}
      <div style={brandStyle(brand)} className="rounded-2xl border border-slate-200 shadow-xl overflow-hidden bg-slate-50">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-200/70 border-b border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 flex-1 min-w-0 truncate text-xs text-slate-500 bg-white rounded-md px-3 py-1">
            https://{domain}/app/courses/business-communication
          </span>
        </div>

        {/* App header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          style={{ background: 'var(--ab-primary)', color: 'var(--ab-primary-fg)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
              {brandInitials(displayName)}
            </span>
            <span className="font-bold truncate">{displayName}</span>
          </div>
          <div className="inline-flex rounded-lg bg-black/15 p-0.5" role="tablist" aria-label="View as">
            {ROLES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={role === id}
                onClick={() => {
                  setRole(id);
                  setLiveLesson(undefined);
                  trackAcademyDemo('academy_demo_role_change', { role: id });
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  role === id ? 'bg-white text-slate-900' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {role === 'student' && (
          <>
            <div className="px-4 pt-4">
              <p className="text-xs text-slate-500">{COURSE.level}</p>
              <h3 className="text-lg font-bold text-slate-900">{COURSE.title}</h3>
            </div>
            <div className="px-4 mt-3 border-b border-slate-200 overflow-x-auto">
              <div className="flex gap-1 min-w-max" role="tablist" aria-label="Course workspace">
                {STUDENT_TABS.map((t) => {
                  const active = tab === t.id && liveLesson === undefined;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setTab(t.id);
                        setLiveLesson(undefined);
                        trackAcademyDemo('academy_demo_tab_view', { tab: t.id });
                      }}
                      style={active ? { borderColor: 'var(--ab-primary)', color: 'var(--ab-primary)' } : undefined}
                      className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
                        active ? '' : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="p-4 min-h-[420px]">
          {role === 'student' && liveLesson !== undefined && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setLiveLesson(undefined)}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {tab === 'mock' ? 'score report' : 'course'}
                </button>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Radio className="w-3.5 h-3.5" />
                  Real tutor — not a recording
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                In your academy, <span className="font-medium text-slate-900">{lessonTitle(liveLesson)}</span> would open here, taught
                from your own syllabus. For this demo the tutor runs one of our showcase lessons — pick one and start talking.
              </p>
              <VoiceTutorLiveDemo source={LIVE_DEMO_SOURCE} />
            </div>
          )}

          {role === 'student' && liveLesson === undefined && (
            <>
              {tab === 'overview' && <Overview onStudy={openLive} />}
              {tab === 'lessons' && <Lessons onStudy={openLive} />}
              {tab === 'practice' && <Practice />}
              {tab === 'mock' && <MockExam onReviewWithTutor={() => openLive(null)} />}
              {tab === 'notes' && <Notes />}
            </>
          )}

          {role === 'parent' && <ParentReport brandName={displayName} />}
          {role === 'admin' && <AdminRoster />}
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center mt-3">
        Simulated workspace with sample data — the tutor session inside it is real.
      </p>
    </div>
  );
}
