/**
 * HS English — Argument: Counterargument & Rebuttal.
 *
 * How a strong argument survives contact with the other side (CCSS
 * W.9-10.1b, RI.9-10.6): anticipating the best opposing view, stating it
 * fairly (steel-man, not straw-man), and answering it with counter-evidence,
 * outweighing, or an exposed assumption. Every excerpt is short ORIGINAL
 * prose written for this lesson — invented schools, towns, and clubs, no
 * copyrighted quotations and no real public figures.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U5_COUNTERARGUMENT_AND_REBUTTAL: LessonPlan = {
  id: 'evelyn.hs.engl.counterargument-and-rebuttal.v1',
  title: 'Counterargument & Rebuttal',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.counterargument-and-rebuttal',
      standard: 'ENGL-5.4',
      description:
        'Anticipate the strongest opposing view to a claim, represent it fairly and accurately rather than as a weakened caricature, and rebut it with counter-evidence, by exposing a hidden assumption, or by conceding the point and showing why other considerations outweigh it (CCSS W.9-10.1b, RI.9-10.6).',
    },
  ],
  prerequisites: ['engl.logical-fallacies'],
  followUps: ['engl.plot-and-conflict'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the arguments students actually win in real life are the ones that answer the objection before it is raised.',
      script:
        'Think about the last time you asked for something big at home — a later curfew, a phone upgrade, a weekend trip. If you only listed reasons it would be great for you, you probably lost. The version that works sounds different: "I know you are worried about my grades slipping, and that is fair — so here is the plan for the two weeks before I go." You named the objection first, out loud, and then answered it. That move has a name in writing: counterargument and rebuttal. Today we learn why naming the other side makes you harder to argue with, not easier.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-counter-rebut',
      kind: 'concept',
      goal: 'Why acknowledging opposition strengthens a claim, how to represent it fairly, and the three moves that answer it.',
      keyIdeas: [
        'ACKNOWLEDGING THE OTHER SIDE MAKES YOU STRONGER, NOT WEAKER. A reader who thinks of an objection you never mentioned assumes you either missed it or hid it. Naming it first proves you looked, and it lets you control how that objection gets stated.',
        'STRAW-MAN — restating the opposing view in its weakest, silliest form so it is easy to knock over: "People against the later start time just want students to sleep all day." Nobody actually argues that, so defeating it proves nothing.',
        'STEEL-MAN — restating the opposing view in its STRONGEST honest form, the way a thoughtful opponent would put it: "Opponents point out that a later start would push athletic practices past sunset, which raises real safety and staffing problems." Beat that version and you have actually won something.',
        'CONCESSION LANGUAGE signals that you are now speaking for the other side, on purpose: "admittedly", "it is true that", "critics reasonably argue", "there is no denying that". Without a signal phrase, readers cannot tell your view from theirs.',
        'REBUTTAL MOVE 1 — COUNTER-EVIDENCE. Show that the factual claim underneath the objection does not hold: "Admittedly, critics expected costs to rise, yet the three districts that tried this reported no increase in their transportation budgets."',
        'REBUTTAL MOVE 2 — CONCEDE AND OUTWEIGH. Grant that the objection is true, then argue that something more important sits on the other side of the scale: "It is true that practices would end after dark. Even so, an extra hour of sleep every school night affects far more of a student\'s day than the last half hour of practice does."',
        'REBUTTAL MOVE 3 — EXPOSE THE HIDDEN ASSUMPTION. Show that the objection only works if you accept an unstated premise, then reject that premise: the claim that a garden wastes the lot assumes the only value land can have is sale value.',
        'TURN WORDS mark the pivot back to your own argument: "however", "yet", "even so", "still", "nevertheless". A concession without a turn word usually means the writer conceded and never came back.',
        'THE IGNORE-THE-OPPOSITION ERROR — writing as if no reasonable person disagrees. It reads as either uninformed or evasive, and it leaves the strongest objection sitting in the reader\'s mind unanswered for the whole essay.',
      ],
      vocabulary: [
        { term: 'counterargument', definition: 'the strongest objection a reasonable opponent would raise against your claim, stated in your own writing before you answer it.' },
        { term: 'rebuttal', definition: 'the response that answers the counterargument — through counter-evidence, an exposed assumption, or conceding the point and outweighing it.' },
        { term: 'concession', definition: 'granting that part of the opposing view is true or reasonable; it must be followed by a turn back to your claim, or it becomes a surrender.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-counter-rebuttal',
      kind: 'worked_example',
      problem:
        'Build a fair counterargument and a rebuttal for this claim: "Ridgeway High should keep the library open until eight on weeknights."',
      steps: [
        'Predict the objection a thoughtful opponent would raise. Not "opponents hate reading" — that is a straw-man. The real worry is money and staffing: three extra hours of building time means paying a librarian and a custodian on every school night.',
        'State it in steel-man form, with a concession signal: "It is true that staying open until eight would add three paid hours of staffing to every school night, and the building budget is already tight."',
        'Choose the rebuttal move. Counter-evidence would need budget numbers we do not have, so the honest move is CONCEDE AND OUTWEIGH — the cost is real, but compare it against what the hours buy.',
        'Turn back with a turn word and put the heavier thing on the scale: "Even so, the students who most need a quiet place to work are the ones without one at home, and the cost of a few staff hours is small next to the cost of those students falling behind."',
        'Read the pair back and check three things: the objection is one a real opponent would recognize, a concession phrase marks it as theirs, and a turn word carries the paragraph back to the claim.',
      ],
      answer:
        'Counterargument: extended hours add real staffing cost to a tight budget. Rebuttal (concede and outweigh): the cost is genuine, yet the students without a quiet workspace at home gain the most, and that benefit outweighs a few staff hours',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fake-rebuttal',
      kind: 'worked_example',
      problem:
        'A student writes this paragraph for the claim that Brookline should turn its empty Fifth Street lot into a community garden: "Some people say the town should sell the lot instead. But the town should really build the community garden, because a garden would be a wonderful thing for Brookline." Diagnose what has gone wrong and repair it.',
      steps: [
        'Locate the counterargument: "Some people say the town should sell the lot instead." It is present, but thin — it never says WHY selling matters, so the reader never meets the real objection.',
        'Locate the rebuttal: "the town should really build the community garden, because a garden would be a wonderful thing." That is not a rebuttal at all. It is the original claim restated with more volume and no new reason — the reader is given nothing that was not already asserted.',
        'Name the second failure mode to watch for, the mirror image of this one: a writer concedes generously ("admittedly, selling the lot would fund overdue road repairs") and then simply moves on to the next paragraph. Conceding without a turn word hands the point to the opposition.',
        'Repair step one — steel-man the objection so it carries actual force: "Admittedly, selling the Fifth Street lot would bring in money the town has already earmarked for overdue road repairs."',
        'Repair step two — answer it with a real move. Expose the hidden assumption plus outweigh: "That argument assumes land is only worth what it sells for. Yet the lot has stood empty for six years, a one-time sale funds one round of repairs, and a garden keeps producing food and a gathering place every summer after that."',
      ],
      answer:
        'The paragraph restates the claim louder instead of rebutting; a real rebuttal must add something new — counter-evidence, an exposed assumption, or a concession followed by a turn word and an outweighing reason',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fairest-opposing-view',
      kind: 'try_yourself',
      problem:
        'A student is arguing that Marlowe High should require every ninth grader to take a one-semester personal finance course. Which statement of the opposing view is the FAIREST — the steel-man version a thoughtful opponent would actually recognize?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Opponents argue that the ninth-grade schedule is already full, so a new requirement would displace an elective such as art or music that many students count on.', correct: true },
        { id: 'b', text: 'Opponents simply do not believe teenagers need to know anything about money.' },
        { id: 'c', text: 'Opponents want students to stay financially ignorant so they are easier to sell things to.' },
        { id: 'd', text: 'Opponents disagree because they have not thought carefully about how important budgeting is.' },
      ],
      expectedAnswer: 'Opponents argue that the ninth-grade schedule is already full, so a new requirement would displace an elective such as art or music that many students count on.',
      hints: [
        'A steel-man states the objection the way a smart opponent would state it themselves. Would anyone volunteer to be described by these words?',
        'Three choices make opponents sound foolish or hostile. One gives them a real reason about scheduling and trade-offs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-strongest-rebuttal',
      kind: 'try_yourself',
      problem:
        'Claim: the Ashfield town council should keep the Fifth Street lot public and fund a community garden. Counterargument already stated in the essay: "Admittedly, selling the lot would raise money for repaving the roads on the east side." Which choice is the strongest REBUTTAL?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That is a fair point, and the east-side roads badly need the money.' },
        { id: 'b', text: 'Selling the lot is simply the wrong choice, and the council should fund the garden instead.' },
        { id: 'c', text: 'Anyone who wants to sell the lot clearly does not care about the neighborhood at all.' },
        { id: 'd', text: 'Yet a sale pays for repaving once, while the garden that replaced a vacant lot in nearby Preston has supplied its food pantry every summer for nine years.', correct: true },
      ],
      expectedAnswer: 'Yet a sale pays for repaving once, while the garden that replaced a vacant lot in nearby Preston has supplied its food pantry every summer for nine years.',
      hints: [
        'A rebuttal has to ADD something: evidence, a hidden assumption, or a reason the other side of the scale is heavier. Which choice adds anything at all?',
        'One choice concedes and never turns back, one restates the claim louder, and one attacks the people instead of the argument.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-concede-outweigh',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "It is true that moving the first bell to 8:40 would push team practices past sunset on some winter afternoons. Even so, students would gain nearly an hour of sleep on every one of the one hundred eighty school nights, and sleep shapes far more of the day than the final half hour of practice does." Which choice best describes the move the writer makes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The writer concedes that the objection is genuinely true, then argues that a larger benefit outweighs it.', correct: true },
        { id: 'b', text: 'The writer denies the objection by proving that practices would not run past sunset.' },
        { id: 'c', text: 'The writer restates the original claim about the first bell in stronger language.' },
        { id: 'd', text: 'The writer grants the objection and does not return to defend the claim.' },
      ],
      expectedAnswer: 'The writer concedes that the objection is genuinely true, then argues that a larger benefit outweighs it.',
      hints: [
        'Track the two signal phrases: "It is true that" opens one move, and "Even so" opens the next.',
        'Ask whether the writer ever says the objection is false. If the objection stays true but stops mattering as much, that is the outweighing move.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mentioning-weakens',
      kind: 'misconception_check',
      question:
        'A student says: "I deleted my counterargument paragraph. Why would I hand the reader the best reason to disagree with me? Bringing up the other side just weakens my essay." What went wrong?',
      commonErrors: [
        {
          answer: 'Leaving out the opposing view so the argument sounds stronger',
          misconception: 'Believing that mentioning an objection introduces doubt, as though the reader would not have thought of it otherwise.',
          correctsTo:
            'The objection is already in the reader\'s mind — silence does not remove it, it just leaves it unanswered and makes you look like you either missed it or dodged it. Raising it yourself does two things you cannot do any other way: you get to state the objection in the form you can answer, and you get the last word on it. An argument that has survived its best challenge in public is more convincing than one that has never been tested.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name the strongest opposing view yourself — an unanswered objection in the reader\'s mind does more damage than one you raise and answer.',
        'Steel-man, never straw-man: state the objection the way a thoughtful opponent would state it, or defeating it proves nothing.',
        'Mark the handoff with concession language ("admittedly", "it is true that") and mark the return with a turn word ("however", "yet", "even so").',
        'Three rebuttal moves: counter-evidence, exposing a hidden assumption, or conceding the point and outweighing it. Restating your claim louder is none of them.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Counterargument & Rebuttal' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
