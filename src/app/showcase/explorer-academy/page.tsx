'use client';

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import { DemoTrackingProvider } from '@/components/demos/DemoTrackingContext';
import AccessGate from './components/AccessGate';
import LoginScreen from './components/LoginScreen';
import AppShell from './components/shared/AppShell';
import { useExplorerStore } from './store';

// Lazy-loaded role screens
const StudentHome = lazy(() => import('./components/student/StudentHome'));
const LessonPlayer = lazy(() => import('./components/student/LessonPlayer'));
const AdaptiveLessonPlayer = lazy(() => import('./components/student/AdaptiveLessonPlayer'));
const MathHelper = lazy(() => import('./components/student/MathHelper'));
const PracticeTest = lazy(() => import('./components/student/PracticeTest'));
const HomeworkChat = lazy(() => import('./components/student/HomeworkChat'));
const ParentDashboard = lazy(() => import('./components/parent/ParentDashboard'));
const InstructorDashboard = lazy(() => import('./components/instructor/InstructorDashboard'));

function ScreenLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600" />
    </div>
  );
}

function ScreenRouter() {
  const screen = useExplorerStore((s) => s.screen);

  return (
    <Suspense fallback={<ScreenLoader />}>
      {screen === 'student-home' && <StudentHome />}
      {screen === 'lesson' && <LessonPlayer />}
      {screen === 'adaptive-lesson' && <AdaptiveLessonPlayer />}
      {screen === 'math-helper' && <MathHelper />}
      {screen === 'practice-test' && <PracticeTest />}
      {screen === 'homework-chat' && <HomeworkChat />}
      {screen === 'parent-dashboard' && <ParentDashboard />}
      {screen === 'instructor-dashboard' && <InstructorDashboard />}
    </Suspense>
  );
}

export default function ExplorerAcademyPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const screen = useExplorerStore((s) => s.screen);
  const { onView, onTry, trackInteraction } = useDemoTracker('explorer-academy', 'Explorer Academy');

  // Track screen navigation
  const prevScreenRef = useRef(screen);
  useEffect(() => {
    if (screen !== prevScreenRef.current) {
      trackInteraction('navigation', screen, { from: prevScreenRef.current });
      prevScreenRef.current = screen;
    }
  }, [screen, trackInteraction]);

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

  const handleAccessGranted = () => {
    sessionStorage.setItem('explorer_academy_access', 'verified');
    setHasAccess(true);
  };

  // Loading check
  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  // Access gate
  if (!hasAccess) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  // Login screen (no AppShell wrapper)
  if (screen === 'login') {
    return <LoginScreen />;
  }

  // Authenticated platform
  return (
    <DemoTrackingProvider trackInteraction={trackInteraction}>
      <div onClick={onTry}>
        <AppShell>
          <ScreenRouter />
        </AppShell>
      </div>
    </DemoTrackingProvider>
  );
}
