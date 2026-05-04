/**
 * Grades 9-12 ELA — Close Reading & Textual Analysis.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_CLOSE_READING: LessonPlan = {
  id: 'evelyn.g912.ela.close-reading.v1',
  title: 'Grades 9-12 ELA — Close Reading',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.close-reading',
      description: 'Apply close-reading techniques to literary passages: notice patterns of language, structure, imagery, and ambiguity; build interpretation from textual evidence.',
      standard: 'CCSS.ELA-LITERACY.RL.9-10.1',
    },
  ],
  prerequisites: [],
  followUps: ['g912.ela.literary-devices'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Close reading is the difference between reading what a passage says and reading what it MEANS.',
      script: 'A skilled reader of "The dog walked into the room" can analyse rhythm, word choice, point of view, and what was OMITTED. That same reader understands "The dog skulked into the room" as ENTIRELY different — even though plot is identical. Today we drill the close-reading habits that unlock literary analysis.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-close-reading',
      kind: 'concept',
      goal: 'Close-reading framework + annotation technique + interpretive habit.',
      keyIdeas: [
        'CLOSE READING: examining a passage carefully for its language, structure, and underlying meaning. Move beyond what happens to HOW it is told.',
        'ANNOTATION: marking up the text with reactions, questions, observations. Underline striking phrases. Note repetition. Mark patterns.',
        'NOTICE: word choice (diction), sentence length and rhythm (syntax), repetition, imagery, silences/omissions, shifts in tone or POV.',
        'PATTERNS: repeated images, motifs, words. Authors often signal what matters through repetition.',
        'WHAT IS LEFT OUT: silences and absences are evidence too. A character who never speaks tells you something.',
        'ASK QUESTIONS: Why this word, not another? Why this image now? Why this point of view? What is the EFFECT on the reader?',
        'INTERPRETATION builds from EVIDENCE. Don\'t just have a feeling about the passage — show what in the text creates the feeling.',
        'AMBIGUITY: literary texts are often deliberately ambiguous. Multiple interpretations can be valid IF supported by the text.',
        'CITATION: any close-reading claim should be backed by specific quotes.',
      ],
      vocabulary: [
        { term: 'close reading', definition: 'detailed, careful examination of a text\'s language, structure, and meaning.' },
        { term: 'diction', definition: 'word choice; key element of close reading.' },
        { term: 'syntax', definition: 'sentence structure and arrangement.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-close',
      kind: 'worked_example',
      problem: 'Close-read the sentence: "She had survived, again, the long winter."',
      steps: [
        'DICTION: "survived" is strong — implies she might NOT have. The word elevates the experience to something dangerous.',
        'PUNCTUATION: the comma-isolated "again" stands out. It interrupts and emphasises.',
        '"Again" implies REPETITION — this isn\'t her first long winter. Suggests endurance over time.',
        '"The long winter" — definite article "the" treats it as a known, specific experience. Reader might feel they should know what winter this is.',
        'SYNTAX: short sentence, three commas\' worth of pauses. The pauses force the reader to dwell on each piece.',
        'EFFECT: a sense of weariness and survival. The reader feels her exhaustion through the rhythm AND the loaded vocabulary.',
        'INTERPRETIVE CLAIM: "The author isolates \'again\' between commas to make the repetition almost a sigh — emphasising that survival has become routine, even ritualised."',
      ],
      answer: 'Detailed close-reading observations leading to interpretive claim.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does the writer\'s choice to use a single short sentence after a long one create? Example: "The party went on for hours, the music swelling and dipping like waves, the laughter rising over conversation. Then it ended."',
      expectedAnswer: 'The contrast between the long, rich first sentence and the abrupt second creates a sudden, almost startling sense of finality. The brevity makes the ending feel cold or sudden against the warmth of the first sentence.',
      responseFormat: 'free',
      hints: [
        'Notice the pacing change.',
        'What does abruptness feel like after warmth?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-feel-no-evidence',
      kind: 'misconception_check',
      question: 'A student writes "this passage feels sad" without citing any text. Why is this incomplete close reading?',
      commonErrors: [
        {
          answer: '"Feels sad" without evidence',
          misconception: 'Stating a reaction without identifying what in the text PRODUCES the reaction.',
          correctsTo: 'Close reading explains WHY a passage produces an effect. "This passage feels sad because of the slow rhythm of long sentences, the imagery of grey skies, and the repeated word \'alone\'." Now the reader can verify or push back. Close reading without evidence is just impression — the analysis happens when you trace effect to cause.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Notice diction, syntax, repetition, imagery, omissions.',
        'Annotate while reading.',
        'Ask: why this word, this rhythm, this image?',
        'Interpretation rests on textual evidence.',
        'Multiple readings can be valid if textually supported.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a writer DELIBERATELY leave a moment ambiguous?',
      hint: 'To force readers to participate. Explicit interpretation hands the meaning to the reader; ambiguity makes the reader complete the work. Some literary texts gain depth from supporting multiple interpretations — like a Rorschach test where each reader sees something different. Authors of literary fiction often value this richness over clarity.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
