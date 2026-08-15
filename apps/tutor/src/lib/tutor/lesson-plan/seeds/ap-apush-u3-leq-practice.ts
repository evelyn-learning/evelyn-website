/**
 * AP US History — Period 3 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the Articles of Confederation (LO 3.9) and its replacement
 * by the Constitution (LO 3.10), scored against the authentic AP APUSH
 * 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u3-leq-practice.v1',
  title: 'Period 3 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u3-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the effectiveness of the Articles of Confederation — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-3-LEQ',
    },
  ],
  prerequisites: [
    'apush.articles-of-confederation',
    'apush.constitution-ratification',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied why the Articles of Confederation were written, what powers they gave the new national government, and why they were eventually replaced by the Constitution. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely effective, largely ineffective, or effective in some ways but not others) to which the Articles of Confederation succeeded as a government, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that after fighting a revolution against a powerful, centralized monarchy, the states deliberately designed the Articles to keep the national government weak and preserve state sovereignty, which explains both the Articles\' intent and its later weaknesses.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the national government\'s inability to tax (it could only request funds from states), its inability to regulate interstate commerce, its lack of an executive or national judiciary, its one genuine achievement in the Northwest Ordinance, and Shays\' Rebellion as proof of its practical failure to maintain order.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the Articles\' lack of taxing power specifically CAUSED the fiscal crisis that led to Shays\' Rebellion, which in turn CAUSED the political momentum for the Constitutional Convention — not just cataloging weaknesses without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Articles of Confederation were an effective form of government for the United States in the period from 1781 to 1789. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Articles of Confederation were largely ineffective as a national government because their deliberately weak central powers left the United States unable to fund itself, defend its interests, or resolve internal unrest, even though they succeeded at the one task they were designed for — preventing the return of centralized, monarchical-style power. Contextualization explains that the states wrote the Articles immediately after fighting a revolution against a powerful, centralized British monarchy, so they deliberately built a national government too weak to threaten state sovereignty or individual liberty — intentional design, not accident, which explains the government\'s later paralysis. The evidence section develops specific facts connected to the thesis: Congress had no power to tax and could only request funds from the states, who often refused or paid late, leaving the government unable to pay Revolutionary War debts or fund an army; Congress could not regulate interstate or foreign commerce, so states set their own competing tariffs and currencies, straining the young economy; there was no independent executive or national judiciary to enforce laws or resolve disputes between states; the one clear success, the Northwest Ordinance of 1787, established an orderly process for admitting new states and banned slavery north of the Ohio River, showing the Confederation Congress COULD govern effectively when it acted within its narrow powers; and Shays\' Rebellion (1786-87), an armed uprising of debt-burdened Massachusetts farmers, showed the national government had no reliable way to help suppress internal unrest, since Congress could not fund a response and Massachusetts had to raise a private militia instead. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: the inability to tax directly caused the fiscal weakness that left war debts unpaid and states resentful of federal calls for money, and that same fiscal and enforcement weakness is precisely what let a local uprising like Shays\' Rebellion escalate into a national crisis of confidence, which in turn directly caused the political momentum that produced the Constitutional Convention just months later — showing the Articles\' central design flaw (a government too weak to fund or enforce itself) is the single thread connecting the currency chaos, the war-debt crisis, and the rebellion into one causal chain, even while the Northwest Ordinance shows that flaw was specific to fiscal and coercive power rather than total institutional incompetence.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Articles of Confederation were effective, 1781-1789) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of effectiveness, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Articles of Confederation were largely ineffective as a national government: their deliberately weak central powers left the United States unable to fund itself, regulate its own economy, or respond to internal unrest, even though the Articles succeeded at the one task they were designed for — preventing a return to centralized, monarchical-style power.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the Articles were deliberately designed to be weak because the states had just fought a revolution against a powerful, centralized British monarchy and feared recreating that same threat to state sovereignty and individual liberty. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Having just fought a revolution against a powerful, centralized British monarchy that taxed and governed them without their consent, the states deliberately wrote the Articles of Confederation to keep the new national government too weak to threaten state sovereignty or individual liberty in the same way — a design choice that explains both the Articles\' intent and the practical weaknesses that followed.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. no power to tax, no power to regulate interstate/foreign commerce, no executive or national judiciary, the Northwest Ordinance of 1787, Shays\' Rebellion) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'Congress had no power to tax and could only request funds from the states, who frequently paid late or not at all, leaving war debts unpaid; it could not regulate interstate or foreign commerce, so states set competing tariffs and currencies; there was no independent executive or national judiciary to enforce laws; the Northwest Ordinance of 1787 orderly organized new territories and banned slavery north of the Ohio River; and Shays\' Rebellion (1786-87) showed the national government had no reliable means to help suppress internal unrest.',
          },
          {
            criterionId: 'D-analysis-reasoning',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The inability to tax directly caused the fiscal weakness that left Revolutionary War debts unpaid and states resentful of federal funding requests, and that same fiscal and enforcement weakness is precisely what allowed a local uprising like Shays\' Rebellion to escalate into a national crisis of confidence in the government — which in turn directly caused the political momentum that produced the Constitutional Convention only months later. The Northwest Ordinance, by contrast, shows this flaw was specific to fiscal and coercive power rather than total institutional incompetence, since Congress governed effectively there precisely because it did not need to tax or coerce anyone to do it.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of effectiveness — "largely ineffective," "largely effective," or "effective in some ways, not others" — rather than just listing pros and cons.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual law, event, or power), not general.',
        'Use causation to connect your evidence: does one weakness directly CAUSE another problem you\'re also discussing?',
        'The Northwest Ordinance is useful for showing the Articles weren\'t a total failure — a nuanced argument, not just a one-sided list, tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: the Articles\' lack of taxing power caused the fiscal crisis, which fed into Shays\' Rebellion, which caused the push for a stronger Constitution.',
        'A nuanced thesis (effective at one narrow task, ineffective at governing broadly) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-LEQ',
    cedTitle: 'Period 3 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
