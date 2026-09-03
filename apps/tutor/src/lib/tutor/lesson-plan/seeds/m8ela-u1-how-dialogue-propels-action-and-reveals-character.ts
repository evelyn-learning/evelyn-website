/**
 * Grade 8 ELA — Reading Literature: Evidence, Dialogue & Structure: How
 * Dialogue Propels Action & Reveals Character.
 *
 * CONCEPT-LED row (built on the shape of the m8ela concept-led exemplar). The
 * student arrives able to read what a character SAYS as one clue to what
 * they are like; this lesson adds the second job a line can do and gives the
 * student one way of reading that finds it: a line of dialogue PROPELS the
 * action when the next thing that happens depends on it, which the COVER
 * TEST checks (cover the line, read on, ask whether what follows still makes
 * sense), and the change it makes is one of three kinds — a decision made, a
 * secret exposed, a plan changed. The same line REVEALS the speaker through
 * the words chosen and can reveal the listener through their reaction right
 * after it, and the student cites the line exactly and names both jobs in one
 * sentence (CCSS RL.8.3). Three traps this plan is built to kill: taking the
 * loudest line for the one that moves the story (cover it, and often nothing
 * changes); stopping at the first job, so that a line which changed the plan
 * is filed as "shows she is bossy"; and reading a character off the
 * narration around a line, or off the event behind it, instead of off the
 * words of the line itself.
 *
 * SCOPE GUARD: Grade 8 row 1.2 analyzes how a particular line of dialogue in
 * a short excerpt does two jobs at once — moves the plot forward (a decision
 * made, a secret exposed, a plan changed) and reveals the speaker or listener
 * — and cites the line. Builds on `m7ela-u1-characterization.ts` (RL.7.3),
 * which treats "what the character SAYS" as one of five trait clues; G8
 * isolates dialogue and asks what it DOES to the plot, not only what trait it
 * shows. RL.8.3 covers both dialogue (this topic) and incidents (next topic);
 * split here by pedagogical stage. Stops short of HS
 * `engl-u6-characterization.ts` (RL.9-10.3: inferring motive, direct vs.
 * indirect as an analytic frame). DELIBERATELY EXCLUDED: the five
 * indirect-characterization moves as a list, the labels "direct" and
 * "indirect" characterization, and the "words vs. actions" trap, all of which
 * are `m7ela-u1-characterization.ts`'s — none of the words "direct",
 * "indirect", "five moves" or "characterization" appears in this file's body
 * below this comment; the word "motive" and any question of WHY a character
 * says a line, which is HS `engl-u6-characterization.ts`'s — the body asks
 * only what a line does and what it shows, and the word "motive" does not
 * appear below this comment; the incident-to-decision chain, which is row
 * 1.3 — no question in this file asks what an EVENT causes, only what a LINE
 * causes; ranking several true details for strength, which is row 1.1; the
 * five plot stages and the turning-point test, which are
 * `m7ela-u1-plot-structure-and-conflict.ts`'s — none of "exposition",
 * "rising action", "climax", "falling action", "resolution" or "turning
 * point" appears in the body; and writing or punctuating dialogue, which is
 * `m7ela-u9-narrative-technique.ts`'s (W.7.3b). DELIBERATELY ALLOWED, because
 * the G7 rows and row 1.3 sit close: (a) the hook, one keyIdea and one recap
 * line say in a single sentence that the student already reads a line as a
 * clue to what a character is like — that is the G7 skill named as the
 * floor, not re-taught, and the G7 word "trait" itself does not appear in
 * the body;
 * (b) the listener's reaction is read as evidence about the listener, which
 * reuses the G7 "how others react" clue in one line without listing the
 * five clues; (c) `m7ela-u9-narrative-technique.ts` states, as a writing
 * rule, that story dialogue earns its space "by revealing character or
 * moving the story forward" — this row assumes that sentence and builds the
 * READING skill on it (the cover test, the three kinds of change, citing the
 * line), none of which the G7 row does; (d) the scenes in this file contain
 * events (a partner drops out, a sister is moving in, a door flat is too
 * tall) because a line has to be about something, but every question is
 * about a line and every cover test covers a line, never an event.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it, and no published work may be quoted or closely paraphrased.
 * Every phrase this file quotes from one of its excerpts appears character-
 * for-character in that excerpt; quote your own excerpt exactly, never from
 * memory. Contractions appear only inside quoted character speech (reported
 * speech), never in the tutor's own voice.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative fiction, which is true by construction, so there is no factual
 * claim to verify. Rows whose passages are INFORMATIONAL (all of Units 3 and
 * 4, and any other row needing nonfiction) must carry the four-column claim
 * ledger described in the fan-out contract instead of this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U1_HOW_DIALOGUE_PROPELS_ACTION_AND_REVEALS_CHARACTER: LessonPlan = {
  id: 'evelyn.ms.m8ela.how-dialogue-propels-action-and-reveals-character.v1',
  title: 'How Dialogue Propels Action & Reveals Character',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.how-dialogue-propels-action-and-reveals-character',
      standard: 'M8ELA-1.2',
      description:
        'Analyze how a particular line of dialogue in a short excerpt does two jobs at once -- moves the plot forward (a decision made, a secret exposed, a plan changed) and reveals the speaker or listener -- and cite the line (CCSS RL.8.3).',
    },
  ],
  prerequisites: ['m8ela.strongest-textual-evidence'],
  followUps: ['m8ela.how-an-incident-provokes-a-decision'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that one spoken sentence can change an afternoon and show who someone is at the same time, and that the second job is the one worth learning to see.',
      script:
        'Your friend sits down at lunch, and before you have finished opening your drink she says, "I\'m not going to tryouts." Everything shifts. You had planned to walk over together, so now you are going alone or not at all, and the whole after-school arrangement the two of you built depends on her being there. The sentence also told you something about her, because she said it before you asked, and she said it flat, like a fact she had already argued about with herself. One line, and two things happened: the afternoon changed shape, and you learned something. Now compare that with "Pass the ketchup." A story is full of both kinds of line. Writers put dialogue on the page because a line can do a job that narration cannot do as quickly: it can change what happens next and show you who someone is in the same breath. Last year you learned to read what a character says as a clue to what they are like. Today the question is bigger. What did this line DO? What happens after it that would not have happened without it, and what does the way it was said show about the person who said it, or the person who heard it?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-jobs-and-the-cover-test',
      kind: 'concept',
      goal: 'Install the two-job idea, the cover test that separates a propelling line from a line that only reveals, the three kinds of change to look for, the habit of reading the listener\'s reaction as evidence, and the one-sentence shape for citing the line.',
      keyIdeas: [
        'A LINE OF DIALOGUE CAN DO TWO JOBS AT ONCE, AND THE SECOND JOB IS THE NEW ONE. You already read what a character says as a clue to what they are like. That is the first job: a line REVEALS. The second job is that a line can PROPEL, meaning it changes what happens next. "I\'m not coming to the party" reveals something about the speaker, and it also means the party now happens without them, which is a change in the story. When you are asked how a line propels the action and reveals character, you are being asked to name both jobs and to quote the line that does them.',
        'THE COVER TEST TELLS YOU WHETHER A LINE PROPELS. Put your thumb over the line and read on. Does the next thing that happens still make sense without it? If everything after the line would have happened anyway, the line did not move the story, however interesting it was. If the next thing depends on the line, the line propelled it. "The keys are in my other jacket" is a small sentence, but if the next sentence is everyone walking back to the house, it moved the plot.',
        'A LINE PROPELS IN ONE OF THREE WAYS, SO LOOK FOR THE CHANGE. A DECISION is made ("Fine. I\'ll do it alone."), a SECRET is exposed ("I was the one who sent it."), or a PLAN is changed ("We\'re taking the bus instead."). Find the sentence after the line where a character does something different from what they were doing before, and trace it back to the line. The change is your evidence that the line propelled the action. Without a change, you have a line that only reveals, which is still a real job, but only one.',
        'THE LOUDEST LINE IS NOT ALWAYS THE ONE THAT MOVES THE STORY. A shouted "I can\'t believe you did that!" feels important, but cover it, and often nothing changes; the plan was already changing. The line that actually turns the scene is often the quiet one, said flat, or the one that arrives second, after the small talk. Run the cover test on every line, not only on the one with the exclamation mark.',
        'A LINE REVEALS THE SPEAKER, AND IT CAN REVEAL THE LISTENER TOO. The speaker is revealed by what they choose to say and how, so point at the words: a "no" followed by an offer of help shows one kind of person, and a "no" followed by silence shows another. The listener is revealed by what they do right after the line, because their reaction is the line landing on them. A character who takes the index cards without arguing has been revealed by a line somebody else spoke. When you cite the line, say who it reveals and which words, or which reaction, show it.',
        'SAY BOTH JOBS IN ONE SENTENCE, WITH THE LINE QUOTED EXACTLY. The shape is: when NAME says "LINE," it propels the story by CHANGE, and it reveals PERSON as WHAT, because WORDS. Quote the line letter for letter, including the part that does the work. A quotation that leaves off "after tonight" can lose the whole change.',
      ],
      vocabulary: [
        { term: 'dialogue', definition: 'the words a character actually speaks, printed inside quotation marks; in this lesson the unit being analyzed is one line of it.' },
        { term: 'propel the action', definition: 'to change what happens next in the story: after the line, a decision is made, a secret is exposed or a plan is changed that would not have happened without it.' },
        { term: 'reveal', definition: 'to show the reader what a character is like, through the words the speaker chooses or through what the listener does in response.' },
        { term: 'the cover test', definition: 'covering a line of dialogue and reading on to see whether what follows still makes sense; if it does not, the line propelled the action.' },
        { term: 'listener', definition: 'the character a line is spoken to; what they do right after the line is evidence about them.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-find-the-line-that-propels',
      kind: 'worked_example',
      problem:
        'Find the line of dialogue that propels the action, say what it reveals, and cite it.\n\n"Priya and Marcus had rehearsed their science fair presentation four times, and Marcus had said his half perfectly every time. On the morning of the fair he found her by the lockers. \'My mom can\'t come today,\' he said, and then, quieter, \'so I\'m not doing the talking part.\' Priya looked at him for a long second, took the index cards out of his hand and slid them into her own pocket."',
      steps: [
        'List the lines of dialogue first. There are two, both from Marcus: "My mom can\'t come today" and "so I\'m not doing the talking part." Priya says nothing at all. So whatever the dialogue does in this excerpt, one of those two lines is doing it.',
        'Run the cover test on the first line. Cover "My mom can\'t come today" and read on. Marcus still says he is not doing the talking part, and Priya still takes the cards. The story runs the same without it. That line explains, but it does not move anything.',
        'Run the cover test on the second line. Cover "so I\'m not doing the talking part" and read on. Now Priya is taking index cards out of the hand of a partner who, as far as the story has said, is still presenting. Her action stops making sense. The next thing depends on the line, so this is the line that propels.',
        'Name the change. Before the line, the plan was two presenters, rehearsed four times. After the line, Priya has both halves in her pocket. That is a plan changed, and it happened in one sentence of dialogue.',
        'Now the other job. What does the line reveal about Marcus, the speaker? Point at the words. He "had said his half perfectly every time," so the problem is not that he cannot do it. What he says, and the fact that he says it "quieter," shows that his nerve for the talking part was tied to his mom being in the room, whatever four rehearsals had proved.',
        'And the listener. Priya "looked at him for a long second" and then took the cards without a word. The line landed on her, and her reaction shows someone who absorbs a last-minute change and acts instead of arguing.',
        'A weaker answer stops at the first job. WRONG: "The line shows that Marcus is nervous." That is true and it is half. CORRECT: when Marcus says "so I\'m not doing the talking part," it changes the plan, because Priya now presents alone, and it reveals Marcus as someone whose nerve depended on his mom being there and Priya as someone who takes over without a fight.',
      ],
      answer:
        'The line that propels the action is "so I\'m not doing the talking part." It changes the plan, because Priya takes his index cards and will now present alone, and it reveals Marcus as someone whose nerve for the presentation depended on his mom being there, and Priya as someone who takes over a last-minute change without arguing.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-one-speaker-two-lines',
      kind: 'worked_example',
      problem:
        'Two lines of dialogue, one speaker. Decide which line only reveals and which line does both jobs, and say how you know.\n\n"Nora had run the sound board for every concert since October, and she had the settings for the spring concert written on the back of her hand. Ten minutes before the doors opened, Ellis leaned over the board. \'You\'ve got the bass up way too high, you know,\' he said. Nora nodded and did not touch it. Then he said, \'Ms. Ortiz wants me on the board for the second half.\' Nora pulled her headphones off, set them on the board, and walked out to the lobby."',
      steps: [
        'Both lines are from Ellis, and both are the kind of line a reader might call important, because in both of them Ellis is telling Nora something about her own board. The cover test will separate them.',
        'Cover the first line, "You\'ve got the bass up way too high, you know," and read on. Ellis still says Ms. Ortiz wants him for the second half, and Nora still walks out. Nothing after the first line depends on it. Nora "nodded and did not touch it," and the story moves on as if the line had not been said. That is a line that does not propel.',
        'It still does the first job. What does it reveal? About Ellis, the speaker: he corrects someone who has run the board since October, uninvited, ten minutes before the doors open. About Nora, the listener: she nods and "did not touch it," which shows someone who hears a correction and keeps her own settings. A line can reveal two people and still move nothing.',
        'Cover the second line, "Ms. Ortiz wants me on the board for the second half," and read on. Nora is pulling her headphones off and walking out to the lobby, and there is no reason for it. Her action depends on the line. This one propels.',
        'Name the change. It is a plan changed: the board was Nora\'s for the whole concert, and now it is Ellis\'s for half of it. Then notice what the change reveals about the listener, because Nora does something bigger than the line asked for. Ellis said "the second half," and Nora leaves before the first half has started. Her reaction shows someone who will not stay for half of something that had been hers.',
        'A tempting wrong answer picks the first line because it comes first and sounds like a criticism. WRONG: "The bass line moves the story, because it starts the argument." There is no argument; Nora nods. CORRECT: the first line reveals only; the second line, "Ms. Ortiz wants me on the board for the second half," changes the plan and reveals Nora through her reaction to it.',
      ],
      answer:
        'The first line, "You\'ve got the bass up way too high, you know," reveals Ellis as someone who corrects an expert uninvited and Nora as someone who keeps her own settings, but nothing after it depends on it. The second line, "Ms. Ortiz wants me on the board for the second half," changes the plan, because Nora leaves the board, and it reveals Nora, the listener, as someone who will not stay for half of something that had been hers.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-line-propels',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the line of dialogue that propels the action, with the reason that correctly explains why.\n\n"Jade had babysat the Alvarez twins every Friday since September. This Friday, Mrs. Alvarez met her at the door with her coat already on. \'Traffic was awful,\' she said. \'The twins already ate, so don\'t let them tell you otherwise.\' Jade laughed and said, \'They tried that last week too.\' Mrs. Alvarez paused with one hand on the doorknob. \'Also, my sister is moving in on Sunday, so we won\'t need you after tonight.\' Jade said, \'Oh. Okay,\' and kept her smile exactly where it was until the door closed."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Traffic was awful," because it explains why Mrs. Alvarez is in such a hurry, and her hurry at the door is what sets everything that follows in the excerpt in motion.' },
        { id: 'b', text: '"The twins already ate, so don\'t let them tell you otherwise," because it is an instruction, and an instruction changes what Jade will be doing for the rest of the night.' },
        { id: 'c', text: '"They tried that last week too," because it shows how well Jade knows the twins after all of those Fridays, which is exactly what the end of the excerpt turns on.' },
        { id: 'd', text: '"Also, my sister is moving in on Sunday, so we won\'t need you after tonight," because it ends Jade\'s Friday job, and nothing else in the excerpt would have ended it.', correct: true },
      ],
      expectedAnswer: '"Also, my sister is moving in on Sunday, so we won\'t need you after tonight," because it ends Jade\'s Friday job, and nothing else in the excerpt would have ended it.',
      hints: [
        'Run the cover test on each line in turn: put your thumb over it, read on, and ask whether what happens next still makes sense without it.',
        'Three of these lines could be removed and Jade would still laugh, still get her instructions and still lose the job. Look for the one line after which something is different from before: a decision made, a secret exposed or a plan changed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-line-reveals',
      kind: 'try_yourself',
      problem:
        'Read the excerpt. Lena\'s line propels the action, because Dev\'s paragraph arrives after it. Choose the statement that correctly says what the same line reveals about Lena, the speaker, and which words show it.\n\n"The group project was due at eight the next morning, and Dev\'s slide was still blank. At nine that night he sent the group a message: \'Can one of you just do mine? I have a thing.\' Lena typed three replies and deleted all three. Then she sent one: \'No. Send me whatever you have by ten, even if it\'s two sentences, and I\'ll help you fix it.\' At 9:52 a paragraph arrived, with one typo and a source."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'She is firm and still on his side: "No" refuses to do his slide for him, "even if it\'s two sentences" lowers the bar to something he can actually meet, and "I\'ll help you fix it" keeps the door open once he has.', correct: true },
        { id: 'b', text: 'She is angry and is punishing Dev for asking, which is why her reply opens with a flat "No" and hands him a deadline of ten, only an hour away, with no offer of anything from her until that deadline has passed.' },
        { id: 'c', text: 'She is a pushover who will end up doing the slide herself, since "I\'ll help you fix it" is an offer to take the work over, and Dev, who has "a thing," has already made it clear that he will not be doing it.' },
        { id: 'd', text: 'She cannot make up her mind, which the excerpt shows when she "typed three replies and deleted all three," so the line reveals a speaker who is still unsure of what she actually wants from Dev.' },
      ],
      expectedAnswer: 'She is firm and still on his side: "No" refuses to do his slide for him, "even if it\'s two sentences" lowers the bar to something he can actually meet, and "I\'ll help you fix it" keeps the door open once he has.',
      hints: [
        'Read the whole line, not only its first word or its last clause. What a speaker chooses to say includes every part of it, and this line has three parts.',
        'One choice uses only the "No," one uses only the offer of help, and one uses the deleted replies, which are narration and not the line. The line Lena actually sent is what reveals her: put its three parts together and ask what kind of person says all three at once.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-both-jobs',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the statement that correctly names BOTH jobs Rae\'s line "I hit the door" does.\n\n"Sam had promised his older sister Rae that he would say nothing about the dent in the garage door until she could tell their parents herself. At dinner their dad asked who had left the garage light on. \'Rae did,\' Sam said, \'when she was backing out. She\'s getting really good at it.\' Rae set down her fork. \'I hit the door,\' she said. \'Tuesday. I was going to tell you.\' Their dad looked toward the garage for a while and then said he would call the insurance company in the morning."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It moves the story forward by making their dad look toward the garage, and it reveals that Rae had meant to keep the dent hidden for good, since she speaks up only after Sam has mentioned her backing out.' },
        { id: 'b', text: 'It exposes a secret their dad did not have, which moves the story to his decision to call the insurance company, and it reveals Rae as someone who owns up fully, with the day attached, as soon as the subject comes close.', correct: true },
        { id: 'c', text: 'It reveals that Rae is honest, but it does not move the story, because their dad already knew about the dent, which is why he asked about the garage, and he would have called the insurance company either way.' },
        { id: 'd', text: 'It reveals only Rae\'s reaction, because the line that moves the story is Sam\'s: "when she was backing out" is what exposes the secret, and Rae\'s confession simply repeats what their dad has already worked out from it.' },
      ],
      expectedAnswer: 'It exposes a secret their dad did not have, which moves the story to his decision to call the insurance company, and it reveals Rae as someone who owns up fully, with the day attached, as soon as the subject comes close.',
      hints: [
        'Do the two jobs one at a time. First cover "I hit the door" and read on: does their dad still make his phone call? Then go back to the words of the line itself and ask what a person who says exactly those words, in that order, is like.',
        'Check each statement against the excerpt before you check it against your instincts. Their dad asked about a light, not a dent, so what did he know before Rae spoke? And Sam\'s line mentions backing out but never a door, so which line actually exposed the secret?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-loudest-line-and-first-job-only',
      kind: 'misconception_check',
      question:
        'Two students read the same scene. Kenji and Aisha are painting sets for the school play, and the door flat they have spent all afternoon on turns out to be a foot too tall for the stage wall. Kenji throws his brush down and shouts, "This whole thing is ruined!" Aisha keeps painting and says, "Then the door scene moves to the side wall. Hand me the tape." Kenji picks up the tape. One student writes: "Kenji\'s line is the one that propels the action, because it is the big dramatic moment of the scene." The other writes: "Aisha\'s line only reveals that she is bossy. A sentence about tape does not change anything." What went wrong each time?',
      commonErrors: [
        {
          answer: 'Kenji\'s line is the one that propels the action, because it is the big dramatic moment of the scene.',
          misconception:
            'Treating the loudest line as the one that moves the story. An exclamation mark and a thrown brush feel like the turning moment of the scene, so the student never ran the cover test.',
          correctsTo:
            'Cover Kenji\'s line and read on. Aisha still moves the door scene to the side wall, and Kenji still picks up the tape; nothing after his line depends on it. His shout reveals him, a person whose first response to a problem is to declare it ruined, and that is a real job, but it is only the first job. Now cover Aisha\'s line. Kenji is picking up tape for no reason, and the door scene is still stuck on the wrong wall. Her line is the one the next event depends on, so her line is the one that propels. The loud line and the moving line are often two different lines.',
        },
        {
          answer: 'Aisha\'s line only reveals that she is bossy. A sentence about tape does not change anything.',
          misconception:
            'Stopping at the first job, and judging the line by its subject instead of by its effect. The student read "Hand me the tape" as small talk about supplies, and read the speaker only, never the listener.',
          correctsTo:
            'Run the cover test on the line before deciding what it does. Without "Then the door scene moves to the side wall," there is no new plan, and without "Hand me the tape," Kenji does not pick up the tape. That is a plan changed, in one line, which is exactly what propelling the action means. Then look at both people. Whatever word you choose for Aisha, the words she says show someone who answers "ruined" with a new plan and keeps painting while she says it. And Kenji, the listener, is revealed too: he goes from throwing his brush down to handing over tape in one sentence, which shows a person who follows a plan the moment somebody offers one. A line can reveal the person it was said to, and the listener\'s reaction is part of your evidence.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A line of dialogue can do two jobs at once: it REVEALS a character, which you already knew how to read, and it can PROPEL the action by changing what happens next.',
        'The cover test decides the second job. Cover the line and read on; if what happens next no longer makes sense, the line propelled it. If the story runs the same without it, the line only reveals.',
        'A line propels in one of three ways: a decision is made, a secret is exposed or a plan is changed. Find the sentence after the line where somebody does something different, and trace it back to the line.',
        'The loudest line is not always the one that moves the story. Run the cover test on the quiet line and on the second line too.',
        'A line reveals the speaker through the words chosen, and it can reveal the listener through what they do right after it. Both count as evidence, and both need the exact words.',
        'Say both jobs in one sentence and quote the line letter for letter: when NAME says "LINE," it changes WHAT, and it shows WHO as WHAT, because WORDS.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'How Dialogue Propels Action & Reveals Character' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
