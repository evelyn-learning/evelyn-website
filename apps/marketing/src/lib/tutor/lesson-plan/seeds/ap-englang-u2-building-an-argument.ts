/**
 * AP English Language & Composition — CED Unit 2.1: Building an Argument.
 *
 * Opens Unit 2 (the Argument Essay) and pivots the student's role: Unit 1
 * trained reading someone else's rhetorical choices; Unit 2 trains
 * constructing an original argument. The foundational move here is writing a
 * defensible CLAIM/POSITION on a real issue the student is choosing to
 * defend — the same three tests as a text-analysis thesis (1.3: arguable,
 * responsive, specific), now aimed at the student's own upcoming essay
 * rather than at someone else's text.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1, used here as a model of what a
 * defensible, specific, arguable position looks like in a real argument.
 * Quotes below are limited to the short structural/climactic phrases already
 * used elsewhere in the unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U2_BUILDING_AN_ARGUMENT: LessonPlan = {
  id: 'evelyn.ap.englang.building-an-argument.v1',
  title: 'U2.1 Building an Argument',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.building-an-argument',
      description:
        'Write a defensible claim that stakes out an arguable, specific position on a real-world issue, suitable to build an original argument essay — as distinct from a thesis analyzing someone else\'s rhetorical choices.',
      standard: 'AP-ENGLANG-2.1',
    },
  ],
  prerequisites: ['apenglang.defensible-thesis'],
  followUps: ['apenglang.selecting-evidence'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the shift from judging someone else\'s argument to constructing their own, before naming "position."',
      script:
        "In Unit 1, you played judge: reading someone else's speech and deciding what the writer was doing and why. Starting today, you're the one making the case. An argument essay isn't about analyzing a stranger's rhetorical choices — it's about YOU staking out a position on a real issue and defending it as if you were the one standing at the podium. Nobody hands you Patrick Henry's speech to react to this time; you have to build your own claim, from scratch, sturdy enough to survive someone pushing back on it. Today we learn that first move: writing a defensible position for an argument that's entirely your own.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-building-an-argument',
      kind: 'concept',
      goal: 'Define a defensible position for an original argument, distinguish it from a text-analysis thesis and from a bare preference, and give students a repeatable test.',
      keyIdeas: [
        "AN ARGUMENTATIVE CLAIM (or POSITION) is the arguable stance YOUR essay will defend on a real issue — not a claim ABOUT someone else's text. The three tests from 1.3 still apply — arguable, responsive, specific — but 'responsive' now means responsive to the ISSUE and prompt you were given, not to a passage.",
        "AN ISSUE must be narrowed before you can take a position on it. 'Should schools care about sleep?' is too broad to defend in one essay. 'Should high schools push start times to 8:30 a.m. or later?' is narrow enough that a position can actually be built and defended within an essay's length.",
        "A DEFENSIBLE POSITION requires a genuine LIVE COUNTER-POSITION — a reasonable, informed person could actually hold the opposite view for real reasons, not just a straw man. If nobody sane would disagree, you have a preference, not an argumentative claim ('bullying is bad' isn't arguable; 'schools should adopt this specific anti-bullying policy over that one' is).",
        "SCOPE still governs specificity: a strong position doesn't just say 'do something about X' — it commits to a specific, stated action or judgment that a reader could actually push back on point by point.",
        "A position sentence often plants the seed of the REASONS to come, without spelling all of them out yet — that's the difference between a position and a bare opinion. 'Schools should push start times later because teenage sleep science makes early starts counterproductive' previews a reasoning path; 'schools should push start times later' alone does not.",
        "The classical appeals you learned to IDENTIFY in Unit 1 (ethos, pathos, logos) now become tools YOU choose deliberately: which appeal does this specific issue and audience most need? A position defended mostly with data needs different framing than one leaning on a moral appeal.",
        "Patrick Henry's climactic claim — that armed resistance was no longer one option among several but the only remaining course — models the shape: a specific, arguable position, responsive to the exact question the Convention faced, that previews the reasoning (petitions failed, delay only weakens) still to come.",
      ],
      vocabulary: [
        { term: 'argumentative claim', definition: 'the arguable stance an original essay is built to defend on a real issue, as opposed to a claim about someone else\'s text.' },
        { term: 'issue', definition: 'the real-world question or controversy a position is taken on — usually needs narrowing before it is defensible.' },
        { term: 'scope', definition: "how broad or narrow a position's claim is — too broad to defend in one essay, or narrow enough to commit to a specific stance." },
        { term: 'live counter-position', definition: 'a real, reasonable opposite view an informed person could actually hold — what makes a position arguable rather than a preference.' },
        { term: 'working thesis', definition: 'a defensible position stated early enough to guide the essay, even before every supporting reason is fully worked out.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-position-triage',
      kind: 'worked_example',
      problem:
        "Three candidate positions are proposed for the issue: 'Should high schools push start times to 8:30 a.m. or later for students?' Candidate A: 'This essay will look at the pros and cons of school start times.' Candidate B: 'Later start times would be a really positive change for students.' Candidate C: 'Because chronic sleep deprivation measurably impairs teenagers' attention, mood, and driving safety, high schools should push start times to 8:30 a.m. or later, even if that requires adjusting athletics and bus schedules.' Triage all three the way you'd triage a rhetorical thesis in Unit 1.",
      steps: [
        "TEST CANDIDATE A AGAINST 'ARGUABLE.' It only announces a topic and a structure ('pros and cons') — nobody could disagree with a plan to discuss something. This is the RESTATEMENT trap carried over from thesis-writing: no position has actually been taken yet.",
        "TEST CANDIDATE B AGAINST 'SPECIFIC.' 'Really positive change' names a feeling, not a defensible claim — positive HOW, compared to WHAT cost? This is the VAGUE EVALUATION trap: it sounds like a stance but gives the essay nothing concrete to defend.",
        "TEST CANDIDATE C AGAINST ALL THREE TESTS. Arguable? Yes — a reasonable reader could favor keeping earlier start times for athletics, logistics, or parents' work schedules, so a real counter-position exists. Responsive? Yes — it directly answers the exact policy question asked. Specific? Yes — it commits to a concrete action (push to 8:30 a.m. or later) and previews the reasoning (sleep science) that will carry the essay.",
        "NOTICE WHAT MAKES C DIFFERENT FROM A UNIT-1 THESIS. In Unit 1 you'd defend a claim about what Henry's rhetorical question DOES. Here you're defending a claim about what SHOULD HAPPEN in the world — the tests are the same shape, but the content is your own judgment, not an analysis of someone else's choices.",
        "CHECK C AGAINST THE 'LIVE COUNTER-POSITION' TEST. Could an informed adult genuinely argue the opposite — that shifting start times creates unworkable transportation and athletics conflicts? Yes. That live disagreement is exactly what makes C worth defending in an essay, rather than a fact everyone already accepts.",
        "CONCLUDE which candidate to adopt and state the general rule: a defensible position commits to a specific action or judgment, survives a real counter-position, and previews — without fully unpacking — the reasoning that will follow.",
      ],
      answer:
        "Candidate C is the defensible position. A commits the restatement trap (no stance taken); B commits the vague-evaluation trap (a feeling, not a claim). C passes all three tests, commits to a specific action, survives a genuine counter-position, and previews the reasoning to come — exactly the shape a defensible position for an original argument needs.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-position',
      kind: 'try_yourself',
      problem:
        "You are building an original argument essay on this issue: 'Should high schools push start times to 8:30 a.m. or later for students?' Write ONE sentence stating a defensible position you would build your entire essay around. Your position must be arguable (a reasonable, informed person could hold the opposite view), specific (commits to a concrete stance, not a vague feeling), and should preview at least a hint of the reasoning that would support it. Do not merely restate the issue as a topic, and avoid a vague evaluation with no real content.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'position',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): a single sentence that commits to a specific, arguable stance on the school-start-times issue (whether that start times should move later, stay as they are, or some other specific stance), survives a genuine live counter-position, and previews at least one concrete reason that would anchor the essay's line of reasoning (e.g., sleep science, safety data, academic performance, or — for the opposing stance — logistics/athletics/family-schedule costs). Partial credit for a position that is arguable and specific but previews no reasoning at all, or that gestures at reasoning too vaguely to preview an actual line of reasoning ('for good reasons'). No credit for a sentence that restates the issue as a topic to be discussed, offers a vague evaluation ('this would be good/bad') with no committed stance, or is not genuinely arguable (a claim virtually nobody would contest).",
            modelResponse:
              "Because chronic sleep deprivation measurably impairs teenagers' attention, mood, and safety behind the wheel, high schools should push start times to 8:30 a.m. or later, even if that means renegotiating after-school athletics and bus schedules.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-preference-vs-claim',
      kind: 'misconception_check',
      question:
        'A student writes as their position: "I think school should start later because mornings are hard for teenagers." Is this a defensible position ready to build an essay around?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Mistaking a PERSONAL PREFERENCE with a first-person feeling attached ('I think... hard for teenagers') for an ARGUMENTATIVE CLAIM — the argument-writing version of the vague-evaluation trap.",
          correctsTo:
            "Not yet — 'mornings are hard' names a feeling, not a specific, defensible reason, and 'I think' signals opinion rather than a claim built to withstand pushback. The test: would your sentence give a reader something specific to push back against? 'Mornings are hard' invites the response 'so what, mornings are hard for everyone' — there's no specific mechanism to defend. A sharpened version names the actual mechanism and a concrete stance: 'Because chronic sleep deprivation measurably impairs teenage attention and safety, schools should push start times later.' That version gives a reader something specific to agree or disagree with.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A defensible position (claim) for your own argument passes the same three tests as a text-analysis thesis — arguable, responsive, specific — but responds to a real-world issue and prompt, not someone else's rhetorical choices.",
        "Narrow the issue before taking a position: broad issues can't be defended in the space of one essay.",
        "A defensible position survives a genuine LIVE counter-position — if no reasonable person could disagree, it's a preference, not a claim.",
        "A strong position previews (without fully unpacking) the reasoning that will carry the essay — a bare stance with no hinted reasons gives the reader nothing to anticipate.",
        "Watch for two traps carried over from thesis-writing: restating the issue as a topic, and a vague evaluation ('this would be good') with no specific, defensible content.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.1',
    cedTitle: 'Building an Argument',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '2',
        note: 'AP English Language and Composition Course and Exam Description, Unit 2 — writing a defensible claim/position for an original argument essay (Row A of the real Argument-essay rubric).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — used as a model of a specific, arguable, well-scoped position.',
      },
    ],
  },
};
