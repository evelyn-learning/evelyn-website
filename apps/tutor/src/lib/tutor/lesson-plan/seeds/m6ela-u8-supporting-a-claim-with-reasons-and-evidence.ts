/**
 * Grade 6 ELA — Argument Writing: Supporting a Claim with Reasons & Evidence.
 *
 * PROCEDURE-LED row for the m6ela fan-out (Unit 8 writing rows take the
 * procedure-led shape). Row 8.1 hands this lesson a claim already introduced;
 * this row's one job is the move underneath it: pair every claim with a
 * REASON (why the claim is true) and EVIDENCE (something checkable that
 * shows the reason is real). The best misconception in sixth-grade argument
 * writing is a "reason" that only restates the claim in new words — this
 * plan is built to kill exactly that, and its second target is evidence that
 * is true but only relates to the general topic instead of backing the
 * specific reason it sits under. There is no free-response item anywhere in
 * this course (tryFormat: three-mcq), so both worked examples carry the
 * actual production — the tutor drafting a reason and evidence from
 * scratch, then repairing a weak draft — and all three try_yourself items
 * are recognition MCQs: which reason actually explains the claim, and which
 * piece of evidence actually backs a given reason.
 *
 * SCOPE GUARD: this lesson pairs a given claim with a reason and evidence
 * (W.6.1b) and teaches two tests: the restated-claim test for reasons, and
 * the relevance test for evidence. DELIBERATELY EXCLUDED: introducing a
 * claim and ordering reasons/evidence, which is row 8.1's job — every claim
 * in this file is handed to the student already written, never built here;
 * selecting among linking words and phrases (because, therefore, for
 * example, consequently) to signal the relationship between a claim and its
 * reasons, which is row 8.3's job — "because" appears throughout this file
 * only as the plain join between a claim and its reason, never as a chosen
 * device among alternatives; writing a concluding statement, which is row
 * 8.4's job; reading and grading somebody ELSE's already-written argument by
 * sorting its claims into supported and unsupported, which is Unit 4's
 * tracing-an-argument row (RI.6.8) — this row only produces new reasons and
 * evidence for a claim the student is building, it never evaluates a
 * finished text; elaboration, meaning the explicit sentence that explains
 * how a piece of evidence proves its reason — Grade 6's W.6.1b stops at
 * reasons and evidence and does not require that sentence, so this row does
 * not teach it, unlike the shipped Grade 7 row built on W.7.1b
 * (`m7ela-u8-evidence-and-elaboration.ts`), which adds it as a genuinely new
 * move; full evaluation of which of several sources is more trustworthy,
 * which is Unit 10.2 (`evaluating-source-credibility`) — this row only asks
 * whether a piece of evidence plausibly comes from someone or something in a
 * position to know, not how to weigh competing sources against each other;
 * and acknowledging or rebutting an opposing claim (W.7.1a), which has no
 * Grade 6 CCSS antecedent and does not appear in this course at all.
 * DELIBERATELY ALLOWED, because the neighboring rows sit close: every item
 * in this file must print a claim to hang a reason or evidence off, so a
 * claim sentence appears throughout — the boundary is that this lesson never
 * asks the student to build, improve or judge the claim itself, only what
 * gets built underneath it.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt, scenario and quoted line in this
 * file is original prose written for this lesson. This course carries no
 * passage machinery — no passageId, no shared texts — so every item must be
 * solvable from the words printed inside it alone. Every weak or wrong
 * example IN THE TUTOR'S OWN PROSE is labeled WRONG, with the CORRECT
 * version beside it, because a tutor reads these lines aloud and an
 * unlabeled restated-claim "reason" would be handed to the student as a
 * model. The only unlabeled wrong forms in this file are the MCQ distractors
 * the three try_yourself items ask the student to reject, which is exactly
 * what those items are for; each is named in that item's hints. No
 * contraction appears anywhere in the tutor's own voice.
 *
 * CLAIM LEDGER (informational specifics):
 *   Claim                                    | Where              | Kind        | Grounds
 *   Recycling keeps plastic and paper out    | try-2 choice (a)   | REAL-WORLD  | Basic, long-settled fact
 *   of landfills.                            |                    |             | about what recycling does;
 *                                             |                    |             | not a statistic, uncontested.
 *   Many schools across the country have     | try-2 choice (a)   | REAL-WORLD  | General, widely reported
 *   started adding more recycling bins in    | AND try-1 choice   |             | trend, stated with "so many"
 *   recent years.                            | (b)                |             | rather than a precise count.
 *   The front office had thirty-one          | worked example 1   | STIPULATED  | Invented for this item.
 *   unclaimed jackets stacked on one table.  |                    |             | Nothing else in the item
 *                                             |                    |             | gives a conflicting count.
 *   Cars backed up past the flagpole ten     | worked example 2   | STIPULATED  | Invented scenario; the
 *   minutes after the bell; eleven late      |                    |             | Friday-backup detail and the
 *   pickups were logged after 3:40.          |                    |             | eleven-pickup count do not
 *                                             |                    |             | conflict with each other.
 *   Last spring, Ms. Alvarez's homeroom      | try-1 choice (d)   | STIPULATED  | Invented single-class
 *   alone collected forty-two pounds of      |                    |             | example; used only to show
 *   bottles and cans during a recycling      |                    |             | an example offered as a
 *   drive.                                   |                    |             | reason. No other count
 *                                             |                    |             | depends on this number.
 *   The counselor found paper mixed into     | try-2 choice (d)   | STIPULATED  | Invented observation;
 *   trash bins outside four classrooms.      |                    |             | consistent with the reason
 *                                             |                    |             | it is written to support.
 *   The gym's recycling bin, on the          | try-2 choice (c)   | STIPULATED  | Invented detail about a
 *   opposite side of the building, is        |                    |             | different bin and location,
 *   emptied by the custodian twice a week.   |                    |             | used to show a true-but-
 *                                             |                    |             | irrelevant fact.
 *   So many students packed into the         | try-3 choice (a)   | STIPULATED  | Invented single-day
 *   library that the librarian turned        |                    |             | observation, consistent
 *   latecomers away.                         |                    |             | with the reason it backs.
 *   The computer lab has eighteen working    | try-3 choice (c)   | STIPULATED  | Invented detail, used to
 *   computers mostly unused at lunch, five   |                    |             | show a true fact that backs
 *   days a week.                             |                    |             | a different reason instead.
 *   The student walked Ms. Ortiz's dog       | hook / concept     | STIPULATED  | Invented personal anecdote,
 *   nineteen times without missing a day.    | keyIdea 3          |             | used only to illustrate the
 *                                             |                    |             | relevance test.
 *   Six kids sat on the curb by the bus      | misconception      | STIPULATED  | Invented scenario; the
 *   loop last Monday.                        | check              |             | single detail does not
 *                                             |                    |             | conflict with anything else
 *                                             |                    |             | in the item.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U8_SUPPORTING_A_CLAIM_WITH_REASONS_AND_EVIDENCE: LessonPlan = {
  id: 'evelyn.ms.m6ela.supporting-a-claim-with-reasons-and-evidence.v1',
  title: 'Supporting a Claim with Reasons & Evidence',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.supporting-a-claim-with-reasons-and-evidence',
      standard: 'M6ELA-8.2',
      description:
        'Support a claim with a clear reason that explains why the claim is true and relevant evidence — an observation, a documented example, or a statement from a credible source — that shows the reason is real, distinguishing a genuine reason from one that only restates the claim, and evidence that backs the specific reason it sits under from evidence that merely relates to the topic (CCSS W.6.1b).',
    },
  ],
  prerequisites: ['m6ela.introducing-a-claim'],
  followUps: ['m6ela.linking-words-for-claims-and-reasons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a claim repeated with feeling is not a reason, and that a real reason plus real evidence is what actually moves a listener.',
      script:
        'You want a dog. You tell your parents, "I should get a dog because I really, really want one." Watch what happens: nothing. You have not given them anything new to think about, because "I want one" is just the claim again, said louder. Now try this instead. "I should get a dog, because I already walk our neighbor Ms. Ortiz\'s dog every day after school, so I already know how to handle a leash and clean up after a pet." That is a reason — it explains why the claim is true. Add one more sentence. "Last month I walked her dog nineteen times without missing a single day, and she wrote a note saying I never forgot." That is evidence — something checkable that shows the reason is real. Two sentences just did more work than ten minutes of begging. Today you build both of them, on purpose, every time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reason-and-evidence',
      kind: 'concept',
      goal: 'Install the reason/evidence distinction, the restated-claim test, the relevance test, and what counts as usable evidence at this level.',
      keyIdeas: [
        'A CLAIM NEEDS TWO DIFFERENT KINDS OF SUPPORT UNDERNEATH IT: A REASON AND EVIDENCE. A REASON answers the question why — it explains why the claim is true. EVIDENCE is what shows that reason is real: something a reader could actually check, such as an observation you made, a documented example (something written down, like a sign-up sheet or an office log), or a statement from a credible source, meaning someone or something in a position to actually know.',
        'THE MOST COMMON MISTAKE: A "REASON" THAT ONLY REPEATS THE CLAIM. Test every reason by saying it right after the claim with the word because in between, then ask whether it tells you anything the claim did not already say. WRONG: "I should get a dog, because I really want a dog." That sentence just says the claim again with more feeling. CORRECT: "I should get a dog, because I already walk my neighbor\'s dog every day after school and know how to handle a leash." The second one names an actual why.',
        'EVIDENCE HAS A JOB TOO: IT MUST BACK THIS EXACT REASON, NOT JUST THE GENERAL TOPIC. A true fact about the same subject can still fail to support the specific reason sitting above it. Run the relevance test: say the reason, say the evidence, and ask whether the evidence makes that reason more believable. "Last month I walked her dog nineteen times without missing a single day" backs the reason about knowing how to handle a leash. "Lots of kids at school have dogs" does not — it only relates to the topic of dogs in general and says nothing about whether this student can be trusted with one.',
        'GOOD EVIDENCE AT YOUR LEVEL COMES FROM SOMETHING YOU CAN ACTUALLY POINT TO. An observation you made yourself. A documented example, meaning something written down that another person could look at, like a sign-in sheet or a counted list. A statement from someone who would know. Never a number that only sounds official. If you cannot say exactly where a number came from, do not use that number.',
        'USING A CREDIBLE SOURCE MEANS THE EVIDENCE COMES FROM SOMEWHERE A READER COULD TRUST — someone in a position to actually know the answer, or something recorded rather than guessed. This lesson does not yet teach how to judge which of several sources is more trustworthy than another; for now, a source that would plausibly know the answer is enough.',
      ],
      vocabulary: [
        { term: 'reason', definition: 'a statement that answers why a claim is true; it has to add something the claim did not already say.' },
        { term: 'evidence', definition: 'a checkable detail — an observation, a documented example, or a credible source\'s statement — that shows a reason is real.' },
        { term: 'credible source', definition: 'someone or something a reader could trust to actually know the answer, rather than a guess or a rumor.' },
        { term: 'relevant', definition: 'actually about the specific reason it sits under, not merely about the same general topic.' },
        { term: 'observation', definition: 'something you noticed or counted yourself, which another person could check the same way.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-reason-and-evidence',
      kind: 'worked_example',
      problem:
        'Claim: "Our school should add a lost-and-found bin near the cafeteria doors." Build a reason and a piece of evidence for it out loud, mistakes included, the way a writer actually does it.',
      steps: [
        'First try at the reason: "Because a lost-and-found bin near the cafeteria doors would help us find lost stuff." Read it back next to the claim. A lost-and-found bin helping find lost stuff is the claim\'s own idea, said again. That is not a why.',
        'Revise it into a real reason. Second try: "Because right now, anything left near the cafeteria goes straight to the front office, and most students never think to check there before it gets sorted into the winter-break donation box." That names an actual problem the claim is fixing.',
        'First try at the evidence: "Because losing things is a big problem at school." Check it against the reason. It only talks about the general topic of losing things, and never shows that THIS reason — items disappearing into the donation box — is actually happening.',
        'Revise it into something checkable that backs this exact reason. Second try: "During the first week back from winter break last year, the front office had thirty-one unclaimed jackets stacked on one table, because nobody had thought to look there before the box went out." That is an observation, and it backs this exact reason.',
        'Read the finished pieces in order: claim, reason, evidence. Each one adds something the sentence before it did not already say.',
      ],
      answer:
        'Claim: "Our school should add a lost-and-found bin near the cafeteria doors." Reason: "Right now, anything left near the cafeteria goes straight to the front office, and most students never think to check there before it gets sorted into the winter-break donation box." Evidence: "During the first week back from winter break last year, the front office had thirty-one unclaimed jackets stacked on one table, because nobody had thought to look there before the box went out."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-weak-draft',
      kind: 'worked_example',
      problem:
        'Another student wrote this for the claim "Our school should extend the after-school pickup line by ten more minutes." Reason: "Because ten more minutes would make our pickup line longer." Evidence: "Our school has one pickup lane and two crossing guards." Find what is wrong with each part and fix it.',
      steps: [
        'Check the reason first. Read it right after the claim: extend the line by ten minutes, because ten more minutes would make the line longer. That is the claim again with the words moved around — it never says why ten minutes is needed.',
        'WRONG: "Because ten more minutes would make our pickup line longer." Revise it into a real why. CORRECT: "Because on Fridays, cars are still backed up past the flagpole ten minutes after the last bell, so families waiting behind them arrive late to pick up younger siblings at the elementary school next door."',
        'Now check the evidence: "Our school has one pickup lane and two crossing guards." Run the relevance test — say the reason, then say this evidence, and ask whether it makes the Friday backup more believable. It does not. It only relates to the general topic of pickup, not to this specific backup.',
        'WRONG: "Our school has one pickup lane and two crossing guards." Revise it into something that backs the Friday-backup reason directly. CORRECT: "Last Friday, the front office logged eleven late pickups after 3:40, and every one of those families said they were stuck behind the line at the flagpole."',
        'Read the repaired set back: claim, reason, evidence, and each sentence proves something the one before it did not.',
      ],
      answer:
        'Claim: "Our school should extend the after-school pickup line by ten more minutes." Reason: "On Fridays, cars are still backed up past the flagpole ten minutes after the last bell, so families waiting behind them arrive late to pick up younger siblings at the elementary school next door." Evidence: "Last Friday, the front office logged eleven late pickups after 3:40, and every one of those families said they were stuck behind the line at the flagpole."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-the-reason',
      kind: 'try_yourself',
      problem:
        'Claim: "Our school should add more recycling bins in the hallways." Which choice is a reason that actually explains why the claim is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because adding more recycling bins to the hallways would obviously make it much easier for our whole school to recycle more than it does right now.' },
        { id: 'b', text: 'Because recycling is an important environmental issue that schools all over the country have been paying much more attention to in recent years.' },
        { id: 'c', text: 'Because the only recycling bin sits by the front office, so most classrooms end up tossing paper straight into the trash can instead.', correct: true },
        { id: 'd', text: "Because last spring, Ms. Alvarez's homeroom alone collected forty-two pounds of bottles and cans during the week of the schoolwide recycling drive." },
      ],
      expectedAnswer:
        'Because the only recycling bin sits by the front office, so most classrooms end up tossing paper straight into the trash can instead.',
      hints: [
        'A real reason has to say something the claim did not already say. Read each choice right after the claim and ask what new information it adds.',
        'One choice just repeats the claim in different words, one talks about recycling in general without saying anything about this school, and one is a single example from one class rather than a reason that explains the whole claim.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-evidence',
      kind: 'try_yourself',
      problem:
        'Reason: "The only recycling bin sits by the front office, so most classrooms end up tossing paper straight into the trash can instead." Which piece of evidence actually shows that this reason is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Recycling keeps plastic and paper out of landfills, which is one reason so many schools across the country have started adding more bins in recent years.' },
        { id: 'b', text: 'A lot of students at our school really do care about the environment and want the whole building to do a better job with recycling this year.' },
        { id: 'c', text: "The gym's recycling bin, which sits on the opposite side of the building from any classroom, gets emptied by the school custodian twice a week, on Tuesdays and Fridays." },
        { id: 'd', text: 'During a hallway walk-through, the school counselor found paper mixed into the trash bins outside four different classrooms.', correct: true },
      ],
      expectedAnswer:
        'During a hallway walk-through, the school counselor found paper mixed into the trash bins outside four different classrooms.',
      hints: [
        'Say the reason out loud, then say each choice out loud, and ask whether the choice makes THIS reason — paper ending up in the trash near the classrooms — more believable.',
        'One choice is true about recycling in general, one reports a feeling instead of something that happened, and one is a true fact about a bin in a completely different part of the building.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evidence-versus-echo',
      kind: 'try_yourself',
      problem:
        'Claim: "Our school should turn the empty computer lab into a quiet study room during lunch." Reason: "The library gets too crowded at lunch for kids who want a quiet place to work." Which choice shows that this reason is real, instead of just saying it again?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Last Tuesday, so many students packed into the library at lunch that the librarian had to turn latecomers away at the door.', correct: true },
        { id: 'b', text: 'The library is simply too crowded at lunchtime for any student who is hoping to find a quiet, calm place to sit and actually get work done.' },
        { id: 'c', text: 'The computer lab already has eighteen working computers that mostly sit unused during the entire lunch period, five days a week.' },
        { id: 'd', text: 'A lot of kids in our grade really wish there was somewhere calmer where they could sit and eat their lunch in peace every day.' },
      ],
      expectedAnswer:
        'Last Tuesday, so many students packed into the library at lunch that the librarian had to turn latecomers away at the door.',
      hints: [
        'Evidence has to add something the reason did not already say. Read each choice and ask whether it gives a real, checkable detail or just says the reason again in different words.',
        'One choice only restates the reason, one is a true fact about the computer lab that does not show the library is crowded, and one reports a feeling instead of something that actually happened.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-restated-reason-and-loose-evidence',
      kind: 'misconception_check',
      question:
        'A student is defending this argument. Claim: "Our school should add a bench near the bus loop." Reason: "Because a bench would be a nice thing to add there." Evidence: "A lot of kids wait for the bus every day." The student says: "My reason explains it and my evidence backs it up, so I am finished." What has gone wrong?',
      commonErrors: [
        {
          answer: 'Because a bench would be a nice thing to add there.',
          misconception:
            'Treating a restated claim as if it were a reason. "A bench would be a nice thing to add" is the claim\'s own idea in different words — it never says why a bench is needed, so it explains nothing new.',
          correctsTo:
            'Test the reason by asking what it adds that the claim did not already say. A real reason names an actual problem: "Because kids wait for the bus at the loop for fifteen minutes some mornings, and right now the only place to sit is the curb." That sentence tells the reader something the claim alone could not.',
        },
        {
          answer: 'A lot of kids wait for the bus every day.',
          misconception:
            'Offering evidence that only relates to the general topic instead of backing the specific reason. Knowing that kids wait for the bus says nothing about whether they have anywhere to sit while they wait.',
          correctsTo:
            'Run the relevance test: say the reason, say the evidence, and ask whether it makes that exact reason more believable. It has to show the sitting problem, not just the waiting: "Last Monday, six kids were sitting on the curb by the bus loop because there was nowhere else to sit." That backs the specific reason instead of the topic in general.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every claim needs two different kinds of support: a reason, which answers why the claim is true, and evidence, which shows the reason is real.',
        'Test every reason against the claim: does it add something new, or does it only say the claim again in different words?',
        'Run the relevance test on every piece of evidence: does it back this exact reason, or does it only relate to the same general topic?',
        'Good evidence is something you can point to: an observation, a documented example, or a statement from a credible source — never a number you cannot explain the source of.',
        'A single example is not a reason by itself, and a feeling is not evidence.',
        'A credible source is someone or something in a position to actually know. Judging which of several sources is more trustworthy comes later.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Supporting a Claim with Reasons & Evidence' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
