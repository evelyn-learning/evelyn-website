/**
 * G6 — ELA: Citing textual evidence.
 *
 * The shift from "I think" to "The text shows...". Quote or
 * paraphrase specific lines to support a claim. Three formats:
 * direct quote, paraphrase, summary — each with citation. The
 * sandwich structure: claim → evidence → explanation. Foundation
 * for every essay through college.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_ELA_TEXTUAL_EVIDENCE: LessonPlan = {
  id: 'evelyn.g6.ela.textual-evidence.v1',
  title: 'Citing Textual Evidence',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'ela',
  topic: 'reading-comprehension',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.6.1',
      description: 'Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
      standard: 'CCSS.ELA-LITERACY.RL.6.1',
    },
  ],
  prerequisites: ['ccss.ela.rl.5.1'],
  followUps: ['ccss.ela.rl.7.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame text evidence as the proof in a courtroom-style argument.',
      script: 'In court, a lawyer can\'t just say "my client is innocent." They have to point to evidence — a fingerprint, a witness, a video. Same in writing. You can\'t just say "the main character is brave." You have to point to lines in the text that PROVE it. That\'s textual evidence.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-formats',
      kind: 'concept',
      goal: 'Three evidence formats + the claim-evidence-explanation sandwich.',
      keyIdeas: [
        'TEXTUAL EVIDENCE = specific words, lines, or details from the text that back up your claim.',
        'Three ways to use evidence:',
        '  1) DIRECT QUOTE: copy the exact words inside quotation marks. Use when the wording itself matters.',
        '  2) PARAPHRASE: restate a passage in your own words. Use when the idea matters but the original phrasing is too long or technical.',
        '  3) SUMMARY: capture the gist of a longer section in much fewer words.',
        'Always CITE — tell the reader where the evidence came from. ("On page 12, the narrator says...")',
        'CLAIM-EVIDENCE-EXPLANATION sandwich (CEE):',
        '  CLAIM: what you\'re arguing (1 sentence).',
        '  EVIDENCE: a quote or paraphrase from the text.',
        '  EXPLANATION: how the evidence proves the claim. THIS IS THE MOST OFTEN SKIPPED — and the most important.',
        'Strong evidence is SPECIFIC. "The text shows the character is brave" is weak. "When the narrator says \'she stepped between the bear and her sister\', it shows the character will face danger to protect others" is strong.',
      ],
      vocabulary: [
        { term: 'textual evidence', definition: 'specific words from the text that support your claim.' },
        { term: 'paraphrase', definition: 'restate the text in your own words.' },
        { term: 'cite', definition: 'point to where the evidence is found.' },
      ],
      suggestedTools: ['show_concept_map', 'show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cee',
      kind: 'worked_example',
      problem: 'Claim: "Sam is a determined character." Build a CEE paragraph using the line: "Even after twenty failed attempts, Sam tried the puzzle again."',
      steps: [
        'CLAIM: "Sam is a determined character."',
        'EVIDENCE (direct quote): "The text says, \'Even after twenty failed attempts, Sam tried the puzzle again.\'"',
        'EXPLANATION: "This shows Sam doesn\'t give up easily — most people would have stopped after a few tries. The detail of \'twenty\' makes the determination concrete."',
        'Together: "Sam is a determined character. The text says, \'Even after twenty failed attempts, Sam tried the puzzle again.\' This shows Sam doesn\'t give up easily — most people would have stopped after a few tries. The detail of \'twenty\' makes the determination concrete."',
      ],
      answer: 'See CEE paragraph above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Claim: "Lia is a careful planner." Choose better evidence: (a) "Lia is the main character." (b) "Lia made a list of every supply before leaving."',
      expectedAnswer: 'b',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(a) — establishes who she is' },
        { id: 'b', text: '(b) — shows specific careful behavior', correct: true },
      ],
      hints: [
        'Which one ACTS OUT the claim "careful planner"?',
        'Making a list before leaving is careful planning. Being the main character isn\'t.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-explanation',
      kind: 'misconception_check',
      question: 'Asha writes: "The character is kind. The text says, \'She helped her neighbor carry groceries.\' [end of paragraph]" What\'s missing?',
      commonErrors: [
        {
          answer: 'nothing — the quote speaks for itself',
          misconception: 'Skipping the explanation, expecting the reader to make the connection.',
          correctsTo: 'The EXPLANATION is missing. Asha\'s quote is good evidence, but she needs to spell out HOW it proves the character is kind: "Helping a neighbor with groceries — without being asked — shows the character does small acts of kindness for others." Quotes don\'t speak for themselves; YOU make them speak.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three evidence formats: direct quote, paraphrase, summary.',
        'Always cite — tell the reader where it came from.',
        'CEE sandwich: Claim, Evidence, Explanation.',
        'Explanation is the MOST often skipped — and most important.',
        'Specific evidence beats general references.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a story you\'ve read recently. Write one CEE paragraph claiming a trait of one character.',
      hint: 'Find a line that shows the trait through ACTION or DIALOGUE — not the narrator just saying so.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
