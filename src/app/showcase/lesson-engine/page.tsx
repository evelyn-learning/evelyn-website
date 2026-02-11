'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import {
  Lock, ArrowRight, AlertCircle, Loader2,
  Sparkles, BookOpen, GraduationCap, Play, Pause,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Edit3, Trash2, Download, Mic, MicOff, Send,
  Volume2, VolumeX, Check, X, RotateCcw, RefreshCw,
  MessageCircle, FileText, BarChart3, Award,
  Maximize2, Minimize2, Image, Save, FolderOpen, Clock,
} from 'lucide-react';
import { sanitize } from '@/lib/utils/export/pdf-course-export';

/* ─────────────── Brand Palette ─────────────── */
const COLORS = {
  primary: '#1a365d',
  primaryLight: '#2B6CB0',
  primaryDark: '#0F2440',
  accent: '#3182CE',
  accentLight: '#63B3ED',
  success: '#38A169',
  warning: '#DD6B20',
  danger: '#E53E3E',
  bg: '#F7FAFC',
  cardBg: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  border: '#E2E8F0',
  purple: '#7a2a8e',
};

const BLOOMS_COLORS: Record<string, string> = {
  remember: '#3182CE',
  understand: '#38A169',
  apply: '#DD6B20',
  analyze: '#E53E3E',
  evaluate: '#805AD5',
  create: '#D53F8C',
};

const BLOOMS_LABELS: Record<string, string> = {
  remember: 'Remember',
  understand: 'Understand',
  apply: 'Apply',
  analyze: 'Analyze',
  evaluate: 'Evaluate',
  create: 'Create',
};

const SLIDE_TYPE_COLORS: Record<string, string> = {
  instruction: '#3182CE',
  activity: '#38A169',
  quiz: '#DD6B20',
  summary: '#805AD5',
};

/* ─────────────── Types ─────────────── */
interface LessonSlide {
  id: number;
  type: 'instruction' | 'activity' | 'quiz' | 'summary';
  title: string;
  content: string;
  narration: string;
  visual: string;
  imageTags?: string[];
  teacherNotes?: string;
  standards: string[];
  bloomsLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  question?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
}

interface GeneratedLesson {
  title: string;
  gradeLevel: string;
  subject: string;
  language: 'en' | 'es' | 'vi';
  duration: string;
  standards: string[];
  objectives: string[];
  slides: LessonSlide[];
  worksheet: {
    instructions: string;
    vocabulary: { term: string; definition: string }[];
    problems: { question: string; answer: string }[];
  };
}

interface SavedLessonSummary {
  _id: string;
  title: string;
  gradeLevel: string;
  subject: string;
  language: string;
  duration: string;
  createdAt: string;
}

type ViewState = 'input' | 'generating' | 'review' | 'slideshow' | 'scorecard';

