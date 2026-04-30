/**
 * SAT Reading — Literature passages.
 *
 * Strategies for fiction passages: character, tone, structure, inference.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_READING_LITERATURE: LessonPlan = {
  id: 'evelyn.sat.reading.literature.v1',
  title: 'SAT Reading — Literature Passages',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'sat.reading-literature',
      description: 'Apply specific strategies to fiction / literature passages on the SAT Reading section, focusing on character, tone, and inference.',
      standard: 'SAT-READING-LIT',
    },
  ],
  prerequisites: ['sat.reading-evidence'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Literature passages are read differently from non-fiction.',
      script: 'Each SAT Reading section has ONE literature passage. The questions ask about character motivation, tone shifts, and what a phrase IMPLIES (rather than what it literally says). Reading literature on the SAT is closer to reading a short story than skimming an article. Pay attention to who\'s speaking, what they want, and how the narrator feels about them.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Strategy specific to literature passages.',
      keyIdeas: [
        'PRE-READ: glance at the intro blurb. It tells you the title, year, author, and often the basic situation. Anchors your understanding.',
        'CHARACTERS: identify everyone. Mark them in the margin (initials are fine). Track who wants what, who is sympathetic, who is opposed.',
        'TONE: the narrator\'s ATTITUDE. Bitter? Affectionate? Detached? Often shifts within a passage — mark where.',
        'POINT OF VIEW: first person (I, me — character is the narrator) vs third person limited (we follow one character\'s thoughts) vs third person omniscient (narrator knows everyone\'s thoughts). Affects what\'s certain vs inferred.',
        'INFERENCE QUESTIONS: ask what a passage IMPLIES. The answer is supported by the text but not directly stated. Common SAT inference: WHY a character did something, WHAT they meant beyond the literal words.',
        'TONE WORDS: SAT loves vocab like ambivalent (mixed feelings), wistful (sad longing), candid (honest), reverent (respectful), sardonic (mockingly cynical), nostalgic. Learn these — they are answer choices.',
        'LINE-REFERENCE QUESTIONS: when asked about line X, READ FROM 2-3 LINES BEFORE through 2-3 lines AFTER. Context matters.',
        'WATCH FOR FIGURATIVE LANGUAGE: similes, metaphors, hyperbole. Don\'t read them literally. "Her smile was a knife" doesn\'t mean she had a literal knife.',
        'DON\'T BRING OUTSIDE KNOWLEDGE: even if you know more about the period or the book, only the passage matters. SAT answers must be supported by the text given.',
      ],
      vocabulary: [
        { term: 'tone', definition: 'the narrator\'s attitude toward the subject, evident in word choice.' },
        { term: 'inference', definition: 'a conclusion drawn from textual evidence rather than stated directly.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tone',
      kind: 'worked_example',
      problem: 'A passage describes a daughter\'s reaction to her mother\'s strict rules. The narrator says: "Eleanor pretended her mother\'s warnings were the wisdom of a saint, even as she folded the note into her boot." How would you describe Eleanor\'s tone?',
      steps: [
        'Surface action: Eleanor APPEARS to honor her mother (pretends warnings are wisdom).',
        'Hidden action: she\'s defying her mother by hiding a note (presumably from someone the mother forbade).',
        'Tone: not openly rebellious (she\'s "pretending" compliance). Not actually compliant (she\'s defying). It\'s SECRETLY DEFIANT or DECEPTIVE.',
        'Right SAT answer would be something like: "outwardly compliant but inwardly defiant" or "deceptive". WRONG choices: "openly rebellious", "genuinely respectful", "indifferent".',
      ],
      answer: 'Secretly defiant / outwardly compliant; the gap between performance and action signals the tone.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A passage uses the word "ambivalent" to describe a character\'s feelings about leaving home. What does ambivalent mean?',
      expectedAnswer: 'Having mixed or contradictory feelings — both wanting to leave and wanting to stay.',
      responseFormat: 'free',
      hints: [
        'Ambi- means both. -valent suggests strength or value.',
        'Mixed feelings, not one-sided.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-best-answer',
      kind: 'misconception_check',
      question: 'On a SAT literature question, can the right answer have ANY support in the passage even if it\'s not the strongest interpretation?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating partially-supported answers as acceptable.',
          correctsTo: 'No — the SAT wants the BEST answer, not any defensible one. Distractor answers often have a SHRED of textual support but contradict the broader passage. Always check: is THIS interpretation the best fit for the WHOLE passage, not just one line? Strong-but-wrong answers are the hardest distractors.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read the intro blurb. Track characters and their goals.',
        'Inference = supported by the text, not stated. Look for the BEST fit.',
        'Build vocab for tone words: ambivalent, wistful, sardonic, candid.',
        'Don\'t bring outside knowledge — text only.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does the SAT use FIRST-PERSON narrators differently from third-person?',
      hint: 'First-person = limited to that character\'s view. The narrator may be biased, mistaken, or naïve. SAT questions often hinge on the gap between what the narrator believes and what the reader infers. Third-person omniscient is more neutral; questions test reading comprehension. Recognize the POV early — it changes how you read.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
