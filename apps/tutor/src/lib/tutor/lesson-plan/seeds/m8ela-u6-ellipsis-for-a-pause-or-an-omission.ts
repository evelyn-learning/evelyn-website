/**
 * Grade 8 ELA — Sentence Style & Punctuation: Ellipsis for a Pause or an
 * Omission.
 *
 * Procedure-led. One mark, three periods in a row, does two jobs, and the
 * lesson makes the sorting automatic: in dialogue or narration the mark shows
 * a voice trailing off or stopping to think, and inside a quotation it shows
 * that words were removed. The omission half carries the only rule in the
 * lesson a student can break dishonestly, so it gets two checks that must
 * hold at once: every surviving word is the source's own word in the source's
 * order, AND the shortened sentence still makes the claim the source made
 * (CCSS L.8.2a, L.8.2b). Four traps this plan is built to kill: three periods
 * printed where a speaker was cut off from outside, which is a sharp break
 * and not a fade; the belief that exact surviving words are the whole test
 * for an honest quotation; the mark used to splice two pieces that were never
 * next to each other; and the mark treated as permission to move, swap or add
 * a word rather than only to remove one.
 *
 * SCOPE GUARD: Grade 8 row 6.4 teaches the ellipsis for its two jobs and
 * keeps them apart -- the trailing-off or hesitation inside dialogue or
 * narration, and the omission inside a quotation, including the omission that
 * changes the source's meaning and is therefore dishonest. Builds on
 * `m7ela-u10-quoting-paraphrasing-summarizing.ts` (W.7.8: quote when the
 * exact words matter; quote exactly, letter for letter; keep quotations
 * short), which never shows how a quotation may legally be shortened; the
 * word "ellipsis" appears in no `m7ela-*` seed. Stops short of HS
 * `engl-u10-citing-and-integrating-sources.ts` (W.9-10.8: frame-quote-explain
 * and patchwriting). DELIBERATELY EXCLUDED: row 6.3's own lesson, which is
 * choosing between a single dash and a pause comma by the effect wanted --
 * the word "comma" appears exactly once in student-facing prose in this file,
 * inside the worked-example step that hands that choice to row 6.3 as a later
 * lesson, and no line here says what a comma does to a sentence; square
 * brackets for a word added to or altered inside a quotation, which belong to
 * the HS band, and no square bracket appears inside any string in this file;
 * any rule about how a quotation must fit the sentence around it, who must be
 * named before it or what must follow it, which is row 10.3's lesson, so the
 * reporting frames printed here ("The notice says:", "the newsletter said")
 * are used and never taught; any in-text or works-cited citation format,
 * which is row 10.4, so no page number, author-date pair or entry format is
 * printed anywhere in the body and the word "citation" does not occur in the
 * body either; any rule about where a period or comma sits relative to a
 * closing quotation mark, which is HS
 * `engl-u3-dashes-parentheses-quotation.ts`'s and is stated nowhere here; and
 * the choice among quoting, paraphrasing and summarizing, which is the G7
 * row's -- the strings "paraphras" and "summariz" do not occur anywhere in
 * this file's body (below this comment). DELIBERATELY ALLOWED, because row
 * 6.3 and the G7 quoting row sit directly against this one: (a) the word
 * "dash" appears eleven times in the body, across ten fields, and an em dash
 * is printed as a specimen four times, always in one role only -- the mark
 * that belongs to a
 * break imposed from outside the speaker, which is what this lesson's mark is
 * not. Four of those mentions add that the dash has its own lesson in this
 * unit. Saying "a break from outside takes a dash" is where the boundary
 * between the two marks lives, and it has to be said out loud or a student
 * merges them, as the second misconception in this file does; it is not a
 * lesson on the dash, because nothing here compares a dash with a comma,
 * pairs two dashes, or asks the student to pick one for an effect. (b) The
 * first of the two omission checks restates the G7 rule that a quotation
 * keeps the source's own words in the source's order, because the honesty
 * check is meaningless without it -- one line of reuse, while no keyIdea,
 * step or recap line re-teaches when a writer should quote at all.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt, every line of dialogue and every
 * quoted source in this file is original prose written for the item. This
 * course carries no passage machinery -- no passageId, no shared texts -- so
 * each question must be solvable from the words printed inside it, and no
 * published work may be quoted or closely paraphrased. Every phrase this file
 * quotes from one of its own excerpts appears in that excerpt character-for-
 * character; in a row about shortening quotations, an approximate quotation
 * inside the lesson would teach the exact habit the lesson exists to break.
 * Every incorrect specimen in the tutor's own prose is labeled WRONG with the
 * CORRECT version beside it, because a tutor reads those lines aloud. The
 * only unlabeled wrong forms are the MCQ distractors the three try_yourself
 * items ask the student to reject, and each is named in that item's hints or
 * in the misconception check. No contraction appears anywhere in this file,
 * in the tutor's voice or in the quoted dialogue.
 *
 * NOTE ON THE MARK ITSELF: the ellipsis is printed throughout as three ASCII
 * periods (...), never as the single-character ellipsis U+2026, matching every
 * shipped seed and the fan-out contract's sweep rule. That rule is not
 * suspended by the fact that this row TEACHES the mark: three periods are what
 * a student types and what the corpus prints, so the specimen under
 * instruction and the house convention are the same string here.
 *
 * CLAIM LEDGER (informational sources and stated conventions):
 *   Claim                                  | Where             | Kind        | Grounds
 *   An ellipsis, three periods in a row,   | concept keyIdeas  | REAL-WORLD  | Long-settled
 *   marks words omitted from a quotation   | 1 and 3, worked-2 |             | American usage
 *                                          | steps, recap 1/3  |             | convention.
 *   In dialogue an ellipsis marks a voice  | concept keyIdea 2,| REAL-WORLD  | Long-settled
 *   trailing off or hesitating, while a    | worked-1 steps,   |             | American usage
 *   dash marks an abrupt break from        | misconception 2,  |             | convention;
 *   outside the speaker                    | recap 2           |             | the L.8.2a pair.
 *   The words kept inside a shortened      | concept keyIdeas  | REAL-WORLD  | Long-settled
 *   quotation must appear in the source in | 3 and 6, worked-2,|             | convention of
 *   the source's own order and wording     | try-3, recap 3/5  |             | honest quotation.
 *   A quotation is understood to be a      | concept keyIdea 5,| REAL-WORLD  | Long-settled
 *   piece taken from something longer, so  | recap 6           |             | convention; the
 *   the mark is not normally needed before |                   |             | reason no style
 *   the first or after the last word       |                   |             | guide requires it.
 *   The Bellhaven Beacon printed that the  | try-3 stem and    | STIPULATED  | Invented school
 *   new late-bus route "has cut the walk   | all four choices  |             | newspaper and
 *   home for most students on the east     |                   |             | invented street.
 *   side, though it still leaves the       |                   |             | Internally
 *   families on Ridgeway Lane more than a  |                   |             | consistent: every
 *   mile from the nearest stop"            |                   |             | choice quotes this
 *                                          |                   |             | one printed
 *                                          |                   |             | sentence, and the
 *                                          |                   |             | item asks only
 *                                          |                   |             | which shortening
 *                                          |                   |             | keeps its claim.
 *   The Bellhaven town library posted that | worked-2 problem  | STIPULATED  | Invented town and
 *   the reading room "will stay open until | and steps         |             | invented notice.
 *   eight on weeknights this winter ... as |                   |             | Internally
 *   long as the volunteer desk is covered  |                   |             | consistent: the
 *   every night"                           |                   |             | promise, the
 *                                          |                   |             | background and the
 *                                          |                   |             | condition are the
 *                                          |                   |             | three parts the
 *                                          |                   |             | steps sort.
 *   A club newsletter said the aquarium    | misconception     | STIPULATED  | Invented club and
 *   trip "is not canceled, only moved to   | question, error 1,|             | invented trip. The
 *   the second week of May"                | recap 4           |             | shortened form and
 *                                          |                   |             | the full form are
 *                                          |                   |             | quoted identically
 *                                          |                   |             | in all three
 *                                          |                   |             | places.
 *   Every other excerpt in this file -- the hook group chat, Nadia and the
 *   poster board, Coach and the lineup, Dev and the broken hinge -- is
 *   invented narrative fiction, true by construction, with no factual claim
 *   about the world to verify.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U6_ELLIPSIS_FOR_A_PAUSE_OR_AN_OMISSION: LessonPlan = {
  id: 'evelyn.ms.m8ela.ellipsis-for-a-pause-or-an-omission.v1',
  title: 'Ellipsis for a Pause or an Omission',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.ellipsis-for-a-pause-or-an-omission',
      standard: 'M8ELA-6.4',
      description:
        'Use an ellipsis for two jobs and keep them apart: inside dialogue or narration to show a trailing-off or hesitation, and inside a quotation to show that words were omitted without changing the source\'s meaning — including recognizing an omission that DOES change the meaning, which is dishonest (CCSS L.8.2a, L.8.2b).',
    },
  ],
  prerequisites: ['m8ela.dashes-and-commas-for-a-break'],
  followUps: ['m8ela.verifying-word-meaning-with-context-and-a-dictionary'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that cutting words out of somebody else\'s sentence can be the honest move or the dishonest one, and that the same three periods also do a quieter job inside dialogue.',
      script:
        'Somebody in the group chat posts a screenshot of what you wrote last night. Every word in it is yours, letter for letter, and you still want to throw your phone across the room. What you typed was: "I will come to the fundraiser if my sister does not need the car." The screenshot stops after the word "fundraiser." Nobody made up a single word. Somebody cut, and the cut did the lying. Now think about the opposite case, the one where cutting is the honest move. You are writing a report, you need one line out of a long paragraph, and printing the whole paragraph would bury the line you actually want. There is a mark for that, three periods in a row, and it is a promise to your reader: words were taken out here, and nothing else was touched. That same mark does a second job you have read a hundred times without naming it, in the line where somebody starts an answer and lets it fade. Today: the two jobs, how to tell which one you are doing, and the one promise people break.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-jobs-of-the-ellipsis',
      kind: 'concept',
      goal: 'Install the two jobs of the ellipsis, the fade-versus-cut test that separates it from a dash, and the two checks that must both hold before an omission counts as honest.',
      keyIdeas: [
        'ONE MARK, TWO JOBS, AND THE SITUATION TELLS YOU WHICH. An ellipsis is three periods in a row: ... Job one, inside dialogue or narration: a voice trails off or stops to think, and the mark shows the reader that the sentence went quiet instead of ending. Job two, inside a quotation: words have been taken out of somebody else\'s sentence, and the mark stands where they used to be. Ask one question to sort them: am I writing what a person says, or am I handing on words that belong to a source? Nothing else about the mark changes. Style guides differ about the spaces around it, but it is always three periods.',
        'JOB ONE IS A FADE, NEVER A CUT. Three periods say the voice ran out on its own, with nothing outside the speaker stopping it: "I only opened it because..." Compare a line that is cut off from outside, by an interruption or a slammed door. That is a sharp break, and the mark for it is the dash, which has its own lesson in this unit. So make the mark agree with the narration around it. If the narration says the voice faded, the fade mark belongs there. WRONG, when the narration says his sister talked straight over him: "But I did not..." CORRECT, for that same moment: "But I did not —" And when a speaker finishes the sentence they meant to say, no mark is needed at all beyond the period; three periods sprinkled through dialogue to make it feel moody are punctuating a mood, not a pause.',
        'JOB TWO IS A PROMISE, AND IT HAS TWO CHECKS. When you shorten a quotation, the three periods promise your reader that words were removed at that exact spot and that nothing else happened to the sentence. Check one: every word still inside the quotation marks is the source\'s own word, spelled the way the source spelled it and sitting in the order the source put it in. Check two: the sentence you leave behind still makes the claim the source made. Both have to hold. Passing only the first is where honest-looking quotations go wrong.',
        'THE DISHONEST OMISSION PASSES CHECK ONE AND FAILS CHECK TWO. The words that get dropped this way are usually small: not, if, only, though, unless. Drop one of them and the surviving words are all exact, all in order, and the sentence now says something the source never said. WRONG: the newsletter said the trip "is ... canceled." CORRECT: the newsletter said the trip "is not canceled." Here is the test, and it takes ten seconds. Read your shortened version to somebody who has never seen the original, then read them the original. If they hear two different claims, the omission is dishonest, however exact the words you kept.',
        'THE MARK EARNS ITS PLACE IN THE MIDDLE. A reader already understands that a quotation is a piece taken out of something longer, so you do not normally need three periods before the first word you quote or after the last one. Put the mark where a reader would otherwise think two pieces of the sentence had been neighbors. And notice what this means for stopping early: ending a quotation before the end of the source sentence is ordinary and needs no mark, which is exactly why it slips past people when the part left off was the part that limited the claim.',
        'THREE PERIODS MEAN REMOVED, AND ONLY REMOVED. They do not mean moved, swapped, or added. Two failures come straight out of forgetting that. The splice: the mark joins two pieces that were never next to each other, and the sentence it builds says something the source never said. The swap: a word inside the quotation marks is traded for a close synonym, which is a misquotation no mark can cover. If you need to change a word, move a phrase, or add anything, stop quoting there and put the idea in your own sentence instead.',
      ],
      vocabulary: [
        { term: 'ellipsis', definition: 'three periods in a row (...), used either to show a voice trailing off or to show that words were removed from a quotation.' },
        { term: 'trailing off', definition: 'a speaker letting a sentence fade out unfinished, with nothing outside the speaker cutting it short.' },
        { term: 'omission', definition: 'words taken out of a quotation, with the ellipsis standing in the place where they used to be.' },
        { term: 'dishonest omission', definition: 'a shortened quotation whose surviving words are exact but which no longer makes the claim the source made.' },
        { term: 'splice', definition: 'an omission that joins two pieces of a source that were never next to each other, building a sentence the source never wrote.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fade-cut-or-neither',
      kind: 'worked_example',
      problem:
        'Three moments from the same story. The narration for each is already written and cannot change. For each one, decide how Dev\'s line should end.\n\n(1) Narration: "Dev started to explain about the broken hinge, and then his voice just ran out." His line: "I only opened it because"\n(2) Narration: "Dev got four words out before his sister talked straight over him." His line: "But I did not"\n(3) Narration: "Dev answered the question, finished his sentence, and waited." His line: "It was already like that when I got here"',
      steps: [
        'Moment 1. Read the narration first, because it is the thing that decides. It says "his voice just ran out." Nothing outside Dev stops him; the sentence goes quiet on its own. That is a fade, so the line takes three periods. CORRECT: "I only opened it because..."',
        'Before moving on, confirm which job that is. Is anyone here handing on words that belong to a source? No. Dev is speaking his own sentence, and nothing is being quoted from anywhere. So this is job one, the pause, not job two, the omission. The mark looks identical; the reason for it is completely different.',
        'Moment 2. The narration says his sister "talked straight over him." That is a cut, not a fade: the line stops because somebody outside Dev takes it away from him. Three periods would tell the reader his voice thinned out on its own, which contradicts the sentence right above it. WRONG: "But I did not..." CORRECT: "But I did not —" The mark for a sharp break is the dash, and choosing between a dash and a comma for an effect is its own lesson in this unit; all you need here is that the fade mark is not the break mark.',
        'Moment 3. The narration says Dev "finished his sentence, and waited." Nothing faded and nothing was cut, so nothing needs marking. WRONG: "It was already like that when I got here..." CORRECT: "It was already like that when I got here." Three periods added to a finished sentence do not make it moodier; they tell the reader something happened that did not happen.',
        'Read the three verdicts together, because the pattern is the whole point: 1 takes the ellipsis, 2 takes the dash, 3 takes the period. The lines themselves gave you nothing. In all three cases the narration decided, and the mark had to agree with it.',
        'One last check on all three. None of them is job two. There is no source, no quotation, and nobody being reported. Job two only arrives when you are printing words that belong to somebody else and you want to print fewer of them.',
      ],
      answer:
        'Moment 1 takes the ellipsis: "I only opened it because..." because the narration says his voice "just ran out." Moment 2 takes the dash: "But I did not —" because his sister "talked straight over him," which is a cut from outside and not a fade. Moment 3 takes an ordinary period: "It was already like that when I got here." because he finished the sentence. All three are job one; nothing in this example quotes a source.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-shorten-a-quotation-honestly',
      kind: 'worked_example',
      problem:
        'The Bellhaven town library posted this notice on its front door:\n\n"The reading room will stay open until eight on weeknights this winter, a change the trustees approved in a meeting that ran past midnight, as long as the volunteer desk is covered every night."\n\nYou are writing about the new hours and you do not want the trustees\' meeting in your sentence. Shorten the quotation, then check two shortened versions somebody else wrote.',
      steps: [
        'Sort the source sentence into its parts before you cut anything. The promise: "The reading room will stay open until eight on weeknights this winter". The background: "a change the trustees approved in a meeting that ran past midnight". The condition: "as long as the volunteer desk is covered every night". You want the promise, you do not want the background, and the condition is the part that decides whether your shortened version is honest.',
        'Cut the background and put three periods where it was. CORRECT: The notice says: "The reading room will stay open until eight on weeknights this winter ... as long as the volunteer desk is covered every night." The mark sits in the middle, between the promise and the condition, exactly where the removed words were.',
        'Run check one on your own version. Read the surviving words off against the source, left to right: "The reading room will stay open until eight on weeknights this winter" is the source\'s wording in the source\'s order, and "as long as the volunteer desk is covered every night" is the source\'s wording in the source\'s order. Nothing was swapped and nothing was moved.',
        'Run check two. Does the shortened sentence still make the notice\'s claim? The notice promised late hours on a condition. Your version promises late hours on the same condition. A reader who saw only your version and a reader who saw the whole notice would hear the same thing.',
        'Now the first version somebody else wrote. WRONG: The notice says: "The reading room will stay open until eight on weeknights this winter." Every word is exact, every word is in order, and there is no mark to argue with, because stopping early needs none. It still fails check two: the notice never promised those hours unconditionally, and this version does. CORRECT: keep the condition, as the version above does.',
        'And the second one. WRONG: The notice says: "The reading room will stay open until eight on weeknights this winter ... every night." Here the mark has spliced two pieces that were never neighbors, and the sentence it builds says the room stays open every night, which is not in the notice anywhere. Three periods mean words were removed; they never license a sentence the source did not write. CORRECT: keep enough of the condition for it to still be the condition.',
      ],
      answer:
        'The honest shortening is: The notice says: "The reading room will stay open until eight on weeknights this winter ... as long as the volunteer desk is covered every night." It drops only the background about the trustees\' meeting, keeps every other word in the notice\'s own order, and leaves the promise standing with the condition that the notice attached to it. Stopping after "this winter" fails check two by dropping the condition, and cutting all the way to "every night" splices two pieces into a claim the notice never made.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-punctuate-the-fade',
      kind: 'try_yourself',
      problem:
        'A student is writing a scene for the school literary magazine. The narration is already fixed and cannot change:\n\n"Mr. Alvarez asked Nadia why the poster board was still blank on Thursday. She started an answer, got four words out, and let her voice fade until there was nothing left of it. Nobody interrupted her."\n\nWhich version of Nadia\'s line matches that narration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nadia said, "I was going to —" and then looked down at the floor.' },
        { id: 'b', text: 'Nadia said, "I was going to." and then looked down at the floor.' },
        { id: 'c', text: 'Nadia said, "I was going to..." and then looked down at the floor.', correct: true },
        { id: 'd', text: 'Nadia said... "I was going to" and then looked down at the floor.' },
      ],
      expectedAnswer: 'Nadia said, "I was going to..." and then looked down at the floor.',
      hints: [
        'Start from the narration rather than from the marks. It says her voice faded until there was nothing left of it, and that nobody interrupted her. Ask which mark shows a voice running out on its own, rather than a voice being cut off or a sentence being finished.',
        'Three periods show a fade, a dash shows a sharp break from outside, and a period says the speaker said everything she meant to say. Then check one more thing before you choose: the fading voice is Nadia\'s, so the mark has to sit inside her quotation marks and not out in the narrator\'s sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-job-is-it-doing',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then decide what the ellipsis in Coach\'s line tells the reader.\n\n"The team sat on the bottom row of the bleachers while Coach announced the starting lineup for Friday. She named four players fast, then stopped and looked at the ceiling. \'And starting at center we have... give me a second, I had it a minute ago,\' she said, and started the whole list over from the top."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Words have been left out of something Coach is quoting, so the reader is being told that her line is a shortened version of what somebody else originally said.' },
        { id: 'b', text: 'Somebody in the gym cuts Coach off before she can get the name out, so her sentence breaks because another speaker has taken it away from her.' },
        { id: 'c', text: 'The narration is jumping over a long stretch of time, so the reader moves from the middle of the lineup straight to the end of practice without being shown anything in between.' },
        { id: 'd', text: 'Coach hesitates in the middle of her own sentence: she stops for a beat before she goes on, and every word on both sides of the mark is hers.', correct: true },
      ],
      expectedAnswer: 'Coach hesitates in the middle of her own sentence: she stops for a beat before she goes on, and every word on both sides of the mark is hers.',
      hints: [
        'Sort the job first. Is anybody in this excerpt handing on words that belong to a source? If nothing here is a quotation taken from another text, the mark cannot be doing the omission job, whatever else it is doing.',
        'Read what comes immediately after the mark. Coach keeps talking, and the words are "give me a second, I had it a minute ago." No other person in the gym says anything at all, and the excerpt stays inside one afternoon.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-honest-shortening',
      kind: 'try_yourself',
      problem:
        'The Bellhaven Beacon, the school newspaper, printed this sentence about the late bus:\n\n"The new late-bus route, which the district added in October after two years of parent petitions, has cut the walk home for most students on the east side, though it still leaves the families on Ridgeway Lane more than a mile from the nearest stop."\n\nYou want to quote part of it in a report and you do not need the part about the petitions. Which shortened quotation passes both checks -- the Beacon\'s own words in the Beacon\'s own order, and still the claim the Beacon made?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"The new late-bus route ... has cut the walk home for most students on the east side, though it still leaves the families on Ridgeway Lane more than a mile from the nearest stop."', correct: true },
        { id: 'b', text: '"The new late-bus route, which the district added in October after two years of parent petitions, has cut the walk home for most students on the east side."' },
        { id: 'c', text: '"The new late-bus route ... has shortened the walk home for most students on the east side, though it still leaves the families on Ridgeway Lane more than a mile from the nearest stop."' },
        { id: 'd', text: '"It still leaves the families on Ridgeway Lane more than a mile from the nearest stop ... the new late-bus route has cut the walk home for most students on the east side."' },
      ],
      expectedAnswer: '"The new late-bus route ... has cut the walk home for most students on the east side, though it still leaves the families on Ridgeway Lane more than a mile from the nearest stop."',
      hints: [
        'Run the two checks in order, and do not stop after the first one. Is every word inside the quotation marks the Beacon\'s own word, spelled the way the Beacon spelled it and sitting where the Beacon put it? Then: does the shortened sentence still make the claim the Beacon made?',
        'Three of these four change something. Look for one that swaps a word for a close synonym, one whose two halves have traded places, and one that stops before the part limiting the claim, which is the "though" clause naming who the new route still does not help.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-exact-words-and-the-wrong-mark',
      kind: 'misconception_check',
      question:
        'Two students defend what they did with three periods. A club newsletter said: "The trip to the aquarium is not canceled, only moved to the second week of May." The first student writes that the newsletter said the trip "is ... canceled," and defends it by pointing out that every word left inside the quotation marks is exact and in the right order. The second student is writing dialogue instead: her narration says a character is cut off mid-word by a slammed door, and she ends that line with three periods, saying that an ellipsis and a dash are two ways of writing the same break. What has gone wrong in each case?',
      commonErrors: [
        {
          answer: 'The newsletter said the trip "is ... canceled," and that is accurate, because every word inside the quotation marks is exact and in the right order.',
          misconception:
            'Treating exact surviving words as the whole test for an honest quotation. The student learned the first rule properly, that a quotation keeps the source\'s own words in the source\'s order, and took it to be the only rule, so a version that passes it feels finished. It is also the rule that is easy to check, and the one that is hard to check is the one that was skipped.',
          correctsTo:
            'Both checks have to hold at once, and the second one failed. Check two asks whether the sentence you leave behind still makes the claim the source made. The newsletter said the trip "is not canceled, only moved to the second week of May." The shortened version drops "not" and reverses it, so a reader who saw only the short version would hear the opposite of what the newsletter announced. Three periods promise that words were removed; they never promise that removing them was allowed to change the meaning. Run the ten-second test: read the short version and the original side by side and ask whether they make the same claim. Here they do not, so the omission is dishonest no matter how exact the surviving words are. The honest short version keeps the word that carries the meaning: the newsletter said the trip "is not canceled."',
        },
        {
          answer: 'A character is cut off mid-word by a slammed door, so three periods work there, because an ellipsis and a dash are two ways of writing the same break.',
          misconception:
            'Collapsing two marks that do opposite things, because both of them leave a sentence unfinished. The student is right that neither line ends in a period, and wrong that a reader hears the same thing from each.',
          correctsTo:
            'Three periods are a fade: the voice runs out on its own and nothing outside the speaker stops it. A door slamming across a word is the opposite, because something from outside takes the line away from the speaker, and the reader should hear it stop rather than thin out. The mark for that sharp break is the dash, which has its own lesson in this unit. So keep the three periods for the moments when a speaker trails off or stops to think, and make the mark agree with the narration around it: if the narration says a voice was cut off, do not print the mark that says a voice faded.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An ellipsis is three periods in a row, and it does two jobs. In dialogue or narration it shows a voice trailing off or stopping to think. Inside a quotation it shows that words were removed. Sort them by asking whether you are writing what a person says or handing on words that belong to a source.',
        'The mark is a fade, not a cut. When something outside the speaker takes the line away, an interruption or a slammed door, that sharp break is the dash\'s work and it has its own lesson. Make the mark agree with the narration around it.',
        'A shortened quotation has to pass two checks at once: every word you keep is the source\'s own word in the source\'s order, and the sentence you leave behind still makes the claim the source made.',
        'Exact surviving words are not enough, and the small words are where it breaks. WRONG: the newsletter said the trip "is ... canceled." CORRECT: the newsletter said the trip "is not canceled." Not, if, only, though and unless are the words an omission reverses a sentence by dropping.',
        'Three periods mean removed, and only removed. They do not mean moved, swapped, or added, so a spliced pair of distant pieces and a synonym traded in for the source\'s word are both misquotations. If you need to change anything inside the quotation marks, stop quoting and put the idea in your own sentence.',
        'You do not normally need the mark at either end of a quotation, because a reader already knows a quotation is a piece of something longer. That is also why stopping early slips past people: it needs no mark, and it is dishonest whenever the part left off was the part that limited the claim.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Ellipsis for a Pause or an Omission' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
