/**
 * AP English Language & Composition — Unit 1 FRQ Practice: the full
 * Rhetorical Analysis essay (AP Lang Free-Response Question 2).
 *
 * This is the FRQ-practice plan (see project catalog convention) that
 * closes out Unit 1: after the rhetorical situation (1.1), reading for
 * claim (1.2), the defensible thesis (1.3), evidence & commentary (1.4),
 * and audience/context (1.5), students now write ONE complete
 * Rhetorical Analysis essay under the real AP Lang task conditions and
 * are scored against the authentic AP Lang 6-point rubric (Thesis 1 /
 * Evidence & Commentary 4 / Sophistication 1 — NOT the STEM 9-point
 * convention; see docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md
 * D4/§2).
 *
 * Anchor text: Frederick Douglass, "What to the Slave Is the Fourth of
 * July?" (1852) — evelyn.passage.douglass-fourth-of-july.v1, the same
 * passage used across Unit 1. The teaching point remains the RHETORICAL
 * MOVES (rhetorical question, direct address, the turn from inclusive to
 * accusatory pronouns), not the atrocity content the speech condemns —
 * quotes below are limited to the short structural/rhetorical-question
 * phrases already used elsewhere in Unit 1.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U1_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.englang.u1-frq-practice.v1',
  title: 'U1 FRQ Practice — Rhetorical Analysis Essay',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.u1-frq-practice',
      description:
        'Write a complete AP Lang Rhetorical Analysis essay on a single passage — a defensible thesis, evidence-backed commentary tracing a line of reasoning about the writer\'s rhetorical choices, and sophistication — scored against the authentic AP Lang 6-point rubric.',
      standard: 'AP-ENGLANG-1-FRQ',
    },
  ],
  prerequisites: [
    'apenglang.rhetorical-situation',
    'apenglang.reading-for-claim',
    'apenglang.defensible-thesis',
    'apenglang.evidence-commentary',
    'apenglang.audience-context',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full Rhetorical Analysis essay concrete before the student sits down to write one.',
      script:
        "Every skill from this unit — reconstructing the rhetorical situation, reading for the writer's claim, drafting a defensible thesis, backing it with evidence and commentary, and tracking audience and context — exists to make ONE thing possible: writing a complete Rhetorical Analysis essay under real exam conditions. That's FRQ 2 on the AP Lang exam, scored on a 6-point rubric across three rows — Thesis (1 point), Evidence & Commentary (4 points), Sophistication (1 point). Today you write the whole essay, on the Douglass passage, and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-frq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the AP Lang Rhetorical Analysis task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: read a passage cold, then write an essay that analyzes the rhetorical choices the writer makes to achieve a specific purpose for a specific audience — not a summary of what the passage says.',
        'The essay must: (1) respond with a defensible thesis, (2) select and use specific evidence from the passage, (3) explain HOW that evidence supports the line of reasoning (commentary — not just quote-and-drop), and (4) use appropriate grammar and control of language throughout.',
        "ROW A — THESIS (0–1 point): full credit requires a thesis that presents a defensible interpretation of the writer's rhetorical choices in response to the prompt — not a fact, not a summary of content, not merely restating the prompt.",
        'ROW B — EVIDENCE & COMMENTARY (0–4 points): the largest row. Full credit (4/4) requires specific, relevant evidence for a line of reasoning AND commentary that explains how each piece of evidence supports that line of reasoning, with the analysis consistently tied back to the stated purpose/effect — not just naming a device.',
        'ROW C — SOPHISTICATION (0–1 point): earned holistically for things like explaining the significance/complexity of the writer\'s rhetorical choices, situating the argument in a broader context, or employing a vivid and persuasive prose style throughout — NOT awarded just for using a few sophisticated-sounding words.',
        'The #1 scoring trap remains summary-vs-analysis: naming what the passage SAYS instead of explaining what the writer DOES and to what EFFECT. Every sentence of evidence and commentary should be answerable by "so what does that choice accomplish for this audience?"',
        'Total = 6 points, integer, summed across the three rows — this is the authentic AP Lang scale, distinct from the 9-point synthesis/argument or STEM FRQ conventions used elsewhere in the catalog.',
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-douglass',
      kind: 'try_yourself',
      problem:
        "Read the following excerpt from a speech Frederick Douglass delivered in Rochester, New York, on July 5, 1852, the day after the nation celebrated its Independence Day. In the excerpt, Douglass addresses his largely white, abolitionist audience and turns his address into a series of pointed questions culminating in \"What, to the American slave, is your Fourth of July?\" Write an essay that analyzes the rhetorical choices Douglass makes to convey his message about the meaning of the holiday for enslaved Americans. In your response you should do the following: (1) respond to the prompt with a thesis that presents a defensible interpretation, (2) select and use specific evidence to support your line of reasoning, (3) explain how the evidence supports your line of reasoning, and (4) demonstrate a sophisticated understanding of the rhetorical situation.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      expectedAnswer:
        "A full-credit response opens with a defensible thesis naming Douglass's purpose (to indict his audience's complacent celebration of a liberty they do not extend to enslaved people) AND at least one specific strategy he uses to do it (e.g. the rhetorical question, the shift from inclusive to accusatory pronouns, the catalog of parallel accusations — \"your celebration is a sham; your boasted liberty, an unholy license\"). The body then selects 2-3 specific pieces of evidence — the opening self-questioning (\"why am I called upon to speak here to-day?\"), the pivot \"This Fourth of July is yours, not mine,\" and the culminating rhetorical question and its parallel indictments — and for EACH piece explains HOW it works on the audience (e.g. the direct address and repeated \"your\" force listeners who see themselves as free and just to personally own the hypocrisy, rather than observe it from a distance) rather than simply summarizing what Douglass says. Commentary consistently ties each choice back to the stated purpose/effect across the whole essay, building a coherent line of reasoning rather than a list of unconnected observations. Sophistication is shown by situating the argument in its full complexity — e.g. noting that Douglass's authority as a formerly enslaved man speaking to a free audience on their own patriotic holiday is itself a rhetorical resource, or that the passage's escalating parallel structure builds cumulative force rather than making one isolated point — expressed in precise, controlled prose throughout.",
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): the thesis presents a defensible interpretation of Douglass's rhetorical purpose (e.g. to indict his audience's celebration of a liberty they withhold from enslaved people, or to force the audience to feel rather than merely know the nation's hypocrisy) in response to the prompt. It may or may not name a specific strategy, but it must go beyond restating the prompt or summarizing content. No credit (0/1) for a thesis that only restates the prompt, states a fact about the passage with no interpretive claim, or merely summarizes what the passage says (e.g. \"Douglass explains that the Fourth of July means something different to enslaved people\") without asserting what Douglass is doing rhetorically and why.",
            modelResponse:
              "By turning the celebratory occasion of the Fourth of July back on his audience through a relentless rhetorical question and a cascade of parallel accusations, Douglass transforms a holiday address into an indictment, forcing listeners who consider themselves free and just to confront their complicity in a hypocrisy their own celebration lets them ignore.",
          },
          {
            criterionId: 'B-evidence-commentary',
            maxPoints: 4,
            scoringCriteria:
              "Full credit (4/4): the essay consistently selects specific, accurate evidence from the passage (e.g. the opening self-questioning, \"This Fourth of July is yours, not mine,\" the central rhetorical question, and/or the parallel \"your celebration is a sham; your boasted liberty, an unholy license\" catalog) and, for each, explains HOW it functions rhetorically and WHY it produces the intended effect on the audience — building a consistent line of reasoning connected to the stated purpose across the whole essay, not just a list of identified devices. 3/4: mostly specific evidence with commentary that explains effect for most but not all points, or a line of reasoning that is present but not fully consistent. 2/4: evidence is present but commentary is thin, mostly restates what a device IS rather than explaining its effect, or the line of reasoning is only partially developed. 1/4: evidence is mostly general or one unsupported claim about a rhetorical choice with little to no explanation of effect. 0/4: no relevant evidence, or evidence used only to summarize passage content with no rhetorical commentary at all.",
            modelResponse:
              "Douglass opens by asking \"why am I called upon to speak here to-day?\" — a question that seems to defer to his hosts but actually unsettles them, planting the idea that his presence at their celebration is itself strange before he says anything critical. He sharpens this with the direct declaration \"This Fourth of July is yours, not mine,\" a blunt possessive split that denies his audience the comfort of assuming their celebration is universal. That denial builds to the central rhetorical question, \"What, to the American slave, is your Fourth of July?\", which Douglass immediately answers himself in a cascade of parallel accusations — \"your celebration is a sham; your boasted liberty, an unholy license; your national greatness, swelling vanity\" — the repeated \"your\" hammering the same point from multiple angles so the audience cannot dismiss it as one exaggerated claim. Each parallel clause forces the listener to re-examine a different piece of their patriotic self-image (their celebration, their liberty, their greatness) and find it hollow, so that by the end of the passage the accumulation itself — not any single line — is what makes the indictment impossible to shrug off.",
          },
          {
            criterionId: 'C-sophistication',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): earned holistically, not for a single move — e.g. the essay explains the added complexity of Douglass's position (a formerly enslaved man given the platform to address a free, self-congratulating audience on their own holiday, which itself is a rhetorical resource that authorizes his indictment), situates the rhetorical choices within that broader occasion/context, or sustains a precise, controlled prose style throughout the essay. No credit (0/1) for merely inserting elevated vocabulary, an isolated sophisticated-sounding sentence unconnected to the essay's argument, or unclear/imprecise prose that undercuts the analysis.",
            modelResponse:
              "What makes Douglass's escalating parallelism land is the added complexity of who is delivering it: a man once enslaved, invited to speak at his hosts' own patriotic celebration, uses the very occasion meant to affirm national unity as the evidence against it — so the accusations are not an outsider's abstract complaint but a firsthand indictment delivered from inside the audience's own moment of self-congratulation.",
          },
        ],
      },
      hints: [
        "Start by naming Douglass's purpose in a verb, not a topic: not 'about slavery' but 'to indict/force/confront.'",
        'Pick 2-3 specific moments (a quote or a structural move) rather than trying to cover the whole passage.',
        "For each piece of evidence, ask: what does this DO to the audience, and why would Douglass have chosen it? Don't stop at naming the device (e.g. 'this is a rhetorical question').",
        "Keep your thesis and every body paragraph tied to the SAME line of reasoning — don't introduce a new, disconnected purpose partway through.",
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The AP Lang Rhetorical Analysis task asks for analysis of the writer\'s CHOICES and their EFFECTS, never a summary of content.',
        'The 6-point rubric: Thesis (1) — a defensible interpretive claim; Evidence & Commentary (4) — specific evidence explained through a consistent line of reasoning; Sophistication (1) — earned holistically across the essay, not from one line.',
        'Every piece of evidence needs commentary that answers "so what does this choice accomplish for this audience?" — naming a device without explaining its effect earns little to no credit on Row B.',
        'A strong thesis and consistent line of reasoning across body paragraphs is what separates a 4/4 Row B essay from a 2/4 one.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ',
    cedTitle: 'Unit 1 FRQ Practice — Rhetorical Analysis',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP Lang Rhetorical Analysis FRQ (Question 2) task wording and 6-point rubric (Thesis 1 / Evidence & Commentary 4 / Sophistication 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — anchor text for the full-essay FRQ practice.',
      },
    ],
  },
};
