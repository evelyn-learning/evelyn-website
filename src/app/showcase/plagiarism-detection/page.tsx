'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { DemoTracker } from '@/components/demos/DemoTracker';
import AccessGate from './AccessGate';

const ACCESS_KEY = 'plagiarism_detection_access';

const PlagiarismDetector = dynamic(
  () => import('@/components/plagiarism-detection/PlagiarismDetector'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading Integrity Tool...</p>
        </div>
      </div>
    ),
  }
);

export default function PlagiarismDetectionShowcase() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Canonicalize host before reading sessionStorage. apex (evelynlearning.com)
    // and www are different origins, so an access code entered on apex is
    // invisible after the OAuth callback (which hardcodes www). Redirect early
    // so the gate, the OAuth flow, and any localStorage/sessionStorage all live
    // on the same origin.
    if (window.location.hostname === 'evelynlearning.com') {
      const url = new URL(window.location.href);
      url.hostname = 'www.evelynlearning.com';
      window.location.replace(url.toString());
      return;
    }
    if (sessionStorage.getItem(ACCESS_KEY) === 'verified') {
      setHasAccess(true);
    }
    setCheckingAccess(false);
  }, []);

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <AccessGate
        onAccessGranted={() => {
          sessionStorage.setItem(ACCESS_KEY, 'verified');
          setHasAccess(true);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <DemoTracker productId="plagiarism-detection" productTitle="Plagiarism & AI Detection">
        <PlagiarismDetector />
      </DemoTracker>
    </main>
  );
}
