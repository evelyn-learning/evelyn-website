/**
 * College Intro — Introduction to AI.
 *
 * Search, learning, supervised vs unsupervised, neural-net intuition,
 * limitations and ethics of modern AI.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_CS_INTRO_AI: LessonPlan = {
  id: 'evelyn.college.intro-ai.v1',
  title: 'Intro to AI — search, learning, neural networks',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'cs',
  topic: 'intro-ai',
  locale: 'en',
  los: [
    {
      id: 'college.intro-ai',
      description: 'Distinguish search-based and learning-based AI; describe neural network basics and current limitations.',
      standard: 'COLLEGE-AI',
    },
  ],
  prerequisites: ['college.cs101'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame AI as two old ideas that recently got dramatically better.',
      script: 'AI isn\'t one thing. It\'s two distinct traditions that finally have enough data and compute to deliver on old promises. Symbolic / search-based AI: solve problems by exploring possibilities (chess, planning). Learning-based AI: extract patterns from examples (vision, language). The boom of the last decade is mostly the second kind getting much, much bigger.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ai',
      kind: 'concept',
      goal: 'Search vs learning + supervised/unsupervised + neural nets + limits.',
      keyIdeas: [
        'SEARCH AI: state-space search (BFS, DFS, A*), game tree (minimax). Knows the rules; explores.',
        'LEARNING AI: parameters fit to training data, then generalize.',
        'SUPERVISED: labeled training data — image → label, sentence → translation. Most production ML.',
        'UNSUPERVISED: only inputs — find clusters or structure. Customer segments, anomaly detection.',
        'REINFORCEMENT: agent acts in environment, receives rewards, optimizes policy. AlphaGo, robotics.',
        'NEURAL NETWORK: layers of weighted sums + nonlinearity. Train via gradient descent: small adjustments to weights to reduce error.',
        'TRANSFORMER: the architecture behind modern LLMs (ChatGPT, Claude). Self-attention lets every token "look at" every other token.',
        'LIMITS: hallucination (confident wrong answers), bias (training data shapes outputs), brittleness (adversarial examples), generalization gap (works on training distribution; fails outside).',
      ],
      vocabulary: [
        { term: 'supervised learning', definition: 'training a model on labeled input/output pairs.' },
        { term: 'gradient descent', definition: 'iteratively adjusting parameters in the direction that reduces the loss function.' },
        { term: 'transformer', definition: 'a neural-network architecture using self-attention; the basis of modern LLMs.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-search-vs-learn',
      kind: 'worked_example',
      problem: 'Tic-tac-toe AI: search-based or learning-based?',
      steps: [
        'Tic-tac-toe has 9 squares, ~5,000 game states. The full game tree fits in memory.',
        'SEARCH: minimax over the entire tree gives provably optimal play. No training data needed.',
        'LEARNING: would need many games of data; would also reach optimal but with overhead.',
        'For tractable rule-based games, SEARCH is the right answer.',
        'For chess (10^120 states), search alone fails — modern engines combine search + learned evaluation (AlphaZero).',
      ],
      answer: 'Search (minimax) — the state space is small enough.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bank wants AI to flag fraudulent transactions, given 5 years of past transactions labeled fraud / not-fraud. Which kind of learning?',
      expectedAnswer: 'supervised learning (binary classification)',
      responseFormat: 'free',
      hints: [
        'They have labels.',
        'They want a yes/no output.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-llm-reasoning',
      kind: 'misconception_check',
      question: 'A student says: "If GPT-4 explains its steps, the explanation must be its actual reasoning." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because it shows them',
          misconception: 'Confusing post-hoc verbalization with internal computation.',
          correctsTo: 'LLMs generate token by token from learned distributions. The "reasoning steps" they output are TEXT that looks like reasoning, often rationalizing an answer the model already committed to. Sometimes the steps actually help (chain-of-thought guides toward right answers). But the visible explanation is a plausible-looking artifact, not a window into the actual computation. Don\'t mistake the description for the substrate.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two traditions: search (rules-known) and learning (rules-implicit).',
        'Supervised needs labels; unsupervised finds structure; RL learns from rewards.',
        'Neural nets fit weights via gradient descent.',
        'Transformers + self-attention power modern LLMs.',
        'AI hallucinates, inherits biases, can be brittle. Treat it as a tool, not an oracle.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does scaling up training data + parameters often produce qualitatively new abilities (so-called emergent behavior)?',
      hint: 'Empirical scaling laws show smooth loss decrease, but capabilities like in-context learning and multi-step reasoning appear at certain scale thresholds. Theory is unsettled — possibly because larger models develop more compositional internal representations. Whether this continues to AGI or hits a wall is the open question of the decade.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
