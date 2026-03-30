'use client';

import { useState, useMemo } from 'react';
import { voiceEngines } from '../../data/engines';

function buildDemoToken(engineId: string) {
  const config = {
    subject: 'cs',
    level: 'ap',
    topic: 'ap-cs-principles',
    student_name: 'Demo Student',
    session_goal: 'practice',
    input_mode: 'voice',
    engine: engineId === 'premium' ? 'premium' : 'standard',
  };
  return btoa(JSON.stringify(config));
}

export function EngineSelector() {
  const [selectedEngine, setSelectedEngine] = useState('standard');
  const engine = voiceEngines.find((e) => e.id === selectedEngine)!;
  const demoToken = useMemo(() => buildDemoToken(selectedEngine), [selectedEngine]);

  return (
    <div>
      {/* Engine toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {voiceEngines.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedEngine(e.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedEngine === e.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">{engine.name}:</span>{' '}
          {engine.latency} response time &middot; ${engine.costPerMinute.toFixed(2)}/min
          {engine.id === 'standard' && (
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Cost-effective
            </span>
          )}
          {engine.id === 'premium' && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              Lowest latency
            </span>
          )}
        </div>
      </div>

      {/* Engine description */}
      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">{engine.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {engine.features.slice(0, 5).map((f) => (
            <span key={f} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600 shadow-sm">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Tutor iframe */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-slate-400">
            tutor.evelynlearning.com/embed
          </span>
          <div className="w-14" />
        </div>
        <iframe
          key={selectedEngine}
          src={`/embed?token=${demoToken}`}
          width="100%"
          height="650"
          allow="microphone; camera"
          className="border-0"
          title={`AI Voice Tutor — ${engine.name} Engine`}
        />
      </div>

      {/* Embed code snippet */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700">Integration code:</p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-green-400">
          <code>{`<iframe
  src="https://tutor.evelynlearning.com/embed?token=YOUR_JWT"
  width="100%" height="700"
  allow="microphone; camera"
  frameborder="0"
></iframe>`}</code>
        </pre>
      </div>
    </div>
  );
}
