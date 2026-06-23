/**
 * AP Latin — exam strategy. Vergil and Caesar focus.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LATIN_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.latin.strategy.v1',
  title: 'AP Latin exam strategy (Vergil + Caesar)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'test-prep',
  topic: 'ap-test-strategy',
  locale: 'en',
  los: [
    {
      id: 'aplatin.strategy',
      description: 'Apply effective strategy to AP Latin exam sections — translation, analysis, and short-answer questions on Vergil\'s Aeneid and Caesar\'s Gallic War.',
      standard: 'AP-LATIN',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP Latin tests reading + analysis of two specific authors.',
      script: 'Unlike modern-language APs, AP Latin focuses on TWO classical authors: Vergil\'s Aeneid (poetry, epic) and Caesar\'s De Bello Gallico (prose, war commentary). You read selections in Latin, translate, and analyze rhetorical and grammatical features. The narrow focus is a gift — you can prepare exactly what will appear.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format + author-specific strategies + key features.',
      keyIdeas: [
        'FORMAT: ~3 hours. Section I — multiple choice on syllabus AND sight passages. Section II — free-response: literal translation, short answers, analytical essay.',
        'SYLLABUS PASSAGES: specific sections of Aeneid (~Books 1, 2, 4, 6, 8, 12) and De Bello Gallico (~Books 1, 4, 5, 6) that students MUST read in Latin and English. The exam draws from these.',
        'SIGHT PASSAGES: unseen Latin from authors of similar style. Tests true reading ability, not memorization.',
        'TRANSLATION: literal but readable English. Don\'t paraphrase. Mark every grammatical form. Don\'t skip words.',
        'ANALYTICAL ESSAY: respond to a prompt with passage-specific evidence. Cite Latin words/phrases (not English translations). Identify rhetorical devices: chiasmus, asyndeton, alliteration, hyperbaton, polysyndeton.',
        'VERGIL features: dactylic hexameter, epic similes, allusions to Homer, themes (pietas, fate vs free will, founding of Rome).',
        'CAESAR features: third-person narration (he calls himself "Caesar"), indirect discourse heavy, military vocabulary, ethnographic asides, propaganda function.',
        'GRAMMAR mastery: subjunctive uses (purpose, result, indirect command, conditions), ablative absolutes, gerunds/gerundives, participles, indirect statement.',
        'SCORING: 1-5.',
      ],
      vocabulary: [
        { term: 'pietas', definition: 'Roman virtue of duty to gods, family, and country — central theme in Aeneid.' },
        { term: 'ablative absolute', definition: 'a Latin construction using a noun + participle in ablative to express attendant circumstance.' },
        { term: 'indirect discourse', definition: 'reporting speech using accusative + infinitive (or with ut + subjunctive); pervasive in Caesar.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-essay',
      kind: 'worked_example',
      problem: 'How to write the analytical essay on a Vergil passage about a character\'s emotion.',
      steps: [
        'Read prompt carefully — what specific question is being asked?',
        'Reread the Latin passage. Mark grammatical structures and rhetorical devices.',
        'Plan a thesis that answers the prompt with a clear claim about HOW Vergil produces meaning.',
        'Body paragraphs: each cites Latin words or phrases (not English) as evidence.',
        'Identify rhetorical devices and connect to the prompt — don\'t just name them.',
        'Use literary terms: epic simile, enjambment, hyperbaton, anaphora.',
        'Conclude by synthesizing how the passage develops Vergilian themes (pietas, fate).',
        'Time: ~5 min planning, ~25 min writing.',
      ],
      answer: 'Cite Latin words; connect rhetorical devices to thematic claim; conclude by synthesizing.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the contrast between the Aeneid and De Bello Gallico useful pedagogically?',
      expectedAnswer: 'Aeneid is poetry (dactylic hexameter, formal vocabulary, mythic register). Caesar is prose (sparse syntax, military language, third-person voice). Mastering both teaches different registers of Latin and shows the language\'s range. Plus they offer different rhetorical purposes — Vergil legitimizing Augustan Rome through myth; Caesar justifying his own conquests through narrative.',
      responseFormat: 'free',
      hints: [
        'One is poetry, the other prose. Different registers.',
        'Different rhetorical purposes too — myth vs justification.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-translation',
      kind: 'misconception_check',
      question: 'Is a smooth, idiomatic English translation what AP Latin graders want?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Latin translation like literary translation.',
          correctsTo: 'No — graders want LITERAL translation that demonstrates you grasped the Latin grammar. Render every word, preserve case relationships, don\'t paraphrase to make English flow. A literary translation hides whether you understood the genitive of possession or the dative of agent. Awkward but accurate beats smooth but vague.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two authors: Vergil (Aeneid, poetry) and Caesar (Gallic War, prose).',
        'Translate LITERALLY, mark grammar.',
        'Essays cite LATIN words, identify rhetorical devices, develop a thematic claim.',
        'Master subjunctive uses, ablative absolutes, indirect statement.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is reading the syllabus passages in BOTH Latin and English important?',
      hint: 'Latin reading builds grammatical mastery and ear for the language. English reading lets you grasp narrative arc, character relationships, and themes that span longer than the passages you read in Latin. Sight passages may reference characters or events from the broader work — knowing the English helps you orient quickly.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
