/**
 * AP English Language & Composition — CED Unit 1.1: The Rhetorical Situation.
 *
 * The entry-point lesson for AP Eng Lang. Every rhetorical-analysis skill the
 * course builds afterward — identifying purpose, characterizing an author's
 * choices, evaluating effectiveness — depends on first being able to name the
 * five elements of the rhetorical situation a text responds to.
 *
 * CALIBRATION PLAN — the AP English Language Vertical Slice's gold template.
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (concept = rhetorical move; worked_example =
 * annotated model; try_yourself = student writes, rubric-graded) and the
 * AP Plans Initiative memory for the shared AP conventions this plan follows.
 *
 * Anchor text: Frederick Douglass, "What to the Slave Is the Fourth of July?"
 * (1852) — evelyn.passage.douglass-fourth-of-july.v1. The teaching point is
 * the RHETORICAL MOVES (rhetorical question, apostrophe, irony, the turn in
 * audience address), not the atrocity content the speech condemns — quotes
 * below are limited to the short structural/rhetorical-question phrases.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U1_RHETORICAL_SITUATION: LessonPlan = {
  id: 'evelyn.ap.englang.rhetorical-situation.v1',
  title: 'U1.1 The Rhetorical Situation',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.rhetorical-situation',
      description:
        'Identify the five elements of the rhetorical situation (exigence, purpose, audience, writer, context) in a given text and use them to state a defensible claim about the writer\'s rhetorical purpose.',
      standard: 'AP-ENGLANG-1.1',
    },
  ],
  prerequisites: [],
  followUps: ['apenglang.claim-thesis', 'apenglang.evidence-commentary'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make students feel the gap between WHAT a text says and WHY it was written, before naming any terms.',
      script:
        "Imagine you get the exact same complaint — 'you're always on your phone' — from your best friend, your teacher, and a stranger on the bus. Same words, roughly. Totally different situations, totally different reasons someone would say it, and totally different ways you'd respond. No text — a speech, an essay, a tweet — exists in a vacuum. It's always a response to a specific moment, aimed at a specific audience, for a specific reason. Before we can analyze HOW a writer argues, we have to reconstruct the situation they were arguing INTO. That's the rhetorical situation.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rhetorical-situation',
      kind: 'concept',
      goal: 'Define the five elements of the rhetorical situation and the three classical appeals, and show how they interact.',
      keyIdeas: [
        "EXIGENCE: the urgent problem or occasion that calls a text into being — the reason THIS text exists NOW. No exigence, no text: something in the world demanded a response.",
        "PURPOSE: what the writer wants the text to DO to the audience — persuade, inform, mourn, indict, mobilize. Purpose is a verb, not a topic. 'About slavery' is a topic; 'to indict the nation's moral hypocrisy' is a purpose.",
        "AUDIENCE: who the writer is actually addressing — not just who is physically present, but whose beliefs/values/actions the writer is trying to move. A speaker can address one audience on the surface while really targeting another.",
        "WRITER (or speaker/persona): the identity, credibility, and position the writer brings — their relationship to the audience and the occasion shapes what they can credibly say and how.",
        "CONTEXT: the broader historical, social, and cultural circumstances surrounding the text — what was happening in the world that the audience would have understood without being told.",
        "These five elements are NOT independent — they interlock. Change the audience and the same exigence produces a different purpose; change the context and the same words carry different weight.",
        "The THREE CLASSICAL APPEALS are how a writer enacts purpose for an audience: ETHOS (credibility/character of the writer), PATHOS (emotion), LOGOS (logic/reasoning). Skilled writers blend all three; identifying the rhetorical situation FIRST tells you which appeals a writer would need and why.",
        "Rhetorical analysis always starts here: before judging HOW WELL a text argues, reconstruct WHAT it was arguing into. Skipping this step is why weak analysis just summarizes content instead of explaining the writer's choices.",
      ],
      vocabulary: [
        { term: 'exigence', definition: 'the urgent problem or occasion that makes a text necessary — the reason it was written now.' },
        { term: 'purpose', definition: "what the writer wants the text to accomplish for the audience — a goal, not a topic." },
        { term: 'audience', definition: 'the people the writer is trying to move or convince, whether or not they are the only ones present.' },
        { term: 'writer', definition: "the speaker/author's identity and credibility as it bears on what they can persuasively say." },
        { term: 'context', definition: 'the historical and cultural circumstances surrounding a text that shape how it would be received.' },
        { term: 'ethos', definition: "an appeal to the writer's credibility or character." },
        { term: 'pathos', definition: 'an appeal to the emotions of the audience.' },
        { term: 'logos', definition: 'an appeal to logic and reasoning.' },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-douglass-situation',
      kind: 'worked_example',
      problem:
        "Reconstruct the rhetorical situation of Frederick Douglass's 1852 speech, delivered to a mostly white abolitionist audience in Rochester, NY, on July 5th — the day after Independence Day. The speech opens by asking why HE, specifically, has been asked to speak, and turns to the now-famous line: \"What, to the American slave, is your Fourth of July?\"",
      steps: [
        "IDENTIFY THE EXIGENCE. It is July 5, 1852 — the day after the nation celebrated its independence and founding ideals of liberty, while slavery remained legal. That contradiction — a nation celebrating freedom while enslaving millions — is the urgent occasion Douglass is responding to.",
        "IDENTIFY THE AUDIENCE. On the surface, the invited abolitionist crowd in Rochester. But Douglass's opening question — \"why am I called upon to speak here to-day?\" — signals he is also addressing (and unsettling) the wider white American public who celebrate the holiday without confronting what it excludes.",
        "IDENTIFY THE WRITER/SPEAKER. Douglass speaks as a formerly enslaved man invited to address a free, mostly white audience on their own patriotic holiday — a position that gives him unique ethos (lived authority) but also an outsider's vantage on the celebration ('This Fourth of July is yours, not mine').",
        "IDENTIFY THE CONTEXT. The broader context: the Fugitive Slave Act of 1850, an active and organized abolitionist movement, and a national mythology of liberty that had never applied to enslaved people. Douglass's audience would have understood these tensions without him spelling them out.",
        "IDENTIFY THE PURPOSE. Not simply 'to inform' the audience about slavery — they already knew slavery existed. His purpose is to FORCE the audience to feel the gap between their professed ideals and their nation's practice, using the holiday itself as the indictment's evidence.",
        "NAME THE MOVE THAT ENACTS THIS PURPOSE. The rhetorical question — 'What, to the American slave, is your Fourth of July?' — is not a request for information. It's apostrophe-like address that puts the audience on trial: it forces THEM to answer a question their own celebration had let them avoid.",
      ],
      answer:
        "Exigence: the contradiction of a nation celebrating liberty while enslaving millions, sharpened by speaking one day after the holiday. Audience: the immediate abolitionist crowd, but rhetorically the wider complacent public. Writer: a formerly enslaved man whose lived experience gives him unmatched authority on the topic. Context: the Fugitive Slave Act and an active abolitionist movement. Purpose: not to inform but to indict — to make the audience feel, not just know, the hypocrisy — accomplished through the rhetorical question that puts the audience on trial.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-thesis',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.douglass-fourth-of-july.v1, write ONE sentence that is a defensible thesis identifying Douglass's rhetorical purpose in the excerpt AND naming one specific strategy he uses to achieve it (e.g. a rhetorical question, direct address, a shift in who he is speaking to). Do not summarize what the passage says — state what Douglass is DOING and WHY.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      rubric: {
        parts: [
          {
            criterionId: 'thesis',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the thesis is defensible (arguable, not a fact or plot summary), correctly identifies Douglass's purpose as confronting/indicting his audience with the gap between America's professed ideals of liberty and the reality of slavery, AND names one specific, accurately-described rhetorical strategy (e.g. the direct rhetorical question 'What, to the American slave, is your Fourth of July?', the pointed address to 'fellow-citizens', or the shift from inclusive to accusatory pronouns) tied to that purpose in a single sentence. Partial credit for a defensible purpose without a named strategy, or a named strategy without connecting it to purpose, or a thesis that is accurate but merely restates/summarizes rather than asserting an interpretive claim. No credit for a thesis that only summarizes plot/content (e.g. 'Douglass talks about how slavery is bad') with no claim about purpose or strategy.",
            modelResponse:
              "By repeatedly turning his rhetorical question — \"What, to the American slave, is your Fourth of July?\" — directly on his audience, Douglass forces listeners who see themselves as free and just to confront their complicity in a hypocrisy they had been able to ignore.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-summary-vs-analysis',
      kind: 'misconception_check',
      question:
        'A student writes: "In this speech, Douglass says that the Fourth of July does not mean the same thing to enslaved people as it does to free Americans, and he explains why he feels this way." Is this a strong rhetorical-analysis thesis?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating an accurate SUMMARY of what the text says as if it were an ANALYSIS of how/why the writer makes an argument — the single most common AP Eng Lang scoring trap.',
          correctsTo:
            "No — this is summary, not analysis. It restates the content (the holiday means something different to enslaved people) without making a claim about Douglass's rhetorical CHOICES or PURPOSE. A rhetorical-analysis thesis has to name what the writer is DOING to the audience and often HOW: e.g. 'Douglass uses a direct rhetorical question to put his audience on trial, forcing them to confront a hypocrisy their own celebration lets them avoid.' The test: could this sentence describe the text's CONTENT without ever mentioning the writer making a choice or having an effect on a reader? If yes, it's summary. Analysis names a move (a strategy) and ties it to an effect or purpose.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The rhetorical situation has five interlocking elements: exigence (why now), purpose (what the text is trying to DO), audience (who is really being moved), writer (their identity/credibility), and context (surrounding circumstances).',
        'Purpose is a verb, not a topic — "to indict," not "about slavery."',
        'Ethos, pathos, and logos are the appeals a writer uses to enact purpose for an audience — identify the situation first, then the appeals make sense.',
        'A defensible rhetorical-analysis thesis names BOTH the writer\'s purpose AND a specific strategy — never just summarizes what the text says.',
        'Summary describes content; analysis explains a choice and its effect. That distinction is the #1 AP Eng Lang scoring trap.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.1',
    cedTitle: 'Rhetorical Situation',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '1',
        note: 'AP English Language and Composition Course and Exam Description, Unit 1 — the rhetorical situation (exigence, purpose, audience, writer, context) and the three appeals.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — anchor text for identifying the rhetorical situation.',
      },
    ],
  },
};
