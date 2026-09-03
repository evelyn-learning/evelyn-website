/**
 * Grade 8 ELA — Argument Writing: Distinguishing, Rebutting & Formal Style:
 * A Claim That Answers the Opposing Claim.
 *
 * Procedure-led row (CCSS W.8.1a). One repeatable move runs the whole lesson,
 * and it is made in a single sentence: name the strongest thing the other
 * side would say, then say what you want anyway, in the shape "Although [the
 * strongest opposing point], [what should happen], because [your strongest
 * reason]." Because Unit 8 carries no free response, the move is taught and
 * assessed entirely by revision choice: every try_yourself prints a situation
 * and four candidate claim sentences, one of which makes the move and three
 * of which fail it in a named way. Three failures this plan is built to kill:
 * a claim that ignores the other side altogether; a claim whose middle part
 * is only the other side turned negative, so it says what should NOT happen
 * and never what should; and a claim whose although part concedes a weak
 * objection while the strong one stands untouched.
 *
 * SCOPE GUARD: Grade 8 row 8.1 writes a claim sentence that DISTINGUISHES
 * itself from the opposing claim in the same breath — the "Although some
 * students want X, the school should Y because Z" shape — and recognizes the
 * failures: a claim that ignores the other side, a claim that is only the
 * other side negated, and a claim whose "although" clause is not the
 * strongest opposing point. This is the "distinguish the claim(s) from
 * alternate or opposing claims" clause W.8.1a adds to W.7.1a. Builds on
 * `m7ela-u8-claims-and-reasons.ts` (W.7.1a: a debatable claim in one sentence
 * tested against fact, question, and bare topic) and `m7ela-u8-counterclaims.
 * ts` (W.7.1a: state the strongest opposing position fairly; the
 * negative-restatement fake), whose two-move counterclaim/rebuttal structure
 * is assumed and not re-taught. Stops short of HS `engl-u9-thesis-statements.
 * ts` (W.9-10.1a: arguable, specific, provable in the space, previews the
 * reasons). DELIBERATELY EXCLUDED: answering the objection — the rebuttal and
 * the credible-source evidence behind it — which is row 8.2, so no segment
 * and no choice in this file asks the student to defeat an objection, and the
 * one draft that tries to is corrected for it; cohesion words, phrases and
 * clauses used ACROSS a claim, a counterclaim, its rebuttal and its evidence,
 * including "While it is true that" and turn-back phrases such as "Even so",
 * which are row 8.3 — every concessive clause in this file lives inside one
 * sentence and no item links two sentences; formal style, slang and the
 * replacement of a contraction in explanatory prose, which is row 8.4; how an
 * author acknowledges and responds to an opposing view inside a text the
 * student is READING, which is row 4.1; and the previewing thesis that lays
 * out two or three reasons, which is HS `engl-u9-thesis-statements.ts` — no
 * model sentence, step, hint or choice in this file carries more than one
 * "because" part, and none asks for a roadmap of reasons. DELIBERATELY
 * ALLOWED, because the two Grade 7 argument rows sit directly below this one:
 * (a) one keyIdea, one worked step, one hint and one misconception correction
 * put the question "why would they say that?" to an although clause — that is
 * a one-line reuse of the counterclaim test the student already has, not a
 * re-teaching of it, and no keyIdea defines a counterclaim or walks the
 * two-move structure; (b) "state the objection in its strongest version, not
 * a shrunken one" is a rule the student already has, and it appears here
 * because this row's own scope names an although clause that is not the
 * strongest opposing point as one of the three failures — it is applied
 * inside the claim sentence and it carries a test of its own (would the
 * objection still stand if the easy problems around it were fixed?) rather
 * than repeating the earlier lesson; (c) the word "rebuttal" appears exactly
 * twice in the tutor's spoken prose, both times only to place the answering
 * move in a later lesson (it also occurs inside the `followUps` loId, which
 * is never spoken);
 * (d) two distractors in the third try_yourself fail because the middle part
 * is too vague or names a subject instead of taking a side — those are claim
 * tests the student already has, used here as distractor errors and never
 * taught; (e) "starter word" is the term used for "Although" and "Even
 * though", which is the MS band's vocabulary.
 *
 * NOTE FOR FUTURE AUTHORS: every situation, school, claim sentence and quoted
 * draft in this file is original prose written for the item. This course
 * carries no passage machinery — no passageId, no shared texts — so each
 * question must be answerable from the words printed inside it, and no
 * published work may be quoted or closely paraphrased. Every school named
 * here is invented. Every faulty claim sentence IN THE TUTOR'S OWN PROSE is
 * labeled WRONG with the CORRECT version beside it: a tutor reads these lines
 * aloud, and an unlabeled broken claim would be handed to the student as a
 * model. Two categories of faulty sentence stand without a WRONG label,
 * because in both the item is asking the student to judge them: the MCQ
 * distractors the three try_yourself items ask the student to reject, each of
 * which is then named in that item's hints, and the two drafts printed inside
 * the misconception check, each of which is diagnosed and rewritten in that
 * segment. No contraction appears anywhere in this file.
 *
 * CLAIM LEDGER:
 *   Claim                                  | Where             | Kind        | Grounds
 *   A clause beginning with "Although" or   | concept keyIdea 2,| REAL-WORLD  | Standard English
 *   "Even though" is a dependent clause and | worked 1 step 3   |             | grammar; long-settled.
 *   cannot stand alone as a sentence        |                   |             |
 *   June afternoons are hotter than October | misconception     | REAL-WORLD  | Seasonal temperature
 *   afternoons                              | check, both       |             | pattern across the
 *                                           | drafts            |             | United States;
 *                                           |                   |             | long-settled.
 *   Glenmere: a Wednesday late bus would run| concept keyIdeas  | STIPULATED  | Invented district.
 *   half empty and would cost the district a| 2, 3, 4, 5        |             | Internally consistent:
 *   driver for one route                    |                   |             | the same two facts are
 *                                           |                   |             | the objection in every
 *                                           |                   |             | sentence that uses them.
 *   Ridgeview: the spring dance costs       | worked 1 problem, | STIPULATED  | Invented school. The
 *   nothing to attend, a trip would add a   | steps and answer  |             | cost objection and the
 *   cost for every family, the dance lasts  |                   |             | two-hour reason do not
 *   two hours and half the grade does not   |                   |             | contradict each other;
 *   come to it                              |                   |             | no figure is invented.
 *   Marlowe: the school day runs from 7:40  | worked 2 problem  | STIPULATED  | Invented school. The
 *   to 3:15, and the students against the   | and steps         |             | two printed objections
 *   rule raised a long day and a club       |                   |             | are the only ones the
 *   somebody was made to join               |                   |             | steps weigh.
 *   Ashgrove: no adult is free at 7:10 and  | try-1 problem and | STIPULATED  | Invented school. The
 *   the early bus leaves students in the    | choices           |             | forty minutes and the
 *   building for forty minutes              |                   |             | 7:10 match between the
 *                                           |                   |             | stem and every choice
 *                                           |                   |             | that repeats them.
 *   Riverton: five minutes off a period that| try-2 problem and | STIPULATED  | Invented school.
 *   meets five days a week is twenty-five   | choices           |             | Arithmetic checked:
 *   minutes of lab time a week              |                   |             | 5 minutes x 5 days =
 *                                           |                   |             | 25 minutes, and the
 *                                           |                   |             | stem and the key give
 *                                           |                   |             | the same number.
 *   Kestrel: a printed yearbook costs money | try-3 problem and | STIPULATED  | Invented school. No
 *   that about half the grade never spends  | choices           |             | precise statistic is
 *                                           |                   |             | invented; "about half"
 *                                           |                   |             | is a quantifier.
 *   Northgate: an October field day would   | misconception     | STIPULATED  | Invented school. The
 *   land in the middle of the fall sports   | check             |             | objection and the two
 *   season                                  |                   |             | drafts agree on it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U8_A_CLAIM_THAT_ANSWERS_THE_OPPOSING_CLAIM: LessonPlan = {
  id: 'evelyn.ms.m8ela.a-claim-that-answers-the-opposing-claim.v1',
  title: 'A Claim That Answers the Opposing Claim',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.a-claim-that-answers-the-opposing-claim',
      standard: 'M8ELA-8.1',
      description:
        'Write a claim sentence that DISTINGUISHES itself from the opposing claim in the same breath — the "Although some students want X, the school should Y because Z" shape — and recognize the failures: a claim that ignores the other side, a claim that is only the other side negated, and a claim whose "although" clause is not the strongest opposing point (CCSS W.8.1a).',
    },
  ],
  prerequisites: ['m8ela.shades-of-meaning-degree-and-formality'],
  followUps: ['m8ela.rebutting-with-evidence-from-credible-sources'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put the same request in front of the student twice, once ignoring the best objection and once answering it in the same sentence, so the difference is audible before it is named.',
      script:
        'You and three friends want the library open during lunch. Before you write a word you already know what the librarian will say, because she has said it twice: a lunch crowd leaves books stacked on the tables and nobody puts them back. So you have two ways to write your first sentence. One: "The library should be open during lunch, because it is the only quiet room in a building where two hundred people eat at the same time." Two: "Although a lunch crowd would leave books stacked on the tables, the library should be open during lunch, because it is the only quiet room in a building where two hundred people eat at the same time." Both sentences say what you want, and neither one gives up an inch. Only the second one tells the reader that you already know the best reason to tell you no. Somebody holding that objection has to set it down before your second sentence starts. That is the move today, and it fits in one sentence: say what the other side has, then say what you want anyway.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-distinguishing-claim',
      kind: 'concept',
      goal: 'Install the three-part shape of a distinguishing claim, the test that finds the strongest opposing point, and the two ways the sentence collapses.',
      keyIdeas: [
        'A DISTINGUISHING CLAIM ANSWERS THE OTHER SIDE INSIDE THE CLAIM SENTENCE. You already know how to write a claim that is a debatable position in one sentence, and you already know how to state the strongest opposing position fairly. Today those two jobs go into the same sentence. The claim names the strongest thing the other side would say, and then says what you want anyway. That is what distinguishing means here: a reader can tell your position from the opposing position immediately, in the first sentence, instead of waiting for a later paragraph to sort the two apart.',
        'THE SHAPE HAS THREE PARTS, AND THE ORDER MATTERS. "Although [the strongest opposing point], [what should happen], because [your strongest reason]." The first part belongs to the other side and opens with a starter word, usually "Although" or "Even though"; it is a dependent clause, so it cannot stand as a sentence on its own, and that is exactly why it cannot run away with your paragraph. The middle part is yours and carries the position. The last part is your reason. Here is the whole thing: "Although a late bus would run half empty on some Wednesdays, Glenmere should add one, because the students who stay for clubs are the ones with no ride home." The concession goes first on purpose, so the sentence lands on your side.',
        'THE ALTHOUGH PART HAS TO BE THE STRONGEST REAL OBJECTION. Conceding a weak point is worse than conceding nothing, because a reader who is holding the strong objection now knows that you either missed it or stepped around it. Two tests find the strong one. Would somebody on the other side read your although part and say that it is their point? And would that objection still stand if the easy problems around it were fixed? The one that survives the easy fix is almost always the strongest. WRONG: "Although some people are just against change, Glenmere should add a late bus on Wednesdays." CORRECT: "Although a late bus would run half empty on some Wednesdays, Glenmere should add a late bus on Wednesdays."',
        'THE MIDDLE PART HAS TO BE A POSITION, NOT A DENIAL. A claim that is only the other side turned negative tells a reader what you are against and never what you want. WRONG: "Although a late bus would cost the district a driver for one route, Glenmere should not leave club students without a ride." Nobody can act on that sentence, because it never names the thing that should happen. CORRECT: "Although a late bus would cost the district a driver for one route, Glenmere should add a late bus on Wednesdays." The check takes two seconds: cover the although part with your hand and read what is left. If the words that remain do not ask for something, there is no claim in the sentence.',
        'THE TWO PARTS HAVE TO BE ON OPPOSITE SIDES OF THE SAME QUESTION. The although part is an objection to the very thing you are asking for, and it goes wrong in two ways. It can concede something that is really an argument for your own side, which concedes nothing at all. WRONG: "Although a late bus would get club students home safely, Glenmere should add a late bus on Wednesdays." CORRECT: "Although the district would be paying a driver to carry a handful of students, Glenmere should add a late bus on Wednesdays." Or the clause can raise an objection to a different question, so your position never touches it. Read the two parts as a pair and ask whether one is pushing against the other.',
        'THE CLAIM SENTENCE NAMES THE OBJECTION; IT DOES NOT DEFEAT IT. The although part is a concession, and conceding is not surrendering: you are admitting that the other side has something real, and then saying what you want anyway. The full answer to that objection, with evidence behind it, is a rebuttal, and it comes later in the essay and in the next lesson. If your claim sentence has grown a middle section that argues with the objection, you have written a paragraph and called it a claim.',
      ],
      vocabulary: [
        { term: 'distinguishing claim', definition: 'a claim sentence that names the strongest opposing point and states your own position in the same sentence, so a reader can tell the two apart at once.' },
        { term: 'opposing claim', definition: 'the position somebody who disagrees with you would argue for, carrying a reason of its own.' },
        { term: 'although clause', definition: 'the part of the sentence that opens with "Although" or "Even though" and carries the opposing point; it is a dependent clause and cannot stand alone.' },
        { term: 'concession', definition: 'admitting that part of the other side is real, on the way to stating your own position. Conceding a point is not agreeing with it.' },
        { term: 'strongest opposing point', definition: 'the objection somebody on the other side would claim as theirs, and the one that would still stand if the easy problems around it were fixed.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-the-distinguishing-claim',
      kind: 'worked_example',
      problem:
        'Here is a claim and the strongest thing the other side says. Build one claim sentence that distinguishes the claim from the opposing claim.\n\nCLAIM: Ridgeview should spend the eighth-grade fund on a class trip instead of on the spring dance.\n\nWHAT THE OTHER SIDE SAYS: The spring dance costs nothing to attend. A trip would add a cost for every family, so the students who cannot pay would be the ones who stay behind.',
      steps: [
        'Write the two positions in plain words before you write any sentence. Yours: spend the fund on a trip. Theirs: keep the dance, because a trip puts a cost on families that the dance does not.',
        'Check that you are holding the strongest version of theirs and not a convenient one. "Some people just like dances" would be easy to answer, and nobody would claim it as their point. The objection that actually stops the plan is the cost falling on families, and it survives the easy fix: even a cheaper trip still costs something, and the dance still costs nothing. So that is the point the although part takes.',
        'Write the clause with a starter word in front of it: "Although a trip would add a cost that the spring dance does not, ..." Read it on its own and notice that it is not a sentence. It leans forward, and what it leans on is your position.',
        'Land the middle part on the position, worded so that somebody could act on it: "... Ridgeview should spend the eighth-grade fund on a class trip instead of on the spring dance ..."',
        'Add one reason with "because". This part is your reason, not your answer to the objection: "... because the spring dance lasts two hours and half the grade does not come to it." Naming the strongest objection makes a reader ask how you plan to handle it, and that is the right thing for a first sentence to do. The answer itself comes later in the essay.',
        'Read the sentence back and run three checks. Would somebody on the other side call the although part their point? Yes, it is the cost falling on families. Cover the although part: does the rest still ask for something? Yes, it asks the school to spend the fund on a trip. Are the two parts on opposite sides of the same question? Yes, one is a reason to keep the dance and the other is a reason to fund the trip.',
      ],
      answer:
        '"Although a trip would add a cost that the spring dance does not, Ridgeview should spend the eighth-grade fund on a class trip instead of on the spring dance, because the spring dance lasts two hours and half the grade does not come to it." The although part carries the strongest objection in words the other side would use, the middle part states the position, and the because part gives one reason without trying to settle the objection.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-collapsed-claim',
      kind: 'worked_example',
      problem:
        'Marlowe Middle School is deciding whether to require every student to join one after-school club. At the meeting, the students against the rule said two things. First, a required club is one more thing at the end of a day that already runs from 7:40 to 3:15. Second, a club somebody was made to join stops being a club.\n\nA student writing in favor of the rule drafts this claim sentence: "Although some students say Marlowe should not require a club, the school should not leave clubs completely optional."\n\nFind both errors and repair the sentence.',
      steps: [
        'Start with the although part and set it beside the writer\'s own position. The writer wants a required club; the clause says that some students say the school should not require a club. That is the writer\'s own sentence turned inside out and handed to somebody else. Ask it the test question: why would they say that? The clause cannot answer, so there is nothing in it for a reader to weigh. WRONG: "Although some students say Marlowe should not require a club, ..." CORRECT: an although part that carries one of the two objections the other side actually raised, which is what the next steps build.',
        'Notice what makes this worse than an ordinary miss. The other side spoke twice, in their own words, and neither objection is anywhere in the sentence. The strongest thing they have is sitting unused while the writer concedes a sentence that belonged to nobody.',
        'Now cover the although part and read only what is left: "the school should not leave clubs completely optional." That half tells a reader what the writer is against. It never says what the school should do instead, so nobody can act on it. WRONG: "... the school should not leave clubs completely optional." CORRECT: "... Marlowe should require every student to join one club."',
        'Choose between the two printed objections by asking which one survives the easy fix. The long-day objection can be met without giving anything up: move the clubs into a period inside the school day. The second objection, that a club somebody was made to join stops being a club, would still stand even then, because it is about the requirement itself. That is the stronger one.',
        'Write that objection as the clause, in the words the other side used: "Although a club somebody was made to join stops being a club, ..." A student who spoke at that meeting would read this and recognize it.',
        'Put the three parts together and read the whole sentence back. CORRECT: "Although a club somebody was made to join stops being a club, Marlowe should require every student to join one club, because a requirement is the only thing that reaches the students who never sign up for anything." Three checks: the although part is the strongest thing the other side said, the middle part asks for something a school could do on Monday, and the two parts push against each other.',
      ],
      answer:
        'Two errors. The although part is the writer\'s own position flipped to the negative, so it names no reason a reader could weigh, and both objections the other side actually raised are left out of the sentence. The middle part says only what the school should not do, so it asks for nothing. Repaired: "Although a club somebody was made to join stops being a club, Marlowe should require every student to join one club, because a requirement is the only thing that reaches the students who never sign up for anything."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-claim-distinguishes',
      kind: 'try_yourself',
      problem:
        'Ashgrove Middle School is deciding whether to open the gym for free play before school. The families who want it say that students who come in on the early bus have forty minutes in the building with nowhere to go. The teachers who are against it say the same thing every time: no adult is free at 7:10, and an unsupervised gym is the one room where somebody gets hurt.\n\nA student is writing in favor of opening the gym. Which choice is a claim sentence that distinguishes the claim from the opposing claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ashgrove should open the gym before school, because the students who come in on the early bus have forty minutes in the building with nowhere to go and nothing to do until the first bell rings.' },
        { id: 'b', text: 'Although no adult is free at 7:10 and an unsupervised gym is the one room where somebody gets hurt, Ashgrove should open the gym before school, because the early bus leaves students in the building for forty minutes with nowhere to go.', correct: true },
        { id: 'c', text: 'Although finding an adult who is free at 7:10 is a real problem for a staff that is already stretched thin, Ashgrove should not go on doing what it has always done with the building in the forty minutes before the first bell.' },
        { id: 'd', text: 'Although a few students would rather stay in the hallway on their phones than play basketball before school, Ashgrove should open the gym before school, because the early bus leaves students with nowhere to go for forty minutes.' },
      ],
      expectedAnswer: 'Although no adult is free at 7:10 and an unsupervised gym is the one room where somebody gets hurt, Ashgrove should open the gym before school, because the early bus leaves students in the building for forty minutes with nowhere to go.',
      hints: [
        'Ask the two questions in order. Does the although part carry the objection the people against the plan actually raised, and does the middle part say what should happen?',
        'The staff raised supervision and injury at 7:10, not phones in the hallway. One sentence concedes an objection nobody made, one concedes nothing at all because it never mentions the other side, and one asks only for the school to stop doing what it does now instead of naming what it should do instead.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-strongest-opposing-point',
      kind: 'try_yourself',
      problem:
        'Riverton Middle School is deciding whether to shorten every class period by five minutes so that the day can hold a forty-minute study hall. Three people spoke against the plan. A student said that some people would treat a study hall as forty minutes to talk. The science teacher said that five minutes off a period that meets five days a week is twenty-five minutes of lab time gone every week, out of a course that is already short of it. A parent said that the schedule was rewritten only two years ago.\n\nA student is writing in favor of the study hall. Which claim sentence puts the STRONGEST opposing point in the although part?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Although some students would treat a forty-minute study hall as forty minutes to talk with their friends, Riverton should shorten every period by five minutes to make room for one, because the work goes home either way.' },
        { id: 'b', text: 'Although a study hall would finally give students somewhere to finish their work before they get home at six from practice, Riverton should shorten every class period by five minutes to make room for one.' },
        { id: 'c', text: 'Although five minutes off a period that meets five days a week takes twenty-five minutes of lab time out of the science course every week, Riverton should shorten every period to make room for a forty-minute study hall.', correct: true },
        { id: 'd', text: 'Although the science teacher would prefer that class periods stay the length they are now, Riverton should shorten every class period by five minutes to make room for a forty-minute study hall.' },
      ],
      expectedAnswer: 'Although five minutes off a period that meets five days a week takes twenty-five minutes of lab time out of the science course every week, Riverton should shorten every period to make room for a forty-minute study hall.',
      hints: [
        'All three speakers are printed above. Find the objection that would still stand even after the school solved the easy problems around it.',
        'Assigning rooms would settle the talking, and a schedule rewritten two years ago can be rewritten again, so neither of those survives an easy fix. Of the choices left, one is not an objection at all but an argument for the study hall, and one shrinks the teacher\'s point into a preference instead of naming the lab time it costs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-position-a-reader-can-act-on',
      kind: 'try_yourself',
      problem:
        'Kestrel Middle School is deciding whether to stop printing its yearbook and put a free one online instead. The strongest thing the students against the change say is that a printed yearbook is the one thing people still ask each other to sign.\n\nAll four choices below concede that same point in the same words. Which one is a claim sentence that also states a position a reader could act on?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Although a printed yearbook is the one thing people still ask each other to sign, the cost of printing a yearbook every spring is something Kestrel needs to look at carefully before the deadline this year.' },
        { id: 'b', text: 'Although a printed yearbook is the one thing people still ask each other to sign, Kestrel should do something about the way the yearbook works now, because the arrangement the school has been using is not working for everybody in the grade.' },
        { id: 'c', text: 'Although a printed yearbook is the one thing people still ask each other to sign, Kestrel should make sure that every eighth grader ends the year with some record of it, whichever form that record ends up taking, because a class deserves to remember its last year in the building.' },
        { id: 'd', text: 'Although a printed yearbook is the one thing people still ask each other to sign, Kestrel should replace the printed yearbook with a free online one, because a printed book costs money that about half the grade never spends, and those students end the year with nothing.', correct: true },
      ],
      expectedAnswer: 'Although a printed yearbook is the one thing people still ask each other to sign, Kestrel should replace the printed yearbook with a free online one, because a printed book costs money that about half the grade never spends, and those students end the year with nothing.',
      hints: [
        'Every choice concedes the same point in the same words, so the although part cannot be what separates them. Cover it with your hand and read only what is left of each sentence.',
        'One of the remaining halves names a subject to look into rather than a thing to do, one asks the school to do something without ever saying what, and one asks for something nobody in this argument is against. Only one of them chooses between printing the yearbook and putting it online.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-although-as-a-label-and-as-an-argument',
      kind: 'misconception_check',
      question:
        'A student is arguing that Northgate should hold the eighth-grade field day in October instead of June. The strongest thing the other side says is that an October field day would land in the middle of the fall sports season, so the athletes would have to choose between the two. The student writes two drafts of the claim sentence. Draft 1: "Although some people disagree, Northgate should move field day to October, because June is too hot." Draft 2: "Although an October field day would land in the middle of fall sports, athletes could be released from practice for that one afternoon, so Northgate should move field day to October." What has gone wrong in each draft?',
      commonErrors: [
        {
          answer: 'Draft 1 works, because it begins with "Although" and admits that people disagree.',
          misconception:
            'Treating "Although" as a label that can be stuck to the front of any claim. The student has the shape of the sentence and none of its work, because the clause names no position and carries no reason, and a reader cannot weigh what is not there.',
          correctsTo:
            'Put the test question to the clause: why would they say that? The words "some people disagree" cannot answer it, so nothing has been conceded and nothing has been distinguished. The objection was sitting right there in the argument, which is that an October field day falls in the middle of the fall sports season. Put that in and the sentence starts doing its job: "Although an October field day would fall in the middle of the fall sports season, Northgate should move field day to October, because a June afternoon on that field is hot enough to send half the grade indoors."',
        },
        {
          answer: 'Draft 2 is the better one, because it takes the real objection and answers it right away.',
          misconception:
            'Believing that the claim sentence has to defeat the objection it names. The student is right that the objection deserves an answer, and wrong about where the answer goes.',
          correctsTo:
            'Draft 2 has stopped being a claim. It concedes, then argues, then states the position, which is three jobs in one sentence, and the position now arrives at the very end after a "so", where a reader has already lost the thread. A claim sentence names the objection and lands on your side; the answer to that objection, with evidence behind it, is a rebuttal and belongs in a later part of the essay. Cut it back to the shape: "Although an October field day would land in the middle of fall sports, Northgate should move field day to October, because an October date leaves the last weeks of school free." The release from practice is a good answer, and it goes in the paragraph where you answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A distinguishing claim answers the other side inside the claim sentence: "Although [the strongest opposing point], [what should happen], because [your strongest reason]."',
        'The although part belongs to the other side and cannot stand as a sentence on its own, which is why it never takes the paragraph over. Put it first, so the sentence lands on your position.',
        'Concede the strongest real objection, never the easiest one. Two tests: would somebody on that side call it their point, and would it still stand if the easy problems around it were fixed?',
        'The middle part has to say what should happen. WRONG: "Although the cost is real, the school should not go on doing it this way." CORRECT: "Although the cost is real, the school should move practice to the morning." Cover the although part and read what is left; if it does not ask for something, there is no claim in the sentence.',
        'The two parts have to be on opposite sides of the same question. A clause that concedes something which is really an argument for your own side concedes nothing at all.',
        'The claim sentence names the objection; it does not defeat it. Conceding is not surrendering, and the answer to the objection belongs in a later part of the essay, not in this sentence.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'A Claim That Answers the Opposing Claim' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
