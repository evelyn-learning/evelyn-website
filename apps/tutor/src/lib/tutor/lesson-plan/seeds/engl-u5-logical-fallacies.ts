/**
 * HS English — Argument & Rhetoric: Spotting Logical Fallacies.
 *
 * The seven breaks in reasoning students meet most often (CCSS
 * RI.9-10.8, W.9-10.1): what each move does, the question that exposes
 * it, and the discipline of not crying "fallacy!" at an argument that
 * actually works. All excerpts are short ORIGINAL prose written for
 * this lesson — no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U5_LOGICAL_FALLACIES: LessonPlan = {
  id: 'evelyn.hs.engl.logical-fallacies.v1',
  title: 'Spotting Logical Fallacies',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.logical-fallacies',
      standard: 'ENGL-5.3',
      description:
        'Recognize common logical fallacies — ad hominem, straw man, false dilemma, bandwagon, hasty generalization, slippery slope, and false cause — in arguments and explain why the reasoning in each one fails to support its conclusion (CCSS RI.9-10.8, W.9-10.1).',
    },
  ],
  prerequisites: ['engl.rhetorical-appeals'],
  followUps: ['engl.counterargument-and-rebuttal'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show students they already feel fallacies land wrong — give them names and the question that exposes each one.',
      script:
        'You have had this happen. You make a point in a group project, and someone answers with "You always want to do the least work." Notice what just occurred: your point was never touched. Something got said, the room moved on, and you were left with the strange feeling of having won and lost at the same time. That feeling has a name — several names, actually. A logical fallacy is a break in the connection between a reason and the conclusion it is supposed to support. Today we name seven of them, and more useful than the names, we learn the one question that exposes each one, so that next time you can say exactly what went wrong instead of just feeling that it did.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-seven-fallacies',
      kind: 'concept',
      goal: 'Define a fallacy as a broken evidence-to-conclusion link, then teach the seven in three memorable families, each with its exposing question.',
      keyIdeas: [
        'WHAT A FALLACY ACTUALLY IS — a fallacy is not a false statement; it is a broken CONNECTION. The reason offered might even be true, and the conclusion might even be right, but the reason does not do the work of supporting the conclusion. The universal test: if I grant the reason, am I any closer to having to accept the claim?',
        'FAMILY 1, ATTACK-THE-PERSON MOVES — instead of answering the argument, change the target. AD HOMINEM swaps the argument for the arguer: "Why should we take Jamal\'s recycling plan seriously? He forgot his own lunch three days last week." Exposing question: has anyone actually answered the plan?',
        'FAMILY 1 CONTINUED, STRAW MAN — rebuild the other side into a weaker argument, then knock that one down: "Nina wants a later start time, so apparently she thinks school should barely happen at all." Exposing question: is that what she actually said, or a cheaper version of it? The tell is usually a word like "so basically" or "apparently" in front of something nobody claimed.',
        'FAMILY 2, FAKE-FORCED-CHOICE MOVES — narrow the world until only one exit remains. FALSE DILEMMA offers two options as if they were the only two: "Either we cancel the field trip entirely or we let students plan it with no supervision." Exposing question: what is the third option being hidden?',
        'FAMILY 2 CONTINUED, SLIPPERY SLOPE — chain one small step to a disaster without showing any of the links: "If we allow phones at lunch, nobody will ever pay attention in class again." Exposing question: what makes each step actually cause the next one? A slope is only a fallacy when the links are asserted rather than shown; a chain of steps with evidence for each link is a legitimate prediction.',
        'FAMILY 3, WEAK-EVIDENCE MOVES — real evidence is offered, but far too little of it. HASTY GENERALIZATION jumps from a tiny sample to a sweeping rule: "Two seniors missed the bus this morning, so seniors cannot be trusted with off-campus lunch." Exposing question: how many cases, and are they representative?',
        'FAMILY 3 CONTINUED, FALSE CAUSE — treat one thing following another as one thing causing another: "The team has won every game since Coach changed the warm-up playlist, so the playlist is what wins games." Exposing question: could this be coincidence, or could a third factor explain both?',
        'FAMILY 3 CONTINUED, BANDWAGON — substitute popularity for proof: "Everyone in the group chat already agreed, so it is obviously the right call." Exposing question: what evidence exists besides the number of people holding the view? Popular claims are often true, but the popularity is not what makes them true.',
      ],
      vocabulary: [
        { term: 'logical fallacy', definition: 'a flaw in reasoning where the stated reason fails to support the conclusion, even if the reason itself happens to be true.' },
        { term: 'straw man', definition: 'a distorted, weakened restatement of an opponent\'s argument, attacked in place of the real one.' },
        { term: 'false cause', definition: 'the assumption that because one event followed another, the first event caused the second.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-the-fallacy',
      kind: 'worked_example',
      problem:
        'Name the fallacy in this exchange and explain why the reasoning fails: Rosa said, "The vending machine profits should fund the art club this year, since the art club is the only group with no budget line at all." Dev answered, "Rosa only says that because her sister is in the art club."',
      steps: [
        'Find the claim and its support. Rosa\'s claim: the vending profits should fund the art club. Her reason: that club alone has no budget line. That reason is checkable and it bears directly on the claim.',
        'Find what the response actually addresses. Dev says nothing about budget lines, funding, or the art club. He talks about Rosa\'s motive — who she is related to.',
        'Name it: ad hominem, the attack-the-person move. Apply the universal test — grant that Rosa\'s sister is in the art club. Does that make it any less true that the club has no budget line? It does not, so the reason cannot support the conclusion Dev wants.',
        'Say why the move is tempting anyway: a hidden motive is real information, and it is fair to ask Rosa to disclose it. But motive tells us why someone made an argument, never whether the argument is any good. Interested people can be right.',
        'Model the honest rebuttal: "The art club has no budget line because it raises its own funds through the winter show, so the vending profits are better aimed at a group with no fundraiser." That reply engages the reason instead of the person.',
      ],
      answer:
        'Ad hominem — Dev attacks Rosa\'s motive instead of her reason, so her claim that the art club has no budget line goes completely unanswered',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-not-every-argument-is-a-fallacy',
      kind: 'worked_example',
      problem:
        'A student labels the following as an appeal-to-authority fallacy: "Coach Yeboah, who has trained sprinters for nineteen years, says the new warm-up sequence lowers hamstring injuries, and the district athletic trainer reports the same pattern across four schools." Is the student right? Explain.',
      steps: [
        'State what actually makes an appeal to authority fallacious. It goes wrong in three specific ways: the expert is speaking outside their field, the claim is one experts genuinely dispute, or the authority is offered as PROOF that ends the discussion rather than as evidence that supports it.',
        'Check the excerpt against each condition. The field matches — sprint training and hamstring injuries are precisely Coach Yeboah\'s domain. The claim is not framed as settled beyond question. And the reasoning does not stop at one voice: the district trainer reports the same pattern across four schools.',
        'Notice what the corroboration does NOT make it. Two sources agreeing is not bandwagon, because bandwagon counts heads rather than weighing relevant expertise. The difference is whether the people cited have a reason to know.',
        'Deliver the verdict. This is ordinary inductive support: relevant expertise plus independent corroboration, offered as evidence. It could still turn out to be wrong — inductive support is never a guarantee — but being possibly wrong is not the same as being fallacious.',
        'Draw the general rule. Fallacy labels describe HOW a reason connects to a conclusion, not how confident the speaker sounds or whether you like the conclusion. To push back here, ask about the evidence — how many athletes, over how long, compared with what — rather than reaching for a label.',
      ],
      answer:
        'No fallacy — the expertise is relevant, independently corroborated, and offered as evidence rather than as proof that ends the discussion; only irrelevant, disputed, or overstated authority would be fallacious',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-bandwagon',
      kind: 'try_yourself',
      problem:
        'Name the fallacy in this excerpt: "Sixty-eight people have already signed the petition to move the spring dance to the gym, so moving it is clearly the right decision for the school."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bandwagon', correct: true },
        { id: 'b', text: 'Hasty generalization' },
        { id: 'c', text: 'False cause' },
        { id: 'd', text: 'False dilemma' },
      ],
      expectedAnswer: 'Bandwagon',
      hints: [
        'Ask what the sixty-eight signatures are being used to prove. Are they evidence about the gym, or evidence about how many people want the gym?',
        'Nothing here says why the gym is a better venue. The only support offered is the number of people who agree.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-false-cause',
      kind: 'try_yourself',
      problem:
        'Name the fallacy in this excerpt: "Checkouts at the school library have climbed every week since the librarian started playing quiet music in the reading room. The music is what is bringing students back to reading."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Straw man' },
        { id: 'b', text: 'False cause', correct: true },
        { id: 'c', text: 'Slippery slope' },
        { id: 'd', text: 'Ad hominem' },
      ],
      expectedAnswer: 'False cause',
      hints: [
        'Two things happened in the same stretch of time. What is the speaker concluding from that overlap?',
        'Ask what else changed. Exam season, a new book display, or a schedule change could raise checkouts just as easily as the music could.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-answer-the-real-argument',
      kind: 'try_yourself',
      problem:
        'Priya argues to the robotics club: "Members should have to attend at least half of our meetings, because the officers keep planning builds around people who never show up." Which response addresses the argument Priya actually made?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'So Priya wants to throw out anyone who gets sick or picks up a work shift.' },
        { id: 'b', text: 'Priya has been in this club for one semester, so she does not get to rewrite the rules.' },
        { id: 'c', text: 'Half of the meetings is the wrong threshold — most absences are work shifts, and a one-third requirement would fix the planning problem without shrinking the club.', correct: true },
        { id: 'd', text: 'Either we require attendance or this club falls apart by spring.' },
      ],
      expectedAnswer: 'Half of the meetings is the wrong threshold — most absences are work shifts, and a one-third requirement would fix the planning problem without shrinking the club.',
      hints: [
        'Priya made a specific claim with a specific reason: an attendance minimum, because planning depends on knowing who shows up. A real response has to touch that reason.',
        'Three options change the subject — one to an exaggerated version of her position, one to Priya herself, one to a forced choice between two extremes. Only one talks about the attendance threshold and the planning problem.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-naming-is-not-winning',
      kind: 'misconception_check',
      question:
        'A student says: "I found a slippery slope in Malik\'s speech, so I won the debate and I do not have to answer his evidence. Honestly, any argument that sounds that confident is probably a fallacy anyway." What went wrong here — twice?',
      commonErrors: [
        {
          answer: 'Naming a fallacy defeats the argument, so the evidence no longer needs a response',
          misconception: 'Treating a fallacy label as a win button — as if identifying one bad move disqualifies everything the speaker said.',
          correctsTo:
            'Naming a fallacy retires ONE reason, not the whole position. Malik may have three other reasons that stand perfectly well, and his conclusion could still be true even if that one argument for it was broken. After naming the fallacy, you still owe the rest of his case an answer.',
        },
        {
          answer: 'A confident, strongly worded claim is probably a fallacy',
          misconception: 'Confusing the STRENGTH of a claim with the QUALITY of its reasoning, which turns fallacy-spotting into a way to dismiss anything forceful.',
          correctsTo:
            'A fallacy is a defect in the link between reason and conclusion, not a matter of tone. A quiet argument can be fallacious and a forceful one can be airtight. Test the connection, not the volume.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A fallacy is a broken link between reason and conclusion — the reason can be true and the move still fails.',
        'Three families: attack-the-person (ad hominem, straw man), fake-forced-choice (false dilemma, slippery slope), weak-evidence (hasty generalization, false cause, bandwagon).',
        'Each has an exposing question: was the argument answered? is that what they said? what is the third option? what makes each step follow? how many cases? could a third factor explain it? what evidence besides popularity?',
        'Naming a fallacy retires one reason, not the whole argument — and a strong, confident claim is not a fallacy just for being strong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Spotting Logical Fallacies' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
