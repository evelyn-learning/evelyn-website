/**
 * Grade 7 ELA — Argument Writing: Counterclaims & Rebuttal.
 *
 * Procedure-led row (CCSS W.7.1a). Two moves run the whole lesson: state the
 * strongest thing the other side would say, then answer it. The trap this
 * lesson exists to kill is the fake counterclaim — the writer's own claim
 * flipped into the negative ("Some people say we should NOT do it"), which
 * carries no reason of its own and therefore gives the rebuttal nothing to
 * answer. Three more traps ride along: believing that mentioning the other
 * side weakens you, calling a bare "that is wrong" a rebuttal, and thinking
 * that stating the counterclaim fairly means agreeing with it.
 *
 * NOTE FOR FUTURE AUTHORS: every subject here is school-sized or
 * neighborhood-sized on purpose. Do NOT swap in a live political debate to
 * make the argument feel weightier — a twelve-year-old cannot practice a
 * writing move and referee a real controversy at the same time. No invented
 * statistics either; every rebuttal below is won with reasoning, not numbers.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U8_COUNTERCLAIMS: LessonPlan = {
  id: 'evelyn.ms.m7ela.counterclaims.v1',
  title: 'Counterclaims & Rebuttal',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.counterclaims',
      standard: 'M7ELA-8.3',
      description:
        'Acknowledge a real opposing position by stating the strongest version of it fairly, distinguish a true counterclaim from the writer\'s own claim restated in the negative, and answer it with a rebuttal that either shows the counterclaim is wrong or concedes part of it and shows why the writer\'s reasons still outweigh it (CCSS W.7.1a).',
    },
  ],
  prerequisites: ['m7ela.evidence-and-elaboration'],
  followUps: ['m7ela.organizing-an-argument'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the two-move structure in an argument the student has already had at home.',
      script:
        'You want to stay up an hour later on Friday. You already know exactly what you are going to hear back: "You are wrecked on Saturday morning." So you have a choice. You can pretend nobody ever said that, walk in, and list all the reasons a later bedtime would be great. Or you can walk in and say it first: "I know you think I am wrecked on Saturday, and honestly last week I was. That is why I set my alarm for nine and did the dishes before you got up." The second one is much harder to argue with, because the best objection is already answered before it gets said out loud. Writers do the same thing on paper. Today you learn the two moves: name the strongest thing the other side would say, then answer it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-counterclaim-rebuttal',
      kind: 'concept',
      goal: 'Define counterclaim and rebuttal, kill the negative-restatement fake, and install the two legal rebuttal moves plus their signal phrases.',
      keyIdeas: [
        'A CLAIM IS WHAT YOU WANT THE READER TO BELIEVE. A COUNTERCLAIM IS THE STRONGEST THING SOMEONE WHO DISAGREES WOULD SAY BACK. Putting that objection in your own essay does not weaken you. It proves you looked at the other side and still think you are right. A reader who thinks of an objection you never mentioned assumes you either missed it or hid it, and that objection then sits in their head unanswered for the rest of the essay.',
        'A COUNTERCLAIM IS NOT YOUR OWN CLAIM WITH "NOT" DROPPED INTO IT. This is the most common way the move goes wrong. Claim: "Hillcrest should open the courtyard at lunch." WRONG counterclaim: "Some people say Hillcrest should not open the courtyard at lunch." That is your sentence turned inside out. It names no person and gives no reason, so there is nothing for you to answer. CORRECT counterclaim: "Some teachers say the courtyard has no shade, so students would sit in full sun for the whole lunch period." A real counterclaim is a position somebody actually holds, and it arrives with its own reason.',
        'A REBUTTAL IS YOUR ANSWER TO THAT COUNTERCLAIM. The two moves go in order and they belong together: state the counterclaim, then rebut it. A counterclaim with no rebuttal after it is a surrender, because the last thing the reader heard was the other side.',
        'THERE ARE TWO LEGAL REBUTTAL MOVES. Move one, SHOW IT IS WRONG: "Some teachers say the courtyard has no shade. However, the west wall throws shade over half the tables from noon onward, which is exactly when lunch runs." Move two, CONCEDE AND OUTWEIGH: agree that part of it is true, then show your reasons matter more. "It is true that the far tables sit in full sun. Even so, students may stay inside whenever they want, and the ones who go out get the only stretch of fresh air in their school day." Saying "that is wrong" and then stopping is neither move. A rebuttal has to ADD something the reader did not already have.',
        'SIGNAL PHRASES TELL THE READER WHOSE IDEA THEY ARE HEARING. Hand off to the other side with "Some people say", "Some students argue", "It is true that", "Critics point out". Turn back to your own side with "but", "however", "even so", "still". Without those words a reader cannot tell where the other side stops and you start, and your essay will sound like it changed its mind.',
        'STATE THE COUNTERCLAIM FAIRLY, WHICH MEANS STATING ITS STRONGEST VERSION. Fair does NOT mean you agree with it. It means you did not shrink it first so it would be easy to knock over. WRONG: "Some people just do not like the courtyard." Nobody argues that, so beating it proves nothing. CORRECT: "Some teachers say the courtyard has no shade, so students would sit in full sun." Beat the strong version and you have actually won something.',
      ],
      vocabulary: [
        { term: 'claim', definition: 'the position you are arguing for and want the reader to accept.' },
        { term: 'counterclaim', definition: 'the strongest opposing position, with its own reason, written out in your essay before you answer it.' },
        { term: 'rebuttal', definition: 'your answer to the counterclaim, which either shows it is wrong or concedes part of it and outweighs it.' },
        { term: 'concede', definition: 'to admit that part of the other side is true, on your way to showing why your reasons still matter more.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-the-pair',
      kind: 'worked_example',
      problem:
        'Build a fair counterclaim and a rebuttal for this claim: "Hillcrest Middle School should let students eat lunch in the courtyard on dry days."',
      steps: [
        'Ask who would say no, and why. Not "some people hate fresh air" — nobody argues that, and it is the shrunken version. The real worry belongs to the adults on lunch duty: one teacher can watch one room, and a courtyard is a second space that also needs watching.',
        'Write it in its strongest form, with a hand-off phrase so the reader knows it is not your view: "Some teachers say that opening the courtyard splits lunch across two spaces, and only one adult is on duty at a time."',
        'Now pick your rebuttal move. Could you show the counterclaim is simply wrong? No. It is true that one adult cannot stand in two places, and pretending otherwise would be dishonest. So the honest move is CONCEDE AND OUTWEIGH.',
        'Concede the true part out loud: "It is true that one teacher cannot watch the cafeteria and the courtyard at the same time."',
        'Turn back with a turn word and put something heavier on the scale: "Even so, the courtyard is fenced on three sides and visible through the cafeteria windows, and the eighth-grade helpers already run the recycling table every lunch. The same helpers could sign out the courtyard, which costs the school nothing and gives students the only outdoor time in their day."',
        'Read the pair back and check three things. Would a teacher recognize that objection as theirs? Yes. Is there a hand-off phrase and a turn word? Yes, "Some teachers say" and "Even so". Does the rebuttal add something new instead of repeating the claim? Yes, it adds the fence, the windows and the helpers.',
      ],
      answer:
        'Counterclaim: "Some teachers say that opening the courtyard splits lunch across two spaces, and only one adult is on duty at a time." Rebuttal (concede and outweigh): "It is true that one teacher cannot watch both spaces. Even so, the courtyard is fenced on three sides and visible through the cafeteria windows, and the eighth-grade helpers could sign it out the way they already run the recycling table."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-diagnose-fake-counterclaim',
      kind: 'worked_example',
      problem:
        'A student is arguing that the town should put a water fountain in Pearl Street Park. They write: "Some people say the town should not put a water fountain in Pearl Street Park. But that is wrong. The town should definitely put a water fountain in Pearl Street Park." Diagnose both errors and repair the paragraph.',
      steps: [
        'Find the counterclaim: "Some people say the town should not put a water fountain in Pearl Street Park." Compare it word for word with the claim. It is the same sentence with "not" dropped in. That is the fake counterclaim — no person behind it and no reason inside it.',
        'Test it the fast way. Ask: WHY would they say that? The sentence does not tell you. A real counterclaim always answers its own why, because a reason is the part you are going to argue with.',
        'Find the rebuttal: "But that is wrong. The town should definitely put a water fountain in Pearl Street Park." That is a denial plus the original claim said louder. Nothing new arrived. WRONG: "But that is wrong." A rebuttal has to give the reader a reason they did not already have.',
        'Repair step one — replace the fake counterclaim with the strongest real objection. Who actually pushes back on a new fountain? The people who maintain the park. "Some people on the parks committee say a fountain would freeze and crack in winter, and the town would be paying to fix it every spring."',
        'Repair step two — choose a move and write a real rebuttal. Here you can show the counterclaim is wrong, because there is a fact that answers it directly: "However, the fountains at Millbrook Field are the shut-off kind. The water is drained out of the pipe in November and turned back on in April, so there is nothing inside to freeze."',
        'Read the repaired version straight through: "Some people on the parks committee say a fountain would freeze and crack in winter, and the town would be paying to fix it every spring. However, the fountains at Millbrook Field are the shut-off kind, drained in November and turned back on in April, so there is nothing inside to freeze." The objection is real, and it has been answered.',
      ],
      answer:
        'Two errors. First, the counterclaim is only the writer\'s own claim flipped to the negative, so it carries no reason to argue with. Second, "that is wrong" plus the claim repeated is not a rebuttal, because it adds nothing. The repair gives the other side a real reason (winter freezing) and answers it with a real one (the shut-off fountains at Millbrook Field are drained each November).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-real-counterclaim',
      kind: 'try_yourself',
      problem:
        'A student is arguing this claim: "Students at Marlowe Middle School should be allowed to bring board games to play in the cafeteria after they finish eating." Which choice is a real counterclaim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some students say the school should not let anyone bring board games into the cafeteria.' },
        { id: 'b', text: 'Some staff members say that board games leave small pieces on the floor, and the cafeteria has to be cleared quickly for the next lunch period.', correct: true },
        { id: 'c', text: 'Some people say board games are boring and nobody at Marlowe would even play them.' },
        { id: 'd', text: 'Board games would help students get to know classmates who are not in any of their classes.' },
      ],
      expectedAnswer: 'Some staff members say that board games leave small pieces on the floor, and the cafeteria has to be cleared quickly for the next lunch period.',
      hints: [
        'Read each choice and ask two questions. Does somebody actually hold this position, and does the sentence tell you WHY they hold it?',
        'One choice is just the claim with "not" dropped in, one shrinks the other side to something silly, and one is a reason for the writer\'s OWN side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-real-rebuttal',
      kind: 'try_yourself',
      problem:
        'The essay has already stated this counterclaim: "It is true that board games leave small pieces on the cafeteria floor, and the room has to be cleared quickly for the next lunch period." Which choice is a real rebuttal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That argument is wrong, and students should definitely be allowed to bring board games to the cafeteria.' },
        { id: 'b', text: 'Anyone who does not want board games at lunch must not care whether students enjoy being at school.' },
        { id: 'c', text: 'However, the games could be checked out from a shelf by the door and counted back in before the bell, so a missing piece is found while the players are still standing there.', correct: true },
        { id: 'd', text: 'That is a fair point, and the cafeteria really does have to be cleared very quickly.' },
      ],
      expectedAnswer: 'However, the games could be checked out from a shelf by the door and counted back in before the bell, so a missing piece is found while the players are still standing there.',
      hints: [
        'A rebuttal has to ADD something: either a reason the objection is wrong, or a reason your side outweighs it. Which choice hands the reader something new?',
        'One choice denies the objection and then just repeats the claim, one attacks the people instead of the point, and one concedes and never turns back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fairest-counterclaim',
      kind: 'try_yourself',
      problem:
        'A student is arguing this claim: "The town should turn the empty lot on Pearl Street into a skate park." Which choice states the opposing view most FAIRLY, in its strongest version?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some neighbors say the lot sits directly under the windows of the senior apartments, so skateboard noise would carry inside all afternoon.', correct: true },
        { id: 'b', text: 'Some neighbors say the town should not turn the Pearl Street lot into a skate park.' },
        { id: 'c', text: 'Some neighbors just do not like skateboards very much.' },
        { id: 'd', text: 'Some neighbors say skateboarders are troublemakers who would ruin the whole street.' },
      ],
      expectedAnswer: 'Some neighbors say the lot sits directly under the windows of the senior apartments, so skateboard noise would carry inside all afternoon.',
      hints: [
        'The fairest version is the one a neighbor would agree they had said. Read each choice and ask whether anyone would volunteer to be described that way.',
        'One choice is the claim flipped to the negative with no reason at all, one shrinks the objection to a matter of taste, and one insults the skateboarders instead of naming a problem with the plan.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-restatement',
      kind: 'misconception_check',
      question:
        'A student is arguing that their school should add a class pet. For the counterclaim they write: "Some people say the school should not add a class pet." Is that a counterclaim?',
      commonErrors: [
        {
          answer: 'Yes, because it says the opposite of the claim.',
          misconception:
            'Treating a counterclaim as the writer\'s own claim flipped into the negative. The student sees "not" and thinks the job is done, because the sentence does point the other way.',
          correctsTo:
            'A counterclaim is a POSITION someone holds, not a direction the sentence points. This one names nobody and gives no reason, so ask it the test question: why would they say that? The sentence cannot tell you, which means your rebuttal has nothing to answer. Give it a person and a reason, and it becomes real: "Some parents say a class pet needs feeding over winter break, when the building is closed for two weeks." Now you can answer it, because there is something there to answer.',
        },
        {
          answer: 'No, and the safest fix is to cut the other side out of the essay completely.',
          misconception:
            'Believing that mentioning the other side hands the reader a reason to disagree, so silence is stronger.',
          correctsTo:
            'The objection is already in the reader\'s head. Staying quiet does not remove it, it just leaves it unanswered and makes you look like you either missed it or dodged it. Raising it yourself does two things nothing else can do: you get to choose the words the objection is stated in, and you get the last word on it. Fix the fake counterclaim instead of deleting it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two moves, in this order: state the strongest thing the other side would say, then answer it. A counterclaim with no rebuttal after it is a surrender.',
        'A counterclaim is not your claim with "not" dropped in. WRONG: "Some people say we should not open the courtyard." CORRECT: "Some teachers say the courtyard has no shade, so students would sit in full sun." A real one names a person and carries a reason.',
        'Two legal rebuttal moves: show the counterclaim is wrong, or concede that part of it is true and show why your reasons outweigh it. "That is wrong" with nothing after it is neither.',
        'Signal the hand-off and the turn: "Some people say ... but ...", "It is true that ... however ...". Without those words the reader cannot tell your view from theirs.',
        'Fair means strongest, not friendly. Stating the other side fairly is not agreeing with it — it is refusing to shrink it so it would be easy to knock over.',
        'Naming the objection makes you harder to argue with, not easier, because the best reason to disagree with you has already been answered.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Counterclaims & Rebuttal' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
