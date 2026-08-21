/**
 * Grade 7 Science (Life Science) — Classification: Using a Dichotomous Key.
 *
 * Procedure-led (NGSS MS-LS4-2). One procedure runs the whole lesson: start at
 * step 1, take the one statement of the pair that matches, go where it sends
 * you, repeat until a name appears. The back half turns the procedure around
 * and has the student WRITE a key, which is where the rule about two mutually
 * exclusive options that cover the whole set gets earned.
 *
 * The traps it is built to kill are (a) skipping ahead to the step that looks
 * right instead of following the path, (b) relative or opinion statements
 * ("large", "pretty") standing in for observable ones, and (c) trusting a key
 * on an organism it was never built for -- a key always hands back one of its
 * own names, even when the right answer is not among them.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every key in
 * this file is printed out in full inside the item, and every organism is
 * described in words. Never write "see the key above" or "look at the leaf".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U8_USING_DICHOTOMOUS_KEYS: LessonPlan = {
  id: 'evelyn.ms.m7sci.using-dichotomous-keys.v1',
  title: 'Using a Dichotomous Key',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.using-dichotomous-keys',
      standard: 'M7SCI-8.3',
      description:
        'Identify an unknown organism by following the paired either/or statements of a dichotomous key one step at a time, and write a simple key in which every step offers exactly two observable, mutually exclusive options that together cover the whole set of organisms (NGSS MS-LS4-2).',
    },
  ],
  prerequisites: ['m7sci.domains-and-kingdoms'],
  followUps: ['m7sci.cladograms-and-relatedness'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the key as the tool that answers "what is this thing" without needing a picture to match.',
      script:
        'You tip up a flowerpot on the porch and something small scurries out from under it. Eight legs. No wings. You want to know what it is. Scientists ran into that exact problem a long time ago, and they solved it with a tool that asks you a short series of two-way questions -- a bit like twenty questions, except every question has exactly two answers and you never have to guess. Six legs or eight legs? Wings or no wings? Each answer sends you somewhere new, and a few questions later a name pops out the end. It is called a dichotomous key. Today you are going to use one, and then build one of your own.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dichotomous-key',
      kind: 'concept',
      goal: 'Install what a key is, the step-by-step procedure, the rules for a good step, and the two limits of what a key can do.',
      keyIdeas: [
        'A DICHOTOMOUS KEY IDENTIFIES AN ORGANISM THROUGH A SERIES OF PAIRED CHOICES. The word dichotomous means divided in two, and that is the whole idea: at every step you are handed exactly two statements, and exactly one of them describes the organism in front of you. Choosing one closes off half of what is left. A few choices later, only one organism is still standing, and the key prints its name.',
        'THE PROCEDURE -- START AT STEP 1, EVERY SINGLE TIME. Read both statements of the pair. Pick the one that matches your organism. Look at where that statement sends you: it is either another step number or a name. If it is a step number, go there and do the same thing again. If it is a name, you are finished. That is the entire method, and it never changes.',
        'FOLLOW THE PATH -- YOU MAY NOT SKIP TO THE STEP THAT LOOKS RIGHT. Every step after the first is written for a smaller group, and it only makes sense after the earlier choices have been made. Step 4 might be written only for the animals that took the six-legs branch back at step 1. WRONG: read all the steps and pick whichever statement fits. CORRECT: start at step 1 and go only where each step sends you. Skipping puts you in a branch built for a different organism, and the name at the end will be that organism.',
        'A GOOD STEP USES OBSERVABLE, UNAMBIGUOUS FEATURES -- things you can count, or that are plainly present or absent. Number of legs. Wings present or absent. Leaf edge smooth or toothed. Body covered in fur or in scales. WRONG: large, small, pretty, fast, common. Those are relative words or opinions, and two students would sort the same organism into different branches. Large is usable only with a reference, such as longer than your hand.',
        'WRITING A KEY -- EACH STEP NEEDS EXACTLY TWO OPTIONS THAT ARE MUTUALLY EXCLUSIVE AND THAT COVER EVERYTHING. Mutually exclusive means no organism can match both statements. Covering everything means no organism in your set matches neither. A pair like smooth edge or toothed edge passes both tests. A pair like cone-shaped beak or brown feathers fails, because one bird could easily have both. Start with a feature that splits the group roughly in half, then keep splitting inside each branch.',
        'A KEY ONLY NAMES, AND ONLY WITHIN ITS OWN SET. It tells you what an organism is called. It does not tell you what it eats, where it lives, or how it is related to anything else -- that comes later, from a field guide, once you have a name to look up. And a key built for the trees on your campus will run a palm leaf through its steps just as happily and confidently hand you the name of a campus tree. The answer will be wrong. Always check what a key was built for before you trust the name it gives you.',
      ],
      vocabulary: [
        { term: 'dichotomous key', definition: 'an identification tool made of paired either/or statements; dichotomous means divided in two.' },
        { term: 'couplet', definition: 'one step of a key: the two paired statements labeled 1a and 1b, of which exactly one matches.' },
        { term: 'observable feature', definition: 'something you can see or count directly, such as six legs or a toothed leaf edge.' },
        { term: 'mutually exclusive', definition: 'describing two options that can never both be true of the same organism.' },
        { term: 'identify', definition: 'to work out the name of an unknown organism; naming is all a key does.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-the-key',
      kind: 'worked_example',
      problem:
        'Here is a key for four small animals that live under a flowerpot. 1a. The animal has six legs -- go to step 2. 1b. The animal has eight legs -- go to step 3. 2a. The animal has wings -- Honeybee. 2b. The animal has no wings -- Field ant. 3a. The body is rounded and there is no tail -- Garden spider. 3b. The body is long and ends in a curled tail -- Scorpion. You find an animal with eight legs, a rounded body, and no tail. Which animal is it?',
      steps: [
        'Start at step 1. Always start at step 1, even when you already have a hunch about the answer.',
        'Step 1 offers six legs or eight legs. Count the legs on your animal: there are eight. So 1b is the statement that matches, and 1b sends you to step 3.',
        'Do not stop at step 2 on the way past. Step 2 is written only for the six-legged animals that came out of 1a, so neither of its statements is about your animal at all. Wings or no wings is not a question this key is asking about eight-legged animals.',
        'Go to step 3, as instructed. It offers a rounded body with no tail, or a long body ending in a curled tail. Your animal has a rounded body and no tail, so 3a matches.',
        '3a gives a name rather than another step number, so the path ends there. The animal is a garden spider.',
        'Look back at the path: 1b, then 3a. Two choices, each one a plain look at the animal. And notice what the key did NOT tell you. It said nothing about what a garden spider eats or whether it is dangerous. A key hands you a name, and naming is the whole job.',
      ],
      answer:
        'Garden spider. The path is 1b (eight legs), which sends you to step 3, then 3a (rounded body, no tail), which gives the name.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-write-a-key',
      kind: 'worked_example',
      problem:
        'Write a dichotomous key for four leaves. Leaf W is a single blade with a smooth edge. Leaf X is a single blade with a toothed edge. Leaf Y is divided into several small leaflets and has a smooth edge. Leaf Z is divided into several small leaflets and has a toothed edge.',
      steps: [
        'Look for one feature that splits the four leaves into two even groups. Two leaves are single blades, W and X. Two are divided into small leaflets, Y and Z. That is a two-and-two split, and it is something anyone can see without measuring, so it makes a good step 1.',
        'Reject the tempting alternatives before you write anything. "The leaf is large" is no good, because large compared to what? Two students would sort the same leaf differently. "The leaf is pretty" is an opinion, not an observation. Keep to features that are counted, plainly present or absent, or clearly shaped.',
        'Write step 1 with exactly two options that no leaf can match at the same time and that no leaf misses. 1a. The leaf is a single blade -- go to step 2. 1b. The leaf is divided into several small leaflets -- go to step 3.',
        'Now split the pair inside the first branch. W and X are both single blades, so the blade question is used up and cannot separate them. Their edges can. 2a. The edge is smooth -- Leaf W. 2b. The edge is toothed -- Leaf X.',
        'Do the same inside the other branch. Y and Z are both divided into leaflets, and again the edge is what tells them apart. 3a. The edge is smooth -- Leaf Y. 3b. The edge is toothed -- Leaf Z.',
        'Test the finished key on every leaf before you trust it. Leaf W is a single blade, so 1a sends it to step 2; its edge is smooth, so 2a names it Leaf W. Leaf X is a single blade, so 1a sends it to step 2; its edge is toothed, so 2b names it Leaf X. Leaf Y is divided, so 1b sends it to step 3; smooth edge, so 3a names it Leaf Y. Leaf Z is divided, so 1b sends it to step 3; toothed edge, so 3b names it Leaf Z. All four land on their own names, so the key works. A key you have not run every organism through is a key you do not yet know is correct.',
      ],
      answer:
        '1a. The leaf is a single blade -- go to step 2. 1b. The leaf is divided into several small leaflets -- go to step 3. 2a. The edge is smooth -- Leaf W. 2b. The edge is toothed -- Leaf X. 3a. The edge is smooth -- Leaf Y. 3b. The edge is toothed -- Leaf Z.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-follow-the-path',
      kind: 'try_yourself',
      problem:
        'Use this key. 1a. The animal has six legs -- go to step 2. 1b. The animal has more than six legs -- go to step 3. 2a. The animal has two pairs of wings -- Dragonfly. 2b. The animal has no wings -- Silverfish. 3a. The animal has eight legs -- Wolf spider. 3b. The animal has more than eight legs -- Centipede. The animal you found has eight legs, no wings, and a hairy brown body. What is it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Silverfish' },
        { id: 'b', text: 'Wolf spider', correct: true },
        { id: 'c', text: 'Centipede' },
        { id: 'd', text: 'The key cannot name this animal, because no step mentions a hairy brown body.' },
      ],
      expectedAnswer: 'Wolf spider',
      hints: [
        'Start at step 1 and count the legs. Step 1 does not ask about wings at all, so the no-wings statement further down is not your entry point.',
        'Eight is more than six, so 1b matches and sends you to step 3. Step 2 is written only for six-legged animals, so go straight past it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-good-key-step',
      kind: 'try_yourself',
      problem:
        'You are writing step 1 of a dichotomous key for four kinds of bird that visit the school feeder. Which pair of statements works best as step 1?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1a. The bird is large -- go to step 2. 1b. The bird is small -- go to step 3.' },
        {
          id: 'b',
          text: '1a. The bird has a thick cone-shaped beak -- go to step 2. 1b. The bird has a thin pointed beak -- go to step 3.',
          correct: true,
        },
        { id: 'c', text: '1a. The bird is pretty -- go to step 2. 1b. The bird is plain -- go to step 3.' },
        { id: 'd', text: '1a. The bird has a thick cone-shaped beak -- go to step 2. 1b. The bird has brown feathers -- go to step 3.' },
      ],
      expectedAnswer:
        '1a. The bird has a thick cone-shaped beak -- go to step 2. 1b. The bird has a thin pointed beak -- go to step 3.',
      hints: [
        'A good step uses something two different students would see exactly the same way, and the two options must never both fit the same bird.',
        'Ask two questions of each pair. Could one bird match both statements? Would everyone agree on which statement it matches?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-key-outside-its-set',
      kind: 'try_yourself',
      problem:
        'A class builds a dichotomous key for the five kinds of tree that grow on the school grounds. On vacation, a student runs a palm leaf through that key, follows every step correctly, and lands on the name Silver maple. What is the best conclusion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The leaf is from a silver maple, because every step of the key was followed correctly.' },
        {
          id: 'b',
          text: 'The key was built for five campus trees only, so it picked the closest of those five and its answer here is wrong.',
          correct: true,
        },
        { id: 'c', text: 'The key is broken and the class should throw it out and start over.' },
        { id: 'd', text: 'The palm must be a kind of tree that has never been named.' },
      ],
      expectedAnswer:
        'The key was built for five campus trees only, so it picked the closest of those five and its answer here is wrong.',
      hints: [
        'A key can only choose among the organisms it was written for. What set of organisms was this key written for?',
        'Notice that the key never offers the option "none of these". It always hands back one of its own names, even when the organism is not in its set.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skipping-and-scope',
      kind: 'misconception_check',
      question:
        'A student is naming a beetle with a five-step key. She reads through all the steps, notices that step 4 says "the wing covers meet in a straight line down the back", decides that describes her beetle, picks it, and writes down the name it gives. Why is that answer not trustworthy?',
      commonErrors: [
        {
          answer: 'Step 4 described my beetle, so I used step 4.',
          misconception:
            'Treating the steps as a list of descriptions to shop through, as though any statement that happens to match will do.',
          correctsTo:
            'Every step after the first is written for a smaller group, and it only makes sense once the earlier choices have been made. Step 4 might be written only for the animals that took the no-antennae branch back at step 2. Jumping straight into it means answering a question that was never asked about your beetle, and the name at the end belongs to whatever branch you landed in. WRONG: read every step and pick the one that fits. CORRECT: start at step 1, take the one statement of the pair that matches, and go only where that statement sends you. The path is the answer, not just the last step.',
        },
        {
          answer: 'The key says ground beetle, so now I know what it eats and where it lives.',
          misconception: 'Expecting a key to describe an organism. A key is a naming tool and nothing more.',
          correctsTo:
            'A dichotomous key identifies -- it gives you a name, and that is the end of its job. What the ground beetle eats, where it lives, and whether it can fly all come from a field guide or from your own observations, after the key has told you what to look up. A key uses only the few features it needs to tell its own organisms apart, and it ignores everything else about them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dichotomous means divided in two. Every step of a key offers exactly two statements, and exactly one of them matches.',
        'Start at step 1, pick the matching statement, go where it sends you, repeat until you reach a name.',
        'Never skip to the step that looks right. Later steps are written for the branch above them, so a skipped path gives a confident wrong name.',
        'Good steps use observable, unambiguous features: number of legs, wings present or absent, leaf edge smooth or toothed.',
        'Large, small, pretty and fast are relative words or opinions, and they do not belong in a key unless a reference is given.',
        'When you write a key, each step needs exactly two options that no organism matches both of and that no organism misses. Then test it on every organism in the set.',
        'A key only names. It does not describe the organism, and it only works on the set it was built for -- outside that set it still hands you a name, and the name is wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Using a Dichotomous Key' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
