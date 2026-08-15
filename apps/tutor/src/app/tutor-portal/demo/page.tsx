import type { Metadata } from 'next';
import { EngineSelector } from './components/EngineSelector';

export const metadata: Metadata = {
  title: 'Live Demo',
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Live Demo</h1>
      <p className="mb-2 text-lg text-slate-600">
        Try the AI Voice Tutor. Click the microphone to start a voice session,
        or switch to text mode.
      </p>
      <p className="mb-8 text-sm text-slate-400">
        Your browser will ask for microphone permission. The demo uses the same engine your students
        would experience.
      </p>

      <EngineSelector />
    </div>
  );
}
