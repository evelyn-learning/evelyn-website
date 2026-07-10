/**
 * AP English Language & Composition — Unit 1 CED 1.1: The Rhetorical
 * Situation.
 *
 * Hand-authored baseline for the entry-point AP Eng Lang topic (mirrors the
 * lesson plan `evelyn.ap.englang.rhetorical-situation.v1`). Covers the five
 * elements of the rhetorical situation (exigence, purpose, audience, writer,
 * context), the three classical appeals, and the summary-vs-analysis
 * distinction that recurs through the whole unit.
 *
 * Anchor text referenced in the method's example: Frederick Douglass, "What
 * to the Slave Is the Fourth of July?" (1852). Quotes are limited to the
 * short structural/rhetorical-question phrases — the teaching point is the
 * rhetorical moves, not the content of the speech.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_RHETORICAL_SITUATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.rhetorical-situation.v1',
  course: 'AP English Language',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Rhetorical Situation',
  planId: 'evelyn.ap.englang.rhetorical-situation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.rhetorical-situation.v1' }],
  theory: [
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'definition',
      title: 'rhetorical situation',
      content:
        'The set of circumstances that call a text into being and that it responds to: an urgent occasion (exigence), a goal (purpose), a target (audience), a speaker with a stance (writer), and surrounding circumstances (context). No text exists in a vacuum — it is always a response to a specific moment aimed at a specific audience for a specific reason.',
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'definition',
      title: 'exigence',
      content:
        'The urgent problem or occasion that makes a text necessary — the reason it was written *now* rather than at any other time. No exigence, no text: something in the world demanded a response.',
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'definition',
      title: 'ethos, pathos, logos',
      content:
        'The three classical appeals a writer uses to enact purpose for an audience. **Ethos** — an appeal to the writer\'s credibility or character. **Pathos** — an appeal to the emotions of the audience. **Logos** — an appeal to logic and reasoning. Skilled writers blend all three; identifying the rhetorical situation first tells you which appeals a writer would need and why.',
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'framework',
      title: 'the five elements',
      content:
        "Every rhetorical situation has five interlocking elements. **Purpose** is what the writer wants the text to *do* to the audience — persuade, inform, mourn, indict, mobilize. **Audience** is who the writer is actually addressing: not just who is physically present, but whose beliefs, values, or actions the writer is trying to move. A speaker can address one audience on the surface while really targeting another. **Writer** (or speaker/persona) is the identity, credibility, and position the writer brings to the text — their relationship to the audience and occasion shapes what they can credibly say and how. **Context** is the broader historical, social, and cultural circumstances surrounding the text — what the audience would have understood without being told.",
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'rhetorical-device',
      title: 'purpose is a verb, not a topic',
      content:
        '"About slavery" names a topic. "To indict the nation\'s moral hypocrisy" names a purpose. A common early mistake is describing what a text is *about* instead of what the writer wants the text to *do* to the reader — always phrase purpose as an action the writer is taking on the audience.',
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'framework',
      title: 'the elements interlock',
      content:
        "The five elements are not independent variables you can analyze one at a time and forget. Change the audience and the same exigence produces a different purpose; change the context and the same words carry different weight. Reconstructing the rhetorical situation means holding all five in view together, because each one reshapes how the others should be read.",
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'strategy',
      title: 'situation before judgment',
      content:
        "Rhetorical analysis always starts with the situation, never with a verdict on quality. Before judging *how well* a text argues, reconstruct *what it was arguing into* — the exigence, the real audience, the writer's position, the surrounding context. Skipping this step is why weak analysis just summarizes content instead of explaining the writer's choices.",
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'trap',
      title: 'summary vs. analysis',
      content:
        "The single most common AP Eng Lang scoring trap: treating an accurate *summary* of what a text says as if it were an *analysis* of how or why the writer argues. Summary restates content; analysis names a rhetorical choice and ties it to an effect on the audience. A thesis or a claim that could describe the text's content without ever mentioning the writer making a choice is summary, not analysis.",
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'strategy',
      title: 'a surface audience can hide a real one',
      content:
        "A writer's stated or apparent audience is not always the audience the writer is really trying to move. A speaker can appear to address one group while the words are calibrated to unsettle or persuade a different, wider group listening in — always ask who the text is *really* trying to change, not just who is physically present.",
    },
    {
      loId: 'apenglang.rhetorical-situation',
      kind: 'framework',
      title: 'a defensible thesis grows out of the situation',
      content:
        "Once the rhetorical situation is reconstructed, a defensible thesis about the text names both the writer's purpose and at least one specific strategy the writer uses to achieve it — the rhetorical situation is the raw material every later thesis (1.3) is built from.",
    },
  ],
  methods: [
    {
      title: "Reconstruct a text's rhetorical situation",
      when_to_use:
        'Use this as the first move on any unfamiliar passage, before attempting a thesis or any claim about effectiveness.',
      steps: [
        'IDENTIFY THE EXIGENCE — what urgent problem or occasion makes this text necessary right now? Look for a contradiction, crisis, or unresolved tension the text is responding to.',
        'IDENTIFY THE AUDIENCE — who is physically or textually addressed, and is there a wider or different audience the writer is really trying to move?',
        "IDENTIFY THE WRITER/SPEAKER — what position, credibility, or identity does the writer bring, and how does that shape what they can credibly say?",
        'IDENTIFY THE CONTEXT — what historical, social, or cultural circumstances would the original audience have understood without being told?',
        'IDENTIFY THE PURPOSE — state it as a verb (what the writer wants the text to DO to the audience), not a topic (what the text is about).',
        'NAME THE MOVE THAT ENACTS THE PURPOSE — identify one specific rhetorical strategy (a rhetorical question, direct address, a structural turn) that carries out the purpose you named.',
      ],
      example: {
        problem:
          "Reconstruct the rhetorical situation of Frederick Douglass's 1852 speech, delivered to a mostly white abolitionist audience in Rochester, NY, the day after Independence Day, opening with the line \"What, to the American slave, is your Fourth of July?\"",
        solution:
          "Exigence: a nation celebrating liberty while enslaving millions, sharpened by speaking one day after the holiday. Audience: the immediate abolitionist crowd, but rhetorically the wider complacent public. Writer: a formerly enslaved man whose lived experience gives him unmatched authority on the topic. Context: the Fugitive Slave Act and an active abolitionist movement. Purpose: not to inform but to indict — to make the audience feel, not just know, the hypocrisy — accomplished through a rhetorical question that puts the audience on trial.",
      },
      relatedLoIds: ['apenglang.rhetorical-situation'],
    },
  ],
  pointers: [
    { content: 'Five elements, one memory device: EPACW — Exigence, Purpose, Audience, Context, Writer.', kind: 'tip' },
    { content: 'Purpose is a verb ("to indict"), never a topic ("about slavery"). Graders look for the verb.', kind: 'tip' },
    { content: 'The #1 trap: writing a thesis that only summarizes content, with no claim about the writer\'s choice or effect.', kind: 'trap' },
    { content: 'A speaker\'s stated audience and the audience they\'re really trying to move are not always the same group — check both.', kind: 'tip' },
    { content: 'Name ethos/pathos/logos only after you\'ve reconstructed the situation — the appeals only make sense once you know the purpose and audience.', kind: 'tip' },
    { content: 'Test: could this sentence describe the text\'s content without ever mentioning a writer\'s choice or an effect on a reader? If yes, it\'s summary, not analysis.', kind: 'trap' },
  ],
};
