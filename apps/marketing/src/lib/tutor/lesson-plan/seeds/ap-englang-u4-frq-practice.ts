/**
 * AP English Language & Composition — Unit 4 FRQ Practice: a second full
 * Rhetorical Analysis essay (AP Lang Free-Response Question 2), this time
 * on a satirical/ironic text rather than the Unit-1 anchor.
 *
 * This is the FRQ-practice plan (see project catalog convention) that
 * closes out Unit 4: after methods of development (4.1), framing analysis
 * with strong intros/conclusions (4.2), diction and tone (4.3), and
 * analyzing a line of reasoning (4.4), students write a SECOND complete
 * Rhetorical Analysis essay under real AP Lang task conditions, scored
 * against the authentic AP Lang 6-point rubric (Thesis 1 / Evidence &
 * Commentary 4 / Sophistication 1 — see
 * docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md D4/§2).
 *
 * Anchor text: Jonathan Swift, "A Modest Proposal" (1729) —
 * evelyn.passage.swift-modest-proposal.v1 — a DIFFERENT anchor than Unit
 * 1's Douglass speech, deliberately chosen so students practice the same
 * task on a text whose rhetorical mode is satire/irony rather than direct
 * indictment: the teaching point is Swift's persona, deadpan tone, and
 * escalating false-earnestness, not any content about poverty itself.
 * Quotes below are limited to the passage's own opening set-up (short,
 * already-published phrases) plus a single short excerpt establishing the
 * ironic turn, matching how the passage is already used elsewhere in the
 * catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U4_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.englang.u4-frq-practice.v1',
  title: 'U4 FRQ Practice — Rhetorical Analysis Essay',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.u4-frq-practice',
      description:
        'Write a complete AP Lang Rhetorical Analysis essay on a satirical/ironic passage — a defensible thesis, evidence-backed commentary tracing a line of reasoning about the writer\'s rhetorical choices (persona, tone, escalation), and sophistication — scored against the authentic AP Lang 6-point rubric.',
      standard: 'AP-ENGLANG-4-FRQ',
    },
  ],
  prerequisites: [
    'apenglang.methods-of-development',
    'apenglang.intros-conclusions-analysis',
    'apenglang.diction-and-tone',
    'apenglang.analyzing-line-of-reasoning',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a second, harder Rhetorical Analysis essay concrete — this time on a satirical text where the writer\'s literal words are NOT the writer\'s actual position.',
      script:
        "Every skill from this unit — methods of development, framing analysis with a strong intro and conclusion, diction and tone, and tracing a line of reasoning — exists to make ONE thing possible: writing a complete Rhetorical Analysis essay under real exam conditions, even on a HARDER kind of text. Unit 1 gave you a direct, sincere indictment. Today's passage is satire — Jonathan Swift's \"A Modest Proposal\" — where the writer's literal, earnest-sounding proposal is NOT what he actually means. That's still FRQ 2, still scored on the 6-point rubric — Thesis (1 point), Evidence & Commentary (4 points), Sophistication (1 point) — but you have to analyze tone and persona, not just claim and evidence. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-frq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the AP Lang Rhetorical Analysis task asks for on a satirical text, and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: read a passage cold, then write an essay that analyzes the rhetorical choices the writer makes to achieve a specific purpose for a specific audience — on a satirical text, that purpose is usually NOT the literal claim on the page. Swift\'s narrator sounds calm, reasonable, even earnest, but the effect Swift is building is outrage at the real social problem his narrator seems untroubled by.',
        'The essay must: (1) respond with a defensible thesis, (2) select and use specific evidence from the passage, (3) explain HOW that evidence supports the line of reasoning (commentary — including WHY the calm, methodical tone is itself the rhetorical choice doing the work), and (4) use appropriate grammar and control of language throughout.',
        'ROW A — THESIS (0–1 point): full credit requires a thesis that presents a defensible interpretation of the writer\'s rhetorical choices in response to the prompt — on a satirical passage, this usually means naming the gap between the narrator\'s calm, reasonable-sounding tone and the effect that gap produces, not just describing what the narrator proposes.',
        'ROW B — EVIDENCE & COMMENTARY (0–4 points): the largest row. Full credit (4/4) requires specific, relevant evidence for a line of reasoning AND commentary that explains how each piece of evidence supports that line of reasoning — on satire, this means explaining HOW the calm/statistical/methodical diction creates ironic distance from the narrator\'s literal proposal, not just noting "this is ironic" without unpacking the mechanism.',
        'ROW C — SOPHISTICATION (0–1 point): earned holistically for things like explaining the layered relationship between narrator and author (the narrator is not Swift; Swift is showing us the narrator\'s blindness), situating the passage in its broader satirical purpose, or employing a vivid and persuasive prose style throughout — NOT awarded just for using a few sophisticated-sounding words.',
        'The #1 scoring trap on a satirical passage is treating the narrator\'s literal claims as the writer\'s actual argument — students who summarize "the narrator wants to help poor families" without noticing the ironic distance miss the entire rhetorical point and cap out at low Row B scores.',
        'Total = 6 points, integer, summed across the three rows — the same authentic AP Lang scale as the Unit 1 Rhetorical Analysis FRQ.',
      ],
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-swift',
      kind: 'try_yourself',
      problem:
        'Read the following excerpt from Jonathan Swift\'s "A Modest Proposal" (1729), in which a narrator methodically lays out the scale of poverty and childhood destitution he observes, then begins to introduce his solution to the problem in calm, matter-of-fact prose. Write an essay that analyzes the rhetorical choices Swift makes to develop his argument through the voice of this narrator. In your response you should do the following: (1) respond to the prompt with a thesis that presents a defensible interpretation, (2) select and use specific evidence to support your line of reasoning, (3) explain how the evidence supports your line of reasoning, and (4) demonstrate a sophisticated understanding of the rhetorical situation.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      expectedAnswer:
        'A full-credit response opens with a defensible thesis naming Swift\'s purpose (to force readers to feel the horror of mass poverty and official indifference by having his narrator discuss it in the same calm, reasonable register normally reserved for harmless civic improvement) AND at least one specific strategy he uses to do it (e.g. the statistical, problem-solving diction, the narrator\'s earnest self-presentation as a public benefactor, or the deliberate delay before revealing the actual proposal). The body then selects 2-3 specific pieces of evidence — the opening catalog of "beggars of the female sex, followed by three, four, or six children, all in rags," the narrator\'s framing of a solution-seeker who "would deserve so well of the publick, as to have his statue set up," and the calm cost-accounting register ("at most not above the value of two shillings") that sets up the reveal — and for EACH explains HOW it works on the reader (e.g. the reasonable, civic-minded tone of the setup is what makes the eventual reveal so jarring, because Swift has trained the reader to expect a normal proposal from this voice) rather than simply summarizing what the narrator says. Commentary consistently ties each choice back to the stated purpose/effect across the whole essay, building a coherent line of reasoning. Sophistication is shown by explicitly separating the narrator\'s perspective from Swift\'s own — e.g. noting that the narrator\'s calm confidence in his own generosity is itself the target of the satire, since a genuinely reasonable observer would recoil rather than calculate — expressed in precise, controlled prose throughout.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis presents a defensible interpretation of Swift\'s rhetorical purpose (e.g. to expose the horror of mass poverty and the complacency of those who fail to address it, by having a seemingly reasonable narrator approach the crisis with the calm, statistical tone of ordinary civic problem-solving) in response to the prompt. It may or may not name a specific strategy, but it must go beyond restating the prompt or summarizing content. No credit (0/1) for a thesis that only restates the prompt, states a fact about the passage with no interpretive claim, or merely summarizes what the passage says (e.g. "the narrator describes poor families and proposes a solution") without asserting what Swift is doing rhetorically and why.',
            modelResponse:
              'By having his narrator approach the crisis of mass child poverty with the same calm, statistical confidence one might use to solve a minor civic inconvenience, Swift forces readers to feel the full horror of both the crisis and the complacency that allows it to persist, using the narrator\'s reasonableness itself as the target of the satire.',
          },
          {
            criterionId: 'B-evidence-commentary',
            maxPoints: 4,
            scoringCriteria:
              'Full credit (4/4): the essay consistently selects specific, accurate evidence from the passage (e.g. the opening catalog of destitute mothers and children, the narrator\'s self-presentation as a civic benefactor deserving "his statue set up," and/or the calm cost-accounting diction that precedes the actual reveal) and, for each, explains HOW it functions rhetorically and WHY it produces the intended effect on the reader — building a consistent line of reasoning connected to the stated purpose across the whole essay, not just a list of identified devices. 3/4: mostly specific evidence with commentary that explains effect for most but not all points, or a line of reasoning that is present but not fully consistent. 2/4: evidence is present but commentary is thin, mostly restates what the passage says rather than explaining its effect, or the line of reasoning is only partially developed. 1/4: evidence is mostly general or one unsupported claim about a rhetorical choice with little to no explanation of effect. 0/4: no relevant evidence, or evidence used only to summarize passage content with no rhetorical commentary at all.',
            modelResponse:
              'Swift opens with an image built to generate ordinary civic sympathy — mothers "forced to employ all their time in stroling to beg sustenance," their children destined to "turn thieves for want of work" — establishing the narrator as someone who has genuinely observed and is troubled by real suffering, so the reader initially trusts his judgment. He deepens that trust by presenting himself not as a cynic but as a public-spirited problem-solver, one who imagines the person who fixes this "would deserve so well of the publick, as to have his statue set up for a preserver of the nation" — language that borrows the sincere idiom of civic honor to make his coming proposal sound like the next reasonable step rather than a monstrous one. The narrator then shifts into calm cost-accounting diction — a child "may be supported by her milk, for a solar year, with little other nourishment: at most not above the value of two shillings" — treating a human life as a line item, which is precisely what lets the actual proposal land as shocking: Swift has spent the whole setup training the reader to trust this voice as reasonable, so that when the "delicious nourishing and wholesome food" reveal arrives, the gap between the narrator\'s tone and his content becomes the reader\'s own horror rather than something stated outright.',
          },
          {
            criterionId: 'C-sophistication',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically, not for a single move — e.g. the essay explicitly distinguishes the narrator\'s perspective from Swift\'s own (the narrator\'s calm confidence in his own generosity IS the target of the satire, not Swift\'s actual position), situates the rhetorical choices within Swift\'s broader satirical purpose (indicting a society that tolerates the underlying poverty crisis while recoiling only at the narrator\'s literal proposal), or sustains a precise, controlled prose style throughout the essay. No credit (0/1) for merely inserting elevated vocabulary, an isolated sophisticated-sounding sentence unconnected to the essay\'s argument, or unclear/imprecise prose that undercuts the analysis.',
            modelResponse:
              'What makes the passage\'s escalation so effective is that the narrator never breaks character to signal irony — his calm remains total even as his proposal becomes monstrous, which is exactly Swift\'s point: a society that tolerates mass child poverty with the same equanimity the narrator brings to his "solution" has already normalized something nearly as troubling as the proposal itself, so the reader\'s shock at the narrator is meant to double back into shock at the complacency he is satirizing.',
          },
        ],
      },
      hints: [
        'Start by naming Swift\'s purpose in a verb, not a topic: not \'about poverty\' but \'to expose/indict/force.\'',
        'Remember the narrator is not Swift — analyze what the narrator\'s calm tone accomplishes FOR SWIFT, not what the narrator sincerely believes.',
        'Pick 2-3 specific moments (a quote or a structural move) rather than trying to cover the whole passage.',
        'For each piece of evidence, ask: what does this DO to the reader, and why would Swift have chosen it? Don\'t stop at naming the device (e.g. "this is ironic").',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On a satirical passage, the narrator\'s literal claims are NOT the writer\'s actual position — analyze what the gap between tone and content accomplishes.',
        'The 6-point rubric: Thesis (1) — a defensible interpretive claim; Evidence & Commentary (4) — specific evidence explained through a consistent line of reasoning; Sophistication (1) — earned holistically, often by separating narrator from author.',
        'Every piece of evidence needs commentary that answers "so what does this choice accomplish for this audience?" — naming a device (even "irony") without explaining its effect earns little to no credit on Row B.',
        'A strong thesis and consistent line of reasoning across body paragraphs is what separates a 4/4 Row B essay from a 2/4 one.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-FRQ',
    cedTitle: 'Unit 4 FRQ Practice — Rhetorical Analysis Essay',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP Lang Rhetorical Analysis FRQ (Question 2) task wording and 6-point rubric (Thesis 1 / Evidence & Commentary 4 / Sophistication 1), on a second anchor text distinct from Unit 1.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.swift-modest-proposal.v1',
        chapter: '1729',
        note: 'Jonathan Swift, "A Modest Proposal" — satirical anchor text for the second full-essay Rhetorical Analysis FRQ practice.',
      },
    ],
  },
};
