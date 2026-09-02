/**
 * Grade 6 ELA — Reading Informational Texts: Central Idea & Text Features:
 * Technical & Domain Vocabulary.
 *
 * CONCEPT-LED fan-out row for the m6ela course. The student arrives with no
 * procedure to lean on, so the whole lesson builds one way of reading: a
 * technical or domain-specific word belongs to one field, and an
 * informational text almost always hands the reader its meaning close by —
 * either as a restatement set off by a comma or dash, or as a nearby example
 * (CCSS RI.6.4). Three traps this plan is built to kill: reaching for a
 * word's everyday meaning instead of the field-specific one the text prints
 * (current, crux), grabbing the nearest phrase in the sentence instead of the
 * one that actually renames the term, and answering from outside knowledge
 * the text never supplied at all.
 *
 * SCOPE GUARD: Grade 6 row 3.3 determines the meaning of a technical or
 * domain-specific word or phrase as used in an informational text, using
 * context clues and a definition or example the text itself supplies.
 * DELIBERATELY EXCLUDED: analyzing the impact of a word choice on an
 * informational text's meaning or tone, which is RI.7.4 and belongs to the
 * shipped Grade 7 course, not this row; general vocabulary-in-context work
 * with everyday unfamiliar words, Greek/Latin roots and affixes, connotation
 * versus denotation, and word relationships/analogies, all of which are Unit
 * 7 of this same course and never appear here; determining a text's central
 * idea or writing an objective summary of it (rows 3.1 and 3.2); and
 * identifying how a heading, caption, sidebar or graphic aids a reader's
 * understanding of one section (row 3.4). DELIBERATELY ALLOWED, because every
 * neighboring row in this unit sits close: every excerpt in this file is
 * informational nonfiction, which rows 3.1, 3.2 and 3.4 also require — that
 * shared texture is not this row reaching into their territory, because this
 * row never asks what a passage's central idea is, never asks for a summary
 * of it, and never asks what a heading or caption contributes. Every item
 * here asks exactly one question: what does this flagged word mean, given
 * the words printed around it.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                        | Where               | Grounds
 *   In a beehive, the brood chamber is the       | worked example 1    | Standard Langstroth
 *   bottom section where the queen bee lays      | passage             | hive design, with
 *   eggs and young bees develop, and honey       |                     | supers added above
 *   supers are added above it                    |                     | the brood box;
 *                                                 |                     | consistent across
 *                                                 |                     | beekeeping sources.
 *   Electric current is the flow of electric     | worked example 2    | Standard physics
 *   charge moving through a wire                 | passage             | definition of current;
 *                                                 |                     | long-settled.
 *   A volcano's magma chamber is the underground | try-yourself 1      | Standard volcanology
 *   pool of melted rock that collects beneath    | passage             | definition; long-
 *   the surface                                  |                     | settled.
 *   In climbing, the crux is the single hardest  | try-yourself 2      | Standard climbing
 *   move on a route                              | passage             | terminology; consistent
 *                                                 |                     | usage across the sport.
 *   The dew point is the temperature at which    | try-yourself 3      | Standard meteorology
 *   air is holding all the moisture it can hold, | passage             | definition; long-
 *   so extra water begins condensing             |                     | settled.
 *   Gluten is the stretchy protein network that  | misconception check | Standard baking
 *   forms when wheat flour is mixed with water   | passage             | chemistry (gluten
 *                                                 |                     | formation); long-
 *                                                 |                     | settled.
 * No live hypotheses appear in this file — every claim above is a settled
 * field definition, not a mechanism still under study, so none needed
 * hedging. No precise statistic appears anywhere in this file.
 *
 * NOTE ON prerequisites/followUps: this row's chain is
 * m6ela.summarizing-informational-text -> m6ela.technical-and-domain-vocabulary
 * -> m6ela.text-features-and-how-they-aid-understanding, per the lesson brief.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY: LessonPlan = {
  id: 'evelyn.ms.m6ela.technical-and-domain-vocabulary.v1',
  title: 'Technical & Domain Vocabulary',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.technical-and-domain-vocabulary',
      standard: 'M6ELA-3.3',
      description:
        'Determine the meaning of technical and domain-specific words and phrases as used in an informational text, using context and the definitions or examples the text itself supplies (CCSS RI.6.4).',
    },
  ],
  prerequisites: ['m6ela.summarizing-informational-text'],
  followUps: ['m6ela.text-features-and-how-they-aid-understanding'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student they already do this move without noticing, so the lesson names a habit rather than installing a new one.',
      script:
        'You are reading the instructions for a game you just downloaded, and one line says, "Equip a shield to reduce aggro from nearby enemies." Nobody ever taught you the word aggro. You do not stop and look it up. You just read on: enemies get more of it when you fight without a shield, and equipping one reduces it, so it must mean something like how much attention the enemies are aiming at you. You worked that out in about ten seconds, using nothing but the words already on the screen. That is the whole skill for today: a text written for one field — bee keeping, weather, rock climbing, anything — usually hands you the meaning of its own special words, right there in the sentence, if you know exactly where to look.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-technical-vocabulary-in-context',
      kind: 'concept',
      goal: 'Install the two clue types an informational text supplies for a domain word, the everyday-meaning trap, and the swap-back test.',
      keyIdeas: [
        'A TECHNICAL OR DOMAIN-SPECIFIC WORD BELONGS TO ONE FIELD OF STUDY OR ACTIVITY. Words such as brood chamber, magma chamber, crux and dew point almost never come up outside beekeeping, volcanoes, climbing or weather. A text that uses one of these words is usually about to tell you, close by, exactly what it means inside that field — you do not need to already know the term.',
        'LOOK FIRST FOR THE DEFINITION THE TEXT ALREADY HANDS YOU. A comma followed by a phrase that renames the term, or a dash doing the same job, is the clearest signal there is: "the current, the flow of electric charge moving through a wire," defines current the instant it is used. Read the exact words right after that signal before you guess at anything.',
        'WHEN THERE IS NO DIRECT RESTATEMENT, LOOK FOR A NEARBY EXAMPLE INSTEAD. Words such as "such as," "for instance" and "like" introduce specific cases that show what a term covers, even when the text never states a one-sentence definition.',
        'WATCH FOR A WORD THAT ALSO HAS AN EVERYDAY MEANING. Crux and current both mean one thing in ordinary conversation and something more exact inside a specific field. The everyday meaning you already know is exactly what gets in the way here — trust the definition or example the text prints, not the meaning you walked in with.',
        'TEST YOUR ANSWER BY SWAPPING IT BACK INTO THE SENTENCE. If your meaning fits smoothly where the technical word was, and the rest of the sentence still makes sense, you have the right one. If the sentence stops making sense, you borrowed a meaning from somewhere outside the text.',
      ],
      vocabulary: [
        { term: 'technical or domain-specific word', definition: 'a word tied to one field of study or activity that does not come up in everyday conversation outside that field.' },
        { term: 'restatement', definition: 'a phrase set off by a comma or dash that renames or defines a term the instant it is used.' },
        { term: 'example clue', definition: 'specific cases introduced by words such as "such as," "for instance" or "like" that show what a term covers.' },
        { term: 'context', definition: 'the words and sentences surrounding an unfamiliar word that a reader uses to work out its meaning.' },
        { term: 'multiple-meaning word', definition: 'a word that carries one meaning in everyday conversation and a different, more exact meaning inside a specific field.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-restatement-clue',
      kind: 'worked_example',
      problem:
        'Figure out what the underlined technical term means, using only the words printed in the passage.\n\n"A beekeeper lifts the lid of the hive and checks the brood chamber, the bottom section where the queen bee lays eggs and young bees develop, before adding empty frames above it for the colony to fill with honey."\n\nWhat does brood chamber mean, as used in this passage?',
      steps: [
        'Find the technical term first: brood chamber. It is not a word from everyday conversation, so the passage is most likely about to explain it close by.',
        'Look immediately after the term for a comma-signal restatement. Right after "brood chamber" there is a comma, then the phrase "the bottom section where the queen bee lays eggs and young bees develop," which renames the term directly.',
        'Do not borrow anything the definition does not actually say. The sentence never says honey is stored inside the brood chamber; it says frames are added above the brood chamber for honey. Keep the meaning to exactly what the restatement gives you.',
        'Swap the meaning back into the sentence to check it: the beekeeper checks the bottom section where the queen bee lays eggs and young bees develop, and the rest of the sentence, about adding frames above it, still makes sense.',
        'Write the meaning as a full phrase, not a single word: the section of the hive, near the bottom, where the queen bee lays eggs and young bees develop.',
      ],
      answer:
        'Brood chamber means the section of the hive, near the bottom, where the queen bee lays eggs and young bees develop. The passage defines it directly, right after the term, with the restatement "the bottom section where the queen bee lays eggs and young bees develop," set off by a comma.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-everyday-meaning-trap',
      kind: 'worked_example',
      problem:
        'A student was asked what the underlined term means in this passage, and answered wrong. Find the mistake and repair it.\n\n"An electrician tests the current, the flow of electric charge moving through a wire, before connecting a new light switch."\n\nStudent\'s answer: "Current means something happening right now, like current events."\n\nWhat went wrong, and what does current actually mean here?',
      steps: [
        'Notice that the student\'s answer never looked at the passage at all. It reached for the everyday meaning of current, the one that means "happening now" — a meaning the student already knew before reading a single word of this sentence.',
        'Go back to the sentence and find the signal right after the term. There is a comma right after "current," then the phrase "the flow of electric charge moving through a wire," which is the passage\'s own definition, printed the instant the word is used.',
        'Compare the two meanings directly. "The flow of electric charge moving through a wire" has nothing to do with time or "happening now" — it describes something moving through a wire, which fits an electrician testing wiring, not a news report.',
        'Swap the correct meaning back into the sentence to check it: an electrician tests the flow of electric charge moving through a wire, before connecting a new light switch, and the rest of the sentence still makes sense.',
        'WRONG: "Current means something happening right now, like current events." CORRECT: "In this passage, current means the flow of electric charge moving through a wire."',
      ],
      answer:
        'Current means the flow of electric charge moving through a wire, exactly as the passage defines it right after the comma. The everyday meaning of current, "happening now," is not what the word means inside this passage about an electrician\'s work.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-magma-chamber',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the meaning of the underlined term.\n\n"Before a volcano erupts, geologists lower a probe toward the magma chamber, the underground pool of melted rock that collects beneath the surface, to track how its temperature is changing."\n\nAs used in this passage, what does magma chamber mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bowl-shaped dip at the very top of a mountain, the spot where an eruption first breaks through into the open air.' },
        { id: 'b', text: 'The narrow opening at the top of a volcano that ash and melted rock shoot up through once an eruption has already started.' },
        { id: 'c', text: 'The pool of melted rock that collects underground beneath a volcano\'s surface.', correct: true },
        { id: 'd', text: 'The wide river of melted rock that flows down a mountain\'s outer slopes only after an eruption has already begun.' },
      ],
      expectedAnswer: 'The pool of melted rock that collects underground beneath a volcano\'s surface.',
      hints: [
        'Find the phrase that comes right after the comma following "magma chamber" — the passage defines the term in that exact phrase.',
        'Three of these choices describe a different, real piece of volcano vocabulary: the opening at the top, the bowl at the summit, and the flow after an eruption. Only one matches something that collects underground before any of those happen.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-crux',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the meaning of the underlined term.\n\n"Before leaving the ground, a climber studies the crux, the single hardest move on the whole route, and rehearses the hand and foot placements needed to get through it."\n\nAs used in this passage, what does crux mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The central point of an argument or disagreement between two people.' },
        { id: 'b', text: 'The very first handhold a climber grabs at the bottom of the route.' },
        { id: 'c', text: 'The complete path a climber follows, from the very first handhold at the bottom all the way to the anchor at the top of the wall.' },
        { id: 'd', text: 'The single hardest move on the whole route, the one part of the climb that needs the most rehearsal beforehand.', correct: true },
      ],
      expectedAnswer: 'The single hardest move on the whole route, the one part of the climb that needs the most rehearsal beforehand.',
      hints: [
        'This word has an everyday meaning you may already know, from a phrase like "the crux of the matter." Set that meaning aside and look only at what the passage itself says right after the comma.',
        'Two of these choices describe a different part of the climb — its very start, or its whole length from bottom to top. Find the phrase that names one single move instead.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dew-point',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the meaning of the underlined term.\n\n"A meteorologist explains that fog forms when the air cools to the dew point, the temperature at which air is holding all the moisture it can hold, so extra water begins condensing into tiny droplets."\n\nAs used in this passage, what does dew point mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The temperature at which air is holding all the moisture it can hold, so any extra water starts condensing into tiny droplets.', correct: true },
        { id: 'b', text: 'The percentage of moisture currently present in a mass of air, a separate number usually measured with a tool called a hygrometer.' },
        { id: 'c', text: 'The exact temperature at which liquid water inside a cloud freezes solid and turns into ice crystals.' },
        { id: 'd', text: 'The early hours of the morning when moisture that has already condensed collects as dew on blades of grass.' },
      ],
      expectedAnswer: 'The temperature at which air is holding all the moisture it can hold, so any extra water starts condensing into tiny droplets.',
      hints: [
        'Look at the restatement right after the comma following "dew point" — it names one exact condition of the air, not a percentage and not a time of day.',
        'Two of these choices describe real weather ideas, how much moisture is in the air right now and when water freezes, but neither one is the term this passage is defining.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-outside-knowledge-and-nearest-phrase',
      kind: 'misconception_check',
      question:
        'A student reads, "The baker checked the dough\'s gluten, the stretchy protein network that forms when flour is mixed with water, before shaping the loaf," and answers: "Gluten means a health problem some people have with wheat." What went wrong?',
      commonErrors: [
        {
          answer: 'Gluten means a health problem some people have with wheat.',
          misconception:
            'Answering from a meaning heard somewhere else instead of the meaning the passage itself supplies. Gluten is genuinely used that way in other conversations, which is exactly why the guess feels reasonable and slips past unnoticed.',
          correctsTo:
            'The passage defines gluten the instant it uses the word: "the stretchy protein network that forms when flour is mixed with water," set off by a comma. That is the only meaning printed here, and it has nothing to do with a health condition. Whenever a technical word is followed by a comma and a renaming phrase, that phrase is the answer, not whatever the word has meant in a different conversation.',
        },
        {
          answer: 'Gluten means shaping the loaf.',
          misconception:
            'Grabbing whichever nearby phrase comes first in the sentence, instead of the specific restatement that directly follows the term.',
          correctsTo:
            'Go back to the exact words right after the comma that follows the term itself: "the stretchy protein network that forms when flour is mixed with water," set off by a comma. A definition sits immediately next to the word it defines. An action that happens later in the same sentence, such as shaping the loaf, belongs to the story around the term, not to the term\'s meaning.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A technical or domain-specific word belongs to one field. An informational text that uses one almost always hands you its meaning close by.',
        'Look first for a restatement: a comma or dash followed by a phrase that renames the term the instant it is used.',
        'When there is no direct restatement, look for an example clue instead, introduced by words such as "such as," "for instance" or "like."',
        'Watch for a word with an everyday meaning too, such as current or crux. Trust the definition the text prints, not the meaning you walked in with.',
        'Test your answer by swapping it back into the sentence. If the rest of the sentence stops making sense, the meaning came from outside the text.',
        'A definition sits right next to the word it defines. An action or detail later in the same sentence is part of the story, not the term\'s meaning.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Technical & Domain Vocabulary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
