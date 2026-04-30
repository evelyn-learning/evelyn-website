/**
 * AP Literature — Prose analysis essay strategy.
 *
 * Q2 of AP Lit. Analyze a passage of prose: characterization, point
 * of view, tone, syntax, diction, imagery.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LIT_PROSE_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.lit.prose-analysis-essay.v1',
  title: 'Prose analysis essay (AP Lit Q2)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'aplit.prose-essay',
      description: 'Plan and write an effective prose-analysis essay for AP Lit.',
      standard: 'AP-LIT-ESSAY-2',
    },
  ],
  prerequisites: ['ccss.ela.11-12.rl.4'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame as analyzing HOW the author writes, not just WHAT.',
      script: 'AP Lit Q2 hands you 30-60 lines of prose and asks: how does the author do this? Diction. Tone. Syntax. Point of view. Imagery. Each is a literary tool. Your job: identify the tools, explain their effect.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Five-step strategy + literary tools + scoring.',
      keyIdeas: [
        'STEP 1: READ ACTIVELY. Underline striking word choices, sensory details, repeated images, shifts in tone or perspective.',
        'STEP 2: IDENTIFY THE TASK. Most prompts ask: how does the author CHARACTERIZE someone, REVEAL meaning, develop SETTING, build TENSION?',
        'STEP 3: PICK 2-3 LITERARY TOOLS to analyze. Possibilities:',
        '  DICTION: word choice. Connotations.',
        '  TONE: author\'s attitude.',
        '  SYNTAX: sentence length, structure (short choppy vs long flowing).',
        '  POINT OF VIEW: 1st/3rd person, omniscient/limited, reliable/unreliable narrator.',
        '  IMAGERY: sensory details (sight, sound, smell, touch, taste).',
        '  FIGURATIVE LANGUAGE: simile, metaphor, personification, symbolism.',
        '  CHARACTERIZATION: how the character is revealed (direct vs indirect, action, dialogue, others\' reactions).',
        'STEP 4: PLAN. Intro: thesis stating WHAT the author achieves AND HOW (which tools). 2-3 body paragraphs, one tool each. Conclusion: synthesize.',
        'STEP 5: WRITE. Each body paragraph: claim → SPECIFIC text evidence → analysis (HOW the technique creates the effect).',
        'AVOID: summary of plot, listing without analysis, vague "the author uses imagery to make the reader feel" without specifics.',
        'SCORING: thesis (1 pt) + evidence/commentary (4 pts) + sophistication (1 pt). Total 6.',
      ],
      vocabulary: [
        { term: 'diction', definition: 'an author\'s choice of words.' },
        { term: 'syntax', definition: 'sentence structure and arrangement.' },
        { term: 'characterization', definition: 'how an author reveals a character\'s nature.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paragraph',
      kind: 'worked_example',
      problem: 'Write a sample body paragraph analyzing DICTION in a hypothetical prose passage about a character\'s isolation.',
      steps: [
        'TOPIC SENTENCE (claim): "The author\'s diction emphasizes the character\'s emotional isolation through repeated cold imagery and sterile vocabulary."',
        'EVIDENCE: "Words like \'glacial\', \'sterile\', and \'fluorescent\' (lines 12-15) create a clinical, lifeless atmosphere — the character\'s apartment is described as if it were a morgue."',
        'ANALYSIS: "These word choices do more than describe a setting; they EXTERNALIZE the character\'s inner state. By making the physical surroundings emotionally cold, the author makes the reader FEEL the isolation rather than just be told about it. The character isn\'t simply alone — the very air around her is described as inhospitable to warmth."',
        'TRANSITION: "Beyond word choice, the author\'s syntax reinforces this isolation..."',
        'Notice: SPECIFIC quotations + EXPLANATION of effect, tied to a clear claim.',
      ],
      answer: 'claim about diction → specific quoted evidence → explanation of how it creates the effect',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In analysis, why does "the author uses imagery" without specifics earn LOW scores?',
      expectedAnswer: 'too vague — graders need specific quotes and explanation of HOW the imagery creates the effect',
      responseFormat: 'free',
      hints: [
        'Naming a tool isn\'t analysis.',
        'Analysis explains the effect, supported by text.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-summary-okay',
      kind: 'misconception_check',
      question: 'Is summarizing the plot of the passage helpful in AP Lit Q2?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Filling space with summary.',
          correctsTo: 'No — graders ALREADY know the passage. Summary doesn\'t earn analytical points. Mentioning what happens briefly to set up an analytical point is fine; PURE summary wastes paragraphs.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Identify the prompt task (characterization, meaning, etc.).',
        'Pick 2-3 specific literary tools (diction, syntax, POV, imagery, etc.).',
        'Each body paragraph: claim → quoted evidence → analysis of effect.',
        'Avoid plot summary; explain HOW techniques work.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is "sophisticated" analysis different from "competent" analysis on AP Lit\'s rubric?',
      hint: 'Competent: identifies tools, explains effects clearly. Sophisticated: makes UNEXPECTED connections, addresses tensions/complexities, considers multiple meanings, situates in broader context. The 6th rubric point is rare and rewards deeper insight.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
