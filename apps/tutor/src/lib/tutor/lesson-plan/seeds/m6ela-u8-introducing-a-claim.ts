/**
 * Grade 6 ELA — Argument Writing: Claims, Reasons & Evidence: Introducing a
 * Claim.
 *
 * WRITING row for m6ela (CCSS W.6.1a). Two jobs only: state a claim plainly,
 * in one sentence a reasonable reader could agree or disagree with, and then
 * organize the reasons and evidence that will support it in a clear order —
 * claim first, each reason immediately paired with the evidence that backs
 * it up. This format has no free-response item, so every try_yourself is a
 * recognition MCQ built from a candidate opening or a candidate paragraph;
 * the actual composing and revising happens in the two worked examples,
 * where the tutor turns a bare topic into a claim and then reorganizes a
 * jumbled draft into a clear one.
 *
 * SCOPE GUARD: Grade 6 row 8.1 teaches a student to (a) state a claim
 * plainly, as one sentence distinct from a fact, a question, or a bare
 * topic, and (b) organize the reasons and evidence that will support that
 * claim into a clear order, with the claim first and each reason paired
 * with its own matching evidence. DELIBERATELY EXCLUDED: acknowledging or
 * answering an opposing claim, which has no Grade 6 CCSS antecedent and
 * begins at Grade 7 (W.7.1a) — no item or worked example in this file ever
 * mentions another side of the argument; judging whether a reason is
 * logically strong, or whether evidence is relevant, sufficient, or drawn
 * from a credible source, which is row 8.2's job (W.6.1b) — no item here
 * asks whether a reason or a piece of evidence is GOOD, only whether the
 * material is arranged in a clear order; linking words such as "because,"
 * "therefore," or "for example" that connect a claim to its reasons, which
 * is row 8.3 (W.6.1c); and writing a concluding statement, which is row 8.4
 * (W.6.1e). This row also never asks the student to read and sort an
 * argument somebody else already wrote into supported or unsupported claims
 * — that is row 4.3's reading skill (RI.6.8), built the opposite direction
 * from this row's writing skill. DELIBERATELY ALLOWED, because three
 * neighboring skills sit close: (a) distinguishing a claim from a fact, a
 * question, and a bare topic is unavoidable groundwork for "introducing a
 * claim plainly," and it is echoed in Grade 7's own claims-and-reasons row
 * at greater depth — this row stops there and never tests whether two
 * reasons are distinct pillars, which is Grade 7 territory; (b) an item may
 * ask whether a piece of evidence is placed next to the reason it actually
 * supports, since matching evidence to its own reason is part of organizing
 * material in a clear order — no item asks whether that evidence is itself
 * strong, credible, or sufficient, which stays row 8.2's job; (c) the words
 * claim, reason, and evidence also appear in row 4.3's reading lesson, where
 * the skill is sorting an already-written argument's claims into supported
 * or not; here the skill is building and arranging the student's own claim,
 * reasons, and evidence from nothing, and no item in this file asks the
 * student to grade or sort an existing argument.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt, note, and paragraph in this file
 * is original prose written for the item. This course carries no passage
 * machinery — no passageId, no shared texts — so every question must be
 * answerable from the words printed inside that same item. No published
 * work is quoted or paraphrased anywhere in this file. Every phrase inside
 * quotation marks in a step, hint, or answer appears character-for-character
 * in the text it quotes from; quote your own text exactly, never from
 * memory. No contraction appears anywhere in this file's authored voice.
 *
 * CLAIM LEDGER (informational content inside argumentative passages):
 * every claim examined below is STIPULATED — a specific invented for this
 * fictional school setting, true by authorial fiat and checked only for
 * being internally consistent with the rest of its own item. No sentence
 * anywhere in this file asserts a claim about the real world, so there are
 * no REAL-WORLD rows in this ledger.
 *
 *   Claim                                    | Where              | Kind       | Grounds
 *   The picnic tables are empty most days    | hook script        | STIPULATED | Invented detail for
 *                                             |                    |            | this hook's fictional
 *                                             |                    |            | school; used once, not
 *                                             |                    |            | contradicted elsewhere.
 *   The school library currently closes at   | worked example 1   | STIPULATED | Invented detail that
 *   3:30                                      |                    |            | sets up the topic-to-
 *                                             |                    |            | claim conversion.
 *   Every day at recess an argument breaks   | worked example 2   | STIPULATED | Invented recess detail;
 *   out over the jacket-goal                 |                    |            | identical wording in the
 *                                             |                    |            | jumbled draft and the
 *                                             |                    |            | revised paragraph.
 *   Twice last month a recess monitor        | worked example 2   | STIPULATED | Invented detail;
 *   retrieved a ball from the parking lot    |                    |            | identical wording in the
 *                                             |                    |            | jumbled draft and the
 *                                             |                    |            | revised paragraph.
 *   The teacher has picked the read-aloud    | try-yourself 1     | STIPULATED | Invented detail used only
 *   book every month since September         |                    |            | as the fact-distractor's
 *                                             |                    |            | own content.
 *   Three water bottles and two jackets were | try-yourself 2     | STIPULATED | Invented detail; the same
 *   found under the bleachers and thrown out |                    |            | wording and count appear
 *   last month                                |                    |            | in every choice that uses
 *                                             |                    |            | it.
 *   The gym doors are the last stop before   | try-yourself 2     | STIPULATED | Invented layout detail;
 *   the hallway to homeroom                  |                    |            | identical wording in every
 *                                             |                    |            | choice that uses it.
 *   The nurse's office keeps its own lost-   | try-yourself 2     | STIPULATED | Invented detail used once,
 *   and-found box for medicine               |                    |            | as a true-but-irrelevant
 *                                             |                    |            | distractor detail.
 *   On Tuesdays, when only pizza is served,  | try-yourself 3     | STIPULATED | Invented detail; identical
 *   the trash cans by the exit are full of   |                    |            | wording wherever it is
 *   barely touched trays                      |                    |            | reused across choices.
 *   The lunch monitor has said a wrap or     | try-yourself 3     | STIPULATED | Invented reported remark
 *   sandwich helps students eat faster       |                    |            | attributed to a fictional
 *                                             |                    |            | staff member, not a real-
 *                                             |                    |            | world statistic.
 *   The front office is busy Monday          | misconception check| STIPULATED | Invented scheduling detail
 *   mornings, and Friday gives performers    |                    |            | for this scenario, used
 *   all week to practice                      |                    |            | only within that item.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U8_INTRODUCING_A_CLAIM: LessonPlan = {
  id: 'evelyn.ms.m6ela.introducing-a-claim.v1',
  title: 'Introducing a Claim',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.introducing-a-claim',
      standard: 'M6ELA-8.1',
      description:
        'Introduce a claim and organize the reasons and evidence that will support it in a clear order, stating the claim plainly as one sentence distinct from a fact, a question, or a bare topic, and pairing each reason with its own matching evidence — introducing one claim plainly, not yet acknowledging an opposing claim, which begins at Grade 7 (CCSS W.6.1a; that acknowledgment is W.7.1a).',
    },
  ],
  prerequisites: ['m6ela.word-relationships-and-analogies'],
  followUps: ['m6ela.supporting-a-claim-with-reasons-and-evidence'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a claim states a position while a topic only points at one, then name the two skills the lesson builds.',
      script:
        'Your class wants to eat lunch outside at the picnic tables whenever it is sunny. One classmate drops a note in the suggestion box that says, "Outside lunch is a nice idea." Nothing happens, because that sentence never says what should actually happen — it only names the topic. Another classmate writes, "Our school should let classes eat lunch outside at the picnic tables on any day above sixty degrees, because the cafeteria gets loud, and because the picnic tables are empty most days anyway." That second note is a claim, and it already lines up two reasons behind it in order. Today you learn to state a claim exactly that plainly, and then to arrange the reasons and evidence that back it up so a reader can follow the argument without getting lost.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-claim-and-clear-order',
      kind: 'concept',
      goal: 'Install what makes a sentence a claim rather than a fact, question, or topic, and what makes an arrangement of reasons and evidence a clear order rather than a jumbled one.',
      keyIdeas: [
        'A CLAIM OPENS AN ARGUMENT, STATED PLAINLY IN ONE SENTENCE. It says the position the writer wants a reader to accept, and it only works when a reasonable reader could take either side of it. It is not a fact nobody can argue with, a question that has not been answered yet, or a bare topic that names a subject and picks no side.',
        'THREE THINGS OFTEN GET DROPPED IN WHERE A CLAIM BELONGS. A FACT: "The cafeteria line is the longest line in the building." That is checkable, so nobody can disagree with it. A QUESTION: "Should the cafeteria line move faster?" That asks, and does not answer. A TOPIC: "The cafeteria line." That names a subject and takes no side. Turn any of the three into a claim by picking a side and saying plainly what should happen.',
        'AFTER THE CLAIM COMES A CLEAR ORDER FOR THE REASONS AND EVIDENCE THAT WILL SUPPORT IT. Organizing means deciding, before writing the rest, which reason comes first, which comes next, and which piece of evidence belongs with which reason — not yet judging whether those reasons are strong enough, which is a later lesson, only arranging what will appear and in what sequence.',
        'A CLEAR ORDER KEEPS EACH REASON NEXT TO ITS OWN EVIDENCE. If a paragraph names two reasons and then piles several pieces of evidence together at the end, a reader cannot tell which fact belongs to which reason. Evidence placed right after the reason it actually supports is what makes an order clear instead of jumbled.',
        'A COMMON ORGANIZING MISTAKE IS BURYING THE CLAIM. If the claim shows up only in the last sentence, after several reasons that came first, a reader spends most of the paragraph not knowing what is even being argued. State the claim early, and let the reasons and evidence follow it in order.',
        'TODAY IS ONLY THE CLAIM AND ITS ORDER, NOT YET WHETHER AN OPPOSING VIEW IS MENTIONED. A later lesson deals with acknowledging what someone who disagrees might say. This lesson stops at introducing one claim plainly and putting a clear plan of reasons and evidence behind it.',
      ],
      vocabulary: [
        { term: 'claim', definition: 'the position an argument states plainly, in one sentence, that a reasonable reader could agree or disagree with.' },
        { term: 'topic', definition: 'the subject an argument is about, named without yet taking any side.' },
        { term: 'reason', definition: 'a statement that explains why a claim should be accepted.' },
        { term: 'evidence', definition: 'a specific fact, count, or detail that backs up a reason.' },
        { term: 'clear order', definition: 'an arrangement of the claim, reasons, and evidence that lets a reader follow the argument without getting lost, usually the claim first and then each reason paired with its own evidence.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-claim-from-topic',
      kind: 'worked_example',
      problem:
        'You have been handed the topic "the school library\'s after-school hours" and told to write an argument about it. Turn it into a claim, checking it against two other things it could be mistaken for.',
      steps: [
        'Notice what you have been given first. "The school library\'s after-school hours" names a subject and takes no side, so it is a TOPIC, not yet a claim.',
        'Turn the topic into a question, because a question is easier to write than a claim: "Should the library stay open later after school?" This is still not a claim. A question asks. A claim answers.',
        'Answer the question in one plain sentence that takes a side: "The school library should stay open until 5:00 instead of closing at 3:30." That sentence is a claim.',
        'Check that the claim is not secretly a fact in disguise. "The library currently closes at 3:30" is a fact — anyone could check it, and nobody could reasonably argue the other side. "The library should stay open until 5:00" is different: a reasonable reader could disagree with it, so it passes as a claim.',
        'WRONG way to open the argument: "The library\'s hours are worth thinking about." That sentence still only points at the topic; it never actually says what should happen. CORRECT: state the plain position, the way step three does, so a reader knows the writer\'s stance in the very first sentence.',
        'Check that the sentence stays to one position. If it had said, "the library should stay open later, and the vending machine should be fixed," it would be carrying two claims stitched together, and each one would need its own argument.',
      ],
      answer:
        'Claim: "The school library should stay open until 5:00 instead of closing at 3:30." It takes a side a reader could reasonably disagree with, and it states that position in one plain sentence, not as a fact, a question, or a bare topic.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-organize-the-order',
      kind: 'worked_example',
      problem:
        'A classmate\'s first draft of an argument note is jumbled. Read it, then reorganize it so the claim comes first and each reason sits right next to its own evidence.\n\nFIRST DRAFT: "Twice last month a recess monitor had to walk into the parking lot to get a ball that rolled past the blacktop\'s edge. A net would keep the ball from rolling into the parking lot, and it would also give recess soccer games real goals instead of jackets and backpacks piled up as markers. Every day at recess, at least one argument breaks out over whether a ball went inside the jacket-goal or missed it. Our school should put a soccer net on the blacktop."',
      steps: [
        'Find the claim first, wherever it is hiding in the draft. Here it is the very last sentence: "Our school should put a soccer net on the blacktop."',
        'WRONG: burying the claim at the end makes a reader hold three unexplained sentences in mind before learning what is even being argued. CORRECT: move the claim to the front, so the reader knows the position immediately.',
        'Find the two reasons folded into the draft: a net would give games real goals instead of jacket-piles, and a net would keep the ball from rolling into the parking lot.',
        'Check where the evidence for each reason actually sits. The parking-lot evidence, "Twice last month a recess monitor had to walk into the parking lot...", is printed before its own reason instead of after it. The jacket-goal evidence, "Every day at recess, at least one argument breaks out...", is printed after BOTH reasons instead of right beside the one it backs up.',
        'WRONG: leaving evidence stranded ahead of its reason, or lumped in with a different reason, forces a reader to reconnect the pieces alone. CORRECT: put the claim first, then follow each reason immediately with the evidence that belongs to it.',
        'Rebuild the paragraph in that order: claim, then reason one with its own evidence, then reason two with its own evidence.',
      ],
      answer:
        'Our school should put a soccer net on the blacktop. A net would give recess soccer games real goals instead of jackets and backpacks piled up as markers: every day at recess, at least one argument breaks out over whether a ball went inside the jacket-goal or missed it. A net would also keep the ball from rolling into the parking lot, since twice last month a recess monitor had to walk into the parking lot to get a ball that rolled past the blacktop\'s edge.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-the-claim',
      kind: 'try_yourself',
      problem:
        'Your class is deciding whether to vote on which book gets read aloud each month, instead of the teacher choosing alone. Which sentence is a claim you could build that argument on?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Right now, the teacher is the one who picks which book the class reads aloud every month, and that has been true since September.' },
        { id: 'b', text: 'The class should get to vote on which book is read aloud each month instead of leaving the choice to the teacher alone.', correct: true },
        { id: 'c', text: 'Should the class get a vote on which book gets read aloud each month, or should the teacher keep choosing it alone?' },
        { id: 'd', text: 'Voting on which book the class reads aloud is a topic that plenty of students in the class have strong opinions about.' },
      ],
      expectedAnswer: 'The class should get to vote on which book is read aloud each month instead of leaving the choice to the teacher alone.',
      hints: [
        'A claim takes a side. Ask of each choice: does it tell you what the writer thinks should happen, or does it only describe, ask about, or name the subject?',
        'One choice can be checked against how the class already runs and is not arguable, one only asks a question without answering it, and one names an opinion-loaded topic without ever saying what should happen.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-organized-introduction',
      kind: 'try_yourself',
      problem:
        'Four students each wrote an opening for the same argument: that the school should put a lost-and-found bin right outside the gym doors, because items get left behind after gym class and because a bin by the doors would be easy for students to check on their way back to class. Which one is organized in a clear order?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Items get left behind after gym class more often than people notice. Last month, three water bottles and two jackets were found under the bleachers and thrown out because nobody knew where to bring them. A bin by the doors would also be easy for students to check on their way back to class, since the gym doors are the last stop before the hallway to homeroom, so a bin there would not add any extra walking. Our school should put a lost-and-found bin right outside the gym doors.',
        },
        {
          id: 'b',
          text: 'Our school should put a lost-and-found bin right outside the gym doors, because items get left behind after gym class and because a bin by the doors would be easy to check on the way back to class. Last month, three water bottles and two jackets were thrown out, the gym doors are the last stop before the hallway to homeroom, and the nurse\'s office already keeps its own lost-and-found box for medicine.',
        },
        {
          id: 'c',
          text: 'Our school should put a lost-and-found bin right outside the gym doors. Items get left behind after gym class more often than people notice: last month, three water bottles and two jackets were found under the bleachers and thrown out because nobody knew where to bring them. A bin by the doors would also be easy for students to check on their way back to class, since the gym doors are the last stop before the hallway to homeroom, so a bin there would not add any extra walking.',
          correct: true,
        },
        {
          id: 'd',
          text: 'Our school should put a lost-and-found bin right outside the gym doors. The gym doors are the last stop before the hallway to homeroom. Last month, three water bottles and two jackets were found under the bleachers and thrown out. A bin would not add any extra walking, and items get left behind after gym class more often than people notice.',
        },
      ],
      expectedAnswer:
        'Our school should put a lost-and-found bin right outside the gym doors. Items get left behind after gym class more often than people notice: last month, three water bottles and two jackets were found under the bleachers and thrown out because nobody knew where to bring them. A bin by the doors would also be easy for students to check on their way back to class, since the gym doors are the last stop before the hallway to homeroom, so a bin there would not add any extra walking.',
      hints: [
        'Find the sentence that states the actual position in each paragraph. Is it first, buried at the end, or hard to separate from everything else?',
        'Trace each piece of evidence back to the reason sitting next to it. In the best-organized paragraph, every reason is followed right away by the fact that backs it up, and nothing true but unrelated gets mixed in.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-evidence-to-reason',
      kind: 'try_yourself',
      problem:
        'Four students each wrote an opening for the same argument: that the school should add a salad bar to the lunch line, because it would let students build a lunch that fits what they actually want to eat, and because more students would finish eating within their twenty minutes. Which one keeps the claim first and pairs each reason with its own matching evidence?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Our school should add a salad bar to the lunch line. Students would be able to build a lunch that fits what they actually want to eat, and the lunch monitor has said several times that when a wrap or sandwich is offered, students eat faster and there are fewer half-finished lunches at the bell. A salad bar would also help more students finish eating within their twenty minutes, since on Tuesdays, when only pizza is served, the trash cans by the exit are always full of barely touched trays.',
        },
        {
          id: 'b',
          text: 'Our school should add a salad bar to the lunch line, because it would let students build a lunch that fits what they actually want to eat, and because more students would finish eating within their twenty minutes. On Tuesdays, when only pizza is served, the trash cans by the exit are always full of barely touched trays.',
        },
        {
          id: 'c',
          text: 'On Tuesdays, when only pizza is served, the trash cans by the exit are always full of barely touched trays, and the lunch monitor has said several times that a wrap or sandwich helps students eat faster. Our school should add a salad bar to the lunch line, because it would let students build a lunch that fits what they actually want to eat and finish within their twenty minutes.',
        },
        {
          id: 'd',
          text: 'Our school should add a salad bar to the lunch line. Students would be able to build a lunch that fits what they actually want to eat: on Tuesdays, when only pizza is served, the trash cans by the exit are always full of barely touched trays. A salad bar would also help more students finish eating within their twenty minutes, since the lunch monitor has said several times that when a wrap or sandwich is offered, students eat faster and there are fewer half-finished lunches at the bell.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Our school should add a salad bar to the lunch line. Students would be able to build a lunch that fits what they actually want to eat: on Tuesdays, when only pizza is served, the trash cans by the exit are always full of barely touched trays. A salad bar would also help more students finish eating within their twenty minutes, since the lunch monitor has said several times that when a wrap or sandwich is offered, students eat faster and there are fewer half-finished lunches at the bell.',
      hints: [
        'Match each piece of evidence back to the reason it is actually proving. Does the fact sitting next to a reason really explain that reason, or does it belong to the other one?',
        'Three paragraphs have a good claim and true-sounding evidence, but the evidence is swapped between the two reasons, missing for one reason, or placed before the claim even appears. Only one paragraph pairs every reason with its own matching evidence and puts the claim first.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-opener-and-saved-for-last',
      kind: 'misconception_check',
      question:
        'A student drafts this opening for a talent-show argument: "The talent show sign-up sheet is something people around here have a lot of opinions about. It should probably go up by the gym doors, though the front office being busy on Monday mornings is also worth mentioning, and so is the fact that Friday gives performers all week to practice." The student explains the choices this way: "I like starting with the topic so the reader knows what it is about, and I saved my strongest reason, the busy front office, for the end so it would land hardest." Name the two separate problems with that plan.',
      commonErrors: [
        {
          answer: 'I like starting with the topic so the reader knows what it is about.',
          misconception:
            'Treating a sentence that only names the topic as an acceptable opener. "The talent show sign-up sheet is something people around here have a lot of opinions about" never actually states a position — it only announces that opinions exist, which leaves the reader waiting to find out what the writer thinks should happen.',
          correctsTo:
            'State the claim plainly in the very first sentence instead of gesturing at the topic first: "The talent show sign-up sheet should go up by the gym doors starting Monday." A reader then knows the position immediately, and the topic never needed a sentence of its own.',
        },
        {
          answer: 'I saved my strongest reason, the busy front office, for the end so it would land hardest.',
          misconception:
            'Treating an introduction like a story with a planned reveal, and choosing an order by which reason feels most dramatic instead of by a plan that keeps every reason next to what backs it up.',
          correctsTo:
            'Decide the order before writing, not for dramatic effect. Once the claim is stated, list the reasons in a sequence that makes sense to a reader — both reasons can appear right after the claim, each one immediately followed by the detail that explains it, with no requirement that any one reason wait until the end.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A claim opens an argument, stated plainly in one sentence that a reasonable reader could agree or disagree with.',
        'A fact, a question, and a bare topic are not claims. Turn any of them into a claim by taking a side and saying plainly what should happen.',
        'After the claim, organize the reasons and evidence that will support it in a clear order, deciding what comes first and what comes next before writing the rest.',
        'Keep each reason next to its own evidence. Evidence dumped together at the end, or matched to the wrong reason, leaves a reader unable to tell what backs up what.',
        'State the claim early. Burying it at the end of the paragraph forces a reader through several unexplained sentences before learning what is even being argued.',
        'This lesson stops at introducing one claim and organizing its reasons and evidence. Whether those reasons are strong enough, and how to answer an opposing view, come later.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Introducing a Claim' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
