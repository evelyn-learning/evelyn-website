/**
 * AP US History — Unit 3 CED 3.3: The Ideas of the American Revolution.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.revolutionary-ideals.v1`. Covers Lockean natural rights
 * and social-contract theory, republicanism, and how these ideas are
 * operationalized in the Declaration of Independence's preamble.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_REVOLUTIONARY_IDEALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.revolutionary-ideals.v1',
  course: 'AP United States History',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'The Ideas of the American Revolution',
  planId: 'evelyn.ap.apush.revolutionary-ideals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.revolutionary-ideals.v1' }],
  theory: [
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'definition',
      title: 'natural rights (Locke)',
      content:
        "Rights — life, liberty, and property — that John Locke argued belong to all people inherently, prior to and independent of government. Government's job is to protect these rights, not to grant them. Locke published this theory nearly a century before the Revolution, in Two Treatises of Government (1689), to justify England's own Glorious Revolution against James II.",
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'definition',
      title: 'social contract',
      content:
        "Locke's theory that government's authority rests on an agreement between rulers and the ruled: people consent to be governed in exchange for protection of their natural rights. If government instead violates those rights, the contract is broken and the people have the right — not just the option — to alter or abolish it.",
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'definition',
      title: 'republicanism',
      content:
        'The belief that legitimate government derives its power from the people (popular sovereignty) and is exercised through elected representatives, not inherited through a monarch — sustained by civic virtue (citizens putting the public good above private or factional interest) rather than a king holding things together.',
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'trap',
      title: 'republicanism is not direct democracy',
      content:
        'Colonial republicans did not mean "every citizen votes directly on every law." They meant representative government, accountable to the people, checked against concentrating too much power in any one person or faction — a middle path between monarchy and unchecked direct rule by momentary popular passion.',
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'framework',
      title: 'the Declaration as applied philosophy',
      content:
        'The Declaration\'s opening — "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights" — converts Locke\'s natural-rights theory directly into a political document. The line that follows — governments derive "their just powers from the consent of the governed" — states the social contract as a founding premise, before a single grievance against George III is listed.',
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'definition',
      title: 'unalienable rights',
      content:
        "The Declaration's term for the Lockean natural rights it lists — life, liberty, and the pursuit of happiness — rights that cannot be given away or taken away. Jefferson's substitution of \"pursuit of Happiness\" for Locke's \"property\" broadens the claim without changing its underlying logic.",
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'framework',
      title: 'why theory comes before grievances',
      content:
        "By stating the philosophical THEORY (legitimate government requires consent and rights-protection) before the ~27 specific grievances against George III, the Declaration asks the reader to accept a universal principle first — then shows the king violating it. This makes the case a matter of universal justice, not a one-off colonial complaint.",
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'event',
      title: 'pamphlets spread the ideas beyond elites',
      content:
        "Works like Thomas Paine's Common Sense (1776) translated Enlightenment philosophy into plain, widely accessible language, reaching ordinary colonists who had never read Locke directly — part of why natural-rights and social-contract ideas became a genuinely popular cause, not just an elite intellectual position.",
    },
    {
      loId: 'apush.revolutionary-ideals',
      kind: 'framework',
      title: 'why this matters beyond 1776',
      content:
        'Because independence was justified using UNIVERSAL claims about natural rights and consent — not just grievances specific to the colonies — these same ideas became the standard used to judge every government that followed, including the one the revolutionaries themselves would soon have to design (see the Articles of Confederation and Constitution).',
    },
  ],
  methods: [
    {
      title: 'Trace a philosophical claim through a founding document',
      when_to_use:
        'Use when asked to analyze how an excerpt from the Declaration (or a similar founding text) reflects Enlightenment philosophy, rather than simply summarizing what it says.',
      steps: [
        'IDENTIFY THE PHILOSOPHICAL CLAIM — name the specific Enlightenment idea (natural rights, social contract, popular sovereignty) the passage is drawing on.',
        'IDENTIFY WHERE IT SITS IN THE ARGUMENT — is this stated as a general principle (before grievances) or as a specific application (a listed complaint)?',
        'CONNECT TO THE ORIGINAL PHILOSOPHER — note that Locke (or another Enlightenment source) formulated the idea decades earlier; the document APPLIES it rather than inventing it.',
        'EXPLAIN THE POLITICAL WORK THE CLAIM IS DOING — what does stating this principle allow the document to argue next (e.g., that a rights-violating government may be legitimately overthrown)?',
      ],
      example: {
        problem:
          'Analyze: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights... That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed."',
        solution:
          "This is Locke's natural-rights and social-contract theory stated as a founding premise before any specific grievance against George III. By putting the THEORY first, Jefferson asks the reader to accept a general principle — legitimate government requires consent and rights-protection — that the following grievance list will then show the king violating, turning a colonial rebellion into a universal argument about legitimate government.",
      },
      relatedLoIds: ['apush.revolutionary-ideals'],
    },
  ],
  pointers: [
    { content: 'Locke\'s ideas predate the Revolution by nearly a century (1689) — colonists ADAPTED this philosophy, they did not invent it.', kind: 'trap' },
    { content: 'The Declaration states its philosophy BEFORE its grievances — know why that ordering matters for the argument\'s structure.', kind: 'tip' },
    { content: 'Republicanism ≠ direct democracy. Always specify "representative government accountable to the people," not "everyone votes on everything."', kind: 'trap' },
    { content: 'Social contract = government exists to protect rights AND derives authority from consent — both halves are required for full credit on an SAQ.', kind: 'tip' },
    { content: 'Common Sense matters here as a DELIVERY MECHANISM — it popularized Locke\'s philosophy for readers who had never read Locke.', kind: 'tip' },
  ],
};
