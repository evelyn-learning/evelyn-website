'use client';

import dynamic from 'next/dynamic';
import { DemoTracker } from '@/components/demos/DemoTracker';

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
  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <DemoTracker productId="plagiarism-detection" productTitle="Plagiarism & AI Detection">
        <PlagiarismDetector />
      </DemoTracker>
    </main>
  );
}
