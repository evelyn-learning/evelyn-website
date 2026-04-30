/**
 * G11 — ELA: Literary analysis (close reading, motif, symbolism, tone).
 *
 * The HS-level move from "what happened" to "how does the author
 * make meaning?". Close reading specific passages for word choice,
 * imagery, motif (recurring image/idea), symbolism, and tone.
 * Building an analytical claim with textual evidence.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ELA_LITERARY_ANALYSIS: LessonPlan = {
  id: 'evelyn.g11.ela.literary-analysis.v1',
  title: 'Literary Analysis: Close Reading',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'literary-analysis',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.11-12.4',
      description: 'Determine the meaning of words and phrases as they are used in a text; analyze the impact of specific word choices on meaning and tone.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.4',
    },
  ],
  prerequisites: ['ccss.ela.rl.8.4'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how meaning is built from specific word choices, not just plot.',
      script: 'Two writers describe the same scene. One says "the cold rain fell." The other says "the rain came down in needles." Same event, totally different feeling. The second writer chose IMAGERY ("needles") that makes the cold feel painful. Literary analysis is the practice of noticing those choices and explaining why they matter.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tools',
      kind: 'concept',
      goal: 'Five close-reading lenses + the analytical-claim template.',
      keyIdeas: [
        'CLOSE READING = paying careful attention to specific words, sentences, and patterns rather than just plot.',
        'Five lenses to use:',
        '1) DICTION (word choice) — connotation matters. "Cheap" vs "affordable" vs "thrifty" — three words for similar things, different feelings.',
        '2) IMAGERY — sensory details (sight, sound, touch, smell, taste). What does the author make you SENSE?',
        '3) MOTIF — a RECURRING image, idea, or symbol throughout a text. Notice repetition.',
        '4) SYMBOLISM — when an object STANDS FOR something larger (a flag for nation, a green light for unreachable hope).',
        '5) TONE — the author\'s ATTITUDE toward the subject. Detected through word choice, sentence structure, irony.',
        'ANALYTICAL CLAIM template: "By using [device], the author [achieves what effect / conveys what meaning]."',
        '  Example: "By using cold imagery throughout the chapter ("ice", "frost", "shiver"), the author conveys the protagonist\'s emotional isolation."',
        'WEAK analysis: just identifies the device. STRONG: explains its EFFECT or MEANING.',
        'AVOID summary. AVOID listing devices without analysis. The "why does it matter" part is the whole point.',
      ],
      vocabulary: [
        { term: 'diction', definition: 'word choice; the kind of words a writer uses.' },
        { term: 'imagery', definition: 'descriptive language appealing to the senses.' },
        { term: 'motif', definition: 'a recurring image or idea in a text.' },
        { term: 'tone', definition: 'the author\'s attitude toward the subject.' },
      ],
      suggestedTools: ['show_text', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tone',
      kind: 'worked_example',
      problem: 'Analyze the tone of: "It was, perhaps, the third \'kind\' suggestion my mother had made that morning. Each one tightened around me a little more, like a friendly noose."',
      steps: [
        'Look at diction. "Kind" in scare quotes suggests it\'s NOT actually kind.',
        'Imagery: "tightened around me", "friendly noose" — physical restriction, hidden threat.',
        'Tone: ironic / bitter. The narrator is saying the OPPOSITE of what the words literally mean.',
        'Analytical claim: "By pairing positive language (\'kind\', \'friendly\') with imagery of restriction (\'tightened\', \'noose\'), the author conveys an ironic, bitter tone — the narrator feels suffocated by what others see as care."',
      ],
      answer: 'Ironic / bitter tone',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a story, the word "darkness" appears 14 times in five pages — describing the weather, a character\'s mood, and a literal cellar. What literary device is at work?',
      expectedAnswer: 'Motif',
      responseFormat: 'free',
      hints: [
        'Repetition of an image across the text...',
        'When a single image keeps coming back across different contexts, that\'s a MOTIF.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-identifying-only',
      kind: 'misconception_check',
      question: 'Sage writes a paragraph that lists every metaphor in a chapter but never says what they mean. Is that literary analysis?',
      commonErrors: [
        {
          answer: 'yes — identifies the devices',
          misconception: 'Identifying devices without explaining their effect.',
          correctsTo: 'No — that\'s identification, not analysis. Analysis explains the EFFECT or MEANING. "Chapter 3 has 7 metaphors" is a list. "The metaphors of caging in Chapter 3 mirror the protagonist\'s feeling of being trapped in her hometown" is analysis.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five lenses: diction, imagery, motif, symbolism, tone.',
        'Claim template: "By using [device], the author [effect/meaning]."',
        'Identification ≠ analysis. Always explain effect.',
        'Look for repetition across the text — that\'s often a motif or symbol.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a passage of 2-3 sentences from any text. Write an analytical claim about it using the template.',
      hint: 'Identify ONE specific device, then connect it to a meaning or effect — that\'s the whole sandwich.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
