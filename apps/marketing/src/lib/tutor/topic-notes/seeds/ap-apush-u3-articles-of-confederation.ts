/**
 * AP US History — Unit 3 CED 3.9: The Articles of Confederation.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.articles-of-confederation.v1`. Covers the Articles'
 * deliberately weak structure, its specific powers and critical
 * weaknesses, Shays' Rebellion, and the Northwest Ordinance as a genuine
 * Confederation-era success.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_ARTICLES_OF_CONFEDERATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.articles-of-confederation.v1',
  course: 'AP United States History',
  cedUnit: 3,
  cedTopic: '3.9',
  cedTitle: 'The Articles of Confederation',
  planId: 'evelyn.ap.apush.articles-of-confederation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.articles-of-confederation.v1' }],
  theory: [
    {
      loId: 'apush.articles-of-confederation',
      kind: 'definition',
      title: 'Articles of Confederation',
      content:
        'The first constitution of the United States — drafted 1777, ratified by all 13 states in 1781 (delayed for years by disputes over western land claims). Created a national government that was really a "league of friendship" among sovereign states: a unicameral Congress with one vote per state, and NO separate executive branch or national judiciary. A deliberate reaction to fear of concentrated power, fresh off a revolution against a king.',
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'definition',
      title: 'requisition',
      content:
        'The system by which the Confederation Congress could only REQUEST funds from state governments rather than collect taxes directly. States frequently refused or paid late, leaving the national government chronically underfunded.',
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'framework',
      title: 'what Congress could and could not do',
      content:
        'COULD: declare war and make peace, negotiate treaties with foreign nations, coin money, manage western territories and relations with Native nations. COULD NOT: levy or collect taxes directly (only request via requisition), regulate interstate or foreign commerce (so states set their own competing tariffs), raise a standing national army (relying on state militias it could not compel), or amend the Articles without UNANIMOUS consent of all 13 states.',
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'event',
      title: "Shays' Rebellion (1786–87)",
      content:
        'In western Massachusetts, debt-burdened farmers — many Revolutionary War veterans — faced high state taxes and court foreclosures on their land. Led by Daniel Shays, armed farmers shut down local courts and marched on a federal arsenal. The Confederation Congress had no national army to respond; Massachusetts had to raise its own privately funded militia. Exposed that the national government could not guarantee order even within a single state.',
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'definition',
      title: 'Northwest Ordinance (1787)',
      content:
        "An act of the Confederation Congress establishing an orderly process for organizing and admitting new states from the Northwest Territory (later Ohio, Indiana, Illinois, Michigan, Wisconsin) on EQUAL footing with the original 13 states, not as permanent colonies. Banned slavery north of the Ohio River and provided for public education in the new territories — a genuine, lasting Confederation-era success.",
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'definition',
      title: 'unicameral',
      content:
        'Having a single legislative chamber — the structure of the Confederation Congress, in contrast to the later bicameral Congress (House + Senate) created by the Constitution.',
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'framework',
      title: 'the Preamble read as a diagnostic of Articles failures',
      content:
        'Each purpose in the Constitution\'s 1787 Preamble answers a specific Articles weakness: "more perfect Union" replaces the loose league of independent states; "establish Justice" supplies the missing national judiciary; "insure domestic Tranquility" answers Shays\' Rebellion directly; "provide for the common defence" answers the no-army, no-tax problem; "promote the general Welfare"/"secure the Blessings of Liberty" gesture at the commercial paralysis caused by no interstate-commerce power.',
    },
    {
      loId: 'apush.articles-of-confederation',
      kind: 'cause',
      title: 'the upshot',
      content:
        "The Articles' failures traced directly back to the founding fear of centralized power — the same fear that made the government too weak to tax, defend, or police itself. Shays' Rebellion was the specific crisis that convinced many leaders a stronger national government was necessary, setting up the Constitutional Convention of 1787.",
    },
  ],
  methods: [
    {
      title: 'Read a later document as a response to an earlier failure',
      when_to_use:
        'Use when a worked example or DBQ pairs a document (like the Constitution\'s Preamble) with a prior government\'s specific structural weaknesses, and asks how the new document answers the old failures.',
      steps: [
        'LIST THE SPECIFIC FAILURES of the earlier structure — name the actual missing power or capacity (e.g. no taxing power, no army, no judiciary), not a vague "it was weak."',
        'MATCH EACH NEW PROVISION TO A FAILURE — go clause by clause or purpose by purpose in the new document and ask "which specific old failure does this answer?"',
        'CHECK FOR AN EXACT, RECENT TRIGGER — some provisions respond to a single dramatic event (e.g. "insure domestic Tranquility" ↔ Shays\' Rebellion), not just a general trend.',
        'STATE THE LINK TO THE COURSE THESIS — explain why reading the new document this way reveals design intent, not just historical coincidence.',
      ],
      example: {
        problem:
          'Read the Constitution\'s Preamble ("insure domestic Tranquility," "provide for the common defence"...) as a response to the Articles of Confederation.',
        solution:
          '"Insure domestic Tranquility" answers Shays\' Rebellion almost pointedly — the Confederation had no army to respond when armed farmers shut down Massachusetts courts in 1786-87. "Provide for the common defence" answers the no-tax, no-army problem: without direct taxing power, the Confederation Congress could not reliably fund or raise a military. Read this way, the Preamble functions almost as a checklist of the government it is replacing.',
      },
      relatedLoIds: ['apush.articles-of-confederation'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: treating the Articles as a total failure with zero accomplishments. The Northwest Ordinance (1787) was a genuine, lasting success.', kind: 'trap' },
    { content: 'Know the specific missing powers — no direct taxation, no commerce regulation, no standing army, unanimous-consent amendment — not just "the government was weak."', kind: 'tip' },
    { content: 'Shays\' Rebellion is the pivotal evidence linking Articles weakness to the Constitutional Convention — always cite it by name with its date (1786-87).', kind: 'tip' },
    { content: 'Requisition ≠ taxation. Congress could only REQUEST money from states; it could not compel payment.', kind: 'trap' },
    { content: 'The Northwest Ordinance banned slavery north of the Ohio River — a specific, testable provision, not a general "anti-slavery" gesture.', kind: 'tip' },
  ],
};
