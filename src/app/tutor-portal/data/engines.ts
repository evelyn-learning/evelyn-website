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

export const voiceEngines: VoiceEngine[] = [
  {
    id: 'standard',
    name: 'Standard',
    description:
      'Turn-by-turn voice pipeline with high-quality speech recognition, AI reasoning, and natural speech synthesis. Optimized for cost-effective tutoring at scale.',
    latency: '~1.5s',
    costPerMinute: 0.06,
    ourCostPerMinute: 0.015,
    features: [
      'High-accuracy speech recognition',
      'Advanced AI reasoning',
      'Natural speech synthesis with 4 voice options',
      'Full whiteboard support (all 19 visual types)',
      '50+ languages supported',
      'Homework photo upload',
      'Session transcript with timestamps',
    ],
    limitations: [
      'Higher response latency (~1.5s between turns)',
      'Does not support mid-sentence interruptions',
    ],
    bestFor:
      'Cost-sensitive deployments, large student populations, structured tutoring sessions',
  },
  {
    id: 'premium',
    name: 'Premium',
    description:
      'Ultra-low-latency voice engine with seamless turn-taking, natural interruptions, and conversational fluency. Feels like talking to a real person.',
    latency: '<400ms',
    costPerMinute: 0.25,
    ourCostPerMinute: 0.35,
    features: [
      'Sub-400ms response latency',
      'Natural interruptions and overlapping speech',
      'Intelligent voice activity detection',
      '8 distinct voice options with emotional expressiveness',
      'Full whiteboard support (all 19 visual types)',
      '50+ languages supported',
      'Homework photo upload',
      'Session transcript with timestamps',
      'Seamless code-switching between languages',
    ],
    limitations: [
      'Higher per-minute cost',
    ],
    bestFor:
      'Premium tutoring experiences, competitive exam prep, students who prefer natural conversation',
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
