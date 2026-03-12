'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import { DemoTracker } from '@/components/demos/DemoTracker';
import {
  Lock, GraduationCap, Sparkles, Shield, BookOpen, Mic, MessageCircle, Globe, BarChart3,
  ChevronRight, ChevronLeft, Check, Star, ArrowRight, X, ExternalLink, Zap, Users, Clock,
  Brain, TrendingUp, Award, Search, PenTool,
} from 'lucide-react';

// ── Brand Palette ──

const BRAND = {
  primary: '#1B365D',
  primaryLight: '#2B5A8C',
  primaryDark: '#0F2240',
  gold: '#C5A44E',
  goldLight: '#D4B96A',
  accent: '#6C3FA0',
  accentLight: '#8B5FC7',
  success: '#38A169',
  warning: '#DD6B20',
  bg: '#F7FAFC',
  cardBg: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  border: '#E2E8F0',
};

// ── Dynamic Demo Imports ──

const EssayScoringDemo = dynamic(
  () => import('@/components/demos/EssayScoringDemo'),
  { ssr: false, loading: () => <DemoLoader /> }
);

const PlagiarismDetector = dynamic(
  () => import('@/components/plagiarism-detection/PlagiarismDetector'),
  { ssr: false, loading: () => <DemoLoader /> }
);

const HomeworkHelpBot = dynamic(
  () => import('@/components/demos/HomeworkHelpBot'),
  { ssr: false, loading: () => <DemoLoader /> }
);

const LanguageLearningDemo = dynamic(
  () => import('@/components/demos/LanguageLearningDemo'),
  { ssr: false, loading: () => <DemoLoader /> }
);

const AnalyticsDashboardDemo = dynamic(
  () => import('@/components/demos/AnalyticsDashboardDemo'),
  { ssr: false, loading: () => <DemoLoader /> }
);

function DemoLoader() {
  return (
    <div className="h-[400px] bg-slate-50 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Loading demo...</p>
      </div>
    </div>
  );
}

// ── Product Data ──

