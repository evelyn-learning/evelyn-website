/**
 * HS English — Argument & Rhetoric: Claims, Evidence & Reasoning.
 *
 * The engine of every argument you will write this year (CCSS W.9-10.1,
 * RI.9-10.8): what makes a claim arguable, which evidence actually
 * supports THIS claim, and the reasoning that spells out the link. All
 * excerpts are short ORIGINAL prose written for this lesson — no
 * copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U5_CLAIMS_AND_EVIDENCE: LessonPlan = {
  id: 'evelyn.hs.engl.claims-and-evidence.v1',
  title: 'Claims, Evidence & Reasoning',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.claims-and-evidence',
      standard: 'ENGL-5.1',
      description:
        'Identify and write an arguable, specific claim, select evidence that genuinely supports that particular claim rather than merely sharing its topic, and articulate the reasoning that links the evidence to the claim (CCSS W.9-10.1, RI.9-10.8).',
    },
  ],
  prerequisites: ['engl.commonly-confused-words'],
  followUps: ['engl.rhetorical-appeals'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Students already argue constantly — name the three-part machinery they use badly, then aim it at written argument.',
      script:
        'You argue every week. You ask for a later curfew, you talk a friend out of a bad movie, you pitch a club idea to the student council. And you already know the difference between an argument that lands and one that dies, because the ones that die sound like this: "You should extend my curfew because I am responsible." That is a claim with no evidence, or evidence with no explanation. Real arguments have three moving parts — the claim, the evidence, and the reasoning that welds them together. Today we take those parts apart, because everything we build in this unit, including counterargument, sits on top of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cer',
      kind: 'concept',
      goal: 'Arguable claims, the evidence hierarchy, the relevance test, reasoning as the spelled-out link, and the claim-shift trap.',
      keyIdeas: [
        'A CLAIM IS ARGUABLE — a claim is a statement a reasonable person could disagree with. "Our school day starts at 7:40" is a FACT (checkable, not arguable). "Early school days are unpleasant" is an OPINION (personal taste, nothing to prove). "Our school should push its start time to 8:30" is a CLAIM — someone could argue the other side, and evidence could settle it.',
        'A CLAIM IS SPECIFIC — vague claims cannot be supported because nobody can tell what would count as proof. "Sleep is important" commits to nothing. "Teenagers who get eight hours of sleep perform better in first-period classes" names exactly what evidence must show.',
        'EVIDENCE TYPES, ROUGHLY STRONGEST TO WEAKEST — statistics and study findings (broad, measurable), documented facts (verifiable, but thin on their own), expert testimony (borrowed authority — only as good as the expert), specific examples (concrete and vivid), and anecdotes (one person\'s experience — memorable, easiest to dismiss). Strong arguments mix types; weak ones lean on anecdote alone.',
        'THE RELEVANCE TEST — before you use a piece of evidence, ask: does this support THIS claim, or just this TOPIC? Evidence about the general subject is not automatically evidence for your particular assertion. Say the claim out loud, then say the evidence out loud, then ask whether the second makes the first more likely to be true.',
        'REASONING IS THE WARRANT — reasoning is the sentence you write that explains WHY the evidence proves the claim. It is the part students skip, because the connection feels obvious to the person who already believes it. It never feels obvious to the reader. If your evidence is a survey result and your claim is about school policy, the reasoning has to say what the survey result implies for policy.',
        'RESTATING IS NOT REASONING — "This statistic shows that students need more sleep" merely repeats the claim next to the evidence. Real reasoning adds the missing link: "Because the drop in scores appears only in first period and not in later classes, the cause is likely the hour, not the difficulty of the material."',
        'THE CLAIM-SHIFT TRAP — the most common failure in real argument writing: evidence that supports a NEARBY but different claim. Your claim is about the start time; your evidence proves that sleep matters. Those are cousins, not the same claim. Watch for the moment your evidence quietly changes the subject.',
        'THE THREE-PART CHECK — for every paragraph you write, be able to point at the claim, point at the evidence, and point at the reasoning. If you cannot point at all three, the paragraph is incomplete, no matter how good it sounds.',
      ],
      vocabulary: [
        { term: 'arguable claim', definition: 'a specific, debatable assertion that evidence could support or undercut — not a checkable fact and not a matter of pure taste.' },
        { term: 'reasoning', definition: 'the explicit explanation of why a given piece of evidence makes a given claim more likely to be true; also called the warrant.' },
        { term: 'relevance', definition: 'the property of evidence that bears on the specific claim being made, not merely on the same general topic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-chain',
      kind: 'worked_example',
      problem:
        'Build a claim-evidence-reasoning chain from this scenario: "The Hillcrest High student council wants the library kept open until 6 p.m. A district survey found that 62 percent of Hillcrest students who work after-school jobs finish their homework after 8 p.m. The library currently closes at 3:30 p.m., fifteen minutes after dismissal."',
      steps: [
        'Draft the claim and test it for arguability: "Hillcrest should keep the library open until 6 p.m." A reasonable person could argue against it (cost, staffing), and evidence could settle it. It passes.',
        'Check the claim for specificity: it names the school, the change, and the hour. Compare with a vague version — "the library should be more available" — which commits to nothing and therefore cannot be proved.',
        'Select the evidence and run the relevance test: the survey statistic is about WHEN students can do schoolwork, and the closing time is about WHEN the building is open. Both bear on the gap between student need and available hours, so both support this claim, not just the topic of libraries.',
        'Write the reasoning — the link the reader cannot supply alone: because the library closes fifteen minutes after dismissal, it is shut during every hour the surveyed students are actually free to study, so the current schedule serves the students who need the space least.',
        'Assemble and read it back: claim, then evidence, then reasoning. If you can point at all three sentences, the chain is complete.',
      ],
      answer:
        'Claim: Hillcrest should keep the library open until 6 p.m. Evidence: the district survey (62 percent of working students finish homework after 8 p.m.) plus the 3:30 p.m. closing time. Reasoning: the building is closed during exactly the hours those students are free, so the current schedule excludes the students with the greatest need.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-claim-shift',
      kind: 'worked_example',
      problem:
        'A student argues: "Our school should replace paper permission slips with an online form. A district survey found that 88 percent of Hillcrest families own a smartphone." The evidence is true and on-topic. Why does the argument still fail?',
      steps: [
        'State the exact claim: the school should SWITCH TO an online permission form. Not that families own phones, and not that phones are useful.',
        'State what the evidence actually proves: that most families have the device required. That is a precondition for the switch, not a reason to make it.',
        'Name the failure: this is the claim-shift trap. The evidence supports a nearby claim — "an online form would be technically feasible for most families" — which is a different sentence from "the school should switch."',
        'Notice what is missing: nothing here shows the paper system is failing. No lost slips, no missed deadlines, no cost. Feasibility answers "could we?"; the claim asked "should we?"',
        'Repair it two ways. Either narrow the claim to match the evidence ("an online form would be accessible to most Hillcrest families"), or add evidence that fits the original claim (a count of permission slips lost each semester) plus reasoning that connects lost slips to the case for switching.',
      ],
      answer:
        'The evidence proves feasibility ("could we?"), while the claim asserts a course of action ("should we?") — a claim shift. Either narrow the claim to feasibility or add evidence that the paper system is failing.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-arguable-claim',
      kind: 'try_yourself',
      problem: 'Which of these is an arguable claim — the kind of statement an argument essay could be built on?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Hillcrest cafeteria serves lunch in three separate periods.' },
        { id: 'b', text: 'Hillcrest should shorten its lunch periods and add a fourth, because crowding is measurably worse in the current three.', correct: true },
        { id: 'c', text: 'The cafeteria pizza tastes better than the pasta.' },
        { id: 'd', text: 'School lunch is an important part of the school day.' },
      ],
      expectedAnswer: 'Hillcrest should shorten its lunch periods and add a fourth, because crowding is measurably worse in the current three.',
      hints: [
        'An arguable claim can be disagreed with AND settled with evidence. Which options are simply checkable facts, and which are pure taste?',
        'Option (a) is a fact anyone could verify, (c) is personal taste with nothing to prove, and (d) is too vague to test. Only one names a specific position someone could oppose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-evidence',
      kind: 'try_yourself',
      problem:
        'Claim: "Hillcrest should move its after-school tutoring from the gym lobby to the library, because the lobby is too noisy for students to concentrate." Which evidence best supports THIS claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A district survey found that 71 percent of students who attended lobby tutoring said they could not hear their tutor over practice noise.', correct: true },
        { id: 'b', text: 'Attendance at after-school tutoring has risen every year since the program began.' },
        { id: 'c', text: 'Educational researchers agree that tutoring improves student performance in mathematics.' },
        { id: 'd', text: 'The library has thirty tables and reliable wireless access.' },
      ],
      expectedAnswer: 'A district survey found that 71 percent of students who attended lobby tutoring said they could not hear their tutor over practice noise.',
      hints: [
        'The claim is not that tutoring is good or that the library is nice — it is that the LOBBY IS TOO NOISY to work in. Which choice speaks to that?',
        'Options (b) and (c) support tutoring in general, and (d) supports a nearby claim about the library being adequate. Only one addresses the noise problem the claim names.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-missing-reasoning',
      kind: 'try_yourself',
      problem:
        'Read this paragraph: "The school should add covered bike racks. A district survey found that 40 percent of Hillcrest students who live within a mile of campus are driven to school." What reasoning is missing between the evidence and the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An explanation that covered racks would remove a barrier for nearby students who could bike but currently ride in cars', correct: true },
        { id: 'b', text: 'A statement that this statistic proves the school needs covered bike racks' },
        { id: 'c', text: 'A note that many students in the district live close to their schools' },
        { id: 'd', text: 'A sentence explaining that biking to school is healthier than riding in a car' },
      ],
      expectedAnswer: 'An explanation that covered racks would remove a barrier for nearby students who could bike but currently ride in cars',
      hints: [
        'Reasoning explains WHY the number makes the proposal a good idea. Ask what a skeptical reader still does not see.',
        'Option (b) only restates the claim beside the evidence, and (c) and (d) drift to nearby points. The gap is between "students who could bike are driven" and "racks would change that."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-more-evidence',
      kind: 'misconception_check',
      question:
        'A student defends a paragraph: "I stacked five pieces of evidence under my claim about later start times — two surveys, a sleep study, a quotation from a pediatrician, and my cousin\'s experience. Five beats two, so this paragraph is strong." What went wrong?',
      commonErrors: [
        {
          answer: 'More evidence automatically makes an argument stronger',
          misconception: 'Confusing the QUANTITY of evidence with its relevance and its connection to the specific claim.',
          correctsTo:
            'Volume is not strength. Each piece must pass the relevance test — does it support THIS claim, or only its topic? Three of those sources may prove that sleep matters, which is a nearby claim, not the claim that the start time should change. Two well-chosen pieces with explicit reasoning beat five on-topic pieces with none.',
        },
        {
          answer: 'On-topic evidence counts as support for the claim',
          misconception: 'Treating shared subject matter as proof, the claim-shift trap.',
          correctsTo:
            'On-topic is not on-claim. Say the claim aloud, then the evidence, then ask whether the evidence makes that exact sentence more likely to be true. If the honest answer is "it supports something close to it," the evidence belongs to a different claim.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A claim must be arguable and specific — not a checkable fact, not pure taste, not too vague to test.',
        'Evidence types vary in strength: statistics and study findings carry more weight than a single anecdote, and strong arguments mix types.',
        'Run the relevance test on every piece: does it support THIS claim, or merely this topic?',
        'Reasoning is the sentence that spells out why the evidence proves the claim — restating the claim is not reasoning.',
        'Watch for the claim shift: evidence that quietly supports a nearby but different claim is the most common failure in argument writing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Claims, Evidence & Reasoning' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
