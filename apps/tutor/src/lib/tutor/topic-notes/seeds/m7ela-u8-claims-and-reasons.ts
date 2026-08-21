/**
 * Grade 7 English Language Arts — Unit 8 CED 8.1: Claims & Reasons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.claims-and-reasons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U8_CLAIMS_AND_REASONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.claims-and-reasons.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Claims & Reasons',
  planId: 'evelyn.ms.m7ela.claims-and-reasons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.claims-and-reasons.v1' }],
  theory: [
    { loId: 'm7ela.claims-and-reasons', content: `A CLAIM IS A POSITION, WRITTEN AS ONE SENTENCE. It says what you want the reader to agree to. Most good claims at your scale use the word should: "Our school should let students keep water bottles in class." One sentence is not a style rule, it is a test. If you cannot squeeze your position into one sentence, you have not decided what your position is yet.` },
    { loId: 'm7ela.claims-and-reasons', kind: 'framework', title: 'The debatability test decides everything', content: `THE DEBATABILITY TEST DECIDES EVERYTHING — could a reasonable person disagree with this sentence? Say your claim out loud, then try to say the opposite out loud. If the opposite is something a sensible person could argue, you have a claim. If the opposite sounds ridiculous or impossible, you do not.` },
    { loId: 'm7ela.claims-and-reasons', content: `THREE THINGS THAT LOOK LIKE CLAIMS AND ARE NOT. A FACT is checkable, so nobody can disagree: "Our school starts at 7:20" is a fact, and "Our school should start later" is the claim hiding behind it. A QUESTION asks instead of answers: "Should our school start later?" is where you begin, not what you write. A TOPIC names the subject and takes no side: "Start times" and "The school start time is an important issue" both leave the reader asking, well, what about them? Every one of these can be turned into a claim by picking a side and saying should.` },
    { loId: 'm7ela.claims-and-reasons', content: `A REASON ANSWERS THE QUESTION WHY. Put the word because after your claim and finish the sentence: "Our school should start later BECAUSE the earliest bus riders leave home in the dark." Anything that finishes that sentence is a reason. Anything that does not finish it is something else. Two or three reasons is the normal number for a piece of writing this size.` },
    { loId: 'm7ela.claims-and-reasons', content: `EACH REASON IS A SEPARATE PILLAR, AND PILLARS CANNOT STAND IN THE SAME SPOT. Two reasons that say the same thing in different words are one reason wearing two hats. Test any pair by asking whether one could be true while the other is false. "Students are tired" and "students do not get enough sleep" fail that test, so they are one pillar. Three strong distinct reasons beat six overlapping ones every time, and a reader notices padding immediately.` },
    { loId: 'm7ela.claims-and-reasons', content: `TWO TRAPS TO CHECK FOR BEFORE YOU MOVE ON. First, a reason is not the claim reworded: "Our school should start later because classes should not begin so early" says nothing new, it just walks in a circle. Second, a reason is not a single example: "because my friend Dario fell asleep in first period on Tuesday" is one story. The reason underneath it is "because riders on the early bus arrive too tired to follow the first lesson," and Dario belongs in the next layer down, which is evidence.` },
    { loId: 'm7ela.claims-and-reasons', kind: 'definition', title: 'claim', content: `the position an argument asks the reader to agree with, stated in one sentence that a reasonable person could disagree with.` },
    { loId: 'm7ela.claims-and-reasons', kind: 'definition', title: 'debatable', content: `able to be argued both ways, so that the opposite of the sentence is something a sensible person could hold.` },
    { loId: 'm7ela.claims-and-reasons', kind: 'definition', title: 'reason', content: `a statement that answers why the claim should be accepted; it finishes the sentence "claim, because ...".` },
    { loId: 'm7ela.claims-and-reasons', kind: 'definition', title: 'distinct reasons', content: `reasons that make genuinely different points, so that one could be true while another is false.` },
  ],
  methods: [
    {
      title: 'Worked topic to claim',
      steps: [
        `Notice what you have been given. "Phones in class" is a topic. It names the subject and takes no side, so there is nothing yet for anyone to agree or disagree with.`,
        `Turn the topic into a question first, because that is easier: "Should students be allowed to use phones during class?" This is still not the claim. A question asks. A claim answers.`,
        `Answer your own question and write the answer as one sentence with should in it: "Students should be allowed to keep phones in their bags during class instead of handing them in at the door."`,
        `Run the debatability test. Say the opposite: "Students should hand phones in at the door." A sensible person could absolutely argue that, and plenty of teachers would. The claim passes.`,
        `Compare a version that fails the test. WRONG as a claim: "Many students bring phones to school." That is a fact, and its opposite is simply false, so nobody can take the other side. CORRECT as a claim: the should sentence from step three.`,
        `Check the length. One sentence, one position. If your sentence had to add "and also uniforms should change," you would be carrying two claims, and each one needs its own argument.`,
      ],
      example: { problem: `You have been handed the topic "phones in class" and told to write an argument. Turn it into a claim.`, solution: `Claim: "Students should be allowed to keep phones in their bags during class instead of handing them in at the door." It is one sentence, it takes a side, and a reasonable person could argue the opposite.` },
      relatedLoIds: ['m7ela.claims-and-reasons'],
    },
    {
      title: 'Worked prune the reasons',
      steps: [
        `Test each one by putting it after the claim with because. All four finish the sentence, so all four are at least aimed at the right target. Now sort them.`,
        `Reason 1 stands. It names a specific cause, the line, and a reasonable person could dispute it, which is exactly what a pillar should look like.`,
        `Reason 2 is the claim reworded. "Twenty minutes is not enough time for lunch" is the same sentence as "lunch should be thirty minutes" with the words moved around. It walks in a circle and adds no new ground. Cut it.`,
        `Reason 3 stands, and it is genuinely distinct from reason 1. Run the pillar test: the line could be short and the field could still be too far to reach. One can be true while the other is false, so these are two pillars, not one.`,
        `Reason 4 is one example, not a reason. Priya and her sandwich are proof you could use later, under reason 1, when you get to evidence. A single Monday cannot hold up the whole claim by itself.`,
        `Count what is left. Two distinct reasons, each doing work the other does not do. Two real pillars beat four items where two of them are a mirror and a story.`,
      ],
      example: { problem: `Claim: "Our school should make lunch thirty minutes long instead of twenty." A student drafted four reasons. Which ones survive? (1) Because the lunch line takes so long that students with late lunch barely have time to eat. (2) Because twenty minutes is not enough time for lunch. (3) Because students never get outside during the school day, and the field is a five-minute walk each way. (4) Because on Monday Priya only got through half her sandwich before the bell.`, solution: `Reasons 1 and 3 survive. Reason 2 only restates the claim, and reason 4 is a single example, which belongs under reason 1 as evidence rather than standing as a reason of its own.` },
      relatedLoIds: ['m7ela.claims-and-reasons'],
    },
  ],
  pointers: [
    { content: `Students often say "A claim is whatever you feel strongly about." — How strongly you feel decides nothing. The debatability test decides it: could a reasonable person disagree with this exact sentence? Run that test here. "Homework should be limited to thirty minutes a night" has an opposite that plenty of people would argue, so it does pass, but it passes because it is a debatable position, not because the writer cares about it. A student who feels just as strongly and writes "Homework takes a long time" has written a fact, and no amount of feeling turns it into a claim.`, kind: 'common-error' },
    { content: `Students often say "Six reasons must be stronger than three reasons." — Reasons are pillars, and pillars only help if they stand in different places. Ask of any two whether one could be true while the other is false. If six reasons collapse into "homework takes too long," said six ways, the student has one pillar and five echoes, and a reader hears the padding. Three strong distinct reasons hold up more than six overlapping ones.`, kind: 'common-error' },
    { content: `A claim is a position stated in one sentence, and at your scale it usually contains the word should.`, kind: 'tip' },
    { content: `Run the debatability test every time: say the opposite out loud, and ask whether a reasonable person could argue it.`, kind: 'tip' },
    { content: `A fact, a question and a bare topic are the three things that look like claims and are not. Pick a side and say should to turn any of them into one.`, kind: 'tip' },
    { content: 'A reason answers why. It has to finish the sentence "claim, because ...".', kind: 'tip' },
    { content: `Reasons are separate pillars. If one could not be true while another is false, you have written the same reason twice.`, kind: 'tip' },
    { content: `A reason is not the claim reworded, and a reason is not a single example. Three strong distinct reasons beat six overlapping ones.`, kind: 'tip' },
    { content: `Don't mix up **topic** and **claim**. "Phones in class" or "Start times are an important issue" names a subject and takes no side. A claim answers: pick a side and say *should*.`, kind: 'vocab-note' },
    { content: `A checkable fact is not a claim. "Our school starts at 7:20" can't be argued — its opposite is just false. Ask: could someone sensibly say the opposite out loud? If not, you wrote a fact, and the claim is still hiding behind it.`, kind: 'common-error' },
    { content: `Feeling strongly about something does not make it a claim. Passion is why you picked the subject; the debatability test is what qualifies the sentence. Run the test even on ideas you care about most.`, kind: 'gotcha' },
    { content: `Watch for the reason that just re-says the claim. "Lunch should be 30 minutes because 20 minutes isn't enough" is one sentence twice. A reason must add new ground the claim didn't already say.`, kind: 'common-error' },
    { content: `One story is evidence, not a reason. "Because Priya only ate half her sandwich Monday" is proof that belongs *under* a reason. The reason is the bigger statement it proves: "because the line leaves late-lunch students no time to eat."`, kind: 'vocab-note' },
    { content: `More reasons ≠ stronger argument. Test any two with the pillar question: could one be true while the other is false? "Students are tired" and "students don't get enough sleep" fail — that's one pillar in two hats. Cut to 2–3 distinct ones.`, kind: 'tip' },
    { content: `If you need the word *and* to hold your claim together — "lunch should be longer and uniforms should change" — you've written two claims. Each one needs its own argument. Split them and pick one.`, kind: 'edge-case' },
    { content: `Turning your topic into a question is a useful first step, but stop before you hand it in. "Should school start later?" asks. Your claim has to answer.`, kind: 'gotcha' },
  ],
};