interface Product {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  colorLight: string;
  features: string[];
  comingSoon: string[];
  demoType: 'embed' | 'link';
  href?: string;
  price: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'plagiarism-detection',
    title: 'Plagiarism & AI Detection',
    description: 'Identify AI-generated content and plagiarism with passage-level precision. Built for academic integrity conversations, not just scores.',
    icon: <Shield className="w-7 h-7" />,
    color: BRAND.primary,
    colorLight: '#EBF0F7',
    features: [
      'Dual scoring: AI detection + plagiarism detection',
      'Passage-level flagging with confidence scores',
      'Verified web source matching with premium search APIs',
      'Grade-level and subject calibration',
      'Batch processing for entire class submissions',
      'Resubmission comparison tracking',
      'Exportable PDF reports for admin review',
      'LMS-compatible (Canvas, Google Classroom, Schoology)',
    ],
    comingSoon: [
      'Writing Style Fingerprinting (student baseline)',
      'Citation Verification Engine',
      'Cross-Submission Comparison within a class',
      'Revision History / Keystroke Analysis',
      'Multi-Language Support',
      'Longitudinal Student Dashboard',
      'Configurable Institutional Policies',
      'LMS Auto-Ingest Integration',
    ],
    demoType: 'embed',
    price: '$4',
  },
  {
    id: 'essay-scoring',
    title: 'AI Essay Scoring & Feedback',
    description: 'Rubric-aligned scoring with detailed, actionable feedback. Students get specific suggestions before they submit — teachers save hours.',
    icon: <PenTool className="w-7 h-7" />,
    color: '#6C3FA0',
    colorLight: '#F3EEFA',
    features: [
      'SAT, ACT, AP, and College Application rubrics',
      'Custom rubric support for any assignment',
      'Category-by-category score breakdown',
      'Specific observations and improvement suggestions',
      'Before/after rewrite examples',
      '95% correlation with expert human graders',
      'PDF feedback reports',
    ],
    comingSoon: [
      'Writing growth tracking across submissions',
    ],
    demoType: 'embed',
    price: '$3',
  },
  {
    id: 'voice-tutor',
    title: 'AI Voice Tutor',
    description: 'Real-time voice-based AI tutoring. Students speak naturally and get instant, Socratic guidance with interactive whiteboard support.',
    icon: <Mic className="w-7 h-7" />,
    color: '#DD6B20',
    colorLight: '#FFF5EB',
    features: [
      'Real-time voice conversation with AI tutor',
      'Interactive whiteboard with graphs and diagrams',
      'Multi-subject: Math, Science, ELA, and more',
      'Homework photo upload with instant analysis',
      'Socratic method — guides, never gives answers',
      'Session analytics and progress tracking',
      'Session transcript and PDF export',
    ],
    comingSoon: [
      'Session recording & replay',
      'Parent/teacher session summaries',
      'Group tutoring mode',
    ],
    demoType: 'link',
    href: '/tutor',
    price: '$15',
  },
  {
    id: 'homework-helper',
    title: '24/7 AI Homework Helper',
    description: 'Always-available tutoring assistant that guides students through problems using the Socratic method. Available outside school hours when students need help most.',
    icon: <MessageCircle className="w-7 h-7" />,
    color: '#2B6CB0',
    colorLight: '#EBF4FF',
    features: [
      'Step-by-step guidance, never gives direct answers',
      'Multi-subject: Math, Science, English, History, Languages',
      'Homework photo upload with vision analysis',
      'Follow-up suggestion chips',
      'Session export as PDF',
      'Academic integrity enforcement built-in',
      'White-label ready',
    ],
    comingSoon: [
      'Practice problem generator',
      'Step-by-step solution playback',
    ],
    demoType: 'embed',
    price: '$5',
  },
  {
    id: 'language-learning',
    title: 'Language Learning AI',
    description: 'Conversational AI language partner with real-world scenarios. Students practice speaking, get corrections, and build vocabulary at their CEFR level.',
    icon: <Globe className="w-7 h-7" />,
    color: '#319795',
    colorLight: '#E6FFFA',
    features: [
      '5 languages: Spanish, French, German, Japanese, Mandarin',
      '10 real-world scenarios (cafe, travel, school, etc.)',
      'CEFR-aligned difficulty (A1 to C2)',
      'AI-powered speech (speak & listen)',
      'Real-time grammar corrections',
      'Vocabulary tracker with pronunciation',
      'Session export as PDF',
    ],
    comingSoon: [
      'Pronunciation scoring (student vs. native)',
      'Grammar lesson integration',
      'Spaced repetition vocabulary review',
    ],
    demoType: 'embed',
    price: '$5',
  },
  {
    id: 'analytics-dashboard',
    title: 'Student Analytics Dashboard',
    description: 'Real-time insights into student progress, engagement, and learning patterns. Identify at-risk students early and make data-driven instructional decisions.',
    icon: <BarChart3 className="w-7 h-7" />,
    color: '#38A169',
    colorLight: '#F0FFF4',
    features: [
      'Class overview with subject breakdowns',
      'Individual student deep-dive profiles',
      'AI-powered early warning system',
      'Progress tracking with streaks and mastery',
      'Strengths and areas for improvement',
      'Data export (CSV, PDF, API)',
    ],
    comingSoon: [
      'Custom report builder',
      'Predictive analytics / early intervention alerts',
      'Attendance correlation',
      'Benchmarking against similar schools',
    ],
    demoType: 'embed',
    price: '$3',
  },
];

// ── Pricing Data ──

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  products: string[];
  highlighted: boolean;
  savings: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Essentials',
    price: 8,
    period: 'per student / year',
    description: 'Core academic integrity and assessment tools',
    products: [
      'Plagiarism & AI Detection',
      'AI Essay Scoring & Feedback',
      'Student Analytics Dashboard',
    ],
    highlighted: false,
    savings: '20% off individual pricing',
  },
  {
    name: 'Standard',
    price: 16,
    period: 'per student / year',
    description: 'Complete learning support suite',
    products: [
      'Plagiarism & AI Detection',
      'AI Essay Scoring & Feedback',
      'Student Analytics Dashboard',
      '24/7 AI Homework Helper',
      'Language Learning AI',
    ],
    highlighted: true,
    savings: '27% off individual pricing',
  },
  {
    name: 'Premium',
    price: 28,
    period: 'per student / year',
    description: 'Everything, including voice tutoring',
    products: [
      'Plagiarism & AI Detection',
      'AI Essay Scoring & Feedback',
      'Student Analytics Dashboard',
      '24/7 AI Homework Helper',
      'Language Learning AI',
      'AI Voice Tutor (60 min/student/month)',
    ],
    highlighted: false,
    savings: '20% off individual pricing',
  },
];

