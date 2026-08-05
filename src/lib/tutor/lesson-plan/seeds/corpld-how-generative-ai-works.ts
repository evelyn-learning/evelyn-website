/**
 * Corporate Learning & Development — How Generative AI Actually Works.
 *
 * Short demo lesson for a working professional who uses an AI assistant
 * (ChatGPT, Copilot, etc.) daily and has never seen under the hood.
 * Doubles as a showcase: an AI tutor explaining, honestly and without
 * hand-waving, how AI works. Covers the prompt → tokenization → model →
 * next-token prediction → output pipeline, the context window, and one
 * load-bearing misconception (the "it looks facts up" model). Business
 * framing, no classroom references. Resolves under the existing
 * college / cs / intro-ai taxonomy cell; the corporate label is applied
 * via the demo tile's display text.
 */

import type { LessonPlan } from '../types';

export const SEED_CORPLD_HOW_GENERATIVE_AI_WORKS: LessonPlan = {
  id: 'evelyn.college.corpld.how-generative-ai-works.v1',
  title: 'How Generative AI Actually Works',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'cs',
  topic: 'intro-ai',
  locale: 'en',
  los: [
    {
      id: 'college.corpld.genai-mechanics',
      description: 'Explain how a generative AI language model produces a response: tokenization, next-token prediction, and the role of the context window; and identify why these mechanisms produce fluent but sometimes inaccurate output.',
      standard: 'COLLEGE-AI-GENAI-MECHANICS',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the lesson around a moment of daily habit turned into curiosity: what actually happens between hitting enter and the answer appearing.',
      script: 'You use an AI assistant every day — maybe ChatGPT, maybe Copilot. You type a question, hit enter, and words start appearing. What actually happens in between? By the end of this, you\'ll know the real mechanism — not a metaphor, the actual pipeline — and why it explains both why these tools are so fluent and why they sometimes confidently get things wrong.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pipeline',
      kind: 'concept',
      goal: 'Walk the pipeline step by step: prompt, tokenization, model, next-token prediction, output.',
      keyIdeas: [
        'PROMPT: the text you type in — a question, instruction, or request.',
        'TOKENIZATION: before the model can process your prompt, it\'s broken into TOKENS — small chunks, roughly words or pieces of words. Common short words often stay whole ("the", "cat"); longer or less common words get split into pieces. Example: "unbelievable" might become three tokens — "un", "believ", "able".',
        'MODEL: a neural network with billions of internal parameters (weights), trained on massive amounts of text. Training is the process that adjusted those weights so the model\'s predictions match patterns found in real text.',
        'NEXT-TOKEN PREDICTION: the model doesn\'t generate a whole answer in one shot. It predicts ONE token at a time — the most likely next token given everything so far — appends it, and repeats.',
        'OUTPUT: each predicted token is converted back to text and streamed to you as it\'s produced — that\'s the word-by-word appearance you see on screen.',
      ],
      vocabulary: [
        { term: 'token', definition: 'a chunk of text (roughly a word or word-piece) that a language model processes as one unit.' },
        { term: 'tokenization', definition: 'the step that splits raw text into tokens before the model can process it.' },
        { term: 'parameters (weights)', definition: 'the internal numeric values a neural network adjusts during training to capture patterns in its data.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 2.5,
    },
    {
      id: 'concept-next-token-prediction',
      kind: 'concept',
      goal: 'Explain next-token prediction as the core generation mechanism with a concrete probability example, and explain why repeating it makes the model fluent but not a factual database.',
      keyIdeas: [
        'For the partial sentence "The cat sat on the ___", the model computes a PROBABILITY for every possible next token, based on patterns in its training data — it isn\'t "looking up" the answer.',
        'Illustrative shape of that distribution (rough, for intuition — not a measured statistic from any specific system): "mat" much likelier than "floor", "roof" far less likely, "moon" barely likely at all — unusual but not impossible phrasing.',
        'The model then samples from that distribution — usually favoring high-probability tokens, sometimes adding a bit of randomness so answers aren\'t identical every time.',
        'GENERATION = repeating next-token prediction: predict one token, append it, predict the next one based on the now-longer sequence, and so on until a stopping point.',
        'This is why the model is fluent: it is extremely good at "what plausibly comes next" because that is the exact task it was trained on, at massive scale.',
        'It is NOT a database lookup — there is no step where it retrieves a stored fact and checks it. It generates the statistically likely continuation, which is usually true (because true statements are heavily represented in training text), but "likely" and "true" are not the same guarantee.',
      ],
      vocabulary: [
        { term: 'probability distribution', definition: 'the set of likelihood scores the model assigns across all possible next tokens.' },
        { term: 'sampling', definition: 'the step where the model picks an actual next token from the probability distribution, rather than always taking the single highest-scoring one.' },
      ],
      suggestedTools: ['show_stats', 'show_diagram'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-predict',
      kind: 'try_yourself',
      problem: 'Before the reveal — for "The cat sat on the ___", rank these four completions by how likely you\'d guess the model ranks them: mat, floor, roof, moon.',
      expectedAnswer: 'mat (most likely), then floor (somewhat likely), then roof (unlikely), then moon (least likely / most unusual)',
      responseFormat: 'free',
      hints: ['Think about which of these completions shows up most often in ordinary writing.', '"The cat sat on the mat" is a famous, extremely common phrase in English.'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-context-window',
      kind: 'concept',
      goal: 'Explain the context window as a fixed-size box the model can "see," and why prompt detail and conversation length both matter because of it.',
      keyIdeas: [
        'CONTEXT WINDOW: the model can only consider a limited number of tokens at once — your prompt plus, in a chat, the recent conversation history. Think of it as a box of fixed size.',
        'A vague prompt gives the model very little to narrow its predictions with, so it falls back on the most generic, average continuation. A detailed, specific prompt narrows the probability space toward what you actually want.',
        'In a long conversation, once the window fills up, the earliest messages get dropped or compressed to make room for new ones — which is why an assistant can seem to "forget" something you said much earlier in a long chat.',
      ],
      vocabulary: [
        { term: 'context window', definition: 'the fixed-size span of recent tokens (prompt plus conversation history) the model can use when predicting the next token.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1.5,
    },
    {
      id: 'misconception-database-lookup',
      kind: 'misconception_check',
      question: 'A coworker says: "When I ask it a factual question, it must be looking that fact up somewhere and reading it back to me." Is that how it works?',
      commonErrors: [
        {
          answer: 'Yes, it retrieves the fact from a database.',
          misconception: 'Treating the model as a search engine or database that stores and retrieves facts.',
          correctsTo: 'By default, the base model has no lookup step. It generates the most statistically likely continuation of the text, based on patterns learned during training — it isn\'t consulting a stored answer key. Facts that are extremely common in training text (like "Paris is the capital of France") get generated correctly almost every time, because that pattern is everywhere in the data. But because there\'s no verification step, the model can generate a fluent, confident-sounding statement that is simply wrong — this is called a hallucination. Some AI products add a separate retrieval step on top — searching documents or the web and feeding the results back into the prompt — but that\'s an extra system layered on, not something the core generation mechanism does on its own.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pipeline: prompt → tokenization (text broken into tokens) → model → next-token prediction, repeated → output streamed back to you.',
        'The model predicts one likely next token at a time based on patterns learned from training data — it does not look answers up in a database.',
        'Being fluent (good at "what comes next") is a different skill from being factually correct — the two usually align but can diverge.',
        'The context window is a fixed-size "view" of the conversation — detailed prompts use it better, and very long conversations can push early details out.',
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Given everything we just covered, why is hallucination described as a natural consequence of how the model works, rather than a bug someone forgot to fix?',
      hint: 'The model has exactly one operation: predict the most statistically plausible next token given everything so far. That operation has no separate "check this against reality" step built into it. When the plausible continuation happens to match reality, that\'s a correct answer; when it doesn\'t, it\'s a hallucination — and the mechanism can\'t tell the difference between the two cases, because it was never designed to verify, only to continue. That\'s why careful prompting, retrieval systems, and human review remain necessary — none of them change the underlying mechanism.',
      estimatedMinutes: 0.5,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
