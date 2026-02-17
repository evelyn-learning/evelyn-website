'use client';

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import AccessGate from './components/AccessGate';
import HeroSection from './components/HeroSection';

const MathSolver = lazy(() => import('./components/MathSolver'));
const PracticeTestGenerator = lazy(() => import('./components/PracticeTestGenerator'));
const HomeworkHelper = lazy(() => import('./components/HomeworkHelper'));
const AdaptiveLearningPath = lazy(() => import('./components/AdaptiveLearningPath'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const WhyAI = lazy(() => import('./components/WhyAI'));
const Pricing = lazy(() => import('./components/Pricing'));
const NextSteps = lazy(() => import('./components/NextSteps'));

const NAV_GROUPS = [
  {
    label: 'Platform Demos',
    items: [
      { id: 'math-solver', label: 'Math Solver' },
      { id: 'practice-tests', label: 'Test Generator' },
      { id: 'homework-helper', label: 'Homework Helper' },
      { id: 'learning-path', label: 'Adaptive Learning' },
      { id: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Partnership',
    items: [
      { id: 'why-ai', label: 'Why AI?' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'next-steps', label: 'Next Steps' },
    ],
  },
];

const ALL_SECTIONS = NAV_GROUPS.flatMap((g) => g.items);

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600" />
    </div>
  );
}

export default function ExplorerAcademyPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeSection, setActiveSection] = useState('math-solver');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { onView, onTry } = useDemoTracker('explorer-academy', 'Explorer Academy');

  useEffect(() => {
    const stored = sessionStorage.getItem('explorer_academy_access');
    if (stored === 'verified') {
      setHasAccess(true);
    }
    setCheckingAccess(false);
  }, []);

  // Track view once access is granted
  useEffect(() => {
    if (hasAccess) onView();
  }, [hasAccess, onView]);

  useEffect(() => {
    if (!hasAccess) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    const timer = setTimeout(() => {
      ALL_SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observerRef.current?.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [hasAccess]);

  const handleAccessGranted = () => {
    sessionStorage.setItem('explorer_academy_access', 'verified');
    setHasAccess(true);
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" onClick={onTry}>
      <HeroSection />

      {/* Sticky Navigation — grouped */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {NAV_GROUPS.map((group, gi) => (
              <React.Fragment key={group.label}>
                {gi > 0 && (
                  <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
                )}
                {group.items.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeSection === id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* All Sections */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {/* ─── Platform Demos ─────────────────────────────── */}
        <section id="math-solver">
          <Suspense fallback={<SectionLoader />}>
            <MathSolver />
          </Suspense>
        </section>

        <section id="practice-tests">
          <Suspense fallback={<SectionLoader />}>
            <PracticeTestGenerator />
          </Suspense>
        </section>

        <section id="homework-helper">
          <Suspense fallback={<SectionLoader />}>
            <HomeworkHelper />
          </Suspense>
        </section>

        <section id="learning-path">
          <Suspense fallback={<SectionLoader />}>
            <AdaptiveLearningPath />
          </Suspense>
        </section>

        <section id="dashboard">
          <Suspense fallback={<SectionLoader />}>
            <Dashboard />
          </Suspense>
        </section>

        {/* ─── Partnership Sections ───────────────────────── */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-1">Partnership</p>
            <h2 className="text-3xl font-bold text-gray-900">Let&apos;s Build This Together</h2>
          </div>

          <div className="space-y-16">
            <section id="why-ai">
              <Suspense fallback={<SectionLoader />}>
                <WhyAI />
              </Suspense>
            </section>

            <section id="pricing">
              <Suspense fallback={<SectionLoader />}>
                <Pricing />
              </Suspense>
            </section>

            <section id="next-steps">
              <Suspense fallback={<SectionLoader />}>
                <NextSteps />
              </Suspense>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="text-sm">
            This is a preview of your custom learning platform. All tools are white-labeled, hosted, and managed by{' '}
            <span className="text-white font-semibold">Evelyn Learning</span>.
          </p>
          <p className="text-sm text-gray-400">
            Contact:{' '}
            <a href="mailto:contact@evelynlearning.com" className="text-purple-400 hover:text-purple-300 underline">
              contact@evelynlearning.com
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Evelyn Learning. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
