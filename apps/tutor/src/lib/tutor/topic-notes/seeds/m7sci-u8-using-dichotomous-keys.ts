/**
 * Grade 7 Science — Unit 8 CED 8.3: Using a Dichotomous Key.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.using-dichotomous-keys.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U8_USING_DICHOTOMOUS_KEYS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.using-dichotomous-keys.v1',
  course: 'Grade 7 Science',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Using a Dichotomous Key',
  planId: 'evelyn.ms.m7sci.using-dichotomous-keys.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.using-dichotomous-keys.v1' }],
  theory: [
    { loId: 'm7sci.using-dichotomous-keys', content: `A DICHOTOMOUS KEY IDENTIFIES AN ORGANISM THROUGH A SERIES OF PAIRED CHOICES. The word dichotomous means divided in two, and that is the whole idea: at every step you are handed exactly two statements, and exactly one of them describes the organism in front of you. Choosing one closes off half of what is left. A few choices later, only one organism is still standing, and the key prints its name.` },
    { loId: 'm7sci.using-dichotomous-keys', content: `THE PROCEDURE -- START AT STEP 1, EVERY SINGLE TIME. Read both statements of the pair. Pick the one that matches your organism. Look at where that statement sends you: it is either another step number or a name. If it is a step number, go there and do the same thing again. If it is a name, you are finished. That is the entire method, and it never changes.` },
    { loId: 'm7sci.using-dichotomous-keys', content: `FOLLOW THE PATH -- YOU MAY NOT SKIP TO THE STEP THAT LOOKS RIGHT. Every step after the first is written for a smaller group, and it only makes sense after the earlier choices have been made. Step 4 might be written only for the animals that took the six-legs branch back at step 1. WRONG: read all the steps and pick whichever statement fits. CORRECT: start at step 1 and go only where each step sends you. Skipping puts you in a branch built for a different organism, and the name at the end will be that organism.` },
    { loId: 'm7sci.using-dichotomous-keys', content: `A GOOD STEP USES OBSERVABLE, UNAMBIGUOUS FEATURES -- things you can count, or that are plainly present or absent. Number of legs. Wings present or absent. Leaf edge smooth or toothed. Body covered in fur or in scales. WRONG: large, small, pretty, fast, common. Those are relative words or opinions, and two students would sort the same organism into different branches. Large is usable only with a reference, such as longer than your hand.` },
    { loId: 'm7sci.using-dichotomous-keys', content: `WRITING A KEY -- EACH STEP NEEDS EXACTLY TWO OPTIONS THAT ARE MUTUALLY EXCLUSIVE AND THAT COVER EVERYTHING. Mutually exclusive means no organism can match both statements. Covering everything means no organism in your set matches neither. A pair like smooth edge or toothed edge passes both tests. A pair like cone-shaped beak or brown feathers fails, because one bird could easily have both. Start with a feature that splits the group roughly in half, then keep splitting inside each branch.` },
    { loId: 'm7sci.using-dichotomous-keys', content: `A KEY ONLY NAMES, AND ONLY WITHIN ITS OWN SET. It tells you what an organism is called. It does not tell you what it eats, where it lives, or how it is related to anything else -- that comes later, from a field guide, once you have a name to look up. And a key built for the trees on your campus will run a palm leaf through its steps just as happily and confidently hand you the name of a campus tree. The answer will be wrong. Always check what a key was built for before you trust the name it gives you.` },
    { loId: 'm7sci.using-dichotomous-keys', kind: 'definition', title: 'dichotomous key', content: `an identification tool made of paired either/or statements; dichotomous means divided in two.` },
    { loId: 'm7sci.using-dichotomous-keys', kind: 'definition', title: 'couplet', content: `one step of a key: the two paired statements labeled 1a and 1b, of which exactly one matches.` },
    { loId: 'm7sci.using-dichotomous-keys', kind: 'definition', title: 'observable feature', content: `something you can see or count directly, such as six legs or a toothed leaf edge.` },
    { loId: 'm7sci.using-dichotomous-keys', kind: 'definition', title: 'mutually exclusive', content: 'describing two options that can never both be true of the same organism.' },
    { loId: 'm7sci.using-dichotomous-keys', kind: 'definition', title: 'identify', content: 'to work out the name of an unknown organism; naming is all a key does.' },
  ],
  methods: [
    {
      title: 'Worked trace the key',
      steps: [
        `Start at step 1. Always start at step 1, even when you already have a hunch about the answer.`,
        `Step 1 offers six legs or eight legs. Count the legs on your animal: there are eight. So 1b is the statement that matches, and 1b sends you to step 3.`,
        `Do not stop at step 2 on the way past. Step 2 is written only for the six-legged animals that came out of 1a, so neither of its statements is about your animal at all. Wings or no wings is not a question this key is asking about eight-legged animals.`,
        `Go to step 3, as instructed. It offers a rounded body with no tail, or a long body ending in a curled tail. Your animal has a rounded body and no tail, so 3a matches.`,
        `3a gives a name rather than another step number, so the path ends there. The animal is a garden spider.`,
        `Look back at the path: 1b, then 3a. Two choices, each one a plain look at the animal. And notice what the key did NOT tell you. It said nothing about what a garden spider eats or whether it is dangerous. A key hands you a name, and naming is the whole job.`,
      ],
      example: { problem: `Here is a key for four small animals that live under a flowerpot. 1a. The animal has six legs -- go to step 2. 1b. The animal has eight legs -- go to step 3. 2a. The animal has wings -- Honeybee. 2b. The animal has no wings -- Field ant. 3a. The body is rounded and there is no tail -- Garden spider. 3b. The body is long and ends in a curled tail -- Scorpion. You find an animal with eight legs, a rounded body, and no tail. Which animal is it?`, solution: `Garden spider. The path is 1b (eight legs), which sends you to step 3, then 3a (rounded body, no tail), which gives the name.` },
      relatedLoIds: ['m7sci.using-dichotomous-keys'],
    },
    {
      title: 'Worked write a key',
      steps: [
        `Look for one feature that splits the four leaves into two even groups. Two leaves are single blades, W and X. Two are divided into small leaflets, Y and Z. That is a two-and-two split, and it is something anyone can see without measuring, so it makes a good step 1.`,
        `Reject the tempting alternatives before you write anything. "The leaf is large" is no good, because large compared to what? Two students would sort the same leaf differently. "The leaf is pretty" is an opinion, not an observation. Keep to features that are counted, plainly present or absent, or clearly shaped.`,
        `Write step 1 with exactly two options that no leaf can match at the same time and that no leaf misses. 1a. The leaf is a single blade -- go to step 2. 1b. The leaf is divided into several small leaflets -- go to step 3.`,
        `Now split the pair inside the first branch. W and X are both single blades, so the blade question is used up and cannot separate them. Their edges can. 2a. The edge is smooth -- Leaf W. 2b. The edge is toothed -- Leaf X.`,
        `Do the same inside the other branch. Y and Z are both divided into leaflets, and again the edge is what tells them apart. 3a. The edge is smooth -- Leaf Y. 3b. The edge is toothed -- Leaf Z.`,
        `Test the finished key on every leaf before you trust it. Leaf W is a single blade, so 1a sends it to step 2; its edge is smooth, so 2a names it Leaf W. Leaf X is a single blade, so 1a sends it to step 2; its edge is toothed, so 2b names it Leaf X. Leaf Y is divided, so 1b sends it to step 3; smooth edge, so 3a names it Leaf Y. Leaf Z is divided, so 1b sends it to step 3; toothed edge, so 3b names it Leaf Z. All four land on their own names, so the key works. A key you have not run every organism through is a key you do not yet know is correct.`,
      ],
      example: { problem: `Write a dichotomous key for four leaves. Leaf W is a single blade with a smooth edge. Leaf X is a single blade with a toothed edge. Leaf Y is divided into several small leaflets and has a smooth edge. Leaf Z is divided into several small leaflets and has a toothed edge.`, solution: `1a. The leaf is a single blade -- go to step 2. 1b. The leaf is divided into several small leaflets -- go to step 3. 2a. The edge is smooth -- Leaf W. 2b. The edge is toothed -- Leaf X. 3a. The edge is smooth -- Leaf Y. 3b. The edge is toothed -- Leaf Z.` },
      relatedLoIds: ['m7sci.using-dichotomous-keys'],
    },
  ],
  pointers: [
    { content: `Students often say "Step 4 described my beetle, so I used step 4." — Every step after the first is written for a smaller group, and it only makes sense once the earlier choices have been made. Step 4 might be written only for the animals that took the no-antennae branch back at step 2. Jumping straight into it means answering a question that was never asked about your beetle, and the name at the end belongs to whatever branch you landed in. WRONG: read every step and pick the one that fits. CORRECT: start at step 1, take the one statement of the pair that matches, and go only where that statement sends you. The path is the answer, not just the last step.`, kind: 'common-error' },
    { content: `Students often say "The key says ground beetle, so now I know what it eats and where it lives." — A dichotomous key identifies -- it gives you a name, and that is the end of its job. What the ground beetle eats, where it lives, and whether it can fly all come from a field guide or from your own observations, after the key has told you what to look up. A key uses only the few features it needs to tell its own organisms apart, and it ignores everything else about them.`, kind: 'common-error' },
    { content: `Dichotomous means divided in two. Every step of a key offers exactly two statements, and exactly one of them matches.`, kind: 'tip' },
    { content: `Start at step 1, pick the matching statement, go where it sends you, repeat until you reach a name.`, kind: 'tip' },
    { content: `Never skip to the step that looks right. Later steps are written for the branch above them, so a skipped path gives a confident wrong name.`, kind: 'tip' },
    { content: `Good steps use observable, unambiguous features: number of legs, wings present or absent, leaf edge smooth or toothed.`, kind: 'tip' },
    { content: `Large, small, pretty and fast are relative words or opinions, and they do not belong in a key unless a reference is given.`, kind: 'tip' },
    { content: `When you write a key, each step needs exactly two options that no organism matches both of and that no organism misses. Then test it on every organism in the set.`, kind: 'tip' },
    { content: `A key only names. It does not describe the organism, and it only works on the set it was built for -- outside that set it still hands you a name, and the name is wrong.`, kind: 'tip' },
    { content: `Never shop the steps for one that sounds like your organism. Start at step 1 and go only where each matching statement sends you. A skipped step was written for a different branch, and it will still hand you a name — a confidently wrong one.`, kind: 'common-error' },
    { content: `A key **names** — that's all. When it says "garden spider," don't add what it eats, where it lives, or whether it bites. Use the name to look the organism up in a field guide afterward.`, kind: 'vocab-note' },
    { content: `Don't put "large," "small," "pretty," "fast," or "common" in a key step. Two students would sort the same organism differently. If you need size, give a reference: "longer than your hand."`, kind: 'common-error' },
    { content: `Check every couplet twice: can one organism match BOTH statements? Can one match NEITHER? "Cone beak / brown feathers" fails — a bird can be both. "Smooth edge / toothed edge" passes.`, kind: 'tip' },
    { content: `A key only works on the set it was built for. Run a palm leaf through a campus-tree key and it will still print "Silver maple." Before trusting a name, ask what organisms the key was written for.`, kind: 'edge-case' },
    { content: `Once a feature has been used to split a branch, it can't split that branch again. If 1a already grouped all the single-blade leaves, step 2 must ask about something else — edge, shape, color of stem.`, kind: 'tip' },
    { content: `Before you say your key works, run every single organism through it from step 1. Each must land on its own name. An untested key is a key you don't yet know is correct.`, kind: 'tip' },
    { content: `Say "couplet" for one step's pair of statements (1a and 1b) — not "question." And each couplet has exactly two options, never three. If you need a third choice, add another step below.`, kind: 'vocab-note' },
  ],
};
