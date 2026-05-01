/**
 * GRE General Test — Verbal Reasoning (shortened format).
 *
 * 27 questions across 2 sections, 41 min total. Three question types:
 * Text Completion, Sentence Equivalence, Reading Comprehension. Vocab
 * burden is significant; passages are short and dense.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_SHORTENED_VERBAL: LessonPlan = {
  id: 'evelyn.testprep.gre.shortened-verbal.v1',
  title: 'GRE Verbal Reasoning (Shortened): Question Types and Pacing',
  curriculum: 'ETS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-verbal',
  locale: 'en',
  los: [
    {
      id: 'gre.shortened-verbal',
      description: 'Recognize the three GRE Verbal question types (Text Completion, Sentence Equivalence, Reading Comprehension), apply per-type strategy, and pace within the tightened 41-min total budget.',
      standard: 'GRE-GENERAL-VERBAL',
    },
  ],
  prerequisites: ['gre.shortened-format'],
  followUps: ['gre.shortened-quant'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Verbal got DENSER, not easier.',
      script: 'The shortened GRE chopped Verbal from ~40 questions to 27. But the question MIX is unchanged: text completions, sentence equivalences, and reading comprehension passages all still appear in the same proportions. So you have less time per question on average (~91 seconds), and less margin for error — every miss hurts more on a shorter test. Vocabulary fluency and recognizing question types fast are the difference between a 155 and a 165.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'The three Verbal question types.',
      keyIdeas: [
        'TEXT COMPLETION (~6-7 per test): a passage of 1-5 sentences with 1, 2, or 3 blanks. Pick one word or phrase to fill EACH blank from a separate set of options. ALL blanks must be correct for credit (no partial credit). Words are typically GRE-level vocabulary (multisyllabic, often Latinate).',
        'SENTENCE EQUIVALENCE (~4 per test): one sentence with ONE blank. Pick TWO words from six options that BOTH (a) make the sentence make sense and (b) result in sentences that mean the same thing. The two correct picks are SYNONYMS in this context — both must work alone.',
        'READING COMPREHENSION (~16-17 per test): short passages (~80-150 words) and longer passages (~300-450 words). Question types: Main Idea, Inference, Author\'s Tone, Specific Detail, Logical Function (why is paragraph X here?), Argument Analysis (strengthen, weaken — borrowed from LR-style logic).',
        'PARAGRAPH ARGUMENT TYPE (within RC): a short argument followed by ONE question, similar to LSAT Critical Reasoning. Common subtypes: strengthen, weaken, assumption, inference, evaluate.',
        'STRATEGY for Text Completion: predict the blank\'s meaning BEFORE looking at the choices. The structure of the sentence tells you what role the missing word plays — synonym of nearby idea, opposite, cause, effect.',
        'STRATEGY for Sentence Equivalence: find the SYNONYM PAIR. If you find one obvious word that fits, look for the other word that\'s a synonym OF THAT WORD. Eliminate choices that aren\'t paired.',
        'STRATEGY for RC: read the passage actively (tag each paragraph by function). Answer questions by returning to the relevant lines.',
        'PACING: 41 min for 27 Q ≈ 91 seconds per Q on average. Single-blank Text Completions take ~45s; long RC passages with 3-4 questions take ~3-4 minutes total.',
      ],
      vocabulary: [
        { term: 'Text Completion', definition: 'GRE Verbal item with 1-3 blanks, each filled from a distinct set of options; all blanks must be correct for credit.' },
        { term: 'Sentence Equivalence', definition: 'GRE Verbal item asking for two synonymous words that both make the sentence work.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-text-completion',
      kind: 'worked_example',
      problem: 'TEXT COMPLETION: "Although the experiment\'s results initially seemed _____, further analysis revealed they were entirely consistent with the prevailing theory." Choices: (a) anomalous, (b) corroborative, (c) tedious, (d) reproducible, (e) tangential.',
      steps: [
        'STRUCTURE: "Although X seemed [BLANK], further analysis revealed [contradicts X]." The "Although" + "further analysis revealed" frame signals CONTRAST — the blank means the OPPOSITE of "consistent with theory."',
        'PREDICT: the blank means "inconsistent" or "surprising" or "contradictory."',
        'MATCH: anomalous = "deviating from what is standard or expected." That\'s the predicted meaning.',
        'CHECK others: corroborative = supporting (wrong direction). tedious = boring (irrelevant). reproducible = repeatable (irrelevant). tangential = off-topic (irrelevant).',
        'ANSWER: (a) anomalous.',
      ],
      answer: '(a) anomalous',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'SENTENCE EQUIVALENCE: "The CEO\'s announcement was widely viewed as _____, given the years of speculation that had preceded it." Choices: (a) inevitable, (b) expected, (c) surprising, (d) controversial, (e) sudden, (f) shocking. Pick the two correct words.',
      expectedAnswer: '(a) inevitable and (b) expected. Both mean "anticipated; not surprising," and both fit "after years of speculation." (c), (e), (f) are all opposites of what the sentence demands. (d) "controversial" is plausible but isn\'t a synonym of any other choice.',
      responseFormat: 'free',
      hints: [
        'Find the synonym pair. After "years of speculation," the announcement was NOT surprising.',
        '"Inevitable" and "expected" both mean anticipated.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-vocab-only',
      kind: 'misconception_check',
      question: 'GRE Verbal is mostly a vocabulary test, so memorizing 5,000 GRE words guarantees a high Verbal score.',
      commonErrors: [
        {
          answer: 'true — vocab is the GRE\'s main signal',
          misconception: 'Conflating vocabulary depth with reasoning skill.',
          correctsTo: 'False. Vocabulary HELPS, especially for Text Completion and Sentence Equivalence. But over half of Verbal is Reading Comprehension, where the test rewards STRUCTURE recognition and inference — not isolated word knowledge. Students who pure-vocab their way often hit a 158-162 ceiling. The path to 165+ requires equal investment in passage analysis and argument-style reasoning. Vocab without reasoning is necessary but insufficient.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '27 Q / 41 min ≈ 91 sec/question. 3 question types: TC, SE, RC.',
        'Text Completion: predict the blank meaning from sentence structure first, then match.',
        'Sentence Equivalence: find the synonym pair. Both choices must work AND mean the same.',
        'Reading Comp: ~60% of Verbal. Reasoning skills matter as much as vocab.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does Sentence Equivalence specifically require TWO synonymous answers rather than just one correct choice?',
      hint: 'It tests vocabulary depth more rigorously than single-answer formats. A student who knows half the GRE word list can guess one of six and be right. To pick BOTH synonyms, you must recognize the relationships AMONG vocabulary words — not just isolated meanings. ETS data shows SE is more predictive of graduate-level reading comprehension than other vocabulary formats. The format also discourages strategic guessing: random selection of any 2 of 6 has only ~1/15 chance of getting both right.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
