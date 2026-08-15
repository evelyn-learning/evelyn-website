/**
 * HS English — Grammar & Usage: Phrases & Clauses.
 *
 * The structural skill the rest of the course stands on (CCSS L.9-10.1):
 * tell a phrase from a clause by hunting the subject-verb pair, then tell
 * an independent clause from a dependent one by checking for a
 * subordinator. Every sentence-boundary and punctuation decision later in
 * the course reduces to this one judgment. All practice is MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U2_CLAUSES_AND_PHRASES: LessonPlan = {
  id: 'evelyn.hs.engl.clauses-and-phrases.v1',
  title: 'Phrases & Clauses',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.clauses-and-phrases',
      standard: 'ENGL-2.1',
      description:
        'Distinguish phrases from clauses by locating the subject-verb pair, and independent clauses from dependent clauses by identifying subordinators and relative pronouns, so that every later sentence-boundary and punctuation decision rests on clause structure rather than on how the sentence sounds (CCSS L.9-10.1, L.9-10.1.b).',
    },
  ],
  prerequisites: ['engl.verb-tense-and-form'],
  followUps: ['engl.sentence-types-combining'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame clause structure as the hidden machinery behind every sentence a writer builds — and the reason some sentences collapse.',
      script:
        'Every sentence you will ever write — a message to a teacher, a paragraph in a college essay, the opening line of a story — is built out of two kinds of parts. Some parts carry a doer and an action. Some parts only add detail. Writers who cannot tell those two apart end up with sentences that stop in the middle of a thought, and readers feel the floor drop out. Once you can spot the subject-verb pair, you can tell in about two seconds whether a group of words can stand on its own. That one move is what makes commas, semicolons, and sentence variety possible for the rest of this course.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-phrase-vs-clause',
      kind: 'concept',
      goal: 'The subject-verb test for phrase vs clause, the subordinator test for independent vs dependent, and the errors that fool careful students.',
      keyIdeas: [
        'THE ONE TEST — a CLAUSE contains a subject-verb pair: somebody or something plus what it does or is. A PHRASE does not. "In the crowded gym" is a phrase; "the crowd cheered" is a clause. Hunt the pair first, and every other question gets easier.',
        'PHRASE TYPES WORTH KNOWING — prepositional ("after the storm"), appositive ("my neighbor, a retired welder"), participial ("carrying two folding chairs"), and infinitive ("to finish the interview"). All of them add detail; none of them can be a sentence, no matter how long they run.',
        'INDEPENDENT CLAUSE — subject plus verb plus a complete thought, able to stand alone with a capital letter and a period: "The interview ran long." This is the only unit that can legally be a sentence by itself.',
        'DEPENDENT CLAUSE — a real subject-verb pair that still cannot stand alone, because a SUBORDINATOR is glued to the front: after, although, as, because, before, if, since, unless, until, when, whenever, while, whereas. "Because the interview ran long" has a subject and a verb and is still not a sentence.',
        'RELATIVE CLAUSES — who, whom, whose, which, and that also open dependent clauses, and these hide inside sentences rather than at the front: "The reporter WHO ARRIVED LAST asked the sharpest question." The relative clause modifies a noun; the sentence still needs its own main subject and verb.',
        'CLASSIC ERROR 1 — VERBAL MISTAKEN FOR A VERB. An -ing word alone is not a verb, so "Carrying two folding chairs across the parking lot" is a phrase, not a clause. WRONG: "Carrying two folding chairs across the parking lot." CORRECT: "She was carrying two folding chairs across the parking lot." A helping verb, or a different verb entirely, is what turns the verbal into a real predicate.',
        'CLASSIC ERROR 2 — DEPENDENT CLAUSE PUNCTUATED AS A SENTENCE. Because the pair is genuinely there, the ear says the words are complete. WRONG: "Although the team practiced every morning before school." CORRECT: "Although the team practiced every morning before school, it lost the opening match." Either attach the dependent clause to an independent clause or delete the subordinator.',
        'CLASSIC ERROR 3 — LENGTH USED AS THE TEST. Length proves nothing. "The volunteers unloading crates behind the community center in the rain" is a long noun plus phrases with no main verb, while "Rain fell" is a complete sentence of two words. Count the subject-verb pair, not the words.',
      ],
      vocabulary: [
        { term: 'phrase', definition: 'a group of related words with NO subject-verb pair, such as "after the storm" or "carrying two chairs"; it adds detail and can never stand alone.' },
        { term: 'clause', definition: 'a group of words that DOES contain a subject-verb pair; it is either independent (stands alone) or dependent (cannot).' },
        { term: 'subordinator', definition: 'a word such as because, although, when, if, or since that turns an otherwise complete clause into a dependent one.' },
        { term: 'verbal', definition: 'a verb form used as a noun, adjective, or adverb — an -ing word, a to-form, or a participle — which cannot serve as the verb of a clause by itself.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sort-the-parts',
      kind: 'worked_example',
      problem:
        'Sort each group of words as a phrase, an independent clause, or a dependent clause: (1) "under the flickering stage lights", (2) "the understudy forgot her opening line", (3) "when the understudy forgot her opening line".',
      steps: [
        'Group 1: hunt for a subject-verb pair. "Under the flickering stage lights" names a place and does nothing — no doer, no action. Verdict: PHRASE, specifically a prepositional phrase.',
        'Group 2: the doer is "the understudy" and the action is "forgot". A pair exists, so this is a clause. Now check the front for a subordinator: there is none, and the thought closes. Verdict: INDEPENDENT CLAUSE.',
        'Group 3: the same pair is still there, "the understudy" plus "forgot". But "when" now sits in front, and the reader is left waiting for what happened next. Verdict: DEPENDENT CLAUSE.',
        'Notice what one word did. Groups 2 and 3 have identical subject-verb pairs; the subordinator alone decides whether the words can be a sentence. Attach group 3 to group 2 and the result works: "When the understudy forgot her opening line, the stage manager fed her the words from the wings."',
      ],
      answer:
        '1 = phrase, 2 = independent clause, 3 = dependent clause — the subordinator "when" is the only difference between 2 and 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-verbal-trap',
      kind: 'worked_example',
      problem:
        'A student writes this and defends it as a sentence: "Sprinting toward the last open ticket window in the station." Is it a sentence? If not, what is the smallest honest fix?',
      steps: [
        'Look for the verb first. "Sprinting" feels like the action, and that is exactly the bait — an -ing word standing alone is a verbal, not the verb of a clause.',
        'Now look for the subject. Ask who is sprinting. The words never say. There is no doer at all, so there is no subject-verb pair.',
        'Verdict: this is a participial PHRASE, not a clause, so labeling it WRONG as a sentence is correct. Length made it feel complete; twelve words of detail cannot substitute for a subject and a verb.',
        'Smallest honest fix: supply a subject and a real verb. CORRECT: "She was sprinting toward the last open ticket window in the station." Another correct fix attaches the phrase to an independent clause: "Sprinting toward the last open ticket window in the station, she dropped her boarding pass."',
      ],
      answer:
        'Not a sentence — it is a participial phrase with no subject-verb pair; fix it as "She was sprinting toward the last open ticket window in the station."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-phrase-or-clause',
      kind: 'try_yourself',
      problem:
        'Which of these groups of words is a CLAUSE rather than a phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'beneath a row of hand-painted banners' },
        { id: 'b', text: 'the janitor unlocked the auditorium doors', correct: true },
        { id: 'c', text: 'hauling three boxes of programs up the stairs' },
        { id: 'd', text: 'to reserve the auditorium for Thursday night' },
      ],
      expectedAnswer: 'the janitor unlocked the auditorium doors',
      hints: [
        'Ask each option two questions: who or what is the doer, and what is the action? A clause answers both.',
        'An -ing word or a to-form is a verbal, not a verb, and a preposition opens a phrase. Only one option has a real subject paired with a real verb.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-independent-or-dependent',
      kind: 'try_yourself',
      problem:
        'Which of these is an INDEPENDENT clause — a group of words that could stand alone as a sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Although the rehearsal ended after midnight' },
        { id: 'b', text: 'Which the stage crew had repainted that afternoon' },
        { id: 'c', text: 'The rehearsal ended after midnight', correct: true },
        { id: 'd', text: 'Ending well after midnight in an empty theater' },
      ],
      expectedAnswer: 'The rehearsal ended after midnight',
      hints: [
        'First keep only the options that have a subject-verb pair; that already eliminates one.',
        'Of the remaining clauses, check the first word. A subordinator such as "although" or a relative pronoun such as "which" makes a clause dependent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-complete-sentence',
      kind: 'try_yourself',
      problem:
        'A student is drafting a short profile for the school site. Which of these drafted lines is a complete sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because she had rebuilt the bike frame twice before the race.' },
        { id: 'b', text: 'A welder for thirty years, patient with beginners and impossible to rush.' },
        { id: 'c', text: 'She rebuilt the bike frame twice before the race.', correct: true },
        { id: 'd', text: 'Rebuilding the bike frame twice in the week before the county race.' },
      ],
      expectedAnswer: 'She rebuilt the bike frame twice before the race.',
      hints: [
        'Two of these have no subject-verb pair at all — one is an appositive phrase and one opens with a verbal.',
        'Of the two that do have a pair, one carries a subordinator on the front and leaves the reader waiting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subordinator-blindness',
      kind: 'misconception_check',
      question:
        'A student writes "While the projector warmed up in the dark auditorium." and argues it is a sentence: "It has a subject, projector, and a verb, warmed up. That is a clause, so it is a sentence." What went wrong?',
      commonErrors: [
        {
          answer: 'It has a subject and a verb, so it must be a complete sentence',
          misconception:
            'Treating the subject-verb pair as sufficient and ignoring the subordinator that makes the clause dependent.',
          correctsTo:
            'The pair is real, so this is a clause — but "while" subordinates it, and the reader is still waiting to learn what happened during that time. Every clause is either independent or dependent, and only an independent one can be a sentence. Two correct fixes: attach it, as in "While the projector warmed up in the dark auditorium, the debate team argued about seating"; or drop the subordinator, as in "The projector warmed up in the dark auditorium."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hunt the subject-verb pair first: a pair means a clause, and no pair means a phrase, however long the words run.',
        'An -ing word, a to-form, or a lone participle is a verbal, not a verb — it can never be the verb of a clause by itself.',
        'A clause with a subordinator (because, although, when, while, if, since) or a relative pronoun (who, which, that) is DEPENDENT and cannot stand alone.',
        'Only an independent clause can be a sentence, so fix a dependent one by attaching it to an independent clause or by deleting the subordinator.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Phrases & Clauses' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
