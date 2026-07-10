/**
 * AP English Language & Composition — CED Unit 2.4: Counterargument,
 * Concession, and Rebuttal.
 *
 * Builds on 2.3 (line of reasoning): a well-organized case still leaves an
 * opening if the writer never engages the strongest objection a thoughtful
 * opponent would raise. This topic trains naming a real counterargument (not
 * a straw man), conceding what is genuinely true in it, and rebutting
 * without abandoning that concession — the move that most raises a reader's
 * trust in the writer's judgment.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = Concession + Rebuttal parts summing to 6) this plan
 * follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. Henry's own handling of the
 * weakness objection ("They tell us... we are weak... when shall we be
 * stronger?") is the clearest concession-then-rebuttal move in the unit's
 * anchor texts. Quotes below are limited to the short structural phrases
 * already used elsewhere in the unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U2_COUNTERARGUMENT_REBUTTAL: LessonPlan = {
  id: 'evelyn.ap.englang.counterargument-rebuttal.v1',
  title: 'U2.4 Counterargument, Concession, and Rebuttal',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.counterargument-rebuttal',
      description:
        "Anticipate the strongest reasonable objection to a claim, concede what is genuinely true in it, and rebut it without abandoning the concession or the original position.",
      standard: 'AP-ENGLANG-2.4',
    },
  ],
  prerequisites: ['apenglang.line-of-reasoning-argument'],
  followUps: ['apenglang.intros-conclusions'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that ignoring the opposing view doesn\'t make it disappear — it just makes the reader wonder if the writer noticed it — before naming "counterargument."',
      script:
        "Picture a debate where you already suspect the other side has one genuinely strong point. You have two options: pretend it doesn't exist and hope the audience doesn't think of it, or bring it up yourself, admit it's real, and explain why it still doesn't change the outcome. The first option is a gamble — the moment anyone in the audience thinks of that objection on their own, they'll wonder if you noticed it and are hiding it, or just didn't think of it at all. The second option, done well, is one of the most persuasive moves available: naming the strongest opposing point yourself, before the reader can throw it at you, and showing why it doesn't overturn your case. Today we learn that move — counterargument, concession, and rebuttal — properly.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-counterargument-rebuttal',
      kind: 'concept',
      goal: 'Define counterargument, concession, and rebuttal; give the reliable paragraph shape; and name the two most common failures.',
      keyIdeas: [
        "A COUNTERARGUMENT is the strongest reasonable objection a thoughtful opponent could raise against your claim — not a weak, easily-dismissed version of the opposite view (a STRAW MAN), which persuades nobody because any alert reader can see it's been rigged to lose.",
        "A CONCESSION grants that part of the counterargument has real merit — it costs the writer nothing to admit a true point, and conceding it (rather than denying it) is what earns the writer credibility (ethos) to make the rebuttal that follows actually land.",
        "A REBUTTAL answers the counterargument WITHOUT abandoning the concession — it explains why the conceded point, real as it is, does not overturn the writer's overall position (a real cost is outweighed by a larger benefit, or a real problem has a specific, named solution).",
        "The reliable shape: NAME the counterargument specifically (not vaguely) → CONCEDE what's genuinely true in it → REBUT by explaining why the position still holds despite that truth. Skipping the concession and rushing to rebuttal reads as dismissive; skipping the rebuttal and only conceding reads as abandoning the claim.",
        "The #1 FAILURE is the STRAW MAN — inventing a weak version of the opposing view that's easy to knock down, instead of engaging the strongest real version. A rebuttal only earns credit for defeating an objection a real opponent would actually make.",
        "A close second failure is CONCEDING TOO MUCH — granting so much ground that the rebuttal which follows feels like an afterthought, leaving the reader more persuaded by the counterargument than by the writer's claim.",
        "Henry performs exactly this move against the objection an opponent in the room would actually raise: 'They tell us, sir, that we are weak' concedes the real fact of relative military weakness rather than denying it, then rebuts by reframing the terms of the comparison — 'when shall we be stronger?' and the numeric/providential appeal that follows — so the conceded weakness no longer determines the outcome.",
      ],
      vocabulary: [
        { term: 'counterargument', definition: "the strongest reasonable objection a thoughtful opponent could raise against a writer's claim." },
        { term: 'concession', definition: 'granting that part of a counterargument is genuinely true, without abandoning the overall position.' },
        { term: 'rebuttal', definition: 'the answer to a counterargument that explains why the position still holds despite a conceded true point.' },
        { term: 'straw man', definition: "a weak, easily-dismissed version of the opposing view, invented instead of engaging a real opponent's strongest case." },
        { term: 'ethos-through-concession', definition: 'the credibility a writer gains by honestly granting a true point before answering it.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-henry-concession-rebuttal',
      kind: 'worked_example',
      problem:
        "Build one body paragraph handling the strongest counterargument to the position (high schools should push start times to 8:30 a.m. or later): that shifting start times later creates real, costly logistics conflicts with athletics practice/game schedules and bus routes serving multiple schools, echoing how Henry concedes weakness before rebutting it (mentioned in prose here; this segment type carries no passageId field).",
      steps: [
        "NAME THE COUNTERARGUMENT SPECIFICALLY. Not a straw man ('some people just don't like change') but the real, strongest version: shifting start times later genuinely compresses the daylight window for athletics practice and complicates bus routes serving multiple schools on staggered schedules.",
        "CONCEDE WHAT IS TRUE. Grant, without hedging, that these logistics costs are real and that some districts have had to adjust practice start times or bus contracts to accommodate a later school start — echoing Henry's 'they tell us, sir, that we are weak,' where he concedes the fact rather than denying it.",
        "REFRAME THE TERMS OF THE COMPARISON (Henry's 'when shall we be stronger?' move). Ask what the alternative actually costs: keeping the earlier start time doesn't make the logistics problem disappear — it trades a solvable scheduling cost for an ongoing, unsolved safety and academic cost.",
        "REBUT WITH A SPECIFIC ANSWER, not just a reassertion of the original claim. Name how other districts have actually solved the logistics problem (staggered multi-tier bus routes, adjusted practice timing) to show the cost is manageable, not merely dismissed.",
        "WRITE THE PARAGRAPH IN THE RELIABLE SHAPE: name → concede → rebut, ending on the rebuttal so the paragraph doesn't trail off on the opponent's point.",
        "LINK BACK TO THE CLAIM. Close by tying the rebuttal back to why the original position still holds: a real, solvable cost does not outweigh an ongoing, unsolved harm.",
      ],
      answer:
        "The strongest objection to pushing start times later is a real one: shifting the school day compresses the daylight window for athletics practice and complicates bus routes that serve multiple schools on staggered schedules, and some districts have genuinely had to renegotiate practice times and bus contracts to make the change work. But conceding that cost is real is not the same as conceding that it should decide the outcome — keeping the earlier start time doesn't make the logistics problem vanish, it simply trades a one-time, solvable scheduling cost for an ongoing, unsolved safety and academic cost that recurs every single morning. Districts that have already made the shift have handled the logistics through staggered multi-tier bus routes and adjusted practice-start times, showing the cost is a manageable engineering problem, not an unanswerable objection. A real but solvable inconvenience does not outweigh a real and currently unsolved harm to students' safety and learning.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-concession-rebuttal',
      kind: 'try_yourself',
      problem:
        "Continuing the same essay, write ONE paragraph handling a DIFFERENT strong counterargument to the position (high schools should push start times to 8:30 a.m. or later): that working teenagers and students with after-school jobs or family caregiving responsibilities rely on the earlier release time a later start time would push back. Your paragraph must NAME the counterargument specifically (not a straw man), CONCEDE what is genuinely true in it, and REBUT without abandoning the concession. Do not simply restate your original claim in place of a real rebuttal.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'concession',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph names the specific, strongest version of the counterargument (students with after-school jobs or family caregiving duties depend on the current earlier release time, and a later start/later release could genuinely conflict with paid work schedules or younger siblings' pickup times) and concedes plainly that this cost is real, without hedging it into a straw man or minimizing it before the rebuttal has earned the right to. Partial credit for naming a vaguer or weaker version of the objection ('some students might not like it') or for a concession that is present but rushed/undercut before it's actually granted. No credit for no concession, or for a counterargument invented as a straw man that no real opponent would raise.",
            modelResponse:
              "A real and specific cost of pushing start times later is that students who work after-school jobs, or who pick up younger siblings, rely on the current earlier release time, and a later schedule could genuinely conflict with employers' shift start times or family caregiving windows that don't move just because the school bell does.",
          },
          {
            criterionId: 'rebuttal',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary rebuts the conceded point WITHOUT abandoning it — e.g., by naming a specific accommodation (staggered release times, flexible attendance policies for documented caregiving conflicts, coordination with local employers) or by reframing the comparison (the current schedule already forces a tradeoff between sleep and responsibilities; a later start shifts, rather than creates, that tradeoff toward a schedule aligned with adolescent sleep needs) — and explains why the position still holds despite the real cost. Partial credit for a rebuttal that reasserts the original claim without a specific answer to the conceded point, or that undercuts the concession by minimizing it rather than answering it. No credit for no rebuttal, or a rebuttal that ignores the concession entirely.",
            modelResponse:
              "But that conflict is not new — it already exists under the current schedule, which forces the same students to choose between enough sleep and their work or family obligations; shifting the start time doesn't create the tradeoff, it relocates it toward hours better aligned with how adolescents actually sleep, and schools that have made the change have paired it with flexible attendance policies for documented work or caregiving conflicts rather than leaving affected students to absorb the cost alone.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-vague-dismissal',
      kind: 'misconception_check',
      question:
        'A student writes: "Some people might complain about later start times, but they\'re wrong and the benefits clearly outweigh whatever they\'re worried about." Is this an effective way to handle a counterargument?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating a vague, dismissive gesture at an unnamed objection ('some people... whatever they're worried about') — with no real concession — as if it were a counterargument-concession-rebuttal sequence.",
          correctsTo:
            "No — this names no SPECIFIC counterargument (what, exactly, are 'they' worried about?), concedes nothing (there's no admission any real cost exists), and 'they're wrong' is an assertion, not a rebuttal. This is the STRAW MAN failure in its vaguest form: an opponent so undefined they can't actually be answered. A reader who knows the real objection (logistics costs, or working students' schedules) will notice it was never engaged, which undercuts the writer's credibility rather than building it. The fix: name the objection specifically, concede what's true in it, then give a specific reason the position still holds despite that truth — 'wrong' with no explanation convinces nobody who wasn't already convinced.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A counterargument is the strongest reasonable objection a real opponent would raise — a straw man persuades nobody.",
        "A concession honestly grants what's true in the counterargument; conceding a real point builds credibility rather than losing the argument.",
        "A rebuttal answers the counterargument WITHOUT abandoning the concession — it explains why the conceded point doesn't overturn the position.",
        "Reliable shape: name specifically → concede honestly → rebut with a specific answer, ending on the rebuttal.",
        "Watch for two failures: the straw man (a weak fake opponent) and conceding too much (granting so much ground the rebuttal reads as an afterthought).",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.4',
    cedTitle: 'Counterargument, Concession, and Rebuttal',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '2',
        note: 'AP English Language and Composition Course and Exam Description, Unit 2 — anticipating and answering opposing views through concession and rebuttal.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — model of conceding a real objection (weakness) before rebutting it.',
      },
    ],
  },
};
