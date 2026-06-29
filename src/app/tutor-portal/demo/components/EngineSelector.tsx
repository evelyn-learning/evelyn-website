'use client';

import { useMemo } from 'react';
import { voiceEngines } from '../../data/engines';

function buildDemoToken() {
  const config = {
    subject: 'cs',
    level: 'ap',
    topic: 'ap-cs-principles',
    // Boot a real seed lesson plan so the tutor starts teaching it instead of
    // asking "what are we working on?" — the embed threads curriculum_module →
    // lessonPlanId → VoiceTutorRealtime, which fetches the plan by id.
    curriculum_module: 'evelyn.ap.csp.algorithms-abstraction.v1',
    student_name: 'Alex',
    session_goal: 'practice',
    input_mode: 'voice',
    engine: 'claude-brain',
  };
  return btoa(JSON.stringify(config));
}

export function EngineSelector() {
  const engine = voiceEngines[0]!;
  const demoToken = useMemo(() => buildDemoToken(), []);

  return (
    <div>
      {/* Engine description */}
      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="font-medium text-slate-700">{engine.name}</span>
          <span>{engine.latency} response time</span>
          <span>·</span>
          <span>${engine.costPerMinute.toFixed(2)}/min</span>
        </div>
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
          src={`/embed?token=${demoToken}`}
          width="100%"
          height="760"
          allow="microphone; camera; autoplay"
          className="border-0"
          title={`AI Voice Tutor — ${engine.name}`}
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
