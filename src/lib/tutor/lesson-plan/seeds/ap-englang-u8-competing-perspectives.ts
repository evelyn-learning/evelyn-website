/**
 * AP English Language & Composition — CED Unit 8.2: Synthesizing Competing
 * Perspectives.
 *
 * Builds on 8.1 (assessing whether a source is credible enough to use): once
 * a student trusts two sources, the next problem is that credible sources
 * can genuinely DISAGREE. This topic teaches the three legitimate moves for
 * handling real disagreement — weighing one perspective as more persuasive,
 * reconciling the apparent conflict, or synthesizing a new claim out of the
 * tension — and names the false-choice trap of picking a side and ignoring
 * the other, plus the straw-man trap of misrepresenting the side you argue
 * against.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = Evidence + Commentary parts summing to 6) this plan
 * follows.
 *
 * Anchor texts: Frederick Douglass, "What to the Slave Is the Fourth of
 * July?" (1852) — evelyn.passage.douglass-fourth-of-july.v1 (primary
 * passageId) — contrasted with Patrick Henry, "Give Me Liberty or Give Me
 * Death" (1775) — evelyn.passage.henry-give-me-liberty.v1, discussed in
 * prose as the second, genuinely competing perspective on American liberty.
 * The teaching point is the rhetorical MOVE of handling disagreement, not
 * the atrocity content Douglass's speech condemns — quotes below are limited
 * to the short structural/rhetorical phrases already used as anchor evidence
 * for these speeches elsewhere in the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U8_COMPETING_PERSPECTIVES: LessonPlan = {
  id: 'evelyn.ap.englang.competing-perspectives.v1',
  title: 'U8.2 Synthesizing Competing Perspectives',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.competing-perspectives',
      description:
        'Synthesize sources that genuinely disagree by accurately characterizing each perspective on its own terms, then weighing, reconciling, or building a new claim from the tension — rather than forcing a false choice between them or misrepresenting the side argued against.',
      standard: 'AP-ENGLANG-8.2',
    },
  ],
  prerequisites: ['apenglang.source-credibility-bias', 'apenglang.integrating-evidence'],
  followUps: ['apenglang.qualifying-with-sources'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between silencing a disagreeing witness and using the disagreement itself as the story.',
      script:
        "Imagine two credible eyewitnesses to the same car accident give genuinely different accounts of who had the right of way. A weak investigator picks whichever witness they like better and pretends the other one didn't say anything. A good investigator asks: is one account actually more reliable here, does the disagreement dissolve once you check exactly what each witness could see, or does the disagreement itself reveal something true — maybe the intersection is dangerously ambiguous? Sources in a synthesis essay that genuinely disagree deserve the same three options: weigh them, reconcile them, or let the tension between them BE your evidence. Picking a side and pretending the other source doesn't exist is the one move that's off the table.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-handling-disagreement',
      kind: 'concept',
      goal: 'Define genuine disagreement between sources and the three legitimate ways to handle it, and flag the false-choice and straw-man traps.',
      keyIdeas: [
        "SOURCES GENUINELY DISAGREEING is different from sources simply covering different topics — competing perspectives answer a SHARED question differently (e.g. 'what does America's promise of liberty require, and of whom?').",
        "STEP ONE, ALWAYS: characterize EACH perspective accurately, on its own terms, before weighing them. Test: could that source's author read your summary of their position and recognize it as fair? If not, you've built a STRAW MAN — a distorted version of the position that's easy to defeat but isn't the real one.",
        "THREE LEGITIMATE WAYS TO HANDLE GENUINE DISAGREEMENT: (1) WEIGH — argue, with reasons, that one perspective is more persuasive or accurate FOR THIS SPECIFIC ISSUE; (2) RECONCILE — show the apparent conflict dissolves once you look closer (different scope, different moment, different audience — each source is right about a different piece); (3) SYNTHESIZE A NEW CLAIM — use the TENSION between the sources itself as evidence for a claim neither source states on its own (the most sophisticated move, developed further in 8.4).",
        "THE FALSE-CHOICE TRAP: treating disagreement as a binary you must resolve by picking one source and discarding the other. Real disagreement between credible sources is usually productive, not a problem to make disappear.",
        "An essay that only cites sources already agreeing with its thesis is WEAKER than one that engages a source that pushes back — genuinely wrestling with disagreement is what makes a position defensible rather than one-sided.",
        "Reconciling disagreement often means noticing the sources are answering slightly different versions of the question — different scope, different moment in time, different audience — so that each is accurate about its own piece even though they sound opposed at first.",
      ],
      vocabulary: [
        { term: 'competing perspectives', definition: 'sources that answer a shared question differently, rather than simply covering different topics.' },
        { term: 'straw man', definition: "a distorted, easy-to-defeat version of an opposing source's actual position." },
        { term: 'weigh', definition: 'arguing with reasons that one perspective is more persuasive or accurate for the specific issue at hand.' },
        { term: 'reconcile', definition: 'showing that an apparent disagreement dissolves once each source\'s scope, moment, or audience is examined closely.' },
        { term: 'false-choice trap', definition: 'treating genuine disagreement as a binary that must be resolved by discarding one source entirely.' },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reconcile-henry-douglass',
      kind: 'worked_example',
      problem:
        "Henry (1775, mentioned here in prose — this segment type carries no passageId field; the resolved text is evelyn.passage.henry-give-me-liberty.v1) frames liberty as a birthright under active threat that must be seized immediately through force — \"we must fight!\" Douglass (1852, evelyn.passage.douglass-fourth-of-july.v1), addressing the same national ideal decades later, argues that the liberty Henry's generation fought for and won was never actually extended to enslaved Americans — \"this Fourth of July is yours, not mine.\" Reconcile the tension between these two perspectives for a synthesis essay.",
      steps: [
        "CHARACTERIZE HENRY'S PERSPECTIVE ACCURATELY, ON ITS OWN TERMS. To Henry, liberty is a birthright under external threat (from Britain) that must be defended NOW through force; his argument assumes that winning the fight secures liberty for those fighting it.",
        "CHARACTERIZE DOUGLASS'S PERSPECTIVE ACCURATELY, ON ITS OWN TERMS. To Douglass, the liberty that generation won and now celebrates was never actually extended to enslaved Americans — the holiday marking that victory is, from his position, \"a sham.\"",
        "NAME WHAT THE TWO ACTUALLY AGREE ON BENEATH THE SURFACE DISAGREEMENT. Both treat liberty as something requiring active demand rather than automatic possession — Henry demands it from an external oppressor; Douglass demands it from a nation that already claims to have secured it.",
        "RECONCILE RATHER THAN PICKING A SIDE. The two perspectives are not strictly contradictory — they are sequential: Henry's generation won the promise in principle from Britain; Douglass exposes that winning a promise in principle does not automatically make it real for everyone the promise claims to cover.",
        "STATE THE RECONCILED CLAIM THE TENSION PRODUCES. Liberty, once secured in principle by one generation's fight, does not distribute itself automatically to everyone it claims to include — each excluded group has had to re-fight, in its own terms, a version of the very battle Henry describes.",
      ],
      answer:
        "Henry and Douglass are not simply contradicting each other — Henry shows liberty being WON in principle through urgent, immediate action; Douglass shows that winning it in principle for one group does not automatically extend it in practice to another. Reconciled, the two perspectives reveal that securing liberty is not a single, completed event but a promise that has to be re-fought, on its own terms, by whoever it excludes.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-competing-perspectives-paragraph',
      kind: 'try_yourself',
      problem:
        "Using Douglass's 1852 speech (evelyn.passage.douglass-fourth-of-july.v1) and Patrick Henry's 1775 speech (his climactic line \"we must fight!\" is the relevant detail if you need a reminder), write ONE paragraph that engages the genuine tension between Henry's view that liberty is a birthright secured through immediate, decisive action and Douglass's view that the liberty Henry's generation won was never actually extended to enslaved Americans. Do NOT simply pick a side — either weigh one perspective as more persuasive, reconcile the apparent conflict, or synthesize a new claim from the tension. Include commentary explaining explicitly HOW you are handling the disagreement.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted or precisely-named evidence from BOTH perspectives — Henry's demand that \"we must fight\" (or his declaration that \"there is no longer any room for hope\") AND Douglass's characterization of the holiday as belonging to others (\"this Fourth of July is yours, not mine\" or the celebration as \"a sham\" from the enslaved person's vantage) — each characterized fairly and accurately on its own terms. Partial credit (1-2) for evidence from only one perspective, or evidence from both that is vague, misattributed, or that caricatures one side. No credit for no evidence, evidence that misquotes either passage, or evidence irrelevant to the stated tension.",
            modelResponse:
              "Henry insists \"we must fight!\" because \"there is no longer any room for hope\" of a peaceful resolution, treating liberty as a birthright to be seized through immediate force; Douglass, addressing the nation Henry's generation won that fight for, tells his audience plainly that \"this Fourth of July is yours, not mine\" — the liberty secured was never actually extended to people like him.",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explicitly names WHICH of the three legitimate moves is being used (weighing, reconciling, or synthesizing a new claim) and executes it — e.g. reconciling by showing the two views describe sequential stages of the same struggle (winning liberty in principle vs. extending it in practice) rather than truly opposing claims, or synthesizing a new claim that liberty must be re-fought by whoever it excludes. Must NOT simply declare one source wrong without engaging its actual position (straw-manning), and must NOT retreat into 'both sides have a point' with no developed reasoning. Partial credit for commentary that gestures at handling the disagreement but doesn't clearly execute weigh/reconcile/synthesize, or that handles only one source's implications. No credit for commentary that picks a side while ignoring or distorting the other, or that is absent/reduced to summary.",
            modelResponse:
              "Read side by side, the two are not really contradicting each other so much as describing two stages of the same unfinished struggle: Henry shows a generation winning liberty in principle through urgent action, while Douglass shows that winning it in principle did not extend it in practice to everyone the new nation claimed to cover. Reconciled this way, the disagreement itself becomes evidence that liberty, once secured for one group, still has to be re-fought — in its own terms — by whoever it excludes.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-false-choice',
      kind: 'misconception_check',
      question:
        'A student writes: "Since Henry and Douglass clearly disagree about liberty, I\'ll just use whichever one supports my thesis and leave the other one out of my essay." Is this a sound approach to competing sources?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'The FALSE-CHOICE TRAP: treating genuine disagreement between credible sources as a binary that must be resolved by discarding one source entirely.',
          correctsTo:
            "No — silently dropping the source that complicates your thesis doesn't make the disagreement disappear; it just leaves your essay vulnerable to a reader who knows the other source exists. A stronger move is to actually engage the tension: weigh which perspective is more persuasive here and say why, reconcile the apparent conflict by showing each source is accurate about a different piece of the issue, or build a new claim out of the disagreement itself. The test: would your thesis survive a reader bringing up the source you left out? If not, the missing source needed to be engaged, not deleted.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Competing perspectives answer a shared question differently — always characterize each side accurately, on its own terms, before weighing them.',
        'Three legitimate moves for genuine disagreement: weigh one as more persuasive, reconcile the apparent conflict, or synthesize a new claim from the tension.',
        'The false-choice trap: picking a side and silently dropping the disagreeing source instead of engaging it.',
        'The straw-man trap: misrepresenting an opposing source to make it easier to defeat — test it against whether that source\'s author would recognize your summary as fair.',
        'A source that pushes back on your thesis is an asset, not a threat — engaging it honestly is what makes a position defensible.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.2',
    cedTitle: 'Synthesizing Competing Perspectives',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
