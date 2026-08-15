/**
 * AP US History — Unit 3 CED 3.2: Causes of the American Revolution.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.causes-of-revolution.v1`. Covers the end of salutary
 * neglect, the post-1763 taxation sequence, the "no taxation without
 * representation" constitutional objection, escalating British enforcement,
 * and the Enlightenment natural-rights justification for resistance —
 * anchored by Thomas Paine's Common Sense (1776).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_CAUSES_OF_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.causes-of-revolution.v1',
  course: 'AP United States History',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Causes of the American Revolution',
  planId: 'evelyn.ap.apush.causes-of-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.causes-of-revolution.v1' }],
  theory: [
    {
      loId: 'apush.causes-of-revolution',
      kind: 'definition',
      title: 'salutary neglect',
      content:
        "Britain's long-running policy — in place through most of the colonial era and intensifying under early-1700s ministers like Robert Walpole — of loosely enforcing trade and tax laws in the colonies, leaving colonial assemblies to handle most day-to-day governance. It remained largely unbroken until 1763, so colonists grew accustomed to real self-government while still considering themselves loyal British subjects.",
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'definition',
      title: 'no taxation without representation',
      content:
        'The core colonial constitutional objection: NOT that taxes were too high, but that Parliament — in which colonists had no elected representatives — had no legitimate authority to tax them at all. This is an argument about WHO gets to make the rules, not just a complaint about money.',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'definition',
      title: 'natural rights',
      content:
        'Enlightenment idea, associated with John Locke, that all people possess inherent rights — life, liberty, property — that government exists to protect, not to grant. Colonial writers used this idea to argue that a government violating these rights could be legitimately resisted.',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'event',
      title: 'the turning point: 1763',
      content:
        'The French and Indian War (1754–1763) left Britain with a massive war debt and new North American territory to defend. Parliament decided the colonies should help pay for their own defense — ending salutary neglect and asserting direct control for the first time in generations.',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'cause',
      title: 'the new-tax sequence',
      content:
        'Parliament\'s post-1763 measures differed in kind: the Sugar Act (1764) and Townshend Acts (1767) were EXTERNAL duties on imported goods, while the Stamp Act (1765) was a DIRECT INTERNAL tax on printed materials — the type colonists rejected most fiercely. The Tea Act (1773) added NO new tax; it kept the existing Townshend tea duty but gave the East India Company a monopoly on direct sales, undercutting colonial merchants and triggering the Boston Tea Party. The common objection: Parliament taxing colonists for revenue without their consent — a break from the self-taxation they had run through their own assemblies.',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'event',
      title: 'the Coercive (Intolerable) Acts, 1774',
      content:
        "Britain's punitive response to the Boston Tea Party: closing Boston's port and curbing Massachusetts self-government. Each round of colonial protest (boycotts, the Tea Party) was met with harsher enforcement, which pushed moderate colonists toward the radical position and built inter-colonial cooperation — the Committees of Correspondence and the First Continental Congress.",
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'framework',
      title: 'how the causes combine',
      content:
        'Material grievance (taxes imposed without consent) + constitutional argument (Parliament lacks authority over colonists without representation) + philosophical justification (natural rights and consent of the governed) together turned scattered protests into a unified, principled case for independence. No single strand alone explains the Revolution.',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'event',
      title: "Common Sense (Thomas Paine, January 1776)",
      content:
        'Published after nine months of fighting (Lexington and Concord, April 1775) but before the Declaration, Paine\'s pamphlet reframed the conflict: America as the last refuge for liberty itself, and George III as "the tyrant" rather than just a source of bad policy. By calling the monarchy itself illegitimate, Paine pushed public opinion from grievance-airing toward a demand for full independence.',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'trap',
      title: 'the Revolution was not inevitable',
      content:
        'Avoid presentism — reading the outcome (independence) backward as though it were destined. For most of the colonial period colonists were proudly loyal British subjects. The Revolution resulted from a specific, escalating chain of events after 1763; moderate compromise remained possible into 1775 (the Olive Branch Petition, July 1775, still appealed to the king for reconciliation after fighting had begun).',
    },
    {
      loId: 'apush.causes-of-revolution',
      kind: 'framework',
      title: 'grievance vs. constitutional argument',
      content:
        'Distinguish two layers of colonial objection that are easy to blur: the SPECIFIC grievance (this particular tax, this particular act) and the GENERAL constitutional argument (Parliament has no authority to tax or legislate for colonists who lack representation in it). AP questions often test whether you can name the general argument, not just list acts.',
    },
  ],
  methods: [
    {
      title: "Source and analyze a Revolutionary-era document (HIPP)",
      when_to_use:
        'Use this as the first move on any unfamiliar primary-source excerpt from the imperial-crisis period, before making any claim about what the text argues or why it matters.',
      steps: [
        'H — HISTORICAL CONTEXT: what was happening at the moment this was written? What events immediately preceded it?',
        'I — INTENDED AUDIENCE: who is the writer addressing, and what does the writer want that audience to believe or do?',
        'P — PURPOSE: state the purpose as a verb (what the writer wants the text to DO), not a topic (what the text is about).',
        'P — POINT OF VIEW: what about the writer\'s identity, position, or experience shapes the argument or its credibility?',
        'CONNECT TO A CAUSE: tie the claim back to one of the three causal strands — material grievance (taxation), constitutional argument (no representation), or philosophical justification (natural rights).',
      ],
      example: {
        problem:
          "Reconstruct the argument of Thomas Paine's Common Sense (1776): \"O ye that love mankind! ... Freedom hath been hunted round the globe... O! receive the fugitive, and prepare in time an asylum for mankind.\"",
        solution:
          'Historical context: written January 1776, after fighting had begun but before the Declaration, to convince colonists still hoping for reconciliation. Purpose: not to inform but to indict — to convert a tax dispute into a moral cause. Point of view: Paine treats liberty as a universal human inheritance, not a privilege Britain grants — the Enlightenment natural-rights move. This shows a CAUSE (Enlightenment thinking) being deployed as PERSUASION at a specific moment to widen support for independence beyond the political elite.',
      },
      relatedLoIds: ['apush.causes-of-revolution'],
    },
  ],
  pointers: [
    { content: 'The AP exam rewards distinguishing "colonists were annoyed" from the actual constitutional argument: Parliament had no authority to tax without colonial representation.', kind: 'tip' },
    { content: 'The #1 trap: treating the Revolution as inevitable. Trace the specific 1763→1776 chain of decisions instead of assuming destiny.', kind: 'trap' },
    { content: 'Salutary neglect ended in 1763, not gradually across the whole colonial period — know the specific trigger (French and Indian War debt).', kind: 'tip' },
    { content: 'Enlightenment ideas did not cause the Revolution alone — they supplied the JUSTIFICATION for resistance that material grievances had already provoked.', kind: 'tip' },
    { content: '"No taxation without representation" is about legitimate authority, not tax rates — never describe it as colonists thinking taxes were "too high."', kind: 'trap' },
    { content: 'Each act of British enforcement (Coercive Acts) radicalized moderates rather than restoring order — a cause-and-effect escalation pattern worth naming explicitly on the SAQ/DBQ.', kind: 'tip' },
  ],
};
