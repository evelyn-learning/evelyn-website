/**
 * Grade 7 ELA — Reading Informational Text: Tracing an Argument.
 *
 * The READING side of argument (CCSS RI.7.8): given somebody else's
 * argument, map it and judge it. Find the claim, follow the reasons, then
 * test whether each piece of evidence actually backs the reason it sits
 * under. Two evaluation moves a twelve-year-old can really run — evidence
 * that is true but about something else, and evidence that is too small to
 * carry the claim — plus the four traps that break these questions: more
 * evidence is not automatically stronger, a true fact is not automatically
 * relevant, a strong feeling is not evidence, and the claim is not always
 * the first sentence.
 *
 * NOTE FOR FUTURE AUTHORS: every argument printed in this file is original
 * prose written for the item, set at school and neighborhood scale and kept
 * away from live political controversy. No passage machinery, no passageId,
 * and no invented statistics — the weak evidence here is weak in ways a
 * reader can see without any numbers.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U4_TRACING_AN_ARGUMENT: LessonPlan = {
  id: 'evelyn.ms.m7ela.tracing-an-argument.v1',
  title: 'Tracing an Argument',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.tracing-an-argument',
      standard: 'M7ELA-4.3',
      description:
        'Trace the argument in a text by naming the claim and the reasons that hold it up, then evaluate whether each piece of evidence is relevant to the reason it supports and whether there is enough of it, recognizing evidence that is true but off the point and evidence that is too small to carry the claim (CCSS RI.7.8).',
    },
  ],
  prerequisites: ['m7ela.authors-purpose-and-perspective'],
  followUps: ['m7ela.comparing-two-texts'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that judging an argument somebody else made is a thing the student already does, then name the moves.',
      script:
        'Your friend wants the group to spend the whole Saturday at the skate park. In the group chat they type three messages fast. The park is free. The weather is going to be perfect. Their cousin went last week and had the best day ever. You read all three and something in you says, hold on, that last one is not really a reason for us. That feeling is a skill, and it has a name. Today we take an argument somebody else made and pull it apart the way you just did. We find what they want you to believe, we line up the reasons they give, and then we check whether the proof under each reason is actually about that reason. You are not writing an argument today. You are grading one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tracing',
      kind: 'concept',
      goal: 'Name claim, reasons and evidence as three layers, then teach the relevance test and the size test.',
      keyIdeas: [
        'AN ARGUMENT HAS THREE LAYERS — the CLAIM on top, the REASONS holding it up, and the EVIDENCE holding up each reason. Tracing an argument means walking down those layers in order and saying out loud what is on each one. Do not try to judge anything until the map is finished. You cannot tell whether a piece of proof is doing its job until you know which reason it is supposed to be helping.',
        'THE CLAIM IS WHAT THE WRITER WANTS YOU TO AGREE TO, AND IT IS OFTEN NOT THE FIRST SENTENCE. Writers warm up. They open with a fact, a story or a question, and the claim shows up in sentence two or three, or at the very end. To find it, ask which sentence somebody could argue back at. A checkable fact like "lunch is twenty-five minutes long" is not a claim, because nobody can disagree with it. "Lunch should be forty minutes" is a claim, because somebody could say no.',
        'REASONS ARE THE BECAUSE SENTENCES. A reason answers "why should I agree with the claim?" Most short arguments have two or three. You can usually find them by putting the word because after the claim and seeing which sentences finish it. If a sentence does not finish that "because", it is either evidence sitting under a reason or it is not doing any work at all.',
        'EVIDENCE IS THE PROOF UNDER A REASON — facts, dates, examples, counts and things that people actually said or observed. A strong feeling is not evidence. "Everyone hates it" and "this is so unfair" tell you how the writer feels, and how somebody feels is the thing being argued about, not proof of it. Swap in a fact and the argument gets stronger; swap in a louder feeling and nothing has been added.',
        'TEST ONE, RELEVANCE — a fact only helps if it is about the reason it sits under. Being TRUE is not enough. If the reason is that the gym hallway has no drinking water, then "the fountains have been off since March" is relevant proof, and "the machine also sells pretzels" is a true sentence about a completely different subject. Read the reason, read the evidence, then ask: does this make that exact reason more likely to be true? If the honest answer is no, that sentence adds nothing, no matter how true it is.',
        'TEST TWO, SIZE — evidence has to be big enough to carry what the claim says. One person is proof about one person. If a writer says laptops would raise grades for the whole seventh grade and the proof is that one friend switched and did better, the evidence is far too small for the claim. It could have been the friend, or the teacher, or the week. Watch for claims about EVERYONE that rest on the story of a single somebody.',
      ],
      vocabulary: [
        { term: 'claim', definition: 'the statement the writer wants you to agree with or act on; something a reasonable person could argue back at.' },
        { term: 'reason', definition: 'a because statement that explains why the claim should be believed.' },
        { term: 'evidence', definition: 'the facts, examples or observations offered as proof under a reason.' },
        { term: 'relevant', definition: 'actually about the reason it is supposed to support, not merely about the same general topic.' },
        { term: 'trace an argument', definition: 'to follow a writer from the claim down through the reasons to the evidence, naming each part.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-map-the-argument',
      kind: 'worked_example',
      problem:
        'Trace this argument from a school newsletter. Name the claim, the reasons, and the evidence under each reason.\n\n"The first bell at Ridgeway rings at 7:20. Our school should move that bell to 8:15. Students would learn more in first period, and three of our first-period teachers have said that class is the quietest hour of their day. The change would also be easy to make, because the late buses already run a second route at 8:00."',
      steps: [
        'Find the claim first, and do not grab the first sentence out of habit. "The first bell at Ridgeway rings at 7:20" is a checkable fact. Nobody can disagree with it, so it cannot be the claim. It is background.',
        'Test the next sentence. "Our school should move that bell to 8:15" is something a person could argue back at, and it asks the reader to agree to an action. That is the claim.',
        'Now hunt for reasons by finishing the sentence "we should move the bell BECAUSE...". Two sentences finish it. Reason one: students would learn more in first period. Reason two: the change would be easy to make.',
        'Put the evidence under the reason it belongs to. Under reason one: three first-period teachers said that class is the quietest hour of their day. Under reason two: the late buses already run a second route at 8:00.',
        'Read the map back and check each piece is under the right reason. A quiet first period is proof that students are not awake and working, so it is about learning. A bus route that already exists at 8:00 is proof about how hard the change would be, not about learning. Each piece landed in the right place.',
        'Notice what tracing did NOT ask you to do. You did not decide whether you like the idea. Mapping comes first; judging comes second, and it goes much better once the map exists.',
      ],
      answer:
        'Claim: the school should move the first bell to 8:15. Reason one: students would learn more in first period, backed by three first-period teachers saying that class is the quietest hour of their day. Reason two: the change would be easy, backed by the late buses already running a second route at 8:00. The opening sentence is background, not part of the argument.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-judge-the-evidence',
      kind: 'worked_example',
      problem:
        'Trace this argument, then judge each piece of evidence.\n\n"The city should build a skate ramp in Fielder Park. Skaters in our neighborhood have nowhere safe to practice, and last spring two of them were knocked off the sidewalk by a delivery van. Fielder Park is named after a mayor who served the city for twelve years. My cousin skates in his driveway every single day, so a ramp would get every kid in the neighborhood outside more."',
      steps: [
        'Map it before you judge it. Claim: the city should build a skate ramp in Fielder Park. Reason one: skaters have nowhere safe to practice. Reason two: a ramp would get every kid in the neighborhood outside more.',
        'Line the evidence up under the reasons. Under reason one: two skaters were knocked off the sidewalk by a delivery van last spring. Under reason two: the cousin skates in his driveway every day. The sentence about the mayor is not under anything.',
        'Run the relevance test on the mayor sentence. It may well be true, and it is about Fielder Park, so it feels like it belongs. Ask the real question: does the park being named after a twelve-year mayor make it more likely that skaters have nowhere safe to practice? No. It does not touch either reason. True, on topic, and completely useless to the argument.',
        'Now judge the delivery van sentence. Does two skaters being knocked off a sidewalk make it more likely that there is nowhere safe to practice? Yes, directly. It is a real event about the exact danger the reason names, so it is relevant. It is not much on its own, but it is pointed at the right target.',
        'Run the size test on the cousin. The reason claims a ramp would get EVERY kid in the neighborhood outside more. The proof is ONE person who already skates every single day. One person is proof about one person, and this particular person is already outside, so he does not even show the ramp changing anything. The evidence is far too small for what it is asked to carry.',
        'Say the verdict in plain language: the strongest piece is the delivery van, the mayor sentence is irrelevant, and the cousin is one story stretched over a claim about everybody. WRONG way to sum this up: "there are three pieces of evidence, so the argument is strong." CORRECT way: only one of the three actually supports a reason, so this argument is thin.',
      ],
      answer:
        'The delivery van is relevant evidence for reason one. The sentence about the mayor is true but irrelevant, since it does not make either reason more likely. The cousin is one person offered as proof about every kid in the neighborhood, which is far too small, and he already skates daily, so he shows no change at all.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-claim',
      kind: 'try_yourself',
      problem:
        'Read this argument, then choose the sentence that states the claim, which is the thing the writer wants the reader to agree to do.\n\n"Our cafeteria lunch period is twenty-five minutes long. Twenty-five minutes is not enough time to eat, so the school should give students a forty-minute lunch. Two lunch aides have said the room does not clear until the bell is already ringing."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The school should give students a forty-minute lunch.', correct: true },
        { id: 'b', text: 'Our cafeteria lunch period is twenty-five minutes long.' },
        { id: 'c', text: 'Twenty-five minutes is not enough time to eat.' },
        { id: 'd', text: 'Two lunch aides have said the room does not clear until the bell is already ringing.' },
      ],
      expectedAnswer: 'The school should give students a forty-minute lunch.',
      hints: [
        'A claim is a sentence somebody could argue back at, and it asks you to believe something or do something. Check each option against that.',
        'One option is a checkable fact, one is a because sentence holding the claim up, and one is proof somebody offered. Only one asks the school to change something.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-irrelevant-evidence',
      kind: 'try_yourself',
      problem:
        'Read this argument. Its reason is that the machine is the only place left to get water near the gym. Which detail is true but does NOT help support that reason?\n\n"The school should keep the vending machine in the gym hallway. When the fountains by the gym are shut off after practice, the machine is the only place left to get water. Those fountains have been shut off since the pipe repair in March, the next working fountain is up two flights of stairs, and students line up at the machine after every practice. The machine also sells pretzels and granola bars."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The machine also sells pretzels and granola bars.', correct: true },
        { id: 'b', text: 'The fountains by the gym have been shut off since the pipe repair in March.' },
        { id: 'c', text: 'The next working fountain is up two flights of stairs.' },
        { id: 'd', text: 'Students line up at the machine after every practice.' },
      ],
      hints: [
        'Every one of these sentences is true. Being true is not the test. The test is whether it makes THIS reason more likely.',
        'Say the reason out loud, then each option. Three of them are about getting water near the gym. One of them is about snacks.',
      ],
      expectedAnswer: 'The machine also sells pretzels and granola bars.',
      estimatedMinutes: 2,
    },
    {
      id: 'try-evidence-too-small',
      kind: 'try_yourself',
      problem:
        'Read this argument, then choose the best description of what is wrong with its evidence.\n\n"The seventh grade should switch from paper notebooks to laptops. My friend Dev started using a laptop in April and his grades went up. Laptops would raise grades for the whole seventh grade."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One student is too small a sample to prove something about the whole seventh grade.', correct: true },
        { id: 'b', text: 'The evidence is off the point, because grades are a different subject from notebooks.' },
        { id: 'c', text: 'The evidence would be fine if the writer added how strongly he feels about laptops.' },
        { id: 'd', text: 'The evidence is weak only because there is one sentence of it, so any second sentence would fix it.' },
      ],
      expectedAnswer: 'One student is too small a sample to prove something about the whole seventh grade.',
      hints: [
        'Compare the size of the claim with the size of the proof. The claim is about a whole grade. How many people is the proof about?',
        'Dev getting better grades really is about grades, so this is not a relevance problem. Ask instead whether one person can stand in for everybody.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-more-and-true',
      kind: 'misconception_check',
      question:
        'A student defends an argument: "It has five pieces of evidence and every single one is a true fact, so it must be a strong argument." What went wrong?',
      commonErrors: [
        {
          answer: 'More evidence automatically makes an argument stronger.',
          misconception:
            'Counting pieces of evidence instead of testing them, so a pile of sentences gets mistaken for support.',
          correctsTo:
            'Evidence is weighed, not counted. Irrelevant evidence adds nothing at all, so five pieces where three are off the point are worth less than the two that land. Take each piece separately, put it next to the reason it sits under, and ask whether it makes that reason more likely. Two pieces that pass that test beat five that do not, and adding a sixth off-point sentence makes the argument longer without making it stronger.',
        },
        {
          answer: 'The fact is true, so it supports the claim.',
          misconception:
            'Treating truth as the only test for evidence and skipping relevance, which lets any true sentence about the general topic look like proof.',
          correctsTo:
            'Evidence has to pass two tests, not one. It has to be TRUE, and it has to be RELEVANT to the reason it is placed under. "Fielder Park is named after a mayor who served twelve years" can be perfectly true and still do nothing for a claim about skaters having nowhere safe to practice, because it does not make that reason any more likely. Read the reason, read the evidence, then ask whether the second makes the first more likely to be true. If it does not, the sentence is decoration.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An argument has three layers: the claim on top, the reasons under it, and the evidence under each reason. Map all three before you judge any of it.',
        'The claim is not always the first sentence. Find it by asking which sentence somebody could argue back at.',
        'A strong feeling is not evidence. How the writer feels is the thing being argued about, not proof of it.',
        'The relevance test: a true fact only helps if it makes THIS reason more likely. True but off the point adds nothing.',
        'The size test: one person is proof about one person. Watch for a claim about everybody resting on a single story.',
        'Evidence gets weighed, not counted. Five off-point pieces are weaker than two that land.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Tracing an Argument' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