// ── Presentation Slides ──

interface Slide {
  type: 'title' | 'section' | 'content' | 'stats' | 'pricing' | 'closing';
  title: string;
  subtitle?: string;
  bullets?: string[];
  note?: string;
}

const SLIDES: Slide[] = [
  {
    type: 'title',
    title: 'Evelyn Learning',
    subtitle: 'AI-Powered Education Tools for\nGabrielino High School & SGUSD',
  },
  {
    type: 'content',
    title: 'About Evelyn Learning',
    bullets: [
      '300+ subject matter experts with teaching backgrounds',
      'FERPA and COPPA compliant infrastructure',
      'Built specifically for K-12 and higher education since 2013',
      'Working with schools, districts, and publishers across the US',
      'AI-first approach: state-of-the-art language models and custom models',
      'Not a tech vendor — an education company',
    ],
  },
  {
    type: 'section',
    title: 'Our Products',
    subtitle: '6 AI-powered tools designed for schools',
  },
  {
    type: 'content',
    title: 'Plagiarism & AI Detection',
    subtitle: 'Your primary line of defense for academic integrity',
    bullets: [
      'Dual scoring: separate AI detection and plagiarism scores',
      'Passage-level flagging — not just an overall percentage',
      'Verified web source matching with premium search APIs',
      'Grade-level and subject-aware calibration',
      'Batch processing for entire class submissions',
      'Exportable PDF reports for admin and counselor review',
      'Coming soon: Writing Style Fingerprinting, Citation Verification, Cross-Submission Comparison',
    ],
  },
  {
    type: 'content',
    title: 'AI Essay Scoring & Feedback',
    subtitle: 'Instant, rubric-aligned feedback that saves teachers hours',
    bullets: [
      'SAT, ACT, AP, College Application, and custom rubrics',
      'Category-by-category breakdown with observations',
      'Specific improvement suggestions with rewrite examples',
      '95% correlation with expert human graders',
      'Coming soon: Writing growth tracking across submissions',
    ],
  },
  {
    type: 'content',
    title: 'AI Voice Tutor',
    subtitle: 'Real-time, voice-based tutoring with interactive whiteboard',
    bullets: [
      'Students speak naturally — AI responds in real time',
      'Interactive whiteboard with graphs, diagrams, and equations',
      'Multi-subject: Math, Science, ELA, and custom topics',
      'Homework photo upload with instant analysis',
      'Socratic method — builds understanding, not dependency',
      'Coming soon: Session recording & replay, Parent/teacher summaries, Group tutoring',
    ],
  },
  {
    type: 'content',
    title: '24/7 AI Homework Helper',
    subtitle: 'Extending the library\'s support function beyond the school day',
    bullets: [
      'Available 24/7 — students get help when they need it most',
      'Socratic method with academic integrity enforcement',
      'Multi-subject: Math, Science, English, History, Languages',
      'Homework photo upload for instant problem recognition',
      'Follow-up suggestions keep students engaged',
      'Coming soon: Practice problem generator, Step-by-step solution playback',
    ],
  },
  {
    type: 'content',
    title: 'Language Learning AI',
    subtitle: 'Conversational practice with an AI language partner',
    bullets: [
      '5 languages: Spanish, French, German, Japanese, Mandarin',
      '10 real-world scenarios with adaptive difficulty (CEFR A1-C2)',
      'AI speech: listen to native pronunciation, speak to practice',
      'Real-time grammar corrections woven naturally into conversation',
      'Vocabulary tracker builds a personal word list',
      'Coming soon: Pronunciation scoring, Grammar lessons, Spaced repetition review',
    ],
  },
  {
    type: 'content',
    title: 'Student Analytics Dashboard',
    subtitle: 'Data-driven visibility across classrooms',
    bullets: [
      'Class overview with subject breakdowns',
      'Individual student profiles with strengths and areas for improvement',
      'AI-powered early warning system for at-risk students',
      'Progress tracking with streaks and mastery indicators',
      'Export to CSV, PDF, or integrate via API',
      'Coming soon: Custom report builder, Predictive analytics, Attendance correlation, Benchmarking',
    ],
  },
  {
    type: 'pricing',
    title: 'Pricing',
    subtitle: 'Flexible tiers designed for districts',
  },
  {
    type: 'content',
    title: 'Why Evelyn Learning?',
    bullets: [
      'Education-first: 300+ SMEs who have been teachers',
      'FERPA & COPPA compliant — built for student data',
      'Passage-level AI detection, not just a score',
      'Socratic method across all tutoring products',
      'Bundle pricing: one vendor, one contract, one integration',
      'District-wide volume discounts (15%+ for SGUSD)',
      'Dedicated implementation and support team',
    ],
  },
  {
    type: 'closing',
    title: 'Let\'s Get Started',
    subtitle: 'Questions & Discussion',
    note: 'Praveen Tyagi\npraveen@evelynlearning.com\n415.513.0895',
  },
];

