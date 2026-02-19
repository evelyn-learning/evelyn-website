'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import AccessGate from './components/AccessGate';
import LoginScreen from './components/LoginScreen';
import AppShell from './components/shared/AppShell';
import { useAFStore } from './store';

// Lazy-loaded role screens
const StudentHome = lazy(() => import('./components/student/StudentHome'));
const LessonPlayer = lazy(() => import('./components/student/LessonPlayer'));
const MathHelper = lazy(() => import('./components/student/MathHelper'));
const PracticeTest = lazy(() => import('./components/student/PracticeTest'));
const HomeworkChat = lazy(() => import('./components/student/HomeworkChat'));
const ParentDashboard = lazy(() => import('./components/parent/ParentDashboard'));
const InstructorDashboard = lazy(() => import('./components/instructor/InstructorDashboard'));
const PresentationMode = lazy(() => import('./components/instructor/PresentationMode'));

function ScreenLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-[#003B71]" />
    </div>
  );
}

function ScreenRouter() {
  const screen = useAFStore((s) => s.screen);

  return (
    <Suspense fallback={<ScreenLoader />}>
      {screen === 'student-home' && <StudentHome />}
      {screen === 'lesson' && <LessonPlayer />}
      {screen === 'math-helper' && <MathHelper />}
      {screen === 'practice-test' && <PracticeTest />}
      {screen === 'homework-chat' && <HomeworkChat />}
      {screen === 'parent-dashboard' && <ParentDashboard />}
      {screen === 'instructor-dashboard' && <InstructorDashboard />}
    </Suspense>
  );
}

export default function AchievementFirstPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const screen = useAFStore((s) => s.screen);
  const { onView, onTry } = useDemoTracker('achievement-first', 'Achievement First');

  useEffect(() => {
    const stored = sessionStorage.getItem('achievement_first_access');
    if (stored === 'verified') {
      setHasAccess(true);
    }
    setCheckingAccess(false);
  }, []);

  useEffect(() => {
    if (hasAccess) onView();
  }, [hasAccess, onView]);

  const handleAccessGranted = () => {
    sessionStorage.setItem('achievement_first_access', 'verified');
    setHasAccess(true);
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-[#003B71]" />
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  if (screen === 'login') {
    return <LoginScreen />;
  }

  // Presentation mode renders full-screen, no AppShell
  if (screen === 'presentation') {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <PresentationMode />
      </Suspense>
    );
  }

  return (
    <div onClick={onTry}>
      <AppShell>
        <ScreenRouter />
      </AppShell>
    </div>
  );
}
