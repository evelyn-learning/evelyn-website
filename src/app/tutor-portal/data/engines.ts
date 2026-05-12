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

// We now ship a single engine — the claude-brain orchestrator. The earlier
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
    costPerMinute: 0.25,
    ourCostPerMinute: 0.35,
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

export const textOnlyPricing = {
  costPerMinute: 0.02,
  ourCostPerMinute: 0.005,
  description: 'Text-based chat with full whiteboard support. No voice — students type questions and read responses.',
};

export function getEngine(id: string): VoiceEngine | undefined {
  return voiceEngines.find((e) => e.id === id);
}