// ═══════════════════════════════════════════
// ACCESS GATE
// ═══════════════════════════════════════════

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    setTimeout(() => {
      if (code.trim().toUpperCase() === 'GABRIELINO') {
        sessionStorage.setItem('gabrielino_access', 'true');
        onUnlock();
      } else {
        setError(true);
        setChecking(false);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 40%, ${BRAND.accent} 100%)` }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})` }}
        >
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Gabrielino High School</h1>
        <p className="text-white/70 text-sm mb-6">
          Evelyn Learning Product Showcase
        </p>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              placeholder="Enter access code"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-300 text-sm mb-3">Invalid access code. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={checking || !code.trim()}
            className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})` }}
          >
            {checking ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Access Showcase'
            )}
          </button>
        </form>
        <p className="text-white/40 text-xs mt-6">
          Prepared for San Gabriel Unified School District
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PRESENTATION MODE
// ═══════════════════════════════════════════

function PresentationMode() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const slide = SLIDES[currentSlide];

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
              style={{ background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentLight})` }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: BRAND.primary }}>
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl whitespace-pre-line" style={{ color: BRAND.textSecondary }}>
              {slide.subtitle}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: BRAND.gold }}
              />
              <span className="text-sm" style={{ color: BRAND.textMuted }}>
                March 12, 2026
              </span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: BRAND.gold }}
              />
            </div>
          </div>
        );

      case 'section':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ background: BRAND.gold + '20' }}
            >
              <Star className="w-8 h-8" style={{ color: BRAND.gold }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.primary }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-xl" style={{ color: BRAND.textSecondary }}>{slide.subtitle}</p>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="flex flex-col justify-center h-full px-12 md:px-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: BRAND.primary }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-lg mb-6" style={{ color: BRAND.textSecondary }}>{slide.subtitle}</p>
            )}
            {slide.bullets && (
              <ul className="space-y-3 mt-4">
                {slide.bullets.map((bullet, i) => {
                  const isComingSoon = bullet.startsWith('Coming soon:');
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: isComingSoon ? BRAND.gold + '20' : BRAND.accent + '15',
                        }}
                      >
                        {isComingSoon ? (
                          <Zap className="w-3.5 h-3.5" style={{ color: BRAND.gold }} />
                        ) : (
                          <Check className="w-3.5 h-3.5" style={{ color: BRAND.accent }} />
                        )}
                      </div>
                      <span
                        className="text-base md:text-lg"
                        style={{ color: isComingSoon ? BRAND.textMuted : BRAND.textPrimary }}
                      >
                        {bullet}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );

      case 'pricing':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: BRAND.primary }}>
              {slide.title}
            </h2>
            <p className="text-center mb-8" style={{ color: BRAND.textSecondary }}>{slide.subtitle}</p>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className="rounded-xl p-5 flex flex-col"
                  style={{
                    background: tier.highlighted ? BRAND.primary : BRAND.cardBg,
                    border: tier.highlighted ? 'none' : `1px solid ${BRAND.border}`,
                    color: tier.highlighted ? '#fff' : BRAND.textPrimary,
                    boxShadow: tier.highlighted ? '0 8px 30px rgba(27,54,93,0.3)' : 'none',
                  }}
                >
                  {tier.highlighted && (
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: BRAND.gold }}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-bold">${tier.price}</span>
                    <span className="text-sm opacity-70">/ student / year</span>
                  </div>
                  <p className="text-sm opacity-70 mb-3">{tier.savings}</p>
                  <ul className="space-y-1.5 flex-1">
                    {tier.products.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tier.highlighted ? BRAND.gold : BRAND.success }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-4" style={{ color: BRAND.textMuted }}>
              15%+ volume discount for district-wide SGUSD adoption
            </p>
          </div>
        );

      case 'closing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
              style={{ background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})` }}
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: BRAND.primary }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-xl mb-8" style={{ color: BRAND.textSecondary }}>{slide.subtitle}</p>
            )}
            {slide.note && (
              <div
                className="rounded-xl p-6 whitespace-pre-line text-sm"
                style={{ background: BRAND.primary + '08', color: BRAND.textSecondary }}
              >
                {slide.note}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Slide Area */}
      <div className="flex-1 bg-white rounded-t-2xl overflow-hidden relative">
        {renderSlide()}
      </div>

      {/* Navigation Bar */}
      <div
        className="flex items-center justify-between px-6 py-3 rounded-b-2xl"
        style={{ background: BRAND.primary }}
      >
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="transition-all"
              style={{
                width: currentSlide === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: currentSlide === i ? BRAND.gold : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm">
            {currentSlide + 1} / {SLIDES.length}
          </span>
          <button
            onClick={goNext}
            disabled={currentSlide === SLIDES.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PRODUCTS VIEW
// ═══════════════════════════════════════════

function ProductsView() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const demoSectionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDemo && demoSectionRef.current) {
      demoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeDemo]);

  const renderDemo = (productId: string) => {
    switch (productId) {
      case 'plagiarism-detection':
        return (
          <DemoTracker productId="plagiarism-detection" productTitle="Plagiarism & AI Detection">
            <PlagiarismDetector />
          </DemoTracker>
        );
      case 'essay-scoring':
        return (
          <DemoTracker productId="essay-ai" productTitle="AI Essay Scoring">
            <EssayScoringDemo />
          </DemoTracker>
        );
      case 'homework-helper':
        return (
          <DemoTracker productId="homework-bot" productTitle="24/7 AI Homework Helper">
            <HomeworkHelpBot />
          </DemoTracker>
        );
      case 'language-learning':
        return (
          <DemoTracker productId="language-learning" productTitle="Language Learning AI">
            <LanguageLearningDemo />
          </DemoTracker>
        );
      case 'analytics-dashboard':
        return (
          <DemoTracker productId="analytics-dashboard" productTitle="Student Analytics Dashboard">
            <AnalyticsDashboardDemo />
          </DemoTracker>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="py-16 md:py-20 px-6"
        style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 50%, ${BRAND.accent} 100%)` }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})` }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg">Gabrielino High School</div>
              <div className="text-white/60 text-sm">San Gabriel Unified School District</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI-Powered Tools for Academic Excellence
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Six purpose-built education products — from academic integrity to voice tutoring —
            designed for schools and districts. FERPA & COPPA compliant.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { icon: <Shield className="w-4 h-4" />, label: 'FERPA Compliant' },
              { icon: <Users className="w-4 h-4" />, label: '300+ Education Experts' },
              { icon: <Clock className="w-4 h-4" />, label: 'Since 2013' },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
              >
                {badge.icon}
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6" style={{ background: BRAND.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2" style={{ color: BRAND.textPrimary }}>
              Our Products
            </h2>
            <p style={{ color: BRAND.textSecondary }}>
              Click &quot;Try Live Demo&quot; to interact with any product
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-lg"
                style={{
                  background: BRAND.cardBg,
                  border: `1px solid ${BRAND.border}`,
                }}
              >
                {/* Card Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: product.colorLight, color: product.color }}
                    >
                      {product.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight" style={{ color: BRAND.textPrimary }}>
                        {product.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm mb-4" style={{ color: BRAND.textSecondary }}>
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="px-5 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.textMuted }}>
                    Features
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {product.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BRAND.textPrimary }}>
                        <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: BRAND.success }} />
                        <span>{f}</span>
                      </li>
                    ))}
                    {product.features.length > 5 && (
                      <li className="text-xs pl-5" style={{ color: BRAND.textMuted }}>
                        + {product.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  {product.comingSoon.length > 0 && (
                    <>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2 mt-3" style={{ color: BRAND.gold }}>
                        Coming Soon
                      </div>
                      <ul className="space-y-1 mb-3">
                        {product.comingSoon.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: BRAND.textMuted }}>
                            <Zap className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                            <span>{f}</span>
                          </li>
                        ))}
                        {product.comingSoon.length > 3 && (
                          <li className="text-xs pl-5" style={{ color: BRAND.textMuted }}>
                            + {product.comingSoon.length - 3} more planned
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>

                {/* Demo Button */}
                <div className="p-5 pt-2">
                  {product.demoType === 'link' ? (
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition hover:opacity-90"
                      style={{ background: product.color }}
                    >
                      Launch Voice Tutor
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setActiveDemo(activeDemo === product.id ? null : product.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition hover:opacity-90"
                      style={{ background: activeDemo === product.id ? '#718096' : product.color }}
                    >
                      {activeDemo === product.id ? (
                        <>Close Demo <X className="w-4 h-4" /></>
                      ) : (
                        <>Try Live Demo <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Demo Section */}
      {activeDemo && (
        <section ref={demoSectionRef} className="px-6 pb-12 scroll-mt-16" style={{ background: BRAND.bg }}>
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: `2px solid ${PRODUCTS.find(p => p.id === activeDemo)?.color || BRAND.primary}` }}
            >
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{ background: PRODUCTS.find(p => p.id === activeDemo)?.color || BRAND.primary }}
              >
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    Live Demo: {PRODUCTS.find(p => p.id === activeDemo)?.title}
                  </span>
                </div>
                <button
                  onClick={() => setActiveDemo(null)}
                  className="text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white p-4 md:p-6">
                {renderDemo(activeDemo)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2" style={{ color: BRAND.textPrimary }}>
              Pricing
            </h2>
            <p style={{ color: BRAND.textSecondary }}>
              Flexible tiers designed for schools and districts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-6 flex flex-col relative overflow-hidden"
                style={{
                  background: tier.highlighted
                    ? `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`
                    : BRAND.cardBg,
                  border: tier.highlighted ? 'none' : `1px solid ${BRAND.border}`,
                  color: tier.highlighted ? '#fff' : BRAND.textPrimary,
                  boxShadow: tier.highlighted ? '0 12px 40px rgba(27,54,93,0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
                  transform: tier.highlighted ? 'scale(1.03)' : 'none',
                }}
              >
                {tier.highlighted && (
                  <div
                    className="absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-xl"
                    style={{ background: BRAND.gold, color: '#fff' }}
                  >
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p
                  className="text-sm mt-1 mb-4"
                  style={{ color: tier.highlighted ? 'rgba(255,255,255,0.7)' : BRAND.textSecondary }}
                >
                  {tier.description}
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span
                    className="text-sm"
                    style={{ color: tier.highlighted ? 'rgba(255,255,255,0.7)' : BRAND.textMuted }}
                  >
                    / student / year
                  </span>
                </div>
                <p
                  className="text-sm mb-6"
                  style={{ color: tier.highlighted ? BRAND.goldLight : BRAND.gold }}
                >
                  {tier.savings}
                </p>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.products.map((p, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <Check
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: tier.highlighted ? BRAND.gold : BRAND.success }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:praveen@evelynlearning.com?subject=SGUSD%20Pricing%20Inquiry"
                  className="block text-center py-3 rounded-xl font-semibold text-sm transition"
                  style={{
                    background: tier.highlighted ? BRAND.gold : BRAND.primary,
                    color: '#fff',
                  }}
                >
                  Get Quote
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: BRAND.textMuted }}>
              All prices are per student per year. District-wide SGUSD adoption qualifies for 15%+ volume discounts.
              <br />
              Individual product pricing also available.
            </p>
          </div>

          {/* Individual Pricing Reference */}
          <div
            className="mt-8 rounded-xl p-6"
            style={{ background: BRAND.bg, border: `1px solid ${BRAND.border}` }}
          >
            <h3 className="font-semibold text-sm mb-3" style={{ color: BRAND.textPrimary }}>
              Individual Product Pricing
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: p.colorLight, color: p.color }}
                  >
                    {React.cloneElement(p.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                  </div>
                  <span style={{ color: BRAND.textSecondary }}>{p.title.split(' ').slice(0, 3).join(' ')}</span>
                  <span className="font-semibold ml-auto" style={{ color: BRAND.textPrimary }}>
                    {p.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Evelyn Learning */}
      <section
        className="py-16 px-6"
        style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})` }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Why Evelyn Learning?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Users className="w-6 h-6" />, title: 'Education-First', desc: '300+ subject matter experts with teaching backgrounds. We understand classrooms.' },
              { icon: <Shield className="w-6 h-6" />, title: 'FERPA & COPPA Compliant', desc: 'Built specifically for handling student data in institutional settings.' },
              { icon: <Search className="w-6 h-6" />, title: 'Passage-Level Detection', desc: 'We flag specific passages and explain why — not just an overall score.' },
              { icon: <Brain className="w-6 h-6" />, title: 'Socratic Method', desc: 'All tutoring products guide students to discover answers, never give them.' },
              { icon: <Award className="w-6 h-6" />, title: 'One Vendor, One Contract', desc: 'Bundle pricing across 6 products. Simplified procurement for your district.' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Continuous Improvement', desc: 'Active roadmap with features like Writing Fingerprinting and Citation Verification.' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: BRAND.gold + '25', color: BRAND.gold }}
                >
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: BRAND.textPrimary }}>
            Ready to Transform Learning at SGUSD?
          </h2>
          <p className="text-lg mb-8" style={{ color: BRAND.textSecondary }}>
            Let&apos;s discuss which tools make sense for Gabrielino and the broader San Gabriel Unified picture.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:praveen@evelynlearning.com?subject=SGUSD%20-%20Next%20Steps"
              className="px-8 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ background: BRAND.primary }}
            >
              Contact Praveen
            </a>
            <a
              href="tel:4155130895"
              className="px-8 py-3 rounded-xl font-semibold transition"
              style={{ background: BRAND.bg, color: BRAND.primary, border: `1px solid ${BRAND.border}` }}
            >
              Call 415.513.0895
            </a>
          </div>
          <p className="text-sm mt-6" style={{ color: BRAND.textMuted }}>
            Praveen Tyagi, Founder &middot; praveen@evelynlearning.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <div
        className="py-4 px-6 text-center text-xs"
        style={{ background: BRAND.bg, color: BRAND.textMuted }}
      >
        Prepared exclusively for San Gabriel Unified School District &middot; Evelyn Learning &copy; 2026
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

