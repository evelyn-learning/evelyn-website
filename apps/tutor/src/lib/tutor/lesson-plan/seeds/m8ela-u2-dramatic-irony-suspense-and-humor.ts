/**
 * Grade 8 ELA — Theme, Dramatic Irony & Allusion: Dramatic Irony, Suspense
 * & Humor.
 *
 * CONCEPT-LED exemplar for the m8ela fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one way of reading: a
 * DRAMATIC IRONY is a gap between what the reader knows and what a character
 * knows, the gap is only the mechanism, and the same gap turns into SUSPENSE
 * or HUMOR depending on one thing the writer controls — what it will cost
 * the character when the gap closes (CCSS RL.8.6). Three traps this plan is
 * built to kill: calling a scene dramatic irony when the reader is as much in
 * the dark as the character (that is a surprise or a mystery); naming the
 * effect from the character's feelings instead of from the reader's
 * position (a cheerful character can be walking into a trap); and treating
 * a gap as automatically funny or automatically tense without asking what
 * is at stake.
 *
 * SCOPE GUARD: Grade 8 row 2.2 analyzes how a difference between what the
 * reader knows and what a character knows (dramatic irony) creates suspense
 * or humor in a short excerpt, and names which of the two effects it creates
 * and why. Builds on `m7ela-u2-point-of-view.ts` (RL.7.6: whose thoughts the
 * narration reports; contrast two characters' points of view; "always ask
 * what the narrator hides"), which contrasts characters against each other
 * but never contrasts a character against the READER. The word "irony" does
 * not appear in any `m7ela-*` seed (grep, verified). Stops short of HS
 * `engl-u6-narrative-point-of-view.ts` (RL.9-10.6: the unreliable narrator).
 * Verbal irony is row 7.3, not here. DELIBERATELY EXCLUDED: the four
 * narration labels (first person, second person, third person limited,
 * third person omniscient) are `m7ela-u2-point-of-view.ts`'s and are neither
 * listed nor re-taught — none of the four labels appears anywhere in this
 * file's body; the unreliable narrator is HS `engl-u6-narrative-point-of-
 * view.ts`'s, so every fact the narration hands the reader in this file is
 * true inside its own story and no sentence here invites the student to
 * doubt the narration itself; foreshadowing as a named device is HS
 * `engl-u6-plot-and-conflict.ts`'s and the word does not appear in this
 * file's body (below this comment); the literary terms "tone" and "mood"
 * are `m7ela-u2-tone-mood-and-word-choice.ts`'s and neither word appears
 * in the body (the lesson says "how the character feels" instead,
 * precisely so the G7 term for the READER's feeling is not muddied); theme
 * is row 2.1 and the word is not in the body; how a line of dialogue
 * propels the action is row 1.2. DELIBERATELY ALLOWED, because the G7 row
 * and rows 1.2 and 7.3 sit close: (a) one
 * keyIdea reminds the student, in a single sentence, to ask whose thoughts
 * the narration reports — that is the G7 tool reused to find the line that
 * opens the gap, not a re-teaching of it; (b) verbal irony is named exactly
 * once in the body, only to say it is a different lesson later in this
 * course, as the fan-out contract's sideways rule for rows 2.2 and 7.3
 * permits; (c) the words "surprise" and "mystery" are used to name what
 * dramatic irony is NOT (a scene where the reader is as much in the dark as
 * the character), and "surprise" also appears in the everyday sense of a
 * surprise party and of a character being surprised — nowhere is either
 * taught as a device; (d) every excerpt in this file carries a character's spoken or reported
 * line, because a confident sentence is the natural place a gap shows
 * itself — this file reads those lines only for what the speaker does not
 * know, never for how the dialogue moves the plot.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it, and no published work may be quoted or closely paraphrased.
 * Every phrase this file quotes from one of its excerpts appears character-
 * for-character in that excerpt; quote your own excerpt exactly, never from
 * memory.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative fiction, which is true by construction, so there is no factual
 * claim to verify. Rows whose passages are INFORMATIONAL (all of Units 3 and
 * 4, and any other row needing nonfiction) must carry the four-column claim
 * ledger described in the fan-out contract, with every row marked
 * REAL-WORLD or STIPULATED, instead of this line.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.1 -> 2.2 ->
 * 2.3 (prerequisite `m8ela.how-a-theme-develops-through-character-and-
 * setting`, followUp `m8ela.allusions-and-analogies-in-literature`). Both
 * arrays are EMPTY here only because this exemplar is registered before its
 * neighbors exist and the lint rejects a chain reference that does not
 * resolve; the controller wires the real loIds at batch registration.
 * Fan-out rows must NOT copy the empty arrays — see the contract.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U2_DRAMATIC_IRONY_SUSPENSE_AND_HUMOR: LessonPlan = {
  id: 'evelyn.ms.m8ela.dramatic-irony-suspense-and-humor.v1',
  title: 'Dramatic Irony, Suspense & Humor',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.dramatic-irony-suspense-and-humor',
      standard: 'M8ELA-2.2',
      description:
        'Analyze how a difference between what the reader knows and what a character knows (dramatic irony) creates suspense or humor in a short excerpt, and name which of the two effects it creates and why (CCSS RL.8.6).',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that knowing more than a character is one trick that produces two opposite feelings, and that the difference is worth naming.',
      script:
        'Everyone in your grade is watching the same series. Last episode, you watched Maya\'s best friend delete the one video that would have cleared Maya\'s name. This episode, Maya walks into the cafeteria, hugs that friend and says, "You\'re the only one who\'s had my back through all of this." Half the room you are watching with shouts at the screen. Nobody on the screen can hear you, and that is the point. Now picture a different show. A character lets himself into his apartment, sighs, and says he cannot wait for one quiet night alone, and you already know that fourteen people are crouched behind his couch with a cake. You do not shout this time. You grin. Same trick both times: you knew something the character did not. Today we learn to spot that trick on the page, and then to do the harder thing, which is to say which of two very different jobs it is doing to you, and why.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dramatic-irony-and-its-two-effects',
      kind: 'concept',
      goal: 'Define dramatic irony as a gap the page opens, separate the gap from its effect, and install the stakes test that tells suspense from humor.',
      keyIdeas: [
        'DRAMATIC IRONY IS A GAP BETWEEN WHAT YOU KNOW AND WHAT A CHARACTER KNOWS. The story hands the reader a fact, and then a character speaks or acts without it. "Sam told his sister the coast was clear. Their mother was standing in the hallway behind him." You have the mother; Sam does not, so his sentence means one thing to him and something else to you. Irony, in every form, is a gap between how things seem and how they are. Dramatic irony is the form where that gap sits between a character and the reader. Saying the opposite of what you mean, verbal irony, is a different lesson later in this course, and nothing here needs it.',
        'THE READER\'S KNOWLEDGE HAS TO COME FROM THE PAGE. Find the exact line that opens the gap. You already know to ask whose thoughts the narration reports; use that here, because the extra fact usually arrives when the narration steps away from the character, into another room, another head, or a moment the character missed. If you cannot point at the line, you do not know more than the character. You suspect more, and a hunch is not dramatic irony. Then find the second line, the one where the character shows they do not know: almost always something they say with total confidence.',
        'THE GAP IS NOT THE EFFECT. The same gap can make you dread the next page or laugh at it. Dramatic irony is the mechanism; suspense and humor are two different things the mechanism can do to a reader, and the writer chooses between them by controlling one thing: what it will cost the character when the gap closes, which is the moment they find out what you already knew.',
        'SUSPENSE: THE GAP CLOSES ON SOMETHING THE CHARACTER CANNOT AFFORD. The reader knows a real loss is waiting, an injury, a betrayal, getting caught, losing something that matters, and watches the character walk toward it. You want to warn them and you cannot, and every confident thing they say makes the wait worse. That helpless wait is suspense. The character does not need to feel afraid; usually they feel fine, and their feeling fine is exactly what you cannot stand.',
        'HUMOR: THE GAP CLOSES ON NOTHING WORSE THAN A RED FACE. When the worst a character can lose is a little dignity, their confidence stops being frightening and starts being funny. You are in on the joke and they are not, and the bigger and more certain their claim, the harder the line lands. The cake behind the couch, the phone that is only face-down, the secret announced to a room that already knows it. Nobody is going to get hurt, so you lean back and enjoy being ahead.',
        'NAME THE EFFECT FROM THE READER\'S POSITION, NEVER FROM HOW THE CHARACTER FEELS. Two questions settle it: what will this cost when the character finds out, and what does the writer make you want to do, warn them or watch them? A worried character in a harmless gap is still humor. A cheerful character walking toward a real loss is still suspense; the cheerfulness sharpens it. And if the reader is as much in the dark as the character, there is no gap at all. That is a surprise or a mystery, which is a different tool, and it is not dramatic irony.',
      ],
      vocabulary: [
        { term: 'dramatic irony', definition: 'a gap between what the reader knows and what a character knows, opened by a fact the story gives the reader and not the character.' },
        { term: 'the gap closes', definition: 'the moment the character finds out what the reader already knew. What that moment costs the character decides the effect.' },
        { term: 'stakes', definition: 'what the character stands to lose when the gap closes; the one thing that turns the same gap toward suspense or toward humor.' },
        { term: 'suspense', definition: 'the reader\'s helpless wait for a moment they know is coming and the character does not, when that moment will cost the character something real.' },
        { term: 'humor', definition: 'in this lesson, the effect of watching a character speak or act with confidence about something the reader knows is false, when nothing worth dreading is at stake.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-gap-and-the-effect',
      kind: 'worked_example',
      problem:
        'Name the gap, say which line opens it, and name the effect it creates.\n\n"By three o\'clock the ice along the far shore had gone gray and soft in the sun, and a crack ran under the snow where nobody had walked yet. Theo, who had checked the forecast twice that morning, laced his skates on the near shore. \'Solid as a parking lot,\' he told his little brother, and pushed off toward the middle."',
      steps: [
        'Find what the reader knows and the line that delivers it. The first sentence puts you on the far shore before Theo gets anywhere near it: the ice "had gone gray and soft in the sun," and "a crack ran under the snow where nobody had walked yet." Theo is on the near shore, and the crack is under snow "where nobody had walked yet" and so he has not seen it and cannot have. The narration went where he did not. That is the line that opens the gap.',
        'Find what Theo knows, and the line where he shows he does not know the rest. He "had checked the forecast twice that morning," so his confidence is not stupidity; it is built on real but incomplete information. Then he says it out loud, "Solid as a parking lot," and to Theo that is a fact. To you it is the exact opposite of what the first sentence told you.',
        'Confirm it is dramatic irony and not a hunch. Can you point at the words that make you know more than Theo? Yes: gray, soft, crack. You are not guessing that the ice might be bad. The story told you it is.',
        'Now ask what the gap will cost when it closes. Theo finds out about that crack by reaching it, in the middle of a lake, in front of his little brother. That is a real injury or worse. Nothing about this is a red face.',
        'Ask what the writer makes you want to do. You want to shout at him to stop, and you cannot, because you are a reader. So you wait, and "pushed off toward the middle" is where the wait begins. That helpless wait is suspense, and his confidence sharpens it rather than lightening it, because every calm word takes him another stride out.',
        'Say the whole answer, not just the label. Dramatic irony: the reader knows the far ice is soft and cracked, and Theo does not. Effect: suspense, because the gap closes on real danger and the reader can only watch him skate toward it.',
      ],
      answer:
        'Dramatic irony: the first sentence tells the reader that the far ice "had gone gray and soft in the sun" with a crack under the snow, while Theo, who knows only the forecast, calls it "Solid as a parking lot," and the effect is suspense, because the gap closes on real danger in the middle of the lake and the reader can only wait for him to reach it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-gap-two-effects',
      kind: 'worked_example',
      problem:
        'Here is one gap written two ways. Name the effect each version creates, and say exactly what changed.\n\nVERSION A: "Marisol let herself in, dropped her bag by the door, and announced to the empty house that she was finally, gloriously alone. In the pantry, eleven of her friends held their breath, and a balloon squeaked against the door."\n\nVERSION B: "Marisol let herself in, dropped her bag by the door, and told her best friend on the phone that the crack in Dev\'s guitar had been there for months and that she had never once touched it. In the pantry, Dev ran his thumb along the crack that had not been there that morning, and waited for her to finish."',
      steps: [
        'Both versions open the same gap the same way. The narration leaves Marisol and goes into the pantry, and it takes you with it. In both, you know someone is in there and she does not. So dramatic irony is present in both, and it is the same size. Whatever differs between the two effects, it cannot be the gap.',
        'Find the line in each where she shows what she does not know. Version A: she "announced to the empty house that she was finally, gloriously alone." Version B: she "told her best friend on the phone that the crack in Dev\'s guitar had been there for months and that she had never once touched it." Both lines are confident. Both are wrong in a way only you can hear.',
        'Version A: ask what it costs her when the gap closes. Eleven friends and a balloon. She will jump, she will go red, and then she will have a party. The worst outcome is a second of embarrassment, so her big announcement about being "gloriously alone" is not frightening. It is the joke, and the balloon that "squeaked against the door" is the writer nudging you to enjoy it. Effect: humor.',
        'Version B: ask the same question. When she finishes, Dev walks out of the pantry, and he has heard the whole lie. You know it is a lie because the narration told you it was a crack "that had not been there that morning" and she is claiming it has been there for months. What closes on her is being caught, and a brother who will not trust her for a while. That is a real cost, and "waited for her to finish" tells you he is letting her dig deeper. You want her to stop talking. Effect: suspense.',
        'Now name what changed, precisely. Not the gap, not the setting, not the pantry, not even how sure Marisol sounds. What changed is the stakes: what the moment of finding out will cost her. Low stakes turned the gap into a joke on her; real stakes turned the same gap into a wait you dread.',
        'Last check: how she feels did not decide it. She is cheerful in both versions. A cheerful character can be walking into a party or into a trap, and only the reader\'s position, knowing what waits in the pantry and what it will cost, tells you which effect you are feeling.',
      ],
      answer:
        'Version A creates humor and Version B creates suspense. The gap is identical: the reader is in the pantry and Marisol is not. What changed is the stakes when the gap closes. A surprise party costs her nothing but a red face, while a brother running his thumb along the crack she just lied about costs her being caught in a lie.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-the-effect-humor',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the statement that best explains what the dramatic irony does to the reader, and why.\n\n"Grandpa Lou spent twenty minutes at dinner explaining, a little louder each time, that the new phone was broken, because nothing happened no matter where he tapped it. The phone lay face-down on the tablecloth the whole time. His granddaughter had turned it over for him twice already that week, and nobody at the table had the heart to reach for it a third time."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Humor: the reader can see that the phone is only face-down, so every confident word Grandpa Lou says about it being broken lands as a joke he is not in on, and the worst waiting for him when he finds out is a red face at his own table.', correct: true },
        { id: 'b', text: 'It is not dramatic irony at all, because his granddaughter and everyone else at the table can see the phone as plainly as the reader can, so the reader does not know a single thing that the characters in the scene do not already know.' },
        { id: 'c', text: 'Suspense: Grandpa Lou is getting louder and more worked up with every minute, and a character whose frustration keeps rising is exactly what makes a reader tense, whatever the reader happens to know about the phone on the table.' },
        { id: 'd', text: 'Suspense: the reader cannot tell what is wrong with the phone any more than Grandpa Lou can, so the reader waits alongside him through the whole dinner, wondering whether it is really broken or whether someone will find the problem.' },
      ],
      expectedAnswer: 'Humor: the reader can see that the phone is only face-down, so every confident word Grandpa Lou says about it being broken lands as a joke he is not in on, and the worst waiting for him when he finds out is a red face at his own table.',
      hints: [
        'Start with the two questions from the lesson: what does the reader know that Grandpa Lou does not, and which sentence told you? Only then decide what it will cost him when he finds out.',
        'The story says plainly that the phone "lay face-down on the tablecloth the whole time" and so the reader is not in the dark, and dramatic irony needs only one character in the dark, not all of them. Now weigh the cost of the gap closing: is anything waiting for him worse than a moment of embarrassment?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-effect-suspense',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the statement that correctly names the effect of the dramatic irony and explains why.\n\n"Ben left a note for his sister on the fridge: back by nine, taking the trail past the quarry. The trail past the quarry had been closed since Tuesday, when three days of rain had taken out the footbridge, and the sign saying so had blown into the ditch. Ben shouldered his pack, told the dog he would be fine, and set off whistling."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Humor: a boy solemnly reassuring a dog that he will be fine is a silly image, and the reader gets to enjoy how sure of himself Ben sounds as he sets off whistling, since a character this cheerful is being set up for a laugh rather than for anything worse.' },
        { id: 'b', text: 'Suspense: the reader knows the footbridge is gone and Ben does not, so his cheerful "back by nine" and his whistling point at a real danger he is walking toward, and the reader can do nothing but wait for him to reach it.', correct: true },
        { id: 'c', text: 'Suspense: the reader has no more idea than Ben does what shape the trail is in after three days of rain, and not knowing whether a character will make it across is exactly what keeps a reader turning pages until the end.' },
        { id: 'd', text: 'It is not dramatic irony, because Ben wrote down exactly where he was going and exactly when he would be back, so the reader learns nothing about his plan for the afternoon that Ben does not already know himself.' },
      ],
      expectedAnswer: 'Suspense: the reader knows the footbridge is gone and Ben does not, so his cheerful "back by nine" and his whistling point at a real danger he is walking toward, and the reader can do nothing but wait for him to reach it.',
      hints: [
        'Find the sentence that tells the reader something Ben cannot know, then find the line where Ben shows he does not know it. Decide what the gap will cost him only after you have both lines.',
        'The footbridge is gone, the sign is in the ditch, and Ben "told the dog he would be fine" as he heads for the quarry. Weigh what closes on him when he reaches the bridge: a red face, or something a reader would want to shout a warning about? And notice that how cheerful Ben feels is not the question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-turn-humor-into-suspense',
      kind: 'try_yourself',
      problem:
        'This excerpt uses dramatic irony for humor.\n\n"Lena stood at the microphone and told the entire seventh grade that the fire drill schedule was a secret, and that not one student would find it out before the alarm went off. Behind her, someone had taped the schedule for the whole month to the wall in letters big enough to read from the back row."\n\nWhich sentence, added to the end, would change the effect of the dramatic irony from humor to suspense?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Lena, who had dreaded this announcement all week, felt her voice shake on the last word and gripped both sides of the podium until the feeling passed.' },
        { id: 'b', text: 'A boy in the back row raised his hand, pointed at the wall behind her, and asked whether the secret was the one taped up in giant letters over her shoulder.' },
        { id: 'c', text: 'In the doorway stood the principal, who had told Lena that morning that if the schedule got out one more time she would lose her seat on the student council.', correct: true },
        { id: 'd', text: 'Lena added that the drills always happened at the exact same time on the exact same day, which was true, and which was also printed on the wall behind her.' },
      ],
      expectedAnswer: 'In the doorway stood the principal, who had told Lena that morning that if the schedule got out one more time she would lose her seat on the student council.',
      hints: [
        'The gap itself does not decide the effect. Ask what would have to change so that the moment Lena finds out costs her something real instead of a red face.',
        'Cross out the sentence that ends the gap by telling Lena the truth, and cross out the one that only changes how Lena feels without changing what she stands to lose. Of the two left, one adds a second joke and one raises the stakes while she is still in the dark.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-surprise-and-character-feeling',
      kind: 'misconception_check',
      question:
        'Two students read the same scene. Ava waits at the bus stop, checks her phone every thirty seconds and tells herself that Jun is always late; three sentences earlier, the narration told the reader that Jun\'s family drove away at dawn behind a moving truck without saying goodbye to anyone. One student writes, "This is not dramatic irony, because nothing surprised me. I already knew about the truck." The other writes, "It is dramatic irony, and the effect is humor, because Ava keeps checking her phone and insisting Jun is always late." What went wrong each time?',
      commonErrors: [
        {
          answer: 'This is not dramatic irony, because nothing surprised me. I already knew about the truck.',
          misconception:
            'Treating dramatic irony as a twist that has to catch the reader off guard. The student was not surprised, so the student concluded the device was missing, when the lack of surprise is the device.',
          correctsTo:
            'Dramatic irony works only because the reader is not surprised. The story told you about the truck three sentences earlier on purpose, so that every time Ava says Jun is always late you would hear it differently than she does. The surprise belongs to the character, and it is still coming. Run the test from the lesson: can you point at the line that gave you the fact? Yes, the moving truck at dawn. Can Ava? No. That is the gap, and that is dramatic irony. If you HAD been surprised along with Ava, there would have been no gap, and the scene would have been a mystery instead.',
        },
        {
          answer: 'It is dramatic irony, and the effect is humor, because Ava keeps checking her phone and insisting Jun is always late.',
          misconception:
            'Naming the effect from what the character is doing and how she feels, instead of from what the gap will cost her. Repetition and confidence look like the shape of a joke, so the student called it one without asking what is waiting for Ava.',
          correctsTo:
            'Ask what closes on Ava when the gap closes. Her friend left without a word, and every "Jun is always late" she tells herself is one more minute she has not found out. That is not a red face; that is a real loss, and the reader wants to tell her and cannot. That helpless wait is suspense, however brightly she checks her phone. The same repetition, if the story had told you Jun was hiding behind the bus shelter with a birthday cake, would have been humor. What the character feels never decides the effect. What the reader knows is waiting for her does.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dramatic irony is a gap: the reader knows a fact that a character does not. Point at the line that opened it. If you cannot, you have a hunch, not dramatic irony.',
        'The gap is the mechanism, not the effect. The same gap can build suspense or humor, and the writer chooses by setting what it will cost the character when the gap closes.',
        'A real cost waiting, danger, getting caught, a loss that matters, means suspense: you want to warn the character and cannot, and every confident word they say makes the wait worse.',
        'Nothing worse than a red face waiting means humor: you are in on the joke, and the more certain the character sounds, the harder the line lands.',
        'Name the effect from the reader\'s position, never from how the character feels. A cheerful character can be walking into a trap, and a nervous one can be walking into a party.',
        'If the reader is as much in the dark as the character, there is no gap and no dramatic irony. That is a surprise or a mystery, which is a different tool.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Dramatic Irony, Suspense & Humor' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
