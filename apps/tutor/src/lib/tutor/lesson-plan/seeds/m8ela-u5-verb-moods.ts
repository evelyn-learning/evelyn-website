/**
 * Grade 8 ELA — Grammar: Verbals, Voice & Mood: Verb Moods.
 *
 * Procedure-led. One question runs the whole lesson: what job is this verb
 * FORM doing — stating, commanding, asking, supposing, or wishing? The
 * concept installs an ordered check (asking? plain verb with no subject?
 * would/could/might/should? "were" after a wish or the base form in a
 * that-clause? otherwise indicative), the first worked example runs that
 * check across all five moods, and the second splits three pairs that look
 * like one mood and are not (CCSS L.8.1c). Four traps this plan is built to
 * kill: sorting by the word "if" instead of by the verb ("If the rain holds
 * off, we will finish before lunch" is indicative); sorting by the topic, so
 * that any sentence about a job somebody has to do gets called a command;
 * reading "will" as the conditional, when a plain statement about the future
 * is still a statement; and labeling a wish subjunctive when its verb has
 * slipped into the indicative form ("I wish the science fair was on a
 * Saturday").
 *
 * SCOPE GUARD: Grade 8 row 5.4 forms and identifies verbs in the indicative
 * (states), imperative (commands), interrogative (asks), conditional
 * (would/could/might + verb; "if" clauses), and subjunctive (wishes and
 * contrary-to-fact: "if I were", "I suggest that he be") mood, sorting
 * sentences by the job the verb form signals. Identification only; using the
 * conditional and the subjunctive for effect is row 6.2. Builds on
 * `m7ela-u5-verb-tense-consistency.ts` (L.7.1: past/present/future answer
 * WHEN; mood answers WHAT KIND of statement, which no G7 row addresses — the
 * word "subjunctive" appears in no `m7ela-*` seed, grep verified). No HS
 * English seed teaches verb mood (grep across `engl-*` for "verb mood",
 * "imperative mood" and "subjunctive": no hits, verified), so the row is
 * complete in itself at the MS band. DELIBERATELY EXCLUDED: active and
 * passive voice, which is row 5.3 — the terms "active voice" and "passive
 * voice" appear nowhere in this file's body, no sentence here is labeled one
 * or the other, and no specimen this file prints is built from a form of
 * "be" plus a past participle; gerunds, participles and infinitives, which
 * are rows 5.1 and 5.2 — the words "gerund", "participle", "verbal" and
 * "infinitive" appear nowhere in the body, and no item asks what job an -ing
 * word or a to-form is doing; choosing a mood because of the effect a writer
 * wants, which is row 6.2 — every item here asks which mood a sentence IS
 * in, never which mood it SHOULD be in; the perfect tenses, which are HS
 * `engl-u1-verb-tense-and-form.ts` (L.9-10.1) — no specimen this file prints
 * uses "has", "have" or "had" as a helper in front of another verb, and the
 * one "has been" in the file sits in the hook's own narration rather than in
 * a sentence being labeled; and the five comma jobs and the end marks, which
 * are `m7ela-u6-commas-and-end-punctuation.ts`'s (L.7.2). DELIBERATELY ALLOWED,
 * because rows 5.3, 6.1 and 6.2 and two G7 rows sit close: (a) one
 * keyIdea, one worked-example step, one misconception correction and one
 * recap line rewrite a single wish from "was" to "were", which is the FORM
 * half of this row applied to one sentence standing alone — row 6.1 owns the
 * repair of a mood SHIFT across a sentence or a short passage, and no item in
 * this file asks whether a stretch of writing holds one mood, the five
 * sentences of the first worked example being labeled and sorted one at a
 * time rather than read as a passage; (b) the concept, one worked-example
 * step and one recap line each say that end punctuation does not decide the
 * mood, which uses the G7 end-mark lesson rather than re-teaching it; (c)
 * "if" clauses run through the concept, the second worked example, one item,
 * the misconception check and the recap, because the row's own scope names
 * them, and
 * they are used only to show that "if" decides nothing — independent and dependent clauses
 * and the starter word are `m7ela-u6-phrases-and-clauses.ts`'s and are
 * assumed, not re-taught, and this file uses the G7 words "clause" and
 * "helper" without redefining them; (d) the word "tense" appears in one
 * keyIdea and one recap line, only to say that tense answers WHEN and mood
 * answers WHAT KIND — a one-line reuse of the G7 tense row, and no keyIdea
 * here walks the past-present-future chart or any irregular verb; (e) one
 * keyIdea says that an untrue "if" clause and its would-result are a pair,
 * one subjunctive and one conditional, because a student meets that shape
 * immediately and nothing in the three items depends on it; and (f) the
 * concept and the recap each say once that verb mood has nothing to do with
 * the mood a story puts a reader in, which fences off
 * `m7ela-u2-tone-mood-and-word-choice.ts` (RL.7.4) rather than teaching it —
 * neither the word "tone" nor the word "reader" appears anywhere in the body
 * (grep verified), so nothing here analyzes a story's effect on anybody.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every wrong form IN THE TUTOR'S OWN PROSE is
 * labeled WRONG, with the CORRECT version beside it, because a tutor reads
 * those lines aloud and an unlabeled "I wish the science fair was on a
 * Saturday" would be handed to the student as a model. The only unlabeled
 * wrong form in this file is one MCQ distractor in the third try_yourself,
 * which the item asks the student to reject; it is named in that item's
 * second hint and corrected in full in the misconception check. No
 * contraction appears anywhere in this file, in the tutor's voice or inside
 * a quoted specimen.
 *
 * CLAIM LEDGER: none required. Every specimen in this file is an invented
 * sentence about an invented school fundraiser, an invented note to a
 * neighbor and an invented tryout, which is true by construction, so there
 * is no factual claim to verify. Rows whose passages are INFORMATIONAL (all
 * of Units 3 and 4, and any other row needing nonfiction) must carry the
 * four-column claim ledger described in the fan-out contract instead of this
 * line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U5_VERB_MOODS: LessonPlan = {
  id: 'evelyn.ms.m8ela.verb-moods.v1',
  title: 'Verb Moods',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.verb-moods',
      standard: 'M8ELA-5.4',
      description:
        'Form and identify verbs in the indicative (states), imperative (commands), interrogative (asks), conditional (would/could/might + verb; "if" clauses), and subjunctive (wishes and contrary-to-fact: "if I were", "I suggest that he be") mood, sorting sentences by the job the verb form signals (CCSS L.8.1c).',
    },
  ],
  prerequisites: ['m8ela.active-and-passive-voice'],
  followUps: ['m8ela.shifts-in-voice-and-mood'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that five messages about one Saturday do five different jobs, and that the verb form is the only thing that changed.',
      script:
        'The eighth grade is running a car wash on Saturday to pay for the spring trip, and the group chat has been going all week. Scroll back and read five messages in a row. "The car wash starts at nine." "Bring a bucket and an old towel." "Does anybody have a second hose?" "With four more people we could finish the whole lot by noon." "I wish Saturday were dry." Five sentences, one topic, five completely different jobs. The first one states something. The second tells you to do something. The third asks for an answer. The fourth supposes a result that depends on something that has not happened. The fifth wishes for something that is not so. Nothing about the topic changed from one message to the next. What changed is the shape of the verb, and that shape is doing all the work. Each of those five shapes has a name, and by the end of today you will be able to name all five and say which job each one signals.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-five-moods-and-the-order-to-check-them',
      kind: 'concept',
      goal: 'Install mood as the job a verb form signals, an ordered check that sorts any sentence, and the two shapes of the subjunctive.',
      keyIdeas: [
        'MOOD ANSWERS WHAT KIND OF STATEMENT, NOT WHEN. You already sort verbs by tense, and tense answers one question: when does this happen? Mood answers a different one: what job is this verb form doing? English sorts that job five ways. A verb can state something (indicative), tell somebody to do something (imperative), ask for an answer (interrogative), suppose a result that depends on something (conditional), or mark something as wished for or not so (subjunctive). One warning before you start. This is a grammar word, and verb mood has nothing to do with the mood a story puts you in. Same word, different job, different lesson.',
        'CHECK IN AN ORDER, BECAUSE THE EASY SHAPES KNOCK OUT THE HARD ONES. Ask four questions of the sentence, in this order. Is it asking for an answer? Then it is interrogative. Does it start with a plain verb, with no subject written in front of it? Then it is imperative. Does the main verb carry would, could, might or should? Then it is conditional. Does it carry "were" after a wish or after an "if" that is not true, or a plain base form in a that-clause after a word like ask, suggest, insist or require? Then it is subjunctive. If all four answers are no, the sentence is indicative. Sort by the verb form every time, never by the topic and never by how the sentence sounds.',
        'THE INDICATIVE STATES SOMETHING, AND IT IS THE DEFAULT. Most of what you read and most of what you write is indicative: it puts something forward as a fact, and the fact can be past, present or future, and it can even be wrong. "The car wash starts at nine." "Nobody found the second hose." "We will finish the lot before lunch." That last one matters more than it looks, because "will" plus a verb is still indicative. A plain statement about the future is still a statement, and it is the sentence students mislabel as conditional more often than any other.',
        'THE IMPERATIVE AND THE INTERROGATIVE ARE THE TWO YOU CAN SEE FROM THE SHAPE. An imperative tells somebody to do something, and its verb sits in the plain shape with no subject written in front of it, because the subject "you" is understood. "Fill the water bowl." An imperative can be as short as "Stop." A name in front of it or a "please" inside it changes nothing: "Priya, please email the sign-up sheet" is still an imperative, because "email" is still the plain shape and Priya is the person being spoken to, not the subject sitting in front of the verb. An interrogative asks for an answer, and it usually moves a helper or a question word in front of the subject: "Does anybody have a second hose?" Punctuation is a clue, never the test. The verb form is the test.',
        'THE CONDITIONAL SUPPOSES A RESULT THAT DEPENDS ON SOMETHING, AND "IF" IS NOT THE TEST. The conditional is built from would, could, might or should plus the plain verb: "We could finish the whole lot by noon." What the result depends on is often carried by an "if" clause, and just as often it is somewhere else in the sentence or nowhere in it at all. So the word "if" proves nothing in either direction. "If the rain holds off, we will finish before lunch" is indicative, because the result verb is a plain statement about the future. "With four more people, we could finish before lunch" is conditional, and there is no "if" in it anywhere. Find the verb, not the word "if".',
        'THE SUBJUNCTIVE HAS TWO SHAPES, AND THE SHAPE IS WHAT DECIDES THE LABEL. First shape: "were" for every subject, singular ones included, after a wish or after an "if" that is not true. "I wish Saturday were dry." "If I were the one holding the hose, the line would move faster" — in a sentence like that one the "if" half is subjunctive and the result half is conditional, and the two often work as a pair. Second shape: the plain base form, with no -s on the end, in a that-clause after ask, suggest, insist, recommend or require. "The judges require that each project stay on its own table" uses "stay", not "stays", even though "each project" is singular. Wishing is the subjunctive\'s territory, and wishing is still not enough on its own, because the form has to follow. WRONG, in formal writing: "I wish the science fair was on a Saturday." CORRECT: "I wish the science fair were on a Saturday."',
      ],
      vocabulary: [
        { term: 'indicative', definition: 'the mood of a verb that states something as a fact, in the past, the present or the future; the default mood of most sentences.' },
        { term: 'imperative', definition: 'the mood of a verb that gives a command, an instruction or a request, with the verb in its plain shape and the subject "you" understood rather than written.' },
        { term: 'interrogative', definition: 'the mood of a verb in a sentence that asks for an answer, usually with a helper or a question word moved in front of the subject.' },
        { term: 'conditional', definition: 'the mood of a verb that supposes a result depending on something else, built from would, could, might or should plus the plain verb.' },
        { term: 'subjunctive', definition: 'the mood of a verb that marks something as wished for, suggested, required or not so, using "were" for every subject after a wish or an untrue "if", or the plain base form in a that-clause.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-five-sentences',
      kind: 'worked_example',
      problem:
        'Name the mood of each sentence, and say how you know. All five come from a note a neighbor left on the counter before a trip.\n\n(1) "The dog eats at seven in the morning and again at six at night."\n(2) "Fill the water bowl before you leave for school."\n(3) "Do you still have the key to the side door?"\n(4) "With a longer leash, he would stay out of the flower bed."\n(5) "I wish he were calmer around the mail carrier."',
      steps: [
        'Sentence 1. Run the four checks. It is not asking for an answer. It does not start with a plain verb; the subject "The dog" sits in front of the verb "eats". There is no would, could, might or should. There is no "were" after a wish and no base form in a that-clause. All four answers are no, so the sentence is INDICATIVE. It states something as a fact.',
        'Sentence 2. The first check fails again, but the second one lands: the sentence starts with the plain verb "Fill", and no subject is written in front of it. Put the understood subject back and it still works: you fill the water bowl. So this is IMPERATIVE. Notice two things that did not decide it. It ends in a period rather than an exclamation point, and it contains the word "you" later on, inside "before you leave for school". Neither one changes the mood, because the mood is set by the verb at the front.',
        'Sentence 3. The first check lands: the sentence asks for an answer, and the helper "Do" has moved in front of the subject "you". So it is INTERROGATIVE. This is worth pausing on, because the sentence is asking about a fact, and it is still not indicative. Mood is the job the form does, and this form asks.',
        'Sentence 4. The first two checks fail, and the third lands: the main verb is "would stay", which is would plus the plain verb. So the sentence is CONDITIONAL. Look at what is not there. There is no "if" anywhere in it. What the result depends on is carried by the phrase "With a longer leash", and the dog does not have one. The conditional does not need the word "if"; it needs the verb.',
        'Sentence 5. The first three checks fail, and the fourth lands: "were" follows "I wish", and the subject "he" is singular. That is the first subjunctive shape, so the sentence is SUBJUNCTIVE. If the note had read "I wish he was calmer", the job would still be a wish and the form would have slipped, and the label would have to follow the form.',
        'Read the five verdicts together: 1 indicative, 2 imperative, 3 interrogative, 4 conditional, 5 subjunctive. Every sentence is about the same dog, so the topic settled nothing at all. Four of the five contain the word "you" or a person doing something, so that settled nothing either. The verb form settled all five, in the same order every time.',
      ],
      answer:
        'Sentence 1 is indicative: it states a fact, with the subject in front of the verb and no other shape present. Sentence 2 is imperative: it starts with the plain verb "Fill" and the subject "you" is understood. Sentence 3 is interrogative: it asks for an answer, with the helper "Do" in front of the subject. Sentence 4 is conditional: the verb is "would stay", and the result depends on a longer leash that the dog does not have. Sentence 5 is subjunctive: "were" follows "I wish", which is the shape a wish takes in formal writing.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-three-pairs-that-look-alike',
      kind: 'worked_example',
      problem:
        'Each pair below looks like one mood and splits into two. Name the mood of both sentences in each pair, and say exactly what decides it.\n\nPAIR A: "If the gym floor is wet, we will move the tryout to the field." / "If the gym floor is wet, we could move the tryout to the field."\n\nPAIR B: "Priya, email the sign-up sheet to the coach tonight." / "Priya emails the sign-up sheet to the coach every Friday."\n\nPAIR C: "The science fair was on a Saturday last year, and almost nobody came." / "I wish the science fair were on a Saturday this year."',
      steps: [
        'Pair A. The two sentences share an opening word for word, so whatever separates them cannot be the "if". Look at the result verb in each. The first has "will move", which is a plain statement about what is going to happen, so that sentence is INDICATIVE. The second has "could move", which is could plus the plain verb, so that sentence is CONDITIONAL. Same condition, same field, same tryout; one states and one supposes.',
        'Stay on pair A one moment longer, because this is the trap that catches the most students. A sentence is not conditional because it has a condition in it. The first sentence has a condition and states a plan anyway. What makes a sentence conditional is the would, could, might or should sitting on the main verb.',
        'Pair B. Both sentences start with the same name, and only one of them is a command. In the first, "Priya" is the person being spoken to, and the verb "email" is in its plain shape with no subject written in front of it, so the sentence is IMPERATIVE. In the second, "Priya" is the subject sitting in front of the verb, and the verb has taken its -s: "emails". That is a statement about what she does every week, so the sentence is INDICATIVE.',
        'The -s is the piece to watch in pair B. An imperative verb never takes one, because there is no third-person subject in front of it to agree with. If you are unsure which sentence you have, ask whether the sentence is telling somebody to do something now or telling you what somebody does.',
        'Pair C. Both sentences carry a form of "be" and both are about the same science fair. In the first, "was" states something that really happened last year, so the sentence is INDICATIVE. In the second, "were" follows "I wish", and the fair is not on a Saturday this year, so the sentence is SUBJUNCTIVE. The word "was" is not an error and "were" is not a magic word; the question is always whether the form matches the job.',
        'That is also where the most common subjunctive error lives, so here it is labeled. WRONG, in formal writing: "I wish the science fair was on a Saturday." CORRECT: "I wish the science fair were on a Saturday." And here is the second subjunctive shape beside it, so you can recognize it when it turns up in a that-clause. CORRECT: "The judges require that each project stay on its own table." WRONG, in formal writing: "The judges require that each project stays on its own table." The verb drops its -s in that clause even though "each project" is singular.',
      ],
      answer:
        'Pair A: the first sentence is indicative, because its result verb "will move" states a plan, and the second is conditional, because "could move" supposes one; the shared "if" decides nothing. Pair B: the first is imperative, because "email" is the plain shape with the subject "you" understood and Priya spoken to, and the second is indicative, because "Priya" is the subject and the verb has taken its -s. Pair C: the first is indicative, because "was" states what happened last year, and the second is subjunctive, because "were" follows "I wish" about something that is not so.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-the-imperative',
      kind: 'try_yourself',
      problem: 'Which sentence is in the IMPERATIVE mood?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The folding tables sit behind the equipment room door, and they are lighter than they look.' },
        { id: 'b', text: 'Carry the folding tables out to the curb before the first car pulls in, and set them under the oak tree.', correct: true },
        { id: 'c', text: 'Does anybody remember whether the folding tables are still behind the equipment room door?' },
        { id: 'd', text: 'We could carry the folding tables out to the curb tonight, but that corner stays in the sun until ten.' },
      ],
      expectedAnswer: 'Carry the folding tables out to the curb before the first car pulls in, and set them under the oak tree.',
      hints: [
        'All four sentences are about the same folding tables, so the topic settles nothing. Find the verb in each one and ask what job its form is doing.',
        'An imperative tells somebody to do something, and its verb sits in the plain shape with no subject written in front of it, because the subject "you" is understood. Three of these sentences name who does what, and one does not. Watch the sentence that supposes a result rather than asking for one: could plus a plain verb is the conditional, however much it sounds like a suggestion.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-conditional',
      kind: 'try_yourself',
      problem: 'Which sentence is in the CONDITIONAL mood?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'If the rain holds off until noon, we will finish the whole line of cars before the lunch shift arrives.' },
        { id: 'b', text: 'I wish the second hose were long enough to reach the cars parked at the far end of the lot.' },
        { id: 'c', text: 'With one more volunteer on the rinse bucket, we could wash twice as many cars before the lot fills up.', correct: true },
        { id: 'd', text: 'Ask the hardware store about a second hose, and find out whether they lend one out for a morning.' },
      ],
      expectedAnswer: 'With one more volunteer on the rinse bucket, we could wash twice as many cars before the lot fills up.',
      hints: [
        'The word "if" is not the test, and neither is whether the sentence sounds like a guess. Find the main verb in each sentence and ask what its form signals.',
        'The conditional is would, could, might or should plus the plain verb. One of these states a real plan with "will", one wishes for something that is not so, and one tells somebody to do two things. Only one carries the conditional pair, and it does not contain the word "if" at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-subjunctive',
      kind: 'try_yourself',
      problem: 'In which sentence is the verb in the SUBJUNCTIVE mood?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Dana taped the banner to the fence at eight, and the wind pulled one corner loose before the first car arrived.' },
        { id: 'b', text: 'A second sign at the corner of Ash Street would bring in more drivers than the banner on the fence does.' },
        { id: 'c', text: 'I wish the banner was heavy enough to stay flat against the fence on a morning this windy.' },
        { id: 'd', text: 'Mr. Alvarez suggests that every driver stay in the car while the crew works around it.', correct: true },
      ],
      expectedAnswer: 'Mr. Alvarez suggests that every driver stay in the car while the crew works around it.',
      hints: [
        'Two of these sound like guesses and one is an ordinary statement about what already happened. Do not sort them by how they sound. Find the verb in each one and check its form against the two subjunctive shapes.',
        'The subjunctive is "were" for every subject after a wish or an untrue "if", or the plain base form in a that-clause after a word like ask, suggest, insist or require. A wish written with "was" is carrying the indicative form, and a verb carrying "would" is the conditional. Look for a verb in a that-clause that has dropped its -s even though its subject is singular.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-if-means-conditional-and-a-wish-means-subjunctive',
      kind: 'misconception_check',
      question:
        'Two students label the same two sentences. Sentence 1: "If the tables are still in the shed at nine, the line of cars will back up onto the street." The first student says: "Conditional, because it starts with if." Sentence 2: "I wish the second hose was longer." The second student says: "Subjunctive, because it is a wish." What has gone wrong with each label?',
      commonErrors: [
        {
          answer: 'Sentence 1 is conditional, because it starts with "if".',
          misconception:
            'Treating the word "if" as the marker of the conditional mood. A great many conditional sentences do carry an "if" clause, so the student has learned to spot the word, and the word itself is not part of any verb.',
          correctsTo:
            'Look at the verbs instead. The sentence has "are" and "will back up", and neither one is would, could, might or should plus a plain verb. So the sentence is INDICATIVE: it states what is going to happen, with a condition attached to it. To make it conditional you have to change the result verb, not the opening: "If the tables are still in the shed at nine, the line of cars could back up onto the street." Now the mood has changed, and the word "if" has not moved. Run it the other way too: "With two more buckets, the line could move twice as fast" is conditional and carries no "if" at all.',
        },
        {
          answer: 'Sentence 2 is subjunctive, because it is a wish.',
          misconception:
            'Sorting by the job alone and stopping there. The student is right that a wish is the subjunctive\'s territory, and wrong that the territory settles the label, because the subjunctive is a verb form as well as a job, and this wish is not carrying it.',
          correctsTo:
            'The verb in that sentence is "was", which is the indicative form. In a wish, formal writing uses "were" for every subject, singular ones included. So as printed, the sentence states its wish in the indicative form, and the label follows the form on the page. WRONG, in formal writing: "I wish the second hose was longer." CORRECT: "I wish the second hose were longer." Now the form matches the job, and the sentence is subjunctive. You will hear people say it both ways out loud, which is exactly why the label comes from the form and not from the feeling.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tense answers WHEN. Mood answers WHAT KIND of statement the verb form is making: stating, telling somebody to act, asking, supposing, or wishing. This grammar word has nothing to do with the mood a story puts you in.',
        'Check in an order: is it asking (interrogative), does it start with a plain verb and no subject (imperative), does the main verb carry would, could, might or should (conditional), does it carry "were" after a wish or a base form in a that-clause (subjunctive), and if all four answers are no, it is indicative.',
        'The indicative states something as a fact, and it is the default. "Will" plus a verb is still indicative, because a plain statement about the future is still a statement.',
        'The imperative tells somebody to do something, with the verb in its plain shape and the subject "you" understood. "Fill the water bowl before you leave for school." A name in front, a "please" inside, or a period at the end changes nothing.',
        'The conditional is would, could, might or should plus the plain verb, and "if" is not the test. A sentence with no "if" in it can be conditional, and a sentence that opens with "if" is indicative when its result verb only states a plan.',
        'The subjunctive has two shapes: "were" for every subject after a wish or an untrue "if", and the plain base form in a that-clause after ask, suggest, insist, recommend or require. WRONG, in formal writing: "I wish the science fair was on a Saturday." CORRECT: "I wish the science fair were on a Saturday."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Verb Moods' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