function MainApp() {
  const [activeTab, setActiveTab] = useState<'products' | 'presentation'>('presentation');

  return (
    <div className="min-h-screen" style={{ background: BRAND.bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-16"
        style={{ background: BRAND.primary, borderBottom: `1px solid rgba(255,255,255,0.1)` }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" style={{ color: BRAND.gold }} />
          <span className="font-bold text-white">Evelyn Learning</span>
          <span className="text-white/40 text-sm hidden md:inline">|</span>
          <span className="text-white/60 text-sm hidden md:inline">Gabrielino High School</span>
        </div>

        <div
          className="flex rounded-lg p-1"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <button
            onClick={() => setActiveTab('presentation')}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition"
            style={{
              background: activeTab === 'presentation' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: activeTab === 'presentation' ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
          >
            Presentation
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition"
            style={{
              background: activeTab === 'products' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: activeTab === 'products' ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
          >
            Products
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
          <span
            className="px-2 py-1 rounded"
            style={{ background: BRAND.accent + '30', color: BRAND.accentLight }}
          >
            Built by Evelyn Learning
          </span>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' ? <ProductsView /> : <PresentationMode />}
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE EXPORT
// ═══════════════════════════════════════════

export default function GabrielinoPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useDemoTracker('gabrielino', 'Gabrielino SGUSD Showcase');

  useEffect(() => {
    const hasAccess = sessionStorage.getItem('gabrielino_access');
    if (hasAccess === 'true') {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: BRAND.primary }}
      >
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return <MainApp />;
}
