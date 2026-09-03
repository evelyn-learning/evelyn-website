/**
 * Grade 8 ELA — Theme, Dramatic Irony & Allusion: How a Theme Develops
 * Through Character & Setting.
 *
 * CONCEPT-LED. The student arrives able to state a theme as a full sentence
 * and to say that a story "develops" it, but with no way to say WHERE. This
 * lesson builds one way of reading: a developed theme has a BEFORE, a TURN
 * and an AFTER; the turn is a single change, in a character or in the
 * setting, that the ending cannot do without; and the cover test (hide the
 * change, re-read the ending) is how you find it (CCSS RL.8.2). Four traps
 * this plan is built to kill: pointing at the loudest EVENT instead of at a
 * CHANGE; pointing at the ending, where the theme pays off, instead of at
 * the change that produced it; pointing at the opening situation, which is
 * the before and not a change from anything; and crediting a setting shift
 * that alters nothing anyone can do.
 *
 * SCOPE GUARD: Grade 8 row 2.1 analyzes how a theme develops over a short
 * excerpt by locating the moment a change in a character or in the setting
 * turns the theme — i.e., the theme's RELATIONSHIP to character, setting,
 * and plot, which is the phrase RL.8.2 adds to RL.7.2. Builds on
 * `m7ela-u2-theme-and-summary.ts` (RL.7.2: theme as a full sentence, not a
 * topic or a command; trace how the story develops it; objective summary),
 * read in full. G8 does NOT re-teach stating a theme or writing an objective
 * summary — both are G7's; G8 assumes a stated theme and asks which change
 * carries it. Stops short of HS `engl-u6-theme.ts` (RL.9-10.2: repeated
 * images and motifs across a whole text). DELIBERATELY EXCLUDED: stating a
 * theme, the topic-versus-theme and moral-as-command traps, and the
 * objective summary, all of which belong to `m7ela-u2-theme-and-summary.ts`
 * — every item in this file PRINTS its theme in the stem as a given, no
 * keyIdea teaches how to build one, and the words "topic", "moral" and
 * "summary" do not appear in any spoken field (the `topic` identity field is
 * the course key, not prose); motifs, repeated images and tracing a theme
 * across a whole work, which are HS `engl-u6-theme.ts`'s — every excerpt
 * here is one short passage, the words "motif", "symbol" and "image" do not
 * appear in the body, and no item asks about anything that repeats; the five
 * plot stages, the turning-point test and the four conflict types
 * (`m7ela-u1-plot-structure-and-conflict.ts`) and setting's three jobs
 * (`m7ela-u1-setting-and-story-elements.ts`), which are assumed and not
 * re-taught; how one incident provokes a character's decision and what the
 * decision reveals about the character (row 1.3) — a decision appears in
 * this file only as a candidate change weighed by the cover test, and no
 * line asks what a decision reveals about who a character is; how dialogue
 * propels action (row 1.2); dramatic irony (row 2.2), whose name appears
 * only in the followUps loId and in no spoken field; and the five figures of
 * speech and the tone/mood distinction (`m7ela-u2-figurative-language.ts`,
 * `m7ela-u2-tone-mood-and-word-choice.ts`) — the words "tone" and "mood" do
 * not appear in the body. DELIBERATELY ALLOWED, because the G7 rows and rows
 * 1.3 and 2.2 sit close: (a) the hook, one keyIdea and one recap line say in
 * a single clause that the student already knows how to state a theme as a
 * full sentence about life, or that the theme is handed to them — a reminder
 * of the G7 skill, never a re-teaching of it; (b) one keyIdea says that the
 * plot's turning point and the theme's turn are different things — a
 * one-line reuse of the G7 plot vocabulary, made precisely so the two are
 * not confused; (c) one keyIdea reminds the student, in one clause, that a
 * setting detail can be scenery — the G7 idea — and the file then uses
 * "scenery" as its own term for a setting change that turns nothing, in that
 * keyIdea, a vocabulary entry, the second worked example, one hint and the
 * recap; the G7 three-jobs lesson behind the word is reused, not re-taught;
 * (d) a character's decision (to say nothing about a report card; to sit at
 * the judging table) is a candidate change in two places, because a decision
 * is one of the commonest changes in a character, and the only question
 * asked of it is whether the ending can do without it.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file quotes from one of its
 * excerpts appears character-for-character in that excerpt; quote your own
 * excerpt exactly, never from memory.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative fiction, which is true by construction, so there is no factual
 * claim to verify. Rows whose passages are INFORMATIONAL (all of Units 3
 * and 4, and any other row needing nonfiction) must carry the four-column
 * claim ledger described in the fan-out contract instead of this line.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.4 -> 2.1 ->
 * 2.2 (`m8ela.comparing-the-structure-of-two-texts` -> this ->
 * `m8ela.dramatic-irony-suspense-and-humor`), wired below with the real
 * loIds from the brief. The prerequisite crosses the unit boundary, as the
 * contract's chain section says it should.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U2_HOW_A_THEME_DEVELOPS_THROUGH_CHARACTER_AND_SETTING: LessonPlan = {
  id: 'evelyn.ms.m8ela.how-a-theme-develops-through-character-and-setting.v1',
  title: 'How a Theme Develops Through Character & Setting',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.how-a-theme-develops-through-character-and-setting',
      standard: 'M8ELA-2.1',
      description:
        'Analyze how a theme develops over a short excerpt by locating the moment a change in a character or in the setting turns the theme — i.e., the theme\'s RELATIONSHIP to character, setting, and plot (CCSS RL.8.2).',
    },
  ],
  prerequisites: ['m8ela.comparing-the-structure-of-two-texts'],
  followUps: ['m8ela.dramatic-irony-suspense-and-humor'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that a theme has a WHEN as well as a what, and that the moment it turns is usually quieter than the loudest scene.',
      script:
        'Everyone in your grade has finished the same series. Your friend says the whole season was about one thing: once people start depending on you, you cannot go back to being the person you were before. You agree. That is the theme, and either of you could defend it. Then your cousin, who is two episodes behind, asks a question neither of you expected. When? When did it turn into a show about that? Your friend thinks for a second, and she does not name the finale, or the big fight, or the episode everyone posted about. She names a quiet one: the episode where the family moves into the two rooms above the shop, and the main character stops closing her bedroom door, because there is no longer a door to close. After that episode, every scene means something it did not mean before. You already know how to state a theme as a full sentence about life. Today you are handed the sentence and asked the harder question, the one your cousin asked: point to the moment the theme turned, and say whether the thing that changed was a person or a place.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-before-turn-after',
      kind: 'concept',
      goal: 'Install the before-turn-after shape of a developing theme, the two kinds of change a turn can be, the change-versus-event distinction, and the cover test that locates the turn.',
      keyIdeas: [
        'A THEME DEVELOPS, WHICH MEANS IT ARRIVES IN STAGES. On the first line, a theme is only one of several things the story could turn out to mean. By the last line, it is the one thing the story has claimed. So every developed theme has a BEFORE, a TURN and an AFTER. The before is the situation the excerpt opens on, where the story could still go several ways. The after is the ending, where the theme pays off and you can see it plainly. The turn is the single change in between that the after cannot do without. You are handed the theme today. Your job is to find the turn and name it.',
        'THE TURN IS A CHANGE IN A CHARACTER OR A CHANGE IN THE SETTING, AND YOU SAY WHICH. A change in a character means what someone wants, believes, knows or does is different afterward: a boy who forgot the back door every morning starts checking it three times a night. A change in the setting means where or when the story happens shifts, or the rules of the place shift: a lake freezes, a family moves into two rooms, a sign goes up over the one table where two friends talk. The plot is only the order the changes arrive in. Your answer is always one moment and one kind: "the moment the sign goes up, a change in the setting."',
        'A CHANGE IS NOT AN EVENT. An event is something that happens; a change is something that is different afterward. A storm is an event. "After the storm, Leo stops walking the long way home" is a change. The theme rides on the change, and the loudest event in an excerpt is the usual wrong answer, because it is easy to spot and often changes nothing about anyone. You already know the plot has a turning point; the theme\'s turn is a different thing, and it is often quieter. Ask of every event: what is different in a character or in the place because of this? If nothing is, it moved the plot and left the theme where it was.',
        'THE COVER TEST DECIDES IT. Cover the change you suspect and read the ending again. If the ending still makes the theme\'s point, that change was not the turn. If the ending now comes from nowhere, or makes a different point, you have found it. Try it: Ana walks the long way home for months to avoid a dog, the dog\'s owner moves away, and Ana keeps walking the long way. The theme is that a habit can outlive its reason. Cover the owner moving away and the ending means nothing, because there is no reason left for the habit to outlive. The move is the turn, a change in the setting. When changes come in a chain, the turn is the first one the ending cannot do without; everything after it is the theme playing out.',
        'A SETTING CHANGE COUNTS ONLY WHEN IT CHANGES WHAT A CHARACTER CAN DO OR SEE. You already know a setting detail can be scenery. A theme cannot ride on scenery. If the cafeteria gets new paint and everyone eats exactly the way they did before, the paint is not a turn, however carefully the writer describes it. If a no-talking rule goes up over the one table where two friends talk, the place has changed what they can do, and that is a turn. Sort every setting change by that question before you credit it with anything.',
        'THE ENDING IS WHERE THE THEME SHOWS, NOT WHERE IT TURNS, AND THE OPENING IS NOT A CHANGE. The ending is where the theme is easiest to see, which is exactly why it is the tempting wrong answer: it is the after, the payoff, not the change that produced it. The opening situation is the before, and a before is not a change from anything, so it cannot be the turn either. The turn sits between them. "The middle of the story" is not an answer; "the moment she puts the key ring in his hand, a change in a character" is.',
      ],
      vocabulary: [
        { term: 'develop', definition: 'of a theme: to arrive in stages across a story, from one of several things the story could mean to the one thing it claims.' },
        { term: 'the turn', definition: 'the single change, in a character or in the setting, after which the ending is settled and the theme is the one the story means.' },
        { term: 'before and after', definition: 'the situation an excerpt opens on, where several themes are still possible, and the ending, where the stated theme pays off. The turn sits between them.' },
        { term: 'the cover test', definition: 'hiding one change and re-reading the ending: if the ending still makes the theme\'s point, that change was not the turn.' },
        { term: 'scenery', definition: 'a detail of the setting that shifts without changing what any character can do or see; a theme cannot ride on it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-find-the-turn-in-a-character',
      kind: 'worked_example',
      problem:
        'The theme of this excerpt is: being trusted with something changes a person faster than being told to be responsible. Find the turn, say whether it is a change in a character or in the setting, and show that the ending cannot do without it.\n\n"Every morning for a year, Mrs. Okafor reminded Jonah to lock the bakery\'s back door before he left, and most mornings he forgot, and she went back and did it herself. One morning in February, without saying why, she stopped reminding him. She put the key ring in his hand and told him the back door was his now. That night a raccoon got into the dumpster and set off the alarm, and two police cars came. By March Jonah was locking the door, walking back from the bus stop to check it, and checking it again at ten with a flashlight. Nobody had reminded him of anything."',
      steps: [
        'Find the before. The excerpt opens on a year of reminders and forgetting: "most mornings he forgot, and she went back and did it herself." That is the situation the story starts from. A before is not a change, so it cannot be the turn; it is what the turn will change.',
        'Find the after. The last two sentences: "By March Jonah was locking the door, walking back from the bus stop to check it, and checking it again at ten with a flashlight. Nobody had reminded him of anything." This is where the theme pays off. A boy who could not be told has changed. The after is the proof, not the turn.',
        'List every change between them and name its kind. Mrs. Okafor "stopped reminding him" and "put the key ring in his hand and told him the back door was his now": a change in a character, in what she does. The raccoon, the alarm and the police cars: an event, a loud one, and the reason this excerpt is easy to misread.',
        'Run the cover test on the raccoon. Hide that sentence and read the ending again. Jonah has the key, the door is his, and by March he is checking it three times. The ending follows without a hitch, so the alarm changed nothing in anyone. It moved the night along and left the theme where it was.',
        'Run the cover test on the key ring. Hide "She put the key ring in his hand and told him the back door was his now" and the sentence before it, and read the ending. A boy who forgot for a year is suddenly checking a lock three times a night, and nothing left in the excerpt explains why. The ending comes from nowhere. That is the turn.',
        'Say the whole answer, moment and kind. The turn is the moment Mrs. Okafor stops reminding Jonah and puts the key ring in his hand, a change in a character: she goes from telling him to trusting him. Before it, the story could have been about a boy who never learns. After it, every check of the lock is the theme playing out.',
      ],
      answer:
        'The turn is the moment Mrs. Okafor stops reminding Jonah and puts the key ring in his hand, telling him the back door is his now: a change in a character, from telling him to trusting him. Cover it and the ending, a boy checking the lock three times a night with nobody reminding him, comes from nowhere; cover the raccoon and the alarm instead and the ending follows exactly as before.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-the-turn-in-the-setting',
      kind: 'worked_example',
      problem:
        'The theme of this excerpt is: some friendships depend on a place more than either friend realizes. Find the turn, name its kind, and say why the other changes are not it.\n\n"Priya and Marcus had eaten lunch at the corner table by the vending machines every day since sixth grade, trading halves of everything. In March the school hauled the vending machines away. A week later a sign went up at that end of the cafeteria: quiet study zone, no talking. They tried the zone for two days, whispering over their sandwiches. By April Priya was eating with the robotics kids and Marcus was eating outside, and neither of them could have said whose idea that was."',
      steps: [
        'Find the before. The corner table, every day since sixth grade, "trading halves of everything." The friendship looks unbreakable, and that is the point of a before: the story could still turn out to be about a friendship that survives anything.',
        'Find the after. "By April Priya was eating with the robotics kids and Marcus was eating outside, and neither of them could have said whose idea that was." The theme pays off in that last clause: the place did the work, and neither friend noticed. This is the payoff, not the turn.',
        'List the changes between them and name each kind. The vending machines hauled away: a change in the setting. The sign, "quiet study zone, no talking": a change in the setting, in the rules of the place. Two days of whispering: a change in the characters, in how they behave at their table.',
        'Run the cover test on the vending machines. Hide that sentence. The sign still goes up, the table still goes quiet, April still arrives. The ending follows. The machines leaving changed how the corner looked and nothing about what Priya and Marcus could do there. That is scenery: a setting change that turns nothing.',
        'Run the cover test on the sign. Hide it. The machines are gone, but the table is still theirs and they can still talk, and then, in April, they are at different tables for no reason the excerpt gives. The ending comes from nowhere. The sign is the turn, and it is a change in the setting: a rule of the place changed what two friends could do at their table.',
        'Check the whispering, because it is a change in the characters and the tempting answer for anyone who assumes the turn has to be a person. Hide it. The sign goes up and April arrives just the same. The whispering is the after beginning, the theme starting to play out, not the change that produced it.',
        'Say the whole answer: the turn is the moment the no-talking sign goes up over their end of the cafeteria, a change in the setting. Before it, the story could have been about a friendship that survives anything. After it, every lunch apart is the theme playing out.',
      ],
      answer:
        'The turn is the moment the sign goes up making their end of the cafeteria a quiet study zone with no talking: a change in the setting, because a rule of the place now changes what the two friends can do at their table. The vending machines leaving is scenery, since the ending follows just the same without it, and the two days of whispering are the after beginning, not the change that produced it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-turn-in-a-character',
      kind: 'try_yourself',
      problem:
        'The theme of this excerpt is: a win you know you did not earn stops feeling like a win. Which choice names the turn, the change the ending cannot do without, and its kind?\n\n"Lina\'s volcano project had taken first place at the science fair, and her table had been mobbed for an hour. That night, clearing her desk, she found the sticky note with the baking-soda ratio she had actually used, and it was not the ratio printed on her poster, the one the judges had praised. She put the ribbon in a drawer instead of on her wall. In the spring, when the fair came around again, she signed up to sit at the judging table instead of building anything."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The judges giving Lina\'s project first place and the crowd at her table for an hour, because that is the biggest thing that happens in the excerpt and the whole story is about that prize.' },
        { id: 'b', text: 'The spring science fair coming around again, a change in the setting that puts Lina back in the same room a year later, where the reader can finally compare who she was with who she is now.' },
        { id: 'c', text: 'Lina signing up to sit at the judging table instead of building anything, a change in a character, because that is the moment the reader sees for certain that the win has stopped feeling like one and everything before it was leading here.' },
        { id: 'd', text: 'Lina finding the sticky note and seeing that the ratio she actually used is not the one printed on her poster, a change in a character, in what she knows about her own win.', correct: true },
      ],
      expectedAnswer: 'Lina finding the sticky note and seeing that the ratio she actually used is not the one printed on her poster, a change in a character, in what she knows about her own win.',
      hints: [
        'Sort the excerpt into before, turn and after first. The opening situation is the before and the ending is the after, and neither of those is a change from anything, so neither can be the turn.',
        'Run the cover test on each candidate in the middle: hide it, then read the drawer and the judging table again, and ask whether they still make the theme\'s point or now come from nowhere. A change in the setting only counts if it changes what Lina can do or see.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-turn-in-the-setting',
      kind: 'try_yourself',
      problem:
        'The theme of this excerpt is: families get to know each other in the hours nobody planned to spend together. Which choice names the turn and its kind?\n\n"In Theo\'s house dinner was at six and everyone came, and for years Theo ate in ten minutes and went upstairs, and nobody minded. The January the furnace quit, the kitchen was the only warm room, so all four of them ended up there every night until bedtime, wrapped in blankets and doing homework at the table. One night the power went out too, and they finished a whole week of math by flashlight. By March Theo knew that his sister was failing algebra and that his dad hummed when he was worried, and he had stopped going upstairs after dinner, though the furnace had been fixed for weeks."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The kitchen becoming the only warm room in the house after the furnace quit, a change in the setting that keeps all four of them in one place every night for the first time.', correct: true },
        { id: 'b', text: 'The night the power went out and the family finished a week of math by flashlight, the most dramatic moment in the excerpt and the one where the four of them are closest.' },
        { id: 'c', text: 'Theo learning that his dad hums when he is worried, a change in a character, in what Theo knows about his father, that shows he has finally started paying attention.' },
        { id: 'd', text: 'Theo\'s years of eating in ten minutes and going upstairs while nobody minded, the pattern the whole excerpt is built to break and the reason the ending matters at all.' },
      ],
      expectedAnswer: 'The kitchen becoming the only warm room in the house after the furnace quit, a change in the setting that keeps all four of them in one place every night for the first time.',
      hints: [
        'Find the before and the after first, then list only the changes that sit between them, and name each one a change in a character, a change in the setting, or an event that changes nothing.',
        'Two of these are the before and the after, which are not changes from anything. Of the two left, hide each one and read the last sentence again: after which of them does Theo staying at the table still follow, and after which does it come from nowhere?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-turn-when-changes-chain',
      kind: 'try_yourself',
      problem:
        'The theme of this excerpt is: people keep a promise better for someone who asks about it than for the person they made it to. Which choice names the turn and its kind?\n\n"Before he moved into the care home, Ruth\'s grandfather had made her promise to keep his tomato garden going, and that first summer she watered it out of duty and skipped more days than she kept. In July the city repaved the alley behind the garden, and the smell of tar hung over the tomatoes for a week. That same week Mrs. Adeyemi, two doors down, who had not said a word to Ruth in years, started asking her every single afternoon how the tomatoes were doing. Ruth started going every day so she would have an answer. By August she was carrying Mrs. Adeyemi a bag of tomatoes every Friday, and she had not thought about her grandfather\'s promise in weeks."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The city repaving the alley behind the garden, a change in the setting that hangs the smell of tar over the tomatoes for a week and marks the exact week when everything about the garden shifts.' },
        { id: 'b', text: 'Mrs. Adeyemi, after years of silence, starting to ask Ruth every afternoon how the tomatoes are doing, a change in a character that gives Ruth a reason to go that her grandfather\'s promise never did.', correct: true },
        { id: 'c', text: 'Ruth carrying a bag of tomatoes to Mrs. Adeyemi every Friday by August, the moment the reader sees that the garden has stopped being her grandfather\'s and become something of her own.' },
        { id: 'd', text: 'Ruth\'s grandfather moving into the care home and making her promise to keep the garden going, the change that puts the promise in the story in the first place and sets everything else up.' },
      ],
      expectedAnswer: 'Mrs. Adeyemi, after years of silence, starting to ask Ruth every afternoon how the tomatoes are doing, a change in a character that gives Ruth a reason to go that her grandfather\'s promise never did.',
      hints: [
        'The opening promise is the before and the Friday bag of tomatoes is the after; neither is a change from anything. Sort the two changes in the middle by kind, then ask which one changes what Ruth can do or has reason to do.',
        'Hide the repaving and read the ending: does Ruth going every day still follow? Now hide the sentence about Mrs. Adeyemi asking and read it again. A setting change that alters nothing anyone does is scenery, however well it marks the week.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-loud-event-and-the-ending',
      kind: 'misconception_check',
      question:
        'A student is given this theme for a story: a secret gets heavier every day it is kept. In the story, Marisol finds her brother\'s failed report card in the recycling in September and decides not to mention it to anyone. In October the family car is wrecked in a parking lot, with nobody hurt, and the whole house talks about nothing else for a week. By December Marisol is skipping dinner to avoid her brother\'s eyes, and one night she tells her mother everything. One student writes: "The turn is the car being wrecked, because it is the biggest thing that happens and the house feels different after it." Another writes: "The turn is Marisol telling her mother, because that is where the theme finally shows." What went wrong each time?',
      commonErrors: [
        {
          answer: 'The turn is the car being wrecked, because it is the biggest thing that happens and the house feels different after it.',
          misconception:
            'Picking the loudest event in the story instead of a change in a character or in the setting. A wrecked car is dramatic, so it feels as if it must matter, but nothing about Marisol or her secret is different after it.',
          correctsTo:
            'Ask what is different in a character or in the place because of the crash. Marisol has the same secret before it and after it, and she keeps it exactly the same way. Now run the cover test: hide the crash and read December again. Marisol is still skipping dinner and still avoiding her brother\'s eyes, so the ending follows without the crash, and the crash was never the turn. It moved the plot for a week and left the theme where it was. The turn is the moment in September when Marisol decides not to mention the report card, a change in a character: she goes from having no secret to holding one, and every heavier day after that depends on it.',
        },
        {
          answer: 'The turn is Marisol telling her mother, because that is where the theme finally shows.',
          misconception:
            'Pointing at the ending, where the theme is easiest to see, instead of at the change that produced it. The payoff is the after; the turn is what makes the after happen.',
          correctsTo:
            'The student is right that the theme shows most plainly at the end, and that is exactly why the ending is the tempting wrong answer. Run the cover test: hide the night she tells her mother and read what is left. Marisol is skipping dinner to avoid her brother\'s eyes, the secret is already heavy, and the theme still stands. So the telling is the after, the theme paid off, not the change that produced it. Walk back to the first change the ending cannot do without: the September decision to say nothing, a change in a character. Hide that one, and a girl with nothing to hide is skipping dinner for no reason the story gives.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A theme develops in stages: a BEFORE where the story could still mean several things, a TURN, and an AFTER where the theme pays off. You are handed the theme; you find the turn.',
        'The turn is a single change, in a character (what someone wants, believes, knows or does) or in the setting (where, when, or the rules of the place), and your answer names the moment and its kind.',
        'A change is not an event. The loudest thing that happens is the usual wrong answer; ask what is different in a character or in the place because of it, and if nothing is, it moved the plot and not the theme.',
        'The cover test: hide the change you suspect and re-read the ending. If the ending still makes the theme\'s point, keep looking. If it now comes from nowhere or makes a different point, you have found the turn.',
        'A setting change counts only when it changes what a character can do or see. A setting that shifts and changes nothing is scenery, and a theme cannot ride on scenery.',
        'The ending is where the theme shows, not where it turns, and the opening situation is a before, not a change. The turn sits between them; when changes come in a chain, it is the first one the ending cannot do without.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'How a Theme Develops Through Character & Setting' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
