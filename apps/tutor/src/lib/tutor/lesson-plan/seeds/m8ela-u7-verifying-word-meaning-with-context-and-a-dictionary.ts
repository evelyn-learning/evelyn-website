/**
 * Grade 8 ELA — Vocabulary in Context & Word Study: Verifying Word Meaning
 * with Context & a Dictionary.
 *
 * PROCEDURE-LED (the fan-out contract sorts row 7.1 here). One repeatable
 * move runs the whole lesson, in four steps that never change order: decide
 * what JOB the word does in this sentence, cross out every sense group whose
 * part-of-speech label does not match that job, let the sentence choose among
 * the senses that are left, and then SUBSTITUTE the dictionary wording back in
 * and read the whole sentence to confirm (CCSS L.8.4c, L.8.4d). Four traps
 * this plan is built to kill: taking sense 1 because it is printed first;
 * taking the meaning you use every day because it is the one you already
 * have; taking a sense that is right about the topic but sits under the wrong
 * label; and stopping at the first sense that sounds close instead of
 * substituting it back, which is the step that catches the other three.
 *
 * SCOPE GUARD: Grade 8 row 7.1. Given a word with several dictionary senses
 * (a short dictionary entry printed in the item), use the sentence's context
 * AND the word's part of speech in that sentence to select the one sense that
 * fits, then verify the choice by substituting it back — the reference-and-
 * verify step L.8.4c/d add. Builds on `m7ela-u7-context-clues.ts` (L.7.4a:
 * definition, synonym, contrast, and example clues; confirm by substitution),
 * which never involves a multi-sense entry or part-of-speech disambiguation.
 * G8 does not re-teach the four clue types. Stops short of HS
 * `engl-u4-commonly-confused-words.ts` (L.9-10.1/2: the HS confusable pairs);
 * G7's own pairs are in `m7ela-u7-commonly-confused-words.ts` and are not
 * repeated. DELIBERATELY EXCLUDED: the four context-clue types and their
 * signal words — none of the words definition clue, synonym clue, contrast
 * clue, antonym clue or example clue appears in this file's body, and no step
 * or hint tells the student to hunt for a signal word; taking a word apart
 * into a root, a prefix or a suffix, which is `m7ela-u7-roots-prefixes-and-
 * suffixes.ts` below and Grade 8 row 7.2 beside — no sense in this file is
 * reached by breaking a word into pieces; confusable PAIRS, which are
 * `m7ela-u7-commonly-confused-words.ts`'s and HS
 * `engl-u4-commonly-confused-words.ts`'s — every item here compares senses of
 * ONE word and no two different words are set against each other anywhere;
 * connotation, polarity and degree, which are
 * `m7ela-u7-connotation-and-denotation.ts`'s and row 7.4's — no sense in this
 * file is ranked as positive, negative, milder or stronger; and a word
 * carrying two meanings AT ONCE, which is row 7.3's pun — this row picks one
 * sense and rejects the rest. Nothing in any entry printed here is a
 * pronunciation, a word history, a usage label or a dictionary example
 * sentence; every entry is a part-of-speech label plus numbered definitions.
 * DELIBERATELY ALLOWED, because the G7 row below and rows 7.2 and 7.4 sit
 * close: the substitution check runs in two keyIdeas, in both worked examples,
 * in the second hint of all three items, in both halves of the misconception
 * check and in a recap line, because L.8.4d's verify step IS the second half
 * of this row — what gets substituted here is the DICTIONARY's own wording,
 * never a guess assembled from the words around the target, and the G7 routine
 * that produced such a guess is neither named nor run; the labels noun, verb,
 * adjective and adverb are used as the words a dictionary prints and as the
 * "what job is this word doing" question the student already has from
 * `m7ela-u5-parts-of-speech.ts`, and no keyIdea, step or hint teaches the parts
 * of speech themselves — the single place the noun-and-verb difference is
 * demonstrated at all, keyIdea 2, spends two sentences on one word and points
 * back to a question the student already asks; and the
 * sentence around the word does the choosing inside a label group, because a
 * label almost never leaves exactly one sense standing — that is this row's
 * own second step, not a return to the clue lesson.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item, and every person, market, garden and school in it is
 * invented. This course carries no passage machinery — no passageId, no shared
 * texts — so each question must be solvable from the words printed inside it,
 * which is why every item that asks about an entry prints that entry in full.
 * Every target word is a real English word and every numbered sense printed
 * for it is a real sense of that word, checked in a dictionary before it was
 * written down; an invented sense, or a real word given a meaning it does not
 * have, is the one unrecoverable defect in a lesson of this kind. Every phrase
 * this file quotes from one of its own sentences appears in that sentence in
 * the same words, in the same order, with the same case. No contraction
 * appears anywhere in this file, in the tutor's voice or in reported speech.
 * Every wrong sense the tutor's own prose tries out is labeled WRONG, and the
 * CORRECT version of the same sentence follows it: in worked example 2 the two
 * WRONG substitutions of one sentence are both answered by the single CORRECT
 * substitution in the step that closes the sequence. The only unlabeled wrong
 * senses in this file are the MCQ distractors the three try_yourself items ask
 * the student to reject, which is exactly what those items are for, and each of
 * those is named in that item's hints. The WRONG and CORRECT lines are
 * SUBSTITUTIONS, not quotations: they carry the item's own sentence with the
 * target word replaced by a definition, which is the move the lesson teaches,
 * and every word around the replacement is the source's own, in order.
 *
 * CLAIM LEDGER (dictionary entries are claims about the real world):
 *   Claim                                  | Where             | Kind        | Grounds
 *   "account" has the senses: a report of  | hook script       | REAL-WORLD  | Standard senses of
 *   something that happened; a record of   |                   |             | the word; checked in
 *   money kept at a bank; an arrangement   |                   |             | a dictionary before
 *   with an online service; and, as a      |                   |             | writing.
 *   verb, "account for", to give the       |                   |             |
 *   reason or explanation for something    |                   |             |
 *   "coast" is a noun meaning the land     | concept keyIdea 2 | REAL-WORLD  | Standard senses;
 *   beside the sea and a verb meaning to   |                   |             | checked.
 *   move along without using power         |                   |             |
 *   "court" is a noun meaning both a place | concept keyIdea 4 | REAL-WORLD  | Standard senses;
 *   where legal cases are heard and a      |                   |             | checked.
 *   marked area for playing a game         |                   |             |
 *   Dictionaries group a word's senses     | concept keyIdeas  | REAL-WORLD  | How a dictionary
 *   under part-of-speech labels and number | 1 and 6           |             | entry is built;
 *   them inside each group, and different  |                   |             | long-settled
 *   dictionaries order the senses inside a |                   |             | lexicographic
 *   group differently, some putting the    |                   |             | practice, and stated
 *   most common first and some the oldest  |                   |             | as a range rather
 *   first                                  |                   |             | than as one rule.
 *   The four senses printed for "stall"    | worked example 1  | REAL-WORLD  | Standard senses;
 *   (market booth; barn compartment; to    |                   |             | checked.
 *   stop running suddenly; to delay on     |                   |             |
 *   purpose)                               |                   |             |
 *   The four senses printed for "strain"   | worked example 2  | REAL-WORLD  | Standard senses;
 *   (a pulling force; to pour through a    |                   |             | checked.
 *   sieve; to injure a muscle; to make a   |                   |             |
 *   great effort)                          |                   |             |
 *   The four senses printed for "pitch"    | try-1 entry and   | REAL-WORLD  | Standard senses;
 *   (how high or low a sound is; a         | all four choices  |             | checked. Every
 *   persuading speech; to throw to the     |                   |             | distractor is a real
 *   batter; to put up a tent)              |                   |             | sense, so no false
 *                                          |                   |             | fact reaches a
 *                                          |                   |             | student who picks it.
 *   The four senses printed for "draft"    | try-2 entry and   | REAL-WORLD  | Standard senses;
 *   (a current of cool air; an early       | all four choices  |             | checked. Same note on
 *   version of writing; to write an early  |                   |             | the distractors.
 *   version; to choose someone for a team  |                   |             |
 *   or an armed force)                     |                   |             |
 *   The four senses printed for "address"  | try-3 entry and   | REAL-WORLD  | Standard senses;
 *   (where a building stands or mail       | all four choices  |             | checked. Same note on
 *   should go; to speak formally to a      |                   |             | the distractors.
 *   gathered group; to give attention to a |                   |             |
 *   problem and begin to deal with it; to  |                   |             |
 *   write the destination on a package)    |                   |             |
 *   The four senses printed for "train"    | misconception     | REAL-WORLD  | Standard senses;
 *   (railroad cars behind an engine; the   | check             |             | checked. The
 *   cloth trailing a formal dress; to      |                   |             | gardening sense of
 *   teach a skill by practice; to make a   |                   |             | "train" is long
 *   plant grow a certain way by tying it   |                   |             | established.
 *   to a support)                          |                   |             |
 *   Rosa, the north row of stalls, the     | worked examples,  | STIPULATED  | Invented for the
 *   delivery van, Dev and the charity      | try-1, try-2,     |             | items. Each detail is
 *   walk, the group at the clearing, Ms.   | try-3,            |             | used only inside its
 *   Vance and her margin questions, the    | misconception     |             | own sentence and
 *   principal and the east hallway, Mr.    | check             |             | nothing elsewhere in
 *   Abara and the bean vines               |                   |             | the file contradicts
 *                                          |                   |             | it. No figure and no
 *                                          |                   |             | statistic is claimed
 *                                          |                   |             | about the world.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U7_VERIFYING_WORD_MEANING_WITH_CONTEXT_AND_A_DICTIONARY: LessonPlan = {
  id: 'evelyn.ms.m8ela.verifying-word-meaning-with-context-and-a-dictionary.v1',
  title: 'Verifying Word Meaning with Context & a Dictionary',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary',
      standard: 'M8ELA-7.1',
      description:
        'Given a word with several dictionary senses, use the sentence\'s context AND the word\'s part of speech in that sentence to select the one sense that fits, then verify the choice by substituting it back — the reference-and-verify step (CCSS L.8.4c, L.8.4d).',
    },
  ],
  prerequisites: ['m8ela.ellipsis-for-a-pause-or-an-omission'],
  followUps: ['m8ela.word-families-from-a-shared-root'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that looking a word up is where the work starts, not where it ends, because a multi-sense entry hands back four answers and only one of them is yours.',
      script:
        'The assignment sheet for the history unit says: choose one invention and account for its spread across the region. You know every word on that line, and you still do not know what it is asking, because the only "account" you use is the one you log into. So you look it up, and the entry gives you four things at once. A report of something that happened. A record of the money a person keeps at a bank. An arrangement that lets someone use an online service. And, further down under a different label, account for, which means to give the reason or explanation for something. Four meanings, one word, and the assignment only makes sense with the last one. Notice what did not help you: the numbers. The one you needed was not first, and the one you already had was not it either. Today you get a way of choosing that is not guessing and is not taking whichever sense you happen to know. It has four steps, the last step catches your own mistakes, and it works on any entry you will ever open.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-step-dictionary-routine',
      kind: 'concept',
      goal: 'Install the four-step routine: find the job the word does, cross out the label groups that do not match, let the sentence choose among what is left, and substitute the dictionary wording back in to confirm.',
      keyIdeas: [
        'AN ENTRY IS SORTED BEFORE IT IS NUMBERED. A word with several meanings does not hand you a flat list of them. The entry groups its senses under part-of-speech labels — noun, verb, adjective, adverb — and numbers them inside each group. So the first thing to look for in an entry is not sense 1. It is the label, because the label is the only part of the entry that can be settled from your sentence before you have read a single definition.',
        'STEP ONE: DECIDE WHAT JOB THE WORD DOES IN YOUR SENTENCE. You already ask what job a word is doing when you sort parts of speech, and this is the same question pointed at one word. "The road follows the coast for six miles" uses coast to name a thing, so there it is a noun. "She let the bike coast down the last hill" uses coast to name what the bike does, so there it is a verb. Same five letters, two different jobs, and the entry keeps those two jobs in separate groups.',
        'STEP TWO: CROSS OUT EVERY GROUP WHOSE LABEL DOES NOT MATCH. This step takes about two seconds and throws away most of the entry, which is why skipping it costs so much. A sense can be exactly right about the topic and still be the wrong answer, because it sits under the wrong label. If your sentence needs an action and the sense you like is a thing, that sense is out, however well it fits the subject you are reading about.',
        'STEP THREE: LET THE SENTENCE CHOOSE AMONG WHAT IS LEFT. A label almost never leaves exactly one sense standing, so the sentence has to do the rest. "The team practiced free throws on the far court until six" leaves both court senses in play, because both of them are nouns; free throws are what settle it. Read the whole sentence, not just the words touching the target, and ask which of the surviving senses that sentence could be describing.',
        'STEP FOUR: SUBSTITUTE THE DICTIONARY WORDING BACK IN AND READ THE WHOLE SENTENCE. Take the definition you picked, put it into the sentence in place of the word, and read the sentence from the beginning. You are allowed to bend the wording so the grammar fits, because a definition is written to stand alone and your sentence is not; what you are checking is whether the MEANING still holds, not whether the result comes out elegant. If it holds, you are done. If the sentence goes strange, you have the wrong sense.',
        'WHEN THE CHECK FAILS, BACK UP INSIDE THE SAME LABEL. A failed substitution does not send you back to the top of the entry. Your reading of the job was settled by grammar and is almost certainly right, so the next candidate is the next sense under the SAME label, not a sense from a different group. And the numbers themselves are not a ranking of what you need: dictionaries differ about what goes first, some putting the most common sense at the top and some the oldest, so sense 1 is where a sense sits in that book, never a promise that it is yours.',
      ],
      vocabulary: [
        { term: 'entry', definition: 'everything a dictionary prints for one word: its part-of-speech labels and all of its numbered senses.' },
        { term: 'sense', definition: 'one numbered meaning inside an entry. A word with several senses has one entry and many meanings, which is why a lookup does not end the job.' },
        { term: 'part-of-speech label', definition: 'the word noun, verb, adjective or adverb printed above a group of senses, telling you what job those senses do in a sentence.' },
        { term: 'the substitution check', definition: 'putting the definition you picked into the sentence in place of the word and reading the whole sentence to see whether the meaning still holds.' },
        { term: 'multiple-meaning word', definition: 'a word that carries more than one unrelated meaning, so that the sentence around it, not the word itself, decides which meaning is in play.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine-three-times',
      kind: 'worked_example',
      problem:
        'Here is one entry and three sentences. For each sentence, name the sense of "stall" it uses.\n\nENTRY: stall\n(noun) 1. a stand or booth where goods are sold at a market\n(noun) 2. a compartment in a barn where one animal is kept\n(verb) 3. to stop running suddenly, as an engine or a vehicle does\n(verb) 4. to delay on purpose in order to gain a little time\n\nSENTENCE A: "Rosa\'s poster was not finished, so she tried to stall her brother at the front door with one more question about his math homework."\nSENTENCE B: "Every stall along the north row had sold out of peaches before ten o\'clock."\nSENTENCE C: "The delivery van stalled twice on the hill behind the school."',
      steps: [
        'Sentence A, step one. What job does the word do? It comes straight after "tried to", so it names an action Rosa performs. That is a verb. Step two: cross out the noun group, senses 1 and 2, and do not look at them again. They may be perfectly good meanings of stall; they are not available here.',
        'Sentence A, step three. Two verb senses are left. Sense 3 is something an engine does, and Rosa is not an engine; the thing she is doing it to is her brother. Sense 4, delaying on purpose, fits a person keeping someone at a door with an extra question. Pick sense 4.',
        'Sentence A, step four. Substitute and read the whole sentence: Rosa tried to delay her brother on purpose, to gain a little time, at the front door with one more question. The wording bends a little, because the definition was written to stand alone, and the meaning holds exactly. Sense 4 is confirmed.',
        'Sentence B, all four steps. The word comes after "Every" and is followed by "along the north row", so it names a thing: a noun. Cross out the verb group. Two noun senses are left, and the sentence says the thing "had sold out of peaches", which is what a market booth does and not what a barn compartment does. Substitute: every stand or booth where goods are sold had sold out of peaches before ten o\'clock. The meaning holds. Sense 1.',
        'Sentence C, all four steps. The word carries the past-tense ending and is what the van did, so it is a verb; the noun group is out. Two verb senses are left, and the doer is a delivery van, which is a vehicle. Substitute sense 3: the delivery van stopped running suddenly, twice, on the hill behind the school. The meaning holds. Sense 3. Try the other one to see the check work: WRONG: "The delivery van delayed on purpose in order to gain a little time twice on the hill behind the school." A van cannot have a purpose, so the substitution fails and sense 4 is out. CORRECT: sense 3.',
        'Read the three verdicts together: A is sense 4, B is sense 1, C is sense 3. The label settled half of each question before any definition was read, and the sentence settled the other half. Notice that sentence 1 was never the answer once, and that the two sentences using the verb group did not use the same verb sense.',
      ],
      answer:
        'Sentence A uses sense 4, to delay on purpose: the word follows "tried to", so it is a verb, and a person keeping her brother at the door with an extra question is delaying him. Sentence B uses sense 1, a market booth: the word follows "Every", so it is a noun, and the thing "had sold out of peaches". Sentence C uses sense 3, to stop running suddenly: the word is what the delivery van did, and a van is a vehicle.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-substitution-catches-the-wrong-sense',
      kind: 'worked_example',
      problem:
        'Run the routine on this one, and notice what the last step is for.\n\nENTRY: strain\n(noun) 1. a force that pulls or stretches something\n(verb) 2. to pour a mixture through a sieve so the liquid runs out and the solids stay behind\n(verb) 3. to injure a muscle by stretching it too far\n(verb) 4. to make a great effort with the body or the mind\n\nSENTENCE: "By the last mile of the charity walk Dev had to strain to keep up with the group ahead of him."',
      steps: [
        'Step one and step two. The word follows "had to", so it names an action Dev performs: a verb. Cross out sense 1, the only noun, and three senses are left.',
        'Step three, and here is where the sentence gets ahead of you. The first sense most readers reach for is sense 3, because strain and muscle travel together so often that the pair arrives before the sentence does. Dev is walking a long way, muscles are involved, and sense 3 sits under the right label. It looks safe.',
        'Step four is the whole reason this routine has four steps. Substitute sense 3 and read the sentence: WRONG: "By the last mile of the charity walk Dev had to injure a muscle by stretching it too far to keep up with the group ahead of him." That says Dev was required to hurt himself, which is not what the sentence says at all. The substitution failed, so the sense is wrong, however comfortable it felt.',
        'Now back up correctly. A failed check does not send you to the top of the entry, because your reading of the job has not changed: the word is still a verb. Move to the next sense in the same group. Sense 2, pouring through a sieve, fails in the first four words. WRONG: "By the last mile of the charity walk Dev had to pour a mixture through a sieve to keep up with the group ahead of him."',
        'That leaves sense 4. Substitute it: CORRECT: "By the last mile of the charity walk Dev had to make a great effort with his body to keep up with the group ahead of him." The definition says "with the body or the mind" and the sentence takes only the body half, which is the ordinary bending of wording that step four allows. The meaning holds, and sense 4 is confirmed.',
        'The lesson of this one is the order of your own certainty. You were sure about the label and it held. You were only comfortable about the sense, and comfort is what step four exists to test. When the check fails, distrust the sense, not the label.',
      ],
      answer:
        'Sense 4, to make a great effort with the body or the mind. The word follows "had to", so it is a verb and the noun sense is out. The familiar sense 3, injuring a muscle, sits under the right label but fails the substitution, because the sentence does not say Dev had to hurt himself. Sense 2 fails immediately. Sense 4 substitutes cleanly: Dev had to make a great effort with his body to keep up.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pitch-the-tents',
      kind: 'try_yourself',
      problem:
        'Read the entry and the sentence, then choose the sense of "pitch" the sentence uses.\n\nENTRY: pitch\n(noun) 1. how high or how low a sound is, the way one note differs from another\n(noun) 2. a short speech meant to persuade someone to buy something or agree to a plan\n(verb) 3. to throw a ball toward the batter, which is one player\'s job in baseball\n(verb) 4. to put up a tent or a shelter and fix it in place on the ground\n\nSENTENCE: "By the time the group reached the clearing it was almost dark, so they hurried to pitch the two tents before the last of the light went."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'to put up a tent or a shelter and fix it in place on the ground', correct: true },
        { id: 'b', text: 'how high or how low a sound is, the way one note differs from another' },
        { id: 'c', text: 'a short speech meant to persuade someone to buy something or agree to a plan' },
        { id: 'd', text: 'to throw a ball toward the batter, which is one player\'s job in baseball' },
      ],
      expectedAnswer: 'to put up a tent or a shelter and fix it in place on the ground',
      hints: [
        'Start with the job. The word sits right after "hurried to", so ask whether the sentence needs a thing there or an action, and then look only at the senses printed under the label that matches.',
        'It is an action, so both senses that name a thing are out no matter how familiar they are. Two action senses are left, and only one of them can be done to a tent. Substitute each of the two into the sentence in place of the word and read the whole sentence before you choose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-draft-handed-back',
      kind: 'try_yourself',
      problem:
        'Read the entry and the sentence, then choose the sense of "draft" the sentence uses.\n\nENTRY: draft\n(noun) 1. a current of cool air moving through a room, often from a window or a door\n(noun) 2. an early version of a piece of writing, meant to be changed before it is finished\n(verb) 3. to write an early version of something before the final one is due\n(verb) 4. to choose someone from a group to join a team or an armed force\n\nSENTENCE: "Ms. Vance handed back my draft on Thursday with three questions in the margin and said the ending still needed work."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'a current of cool air moving through a room, often from a window or a door' },
        { id: 'b', text: 'an early version of a piece of writing, meant to be changed before it is finished', correct: true },
        { id: 'c', text: 'to write an early version of something before the final one is due' },
        { id: 'd', text: 'to choose someone from a group to join a team or an armed force' },
      ],
      expectedAnswer: 'an early version of a piece of writing, meant to be changed before it is finished',
      hints: [
        'Find the job before you weigh any meaning. The word comes right after "my" and is the thing that was handed back, so ask whether the sentence needs a thing here or an action.',
        'A thing that can be handed back with questions in the margin is a noun, so both action senses are out — including the one whose meaning is closest to the right idea, which is the trap in this item. Two noun senses are left. Put each one into the sentence in place of the word and read the whole sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-address-the-crowding',
      kind: 'try_yourself',
      problem:
        'Read the entry and the sentence, then choose the sense of "address" the sentence uses.\n\nENTRY: address\n(noun) 1. the details that tell where a building stands or where a letter should be sent\n(verb) 2. to speak formally to a group of people who have gathered to listen\n(verb) 3. to give attention to a problem or a question and begin to deal with it\n(verb) 4. to write on a letter or package the details of where it should go\n\nSENTENCE: "The principal said the new schedule would address the crowding in the east hallway, though it would do nothing about the parking."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'the details that tell where a building stands or where a letter should be sent' },
        { id: 'b', text: 'to speak formally to a group of people who have gathered to listen' },
        { id: 'c', text: 'to give attention to a problem or a question and begin to deal with it', correct: true },
        { id: 'd', text: 'to write on a letter or package the details of where it should go' },
      ],
      expectedAnswer: 'to give attention to a problem or a question and begin to deal with it',
      hints: [
        'The word comes right after "would", so it names an action, and the sense that names a thing is out before you weigh any meaning at all.',
        'Three action senses are left, so the label alone will not finish this one. Look at what is doing the action: it is the new schedule, not the principal. Ask which of the three things a schedule can actually do, then substitute your pick back into the sentence and read it from the beginning to confirm.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-first-sense-and-familiar-sense',
      kind: 'misconception_check',
      question:
        'Two students look up the same word for the same sentence and get two different answers.\n\nENTRY: train\n(noun) 1. a line of railroad cars pulled by an engine\n(noun) 2. the long piece of cloth that trails behind a formal dress\n(verb) 3. to teach a person or an animal a skill by practicing it\n(verb) 4. to make a plant grow in a particular direction by tying it to a support\n\nSENTENCE: "Mr. Abara showed us how to train the bean vines up the wire frame at the back of the garden."\n\nThe first student answers sense 1, because that is what train means. The second student answers sense 3, because train under a verb label means to teach a skill. What went wrong each time?',
      commonErrors: [
        {
          answer: 'Sense 1, a line of railroad cars pulled by an engine, because that is what the word train means.',
          misconception:
            'Taking the meaning already in your head instead of running step one. The student never asked what job the word does in this sentence, so the label never got used, and sense 1 was chosen because it is the sense they have carried since they were small and it is printed at the top.',
          correctsTo:
            'Ask the job first. The word follows "how to", so it names an action, which puts the whole noun group out of reach before any meaning is weighed. The number in front of a sense tells you where it sits in that dictionary, not how likely it is to be the one your sentence needs. And the substitution check would have caught it in four words: WRONG: "Mr. Abara showed us how to a line of railroad cars the bean vines up the wire frame at the back of the garden." CORRECT, once the routine is run: "Mr. Abara showed us how to make the bean vines grow in a particular direction by tying them to the wire frame at the back of the garden."',
        },
        {
          answer: 'Sense 3, to teach a person or an animal a skill by practicing it, because the word is a verb here and that is what train means as a verb.',
          misconception:
            'Getting step one and step two exactly right and then stopping. The label was read correctly, so this student is further along than the first one, and that is precisely why the mistake is easy to miss: a sense under the correct label feels checked when it has only been filtered.',
          correctsTo:
            'A label almost never leaves one sense standing. Two verb senses were left here, and the sentence says the thing being trained is bean vines. Run step four on the chosen sense: WRONG: "Mr. Abara showed us how to teach the bean vines a skill by practicing it up the wire frame at the back of the garden." A vine cannot practice a skill, so the substitution fails. Then back up inside the same label, because the job has not changed: sense 4 gives CORRECT: "Mr. Abara showed us how to make the bean vines grow in a particular direction by tying them to the wire frame at the back of the garden", and the meaning holds.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An entry is sorted before it is numbered: senses are grouped under part-of-speech labels and numbered inside each group. Look for the label before you look for sense 1.',
        'Step one, decide what job the word does in your sentence. Step two, cross out every group whose label does not match. Those two steps throw away most of the entry in about two seconds.',
        'Step three, let the whole sentence choose among the senses that survive, because a label almost never leaves exactly one.',
        'Step four, substitute the dictionary wording back into the sentence and read the sentence from the beginning. Bend the grammar as much as you need to; what you are checking is whether the meaning still holds.',
        'When the substitution fails, back up to the next sense under the SAME label, never to the top of the entry. The job was settled by grammar and has not changed; the only thing that turned out to be wrong was your pick among the senses in that one group.',
        'A sense number is where that sense sits in that dictionary, not a ranking of what your sentence needs, and the meaning you already know is not a default either. The two most expensive answers are the first one printed and the one you arrived with.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Verifying Word Meaning with Context & a Dictionary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