/* ─────────────── AccessGate ─────────────── */
function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (code.trim().toUpperCase() === 'LE2026') {
        sessionStorage.setItem('lesson_engine_access', 'true');
        onUnlock();
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 50%, ${COLORS.purple} 100%)` }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>AI Lesson Engine</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Interactive Lesson Generator Demo</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="text-xs" style={{ color: COLORS.textMuted }}>Built by</span>
              <span className="text-xs font-semibold" style={{ color: COLORS.purple }}>Evelyn Learning</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textSecondary }}>
              <Lock className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Enter Access Code
            </label>
            <input type="text" value={code} onChange={(e) => { setCode(e.target.value); setError(false); }} placeholder="Enter your access code"
              className="w-full px-4 py-3 rounded-lg border-2 text-center text-lg font-mono tracking-widest focus:outline-none transition-colors"
              style={{ borderColor: error ? COLORS.danger : COLORS.border, color: COLORS.textPrimary }} autoFocus />
            {error && <p className="text-sm mt-2 flex items-center gap-1" style={{ color: COLORS.danger }}><AlertCircle className="w-4 h-4" /> Invalid access code. Please try again.</p>}
            <button type="submit" disabled={loading || !code.trim()} className="w-full mt-4 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2">Access Demo <ArrowRight className="w-4 h-4" /></span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── InputPanel ─────────────── */
function InputPanel({ onGenerate, onLoadLesson, onDeleteLesson, onRenameLesson }: {
  onGenerate: (data: { prompt: string; grade: string; duration: number; language: 'en' | 'es' | 'vi'; curriculumContext?: string; enableImages?: boolean }) => void;
  onLoadLesson: (id: string) => void;
  onDeleteLesson: (id: string) => Promise<boolean>;
  onRenameLesson: (id: string, newTitle: string) => Promise<boolean>;
}) {
  const [prompt, setPrompt] = useState('');
  const [grade, setGrade] = useState('3');
  const [duration, setDuration] = useState(10);
  const [language, setLanguage] = useState<'en' | 'es' | 'vi'>('en');
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [curriculumContext, setCurriculumContext] = useState('');
  const [enableImages, setEnableImages] = useState(false);
  const [savedLessons, setSavedLessons] = useState<SavedLessonSummary[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const hasFetchedSaved = useRef(false);

  // Load saved lessons on first open
  useEffect(() => {
    if (showSaved && !hasFetchedSaved.current && !loadingSaved) {
      hasFetchedSaved.current = true;
      setLoadingSaved(true);
      fetch('/api/showcase/lesson-engine/lessons')
        .then((r) => r.json())
        .then((data) => { if (data.success) setSavedLessons(data.lessons); })
        .catch(() => { hasFetchedSaved.current = false; })
        .finally(() => setLoadingSaved(false));
    }
  }, [showSaved, loadingSaved]);

  const grades = ['K', '1', '2', '3', '4', '5'];
  const durations = [5, 10, 15];
  const languages: { code: 'en' | 'es' | 'vi'; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'vi', label: 'VI' },
  ];

  const suggestions = [
    'Fractions with pizza',
    'Water cycle',
    'Addition with blocks',
    'Parts of a story',
    'Animal habitats',
    'Telling time',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({
      prompt: prompt.trim(),
      grade: grade === 'K' ? 'Kindergarten' : `Grade ${grade}`,
      duration,
      language,
      curriculumContext: curriculumContext.trim() || undefined,
      enableImages,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>AI Lesson Engine</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Generate an interactive, narrated lesson in seconds</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border p-6 space-y-5" style={{ borderColor: COLORS.border }}>
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>What do you want to teach?</label>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Teach fractions using pizza"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-base"
              style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
              autoFocus />
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Grade Level</label>
            <div className="flex gap-2">
              {grades.map((g) => (
                <button key={g} type="button" onClick={() => setGrade(g)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all border-2"
                  style={{
                    background: grade === g ? COLORS.accent : 'white',
                    color: grade === g ? 'white' : COLORS.textSecondary,
                    borderColor: grade === g ? COLORS.accent : COLORS.border,
                  }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Duration (minutes)</label>
            <div className="flex gap-2">
              {durations.map((d) => (
                <button key={d} type="button" onClick={() => setDuration(d)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all border-2"
                  style={{
                    background: duration === d ? COLORS.accent : 'white',
                    color: duration === d ? 'white' : COLORS.textSecondary,
                    borderColor: duration === d ? COLORS.accent : COLORS.border,
                  }}>
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Language</label>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button key={l.code} type="button" onClick={() => setLanguage(l.code)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all border-2"
                  style={{
                    background: language === l.code ? COLORS.accent : 'white',
                    color: language === l.code ? 'white' : COLORS.textSecondary,
                    borderColor: language === l.code ? COLORS.accent : COLORS.border,
                  }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Curriculum Context */}
          <div>
            <button type="button" onClick={() => setShowCurriculum(!showCurriculum)}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: COLORS.textMuted }}>
              {showCurriculum ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Curriculum Context (Optional)
            </button>
            {showCurriculum && (
              <textarea value={curriculumContext} onChange={(e) => setCurriculumContext(e.target.value)}
                placeholder="Paste your school's pacing guide, scope-and-sequence, or curriculum standards here..."
                className="w-full mt-2 px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-sm resize-none"
                style={{ borderColor: COLORS.border, color: COLORS.textPrimary, minHeight: '100px' }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.border)} />
            )}
          </div>

          {/* AI Image Fallback Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={enableImages} onChange={(e) => setEnableImages(e.target.checked)}
              className="w-4 h-4 rounded border-2 accent-blue-500" style={{ borderColor: COLORS.border }} />
            <span className="text-sm" style={{ color: COLORS.textSecondary }}>
              <Image className="w-4 h-4 inline -mt-0.5 mr-1" />
              Enable AI-generated image fallback
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">Beta</span>
          </label>

          {/* Submit */}
          <button type="submit" disabled={!prompt.trim()}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
            <Sparkles className="w-5 h-5" /> Generate Lesson
          </button>

          {/* Suggestions */}
          <div className="text-center">
            <span className="text-xs" style={{ color: COLORS.textMuted }}>Try: </span>
            {suggestions.map((s, i) => (
              <span key={s}>
                <button type="button" onClick={() => setPrompt(s)} className="text-xs underline transition-colors hover:opacity-80" style={{ color: COLORS.accent }}>
                  {`"${s}"`}
                </button>
                {i < suggestions.length - 1 && <span className="text-xs" style={{ color: COLORS.textMuted }}> · </span>}
              </span>
            ))}
          </div>
        </form>

        {/* My Saved Lessons */}
        <div className="mt-4">
          <button onClick={() => setShowSaved(!showSaved)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-white"
            style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
            <FolderOpen className="w-4 h-4" /> {showSaved ? 'Hide' : 'My Saved Lessons'}
          </button>
          {showSaved && (
            <div className="mt-3 bg-white rounded-xl border p-4" style={{ borderColor: COLORS.border }}>
              {loadingSaved ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: COLORS.accent }} />
                </div>
              ) : savedLessons.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: COLORS.textMuted }}>No saved lessons yet. Generate and save a lesson to see it here.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedLessons.map((sl) => (
                    <div key={sl._id} className="p-3 rounded-lg border hover:bg-blue-50 transition-colors flex items-center justify-between gap-2"
                      style={{ borderColor: COLORS.border }}>
                      <button onClick={() => onLoadLesson(sl._id)} className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium truncate" style={{ color: COLORS.textPrimary }}>{sl.title}</p>
                        <p className="text-xs flex items-center gap-2" style={{ color: COLORS.textMuted }}>
                          <span>{sl.gradeLevel}</span>
                          <span>·</span>
                          <span>{sl.subject}</span>
                          <span>·</span>
                          <span>{sl.duration}</span>
                          <span>·</span>
                          <Clock className="w-3 h-3 inline" />
                          <span>{new Date(sl.createdAt).toLocaleDateString()}</span>
                        </p>
                      </button>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={async (e) => {
                          e.stopPropagation();
                          const newTitle = window.prompt('Rename lesson:', sl.title);
                          if (newTitle && newTitle !== sl.title) {
                            const ok = await onRenameLesson(sl._id, newTitle);
                            if (ok) setSavedLessons((prev) => prev.map((l) => l._id === sl._id ? { ...l, title: newTitle } : l));
                          }
                        }} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Rename">
                          <Edit3 className="w-3.5 h-3.5" style={{ color: COLORS.textMuted }} />
                        </button>
                        <button onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm(`Delete "${sl.title}"?`)) return;
                          const ok = await onDeleteLesson(sl._id);
                          if (ok) setSavedLessons((prev) => prev.filter((l) => l._id !== sl._id));
                        }} className="p-1.5 rounded hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" style={{ color: COLORS.danger }} />
                        </button>
                        <button onClick={() => onLoadLesson(sl._id)} className="p-1.5 rounded hover:bg-blue-100 transition-colors" title="Open">
                          <Play className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: COLORS.textMuted }}>
          Built by <span className="font-semibold" style={{ color: COLORS.purple }}>Evelyn Learning</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────── GeneratingView ─────────────── */
function GeneratingView({ prompt, grade }: { prompt: string; grade: string }) {
  const [stage, setStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const stages = [
    'Analyzing curriculum standards...',
    'Identifying learning objectives...',
    'Structuring lesson flow...',
    'Writing slide content...',
    'Crafting narration scripts...',
    'Building quiz questions...',
    'Creating practice problems...',
    'Generating vocabulary list...',
    'Aligning to Bloom\'s taxonomy...',
    'Finalizing lesson...',
  ];

  // Advance stages at increasing intervals (slower toward the end)
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const delays = [0, 4000, 8000, 14000, 20000, 28000, 36000, 44000, 52000, 58000];
    delays.forEach((delay, i) => {
      timers.push(setTimeout(() => setStage(i), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Generating Your Lesson</h2>
        <p className="text-sm mb-2" style={{ color: COLORS.textMuted }}>
          &ldquo;{prompt}&rdquo; for {grade}
        </p>
        <p className="text-xs mb-8" style={{ color: COLORS.textMuted }}>
          This usually takes 30-60 seconds — our AI is crafting a complete lesson with narration, quizzes, and worksheets
        </p>

        <div className="bg-white rounded-xl shadow-lg border p-6 text-left space-y-3" style={{ borderColor: COLORS.border }}>
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < stage ? (
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.success }} />
              ) : i === stage ? (
                <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" style={{ color: COLORS.accent }} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: COLORS.border }} />
              )}
              <span className="text-sm" style={{ color: i <= stage ? COLORS.textPrimary : COLORS.textMuted }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs mt-4" style={{ color: COLORS.textMuted }}>
          {elapsed}s elapsed
        </p>
      </div>
    </div>
  );
}

/* ─────────────── ReviewEditor ─────────────── */
function ReviewEditor({
  lesson,
  onPresent,
  onPresentFromSlide,
  onBack,
  onUpdateLesson,
  onSave,
  slideImages,
  imagesLoading,
}: {
  lesson: GeneratedLesson;
  onPresent: () => void;
  onPresentFromSlide: (index: number) => void;
  onBack: () => void;
  onUpdateLesson: (lesson: GeneratedLesson) => void;
  onSave: () => void;
  slideImages: Record<number, string>;
  imagesLoading: Set<number>;
}) {
  const [editingSlide, setEditingSlide] = useState<LessonSlide | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editNarration, setEditNarration] = useState('');
  const [saving, setSaving] = useState(false);

  const openEditModal = (slide: LessonSlide) => {
    setEditingSlide(slide);
    setEditTitle(slide.title);
    setEditContent(slide.content);
    setEditNarration(slide.narration);
  };

  const saveEdit = () => {
    if (!editingSlide) return;
    const updatedSlides = lesson.slides.map((s) =>
      s.id === editingSlide.id ? { ...s, title: editTitle, content: editContent, narration: editNarration } : s
    );
    onUpdateLesson({ ...lesson, slides: updatedSlides });
    setEditingSlide(null);
  };

  const deleteSlide = (slideId: number) => {
    if (lesson.slides.length <= 2) return;
    const updatedSlides = lesson.slides.filter((s) => s.id !== slideId);
    onUpdateLesson({ ...lesson, slides: updatedSlides });
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lesson.slides.length) return;
    const updatedSlides = [...lesson.slides];
    [updatedSlides[index], updatedSlides[newIndex]] = [updatedSlides[newIndex], updatedSlides[index]];
    onUpdateLesson({ ...lesson, slides: updatedSlides });
  };

  // Calculate Bloom's distribution
  const bloomsDist = lesson.slides.reduce<Record<string, number>>((acc, slide) => {
    acc[slide.bloomsLevel] = (acc[slide.bloomsLevel] || 0) + 1;
    return acc;
  }, {});
  const totalSlides = lesson.slides.length;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: COLORS.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={onBack} className="text-sm flex items-center gap-1 mb-2 hover:underline" style={{ color: COLORS.textMuted }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Review Your Lesson</h1>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>{lesson.title} — {lesson.gradeLevel} — {lesson.slides.length} slides</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={async () => { setSaving(true); await onSave(); setSaving(false); }}
              disabled={saving}
              className="px-4 py-3 rounded-xl border font-medium flex items-center gap-2 transition-all hover:bg-gray-50 disabled:opacity-50"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button onClick={onPresent}
              className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition-all hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
              Present Lesson <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="bg-white rounded-xl border p-4 mb-6" style={{ borderColor: COLORS.border }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.textSecondary }}>Learning Objectives</h3>
            <ul className="space-y-1">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: COLORS.textPrimary }}>
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} /> {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Slide Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {lesson.slides.map((slide, index) => (
            <div key={slide.id} className="bg-white rounded-xl border p-4 relative group" style={{ borderColor: COLORS.border }}>
              {/* Image thumbnail */}
              {slideImages[slide.id] ? (
                <div className="mb-2 rounded-lg overflow-hidden aspect-video bg-white flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slideImages[slide.id]} alt={slide.title} className="max-w-full max-h-full object-contain" />
                </div>
              ) : imagesLoading.has(slide.id) ? (
                <div className="mb-2 rounded-lg aspect-video bg-gray-50 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: COLORS.textMuted }} />
                </div>
              ) : slide.visual ? (
                <div className="mb-2 rounded-lg aspect-video bg-gray-50 flex items-center justify-center p-2">
                  <Image className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                </div>
              ) : null}

              {/* Type badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ background: SLIDE_TYPE_COLORS[slide.type] || COLORS.accent }}>
                  {slide.type}
                </span>
                <span className="text-xs font-mono" style={{ color: COLORS.textMuted }}>#{index + 1}</span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: COLORS.textPrimary }}>{slide.title}</h4>

              {/* Content preview */}
              <p className="text-xs mb-3 line-clamp-2" style={{ color: COLORS.textMuted }}>{slide.content}</p>

              {/* Standards */}
              {slide.standards.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {slide.standards.slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 truncate max-w-full" style={{ color: COLORS.accent }}>
                      {s.replace('CCSS.MATH.CONTENT.', '').replace('CCSS.ELA-LITERACY.', '')}
                    </span>
                  ))}
                </div>
              )}

              {/* Bloom's indicator */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: BLOOMS_COLORS[slide.bloomsLevel] || COLORS.accent }} />
                <span className="text-[10px]" style={{ color: COLORS.textMuted }}>{BLOOMS_LABELS[slide.bloomsLevel]}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-wrap">
                <button onClick={() => openEditModal(slide)} className="text-xs px-2 py-1 rounded border hover:bg-gray-50 flex items-center gap-1" style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => onPresentFromSlide(index)} className="text-xs px-2 py-1 rounded border hover:bg-blue-50 flex items-center gap-1" style={{ borderColor: COLORS.border, color: COLORS.accent }}>
                  <Play className="w-3 h-3" /> Play
                </button>
                <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-1 rounded border hover:bg-gray-50 disabled:opacity-30" style={{ borderColor: COLORS.border }}>
                  <ChevronUp className="w-3 h-3" style={{ color: COLORS.textMuted }} />
                </button>
                <button onClick={() => moveSlide(index, 'down')} disabled={index === lesson.slides.length - 1} className="p-1 rounded border hover:bg-gray-50 disabled:opacity-30" style={{ borderColor: COLORS.border }}>
                  <ChevronDown className="w-3 h-3" style={{ color: COLORS.textMuted }} />
                </button>
                {lesson.slides.length > 2 && (
                  <button onClick={() => deleteSlide(slide.id)} className="p-1 rounded border hover:bg-red-50 ml-auto" style={{ borderColor: COLORS.border }}>
                    <Trash2 className="w-3 h-3" style={{ color: COLORS.danger }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Bar */}
        <div className="bg-white rounded-xl border p-4 flex flex-wrap items-center gap-6" style={{ borderColor: COLORS.border }}>
          {/* Standards */}
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-xs font-semibold mb-1" style={{ color: COLORS.textSecondary }}>Standards Covered</h4>
            <div className="flex flex-wrap gap-1">
              {lesson.standards.slice(0, 5).map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50" style={{ color: COLORS.accent }}>
                  {s.replace('CCSS.MATH.CONTENT.', '').replace('CCSS.ELA-LITERACY.', '')}
                </span>
              ))}
              {lesson.standards.length > 5 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100" style={{ color: COLORS.textMuted }}>
                  +{lesson.standards.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Bloom's Distribution */}
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-xs font-semibold mb-1" style={{ color: COLORS.textSecondary }}>Bloom&apos;s Distribution</h4>
            <div className="flex items-center gap-2">
              {Object.entries(bloomsDist).map(([level, count]) => (
                <div key={level} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: BLOOMS_COLORS[level] }} />
                  <span className="text-[10px]" style={{ color: COLORS.textMuted }}>
                    {BLOOMS_LABELS[level]} {Math.round((count / totalSlides) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h4 className="text-xs font-semibold mb-1" style={{ color: COLORS.textSecondary }}>Duration</h4>
            <span className="text-sm" style={{ color: COLORS.textPrimary }}>~{lesson.duration} ({lesson.slides.length} slides)</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingSlide(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>Edit Slide</h3>
              <button onClick={() => setEditingSlide(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" style={{ color: COLORS.textMuted }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 text-sm focus:outline-none" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>Content (displayed on slide)</label>
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 text-sm focus:outline-none resize-none" rows={4} style={{ borderColor: COLORS.border, color: COLORS.textPrimary }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>Narration (spoken aloud)</label>
                <textarea value={editNarration} onChange={(e) => setEditNarration(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 text-sm focus:outline-none resize-none" rows={4} style={{ borderColor: COLORS.border, color: COLORS.textPrimary }} />
              </div>
              <div className="flex gap-3">
                <button onClick={saveEdit} className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm" style={{ background: COLORS.accent }}>
                  Save Changes
                </button>
                <button onClick={() => setEditingSlide(null)} className="px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── QuestionOverlay ─────────────── */
function QuestionOverlay({
  lesson,
  currentSlideIndex,
  onClose,
}: {
  lesson: GeneratedLesson;
  currentSlideIndex: number;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasSpeechRecognition = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    const langMap: Record<string, string> = { en: 'en-US', es: 'es-MX', vi: 'vi-VN' };
    recognition.lang = langMap[lesson.language] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as ArrayLike<{ 0: { transcript: string } }>)
        .map((result) => result[0].transcript)
        .join('');
      setQuestion(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [hasSpeechRecognition, lesson.language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const narrateAnswer = useCallback(async (text: string) => {
    try {
      setIsNarrating(true);
      const response = await fetch('/api/showcase/lesson-engine/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) return;
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsNarrating(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsNarrating(false);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setIsNarrating(false);
    }
  }, []);

  const submitQuestion = useCallback(async () => {
    if (!question.trim() || isStreaming) return;
    setIsStreaming(true);
    setAnswer('');

    try {
      const response = await fetch('/api/showcase/lesson-engine/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          lessonContext: {
            title: lesson.title,
            slides: lesson.slides.map((s) => ({ title: s.title, content: s.content, narration: s.narration, type: s.type })),
          },
          currentSlideIndex,
          gradeLevel: lesson.gradeLevel,
          language: lesson.language,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk') {
                fullAnswer += data.content;
                setAnswer(fullAnswer);
              } else if (data.type === 'error') {
                setAnswer('Sorry, something went wrong. Please try again.');
              }
            } catch {
              // ignore incomplete JSON
            }
          }
        }
      }

      setIsStreaming(false);
      // Narrate the answer
      if (fullAnswer) narrateAnswer(fullAnswer);
    } catch {
      setAnswer('Sorry, something went wrong. Please try again.');
      setIsStreaming(false);
    }
  }, [question, isStreaming, lesson, currentSlideIndex, narrateAnswer]);

  const handleClose = useCallback(() => {
    audioRef.current?.pause();
    recognitionRef.current?.stop();
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="text-center mb-6">
          <MessageCircle className="w-10 h-10 mx-auto mb-3" style={{ color: COLORS.accent }} />
          <h2 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>A student has a question...</h2>
          <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
            Currently on: {lesson.slides[currentSlideIndex]?.title}
          </p>
        </div>

        {/* Question Input */}
        {!answer && !isStreaming && (
          <div className="space-y-4">
            <div className="relative">
              <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type or speak the student's question..."
                className="w-full px-4 py-3 pr-24 rounded-xl border-2 text-base focus:outline-none"
                style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                onKeyDown={(e) => e.key === 'Enter' && submitQuestion()}
                autoFocus />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {hasSpeechRecognition && (
                  <button onClick={isListening ? stopListening : startListening}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: isListening ? COLORS.danger : COLORS.bg, color: isListening ? 'white' : COLORS.textMuted }}>
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button onClick={submitQuestion} disabled={!question.trim()}
                  className="p-2 rounded-lg text-white disabled:opacity-50"
                  style={{ background: COLORS.accent }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            {isListening && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: COLORS.danger }} />
                <span className="text-sm" style={{ color: COLORS.danger }}>Listening...</span>
              </div>
            )}
          </div>
        )}

        {/* Streaming / Answer */}
        {(isStreaming || answer) && (
          <div className="mt-4">
            <div className="bg-blue-50 rounded-xl p-6 min-h-[100px]">
              <p className="text-lg leading-relaxed" style={{ color: COLORS.textPrimary }}>
                {answer || '...'}
                {isStreaming && <span className="inline-block w-2 h-5 ml-1 bg-blue-400 animate-pulse" />}
              </p>
            </div>
            {isNarrating && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <Volume2 className="w-4 h-4 animate-pulse" style={{ color: COLORS.accent }} />
                <span className="text-sm" style={{ color: COLORS.accent }}>Reading aloud...</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {answer && !isStreaming && (
            <button onClick={() => { setAnswer(''); setQuestion(''); }}
              className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
              <MessageCircle className="w-4 h-4" /> Ask Another
            </button>
          )}
          <button onClick={handleClose}
            className="px-6 py-2.5 rounded-lg text-white font-medium text-sm flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
            <Play className="w-4 h-4" /> Resume Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Activity Timer Helpers ─────────────── */
function extractTimerSeconds(slide: LessonSlide): number | null {
  // Search content, narration, and teacherNotes for time references
  const text = `${slide.content} ${slide.narration} ${slide.teacherNotes || ''}`.toLowerCase();
  // Match patterns like "30 seconds", "1 minute", "2 minutes", "take 30 seconds", "60 sec"
  const secMatch = text.match(/(\d+)\s*(?:second|sec)/);
  const minMatch = text.match(/(\d+)\s*(?:minute|min)/);
  if (secMatch) return parseInt(secMatch[1], 10);
  if (minMatch) return parseInt(minMatch[1], 10) * 60;
  return null;
}

function ActivityTimer({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setRemaining(seconds);
    setActive(false);
    setFinished(false);
  }, [seconds]);

  // When timer hits zero, mark finished and defer onComplete to avoid setState-during-render
  useEffect(() => {
    if (finished) {
      const timeout = setTimeout(onComplete, 100);
      return () => clearTimeout(timeout);
    }
  }, [finished, onComplete]);

  useEffect(() => {
    if (!active || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-white/10 border border-white/20">
      <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-white/80 font-medium">
            {active ? 'Activity Timer' : 'Activity Timer — Click Start'}
          </span>
          <span className="text-lg font-mono text-white font-bold">
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: remaining <= 10 ? COLORS.danger : COLORS.accent }} />
        </div>
      </div>
      {!active && remaining > 0 && !finished && (
        <button onClick={() => setActive(true)}
          className="px-3 py-1.5 rounded-lg text-white text-sm font-medium"
          style={{ background: COLORS.success }}>
          Start
        </button>
      )}
      {finished && (
        <span className="text-sm text-green-400 font-medium">Done!</span>
      )}
    </div>
  );
}

/* ─────────────── SlideshowView ─────────────── */
function SlideshowView({
  lesson,
  onEnd,
  onBack,
  quizResults,
  onQuizAnswer,
  slideImages,
  startSlide = 0,
}: {
  lesson: GeneratedLesson;
  onEnd: () => void;
  onBack: () => void;
  quizResults: Record<number, boolean>;
  onQuizAnswer: (slideId: number, correct: boolean) => void;
  slideImages: Record<number, string>;
  startSlide?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(startSlide);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const narrationIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(true);
  const currentIndexRef = useRef(0);

  const slide = lesson.slides[currentIndex];
  const isLastSlide = currentIndex === lesson.slides.length - 1;

  // Keep refs in sync with state
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // Cleanup all audio immediately
  const stopAllAudio = useCallback(() => {
    // Abort any in-flight TTS request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Stop and dispose current audio element
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Revoke blob URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioLoading(false);
  }, []);

  // Narrate given text — uses narration ID to prevent stale callbacks
  const narrateText = useCallback(async (text: string, slideIdx: number) => {
    if (!text) return;

    // Stop everything first
    stopAllAudio();

    const thisNarrationId = ++narrationIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setAudioLoading(true);
      const response = await fetch('/api/showcase/lesson-engine/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      // Stale check: if user navigated away, don't play
      if (thisNarrationId !== narrationIdRef.current) return;

      if (!response.ok) {
        setAudioLoading(false);
        return;
      }

      const blob = await response.blob();
      if (thisNarrationId !== narrationIdRef.current) return;

      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      setAudioLoading(false);

      audio.onended = () => {
        // Only auto-advance if this is still the current narration
        if (thisNarrationId !== narrationIdRef.current) return;
        const currentSlide = lesson.slides[currentIndexRef.current];
        const isLast = currentIndexRef.current === lesson.slides.length - 1;
        // Don't auto-advance on quiz slides or activity slides with a timer
        const hasTimer = currentSlide?.type === 'activity' && extractTimerSeconds(currentSlide) !== null;
        if (isPlayingRef.current && !isLast && currentSlide?.type !== 'quiz' && !hasTimer) {
          setCurrentIndex((prev) => Math.min(prev + 1, lesson.slides.length - 1));
        }
      };

      // Only play if still on the same slide
      if (thisNarrationId === narrationIdRef.current) {
        await audio.play().catch(() => {
          // Autoplay blocked
        });
      }
    } catch (err) {
      // Don't set loading false if aborted (cleanup already happened)
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (thisNarrationId === narrationIdRef.current) setAudioLoading(false);
    }
  }, [stopAllAudio, lesson.slides]);

  // Trigger narration when slide changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    const currentSlide = lesson.slides[currentIndex];
    if (currentSlide && isPlaying && audioEnabled) {
      narrateText(currentSlide.narration, currentIndex);
    } else {
      stopAllAudio();
    }
    return () => {
      // Will be cleaned up by stopAllAudio in next call
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Replay narration for current slide
  const replayNarration = useCallback(() => {
    const currentSlide = lesson.slides[currentIndex];
    if (currentSlide?.narration) {
      narrateText(currentSlide.narration, currentIndex);
    }
  }, [lesson.slides, currentIndex, narrateText]);

  const goNext = useCallback(() => {
    stopAllAudio();
    if (isLastSlide) {
      onEnd();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [stopAllAudio, isLastSlide, onEnd]);

  const goPrev = useCallback(() => {
    stopAllAudio();
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [stopAllAudio, currentIndex]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else {
        // No audio loaded — trigger narration
        const currentSlide = lesson.slides[currentIndex];
        if (currentSlide?.narration && audioEnabled) {
          narrateText(currentSlide.narration, currentIndex);
        }
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioEnabled, lesson.slides, currentIndex, narrateText]);

  const toggleAudio = useCallback(() => {
    if (audioEnabled) {
      stopAllAudio();
    }
    setAudioEnabled(!audioEnabled);
  }, [audioEnabled, stopAllAudio]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Listen for fullscreen changes (e.g. Escape key)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopAllAudio(); };
  }, [stopAllAudio]);

  const handleQuizAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    const isCorrect = optionIndex === slide.correct;
    onQuizAnswer(slide.id, isCorrect);
  };

  return (
    <>
      <div ref={containerRef} className="min-h-screen flex flex-col" style={{ background: '#0a1628' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <button onClick={onBack} className="text-white/60 text-sm flex items-center gap-1 hover:text-white/80">
            <ChevronLeft className="w-4 h-4" /> Exit
          </button>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">{currentIndex + 1} / {lesson.slides.length}</span>
            {/* Progress bar */}
            <div className="w-32 h-1 rounded-full bg-white/20">
              <div className="h-full rounded-full transition-all" style={{ width: `${((currentIndex + 1) / lesson.slides.length) * 100}%`, background: COLORS.accent }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={replayNarration} className="text-white/60 hover:text-white/80 p-1.5" title="Replay narration">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={toggleAudio} className="text-white/60 hover:text-white/80 p-1.5" title={audioEnabled ? 'Mute' : 'Unmute'}>
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button onClick={togglePlayPause} className="text-white/60 hover:text-white/80 p-1.5" title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={toggleFullscreen} className="text-white/60 hover:text-white/80 p-1.5" title="Toggle fullscreen">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Slide content — in fullscreen, CSS zoom shrinks everything uniformly to fit */}
        <div className="flex-1 flex items-start justify-center px-6 py-4 md:px-12 md:py-6 overflow-y-auto"
          style={isFullscreen ? { zoom: 0.78 } : undefined}>
          <div className="w-full max-w-4xl">
            {/* Audio loading indicator — shown above content */}
            {audioLoading && (
              <div className="flex items-center gap-2 mb-3">
                <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                <span className="text-sm text-white/50">Loading narration...</span>
              </div>
            )}

            {/* Type tag + Standards badge (compact row) */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white/80"
                style={{ background: `${SLIDE_TYPE_COLORS[slide.type]}88` }}>
                {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
              </span>
              {slide.standards.slice(0, 2).map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                  {s.replace('CCSS.MATH.CONTENT.', '').replace('CCSS.ELA-LITERACY.', '')}
                </span>
              ))}
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: BLOOMS_COLORS[slide.bloomsLevel] }} title={BLOOMS_LABELS[slide.bloomsLevel]} />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{slide.title}</h1>

            {/* Content */}
            {slide.content && (
              <div className="text-lg md:text-xl text-white/90 leading-relaxed whitespace-pre-line mb-6">
                {slide.content}
              </div>
            )}

            {/* Activity timer — if slide references a time duration */}
            {slide.type === 'activity' && extractTimerSeconds(slide) && (
              <ActivityTimer
                key={slide.id}
                seconds={extractTimerSeconds(slide)!}
                onComplete={goNext}
              />
            )}

            {/* Slide image */}
            {slideImages[slide.id] ? (
              <div className="mb-6 max-w-2xl bg-white rounded-xl p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slideImages[slide.id]} alt={slide.visual || slide.title} className="max-w-full max-h-64 object-contain mx-auto rounded-xl" />
              </div>
            ) : slide.visual ? (
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <Image className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                <p className="text-base text-white/70 italic">{slide.visual}</p>
              </div>
            ) : null}

            {/* Quiz — always show question text */}
            {slide.type === 'quiz' && (
              <div className="mt-4">
                {slide.question && (
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-5">{slide.question}</h3>
                )}
                {slide.options && slide.options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {slide.options.map((option, i) => {
                      let bg = 'rgba(255,255,255,0.1)';
                      let border = 'rgba(255,255,255,0.2)';
                      if (selectedAnswer !== null) {
                        if (i === slide.correct) {
                          bg = 'rgba(56, 161, 105, 0.3)';
                          border = '#38A169';
                        } else if (i === selectedAnswer && i !== slide.correct) {
                          bg = 'rgba(229, 62, 62, 0.3)';
                          border = '#E53E3E';
                        }
                      }
                      return (
                        <button key={i} onClick={() => handleQuizAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className="text-left px-5 py-4 rounded-xl border-2 text-white text-base transition-all hover:bg-white/20 disabled:cursor-default"
                          style={{ background: bg, borderColor: border }}>
                          <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {option}
                        </button>
                      );
                    })}
                  </div>
                )}
                {showExplanation && slide.explanation && (
                  <div className="mt-4 p-4 rounded-xl bg-white/10 text-white/80 text-base">
                    {selectedAnswer === slide.correct ? '✓ Correct! ' : '✗ Not quite. '}
                    {slide.explanation}
                  </div>
                )}
              </div>
            )}

            {/* Teacher notes */}
            {slide.teacherNotes && (
              <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-white/40 mb-1 font-medium">Teacher Notes:</p>
                <p className="text-sm text-white/60">{slide.teacherNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <button onClick={goPrev} disabled={currentIndex === 0}
            className="px-4 py-2 rounded-lg text-white/60 hover:text-white/80 flex items-center gap-1 disabled:opacity-30 disabled:cursor-default">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button onClick={() => { setIsPlaying(false); stopAllAudio(); setShowQuestion(true); }}
            className="px-5 py-2.5 rounded-xl border-2 border-white/20 text-white font-medium text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
            <MessageCircle className="w-4 h-4" /> Student Question
          </button>

          <button onClick={goNext}
            className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-1"
            style={{ background: COLORS.accent }}>
            {isLastSlide ? 'End Lesson' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question overlay */}
      {showQuestion && (
        <QuestionOverlay lesson={lesson} currentSlideIndex={currentIndex} onClose={() => {
          setShowQuestion(false);
          setIsPlaying(true);
          // Resume narration from the current slide
          if (audioEnabled) {
            const currentSlide = lesson.slides[currentIndex];
            if (currentSlide?.narration) {
              narrateText(currentSlide.narration, currentIndex);
            }
          }
        }} />
      )}
    </>
  );
}

/* ─────────────── LessonScorecard ─────────────── */
function LessonScorecard({
  lesson,
  quizResults,
  onNewLesson,
  onExportWorksheet,
  onSave,
  onBackToReview,
}: {
  lesson: GeneratedLesson;
  quizResults: Record<number, boolean>;
  onNewLesson: () => void;
  onExportWorksheet: () => void;
  onSave: () => void;
  onBackToReview: () => void;
}) {
  // Bloom's distribution
  const bloomsDist = lesson.slides.reduce<Record<string, number>>((acc, slide) => {
    acc[slide.bloomsLevel] = (acc[slide.bloomsLevel] || 0) + 1;
    return acc;
  }, {});
  const totalSlides = lesson.slides.length;

  // Quiz performance
  const quizSlides = lesson.slides.filter((s) => s.type === 'quiz');
  const answeredQuizzes = Object.keys(quizResults).length;
  const correctAnswers = Object.values(quizResults).filter(Boolean).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border p-8" style={{ borderColor: COLORS.border }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${COLORS.success}20` }}>
              <Award className="w-8 h-8" style={{ color: COLORS.success }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Lesson Complete!</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>{lesson.title} — {lesson.gradeLevel}</p>
          </div>

          {/* Standards Coverage */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
              <GraduationCap className="w-4 h-4" /> Standards Coverage
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {lesson.standards.map((standard) => {
                const covered = lesson.slides.some((s) => s.standards.includes(standard));
                return (
                  <div key={standard} className="flex items-start gap-2">
                    {covered ? (
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} />
                    ) : (
                      <div className="w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: COLORS.border }} />
                    )}
                    <span className="text-sm" style={{ color: covered ? COLORS.textPrimary : COLORS.textMuted }}>
                      {standard.replace('CCSS.MATH.CONTENT.', '').replace('CCSS.ELA-LITERACY.', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bloom's Taxonomy */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
              <BarChart3 className="w-4 h-4" /> Bloom&apos;s Taxonomy Distribution
            </h3>
            <div className="space-y-2">
              {Object.entries(bloomsDist)
                .sort(([, a], [, b]) => b - a)
                .map(([level, count]) => {
                  const pct = Math.round((count / totalSlides) * 100);
                  return (
                    <div key={level} className="flex items-center gap-3">
                      <span className="text-xs w-20 text-right" style={{ color: COLORS.textMuted }}>{BLOOMS_LABELS[level]}</span>
                      <div className="flex-1 h-4 rounded-full bg-gray-100">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: BLOOMS_COLORS[level] }} />
                      </div>
                      <span className="text-xs w-10" style={{ color: COLORS.textMuted }}>{pct}%</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quiz Performance */}
          {quizSlides.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
                <FileText className="w-4 h-4" /> Quiz Performance
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                {answeredQuizzes > 0 ? (
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold" style={{ color: correctAnswers === answeredQuizzes ? COLORS.success : COLORS.accent }}>
                      {correctAnswers}/{answeredQuizzes}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>questions answered correctly</p>
                      <p className="text-xs" style={{ color: COLORS.textMuted }}>{quizSlides.length - answeredQuizzes} quiz question{quizSlides.length - answeredQuizzes !== 1 ? 's' : ''} not attempted</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>No quiz questions were attempted during the lesson</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onSave}
              className="px-5 py-2.5 rounded-xl border-2 font-medium text-sm flex items-center gap-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
              <Save className="w-4 h-4" /> Save Lesson
            </button>
            <button onClick={onExportWorksheet}
              className="px-5 py-2.5 rounded-xl border-2 font-medium text-sm flex items-center gap-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
              <Download className="w-4 h-4" /> Download Worksheet
            </button>
            <button onClick={onBackToReview}
              className="px-5 py-2.5 rounded-xl border-2 font-medium text-sm flex items-center gap-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
              <ChevronLeft className="w-4 h-4" /> Back to Review
            </button>
            <button onClick={onNewLesson}
              className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
              <RotateCcw className="w-4 h-4" /> New Lesson
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: COLORS.textMuted }}>
          Built by <span className="font-semibold" style={{ color: COLORS.purple }}>Evelyn Learning</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────── exportWorksheetPDF ─────────────── */
async function exportWorksheetPDF(lesson: GeneratedLesson) {
  const { default: jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (neededSpace: number) => {
    if (y + neededSpace > 270) {
      pdf.addPage();
      y = 20;
    }
  };

  const writeWrapped = (text: string, fontSize: number, bold: boolean, color: [number, number, number]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(sanitize(text), contentWidth);
    lines.forEach((line: string) => {
      addPageIfNeeded(fontSize * 0.5);
      pdf.text(line, margin, y);
      y += fontSize * 0.45;
    });
  };

  // Header
  pdf.setFillColor(26, 54, 93);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(sanitize(lesson.title), margin, 16);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${lesson.gradeLevel} | ${lesson.subject} | ${lesson.duration}`, margin, 24);
  if (lesson.standards.length > 0) {
    const standardsStr = lesson.standards.slice(0, 4).map((s) => s.replace('CCSS.MATH.CONTENT.', '').replace('CCSS.ELA-LITERACY.', '')).join(', ');
    pdf.text(`Standards: ${standardsStr}`, margin, 30);
  }

  y = 45;

  // Objectives
  if (lesson.objectives.length > 0) {
    writeWrapped('Learning Objectives', 12, true, [26, 54, 93]);
    y += 2;
    lesson.objectives.forEach((obj) => {
      writeWrapped(`- ${obj}`, 9.5, false, [74, 85, 104]);
    });
    y += 4;
  }

  // Vocabulary
  if (lesson.worksheet.vocabulary.length > 0) {
    writeWrapped('Vocabulary', 12, true, [26, 54, 93]);
    y += 2;
    lesson.worksheet.vocabulary.forEach((v) => {
      addPageIfNeeded(10);
      writeWrapped(`${v.term}: ${v.definition}`, 9.5, false, [74, 85, 104]);
    });
    y += 4;
  }

  // Instructions
  if (lesson.worksheet.instructions) {
    writeWrapped('Instructions', 12, true, [26, 54, 93]);
    y += 2;
    writeWrapped(lesson.worksheet.instructions, 9.5, false, [74, 85, 104]);
    y += 4;
  }

  // Problems
  if (lesson.worksheet.problems.length > 0) {
    writeWrapped('Practice Problems', 12, true, [26, 54, 93]);
    y += 2;
    lesson.worksheet.problems.forEach((p, i) => {
      addPageIfNeeded(12);
      writeWrapped(`${i + 1}. ${p.question}`, 9.5, false, [26, 32, 44]);
      y += 3;
      // Leave blank space for student answers
      y += 8;
    });
  }

  // Answer Key on new page
  if (lesson.worksheet.problems.length > 0) {
    pdf.addPage();
    y = 20;
    writeWrapped('Answer Key', 12, true, [26, 54, 93]);
    y += 2;
    lesson.worksheet.problems.forEach((p, i) => {
      addPageIfNeeded(10);
      writeWrapped(`${i + 1}. ${p.answer}`, 9.5, false, [74, 85, 104]);
    });
  }

  // Vietnamese disclaimer
  if (lesson.language === 'vi') {
    addPageIfNeeded(15);
    y += 6;
    writeWrapped('Note: Vietnamese diacritical marks may not render correctly in this PDF. A future update will include full Unicode font support.', 8, false, [160, 160, 160]);
  }

  // Footer on each page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Built by Evelyn Learning | evelynlearning.com', margin, 290);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, 290);
  }

  const safeTitle = sanitize(lesson.title).replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  pdf.save(`${safeTitle}_Worksheet.pdf`);
}

/* ─────────────── MainApp ─────────────── */
function MainApp() {
  const [view, setView] = useState<ViewState>('input');
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [inputData, setInputData] = useState<{ prompt: string; grade: string } | null>(null);
  const [slideImages, setSlideImages] = useState<Record<number, string>>({});
  const [imagesLoading, setImagesLoading] = useState<Set<number>>(new Set());
  const [startSlide, setStartSlide] = useState(0);
  const [enableImages, setEnableImages] = useState(false);
  const [savedLessonId, setSavedLessonId] = useState<string | null>(null);

  const tracker = useDemoTracker('lesson-engine', 'AI Lesson Engine');
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedRef.current) {
      tracker.onView();
      hasTrackedRef.current = true;
    }
  }, [tracker]);

  // Find images for slides — tries curated library first, falls back to DALL-E if enabled
  // Processes sequentially so each request can exclude already-matched filenames
  const generateSlideImages = useCallback(async (slides: LessonSlide[], gradeLevel: string, subject: string) => {
    const slidesWithVisuals = slides.filter((s) => (s.visual && s.visual.trim()) || (s.imageTags && s.imageTags.length > 0));
    if (slidesWithVisuals.length === 0) return;

    const usedFilenames: string[] = [];

    for (const slide of slidesWithVisuals) {
      setImagesLoading((prev) => new Set(prev).add(slide.id));
      try {
        const response = await fetch('/api/showcase/lesson-engine/match-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageTags: slide.imageTags || [],
            visual: slide.visual || '',
            subject,
            gradeLevel,
            enableDalleFallback: enableImages,
            excludeFilenames: usedFilenames,
          }),
        });
        const data = await response.json();
        if (data.success && data.url) {
          setSlideImages((prev) => ({ ...prev, [slide.id]: data.url }));
          if (data.filename && data.filename !== 'dalle-generated') {
            usedFilenames.push(data.filename);
          }
        }
      } catch {
        // silently skip failed images
      } finally {
        setImagesLoading((prev) => {
          const next = new Set(prev);
          next.delete(slide.id);
          return next;
        });
      }
    }
  }, [enableImages]);

  // Start image matching when entering review — always tries curated library, DALL-E only if enableImages
  useEffect(() => {
    if (view === 'review' && lesson && Object.keys(slideImages).length === 0) {
      generateSlideImages(lesson.slides, lesson.gradeLevel, lesson.subject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const handleGenerate = useCallback(async (data: { prompt: string; grade: string; duration: number; language: 'en' | 'es' | 'vi'; curriculumContext?: string; enableImages?: boolean }) => {
    setInputData({ prompt: data.prompt, grade: data.grade });
    setEnableImages(data.enableImages ?? false);
    setSavedLessonId(null);
    setView('generating');
    setError(null);
    setQuizResults({});
    setSlideImages({});
    setImagesLoading(new Set());

    tracker.onTry();

    try {
      const response = await fetch('/api/showcase/lesson-engine/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate lesson');
      }

      setLesson(result.lesson);
      setView('review');
      tracker.onComplete({ slides: result.lesson.slides.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setView('input');
    }
  }, [tracker]);

  const handleSaveLesson = useCallback(async () => {
    if (!lesson) return;
    try {
      let response;
      if (savedLessonId) {
        // Update existing lesson
        response = await fetch(`/api/showcase/lesson-engine/lessons/${savedLessonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson, prompt: inputData?.prompt || '', imageUrls: slideImages }),
        });
      } else {
        // Create new lesson
        response = await fetch('/api/showcase/lesson-engine/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson, prompt: inputData?.prompt || '', imageUrls: slideImages }),
        });
      }
      const result = await response.json();
      if (result.success) {
        if (!savedLessonId && result.id) setSavedLessonId(result.id);
        alert(savedLessonId ? 'Lesson updated!' : 'Lesson saved!');
      } else {
        alert('Failed to save lesson.');
      }
    } catch {
      alert('Failed to save lesson.');
    }
  }, [lesson, inputData, slideImages, savedLessonId]);

  const handleLoadLesson = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/showcase/lesson-engine/lessons/${id}`);
      const data = await response.json();
      if (data.success && data.lesson) {
        setLesson(data.lesson as GeneratedLesson);
        setSlideImages(data.imageUrls || {});
        setQuizResults({});
        setStartSlide(0);
        setSavedLessonId(id);
        setView('review');
      } else {
        setError('Failed to load lesson.');
      }
    } catch {
      setError('Failed to load lesson.');
    }
  }, []);

  const handleDeleteLesson = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/showcase/lesson-engine/lessons/${id}`, { method: 'DELETE' });
      const data = await response.json();
      return data.success === true;
    } catch {
      return false;
    }
  }, []);

  const handleRenameLesson = useCallback(async (id: string, newTitle: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/showcase/lesson-engine/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await response.json();
      return data.success === true;
    } catch {
      return false;
    }
  }, []);

  const handlePresentFromSlide = useCallback((index: number) => {
    setStartSlide(index);
    setView('slideshow');
  }, []);

  const handleQuizAnswer = useCallback((slideId: number, correct: boolean) => {
    setQuizResults((prev) => ({ ...prev, [slideId]: correct }));
  }, []);

  const handleNewLesson = useCallback(() => {
    setLesson(null);
    setQuizResults({});
    setSlideImages({});
    setImagesLoading(new Set());
    setError(null);
    setStartSlide(0);
    setSavedLessonId(null);
    setView('input');
  }, []);

  if (view === 'input') {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 p-1 hover:bg-red-100 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <InputPanel onGenerate={handleGenerate} onLoadLesson={handleLoadLesson} onDeleteLesson={handleDeleteLesson} onRenameLesson={handleRenameLesson} />
      </>
    );
  }

  if (view === 'generating' && inputData) {
    return <GeneratingView prompt={inputData.prompt} grade={inputData.grade} />;
  }

  if (view === 'review' && lesson) {
    return (
      <ReviewEditor
        lesson={lesson}
        onPresent={() => { setStartSlide(0); setView('slideshow'); }}
        onPresentFromSlide={handlePresentFromSlide}
        onBack={handleNewLesson}
        onUpdateLesson={setLesson}
        onSave={handleSaveLesson}
        slideImages={slideImages}
        imagesLoading={imagesLoading}
      />
    );
  }

  if (view === 'slideshow' && lesson) {
    return (
      <SlideshowView
        lesson={lesson}
        onEnd={() => setView('scorecard')}
        onBack={() => setView('review')}
        quizResults={quizResults}
        onQuizAnswer={handleQuizAnswer}
        slideImages={slideImages}
        startSlide={startSlide}
      />
    );
  }

  if (view === 'scorecard' && lesson) {
    return (
      <LessonScorecard
        lesson={lesson}
        quizResults={quizResults}
        onNewLesson={handleNewLesson}
        onExportWorksheet={() => exportWorksheetPDF(lesson)}
        onSave={handleSaveLesson}
        onBackToReview={() => setView('review')}
      />
    );
  }

  return null;
}

/* ─────────────── Page Root ─────────────── */
export default function LessonEnginePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('lesson_engine_access');
    if (stored === 'true') setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.accent }} />
      </div>
    );
  }

  if (!unlocked) return <AccessGate onUnlock={() => setUnlocked(true)} />;
  return <MainApp />;
}
