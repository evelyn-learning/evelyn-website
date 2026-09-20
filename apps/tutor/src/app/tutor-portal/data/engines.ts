import { pricing } from './pricing';

export interface VoiceEngine {
  id: string;
  name: string;
  description: string;
  latency: string;
  costPerMinute: number; // Partner price USD
  ourCostPerMinute: number; // Internal cost USD
  features: string[];
  limitations: string[];
  bestFor: string;
}

// We ship a single engine at a single per-minute rate (see pricing.ts) — the claude-brain orchestrator. The earlier
// Standard / Premium tier split has been retired: every embed and demo
// surface routes to the same engine. Token `engine` fields from existing
// partners are still accepted for backwards compatibility but no longer
// influence routing (see src/app/tutor-portal/embed/page.tsx).
export const voiceEngines: VoiceEngine[] = [
  {
    id: 'claude-brain',
    name: 'Voice Tutor',
    description:
      'Conversational voice tutor with a structured pedagogy engine. Low-latency turn-taking, full whiteboard (equations, diagrams, tables, problems, concept maps), multi-language support, and per-student adaptive pacing.',
    latency: '<400ms',
    // Single source of truth for the list price is pricing.ts — never hardcode it here
    // (a hardcoded 0.10 outlived the 2026-09-18 price change on the landing card).
    costPerMinute: pricing.perMinuteUsd,
    // Measured 2026-09-17: brain ≈ $0.10–0.12/active-min (LLM only) + ≈ $0.025 voice.
    ourCostPerMinute: 0.125,
    features: [
      'Sub-400ms response latency with natural interruptions',
      'Structured pedagogy engine (Socratic-first, adaptive pacing)',
      'Full whiteboard support (equations, diagrams, tables, problems, concept maps)',
      '50+ languages supported',
      'Homework photo upload',
      'Per-student learning gaps + topic notes (when student_id is supplied)',
      'Session transcript with timestamps',
      'Seamless code-switching between languages',
    ],
    limitations: [],
    bestFor:
      'All deployments — retail, whitelabel, API integrations, and demos.',
  },
];


export function getEngine(id: string): VoiceEngine | undefined {
  return voiceEngines.find((e) => e.id === id);
}
