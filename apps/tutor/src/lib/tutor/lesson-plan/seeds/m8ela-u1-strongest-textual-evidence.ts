/**
 * Grade 8 ELA — Reading Literature: Evidence, Dialogue & Structure: Strongest
 * Textual Evidence.
 *
 * CONCEPT-LED row, built on the shape of the m8ela concept-led exemplar. The
 * student arrives already able to cite a detail that supports a claim; what
 * they do not yet have is any way to compare two details that BOTH support
 * it. The whole lesson builds one way of reading: underline the demanding
 * word in the claim, then ask of each true detail how many OTHER stories it
 * fits just as well — the fewer, the stronger — and cite the one detail that
 * reaches the demanding word and fits almost nothing else (CCSS RL.8.1,
 * RI.8.1). Three traps this plan is built to kill: treating a detail that is
 * merely CONSISTENT with the claim as evidence for it; ranking the most
 * VIVID line as the strongest because it is the one the reader noticed; and
 * citing a character's own words as evidence for a claim that those very
 * words are the thing to be doubted.
 *
 * SCOPE GUARD: Grade 8 row 1.1. Given several true details from a short
 * excerpt, rank them and choose the one that MOST STRONGLY supports an
 * inference or analysis — the RL.8.1/RI.8.1 escalation from "cite evidence
 * that supports" to "cite the evidence that supports best". Builds on
 * `m7ela-u1-text-evidence-and-inference.ts` (RL.7.1/RI.7.1: explicit vs.
 * inferred, cite the exact wording), which never asks the student to compare
 * two pieces of valid evidence for strength. Stops short of HS
 * `engl-u7-inference-and-evidence.ts` (RI.9-10.1: combining textual evidence
 * with background knowledge to license an inference). Both codes cited here
 * as G7 U1.1 did. DELIBERATELY EXCLUDED: the explicit-vs-inferred split, the
 * bare guess and the mismatched quote are the G7 row's and no keyIdea here
 * re-teaches them — every detail the student ranks in this file is already
 * a real, on-topic quotation, so the G7 gate is assumed to have been passed
 * before the ranking starts; the HS row's inference built from evidence plus
 * background knowledge, its overreach error and its imported-experience
 * error are not taught, and the phrase "background knowledge" does not
 * appear in the body below this comment; what a line of dialogue DOES to the
 * plot is row 1.2 and how an incident provokes a decision is row 1.3 — the
 * spoken lines in this file's excerpts (a laugh and a denial, a "fine", a
 * shrug about a drawer, a claimed fever, and the rest) are read only as
 * evidence for or against a stated claim, never for how they move the
 * story; whether an AUTHOR's reasoning is
 * sound or whether an author's evidence is relevant and sufficient are row
 * 4.2 and G7's `m7ela-u4-tracing-an-argument.ts` — the two informational
 * items in this file ask what a text's details show about its SUBJECT (a
 * robot, a set of compost bins), never whether the text's writer argued
 * well; and an author's purpose or perspective is G7's
 * `m7ela-u4-authors-purpose-and-perspective.ts` and no item here asks what
 * a writer thinks. DELIBERATELY ALLOWED, because the G7 row sits directly
 * below: the hook, the first keyIdea, the first step of the first worked
 * example, the second misconception correction and the first recap line
 * each remind the student briefly that a detail counts only if it is really
 * on the page and really about the claim — that is the G7 gate reused as the
 * entry ticket to ranking, not a re-teaching of it, and none of them walks
 * through the explicit-vs-inferred split or the two G7 failure modes; and the G7
 * "claim + because + the exact words" shape is used to state each worked
 * answer, because ranking evidence ends in citing it. Informational excerpts
 * appear in the second worked example and the second try-yourself because
 * RI.8.1 shares the row with RL.8.1; both are inferences about the subject
 * of the text.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file quotes from one of its
 * excerpts appears character-for-character in that excerpt; quote your own
 * excerpt exactly, never from memory.
 *
 * CLAIM LEDGER (informational passages: worked example 2 and try-yourself 2;
 * every other excerpt is invented fiction, true by construction):
 *   Claim                                  | Where             | Kind        | Grounds
 *   The Fairmont Middle robotics team      | worked-2 passage  | STIPULATED  | Invented school and
 *   finished fourth of twelve at its       |                   |             | season. Consistent: the
 *   regional                               |                   |             | placing is never used
 *                                          |                   |             | to prove anything.
 *   The robot's arm was rebuilt three      | worked-2 passage  | STIPULATED  | Invented. Consistent
 *   times between September and January    |                   |             | with the season's span
 *                                          |                   |             | given in the passage.
 *   The team brought a spare battery to    | worked-2 passage  | STIPULATED  | Invented team habit.
 *   every match                            |                   |             |
 *   In four of its nine matches the robot  | worked-2 passage  | STIPULATED  | Invented. Internally
 *   stopped moving before the round ended  |                   |             | consistent: nine
 *                                          |                   |             | matches, four failures,
 *                                          |                   |             | used only for ranking.
 *   A careful team brings a spare battery  | worked-2 step 3   | REAL-WORLD  | Reasoning about care,
 *   whether or not its robot has ever      |                   |             | not a statistic; stated
 *   failed                                 |                   |             | as a conditional, and
 *                                          |                   |             | true by the meaning of
 *                                          |                   |             | "careful".
 *   Ridgeway Middle added compost bins     | try-2 passage     | STIPULATED  | Invented school and
 *   beside every cafeteria trash can in    |                   |             | program.
 *   October, with signs above each bin     |                   |             |
 *   The compost bins fill about as fast as | try-2 passage     | STIPULATED  | Invented custodians'
 *   the old trash cans did                 |                   |             | report; consistent with
 *                                          |                   |             | the mixed-bag detail.
 *   Nearly every bag pulled from a compost | try-2 passage     | STIPULATED  | Invented custodians'
 *   bin has to be thrown out as trash      |                   |             | report, attributed to
 *   because it is mixed with plastic forks |                   |             | them in the passage.
 *   and chip bags                          |                   |             |
 *   Plastic forks and chip bags do not     | try-2 passage,    | REAL-WORLD  | Ordinary plastics and
 *   belong in a compost bin                | implied; try-2    |             | foil-lined snack bags
 *                                          | key               |             | do not break down in
 *                                          |                   |             | compost; long-settled
 *                                          |                   |             | and the reason such
 *                                          |                   |             | programs post signs.
 *   The environmental club asked the       | try-2 passage     | STIPULATED  | Invented.
 *   office for a second set of signs       |                   |             |
 *
 * NOTE ON prerequisites/followUps: row 1.1 is the first row of the course,
 * so `prerequisites` is empty by design and `followUps` names row 1.2.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U1_STRONGEST_TEXTUAL_EVIDENCE: LessonPlan = {
  id: 'evelyn.ms.m8ela.strongest-textual-evidence.v1',
  title: 'Strongest Textual Evidence',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.strongest-textual-evidence',
      standard: 'M8ELA-1.1',
      description:
        'Given several true details from a short excerpt, rank them and choose the one that MOST STRONGLY supports an inference or analysis -- the escalation from "cite evidence that supports" to "cite the evidence that supports best" (CCSS RL.8.1, RI.8.1).',
    },
  ],
  prerequisites: [],
  followUps: ['m8ela.how-dialogue-propels-action-and-reveals-character'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student that they already rank evidence by instinct when someone says "prove it", and that the instinct has a rule behind it worth naming.',
      script:
        'Your group chat is arguing about the sub who covered English all week. Half the chat says he never read the book he spent every period discussing. Someone types, "prove it." You noticed three things. He held the book the whole class. He said the ending was "a little sad," which it is. And he asked the class to remind him whether the older brother survives the fire, when the older brother is the one telling the story. All three are true, and all three fit your claim. But you already know which one to send. The first two fit a dozen other stories: any teacher holds the book, and anyone who read the back cover knows the ending is sad. The third one fits almost nothing except your claim, because a narrator who is telling you the story did not die in it. You already know that an opinion turns into an argument the moment you quote the exact words behind it. This year the question gets harder, because you will have several true details and room to cite one. Today is about choosing the one that does the most work.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ranking-evidence-for-strength',
      kind: 'concept',
      goal: 'Install the idea that valid evidence comes in strengths, the demanding-word habit, the other-stories test that does the ranking, and the two lookalikes (consistent, vivid) that are not strength.',
      keyIdeas: [
        'ALL EVIDENCE PASSES THE SAME GATE; NOT ALL EVIDENCE IS EQUAL. You already know the gate: a detail counts only if it is really on the page and really about the claim, with no guesses and no mismatched quotes. Today every detail you look at has already passed it. Two true, on-topic details can still be miles apart in how hard they push the claim. "She looked at the floor" and "she slid the trophy behind the books before her sister came in" both fit the claim that she is jealous of her sister. Only one of them makes you say it.',
        'UNDERLINE THE DEMANDING WORD IN THE CLAIM. Every claim has one word or phrase that does the real work: jealous, not just upset; lying, not just nervous; planned, not just happened. Weak evidence reaches the neighborhood of that word; strong evidence reaches the word itself. Read the claim first and know exactly what has to be proven before you look at a single detail. A claim with two halves, such as "disappointed, and hiding it," is strongest served by a detail that reaches both.',
        'THE OTHER-STORIES TEST: STRONG EVIDENCE FITS THE CLAIM AND ALMOST NOTHING ELSE. For each detail, ask how many other stories it fits just as well. "She looked at the floor" fits shy, tired, guilty, bored and jealous: five stories, so it barely moves the claim. The hidden trophy fits jealousy and very little else. The fewer other stories a detail fits, the stronger it is. This one question is the whole ranking.',
        'CONSISTENT IS NOT THE SAME AS SUPPORTING. A detail that does not contradict the claim can still do nothing for it. "The gym was crowded" is consistent with "Marcus was nervous" and is not evidence for it. The bottom of every ranking is full of details like this: true, on the page, and proving nothing. Do not mistake "it fits" for "it shows."',
        'VIVID IS NOT THE SAME AS STRONG. The line that stands out most, the slammed door, the shout, the tears, is often the one that fits the most other stories, because big feelings have many causes. Rank a detail by what it proves, not by how much you noticed it. The strongest detail is often a small, quiet one that nobody in the story meant for anyone to see.',
        'THE ONE-QUOTE TEST DECIDES A TIE. When two details both look strong, imagine you may quote only one, and the claim has to stand on it alone. The one that leaves the claim standing is the one you cite. That is what "cite the evidence that supports best" means: not the first detail you found, not all of them, but the one that does the most work.',
      ],
      vocabulary: [
        { term: 'strongest evidence', definition: 'among several details that all support a claim, the one that reaches the claim\'s demanding word most directly and fits the fewest other stories.' },
        { term: 'consistent with', definition: 'a detail that does not contradict a claim but does not push it either; being consistent is not the same as supporting.' },
        { term: 'the other-stories test', definition: 'asking how many different explanations a detail fits just as well as it fits the claim; the fewer, the stronger the evidence.' },
        { term: 'demanding word', definition: 'the word or phrase in a claim that does the real work and has to be proven (jealous, lying, planned), as opposed to its milder neighbors.' },
        { term: 'rank', definition: 'to put several true details in order from the one that supports the claim best to the one that barely supports it at all.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rank-four-true-details',
      kind: 'worked_example',
      problem:
        'Claim: "Nadia is more disappointed about the list than she is letting anyone see." Four details from the excerpt are listed below it. Rank them from strongest to weakest, and say which one you would cite.\n\n"The volleyball list went up outside the gym at three. Nadia read it twice, then laughed and told Priya she had never really wanted to play anyway. On the bus she kept her earbuds in, and when her brother asked how tryouts went she said \'fine\' and turned toward the window. That night her mother found the kneepads Nadia had bought with her own money in July at the bottom of the kitchen trash, still in the package."\n\nDetail 1: "Nadia read it twice"\nDetail 2: "laughed and told Priya she had never really wanted to play anyway"\nDetail 3: "she said \'fine\' and turned toward the window"\nDetail 4: "the kneepads Nadia had bought with her own money in July at the bottom of the kitchen trash, still in the package"',
      steps: [
        'Check the gate first, in one breath. All four details are quoted exactly from the excerpt, and all four are about Nadia after the list went up. None is a guess and none is a mismatched quote. So the test you already know does not separate them, which is exactly why a ranking is needed.',
        'Underline the demanding words in the claim before touching a detail. There are two halves: "more disappointed" and "than she is letting anyone see." The strongest detail has to reach real disappointment AND hiding it. A detail that reaches only one half is weaker than one that reaches both.',
        'Detail 1, "Nadia read it twice." Run the other-stories test. Reading a list twice fits checking for a misspelled name, fits looking for a friend\'s name, fits plain disbelief, and fits disappointment. Four stories at least, and none of them is forced. This detail is consistent with the claim and does almost nothing for it. Bottom of the ranking.',
        'Detail 3, "she said \'fine\' and turned toward the window." This fits disappointment and hiding, so it reaches both halves a little. But it also fits tired, fits annoyed at a brother, fits wanting to hear the song in her earbuds. Several other stories fit just as well, so it supports the claim only weakly. Third place.',
        'Detail 2, "laughed and told Priya she had never really wanted to play anyway." This is the hiding half in action: a laugh and a denial, delivered to a friend within a minute of reading the list. It reaches "letting anyone see" hard. What it does not reach on its own is "more disappointed": a reader who had only this line could not tell whether Nadia is covering or simply honest. Strong on one half, open on the other. Second place.',
        'Detail 4, the kneepads. Take it apart. She "had bought" them "with her own money in July," which says she wanted this badly and had for months, and quietly contradicts what she told Priya. They are "still in the package," which says she never got to use them. They are "at the bottom of the kitchen trash," which says she got rid of them where nobody would notice. One detail reaches both halves of the claim, and try to tell another story that fits it: there is not one. Strongest.',
        'State the answer in the shape you already use, claim plus because plus the exact words, and cite the one that does the most work. The ranking is 4, then 2, then 3, then 1. If you may quote only one detail, quote the kneepads, because the claim stands on that line alone.',
      ],
      answer:
        'Strongest: the kneepads Nadia "had bought with her own money in July," found "at the bottom of the kitchen trash, still in the package," because that one detail reaches both halves of the claim, real disappointment and hiding it, and fits no other story. Then the laugh and the denial to Priya, which shows the hiding but leaves the disappointment open. Then "fine" and the window, which fits the claim but fits tired or annoyed just as well. Weakest, "read it twice," which fits at least four stories and proves none of them.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rank-details-in-an-informational-text',
      kind: 'worked_example',
      problem:
        'The same ranking works on nonfiction. Claim: "The robot could not be counted on during matches." Rank the four details below and say which one you would cite.\n\n"The Fairmont Middle robotics team finished fourth of twelve at its regional in February, a step up from the year before. The season was not smooth. Between September and January the robot\'s arm was rebuilt three times, and the team brought a spare battery to every match. In four of its nine matches the robot stopped moving before the round ended."\n\nDetail 1: "finished fourth of twelve at its regional in February"\nDetail 2: "the robot\'s arm was rebuilt three times"\nDetail 3: "the team brought a spare battery to every match"\nDetail 4: "In four of its nine matches the robot stopped moving before the round ended"',
      steps: [
        'Underline the demanding words. The claim says the robot "could not be counted on during matches," and that is about reliability, and specifically reliability while a match is running. Not about how good the robot was, not about how hard the team worked. Any detail that reaches something nearby, such as effort or results, reaches the neighborhood and not the word.',
        'Detail 1, "finished fourth of twelve at its regional in February." Run the other-stories test. Fourth of twelve fits a reliable robot that was simply outscored, fits an unreliable robot that got lucky, fits a strong robot with a weak driver. It says nothing about whether the robot kept running. Consistent with the claim, and no evidence for it.',
        'Detail 3, "the team brought a spare battery to every match." This feels like worry, and worry feels like it points at the claim. But ask what other stories it fits. A careful team brings a spare battery whether or not its robot has ever failed, and the passage never says a spare was ever needed. This reaches the team\'s caution, not the robot\'s reliability. Consistent, and barely more than that.',
        'Detail 2, "the robot\'s arm was rebuilt three times." Three rebuilds could mean three breakdowns, which would support the claim. They could also mean three upgrades, since a team that keeps improving its design rebuilds parts on purpose, and the passage says the team finished higher than the year before. Two stories fit, and the passage does not choose between them. This supports the claim some, and only some.',
        'Detail 4, "In four of its nine matches the robot stopped moving before the round ended." This reaches the demanding words exactly: a robot that stops mid-match in four rounds out of nine is a robot you cannot count on during a match, by the plain meaning of the claim. Try to tell another story that fits a robot stopping in nearly half its matches. There is not one. Strongest.',
        'Notice where the ranking landed. The two bottom details, the placing and the spare battery, are both true and both in the passage, and neither one makes you say the claim. The rebuilt arm supports it partway. Only one detail reaches the word "counted on" and fits nothing else, and that is the one to cite: the claim, because "In four of its nine matches the robot stopped moving before the round ended."',
      ],
      answer:
        'Strongest: "In four of its nine matches the robot stopped moving before the round ended," because a robot that stops mid-match that often is exactly what "could not be counted on during matches" means, and no other story fits it. Second: the arm "rebuilt three times," which fits breakdowns but fits upgrades just as well. The placing and the spare battery are at the bottom in either order; both are consistent with the claim, and neither is evidence for it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-strongest-detail-literature',
      kind: 'try_yourself',
      problem:
        'Claim: "Marcus already knows he is going to lose the election before the results are read." Which detail from the excerpt most strongly supports the claim?\n\n"Marcus had spent two weeks taping posters to every locker bank in the building. In homeroom on the morning of the vote he told Priya that he hoped the count would be quick. When the principal came on the speaker to read the results, Marcus kept his eyes on his desk. He was already writing \'Congratulations, Dani\' inside a card he had bought the night before."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Marcus had spent two weeks taping posters to every locker bank in the building."' },
        { id: 'b', text: '"In homeroom on the morning of the vote he told Priya that he hoped the count would be quick."' },
        { id: 'c', text: '"He was already writing \'Congratulations, Dani\' inside a card he had bought the night before."', correct: true },
        { id: 'd', text: '"When the principal came on the speaker to read the results, Marcus kept his eyes on his desk."' },
      ],
      expectedAnswer: '"He was already writing \'Congratulations, Dani\' inside a card he had bought the night before."',
      hints: [
        'Underline the demanding part of the claim first: not nervous, not hoping, but already knows he will lose, and knows it before the results are read. Then ask each detail how many other stories it fits just as well.',
        'Three of these fit a candidate who is nervous about either outcome exactly as well as they fit one who expects to lose. One detail names the winner before the principal does, and was paid for the night before the vote.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-strongest-detail-informational',
      kind: 'try_yourself',
      problem:
        'Claim: "The compost bins at Ridgeway are not being used the way they were meant to be." Which detail from the article most strongly supports the claim, and why?\n\n"Ridgeway Middle School added green compost bins beside every trash can in the cafeteria in October. Signs above each bin show which items belong where. Custodians report that the compost bins fill up about as fast as the old trash cans did, but that nearly every bag they pull from a compost bin has to be thrown out as trash because it is mixed with plastic forks and chip bags. The environmental club has asked the office for a second set of signs."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Signs above each bin show which items belong where," because the signs prove that sorting is expected of every student who eats in the cafeteria, and an expectation that has to be posted on a sign is one the school already knows is not being met.' },
        { id: 'b', text: '"the compost bins fill up about as fast as the old trash cans did," because a compost bin that fills that quickly must be taking whatever students throw into it, and a bin that takes everything is a bin nobody is bothering to sort for.' },
        { id: 'c', text: '"The environmental club has asked the office for a second set of signs," because nobody asks for more signs unless the first set is being ignored by most of the school, and the club would know better than anyone how the bins are being used.' },
        { id: 'd', text: '"nearly every bag they pull from a compost bin has to be thrown out as trash because it is mixed with plastic forks and chip bags," because a compost bag full of plastic is the bins being used the wrong way, counted by the custodians, in nearly every bag.', correct: true },
      ],
      expectedAnswer: '"nearly every bag they pull from a compost bin has to be thrown out as trash because it is mixed with plastic forks and chip bags," because a compost bag full of plastic is the bins being used the wrong way, counted by the custodians, in nearly every bag.',
      hints: [
        'The claim is about how the bins are actually being used, not about what the school hoped for or what the club wants next. Find the one detail that reports what is inside the bins.',
        'A bin that fills quickly, a sign that explains the rule and a request for more signs all fit a cafeteria where the sorting is going fine. Which detail could not be true in that cafeteria?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-strongest-detail-against-a-denial',
      kind: 'try_yourself',
      problem:
        'Claim: "Jonah\'s grandmother planned this gift for Jonah ahead of time, whatever she says about it." Which detail most strongly supports the claim, and why?\n\n"At the end of dinner, Jonah\'s grandmother slid a small box across the table without a word. Inside was his grandfather\'s old watch, ticking. When he turned the watch over, he found fresh engraving on the back: his own initials and the year. His grandmother shrugged and said it had just been sitting in a drawer."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"he found fresh engraving on the back: his own initials and the year," because an engraving with Jonah\'s initials had to be ordered before tonight, and it fits no story except a gift prepared for him.', correct: true },
        { id: 'b', text: '"Inside was his grandfather\'s old watch, ticking," because a watch that has been kept wound and running is a watch that someone has been getting ready to hand over for a long time.' },
        { id: 'c', text: '"slid a small box across the table without a word," because the silence and the slow slide of the box are the most dramatic moment in the excerpt and show how much thought went into it.' },
        { id: 'd', text: '"His grandmother shrugged and said it had just been sitting in a drawer," because a grandmother who plays a gift down that casually is clearly hiding how long she has been planning it.' },
      ],
      expectedAnswer: '"he found fresh engraving on the back: his own initials and the year," because an engraving with Jonah\'s initials had to be ordered before tonight, and it fits no story except a gift prepared for him.',
      hints: [
        'The demanding words are "ahead of time." A detail counts as strongest only if it could not have happened on the spot, and if it fits no story except a gift planned for Jonah.',
        'Set aside the grandmother\'s own words, since her words are exactly what the claim tells you to doubt, and set aside the most dramatic moment, since a slow reveal fits a gift decided that afternoon just as well. Of the two details left, one could be done in a minute and one had to be ordered.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vivid-and-consistent',
      kind: 'misconception_check',
      question:
        'Claim: "Ava is not really sick today." Passage: "Ava groaned loudly enough for the whole house to hear and told her mother she had a fever. She stayed in bed until the front door closed. By ten she was dressed, and by ten fifteen she was on the bus to the mall with her skateboard under her arm. The thermometer sat on the kitchen counter, unused." One student says the strongest evidence is the groan, "because it is the biggest moment in the passage." Another says it is the unused thermometer, "because it fits the claim." What went wrong each time?',
      commonErrors: [
        {
          answer: 'The strongest evidence is that Ava "groaned loudly enough for the whole house to hear," because it is the biggest moment in the passage.',
          misconception:
            'Ranking a detail by how much it stands out instead of by what it proves. The groan is the loudest line in the passage, so it felt like the important one, and important got mistaken for strong.',
          correctsTo:
            'Run the other-stories test. A loud groan fits a girl who is faking, and it fits a girl who really does have a fever, exactly as well; it does not make you say either one. Big moments usually have many causes, which is why they so often sit near the bottom of a ranking. The detail that fits almost no other story is a quiet one: "by ten fifteen she was on the bus to the mall with her skateboard under her arm." A skateboard at the mall at ten fifteen fits no story in which she is sick in bed, and that is what makes it the strongest.',
        },
        {
          answer: 'The strongest evidence is that "The thermometer sat on the kitchen counter, unused," because it fits the claim.',
          misconception:
            'Treating consistent as supporting. The thermometer does not contradict the claim, so the student counted it as proof, when fitting the claim is only the gate a detail has to pass before the ranking even starts.',
          correctsTo:
            'Underline the demanding words, "not really sick," and ask which detail reaches them. An unused thermometer fits a girl who is faking, but it fits a mother who never thought to check, or a house where nobody uses that thermometer, just as easily; it is consistent with the claim and does almost nothing for it. The skateboard at the mall reaches the demanding words; the thermometer only sits near them. Cite the detail that reaches the word, not the one that merely fails to contradict it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every detail you rank has already passed the gate: it is really on the page and really about the claim. Ranking starts where citing ended.',
        'Underline the demanding word in the claim first. Strong evidence reaches that word; weak evidence reaches only the neighborhood.',
        'The other-stories test: the fewer other stories a detail fits, the stronger it is. A detail that fits five stories barely moves the claim.',
        'Consistent is not supporting. A detail that merely does not contradict the claim belongs at the bottom of the ranking.',
        'Vivid is not strong. Rank by what a detail proves, not by how much you noticed it; the strongest detail is often a small, quiet one.',
        'When two details tie, use the one-quote test: if you could cite only one, which would leave the claim standing? Cite that one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Strongest Textual Evidence' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
