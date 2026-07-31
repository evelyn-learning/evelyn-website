/**
 * HS English — Reading Literature: Direct & Indirect Characterization.
 *
 * How authors build people out of evidence (CCSS RL.9-10.1, RL.9-10.3):
 * told-vs-shown, the STEAL toolkit, and trait inferences that cite the
 * line. All excerpts are short ORIGINAL prose written for this lesson —
 * no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U6_CHARACTERIZATION: LessonPlan = {
  id: 'evelyn.hs.engl.characterization.v1',
  title: 'Direct & Indirect Characterization',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.characterization',
      standard: 'ENGL-6.2',
      description:
        'Distinguish direct from indirect characterization and infer character traits and motives from speech, thoughts, actions, and effects on others, citing the textual evidence that supports the inference (CCSS RL.9-10.1, RL.9-10.3).',
    },
  ],
  prerequisites: ['engl.plot-and-conflict'],
  followUps: ['engl.narrative-point-of-view'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Students already read people from tiny signals daily — name that skill and point it at literature.',
      script:
        'You already do this every day. A friend replies to your paragraph-long message with "fine." — and from one word plus a period you infer a whole mood. Authors count on exactly that skill. Instead of announcing "Rosa was generous," a writer shows Rosa sliding her sandwich across the table without breaking conversation, and trusts you to do the math. Today we make that mind-reading deliberate: what counts as evidence about a character, and how to defend the conclusion you draw.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-steal',
      kind: 'concept',
      goal: 'Direct vs indirect characterization, the STEAL evidence categories, and the cite-your-line discipline.',
      keyIdeas: [
        'DIRECT CHARACTERIZATION — the narrator TELLS you a trait outright: "Old Mr. Herrera was a generous man." Fast, clear, and rare in strong fiction, because being told a fact is less convincing than discovering it.',
        'INDIRECT CHARACTERIZATION — the author SHOWS evidence and you infer the trait. Five places to look, remembered as STEAL: Speech, Thoughts, Effect on others, Actions, Looks.',
        'SPEECH — not just WHAT a character says but HOW: word choice, interruptions, what they avoid saying. A character who answers every question with one word is telling you something.',
        'ACTIONS OUTWEIGH WORDS — when speech and action conflict, trust the action: a character who says "I do not care about the award" while polishing the trophy case cares. Contradiction between STEAL categories is usually the author waving a flag.',
        'EFFECT ON OTHERS — how people react around a character is evidence too: if the room goes quiet when Dana enters, the author has characterized Dana without her doing anything.',
        'CITE THE LINE — a trait claim is only as good as its evidence. The move is always "trait + because + the specific words": not "Theo is nervous" but "Theo is nervous — he folds the same napkin three times while insisting he is fine."',
        'TRAITS VS EMOTIONS — a trait is a stable pattern (patient, calculating, loyal); an emotion is a moment (startled, annoyed). One flash of anger does not make a character "an angry person" — look for repetition before claiming a trait.',
      ],
      vocabulary: [
        { term: 'direct characterization', definition: 'the narrator explicitly states a character trait.' },
        { term: 'indirect characterization', definition: 'the author reveals a trait through speech, thoughts, effects on others, actions, or looks, leaving the inference to the reader.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-infer-trait',
      kind: 'worked_example',
      problem:
        'Read this excerpt and infer a character trait, citing the evidence: "Marisol answered before the teacher finished the question, then glanced around the room to see who had noticed."',
      steps: [
        'Sort the evidence into STEAL: answering early is an ACTION; glancing around for reactions points to the EFFECT she hopes to have on others.',
        'Interpret the action: answering before the question ends signals eagerness and confidence in her knowledge — maybe impatience.',
        'Interpret the glance: checking who noticed shows the answer was partly a performance; she wants recognition, not just correctness.',
        'Combine into a trait claim with evidence: Marisol craves recognition — she answers before the question is even finished and immediately checks who noticed.',
      ],
      answer:
        'Marisol is eager for recognition — evidence: she answers early (action) and scans the room for a reaction (intended effect on others)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-words-vs-actions',
      kind: 'worked_example',
      problem:
        'A student reads this excerpt and concludes Devon is selfless: "Take the last seat, I insist," Devon said, already lowering himself into it. What did the student miss?',
      steps: [
        'Separate the STEAL categories: Devon SPEECH = generous offer ("Take the last seat, I insist"). Devon ACTION = taking the seat himself, before the offer can even be accepted.',
        'The student built the trait claim from speech alone — the single least reliable STEAL category, because characters (like people) say things for effect.',
        'When categories conflict, actions outweigh words: the action shows the offer was empty politeness.',
        'Revised claim: Devon performs generosity he does not practice — the gap between his words and his action is the characterization. Authors engineer such gaps deliberately; finding them is close reading, not cynicism.',
      ],
      answer:
        'The action contradicts the speech: Devon takes the seat while offering it, so the excerpt characterizes him as insincere, not selfless',
      estimatedMinutes: 3,
    },
    {
      id: 'try-infer-action',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Nadia kept her own swimming medals in a drawer, but her little sister\'s crayon drawing hung framed above her desk." What does this indirect characterization suggest about Nadia?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'She values her sister\'s pride more than her own achievements', correct: true },
        { id: 'b', text: 'She is ashamed of losing her recent swim meets' },
        { id: 'c', text: 'She is too disorganized to display her medals properly' },
        { id: 'd', text: 'She dislikes swimming and plans to quit the team' },
      ],
      expectedAnswer: 'She values her sister\'s pride more than her own achievements',
      hints: [
        'Compare what she hides with what she displays — the CONTRAST is the evidence.',
        'Medals (her glory) go in a drawer; the sister\'s drawing gets a frame and a wall. What does she treasure?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-direct-vs-indirect',
      kind: 'try_yourself',
      problem: 'Which option is an example of DIRECT characterization?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Priya rechecked the lock three times before leaving.' },
        { id: 'b', text: 'Priya was a cautious, methodical girl.', correct: true },
        { id: 'c', text: '"Did you double-check the address?" Priya asked again.' },
        { id: 'd', text: 'The others rolled their eyes whenever Priya pulled out her checklist.' },
      ],
      expectedAnswer: 'Priya was a cautious, methodical girl.',
      hints: [
        'Direct characterization TELLS the trait in so many words; indirect SHOWS evidence for you to interpret.',
        'Three options show actions, speech, or reactions — one simply states the trait.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-conflict-signal',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "I am not nervous," Theo said, folding the same napkin for the third time. Which statement best interprets the characterization?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Theo is calm — he says so directly' },
        { id: 'b', text: 'His action contradicts his words, showing he is nervous but hiding it', correct: true },
        { id: 'c', text: 'The napkin detail is setting description, not characterization' },
        { id: 'd', text: 'The narrator directly characterizes Theo as dishonest' },
      ],
      expectedAnswer: 'His action contradicts his words, showing he is nervous but hiding it',
      hints: [
        'Two STEAL categories appear: speech and action. Do they agree?',
        'When words and actions conflict, trust the actions — the repeated fidgeting undercuts the denial.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-trust-speech',
      kind: 'misconception_check',
      question:
        'A student says: "The character literally states she forgives her brother, so the author is telling us she is forgiving. That is direct characterization, and it settles the question." What went wrong?',
      commonErrors: [
        {
          answer: 'A character stating something about herself is direct characterization and must be true',
          misconception: 'Treating a character\'s own words as the narrator\'s direct characterization — and as automatically reliable.',
          correctsTo:
            'Direct characterization comes from the NARRATOR. A character\'s claims about herself are speech — indirect evidence that can be sincere, mistaken, or strategic. Check it against her actions and thoughts before believing it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Direct = the narrator tells the trait; indirect = the author shows evidence and you infer it.',
        'STEAL: Speech, Thoughts, Effect on others, Actions, Looks — the five places trait evidence lives.',
        'When words and actions conflict, actions win — and the contradiction itself is usually the point.',
        'Every trait claim needs a cited line: trait + because + the specific words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Direct & Indirect Characterization' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
