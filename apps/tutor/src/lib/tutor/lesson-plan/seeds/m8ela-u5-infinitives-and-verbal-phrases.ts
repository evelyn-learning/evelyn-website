/**
 * Grade 8 ELA — Grammar: Verbals, Voice & Mood: Infinitives & Verbal Phrases.
 *
 * PROCEDURE-LED. One repeatable move runs the whole lesson: find the verb that
 * runs the sentence, mark where the verbal phrase starts and stops, then ask
 * what the WHOLE phrase does in that sentence — names a thing, describes the
 * noun in front of it, or tells why about the verb (CCSS L.8.1a). The concept
 * segment is an ordered recipe rather than a way of reading, the first worked
 * example runs the job test across three infinitives plus the "to" lookalike,
 * the second bounds three verbal phrases with different heads so the head
 * cannot be what decides the job, and every wrong form in the tutor's own
 * prose is labeled. Four traps this plan is built to kill: "to" plus a noun
 * taken for an infinitive ("to the community pool"), the infinitive taken for
 * the verb that runs the sentence, the half phrase that names only the verbal
 * and drops its object and modifiers, and the job named from the form of the
 * verbal instead of from what the phrase does.
 *
 * SCOPE GUARD: Grade 8 row 5.2 explains the function of an infinitive ("to" +
 * verb) as a noun, adjective, or adverb in a particular sentence, and
 * identifies a complete verbal phrase (gerund, participial, or infinitive
 * phrase with its objects and modifiers) and the single job the whole phrase
 * does. Builds on `m7ela-u6-phrases-and-clauses.ts` (L.7.1a: "to finish the
 * whole level before dinner" is a phrase, never a clause, because a to-form is
 * not acting as the verb) and `m7ela-u6-sentence-types-and-combining.ts`
 * (L.7.1b: clause counting). Stops short of HS
 * `engl-u2-modifiers-and-parallelism.ts` (L.9-10.1b: keeping items parallel as
 * all infinitives or all -ing forms). DELIBERATELY EXCLUDED: telling a gerund
 * from a participle, which is row 5.1 — no keyIdea, worked step, item or hint
 * in this file asks which of the two an -ing word is, and no item can be
 * answered by sorting -ing from -ed; parallel form across infinitives and -ing
 * forms, and misplaced or dangling modifiers, which are HS
 * `engl-u2-modifiers-and-parallelism.ts`'s — the words "parallel", "dangling"
 * and "misplaced" appear nowhere in this file's body (below this comment); the
 * active and passive voice (row 5.3) and verb mood (row 5.4) — the terms
 * "active voice", "passive voice" and "mood" appear nowhere in the body
 * either, and no sentence here is labeled as one voice or the other; and the
 * G7 starter-word list and the four sentence types, which belong to
 * `m7ela-u6-phrases-and-clauses.ts` and
 * `m7ela-u6-sentence-types-and-combining.ts` and are not walked again.
 * DELIBERATELY ALLOWED, because row 5.1 and the two G7 rows sit close: apart
 * from the LO description and the prerequisite loId, whose wording the
 * curriculum row fixes, the words "gerund" and "participle" each appear
 * exactly once in this file's body (below this comment), inside one keyIdea
 * clause that reminds the student what row 5.1 installed, because a phrase headed by one of them is
 * exactly what this row asks the student to bound and name — nothing in this
 * file defines them further or asks the student to tell them apart; -ing and
 * -ed headed phrases therefore appear in the concept, the second worked
 * example, the third item and the misconception check, always to be bounded
 * and job-named; one keyIdea says in a single clause that a verbal phrase has
 * no subject-verb pair of its own and would otherwise be a clause, which is a
 * one-line reuse of the G7 phrase-versus-clause test rather than a re-teaching
 * of it, and the worked steps and hints then apply the boundary that follows
 * from it — a verbal phrase stops where the sentence's own verb begins; and
 * prepositional "to" phrases run through the concept, the first worked
 * example, the first item and the misconception check as the lookalike an
 * infinitive must be separated from, which is not a lesson on prepositions.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every wrong label and every broken sentence IN THE
 * TUTOR'S OWN PROSE is explicitly marked WRONG, with the CORRECT version
 * beside it: a tutor reads those lines aloud, and an unlabeled bad label would
 * be handed to the student as a model. The only unlabeled wrong statements in
 * this file are the MCQ distractors the three try_yourself items ask the
 * student to reject, which is what those items are for; each one is then named
 * in that item's hints or in the misconception check. No contraction appears
 * anywhere in this file.
 *
 * CLAIM LEDGER: none required. Every sentence in this file is an invented
 * specimen about invented students at an invented school, which is true by
 * construction, so there is no factual claim about the world to verify. Rows
 * whose passages are INFORMATIONAL (all of Units 3 and 4, and any other row
 * needing nonfiction) must carry the four-column claim ledger described in the
 * fan-out contract instead of this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U5_INFINITIVES_AND_VERBAL_PHRASES: LessonPlan = {
  id: 'evelyn.ms.m8ela.infinitives-and-verbal-phrases.v1',
  title: 'Infinitives & Verbal Phrases',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.infinitives-and-verbal-phrases',
      standard: 'M8ELA-5.2',
      description:
        'Explain the function of an infinitive ("to" + verb) as a noun, adjective, or adverb in a particular sentence, and identify a complete verbal phrase (gerund, participial, or infinitive phrase with its objects and modifiers) and the single job the whole phrase does (CCSS L.8.1a).',
    },
  ],
  prerequisites: ['m8ela.gerunds-and-participles'],
  followUps: ['m8ela.active-and-passive-voice'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the same two-letter word in front of a verb can do three different jobs in three sentences the student could read on a sign-up sheet today.',
      script:
        'The club is running a car wash on Saturday, and somebody has taped three lines to the sign-up sheet. "To wash forty cars in one morning, we need twelve people." "Bring a bucket to fill at the spigot behind the gym." "The plan is to start at nine." Each of those lines puts the same two-letter word in front of a verb, and the three uses are not doing the same thing at all. The first one tells you why twelve people are needed. The second one tells you which bucket to bring. The third one names the plan itself. Same two letters, three different jobs, and nothing about the letters tells you which job you are looking at. Today you get the test that does tell you, and then the harder half of the lesson: finding where the whole phrase starts and stops, because the job belongs to the phrase, not to the two letters at the front of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-infinitives-and-the-whole-phrase',
      kind: 'concept',
      goal: 'Install the infinitive form, the check that separates it from a prepositional "to" phrase, the three jobs it can do, the boundary of a whole verbal phrase, and the rule that the job comes from what the phrase does rather than from how the verbal ends.',
      keyIdeas: [
        'AN INFINITIVE IS "TO" PLUS THE PLAIN FORM OF A VERB, AND IT IS NEVER THE VERB THAT RUNS THE SENTENCE. "To swim", "to finish", "to ask". A VERBAL is a verb form doing some other part of speech\'s job, and you already know two of them: the gerund, an -ing form doing a noun\'s job, and the participle, an -ing or -ed form doing an adjective\'s job. The infinitive is the third, and it is the flexible one, because it can do three different jobs. In "Nadia wants to swim the whole length", the verb that runs the sentence is "wants". "To swim" is doing something else, and the first move is always to find the real verb so you know what is left over.',
        'CHECK THE WORD RIGHT AFTER "TO", BECAUSE "TO" HAS A SECOND LIFE. "To" also works as a little location word in front of a noun, exactly the way "under" and "behind" do: "to the gym", "to the front row", "to my locker". That is a prepositional phrase, and it is not an infinitive. The test takes a second: if the next word is a thing you could put "the" in front of, "to" is pointing at a place or a person. If the next word is an action in its plain form, you have an infinitive. WRONG: "In \'Dev jogged to the far end of the field\', the infinitive is \'to the far end\', because it starts with to." CORRECT: "The word after \'to\' is \'the\', so that is a prepositional phrase telling where Dev jogged; \'to jog\' would be the infinitive."',
        'AN INFINITIVE DOES ONE OF THREE JOBS, AND THE SENTENCE DECIDES WHICH. Ask the three questions in this order. Does it NAME a thing, sitting where a noun would sit, in the subject seat or after the verb? "To finish the whole level before dinner took two hours." Does it DESCRIBE the noun sitting right in front of it, answering which one or what kind? "Bring a bucket to fill at the spigot behind the gym." Does it tell WHY about the verb? "Priya set an alarm to catch the early bus." Noun, adjective, adverb, in that order, and only one of the three questions gets a real answer.',
        'A VERBAL PHRASE IS THE VERBAL PLUS EVERYTHING THAT RIDES WITH IT, AND THE WHOLE PACKAGE DOES ONE JOB. The words that ride with it are its object, the thing receiving the action, and its modifiers, the words telling where or when or which. Naming only the verbal is the half-phrase error, and it hides the job, because a job belongs to a phrase and not to a single word. WRONG: "The verbal phrase in \'The students waiting outside the band room heard the whole rehearsal\' is \'waiting\'." CORRECT: "The verbal phrase is \'waiting outside the band room\', and that whole phrase tells you which students."',
        'THE PHRASE STOPS WHERE THE SENTENCE\'S OWN SUBJECT-VERB PAIR BEGINS. Start at the verbal, keep every word that answers to it, and stop at the first word that belongs to the main sentence instead. A verbal phrase never contains the verb that runs the sentence, because a phrase has no subject-verb pair of its own; if it had one, it would be a clause. That is the check that catches a phrase marked too long. WRONG: "The verbal phrase is \'waiting outside the band room heard the whole rehearsal\'." CORRECT: "The phrase ends before \'heard\', because \'heard\' is the verb that runs the sentence."',
        'NAME THE JOB FROM WHAT THE PHRASE DOES, NEVER FROM HOW THE VERBAL ENDS. The same -ing word can head a phrase doing a noun\'s job in one sentence and a phrase doing an adjective\'s job in another, and an infinitive phrase can do any of the three jobs, so the ending settles nothing on its own. WRONG: "It starts with an -ing word, so the phrase is doing a noun\'s job." CORRECT: "Ask what the phrase does in this sentence: name a thing, describe the noun in front of it, or tell why about the verb."',
      ],
      vocabulary: [
        { term: 'verbal', definition: 'a verb form doing another part of speech\'s job in a sentence: an -ing form, an -ed form, or "to" plus a verb.' },
        { term: 'infinitive', definition: '"to" plus the plain form of a verb, as in "to swim" or "to finish"; it can do a noun\'s, an adjective\'s or an adverb\'s job, and it is never the verb that runs the sentence.' },
        { term: 'verbal phrase', definition: 'a verbal plus its object and its modifiers, all working together as one part of speech.' },
        { term: 'infinitive phrase', definition: 'an infinitive plus everything that rides with it, as in "to fill at the spigot behind the gym".' },
        { term: 'object of a verbal', definition: 'the noun that receives the action of the verbal and belongs inside the phrase, as "the whole level" does in "to finish the whole level".' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-job',
      kind: 'worked_example',
      problem:
        'Name the job each infinitive phrase does — noun, adjective, or adverb — and say how you know.\n\n(1) "To learn the whole drum part took Ravi three weekends."\n(2) "He wanted a quiet place to practice the hardest fill."\n(3) "He stayed after school to record the last take."\n(4) "He walked to the studio with the sticks in his back pocket."',
      steps: [
        'Sentence 1. Find the verb that runs the sentence first: "took". Everything else is available to be something other than the verb. Now find the infinitive: "to learn", which is "to" plus a plain verb. Take the words that ride with it, the object "the whole drum part", and stop there, because the next word is "took". So the phrase is "To learn the whole drum part".',
        'Ask the three questions about sentence 1 in order. Does the phrase name a thing? It sits in the subject seat, in front of the verb, and it names what took three weekends. Swap a plain noun in and the sentence still stands: "The work took Ravi three weekends." Verdict: NOUN. You can stop asking; the other two questions have nothing to find here.',
        'Sentence 2. The verb that runs the sentence is "wanted". The infinitive is "to practice", and the word riding with it is its object, "the hardest fill", so the phrase is "to practice the hardest fill". Now the three questions. Does it name a thing? The sentence already has its subject, "He", and its object, "a quiet place". Does it describe the noun right in front of it? The noun in front of it is "a quiet place", and the phrase says which place he wanted. Verdict: ADJECTIVE.',
        'Sentence 3. The verb that runs the sentence is "stayed". The phrase is "to record the last take". Does it name a thing? No. Does it describe the noun in front of it? The words in front of it are "after school", which name no place and no person to describe. Does it tell why he stayed? That is exactly what it does. Verdict: ADVERB.',
        'Sentence 4 is the lookalike, and it has no infinitive in it at all. Look at the word right after "to": it is "the", and then "studio", a thing you can put "the" in front of. So "to" is pointing at a place, and "to the studio" is a prepositional phrase telling where he walked. WRONG: "The infinitive in sentence 4 is \'to the studio\'." CORRECT: "Sentence 4 has no infinitive; its only verb is \'walked\', and \'to the studio\' tells where."',
        'One boundary check before you finish, because it is the error that survives everything else. In sentence 1, a student who marks the phrase as "To learn the whole drum part took Ravi" has swallowed the verb that runs the sentence. WRONG: "To learn the whole drum part took Ravi" as the phrase. CORRECT: "To learn the whole drum part", which stops before "took". Read the three verdicts together: noun, adjective, adverb. The same two letters started all three, and the sentence around them decided each job.',
      ],
      answer:
        'Sentence 1: "To learn the whole drum part" does a noun\'s job, sitting in the subject seat as the thing that took three weekends. Sentence 2: "to practice the hardest fill" does an adjective\'s job, telling which place he wanted. Sentence 3: "to record the last take" does an adverb\'s job, telling why he stayed after school. Sentence 4 has no infinitive; "to the studio" is a prepositional phrase telling where he walked.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-bound-the-phrase',
      kind: 'worked_example',
      problem:
        'Find the complete verbal phrase in each sentence and name the one job it does.\n\n(A) "Painting the set flats for the spring musical took the crew four afternoons."\n(B) "The list taped to the band room door had every audition time on it."\n(C) "Nadia raised her hand to ask about the second verse."',
      steps: [
        'Sentence A. Find the verb that runs the sentence: "took". Now find the verbal: "Painting", an -ing form with no helper in front of it, so it is not working as the sentence\'s verb. Take everything that rides with it. What is being painted? "the set flats". Which flats? The ones "for the spring musical". The next word is "took", so that is where the phrase ends: "Painting the set flats for the spring musical".',
        'Name the job of the whole phrase in sentence A. It sits in the subject seat and names what took four afternoons, so swap a plain noun in and check: "The job took the crew four afternoons." Verdict: NOUN. And notice what the half-phrase error would cost you here. WRONG: "The verbal phrase is \'Painting\'." CORRECT: "The verbal phrase is \'Painting the set flats for the spring musical\'." The object and its modifiers belong inside the phrase, and the job belongs to the whole package.',
        'Sentence B. Find the verb that runs the sentence. There are two words that could be candidates, "taped" and "had", so test them. If "taped" were the verb, the sentence would read as the list doing the taping, and then "had every audition time on it" would be left over with nothing to attach to. The verb that runs the sentence is "had". WRONG: reading "The list taped to the band room door" as a subject and its verb. CORRECT: "The list ... had every audition time on it" is the subject-verb pair, and "taped" heads a phrase.',
        'Bound the phrase in sentence B and name its job. Start at "taped", keep the words that answer to it, "to the band room door", and stop before "had". So the phrase is "taped to the band room door". Does it name a thing? The sentence already has its subject. Does it describe the noun in front of it? The noun in front of it is "The list", and the phrase says which list. Verdict: ADJECTIVE.',
        'Sentence C. The verb that runs the sentence is "raised". The verbal is "to ask", and the words riding with it are "about the second verse", so the phrase is "to ask about the second verse". Does it name a thing? No. Does it describe the noun in front of it? The noun in front of it is "her hand", and the phrase is not telling you which hand. Does it tell why she raised it? Yes. Verdict: ADVERB.',
        'Look at the three heads together: an -ing form in A, an -ed form in B, and "to" plus a verb in C. The jobs came out noun, adjective, adverb, in that order. Nothing about the head predicted any of that. The job came from what each whole phrase does in its own sentence, which is why bounding the phrase comes before naming the job.',
      ],
      answer:
        'A: the phrase is "Painting the set flats for the spring musical", and it does a noun\'s job as the subject, naming what took four afternoons. B: the phrase is "taped to the band room door", and it does an adjective\'s job, telling which list. C: the phrase is "to ask about the second verse", and it does an adverb\'s job, telling why Nadia raised her hand.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-infinitive',
      kind: 'try_yourself',
      problem: 'Which sentence contains an infinitive?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Marisol biked to the community pool before the morning heat set in.' },
        { id: 'b', text: 'The coach pointed to the lane at the far end of the empty pool.' },
        { id: 'c', text: 'Every swimmer walked to the starting blocks and waited for the whistle.' },
        { id: 'd', text: 'Marisol wanted to swim the whole length without stopping once.', correct: true },
      ],
      expectedAnswer: 'Marisol wanted to swim the whole length without stopping once.',
      hints: [
        'Every one of these sentences contains the word "to". Look at the word that comes immediately after it in each one.',
        'If the word after "to" is a thing you could put "the" in front of, then "to" is pointing at a place and the group is a prepositional phrase. An infinitive needs the plain form of an action verb right after "to".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-job',
      kind: 'try_yourself',
      problem:
        'Read this sentence: "The crew stayed after school to repaint the faded lines on the stage floor."\n\nWhat job does the infinitive phrase "to repaint the faded lines on the stage floor" do in that sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It does an adverb\'s job: it tells why the crew stayed after school, so it points at the verb "stayed" and not at any noun in the sentence.', correct: true },
        { id: 'b', text: 'It does a noun\'s job: the phrase names an activity, so it could be swapped for a noun such as "the repainting" with nothing else in the sentence changing.' },
        { id: 'c', text: 'It does an adjective\'s job: it describes "the faded lines on the stage floor" and tells the reader which lines on the stage the crew worked on.' },
        { id: 'd', text: 'It is not a verbal phrase at all: "to repaint" is the second verb of the sentence, because the crew did two things that afternoon, stayed and repainted.' },
      ],
      expectedAnswer: 'It does an adverb\'s job: it tells why the crew stayed after school, so it points at the verb "stayed" and not at any noun in the sentence.',
      hints: [
        'Find the verb that runs the sentence first. Then ask the three questions in order: does the phrase name a thing, describe the noun in front of it, or tell why about that verb?',
        'A phrase cannot describe a noun that sits inside the phrase itself, so check which words come before "to repaint" and ask whether the phrase is describing those. Then ask what answer the question "why did the crew stay after school?" gets.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bound-the-phrase',
      kind: 'try_yourself',
      problem:
        'Read this sentence: "The volunteers sorting cans in the back hallway missed the first half of the assembly."\n\nWhich statement names the complete verbal phrase and the single job it does?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The verbal phrase is "sorting", and it does a verb\'s job, because it tells the reader what the volunteers were busy doing while the assembly went on without them.' },
        { id: 'b', text: 'The verbal phrase is "sorting cans in the back hallway", and it does an adjective\'s job, because the whole phrase tells the reader which volunteers missed the first half.', correct: true },
        { id: 'c', text: 'The verbal phrase is "sorting cans in the back hallway", and it does a noun\'s job, because an -ing word at the front of a phrase names an activity the way a noun names a thing.' },
        { id: 'd', text: 'The verbal phrase is "sorting cans in the back hallway missed the first half", and it does an adverb\'s job, because it tells the reader when the volunteers were out of the room.' },
      ],
      expectedAnswer: 'The verbal phrase is "sorting cans in the back hallway", and it does an adjective\'s job, because the whole phrase tells the reader which volunteers missed the first half.',
      hints: [
        'Do two separate things and do them in this order. First mark where the phrase starts and where it stops, then ask what the whole phrase does in the sentence.',
        'The verb that runs this sentence is "missed", so the phrase has to end before it, and a phrase is more than the single word that heads it. Once you have the boundary, ask whether the phrase names a thing or tells the reader which volunteers are meant.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-the-to-word-and-the-half-phrase',
      kind: 'misconception_check',
      question:
        'A student is finding verbal phrases in two sentences. Sentence 1: "Amir ran to the corner store for a bag of ice." The student says: "The infinitive phrase is to the corner store, because it starts with to." Sentence 2: "The posters stacked near the door still needed staples." The student says: "The verbal phrase is stacked, and it is doing a noun\'s job, because it names an activity." What has gone wrong with each label?',
      commonErrors: [
        {
          answer: 'The infinitive phrase in "Amir ran to the corner store for a bag of ice" is "to the corner store".',
          misconception:
            'Treating the word "to" as the marker of an infinitive instead of checking what comes after it. "To" does start every infinitive, so the student has learned to spot it, but the word after it is the part that decides.',
          correctsTo:
            'Ask what follows "to". The next word is "the", and after that "corner store", a thing you can put "the" in front of. So "to" is working as a little location word here, exactly the way "under" or "behind" would, and "to the corner store" is a prepositional phrase telling where Amir ran. An infinitive needs the plain form of an action verb right after "to", as in "to buy". This sentence contains no infinitive at all; the verb that runs it is "ran".',
        },
        {
          answer: 'The verbal phrase in "The posters stacked near the door still needed staples" is "stacked", and it is doing a noun\'s job.',
          misconception:
            'Two errors folded together: stopping at the verbal instead of taking the whole phrase, and then naming the job from the form of the verbal rather than from what the phrase does in the sentence.',
          correctsTo:
            'Take the whole phrase first. Start at "stacked", keep the words that answer to it, "near the door", and stop before "still needed staples", because "needed" is the verb that runs the sentence. The phrase is "stacked near the door". Now ask what it does. It does not name a thing; the sentence already has its subject, "The posters". It tells the reader which posters are meant, so it is doing an adjective\'s job. The ending of the verbal never decides the job, and a single word is almost never the whole phrase.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An infinitive is "to" plus the plain form of a verb ("to swim", "to finish"), and it is never the verb that runs the sentence. Find that verb first, so you know what is left over.',
        'Check the word right after "to". A plain verb makes an infinitive; a thing you could put "the" in front of makes a prepositional phrase. WRONG: "The infinitive is \'to the far end\'." CORRECT: "\'To the far end\' tells where; \'to jog\' would be the infinitive."',
        'An infinitive does one of three jobs, and you ask in this order: does it name a thing (noun), describe the noun in front of it (adjective), or tell why about the verb (adverb)?',
        'A verbal phrase is the verbal plus its object and its modifiers, and the whole package does one job. WRONG: "The verbal phrase is \'waiting\'." CORRECT: "The verbal phrase is \'waiting outside the band room\'."',
        'The phrase stops where the sentence\'s own subject-verb pair begins. A verbal phrase never contains the verb that runs the sentence, because a phrase has no subject-verb pair of its own.',
        'Name the job from what the whole phrase does in this sentence, never from how the verbal ends. The same -ing word can head a phrase doing a noun\'s job in one sentence and an adjective\'s job in another.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Infinitives & Verbal Phrases' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
