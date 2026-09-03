/**
 * Grade 8 ELA — Sentence Style & Punctuation: Voice & Mood for Effect.
 *
 * PROCEDURE-LED. The move is repeatable and the whole lesson makes it
 * fluent: say in one sentence what the reader should walk away with, pick
 * the verb form that produces it, then read both versions back and confirm
 * that only the emphasis moved (CCSS L.8.3a). Every item is a
 * revision-choice MCQ: the stem states the effect wanted in so many words,
 * and the four choices are candidate sentences. Four traps this plan is
 * built to kill: treating "avoid the passive" as a grammar rule instead of
 * as advice about emphasis; naming the actor in a "by" phrase and thinking
 * that emphasizes the actor, when the subject seat still belongs to the
 * receiver; filling an unknown doer's seat with "somebody" instead of
 * leaving it empty; and printing a "would" with no condition anywhere on
 * the page for the reader to see.
 *
 * SCOPE GUARD: Grade 8 row 6.2 chooses active voice to emphasize the actor
 * and passive voice to emphasize the action or its receiver (or to hide an
 * unknown doer), and chooses the conditional or subjunctive to express
 * uncertainty or a state contrary to fact. Builds on
 * `m7ela-u6-sentence-types-and-combining.ts` (L.7.1b: "combining is a choice
 * about emphasis too" — whatever sits in the independent clause is what the
 * reader remembers), moving the emphasis lever from clause placement to verb
 * form. Requires rows 5.3-5.4. Stops short of HS
 * `engl-u4-precision-and-concision.ts` (L.9-10.3: revising for economy) and
 * `engl-u4-tone-and-register.ts` (L.9-10.3: register matched to audience).
 * DELIBERATELY EXCLUDED: the identification test and the conversion drill of
 * row 5.3 — no segment asks the student to label a sentence ACTIVE or
 * PASSIVE, no task anywhere is stated as converting a given sentence into
 * the other voice, and the terms "past participle" and "third shape" appear
 * nowhere below this comment (checked); sorting sentences by mood, and the
 * mandative subjunctive of row 5.4 ("the coach asks that every player be
 * there") — every "were" in this file is a wish or a contrary-to-fact "if",
 * and no other subjunctive form appears; finding and repairing an
 * inappropriate SHIFT of voice or mood inside one sentence or passage, which
 * is row 6.1 — the three items each choose one whole candidate sentence out
 * of four, and the two drafts repaired in the second worked example carry no
 * shift at all: each is uniformly indicative and simply wrong for the effect
 * the item states, so the move is a form choice, not a shift repair;
 * choosing between a dash and a comma for a break, which is row 6.3, and
 * which no segment here discusses, names or teaches, though the tutor's own
 * prose punctuates with dashes as any prose does; and both HS ceilings, so
 * nothing here cuts words for economy or picks a level of formality for a
 * named audience — where an item names its reader (a newsletter, a log, the
 * principal), that reader fixes the EFFECT wanted and never the register.
 * DELIBERATELY ALLOWED, because rows 5.3, 5.4 and 6.1 sit shoulder to
 * shoulder: the concept, the vocabulary and the recap NAME the active, the
 * passive, the conditional and the subjunctive and say in a clause what each
 * one does (the first worked example names the two voices, the second the
 * two moods), because a student cannot choose between forms nobody has named
 * — that is the reuse of rows 5.3-5.4 the row's own scope line requires, and
 * no keyIdea walks the identification test or the conversion; the first
 * worked example writes one event three ways, which puts an active and a
 * passive version of the same facts on the page, because seeing them side by
 * side is what makes the emphasis visible; one distractor in the first item
 * buries the actor behind the starter word "Although", which is the G7
 * emphasis lever reused as a wrong answer and not a lesson on combining; one
 * distractor in the second item is an imperative, printed only so the
 * student can reject a sentence that gives an instruction instead of
 * reporting an event; and the concept and its vocabulary say plainly that a
 * passive may leave its doer out, because that structural fact is the thing
 * being chosen, not a re-teaching of how the form is built.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence, specimen and scenario in this
 * file is original prose written for the item. This course carries no
 * passage machinery — no passageId, no shared texts — so each question must
 * be solvable from the words printed inside it. Two labels are used
 * deliberately and they mean different things. "WRONG:" marks a form that is
 * not standard written English at all, and it always carries the CORRECT
 * version beside it. "WRONG FOR THIS EFFECT:" marks a sentence that is
 * perfectly grammatical but does the opposite of the job the item just
 * stated, and it also carries the CORRECT version beside it; this file needs
 * that second label because its whole subject is that neither voice and no
 * mood is an error on its own, and labeling a grammatical sentence a bare
 * "WRONG:" would teach the rule this lesson exists to dismantle. Two places
 * print a wrong form without a label on the form itself, and both are
 * deliberate. The MCQ distractors in the three try_yourself items are
 * unlabeled because rejecting them is what those items are for; each one is
 * then named in that item's hints or in the misconception check. The second
 * worked example prints two drafts under the heading "Draft:", inside a
 * problem that tells the student to fix them, and each draft is then
 * repaired in the steps with a labeled pair. No wrong form appears anywhere
 * in this file as something the tutor is asserting. No contraction appears
 * anywhere in this file.
 *
 * CLAIM LEDGER: none required. Every specimen and scenario in this file is
 * an invented school situation — a lost-and-found bin, a repainted mural, a
 * missing box of costumes, a supply closet, a grant application, a gym too
 * small for a science fair, and a courtyard the school does not own — which
 * is true by construction, so there is no factual claim about the world to
 * verify, and no statistic, measurement or figure about the real world
 * appears anywhere. Rows whose passages are INFORMATIONAL (all of
 * Units 3 and 4, and any other row needing nonfiction) must carry the
 * four-column claim ledger described in the fan-out contract instead of this
 * line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U6_VOICE_AND_MOOD_FOR_EFFECT: LessonPlan = {
  id: 'evelyn.ms.m8ela.voice-and-mood-for-effect.v1',
  title: 'Voice & Mood for Effect',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.voice-and-mood-for-effect',
      standard: 'M8ELA-6.2',
      description:
        'Choose active voice to emphasize the actor and passive voice to emphasize the action or its receiver (or to hide an unknown doer), and choose the conditional or subjunctive to express uncertainty or a state contrary to fact (CCSS L.8.3a).',
    },
  ],
  prerequisites: ['m8ela.shifts-in-voice-and-mood'],
  followUps: ['m8ela.dashes-and-commas-for-a-break'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that two correct sentences about the same event do different jobs on a reader, so the choice between them is a decision the writer makes rather than a rule to obey.',
      script:
        'The lost-and-found bin was emptied on Friday, and two notices went up about it. The first one reads: "Mr. Alvarez cleared out the lost-and-found bin on Friday afternoon." The second reads: "The lost-and-found bin was cleared out on Friday afternoon." Nothing is wrong with either sentence. Both are true, both are ordinary English, and both describe the same Friday. But if your hoodie was in that bin, only one of them tells you who to go ask. And if the notice is really about the bin, because the office wants the whole grade to stop leaving things in it, the second one keeps the reader looking at the bin instead of at Mr. Alvarez. You already know how to tell the active from the passive, and you already know how to build a sentence with "would" in it and a sentence with "were" in it. Today the question changes. It is no longer which form is this. It is which form do I want, and the way to answer it is to name the effect before you touch the sentence.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-name-the-effect-then-pick-the-form',
      kind: 'concept',
      goal: 'Install the three-step move, the two jobs voice can do, the two jobs mood can do, and the two ways the choice goes wrong.',
      keyIdeas: [
        'NAME THE EFFECT FIRST. THE FORM COMES SECOND. None of these forms is an error, and none of them is better than the others on its own, so there is nothing to obey here and something to decide. The move is three steps, and the first is the one people skip. One: say in one sentence what the reader should walk away with — who did it, what happened, or that this is not so. Two: pick the form that produces that. Three: read both versions back and check that only the emphasis moved. If the two versions say different things about the world, you have changed the facts instead of the emphasis, and you have to start over.',
        'ACTIVE PUTS THE ACTOR IN THE SUBJECT SEAT, AND THE SUBJECT SEAT IS THE LOUDEST ONE. Whatever sits there is what the reader remembers. So when the point of the sentence is the person — credit, blame, who to go ask, who made the call — the actor belongs in that seat: "Dev repaired the projector before third period." Naming the actor somewhere in the sentence is not the same as emphasizing the actor. "The projector was repaired by Dev before third period" names him and still hands the seat to the projector, so the reader walks away with the projector.',
        'PASSIVE PUTS THE ACTION OR ITS RECEIVER IN THAT SEAT, AND THE DOER BECOMES OPTIONAL. Three jobs it does well. First, the receiver is what the paragraph is already about, so keeping it in the subject seat keeps the reader on one subject: a paragraph about the projector says "The projector was repaired before third period." Second, nobody knows who the doer is. Third, the doer is known and simply beside the point, the way it is in a set of instructions or a report about a thing rather than a person.',
        'WHEN THE DOER IS UNKNOWN, LEAVE THE SEAT EMPTY INSTEAD OF FILLING IT WITH NOBODY. This is the passive job students most often miss. If you do not know who did it, the active voice forces you to put something in the subject seat, and the something is usually "somebody", "they" or "someone" — words that name no one and take the loudest position in the sentence to do it. The passive lets you drop the doer entirely and put the real news out front: "Every shelf in the closet was relabeled over the weekend" says more than "Somebody relabeled every shelf in the closet over the weekend", and it claims less.',
        'THE CONDITIONAL PRESENTS SOMETHING AS POSSIBLE RATHER THAN SETTLED — AND IT NEEDS ITS CONDITION ON THE PAGE. Would, could and might tell the reader that what follows has not happened and may not: "If the grant comes through, the club would buy a second printer." Put the same idea in the plain indicative, "The club buys a second printer", and a reader takes it as a fact. The one requirement is that the reader can see what the possibility depends on. A "would" with no condition anywhere in sight leaves the reader holding half a sentence, wondering what has to happen first.',
        'THE SUBJUNCTIVE MARKS A SITUATION THE WRITER KNOWS IS NOT SO. After "wish", and after an "if" that describes something untrue, the form is "were" for every subject, and that "were" is doing a job: it tells the reader you are not confused about the facts, you are imagining. WRONG: "I wish the gym was bigger." CORRECT: "I wish the gym were bigger." The plain past form turns up in conversation constantly; in writing, "were" is the form that marks the wish as something that is not so. A contrary-to-fact "if" clause pairs with the conditional in the other half: "If the gym were bigger, we would hold the fair inside."',
      ],
      vocabulary: [
        { term: 'emphasis', definition: 'the idea a sentence puts out front, which the reader walks away with; the subject seat is where it is decided.' },
        { term: 'active voice', definition: 'here, the choice that puts the actor in the subject seat; pick it when the reader should come away knowing who did the action.' },
        { term: 'passive voice', definition: 'here, the choice that puts the action or its receiver in the subject seat and makes the doer optional; pick it when the receiver is the point, or when the doer is unknown or beside the point.' },
        { term: 'conditional', definition: 'the would, could or might form; pick it to present something as possible rather than settled, and print the condition it depends on.' },
        { term: 'contrary to fact', definition: 'describing a situation the writer knows is not so; the subjunctive "were" is the form that marks it, as in "If the gym were bigger."' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-one-event-three-effects',
      kind: 'worked_example',
      problem:
        'One event, three different jobs. Here are the facts: Devin Okafor repainted the mural outside the gym over spring break.\n\nWrite the sentence for each of these three effects.\n(1) A short newsletter item wants the reader to come away with the volunteer.\n(2) A paragraph about the mural itself has just described its peeling paint, and the reader should stay with the mural, though the credit still matters.\n(3) The building log records that the wall is finished, and the custodian writing it does not know who did the work.',
      steps: [
        'Effect 1. Say what the reader should walk away with: the person. That puts Devin in the subject seat, which is the active voice. CORRECT: "Devin Okafor repainted the mural outside the gym over spring break." The mural comes after the verb, which is where the receiver sits when the actor has the seat.',
        'Effect 2. The reader should stay with the mural, because the sentence before this one was about its peeling paint, and a paragraph that keeps swapping subjects is harder to follow. So the mural takes the seat and the doer rides along behind the verb. CORRECT: "The mural outside the gym was repainted over spring break by Devin Okafor." The credit is still there and the emphasis has moved off it.',
        'Notice what just happened, because it is the trap in this lesson. Effect 1 and effect 2 both name Devin. They are different sentences anyway, because naming the actor and emphasizing the actor are two different things, and only emphasis is about which seat he sits in.',
        'Effect 3. The custodian cannot name a doer, because there is no name to give. The passive lets the sentence report the work and stop there. CORRECT: "The mural outside the gym was repainted at some point over spring break." Compare the active version the custodian would be forced into: "Somebody repainted the mural outside the gym at some point over spring break." That sentence opens on a word that identifies no one, and it claims a little more than the log can back up.',
        'Now the mismatch, which is what a reviser is actually hunting for. Put effect 3 sentence into the newsletter item and read it. WRONG FOR THIS EFFECT: "The mural outside the gym was repainted at some point over spring break." The item exists to name a volunteer, and the one fact it exists to deliver has been deleted. CORRECT: "Devin Okafor repainted the mural outside the gym over spring break."',
        'Last step, every time: read the three versions back to back. Same mural, same wall, same spring break, same paint. Nothing about the world changed across the three sentences. Only the seat changed, and with it what the reader remembers. If a version of yours had changed a fact, it would not be a different emphasis; it would be a different claim.',
      ],
      answer:
        'Effect 1 is active: "Devin Okafor repainted the mural outside the gym over spring break." Effect 2 is passive with the doer kept: "The mural outside the gym was repainted over spring break by Devin Okafor." Effect 3 is passive with the doer dropped: "The mural outside the gym was repainted at some point over spring break." All three report the same event; each one puts a different thing in the subject seat, and the third one declines to claim a doer the writer does not know.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mood-for-uncertainty-and-contrary-to-fact',
      kind: 'worked_example',
      problem:
        'Two drafts, two stated effects. Fix each draft so the form matches the effect.\n\nSituation 1: The robotics club has applied for a grant. Nothing has been decided yet. The flyer should say what the money would do without promising the club anything.\nDraft: "The grant pays for a second printer, and every member gets machine time on Fridays."\n\nSituation 2: The science fair cannot be held in the gym, which is too small, and that is not going to change this year. The captain wants the letter to admit that plainly and still describe the fair she has in mind.\nDraft: "I wish the gym was bigger. If the gym is bigger, we hold the fair inside."',
      steps: [
        'Situation 1, step one: name the effect. Nothing has been decided, so the reader must not hear a promise. Now read the draft as a reader who knows none of that. "The grant pays for a second printer" and "every member gets machine time on Fridays" are flat statements of fact, and a member who reads them on a flyer starts planning around a printer that may never arrive.',
        'Step two: pick the form. The conditional says possible rather than settled. CORRECT: "If the grant comes through, the club would buy a second printer, and every member could get machine time on Fridays." Would and could carry the whole flyer into the world where the grant arrives, and the reader can tell that is where they are.',
        'Watch the half version, because it is the common one. WRONG FOR THIS EFFECT: "The club would buy a second printer, and every member could get machine time on Fridays." The forms are right and the condition is missing, so the reader can see that something is uncertain and cannot see what it hangs on. The conditional does its job only when the "if" it depends on is somewhere the reader can find it. CORRECT: "If the grant comes through, the club would buy a second printer, and every member could get machine time on Fridays."',
        'Situation 2, step one: name the effect. The gym is too small and will stay too small, and the captain wants that said plainly, not left as an open question. Read the draft. "I wish the gym was bigger" states the wish in the plain past form, and "If the gym is bigger, we hold the fair inside" states a false situation as though it might well turn out to be true, which invites the principal to write back about the gym.',
        'Step two: pick the form. WRONG: "I wish the gym was bigger." CORRECT: "I wish the gym were bigger." After "wish", and after an "if" that describes something untrue, the subjunctive "were" is the form that marks the situation as not so. The other half of a contrary-to-fact "if" then takes the conditional: CORRECT: "If the gym were bigger, we would hold the fair inside."',
        'Step three, both situations: read the fixed versions back against the drafts and check that only the marking changed. The grant is still undecided and the gym is still the same size. What moved is what a reader is entitled to conclude — no printer has been promised, and nobody is waiting on a bigger gym.',
      ],
      answer:
        'Situation 1: "If the grant comes through, the club would buy a second printer, and every member could get machine time on Fridays." The conditional presents both as possible, and the "if" clause shows what they depend on. Situation 2: "I wish the gym were bigger. If the gym were bigger, we would hold the fair inside." The subjunctive "were" marks the bigger gym as contrary to fact, and "would" keeps the rest of the sentence inside that imagined situation.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-emphasize-the-actor',
      kind: 'try_yourself',
      problem:
        'The school paper is running a short article about one student, Rosa Alvear. The reporter wants the opening sentence to put Rosa herself out front, so that the reader comes away thinking about the person who solved the problem rather than about the box of costumes. Which sentence does that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rosa Alvear tracked down the missing box of costumes in a storage closet behind the auditorium two days before opening night.', correct: true },
        { id: 'b', text: 'The missing box of costumes was tracked down by Rosa Alvear in a storage closet behind the auditorium two days before opening night.' },
        { id: 'c', text: 'The missing box of costumes was finally tracked down in a storage closet behind the auditorium two days before opening night.' },
        { id: 'd', text: 'Although Rosa Alvear was the one searching the auditorium closets, the missing box of costumes did not turn up until two days before opening night.' },
      ],
      expectedAnswer: 'Rosa Alvear tracked down the missing box of costumes in a storage closet behind the auditorium two days before opening night.',
      hints: [
        'Start from the effect the reporter named, then ask which seat each sentence puts Rosa in. The subject seat is the one the reader remembers.',
        'Two of these sentences do name Rosa and still leave the box of costumes sitting in the subject seat, one of them behind a passive verb and one of them behind a starter word, so the reader walks away with the box either way. A third leaves her out of the article altogether.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-report-an-unknown-doer',
      kind: 'try_yourself',
      problem:
        'A note is going into the art room supply log, which is a record of what happens to the closet. Over the weekend somebody sorted and labeled every shelf in it, and nobody in the building knows who. The note has to keep the closet itself as the thing the entry is about, and it must not claim anything about a doer the writer cannot identify. Which sentence should go in the log?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The seventh grade art club sorted and labeled every shelf in the art room supply closet at some point between Friday afternoon and Monday morning.' },
        { id: 'b', text: 'Every shelf in the art room supply closet was sorted and labeled at some point between Friday afternoon and Monday morning.', correct: true },
        { id: 'c', text: 'Somebody sorted and labeled every shelf in the art room supply closet at some point between Friday afternoon and Monday morning.' },
        { id: 'd', text: 'Sort and label every shelf in the art room supply closet, and report anything missing to the art teacher on Monday morning.' },
      ],
      expectedAnswer: 'Every shelf in the art room supply closet was sorted and labeled at some point between Friday afternoon and Monday morning.',
      hints: [
        'The log has to say what happened to the closet without claiming who did it. Check each sentence for a doer, and ask whether the writer could actually vouch for that doer.',
        'One sentence hands the work to a club nobody saw, one fills the loudest seat in the sentence with a word that names no one, and one gives an instruction for the week ahead instead of reporting something that already happened.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mark-it-contrary-to-fact',
      kind: 'try_yourself',
      problem:
        'The student council is writing to the principal about the courtyard. The courtyard belongs to the city, the school will not have the use of it this year, and everyone involved knows that. The council wants one sentence that lets the principal hear that the situation is not so and is not about to become so, while still describing what the garden club has in mind for the space. Which sentence does that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'If the courtyard is ours next fall, the garden club plants raised beds along the south wall and runs a plot for every homeroom.' },
        { id: 'b', text: 'If the courtyard was ours next fall, the garden club will plant raised beds along the south wall and run a plot for every homeroom.' },
        { id: 'c', text: 'If the courtyard were ours, the garden club would plant raised beds along the south wall and run a plot for every homeroom.', correct: true },
        { id: 'd', text: 'The garden club would plant raised beds along the south wall and would run a plot for every homeroom in the courtyard.' },
      ],
      expectedAnswer: 'If the courtyard were ours, the garden club would plant raised beds along the south wall and run a plot for every homeroom.',
      hints: [
        'The council is describing a courtyard the school does not have and is not going to get. Ask which sentence marks that situation as not so, and which ones leave a principal free to read it as something that might happen.',
        'Read the "if" half and the other half of each sentence together. One states the whole thing flat, as though the courtyard might well be theirs in the fall; one keeps the plain past form after "if" and then promises with "will"; and one describes what the club would do without ever printing the condition it depends on.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-passive-is-weak-and-forms-do-not-matter',
      kind: 'misconception_check',
      question:
        'Two students are revising the same club newsletter. One writes: "I crossed out every passive sentence in the article, because the passive voice is weak and the active voice is always the stronger choice." The other writes: "I left the line \'If I was in charge of the schedule, I will move the meetings to Thursday\' the way it is, because everybody knows what it means and the forms do not really matter." What has gone wrong in each case?',
      commonErrors: [
        {
          answer: 'I crossed out every passive sentence in the article, because the passive voice is weak and the active voice is always the stronger choice.',
          misconception:
            'Turning a choice into a rule. The student has heard "avoid the passive" often enough to treat it as grammar rather than as advice about emphasis, and a rule is easier to apply than a decision, because a rule does not require you to ask what the sentence is for.',
          correctsTo:
            'There is no rule against the passive voice, and there is no rule for it either. Name the effect first and the choice follows. When the reader should come away with the person, the active is right: "Dev repaired the projector before third period." When the paragraph is about the projector, or when nobody knows who repaired it, the passive is right: "The projector was repaired before third period." A revision pass that deletes every passive sentence on sight throws away the one sentence a writer needs whenever the doer is unknown, and it forces the writer to open with "somebody" or "they", which names no one and takes the loudest seat in the sentence to do it.',
        },
        {
          answer: 'The line "If I was in charge of the schedule, I will move the meetings to Thursday" can stay as it is, because everybody knows what it means.',
          misconception:
            'Treating verb forms as decoration rather than as information. The student is right that a reader can work out roughly what is meant, and wrong that the meaning is all these forms carry: they are how a reader tells a real plan from an imagined one, and a newsletter is read by people who do not know which is which.',
          correctsTo:
            'Read the line as someone who does not know the writer. "If I was in charge" uses the plain past form, which a reader takes as a real possibility, and "I will move the meetings" is a flat promise, so the sentence sounds like a schedule change that is actually coming. The writer is not in charge and is not going to be. WRONG: "If I was in charge of the schedule, I will move the meetings to Thursday." CORRECT: "If I were in charge of the schedule, I would move the meetings to Thursday." The "were" marks the situation as contrary to fact, and "would" keeps what follows inside that imagined situation instead of promising it to a reader who will otherwise show up on Thursday.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Both voices are correct and every mood is correct, so the question is never which one is allowed. It is which one does the job you want. Name the effect in one sentence, pick the form that produces it, then read both versions back and check that only the emphasis moved.',
        'Whatever sits in the subject seat is what the reader remembers, so the active voice is the choice when the point is the person: "Dev repaired the projector before third period." Naming the actor in a "by" phrase is not the same as emphasizing the actor.',
        'The passive voice puts the action or its receiver out front and makes the doer optional: "The projector was repaired before third period." Choose it when the receiver is what the paragraph is about, when the doer is unknown, or when the doer is beside the point.',
        'When you do not know the doer, the passive lets you leave that seat empty instead of filling it with "somebody" or "they", which name no one and take the loudest position in the sentence to do it.',
        'The conditional — would, could, might — presents something as possible rather than settled, and it only does that job when the reader can also see the condition it depends on.',
        'The subjunctive marks a situation you know is not so. WRONG: "I wish the gym was bigger." CORRECT: "I wish the gym were bigger." A contrary-to-fact "if" clause takes the conditional in its other half: "If the gym were bigger, we would hold the fair inside."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Voice & Mood for Effect' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
