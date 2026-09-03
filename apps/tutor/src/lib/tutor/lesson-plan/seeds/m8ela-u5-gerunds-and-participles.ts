/**
 * Grade 8 ELA — Grammar: Verbals, Voice & Mood: Gerunds & Participles.
 *
 * PROCEDURE-LED (CCSS L.8.1a). One repeatable move runs the whole lesson, and
 * it is two questions asked in order about one word: is a helping verb sitting
 * directly in front of this -ing word, so that the two of them carry the
 * action (then it is the verb, and there is nothing else to name)? If not, is
 * the word NAMING a thing (a gerund, doing a noun's job) or DESCRIBING a noun
 * (a participle, doing an adjective's job)? Four traps this plan is built to
 * kill: naming the word from its ending, so that every -ing word becomes a
 * gerund; naming every -ed word a past-tense verb when the sentence already
 * has a verb somewhere else; naming the word from its seat, so that two words
 * in the same position get the same label ("Ravi finished loading the bins"
 * against "Ravi found his sister loading the bins"); and missing the helper in
 * front, so that "was baking" gets pulled apart into a gerund.
 *
 * SCOPE GUARD: Grade 8 row 5.1 explains the function of a gerund (an -ing verb
 * form doing a NOUN's job) and a participle (an -ing or -ed verb form doing an
 * ADJECTIVE's job) in a particular sentence, and tells the two apart by the job
 * test. Builds on `m7ela-u6-phrases-and-clauses.ts` (L.7.1a, read in full),
 * which teaches that "an -ing word by itself is not acting as the verb" and
 * calls "running for the bus" a phrase — G8 names what that -ing word IS and
 * what job it does — and on `m7ela-u5-parts-of-speech.ts` (L.7.1a: parts of
 * speech by job). Uses the G7 vocabulary (starter word, not subordinator; the
 * phrases-and-clauses header forbids "subordinator" in the MS band). L.8.1a
 * covers three verbals; split by form here (the -ing lookalike pair) and
 * infinitives next. Stops short of HS `engl-u2-modifiers-and-parallelism.ts`
 * (L.9-10.1b: misplaced and dangling participles, parallel form) and
 * `engl-u2-clauses-and-phrases.ts` (which names gerund/participial/infinitive
 * phrases only in passing).
 *
 * DELIBERATELY EXCLUDED: infinitives and the naming of a whole verbal phrase
 * as a unit, which are row 5.2 — the words "gerund phrase" and "participial
 * phrase" appear nowhere below this comment, the word "infinitive" appears in
 * the body only inside the followUps loId that points at row 5.2, no item asks
 * about a "to" + verb form, and every question asks about ONE word and the job
 * that one word is doing. The active and passive voice, which is row 5.3 — the
 * words "active" and "passive" appear nowhere in the body, "voice" appears
 * once and only in the everyday sense of the noise a person makes, and no
 * sentence printed as a specimen for labeling puts an -ed word after a form of
 * "be". Verb moods (row 5.4) and the repair of a shift (row 6.1) — no sentence
 * in this file is offered for repair, only for labeling. Misplaced and dangling
 * participles and parallel form, which are HS
 * `engl-u2-modifiers-and-parallelism.ts` — the words "dangling", "misplaced"
 * and "parallel" appear nowhere in the body below this comment, and no
 * participle in this file opens a sentence and is cut off by a comma, which is
 * the position that produces a dangler. The irregular verb chart itself, which is not
 * re-taught: no keyIdea, step or recap line walks the first, second and third
 * shapes of any verb.
 *
 * DELIBERATELY ALLOWED, because rows 5.2 and 5.3 and the G7 rows below sit
 * close: (a) the umbrella term "verbal" is defined once, in one keyIdea and
 * one vocabulary entry, and then used as a plain label wherever a verdict
 * needs one, because the word needs a category before its two jobs can be
 * sorted; nothing here extends that category to infinitives or to phrases,
 * which are row 5.2's; (b)
 * the concept, both worked examples, two hints, the misconception correction
 * and one recap line say that a
 * helping verb plus an -ing word is the VERB of its sentence and not a verbal
 * at all — that is the lookalike the first question of the test exists to
 * clear, and it is a one-line reuse of the G7 rule that "an -ing word by
 * itself is not acting as the verb", not a re-teaching of tense; (c) the past
 * participle is named as the third shape the student already has, once in a
 * keyIdea and once in a vocabulary entry, only so that an -ed word standing
 * with its noun can be recognized; (d) one keyIdea says in a single sentence
 * that an -ed word sitting after a form of "be" is a different arrangement and
 * a later lesson, so that a student who meets one in the wild does not run
 * this row's test on it — that sentence names the case and stops, and no
 * specimen of it is printed or labeled anywhere in the file.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every wrong ANALYSIS in the tutor's own prose is
 * explicitly labeled WRONG, with the CORRECT version beside it: a tutor reads
 * those lines aloud, and an unlabeled "Baking ends in -ing, so it is a gerund
 * every time" would be handed to the student as a model. The only unlabeled
 * wrong answers in this file are the MCQ distractors the three try_yourself
 * items ask the student to reject, which is exactly what those items are for;
 * each one is then named in that item's hints or in the misconception check.
 * No contraction appears anywhere in this file.
 *
 * CLAIM LEDGER: none required. Every sentence offered for labeling in this
 * file is an invented specimen about invented students, which is true by
 * construction, so there is no factual claim about the world to verify. The
 * grammatical claims are the ones that had to be checked, and each one is
 * stated as a job test rather than as a rule about an ending. Rows whose
 * passages are INFORMATIONAL (all of Units 3 and 4, and any other row needing
 * nonfiction) must carry the four-column claim ledger described in the fan-out
 * contract, with every row marked REAL-WORLD or STIPULATED, instead of this
 * line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U5_GERUNDS_AND_PARTICIPLES: LessonPlan = {
  id: 'evelyn.ms.m8ela.gerunds-and-participles.v1',
  title: 'Gerunds & Participles',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.gerunds-and-participles',
      standard: 'M8ELA-5.1',
      description:
        'Explain the function of a gerund (an -ing verb form doing a NOUN\'s job: "Swimming is my favorite") and a participle (an -ing or -ed verb form doing an ADJECTIVE\'s job: "the rattling window", "the broken chain") in a particular sentence, and tell the two apart by the job test (CCSS L.8.1a).',
    },
  ],
  prerequisites: ['m8ela.choosing-the-medium-for-an-idea'],
  followUps: ['m8ela.infinitives-and-verbal-phrases'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one -ing word takes three different jobs in three sentences, so the ending cannot be the thing that names it.',
      script:
        'Three sentences a drummer could write about the same twenty minutes of a band concert. "The whole row behind my family was clapping before the last song even ended." "Clapping between the movements is the one thing the conductor asked the audience not to do." "One clapping parent in the third row got a look from every eighth grader on stage." The word "clapping" is spelled exactly the same way in all three, and it is doing a different job every time. In the first it carries the action. In the second it names a thing, the way a noun does. In the third it describes a parent, the way an adjective does. You already know how to do this, because you already ask what job a word is doing in the sentence in front of you before you name it. What you do not have yet is the two names for that -ing word when it is not carrying the action, and the one test that tells you which of the two you are looking at. That is today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-jobs-one-test',
      kind: 'concept',
      goal: 'Install the verbal idea, the two-question job test, the gerund and participle definitions with their substitution checks, and the helping-verb lookalike that has to be cleared first.',
      keyIdeas: [
        'AN -ING OR -ED WORD IS NOT AUTOMATICALLY THE VERB, AND IT IS NOT AUTOMATICALLY ANYTHING ELSE EITHER. Before you name it, check whether it is carrying the action of the sentence at all. If a helping verb sits directly in front of it and the two work as a pair, the -ing word IS the verb: in "Two of us were sweeping the hallway," the verb is "were sweeping," and there is nothing else to name. If no helper sits in front of it, the word has been let out of the verb slot to do somebody else\'s job. A verb form doing another part of speech\'s job is called a VERBAL, and there are exactly two of them in this lesson.',
        'A GERUND IS AN -ING FORM DOING A NOUN\'S JOB. It names a thing. "Sweeping the hallway took twenty minutes" names what took twenty minutes, exactly the way "The job took twenty minutes" would. That gives you a check you can run: swap a plain noun, or the word "it," into the same slot. If the sentence still stands up, the -ing word was doing a noun\'s job, so it is a gerund. Gerunds sit wherever nouns sit, which is why the seat is never proof on its own: in the subject, after a verb ("Nobody minded sweeping"), or after a preposition such as for, after or without ("thanked us for sweeping").',
        'A PARTICIPLE IS AN -ING OR AN -ED FORM DOING AN ADJECTIVE\'S JOB. It describes a noun, and it answers which one or what kind about that noun: "the rattling window," "a chipped mug," "the students waiting by the door." The check is to find the noun the word is attached to and then test the relationship between them. With an -ing participle the noun is doing that action: the window rattles. With an -ed participle the action was done to the noun: somebody chipped the mug. If you cannot name a noun that the word is describing, it is not a participle.',
        'THE JOB TEST IS TWO QUESTIONS IN ORDER, AND THE ENDING ANSWERS NEITHER OF THEM. First: is a helping verb sitting directly in front of this word, so that the two of them carry the action? If yes, stop, because it is the verb. If no, ask the second question: is this word naming a thing, or is it describing a noun? Naming a thing makes it a gerund. Describing a noun makes it a participle. WRONG: "An -ing word is a gerund and an -ed word is a verb." CORRECT: "An -ing word is a gerund only when it is naming a thing, and an -ed word is a participle when it is describing a noun."',
        '-ED PARTICIPLES COME FROM A SHAPE YOU ALREADY HAVE. The third shape of a verb, the one that cannot stand alone as a verb, is called the past participle: broken, torn, chipped, printed. Standing with a noun it does an adjective\'s job with no helper at all, and it is the same word doing the same describing job as an -ing participle: "the broken chain," "a torn banner," "the printed programs." An -ed word sitting after a form of "be" is a different arrangement and a later lesson; every -ed word this lesson asks you to label is standing with the noun it describes rather than following a helping verb.',
        'THE SAME WORD TAKES A DIFFERENT JOB IN THE NEXT SENTENCE, SO THE SEAT IS A CLUE AND NEVER A RULE. Two -ing words can sit in the same place in two sentences and still be doing different jobs. In "Dev finished sanding the last shelf," sanding names what Dev finished, so it is a gerund. In "Dev found his brother sanding the last shelf," sanding tells you what his brother was doing, so it describes the noun brother and is a participle. Read the whole sentence, ask which of the two jobs the word is doing, and let that answer decide the name.',
      ],
      vocabulary: [
        { term: 'verbal', definition: 'a verb form that is doing another part of speech\'s job in a sentence instead of carrying the action; the two verbals in this lesson are the gerund and the participle.' },
        { term: 'gerund', definition: 'an -ing verb form doing a noun\'s job, as in "Sweeping the hallway took twenty minutes"; a plain noun fits the same slot.' },
        { term: 'participle', definition: 'an -ing or -ed verb form doing an adjective\'s job, describing a noun and answering which one or what kind, as in "the rattling window."' },
        { term: 'present participle', definition: 'the -ing form of a verb when it is describing a noun that is doing that action, as in "the rattling window."' },
        { term: 'past participle', definition: 'the third shape of a verb (broken, torn, chipped, printed), the one that cannot stand alone as a verb; standing with a noun it describes that noun.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-job-three-times',
      kind: 'worked_example',
      problem:
        'Name the job the marked word is doing in each sentence, and label it a gerund, a participle, or part of the verb.\n\n(1) "Baking" in: "Baking four dozen cupcakes the night before the fundraiser took Amara until midnight."\n(2) "burned" in: "A burned tray sat on the stove until somebody dealt with it in the morning."\n(3) "baking" in: "Amara was baking the second batch at eleven o\'clock."',
      steps: [
        'Sentence 1, first question. Is a helping verb sitting directly in front of "Baking"? No. The sentence opens with the word, and the verb of the sentence is "took". So "Baking" is a verbal, and the second question has to decide which one.',
        'Sentence 1, second question. Is the word naming a thing or describing a noun? Ask what took Amara until midnight: baking four dozen cupcakes did. Now run the swap check. "The job took Amara until midnight" stands up, so a plain noun fits the same slot. A noun\'s job means a GERUND.',
        'Sentence 2, first question. Is a helping verb sitting in front of "burned"? No. The verb of the sentence is "sat", because that is the word carrying what the tray did. So "burned" is a verbal too, and again the second question decides.',
        'Sentence 2, second question. The word is not naming anything. It is telling you which tray, so it is attached to the noun "tray". Test the relationship: somebody burned the tray, which means the action was done to the noun. An -ed word doing an adjective\'s job is a PARTICIPLE.',
        'Sentence 3, first question, and this one stops at the first question. The word "was" sits directly in front of "baking", and the two of them carry the action of the sentence together. That makes "was baking" the verb, so "baking" is not a verbal at all here. Notice what settled it: not the ending, which is identical to sentence 1, but the helper standing in front.',
        'Read the three verdicts together: gerund, participle, part of the verb. The word "baking" appears in sentences 1 and 3 spelled exactly the same way and gets two different answers. WRONG: "Baking ends in -ing, so it is a gerund every time." CORRECT: "Baking is a gerund in the first sentence, where it names what took Amara until midnight, and part of the verb in the third sentence, where the helper was stands in front of it."',
      ],
      answer:
        '(1) "Baking" is a gerund: it names what took Amara until midnight, and a plain noun fits the same slot. (2) "burned" is a participle: it tells you which tray, and the burning was done to the tray. (3) "baking" is part of the verb "was baking", because the helper "was" sits directly in front of it and the two carry the action together.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-seat-different-job',
      kind: 'worked_example',
      problem:
        'The word "loading" sits in nearly the same place in all three sentences. Name the job it is doing in each, and say what settled it.\n\nSentence A: "Ravi finished loading the bins into the van before anybody else showed up."\nSentence B: "Ravi found his sister loading the bins into the van before anybody else showed up."\nSentence C: "Ravi was loading the bins into the van before anybody else showed up."',
      steps: [
        'Run the first question on all three at once, because it clears one of them immediately. In A the verb of the sentence is "finished". In B the verb is "found". In neither of those does a helping verb sit in front of "loading", so in A and B the word is a verbal. In C the word "was" sits directly in front of it, so stop there: "was loading" is the verb of sentence C, and there is no verbal to name.',
        'Sentence A, second question. What did Ravi finish? He finished loading the bins. The word is naming the thing he finished, so run the swap check: "Ravi finished the job before anybody else showed up" stands up fine. A plain noun fits the slot. Verdict: GERUND.',
        'Sentence B, second question. What did Ravi find? He found his sister. So what is "loading" adding? It tells you what his sister was doing, which means it is attached to the noun "sister" and describing her. Run the matching check for a participle: try an adjective in the same seat. "Ravi found his sister asleep" stands up fine, so an adjective fits where "loading" is. Verdict: PARTICIPLE.',
        'Confirm sentence B a second way, since it is the one students miss. An -ing participle describes a noun that is doing that action, and the sister is the one doing the loading. That relationship holds, which is what a participle needs.',
        'Now name the trap directly. WRONG: "Loading sits right after the verb in both A and B, so it has the same job in both." CORRECT: "In sentence A loading names what Ravi finished, and in sentence B loading describes his sister, so the same word in nearly the same seat is a gerund the first time and a participle the second."',
        'Read the three verdicts together: gerund, participle, part of the verb. Nothing about the spelling changed across the three sentences, and nothing about the seat changed much either. The two questions changed the answer, which is the whole point of asking them in order.',
      ],
      answer:
        'In sentence A "loading" is a gerund: it names what Ravi finished, and a plain noun fits the same slot. In sentence B "loading" is a participle: it describes his sister, who is the one doing the loading, and an adjective fits the same slot. In sentence C "loading" is part of the verb "was loading", because the helper "was" sits directly in front of it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-gerund',
      kind: 'try_yourself',
      problem: 'In which sentence is the word "waiting" a GERUND — an -ing word doing a noun\'s job?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The waiting crowd pressed up against the barricade outside the stage door.' },
        { id: 'b', text: 'Half of the eighth grade was waiting outside the gym for the doors to open.' },
        { id: 'c', text: 'Nobody in the front of the line minded waiting once somebody propped the doors open.', correct: true },
        { id: 'd', text: 'Nadia spotted her cousin waiting near the ticket table with two folded programs.' },
      ],
      expectedAnswer: 'Nobody in the front of the line minded waiting once somebody propped the doors open.',
      hints: [
        'Do not sort these by the ending, because all four contain the same -ing word. Run the two questions from the lesson on each sentence, in order.',
        'One of these has a helping verb sitting directly in front of the word, which makes it part of the verb. Two others attach it to a noun and tell you which crowd or which cousin. The one you want is the sentence where the word names a thing, so that a plain noun would fit the same slot.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-words-one-sentence',
      kind: 'try_yourself',
      problem:
        'Read this sentence, then choose the statement that correctly names the job of both verb forms in it.\n\n"Fixing the cracked screen cost more than Mateo paid for the whole phone in the first place."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Fixing" is a participle, because it is the -ing word describing the screen, and "cracked" is a gerund, because it names the damage that the phone has.' },
        { id: 'b', text: 'Both words are gerunds, because both are verb forms that have been moved out of the verb slot and into the front half of the sentence.' },
        { id: 'c', text: '"Fixing" is the verb of the sentence, because it is the action the whole sentence is built around, and "cracked" is a participle, because it describes the screen.' },
        { id: 'd', text: '"Fixing" is a gerund, because it names the thing that cost the money, and "cracked" is a participle, because it tells you which screen Mateo had.', correct: true },
      ],
      expectedAnswer: '"Fixing" is a gerund, because it names the thing that cost the money, and "cracked" is a participle, because it tells you which screen Mateo had.',
      hints: [
        'Find the verb of the sentence first. Once you know which word is carrying the action, you know that neither of the other two verb forms can be it.',
        'Ask what the sentence says cost the money, and ask what "cracked" tells you about the screen. One of those two questions is a noun question and the other is an adjective question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-participle',
      kind: 'try_yourself',
      problem: 'In which sentence is an -ing or an -ed word working as a PARTICIPLE — a word doing an adjective\'s job?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The stage crew set the last flat down beside a chipped column left over from last spring.', correct: true },
        { id: 'b', text: 'Two of the stagehands were painting the back wall of the set when the bell rang for lunch.' },
        { id: 'c', text: 'Ms. Okafor thanked the whole crew for building the entire set in a little under two weeks.' },
        { id: 'd', text: 'Hauling the risers up from the basement added a full hour to the crew\'s Saturday morning.' },
      ],
      expectedAnswer: 'The stage crew set the last flat down beside a chipped column left over from last spring.',
      hints: [
        'A participle has to be attached to a noun. Go through the sentences and ask, for each -ing or -ed word, whether it is describing a noun standing next to it, naming a thing, or carrying the action with a helper in front of it.',
        'Two of these sentences use an -ing word to name a thing, which makes it the other verbal, and one uses a helping verb with an -ing word, which makes it the verb. Look for the word that answers which one or what kind about the noun beside it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-the-ending-decides',
      kind: 'misconception_check',
      question:
        'Two students label a word in the same pair of sentences. Sentence 1: "The cheering section stayed on its feet for the whole fourth quarter." Sentence 2: "A cracked lens made half of the yearbook photos useless." The first student says: "Cheering is a gerund, because it ends in -ing." The second student says: "Cracked is the verb of sentence 2, because it is an action in the past." What has gone wrong with each label?',
      commonErrors: [
        {
          answer: 'Cheering is a gerund, because it ends in -ing.',
          misconception:
            'Naming the word from its ending instead of from its job. The -ing ending is real and easy to see, and the student has heard that -ing words can be gerunds, so the ending becomes the whole test and the sentence never gets read.',
          correctsTo:
            'Run the two questions. First, is a helping verb sitting directly in front of it? No, and the verb of the sentence is "stayed". So "cheering" is a verbal, and the second question decides which one. Is it naming a thing, or describing a noun? It is telling you which section, and the section is the thing doing the cheering, so it is attached to the noun and doing an adjective\'s job. That makes it a PARTICIPLE. A gerund would have to name something: in "Cheering for four straight quarters wrecked my voice," the same word names what wrecked my voice, and there it is a gerund.',
        },
        {
          answer: 'Cracked is the verb of sentence 2, because it is an action in the past.',
          misconception:
            'Treating every -ed word as a past-tense verb. The student is right that "cracked" is a verb in plenty of other sentences, and wrong that the ending settles it here, because this sentence already has a verb and it is not that word.',
          correctsTo:
            'Find the verb of the sentence first. Ask what happened: something made half of the photos useless, so the verb is "made". Now ask what "cracked" is doing. It stands with the noun "lens" and tells you which lens, and the cracking is what was done to that lens. An -ed word doing an adjective\'s job is a PARTICIPLE. The same word does carry the action in a sentence such as "Somebody cracked the lens on the second day of the trip," where nothing else is doing that work.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A verb form doing another part of speech\'s job is a verbal. Ask two questions in order: is a helping verb sitting directly in front of it, and if not, is the word naming a thing or describing a noun?',
        'If a helping verb sits directly in front of the -ing word and the two carry the action together, the -ing word is part of the verb and there is no verbal to name: "were sweeping", "was baking".',
        'A GERUND is an -ing form doing a noun\'s job. It names a thing, and a plain noun or the word "it" fits the same slot: "Sweeping the hallway took twenty minutes", "Nobody minded sweeping".',
        'A PARTICIPLE is an -ing or an -ed form doing an adjective\'s job. It describes a noun and answers which one or what kind. With -ing the noun is doing the action ("the rattling window"); with -ed the action was done to the noun ("a chipped mug", "the broken chain").',
        'The ending decides nothing and the seat decides nothing. WRONG: "An -ing word is a gerund and an -ed word is a verb." CORRECT: "An -ing word is a gerund only when it is naming a thing, and an -ed word is a participle when it is describing a noun."',
        'The same word takes a different job in the next sentence: in "Dev finished sanding the last shelf" sanding names what Dev finished, and in "Dev found his brother sanding the last shelf" sanding describes his brother.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Gerunds & Participles' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
